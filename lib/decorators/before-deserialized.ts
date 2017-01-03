import {getDefinition} from '../classes/object-definition';

export function BeforeDeserialized() {
    return function(target:any, key:string):void {
        const definition = getDefinition(target.constructor);

        definition.beforeDeserialized = target[key];
    };
}