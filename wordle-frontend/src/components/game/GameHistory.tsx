import { useState, useEffect } from "react";
import { format, subDays } from "date-fns";
import type { Game } from "@/types/game.types";

export function GameHistory({ username }: { username: string }) {
    const [games, setGames] = useState<Game[]>([]);
    const [filteredGames, setFilteredGames] = useState<Game[]>([]);
    const [dateRange, setDateRange] = useState<DateRange>("all");

    const { data, isLoading } = useQuery({
        queryKey: ["games", username],
        queryFn: async () => {
            const response = await api.get<ApiResponse<Game[]>>(
                `/api/v1/games/${username}`
            );
            return response.data.games;
        },
    });

    useEffect(() => {
        if (!data) return;

        const filtered = data.filter((game) => {
            if (dateRange === "all") return true;
            const gameDate = new Date(game.startTime);
            const daysAgo = {
                "7days": 7,
                "30days": 30,
                "90days": 90,
            }[dateRange];
            return gameDate >= subDays(new Date(), daysAgo);
        });

        setFilteredGames(filtered);
    }, [data, dateRange]);

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Game History</h2>
                <GameFilters onFilterChange={setDateRange} />
            </div>

            {filteredGames.map((game) => (
                <div key={game.id} className="bg-white rounded-lg shadow p-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <StatusBadge status={game.result} />
                            <span className="text-gray-600">
                                {format(
                                    new Date(game.startTime),
                                    "MMM dd, yyyy"
                                )}
                            </span>
                        </div>
                        <span className="text-sm text-gray-500">
                            Time: {formatTime(game.timeTaken)}
                        </span>
                    </div>

                    <div className="mt-3">
                        <div className="text-sm text-gray-600">
                            Guesses: {game.guesses.length}/{game.maxGuesses}
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {game.guesses.map((guess, idx) => (
                                <span
                                    key={idx}
                                    className="px-2 py-1 bg-gray-100 rounded text-sm"
                                >
                                    {guess}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            ))}

            {isLoading && <div>Loading games...</div>}
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const colors = {
        won: "bg-green-100 text-green-800",
        lost: "bg-red-100 text-red-800",
        incomplete: "bg-yellow-100 text-yellow-800",
    };

    return (
        <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status]}`}
        >
            {status.toUpperCase()}
        </span>
    );
}

function formatTime(ms: number) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}
