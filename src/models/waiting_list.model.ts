import { Schema, model, Document, Types } from "mongoose";
import enums from "../enums.json";

export interface Preference {
  day: Number;
  start_time: String;
  end_time: String;
}

export interface WaitingListDoc extends Document {
  activity: Types.ObjectId;
  patient: Types.ObjectId;
  guardian: Types.ObjectId;
  treatment: Types.ObjectId;
  preferences: Preference[];
  preferred_therapist: Types.ObjectId;
  priority_score: number;
  joinedAt: Date;
  priorityOverride?: number;
  funding: string;
  status: string;
  notifiedAt?: Date;
  meta?: any;
}

const preferenceSchema = new Schema(
  {
    day: Number,
    start_time: String,
    end_time: String,
  },
  { _id: false }
);

const waitingListSchema = new Schema<WaitingListDoc>(
  {
    activity: {
      type: Schema.Types.ObjectId,
      ref: "activities",
      required: true,
      index: true,
    },
    patient: { type: Schema.Types.ObjectId, ref: "patients", required: true },
    treatment: {
      type: Schema.Types.ObjectId,
      ref: "metadatas",
      required: true,
      index: true,
    },
    preferred_therapist: { type: Schema.Types.ObjectId, ref: "employees" },
    preferences: { type: [preferenceSchema], required: true },
    joinedAt: { type: Date, default: Date.now, index: true },
    priority_score: { type: Number },
    priorityOverride: { type: Number },
    funding: {
      type: String,
      enum: enums.FundingTypes,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: enums.WaitingListStatus,
      default: enums.WaitingListStatus.WAITING,
      index: true,
    },
    notifiedAt: Date,
    meta: Schema.Types.Mixed,
  },
  { timestamps: true }
);

waitingListSchema.index({ clinic: 1, treatment: 1, status: 1, joinedAt: 1 });

const WaitingListModel = model<WaitingListDoc>(
  "waiting_list",
  waitingListSchema,
  "waiting_list"
);

export default WaitingListModel;
