'use client';

import { useState, useEffect } from 'react';

interface User {
    id: string;
    name: string;
    confidentCourses: string[];
    helpCourses: string[];
}

interface Group {
    id: string;
    createdAt: string;
    members: User[];
}

export default function MatchesPage() {
    const [groups, setGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState(true);
    const [matching, setMatching] = useState(false);

    const fetchMatches = async () => {
        try {
            const res = await fetch('/api/matches');
            const data = await res.json();
            setGroups(data.groups);
        } catch (error) {
            console.error('Failed to fetch matches', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMatches();
    }, []);

    const handleMatch = async () => {
        setMatching(true);
        try {
            const res = await fetch('/api/match', { method: 'POST' });
            const data = await res.json();
            if (data.success) {
                await fetchMatches();
                alert(`Created ${data.groupsCreated} new groups!`);
            } else {
                alert(data.message || 'Matching failed');
            }
        } catch (error) {
            console.error('Matching error', error);
            alert('Error running matching algorithm');
        } finally {
            setMatching(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-12">
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                        Reading Partner Matches
                    </h1>
                    <button
                        onClick={handleMatch}
                        disabled={matching}
                        className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-semibold transition-all disabled:opacity-50"
                    >
                        {matching ? 'Running Algorithm...' : 'Run Matching Algorithm'}
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-20 text-gray-500">Loading matches...</div>
                ) : groups.length === 0 ? (
                    <div className="text-center py-20 text-gray-500 bg-white/5 rounded-2xl border border-white/10">
                        No matches found yet. Run the algorithm to create groups.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {groups.map((group, i) => (
                            <div key={group.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
                                <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/10">
                                    <h3 className="text-xl font-semibold text-purple-400">Group {groups.length - i}</h3>
                                    <span className="text-xs text-gray-500">{new Date(group.createdAt).toLocaleDateString()}</span>
                                </div>

                                <div className="space-y-4">
                                    {group.members.map(member => (
                                        <div key={member.id} className="bg-black/20 rounded-lg p-3">
                                            <div className="font-medium text-white mb-1">{member.name}</div>
                                            <div className="text-xs text-green-400 mb-1">
                                                <span className="opacity-70">Can teach:</span> {member.confidentCourses.join(', ')}
                                            </div>
                                            <div className="text-xs text-pink-400">
                                                <span className="opacity-70">Needs help:</span> {member.helpCourses.join(', ')}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
