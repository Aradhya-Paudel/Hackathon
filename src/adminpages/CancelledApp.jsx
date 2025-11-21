import { useNavigate } from "react-router-dom";
import { useState } from "react";

function CancelledApp() {
  const navigate = useNavigate();

  // Mock data - replace with actual API call
  const [cancelledForms] = useState([
    {
      id: 1,
      documentType: "Citizenship Certificate",
      submittedDate: "2025-11-15",
      cancelledDate: "2025-11-20",
      userName: "John Doe",
      phoneNumber: "9841234567",
      reason: "Incomplete documentation",
      status: "cancelled",
      formData: {
        citizenshipType: "Descent",
        fullName: "John Doe",
        dateOfBirth: "1990-05-10",
        gender: "Male",
        fatherName: "Robert Doe",
        motherName: "Mary Doe",
        grandfatherName: "William Doe",
        permanentProvince: "Bagmati",
        permanentDistrict: "Kathmandu",
        permanentMunicipality: "Kathmandu Metropolitan",
        permanentWard: "10",
        temporaryProvince: "Bagmati",
        temporaryDistrict: "Kathmandu",
        temporaryMunicipality: "Kathmandu Metropolitan",
        temporaryWard: "10",
      },
    },
    {
      id: 2,
      documentType: "Marriage Certificate",
      submittedDate: "2025-11-16",
      cancelledDate: "2025-11-19",
      userName: "Ram Sharma",
      phoneNumber: "9812345678",
      reason: "Invalid information provided",
      status: "cancelled",
      formData: {
        groomName: "Ram Sharma",
        groomDateOfBirth: "1988-03-15",
        groomCitizenship: "33333-2008-03-15",
        brideName: "Sita Sharma",
        brideDateOfBirth: "1992-07-20",
        brideCitizenship: "44444-2012-07-20",
        marriageDate: "2025-10-15",
        marriagePlace: "Kathmandu",
        witnessName1: "Hari Sharma",
        witnessName2: "Gita Sharma",
        marriageProvince: "Bagmati",
        marriageDistrict: "Kathmandu",
        marriageMunicipality: "Kathmandu Metropolitan",
        marriageWard: "12",
      },
    },
  ]);

  const handleView = (id) => {
    const form = cancelledForms.find((f) => f.id === id);
    navigate("/admin/details", {
      state: { form, returnPath: "/admin/cancelled" },
    });
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
                className="px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-gray-200 transition"
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
                className="px-4 py-2 rounded-lg font-medium bg-blue-600 text-white"
              >
                Cancelled
              </button>
              <button
                onClick={() => navigate("/admin/Graph")}
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

              {/* User Info */}
              <div className="mb-4 pb-4 border-b border-gray-200">
                <p className="text-sm text-gray-600">Applicant</p>
                <p className="font-medium text-gray-800">{form.userName}</p>
                <p className="text-sm text-gray-600">{form.phoneNumber}</p>
              </div>

              {/* Dates */}
              <div className="mb-4 pb-4 border-b border-gray-200">
                <div className="flex justify-between mb-2">
                  <p className="text-sm text-gray-600">Submitted</p>
                  <p className="text-sm font-medium text-gray-800">
                    {form.submittedDate}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm text-gray-600">Cancelled</p>
                  <p className="text-sm font-medium text-red-600">
                    {form.cancelledDate}
                  </p>
                </div>
              </div>

              {/* Reason */}
              <div className="mb-4 pb-4 border-b border-gray-200">
                <p className="text-sm text-gray-600 mb-1">Reason</p>
                <p className="text-sm text-gray-800">{form.reason}</p>
              </div>

              {/* Status Badge */}
              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                  ✕ Cancelled
                </span>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleView(form.id)}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                View Details
              </button>
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

export default CancelledApp;
