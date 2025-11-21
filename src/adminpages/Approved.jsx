import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Approved() {
  const navigate = useNavigate();

  // Mock data - replace with actual API call
  const [approvedForms] = useState([
    {
      id: 1,
      documentType: "Citizenship Certificate",
      submittedDate: "2025-11-15",
      approvedDate: "2025-11-20",
      userName: "John Doe",
      phoneNumber: "9841234567",
      status: "approved",
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
      documentType: "Birth Certificate",
      submittedDate: "2025-11-16",
      approvedDate: "2025-11-21",
      userName: "Jane Smith",
      phoneNumber: "9847654321",
      status: "approved",
      formData: {
        childName: "Baby Smith",
        dateOfBirth: "2025-11-01",
        gender: "Female",
        birthPlace: "Bir Hospital, Kathmandu",
        fatherName: "John Smith",
        motherName: "Jane Smith",
        fatherCitizenship: "11111-2015-01-01",
        motherCitizenship: "22222-2016-02-02",
        birthProvince: "Bagmati",
        birthDistrict: "Kathmandu",
        birthMunicipality: "Kathmandu Metropolitan",
        birthWard: "15",
      },
    },
  ]);

  const handleView = (id) => {
    const form = approvedForms.find((f) => f.id === id);
    navigate("/admin/details", {
      state: { form, returnPath: "/admin/approved" },
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
                className="px-4 py-2 rounded-lg font-medium bg-blue-600 text-white"
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
          Approved Applications
        </h1>

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
                  <p className="text-sm text-gray-600">Approved</p>
                  <p className="text-sm font-medium text-green-600">
                    {form.approvedDate}
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  ✓ Approved
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
        {approvedForms.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">No approved applications</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Approved;
