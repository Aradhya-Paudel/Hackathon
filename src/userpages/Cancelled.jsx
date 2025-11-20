import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Cancelled() {
  const navigate = useNavigate();

  // Mock data - replace with actual API call
  const [cancelledForms] = useState([
    {
      id: 1,
      documentType: "Divorce Certificate",
      submittedDate: "2025-10-30",
      cancelledDate: "2025-11-10",
      cancelledBy: "Court",
      reason: "Court order pending",
      lastApprovers: [
        { name: "Ward Officer", status: "approved" },
        { name: "Mayor", status: "approved" },
        { name: "Court", status: "rejected" },
      ],
    },
    {
      id: 2,
      documentType: "Land Registration Certificate",
      submittedDate: "2025-11-02",
      cancelledDate: "2025-11-14",
      cancelledBy: "Land Revenue Office",
      reason: "Property ownership dispute",
      lastApprovers: [
        { name: "Ward Officer", status: "approved" },
        { name: "Mayor", status: "approved" },
        { name: "Land Revenue Office", status: "rejected" },
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
                className="px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-gray-200 transition"
              >
                Approved
              </button>
              <button
                onClick={() => navigate("/cancelled")}
                className="px-4 py-2 rounded-lg font-medium bg-blue-600 text-white"
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
          Cancelled Applications
        </h1>

        {/* Forms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cancelledForms.map((form) => (
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
                <p className="text-sm text-red-600 font-medium mt-2">
                  Cancelled: {form.cancelledDate}
                </p>
              </div>

              {/* Cancellation Info */}
              <div className="mb-4 pb-4 border-b border-gray-200">
                <p className="text-sm text-gray-600">Cancelled By</p>
                <p className="font-medium text-red-600">{form.cancelledBy}</p>
                <p className="text-sm text-gray-700 mt-2">
                  <span className="font-semibold">Reason:</span> {form.reason}
                </p>
              </div>

              {/* Status Area - Last Approvers */}
              <div className="mb-4">
                <p className="text-sm font-semibold text-gray-700 mb-3">
                  Approval History
                </p>
                <div className="space-y-2">
                  {form.lastApprovers.map((approver, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm text-gray-700">
                        {approver.name}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                          approver.status === "approved"
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        <span>
                          {approver.status === "approved" ? "✓" : "✗"}
                        </span>
                        <span className="capitalize">{approver.status}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {cancelledForms.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">No cancelled applications</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cancelled;
