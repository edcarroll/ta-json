import {getDefinition} from '../classes/object-definition';
import {Constructor} from '../types';

export function JsonElementType(type:Constructor<any>) {
    return function(target:any, key:string):void {
        let property = getDefinition(target.constructor).getProperty(key);

        property.type = type;
    };
}