import { ethers } from "ethers";

// use here a constant value to reduce the number of requests to blockchain
export const zeroBlockTimestamp = parseInt(process.env.ZERO_BLOCK_TIMESTAMP);
const provider = new ethers.WebSocketProvider(process.env.RPC_URL);

export const getNextBlock = async (timestamp: number) => {
 let leftBlockNumber = 1;
 let rightBlockNumber = await provider.getBlockNumber();
 let [leftTimestamp, rightTimestamp] = await Promise.all([
  getBlockTimestamp(leftBlockNumber),
  getBlockTimestamp(rightBlockNumber),
 ]);

 // return block number if timestamp is less than 0 block to improve performance
 if (timestamp < leftTimestamp) {
  return leftBlockNumber; // this is a next block for that timestamp
 } else if (timestamp === leftTimestamp) {
  return leftBlockNumber + 1; // added 1 to return the next block number
 }

 // return an error as there is no next block yet
 if (timestamp >= rightTimestamp) {
  throw new Error(`There is no next block yet for the timestamp: ${timestamp}`);
 }

 while (true) {
  const middleBlockNumber =
   leftBlockNumber + Math.floor((rightBlockNumber - leftBlockNumber) / 2);
  const middleTimestamp = await getBlockTimestamp(middleBlockNumber);
  if (timestamp === middleTimestamp) {
   return middleBlockNumber + 1; // added 1 to return the next block number
  } else if (timestamp < middleTimestamp) {
   rightBlockNumber = middleBlockNumber;
   rightTimestamp = middleTimestamp;
  } else {
   leftBlockNumber = middleBlockNumber;
   leftTimestamp = middleTimestamp;
  }

  if (rightBlockNumber - leftBlockNumber <= 1) {
   return rightBlockNumber;
  }
 }
};

export const getBlockTimestamp = async (blockNumber?: number) =>
 (await provider.getBlock(blockNumber)).timestamp;
