import {IJsonObjectOptions} from './decorators/json-object';
import {jsonObjectDefinitions} from './dictionary';

export interface IDynamicObject {
    constructor:Function;
    [name:string]:any;
}

export function serialize(object:IDynamicObject):any {
    if (!jsonObjectDefinitions.has(object.constructor)) {
        return object;
    }

    const definition = jsonObjectDefinitions.get(object.constructor);

    let output:IDynamicObject = {};

    definition.properties.forEach((p, key) => {
        output[p.options.propertyName] = object[key];
    });

    return output;
}