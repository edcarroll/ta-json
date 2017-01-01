import {jsonObjectDefinitions, getDefinition} from '../dictionary';
import {JsonObjectPropertyDefinition} from './json-property';

export class JsonObjectDefinition {
    public options:IJsonObjectOptions = {};
    public properties:Map<string, JsonObjectPropertyDefinition> = new Map<string, JsonObjectPropertyDefinition>();

    public getProperty(key:string) {
        let property = this.properties.get(key);
        if (!property) {
            property = new JsonObjectPropertyDefinition();
            this.properties.set(key, property);
        }
        return property;
    }

    constructor() {}
}

export interface IJsonObjectOptions {

}

export function JsonObject() {
    return function(constructor:Function):void {
        let options:IJsonObjectOptions = {}

        getDefinition(constructor).options = options;
    };
}