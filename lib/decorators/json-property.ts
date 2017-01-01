import {jsonObjectDefinitions, getDefinition} from '../dictionary';

export interface IJsonPropertyOptions {
    propertyName:string;
}

export class JsonObjectPropertyDefinition {
    options:IJsonPropertyOptions;

    constructor() {}
}

export function JsonProperty(propertyName?:string) {
    return function(target:any, key:string):void {
        let options:IJsonPropertyOptions = {
            propertyName: propertyName || key
        }

        getDefinition(target.constructor).getProperty(key).options = options;
    };
}