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

    const count = playerCount ? Number(playerCount) : null;

    const newGame = await prisma.game.create({
      data: {
        gameId,
        playerCount: count,
        winnerSide: winnerSide || null,
        assassinTargetSeatNo: assassinTargetSeatNo
          ? Number(assassinTargetSeatNo)
          : null,
        gameDate: gameDate ? new Date(gameDate) : null,
      },
    });

    if (count && count > 0) {
      await prisma.player.createMany({
        data: Array.from({ length: count }, (_, index) => ({
          gameId,
          seatNumber: index + 1,
        })),
        skipDuplicates: true,
      });
    }

    return NextResponse.json(newGame, { status: 201 });
  } catch (error) {
    console.error("POST /api/games error:", error);

    return NextResponse.json(
      { error: "Failed to create game" },
      { status: 500 }
    );
  }
}