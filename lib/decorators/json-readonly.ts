import {getDefinition} from '../classes/object-definition';

export function JsonReadonly(type:Function) {
    return function(target:any, key:string):void {
        let property = getDefinition(target.constructor).getProperty(key);

        property.readonly = true;
    };
}