import {JsonObjectDefinition} from './decorators/json-object';

export const jsonObjectDefinitions:Map<Function, JsonObjectDefinition> = new Map<Function, JsonObjectDefinition>();

export function getDefinition(target:Function) {
    let definition = jsonObjectDefinitions.get(target);
    if (!definition) {
        definition = new JsonObjectDefinition();
        jsonObjectDefinitions.set(target, definition);
    }
    return definition;
}