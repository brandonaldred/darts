import connectMongoDB from "@/libs/mongodb";
import Game from "../../../models/Game"
import { NextResponse } from "next/server";


export async function GET(req) {
    try {
        await connectMongoDB()
        const gameID = req.nextUrl.searchParams.get('id');
        let game;
        if (gameID) { 
            game = await Game.findOne({name: gameID})
        } else {
            game = await Game.find()
        }
        return NextResponse.json({game}, { status: 201 })
    } catch (e) {
        return NextResponse.json({ error: 'Error getting game' }, { status: 201 })
    }
}

export async function POST(req) {
    const gameName = req.nextUrl.searchParams.get('n');
    const gameData = await req.json();
    await connectMongoDB()
    const game = await new Game({})
    if (gameName) { game.name = gameName } else { game.name = game._id }
    if (gameData.gamePlayers) { game.players = gameData.gamePlayers.players }
    if (gameData.type) { game.type = gameData.type }
    await Game.create(game)

    return NextResponse.json({message: 'Game Created', name: game.name}, { status: 201 })
}

export async function PATCH(req) {
    const gameName = req.nextUrl.searchParams.get('n');
    const gameData = await req.json();
    await connectMongoDB();
    
    const game = await Game.findOne({name: gameName});
    if (!game){ return NextResponse.json({ message: 'Game not found' }, { status: 404 }); }

    if (gameData.name) { game.name = gameData.name; }
    if (gameData.type) { game.type = gameData.type; }
    if (gameData.players) { game.players = gameData.players; }
    if (gameData.winner) { game.winner = gameData.winner; }
    if (gameData.innings) { game.innings = gameData.innings; }

    await game.save();

    return NextResponse.json({ message: 'Game updated', game: game }, { status: 200 });
}