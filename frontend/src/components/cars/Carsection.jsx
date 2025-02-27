import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Carsection = () => {
  const [cars, setCars] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCars();
  }, [user.token]);

  const fetchCars = async () => {
    try {
      const response = await axios.get(
        "https://carzy-bz9m.onrender.com/api/cars",
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setCars(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch cars");
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredCars = cars.filter((car) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      car.title.toLowerCase().includes(searchLower) ||
      car.description.toLowerCase().includes(searchLower) ||
      car.tags.some((tag) => tag.toLowerCase().includes(searchLower))
    );
  });

  const handleDeleteCar = async (carId) => {
    if (!window.confirm("Are you sure you want to delete this car?")) return;

    try {
      await axios.delete(`https://carzy-bz9m.onrender.com/api/cars/${carId}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      // Refresh the cars list
      fetchCars();
    } catch (err) {
      setError("Failed to delete car");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search cars..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          onClick={() => navigate("/cars/create")}
          className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add New Car
        </button>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCars.map((car) => (
          <div
            key={car._id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="relative h-48">
              {car.images && car.images.length > 0 ? (
                <img
                  src={car.images[0]}
                  alt={car.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">No image</span>
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{car.title}</h3>
              <p className="text-gray-600 mb-4 line-clamp-2">
                {car.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {car.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-200 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex justify-between items-center">
                <button
                  onClick={() => navigate(`/cars/edit/${car._id}`)}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteCar(car._id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCars.length === 0 && (
        <div className="text-center text-gray-500 mt-8">No cars found</div>
      )}
    </div>
  );
};

export default Carsection;
