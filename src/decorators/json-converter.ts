import { getDefinition } from "../classes/object-definition";
import { IPropertyConverter } from "../converters/converter";
import { ParameterlessConstructor } from "../types";

// tslint:disable:ext-variable-name only-arrow-functions

export function JsonConverter(converter:IPropertyConverter | ParameterlessConstructor<IPropertyConverter>):PropertyDecorator {
    return function(target:any, key:string | symbol):void {
        const property = getDefinition(target.constructor).getProperty(key.toString());

        if (typeof converter === "function") {
            property.converter = new converter();
        } else {
            property.converter = converter;
        }
    };
}
