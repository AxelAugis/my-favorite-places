import axios from "axios";
import { getCountriesStartingWith } from "../utils/getCountriesStartingWith";

jest.mock("axios");

describe("getCountriesStartingWith functions", () => {
    it("should return france when searching for 'fra'", async () => {
        (axios.get as jest.Mock).mockResolvedValue({
            data: {
                data: [
                    { name: "France" },
                ]
            }
        });
    
        const result = await getCountriesStartingWith("fra");
        expect(result).toContain("France");
    });

    it("should not return France when searching for 'ger'", async () => {
        (axios.get as jest.Mock).mockResolvedValue({
            data: {
                data: [
                    { name: "Germany" },
                ]
            }
        });
    
        const result = await getCountriesStartingWith("ger");
        expect(result).not.toContain("France");
    });

    it("should return an empty array when no countries match", async () => {
        (axios.get as jest.Mock).mockResolvedValue({
            data: {
                data: []
            }
        });
    
        const result = await getCountriesStartingWith("xyz");
        expect(result).toEqual([]);
    });
});