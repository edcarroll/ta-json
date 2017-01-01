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

@JsonObject()
export class Another {
    @JsonProperty()
    @JsonConverter(new BufferConverter("base64"))
    public what:Buffer;

    constructor(what:string) {
        this.what = Buffer.from(what);
    }
}

@JsonObject()
export class Test {
    @JsonProperty()
    @JsonReadonly()
    public another:string;

    @JsonProperty()
    public date:Date;

    @JsonProperty()
    public buffer:Buffer;

    @JsonProperty()
    @JsonElementType(Another)
    public array:Another[];
}

let t = new Test();
t.another = "hello";
t.date = new Date();
t.buffer = Buffer.from("hello, world!");
t.array = [new Another("hello"), new Another("world")];

let output = JSON.parse(JSON.stringify(t), Test);

let c = "hello";