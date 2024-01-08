import connectMongoDB from "@/libs/mongodb";
import Rank from "../../../models/Rank"
import { NextResponse } from "next/server";

export async function POST(req) {
    const { username, type, rank } = await req.json();
    await connectMongoDB()
    const insertRank = await {
        username: username,
        type: type,
        rank: rank,
    }
    await Rank.create(insertRank)
    return NextResponse.json({message: 'Rank inserted'}, { status: 201 })
}
