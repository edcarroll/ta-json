import "reflect-metadata";
import { getDefinition } from "../classes/object-definition";

// tslint:disable:ext-variable-name only-arrow-functions

export function JsonProperty(propertyName?:string):PropertyDecorator {
    return function(target:any, key:string):void {
        const type = Reflect.getMetadata("design:type", target, key);

        const property = getDefinition(target.constructor).getProperty(key);
        property.serializedName = propertyName || key;
        property.array = type === Array;
        property.set = type === Set;
        if (!property.array && !property.set && !property.type) {
            property.type = type;
        }
    };
}
