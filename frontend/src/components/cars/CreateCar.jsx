import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateCar = () => {
  const { isAuthenticated, token } = useSelector((state) => state.user);
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
        "https://carzy-314787054684.asia-south2.run.app/api/cars",
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
      // Split the car name into parts
      const parts = carName.split(" ");
      const company = parts[0];
      const model = parts[1] || "";
      const year = parts[2] || new Date().getFullYear();

      // Determine car type
      let carType = "Sedan";
      if (model.toLowerCase().includes("suv")) carType = "SUV";
      if (model.toLowerCase().includes("truck")) carType = "Truck";
      if (model.toLowerCase().includes("van")) carType = "Van";

      // Search for car images using our proxy endpoint
      const searchQuery = `${year} ${company} ${model} ${carType} car photo`;
      const response = await axios.get(
        `/api/proxy/lexica?q=${encodeURIComponent(searchQuery)}`
      );

      // Safely access the images array with error handling
      const images = response.data?.images || [];
      const imageUrls = images
        .filter((img) => img && img.src) // Ensure img and img.src exist
        .slice(0, 3)
        .map((img) => img.src);

      if (imageUrls.length === 0) {
        throw new Error("No images found");
      }

      // Generic descriptions based on car type
      const descriptions = {
        SUV: `The ${year} ${company} ${model} SUV offers exceptional versatility and comfort for both city driving and outdoor adventures.`,
        Sedan: `The ${year} ${company} ${model} sedan delivers a perfect blend of comfort, style, and efficiency.`,
        Truck: `The ${year} ${company} ${model} truck is built tough for serious work and reliability.`,
        Van: `The ${year} ${company} ${model} van provides maximum space and flexibility for all your transportation needs.`,
      };

      // Update form data
      setCarData({
        ...carData,
        title: carName,
        description:
          descriptions[carType] || `${year} ${company} ${model} ${carType}`,
        car_type: carType,
        company: company,
        model: model,
        year: year,
        dealer: "Premium Auto Dealership",
        tags: [
          company.toLowerCase(),
          model.toLowerCase(),
          carType.toLowerCase(),
          year.toString(),
          "automatic",
          "new",
        ],
        images: imageUrls,
      });
    } catch (err) {
      console.error("Generation error:", err);
      setError("Failed to find car images. Please try uploading manually.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Add New Car</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-medium mb-2">Quick Generate</h3>
        <div className="flex flex-col gap-2">
          <input
            type="text"
            value={carNameInput}
            onChange={(e) => setCarNameInput(e.target.value)}
            placeholder="Enter car name (e.g., Toyota Camry 2024)"
            className="w-full p-2 border rounded"
          />
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              Format: Brand Model Year (e.g., Toyota Camry 2024)
            </p>
            <button
              onClick={() => generateCarDetails(carNameInput)}
              disabled={generating || !carNameInput.trim()}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400 flex items-center gap-2"
            >
              {generating ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Generating Images...
                </>
              ) : (
                "Generate"
              )}
            </button>
          </div>
          {generating && (
            <div className="mt-2 text-sm text-gray-600 flex items-center gap-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                ></div>
              </div>
              Generating 1 AI image for your car...
            </div>
          )}
        </div>
      </div>

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
