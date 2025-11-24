import { WaitingListDoc } from "../models/waiting_list.model";
import enums from "../enums.json";
import mongoose from "mongoose";
import { ObjectId } from "./helpers";

export type PriorityPolicy = {
  fundingPriorityEnabled: boolean;
  fundingRank?: Record<string, number>;
};

const defaultFundingRank = {
  [enums.FundingTypes.PRIVATE]: 3,
  [enums.FundingTypes.GOVERNMENT_AID]: 2,
  [enums.FundingTypes.HMO]: 1,
};

export const comparePatients = (
  a: WaitingListDoc,
  b: WaitingListDoc,
  policy: PriorityPolicy
) => {
  const aOverride = a.priorityOverride ?? 0;
  const bOverride = b.priorityOverride ?? 0;
  if (aOverride !== bOverride) return bOverride - aOverride;

  if (policy.fundingPriorityEnabled) {
    const aRank = defaultFundingRank[a.funding] || 0;
    const bRank = defaultFundingRank[b.funding] || 0;
    if (aRank !== bRank) return bRank - aRank;
  }

  if (a.joinedAt < b.joinedAt) return -1;
  if (a.joinedAt > b.joinedAt) return 1;
  return 0;
};

export const tryMatchWaitingList = async (
  clinic: string,
  service: string,
  date: Date,
  time: Date
) => {
  const day = new Date(date).toLocaleString("en-US", { weekday: "long" });

  const candidates = await mongoose
    .model("waiting_list")
    .find({
      activity: ObjectId(clinic),
      treatment: ObjectId(service),
      status: enums.WaitingListStatus.WAITING,
      "preferences.day": day,
      "preferences.time": time,
    })
    .sort({ priority_score: 1 })
    .limit(5);

  if (!candidates.length) return;

//   for (let c of candidates) {
//     await sendWaitingListNotification(c.guardian);
//     c.status = "NOTIFIED";
//     await c.save();
//   }

  return true;
};
