import { useMemo } from "react";
import { useAppSelector } from "@/app/hooks";
import { motion } from "framer-motion";

export function Board() {
    const { wordSize, maxGuesses, guesses, currentGuess } = useAppSelector(
        (state) => state.game
    );

    const tileVariants = {
        initial: { scale: 1 },
        flip: {
            rotateX: [0, 90, 0],
            scale: [1, 0.9, 1],
            transition: { duration: 0.6 },
        },
        shake: {
            x: [-10, 10, -10, 10, 0],
            transition: { duration: 0.4 },
        },
    };

    const rows = useMemo(() => {
        const allRows = [];
        // Past guesses
        allRows.push(...guesses);
        // Current guess
        if (currentGuess.length > 0) {
            allRows.push(currentGuess);
        }
        // Empty rows
        while (allRows.length < maxGuesses) {
            allRows.push(Array(wordSize).fill(""));
        }
        return allRows;
    }, [guesses, currentGuess, maxGuesses, wordSize]);

    return (
        <div className="flex flex-col gap-2 items-center">
            {rows.map((row, i) => (
                <div key={i} className="flex gap-2 justify-center">
                    {row.map((letter, j) => (
                        <motion.div
                            key={`${i}-${j}`}
                            variants={tileVariants}
                            initial="initial"
                            animate={letter ? "flip" : "initial"}
                            className={`
								w-14 h-14 border-2 flex items-center justify-center text-2xl font-bold
								${getTileColor(letter, i, j)}
							`}
                        >
                            {letter}
                        </motion.div>
                    ))}
                </div>
            ))}
        </div>
    );
}

function getTileColor(letter: string, row: number, col: number) {
    // Add tile coloring based on game state
    return "border-gray-300 bg-white";
}
