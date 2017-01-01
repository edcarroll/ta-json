import {getDefinition} from '../classes/object-definition';
import {IPropertyConverter} from '../converters/converter';
import {ParameterlessConstructor} from '../types';

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