import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";

export function Leaderboard() {
    const { data: leaderboard, isLoading } = useQuery({
        queryKey: ["leaderboard"],
        queryFn: async () => {
            const response = await api.get(
                "/api/v1/leaderboard/allTime/totalWins"
            );
            return response.data.data;
        },
    });

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <h1 className="text-2xl font-bold mb-6">Leaderboard</h1>
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                                Rank
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                                Player
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                                Score
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                                Games
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                                Win Rate
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {leaderboard?.map((entry, index) => (
                            <tr key={entry.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    {index + 1}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    {entry.username}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    {entry.score}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    {entry.gamesPlayed}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    {entry.winRate}%
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Leaderboard;
