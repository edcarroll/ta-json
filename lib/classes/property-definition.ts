import {IPropertyConverter} from '../converters/converter';

export class PropertyDefinition {
    type:Function;
    collection:boolean = false;
    readonly:boolean = false;
    converter:IPropertyConverter;
    serializedName:string;

    constructor() {}
}