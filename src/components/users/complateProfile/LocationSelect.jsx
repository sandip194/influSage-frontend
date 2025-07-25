import React, { useEffect, useState } from "react";
import axios from "axios";
import { Select, Input  } from "antd";
import postalRegexList from './postalRegex.json'

const { Option } = Select;

export default function LocationSelect({ onChange }) {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [zipError, setZipError] = useState("");

  const [loading, setLoading] = useState({ countries: false, states: false, cities: false });
  const [error, setError] = useState({ countries: "", states: "", cities: "" });


   const getRegexForCountry = (iso) => {
    const entry = postalRegexList.find(e => e.ISO === iso);
    return entry?.Regex ? new RegExp(entry.Regex) : null;
  };

  const validateZip = (iso, code) => {
    if (!code) return "";
    const regex = getRegexForCountry(iso);
    return regex ? (regex.test(code.trim()) ? "" : `Invalid ZIP/PIN for ${iso}`) : "";
  };




  const countryAPI = "https://countriesnow.space/api/v0.1/countries/positions";
  const stateAPI = "https://countriesnow.space/api/v0.1/countries/states";
  const cityAPI = "https://countriesnow.space/api/v0.1/countries/state/cities";



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


    useEffect(() => {
    const iso = countries.find(c => c.name === selectedCountry)?.iso2;
    setZipError(validateZip(iso, zipCode));
  }, [zipCode, selectedCountry, countries]);

  useEffect(() => {
    if (onChange) {
      onChange({
        country: selectedCountry,
        state: selectedState,
        city: selectedCity,
        zipCode, zipError
      });
    }
  }, [selectedCountry, selectedState, selectedCity, zipCode, zipError]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
      {/* Country */}
      <div>
        <label className="block mb-1">Country</label>
        <Select
        size="large"
          showSearch
          placeholder="Select Country"
          value={selectedCountry || undefined}
          onChange={(value) => {
            setSelectedCountry(value);
            setSelectedState("");
            setSelectedCity("");
          }}
          loading={loading.countries}
          style={{ width: "100%" }}
          optionFilterProp="children"
          filterOption={(input, option) =>
            option?.children?.toLowerCase().includes(input.toLowerCase())
          }
        >
          {countries.map((country) => (
            <Option key={country.name} value={country.name}>
              {country.name}
            </Option>
          ))}
        </Select>
        {error.countries && <p className="text-red-500 text-sm mt-1">{error.countries}</p>}
      </div>

      {/* State */}
      <div>
        <label className="block mb-1">State</label>
        <Select
          showSearch
          size="large"
          placeholder="Select State"
          value={selectedState || undefined}
          onChange={(value) => {
            setSelectedState(value);
            setSelectedCity("");
          }}
          loading={loading.states}
          disabled={!selectedCountry}
          style={{ width: "100%" }}
          optionFilterProp="children"
          filterOption={(input, option) =>
            option?.children?.toLowerCase().includes(input.toLowerCase())
          }
        >
          {states.map((state) => (
            <Option key={state.name} value={state.name}>
              {state.name}
            </Option>
          ))}
        </Select>
        {error.states && <p className="text-red-500 text-sm mt-1">{error.states}</p>}
      </div>

      {/* City */}
      <div>
        <label className="block mb-1">City</label>
        <Select
          showSearch
          size="large"
          placeholder="Select City"
          value={selectedCity || undefined}
          onChange={setSelectedCity}
          loading={loading.cities}
          disabled={!selectedState}
          style={{ width: "100%" }}
          optionFilterProp="children"
          filterOption={(input, option) =>
            option?.children?.toLowerCase().includes(input.toLowerCase())
          }
          dropdownStyle={{ maxHeight: 200 }} // custom height of dropdown
        >
          {cities.map((city, i) => (
            <Option key={i} value={city}>
              {city}
            </Option>
          ))}
        </Select>
        {error.cities && <p className="text-red-500 text-sm mt-1">{error.cities}</p>}
      </div>

      {/* ZIP Input */}
      <div className="md:col-span-3">
        <label className="block mb-1">ZIP / PIN Code</label>
        <Input
          value={zipCode}
          onChange={e => setZipCode(e.target.value)}
          size="large"
          className="rounded-xl"
          status={zipError ? "error" : ""}
          placeholder="Enter ZIP or PIN"
        />
        {zipError && <p className="text-red-500 text-sm mt-1">{zipError}</p>}
      </div>
    </div>
  );
}
