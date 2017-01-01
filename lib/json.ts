import {serialize} from './methods/serialize';
import {deserialize} from './methods/deserialize';
import {Constructor, JsonValue} from './types';

export class JSON {
    public static deserialize<T>(object:JsonValue, type:Constructor<T>):T {
        return deserialize<T>(object, type);
    }
    
    public static parse<T>(json:string, type:Constructor<T>):T {
        return this.deserialize<T>(global.JSON.parse(json), type);
    }

    public static serialize(value:any):JsonValue {
        return serialize(value);
    }

    public static stringify(object:any) {
        return global.JSON.stringify(this.serialize(object));
    }
}