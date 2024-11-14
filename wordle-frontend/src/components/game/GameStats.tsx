import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { api } from "@/services/api";
import type { UserStats } from "@/types/stats.types";

export function GameStats({ username }: { username: string }) {
    const { data: stats, isLoading } = useQuery({
        queryKey: ["userStats", username],
        queryFn: async () => {
            const response = await api.get<ApiResponse<UserStats>>(
                `/api/v1/games/stats/${username}`
            );
            return response.data.data;
        },
    });

    if (isLoading) return <div>Loading stats...</div>;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
                <StatCard
                    title="Win Rate"
                    value={`${stats?.accuracy.toFixed(1)}%`}
                    color="green"
                />
                <StatCard
                    title="Current Streak"
                    value={stats?.runningStreak}
                    color="blue"
                />
                <StatCard
                    title="Max Streak"
                    value={stats?.maxWinStreak}
                    color="purple"
                />
            </div>

            <div className="bg-white rounded-lg p-4 shadow">
                <h3 className="font-bold mb-4">Performance</h3>
                <div className="space-y-3">
                    <StatBar
                        label="Total Wins"
                        value={stats?.totalWins || 0}
                        maxValue={100}
                        color="green"
                    />
                    <StatBar
                        label="Average Guesses"
                        value={stats?.average || 0}
                        maxValue={6}
                        color="blue"
                    />
                    <StatBar
                        label="Points"
                        value={stats?.points || 0}
                        maxValue={1000}
                        color="purple"
                    />
                </div>
            </div>
        </div>
    );
}

function StatCard({
    title,
    value,
    color,
}: {
    title: string;
    value: number | string;
    color: "green" | "blue" | "purple";
}) {
    const colors = {
        green: "bg-green-100 text-green-800",
        blue: "bg-blue-100 text-blue-800",
        purple: "bg-purple-100 text-purple-800",
    };

    return (
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`${colors[color]} rounded-lg p-4 text-center`}
        >
            <div className="text-2xl font-bold">{value}</div>
            <div className="text-sm mt-1">{title}</div>
        </motion.div>
    );
}

function StatBar({
    label,
    value,
    maxValue,
    color,
}: {
    label: string;
    value: number;
    maxValue: number;
    color: "green" | "blue" | "purple";
}) {
    const percentage = (value / maxValue) * 100;

    const colors = {
        green: "bg-green-500",
        blue: "bg-blue-500",
        purple: "bg-purple-500",
    };

    return (
        <div className="space-y-1">
            <div className="flex justify-between text-sm">
                <span>{label}</span>
                <span>{value}</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    className={`h-full ${colors[color]}`}
                    transition={{ duration: 1, ease: "easeOut" }}
                />
            </div>
        </div>
    );
}
