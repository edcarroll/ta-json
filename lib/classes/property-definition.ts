import {IPropertyConverter} from '../converters/converter';

export class PropertyDefinition {
    type:Function;
    array:boolean = false;
    set:boolean = false;
    readonly:boolean = false;
    converter:IPropertyConverter;
    serializedName:string;

    constructor() {}
}