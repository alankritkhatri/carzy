import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      console.log(formData);
      const response = await fetch(
        "https://carzy-314787054684.asia-south2.run.app/api/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Registration failed");
      }

      // Registration successful
      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-6 h-20 flex items-center border-b"></header>
      <main className="flex-1">
        <section className="py-16 bg-gradient-to-br from-cyan-400 to-blue-600">
          <div className="container mx-auto px-6">
            <div className="grid gap-8 lg:grid-cols-2 items-center">
              <div className="flex flex-col justify-center space-y-6">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-white">
                    Your Ultimate Car Management Platform
                  </h1>
                  <p className="max-w-[600px] text-gray-100 md:text-xl">
                    Create, manage, and showcase your car inventory with
                    powerful tools and beautiful presentation.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    className="inline-flex h-10 items-center justify-center rounded-md bg-white px-8 text-sm font-medium text-blue-600 shadow transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-200"
                    href="/login"
                  >
                    Get Started
                  </a>
                  <a
                    className="inline-flex h-10 items-center justify-center rounded-md border border-white bg-transparent px-8 text-sm font-medium text-white shadow-sm transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-200"
                    href="#features"
                  >
                    Learn More
                  </a>
                </div>
              </div>
              <div className="relative order-first lg:order-last">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-2xl blur-3xl opacity-20" />
                <img
                  alt="Car Management Dashboard"
                  className="relative w-full h-auto rounded-xl object-cover object-center shadow-2xl"
                  src="https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=2070&auto=format&fit=crop"
                  height={500}
                  width={800}
                />
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-16">
              Powerful Features
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="p-3 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">User Authentication</h3>
                <p className="text-center text-gray-500">
                  Secure login and signup functionality for managing your
                  inventory.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="p-3 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Detailed Car Listings</h3>
                <p className="text-center text-gray-500">
                  Add up to 10 images, title, description, and tags for each
                  car.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="p-3 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M8.25 10.875a2.625 2.625 0 115.25 0 2.625 2.625 0 01-5.25 0z" />
                    <path
                      fillRule="evenodd"
                      d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.125 4.5a4.125 4.125 0 102.338 7.524l2.007 2.006a.75.75 0 101.06-1.06l-2.006-2.007a4.125 4.125 0 00-3.399-6.463z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Advanced Search</h3>
                <p className="text-center text-gray-500">
                  Quickly find cars by searching through titles, descriptions,
                  and tags.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-16 md:py-24 lg:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 to-blue-50" />
          <div className="container mx-auto relative px-6 lg:px-8">
            <div className="flex flex-col items-center justify-center space-y-6 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Start Managing Your Cars Today
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join thousands of car dealers and enthusiasts who are already
                  using our platform.
                </p>
              </div>
              <div className="w-full max-w-md space-y-4">
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  <input
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-200"
                    placeholder="Full Name"
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                  />
                  <input
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-200"
                    placeholder="Email Address"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                  <input
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-200"
                    placeholder="Password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                  <input
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-200"
                    placeholder="Role"
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    required
                  />
                  <button
                    className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium"
                    type="submit"
                  >
                    Create Free Account
                  </button>
                </form>
                <p className="text-xs text-gray-500">
                  By signing up, you agree to our{" "}
                  <a
                    className="underline underline-offset-2 hover:text-blue-600"
                    href="#"
                  >
                    Terms & Conditions
                  </a>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t bg-white">
        <div className="container mx-auto flex flex-col sm:flex-row py-8 items-center px-6 lg:px-8">
          <p className="text-xs text-gray-500">
            © 2024 Carzy. All rights reserved.
          </p>
          <nav className="sm:ml-auto flex gap-4 sm:gap-6">
            <a className="text-xs hover:text-blue-600" href="#">
              Terms of Service
            </a>
            <a className="text-xs hover:text-blue-600" href="#">
              Privacy
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
