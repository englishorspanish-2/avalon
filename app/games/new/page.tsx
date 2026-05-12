"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const roles = [
  "MERLIN",
  "PERCIVAL",
  "LOYAL_SERVANT",
  "ASSASSIN",
  "MORGANA",
  "MORDRED",
  "OBERON",
  "MINION",
];

export default function NewGamePage() {
  const router = useRouter();

  const [gameId, setGameId] = useState("001");
  const [winnerSide, setWinnerSide] = useState("GOOD");
  const [assassinTargetSeatNo, setAssassinTargetSeatNo] = useState("");
  const [gameDate, setGameDate] = useState("");
  const [error, setError] = useState("");

  const [players, setPlayers] = useState(
    Array.from({ length: 8 }, (_, i) => ({
      seatNumber: i + 1,
      role: roles[i],
    }))
  );

  async function createGame() {
    setError("");

    const res = await fetch("/api/games", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        gameId,
        winnerSide,
        assassinTargetSeatNo: assassinTargetSeatNo
          ? Number(assassinTargetSeatNo)
          : null,
        gameDate: gameDate || null,
        players,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "建立遊戲失敗");
      return;
    }

    router.push(`/games/${data.gameId}`);
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">建立新遊戲</h1>

        {error && (
          <p className="mb-4 rounded-lg bg-red-900 p-3 text-red-100">
            {error}
          </p>
        )}

        <div className="mb-4">
          <label className="block mb-2">Game ID</label>
          <input
            className="w-full rounded-xl p-3 text-white bg-slate-800 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={gameId}
            onChange={(e) => setGameId(e.target.value)}
            placeholder="001"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">勝利方</label>
          <select
            className="w-full rounded-xl p-3 text-white bg-slate-800 border border-slate-600"
            value={winnerSide}
            onChange={(e) => setWinnerSide(e.target.value)}
          >
            <option value="GOOD">GOOD</option>
            <option value="EVIL">EVIL</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-2">刺客目標座位</label>
          <input
            type="number"
            className="w-full rounded-xl p-3 text-white bg-slate-800 border border-slate-600"
            value={assassinTargetSeatNo}
            onChange={(e) => setAssassinTargetSeatNo(e.target.value)}
            placeholder="例如 1"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2">遊戲日期</label>
          <input
            type="date"
            className="w-full rounded-xl p-3 text-white bg-slate-800 border border-slate-600"
            value={gameDate}
            onChange={(e) => setGameDate(e.target.value)}
          />
        </div>

        <h2 className="text-xl font-semibold mb-3">玩家角色</h2>

        <div className="grid gap-4">
          {players.map((player, index) => (
            <div
              key={player.seatNumber}
              className="grid grid-cols-2 gap-3 bg-slate-900 p-4 rounded-xl"
            >
              <div className="rounded-lg p-2 bg-slate-800">
                座位 {player.seatNumber}
              </div>

              <select
                className="rounded-lg p-2 text-white bg-slate-800 border border-slate-600"
                value={player.role}
                onChange={(e) => {
                  const copy = [...players];
                  copy[index] = {
                    ...copy[index],
                    role: e.target.value,
                  };
                  setPlayers(copy);
                }}
              >
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <button
        onClick={createGame}
        className="
          mt-6 rounded-xl bg-white text-slate-950 px-5 py-3 font-semibold
          shadow-lg
          transition-all duration-150
          hover:bg-slate-200
          active:translate-y-1
          active:scale-95
          active:shadow-sm
        "
      >
        建立遊戲
      </button>
      </div>
    </main>
  );
}