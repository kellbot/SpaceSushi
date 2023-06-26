import Entity from "@kellbot/factorio-blueprint/dist/src/entity";
import { mount } from "@vue/test-utils";
import RailBook from "src/RailBook";
import { describe, it, expect } from "vitest";

/**
 * @blueprints {Array}
 * @filter {Array}
 */
function getEntities(blueprints, filter = []) {
    let allEnts = [];
    blueprints.forEach(bp => {
        allEnts = (filter.length > 0) ? allEnts.concat(bp.entities.filter(e => (filter.includes(e.name.replaceAll('_', '-'))))) : allEnts.concat(bp.entities);


    });

    return allEnts;
}


describe("Entities", () => {
    const rb4 = new RailBook({ gridSize: 48, trackSpacing: 8 });
    const rb6 = new RailBook({ gridSize: 48, trackSpacing: 6 });

    it("should have a valid position", () => {
        getEntities(rb4.blueprints).forEach(e => {
            expect(Number.isNaN(e.position.x)).toBe(false)
            expect(Number.isNaN(e.position.y)).toBe(false)

        });
    });


});

describe("Tracks", () => {


    let trackNames = ['straight-rail', 'curved-rail'];

    it("should have rails", () => {
        const rb = new RailBook();
        rb.blueprints.forEach(bp => {

            let tracks = bp.entities.filter(e => (trackNames.includes(e.name.replaceAll('_', '-'))));
            expect(tracks.length).not.toBe(0);
        })
    });
    it("should only place tracks and poleson whole numbers", () => {
        const rb = new RailBook({ trackSpacing: 8 });
        let entitiyNames = trackNames.concat(['big-electric-pole']);
        rb.blueprints.forEach(bp => {

            bp.toObject().blueprint.entities.filter(e => (entitiyNames.includes(e.name))).forEach(e => {
                if (!Number.isInteger(e.position.x) || !Number.isInteger(e.position.y)) {
                    console.log(bp.name);
                    console.log(e);
                }
                expect(Number.isInteger(e.position.x)).toBe(true);
                expect(Number.isInteger(e.position.y)).toBe(true);
            });
        });
    });
    it("should only place tracks on odd numbers for 4/8", () => {
        const rb = new RailBook({ trackSpacing: 8 });
        rb.blueprints.forEach(bp => {
            bp.toObject().blueprint.entities.filter(e => (trackNames.includes(e.name))).forEach(e => {
                if (!(e.position.x % 2) || !(e.position.y % 2)) {
                    console.log(bp.name);
                    console.log(e);
                }
                expect(e.position.x % 2).toBe(1);
                expect(e.position.y % 2).toBe(1);
            });
        });
    });
    it("should only place tracks on even numbers when snapped by 1", () => {
        const rb = new RailBook({ gridSize: 48, trackSpacing: 6 });
        rb.blueprints.forEach(bp => {
            let tracks = bp.toObject().blueprint.entities.filter(e => (trackNames.includes(e.name)));
            expect(tracks.length).not.toBe(0);
            tracks.forEach(e => {
                if ((e.position.x % 2) || (e.position.y % 2)) {
                    console.log(bp.name);
                    console.log(e);
                }
                expect(e.position.x % 2).toBe(0);
                expect(e.position.y % 2).toBe(0);
            });
        });
    });
    it("should have power poles", () => {
        const bp = new RailBook({ gridSize: 48, trackSpacing: 6 }).createStraightBlueprint();
        let poles = bp.toObject().blueprint.entities.filter(e => (e.name == 'big-electric-pole'));
        expect(poles.length > 1).toBe(true);
    });
    it("should place straight edge poles correctly", () => {
        const bp = new RailBook({ gridSize: 48, trackSpacing: 6 }).createStraightBlueprint();
        let poles = bp.toObject().blueprint.entities.filter(e => (e.name == 'big-electric-pole'));

        expect(poles[0].position.x).toBe(0);
        expect(poles.slice(-1)[0].position.x).toBe(48);

    });
    it("should align pole evenly on 4/8", () => {
        const bp = new RailBook({ gridSize: 48, trackSpacing: 8 }).blankSection();
        bp.createTwoLanesAcross();
        let poles = bp.toObject().blueprint.entities.filter(e => (e.name == 'big-electric-pole'));
        poles.forEach(e => {
            if (!(e.position.x % 2)) {
                console.log(bp.name);
                console.log(e);
            }
            expect(e.position.x % 2).toBe(1);
            expect(e.position.y % 2).toBe(1);
        });
    });
});

describe("T-intersection", () => {
    const rb = new RailBook({trackSpacing : 6});
    const tIntersection = rb.createIntersectionT();

    it("Should have bottom connectors and signals", () => {
        let left = tIntersection.findEntity({x:18, y:48});
        expect(left.name).toBe('rail_signal'); 
    });
});

describe("Snapping", () => {
    it("should be offset by 1 for 6/10 spacing", () => {
        const rb = new RailBook({ gridSize: 48, trackSpacing: 6 });
        rb.blueprints.forEach(bp => {
            expect(bp.snapping.position.x).toBe(1);
            expect(bp.snapping.position.y).toBe(1);
        });
    });
});
