import { mount } from "@vue/test-utils";
import RailBook from "src/RailBook";
import { describe, it, expect } from "vitest";

describe("Tracks", () => {

    
    let trackNames = ['straight-rail', 'curved-rail'];

    it("should have rails", () => {
        const rb = new RailBook();
        rb.blueprints.forEach(bp => {

            let tracks = bp.entities.filter(e => (trackNames.includes(e.name.replaceAll('_','-'))));
            expect(tracks.length).not.toBe(0);
        })
    });
    it("should only place tracks on whole numbers", () => {
        const rb = new RailBook({trackSpacing: 8});
        rb.blueprints.forEach(bp => {

            bp.toObject().blueprint.entities.filter(e => (trackNames.includes(e.name))).forEach(e => {
                if (!Number.isInteger(e.position.x) || !Number.isInteger(e.position.y)) {
                    console.log(bp.name);
                    console.log(e);}
                expect(Number.isInteger(e.position.x)).toBe(true);
                expect(Number.isInteger(e.position.y)).toBe(true);
            });
        });
    });
    it("should only place tracks on odd numbers for 4/8", () => {
        const rb = new RailBook({trackSpacing: 8});
        rb.blueprints.forEach(bp => {
            bp.toObject().blueprint.entities.filter(e => (trackNames.includes(e.name))).forEach(e => {
                if (!(e.position.x % 2) || !(e.position.y % 2)) {
                    console.log(bp.name);
                    console.log(e);}
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
                    console.log(e);}
                expect(e.position.x % 2).toBe(0);
                expect(e.position.y % 2).toBe(0);
            });
        });
    });
    // it("should not be off grid on 6/10", () => {
    //     const rb = new RailBook({ gridSize: 48, trackSpacing: 6 });
    //     rb.blueprints.forEach(bp => {
    //         bp.entities.filter(e => (['straight-rail', 'curved-rail'].includes(e.name))).forEach(e => {
    //             expect(e.position.x % 2).toBe(e.position.y % 2);
    //         });
    //     });

    // });
    // it("should not be off grid on 4/8", () => {
    //     const rb = new RailBook({ gridSize: 48, trackSpacing: 8 });
    //     rb.blueprints.forEach(bp => {
    //         bp.entities.filter(e => (['straight-rail', 'curved-rail'].includes(e.name))).forEach(e => {
    //             expect(e.position.x % 2).toBe(e.position.y % 2);
    //         });
    //     });

    // });

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
