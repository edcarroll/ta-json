import {serialize} from './methods/serialize';

export class JSON {
    public static parse<T>(json:string) {

    }

    public static serialize(object:any) {
        return serialize(object);
    }

    public static stringify(object:any) {
        return global.JSON.stringify(this.serialize(object));
    }
}