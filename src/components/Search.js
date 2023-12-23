import React, { useState } from 'react';
import axios from 'axios';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [pokemonImageUrl, setPokemonImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async (newSearchTerm) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${newSearchTerm.toLowerCase()}`);
      const pokemonId = response.data.id;
      setPokemonImageUrl(`https://unpkg.com/pokeapi-sprites@2.0.2/sprites/pokemon/other/dream-world/${pokemonId}.svg`);
      setSearchResults(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (event) => {
    event.preventDefault();
    fetchData(searchTerm);
  };

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="flex items-center py-4 px-6 bg-white rounded-lg shadow-md">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search Pokemon by name or ID"
        />
        {isLoading && <p className="text-center mt-2">Loading...</p>}
      </form>
      {searchResults && (
        <div className="mt-4">
          <img src={pokemonImageUrl} alt={searchResults.name} className="w-20 h-20 rounded-full" />
          <h4 className="text-lg font-bold text-gray-900">{searchResults.name}</h4>
        </div>
      )}
      {error && <p className="text-red-500">{error.message}</p>}
    </div>
  );
};

export default Search;
