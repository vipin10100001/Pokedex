import React, { useState } from 'react';
import axios from 'axios';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [pokemonImageUrl, setPokemonImageUrl] = useState('');

  const handleSearch = async (event) => {
    event.preventDefault(); 
    setSearchTerm(event.target.value); 

    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${searchTerm}`);

      
      const pokemonId = response.data.id;
      setPokemonImageUrl(`https://unpkg.com/pokeapi-sprites@2.0.2/sprites/pokemon/other/dream-world/${pokemonId}.svg`);

      setSearchResults(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div className="flex items-center py-4 px-6 bg-white rounded-lg shadow-md">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search Pokemon by name or ID"
        />
      </form>
      {searchResults.length > 0 && (
        <div className="mt-4">
          <img src={pokemonImageUrl} alt={searchResults.name} className="w-20 h-20 rounded-full" />
          <h4 className="text-lg font-bold text-gray-900">{searchResults.name}</h4>
        </div>
      )}
    </div>
  );
};

export default Search;
