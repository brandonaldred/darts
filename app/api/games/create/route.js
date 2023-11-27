import connectMongoDB from "@/libs/mongodb";
import mongoose from 'mongoose'
import Game from "../../../../models/Game"
import { NextResponse } from "next/server";

export async function POST(req) {
    const { playerOne, playerTwo } = await req.json();
    await connectMongoDB()
    const game = await new Game({
            playerOne: playerOne,
            playerTwo: playerTwo,
            innings: []
        })

    console.log(game)
    await Game.create(game)

    return NextResponse.json({message: 'Game Created', id: game._id}, { status: 201 })
}