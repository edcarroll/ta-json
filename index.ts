import {JsonObject} from './lib/decorators/json-object';
import {JsonProperty} from './lib/decorators/json-property';
import {serialize} from './lib/serialize';

export * from "./lib/decorators/json-object";
export * from "./lib/decorators/json-property";

@JsonObject()
export class Test {
    @JsonProperty()
    public another:string;
}

let t = new Test();
t.another = "hello";

let output = serialize(t);

let b = "hi";