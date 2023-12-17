import connectMongoDB from "@/libs/mongodb";
import User from "../../../../models/User"
import { NextResponse } from "next/server";

/* 
    Pages are dependent upon 'users' being returned. It makes more sense to label them as 'players' rather than users, however when making this update, it will require updating the code on the home page, and game selection, along with the game page.
*/

export async function GET(req) {
    const p1 = req.nextUrl.searchParams.get('p1');
    const p2 = req.nextUrl.searchParams.get('p2');
    await connectMongoDB()
    let users;
    if (!p1 && !p2) {
        users = await User.find()
    } else {
        users = await User.find({username: {$in: [p1, p2]}})
    }
    return NextResponse.json({users}, { status: 201 })
}