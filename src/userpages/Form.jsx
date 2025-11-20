import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

function Form() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    dateOfBirth: "",
    gender: "",
    fatherName: "",
    motherName: "",
    grandfatherName: "",
    permanentAddress: {
      province: "",
      district: "",
      municipality: "",
      ward: "",
    },
    temporaryAddress: {
      province: "",
      district: "",
      municipality: "",
      ward: "",
    },
    citizenshipType: "Descent", // Descent, Birth, Naturalization
    applicationType: "New", // New, Duplicate, Update
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Here you would submit to your backend
    console.log("Form submitted:", formData);
    navigate("/pending");
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
                className="px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-gray-200 transition"
              >
                Cancelled
              </button>
              <button
                onClick={() => navigate("/form")}
                className="px-4 py-2 rounded-lg font-medium bg-blue-600 text-white"
              >
                Form
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Nepal Citizenship Application Form
          </h1>
          <p className="text-gray-600 mb-6">नेपाली नागरिकता आवेदन फारम</p>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Application Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Application Type / आवेदन प्रकार
              </label>
              <select
                name="applicationType"
                value={formData.applicationType}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                required
              >
                <option value="New">New / नयाँ</option>
                <option value="Duplicate">Duplicate / नक्कल</option>
                <option value="Update">Update / अद्यावधिक</option>
              </select>
            </div>

            {/* Citizenship Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Citizenship Type / नागरिकताको प्रकार
              </label>
              <select
                name="citizenshipType"
                value={formData.citizenshipType}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                required
              >
                <option value="Descent">By Descent / वंशजको आधारमा</option>
                <option value="Birth">By Birth / जन्मको आधारमा</option>
                <option value="Naturalization">
                  By Naturalization / प्राकृतिकरणको आधारमा
                </option>
              </select>
            </div>

            {/* Personal Information */}
            <div className="border-t pt-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Personal Information / व्यक्तिगत विवरण
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name / पूरा नाम *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth / जन्म मिति *
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender / लिङ्ग *
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    required
                  >
                    <option value="">Select / छान्नुहोस्</option>
                    <option value="Male">Male / पुरुष</option>
                    <option value="Female">Female / महिला</option>
                    <option value="Other">Other / अन्य</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Family Information */}
            <div className="border-t pt-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Family Information / परिवारको विवरण
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Father's Name / बुबाको नाम *
                  </label>
                  <input
                    type="text"
                    name="fatherName"
                    value={formData.fatherName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mother's Name / आमाको नाम *
                  </label>
                  <input
                    type="text"
                    name="motherName"
                    value={formData.motherName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Grandfather's Name / हजुरबुबाको नाम *
                  </label>
                  <input
                    type="text"
                    name="grandfatherName"
                    value={formData.grandfatherName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Permanent Address */}
            <div className="border-t pt-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Permanent Address / स्थायी ठेगाना
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Province / प्रदेश *
                  </label>
                  <select
                    name="permanentAddress.province"
                    value={formData.permanentAddress.province}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    required
                  >
                    <option value="">Select / छान्नुहोस्</option>
                    <option value="Koshi">Koshi / कोशी</option>
                    <option value="Madhesh">Madhesh / मधेश</option>
                    <option value="Bagmati">Bagmati / बागमती</option>
                    <option value="Gandaki">Gandaki / गण्डकी</option>
                    <option value="Lumbini">Lumbini / लुम्बिनी</option>
                    <option value="Karnali">Karnali / कर्णाली</option>
                    <option value="Sudurpashchim">
                      Sudurpashchim / सुदूरपश्चिम
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    District / जिल्ला *
                  </label>
                  <input
                    type="text"
                    name="permanentAddress.district"
                    value={formData.permanentAddress.district}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Municipality / नगरपालिका *
                  </label>
                  <input
                    type="text"
                    name="permanentAddress.municipality"
                    value={formData.permanentAddress.municipality}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ward No. / वडा नं. *
                  </label>
                  <input
                    type="text"
                    name="permanentAddress.ward"
                    value={formData.permanentAddress.ward}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Temporary Address */}
            <div className="border-t pt-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Temporary Address / अस्थायी ठेगाना
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Province / प्रदेश
                  </label>
                  <select
                    name="temporaryAddress.province"
                    value={formData.temporaryAddress.province}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    <option value="">Select / छान्नुहोस्</option>
                    <option value="Koshi">Koshi / कोशी</option>
                    <option value="Madhesh">Madhesh / मधेश</option>
                    <option value="Bagmati">Bagmati / बागमती</option>
                    <option value="Gandaki">Gandaki / गण्डकी</option>
                    <option value="Lumbini">Lumbini / लुम्बिनी</option>
                    <option value="Karnali">Karnali / कर्णाली</option>
                    <option value="Sudurpashchim">
                      Sudurpashchim / सुदूरपश्चिम
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    District / जिल्ला
                  </label>
                  <input
                    type="text"
                    name="temporaryAddress.district"
                    value={formData.temporaryAddress.district}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Municipality / नगरपालिका
                  </label>
                  <input
                    type="text"
                    name="temporaryAddress.municipality"
                    value={formData.temporaryAddress.municipality}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ward No. / वडा नं.
                  </label>
                  <input
                    type="text"
                    name="temporaryAddress.ward"
                    value={formData.temporaryAddress.ward}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="border-t pt-6">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-200 font-medium text-lg"
              >
                Submit Application / आवेदन पेश गर्नुहोस्
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Form;
