import cron from "node-cron";
import { assigningWaitingListService } from "../services/assignWaitingListService";

cron.schedule("*/1 * * * *", async () => {
  await assigningWaitingListService();
});