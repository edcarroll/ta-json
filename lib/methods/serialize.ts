import {propertyConverters} from './../converters/converter';
import {objectDefinitions} from './../classes/object-definition';
import {PropertyDefinition} from '../classes/property-definition';
import {JsonValue} from '../types';

export interface IDynamicObject {
    constructor:Function;
    [name:string]:any;
}

export function serialize(object:IDynamicObject):JsonValue {
    if (!objectDefinitions.has(object.constructor)) {
        return object;
    }

    const definition = objectDefinitions.get(object.constructor);

    let output:IDynamicObject = {};

    definition.properties.forEach((p, key) => {
        if (!p.type) {
            throw new Error(`Cannot serialize property '${key}' without type!`)
        }

        if (p.collection) {
            output[p.serializedName] = serializeArray(object[key], p);
            return;
        }
        
        output[p.serializedName] = serializeObject(object[key], p);
    });

    return output;
}

function serializeArray(array:IDynamicObject[], definition:PropertyDefinition):JsonValue {
    return array.map(v => serializeObject(v, definition));
}

function serializeObject(object:IDynamicObject, definition:PropertyDefinition):JsonValue {
    let primitive = definition.type === String || definition.type === Boolean || definition.type === Number;
    let value:any = object;

    if (!primitive) {
        let converter = definition.converter || propertyConverters.get(definition.type);
        let objDefinition = objectDefinitions.get(definition.type);

        if (converter) {
            return converter.serialize(value);
        }

        if (objDefinition) {
            return serialize(value);
        }
    }

    return value;
}