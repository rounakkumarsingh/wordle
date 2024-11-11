import { Router } from "express";
import { getLeaderBoard } from "../controllers/leaderboard.controller.js";

const leaderboardRouter = Router();

leaderboardRouter.route("/:timeFrame/:property").get(getLeaderBoard);

export default leaderboardRouter;
