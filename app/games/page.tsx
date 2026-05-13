import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DeleteGameButton from "./DeleteGameButton";

export default async function GamesPage() {
  const games = await prisma.game.findMany({
    orderBy: {
      gameDate: "desc",
    },
    include: {
      players: true,
      missions: true,
    },
  });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <h1 className="page-title">遊戲列表</h1>
          <p className="page-subtitle">
            查看所有已紀錄的 Avalon 遊戲資料。
          </p>
        </div>

        <div>
          <Link href="/games/new" className="button button-primary">
            新增遊戲
          </Link>
        </div>
      </div>

      {games.length === 0 ? (
        <p className="empty-text">目前還沒有任何遊戲。</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Game ID</th>
              <th>玩家數</th>
              <th>勝利陣營</th>
              <th>刺客目標座位</th>
              <th>任務數</th>
              <th>日期</th>
              <th>操作</th>
            </tr>
          </thead>

          <tbody>
            {games.map((game) => (
              <tr key={game.gameId}>
                <td>
                  <Link href={`/games/${game.gameId}`}>
                    {game.gameId}
                  </Link>
                </td>

                <td>{game.playerCount ?? "-"}</td>
                <td>{game.winnerSide ?? "-"}</td>
                <td>{game.assassinTargetSeatNo ?? "-"}</td>
                <td>{game.missions.length}</td>

                <td>
                  {game.gameDate
                    ? game.gameDate.toISOString().slice(0, 10)
                    : "-"}
                </td>

                <td>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <Link
                      href={`/games/${game.gameId}`}
                      className="button button-secondary"
                    >
                      進入紀錄
                    </Link>

                    <DeleteGameButton gameId={game.gameId} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}