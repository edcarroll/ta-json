import {getDefinition} from '../classes/object-definition';

export function JsonConstructor() {
    return function(target:any, key:string):void {
        let definition = getDefinition(target.constructor);

        definition.ctr = target[key];
    };
}