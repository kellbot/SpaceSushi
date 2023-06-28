import Blueprint from '@kellbot/factorio-blueprint';
import RailSection from './RailSection.js';
import Station from './Station.js';
//import seData from './assets/data.json';

export default class RailBook {
    constructor({ gridSize = 48, trackSpacing = 8 } = {}) {
        // ** These things should be customizable //
        this.trackSpacing = trackSpacing + 2; // The distance between track centers aka two more than the open spaces
        this.gridSize = gridSize; // How big are the grid snaps, defaults to one chunk
        this.wires = true; // include red and green wires

        // ***** //

        this.blueprints =
            [
                // Straight rails
                this.createStraightBlueprint({ label: `Straight Track [${this.gridSize} - ${this.trackSpacing-2}]` }), // Basic straight rail
                this.createCornerBlueprint(),
                this.createIntersectionT(),
                this.createIntersectionX(),
               ].concat(this.createStations());
    }

    blankSection() {
        let section = new RailSection(this);
        return section;
    }


    createStations() {
        let stackSizes = [10, 50, 100, 200];
        let blueprints = [];
        stackSizes.forEach(size => {
            blueprints.push(Station.loader(this, {name: `Loader [${size}]`, stackSize: size}));
            blueprints.push(Station.unloader(this, {name: `Unloader [${size}]`, stackSize: size}));
        })
        return blueprints;
    }

    createCurveTest() {
        let test = new RailSection(this);
        for (let i = 0; i < 8; i++) {
            test.createEntity('curved-rail', { x: 8 * i, y: -20 }, i);

        }
        return test;

    }

    createStraightBlueprint({ label = 'Straight Rail'} = {}) {
        let straightRail = new RailSection(this);
        straightRail.name = label;
        straightRail.description = "A straight section of track";
        straightRail.addRailConnections({left: true, right: true});
        straightRail.createTwoLanesAcross();
        straightRail.setSnapping();
        return straightRail;
    }

    createCornerBlueprint() {
        let cornerRail = new RailSection(this);
        cornerRail.name = "Curved Track";
        cornerRail.addRailConnections({ left: true, bottom: true }, true, true);
        cornerRail.createCurvedRail();
        cornerRail.setSnapping();
        return cornerRail;
    }

    createIntersectionX() {
        let xRail = new RailSection(this);
        xRail.name = "4 way intersection";

        xRail.addRailConnections({ left: true, bottom: true, right: true, top: true }, true, true);
        xRail.createTwoLanesAcross();
        xRail.createTwoLanesDown();
        xRail.createCurvedRail({signals: true, poles: true});
        xRail.createCurvedRail({rotations: 1, signals: true});
        xRail.createCurvedRail({rotations: 2, signals: true});
        xRail.createCurvedRail({rotations: 3, signals: true});

        xRail.setSnapping();
        return xRail;
    }

    createIntersectionT() {
        let tRail = new RailSection(this);
        tRail.name = "T Intersection";
        tRail.addRailConnections({ left: true, bottom: true, right: true }, true, true);
        tRail.createTwoLanesAcross()
        tRail.createCurvedRail();
        tRail.createCurvedRail({ power: true, rotations: 1 });
        //Signal direction points to rail
        let signalPositions = [
            // top and bottom middle
            { pos: { x: tRail.guides.center, y: tRail.guides.top - 1 }, dir: Blueprint.RIGHT },
            { pos: { x: tRail.guides.center, y: tRail.guides.bottom + 2 }, dir: Blueprint.LEFT },
            // bottom 1/4 and 3/4
            { pos: { x: tRail.guides.zero + 10, y: tRail.guides.bottom + 2 }, dir: Blueprint.LEFT },
            { pos: { x: tRail.guides.max - 11, y: tRail.guides.bottom + 2 }, dir: Blueprint.LEFT },
            // above / below right curve
            { pos: { x: tRail.guides.max - 10, y: tRail.guides.top + 2 }, dir: Blueprint.RIGHT - 1 },
            { pos: { x: tRail.guides.center + this.trackSpacing / 2 + 6, y: tRail.guides.max - 8 }, dir: Blueprint.LEFT - 1 },
            // above / below left curve
            { pos: { x: tRail.guides.zero + 9, y: tRail.guides.top + 2 }, dir: Blueprint.RIGHT + 1 },
            { pos: { x: tRail.guides.center - this.trackSpacing / 2 - 5, y: tRail.guides.max - 8 }, dir: Blueprint.LEFT + 1 },
        ];

        // inside triangle curves - only works above a certain size
        if (this.gridSize > 36) {
            signalPositions = signalPositions.concat([
                { pos: { x: tRail.guides.center + 3, y: tRail.guides.bottom + 4 }, dir: Blueprint.RIGHT + 1 },
                { pos: { x: tRail.guides.center - 2, y: tRail.guides.bottom + 4 }, dir: Blueprint.RIGHT - 1 }
            ]);
        }

        signalPositions.forEach(s => {
            tRail.createEntity('rail-chain-signal', s.pos, s.dir, true);
        });
        tRail.setSnapping();
        return tRail;

    }


    generate() {
        // this.blueprints.forEach(bp => {
        //     console.log(bp);
        //     console.log(bp.toObject())
        // });
        return [Blueprint.toBook(this.blueprints, 0, { autoConnectPoles: false }), this.blueprints[0].toJSON()];

    }
}

