import {SushiBook} from "src/blueprinter";
import { describe, it, expect } from "vitest";

describe("Entities", () => {
    let sushiBook = new SushiBook(['iron-gear-wheel'], { allowedProducers: ['assembling-machine-2'] });


    it("should find allowed recipes", () => {
        expect(sushiBook.allowedRecipes('iron-gear-wheel').length ).toBe(1)


});
});