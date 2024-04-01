import express from "express";
import { deposit, depositScCtl, withDraw, withdrawScCtl } from "../controllers/transactions/trasaction.js";


const router = express.Router();

router.post("/withdraw", withDraw);
router.post("/deposit", deposit);


router.post("/deposit_sc_ctl", depositScCtl);
router.post("/withdraw_sc_ctl", withdrawScCtl);

export default router