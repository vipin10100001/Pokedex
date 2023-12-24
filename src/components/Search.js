import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);
  const [nextPage, setNextPage] = useState('');
  const [types, setTypes] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  const fetchData = useCallback(async (url) => {
    try {
      const response = await axios.get(url);
      const newResults = response.data.results.map((pokemon) => ({
        name: pokemon.name,
        url: pokemon.url,
        mainColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      }));
      setSearchResults((prevResults) => [...prevResults, ...newResults]);
      setNextPage(response.data.next);
    } catch (error) {
      setError(error);
    }
  }, [setSearchResults, setNextPage]);

  useEffect(() => {
    fetchData('https://pokeapi.co/api/v2/pokemon?limit=20');
    axios.get('https://pokeapi.co/api/v2/type').then((response) => {
      setTypes(response.data.results.map((type) => type.name));
    });

    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop ===
        document.documentElement.offsetHeight
      ) {
        if (nextPage) {
          fetchData(nextPage);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [fetchData, nextPage]);

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

  return (
    <div className="min-h-screen flex flex-col items-center py-4 px-6 bg-white">
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 w-full mb-4">
        <div className="flex-grow">
          <input
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search Pokemon by name or ID"
          />
        </div>
        <div className="flex-shrink-0 md:ml-2">
          <select
            value={selectedType}
            onChange={handleTypeChange}
            className="w-full md:w-auto px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Types</option>
            {types.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-shrink-0 md:ml-2">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Search
          </button>
        </div>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 flex-grow w-full">
        {searchResults.map((pokemon, index) => (
          <div
            key={index}
            className="cursor-pointer bg-gray-100 p-4 rounded-md hover:shadow-md w-full"
          >
            <div
              className={`border border-solid border-4 rounded-md ${
                selectedPokemon && selectedPokemon.name === pokemon.name ? 'bg-blue-100' : ''
              }`}
              style={{ backgroundColor: pokemon.mainColor, borderRadius: '10px', transition: 'all 0.3s' }}
              onClick={() => handleCardClick(pokemon.url)}
            >
              <img
                src={`https://unpkg.com/pokeapi-sprites@2.0.2/sprites/pokemon/other/dream-world/${index + 1}.svg`}
                alt={pokemon.name}
                className="w-20 h-20 mx-auto mb-2 rounded-md"
              />
              <p className="text-center font-bold">{pokemon.name}</p>
              {selectedPokemon && selectedPokemon.name === pokemon.name && (
                <div className="mt-2">
                  <div className="text-center text-gray-700 mb-2">Color Scale</div>
                  <div className="flex justify-center space-x-2">
                    {[0, 20, 40, 60, 80, 100].map((percentage) => (
                      <div
                        key={percentage}
                        style={{
                          width: '20px',
                          height: '20px',
                          backgroundColor: `rgba(0, 0, 255, ${percentage / 100})`,
                          borderRadius: '50%',
                        }}
                      ></div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {error && <p className="text-red-500 mt-4">{error.message}</p>}
      {showDetailModal && selectedPokemon && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md max-w-screen-md w-full">
            <h2 className="text-3xl font-bold mb-2">{selectedPokemon.name}</h2>
            <img
              src={`https://unpkg.com/pokeapi-sprites@2.0.2/sprites/pokemon/other/dream-world/${selectedPokemon.id}.svg`}
              alt={selectedPokemon.name}
              className="w-48 h-48 mx-auto mb-2 rounded-md"
            />
            <p>ID: {selectedPokemon.id}</p>
            <p>Type: {selectedPokemon.types.map((type) => type.type.name).join(', ')}</p>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {selectedPokemon.stats.map((stat) => (
                <div key={stat.stat.name}>
                  <p className="font-bold">{stat.stat.name}</p>
                  <div className="flex items-center">
                    <p className="mr-2">{stat.base_stat}</p>
                    <div className="flex-grow bg-gray-200 h-4 rounded-md">
                      <div
                        className="bg-blue-500 h-full rounded-md"
                        style={{ width: `${(stat.base_stat / 100) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
