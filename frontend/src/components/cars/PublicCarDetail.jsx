import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const PublicCarDetail = () => {
  const { publicUrl } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const response = await axios.get(`/api/public/cars/${publicUrl}`);
        setCar(response.data);
        setLoading(false);
      } catch (err) {
        setError("Car not found");
        setLoading(false);
      }
    };

    fetchCar();
  }, [publicUrl]);

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error)
    return <div className="text-center py-8 text-red-500">{error}</div>;
  if (!car) return null;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">{car.title}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          {car.images[0] && (
            <img
              src={car.images[0]}
              alt={car.title}
              className="w-full rounded-lg shadow-lg"
            />
          )}
        </div>
        <div>
          <p className="text-gray-600 mb-4">{car.description}</p>
          <div className="space-y-2">
            <p>
              <span className="font-semibold">Type:</span> {car.car_type}
            </p>
            <p>
              <span className="font-semibold">Company:</span> {car.company}
            </p>
            <p>
              <span className="font-semibold">Dealer:</span> {car.dealer}
            </p>
          </div>
          <div className="mt-4">
            {car.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicCarDetail;
