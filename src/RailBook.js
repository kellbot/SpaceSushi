import Blueprint from '@kellbot/factorio-blueprint';
//import seData from './assets/data.json';

export default class RailBook {
    constructor() {
        // ** These things should be customizable //
        this.trackSpacing = 6; //how many spaces between tracks
        this.gridSize = 48; // How big are the grid snaps, defaults to one chunk
        this.wires = true; // include red and green wires

        // ***** //

        this.blueprints =
            [
                // Straight rails
                this.createStraightRail({ name: "Simple Straight Track" }), // Basic straight rail
                this.createStraightRail({ poleSpacing: 2, label: "Simple Straight Track" }), // Basic straight rail, fewer power poles
                this.createCornerRail()
            ];


    }

    createStraightRail({ poleSpacing = 3, label = 'Straight Rail', connections = ["red", "green"] } = {}) {
        let straightRail = new RailSection(this);
        straightRail.name = label;
        straightRail.description = "A straight section of track";
        straightRail.addRailConnections({ left: true, right: true });
        straightRail.runRail({ x: 2, y: straightRail.topY }, { x: this.gridSize - 2, y: straightRail.topY });
        straightRail.runRail({ x: 2, y: straightRail.bottomY }, { x: this.gridSize - 2, y: straightRail.bottomY });
        straightRail.runPower(-1, this.gridSize + 1, poleSpacing, connections);
        straightRail.fixCenter({ x: 0, y: -24 });
        straightRail.snapping = {
            grid: { x: 48, y: 48 },
            position: { x: 1, y: 1 },
            absolute: true
        };
        return straightRail;
    }

    createCornerRail() {
        let cornerRail = new RailSection(this);
        cornerRail.name = "Curved Track";
        cornerRail.addRailConnections({ left: true, bottom: true });
        cornerRail.createEntity('straight-rail', { x: 2, y: cornerRail.topY }, Blueprint.RIGHT);
        cornerRail.createEntity('straight-rail', { x: cornerRail.rightX, y: this.gridSize/2 -2 }, Blueprint.UP);
        cornerRail.createEntity('curved-rail', { x: 8, y: cornerRail.topY + 2 }, 3);
        cornerRail.createEntity('curved-rail', { x: 6, y: cornerRail.bottomY + 2 }, 3);
        cornerRail.runRail({ x: 10, y: cornerRail.topY + 4 }, { x: 12 + 2*this.trackSpacing, y: cornerRail.topY + 6 }, false);
        cornerRail.runRail({ x: 8, y: cornerRail.bottomY + 4 }, { x: 4 + 2*this.trackSpacing, y: cornerRail.bottomY + 8 }, false);
        cornerRail.createEntity('curved-rail', { x: 8 + 2*this.trackSpacing, y: cornerRail.bottomY + 16 }, 0);
        cornerRail.createEntity('curved-rail', { x: 16 + 2*this.trackSpacing, y: this.gridSize/2 - 6 }, 0);
        cornerRail.createEntity('big-electric-pole', {x: -1, y: -1});
        cornerRail.createEntity('big-electric-pole', {x: this.gridSize/2 - 1, y:this.gridSize/2 });
        cornerRail.setSnapping();
        return cornerRail;
    }


    generate() {
        return Blueprint.toBook(this.blueprints);
    }
}

class RailSection extends Blueprint {
    constructor(parent) {
        super();
        this.parent = parent;
        this.gridSize = parent.gridSize;
        this.trackSpacing = parent.trackSpacing;
        this.topY = 0 - parent.trackSpacing / 2 - 2
        this.bottomY = 0 + parent.trackSpacing / 2;
        this.leftX = parent.gridSize / 2 - parent.trackSpacing/2 - 2;
        this.rightX = parent.gridSize / 2 + parent.trackSpacing/2;
    }
    static flip(num) {
        if (num == 1) return 5;
        if (num == 7) return 3;
        if (num == 3) return 7;
        if (num == 5) return 1;

    }

    setSnapping() {
        this.fixCenter({ x: 0, y: this.gridSize/2 * -1 });
        this.snapping = {
            grid: { x:  this.gridSize, y:  this.gridSize },
            position: { x: 1, y: 1 },
            absolute: true
        };
    }
    //adds two pieces of rail on the sides that will connect to other sections
    addRailConnections(directions = { left: true, right: true }) {
        if (directions.left) {
            this.createEntity('straight-rail', { x: 0, y: this.topY }, Blueprint.RIGHT);
            this.createEntity('straight-rail', { x: 0, y: this.bottomY }, Blueprint.RIGHT);

        }
        if (directions.right) {
            this.createEntity('straight-rail', { x: this.gridSize, y: this.topY }, Blueprint.RIGHT);
            this.createEntity('straight-rail', { x: this.gridSize, y: this.bottomY }, Blueprint.RIGHT);

        }
        if (directions.bottom) {
            this.createEntity('straight-rail', { x: this.leftX, y: this.gridSize / 2}, Blueprint.UP);
            this.createEntity('straight-rail', { x: this.rightX, y: this.gridSize / 2 }, Blueprint.DOWN);

        }
    }
    runRail(from = { x: 0, y: 0 }, to = { x: this.gridSize, y: 0 }, signals = true) {

        let direction;
        if (from == 2) return false
        // Determine direction
        if (from.x == to.x) {
            direction = (from.y > to.y) ? Blueprint.DOWN : Blueprint.UP;
        } else if (from.y == to.y) {
            direction = (from.x > to.x) ? Blueprint.LEFT : Blueprint.RIGHT;
        } else if (from.x > to.x) {
            direction = (from.y > to.y) ? 5 : 3;
        } else {
            direction = (from.y > to.y) ? 7 : 1;
        }
        if (direction != Blueprint.UP && direction != Blueprint.DOWN);
        let xJump = from.x > to.x ? -2 : 2;


        let j = 0;
        for (let i = from.x; i <= to.x; i += xJump) {
            // straight across
            if (from.y == to.y) {
                this.createEntity('straight-rail', { x: i, y: from.y }, direction);
                //diagonal
            } else {
                this.createEntity('straight-rail', { x: i, y: from.y + xJump * j }, direction);
                if (i+1<= to.x) this.createEntity('straight-rail', { x: i + 2, y: from.y + xJump * j }, RailSection.flip(direction));
            }
            j++;

        }

        if (signals) {
            this.createEntity('rail-signal', { x: from.x, y: from.y - 1 }, direction);
        }

    }
    runPower(from, to, spacing = 3, connections = ["red", "green"]) {
        let distance = to - from;
        let poles = [];
        for (let i = from; i <= to; i += Math.floor(distance / spacing) ) {
            poles.push(this.createEntity('big-electric-pole', { x: i, y: -1 }));
        }
        poles.forEach(function (pole, i) {
            if (i > 0) {
                connections.forEach(c => {
                    pole.connect(poles[i - 1], null, null, c)
                });
            }
        })


    }

}