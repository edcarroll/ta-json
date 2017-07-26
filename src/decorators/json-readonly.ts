import {getDefinition} from '../classes/object-definition';

export function JsonReadonly() {
    return function(target:any, key:string):void {
        const property = getDefinition(target.constructor).getProperty(key);

        property.readonly = true;
    };
}