import "reflect-metadata";
import {getDefinition} from '../classes/object-definition';

export function JsonProperty(propertyName?:string) {
    return function(target:any, key:string):void {
        let type = Reflect.getMetadata("design:type", target, key);

        let property = getDefinition(target.constructor).getProperty(key);
        property.serializedName = propertyName || key;
        property.array = type === Array;
        property.set = type === Set;
        if (!property.array && !property.set && !property.type) {
            property.type = type;
        }
    };
}