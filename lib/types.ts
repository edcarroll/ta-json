export type JsonPrimitive = string | number | boolean | null;
export interface JsonObject {
    [x:string]:JsonValue;
}
export interface JsonArray extends Array<JsonValue> {}
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;