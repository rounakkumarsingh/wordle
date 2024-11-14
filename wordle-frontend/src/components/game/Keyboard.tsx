// src/components/game/Keyboard.tsx
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
    addLetter,
    removeLetter,
    submitGuess,
} from "@/features/game/gameSlice";

const KEYBOARD_LAYOUT = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "DELETE"],
];

export function Keyboard() {
    const dispatch = useAppDispatch();
    const { keyboardState, gameStatus } = useAppSelector((state) => state.game);

    const handleKey = (key: string) => {
        if (gameStatus !== "playing") return;

        switch (key) {
            case "ENTER":
                dispatch(submitGuess());
                break;
            case "DELETE":
                dispatch(removeLetter());
                break;
            default:
                dispatch(addLetter(key.toLowerCase()));
        }
    };

    return (
        <div className="fixed bottom-8 left-0 right-0 px-4">
            <div className="max-w-2xl mx-auto space-y-2">
                {KEYBOARD_LAYOUT.map((row, i) => (
                    <div key={i} className="flex justify-center gap-1">
                        {row.map((key) => (
                            <motion.button
                                key={key}
                                onClick={() => handleKey(key)}
                                whileTap={{ scale: 0.95 }}
                                className={`
                  ${getKeyStyle(key, keyboardState[key.toLowerCase()])}
                  ${key.length > 1 ? "px-4 text-xs" : "px-2"} 
                  h-14 rounded font-bold transition-colors
                `}
                            >
                                {key}
                            </motion.button>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

function getKeyStyle(key: string, state?: "correct" | "present" | "absent") {
    const baseStyle = "text-sm uppercase";

    if (key === "ENTER" || key === "DELETE") {
        return `${baseStyle} bg-gray-300 hover:bg-gray-400`;
    }

    switch (state) {
        case "correct":
            return `${baseStyle} bg-green-500 text-white`;
        case "present":
            return `${baseStyle} bg-yellow-500 text-white`;
        case "absent":
            return `${baseStyle} bg-gray-500 text-white`;
        default:
            return `${baseStyle} bg-gray-200 hover:bg-gray-300`;
    }
}
