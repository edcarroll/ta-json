import {getDefinition} from '../classes/object-definition';

export function JsonDiscriminatorProperty(property:string) {
    return function(constructor:Function):void {
        getDefinition(constructor).discriminatorProperty = property;
    };
}