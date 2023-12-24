import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [nextPage, setNextPage] = useState('');
  const [types, setTypes] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  const fetchData = useCallback(async (url) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(url);
      const newResults = response.data.results.map((pokemon) => ({
        name: pokemon.name,
        url: pokemon.url,
      }));
      setSearchResults((prevResults) => [...prevResults, ...newResults]);
      setNextPage(response.data.next);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading, setError, setSearchResults, setNextPage]);

  useEffect(() => {
    fetchData('https://pokeapi.co/api/v2/pokemon?limit=20');
    axios.get('https://pokeapi.co/api/v2/type').then((response) => {
      setTypes(response.data.results.map((type) => type.name));
    });
  }, [fetchData]);

  const handleSearch = (event) => {
    event.preventDefault();
    setSearchResults([]);
    setNextPage('');
    fetchData(`https://pokeapi.co/api/v2/pokemon?limit=20&offset=0&${selectedType && `type=${selectedType}`}`);
  };

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
  };

  const handleCardClick = async (url) => {
    try {
      const response = await axios.get(url);
      setSelectedPokemon(response.data);
      setShowDetailModal(true);
    } catch (error) {
      setError(error);
    }
  };

  const handleModalClose = () => {
    setShowDetailModal(false);
    setSelectedPokemon(null);
  };

  const handleScroll = useCallback(() => {
    if (window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight) {
      if (nextPage) {
        fetchData(nextPage);
      }
    }
  }, [nextPage, fetchData]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll, nextPage]);

  return (
    <div className="flex flex-col items-center py-4 px-6 bg-white rounded-lg shadow-md">
      <form onSubmit={handleSearch} className="mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search Pokemon by name or ID"
        />
        <select
          value={selectedType}
          onChange={handleTypeChange}
          className="mt-2 w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Types</option>
          {types.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Search
        </button>
        {isLoading && <p className="text-center mt-2">Loading...</p>}
      </form>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {searchResults.map((pokemon, index) => (
          <div
            key={index}
            className="cursor-pointer bg-gray-100 p-4 rounded-md hover:shadow-md"
            onClick={() => handleCardClick(pokemon.url)}
          >
            <img
              src={`https://unpkg.com/pokeapi-sprites@2.0.2/sprites/pokemon/other/dream-world/${index + 1}.svg`}
              alt={pokemon.name}
              className="w-20 h-20 mx-auto mb-2"
            />
            <p className="text-center font-bold">{pokemon.name}</p>
          </div>
        ))}
      </div>
      {error && <p className="text-red-500 mt-4">{error.message}</p>}
      {showDetailModal && selectedPokemon && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md">
            <h2 className="text-2xl font-bold mb-2">{selectedPokemon.name}</h2>
            <img
              src={`https://unpkg.com/pokeapi-sprites@2.0.2/sprites/pokemon/other/dream-world/${selectedPokemon.id}.svg`}
              alt={selectedPokemon.name}
              className="w-32 h-32 mx-auto mb-2"
            />
            <p>ID: {selectedPokemon.id}</p>
            <p>Type: {selectedPokemon.types.map((type) => type.type.name).join(', ')}</p>
            <button
              onClick={handleModalClose}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
