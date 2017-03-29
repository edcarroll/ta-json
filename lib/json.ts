import {serialize} from './methods/serialize';
import {deserialize} from './methods/deserialize';
import {JsonValue, ParameterlessConstructor, IParseOptions} from './types';

export class JSON {
    public static deserialize<T>(object:JsonValue, type?:Function, options?:IParseOptions):T {
        return deserialize(object, type, options);
    }
    
    public static parse<T>(json:string, type?:Function, options?:IParseOptions):T {
        return this.deserialize<T>(global.JSON.parse(json), type, options);
    }

    public static serialize(value:any):JsonValue {
        return serialize(value);
    }

    public static stringify(object:any):string {
        return global.JSON.stringify(this.serialize(object));
    }
}