import { Country, State } from "country-state-city";

const BASE_COUNTRY_ID = 100;
const REGION_MULTIPLIER = 10;

const generateRegionId = (countryId, index) =>
  countryId * REGION_MULTIPLIER + index;

const getAllCountriesWithStatesAndCity = async (req, res) => {
  try {
    const countries = Country.getAllCountries();
    if (!countries || countries.length === 0) {
      return res.state(404).json({ message: "No countries found" });
    }
    const formattedCountries = countries.map((country, countryIndex) => {
      const states = State.getStatesOfCountry(country.isoCode) || [];
      return {
        id: BASE_COUNTRY_ID + countryIndex,
        nameAscii: country.name,
        codes2: country.isoCode,
        flag: country.flag,
        isdCode: `+${country.phonecode}`,
        regionSet: states.map((state, stateIndex) => ({
          id: generateRegionId(BASE_COUNTRY_ID + countryIndex, stateIndex),
          nameAscii: state.name,
        })),
      };
    });

    res.status(200).json(formattedCountries);
  } catch (err) {
    console.error("Error fetching countries or states:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
export default getAllCountriesWithStatesAndCity;
