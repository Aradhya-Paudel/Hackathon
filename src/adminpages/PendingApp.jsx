import { useNavigate } from "react-router-dom";
import { useState } from "react";

function PendingApp() {
  const navigate = useNavigate();

  // Mock data - replace with actual API call
  const [pendingForms] = useState([
    {
      id: 1,
      documentType: "Citizenship Certificate",
      submittedDate: "2025-11-20",
      userName: "John Doe",
      phoneNumber: "9841234567",
      status: "reviewing",
    },
    {
      id: 2,
      documentType: "Birth Certificate",
      submittedDate: "2025-11-21",
      userName: "Jane Smith",
      phoneNumber: "9847654321",
      status: "pending",
    },
    {
      id: 3,
      documentType: "Marriage Certificate",
      submittedDate: "2025-11-19",
      userName: "Ram Sharma",
      phoneNumber: "9812345678",
      status: "reviewing",
    },
  ]);

  const handleApprove = (id) => {
    console.log("Approving application:", id);
    // API call to approve
  };

  const handleReject = (id) => {
    console.log("Rejecting application:", id);
    // API call to reject
  };

  const handleView = (id) => {
    console.log("Viewing application:", id);
    // Navigate to detailed view
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left side - Title */}
            <div className="text-2xl font-bold text-gray-800">Admin Panel</div>

            {/* Right side - Navigation Links */}
            <div className="flex space-x-6">
              <button
                onClick={() => navigate("/admin/pending")}
                className="px-4 py-2 rounded-lg font-medium bg-blue-600 text-white"
              >
                Pending
              </button>
              <button
                onClick={() => navigate("/admin/approved")}
                className="px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-gray-200 transition"
              >
                Approved
              </button>
              <button
                onClick={() => navigate("/admin/cancelled")}
                className="px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-gray-200 transition"
              >
                Cancelled
              </button>
              <button
                onClick={() => navigate("./admin/Graph")}
                className="px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-gray-200 transition"
              >
                Graph
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Pending Applications
        </h1>

        {/* Forms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingForms.map((form) => (
            <div
              key={form.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
            >
              {/* Document Type Title */}
              <h2 className="text-xl font-bold text-gray-800 mb-3">
                {form.documentType}
              </h2>

              {/* User Info */}
              <div className="mb-4 pb-4 border-b border-gray-200">
                <p className="text-sm text-gray-600">Applicant</p>
                <p className="font-medium text-gray-800">{form.userName}</p>
                <p className="text-sm text-gray-600">{form.phoneNumber}</p>
              </div>

              {/* Submission Date */}
              <div className="mb-4 pb-4 border-b border-gray-200">
                <p className="text-sm text-gray-600">Submitted</p>
                <p className="font-medium text-gray-800">
                  {form.submittedDate}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  onClick={() => handleView(form.id)}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  View Details
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleApprove(form.id)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(form.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {pendingForms.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">No pending applications</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default PendingApp;
