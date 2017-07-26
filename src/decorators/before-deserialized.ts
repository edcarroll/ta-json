import { getDefinition } from "../classes/object-definition";

// tslint:disable:ext-variable-name only-arrow-functions

export function BeforeDeserialized():PropertyDecorator {
    return function(target:any, key:string):void {
        const definition = getDefinition(target.constructor);

        definition.beforeDeserialized = target[key];
    };
}
