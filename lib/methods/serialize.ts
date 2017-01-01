import {propertyConverters} from './../converters/converter';
import {objectDefinitions} from './../classes/object-definition';
import {PropertyDefinition} from '../classes/property-definition';
import {JsonValue, IDynamicObject} from '../types';

export function serialize(value:IDynamicObject | IDynamicObject[], type?:Function):JsonValue {
    if (value.constructor === Array) {
        return (value as IDynamicObject[]).map(o => serializeRootObject(o, type));
    }

    return serializeRootObject(value as IDynamicObject, type);
}

function serializeRootObject(object:IDynamicObject, type:Function = object.constructor):JsonValue {
    if (!objectDefinitions.has(type)) {
        return object;
    }

    const definition = objectDefinitions.get(type);

    let output:IDynamicObject = {};

    definition.properties.forEach((p, key) => {
        if (!p.type) {
            throw new Error(`Cannot serialize property '${key}' without type!`)
        }
        
        let value = object[key];

        if (value === null || value === undefined) {
            return;
        }

        if (p.set) {
            output[p.serializedName] = serializeArray(Array.from(value || []), p);
            return;
        }

        if (p.array) {
            output[p.serializedName] = serializeArray(value, p);
            return;
        }
        
        output[p.serializedName] = serializeObject(value, p);
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
            return serialize(value, definition.type);
        }
    }

    return value;
}