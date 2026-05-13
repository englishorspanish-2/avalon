import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const totalGames = await prisma.game.count();

  const recentGames = await prisma.game.findMany({
    take: 3,
    orderBy: {
      gameDate: "desc",
    },
  });

  const goodWins = await prisma.game.count({
    where: {
      winnerSide: "Good",
    },
  });

  const evilWins = await prisma.game.count({
    where: {
      winnerSide: "Evil",
    },
  });

  return (
    <div>
      <h1 className="page-title">Avalon Game Record System</h1>
      <p className="page-subtitle">
        用來記錄阿瓦隆遊戲中的玩家、任務、提案、投票與勝負結果。
      </p>

      <div className="card-grid">
        <div className="card">
          <div className="card-title">總遊戲數</div>
          <div className="card-value">{totalGames}</div>
        </div>

        <div className="card">
          <div className="card-title">好人陣營勝利</div>
          <div className="card-value">{goodWins}</div>
        </div>

        <div className="card">
          <div className="card-title">壞人陣營勝利</div>
          <div className="card-value">{evilWins}</div>
        </div>
      </div>

      <div className="button-row">
        <Link href="/games" className="button button-primary">
          查看遊戲列表
        </Link>

        <Link href="/games/new" className="button button-secondary">
          新增遊戲
        </Link>
      </div>

      <section style={{ marginTop: "48px" }}>
        <h2>最近遊戲</h2>

        {recentGames.length === 0 ? (
          <p className="empty-text">目前尚無遊戲資料。</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Game ID</th>
                <th>玩家數</th>
                <th>勝利陣營</th>
                <th>日期</th>
              </tr>
            </thead>
            <tbody>
              {recentGames.map((game) => (
                <tr key={game.gameId}>
                  <td>{game.gameId}</td>
                  <td>{game.playerCount ?? "-"}</td>
                  <td>{game.winnerSide ?? "-"}</td>
                  <td>
                    {game.gameDate
                      ? game.gameDate.toISOString().slice(0, 10)
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}