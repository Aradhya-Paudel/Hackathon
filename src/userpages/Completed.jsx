import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Completed() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  // Mock data - replace with actual API call
  const [approvedForms] = useState([
    {
      id: 1,
      documentType: "Marriage Certificate",
      submittedDate: "2025-11-01",
      approvedDate: "2025-11-14",
      approvers: [
        { name: "Ward Officer", status: "approved", date: "2025-11-05" },
        { name: "Mayor", status: "approved", date: "2025-11-10" },
        { name: "CDO", status: "approved", date: "2025-11-14" },
      ],
    },
    {
      id: 2,
      documentType: "Death Certificate",
      submittedDate: "2025-11-12",
      approvedDate: "2025-11-19",
      approvers: [
        { name: "Ward Officer", status: "approved", date: "2025-11-15" },
        { name: "Mayor", status: "approved", date: "2025-11-19" },
      ],
    },
  ]);

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
                className="px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-gray-200 transition"
              >
                Pending
              </button>
              <button
                onClick={() => navigate("/completed")}
                className="px-4 py-2 rounded-lg font-medium bg-blue-600 text-white"
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
          Approved Applications
        </h1>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Forms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {approvedForms.map((form) => (
            <div
              key={form.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
            >
              {/* Document Type Title */}
              <h2 className="text-xl font-bold text-gray-800 mb-3">
                {form.documentType}
              </h2>

              {/* Dates Info */}
              <div className="mb-4 pb-4 border-b border-gray-200">
                <p className="text-sm text-gray-600">Submitted</p>
                <p className="font-medium text-gray-800">
                  {form.submittedDate}
                </p>
                <p className="text-sm text-green-600 font-medium mt-2">
                  Approved: {form.approvedDate}
                </p>
              </div>

              {/* Status Area - Approvers */}
              <div className="mb-4">
                <p className="text-sm font-semibold text-gray-700 mb-3">
                  Approval Timeline
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
                      <div className="flex flex-col items-end">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500 text-white flex items-center gap-1">
                          <span>✓</span>
                          <span>Approved</span>
                        </span>
                        <span className="text-xs text-gray-500 mt-1">
                          {approver.date}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Download Button */}
              <div className="pt-4 border-t border-gray-200">
                <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition">
                  Download Document
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {approvedForms.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">No approved applications</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Completed;
