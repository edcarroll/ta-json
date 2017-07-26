import { getDefinition } from "../classes/object-definition";

// tslint:disable:ext-variable-name only-arrow-functions

export function JsonDiscriminatorProperty(property:string):ClassDecorator {
    return function(constructor:Function):void {
        getDefinition(constructor).discriminatorProperty = property;
    };
}
