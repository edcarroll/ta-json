import {serialize} from './methods/serialize';
import {deserialize} from './methods/deserialize';
import {JsonValue, IParseOptions, Constructor} from './types';

export class JSON {
    public static deserialize<T>(object:any, type?:Constructor<T>, options?:IParseOptions):T {
        return deserialize(object, type as Function, options);
    }
    
    public static parse<T>(json:string, type?:Constructor<T>, options?:IParseOptions):T {
        return this.deserialize<T>(global.JSON.parse(json), type, options);
    }

    public static serialize(value:any):any {
        return serialize(value);
    }

    public static stringify(object:any):string {
        return global.JSON.stringify(this.serialize(object));
    }
}