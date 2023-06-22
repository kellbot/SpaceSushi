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
                this.createStraightBlueprint({ name: "Simple Straight Track" }), // Basic straight rail
                this.createStraightBlueprint({ poleSpacing: 2, label: "Simple Straight Track" }), // Basic straight rail, fewer power poles
                this.createCornerBlueprint(),
                this.createIntersectionT(),
                this.createCurveTest()
            ];
    }

    createCurveTest() {
        let test = new RailSection(this);
        for (let i = 0; i < 8; i++) {
            test.createEntity('curved-rail', { x: 8 * i, y: -20 }, i);

        }
        return test;

    }

    createStraightBlueprint({ poleSpacing = 3, label = 'Straight Rail', connections = ["red", "green"] } = {}) {
        let straightRail = new RailSection(this);
        straightRail.name = label;
        straightRail.description = "A straight section of track";
        straightRail.createStraightRail({ poleSpacing: poleSpacing, label: label, connections: connections });
        straightRail.setSnapping();
        return straightRail;
    }

    createCornerBlueprint() {
        let cornerRail = new RailSection(this);
        cornerRail.name = "Curved Track";
        cornerRail.createCurvedRail();

        cornerRail.addRailConnections({ left: true, bottom: true });
        //cornerRail.setSnapping();
        cornerRail.wirePoles();
        this.cornerRail = cornerRail;
        return cornerRail;
    }

    createIntersectionT() {
        let tRail = new RailSection(this);
        tRail.name = "T Intersection";
        tRail.createStraightRail();
        tRail.createCurvedRail({ allowOverlap: true });
        tRail.createCurvedRail({ allowOverlap: true, rotate: true });
        tRail.addRailConnections({ left: true, bottom: true, right: true });
        //Signal direction points to rail
        let signalPositions = [
            // top and bottom middle
            { pos: { x: this.gridSize / 2 - 1, y: tRail.topY - 1 }, dir: Blueprint.RIGHT },
            { pos: { x: this.gridSize / 2 - 1, y: tRail.bottomY + 2 }, dir: Blueprint.LEFT },
            // bottom 1/4 and 3/4
            { pos: { x: this.gridSize / 4 - 1, y: tRail.bottomY + 2 }, dir: Blueprint.LEFT },
            { pos: { x: this.gridSize / 4 * 3, y: tRail.bottomY + 2 }, dir: Blueprint.LEFT },
            // above / below right curve
            { pos: { x: this.gridSize / 4 * 3, y: tRail.topY + 3 }, dir: Blueprint.RIGHT - 1 },
            { pos: { x: this.gridSize / 4 * 3, y: tRail.bottomY + 9 }, dir: Blueprint.LEFT + 1 },
            // above / below left curve
            { pos: { x: this.gridSize / 4 - 1, y: tRail.topY + 3 }, dir: Blueprint.RIGHT + 1 },
            { pos: { x: this.gridSize / 4 - 1, y: tRail.bottomY + 9 }, dir: Blueprint.LEFT + 1 },
            // inside triangle curves
            { pos: { x: this.gridSize / 2 - 4, y: tRail.bottomY + 4 }, dir: Blueprint.RIGHT + 1 },
            { pos: { x: this.gridSize / 2 + 3, y: tRail.bottomY + 4 }, dir: Blueprint.RIGHT - 1 },
        ];

        signalPositions.forEach(s => {
            tRail.createEntity('rail-chain-signal', s.pos, s.dir, true);
        });
        //tRail.setSnapping();
        return tRail;

    }


    generate() {
        this.blueprints.forEach(bp => { bp.addLandfill() });
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
        this.leftX = parent.gridSize / 2 - parent.trackSpacing / 2 - 2;
        this.rightX = parent.gridSize / 2 + parent.trackSpacing / 2;
        this.signals = []; // array of signals entities, for easier manipulation later
        this.poles = []; //Poles, which likely need to be connected

        console.log("Rotation test");
        let test = { ent: 'straight-rail', pos: { x: this.rightX, y: this.gridSize / 2 - 2 }, dir: Blueprint.UP };
        console.log(test.pos);
        console.log(RailSection.rotateCoordinate(test.pos, this.gridSize));
    }

    static flip(num) {
        if (num == 1) return 5;
        if (num == 7) return 3;
        if (num == 3) return 7;
        if (num == 5) return 1;

    }
    // entity offset is used for dealing with things like curved rail which have weird anchor points 
    static rotateCoordinate(pos, size, entityOffset = { w: 1, h: 1 }) {
        let newPos = {};
        newPos.x = size / 2 + pos.y; // Calculate the new X coordinate
        newPos.y = size / 2 - pos.x; // Calculate the new Y coordinate
        //from lower right quadrant
        if (pos.x > size / 2 && pos.y > 0) {
            newPos.y -= entityOffset.w;
            // from lower left quardrant
        } else if (pos.x < size / 2 && pos.y > 0) {
            newPos.y -= entityOffset.w;
            // upper left quadrant
        } else if (pos.x < size / 2 && pos.y < 0) {
            newPos.y -= entityOffset.w;
        }
        return newPos;

    }
    static rotateDirection(dir, curve = false) {
        if (curve) {
            if (curve == 3) return 1;
        } else {
            dir = dir - 2;
            if (dir > 7) {
                dir = dir % 8;
            } else if (dir < 0) {
                dir = 8 + dir;
            }
        }
        return dir;
    }
    // Places landfill under all entities
    addLandfill() {
        this.entities.forEach(e => {
            // Curved rails are shaped weird
            if (e.name == 'curved_rail') {
                // special handling for rail landfill
                let landfillShape = [
                    [0, 1, 0, 0, 0],
                    [1, 1, 1, 0, 0],
                    [1, 1, 1, 1, 0],
                    [0, 1, 1, 1, 0],
                    [0, 0, 1, 1, 1],
                    [0, 0, 0, 1, 1],
                    [0, 0, 0, 1, 1],
                    [0, 0, 0, 1, 1],
                ];
                let offset= {x: 0, y: 0};
                switch (e.direction) {
                    case 0:
                        offset = { x: -3, y: -4 };
                        break;
                    case 1: offset = { x: -2, y: -4 };
                        landfillShape = flipMatrix(landfillShape);
                        break;
                    case 2:
                        landfillShape = rotateMatrix90C(landfillShape);
                        offset = { x: -4, y: -3 };
                        break;
                    case 3: offset = { x: -4, y: -2 };
                        landfillShape = flipMatrix(landfillShape);
                        landfillShape = rotateMatrix90C(landfillShape);
                        break;
                    case 4:
                        offset = { x: -2, y: -4 };
                        landfillShape = rotateMatrix90C(landfillShape);
                        landfillShape = rotateMatrix90C(landfillShape);
                        break;
                    case 5: offset = { x: -3, y: -4 };
                        landfillShape = flipMatrix(landfillShape, "vertical");
                        break;
                    case 6:
                        offset = { x: -4, y: -2 };
                        landfillShape = rotateMatrix90C(landfillShape);
                        landfillShape = rotateMatrix90C(landfillShape);
                        landfillShape = rotateMatrix90C(landfillShape);
                        break;
                    case 7: offset = { x: -4, y: -3 };
                        landfillShape = flipMatrix(landfillShape, "vertical");
                        landfillShape = rotateMatrix90C(landfillShape);
                        break;

                }
                landfillShape.forEach((data, row) => {
                    data.forEach((hasLandfill, col) => {
                        if (hasLandfill) {
                            let nudge = {x: 0, y: 0};
                    
                            // if (e.position.y > 0 && e.position.x > this.gridSize/2) nudge.y += 0.5;
                            //if (e.position.x < 24) nudge.x -= 0.5;
                            this.createTile('landfill', { x: e.position.x + col + offset.x + nudge.x, y: e.position.y + row + offset.y + nudge.y });
                        }
                    });
                })
            
            } else {
                for (let x = 0; x < e.size.x; x++) {
                    for (let y = 0; y < e.size.y; y++) {
                        if (e.diretion % 2 == 0) {
                            this.createTile('landfill', { x: e.position.x + x, y: e.position.y + y });
                        } else  {
                            let offset = {x: 0, y: 0};
                             if  (e.direction == 7 || e.direction == 3) {
                                 offset.y = e.position.y < 0 ? 0 : -1;
                            } else if (e.direction == 1 || e.direction == 5) {
                                offset.x = e.position.y > 0 ? -1 : 0;
                            }
                            this.createTile('landfill', { x: e.position.x + x + offset.x, y: e.position.y + y + offset.y});
                        }
                    }
                }
            }
        
        })
}
createCurvedRail({ allowOverlap = false, rotate = false } = {}) {
    let rails = [
        { ent: 'straight-rail', pos: { x: 2, y: this.topY }, dir: Blueprint.RIGHT, entityOffset: { w: 2, h: 2 } },
        { ent: 'straight-rail', pos: { x: this.rightX, y: this.gridSize / 2 - 2 }, dir: Blueprint.UP, entityOffset: { w: 2, h: 2 } },
        { ent: 'curved-rail', pos: { x: 8, y: this.topY + 2 }, dir: 3, entityOffset: { w: -2, h: 0 } },
        { ent: 'curved-rail', pos: { x: 6, y: this.bottomY + 2 }, dir: 3, entityOffset: { w: -2, h: 0 } },
        { ent: 'curved-rail', pos: { x: 8 + 2 * this.trackSpacing, y: this.bottomY + 16 }, dir: 0, entityOffset: { w: -2, h: 0 } },
        { ent: 'curved-rail', pos: { x: 16 + 2 * this.trackSpacing, y: this.gridSize / 2 - 6 }, dir: 0, entityOffset: { w: -2, h: 0 } },
    ];


    let runs = [
        { from: { x: 10, y: this.topY + 4 }, to: { x: 12 + 2 * this.trackSpacing, y: this.topY + 18 } },
        { from: { x: 8, y: this.bottomY + 4 }, to: { x: 4 + 2 * this.trackSpacing, y: this.bottomY + 12 } }
    ]
    if (rotate) {
        rails.map(r => {
            r.pos = RailSection.rotateCoordinate(r.pos, this.gridSize, r.entityOffset);
            r.dir = RailSection.rotateDirection(r.dir);
        })
        runs.map(r => {
            r.to = RailSection.rotateCoordinate(r.to, this.gridSize, { w: -2, h: -2 });
            r.from = RailSection.rotateCoordinate(r.from, this.gridSize, { w: -2, h: -2 });
        })
    }

    rails.forEach(r => {
        this.createEntity(r.ent, r.pos, r.dir, allowOverlap);
    });

    runs.forEach(r => {
        this.runRail(r.from, r.to);
    })

    let polePosistions = [
        { x: -1, y: -1 },
        { x: this.leftX - 5, y: this.bottomY + 5 },
        { x: this.gridSize / 2 - 1, y: this.gridSize / 2 - 1 }
    ];
    if (rotate) {
        polePosistions.map(p => {
            p = RailSection.rotateCoordinate(p, this.gridSize);
        })
    }
    polePosistions.forEach(position => {
        let pole;
        try {
            if (pole = this.createEntity('big-electric-pole', position, 0, true))
                this.poles.push(pole);
        } catch (e) {
            console.log(e);
            console.log(position);
        }
    });

}
createStraightRail({ poleSpacing = 3, label = 'Straight Rail', connections =["red", "green"] } = {}) {
    this.addRailConnections({ left: true, right: true });
    this.runRail({ x: 2, y: this.topY }, { x: this.gridSize - 2, y: this.topY });
    this.runRail({ x: 2, y: this.bottomY }, { x: this.gridSize - 2, y: this.bottomY });
    this.runPower(0, this.gridSize, poleSpacing, connections);
}
setSnapping() {
    this.fixCenter({ x: 0, y: this.gridSize / 2 * -1 });
    this.snapping = {
        grid: { x: this.gridSize, y: this.gridSize },
        position: { x: 1, y: 1 },
        absolute: true
    };
}
//adds two pieces of rail on the sides that will connect to other sections
addRailConnections(directions = { left: true, right: true }) {
    if (directions.left) {
        this.createEntity('straight-rail', { x: 0, y: this.topY }, Blueprint.RIGHT, true);
        this.createEntity('straight-rail', { x: 0, y: this.bottomY }, Blueprint.RIGHT, true);
        this.createEntity('rail-signal', { x: 0, y: this.topY - 1 }, Blueprint.RIGHT, true);
    }
    if (directions.right) {
        this.createEntity('straight-rail', { x: this.gridSize, y: this.topY }, Blueprint.RIGHT, true);
        this.createEntity('straight-rail', { x: this.gridSize, y: this.bottomY }, Blueprint.RIGHT, true);
        this.createEntity('rail-signal', { x: this.gridSize - 1, y: this.bottomY + 2 }, Blueprint.LEFT, true);

    }
    if (directions.bottom) {
        this.createEntity('straight-rail', { x: this.leftX, y: this.gridSize / 2 }, Blueprint.UP, true);
        this.createEntity('straight-rail', { x: this.rightX, y: this.gridSize / 2 }, Blueprint.DOWN, true);
        this.createEntity('rail-signal', { x: this.leftX - 1, y: this.gridSize / 2 }, Blueprint.UP, true);
    }
    if (directions.top) {
        this.createEntity('straight-rail', { x: this.leftX, y: -this.gridSize / 2 }, Blueprint.UP, true);
        this.createEntity('straight-rail', { x: this.rightX, y: -this.gridSize / 2 }, Blueprint.DOWN, true);
        this.createEntity('rail-signal', { x: this.rightX + 1, y: -this.gridSize / 2 }, Blueprint.UP, true);
    }
}

wirePoles(connections = ["red", "green"]) {
    this.poles.forEach((pole, i) => {
        if (i > 0) {
            connections.forEach(c => {
                pole.connect(this.poles[i - 1], null, null, c)
            });
        }
    })
}
runRail(from = { x: 0, y: 0 }, to = { x: this.gridSize, y: 0 }) {

    let direction;
    if (from == to) return false
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
            this.createEntity('straight-rail', { x: i, y: from.y }, direction, true);
            //diagonal
        } else if (direction == 7) {
           this.createEntity('straight-rail', { x: i, y: from.y - xJump * j - 2 }, direction, true);
           if (i + 1 <= to.x)  this.createEntity('straight-rail', { x: i, y: from.y - xJump * j - 4 }, RailSection.flip(direction), true);

        } else {
            this.createEntity('straight-rail', { x: i, y: from.y + xJump * j }, direction, true);
            if (i + 1 <= to.x) this.createEntity('straight-rail', { x: i + 2, y: from.y + xJump * j }, RailSection.flip(direction), true);
        }
        j++;

    }
}
runPower(from, to, spacing = 3, connections = ["red", "green"]) {
    let distance = to - from;

    for (let i = from; i <= to; i += Math.floor(distance / spacing)) {
        this.poles.push(this.createEntity('big-electric-pole', { x: i - 1, y: -1 }));
    }
    this.wirePoles(connections);


}

}


const rotateMatrix90C = source => {
    // get the dimensions of the source matrix
    const M = source.length;
    const N = source[0].length;

    // create a new NxM destination array
    let destination = new Array(N);
    for (let i = 0; i < N; i++) {
        destination[i] = new Array(M);
    }

    // start copying from source into destination
    for (let i = 0; i < N; i++) {
        for (let j = 0; j < M; j++) {
            destination[i][j] = source[M - j - 1][i];
        }
    }

    // return the destination matrix
    return destination;
};

function flipMatrix(matrix, direction = "horizontal") {
    const flippedMatrix = [];

    if (direction === "horizontal") {
        for (let i = 0; i < matrix.length; i++) {
            flippedMatrix.push(matrix[i].slice().reverse());
        }
    } else if (direction === "vertical") {
        flippedMatrix.push(...matrix.slice().reverse());
    } else if (direction === "both") {
        for (let i = matrix.length - 1; i >= 0; i--) {
            flippedMatrix.push(matrix[i].slice().reverse());
        }
    }

    return flippedMatrix;
}