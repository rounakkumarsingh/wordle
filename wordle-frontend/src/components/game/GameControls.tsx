import { Slider } from "@radix-ui/react-slider";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { setWordSize, setMaxGuesses } from "@/features/game/gameSlice";

export function GameControls() {
    const dispatch = useAppDispatch();
    const { wordSize, maxGuesses } = useAppSelector((state) => state.game);

    return (
        <div className="space-y-6 p-4">
            <div>
                <label className="block text-sm font-medium mb-2">
                    Word Size: {wordSize}
                </label>
                <Slider
                    value={[wordSize]}
                    min={5}
                    max={10}
                    step={1}
                    onValueChange={([value]) => dispatch(setWordSize(value))}
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-2">
                    Max Guesses: {maxGuesses}
                </label>
                <Slider
                    value={[maxGuesses]}
                    min={6}
                    max={15}
                    step={1}
                    onValueChange={([value]) => dispatch(setMaxGuesses(value))}
                />
            </div>
        </div>
    );
}
