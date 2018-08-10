import { IPropertyConverter } from "../converters/converter";

export class PropertyDefinition {
    public type:Function;
    public array:boolean = false;
    public set:boolean = false;
    public readonly:boolean = false;
    public writeonly:boolean = false;
    public converter:IPropertyConverter;
    public serializedName:string;
}
