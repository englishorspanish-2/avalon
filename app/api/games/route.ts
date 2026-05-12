import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type PlayerInput = {
  seatNumber: number;
  role?: string | null;
};

type CreateGameInput = {
  gameId: string;
  winnerSide?: string | null;
  assassinTargetSeatNo?: number | null;
  gameDate?: string | null;
  players: PlayerInput[];
};

export async function GET() {
  try {
    const games = await prisma.game.findMany({
      orderBy: {
        gameId: "desc",
      },
      include: {
        players: true,
        missions: {
          include: {
            proposals: {
              include: {
                proposalContains: true,
                voteProposals: true,
                becomesMission: true,
              },
            },
            becomesMission: true,
          },
        },
      },
    });

    return NextResponse.json(games);
  } catch (error) {
    console.error("GET /api/games error:", error);

    return NextResponse.json(
      { error: "Failed to fetch games" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body: CreateGameInput = await request.json();

    if (!body.gameId) {
      return NextResponse.json(
        { error: "gameId is required" },
        { status: 400 }
      );
    }

    if (!body.players || !Array.isArray(body.players)) {
      return NextResponse.json(
        { error: "players must be an array" },
        { status: 400 }
      );
    }

    const game = await prisma.game.create({
      data: {
        gameId: body.gameId,
        playerCount: body.players.length,
        winnerSide: body.winnerSide ?? null,
        assassinTargetSeatNo: body.assassinTargetSeatNo ?? null,
        gameDate: body.gameDate ? new Date(body.gameDate) : null,

        players: {
          create: body.players.map((p) => ({
            seatNumber: p.seatNumber,
            role: p.role ?? null,
          })),
        },
      },
      include: {
        players: true,
      },
    });

    return NextResponse.json(game, { status: 201 });
  } catch (error) {
    console.error("POST /api/games error:", error);

    return NextResponse.json(
      { error: "Failed to create game" },
      { status: 500 }
    );
  }
}