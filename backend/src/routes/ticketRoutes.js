import express from "express";
import {
  createTicket,
  listTickets,
  getTicket,
  updateTicket,
  rateTicket,
  addComment,
  deleteTicket,
} from "../controllers/ticketController.js";
import { protect, restrictTo } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", listTickets);
router.post("/", createTicket);
router.get("/:id", getTicket);
router.patch("/:id", updateTicket);
router.post("/:id/rate", rateTicket);
router.post("/:id/comments", addComment);
router.delete("/:id", restrictTo("super_admin", "admin"), deleteTicket);

export default router;
