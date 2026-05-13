"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type GameRecorderProps = {
  game: any;
};

export default function GameRecorder({ game }: GameRecorderProps) {
  const router = useRouter();

  const [missionNo, setMissionNo] = useState("");
  const [teamSize, setTeamSize] = useState("");

  const [proposalMissionNo, setProposalMissionNo] = useState("");
  const [proposalNo, setProposalNo] = useState("");
  const [leaderSeatNo, setLeaderSeatNo] = useState("");

  const [selectedMissionNo, setSelectedMissionNo] = useState("");
  const [selectedProposalNo, setSelectedProposalNo] = useState("");

  const [voteResult, setVoteResult] = useState("");
  const [yesAmount, setYesAmount] = useState("");
  const [noAmount, setNoAmount] = useState("");

  const [succeedAmount, setSucceedAmount] = useState("");
  const [failAmount, setFailAmount] = useState("");
  const [missionResult, setMissionResult] = useState("");

  const [assassinTargetSeatNo, setAssassinTargetSeatNo] = useState("");
  const [winnerSide, setWinnerSide] = useState("");

  async function runAction(payload: any) {
    const response = await fetch(`/api/games/${game.gameId}/actions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      alert("操作失敗");
      return;
    }

    router.refresh();
  }

  async function createMission(e: React.FormEvent) {
    e.preventDefault();

    await runAction({
      action: "CREATE_MISSION",
      missionNo,
      teamSize,
    });

    setMissionNo("");
    setTeamSize("");
  }

  async function createProposal(e: React.FormEvent) {
    e.preventDefault();

    await runAction({
      action: "CREATE_PROPOSAL",
      missionNo: proposalMissionNo,
      proposalNo,
      leaderSeatNo,
    });

    setProposalMissionNo("");
    setProposalNo("");
    setLeaderSeatNo("");
  }

  async function setTeamMember(
    missionNo: number,
    proposalNo: number,
    seatNumber: number,
    containsOrNot: boolean
  ) {
    await runAction({
      action: "SET_TEAM_MEMBER",
      missionNo,
      proposalNo,
      seatNumber,
      containsOrNot,
    });
  }

  async function castVote(
    missionNo: number,
    proposalNo: number,
    seatNumber: number,
    voteYN: boolean
  ) {
    await runAction({
      action: "CAST_PROPOSAL_VOTE",
      missionNo,
      proposalNo,
      seatNumber,
      voteYN,
    });
  }

  async function updateProposalResult(e: React.FormEvent) {
    e.preventDefault();

    await runAction({
      action: "UPDATE_PROPOSAL_RESULT",
      missionNo: selectedMissionNo,
      proposalNo: selectedProposalNo,
      voteResult,
      yesAmount,
      noAmount,
    });

    setVoteResult("");
    setYesAmount("");
    setNoAmount("");
  }

  async function becomeMission(e: React.FormEvent) {
    e.preventDefault();

    await runAction({
      action: "BECOME_MISSION",
      missionNo: selectedMissionNo,
      proposalNo: selectedProposalNo,
      succeedAmount,
      failAmount,
      fiveFails: false,
    });

    setSucceedAmount("");
    setFailAmount("");
  }

  async function updateMissionResult(e: React.FormEvent) {
    e.preventDefault();

    await runAction({
      action: "UPDATE_MISSION_RESULT",
      missionNo: selectedMissionNo,
      missionResult,
    });

    setMissionResult("");
  }

  async function updatePlayerRole(seatNumber: number, role: string) {
    await runAction({
      action: "UPDATE_PLAYER_ROLE",
      seatNumber,
      role,
    });
  }

  async function endGame(e: React.FormEvent) {
    e.preventDefault();

    await runAction({
      action: "END_GAME",
      winnerSide,
      assassinTargetSeatNo,
    });
  }
  async function deleteGame() {
    const confirmed = window.confirm(
      `確定要刪除遊戲 ${game.gameId} 嗎？這會刪除所有相關紀錄。`
    );

    if (!confirmed) {
      return;
    }

    const response = await fetch(`/api/games/${game.gameId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      alert("刪除失敗");
      return;
    }

    router.push("/games");
    router.refresh();
  }

  return (
    <div>
      <h1 className="page-title">遊戲紀錄：{game.gameId}</h1>

      <div className="button-row">
        <button
          type="button"
          className="button button-danger"
          onClick={deleteGame}
        >
          刪除整場遊戲
        </button>
      </div>
      <p className="page-subtitle">
        這個頁面用來在 Avalon 遊戲進行中即時紀錄任務、提案、投票與勝負。
      </p>

      <section className="card" style={{ marginBottom: "32px" }}>
        <h2>遊戲基本資訊</h2>
        <p>玩家數：{game.playerCount ?? "-"}</p>
        <p>勝利陣營：{game.winnerSide ?? "尚未結束"}</p>
        <p>刺客目標座位：{game.assassinTargetSeatNo ?? "-"}</p>
        <p>
          遊戲日期：
          {game.gameDate ? game.gameDate.slice(0, 10) : "-"}
        </p>
      </section>

      <section className="card" style={{ marginBottom: "32px" }}>
        <h2>玩家與角色</h2>

        <table className="table">
          <thead>
            <tr>
              <th>座位</th>
              <th>角色</th>
              <th>公開角色牌</th>
            </tr>
          </thead>

          <tbody>
            {game.players.map((player: any) => (
              <tr key={player.seatNumber}>
                <td>Seat {player.seatNumber}</td>
                <td>{player.role ?? "未公開"}</td>
                <td>
                  <select
                    defaultValue={player.role ?? ""}
                    onChange={(e) =>
                      updatePlayerRole(player.seatNumber, e.target.value)
                    }
                  >
                    <option value="">未公開</option>
                    <option value="Merlin">Merlin</option>
                    <option value="Percival">Percival</option>
                    <option value="Loyal Servant">Loyal Servant</option>
                    <option value="Assassin">Assassin</option>
                    <option value="Morgana">Morgana</option>
                    <option value="Mordred">Mordred</option>
                    <option value="Oberon">Oberon</option>
                    <option value="Minion of Mordred">Minion of Mordred</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="card" style={{ marginBottom: "32px" }}>
        <h2>新增 Mission</h2>

        <form onSubmit={createMission}>
          <div className="form-group">
            <label>Mission No</label>
            <input
              type="number"
              value={missionNo}
              onChange={(e) => setMissionNo(e.target.value)}
              placeholder="例如 1"
              required
            />
          </div>

          <div className="form-group">
            <label>Team Size</label>
            <input
              type="number"
              value={teamSize}
              onChange={(e) => setTeamSize(e.target.value)}
              placeholder="例如 2"
            />
          </div>

          <button className="button button-primary">新增 Mission</button>
        </form>
      </section>

      <section className="card" style={{ marginBottom: "32px" }}>
        <h2>新增 Proposal</h2>

        <form onSubmit={createProposal}>
          <div className="form-group">
            <label>Mission No</label>
            <input
              type="number"
              value={proposalMissionNo}
              onChange={(e) => setProposalMissionNo(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Proposal No</label>
            <input
              type="number"
              value={proposalNo}
              onChange={(e) => setProposalNo(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Leader Seat No</label>
            <input
              type="number"
              value={leaderSeatNo}
              onChange={(e) => setLeaderSeatNo(e.target.value)}
            />
          </div>

          <button className="button button-primary">新增 Proposal</button>
        </form>
      </section>

      <section className="card" style={{ marginBottom: "32px" }}>
        <h2>選擇目前操作的 Proposal</h2>

        <div className="form-group">
          <label>Mission No</label>
          <input
            type="number"
            value={selectedMissionNo}
            onChange={(e) => setSelectedMissionNo(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Proposal No</label>
          <input
            type="number"
            value={selectedProposalNo}
            onChange={(e) => setSelectedProposalNo(e.target.value)}
          />
        </div>
      </section>

      <section className="card" style={{ marginBottom: "32px" }}>
        <h2>Mission / Proposal 紀錄</h2>

        {game.missions.length === 0 ? (
          <p className="empty-text">目前尚未建立 Mission。</p>
        ) : (
          game.missions.map((mission: any) => (
            <div
              key={mission.missionNo}
              style={{
                border: "1px solid #334155",
                borderRadius: "12px",
                padding: "20px",
                marginBottom: "20px",
              }}
            >
              <h3>Mission {mission.missionNo}</h3>
              <p>Team Size：{mission.teamSize ?? "-"}</p>
              <p>Fail Count：{mission.failCount}</p>
              <p>Mission Result：{mission.missionResult ?? "-"}</p>

              {mission.proposals.map((proposal: any) => (
                <div
                  key={proposal.proposalNo}
                  style={{
                    background: "#020617",
                    padding: "16px",
                    borderRadius: "10px",
                    marginTop: "16px",
                  }}
                >
                  <h4>
                    Proposal {proposal.proposalNo} / Leader Seat{" "}
                    {proposal.leaderSeatNo ?? "-"}
                  </h4>

                  <p>Vote Result：{proposal.voteResult ?? "-"}</p>
                  <p>
                    Yes：{proposal.yesAmount ?? "-"} / No：
                    {proposal.noAmount ?? "-"}
                  </p>

                  <h5>隊伍成員</h5>
                  <div className="button-row" style={{ flexWrap: "wrap" }}>
                    {game.players.map((player: any) => {
                      const contains = proposal.proposalContains.find(
                        (item: any) => item.seatNumber === player.seatNumber
                      );

                      const checked = contains?.containsOrNot ?? false;

                      return (
                        <button
                          key={player.seatNumber}
                          className={
                            checked
                              ? "button button-primary"
                              : "button button-secondary"
                          }
                          onClick={() =>
                            setTeamMember(
                              mission.missionNo,
                              proposal.proposalNo,
                              player.seatNumber,
                              !checked
                            )
                          }
                        >
                          Seat {player.seatNumber}
                        </button>
                      );
                    })}
                  </div>

                  <h5 style={{ marginTop: "20px" }}>提案表決</h5>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>座位</th>
                        <th>目前投票</th>
                        <th>操作</th>
                      </tr>
                    </thead>

                    <tbody>
                      {game.players.map((player: any) => {
                        const vote = proposal.voteProposals.find(
                          (item: any) => item.seatNumber === player.seatNumber
                        );

                        return (
                          <tr key={player.seatNumber}>
                            <td>Seat {player.seatNumber}</td>
                            <td>
                              {vote?.voteYN === true
                                ? "Yes"
                                : vote?.voteYN === false
                                ? "No"
                                : "-"}
                            </td>
                            <td>
                              <button
                                className="button button-primary"
                                onClick={() =>
                                  castVote(
                                    mission.missionNo,
                                    proposal.proposalNo,
                                    player.seatNumber,
                                    true
                                  )
                                }
                              >
                                Yes
                              </button>{" "}
                              <button
                                className="button button-secondary"
                                onClick={() =>
                                  castVote(
                                    mission.missionNo,
                                    proposal.proposalNo,
                                    player.seatNumber,
                                    false
                                  )
                                }
                              >
                                No
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  {proposal.becomesMission && (
                    <div style={{ marginTop: "16px" }}>
                      <h5>已成為任務</h5>
                      <p>
                        Success：{proposal.becomesMission.succeedAmount ?? "-"} /
                        Fail：{proposal.becomesMission.failAmount ?? "-"}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))
        )}
      </section>

      <section className="card" style={{ marginBottom: "32px" }}>
        <h2>更新 Proposal 表決結果</h2>

        <form onSubmit={updateProposalResult}>
          <div className="form-group">
            <label>Vote Result</label>
            <select
              value={voteResult}
              onChange={(e) => setVoteResult(e.target.value)}
              required
            >
              <option value="">請選擇</option>
              <option value="Passed">Passed</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div className="form-group">
            <label>Yes Amount</label>
            <input
              type="number"
              value={yesAmount}
              onChange={(e) => setYesAmount(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>No Amount</label>
            <input
              type="number"
              value={noAmount}
              onChange={(e) => setNoAmount(e.target.value)}
            />
          </div>

          <button className="button button-primary">更新表決結果</button>
        </form>
      </section>

      <section className="card" style={{ marginBottom: "32px" }}>
        <h2>出任務 / 任務結果</h2>

        <form onSubmit={becomeMission}>
          <div className="form-group">
            <label>Success Amount</label>
            <input
              type="number"
              value={succeedAmount}
              onChange={(e) => setSucceedAmount(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Fail Amount</label>
            <input
              type="number"
              value={failAmount}
              onChange={(e) => setFailAmount(e.target.value)}
            />
          </div>

          <button className="button button-primary">
            記錄此 Proposal 成為 Mission
          </button>
        </form>

        <form onSubmit={updateMissionResult} style={{ marginTop: "24px" }}>
          <div className="form-group">
            <label>Mission Result</label>
            <select
              value={missionResult}
              onChange={(e) => setMissionResult(e.target.value)}
            >
              <option value="">請選擇</option>
              <option value="Success">Success</option>
              <option value="Fail">Fail</option>
            </select>
          </div>

          <button className="button button-primary">更新 Mission 結果</button>
        </form>
      </section>

      <section className="card">
        <h2>遊戲結束</h2>

        <form onSubmit={endGame}>
          <div className="form-group">
            <label>刺客目標座位</label>
            <input
              type="number"
              value={assassinTargetSeatNo}
              onChange={(e) => setAssassinTargetSeatNo(e.target.value)}
              placeholder="例如 3"
            />
          </div>

          <div className="form-group">
            <label>勝利陣營</label>
            <select
              value={winnerSide}
              onChange={(e) => setWinnerSide(e.target.value)}
              required
            >
              <option value="">請選擇</option>
              <option value="Good">Good</option>
              <option value="Evil">Evil</option>
            </select>
          </div>

          <button className="button button-primary">結束遊戲</button>
        </form>
      </section>
    </div>
  );
}

