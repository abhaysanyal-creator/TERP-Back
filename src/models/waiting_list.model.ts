import { Schema, model, Document, Types } from "mongoose";
import enums from "../enums.json";
import { stringList } from "aws-sdk/clients/datapipeline";

export interface Preference {
  day: Number;
  start_time: String;
  end_time: String;
}

export interface WaitingListDoc extends Document {
  activity: { id: Types.ObjectId; name: string };
  organisation: { id: Types.ObjectId; name: string,type:string };
  patient: { id: Types.ObjectId; name: string };
  treatment: { id: Types.ObjectId; name: string };
  preferences: Preference[];
  co_payment_amount: string;
  therapist: { id: Types.ObjectId; name: string };
  preferred_time: {
    scheduled_date: string;
    scheduled_start: string;
    scheduled_end: string;
  };
  priority_score: number;
  joinedAt: Date;
  priorityOverride?: number;
  funding: string;
  status: string;
  is_deleted:false;
  is_active:true;
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
    organisation: {
      id: { type: Schema.Types.ObjectId, ref: "organisations" },
      name: { type: String },
      type: { type: String },
    },
    activity: {
      id: {
        type: Schema.Types.ObjectId,
        ref: "activities",
      },
      name: { type: String },
    },
    patient: {
      id: { type: Schema.Types.ObjectId, ref: "patients" },
      name: { type: String },
    },
    treatment: {
      id: { type: Schema.Types.ObjectId, ref: "metadatas" },
      name: { type: String },
    },
    therapist: {
      id: { type: Schema.Types.ObjectId, ref: "employees" },
      name: { type: String },
      is_arrived: { type: Boolean, default: false },
    },
    preferences: [preferenceSchema],
    joinedAt: { type: Date, default: Date.now, index: true },
    priority_score: { type: Number },
    co_payment_amount: {
      type: String,
    },
    priorityOverride: { type: Number },
    preferred_time: {
      scheduled_date: { type: Number },
      scheduled_start: { type: String },
      scheduled_end: { type: String },
    },
    funding: {
      type: String,
      enum: enums.FundingTypes,
      index: true,
    },
    status: {
      type: String,
      enum: enums.WaitingListStatus,
      default: enums.WaitingListStatus.WAITING,
      index: true,
    },
    is_deleted:{type:Boolean,default:false},
    is_active:{type:Boolean,default:true},
    notifiedAt: Date,
    meta: Schema.Types.Mixed,
  },
  { timestamps: true }
);

waitingListSchema.index({
  "activity.id": 1,
  "treatment.id": 1,
  status: 1,
  joinedAt: 1,
});

const WaitingListModel = model<WaitingListDoc>(
  "waiting_list",
  waitingListSchema,
  "waiting_list"
);

export default WaitingListModel;
