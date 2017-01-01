import {IJsonObjectOptions} from './decorators/json-object';
import {propertyConverters} from './converters/converter';
import {objectDefinitions} from './classes/object-definition';

export interface IDynamicObject {
    constructor:Function;
    [name:string]:any;
}

export function serialize(object:IDynamicObject):any {
    if (!objectDefinitions.has(object.constructor)) {
        return object;
    }

    const definition = objectDefinitions.get(object.constructor);

    let output:IDynamicObject = {};

    definition.properties.forEach((p, key) => {
        if (!p.type) {
            throw new Error(`Cannot serialize property '${key}' without type!`)
        }

        let primitive = p.type === String || p.type === Boolean || p.type === Number;
        let value = object[key];

        if (!primitive) {
            let converter = p.converter || propertyConverters.get(p.type);
            let objDefinition = objectDefinitions.get(p.type);

            if (converter) {
                value = converter.serialize(value);
            }

            if (objDefinition) {
                value = serialize(value);
            }
        }
        
        output[p.serializedName] = value;
    });

    return output;
}