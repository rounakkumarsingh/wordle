import { Router } from "express";
import { verifyJWT, checkJWT } from "../middlewares/auth.middleware";
import {
    addGame,
    createGame,
    getGame,
    getStats,
    togglePrivate,
    getGames,
} from "../controllers/game.controller";

const gameRouter = Router();

gameRouter.route("/createGame").post(checkJWT, createGame);
gameRouter.route("/createGame").post(verifyJWT, createGame);
gameRouter.route("/addGame").post(verifyJWT, addGame);
gameRouter.route("/:gameId/addMove").patch(checkJWT, addMove);
gameRouter.route("/:gameId/togglePrivate").patch(verifyJWT, togglePrivate);
gameRouter.route("/getGame/:gameId").get(checkJWT, getGame);
gameRouter.route("/getStats/:username").get(getStats);
gameRouter.route("/getGames/:username").get(checkJWT, getGames);

export default gameRouter;
