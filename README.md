# Type-Aware JSON (ta-json)

Strongly typed JSON parser & serializer for TypeScript / ES7 via decorators. Supports parameterized class constructors, nesting classes, `Array`s and `Set`s, custom property converters and more.

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

## Decorators

### @JsonObject()

Registers the class with the serializer. Classes don't need to have parameterless constructors to be serialized and parsed - however this means that the internal state of a class must be fully represented by its serialized fields.

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

### @JsonConstructor

Specifies the method to run once a document has been deserialized into a class. This is useful for example when recalculating private members that aren't serialized into JSON.

#### Usage

```typescript
import {JsonObject, JsonProperty, JsonConstructor} from "ta-json";

@JsonObject()
export class Demo {
    private _unserialized:string;

    @JsonProperty()
    public serialized:string;

    @JsonConstructor()
    public jsonConstructor() {
        this._unserialized = doOperation(this.serialized);
    }
}
```

### @JsonConverter(converter:IPropertyConverter | ParameterlessConstructor<IPropertyConverter>)

Property converters can be used to define how a type is serialized / deserialized. They must implement the `IPropertyConverter` interface, and output a `JsonValue`.

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
        return property.split('').reverse().join('');
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

### @JsonReadonly

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

## API

### JSON

#### #stringify(value:any):string

Serializes an object or array into a JSON string. If type definitions aren't found for a given object it falls back to `global.JSON.stringify(value)`.

#### #parse<T>(json:string, type?:Function):T

Parses a JSON string into an instance of a class. the `type` parameter specifies which class to instantiate; however this is an optional parameter and as with `#stringify` it will fall back to `global.JSON.parse(json)`.

#### #serialize(value:any):JsonValue

Serializes an object or array into a `JsonValue`. This is an intermediary step; i.e. `global.JSON.stringify` can be called on the returned object to get a JSON string.

#### #deserialize<T>(object:JsonValue, type?:Function):T

Similarly to the above, this function can be run on objects produced by `global.JSON.parse`, returning the same output as `#parse`.