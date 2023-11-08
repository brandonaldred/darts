import connectMongoDB from "@/libs/mongodb";
import User from "../../../models/User"
import { NextResponse } from "next/server";
import bcrypt from "bcrypt"

export async function POST(req) {
    const { firstName, lastName, username, password, profileImage, rank, gamesPlayed } = await req.json();
    await connectMongoDB()
    const salt = await bcrypt.genSalt()
    const hashword = await bcrypt.hash(password, salt)
    const user = await {
        firstName: firstName,
        lastName: lastName,
        username: username,
        password: hashword,
        profileImage: profileImage,
        rank: {
            "301": rank['301'],
            "501": rank['501'],
            "cricket": rank.cricket,
            "aroundWorld": rank.aroundWorld,
            "threeHigh": rank.threeHigh
        },
        gamesPlayed: gamesPlayed}
    await User.create(user)
    return NextResponse.json({message: 'User Created'}, { status: 201 })
}