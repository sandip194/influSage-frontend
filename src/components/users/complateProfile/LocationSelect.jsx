import React, { useEffect, useState } from "react";
import axios from "axios";

export default function LocationSelect({ onChange }) {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const [loading, setLoading] = useState({ countries: false, states: false, cities: false });
  const [error, setError] = useState({ countries: "", states: "", cities: "" });

  const countryAPI = "https://countriesnow.space/api/v0.1/countries/positions";
  const stateAPI = "https://countriesnow.space/api/v0.1/countries/states";
  const cityAPI = "https://countriesnow.space/api/v0.1/countries/state/cities";

  // Fetch countries on mount
  useEffect(() => {
    setLoading(prev => ({ ...prev, countries: true }));
    axios.get(countryAPI)
      .then(res => {
        setCountries(res.data.data);
        setError(prev => ({ ...prev, countries: "" }));
      })
      .catch(() => setError(prev => ({ ...prev, countries: "Failed to load countries." })))
      .finally(() => setLoading(prev => ({ ...prev, countries: false })));
  }, []);

  // Fetch states on country change
  useEffect(() => {
    if (!selectedCountry) {
      setStates([]);
      setCities([]);
      return;
    }

    setLoading(prev => ({ ...prev, states: true }));
    axios.post(stateAPI, { country: selectedCountry })
      .then(res => {
        setStates(res.data.data.states || []);
        setError(prev => ({ ...prev, states: "" }));
      })
      .catch(() => setError(prev => ({ ...prev, states: "Failed to load states." })))
      .finally(() => setLoading(prev => ({ ...prev, states: false })));
  }, [selectedCountry]);

  // Fetch cities on state change
  useEffect(() => {
    if (!selectedCountry || !selectedState) {
      setCities([]);
      return;
    }

    setLoading(prev => ({ ...prev, cities: true }));
    axios.post(cityAPI, {
      country: selectedCountry,
      state: selectedState,
    })
      .then(res => {
        setCities(res.data.data || []);
        setError(prev => ({ ...prev, cities: "" }));
      })
      .catch(() => setError(prev => ({ ...prev, cities: "Failed to load cities." })))
      .finally(() => setLoading(prev => ({ ...prev, cities: false })));
  }, [selectedState]);

  // Send selected values to parent
  useEffect(() => {
    if (onChange) {
      onChange({
        country: selectedCountry,
        state: selectedState,
        city: selectedCity,
      });
    }
  }, [selectedCountry, selectedState, selectedCity]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
      {/* Country Select */}
      <div className="w-full">
        <label htmlFor="country" className="block mb-1">Country</label>
        <select
          id="country"
          value={selectedCountry}
          onChange={(e) => {
            setSelectedCountry(e.target.value);
            setSelectedState("");
            setSelectedCity("");
          }}
          className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Country</option>
          {loading.countries ? (
            <option>Loading...</option>
          ) : (
            countries.map((country) => (
              <option key={country.name} value={country.name}>
                {country.name}
              </option>
            ))
          )}
        </select>
        {error.countries && <p className="text-red-500 text-sm mt-1">{error.countries}</p>}
      </div>

      {/* State Select */}
      <div className="w-full">
        <label htmlFor="state" className="block mb-1">State</label>
        <select
          id="state"
          value={selectedState}
          onChange={(e) => {
            setSelectedState(e.target.value);
            setSelectedCity("");
          }}
          disabled={!selectedCountry || loading.states}
          className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          <option value="">Select State</option>
          {loading.states ? (
            <option>Loading...</option>
          ) : (
            states.map((state) => (
              <option key={state.name} value={state.name}>
                {state.name}
              </option>
            ))
          )}
        </select>
        {error.states && <p className="text-red-500 text-sm mt-1">{error.states}</p>}
      </div>

      {/* City Select */}
      <div className="w-full ">
        <label htmlFor="city" className="block mb-1">City</label>
        <select
          id="city"
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          disabled={!selectedState || loading.cities}
          className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          <option value="">Select City</option>
          {loading.cities ? (
            <option>Loading...</option>
          ) : (
            cities.map((city, i) => (
              <option key={i} value={city}>
                {city}
              </option>
            ))
          )}
        </select>
        {error.cities && <p className="text-red-500 text-sm mt-1">{error.cities}</p>}
      </div>
    </div>
  );
}
