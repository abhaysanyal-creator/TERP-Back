import mongoose, { Schema } from "mongoose";
import enums from "../enums.json";
import { ISession } from "../types/interface.types";

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
    session_id: { type: String },
    session_type: {
      type: String,
      required: true,
      enum: Object.values(enums.SessionType),
    },
    meeting_type: {
      type: String,
      enum: Object.values(enums.MeetingType),
    },
    therapist: {
      id: { type: Schema.Types.ObjectId, ref: "employees" },
      first_name: { type: String },
      last_name: { type: String },
      is_arrived: { type: Boolean, default: false },
    },
    treatment_area: {
      id: { type: Schema.Types.ObjectId, ref: "activities" },
      label: { type: String },
      value: { type: String },
    },
    // patients: [
    //   {
    //     _id: { type: Schema.Types.ObjectId, ref: "User" },
    //     organization: {
    //       _id: { type: Schema.Types.ObjectId, ref: "Organization" },
    //       name: { type: String },
    //     },
    //     department: {
    //       _id: { type: Schema.Types.ObjectId, ref: "Department" },
    //       name: { type: String },
    //     },
    //     first_name: { type: String },
    //     last_name: { type: String },
    //     email: { type: String },
    //     phone: { type: String },
    //     status: {
    //       type: String,
    //       enum: Object.values(SessionStatusEnum),
    //       default: SessionStatusEnum.SCHEDULED,
    //     },
    //     is_arrived: { type: Boolean, default: false },
    //     actual_start: { type: Date },
    //     actual_end: { type: Date },
    //     summary: { type: String },
    //     reason: {
    //       type: String,
    //       enum: Object.values(CancellationReasonEnum),
    //       default: null,
    //     },
    //   },
    // ],
    // patient_groups: {
    //   type: [
    //     {
    //       _id: { type: Schema.Types.ObjectId, ref: "patient_group" },
    //       group_name: { type: String },
    //       patients: [
    //         {
    //           _id: { type: Schema.Types.ObjectId, ref: "User" },
    //           organization: {
    //             _id: { type: Schema.Types.ObjectId, ref: "Organization" },
    //             name: { type: String },
    //           },
    //           department: {
    //             _id: { type: Schema.Types.ObjectId, ref: "Department" },
    //             name: { type: String },
    //           },
    //           first_name: { type: String },
    //           last_name: { type: String },
    //           email: { type: String },
    //           phone: { type: String },
    //           status: {
    //             type: String,
    //             enum: Object.values(SessionStatusEnum),
    //             default: SessionStatusEnum.SCHEDULED,
    //           },
    //           is_arrived: { type: Boolean, default: false },
    //           actual_start: { type: Date },
    //           actual_end: { type: Date },
    //           summary: { type: String },
    //           reason: {
    //             type: String,
    //             enum: Object.values(CancellationReasonEnum),
    //             default: null,
    //           },
    //         },
    //       ],
    //     },
    //   ],
    //   default: [],
    // },
    // session_planning: {
    //   _id: false,
    //   type: {
    //     practice_name: { type: String },
    //     practice_guidelines: { type: String },
    //     activities: {
    //       type: [ActivitySchema],
    //       default: [],
    //     },
    //   },
    //   default: {},
    // },
    scheduled_start: { type: Date },
    scheduled_end: { type: Date },
    is_recurring: { type: Boolean, default: false },
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
      },
      default: null,
    },
    reason: {
      type: String,
      enum: Object.values(enums.CancellationReason),
      default: null,
    },
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
