import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  context: { params: { gameId: string } }
) {
  try {
    const { gameId } = context.params;
    const body = await request.json();
    const { action } = body;

    if (!action) {
      return NextResponse.json(
        { error: "action is required" },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      switch (action) {
        case "CREATE_MISSION": {
          const mission = await tx.mission.create({
            data: {
              gameId,
              missionNo: Number(body.missionNo),
              teamSize: body.teamSize ? Number(body.teamSize) : null,
              failCount: 0,
            },
          });

          return mission;
        }

        case "CREATE_PROPOSAL": {
          const proposal = await tx.proposal.create({
            data: {
              gameId,
              missionNo: Number(body.missionNo),
              proposalNo: Number(body.proposalNo),
              leaderSeatNo: body.leaderSeatNo
                ? Number(body.leaderSeatNo)
                : null,
            },
          });

          return proposal;
        }

        case "SET_TEAM_MEMBER": {
          const record = await tx.proposalContains.upsert({
            where: {
              gameId_missionNo_proposalNo_seatNumber: {
                gameId,
                missionNo: Number(body.missionNo),
                proposalNo: Number(body.proposalNo),
                seatNumber: Number(body.seatNumber),
              },
            },
            update: {
              containsOrNot: Boolean(body.containsOrNot),
            },
            create: {
              gameId,
              missionNo: Number(body.missionNo),
              proposalNo: Number(body.proposalNo),
              seatNumber: Number(body.seatNumber),
              containsOrNot: Boolean(body.containsOrNot),
            },
          });

          return record;
        }

        case "CAST_PROPOSAL_VOTE": {
          const vote = await tx.voteProposal.upsert({
            where: {
              gameId_seatNumber_missionNo_proposalNo: {
                gameId,
                seatNumber: Number(body.seatNumber),
                missionNo: Number(body.missionNo),
                proposalNo: Number(body.proposalNo),
              },
            },
            update: {
              voteYN: body.voteYN,
            },
            create: {
              gameId,
              seatNumber: Number(body.seatNumber),
              missionNo: Number(body.missionNo),
              proposalNo: Number(body.proposalNo),
              voteYN: body.voteYN,
            },
          });

          return vote;
        }

        case "UPDATE_PROPOSAL_RESULT": {
          const proposal = await tx.proposal.update({
            where: {
              gameId_missionNo_proposalNo: {
                gameId,
                missionNo: Number(body.missionNo),
                proposalNo: Number(body.proposalNo),
              },
            },
            data: {
              voteResult: body.voteResult,
              yesAmount:
                body.yesAmount !== undefined && body.yesAmount !== ""
                  ? Number(body.yesAmount)
                  : null,
              noAmount:
                body.noAmount !== undefined && body.noAmount !== ""
                  ? Number(body.noAmount)
                  : null,
            },
          });

          if (body.voteResult === "Rejected") {
            await tx.mission.update({
              where: {
                gameId_missionNo: {
                  gameId,
                  missionNo: Number(body.missionNo),
                },
              },
              data: {
                failCount: {
                  increment: 1,
                },
              },
            });
          }

          return proposal;
        }

        case "BECOME_MISSION": {
          const becomesMission = await tx.becomesMission.upsert({
            where: {
              gameId_missionNo_proposalNo: {
                gameId,
                missionNo: Number(body.missionNo),
                proposalNo: Number(body.proposalNo),
              },
            },
            update: {
              succeedAmount:
                body.succeedAmount !== undefined &&
                body.succeedAmount !== ""
                  ? Number(body.succeedAmount)
                  : null,
              failAmount:
                body.failAmount !== undefined && body.failAmount !== ""
                  ? Number(body.failAmount)
                  : null,
              fiveFails: Boolean(body.fiveFails),
            },
            create: {
              gameId,
              missionNo: Number(body.missionNo),
              proposalNo: Number(body.proposalNo),
              succeedAmount:
                body.succeedAmount !== undefined &&
                body.succeedAmount !== ""
                  ? Number(body.succeedAmount)
                  : null,
              failAmount:
                body.failAmount !== undefined && body.failAmount !== ""
                  ? Number(body.failAmount)
                  : null,
              fiveFails: Boolean(body.fiveFails),
            },
          });

          return becomesMission;
        }

        case "UPDATE_MISSION_RESULT": {
          const mission = await tx.mission.update({
            where: {
              gameId_missionNo: {
                gameId,
                missionNo: Number(body.missionNo),
              },
            },
            data: {
              missionResult: body.missionResult,
            },
          });

          return mission;
        }

        case "UPDATE_PLAYER_ROLE": {
          const player = await tx.player.update({
            where: {
              gameId_seatNumber: {
                gameId,
                seatNumber: Number(body.seatNumber),
              },
            },
            data: {
              role: body.role || null,
            },
          });

          return player;
        }

        case "END_GAME": {
          const game = await tx.game.update({
            where: {
              gameId,
            },
            data: {
              winnerSide: body.winnerSide,
              assassinTargetSeatNo:
                body.assassinTargetSeatNo !== undefined &&
                body.assassinTargetSeatNo !== ""
                  ? Number(body.assassinTargetSeatNo)
                  : null,
            },
          });

          return game;
        }

        default:
          throw new Error(`Unknown action: ${action}`);
      }
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("POST /api/games/[gameId]/actions error:", error);

    return NextResponse.json(
      { error: "Failed to execute action" },
      { status: 500 }
    );
  }
}