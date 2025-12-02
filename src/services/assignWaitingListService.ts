import mongoose from "mongoose";
import enums from "../enums.json";

export const assigningWaitingListService = async () => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    //finding a free slot in the sessions

    const freeSlot = await mongoose.model("sessions").findOneAndUpdate(
      {
        status: enums.SessionStatus.REJECTED || enums.SessionStatus.CANCELLED,
      },
      {
        $set: { status: "LOCKED" },
      },
      { session, sort: { scheduled_start: 1 } }
    );

    if (!freeSlot) {
      await session.abortTransaction();
    }

    // finding the patient in the waiting list // based on preference
    const waiting = await mongoose.model("waiting_list").findOneAndUpdate(
      {
        status: enums.WaitingListStatus.WAITING,
        activity: freeSlot.clinic_id,
        $or: [
          { preferred_therapist: null },
          { preferred_therapist: freeSlot.therapist.id },
        ],
      },
      { $set: { status: enums.WaitingListStatus.ASSIGNED } },
      { session, sort: { createdAt: 1 } }
    );

    if (!waiting) {
      await mongoose
        .model("sessions")
        .updateOne(
          { _id: freeSlot._id },
          { $set: { status: enums.SessionStatus.APPROVAL_PENDING } },
          { session }
        );

      await session.commitTransaction();
      return;
    }
    await mongoose.model("sessions").updateOne(
      { _id: freeSlot._id },
      {
        $set: {
          status: enums.SessionStatus.APPROVAL_PENDING,
          patient: waiting.patient,
        },
      },
      { session }
    );

    await mongoose
      .model("waiting_list")
      .updateOne(
        { _id: waiting._id },
        { $set: { status: enums.WaitingListStatus.ASSIGNED } },
        { session }
      );

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    console.error("Assignment failed:", error);
  } finally {
    session.endSession();
  }
};
