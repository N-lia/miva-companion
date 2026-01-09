import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST() {
    try {
        // 1. Fetch all users
        const users = await prisma.user.findMany();

        // 2. Fetch existing groups to exclude already matched users
        const existingGroups = await prisma.group.findMany();
        const matchedUserIds = new Set<string>();
        existingGroups.forEach(group => {
            const ids = JSON.parse(group.memberIds);
            ids.forEach((id: string) => matchedUserIds.add(id));
        });

        const unmatchedUsers = users.filter(user => !matchedUserIds.has(user.id));

        if (unmatchedUsers.length < 3) {
            return NextResponse.json({ message: 'Not enough users to form a group', groupsCreated: 0 });
        }

        // 3. Simple Matching Logic: Group by 3s
        // In a real app, we would use a graph matching algorithm based on confidentCourses vs helpCourses
        const newGroups = [];

        // Shuffle users for random matching (or sort by timestamp)
        const shuffled = unmatchedUsers.sort(() => 0.5 - Math.random());

        for (let i = 0; i < shuffled.length; i += 3) {
            const chunk = shuffled.slice(i, i + 3);
            if (chunk.length === 3) {
                const memberIds = chunk.map(u => u.id);
                const group = await prisma.group.create({
                    data: {
                        memberIds: JSON.stringify(memberIds),
                    },
                });
                newGroups.push(group);
            }
        }

        return NextResponse.json({
            success: true,
            groupsCreated: newGroups.length,
            groups: newGroups
        });

    } catch (error) {
        console.error('Matching error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
