import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import GameRecorder from "./GameRecorder";

export default async function GameDetailPage({
  params,
}: {
  params: Promise <{ gameId: string }>;
}) {
  const game = await prisma.game.findUnique({
    where: {
      gameId: (await params).gameId,
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
    notFound();
  }

  const safeGame = JSON.parse(JSON.stringify(game));

  return <GameRecorder game={safeGame} />;
}