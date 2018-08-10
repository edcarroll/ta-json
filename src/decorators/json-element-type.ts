import { getDefinition } from "../classes/object-definition";

// tslint:disable:ext-variable-name only-arrow-functions

export function JsonElementType(type:Function):PropertyDecorator {
    return function(target:any, key:string | symbol):void {
        const property = getDefinition(target.constructor).getProperty(key.toString());

        property.type = type;
    };
}
