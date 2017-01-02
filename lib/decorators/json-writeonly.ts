import {getDefinition} from '../classes/object-definition';

export function JsonWriteonly() {
    return function(target:any, key:string):void {
        let property = getDefinition(target.constructor).getProperty(key);

        property.writeonly = true;
    };
}