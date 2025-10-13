import { Schema, model } from "mongoose";
import {type Contact, type Address, type Organisations, type WorkingHour, type FixedCost } from "../types/interface.types.js";
import enums from "../enums.json" with {type:"json"}

const workingHourSchema = new Schema<WorkingHour>(
    {
    day: { type: String, required: true },
    startTime: { type: String, required: false, default: null },
    endTime: { type: String, required: false, default: null },
  },
  { _id: false }
);

const addressSchema = new Schema<Address>(
  {
    city: { type: String, required: true },
    country:{type:String,required:true},
    address:{type:String,required:true},
    postal_code: { type: String, required: true },
  },
  { _id: false }
);

const contactSchema = new Schema<Contact>({
  name: {type:String,required:true},
  role: {type:String,required:true,ref:"roles"},
  phone: {type:String,required:true,unique:true},
  email: {type:String,required:true,unique:true}
})

const fixedCostSchema = new Schema<FixedCost>(
  {
    type: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    recurrence: {
      type: String,
      enum: ["monthly", "yearly"],
      required: true,
    },
    description: { type: String, trim: true },
  },
  { _id: false }
);

const organisationSchema: Schema<Organisations> = new Schema({
 org_name: {type:String,required:true,unique:true},
  org_type: {type:Schema.Types.String,enum:enums.OrganisationType as any,required:true},
  institution_code: {type:String,required:true,unique:true},
  internal_code: {type:String,required:true,unique:true},
  building_size: {type:Number,required:true},

  area_in: {type:Schema.Types.String,enum:enums.AreaIn as any,required:true},
  number_of_rooms: {type:Number,required:true},
  protected_space: {type:Boolean,required:true},
  operating_hours: [workingHourSchema],
  address: addressSchema,
  number_of_patients: {type:Number,required:true},
  contacts: [contactSchema],

  is_deleted: {type:Boolean,default:false},
  fixed_cost: [fixedCostSchema]
},{timestamps:true});

const organisationModel = model<Schema>(
  "organisations",
  organisationSchema,
  "organisations"
);

export default organisationModel;