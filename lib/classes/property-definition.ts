import {IPropertyConverter} from '../converters/converter';
import {Constructor} from '../types';

export class PropertyDefinition {
    type:Constructor<any>;
    collection:boolean = false;
    readonly:boolean = false;
    converter:IPropertyConverter;
    serializedName:string;

    constructor() {}
}