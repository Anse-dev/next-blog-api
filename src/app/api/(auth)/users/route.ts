import { NextResponse } from "next/server";
import User from "../../../../../lib/models/user";
import connect from "../../../../../lib/db";
import { ObjectId } from "mongodb";
import { Types } from "mongoose";

export const GET = async () => {
    try {
        await connect();
        const users = await User.find();
        const format = {
            'status': 200,
            'data': users,
            'message': 'All Users!'
        }
        return new NextResponse(JSON.stringify(format), { status: 200 });
    } catch (error: any) {
        return new NextResponse("Error in fetching users" + error.message, {
            status: 500
        });
    }
};

export const POST = async (request: Request) => {
    try {
        const body = await request.json();
        await connect();
        const newUser = new User(body);
        await newUser.save();
        const format = {
            'status': 200,
            'data': newUser,
            'message': "User is created"
        }
        return new NextResponse(
            JSON.stringify(format),
            { status: 200 }
        );
    } catch (error: any) {
        return new NextResponse("Error in creating user" + error.message, {
            status: 500,
        });
    }
};

export const PATCH = async (request: Request) => {
    try {
        const body = await request.json();
        const { userId, newUsername } = body;

        await connect();
        if (!userId || !newUsername) {
            return new NextResponse(
                JSON.stringify({ message: "ID or new username not found" }),
                { status: 400 }
            );
        }

        if (!Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({ message: "Invalid User id" }), {
                status: 400,
            });
        }

        const updatedUser = await User.findOneAndUpdate(
            { _id: new ObjectId(userId) },
            { username: newUsername },
            { new: true }
        );

        if (!updatedUser) {
            return new NextResponse(
                JSON.stringify({ message: "User not found in the database" }),
                { status: 400 }
            );
        }

        return new NextResponse(
            JSON.stringify({ message: "User is updated", user: updatedUser }),
            { status: 200 }
        );
    } catch (error: any) {
        return new NextResponse("Error in updating user" + error.message, {
            status: 500,
        });
    }
};




export const DELETE = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return new NextResponse(JSON.stringify({ message: "ID not found" }), {
                status: 400,
            });
        }

        if (!Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({ message: "Invalid User id" }), {
                status: 400,
            });
        }

        await connect();

        const deletedUser = await User.findByIdAndDelete(
            new Types.ObjectId(userId)
        );

        if (!deletedUser) {
            return new NextResponse(
                JSON.stringify({ message: "User not found in the database" }),
                { status: 400 }
            );
        }

        return new NextResponse(
            JSON.stringify({ message: "User is deleted", user: deletedUser }),
            { status: 200 }
        );
    } catch (error: any) {
        return new NextResponse("Error in deleting user" + error.message, {
            status: 500,
        });
    }
};