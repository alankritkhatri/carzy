import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Carsection = () => {
  const [cars, setCars] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { token } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCars();
  }, [token]);

  const fetchCars = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/cars", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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
      await axios.delete(`http://localhost:3000/api/cars/${carId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Refresh the cars list
      fetchCars();
    } catch (err) {
      setError("Failed to delete car");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Cars</h1>
        <button
          onClick={() => navigate("/cars/create")}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add New Car
        </button>
      </div>
      <input
        type="text"
        placeholder="Search cars"
        value={searchTerm}
        onChange={handleSearch}
        className="w-full p-2 border rounded mb-6"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCars.map((car) => (
          <div
            key={car._id}
            className="border rounded-lg overflow-hidden shadow-lg"
          >
            {car.images[0] && (
              <img
                src={car.images[0]}
                alt={car.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{car.title}</h2>
              <p className="text-gray-600 mb-4">{car.description}</p>
              <div className="mb-4 bg-gray-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Public URL:
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={`${window.location.origin}/cars/${car.publicUrl}`}
                    readOnly
                    className="text-sm bg-white border rounded px-2 py-1 flex-1 text-gray-600"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `${window.location.origin}/cars/${car.publicUrl}`
                      );
                      alert("URL copied to clipboard!");
                    }}
                    className="px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 text-sm font-medium"
                  >
                    Copy
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {car.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-200 px-2 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex justify-end mt-4 space-x-2">
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
    </div>
  );
};

export default Carsection;
