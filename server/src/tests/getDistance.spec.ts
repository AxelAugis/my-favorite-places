import { getDistance } from "../utils/getDistance";

describe("getDistance function", () => {
    it("should return 0 for the same point", () => {
        const point = { lng: 0, lat: 0 };
        expect(getDistance(point, point)).toBe(0);
    });

    it("should return correct distance between two points", () => {
        const point1 = { lng: 0, lat: 0 };
        const point2 = { lng: 0, lat: 1 };
        expect(getDistance(point1, point2)).toBeCloseTo(111.19, 2);
    });

    it("should return correct distance for points with different longitudes", () => {
        const point1 = { lng: 0, lat: 0 };
        const point2 = { lng: 1, lat: 0 };
        expect(getDistance(point1, point2)).toBeCloseTo(111.19, 2);
    });

    it("should return correct distance for points with different latitudes and longitudes", () => {
        const point1 = { lng: 0, lat: 0 };
        const point2 = { lng: 1, lat: 1 };
        expect(getDistance(point1, point2)).toBeCloseTo(157.25, 2);
    });

    it("should return correct distance for points in different hemispheres", () => {
        const point1 = { lng: -73.935242, lat: 40.73061 }; 
        const point2 = { lng: 2.352222, lat: 48.856613 };
        expect(getDistance(point1, point2)).toBeCloseTo(5800, -2);
    });
})