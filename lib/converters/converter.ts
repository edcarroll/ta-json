import {DateConverter} from './date-converter';
import {BufferConverter} from './buffer-converter';
import {JsonValue, Constructor} from '../types';

export interface IPropertyConverter {
    serialize(property:any):JsonValue;
    deserialize(value:JsonValue):any;
}

export const propertyConverters:Map<Constructor<any>, IPropertyConverter> = new Map<Constructor<any>, IPropertyConverter>();

propertyConverters.set(Buffer, new BufferConverter());
propertyConverters.set(Date, new DateConverter());