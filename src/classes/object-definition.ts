import { PropertyDefinition } from "./property-definition";
import { JsonValueObject } from "../types";

export class ObjectDefinition {
    public ctr:() => void;
    public beforeDeserialized:() => void;
    public onDeserialized:() => void;
    public discriminatorProperty?:string;
    public discriminatorValue:any;
    public properties:Map<string, PropertyDefinition>;

    constructor() {
        this.ctr = () => {};
        this.beforeDeserialized = () => {};
        this.onDeserialized = () => {};
        this.properties = new Map<string, PropertyDefinition>();
    }

    public getProperty(key:string):PropertyDefinition {
        let property = this.properties.get(key);
        if (!property) {
            property = new PropertyDefinition();
            this.properties.set(key, property);
        }
        return property;
    }
}

export const objectDefinitions:Map<Function, ObjectDefinition> = new Map<Function, ObjectDefinition>();

export function getDefinition(target:Function):ObjectDefinition {
    let definition = objectDefinitions.get(target);
    if (!definition) {
        definition = new ObjectDefinition();
        objectDefinitions.set(target, definition);
    }
    return definition;
}

export function getInheritanceChain(type:Object):Function[] {
    if (!type) {
        return [];
    }
    const parent = Object.getPrototypeOf(type);
    return [type.constructor].concat(getInheritanceChain(parent));
}

function getChildClassDefinitions(parentType:Function):[Function, ObjectDefinition][] {
    const childDefs:[Function, ObjectDefinition][] = [];

    objectDefinitions.forEach((def, type) => {
        const superClass = Object.getPrototypeOf(type.prototype).constructor;
        if (superClass === parentType) {
            childDefs.push([type, def]);
        }
    });

    return childDefs;
}

export function getTypedInheritanceChain(type:Function, object?:JsonValueObject):Function[] {
    const parentDef = objectDefinitions.get(type);

    let childDefs:[Function, ObjectDefinition][] = [];

    if (object && parentDef && parentDef.discriminatorProperty) {
        childDefs = childDefs.concat(getChildClassDefinitions(type));
    }

    let actualType:Function | undefined;

    while (childDefs.length !== 0 && !actualType) {
        const [t, def] = childDefs.shift()!; // We are checking the length in the loop so an assertion here is fine.

        if (def.hasOwnProperty("discriminatorValue")) {
            if (object && parentDef) {
                if (def.discriminatorValue === object[parentDef.discriminatorProperty!]) {
                    if (def.hasOwnProperty("discriminatorProperty")) {
                        return getTypedInheritanceChain(t, object);
                    }
                    actualType = t;
                } else {
                    childDefs = childDefs.concat(getChildClassDefinitions(t));
                }
            }
        } else {
            childDefs = childDefs.concat(getChildClassDefinitions(t));
        }
    }

    if (!actualType) {
        actualType = type;
    }

    const inheritanceChain = new Set<Function>(getInheritanceChain(Object.create(actualType.prototype)));
    return Array.from(inheritanceChain).filter(t => objectDefinitions.has(t));
}
