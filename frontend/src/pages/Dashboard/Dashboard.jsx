import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Carsection from "../../components/cars/Carsection";

const Dashboard = () => {
  const { isAuthenticated, username, role } = useSelector(
    (state) => state.user
  );

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const showcaseUrl = `${window.location.origin}/showcase/${username}`;

  return (
    <div className="p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold mb-1">Welcome, {username}!</h1>
              <p className="text-gray-600">Role: {role}</p>
            </div>

            {/* Showcase URL Section */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Your Showcase URL:
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={showcaseUrl}
                  readOnly
                  className="text-sm bg-white border rounded px-3 py-2 flex-1 text-gray-600 min-w-[250px]"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(showcaseUrl);
                    alert("URL copied to clipboard!");
                  }}
                  className="px-4 py-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 text-sm font-medium whitespace-nowrap"
                >
                  Copy Link
                </button>
              </div>
            </div>
          </div>
        </div>

        <Carsection />
      </div>
    </div>
  );
};

export default Dashboard;
