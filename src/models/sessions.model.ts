import mongoose, { Schema } from "mongoose";
import enums from "../enums.json";
import { ISession } from "../types/interface.types";
import { DocSchema } from "./employee.model";

// const ActivitySchema = new Schema(
//   {
//     order: { type: Number },
//     game: {
//       _id: { type: Schema.Types.ObjectId, ref: "Game" },
//       title: { type: String },
//       thumbnail_file: { type: String },
//     },
//   },
//   { _id: false }
// );

const SessionSchema = new Schema<ISession>(
  {
    patient: {
      id: { type: Schema.Types.ObjectId, required: true, ref: "patients" },
      name: { type: String },
    },
    organisation: {
      id: { type: Schema.Types.ObjectId, required: true, ref: "organisations" },
      name: { type: String },
    },
    session_id: { type: String },
    clinic_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "activities",
    },
    treatment: {
      id: { type: Schema.Types.ObjectId, required: true },
      name: { type: String, required: true },
    },
    session_type: {
      type: String,
      enum: Object.values(enums.SessionType),
    },
    authorisation_serial_number: {
      type: String,
    },
    co_payment_amount: {
      type: Number,
    },
    meeting_type: {
      type: String,
      enum: Object.values(enums.MeetingType),
    },
    therapist: {
      id: { type: Schema.Types.ObjectId, ref: "employees" },
      name: { type: String },
      is_arrived: { type: Boolean, default: false },
    },
    treatment_area: {
      id: { type: Schema.Types.ObjectId },
      name: { type: String },
      value: { type: String },
    },
    total_cost: {
      type: Number,
    },
    scheduled_start: { type: String, required: true },
    scheduled_date: { type: String, required: true },
    scheduled_end: { type: String, required: true },
    is_recurring: { type: Boolean, default: false },
    documents: [DocSchema],
    recurrence: {
      type: {
        _id: false,
        repeat_every: {
          value: { type: Number },
          unit: {
            type: String,
            enum: Object.values(enums.RecurrenceUnits),
          },
        },
        repeat_on: [
          {
            type: String,
            enum: Object.values(enums.RecurrenceOn),
          },
        ],
        ends: {
          type: String,
          enum: Object.values(enums.RecurrenceEnds),
        },
        end_date: { type: Date },
        occurrences: { type: Number },
      },
      default: null,
    },
    compensation_session: {
      _id: false,
      type: {
        make_up_session_date: { type: Date },
        start_time: { type: Date },
        end_time: { type: Date },
      },
      default: null,
    },
    status: {
      type: String,
      enum: enums.SessionStatus,
      default: enums.SessionStatus.SCHEDULED,
    },
    therapist_approval: {
      type: String,
      enum: enums.SessionStatus,
      default: enums.Approval_Status.APPROVAL_PENDING,
    },
    is_active: { type: Boolean, default: true },
    is_deleted: { type: Boolean, default: false },
    note: { type: String, default: null },
    cancellation_info: {
      reason: { type: String, enum: Object.values(enums.CancellationReason) },
      note: { type: String },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const sessionModel = mongoose.model<ISession>(
  "sessions",
  SessionSchema,
  "sessions"
);
