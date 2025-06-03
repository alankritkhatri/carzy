import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const CreateCar = () => {
  const {
    user: { isAuthenticated, token },
  } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [carData, setCarData] = useState({
    title: "",
    description: "",
    images: [],
    tags: [],
    car_type: "",
    company: "",
    dealer: "",
  });
  const [tagInput, setTagInput] = useState("");
  const [carNameInput, setCarNameInput] = useState("");
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (e) => {
    setCarData({
      ...carData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    // Check file sizes
    const oversizedFiles = files.filter((file) => file.size > MAX_FILE_SIZE);
    if (oversizedFiles.length > 0) {
      setError("Some images are too large. Maximum size per image is 5MB");
      return;
    }

    if (files.length > 10) {
      setError("Maximum 10 images allowed");
      return;
    }

    // Convert images to base64
    const imagePromises = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(imagePromises).then((base64Images) => {
      setCarData({ ...carData, images: base64Images });
    });
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    if (tagInput.trim()) {
      setCarData({
        ...carData,
        tags: [...carData.tags, tagInput.trim()],
      });
      setTagInput("");
    }
  };

  const handleRemoveTag = (indexToRemove) => {
    setCarData({
      ...carData,
      tags: carData.tags.filter((_, index) => index !== indexToRemove),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "https://api.carzy.store/api/cars",
        carData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        navigate("/dashboard");
      } else {
        throw new Error("Failed to create car");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create car");
    } finally {
      setLoading(false);
    }
  };

  const generateCarDetails = async (carName) => {
    setGenerating(true);
    setError("");

    try {
      // Input validation
      if (!carName?.trim()) {
        throw new Error("Please enter a car name");
      }

      // Parse car name
      const parts = carName.trim().split(/\s+/);
      if (parts.length < 2) {
        throw new Error(
          "Please enter both car brand and model (e.g., Toyota Camry 2024)"
        );
      }

      // Extract year if present
      let year = new Date().getFullYear();
      const lastPart = parts[parts.length - 1];
      if (
        /^\d{4}$/.test(lastPart) &&
        parseInt(lastPart) >= 1900 &&
        parseInt(lastPart) <= year + 1
      ) {
        year = parseInt(lastPart);
        parts.pop();
      }

      // Extract brand and model
      const company = parts[0];
      const model = parts.slice(1).join(" ");

      // Validate brand and model
      if (!company || !model) {
        throw new Error(
          "Invalid car name format. Please enter brand and model."
        );
      }

      // Determine car type
      let carType = "Sedan"; // default type
      const modelLower = model.toLowerCase();
      if (modelLower.includes("suv") || modelLower.includes("crossover")) {
        carType = "SUV";
      } else if (
        modelLower.includes("truck") ||
        modelLower.includes("pickup")
      ) {
        carType = "Truck";
      } else if (modelLower.includes("van") || modelLower.includes("minivan")) {
        carType = "Van";
      } else if (modelLower.includes("coupe")) {
        carType = "Coupe";
      }

      // Prepare search query
      const searchQuery = `${company} ${model} ${year} car exterior`;
      const baseUrl = "https://api.carzy.store";

      try {
        // First try to get images from our backend proxy
        const response = await axios.get(
          `${baseUrl}/api/proxy/lexica?q=${encodeURIComponent(searchQuery)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            timeout: 10000, // 10 second timeout
          }
        );

        let imageUrls = [];
        if (response.data && Array.isArray(response.data.images)) {
          imageUrls = response.data.images
            .filter((img) => img && typeof img.src === "string")
            .slice(0, 3)
            .map((img) => img.src);
        }

        // If no images from primary source, use a fallback placeholder
        if (imageUrls.length === 0) {
          imageUrls = [
            `https://via.placeholder.com/800x600.png?text=${encodeURIComponent(
              `${year} ${company} ${model}`
            )}`,
          ];
        }

        // Generate description with more details
        const description = `The ${year} ${company} ${model} ${carType.toLowerCase()} represents the perfect blend of style and functionality. This ${carType.toLowerCase()} offers modern design, reliable performance, and exceptional comfort for both driver and passengers.`;

        // Update car data
        const newCarData = {
          title: `${year} ${company} ${model}`,
          description,
          car_type: carType,
          company,
          model,
          year: year.toString(),
          dealer: "Premium Auto Dealership",
          tags: [
            company,
            model,
            carType,
            year.toString(),
            company.toLowerCase(),
            model.toLowerCase(),
          ].filter(
            (tag, index, self) => tag && self.indexOf(tag) === index // Remove duplicates
          ),
          images: imageUrls,
        };

        setCarData(newCarData);

        if (!imageUrls.length) {
          setError("No images found. Please upload images manually.");
        }
      } catch (apiError) {
        console.error("API Error:", apiError);
        throw new Error(
          "Failed to fetch images. Please try again or upload images manually."
        );
      }
    } catch (err) {
      console.error("Generation error:", err);
      setError(
        err.message ||
          "Failed to generate car details. Please try again or enter details manually."
      );
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Add New Car</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Title</label>
          <input
            type="text"
            name="title"
            value={carData.title}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            name="description"
            value={carData.description}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            rows="4"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Images (Max 10)
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="w-full p-2 border rounded"
          />
          <div className="grid grid-cols-5 gap-2 mt-2">
            {carData.images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Preview ${index + 1}`}
                className="w-full h-20 object-cover rounded"
              />
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Car Type</label>
          <input
            type="text"
            name="car_type"
            value={carData.car_type}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Company</label>
          <input
            type="text"
            name="company"
            value={carData.company}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Dealer</label>
          <input
            type="text"
            name="dealer"
            value={carData.dealer}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Tags</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              className="flex-1 p-2 border rounded"
              placeholder="Add a tag"
            />
            <button
              onClick={handleAddTag}
              type="button"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {carData.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-gray-200 px-2 py-1 rounded-full text-sm flex items-center gap-1"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? "Creating..." : "Create Car"}
        </button>
      </form>
    </div>
  );
};

export default CreateCar;
