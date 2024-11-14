import { useState, useEffect, useCallback } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import type { Game } from "@/types/game.types";

const GAMES_PER_PAGE = 10;

export function useInfiniteGames(username: string) {
    const [allGames, setAllGames] = useState<Game[]>([]);

    const { data, fetchNextPage, hasNextPage, isLoading, error } =
        useInfiniteQuery({
            queryKey: ["games", username],
            queryFn: async () => {
                const response = await api.get<ApiResponse<Game[]>>(
                    `/api/v1/games/${username}`
                );
                return response.data.data;
            },
            getNextPageParam: (lastPage, pages) => {
                const currentLength = pages.flat().length;
                return currentLength < lastPage.length
                    ? currentLength
                    : undefined;
            },
            staleTime: 1000 * 60 * 5, // 5 minutes
        });

    useEffect(() => {
        if (data) {
            setAllGames(data.pages.flat());
        }
    }, [data]);

    const loadMore = useCallback(() => {
        if (hasNextPage) {
            fetchNextPage();
        }
    }, [fetchNextPage, hasNextPage]);

    return { games: allGames, loadMore, isLoading, error };
}
