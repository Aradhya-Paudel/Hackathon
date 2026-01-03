import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Search,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  UserCheck,
  Building2,
  Package,
} from "lucide-react";
import { applicationAPI } from "../services/api";

const TrackApplication = () => {
  const [searchParams] = useSearchParams();
  const [applicationId, setApplicationId] = useState(
    searchParams.get("id") || ""
  );
  const [application, setApplication] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get("id")) {
      handleSearch(searchParams.get("id"));
    }
  }, [searchParams]);

  const handleSearch = async (id = applicationId) => {
    if (!id.trim()) return;

    setLoading(true);
    setNotFound(false);

    try {
      const data = await applicationAPI.getById(id.trim());
      setApplication(data);
      setNotFound(false);
    } catch (err) {
      setApplication(null);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Submitted":
        return <Clock size={24} className="text-[#1E90FF]" />;
      case "In Progress":
        return <FileText size={24} className="text-[#D4AF37]" />;
      case "Approved":
        return <CheckCircle size={24} className="text-[#27AE60]" />;
      default:
        return <AlertCircle size={24} className="text-[#4A4A4A]" />;
    }
  };

  // Nepal-specific processing flowchart based on actual government procedures
  const getFlowchartStages = (serviceType) => {
    const baseStages = [
      {
        id: 1,
        title: "Application Submission",
        icon: FileText,
        description: "Documents submitted to Ward Office",
        office: "Ward Office",
      },
      {
        id: 2,
        title: "Ward Office Verification",
        icon: UserCheck,
        description: "Ward officer verifies documents",
        office: "Ward Officer",
      },
      {
        id: 3,
        title: "Municipality Review",
        icon: Building2,
        description: "Municipal office reviews application",
        office: "Municipality",
      },
      {
        id: 4,
        title: "Document Preparation",
        icon: Package,
        description: "Certificate/document being prepared",
        office: "Processing Unit",
      },
      {
        id: 5,
        title: "Ready for Collection",
        icon: CheckCircle,
        description: "Document ready at Ward Office",
        office: "Ward Office",
      },
    ];

    // For National ID, add biometric collection step
    if (serviceType === "national-id") {
      return [
        {
          id: 1,
          title: "Application Submission",
          icon: FileText,
          description: "Documents submitted to Ward Office",
          office: "Ward Office",
        },
        {
          id: 2,
          title: "Ward Office Verification",
          icon: UserCheck,
          description: "Ward officer verifies documents",
          office: "Ward Officer",
        },
        {
          id: 3,
          title: "Biometric Data Collection",
          icon: UserCheck,
          description: "Fingerprints and photo captured",
          office: "Ward Office",
        },
        {
          id: 4,
          title: "District Office Processing",
          icon: Building2,
          description: "District Administration Office processes",
          office: "District Office (DAO)",
        },
        {
          id: 5,
          title: "ID Card Printing",
          icon: Package,
          description: "National ID card being printed",
          office: "DoNIDCR",
        },
        {
          id: 6,
          title: "Ready for Collection",
          icon: CheckCircle,
          description: "ID card ready at Ward Office",
          office: "Ward Office",
        },
      ];
    }

    // For Birth Certificate - simpler process
    if (serviceType === "birth-certificate") {
      return [
        {
          id: 1,
          title: "Application Submission",
          icon: FileText,
          description: "Birth registration form submitted",
          office: "Ward Office",
        },
        {
          id: 2,
          title: "Ward Office Verification",
          icon: UserCheck,
          description: "Ward officer verifies birth details",
          office: "Ward Officer",
        },
        {
          id: 3,
          title: "Municipality Registration",
          icon: Building2,
          description: "Birth registered in municipal records",
          office: "Municipality",
        },
        {
          id: 4,
          title: "Certificate Issuance",
          icon: Package,
          description: "Birth certificate being prepared",
          office: "Municipality",
        },
        {
          id: 5,
          title: "Ready for Collection",
          icon: CheckCircle,
          description: "Certificate ready at Ward Office",
          office: "Ward Office",
        },
      ];
    }

    // For Marriage Certificate
    if (serviceType === "marriage-certificate") {
      return [
        {
          id: 1,
          title: "Application Submission",
          icon: FileText,
          description: "Marriage registration form submitted",
          office: "Ward Office",
        },
        {
          id: 2,
          title: "Ward Office Verification",
          icon: UserCheck,
          description: "Ward officer verifies documents & witnesses",
          office: "Ward Officer",
        },
        {
          id: 3,
          title: "Municipality Registration",
          icon: Building2,
          description: "Marriage registered in municipal records",
          office: "Municipality",
        },
        {
          id: 4,
          title: "Certificate Issuance",
          icon: Package,
          description: "Marriage certificate being prepared",
          office: "Municipality",
        },
        {
          id: 5,
          title: "Ready for Collection",
          icon: CheckCircle,
          description: "Certificate ready at Ward Office",
          office: "Ward Office",
        },
      ];
    }

    return baseStages;
  };

  const getCurrentStageIndex = () => {
    if (!application) return -1;

    const flowchartStages = getFlowchartStages(application.service_type);
    const progress = application.progress || 0;

    // Map progress to stage index based on number of stages
    // This ensures accurate stage display regardless of service type
    const totalStages = flowchartStages.length;
    const progressPerStage = 100 / totalStages;

    // Calculate which stage we're in based on progress
    const stageIndex = Math.min(
      Math.floor(progress / progressPerStage),
      totalStages - 1
    );

    return Math.max(0, stageIndex);
  };

  return (
    <div className="pt-20 min-h-screen bg-[#F5F5F5]">
      <div className="py-20 px-6 md:px-12 lg:px-15">
        <div className="max-w-[1200px] mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-[36px] font-semibold text-[#2B2B2B] mb-3">
              Track Your Application
            </h1>
            <div className="w-16 h-1 bg-[#1E90FF] rounded-sm mx-auto mb-6"></div>
            <p className="text-base md:text-lg text-[#4A4A4A] leading-relaxed">
              Enter your application ID to view real-time status and processing
              flowchart
            </p>
          </div>

          {/* Search Form */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col md:flex-row gap-4"
            >
              <div className="flex-1 relative">
                <Search
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B8B8B8]"
                />
                <input
                  type="text"
                  value={applicationId}
                  onChange={(e) => setApplicationId(e.target.value)}
                  placeholder="Enter Application ID (e.g., APP12345678)"
                  className="w-full bg-[#F5F5F5] border border-[#E0E0E0] rounded px-12 py-3.5 text-base text-[#2B2B2B] transition-all duration-300 focus:border-[#1E90FF] focus:bg-white focus:outline-none focus:shadow-[0_0_0_3px_rgba(30,144,255,0.1)] placeholder:text-[#B8B8B8]"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-[#1E90FF] text-white text-base font-semibold px-8 py-3.5 rounded uppercase tracking-wide shadow-button transition-all duration-300 hover:bg-[#1873CC] hover:shadow-button-hover hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Searching..." : "Search"}
              </button>
            </form>
          </div>

          {/* Not Found Message */}
          {notFound && (
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <AlertCircle size={48} className="text-[#E74C3C] mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-[#2B2B2B] mb-2">
                Application Not Found
              </h3>
              <p className="text-base text-[#4A4A4A]">
                No application found with ID: <strong>{applicationId}</strong>
              </p>
            </div>
          )}

          {/* Application Details */}
          {application && (
            <>
              {/* Rejection Message */}
              {application.approved === false &&
                application.rejection_message && (
                  <div className="bg-[#FFEBEE] border-l-4 border-[#E74C3C] rounded-lg p-6 mb-8">
                    <div className="flex items-start gap-4">
                      <AlertCircle
                        size={24}
                        className="text-[#E74C3C] flex-shrink-0"
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-[#E74C3C] mb-2">
                          Application Rejected
                        </h3>
                        <p className="text-sm text-[#2B2B2B] mb-1">
                          <strong>Reason:</strong>
                        </p>
                        <p className="text-sm text-[#4A4A4A] leading-relaxed">
                          {application.rejection_message}
                        </p>
                        <p className="text-xs text-[#4A4A4A] mt-3">
                          Please review the reason and contact the office if you
                          need clarification or wish to reapply.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

              {/* Status Overview */}
              <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <p className="text-sm font-medium text-[#4A4A4A] mb-1">
                      Application ID
                    </p>
                    <p className="text-lg font-semibold text-[#2B2B2B]">
                      {application.id}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#4A4A4A] mb-1">
                      Service Type
                    </p>
                    <p className="text-lg font-semibold text-[#2B2B2B] capitalize">
                      {application.service_type?.replace("-", " ") || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#4A4A4A] mb-1">
                      Submitted Date
                    </p>
                    <p className="text-lg font-semibold text-[#2B2B2B]">
                      {new Date(
                        application.submitted_date
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#4A4A4A] mb-1">
                      Status
                    </p>
                    <p
                      className={`text-lg font-semibold ${
                        application.status === "Rejected"
                          ? "text-[#E74C3C]"
                          : application.status === "Completed"
                          ? "text-[#27AE60]"
                          : "text-[#1E90FF]"
                      }`}
                    >
                      {application.status}
                    </p>
                  </div>
                </div>

                {application.approved !== false && (
                  <div className="mt-6 pt-6 border-t border-[#E0E0E0]">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-[#4A4A4A]">
                        Current Stage
                      </p>
                    </div>
                    <div className="w-full bg-[#E0E0E0] rounded-full h-2.5">
                      <div
                        className="bg-[#1E90FF] h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${application.progress}%` }}
                      ></div>
                    </div>
                    <p
                      className={`text-base font-semibold mt-3 ${
                        application.status === "Completed"
                          ? "text-[#27AE60]"
                          : "text-[#2B2B2B]"
                      }`}
                    >
                      {application.status === "Completed"
                        ? "Completed"
                        : application.current_stage}
                    </p>
                  </div>
                )}
              </div>

              {/* Processing Flowchart - Only show if not rejected */}
              {application.approved !== false &&
                (() => {
                  const flowchartStages = getFlowchartStages(
                    application.service_type
                  );
                  const currentStageIndex = getCurrentStageIndex();

                  return (
                    <div className="bg-white rounded-lg shadow-lg p-8">
                      <h2 className="text-2xl md:text-3xl font-semibold text-[#2B2B2B] mb-2">
                        Processing Flowchart
                      </h2>
                      <div className="w-16 h-1 bg-[#1E90FF] rounded-sm mb-8"></div>
                      <p className="text-sm text-[#4A4A4A] mb-6 italic">
                        Nepal Government Process -{" "}
                        {application.service_type
                          ?.replace("-", " ")
                          .toUpperCase() || "Application"}
                      </p>

                      {/* Desktop Flowchart - Fixed Layout */}
                      <div className="hidden md:block">
                        <div className="relative">
                          {/* Progress Line */}
                          <div className="absolute top-14 left-0 right-0 h-1 bg-[#E0E0E0]">
                            <div
                              className="h-full bg-[#1E90FF] transition-all duration-500"
                              style={{
                                width: `${
                                  (currentStageIndex /
                                    (flowchartStages.length - 1)) *
                                  100
                                }%`,
                              }}
                            ></div>
                          </div>

                          {/* Stages - Fixed grid based on number of stages */}
                          <div
                            className={`relative grid gap-4`}
                            style={{
                              gridTemplateColumns: `repeat(${flowchartStages.length}, 1fr)`,
                            }}
                          >
                            {flowchartStages.map((stage, index) => {
                              const Icon = stage.icon;
                              const isCompleted = index < currentStageIndex;
                              const isCurrent = index === currentStageIndex;

                              return (
                                <div
                                  key={stage.id}
                                  className="flex flex-col items-center text-center"
                                >
                                  {/* Icon Circle */}
                                  <div
                                    className={`w-28 h-28 rounded-full flex items-center justify-center mb-4 transition-all duration-300 ${
                                      isCompleted
                                        ? "bg-[#1E90FF] border-4 border-[#1E90FF]"
                                        : isCurrent
                                        ? "bg-white border-4 border-[#1E90FF]"
                                        : "bg-white border-4 border-[#E0E0E0]"
                                    }`}
                                  >
                                    <Icon
                                      size={40}
                                      className={
                                        isCompleted || isCurrent
                                          ? "text-[#1E90FF]"
                                          : "text-[#B8B8B8]"
                                      }
                                      strokeWidth={2}
                                    />
                                  </div>

                                  {/* Stage Info */}
                                  <h3
                                    className={`text-sm font-semibold mb-1 ${
                                      isCompleted || isCurrent
                                        ? "text-[#2B2B2B]"
                                        : "text-[#B8B8B8]"
                                    }`}
                                  >
                                    {stage.title}
                                  </h3>
                                  <p className="text-xs text-[#4A4A4A] mb-1">
                                    {stage.description}
                                  </p>
                                  <p className="text-xs text-[#B8B8B8]">
                                    {stage.office}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Mobile Flowchart */}
                      <div className="md:hidden space-y-6">
                        {flowchartStages.map((stage, index) => {
                          const Icon = stage.icon;
                          const isCompleted = index < currentStageIndex;
                          const isCurrent = index === currentStageIndex;

                          return (
                            <div key={stage.id} className="relative">
                              {/* Connecting Line */}
                              {index < flowchartStages.length - 1 && (
                                <div className="absolute left-8 top-20 bottom-0 w-1 -mb-6 bg-[#E0E0E0]">
                                  {isCompleted && (
                                    <div className="w-full h-full bg-[#1E90FF]"></div>
                                  )}
                                </div>
                              )}

                              <div className="flex gap-4 relative z-10">
                                {/* Icon */}
                                <div
                                  className={`w-16 h-16 flex-shrink-0 rounded-full flex items-center justify-center transition-all duration-300 ${
                                    isCompleted
                                      ? "bg-[#1E90FF] border-4 border-[#1E90FF]"
                                      : isCurrent
                                      ? "bg-white border-4 border-[#1E90FF]"
                                      : "bg-white border-4 border-[#E0E0E0]"
                                  }`}
                                >
                                  <Icon
                                    size={28}
                                    className={
                                      isCompleted || isCurrent
                                        ? "text-[#1E90FF]"
                                        : "text-[#B8B8B8]"
                                    }
                                    strokeWidth={2}
                                  />
                                </div>

                                {/* Info */}
                                <div className="flex-1">
                                  <h3
                                    className={`text-lg font-semibold mb-1 ${
                                      isCompleted || isCurrent
                                        ? "text-[#2B2B2B]"
                                        : "text-[#B8B8B8]"
                                    }`}
                                  >
                                    {stage.title}
                                  </h3>
                                  <p className="text-sm text-[#4A4A4A] mb-1">
                                    {stage.description}
                                  </p>
                                  <p className="text-xs text-[#B8B8B8]">
                                    {stage.office}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}

              {/* Report Issue Section */}
              {application.approved !== false && (
                <div className="mt-8 bg-white rounded-lg shadow-lg p-8">
                  <h3 className="text-xl font-semibold text-[#2B2B2B] mb-4">
                    Experiencing Delays?
                  </h3>
                  <p className="text-base text-[#4A4A4A] mb-4">
                    If your application has exceeded the estimated completion
                    time, you can report the issue to hold officials
                    accountable.
                  </p>
                  <button className="bg-[#E74C3C] text-white text-sm font-semibold px-6 py-2.5 rounded uppercase tracking-wide transition-all duration-300 hover:bg-[#C0392B]">
                    Report Delay
                  </button>
                </div>
              )}
            </>
          )}

          {/* Demo Info */}
          {!application && !notFound && (
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <FileText size={48} className="text-[#1E90FF] mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-[#2B2B2B] mb-2">
                How to Track
              </h3>
              <p className="text-base text-[#4A4A4A] mb-4">
                Enter your application ID in the search box above to track your
                application status.
              </p>
              <p className="text-sm text-[#B8B8B8]">
                You received your application ID via email after submitting your
                application.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackApplication;
