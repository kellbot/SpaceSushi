import Blueprint from '@kellbot/factorio-blueprint';

export default class RailSection extends Blueprint {
    constructor(parent) {
        super();
        this.parent = parent;
        this.gridSize = parent.gridSize;
        this.trackSpacing = parent.trackSpacing;
        // track spacing that isn't divisible by 4 causes problems with grid alignment, this is an attempt to combat that
        this.globalOffset = this.hasEvenSpacing() ? 0 : 1;

        this.guides = { zero: 0.5 - this.globalOffset, max: this.gridSize + 0.5 + this.globalOffset };
        this.guides.center = this.gridSize / 2 - this.guides.zero - this.globalOffset;
        this.guides.top = this.guides.center - this.trackSpacing / 2;

        this.guides.bottom = this.guides.top + this.trackSpacing;
        this.guides.left = this.guides.center - this.trackSpacing / 2;
        this.guides.right = this.guides.center + this.trackSpacing / 2;

        this.signals = []; // array of signals entities, for easier manipulation later
        this.poles = []; // These are the edge poles which sometimes other stuff needs to connect to


    }
    hasEvenSpacing() {
        return this.trackSpacing % 4 == 2;
    }
    createTwoLanesAcross() {
        for (let i = this.guides.zero; i < this.gridSize; i += 2) {
            this.createEntity('straight_rail', { x: i, y: this.guides.top }, Blueprint.RIGHT, true);
            this.createEntity('straight_rail', { x: i, y: this.guides.bottom }, Blueprint.LEFT, true);
        }
        let poleCount = Math.ceil(this.gridSize / 30) + 1;

        let poleDistance = this.gridSize / (poleCount - 1);

        let poles = [];
        for (let i = this.guides.zero - 1; i < this.gridSize; i += poleDistance) {
            if (i < 2) continue;
            if (i > this.gridSize - 2) continue;
            let position = { x: i + + this.globalOffset, y: this.guides.center };
            poles.push(this.createEntity('big-electric-pole', position, 0, false));

        }
        this.connectPower(poles.concat(this.poles));
    }
    createTwoLanesDown() {
        for (let i = this.guides.zero; i < this.gridSize; i += 2) {
            this.createEntity('straight_rail', { x: this.guides.left, y: i }, Blueprint.DOWN, true);
            this.createEntity('straight_rail', { x: this.guides.right, y: i }, Blueprint.UP, true);
        }
    }

    static flip(num) {
        if (num == 1) return 5;
        if (num == 7) return 3;
        if (num == 3) return 7;
        if (num == 5) return 1;

    }
    // entity offset is used for dealing with things like curved rail which have weird anchor points 
    static rotateCoordinate(pos, size, entityOffset = { w: 1, h: 1 }, iterations) {
        let newPos = {};
        newPos.x = pos.y; // Calculate the new X coordinate
        newPos.y = size - pos.x; // Calculate the new Y coordinate
        //from lower right quadrant
        if (pos.x > 0 && pos.y > 0) {
            newPos.y -= entityOffset.w;
            // from lower left quardrant
        } else if (pos.x < 0 && pos.y > 0) {
            newPos.y -= entityOffset.h;
            // upper left quadrant
        } else if (pos.x < 0 && pos.y < 0) {
            newPos.x -= entityOffset.w;
            // upper right quadrant
        } else {
            newPos.y -= entityOffset.w;
            newPos.x -= entityOffset.h;
        }
        if (iterations > 1) newPos = this.rotateCoordinate(newPos, size, entityOffset, iterations - 1);

        return newPos;


    }
    static rotateDirection(dir, rotations = 1) {
        dir = dir - 2;
        if (dir > 7) {
            dir = dir % 8;
        } else if (dir < 0) {
            dir = 8 + dir;
        }

        if (rotations > 1) dir = this.rotateDirection(dir, rotations - 1);

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
                let offset = { x: 0, y: 0 };
                switch (e.direction) {
                    case 0:
                        offset = { x: -4, y: -5 };
                        break;
                    case 1:
                        offset = { x: -3, y: -5 };
                        landfillShape = flipMatrix(landfillShape);
                        break;
                    case 2:
                        landfillShape = rotateMatrix90C(landfillShape);
                        offset = { x: -5, y: -4 };
                        break;
                    case 3: offset = { x: -5, y: -3 };
                        landfillShape = flipMatrix(landfillShape);
                        landfillShape = rotateMatrix90C(landfillShape);
                        break;
                    case 4:
                        offset = { x: -3, y: -5 };
                        landfillShape = rotateMatrix90C(landfillShape);
                        landfillShape = rotateMatrix90C(landfillShape);
                        break;
                    case 5:
                        offset = { x: -4, y: -5 };
                        landfillShape = flipMatrix(landfillShape, "vertical");
                        break;
                    case 6:
                        offset = { x: -5, y: -3 };
                        landfillShape = rotateMatrix90C(landfillShape);
                        landfillShape = rotateMatrix90C(landfillShape);
                        landfillShape = rotateMatrix90C(landfillShape);
                        break;
                    case 7:
                        offset = { x: -5, y: -4 };
                        landfillShape = flipMatrix(landfillShape, "vertical");
                        landfillShape = rotateMatrix90C(landfillShape);
                        break;

                }
                landfillShape.forEach((data, row) => {
                    data.forEach((hasLandfill, col) => {
                        if (hasLandfill) {
                            this.createTile('landfill', { x: e.position.x + col + offset.x, y: e.position.y + row + offset.y });
                        }
                    });
                })

            } else {
                if (e.name != 'straight_rail' || e.direction % 2 == 0) {
                    for (let x = 0; x < e.size.x; x++) {
                      for (let y = 0; y < e.size.y; y++) {

                         this.createTile('landfill', { x: e.position.x + x, y: e.position.y + y });
                        
                        }
                    }
                 } else {
                    let landfillShape = [
                        [1, 1],
                        [1, 0]
                    ];
                    switch( e.direction) {
                        case 3:
                            landfillShape = flipMatrix(landfillShape);
                            landfillShape = rotateMatrix90C(landfillShape);
                            break;
                        case 1: 
                          landfillShape = rotateMatrix90C(landfillShape);
                             break;
                        case 5: 
                        landfillShape = flipMatrix(landfillShape, "vertical");
                        break;

                    }
                    landfillShape.forEach((data, row) => {
                        data.forEach((hasLandfill, col) => {
                            if (hasLandfill) {
                                this.createTile('landfill', { x: e.position.x + col, y: e.position.y + row});
                            }
                        });
                    })
                   // this.createTile('landfill', { x: e.position.x, y: e.position.y });
                }
            }

        })
    }
    createCurvedRail({ allowOverlap = true, rotations = 0, poles = true } = {}) {

        let newPoles = []; // newly created poles that need to be connected to edges

        // These all need to be offset by 0.5 because of something weird in how factorio-blueprint handles curves
        let rails = [
            { ent: 'curved-rail', pos: { x: 7 - this.globalOffset, y: this.guides.top - this.guides.zero + 3 - this.globalOffset }, dir: 3, entityOffset: { w: -2, h: 0 } },
            { ent: 'curved-rail', pos: { x: 5 - this.globalOffset, y: this.guides.bottom - this.guides.zero + 3 - this.globalOffset }, dir: 3, entityOffset: { w: -2, h: 0 } },
            {
                ent: 'curved-rail', pos: {
                    x: this.guides.center + 1 - this.trackSpacing / 2 - this.guides.zero - this.globalOffset,
                    y: this.guides.max - this.globalOffset - 3 - this.guides.zero
                }, dir: 0, entityOffset: { w: -2, h: -2 }
            },
            { ent: 'curved-rail', pos: { x: this.guides.center + 1 + this.trackSpacing / 2 - this.guides.zero - this.globalOffset, y: this.guides.max - this.globalOffset - 5 - this.guides.zero }, dir: 0, entityOffset: { w: -2, h: -2 } },
        ];
        if (poles) {
            let poleCoordinate = {
                x: this.guides.zero + Math.round((this.guides.center + 4)/2),
                y: this.guides.max - Math.round((this.guides.center + 4)/2) - 2
            }
            rails.push(
                { ent: 'big-electric-pole', pos: poleCoordinate, dir: 0, entityOffset: { w: 1, h: 1 } }
            );
        }
        let runs = [
            {
                from: { x: this.guides.zero + 8, y: this.guides.top + 4 },
                to: { x: this.guides.right - 4, y: this.guides.max - 10 }
            },
            {
                from: { x: this.guides.zero + 6, y: this.guides.bottom + 4 },
                to: { x: this.guides.left - 4, y: this.guides.max - 8 }
            }
        ]
        if (rotations > 0) {
            rails.map(r => {
                r.pos = RailSection.rotateCoordinate(r.pos, this.gridSize, r.entityOffset, rotations);
                r.dir = RailSection.rotateDirection(r.dir, rotations);
            });
            runs.map(r => {
                r.to = RailSection.rotateCoordinate(r.to, this.gridSize, { w: -1, h: -1 }, rotations);
                r.from = RailSection.rotateCoordinate(r.from, this.gridSize, { w: -1, h: -1 }, rotations);
            });
        }

        rails.forEach(r => {
            let newEnt = this.createEntity(r.ent, r.pos, r.dir, allowOverlap);
            if (r.ent == 'big-electric-pole') {
                newPoles.push(newEnt);
            }
        });

        runs.forEach(r => {
            this.runRail(r.from, r.to);
        })

        if (poles) {
            this.connectPower(this.poles.concat(newPoles));
        }


    }

    setSnapping() {
        //this.fixCenter({ x: 0, y: this.gridSize / 2 * -1 });
        this.snapping = {
            grid: { x: this.gridSize, y: this.gridSize },
            absolute: true
        };
        if (this.trackSpacing % 4 == 0) {
            this.snapping.position = { x: 1, y: 1 }
        }
    }
    //adds two pieces of rail on the sides that will connect to other sections
    addRailConnections(directions = { left: true, right: true }, signals = true, poles = true,) {
        let sections = [];


        let rtsbase = [
            { entity: 'straight-rail', position: { x: this.guides.zero, y: this.guides.bottom }, direction: Blueprint.RIGHT, offset: { w: 1, h: 1 } },
            { entity: 'straight-rail', position: { x: this.guides.zero, y: this.guides.top }, direction: Blueprint.RIGHT, offset: { w: 1, h: 1 } }];
        if (signals) rtsbase.push({ entity: 'rail-signal', position: { x: this.guides.zero, y: this.guides.top - 1 }, direction: Blueprint.RIGHT, offset: { w: 0, h: 0 } });
        if (poles) rtsbase.push({ entity: 'big-electric-pole', position: { x: this.guides.zero - 1 + this.globalOffset, y: this.guides.center }, direction: Blueprint.RIGHT, offset: { w: 1, h: 1 } });


        if (directions.left) {
            sections.push({ entity: 'straight-rail', position: { x: this.guides.zero, y: this.guides.top }, direction: Blueprint.RIGHT });
            sections.push({ entity: 'straight-rail', position: { x: this.guides.zero, y: this.guides.bottom }, direction: Blueprint.RIGHT });
            if (signals) sections.push({ entity: 'rail-signal', position: { x: this.guides.zero, y: this.guides.top - 1 }, direction: Blueprint.RIGHT });
            if (poles) sections.push({ entity: 'big-electric-pole', position: { x: this.guides.zero - 1 + this.globalOffset, y: this.guides.center }, direction: Blueprint.RIGHT });

        }
        if (directions.bottom) {
            let bmap = rtsbase.map(entity => {
                let rotatedEntity = Object.assign({}, entity);
                rotatedEntity.position = RailSection.rotateCoordinate(rotatedEntity.position, this.gridSize, rotatedEntity.offset, 1);
                rotatedEntity.direction = RailSection.rotateDirection(rotatedEntity.direction);
                return rotatedEntity;
            });
            sections = sections.concat(bmap);
        }
        if (directions.right) {
            let bmap = rtsbase.map(entity => {
                let rotatedEntity = Object.assign({}, entity);
                rotatedEntity.position = RailSection.rotateCoordinate(rotatedEntity.position, this.gridSize, rotatedEntity.offset, 2);
                rotatedEntity.direction = RailSection.rotateDirection(rotatedEntity.direction, 2);
                return rotatedEntity;
            });
            sections = sections.concat(bmap);
        }
        if (directions.top) {
            let bmap = rtsbase.map(entity => {
                let rotatedEntity = Object.assign({}, entity);
                rotatedEntity.position = RailSection.rotateCoordinate(rotatedEntity.position, this.gridSize, rotatedEntity.offset, 3);
                rotatedEntity.direction = RailSection.rotateDirection(rotatedEntity.direction, 3);
                return rotatedEntity;
            });
            sections = sections.concat(bmap);
        }

        sections.forEach(s => {
            let newEnt = this.createEntity(s.entity, s.position, s.direction, true);
            if (s.entity == 'big-electric-pole') this.poles.push(newEnt);
        });

    }

    connectPower(poles, connections = ["red", "green"]) {
        //poles.sort((a, b) => a.position.x - b.position.x);
        connections.forEach(c => {
            poles.forEach((pole, i) => {
                poles.forEach((otherPole) => {
                    if (pole.position == otherPole.position) return; // it's the same pole
                    if (calculateDistance(pole.position, otherPole.position) > 30) return; // too far away
                    if (this.poles.includes(pole) && this.poles.includes(otherPole)) return; // don't connect edges to each other
                    pole.connect(otherPole, null, null, c);
                    if (!pole.neighbours.filter(n => (n.id == otherPole.id)).length)
                        pole.neighbours.push(otherPole);

                    if (!otherPole.neighbours.filter(n => (n.position == pole.position)).length)
                        otherPole.neighbours.push(pole);

                })

            });
        });
    }
    runRail(from = { x: 0, y: 0 }, to = { x: this.gridSize, y: 0 }) {

        if (isNaN(from.x) || isNaN(to.x) || isNaN(from.y) || isNaN(to.y)) throw new Error(`Error: Non number given for position ${JSON.stringify(from)} ${JSON.stringify(to)}`);

        let direction, target;
        if (from == to) return false
        // Determine direction
        if (from.x == to.x) {
            target = Math.abs(to.y - from.y);
            direction = (from.y > to.y) ? Blueprint.DOWN : Blueprint.UP;
        } else if (from.y == to.y) {
            target = Math.abs(to.x - from.x);
            direction = (from.x > to.x) ? Blueprint.RIGHT : Blueprint.RIGHT;
        } else if (from.x > to.x) {
            target = Math.abs(to.x - from.x);
            direction = (from.y > to.y) ? 5 : 3;
            to.x = to.x - 2;
        } else {
            target = Math.abs(to.x - from.x);
            direction = (from.y > to.y) ? 7 : 1;
        }
        //if (direction != Blueprint.UP && direction != Blueprint.DOWN);

        let xJump = from.x > to.x ? -1 : 1;
        let yJump = from.y > to.y ? -1 : 1;



        let x, y, s;
        for (let j = 0; j <= target; j += 2) {
            switch (direction) {
                case 7:
                    x = from.x + j * xJump;
                    y = from.y + yJump * j - 2;
                    s = { x: 0, y: -2 };
                    break;
                case 5://bottom left to top right
                    x = from.x + j * xJump - 2;
                    y = from.y + yJump * j - 2;
                    s = { x: -2, y: 0 };
                    break;
                case 3: // top left to bottom right
                    x = from.x + j * xJump - 2;
                    y = from.y + yJump * j;
                    s = { x: 0, y: 2 };
                    break;
                default: //top right to bottom left
                    x = from.x + j * xJump
                    y = from.y + yJump * j;
                    s = { x: 2, y: 0 };
            }

            // straight across
            if (from.y == to.y) {
                this.createEntity('straight-rail', { x: from.x + j * xJump, y: from.y }, direction, true);
                //diagonal
            } else if (from.x == to.x) {
                this.createEntity('straight-rail', { x: from.x, y: from.y + j * yJump }, direction, true);
            } else {
                this.createEntity('straight-rail', { x: x, y: y }, direction, true);
                if (j + 1 <= target)
                    this.createEntity('straight-rail', { x: x + s.x, y: y + s.y }, RailSection.flip(direction), true);

            }
        }
    }
    
    tSignals(rotations = 0) {
        let signals =   [
            // top and bottom middle
            { pos: { x: this.guides.center, y: this.guides.top - 1 }, dir: Blueprint.RIGHT },
            { pos: { x: this.guides.center, y: this.guides.bottom + 2 }, dir: Blueprint.LEFT },
            // bottom 1/4 and 3/4
            { pos: { x: this.guides.zero + 7, y: this.guides.bottom + 2 }, dir: Blueprint.LEFT },
            { pos: { x: this.guides.max - 8, y: this.guides.bottom + 2 }, dir: Blueprint.LEFT },
            // above / below right curve
            { pos: { x: this.guides.max - 10, y: this.guides.top + 2 }, dir: Blueprint.RIGHT - 1 },
            { pos: { x: this.guides.center + this.trackSpacing / 2 + 4, y: this.guides.max - 6 }, dir: Blueprint.LEFT - 1 },
            // above / below left curve
            { pos: { x: this.guides.zero + 9, y: this.guides.top + 2 }, dir: Blueprint.RIGHT + 1 },
            { pos: { x: this.guides.center - this.trackSpacing / 2 - 3, y: this.guides.max - 6 }, dir: Blueprint.LEFT + 1 },
        ];
        
        // inside triangle curves - only works above a certain size
        if (this.gridSize > 36) {
            signals = signals.concat([
                { pos: { x: this.guides.center + 3 + (10- this.trackSpacing) + this.globalOffset, y: this.guides.bottom + 4 }, dir: Blueprint.RIGHT - 1 },
                { pos: { x: this.guides.center - 2 - (10- this.trackSpacing) - this.globalOffset, y: this.guides.bottom + 4 }, dir: Blueprint.RIGHT + 1 }
            ]);
        }

        if (this.trackSpacing > 6) {
            signals = signals.concat([
                { pos: { x: this.guides.left + 2, y: this.guides.max -10 }, dir: Blueprint.RIGHT - 1 },
                { pos: { x: this.guides.right - 1, y: this.guides.max -10  }, dir: Blueprint.RIGHT + 1 }
            ]);
        }
        if (!rotations) return signals;
        
  
        return signals.map(signal => {
            signal.pos = RailSection.rotateCoordinate(signal.pos, this.gridSize, {w: 0, h: 0}, rotations);
            signal.dir = RailSection.rotateDirection(signal.dir);
            return signal;
        })
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

function calculateDistance(pointA, pointB) {
    return Math.sqrt(
        Math.pow(pointA.x - pointB.x, 2) + Math.pow(pointA.y - pointB.y, 2)
    )
}

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