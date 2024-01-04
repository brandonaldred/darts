import connectMongoDB from "@/libs/mongodb";
import User from "../../../models/User"
import { NextResponse } from "next/server";
import bcrypt from "bcrypt"
/* 
    Pages are dependent upon 'users' being returned. It makes more sense to label them as 'players' rather than users, however when making this update, it will require updating the code on the home page, and game selection, along with the game page.
*/

export async function GET(req) {
    const p = req.nextUrl.searchParams.get('p');
    await connectMongoDB()
    let players;
    if (p) {
        players = await User.find({username: {$in: p.split('|')}}).select('firstName username rank gamesPlayed equipment')
    } else {
        players = await User.find().select('firstName username rank gamesPlayed equipment')
    }
    return NextResponse.json({players}, { status: 201 })
}

export async function POST(req) {
    const { firstName, lastName, username, password, rank, gamesPlayed, equipment } = await req.json();
    await connectMongoDB()

    const existingUser = await User.findOne({ username });
        if (existingUser) {
            return NextResponse.error("Username already exists", { status: 400 });
        }

    const salt = await bcrypt.genSalt()
    const hashword = await bcrypt.hash(password, salt)
    const user = await {
        firstName: firstName,
        lastName: lastName,
        username: username,
        password: hashword,
        profileImage: `${username}.jpg`,
        rank: {
            "301": rank['301'],
            "501": rank['501'],
            "cricket": rank.cricket,
            "aroundWorld": rank.aroundWorld,
            "threeHigh": rank.threeHigh
        },
        equipment: {
            darts: equipment.darts
        },
        gamesPlayed: gamesPlayed
    }
    await User.create(user)
    return NextResponse.json({message: 'User Created'}, { status: 201 })
}

export async function PATCH(req) {
    try {
        const userId = req.nextUrl.searchParams.get('id')
        const data = await req.json()
        await connectMongoDB()
    
        const player = await User.findById(userId)
        if (!player) { return NextResponse.error( "User Not Found", { status: 404 } ) }
        if (data.firstName) { player.firstName = data.firstName }
        if (data.lastName) { player.lastName = data.lastName }
        if (data.username) { player.username = data.username }
        if (data.password) { 
            const salt = await bcrypt.genSalt()
            const hashword = await bcrypt.hash(data.password, salt)
            player.password = hashword
        }
        if (data.equipment.darts) { player.equipment.darts = data.equipment.darts }
        if (data.rank['301']) { player.rank['301'] = data.rank['301'] }
        if (data.rank['501']) { player.rank['501'] = data.rank['501'] }
        if (data.rank.cricket) { player.rank.cricket = data.rank.cricket }
        if (data.rank.aroundWorld) { player.rank.aroundWorld = data.rank.aroundWorld }
        if (data.rank.threeHigh) { player.rank.threeHigh = data.rank.threeHigh }
    
        await player.save()
        return NextResponse.json({ message: "User updated successfully" }, { status: 200 });
    } catch (e) { console.error("Error updating user:", e); return NextResponse.error('Failed to update user', {status: 500})}
}

export async function DELETE(req) {
    try {
        const {username, password} = await req.json();
        const playerId = req.nextUrl.searchParams.get('id');
        await connectMongoDB();

        const player = await User.findById(playerId);
        if (!player) { return NextResponse.error("User not found", {status: 404}); }
        const isPasswordValid = await bcrypt.compare(password, player.password);
        if (!isPasswordValid) { return NextResponse.error("Invalid password", {status: 401});}
        if (username !== player.username) { return NextResponse.error("Invalid username", {status: 401});}

        await User.deleteOne({ _id: playerId });

        return NextResponse.json({ message: "User deleted succesfully" }, {status: 200});

    } catch (e) {
        console.error("Error deleting user:", e);
        return NextResponse.error("Failed to delete user", { status: 500 })
    }
}