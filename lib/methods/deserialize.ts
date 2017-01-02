import {JsonValue, IDynamicObject, JsonValueObject, JsonValueArray} from '../types';
import {objectDefinitions, getInheritanceChain, getChildClassDefinitions} from '../classes/object-definition';
import {PropertyDefinition} from '../classes/property-definition';
import {propertyConverters} from '../converters/converter';

export function deserialize(object:JsonValue, type:Function) {
    if (object.constructor === Array) {
        return (object as JsonValueArray).map(o => deserializeRootObject(o, type));
    }

    return deserializeRootObject(object, type);
}

function deserializeRootObject(object:JsonValue, type:Function = Object):any {
    const inheritanceTree = new Set<Function>(getInheritanceChain(Object.create(type.prototype)));
    const typedTree = Array.from(inheritanceTree).filter(t => objectDefinitions.has(t)).reverse();

    const values = object as JsonValueObject;

    const childDefinitions = getChildClassDefinitions(type);
    if (childDefinitions.length > 0) {
        const parentDefinition = objectDefinitions.get(type);
        const childDef = childDefinitions.find(([type, def]) => def.discriminatorValue == values[parentDefinition.discriminatorProperty]);

        if (childDef) {
            return deserializeRootObject(object, childDef[0]);
        }
    }

    if (typedTree.length == 0) {
        return object;
    }

    const output = Object.create(type.prototype);

    const definitions = typedTree.map(t => objectDefinitions.get(t));

    definitions.forEach(d => {
        d.properties.forEach((p, key) => {
            if (!p.type) {
                throw new Error(`Cannot deserialize property '${key}' without type!`)
            }

            const value = values[p.serializedName];

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

        if (d.ctr) {
            d.ctr.call(output);
        }
    });

    return output;
}

function deserializeArray(array:JsonValue, definition:PropertyDefinition):IDynamicObject {
    return (array as JsonValueArray).map(v => deserializeObject(v, definition));
}

function deserializeObject(object:JsonValue, definition:PropertyDefinition):IDynamicObject {
    const primitive = definition.type === String || definition.type === Boolean || definition.type === Number;
    const value:any = object;

    if (!primitive) {
        const converter = definition.converter || propertyConverters.get(definition.type);
        const objDefinition = objectDefinitions.get(definition.type);

        if (converter) {
            return converter.deserialize(value);
        }

        if (objDefinition) {
            return deserialize(value, definition.type);
        }
    }

    return value;
}