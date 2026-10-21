import express from "express";
import { authenticate } from "../middleware/authenticate.js";
import {
  addMovie,
  deleteMovie,
  findById,
  getWatchlist,
  updateMovie,
} from "../utils/db.js";
import { authorizeModification } from "../middleware/authorize.js";

const router = express.Router();

router.get("/:userId", authenticate, (req, res) => {
  const userWatchlist = getWatchlist(Number(req.params.userId));
  return res.status(200).json(userWatchlist);
});

router.post(
  "/:userId/movies",
  authenticate,
  authorizeModification,
  (req, res) => {
    const user = findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: "User does not exist" });
    }

    const movieData = req.body;
    addMovie(user.id, movieData);
    return res
      .status(201)
      .json({ message: "Movie successfully added to watchlist" });
  },
);

router.put(
  "/:userId/movies/:movieId",
  authenticate,
  authorizeModification,
  (req, res) => {
    const { userId, movieId } = req.params;
    const user = findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User does not exist" });
    }

    const updates = req.body;
    updateMovie(user.id, Number(movieId), updates);

    return res.status(200).json({ message: "Movie successfully updated" });
  },
);

router.delete(
  "/:userId/movies/:movieId",
  authenticate,
  authorizeModification,
  (req, res) => {
    const { userId, movieId } = req.params;
    const user = findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User does not exist" });
    }

    const updates = req.body;
    deleteMovie(user.id, Number(movieId));

    return res.status(200).json({ message: "Movie successfully deleted" });
  },
);

export default router;
