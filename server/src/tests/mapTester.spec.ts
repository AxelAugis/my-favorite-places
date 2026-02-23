function map<T, U>(array: T[], callback: (item: T, index: number) => U): U[] {
    const result: U[] = [];

    for(let i = 0; i < array.length; i++) {
        result.push(callback(array[i], i));
    }
    
    return result;  
}

function filter<T>(array: T[], callback: (item: T, index: number) => boolean): T[] {
    const result: T[] = [];

    for(let i = 0; i < array.length; i++) {
        if(callback(array[i], i)) {
            result.push(array[i]);
        }
    }
    return result;
}

describe('map function', () => {
    it('should call the callback function the correct number of times with correct parameters', () => {
        const transformSpy = jest.fn((item: number) => item * 2);
        
        const items = [1, 2, 3, 4, 5];
        
        const result = map(items, transformSpy);
        
        expect(transformSpy).toHaveBeenCalledTimes(5);
        
        expect(result).toEqual([2, 4, 6, 8, 10]);
    });

    it('should work with string transformation', () => {
        const stringifySpy = jest.fn((item: string) => item.toUpperCase());
        
        const items = ['hello', 'world', 'test'];
        const result = map(items, stringifySpy);
        
        expect(stringifySpy).toHaveBeenCalledTimes(3);
        
        expect(result).toEqual(['HELLO', 'WORLD', 'TEST']);
    });

    it('should handle empty array', () => {
        const spy = jest.fn();
        
        const result = map([], spy);
        
        expect(spy).toHaveBeenCalledTimes(0);
        expect(result).toEqual([]);
    });
});

describe("filter function", () => {
    it("should filter the array and return France twice in result array", () => {
        const filterSpy = jest.fn((item: string) => item === "France");

        const countries = ["Germany", "France", "Italy", "France"];
        const result = filter(countries, filterSpy);

        expect(filterSpy).toHaveBeenCalledTimes(4);
        expect(result).toEqual(["France", "France"]);
    });

    it("should filter numbers greater than 5", () => {
        const filterSpy = jest.fn((item: number) => item > 5);

        const numbers = [1, 6, 3, 8, 2, 10];
        const result = filter(numbers, filterSpy);

        expect(filterSpy).toHaveBeenCalledTimes(6);
        expect(result).toEqual([6, 8, 10]);
    });

    it("should return empty array when no element matches", () => {
        const spy = jest.fn((item: string) => item === "Spain");

        const countries = ["Germany", "France", "Italy", "Portugal"];
        const result = filter(countries, spy);

        expect(spy).toHaveBeenCalledTimes(4);
        expect(result).toEqual([]);
    });
})