export function totalWins(games) {
    return games.filter((game) => game.result === "win").length;
}

export function calculateWinStreak(games) {
    let maxStreak = 0;
    let currentStreak = 0;

    games.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

    games.forEach((game) => {
        if (game.result === "won") {
            currentStreak++;
            maxStreak = Math.max(maxStreak, currentStreak);
        } else {
            currentStreak = 0;
        }
    });

    return maxStreak;
}

export function currentRunningStreak(games) {
    let currentStreak = 0;

    games.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

    for (let i = games.length - 1; i >= 0; i--) {
        if (games[i].result === "won") {
            currentStreak++;
        } else {
            break;
        }
    }

    return currentStreak;
}

export function calculateAverageGuessCount(games) {
    const totalGuesses = games.reduce(
        (sum, game) => sum + game.guesses.length,
        0
    );
    return games.length > 0 ? totalGuesses / games.length : 0;
}

export function calculateAccuracyRate(games) {
    const totalWins = games.filter((game) => game.result === "won").length;
    return games.length > 0 ? (totalWins / games.length) * 100 : 0;
}

export function calculatePoints(validGames) {
    let points = 0;
    let winStreak = 0;

    validGames.sort((a, b) => new Date(a.startTime) - new Date(b.startTime)); // Sort games by start date

    validGames.forEach((game) => {
        if (game.result === "win") {
            let attemptPoints = 0;
            const attempts = game.guesses.length;

            // Base points for winning
            points += 10;

            // Points based on number of attempts
            if (attempts === 1) {
                attemptPoints = 10; // Best case: 1 attempt
            } else if (attempts === 2) {
                attemptPoints = 8;
            } else if (attempts === 3) {
                attemptPoints = 6;
            } else if (attempts === 4) {
                attemptPoints = 4;
            } else if (attempts === 5) {
                attemptPoints = 2;
            } else {
                attemptPoints = 0; // More than 5 attempts
            }

            points += attemptPoints;

            // Award bonus for solving with fewer attempts relative to maxGuesses
            if (attempts <= Math.floor(game.maxGuesses / 2)) {
                points += 5; // Bonus for solving quickly (within half the max guesses)
            }

            // Win streak bonus
            winStreak++;
            if (winStreak >= 3) points += 5; // Bonus after 3 consecutive wins
            if (winStreak >= 5) points += 10; // Additional bonus after 5 consecutive wins
        } else {
            winStreak = 0; // Reset streak after a loss
        }
    });

    return points;
}
