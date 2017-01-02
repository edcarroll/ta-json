import {propertyConverters} from './../converters/converter';
import {PropertyDefinition} from '../classes/property-definition';
import {JsonValue, IDynamicObject} from '../types';
import {objectDefinitions, getInheritanceChain} from '../classes/object-definition';

export function serialize(value:IDynamicObject | IDynamicObject[], type?:Function):JsonValue {
    if (value.constructor === Array) {
        return (value as IDynamicObject[]).map(o => serializeRootObject(o, type));
    }

    return serializeRootObject(value as IDynamicObject, type);
}

function serializeRootObject(object:IDynamicObject, type?:Function):JsonValue {
    const inheritanceTree = new Set<Function>(getInheritanceChain(type ? Object.create(type.prototype) : object));
    const typedTree = Array.from(inheritanceTree).filter(t => objectDefinitions.has(t)).reverse();

    if (typedTree.length == 0) {
        return object;
    }

    const definitions = typedTree.map(t => objectDefinitions.get(t));

    const output:IDynamicObject = {};

    definitions.forEach(d => {
        d.properties.forEach((p, key) => {
            if (!p.type) {
                throw new Error(`Cannot serialize property '${key}' without type!`)
            }

            const value = object[key];

            if ((value === null || value === undefined) || p.writeonly) {
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
    });

    return output;
}

function serializeArray(array:IDynamicObject[], definition:PropertyDefinition):JsonValue {
    return array.map(v => serializeObject(v, definition));
}

function serializeObject(object:IDynamicObject, definition:PropertyDefinition):JsonValue {
    const primitive = definition.type === String || definition.type === Boolean || definition.type === Number;
    const value:any = object;

    if (!primitive) {
        const converter = definition.converter || propertyConverters.get(definition.type);
        const objDefinition = objectDefinitions.get(definition.type);

        if (converter) {
            return converter.serialize(value);
        }

        if (objDefinition) {
            if (value instanceof definition.type) {
                return serialize(value);
            }
            return serialize(value, definition.type);
        }
    }

    return value;
}