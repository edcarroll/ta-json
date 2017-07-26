import {IPropertyConverter} from './converter';
import {JsonValueArray, JsonValue} from '../types';

type JsonBuffer = { type:string, data:JsonValueArray };

export class BufferConverter implements IPropertyConverter {
    private _encoding:string;

    public serialize(property:Buffer):JsonValue {
        if (this._encoding == "json") {
            return <JsonBuffer>property.toJSON();
        }
        return property.toString(this._encoding);
    }

    public deserialize(value:JsonValue):Buffer {
        if (this._encoding == "json") {
            return Buffer.from((value as JsonBuffer).data);
        }
        return Buffer.from(value as string, this._encoding);
    }

    constructor(encoding:string = "json") {
        this._encoding = encoding;
    }
}