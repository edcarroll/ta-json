import "reflect-metadata";
import {getDefinition} from '../classes/object-definition';

export function JsonProperty(propertyName?:string) {
    return function(target:any, key:string):void {
        let type = Reflect.getMetadata("design:type", target, key);

        let property = getDefinition(target.constructor).getProperty(key);
        property.serializedName = propertyName || key;
        property.collection = type === Array;
        if (!property.collection && !property.type) {
            property.type = type;
        }
    };
}