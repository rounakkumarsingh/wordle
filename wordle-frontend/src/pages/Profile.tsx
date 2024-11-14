import { useAppSelector } from "@/app/hooks";
import { GameHistory } from "@/components/game/GameHistory";
import { GameStats } from "@/components/game/GameStats";

export function Profile() {
    const user = useAppSelector((state) => state.auth.user);

    if (!user) return null;

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <div className="flex items-center gap-4 mb-8">
                <img
                    src={user.profilePicture}
                    alt={user.username}
                    className="w-20 h-20 rounded-full"
                />
                <div>
                    <h1 className="text-2xl font-bold">{user.fullName}</h1>
                    <p className="text-gray-600">@{user.username}</p>
                </div>
            </div>

            <div className="grid gap-8">
                <GameStats username={user.username} />
                <GameHistory username={user.username} />
            </div>
        </div>
    );
}

export default Profile;
