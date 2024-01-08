import connectMongoDB from "@/libs/mongodb";
import User from "../../../../models/User"
import { NextResponse } from "next/server";

export async function GET(req) {
    const t = req.nextUrl.searchParams.get('t');

    await connectMongoDB();
    let players = await User.find().select('firstName username rank');

    // Filter players who have a rank for game type 't' and sort them
    players = players.filter(player => player.rank && player.rank[t] !== undefined)
                     .sort((a, b) => b.rank[t] - a.rank[t]);

    return NextResponse.json({players}, { status: 201 });
}