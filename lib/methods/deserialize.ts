import {JsonValue, IDynamicObject, JsonValueObject, JsonValueArray} from '../types';
import {objectDefinitions} from '../classes/object-definition';
import {PropertyDefinition} from '../classes/property-definition';
import {propertyConverters} from '../converters/converter';

export function deserialize(object:JsonValue, type:Function) {
    if (object.constructor === Array) {
        return (object as JsonValueArray).map(o => deserializeRootObject(o, type));
    }

    return deserializeRootObject(object, type);
}

function deserializeRootObject(object:JsonValue, type:Function = Object) {
    if (!objectDefinitions.has(type)) {
        return object;
    }

    let output = Object.create(type.prototype);

    const definition = objectDefinitions.get(type);

    definition.properties.forEach((p, key) => {
        if (!p.type) {
            throw new Error(`Cannot deserialize property '${key}' without type!`)
        }

        let value = (object as JsonValueObject)[p.serializedName];

        if ((value === null || value === undefined) || p.readonly) {
            return;
        }

        if (p.array || p.set) {
            output[key] = deserializeArray(value, p);
            if (p.set) {
                output[key] = new Set(output[key]);
            }
            return;
        }
        
        output[key] = deserializeObject(value, p);
    });

    if (definition.ctr) {
        definition.ctr.call(output);
    }

    return output;
}

function deserializeArray(array:JsonValue, definition:PropertyDefinition):IDynamicObject {
    return (array as JsonValueArray).map(v => deserializeObject(v, definition));
}

function deserializeObject(object:JsonValue, definition:PropertyDefinition):IDynamicObject {
    let primitive = definition.type === String || definition.type === Boolean || definition.type === Number;
    let value:any = object;

    if (!primitive) {
        let converter = definition.converter || propertyConverters.get(definition.type);
        let objDefinition = objectDefinitions.get(definition.type);

        if (converter) {
            return converter.deserialize(value);
        }

        if (objDefinition) {
            return deserialize(value, definition.type);
        }
    }

    return value;
}