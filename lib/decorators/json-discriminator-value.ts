import {getDefinition} from '../classes/object-definition';

export function JsonDiscriminatorValue(value:any) {
    return function(constructor:Function):void {
        getDefinition(constructor).discriminatorValue = value;
    };
}