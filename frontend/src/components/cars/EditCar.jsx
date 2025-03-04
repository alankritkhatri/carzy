import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EditCar = () => {
  const { id } = useParams();
  const { user } = useAuth();
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

  useEffect(() => {
    if (!user.isAuthenticated) {
      navigate("/login");
    }
    fetchCarDetails();
  }, [user.isAuthenticated, navigate, id]);

  const fetchCarDetails = async () => {
    try {
      const response = await axios.get(
        `https://carzy-backend-production.up.railway.app/api/cars/${id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setCarData(response.data);
    } catch (err) {
      setError("Failed to fetch car details");
      navigate("/dashboard");
    }
  };

  const handleInputChange = (e) => {
    setCarData({
      ...carData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 10) {
      setError("Maximum 10 images allowed");
      return;
    }

    const oversizedFiles = files.filter((file) => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length) {
      setError("Some images are too large. Maximum size per image is 5MB");
      return;
    }

    Promise.all(
      files.map(
        (file) =>
          new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsDataURL(file);
          })
      )
    ).then((base64Images) => {
      setCarData({ ...carData, images: base64Images });
    });
  };

  const handleTagAdd = () => {
    if (tagInput.trim() && !carData.tags.includes(tagInput.trim())) {
      setCarData({
        ...carData,
        tags: [...carData.tags, tagInput.trim()],
      });
      setTagInput("");
    }
  };

  const handleTagRemove = (tagToRemove) => {
    setCarData({
      ...carData,
      tags: carData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axios.put(
        `https://carzy-backend-production.up.railway.app/api/cars/${id}`,
        carData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update car");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Car Listing</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Title</label>
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
          <label className="block mb-1">Description</label>
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
          <label className="block mb-1">Car Type</label>
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
          <label className="block mb-1">Company</label>
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
          <label className="block mb-1">Dealer</label>
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
          <label className="block mb-1">Images (Max 10)</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full p-2 border rounded"
          />
          <div className="mt-2 flex flex-wrap gap-2">
            {carData.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Preview ${index + 1}`}
                className="w-24 h-24 object-cover rounded"
              />
            ))}
          </div>
        </div>
        <div>
          <label className="block mb-1">Tags</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              className="flex-1 p-2 border rounded"
              placeholder="Add a tag"
            />
            <button
              type="button"
              onClick={handleTagAdd}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Add
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {carData.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-gray-200 rounded flex items-center gap-1"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleTagRemove(tag)}
                  className="text-red-500"
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
          className={`w-full p-2 text-white rounded ${
            loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? "Updating..." : "Update Car Listing"}
        </button>
      </form>
    </div>
  );
};

export default EditCar;
