import express from "express";
import { getNextBlock, getBlockTimestamp } from "./blockchain";
import validator from "validator";

const router = express.Router();

router.get("/blocks/:timestamp", async (req, res) => {
 const timestamp = req.params.timestamp;
 if (!validator.isNumeric(timestamp)) {
  return res.status(400).json({ errors: ["Timestamp is incorrect"] });
 } else if (timestamp.length === Date.now().toString().length) {
  return res
   .status(400)
   .json({ errors: ["Timestamp contains milliseconds instead of seconds"] });
 } else if (Number(timestamp) >= (await getBlockTimestamp())) {
  return res
   .status(400)
   .json({ errors: ["There is no next block number for this timestamp"] });
 }

 try {
  const nextBlock = await getNextBlock(Number(timestamp));
  res.status(200).json({ data: { nextBlock } });
 } catch (err) {
  res.status(500).json({ errors: [err.message] });
 }
});

export default router;
