import { getDefinition } from "../classes/object-definition";

// tslint:disable:ext-variable-name only-arrow-functions

export function JsonConstructor():PropertyDecorator {
    return function(target:any, key:string | symbol):void {
        const definition = getDefinition(target.constructor);

        definition.ctr = target[key.toString()];
    };
}
