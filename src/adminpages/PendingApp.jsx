import { useNavigate } from "react-router-dom";
import { useState } from "react";

function PendingApp() {
  const navigate = useNavigate();

  const handleApprove = () => {
    console.log("Approving application");
    // API call to approve
    navigate("/admin/approved");
  };

  const handleCancelled = () => {
    console.log("Cancelling application");
    // API call to cancel
    navigate("/admin/cancelled");
  };

  // Mock data - replace with actual API call
  const [pendingForms] = useState([
    {
      id: 1,
      documentType: "Citizenship Certificate",
      submittedDate: "2025-11-20",
      userName: "Ram Bahadur Thapa",
      phoneNumber: "9841234567",
      status: "reviewing",
      formData: {
        citizenshipType: "Descent",
        fullName: "Ram Bahadur Thapa",
        dateOfBirth: "1995-03-15",
        gender: "Male",
        fatherName: "Dhan Bahadur Thapa",
        motherName: "Laxmi Thapa",
        grandfatherName: "Bir Bahadur Thapa",
        permanentProvince: "Bagmati",
        permanentDistrict: "Kathmandu",
        permanentMunicipality: "Kathmandu Metropolitan",
        permanentWard: "16",
        temporaryProvince: "Bagmati",
        temporaryDistrict: "Lalitpur",
        temporaryMunicipality: "Lalitpur Metropolitan",
        temporaryWard: "5",
      },
    },
    {
      id: 2,
      documentType: "Birth Certificate",
      submittedDate: "2025-11-21",
      userName: "Sita Sharma",
      phoneNumber: "9847654321",
      status: "pending",
      formData: {
        childName: "Anish Sharma",
        dateOfBirth: "2024-08-10",
        gender: "Male",
        birthPlace: "Patan Hospital, Lalitpur",
        fatherName: "Rajesh Sharma",
        motherName: "Sita Sharma",
        fatherCitizenship: "12345-2020-10-15",
        motherCitizenship: "67890-2018-05-20",
        birthProvince: "Bagmati",
        birthDistrict: "Lalitpur",
        birthMunicipality: "Lalitpur Metropolitan",
        birthWard: "8",
      },
    },
    {
      id: 3,
      documentType: "Marriage Certificate",
      submittedDate: "2025-11-19",
      userName: "Hari Prasad Gautam",
      phoneNumber: "9812345678",
      status: "reviewing",
      formData: {
        groomName: "Hari Prasad Gautam",
        groomDateOfBirth: "1992-06-22",
        groomCitizenship: "11223-2010-08-15",
        brideName: "Maya Kumari Shrestha",
        brideDateOfBirth: "1995-12-10",
        brideCitizenship: "44556-2013-04-20",
        marriageDate: "2025-11-01",
        marriagePlace: "Pashupatinath Temple",
        witnessName1: "Krishna Gautam",
        witnessName2: "Sarita Shrestha",
        marriageProvince: "Bagmati",
        marriageDistrict: "Kathmandu",
        marriageMunicipality: "Kathmandu Metropolitan",
        marriageWard: "8",
      },
    },
    {
      id: 4,
      documentType: "Divorce Certificate",
      submittedDate: "2025-11-18",
      userName: "Sunita Rai",
      phoneNumber: "9823456789",
      status: "pending",
      formData: {
        husbandName: "Prakash Rai",
        husbandCitizenship: "78901-2005-03-25",
        wifeName: "Sunita Rai",
        wifeCitizenship: "23456-2008-07-18",
        marriageDate: "2010-02-14",
        marriageRegistrationNumber: "MRG-12345",
        divorceReason: "Mutual consent and irreconcilable differences",
        divorceDate: "2025-11-10",
        childrenCount: "2",
        childCustody: "Joint custody",
        divorceProvince: "Koshi",
        divorceDistrict: "Morang",
        divorceMunicipality: "Biratnagar Metropolitan",
        divorceWard: "12",
      },
    },
    {
      id: 5,
      documentType: "Death Certificate",
      submittedDate: "2025-11-17",
      userName: "Ramesh Adhikari",
      phoneNumber: "9834567890",
      status: "reviewing",
      formData: {
        deceasedName: "Gopal Adhikari",
        dateOfBirth: "1945-04-20",
        dateOfDeath: "2025-11-15",
        timeOfDeath: "08:30",
        placeOfDeath: "Bir Hospital, Kathmandu",
        gender: "Male",
        causeOfDeath: "Natural causes - Heart failure",
        fatherName: "Hari Adhikari",
        motherName: "Parbati Adhikari",
        informantName: "Ramesh Adhikari",
        informantRelation: "Son",
        deathProvince: "Bagmati",
        deathDistrict: "Kathmandu",
        deathMunicipality: "Kathmandu Metropolitan",
        deathWard: "32",
      },
    },
    {
      id: 6,
      documentType: "Land Registration Certificate",
      submittedDate: "2025-11-16",
      userName: "Binod Karki",
      phoneNumber: "9845678901",
      status: "pending",
      formData: {
        ownerName: "Binod Karki",
        ownerCitizenship: "98765-2000-11-05",
        landArea: "0-5-2-0",
        landType: "Residential",
        kitta: "145",
        sheetNumber: "12",
        plotNumber: "256",
        landProvince: "Gandaki",
        landDistrict: "Kaski",
        landMunicipality: "Pokhara Metropolitan",
        landWard: "15",
        previousOwner: "Krishna Karki",
        transferType: "Inheritance",
        transferDate: "2025-10-01",
        landValue: "5000000",
        remarks: "Land inherited from father",
      },
    },
    {
      id: 7,
      documentType: "Citizenship Certificate",
      submittedDate: "2025-11-15",
      userName: "Anita Gurung",
      phoneNumber: "9856789012",
      status: "pending",
      formData: {
        citizenshipType: "Birth",
        fullName: "Anita Gurung",
        dateOfBirth: "2000-09-22",
        gender: "Female",
        fatherName: "Tek Bahadur Gurung",
        motherName: "Kamala Gurung",
        grandfatherName: "Dal Bahadur Gurung",
        permanentProvince: "Gandaki",
        permanentDistrict: "Gorkha",
        permanentMunicipality: "Gorkha Municipality",
        permanentWard: "3",
        temporaryProvince: "Bagmati",
        temporaryDistrict: "Kathmandu",
        temporaryMunicipality: "Kathmandu Metropolitan",
        temporaryWard: "20",
      },
    },
    {
      id: 8,
      documentType: "Birth Certificate",
      submittedDate: "2025-11-14",
      userName: "Deepak Tamang",
      phoneNumber: "9867890123",
      status: "reviewing",
      formData: {
        childName: "Sajana Tamang",
        dateOfBirth: "2025-10-25",
        gender: "Female",
        birthPlace: "Paropakar Maternity Hospital",
        fatherName: "Deepak Tamang",
        motherName: "Sunita Tamang",
        fatherCitizenship: "55667-2015-06-10",
        motherCitizenship: "88990-2016-09-15",
        birthProvince: "Bagmati",
        birthDistrict: "Kathmandu",
        birthMunicipality: "Kathmandu Metropolitan",
        birthWard: "12",
      },
    },
  ]);

  const handleView = (id) => {
    const form = pendingForms.find((f) => f.id === id);
    navigate("/admin/details", {
      state: { form, returnPath: "/admin/pending" },
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
                className="px-4 py-2 rounded-lg font-medium bg-blue-600 text-white"
              >
                Pending
              </button>
              <button
                onClick={() => handleApprove()}
                className="px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-gray-200 transition"
              >
                Approved
              </button>
              <button
                onClick={() => handleCancelled()}
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
