export * from "./lib/json";
export * from "./lib/types";
export * from "./lib/decorators";
export * from "./lib/converters";

import {JsonObject} from './lib/decorators/json-object';
import {JsonProperty} from './lib/decorators/json-property';
import {JsonConverter} from './lib/decorators/json-converter';
import {BufferConverter} from './lib/converters/buffer-converter';
import {JSON} from './lib/json';

@JsonObject()
export class Test {
    @JsonProperty()
    public another:string;

    @JsonProperty()
    public date:Date;

    @JsonProperty()
    public buffer:Buffer;
}

let t = new Test();
t.another = "hello";
t.date = new Date();
t.buffer = Buffer.from("hello, world!")

let output = JSON.serialize(t);

let b = "hi";