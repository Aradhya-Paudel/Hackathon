import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Pending() {
  const navigate = useNavigate();

  // Mock data - replace with actual API call
  const [pendingForms] = useState([]);

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-500 text-white";
      case "reviewing":
        return "bg-yellow-500 text-white";
      case "pending":
        return "bg-gray-300 text-gray-600";
      default:
        return "bg-gray-300 text-gray-600";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return "✓";
      case "reviewing":
        return "⟳";
      case "pending":
        return "○";
      default:
        return "○";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left side - Title */}
            <div className="text-2xl font-bold text-gray-800">Title</div>

            {/* Right side - Navigation Links */}
            <div className="flex space-x-6">
              <button
                onClick={() => navigate("/pending")}
                className="px-4 py-2 rounded-lg font-medium bg-blue-600 text-white"
              >
                Pending
              </button>
              <button
                onClick={() => navigate("/completed")}
                className="px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-gray-200 transition"
              >
                Approved
              </button>
              <button
                onClick={() => navigate("/cancelled")}
                className="px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-gray-200 transition"
              >
                Cancelled
              </button>
              <button
                onClick={() => navigate("/form")}
                className="px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-gray-200 transition"
              >
                Form
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

              {/* Submission Date */}
              <div className="mb-4 pb-4 border-b border-gray-200">
                <p className="text-sm text-gray-600">Submitted</p>
                <p className="font-medium text-gray-800">
                  {form.submittedDate}
                </p>
              </div>

              {/* Status Area - Approvers */}
              <div className="mb-4">
                <p className="text-sm font-semibold text-gray-700 mb-3">
                  Approval Status
                </p>
                <div className="space-y-2">
                  {form.approvers.map((approver, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm text-gray-700">
                        {approver.name}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(
                          approver.status
                        )}`}
                      >
                        <span>{getStatusIcon(approver.status)}</span>
                        <span className="capitalize">{approver.status}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Estimated Time */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Est. Approval</span>
                  <span className="text-sm font-semibold text-blue-600">
                    {form.estimatedTime}
                  </span>
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

export default Pending;
