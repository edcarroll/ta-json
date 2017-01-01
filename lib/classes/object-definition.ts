import {PropertyDefinition} from './property-definition';

export class ObjectDefinition {
    public ctr:() => void;
    public properties:Map<string, PropertyDefinition> = new Map<string, PropertyDefinition>();

    public getProperty(key:string) {
        let property = this.properties.get(key);
        if (!property) {
            property = new PropertyDefinition();
            this.properties.set(key, property);
        }
        return property;
    }

    constructor() {}
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