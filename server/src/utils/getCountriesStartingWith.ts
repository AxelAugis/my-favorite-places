import axios from "axios";

export async function getCountriesStartingWith(search: string): Promise<string[]> {
    try {
        const response = await axios.get(`https://api.first.org/data/v1/countries?limit=1000&q=${search}`);
        return response.data.data.map((country: any) => country.name);
    } catch {
        throw new Error("Failed to fetch countries");
    }
}