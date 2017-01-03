import {PropertyDefinition} from './property-definition';

export class ObjectDefinition {
    public beforeDeserialized:() => void;
    public onDeserialized:() => void;
    public discriminatorProperty:string;
    public discriminatorValue:any;
    public properties:Map<string, PropertyDefinition>;

    public getProperty(key:string) {
        let property = this.properties.get(key);
        if (!property) {
            property = new PropertyDefinition();
            this.properties.set(key, property);
        }
        return property;
    }

    constructor() {
        this.beforeDeserialized = () => {};
        this.onDeserialized = () => {};
        this.properties = new Map<string, PropertyDefinition>();
    }
}

export const objectDefinitions:Map<Function, ObjectDefinition> = new Map<Function, ObjectDefinition>();

export function getDefinition(target:Function) {
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
    return [type.constructor].concat(getInheritanceChain(parent))
}

export function getChildClassDefinitions(parentType:Function) {
    const parentDef = getDefinition(parentType);
    const childDefs:[Function, ObjectDefinition][] = [];

    if (parentDef.discriminatorProperty) {
        objectDefinitions.forEach((def, type) => {
            const superClass = Object.getPrototypeOf(type.prototype).constructor;
            if (superClass == parentType) {
                childDefs.push([type, def]);
            }
        });
    }
    return childDefs;
}