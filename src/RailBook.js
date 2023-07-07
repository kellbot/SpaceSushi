import Blueprint from 'factorio-blueprint';
const {Book} = Blueprint.Book;
import RailSection from './RailSection.js';
import Station from './Station.js';

export default class RailBook {
    constructor({ gridSize = 48, trackSpacing = 8, bufferSide = 'same' } = {}) {
        // ** These things should be customizable //
        this.trackSpacing = trackSpacing + 2; // The distance between track centers aka two more than the open spaces
        this.gridSize = gridSize; // How big are the grid snaps, defaults to one chunk
        this.wires = true; // include red and green wires
        this.bufferSide = bufferSide;
        // ***** //

        this.blueprints =
            [
                // Straight rails
                this.createStraightBlueprint({ label: `Straight Track [${this.gridSize} - ${this.trackSpacing-2}]` }), // Basic straight rail
                this.createCornerBlueprint(),
                this.createIntersectionT(),
                this.createIntersectionX(),
                
               ];

        const stationBooks = [new Book(this.createStations()), new Book(this.createStations('opposite'))];
        stationBooks[0].name = 'Stations (Same Side)';
        stationBooks[1].name = 'Stations (Opposite Side)';
        this.blueprints = this.blueprints.concat(stationBooks);
    }

    blankSection() {
        let section = new RailSection(this);
        return section;
    }


    createStations(side) {
        let stackSizes = [10, 50, 100, 200];
        let blueprints = [];
        stackSizes.forEach(size => {
            blueprints.push(Station.loader(this, {name: `Loader [${size}]`, stackSize: size, side: side}));
            blueprints.push(Station.unloader(this, {name: `Unloader [${size}]`, stackSize: size, side: side}));
        })
        return blueprints;
    }

    createCurveTest() {
        let test = new RailSection(this);
        for (let i = 0; i < 8; i++) {
            test.createEntity('curved-rail', { x: 8 * i + 1, y: -21}, i);

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
        xRail.createCurvedRail();
        xRail.createCurvedRail({rotations: 1});
        xRail.createCurvedRail({rotations: 2});
        xRail.createCurvedRail({rotations: 3});
        let signalPositions = xRail.tSignals().concat(xRail.tSignals(2));

        signalPositions.forEach(s => {
            xRail.createEntity('rail-chain-signal', s.pos, s.dir, true);
        });
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
        let signalPositions = tRail.tSignals();


        signalPositions.forEach(s => {
            tRail.createEntity('rail-chain-signal', s.pos, s.dir, true);
        });
        tRail.setSnapping();
        return tRail;

    }


    generate() {
        this.blueprints.forEach(bp => {
            if (bp instanceof Blueprint ) bp.addLandfill();
        });

        return [Blueprint.toBook(this.blueprints, 0, { autoConnectPoles: false }, {label: `Rails [${this.gridSize} / ${this.trackSpacing-2}]`, icons: ['rail', `signal_${(this.trackSpacing-2) % 10}`]}), this.blueprints[0].toJSON()];

    }
}

