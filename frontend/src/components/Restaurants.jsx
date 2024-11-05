import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import axios from 'axios';
import { Link } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';

// GradientCircularProgress Component
function GradientCircularProgress() {
  return (
    <React.Fragment>
      <svg width={0} height={0}>
        <defs>
          <linearGradient id="my_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e01cd5" />
            <stop offset="100%" stopColor="#1CB5E0" />
          </linearGradient>
        </defs>
      </svg>
      <CircularProgress sx={{ 'svg circle': { stroke: 'url(#my_gradient)' } }} />
    </React.Fragment>
  );
}

const Restaurants = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get('http://localhost:8080/search-cuisine?q=');
        setRestaurants(response.data.data || []);
        setFilteredRestaurants(response.data.data || []);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
        setError('Failed to fetch restaurants.');
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = restaurants.filter((restaurant) =>
        restaurant.shop_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredRestaurants(filtered);
    } else {
      setFilteredRestaurants(restaurants);
    }
  }, [searchQuery, restaurants]);

  const handleInputChange = (e) => setSearchQuery(e.target.value);

  return (
    <div
      style={{
        fontFamily: 'Arial, sans-serif',
        maxWidth: '375px',
        margin: '0 auto',
        padding: '10px',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '10px',
          borderRadius: '20px',
          marginBottom: '50px',
          position: 'sticky',
          top: '10%',
          zIndex: 100,
          borderBlockColor: 'white',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
        }}
      >
        <FaSearch style={{ fontSize: '20px', marginRight: '10px' }} />
        <input
          type="text"
          placeholder="Search by Restaurant..."
          style={{
            border: 'none',
            outline: 'none',
            backgroundColor: 'transparent',
            fontSize: '16px',
            flex: 1,
          }}
          value={searchQuery}
          onChange={handleInputChange}
        />
      </div>

      {loading ? (
        <Stack
          spacing={2}
          direction="row"
          alignItems="center"
          justifyContent="center"
          style={{ minHeight: '50vh' }} // Center the spinner vertically
        >
          <GradientCircularProgress />
        </Stack>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '15px',
            padding: '10px',
          }}
        >
          {filteredRestaurants.length > 0 ? (
            filteredRestaurants.map((restaurant) => (
              <Link
                to={`/restaurant/${restaurant._id}`}
                key={restaurant._id}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div
                  style={{
                    padding: '20px',
                    borderRadius: '10px',
                    backgroundColor: '#fff',
                    boxShadow: '0 4px 8px rgba(0.5, 0, 0, 0.5)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    height: '200px', // Set a fixed height for uniformity
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onMouseDown={(e) => {
                    e.currentTarget.style.transform = 'scale(0.95)'; // Scale down on click
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)'; // Change shadow on click
                  }}
                  onMouseUp={(e) => {
                    e.currentTarget.style.transform = 'scale(1)'; // Scale back to normal
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0.5, 0, 0, 0.5)'; // Reset shadow
                  }}
                >
                  <img
                    src={restaurant.logo}
                    alt={restaurant.shop_name}
                    style={{
                      width: '120px',
                      height: '100px',
                      objectFit: 'contain',
                      marginBottom: '10px',
                    }}
                  />
                  <h3 style={{ color: 'black', margin: '0', textAlign: 'center' }}>{restaurant.shop_name}</h3>
                </div>
              </Link>
            ))
          ) : (
            <div style={{ textAlign: 'center' }}>No restaurants found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Restaurants;
