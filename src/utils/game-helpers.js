export function checkGuess(guess, answer) {
	const SOLVED_CHAR = "✓";

	if (!guess) {
		return null;
	}

	const guessChars = guess.toUpperCase().split("");
	const answerChars = answer.split("");

	const result = [];

	// Step 1: Look for correct letters.
	for (let i = 0; i < guessChars.length; i++) {
		if (guessChars[i] === answerChars[i]) {
			result[i] = {
				letter: guessChars[i],
				status: "correct",
			};
			answerChars[i] = SOLVED_CHAR;
			guessChars[i] = SOLVED_CHAR;
		}
	}

	// Step 2: look for misplaced letters. If it's not misplaced,
	// it must be incorrect.
	for (let i = 0; i < guessChars.length; i++) {
		if (guessChars[i] === SOLVED_CHAR) {
			continue;
		}

		let status = "incorrect";
		const misplacedIndex = answerChars.findIndex(
			(char) => char === guessChars[i]
		);
		if (misplacedIndex >= 0) {
			status = "misplaced";
			answerChars[misplacedIndex] = SOLVED_CHAR;
		}

		result[i] = {
			letter: guessChars[i],
			status,
		};
	}

	return result;
}
