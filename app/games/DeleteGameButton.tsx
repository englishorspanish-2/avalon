"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type DeleteGameButtonProps = {
  gameId: string;
};

export default function DeleteGameButton({ gameId }: DeleteGameButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      `確定要刪除遊戲 ${gameId} 嗎？這會刪除該場遊戲的玩家、任務、提案與投票紀錄。`
    );

    if (!confirmed) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/games/${gameId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "刪除失敗");
      }

      router.refresh();
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("刪除時發生未知錯誤");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      className="button button-danger"
      onClick={handleDelete}
      disabled={loading}
    >
      {loading ? "刪除中..." : "刪除"}
    </button>
  );
}