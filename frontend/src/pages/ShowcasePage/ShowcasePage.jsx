import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

axios.defaults.withCredentials = true;

const ShowcasePage = () => {
  const { name } = useParams();
  const [userData, setUserData] = useState({ name: "", cars: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchShowcase = async () => {
      try {
        const encodedName = encodeURIComponent(name);
        console.log("Fetching showcase for:", encodedName);

        const response = await axios.get(
          `https://carzy-314787054684.asia-south2.run.app//api/showcase/${encodedName}`
        );
        console.log("Showcase response:", response.data);

        if (!response.data || typeof response.data !== "object") {
          throw new Error("Invalid response format");
        }

        const { name: userName, cars = [], showcaseUrl } = response.data;

        if (typeof userName !== "string") {
          throw new Error("Invalid user name in response");
        }

        if (!Array.isArray(cars)) {
          throw new Error("Invalid cars data in response");
        }

        setUserData({
          name: userName,
          showcaseUrl,
          cars: cars.map((car) => ({
            _id: car._id || String(Math.random()),
            title: car.title || "",
            description: car.description || "",
            images: Array.isArray(car.images) ? car.images : [],
            tags: Array.isArray(car.tags) ? car.tags : [],
            car_type: car.car_type || "",
            company: car.company || "",
            publicUrl: car.publicUrl || "",
          })),
        });
        setLoading(false);
      } catch (err) {
        console.error("Showcase error details:", err);
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Failed to load showcase";
        setError(errorMessage);
        setLoading(false);
      }
    };

    if (name) {
      fetchShowcase();
    }
  }, [name]);

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error)
    return <div className="text-center py-8 text-red-500">{error}</div>;
  if (!userData.name)
    return <div className="text-center py-8">No showcase found</div>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">{userData.name} Showcase</h1>
        <p className="text-gray-600">
          {userData.cars.length > 0
            ? "Check out our available cars"
            : "No cars available at the moment"}
        </p>
      </div>

      {userData.cars.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userData.cars.map((car) => (
            <div
              key={car._id || Math.random()}
              className="border rounded-lg overflow-hidden shadow-lg"
            >
              {car.images?.[0] && (
                <img
                  src={car.images[0]}
                  alt={car.title || "Car image"}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{car.title}</h2>
                <p className="text-gray-600 mb-4">{car.description}</p>
                {car.tags?.length > 0 && (
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
                )}
                <div className="mt-4 text-sm text-gray-500">
                  <p>Type: {car.car_type || "N/A"}</p>
                  <p>Company: {car.company || "N/A"}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          No cars have been added to this showcase yet.
        </div>
      )}
    </div>
  );
};

export default ShowcasePage;
