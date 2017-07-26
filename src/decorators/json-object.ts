import {getDefinition} from '../classes/object-definition';

export function JsonObject() {
    return function(constructor:Function):void {
        getDefinition(constructor);
    };
}