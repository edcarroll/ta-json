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
export class EntityRef {
    public _id:string;

    @JsonProperty()
    public id:string;

    @JsonConstructor()
    public copyId() {
        this._id = this.id;
    }
}

export class Another {
    public id:string;

    constructor(id:string) {
        this.id = id;
    }
}

@JsonObject()
export class Test {
    @JsonProperty()
    @JsonType(EntityRef)
    public array:Another;
}

let t = new Test();
t.array = new Another("Hello");

let output = JSON.parse<Test>(JSON.stringify(t), Test);

let c = "hello";