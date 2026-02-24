import axios from "axios";

interface GeoFeature {
  geometry?: {
    coordinates?: [number, number];
  };
}

interface GeoResponse {
  features?: GeoFeature[];
}

export async function getCoordinatesFromSearch(
  searchWord: string,
): Promise<null | { lng: number; lat: number }> {
  try {
    const { data } = await axios.get<GeoResponse>(
      `https://data.geopf.fr/geocodage/search?q=${encodeURIComponent(searchWord)}`,
    );
    if (Array.isArray(data?.features)) {
      const bestEntry = data.features.find(
        (entry: GeoFeature) => entry.geometry?.coordinates?.length === 2,
      );
      if (bestEntry?.geometry?.coordinates) {
        return {
          lng: bestEntry.geometry.coordinates[0],
          lat: bestEntry.geometry.coordinates[1],
        };
      }
    }
  } catch (err) {
    throw new Error(`Failed to fetch coordinates: ${err instanceof Error ? err.message : String(err)}`);
  }
  return null;
}
