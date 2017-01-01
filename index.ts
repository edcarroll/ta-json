import {JsonObject} from './lib/decorators/json-object';
import {JsonProperty} from './lib/decorators/json-property';
import {serialize} from './lib/serialize';
import {JsonConverter} from './lib/decorators/json-converter';
import {BufferConverter} from './lib/converters/buffer-converter';

export * from "./lib/decorators/json-object";
export * from "./lib/decorators/json-property";
export * from "./lib/decorators/json-type";
export * from "./lib/decorators/json-element-type";

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

let output = serialize(t);

let b = "hi";