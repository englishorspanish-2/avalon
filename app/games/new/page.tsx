"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewGamePage() {
  const router = useRouter();

  const [gameId, setGameId] = useState("");
  const [playerCount, setPlayerCount] = useState("");
  const [winnerSide, setWinnerSide] = useState("");
  const [assassinTargetSeatNo, setAssassinTargetSeatNo] = useState("");
  const [gameDate, setGameDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setErrorMessage("");

    const payload = {
      gameId,
      playerCount,
      winnerSide,
      assassinTargetSeatNo,
      gameDate,
    };

    try {
      const response = await fetch("/api/games", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "新增遊戲失敗");
      }

      router.push("/games");
      router.refresh();
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("發生未知錯誤");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="page-title">新增遊戲</h1>
      <p className="page-subtitle">
        建立一筆新的 Avalon 遊戲紀錄。
      </p>

      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Game ID</label>
          <input
            type="text"
            value={gameId}
            onChange={(e) => setGameId(e.target.value)}
            placeholder="例如 G01"
            maxLength={3}
            required
          />
        </div>

        <div className="form-group">
          <label>玩家數</label>
          <input
            type="number"
            value={playerCount}
            onChange={(e) => setPlayerCount(e.target.value)}
            placeholder="例如 7"
            min="5"
            max="10"
          />
        </div>

        <div className="form-group">
          <label>勝利陣營</label>
          <select
            value={winnerSide}
            onChange={(e) => setWinnerSide(e.target.value)}
          >
            <option value="">尚未決定</option>
            <option value="Good">Good</option>
            <option value="Evil">Evil</option>
          </select>
        </div>

        <div className="form-group">
          <label>刺客目標座位</label>
          <input
            type="number"
            value={assassinTargetSeatNo}
            onChange={(e) => setAssassinTargetSeatNo(e.target.value)}
            placeholder="例如 3"
            min="1"
            max="10"
          />
        </div>

        <div className="form-group">
          <label>遊戲日期</label>
          <input
            type="date"
            value={gameDate}
            onChange={(e) => setGameDate(e.target.value)}
          />
        </div>

        {errorMessage && (
          <p style={{ color: "#f87171", marginBottom: "16px" }}>
            {errorMessage}
          </p>
        )}

        <button
          type="submit"
          className="button button-primary,px-4 py-2 rounded-lg bg-black text-white
                      transition-all duration-150
                      hover:opacity-90
                      active:scale-95
                      active:translate-y-0.5"
          disabled={loading}
        >
          {loading ? "新增中..." : "新增遊戲"}
        </button>
      </form>
    </div>
  );
}