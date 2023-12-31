
import { Exception } from 'sass';
import RailSection from './RailSection';
import Blueprint from 'factorio-blueprint';

// const [R, D, L, U, DS, LS] = [
//     { entity: 'fast-transport-belt', direction: Blueprint.RIGHT },
//     { entity: 'fast-transport-belt', direction: Blueprint.DOWN },
//     { entity: 'fast-transport-belt', direction: Blueprint.LEFT },
//     { entity: 'fast-transport-belt', direction: Blueprint.UP },
//     { entity: 'fast-splitter', direction: Blueprint.DOWN },
//     { entity: 'fast-splitter', direction: Blueprint.LEFT }];

const importStrings = {
    loaderX4: '0eNqlmdtuo0AMht9lrknFeE7Aq1TVijRshJQAgmG1UcW7LyTdqupmNv7dqwo1fPZ4/PuQvKn9aW6Gse2iqt7U1NXDLva749getuffqqKQqYuq3JKpej/1pzk2u+1jQ9sdVRXHuclU+9p3k6qeV0B77OrT9mq8DI2qVBubs8pUV5+3p5/1FHfTcGpjbEa1Itvu0KxG9JLx3o1j3U1DP8bdvjnFTwRaXjLVdLGNbXNz5fpw+dHN5/1qq9L/BWVq6Kf13b57P3b+5K7n1k/byQ/t2Lze/kubq1/YhLE1wjYYm1Jse4dtMbZB2A5j2xTb32F7jO0QdsDYAbnLAmOXSLxLjF0gfuscTHCNRFyD0tQ5EheNipMg30F5agfFHRSothAdlKgOUNxBkWoP0UGZ6gK6VVCouoToX6Q6rx1sPI79+jdV1JMZvwb5vVn2cxzmrSP+251A9RLUnwhUL0FdhED1EkG+o831r3pzlu9WSGdlEYHqJQvFHVQv+VRk7voeYAX4xwpou5QAisQAmpzMDOMMpWygXBN0uTfm5TKc4dym0dwAWABKXKj5OPhjqHDcNZy0M1Y2N5rElTkZLpUBXjZ5pnCwxnwylowmYwqZ97xUK9kCzvm5ZnMuteCXBatlMz4rgS1bcttMzY2uNWimaHqcKslqbC1sznwnM60T2yORPS9cOBJCtoF96Q7I00K4WqS8LIU8Voo6tlS30Z1NZbdFHfhlxZFw8WGVAIeLtfyGWJ0VmyOJOSdejURadV5sT1SLXBCuYgnVuULI4+mD3XbJ8vXh2Vr+WOYY9cxL11CW6jy78RIQX2/Ea5BEXN6KzUlKh3fs6nq1YVkh89jSwYOyO6wDoOylswCg6CDMogZ+dyWAyu+uQFgDgT2bRzVsaglQLb/SAVQHVmUelS2s7auh+9SX7PaTXfXpR8VM/WrG6fYNXKFtKCn4kvLC0LL8Ac3AZHA=',
    unloaderX4: '0eNqlmeuOokAQhd+lf+OErr4Br7KZbHBkDYkDBJrNmonvvqCzEzPaWqf2lyHI1+2hTl3aD7U9zM0wtl1U1YeaunrYxH6zH9vdev1HVRQydVSVO2Wq3k79YY7NZv3a0HZ7VcVxbjLVvvXdpKofC6Ddd/VhfTQeh0ZVqo3Nu8pUV7+vV7/qKW7iWHfT0I9xs20OUS3gtts1y1L69JqppottbJsL7nxx/NnN79tmXL7wEJSpoZ+WZ/vuc+vmxZ33rl/W3e/asXm73KVTdsMmjG0RtsHYLsW2d9gWY+sc2bgD4RqBexBOiCwBhBfIzgsQHhB4CcJLBK5zjE5QuOhvBp0XX4/7sV8+U/x0xGRfKaQb5jVN3C4HepauTXuPZ4S8nCWOhcXxz8Xp55hSBzTv12q8XwO6lxxER+37CTcs+Df7TsOhjXG5c1tAzlBKRAtoVLra4736k8uKWwqnZfXsRkF/D06ygkaczE3Casl69wSWSw/BQccVENyj6SMk8c9TKwVhW5EKR7Bklk9wJdfCa8FLe9jkwh6EWG2fFrZPLBMaQgNC0/OISNcTA/pSGyS8DVwdtf2P+DZOvBxJlvNC7XhxhprVP3aXQftbKAUbvnfDI+/aXNiFJ3611cKRgeVWS8LGmxUB1gjprDdmcW+Wz82SzjTWidcTZTbrxWOLJPfYIF5Oknss6GYiKDbYbl5br7SbHTqYPul/nRbOcikeiac3kQecEa8n8oCzwnmOlf0c2Bn/S0+WdUjlZcOiTbzpIJvrLEuIQjbl8YQoZTNfQgifywYxlhAe9GdAhPAkG8RSQhjZ8MITQnqAy1NCeoKbkkJ6aMvTAm1kLaSFtK1NaVEK226WFkHa3rK0CNJmN6FFIOGpNU8LI2xhUrtFi52GtHXC1oNH98JGiad0EB4a8+iFsMk4v8fX7PJvYnX1n2WmfjfjdBGr0DaUFHxJeWHodPoLw+GDUg==',
}
export default class Station extends RailSection {

    constructor(parent) {
        super(parent);
        this.engineCount = parent.engineCount;
        this.trainLength = parent.carCount; //how many cargo / fluid cars
        this.doubleSided = parent.doubelSided;
        this.engineLength = this.doubleSided ? this.engineCount * 2 * 7 : this.engineCount * 7;

        this.cargoStart = { x: this.guides.zero + this.engineCount * 7 + this.globalOffset, y: this.guides.zero + this.globalOffset };
        this.trackStart = { x: this.guides.zero + this.globalOffset, y: this.guides.zero + this.globalOffset };

        this.trackEnd = { x: this.trackStart.x + this.engineLength + this.trainLength * 7 - 2, y: this.trackStart.y };

        this.placeTrack();
    }

    placeTrack() {
        let trackLength = this.engineLength + this.trainLength * 7;
        this.runRail(this.trackStart, { x: this.trackStart.x + trackLength, y: this.trackStart.y });
    }


    beltsFromMatrix(matrix, start) {
        matrix.forEach((row, y) => {
            row.forEach((col, x) => {
                if (!col) return;
                this.createEntity(col.entity, { x: start.x + x, y: start.y + y }, col.direction)
            })
        })
    }

    createBuffer(direction, position = { x: 0, y: 0 }) {
        let lastChest;
        let poles = [];

        for (let i = 0; i < this.trainLength; i++) {
            let leftPole = this.createEntity('medium-electric-pole', { x: position.x + (i * 7) - 1, y: position.y });

            poles.push(leftPole);
            if (lastChest) leftPole.connect(lastChest, null, null, "green");

            for (let j = 0; j < 6; j++) {
                let chest = this.createEntity('steel-chest', { x: position.x + j + (i * 7), y: position.y });
                if (j == 0) {
                    chest.connect(poles[i], null, null, "green")
                } else {
                    chest.connect(lastChest, null, null, "green");
                }
                this.createEntity('stack-inserter', { x: position.x + j + (i * 7), y: position.y - 1.5 }, direction);
                this.createEntity('stack-inserter', { x: position.x + j + (i * 7), y: position.y + 0.5 }, direction);
                lastChest = chest;
            }
            if (i == this.trainLength - 1)
                poles.push(this.createEntity('medium-electric-pole', { x: position.x + (i * 7) + 6, y: position.y })
                    .connect(lastChest, null, null, "green"));
        }

        return poles;
    }

    placeStop({ stackSize = 50, style = 'loader', direction = Blueprint.LEFT } = {}) {
        let multiplier = (style == 'loader') ? 40 * this.trainLength : 40 * this.trainLength * 3;
        let tData = {
            name: 'train_stop',
            position: { x: this.trackStart.x, y: this.trackStart.y - 2 },
            direction: direction,
            manual_trains_limit: 1,
            control_behavior: {
                circuit_condition: {
                    first_signal: {
                        type: 'virtual',
                        name: (style == 'loader') ? 'signal_anything' : 'signal_everything'
                    },
                    constant: stackSize * multiplier,
                    comparator: (style == 'loader') ? '>' : '<',
                },
                circuit_enable_disable: true
            }
        };
        let tStop = this.createEntityWithData(tData);
        this.trainStop = tStop;
        return tStop;
    }

    static basic(parent, includeStop = true) {
        let station = new Station(parent);
        let entities = [
            // top curve
            { name: 'curved-rail', position: { x: station.trackEnd.x + 6.5, y: station.trackEnd.y + 0.5 }, direction: 2 },
            { name: 'curved-rail', position: { x: station.trackEnd.x + 12.5, y: station.trackEnd.y - 5.5 }, direction: 5 },
            { name: 'straight-rail', position: { x: station.trackEnd.x + 8, y: station.trackEnd.y - 4 }, direction: 3 },

            {name: 'rail-chain-signal', position: {x: station.trackEnd.x + 7.5 , y: station.trackEnd.y - 4.5 }, direction: 1},
            {name: 'rail-chain-signal', position: {x: station.trackEnd.x + 9.5 , y: station.trackEnd.y - 2.5 }, direction: 5},

            // // bottom  curve

            { name: 'curved-rail', position: { x: station.trackEnd.x + 6.5, y: station.trackEnd.y + 2.5 }, direction: 3 },
            { name: 'curved-rail', position: { x: station.trackEnd.x + 12.5, y: station.trackEnd.y + 8.5 }, direction: 0 },
            { name: 'straight-rail', position: { x: station.trackEnd.x + 8, y: station.trackEnd.y + 4 }, direction: 1 },
            {name: 'rail-chain-signal', position: {x: station.trackEnd.x + 7.5 , y: station.trackEnd.y + 4.5 }, direction: 7},
            {name: 'rail-chain-signal', position: {x: station.trackEnd.x + 9.5 , y: station.trackEnd.y + 2.5 }, direction: 3},

            //straight track signals
            { name: 'rail-chain-signal', position: { x: station.trackEnd.x + 11, y: station.trackEnd.y - 10 }, direction: Blueprint.UP },
            { name: 'rail-chain-signal', position: { x: station.trackEnd.x + 14, y: station.trackEnd.y - 10 }, direction: Blueprint.DOWN },
        ]
        entities.forEach(entity => {
            station.createEntity(entity.name, entity.position, entity.direction, true);
        })
        station.runRail(
            { x: station.trackEnd.x + 12, y: station.trackEnd.y - 10 },
            { x: station.trackEnd.x + 12, y: station.trackEnd.y + 10 })
        if (includeStop) station.createEntity('train_stop', { x: station.guides.zero, y: station.guides.top - 2 }, Blueprint.LEFT);
        return station;
    }

    addItemHandler(style = "loader", side = "same") {
        if (!this.trainStop) throw new Exception("Train stop must be created before buffer belts can be added");

        let beltPrint, rotation, bufferPosition, bufferDirection;
        let position = { x: this.cargoStart.x, y: this.cargoStart.y - 9 };

        if (style == 'loader') {
            beltPrint = new Blueprint().load(importStrings.loaderX4);
            bufferDirection = side == 'same' ? Blueprint.UP : Blueprint.DOWN;
        } else {
            beltPrint = new Blueprint().load(importStrings.unloaderX4);
            bufferDirection = side == 'same' ? Blueprint.DOWN : Blueprint.UP;
        }
        if (side == 'same') {

            rotation = Blueprint.ROTATION_NONE;
            bufferPosition = { x: position.x + 1, y: position.y + 7 };

        } else {
            position.x = position.x + 1;
            bufferPosition = { x: position.x, y: position.y + 12 };
            position.y = position.y + 18;
            position.x = position.x + 26;
            rotation = Blueprint.ROTATION_180_CCW;
        }

        this.placeBlueprint(beltPrint, position, rotation);

        let poles = this.createBuffer(bufferDirection, bufferPosition);
        this.connectPower(poles);

        this.trainStop.connect(poles[0], null, null, "green");
    }

    static unloader(parent, options = { name: "Loader [50]", doubleSided: false, flipBelts: false, stackSize: 50, side: 'same' }) {
        let station = Station.basic(parent, false);
        station.name = options.name;
        station.placeStop({ style: 'unloader', stackSize: options.stackSize });

        station.addItemHandler("unloader", options.side);

        return station;
    }

    static loader(parent, options = { name: "Loader [50]", doubleSided: false, flipBelts: false, stackSize: 50, side: 'same' }) {
        let station = Station.basic(parent, false);
        station.name = options.name;
        station.placeStop({ style: 'loader', stackSize: options.stackSize });

        station.addItemHandler("loader", options.side);

        return station;
    }
}