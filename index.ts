export * from "./lib/json";
export * from "./lib/types";
export * from "./lib/decorators";
export * from "./lib/converters";

import {JSON} from "./lib/json";
import {JsonObject, JsonDiscriminatorProperty, JsonProperty, JsonDiscriminatorValue} from "./lib/decorators";

export enum AnimalType { Cat = 0, Dog = 1 }

@JsonObject()
@JsonDiscriminatorProperty("type")
export class Animal {
    @JsonProperty()
    type:AnimalType;
}

@JsonObject()
@JsonDiscriminatorValue(AnimalType.Cat)
export class Cat extends Animal {
    constructor() {
        super();
        this.type = AnimalType.Cat;
    }
}

@JsonObject()
@JsonDiscriminatorValue(AnimalType.Dog)
export class Dog extends Animal {
    constructor() {
        super();
        this.type = AnimalType.Dog;
    }
}

let animals = [new Cat(), new Dog()];

console.log(JSON.parse<Animal[]>('[{"type":0},{"type":1}]', Animal)); //