import connectMongoDB from "@/libs/mongodb";
import User from "../../../../models/User"
import { NextResponse } from "next/server";


export async function GET(req) {
    await connectMongoDB()
    const users = await User.find()
    return NextResponse.json({users}, { status: 201 })
}