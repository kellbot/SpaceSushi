import Victor from 'victor';
import Blueprint from './index';
export default class Tile {
    id: number;
    bp: Blueprint;
    name: string;
    position: Victor;
    constructor(data: any, bp: Blueprint);
    remove(): false | Tile;
    getData(): {
        name: string;
        position: {
            x: number;
            y: number;
        };
    };
}
