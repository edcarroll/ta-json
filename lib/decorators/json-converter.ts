import {getDefinition} from '../classes/object-definition';
import {IPropertyConverter} from '../converters/converter';

export interface ParameterlessConstructor<T> {
    name?:string;
    new():T;
}

export function JsonConverter(converter:IPropertyConverter | ParameterlessConstructor<IPropertyConverter>) {
    return function(target:any, key:string):void {
        let property = getDefinition(target.constructor).getProperty(key);

        if (typeof converter === "function") {
            property.converter = new converter();
        }
        else {
            property.converter = converter;
        }
    };
}