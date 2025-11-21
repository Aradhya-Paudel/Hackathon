import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Form() {
  const navigate = useNavigate();
  const [documentType, setDocumentType] = useState("Citizenship Certificate");
  const [formData, setFormData] = useState({});
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDocumentTypeChange = (e) => {
    setDocumentType(e.target.value);
    setFormData({}); // Reset form data when document type changes
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const phoneNumber = localStorage.getItem("phone_number");
      if (!phoneNumber) {
        setError("Phone number not found. Please login again.");
        return;
      }

      const payload = {
        phone_number: phoneNumber,
        form_type: documentType,
        enter_date_and_time: new Date().toISOString(),
        form_data: formData,
      };

      const response = await fetch(
        "http://localhost:8000/dashboard/user/form",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        const errorMessage =
          typeof data.detail === "string"
            ? data.detail
            : JSON.stringify(data.detail) || "Failed to submit form";
        throw new Error(errorMessage);
      }

      navigate("/pending");
    } catch (err) {
      const errorMessage =
        err.message || "Failed to submit form. Please try again.";
      console.error("Form submission error:", err);
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
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
            Document Application Form
          </h1>
          <p className="text-gray-600 mb-6">कागजात आवेदन फारम</p>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Document Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Document Type / कागजातको प्रकार *
              </label>
              <select
                value={documentType}
                onChange={handleDocumentTypeChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                required
              >
                <option value="Citizenship Certificate">
                  Citizenship Certificate / नागरिकता प्रमाणपत्र
                </option>
                <option value="Birth Certificate">
                  Birth Certificate / जन्म दर्ता प्रमाणपत्र
                </option>
                <option value="Marriage Certificate">
                  Marriage Certificate / विवाह दर्ता प्रमाणपत्र
                </option>
                <option value="Divorce Certificate">
                  Divorce Certificate / सम्बन्ध विच्छेद प्रमाणपत्र
                </option>
                <option value="Death Certificate">
                  Death Certificate / मृत्यु दर्ता प्रमाणपत्र
                </option>
                <option value="Land Registration Certificate">
                  Land Registration Certificate / जग्गा दर्ता प्रमाणपत्र
                </option>
              </select>
            </div>

            {/* Citizenship Certificate Form */}
            {documentType === "Citizenship Certificate" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Citizenship Type / नागरिकताको प्रकार *
                  </label>
                  <select
                    name="citizenshipType"
                    value={formData.citizenshipType || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    required
                  >
                    <option value="">Select / छान्नुहोस्</option>
                    <option value="Descent">By Descent / वंशजको आधारमा</option>
                    <option value="Birth">By Birth / जन्मको आधारमा</option>
                    <option value="Naturalization">
                      By Naturalization / प्राकृतिकरणको आधारमा
                    </option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name / पूरा नाम *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName || ""}
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
                      value={formData.dateOfBirth || ""}
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
                      value={formData.gender || ""}
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Father's Name / बुबाको नाम *
                    </label>
                    <input
                      type="text"
                      name="fatherName"
                      value={formData.fatherName || ""}
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
                      value={formData.motherName || ""}
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
                      value={formData.grandfatherName || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      required
                    />
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
                        name="permanentProvince"
                        value={formData.permanentProvince || ""}
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
                        name="permanentDistrict"
                        value={formData.permanentDistrict || ""}
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
                        name="permanentMunicipality"
                        value={formData.permanentMunicipality || ""}
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
                        type="number"
                        name="permanentWard"
                        value={formData.permanentWard || ""}
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
                        Province / प्रदेश *
                      </label>
                      <select
                        name="temporaryProvince"
                        value={formData.temporaryProvince || ""}
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
                        name="temporaryDistrict"
                        value={formData.temporaryDistrict || ""}
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
                        name="temporaryMunicipality"
                        value={formData.temporaryMunicipality || ""}
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
                        type="number"
                        name="temporaryWard"
                        value={formData.temporaryWard || ""}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        required
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Birth Certificate Form */}
            {documentType === "Birth Certificate" && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Child's Full Name / बच्चाको पूरा नाम *
                    </label>
                    <input
                      type="text"
                      name="childName"
                      value={formData.childName || ""}
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
                      value={formData.dateOfBirth || ""}
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
                      value={formData.gender || ""}
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Birth Place / जन्म स्थान *
                    </label>
                    <input
                      type="text"
                      name="birthPlace"
                      value={formData.birthPlace || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Father's Full Name / बुबाको पूरा नाम *
                    </label>
                    <input
                      type="text"
                      name="fatherName"
                      value={formData.fatherName || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Father's Citizenship No. / बुबाको नागरिकता नं. *
                    </label>
                    <input
                      type="text"
                      name="fatherCitizenshipNo"
                      value={formData.fatherCitizenshipNo || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mother's Full Name / आमाको पूरा नाम *
                    </label>
                    <input
                      type="text"
                      name="motherName"
                      value={formData.motherName || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mother's Citizenship No. / आमाको नागरिकता नं. *
                    </label>
                    <input
                      type="text"
                      name="motherCitizenshipNo"
                      value={formData.motherCitizenshipNo || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      required
                    />
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
                        name="permanentProvince"
                        value={formData.permanentProvince || ""}
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
                        name="permanentDistrict"
                        value={formData.permanentDistrict || ""}
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
                        name="permanentMunicipality"
                        value={formData.permanentMunicipality || ""}
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
                        type="number"
                        name="permanentWard"
                        value={formData.permanentWard || ""}
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
                        Province / प्रदेश *
                      </label>
                      <select
                        name="temporaryProvince"
                        value={formData.temporaryProvince || ""}
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
                        name="temporaryDistrict"
                        value={formData.temporaryDistrict || ""}
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
                        name="temporaryMunicipality"
                        value={formData.temporaryMunicipality || ""}
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
                        type="number"
                        name="temporaryWard"
                        value={formData.temporaryWard || ""}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        required
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Marriage Certificate Form */}
            {documentType === "Marriage Certificate" && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Marriage Date / विवाह मिति *
                    </label>
                    <input
                      type="date"
                      name="marriageDate"
                      value={formData.marriageDate || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Groom's Full Name / दुलहाको पूरा नाम *
                    </label>
                    <input
                      type="text"
                      name="groomName"
                      value={formData.groomName || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Groom's Date of Birth / दुलहाको जन्म मिति *
                    </label>
                    <input
                      type="date"
                      name="groomDateOfBirth"
                      value={formData.groomDateOfBirth || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Groom's Citizenship No. / दुलहाको नागरिकता नं. *
                    </label>
                    <input
                      type="text"
                      name="groomCitizenshipNo"
                      value={formData.groomCitizenshipNo || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Groom's Father Name / दुलहाको बुबाको नाम *
                    </label>
                    <input
                      type="text"
                      name="groomFatherName"
                      value={formData.groomFatherName || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bride's Full Name / दुलहीको पूरा नाम *
                    </label>
                    <input
                      type="text"
                      name="brideName"
                      value={formData.brideName || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bride's Date of Birth / दुलहीको जन्म मिति *
                    </label>
                    <input
                      type="date"
                      name="brideDateOfBirth"
                      value={formData.brideDateOfBirth || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bride's Citizenship No. / दुलहीको नागरिकता नं. *
                    </label>
                    <input
                      type="text"
                      name="brideCitizenshipNo"
                      value={formData.brideCitizenshipNo || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bride's Father Name / दुलहीको बुबाको नाम *
                    </label>
                    <input
                      type="text"
                      name="brideFatherName"
                      value={formData.brideFatherName || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Marriage Place / विवाह स्थान *
                    </label>
                    <input
                      type="text"
                      name="marriagePlace"
                      value={formData.marriagePlace || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      required
                    />
                  </div>
                </div>
              </>
            )}

            {/* Divorce Certificate Form */}
            {documentType === "Divorce Certificate" && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Divorce Date / सम्बन्ध विच्छेद मिति *
                    </label>
                    <input
                      type="date"
                      name="divorceDate"
                      value={formData.divorceDate || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Marriage Registration No. / विवाह दर्ता नं. *
                    </label>
                    <input
                      type="text"
                      name="marriageRegNo"
                      value={formData.marriageRegNo || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Husband's Full Name / पतिको पूरा नाम *
                    </label>
                    <input
                      type="text"
                      name="husbandName"
                      value={formData.husbandName || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Husband's Citizenship No. / पतिको नागरिकता नं. *
                    </label>
                    <input
                      type="text"
                      name="husbandCitizenshipNo"
                      value={formData.husbandCitizenshipNo || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Wife's Full Name / पत्नीको पूरा नाम *
                    </label>
                    <input
                      type="text"
                      name="wifeName"
                      value={formData.wifeName || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Wife's Citizenship No. / पत्नीको नागरिकता नं. *
                    </label>
                    <input
                      type="text"
                      name="wifeCitizenshipNo"
                      value={formData.wifeCitizenshipNo || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Reason for Divorce / सम्बन्ध विच्छेदको कारण *
                    </label>
                    <textarea
                      name="divorceReason"
                      value={formData.divorceReason || ""}
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Court Order No. / अदालतको आदेश नं. *
                    </label>
                    <input
                      type="text"
                      name="courtOrderNo"
                      value={formData.courtOrderNo || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      required
                    />
                  </div>
                </div>
              </>
            )}

            {/* Death Certificate Form */}
            {documentType === "Death Certificate" && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Deceased's Full Name / मृतकको पूरा नाम *
                    </label>
                    <input
                      type="text"
                      name="deceasedName"
                      value={formData.deceasedName || ""}
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
                      value={formData.dateOfBirth || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Death / मृत्यु मिति *
                    </label>
                    <input
                      type="date"
                      name="dateOfDeath"
                      value={formData.dateOfDeath || ""}
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
                      value={formData.gender || ""}
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Citizenship No. / नागरिकता नं. *
                    </label>
                    <input
                      type="text"
                      name="citizenshipNo"
                      value={formData.citizenshipNo || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Place of Death / मृत्यु स्थान *
                    </label>
                    <input
                      type="text"
                      name="placeOfDeath"
                      value={formData.placeOfDeath || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cause of Death / मृत्युको कारण *
                    </label>
                    <textarea
                      name="causeOfDeath"
                      value={formData.causeOfDeath || ""}
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Informant's Name / सूचना दिने व्यक्तिको नाम *
                    </label>
                    <input
                      type="text"
                      name="informantName"
                      value={formData.informantName || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Relationship to Deceased / मृतकसँगको सम्बन्ध *
                    </label>
                    <input
                      type="text"
                      name="relationshipToDeceased"
                      value={formData.relationshipToDeceased || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      required
                    />
                  </div>
                </div>
              </>
            )}

            {documentType === "Land Registration Certificate" && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Land Owner's Full Name / जग्गाधनीको पूरा नाम *
                    </label>
                    <input
                      type="text"
                      name="ownerName"
                      value={formData.ownerName || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Citizenship No. / नागरिकता नं. *
                    </label>
                    <input
                      type="text"
                      name="citizenshipNo"
                      value={formData.citizenshipNo || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Number / सम्पर्क नम्बर *
                    </label>
                    <input
                      type="tel"
                      name="contactNumber"
                      value={formData.contactNumber || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      District / जिल्ला *
                    </label>
                    <input
                      type="text"
                      name="district"
                      value={formData.district || ""}
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
                      name="municipality"
                      value={formData.municipality || ""}
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
                      type="number"
                      name="ward"
                      value={formData.ward || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Plot/Kitta No. / कित्ता नं. *
                    </label>
                    <input
                      type="text"
                      name="kittaNo"
                      value={formData.kittaNo || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Land Area (in Ropani) / जग्गाको क्षेत्रफल *
                    </label>
                    <input
                      type="text"
                      name="landArea"
                      value={formData.landArea || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="e.g., 0-5-2-0"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Land Boundaries / जग्गाको सीमाना *
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        name="eastBoundary"
                        value={formData.eastBoundary || ""}
                        onChange={handleChange}
                        placeholder="East / पूर्व"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        required
                      />
                      <input
                        type="text"
                        name="westBoundary"
                        value={formData.westBoundary || ""}
                        onChange={handleChange}
                        placeholder="West / पश्चिम"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        required
                      />
                      <input
                        type="text"
                        name="northBoundary"
                        value={formData.northBoundary || ""}
                        onChange={handleChange}
                        placeholder="North / उत्तर"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        required
                      />
                      <input
                        type="text"
                        name="southBoundary"
                        value={formData.southBoundary || ""}
                        onChange={handleChange}
                        placeholder="South / दक्षिण"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Previous Owner Name / अघिल्लो मालिकको नाम
                    </label>
                    <input
                      type="text"
                      name="previousOwnerName"
                      value={formData.previousOwnerName || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Registration Type / दर्ता प्रकार *
                    </label>
                    <select
                      name="registrationType"
                      value={formData.registrationType || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      required
                    >
                      <option value="">Select / छान्नुहोस्</option>
                      <option value="New">New / नयाँ</option>
                      <option value="Transfer">Transfer / हस्तान्तरण</option>
                      <option value="Inheritance">
                        Inheritance / अंशबण्डा
                      </option>
                      <option value="Gift">Gift / दान</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {/* Submit Button */}
            <div className="border-t pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 rounded-lg transition duration-200 font-medium text-lg ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed text-white"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {isSubmitting
                  ? "Submitting... / पेश गरिदै छ..."
                  : "Submit Application / आवेदन पेश गर्नुहोस्"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Form;
