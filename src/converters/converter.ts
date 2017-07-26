import { DateConverter } from "./date-converter";
import { BufferConverter } from "./buffer-converter";
import { JsonValue } from "../types";

export interface IPropertyConverter {
    serialize(property:any):JsonValue;
    deserialize(value:JsonValue):any;
}

export const propertyConverters:Map<Function, IPropertyConverter> = new Map<Function, IPropertyConverter>();

propertyConverters.set(Buffer, new BufferConverter());
propertyConverters.set(Date, new DateConverter());
