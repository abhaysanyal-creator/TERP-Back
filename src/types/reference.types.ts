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
