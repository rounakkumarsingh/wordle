import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { updateTime } from "@/features/game/gameSlice";

export function Timer() {
    const dispatch = useAppDispatch();
    const { isTimerVisible, gameStatus, timeTaken } = useAppSelector(
        (state) => state.game
    );
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        let interval: number;

        if (gameStatus === "playing" && isActive) {
            interval = window.setInterval(() => {
                dispatch(updateTime(timeTaken + 1000));
            }, 1000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isActive, gameStatus, timeTaken, dispatch]);

    useEffect(() => {
        const handleVisibilityChange = () => {
            setIsActive(!document.hidden);
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => {
            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange
            );
        };
    }, []);

    if (!isTimerVisible) return null;

    return (
        <div className="fixed top-4 right-4 bg-white shadow-md rounded-lg p-3">
            <span className="font-mono text-lg">
                {new Date(timeTaken).toISOString().substr(14, 8)}
            </span>
        </div>
    );
}
