import {Constructor} from '../types';
import {objectDefinitions} from '../classes/object-definition';

export function deserialize<T>(object:any, type:Constructor<T>) {
    let output = Object.create(type.prototype);

    if (!objectDefinitions.has(type)) {
        return output;
    }

    const definition = objectDefinitions.get(type);


    return output;
}