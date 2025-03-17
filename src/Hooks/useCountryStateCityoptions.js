import { useState, useEffect } from 'react';
import { Country, State, City } from 'country-state-city';

const useCountryStateCityOptions = (countryCodes = []) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const generateOptions = () => {
        // If no specific country codes provided, get all countries
        const countriesToProcess = countryCodes.length > 0 
          ? Country.getAllCountries().filter(country => countryCodes.includes(country.isoCode))
          : Country.getAllCountries();
        
        const formattedData = countriesToProcess.map(country => {
          // Get all states for this country
          const states = State.getStatesOfCountry(country.isoCode);
          
          // Format states with cities
          const stateOptions = states.map(state => {
            // Get cities for this state
            const cities = City.getCitiesOfState(country.isoCode, state.isoCode);
            
            // Format cities
            const cityOptions = cities.map(city => ({
              cityName: city.name,
              label: city.name,
              value: city.name
            }));
            
            // Return formatted state with cities
            return {
              stateName: state.name,
              label: state.name,
              value: state.name,
              city: cityOptions
            };
          });
          
          // Return formatted country with states
          return {
            country: country.name.toLowerCase(),
            label: country.name,
            value: country.name,
            state: stateOptions
          };
        });
        
        setOptions(formattedData);
        setLoading(false);
      };
      
      generateOptions();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, [JSON.stringify(countryCodes)]); // Re-run if country codes change

  return { options, loading, error };
};

export default useCountryStateCityOptions;