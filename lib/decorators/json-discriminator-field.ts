import {getDefinition} from '../classes/object-definition';

export function JsonDiscriminatorField(field:string) {
    return function(constructor:Function):void {
        getDefinition(constructor).discriminatorField = field;
    };
}