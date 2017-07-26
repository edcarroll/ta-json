# Type-Aware JSON Parser & Serializer (ta-json)

<a href="https://www.npmjs.com/package/ta-json">
  <img alt="npm" src="https://img.shields.io/npm/v/ta-json.svg?style=flat-square" />
</a>
<a href="https://travis-ci.org/edcarroll/ta-json">
  <img alt="Travis CI" src="https://img.shields.io/travis/edcarroll/ta-json.svg?style=flat-square" />
</a>

Strongly typed JSON parser & serializer for TypeScript / ES7 via decorators.

Supports [parameterized class constructors](#jsonobject), nesting classes, [inheritance](#jsondiscrimatorpropertypropertystring--jsondiscriminatorvaluevalueany), [`Array`s and `Set`s](#jsonelementtypetypefunction), [custom property converters](#jsonconverterconverteripropertyconverter--parameterlessconstructor) and more.

## Installation

```sh
$ npm install --save ta-json
```

## Quickstart

Import the necessary decorators and the JSON object from the library, and set up your class.

```typescript
import {JSON, JsonObject, JsonProperty} from "ta-json";

@JsonObject()
export class Person {
    @JsonProperty()
    public firstName:string;

    @JsonProperty()
    public lastName:string;

    public get fullName() {
        return `${this.firstName} ${this.lastName}`;
    }

    // Note this parameterized constructor
    constructor(fullName:string) {
        let [firstName, lastName] = fullName.split(" ");
        this.firstName = firstName;
        this.lastName = lastName;
    }
}
```

Parse and stringify with the provided JSON class. Note that you can use this class to work with untyped objects as usual.

```typescript
let person = new Person("Edward Carroll");
JSON.stringify(person); // {"firstName":"Edward","lastName":"Carroll"}

let fromJson = JSON.parse<Person>('{"firstName":"Edward","lastName":"Carroll"}', Person);
person instanceof Person; // true
person.fullName; // Edward Carroll
```

For more advanced usage please read the docs below for each of the available decorators.

## Decorators

### @JsonObject()

Registers the class with the serializer. Classes don't need to have parameterless constructors to be serialized and parsed - however this means that the internal state of a class must be fully represented by its serialized fields.

If you would like to run functions before and after deserialization, please see [@BeforeDeserialized()](#beforedeserialized) and [@OnDeserialized()](#ondeserialized)

#### Usage

```typescript
import {JsonObject} from "ta-json";

@JsonObject()
export class Person {}
```

### @JsonProperty(serializedName?:string)

Properties are mapped on an opt-in basis. *Only properties that are decorated are serialized*. The name for the property in the serialized document can optionally be specified using this decorator.

#### Usage

```typescript
import {JsonObject, JsonProperty} from "ta-json";

@JsonObject()
export class Person {
    @JsonProperty("fullName")
    public name:string;

    @JsonProperty()
    public get firstName() {
        return this.name.split(" ").shift();
    }
}
```

### @JsonType(type:Function)

Specifies the type to be used when serializing a property. Useful when you want to serialize the field using a different type than the type of the property itself, for example an entity reference.

#### Usage

```typescript
import {JsonObject, JsonProperty, JsonType} from "ta-json";

@JsonObject()
export class Person {
    @JsonProperty()
    @JsonType(String)
    public name:string;
}
```

### @JsonElementType(type:Function)

Specifies the type to be used when serializing elements of an `Array` or `Set`. This is a required decorator when working with these types due to how metadata reflection works.

#### Usage

```typescript
import {JsonObject, JsonProperty, JsonElementType} from "ta-json";

@JsonObject()
export class LotteryDraw {
    @JsonProperty()
    @JsonElementType(Number)
    public numbers:Set<number>;
}
```

### @JsonDiscrimatorProperty(property:string) & @JsonDiscriminatorValue(value:any)

These decorators are used when you want to deserialize documents while respecting the class inheritance hierarchy. The discriminator property is used to determine the type of the document, and the descriminator value is set on each subclass (or deeper subclasses) so the document can be matched to the appropriate class.

Multi-level inheritance is fully supported, by the @JsonDiscriminatorValue and the @JsonDiscriminatorProperty decorators being applied to the same class.

#### Usage

```typescript
import {JSON, JsonObject, JsonProperty, JsonDiscriminatorProperty, JsonDiscriminatorValue} from "ta-json";

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

JSON.stringify(animals); // [{"type":0},{"type":1}]
JSON.parse<Animal[]>('[{"type":0},{"type":1}]', Animal); // [ Cat { type: 0 }, Dog { type: 1 } ]
```

### @BeforeDeserialized()

Specifies the method to run before a document has been deserialized into a class, but after the class has been instantiated. This is useful for setting default values that may be overwritten by the deserialization.

#### Usage

```typescript
import {JsonObject, JsonProperty, BeforeDeserialized} from "ta-json";

@JsonObject()
export class Demo {
    @JsonProperty()
    public serialized:string;

    @BeforeDeserialized()
    public setDefaults() {
        this.serialized = "default value";
    }
}
```

### @OnDeserialized()

Specifies the method to run once a document has been deserialized into a class. This is useful for example when recalculating private members that aren't serialized into JSON.

#### Usage

```typescript
import {JsonObject, JsonProperty, OnDeserialized} from "ta-json";

@JsonObject()
export class Demo {
    private _unserialized:string;

    @JsonProperty()
    public serialized:string;

    @OnDeserialized()
    public onDeserialized() {
        this._unserialized = doOperation(this.serialized);
    }
}
```

### @JsonConstructor()

Specifies the method to be *optionally* run before a document has been deserialized. The specified method is only run when `runConstructor` is set to `true` in the parse options.

#### Usage

```typescript
import {JSON, JsonObject, JsonProperty, JsonConstructor} from "ta-json";

@JsonObject()
export class Demo {
    @JsonProperty()
    public example:string;

    constructor(example:string) {
        this.defaultValues(example);
    }

    @JsonConstructor()
    private defaultValues(example:string = "default") {
        this.example = example;
    }
}

JSON.parse<Demo>('{}', Demo, { runConstructor: true }); // Demo { example: 'default' }
JSON.parse<Demo>('{"example":"different"}', Demo, { runConstructor: true }) // Demo { example: 'different' }
JSON.parse<Demo>('{}', Demo); // Demo {}
```

### @JsonConverter(converter:IPropertyConverter | ParameterlessConstructor<IPropertyConverter>)

Property converters can be used to define how a type is serialized / deserialized. They must implement the `IPropertyConverter` interface, and output a `JsonValue`.

There are two built in converters, `DateConverter` and `BufferConverter`. They are applied automatically when serializing `Date` and `Buffer` objects.

#### Example

This example uses the built in `BufferConverter`, to output Buffer values as base64 encoded strings. Note that when parsing documents, the deserializer will convert the value back into a Buffer.

```typescript
import {JSON, JsonObject, JsonProperty, JsonConverter, BufferConverter} from "ta-json";

@JsonObject()
export class ConverterDemo {
    @JsonProperty()
    @JsonConverter(new BufferConverter("base64"))
    public bufferValue:Buffer;

    constructor(value:string) {
        this.bufferValue = Buffer.from(value);
    }
}

let demo = new ConverterDemo("hello, world!");
JSON.stringify(demo); // {"bufferValue":"aGVsbG8sIHdvcmxkIQ=="}
let parsed = JSON.parse<ConverterDemo>('{"bufferValue":"aGVsbG8sIHdvcmxkIQ=="}', ConverterDemo);
parsed.bufferValue instanceof Buffer; // true
parsed.bufferValue.toString(); // hello, world!
```

#### Usage

Below we define a converter that reverses any string value it is given.

```typescript
import {JSON, JsonObject, JsonProperty, JsonConverter, IPropertyConverter} from "ta-json";

export class ReverseStringConverter implements IPropertyConverter {
    public serialize(property:string):string {
        return property.split('').reverse().join('');
    }

    public deserialize(value:string):string {
        return value.split('').reverse().join('');
    }
}

@JsonObject()
export class Demo {
    @JsonProperty()
    @JsonConverter(ReverseStringConverter)
    public example:string;
}

let d = new Demo();
d.example = "hello";
JSON.stringify(d); // {"example":"olleh"}
```

Note that you can also provide an instance of a property converter, for example if you want to customize the output. (This is how the `BufferConverter` chooses a string encoding).

### @JsonReadonly()

The use of this decorator stops the property value being read from the document by the deserializer.

#### Usage

```typescript
import {JSON, JsonObject, JsonProperty, JsonReadonly} from "ta-json";

@JsonObject()
export class Person {
    @JsonProperty()
    @JsonReadonly()
    public name:string;
}

JSON.parse<Person>('{"name":"Edward"}', Person).name; // undefined
```

### @JsonWriteonly()

The use of this decorator stops the property value being written to the document by the serializer. Useful for password fields for example.

#### Usage

```typescript
import {JSON, JsonObject, JsonProperty, JsonReadonly} from "ta-json";

@JsonObject()
export class User {
    @JsonProperty()
    @JsonWriteonly()
    public password:string;
}

let u = new User();
u.password = "p4ssw0rd";

JSON.stringify(u); // {}
JSON.parse<User>('{"password":"p4ssw0rd"}', User).password; // p4ssw0rd
```

## API

### JSON

#### #stringify(value:any):string

Serializes an object or array into a JSON string. If type definitions aren't found for a given object it falls back to `global.JSON.stringify(value)`.

#### #parse<T>(json:string, type?:Function, options?:IParseOptions):T

Parses a JSON string into an instance of a class. the `type` parameter specifies which class to instantiate; however this is an optional parameter and as with `#stringify` it will fall back to `global.JSON.parse(json)`.

##### IParseOptions

* runConstructor:boolean - specifies whether the method decorated with @JsonConstructor() is run upon class initialisation. **Default `false`**

#### #serialize(value:any):any

Serializes an object or array into a `JsonValue`. This is an intermediary step; i.e. `global.JSON.stringify` can be called on the returned object to get a JSON string. This function is useful when returning from inside an express (o.e) middleware.

#### #deserialize<T>(object:any, type?:Function, options?:IParseOptions):T

Similarly to the above, this function can be run on objects produced by `global.JSON.parse`, returning the same output as `#parse`. This function is useful in combination with body parsing modules, where the raw JSON has already been parsed into an object.
