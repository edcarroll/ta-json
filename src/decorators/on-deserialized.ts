import { getDefinition } from "../classes/object-definition";

// tslint:disable:ext-variable-name only-arrow-functions

export function OnDeserialized():PropertyDecorator {
    return function(target:any, key:string | symbol):void {
        const definition = getDefinition(target.constructor);

        definition.onDeserialized = target[key.toString()];
    };
}
