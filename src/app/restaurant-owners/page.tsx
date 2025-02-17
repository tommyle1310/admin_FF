'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';


interface Restaurant {
  id: string;
  name: string;
  owner: string;
  status: string;
}

const page = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    pending: 0
  });

  useEffect(() => {
    fetchRestaurants();
  }, []); // Empty dependency array ensures this only runs once on mount

  const fetchRestaurants = async () => {
    try {
      const response = await axios({
        method: 'GET',
        url: 'https://73fd-2405-4800-5716-1560-f510-80e4-a4dd-d086.ngrok-free.app/restaurants',
        headers: {
          // 'ngrok-skip-browser-warning': 'true',
          'Content-Type': 'application/json',
          // 'Access-Control-Allow-Methods': 'GET'
        },
        withCredentials: true
      });
      
      console.log("check ku", response.data);
      // ... rest of your code ...
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      setRestaurants([]);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await axios.patch(`https://73fd-2405-4800-5716-1560-f510-80e4-a4dd-d086.ngrok-free.app/${id}/status`, {
        status: newStatus
      });
      fetchRestaurants(); // Refresh the list
    } catch (error) {
      console.error('Error updating restaurant status:', error);
    }
  };

  const handleDeleteRestaurant = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this restaurant?')) {
      try {
        await axios.delete(`https://73fd-2405-4800-5716-1560-f510-80e4-a4dd-d086.ngrok-free.app/${id}`);
        fetchRestaurants(); // Refresh the list
      } catch (error) {
        console.error('Error deleting restaurant:', error);
      }
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Restaurant Owners Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Total Restaurants</h2>
          <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Active Restaurants</h2>
          <div className="text-3xl font-bold text-green-600">{stats.active}</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Pending Approvals</h2>
          <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Restaurant List</h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {restaurants?.map((restaurant: { id: string; name: string; owner: string; status: string }) => (
                <tr key={restaurant?.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{restaurant.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{restaurant.owner}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${restaurant.status === 'active' ? 'bg-green-100 text-green-800' : 
                      restaurant.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'}`}>
                      {restaurant.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleStatusChange(restaurant.id, 
                        restaurant.status === 'active' ? 'inactive' : 'active')}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      {restaurant.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleDeleteRestaurant(restaurant.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default page;
