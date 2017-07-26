import { getDefinition } from "../classes/object-definition";

// tslint:disable:ext-variable-name only-arrow-functions

export function JsonType(type:Function):PropertyDecorator {
    return function(target:any, key:string):void {
        const property = getDefinition(target.constructor).getProperty(key);

        property.type = type;
    };
}
