import axios from "axios";

interface GeoFeature {
  geometry?: {
    coordinates?: [number, number];
  };
  properties?: {
    label?: string;
    name?: string;
    city?: string;
    postcode?: string;
    context?: string;
  };
}

interface GeoResponse {
  features?: GeoFeature[];
}

export interface SearchAddressResult {
  searchWord: string;
  name: string;
  description: string;
  lng: number;
  lat: number;
}

export async function searchAddresses(
  searchWord: string,
): Promise<SearchAddressResult[]> {
  const trimmedSearch = searchWord.trim();

  if (trimmedSearch.length < 3) {
    return [];
  }

  try {
    const { data } = await axios.get<GeoResponse>(
      `https://data.geopf.fr/geocodage/search?q=${encodeURIComponent(trimmedSearch)}`,
    );

    if (!Array.isArray(data?.features)) {
      return [];
    }

    return data.features
      .filter((entry): entry is GeoFeature & { geometry: { coordinates: [number, number] } } => {
        return Array.isArray(entry.geometry?.coordinates) && entry.geometry.coordinates.length === 2;
      })
      .map((entry) => {
        const label = entry.properties?.label?.trim();
        const name = label || entry.properties?.name?.trim() || trimmedSearch;
        const locationParts = [
          [entry.properties?.postcode, entry.properties?.city]
            .filter(Boolean)
            .join(' ')
            .trim(),
          entry.properties?.context?.trim() || '',
        ].filter(Boolean);

        return {
          searchWord: label || name,
          name,
          description: locationParts.join(' • '),
          lng: entry.geometry.coordinates[0],
          lat: entry.geometry.coordinates[1],
        };
      })
      .filter((entry, index, entries) => {
        return entries.findIndex((candidate) => candidate.searchWord === entry.searchWord) === index;
      })
      .slice(0, 9);
  } catch (err) {
    throw new Error(`Failed to search addresses: ${err instanceof Error ? err.message : String(err)}`);
  }
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
