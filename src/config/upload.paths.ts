import { UploadCategoryMap, UploadModule } from "../types/reference.types";

export const uploadPaths = {
  employees: ["aadhaar", "pan", "resume", "certificates"],
  patients: ["reports", "prescriptions", "insurance"],
  orgDocs: ["gst", "licenses", "agreements", "invoices", "bills", "contracts", "leave-forms"],
} as const satisfies Record<UploadModule, readonly string[]>;
