import connectMongoDB from "@/libs/mongodb";
import User from "../../../../models/User";
import Game from "../../../../models/Game"; // Update model name to Game
import { NextResponse } from "next/server";

export async function GET(req) {
  const t = req.nextUrl.searchParams.get('t');

  try {
    await connectMongoDB();

    // Pipeline to calculate total games and wins
    const totalGamesPipeline = [
      {
        $match: {
          [`rank.${t}`]: { $exists: true }
        }
      },
      {
        $lookup: {
          from: 'games',
          localField: 'username',
          foreignField: 'players.username',
          as: 'games'
        }
      },
      {
        $unwind: "$games"
      },
      {
        $group: {
          _id: "$username",
          totalGames: { $sum: 1 },
          wins: {
            $sum: { $cond: [{ $eq: ["$games.winner", "$username"] }, 1, 0] }
          }
        }
      }
    ];

    // Execute the pipeline to calculate total games and wins
    const totalGamesResult = await User.aggregate(totalGamesPipeline);

    // Pipeline to calculate average total darts per player
    const avgTotalDartsPipeline = [
      { $unwind: "$players" },
      { $unwind: "$players.innings" },
      {
        $group: {
          _id: "$players.username",
          avgTotalDarts: { $avg: { $sum: "$players.innings.darts" } }
        }
      }
    ];

    // Execute the pipeline to calculate average total darts per player
    const avgTotalDartsResult = await Game.aggregate(avgTotalDartsPipeline); // Use Game model

    // Construct the final result by combining the results, including the rank, and sorting by rank
    const players = totalGamesResult.map(({ _id, totalGames, wins }) => {
      const avgScorePerInningEntry = avgTotalDartsResult.find(entry => entry._id === _id);
      return {
        _id,
        totalGames,
        wins,
        avgScorePerInning: avgScorePerInningEntry ? avgScorePerInningEntry.avgTotalDarts : null
      };
    });

    // Fetch user details for each player
    for (const player of players) {
      const user = await User.findOne({ username: player._id });
      if (user) {
        player.firstName = user.firstName;
        player.rank = user.rank[t];
      }
    }

    // Sort players by rank
    players.sort((a, b) => b.rank - a.rank);

    return NextResponse.json({ players }, { status: 201 });
  } catch (error) {
    console.error('Error occurred:', error);
    return NextResponse.error("Internal Server Error", { status: 500 });
  }
}
