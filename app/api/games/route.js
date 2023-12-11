import connectMongoDB from "@/libs/mongodb";
import Games from "../../../models/Game"
import { NextResponse, NextRequest } from "next/server";


export async function GET(req) {
    await connectMongoDB()
    const gameID = req.nextUrl.searchParams.get('id');
    let game = '';
    if (gameID.length > 0) {
        game = await Games.findById({_id: gameID})
    } else { game = 'No Game found' }
    return NextResponse.json({game}, { status: 201 })
}