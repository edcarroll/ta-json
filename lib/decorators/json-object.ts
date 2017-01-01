import {getDefinition} from '../classes/object-definition';

export interface IJsonObjectOptions {

}

export function JsonObject() {
    return function(constructor:Function):void {
        let options:IJsonObjectOptions = {}

        getDefinition(constructor).options = options;
    };
}