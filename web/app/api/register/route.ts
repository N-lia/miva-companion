import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, confidentCourses, helpCourses } = body;

        if (!name || !confidentCourses || !helpCourses) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const [user] = await db.insert(users).values({
            name,
            confidentCourses: JSON.stringify(confidentCourses),
            helpCourses: JSON.stringify(helpCourses),
        }).returning();

        return NextResponse.json({ success: true, user });
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
