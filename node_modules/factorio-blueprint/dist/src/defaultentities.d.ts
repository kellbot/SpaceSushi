export interface EntityDescription {
    type?: string;
    width?: number;
    height?: number;
    parameters?: boolean;
    alertParameters?: boolean;
    inventorySize?: number;
    directionType?: boolean;
    filterAmount?: boolean;
    combinator?: boolean;
    modules?: number;
    recipe?: boolean;
    maxElectricReach?: number;
}
declare const DEFAULT_ENTITIES: {
    [entity_name: string]: EntityDescription;
};
export default DEFAULT_ENTITIES;
