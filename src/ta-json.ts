import { serialize } from "./methods/serialize";
import { deserialize } from "./methods/deserialize";
import { IParseOptions } from "./types";

export class TaJson {
    public static deserialize<T>(object:any, type?:Function, options?:IParseOptions):T {
        return deserialize(object, type, options);
    }

    public static parse<T>(json:string, type?:Function, options?:IParseOptions):T {
        return this.deserialize<T>(JSON.parse(json), type, options);
    }

    public static serialize(value:any):any {
        return serialize(value);
    }

    public static stringify(object:any):string {
        return JSON.stringify(this.serialize(object));
    }
}
