export type JsonValuePrimitive = string | number | boolean | null;
export interface JsonValueObject {
    [x:string]:JsonValue;
}
export interface JsonValueArray extends Array<JsonValue> {}

export type JsonValue = JsonValuePrimitive | JsonValueObject | JsonValueArray;