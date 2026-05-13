import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const games = await prisma.game.findMany({
      orderBy: {
        gameDate: "desc",
      },
      include: {
        players: true,
        missions: true,
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
    const body = await request.json();

    const {
      gameId,
      playerCount,
      winnerSide,
      assassinTargetSeatNo,
      gameDate,
    } = body;

    if (!gameId) {
      return NextResponse.json(
        { error: "gameId is required" },
        { status: 400 }
      );
    }

    const game = await prisma.game.create({
      data: {
        gameId,
        playerCount: playerCount ? Number(playerCount) : null,
        winnerSide: winnerSide || null,
        assassinTargetSeatNo: assassinTargetSeatNo
          ? Number(assassinTargetSeatNo)
          : null,
        gameDate: gameDate ? new Date(gameDate) : null,
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