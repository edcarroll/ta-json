export * from "./lib/json";
export * from "./lib/types";
export * from "./lib/decorators";
export * from "./lib/converters";

import {JsonObject} from './lib/decorators/json-object';
import {JsonProperty} from './lib/decorators/json-property';
import {JsonConverter} from './lib/decorators/json-converter';
import {BufferConverter} from './lib/converters/buffer-converter';
import {JSON} from './lib/json';
import {JsonElementType} from './lib/decorators/json-element-type';
import {JsonReadonly} from './lib/decorators/json-readonly';
import {JsonConstructor} from './lib/decorators/json-constructor';
import {JsonType} from './lib/decorators/json-type';

@JsonObject()
export class Test {
    @JsonProperty()
    @JsonElementType(String)
    public set:Set<string>;
}

let t = new Test();

let output = JSON.stringify(t);

let c = "hello";