import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import isoWeek from "dayjs/plugin/isoWeek";
import enums from "../enums.json";
import { Recurrence } from "../types/interface.types";

dayjs.extend(weekday);
dayjs.extend(isoWeek);

export const generateRecurringSessions = (
  startDate: Date,
  recurrences: Recurrence
) => {
  const { repeat_every, repeat_on, ends, end_date, occurrences } = recurrences;

  const unit = repeat_every.unit.toLowerCase();
  const step = repeat_every.value;

  const sessions = [];
  let count = 0;
  let current = dayjs(startDate);

  const checkEnd = () => {
    if (ends === enums.RecurrenceEnds.DATE && current.isAfter(end_date))
      return true;
    if (
      ends === enums.RecurrenceEnds.AFTER_OCCURRENCES &&
      count >= occurrences!
    )
      return true;
    return false;
  };

  if (unit === enums.RecurrenceUnits.DAY) {
    while (!checkEnd()) {
      sessions.push(current.toDate());
      current = current.add(step, "day");
      count++;
    }
  }

  if (unit === enums.RecurrenceUnits.WEEK) {
    const weekdays: Record<string, number> = {
      SUN: 0,
      MON: 1,
      TUE: 2,
      WED: 3,
      THU: 4,
      FRI: 5,
      SAT: 6,
    };

    let safety = 0; // prevent infinite loops

    while (!checkEnd() && safety < 1000) {
      safety++;
      for (const day of repeat_on) {
        const target = current.weekday(weekdays[day]);
        // always skip past dates
        if (target.isBefore(dayjs(startDate))) continue;

        // if ending on date and past end_date, stop
        if (ends === enums.RecurrenceEnds.DATE && target.isAfter(end_date)) {
          return sessions;
        }

        sessions.push(target.toDate());
        count++;

        if (checkEnd()) return sessions;
      }

      // move to next week
      current = current.add(step, "week");
    }

    if (safety >= 1000) {
      console.warn("generateRecurringSessions: reached max iterations!");
    }
  }

  console.log("======================");
  if (unit === enums.RecurrenceUnits.MONTH) {
    while (!checkEnd()) {
      sessions.push(current.toDate());
      current = current.add(step, "month");
      count++;
    }
  }

  return sessions;
};
