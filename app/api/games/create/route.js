import connectMongoDB from "@/libs/mongodb";
import mongoose from 'mongoose'
import Game from "../../../../models/Game"
import { NextResponse } from "next/server";

export async function POST(req) {
    const { players, type } = await req.json();
    console.log(players, type)
    await connectMongoDB()
    const game = await new Game({
            players: players,
            type: type
        })

    await Game.create(game)
    console.log(game)

    return NextResponse.json({message: 'Game Created', id: game._id}, { status: 201 })
}

export async function PATCH(req) {
    const { id, updates } = await req.json();
    await connectMongoDB();

    const updatedGame = await Game.findByIdAndUpdate(id, updates, { new: true });

    // Check if the game was found and updated
    if (!updatedGame) {
        return NextResponse.json({ message: 'Game not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Game updated', game: updatedGame }, { status: 200 });
}