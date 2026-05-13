import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  context: { params: { gameId: string } }
) {
  try {
    const { gameId } = context.params;

    const game = await prisma.game.findUnique({
      where: {
        gameId,
      },
      include: {
        players: {
          orderBy: {
            seatNumber: "asc",
          },
        },
        missions: {
          orderBy: {
            missionNo: "asc",
          },
          include: {
            proposals: {
              orderBy: {
                proposalNo: "asc",
              },
              include: {
                proposalContains: {
                  orderBy: {
                    seatNumber: "asc",
                  },
                },
                voteProposals: {
                  orderBy: {
                    seatNumber: "asc",
                  },
                },
                becomesMission: true,
              },
            },
            becomesMission: true,
          },
        },
      },
    });

    if (!game) {
      return NextResponse.json(
        { error: "Game not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(game);
  } catch (error) {
    console.error("GET /api/games/[gameId] error:", error);

    return NextResponse.json(
      { error: "Failed to fetch game detail" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  context: { params: { gameId: string } }
) {
  try {
    const { gameId } = context.params;
    const body = await request.json();

    const game = await prisma.game.update({
      where: {
        gameId,
      },
      data: {
        winnerSide: body.winnerSide ?? undefined,
        assassinTargetSeatNo:
          body.assassinTargetSeatNo !== undefined &&
          body.assassinTargetSeatNo !== ""
            ? Number(body.assassinTargetSeatNo)
            : undefined,
      },
    });

    return NextResponse.json(game);
  } catch (error) {
    console.error("PATCH /api/games/[gameId] error:", error);

    return NextResponse.json(
      { error: "Failed to update game" },
      { status: 500 }
    );
  }
}