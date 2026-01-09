import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, groups } from '@/lib/db/schema';

export async function POST() {
    try {
        // 1. Fetch all users
        const allUsers = await db.select().from(users);

        // 2. Fetch existing groups to exclude already matched users
        const existingGroups = await db.select().from(groups);
        const matchedUserIds = new Set<string>();
        existingGroups.forEach(group => {
            const ids = JSON.parse(group.memberIds);
            ids.forEach((id: string) => matchedUserIds.add(id));
        });

        const unmatchedUsers = allUsers.filter(user => !matchedUserIds.has(user.id));

        if (unmatchedUsers.length < 3) {
            return NextResponse.json({ message: 'Not enough users to form a group', groupsCreated: 0 });
        }

        // 3. Simple Matching Logic: Group by 3s
        const newGroupsCreated = [];

        // Shuffle users for random matching
        const shuffled = unmatchedUsers.sort(() => 0.5 - Math.random());

        for (let i = 0; i < shuffled.length; i += 3) {
            const chunk = shuffled.slice(i, i + 3);
            if (chunk.length === 3) {
                const memberIds = chunk.map(u => u.id);
                const [group] = await db.insert(groups).values({
                    memberIds: JSON.stringify(memberIds),
                }).returning();
                newGroupsCreated.push(group);
            }
        }

        return NextResponse.json({
            success: true,
            groupsCreated: newGroupsCreated.length,
            groups: newGroupsCreated
        });

    } catch (error) {
        console.error('Matching error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
