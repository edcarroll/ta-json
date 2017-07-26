import { IPropertyConverter } from "./converter";

export class DateConverter implements IPropertyConverter {
    public serialize(property:Date):string {
        return property.toString();
    }

    public deserialize(value:string):Date {
        return new Date(value);
    }
}
