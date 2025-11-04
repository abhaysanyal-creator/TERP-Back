import { Types, Document } from "mongoose";

export interface ICountry {
  name: string;
  code: string;
}

export interface IState {
  country: {
    _id: Types.ObjectId;
    name: string;
  };
  name: string;
  code: string;
}

export interface ICity {
  country: {
    _id: Types.ObjectId;
    name: string;
  };
  state: {
    _id: Types.ObjectId;
    name: string;
  };
  name: string;
}

export interface ICountryDocument extends ICountry, Document<Types.ObjectId> {
  _id: Types.ObjectId;
}

export interface IStateDocument extends IState, Document<Types.ObjectId> {
  _id: Types.ObjectId;
}

export interface ICityDocument extends ICity, Document<Types.ObjectId> {
  _id: Types.ObjectId;
}

export type UploadModule = "employees" | "patients" | "orgDocs";

export interface UploadCategoryMap {
  employees: string;
  patients: string;
  orgDocs:string;
}

// export interface UploadCategoryMap {
//   employees: "aadhaar" | "pan" | "resume" | "certificates";
//   patients: "reports" | "prescriptions" | "insurance";
//   orgDocs:
//     | "gst"
//     | "licenses"
//     | "agreements"
//     | "invoices"
//     | "bills"
//     | "contracts"
//     | "leave-forms";
// }

export type UploadCategory<M extends UploadModule> = UploadCategoryMap[M];

export interface UploadParams<M extends UploadModule = UploadModule> {
  organisation_id: string;
  module: M;
  entityId?: string;
  category?: UploadCategory<M>;
  fileType: string;
  fileName: string;
}
