import {serialize} from './methods/serialize';
import {deserialize} from './methods/deserialize';
import {JsonValue, ParameterlessConstructor} from './types';

export class JSON {
    public static deserialize<T>(object:JsonValue, type?:Function):T {
        return deserialize(object, type);
    }
    
    public static parse<T>(json:string, type?:Function):T {
        return this.deserialize<T>(global.JSON.parse(json), type);
    }

    public static serialize(value:any):JsonValue {
        return serialize(value);
    }

    public static stringify(object:any):string {
        return global.JSON.stringify(this.serialize(object));
    }
}