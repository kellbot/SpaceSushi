import Victor from 'victor';
import Blueprint from './index';
type PositionGrid = {
    [location: string]: Entity;
};
type Side = 1 | 2 | 'in' | 'out';
type Color = 'red' | 'green';
type Priority = 'left' | 'right';
type DirectionType = 'input' | 'output';
interface Connection {
    entity: Entity;
    color: Color;
    side: Side;
    id?: string;
}
interface CombinatorData {
    left?: string;
    right?: string;
    operator?: string;
    out?: string;
    controlEnable?: boolean;
    readContents?: boolean;
    readMode?: string;
    countFromInput?: boolean;
}
interface Constant {
    name: string;
    count: number;
}
interface AlertParameters {
    showAlert?: boolean;
    showOnMap?: boolean;
    icon?: string | {
        type: string;
        name: string;
    };
    message?: string;
}
export default class Entity {
    id: number;
    bp: Blueprint;
    name: string;
    position: Victor;
    direction: number;
    rawConnections: any;
    connections: Connection[];
    rawNeighbours?: number[];
    neighbours: Entity[];
    circuitParameters: any;
    condition: CombinatorData;
    constants?: {
        [position: number]: Constant;
    };
    constantEnabled: boolean;
    trainControlBehavior: Record<string, any>;
    parameters: any;
    alertParameters: AlertParameters;
    filters: {
        [position: number]: string;
    };
    requestFilters: {
        [position: number]: Constant;
    };
    directionType: DirectionType;
    recipe?: string;
    bar: number;
    modules: any;
    stationName?: string;
    manualTrainsLimit?: number;
    splitterFilter?: string;
    inputPriority: Priority | undefined;
    outputPriority: Priority | undefined;
    size: Victor;
    HAS_DIRECTION_TYPE: boolean;
    CAN_HAVE_RECIPE: boolean;
    CAN_HAVE_MODULES: number;
    INVENTORY_SIZE: number;
    constructor(data: any, bp: Blueprint, center?: boolean);
    parseConnections(entityList: any): void;
    parseFilters(filters: any): never[] | undefined;
    parseRequestFilters(request_filters: any): never[] | undefined;
    parseCondition(data: any): CombinatorData;
    parseConstants(data: any): {
        [position: number]: {
            name: string;
            count: number;
        };
    } | undefined;
    parseTrainControlBehavior(data: any): Record<string, any>;
    place(positionGrid: PositionGrid, entityList: any[]): this;
    remove(): false | Entity;
    removeCleanup(positionGrid: PositionGrid): this;
    topLeft(): Victor;
    topRight(): Victor;
    bottomRight(): Victor;
    bottomLeft(): Victor;
    center(): Victor;
    setTileData(positionGrid: PositionGrid): this;
    removeTileData(positionGrid: PositionGrid): this;
    checkNoOverlap(positionGrid: PositionGrid): boolean;
    getOverlap(positionGrid: PositionGrid): Entity | null;
    tileDataAction(positionGrid: PositionGrid, fn: (x: number, y: number) => void): void;
    connect(ent: Entity, mySide?: Side, theirSide?: Side, color?: Color): this;
    removeConnection(ent: Entity, mySide?: Side, theirSide?: Side, color?: Color): this;
    removeConnectionsWithEntity(ent: Entity, color: Color): this;
    removeAllConnections(): this;
    setFilter(pos: number, name: string): this;
    setRequestFilter(pos: number, name: string, count: number): this;
    removeAllFilters(): this;
    removeAllRequestFilters(): this;
    setCondition(opt: CombinatorData): this;
    setDirection(dir: number): this;
    setDirectionType(type: DirectionType): this;
    setRecipe(recipe: string): this;
    setBar(num: number): this;
    setCircuitParameters(obj: any): this;
    setParameters(obj: any): this;
    setAlertParameters(opt: AlertParameters): this;
    setConstant(pos: number, name: string, count: number): this;
    setStationName(name: string): this;
    setManualTrainsLimit(limit: number): this;
    setSplitterFilter(name: string): this;
    setInputPriority(priority?: Priority): this;
    setOutputPriority(priority?: Priority): this;
    getData(): {
        name: string;
        position: {
            x: number;
            y: number;
        };
        direction: number;
        entity_number: number;
        type: DirectionType | undefined;
        recipe: string | undefined;
        bar: number | undefined;
        station: string | undefined;
        manual_trains_limit: number | undefined;
        filter: string | undefined;
        input_priority: Priority | undefined;
        output_priority: Priority | undefined;
        items: {
            [name: string]: number;
        } | undefined;
        filters: any[] | undefined;
        request_filters: any[] | undefined;
        connections: {
            [side: string]: {
                [color: string]: {
                    entity_id: number;
                    circuit_id?: string | undefined;
                }[];
            };
        } | undefined;
        neighbours: number[];
        parameters: {
            playback_volume: any;
            playback_globally: any;
            allow_polyphony: any;
        } | undefined;
        alert_parameters: {
            show_alert: boolean;
            show_on_map: boolean;
            alert_message: string;
            icon_signal_id: string | {
                type: string;
                name: string;
            } | undefined;
        } | undefined;
        control_behavior: any;
    };
}
export {};
