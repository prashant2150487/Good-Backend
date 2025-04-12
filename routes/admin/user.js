import express from "express";
import getAllCountriesWithStatesAndCity from "../../controllers/countryStateCity/countryStateCity.js";
const router = express.Router();

router.get("/getCountryStateCity", getAllCountriesWithStatesAndCity);

export default router;
