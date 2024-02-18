import connectMongoDB from "@/libs/mongodb";
import User from "../../../../models/User";
import Game from "../../../../models/Game"; // Import the Game model
import { NextResponse } from "next/server";

export async function GET(req) {
  const t = req.nextUrl.searchParams.get('t');

  try {
    await connectMongoDB();

    const pipeline = [
      {
        $match: {
          // Filter players who have a rank for game type 't'
          [`rank.${t}`]: { $exists: true }
        }
      },
      {
        $lookup: {
          // Join with the 'games' collection to get player's game data
          from: 'games',
          localField: 'username',
          foreignField: 'players.username',
          as: 'games'
        }
      },
      {
        $project: {
          firstName: 1,
          username: 1,
          rank: 1,
          totalGames: { $size: "$games" }, // Count total games played
          winCount: {
            $size: {
              $filter: {
                input: "$games",
                as: "game",
                cond: { $eq: ["$$game.winner", "$username"] } // Count wins
              }
            }
          },
          avgScorePerInning: {
            $avg: {
              $map: {
                input: "$games",
                as: "game",
                in: { $avg: "$$game.players.innings.darts" } // Calculate average score per inning
              }
            }
          }
        }
      },
      {
        $sort: { winCount: -1 } // Sort players by win count
      },
      {
        $sort: { [`rank.${t}`]: -1 } // Sort players by rank['301'] from highest to lowest
      }
    ];

    const players = await User.aggregate(pipeline);

    return NextResponse.json({ players }, { status: 201 });
  } catch (error) {
    console.error('Error occurred:', error);
    return NextResponse.error("Internal Server Error", { status: 500 });
  }
}
