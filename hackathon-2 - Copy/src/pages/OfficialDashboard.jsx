import React, { useState, useEffect } from 'react'
import { BarChart3, Users, Clock, CheckCircle, AlertTriangle, TrendingUp, MessageSquare, FileText, ArrowUpDown, RotateCcw, Trash2, XCircle, Mail, MailOpen, Inbox } from 'lucide-react'
import { officeAPI, applicationAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'

const OfficialDashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [selectedApp, setSelectedApp] = useState(null)
  const [rejectionMessage, setRejectionMessage] = useState('')
  const [sortBy, setSortBy] = useState('date') // 'date' or 'type'
  const [sortOrder, setSortOrder] = useState('desc') // 'asc' or 'desc'
  const [filterType, setFilterType] = useState('all') // 'all' or specific service type
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [appToDelete, setAppToDelete] = useState(null)
  const [messages, setMessages] = useState([])
  const [showMessages, setShowMessages] = useState(false)

  // Ward office application types
  const wardApplicationTypes = [
    'national-id',
    'birth-certificate', 
    'marriage-certificate'
  ]

  useEffect(() => {
    loadDashboardData()
    loadMessages()
  }, [])

  const loadMessages = async () => {
    try {
      const received = await officeAPI.getReceivedMessages()
      setMessages(received)
    } catch (err) {
      console.error('Failed to load messages:', err)
    }
  }

  const markMessageAsRead = async (messageId) => {
    try {
      await officeAPI.markMessageRead(messageId)
      loadMessages() // Reload messages
    } catch (err) {
      console.error('Failed to mark message as read:', err)
    }
  }

  const loadDashboardData = async () => {
    setLoading(true)
    setError('')
    
    try {
      const [statsData, appsData] = await Promise.all([
        officeAPI.getStats(),
        officeAPI.getApplications()
      ])
      
      setStats(statsData)
      setApplications(appsData)
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (appId) => {
    try {
      await applicationAPI.update(appId, { 
        approved: true, 
        status: 'In Progress',
        progress: 25,
        current_stage: 'Processing'
      })
      await loadDashboardData()
    } catch (err) {
      setError(err.message || 'Failed to approve application')
    }
  }

  const handleReject = (app) => {
    setSelectedApp(app)
    setShowRejectModal(true)
  }

  const submitRejection = async () => {
    if (!rejectionMessage.trim()) {
      setError('Please provide a rejection reason')
      return
    }
    
    try {
      await applicationAPI.update(selectedApp.id, { 
        approved: false,
        status: 'Rejected',
        rejection_message: rejectionMessage,
        progress: 0
      })
      setShowRejectModal(false)
      setRejectionMessage('')
      setSelectedApp(null)
      await loadDashboardData()
    } catch (err) {
      setError(err.message || 'Failed to reject application')
    }
  }

  const handleUpdateStatus = async (appId, newStatus) => {
    try {
      const updateData = { 
        status: newStatus, 
        progress: newStatus === 'Completed' ? 100 : 50 
      }
      
      // Add completed_date if marking as completed
      if (newStatus === 'Completed') {
        updateData.completed_date = new Date().toISOString()
      }
      
      await applicationAPI.update(appId, updateData)
      await loadDashboardData()
    } catch (err) {
      setError(err.message || 'Failed to update application status')
    }
  }

  const handleUndoComplete = async (appId) => {
    try {
      await applicationAPI.update(appId, { 
        status: 'In Progress', 
        progress: 50,
        current_stage: 'Processing'
      })
      await loadDashboardData()
    } catch (err) {
      setError(err.message || 'Failed to undo completion')
    }
  }

  const handleDeleteRequest = (app) => {
    setAppToDelete(app)
    setShowDeleteConfirm(true)
  }

  const handleDeleteConfirm = async () => {
    if (!appToDelete) return
    
    try {
      await applicationAPI.delete(appToDelete.id)
      setShowDeleteConfirm(false)
      setAppToDelete(null)
      await loadDashboardData()
    } catch (err) {
      setError(err.message || 'Failed to delete application')
      setShowDeleteConfirm(false)
    }
  }

  const isWardOffice = () => {
    return user?.office_level === 'local' && user?.office_name?.includes('Ward')
  }

  const getFilteredApplications = () => {
    if (filterType === 'all') {
      return applications
    }
    return applications.filter(app => app.service_type === filterType)
  }

  const getSortedApplications = () => {
    let sorted = [...getFilteredApplications()]
    
    if (sortBy === 'date') {
      sorted.sort((a, b) => {
        const dateA = new Date(a.submitted_date)
        const dateB = new Date(b.submitted_date)
        return sortOrder === 'desc' ? dateB - dateA : dateA - dateB
      })
    } else if (sortBy === 'type') {
      sorted.sort((a, b) => {
        const comparison = a.service_type.localeCompare(b.service_type)
        return sortOrder === 'desc' ? -comparison : comparison
      })
    }
    
    return sorted
  }

  const getAvailableApplicationTypes = () => {
    if (isWardOffice()) {
      return wardApplicationTypes
    }
    // For non-ward offices, get unique service types from applications
    const uniqueTypes = [...new Set(applications.map(app => app.service_type))]
    return uniqueTypes
  }

  const getAverageProcessingTime = () => {
    const completedApps = applications.filter(a => a.status === 'Completed' && a.completed_date)
    
    if (completedApps.length === 0) return 0
    
    const totalDays = completedApps.reduce((sum, app) => {
      const submittedDate = new Date(app.submitted_date)
      const completedDate = new Date(app.completed_date)
      const daysDiff = Math.ceil((completedDate - submittedDate) / (1000 * 60 * 60 * 24))
      return sum + daysDiff
    }, 0)
    
    return Math.round(totalDays / completedApps.length)
  }


  if (loading) {
    return (
      <div className="pt-20 min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E90FF] mx-auto mb-4"></div>
          <p className="text-[#4A4A4A]">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-20 min-h-screen bg-[#F5F5F5]">
      <div className="py-20 px-6 md:px-12 lg:px-15">
        <div className="max-w-[1400px] mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl lg:text-[36px] font-semibold text-[#2B2B2B] mb-3">
              Official Dashboard
            </h1>
            <div className="w-16 h-1 bg-[#1E90FF] rounded-sm mb-4"></div>
            <p className="text-base md:text-lg text-[#4A4A4A] leading-relaxed">
              Monitor applications, track productivity, and manage hierarchical communication
            </p>
            {user && (
              <div className="mt-4 p-4 bg-[#E8F4FD] rounded-lg flex items-center justify-between">
                <p className="text-sm text-[#2B2B2B]">
                  <strong>Office:</strong> {user.office_name} ({user.office_level})
                </p>
                <button
                  onClick={() => setShowMessages(!showMessages)}
                  className="flex items-center gap-2 bg-[#1E90FF] text-white px-4 py-2 rounded hover:bg-[#1873CC] transition-all duration-300"
                >
                  <Inbox size={20} />
                  Messages ({messages.filter(m => !m.read).length})
                </button>
              </div>
            )}
            {error && (
              <div className="mt-4 p-4 bg-[#FFEBEE] border-l-4 border-[#E74C3C] rounded">
                <p className="text-sm text-[#E74C3C]">{error}</p>
              </div>
            )}
          </div>

          {/* Statistics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            {/* Total Applications */}
            <div className="bg-white rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-lg">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-[#E8F4FD] flex items-center justify-center">
                  <FileText size={24} className="text-[#1E90FF]" />
                </div>
              </div>
              <h3 className="text-sm font-medium text-[#4A4A4A] mb-1">Total Applications</h3>
              <p className="text-3xl font-bold text-[#2B2B2B]">{stats?.total || applications.length || 0}</p>
            </div>

            {/* Completed */}
            <div className="bg-white rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-lg">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-[#E8F5E9] flex items-center justify-center">
                  <CheckCircle size={24} className="text-[#27AE60]" />
                </div>
              </div>
              <h3 className="text-sm font-medium text-[#4A4A4A] mb-1">Completed</h3>
              <p className="text-3xl font-bold text-[#2B2B2B]">{stats?.completed || applications.filter(a => a.status === 'Completed').length}</p>
            </div>

            {/* Pending */}
            <div className="bg-white rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-lg">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-[#FFF3E0] flex items-center justify-center">
                  <Clock size={24} className="text-[#F39C12]" />
                </div>
              </div>
              <h3 className="text-sm font-medium text-[#4A4A4A] mb-1">Pending</h3>
              <p className="text-3xl font-bold text-[#2B2B2B]">{stats?.pending || applications.filter(a => a.status !== 'Completed' && a.status !== 'Rejected').length}</p>
            </div>

            {/* Rejected */}
            <div className="bg-white rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-lg">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-[#FFEBEE] flex items-center justify-center">
                  <XCircle size={24} className="text-[#E74C3C]" />
                </div>
              </div>
              <h3 className="text-sm font-medium text-[#4A4A4A] mb-1">Rejected</h3>
              <p className="text-3xl font-bold text-[#2B2B2B]">{applications.filter(a => a.status === 'Rejected' || a.approved === false).length}</p>
            </div>

            {/* Efficiency */}
            <div className="bg-white rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-lg">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-[#F3E5F5] flex items-center justify-center">
                  <TrendingUp size={24} className="text-[#9C27B0]" />
                </div>
              </div>
              <h3 className="text-sm font-medium text-[#4A4A4A] mb-1">Efficiency Rate</h3>
              <p className="text-3xl font-bold text-[#2B2B2B]">
                {applications.length > 0 
                  ? Math.round((applications.filter(a => a.status === 'Completed').length / applications.length) * 100)
                  : 0}%
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content - Left Side */}
            <div className="lg:col-span-2 space-y-8">
              {/* Applications for This Office */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-semibold text-[#2B2B2B] mb-1">
                      Applications for Your Office
                    </h2>
                    <div className="w-12 h-1 bg-[#1E90FF] rounded-sm"></div>
                  </div>
                  <FileText size={28} className="text-[#1E90FF]" />
                </div>

                {/* Sorting and Filter Controls */}
                {applications.length > 0 && (
                  <div className="flex flex-wrap gap-3 mb-6 pb-4 border-b border-[#E0E0E0]">
                    {/* Filter by Type (for Ward offices) */}
                    {isWardOffice() && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-[#4A4A4A]">Filter:</span>
                        <select
                          value={filterType}
                          onChange={(e) => setFilterType(e.target.value)}
                          className="text-sm px-3 py-1.5 border border-[#E0E0E0] rounded focus:outline-none focus:border-[#1E90FF]"
                        >
                          <option value="all">All Applications</option>
                          <option value="national-id">National ID</option>
                          <option value="birth-certificate">Birth Certificate</option>
                          <option value="marriage-certificate">Marriage Certificate</option>
                        </select>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[#4A4A4A]">Sort by:</span>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="text-sm px-3 py-1.5 border border-[#E0E0E0] rounded focus:outline-none focus:border-[#1E90FF]"
                      >
                        <option value="date">Date</option>
                        <option value="type">Application Type</option>
                      </select>
                    </div>
                    <button
                      onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                      className="flex items-center gap-2 text-sm px-3 py-1.5 bg-[#E8F4FD] text-[#1E90FF] rounded hover:bg-[#1E90FF] hover:text-white transition-all duration-300"
                    >
                      <ArrowUpDown size={16} />
                      {sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
                    </button>
                  </div>
                )}

                {applications.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText size={48} className="text-[#B8B8B8] mx-auto mb-4" />
                    <p className="text-[#4A4A4A]">No applications found for your office</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {getSortedApplications().map((app) => (
                      <div key={app.id} className="border border-[#E0E0E0] rounded-lg p-4 hover:border-[#1E90FF] transition-all duration-300">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="text-base font-semibold text-[#2B2B2B] mb-1">{app.id}</h3>
                            <p className="text-sm text-[#4A4A4A]">{app.full_name} - {app.service_type.replace('-', ' ').toUpperCase()}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-semibold px-3 py-1 rounded ${
                              app.status === 'Completed' 
                                ? 'text-[#27AE60] bg-[#E8F5E9]'
                                : app.status === 'In Progress'
                                ? 'text-[#F39C12] bg-[#FFF3E0]'
                                : 'text-[#1E90FF] bg-[#E8F4FD]'
                            }`}>
                              {app.status}
                            </span>
                            <button
                              onClick={() => handleDeleteRequest(app)}
                              className="p-2 text-[#E74C3C] hover:bg-[#FFEBEE] rounded transition-all duration-300"
                              title="Delete application"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 mb-3">
                          <div>
                            <p className="text-xs text-[#4A4A4A]">Email</p>
                            <p className="text-sm font-medium text-[#2B2B2B]">{app.email}</p>
                          </div>
                          <div>
                            <p className="text-xs text-[#4A4A4A]">Phone</p>
                            <p className="text-sm font-medium text-[#2B2B2B]">{app.phone}</p>
                          </div>
                          <div>
                            <p className="text-xs text-[#4A4A4A]">Submitted</p>
                            <p className="text-sm font-medium text-[#2B2B2B]">{new Date(app.submitted_date).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-xs text-[#4A4A4A]">ETA</p>
                            <p className="text-sm font-medium text-[#2B2B2B]">{app.estimated_days} days</p>
                          </div>
                        </div>

                        <div className="mb-3">
                          <p className="text-xs text-[#4A4A4A] mb-1">Progress: {app.progress}%</p>
                          <div className="w-full bg-[#E0E0E0] rounded-full h-2">
                            <div 
                              className="h-2 rounded-full bg-[#1E90FF] transition-all duration-500"
                              style={{ width: `${app.progress}%` }}
                            ></div>
                          </div>
                        </div>

                        {app.description && (
                          <p className="text-sm text-[#4A4A4A] mb-3 italic">"{app.description}"</p>
                        )}

                        {/* Show approval buttons if not yet approved/rejected */}
                        {app.approved === null || app.approved === undefined ? (
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleApprove(app.id)}
                              className="flex-1 bg-[#27AE60] text-white text-sm font-semibold px-4 py-2 rounded hover:bg-[#229954] transition-all duration-300"
                            >
                              Approve
                            </button>
                            <button 
                              onClick={() => handleReject(app)}
                              className="flex-1 bg-[#E74C3C] text-white text-sm font-semibold px-4 py-2 rounded hover:bg-[#C0392B] transition-all duration-300"
                            >
                              Reject
                            </button>
                          </div>
                        ) : app.approved === false ? (
                          <div className="p-3 bg-[#FFEBEE] rounded border-l-4 border-[#E74C3C]">
                            <p className="text-sm font-semibold text-[#E74C3C]">Application Rejected</p>
                            <p className="text-xs text-[#4A4A4A] mt-1">{app.rejection_message}</p>
                          </div>
                        ) : app.status === 'Completed' ? (
                          <div className="flex gap-2">
                            <div className="flex-1 p-3 bg-[#E8F5E9] rounded border-l-4 border-[#27AE60]">
                              <p className="text-sm font-semibold text-[#27AE60]">Application Completed</p>
                            </div>
                            <button 
                              onClick={() => handleUndoComplete(app.id)}
                              className="flex items-center gap-2 bg-[#F39C12] text-white text-sm font-semibold px-4 py-2 rounded hover:bg-[#E67E22] transition-all duration-300"
                              title="Undo completion and return to In Progress"
                            >
                              <RotateCcw size={16} />
                              Undo
                            </button>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleUpdateStatus(app.id, 'In Progress')}
                              className="flex-1 bg-[#F39C12] text-white text-sm font-semibold px-4 py-2 rounded hover:bg-[#E67E22] transition-all duration-300"
                              disabled={app.status === 'In Progress'}
                            >
                              Mark In Progress
                            </button>
                            <button 
                              onClick={() => handleUpdateStatus(app.id, 'Completed')}
                              className="flex-1 bg-[#27AE60] text-white text-sm font-semibold px-4 py-2 rounded hover:bg-[#229954] transition-all duration-300"
                            >
                              Mark Completed
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar - Right Side */}
            <div className="space-y-8">
              {/* Quick Stats */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-semibold text-[#2B2B2B] mb-4">Quick Stats</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#E0E0E0]">
                    <span className="text-sm text-[#4A4A4A]">Avg. Processing Time</span>
                    <span className="text-sm font-semibold text-[#2B2B2B]">
                      {getAverageProcessingTime() > 0 
                        ? `${getAverageProcessingTime()} days`
                        : 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pb-3 border-b border-[#E0E0E0]">
                    <span className="text-sm text-[#4A4A4A]">In Progress</span>
                    <span className="text-sm font-semibold text-[#F39C12]">
                      {applications.filter(a => a.status === 'In Progress').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pb-3 border-b border-[#E0E0E0]">
                    <span className="text-sm text-[#4A4A4A]">Your Office</span>
                    <span className="text-sm font-semibold text-[#2B2B2B]">{user?.office_level || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#4A4A4A]">Completion Rate</span>
                    <span className="text-sm font-semibold text-[#27AE60]">
                      {applications.length > 0 
                        ? Math.round((applications.filter(a => a.status === 'Completed').length / applications.length) * 100)
                        : 0}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Office Info */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-semibold text-[#2B2B2B] mb-4">Office Information</h3>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-[#E8F4FD]">
                    <p className="text-sm font-medium text-[#2B2B2B]">Office Name</p>
                    <p className="text-xs text-[#4A4A4A]">{user?.office_name || 'N/A'}</p>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-[#E8F4FD]">
                    <p className="text-sm font-medium text-[#2B2B2B]">Office Level</p>
                    <p className="text-xs text-[#4A4A4A] capitalize">{user?.office_level || 'N/A'}</p>
                  </div>

                  <div className="p-3 rounded-lg bg-[#E8F4FD]">
                    <p className="text-sm font-medium text-[#2B2B2B]">Contact</p>
                    <p className="text-xs text-[#4A4A4A]">{user?.email || 'N/A'}</p>
                    <p className="text-xs text-[#4A4A4A]">{user?.phone || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Status Summary */}
              {applications.length > 0 && (
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-[#2B2B2B] mb-4">Status Breakdown</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#4A4A4A]">Submitted</span>
                      <span className="text-sm font-semibold text-[#1E90FF]">
                        {applications.filter(a => a.status === 'Submitted').length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#4A4A4A]">In Progress</span>
                      <span className="text-sm font-semibold text-[#F39C12]">
                        {applications.filter(a => a.status === 'In Progress').length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#4A4A4A]">Completed</span>
                      <span className="text-sm font-semibold text-[#27AE60]">
                        {applications.filter(a => a.status === 'Completed').length}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Rejection Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-[#2B2B2B] mb-4">Reject Application</h3>
            <p className="text-sm text-[#4A4A4A] mb-4">
              Please provide a reason for rejecting application <strong>{selectedApp?.id}</strong>
            </p>
            
            <textarea
              value={rejectionMessage}
              onChange={(e) => setRejectionMessage(e.target.value)}
              placeholder="Enter rejection reason..."
              rows="4"
              className="w-full bg-[#F5F5F5] border border-[#E0E0E0] rounded px-4 py-3 text-base text-[#2B2B2B] transition-all duration-300 focus:border-[#1E90FF] focus:bg-white focus:outline-none focus:shadow-[0_0_0_3px_rgba(30,144,255,0.1)] placeholder:text-[#B8B8B8] resize-none mb-4"
            />
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRejectModal(false)
                  setRejectionMessage('')
                  setSelectedApp(null)
                }}
                className="flex-1 bg-[#E0E0E0] text-[#2B2B2B] text-sm font-semibold px-4 py-2 rounded hover:bg-[#BDBDBD] transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={submitRejection}
                className="flex-1 bg-[#E74C3C] text-white text-sm font-semibold px-4 py-2 rounded hover:bg-[#C0392B] transition-all duration-300"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && appToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-[#FFEBEE] flex items-center justify-center">
                <Trash2 size={24} className="text-[#E74C3C]" />
              </div>
              <h3 className="text-xl font-semibold text-[#2B2B2B]">Delete Application</h3>
            </div>
            
            <p className="text-base text-[#4A4A4A] mb-4">
              Are you sure you want to delete application <strong>{appToDelete.id}</strong> for <strong>{appToDelete.full_name}</strong>?
            </p>
            
            <div className="p-3 bg-[#FFF3E0] rounded border-l-4 border-[#F39C12] mb-4">
              <p className="text-sm text-[#4A4A4A]">
                This action cannot be undone. The application will be permanently removed.
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false)
                  setAppToDelete(null)
                }}
                className="flex-1 bg-[#E0E0E0] text-[#2B2B2B] text-sm font-semibold px-4 py-2 rounded hover:bg-[#BDBDBD] transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 bg-[#E74C3C] text-white text-sm font-semibold px-4 py-2 rounded hover:bg-[#C0392B] transition-all duration-300"
              >
                Delete Application
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Messages Section */}
      {showMessages && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-[#2B2B2B]">Received Messages</h2>
              <button 
                onClick={() => setShowMessages(false)}
                className="text-[#4A4A4A] hover:text-[#2B2B2B] transition-colors"
              >
                ✕
              </button>
            </div>

            {messages.length === 0 ? (
              <div className="text-center py-12">
                <Inbox size={64} className="text-[#E0E0E0] mx-auto mb-4" />
                <p className="text-[#4A4A4A]">No messages yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    onClick={() => !message.read && markMessageAsRead(message.id)}
                    className={`p-5 rounded-lg border cursor-pointer transition-all ${
                      message.read 
                        ? 'bg-white border-[#E0E0E0] hover:border-[#BDBDBD]' 
                        : 'bg-[#E8F4FD] border-[#1E90FF] hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {message.read ? (
                          <MailOpen size={20} className="text-[#4A4A4A]" />
                        ) : (
                          <Mail size={20} className="text-[#1E90FF]" />
                        )}
                        <div>
                          <span className="font-semibold text-[#2B2B2B] text-base">
                            {message.sender_name}
                          </span>
                          <span className="text-sm text-[#4A4A4A] ml-2">
                            ({message.sender_office})
                          </span>
                        </div>
                      </div>
                      <span className={`text-xs px-3 py-1 rounded-full ${
                        message.priority === 'urgent' ? 'bg-[#FFEBEE] text-[#E74C3C]' :
                        message.priority === 'high' ? 'bg-[#FFF3E0] text-[#F39C12]' :
                        'bg-[#E0E0E0] text-[#4A4A4A]'
                      }`}>
                        {message.priority}
                      </span>
                    </div>
                    
                    <h4 className="font-semibold text-[#2B2B2B] text-lg mb-2">
                      {message.subject}
                    </h4>
                    
                    <p className="text-sm text-[#4A4A4A] mb-3 leading-relaxed">
                      {message.content}
                    </p>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-[#E0E0E0]">
                      <p className="text-xs text-[#B8B8B8]">
                        {new Date(message.created_at).toLocaleString()}
                      </p>
                      {!message.read && (
                        <span className="text-xs font-medium text-[#1E90FF]">
                          Click to mark as read
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default OfficialDashboard
