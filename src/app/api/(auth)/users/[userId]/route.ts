import { NextResponse } from "next/server";
import connect from "../../../../../../lib/db";
import User from "../../../../../../lib/models/user";

export const GET = async (request: Request, context: { params: any }) => {
    const userId = context.params.userId;

    try {
        await connect();
        const user = await User.findById(userId);
        const format = {
            'status': 200,
            'data': user,
            'message': 'All Users!'
        }
        return new NextResponse(JSON.stringify(format), { status: 200 });
    } catch (error: any) {
        return new NextResponse("Error in fetching user" + error.message, {
            status: 500
        });
    }
};