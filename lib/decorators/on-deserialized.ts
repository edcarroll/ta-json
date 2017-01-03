import {getDefinition} from '../classes/object-definition';

export function OnDeserialized() {
    return function(target:any, key:string):void {
        const definition = getDefinition(target.constructor);

        definition.onDeserialized = target[key];
    };
}