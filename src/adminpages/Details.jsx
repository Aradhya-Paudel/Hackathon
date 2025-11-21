import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

function Details() {
  const navigate = useNavigate();
  const location = useLocation();
  const { form, returnPath } = location.state || {};
  const [showRejectBox, setShowRejectBox] = useState(false);
  const [rejectDescription, setRejectDescription] = useState("");

  // Determine the return path based on form status or passed returnPath
  const getReturnPath = () => {
    if (returnPath) return returnPath;
    if (form?.status === "approved") return "/admin/approved";
    if (form?.status === "cancelled") return "/admin/cancelled";
    return "/admin/pending";
  };

  if (!form) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            No Data Found
          </h2>
          <p className="text-gray-600 mb-6">
            Please select an application to view details.
          </p>
          <button
            onClick={() => navigate("/admin/pending")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Go Back to Pending
          </button>
        </div>
      </div>
    );
  }

  const formatLabel = (key) => {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  };

  // Check if the form is from approved or cancelled page
  const isPending = form.status === "pending" || form.status === "reviewing";

  const handleApprove = () => {
    console.log("Approving application:", form.id);
    // API call to approve
    navigate(getReturnPath());
  };

  const handleReject = () => {
    setShowRejectBox(true);
  };

  const confirmReject = () => {
    console.log("Rejecting application:", form.id);
    console.log("Rejection reason:", rejectDescription);
    // API call to reject with description
    navigate(getReturnPath());
  };

  const cancelReject = () => {
    setShowRejectBox(false);
    setRejectDescription("");
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-xl">
          {/* Header */}
          <div className="border-b border-gray-200 px-6 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {form.documentType}
                </h2>
                <p className="text-sm text-gray-600">
                  Application ID: {form.id}
                </p>
              </div>
              <button
                onClick={() => navigate(getReturnPath())}
                className="text-gray-600 hover:text-gray-800 font-medium"
              >
                ← Back
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-4">
            {/* Applicant Information */}
            <div className="mb-6 bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Applicant Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Name</p>
                  <p className="text-gray-800">{form.userName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">
                    Phone Number
                  </p>
                  <p className="text-gray-800">{form.phoneNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">
                    Submitted Date
                  </p>
                  <p className="text-gray-800">{form.submittedDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Status</p>
                  <p className="text-gray-800 capitalize">{form.status}</p>
                </div>
              </div>
            </div>

            {/* Form Details */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Form Details
              </h3>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="space-y-3">
                  {Object.entries(form.formData).map(([key, value]) => (
                    <div key={key} className="border-b border-gray-200 pb-2">
                      <p className="text-sm text-gray-600 font-medium">
                        {formatLabel(key)}
                      </p>
                      <p className="text-gray-800">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Rejection Description Box */}
            {showRejectBox && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-red-800 mb-3">
                  Rejection Reason
                </h3>
                <textarea
                  value={rejectDescription}
                  onChange={(e) => setRejectDescription(e.target.value)}
                  placeholder="Please enter the reason for rejection..."
                  className="w-full px-4 py-3 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none resize-none"
                  rows="4"
                  required
                />
                <div className="flex justify-end space-x-3 mt-3">
                  <button
                    onClick={cancelReject}
                    className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmReject}
                    disabled={!rejectDescription.trim()}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium disabled:bg-red-300 disabled:cursor-not-allowed"
                  >
                    Confirm Rejection
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons - Only show for pending applications */}
            {isPending && !showRejectBox && (
              <div className="flex justify-end space-x-3 border-t border-gray-200 pt-4">
                <button
                  onClick={handleReject}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
                >
                  Reject
                </button>
                <button
                  onClick={handleApprove}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                >
                  Approve
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Details;
