import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { groups, users } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';

export async function GET() {
    try {
        const allGroups = await db.query.groups.findMany({
            orderBy: [desc(groups.createdAt)]
        });

        const allUsers = await db.query.users.findMany();
        const userMap = new Map(allUsers.map(u => [u.id, u]));

        const groupsWithMembers = allGroups.map(group => {
            const memberIds = JSON.parse(group.memberIds);
            const members = memberIds.map((id: string) => {
                const user = userMap.get(id);
                return user ? {
                    ...user,
                    confidentCourses: JSON.parse(user.confidentCourses),
                    helpCourses: JSON.parse(user.helpCourses)
                } : null;
            }).filter(Boolean);

            return {
                ...group,
                members
            };
        });

        return NextResponse.json({ groups: groupsWithMembers });
    } catch (error) {
        console.error('Get matches error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
