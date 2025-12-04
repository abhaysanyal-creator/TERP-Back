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
      id: { type: Schema.Types.ObjectId, ref: "patients" },
      name: { type: String },
    },
    organisation: {
      id: { type: Schema.Types.ObjectId, ref: "organisations" },
      name: { type: String },
    },
    session_id: { type: String },
    activity: {
      id: {
        type: Schema.Types.ObjectId,
      
        ref: "activities",
      },
      name: { type: String },
    },
    treatment: {
      id: { type: Schema.Types.ObjectId},
      name: { type: String},
    },
    session_type: {
      type: String,
      enum: Object.values(enums.SessionType),
    },
    authorisation_serial_number: {
      type: String,
    },
    co_payment_amount: {
      type: String,
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
      type: String,
    },
    scheduled_start: { type: String },
    scheduled_date: { type: String },
    scheduled_end: { type: String },
    is_recurring: { type: Boolean, default: false },
    documents: [DocSchema],
    recurrence: {
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

    is_parent_session: {
      type: Boolean,
      default: false, // parent = true, child = false
    },

    parent_session_id: {
      type: Schema.Types.ObjectId,
      ref: "sessions",
      default: null,
    },

    recurrence_group_id: {
      type: Schema.Types.ObjectId,
      default: null,
      index: true, // enables fast "find all sessions in group"
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
      default: enums.SessionStatus.APPROVAL_PENDING,
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
