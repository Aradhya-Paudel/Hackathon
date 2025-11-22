import React, { useState, useEffect } from 'react'
import { PieChart, Pie, BarChart, Bar, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'
import { TrendingUp, Users, FileText, AlertCircle, Send, Mail, MailOpen, Inbox, Maximize2, X, Minimize2, ChevronDown, ChevronUp } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { officeAPI } from '../services/api'

const HierarchyDashboard = () => {
  const { user } = useAuth()
  const [hierarchyData, setHierarchyData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showMessageModal, setShowMessageModal] = useState(false)
  const [selectedOffice, setSelectedOffice] = useState(null)
  const [messages, setMessages] = useState([])
  const [showMessages, setShowMessages] = useState(false)
  const [officials, setOfficials] = useState([])
  const [maximizedChart, setMaximizedChart] = useState(null)
  const [collapsedCharts, setCollapsedCharts] = useState({
    'applications-by-office': false,
    'applications-by-type': false,
    'efficiency-ranking': false
  })
  const [messageForm, setMessageForm] = useState({
    recipient_id: '',
    recipient_office: '',
    subject: '',
    content: '',
    priority: 'medium'
  })

  const toggleChart = (chartId) => {
    setCollapsedCharts(prev => ({
      ...prev,
      [chartId]: !prev[chartId]
    }))
  }

  const COLORS = ['#1E90FF', '#27AE60', '#F39C12', '#E74C3C', '#9C27B0', '#00BCD4', '#FF5722']

  useEffect(() => {
    if (user?.is_monitor) {
      loadHierarchyData()
      loadMessages()
      loadOfficials()
    }
  }, [user])

  // Handle ESC key to close maximized chart
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape' && maximizedChart) {
        setMaximizedChart(null)
      }
    }
    window.addEventListener('keydown', handleEscKey)
    return () => window.removeEventListener('keydown', handleEscKey)
  }, [maximizedChart])

  const loadHierarchyData = async () => {
    setLoading(true)
    try {
      const data = await officeAPI.getHierarchyStats()
      setHierarchyData(data)
    } catch (err) {
      setError(err.message || 'Failed to load hierarchy data')
    } finally {
      setLoading(false)
    }
  }

  const loadMessages = async () => {
    try {
      const received = await officeAPI.getReceivedMessages()
      setMessages(received)
    } catch (err) {
      console.error('Failed to load messages:', err)
    }
  }

<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
>>>>>>> 277c4fd8bc6e933c1c322d56a2273098e60883c2
  const markMessageAsRead = async (messageId) => {
    try {
      await officeAPI.markMessageRead(messageId)
      loadMessages() // Reload messages
    } catch (err) {
      console.error('Failed to mark message as read:', err)
    }
  }

<<<<<<< HEAD
=======
>>>>>>> f876da6 (nischal commited)
>>>>>>> 277c4fd8bc6e933c1c322d56a2273098e60883c2
  const loadOfficials = async () => {
    try {
      const officialsList = await officeAPI.getAllOfficials()
      console.log('Loaded officials:', officialsList)
      setOfficials(officialsList)
    } catch (err) {
      console.error('Failed to load officials:', err)
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    
    if (!messageForm.recipient_id) {
      setError('No recipient selected. Please try again.')
      return
    }
    
    try {
      console.log('Sending message:', messageForm)
      await officeAPI.sendMessage(messageForm)
      setShowMessageModal(false)
      setMessageForm({
        recipient_id: '',
        recipient_office: '',
        subject: '',
        content: '',
        priority: 'medium'
      })
      setError('')
      alert('Message sent successfully!')
    } catch (err) {
      console.error('Failed to send message:', err)
      setError(err.message || 'Failed to send message')
    }
  }

  const openMessageModal = (office) => {
    console.log('Opening message modal for office:', office)
    console.log('Available officials:', officials)
    
<<<<<<< HEAD
=======
<<<<<<< HEAD
    setSelectedOffice(office)
    
    // Find the official from this office (not a monitor account)
    const official = officials.find(o => {
      console.log('Checking official:', {
        officialName: o.office_name,
        targetName: office.office_name,
        officialLevel: o.office_level,
        targetLevel: o.office_level,
        isMonitor: o.is_monitor
      })
      return o.office_name === office.office_name && 
             o.office_level === office.office_level &&
             !o.is_monitor
    })
=======
>>>>>>> 277c4fd8bc6e933c1c322d56a2273098e60883c2
    const isNationalMonitor = user?.office_name === "National Monitor"
    const isGandakiMonitor = user?.office_name === "Gandaki Province Monitor"
    const isKaskiMonitor = user?.office_name === "Kaski District Monitor"
    
    // For National Monitor, only Gandaki can be messaged
    if (isNationalMonitor && office.office_name !== "Gandaki") {
      const errorMsg = `Messaging is only available for Gandaki Province. Other provinces (${office.office_name}) are display-only for scalability demonstration.`
      console.error(errorMsg)
      setError(errorMsg)
      alert(errorMsg)
      return
    }
    
    // For Gandaki Province Monitor, only Kaski can be messaged
    if (isGandakiMonitor && office.office_name !== "Kaski") {
      const errorMsg = `Messaging is only available for Kaski District. Other districts (${office.office_name}) are display-only for scalability demonstration.`
      console.error(errorMsg)
      setError(errorMsg)
      alert(errorMsg)
      return
    }
    
    // For Kaski District Monitor, only Pokhara has real officials
    if (isKaskiMonitor && office.office_name !== "Pokhara") {
      const errorMsg = `Messaging is only available for Pokhara. Other municipalities (${office.office_name}) are display-only for scalability demonstration.`
      console.error(errorMsg)
      setError(errorMsg)
      alert(errorMsg)
      return
    }
    
    setSelectedOffice(office)
    
    let official
    
    // For Gandaki in National monitor, find the Gandaki Province Monitor
    if (isNationalMonitor && office.office_name === "Gandaki") {
      official = officials.find(o => 
        o.office_name === "Gandaki Province Monitor" && 
        o.is_monitor === true
      )
    }
    // For Kaski in Gandaki monitor, find the Kaski District Monitor
    else if (isGandakiMonitor && office.office_name === "Kaski") {
      official = officials.find(o => 
        o.office_name === "Kaski District Monitor" && 
        o.is_monitor === true
      )
    }
    // For Pokhara in Kaski monitor, find the Pokhara Metropolitan Office official
    else if (isKaskiMonitor && office.office_name === "Pokhara") {
      // Find the Pokhara Metropolitan Monitor who receives messages from Kaski
      official = officials.find(o => 
        o.office_name === "Pokhara Metropolitan Monitor" && 
        o.is_monitor === true
      )
      
      if (!official) {
        // Fallback to Pokhara Metropolitan Office
        official = officials.find(o => 
          o.office_name === "Pokhara Metropolitan Office" && 
          !o.is_monitor
        )
      }
    } else {
      // Original logic for other monitors
      official = officials.find(o => {
        console.log('Checking official:', {
          officialName: o.office_name,
          targetName: office.office_name,
          officialLevel: o.office_level,
          targetLevel: o.office_level,
          isMonitor: o.is_monitor
        })
        return o.office_name === office.office_name && 
               o.office_level === office.office_level &&
               !o.is_monitor
      })
    }
<<<<<<< HEAD
=======
>>>>>>> f876da6 (nischal commited)
>>>>>>> 277c4fd8bc6e933c1c322d56a2273098e60883c2
    
    console.log('Found official:', official)
    
    if (!official) {
<<<<<<< HEAD
      const errorMsg = `No official account found for "${office.office_name}". This office may not have an active account yet.`
=======
<<<<<<< HEAD
      const errorMsg = `No official account found for "${office.office_name}". This office may not have an active account yet. Available officials: ${officials.filter(o => !o.is_monitor).map(o => o.office_name).join(', ')}`
=======
      const errorMsg = `No official account found for "${office.office_name}". This office may not have an active account yet.`
>>>>>>> f876da6 (nischal commited)
>>>>>>> 277c4fd8bc6e933c1c322d56a2273098e60883c2
      console.error(errorMsg)
      setError(errorMsg)
      alert(errorMsg)
      return
    }
    
    setMessageForm({
      recipient_id: official.id,
      recipient_office: office.office_name,
      subject: '',
      content: '',
      priority: 'medium'
    })
    setError('') // Clear any previous errors
    setShowMessageModal(true)
  }

  if (!user?.is_monitor) {
    return (
      <div className="pt-20 min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={64} className="text-[#E74C3C] mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-[#2B2B2B] mb-2">Access Denied</h2>
          <p className="text-[#4A4A4A]">This page is only accessible to monitoring accounts.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="pt-20 min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E90FF] mx-auto mb-4"></div>
          <p className="text-[#4A4A4A]">Loading hierarchy data...</p>
        </div>
      </div>
    )
  }

  // Prepare chart data
  const overallStatsData = hierarchyData?.subordinate_offices.map(office => ({
    name: office.office_name.length > 20 ? office.office_name.substring(0, 20) + '...' : office.office_name,
    total: office.total_applications,
    completed: office.completed,
    pending: office.pending,
    rejected: office.rejected
  })) || []

  const efficiencyData = hierarchyData?.subordinate_offices.map(office => ({
    name: office.office_name.length > 15 ? office.office_name.substring(0, 15) + '...' : office.office_name,
    efficiency: office.efficiency
  })).sort((a, b) => b.efficiency - a.efficiency) || []


  // Aggregate all application types
  const applicationsByType = {}
  hierarchyData?.subordinate_offices.forEach(office => {
    Object.entries(office.applications_by_type || {}).forEach(([type, count]) => {
      applicationsByType[type] = (applicationsByType[type] || 0) + count
    })
  })

  const pieChartData = Object.entries(applicationsByType).map(([name, value]) => ({
    name: name.replace('-', ' ').toUpperCase(),
    value
  }))

  return (
    <div className="pt-20 min-h-screen bg-[#F5F5F5]">
      <div className="py-20 px-6 md:px-12 lg:px-15">
        <div className="max-w-[1600px] mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl lg:text-[36px] font-semibold text-[#2B2B2B] mb-3">
<<<<<<< HEAD
=======
<<<<<<< HEAD
              Hierarchy Monitoring Dashboard
            </h1>
            <div className="w-16 h-1 bg-[#1E90FF] rounded-sm mb-4"></div>
            <p className="text-base md:text-lg text-[#4A4A4A] leading-relaxed">
              Monitor and analyze performance across all subordinate offices
=======
>>>>>>> 277c4fd8bc6e933c1c322d56a2273098e60883c2
              {user?.office_name === "National Monitor" ? "National Monitoring Dashboard" :
               user?.office_name === "Gandaki Province Monitor" ? "Gandaki Province Monitoring Dashboard" :
               user?.office_name === "Kaski District Monitor" ? "Kaski District Monitoring Dashboard" : 
               "Hierarchy Monitoring Dashboard"}
            </h1>
            <div className="w-16 h-1 bg-[#1E90FF] rounded-sm mb-4"></div>
            <p className="text-base md:text-lg text-[#4A4A4A] leading-relaxed">
              {user?.office_name === "National Monitor" 
                ? "Monitor and analyze performance across all provinces in Nepal"
                : user?.office_name === "Gandaki Province Monitor" 
                ? "Monitor and analyze performance across all districts in Gandaki Province"
                : user?.office_name === "Kaski District Monitor" 
                ? "Monitor and analyze performance across all municipalities in Kaski District"
                : "Monitor and analyze performance across all subordinate offices"}
<<<<<<< HEAD
=======
>>>>>>> f876da6 (nischal commited)
>>>>>>> 277c4fd8bc6e933c1c322d56a2273098e60883c2
            </p>
            {user && (
              <div className="mt-4 p-4 bg-[#E8F4FD] rounded-lg flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#2B2B2B]">
                    <strong>Monitoring Level:</strong> {user.office_name} ({user.office_level})
                  </p>
                  <p className="text-xs text-[#4A4A4A] mt-1">
<<<<<<< HEAD
=======
<<<<<<< HEAD
                    Tracking {hierarchyData?.total_subordinates || 0} subordinate offices
=======
>>>>>>> 277c4fd8bc6e933c1c322d56a2273098e60883c2
                    {user?.office_name === "National Monitor" 
                      ? `Tracking ${hierarchyData?.total_subordinates || 0} provinces`
                      : user?.office_name === "Gandaki Province Monitor" 
                      ? `Tracking ${hierarchyData?.total_subordinates || 0} districts`
                      : user?.office_name === "Kaski District Monitor"
                      ? `Tracking ${hierarchyData?.total_subordinates || 0} municipalities`
                      : `Tracking ${hierarchyData?.total_subordinates || 0} subordinate offices`}
<<<<<<< HEAD
=======
>>>>>>> f876da6 (nischal commited)
>>>>>>> 277c4fd8bc6e933c1c322d56a2273098e60883c2
                  </p>
                </div>
                <button
                  onClick={() => setShowMessages(!showMessages)}
                  className="flex items-center gap-2 bg-[#1E90FF] text-white px-4 py-2 rounded hover:bg-[#1873CC] transition-all duration-300"
<<<<<<< HEAD
                  type="button"
=======
<<<<<<< HEAD
=======
                  type="button"
>>>>>>> f876da6 (nischal commited)
>>>>>>> 277c4fd8bc6e933c1c322d56a2273098e60883c2
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

          {/* Overall Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-[#E8F4FD] flex items-center justify-center">
                  <Users size={24} className="text-[#1E90FF]" />
                </div>
              </div>
              <h3 className="text-sm font-medium text-[#4A4A4A] mb-1">Subordinate Offices</h3>
              <p className="text-3xl font-bold text-[#2B2B2B]">{hierarchyData?.total_subordinates || 0}</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-[#E8F5E9] flex items-center justify-center">
                  <FileText size={24} className="text-[#27AE60]" />
                </div>
              </div>
              <h3 className="text-sm font-medium text-[#4A4A4A] mb-1">Total Applications</h3>
              <p className="text-3xl font-bold text-[#2B2B2B]">{hierarchyData?.total_applications || 0}</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-[#F3E5F5] flex items-center justify-center">
                  <TrendingUp size={24} className="text-[#9C27B0]" />
                </div>
              </div>
              <h3 className="text-sm font-medium text-[#4A4A4A] mb-1">Overall Efficiency</h3>
              <p className="text-3xl font-bold text-[#2B2B2B]">{hierarchyData?.overall_efficiency || 0}%</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-[#FFF3E0] flex items-center justify-center">
                  <Mail size={24} className="text-[#F39C12]" />
                </div>
              </div>
              <h3 className="text-sm font-medium text-[#4A4A4A] mb-1">Unread Messages</h3>
              <p className="text-3xl font-bold text-[#2B2B2B]">{messages.filter(m => !m.read).length}</p>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-8">
            {/* Bar Chart - Applications by Office */}
            <div className="bg-white rounded-lg shadow-lg p-8 relative">
              <div className="flex items-center justify-between mb-4">
<<<<<<< HEAD
=======
<<<<<<< HEAD
                <h2 className="text-xl font-semibold text-[#2B2B2B]">Applications by Office</h2>
=======
>>>>>>> 277c4fd8bc6e933c1c322d56a2273098e60883c2
                <h2 className="text-xl font-semibold text-[#2B2B2B]">
                  {user?.office_name === "National Monitor" ? "Applications by Province" :
                   user?.office_name === "Gandaki Province Monitor" ? "Applications by District" :
                   user?.office_name === "Kaski District Monitor" ? "Applications by Municipality" : 
                   "Applications by Office"}
                </h2>
<<<<<<< HEAD
=======
>>>>>>> f876da6 (nischal commited)
>>>>>>> 277c4fd8bc6e933c1c322d56a2273098e60883c2
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleChart('applications-by-office')}
                    className="text-[#4A4A4A] hover:text-[#2B2B2B] transition-colors"
                    title={collapsedCharts['applications-by-office'] ? "Expand" : "Collapse"}
                  >
                    {collapsedCharts['applications-by-office'] ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
                  </button>
                  <button
                    onClick={() => setMaximizedChart('applications-by-office')}
                    className="text-[#1E90FF] hover:text-[#1873CC] transition-colors"
                    title="Maximize"
                  >
                    <Maximize2 size={20} />
                  </button>
                </div>
              </div>
              {!collapsedCharts['applications-by-office'] && (overallStatsData.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={overallStatsData} margin={{ top: 5, right: 30, left: 20, bottom: 80 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45} 
                      textAnchor="end" 
                      height={100}
                      interval={0}
                      tick={{ fontSize: 11 }}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #E0E0E0', 
                        borderRadius: '8px',
                        padding: '10px'
                      }}
                    />
                    <Legend 
                      wrapperStyle={{ paddingTop: '20px' }}
                      iconType="circle"
                    />
                    <Bar dataKey="completed" fill="#27AE60" name="Completed" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="pending" fill="#F39C12" name="Pending" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="rejected" fill="#E74C3C" name="Rejected" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[400px] flex items-center justify-center text-[#4A4A4A]">
                  No data available
                </div>
              ))}
            </div>

            {/* Pie Chart - Applications by Type */}
<<<<<<< HEAD
            <div className="bg-white rounded-lg shadow-lg p-8 relative overflow-hidden">
=======
<<<<<<< HEAD
            <div className="bg-white rounded-lg shadow-lg p-8 relative">
=======
            <div className="bg-white rounded-lg shadow-lg p-8 relative overflow-hidden">
>>>>>>> f876da6 (nischal commited)
>>>>>>> 277c4fd8bc6e933c1c322d56a2273098e60883c2
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-[#2B2B2B]">Applications by Type</h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleChart('applications-by-type')}
                    className="text-[#4A4A4A] hover:text-[#2B2B2B] transition-colors"
                    title={collapsedCharts['applications-by-type'] ? "Expand" : "Collapse"}
                  >
                    {collapsedCharts['applications-by-type'] ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
                  </button>
                  <button
                    onClick={() => setMaximizedChart('applications-by-type')}
                    className="text-[#1E90FF] hover:text-[#1873CC] transition-colors"
                    title="Maximize"
                  >
                    <Maximize2 size={20} />
                  </button>
                </div>
              </div>
              {!collapsedCharts['applications-by-type'] && (pieChartData.length > 0 ? (
<<<<<<< HEAD
=======
<<<<<<< HEAD
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #E0E0E0', 
                        borderRadius: '8px',
                        padding: '10px'
                      }}
                    />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36}
                      iconType="circle"
                    />
                  </PieChart>
                </ResponsiveContainer>
=======
>>>>>>> 277c4fd8bc6e933c1c322d56a2273098e60883c2
                <div className="w-full" style={{ maxHeight: '400px', overflow: 'hidden' }}>
                  <ResponsiveContainer width="100%" height={400}>
                    <PieChart margin={{ top: 5, right: 5, bottom: 70, left: 5 }}>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="42%"
                        labelLine={false}
                        label={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        paddingAngle={2}
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #E0E0E0', 
                          borderRadius: '8px',
                          padding: '10px'
                        }}
                        formatter={(value, name) => [value, name]}
                      />
                      <Legend 
                        verticalAlign="bottom" 
                        height={65}
                        iconType="circle"
                        wrapperStyle={{ fontSize: '11px', paddingTop: '5px' }}
                        formatter={(value) => {
                          const truncated = value.length > 16 ? value.substring(0, 16) + '...' : value
                          return truncated
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
<<<<<<< HEAD
=======
>>>>>>> f876da6 (nischal commited)
>>>>>>> 277c4fd8bc6e933c1c322d56a2273098e60883c2
              ) : (
                <div className="h-[400px] flex items-center justify-center text-[#4A4A4A]">
                  No applications data available
                </div>
              ))}
            </div>

            {/* Bar Chart - Efficiency Ranking */}
            <div className="bg-white rounded-lg shadow-lg p-8 relative">
              <div className="flex items-center justify-between mb-4">
<<<<<<< HEAD
=======
<<<<<<< HEAD
                <h2 className="text-xl font-semibold text-[#2B2B2B]">Office Efficiency Ranking</h2>
=======
>>>>>>> 277c4fd8bc6e933c1c322d56a2273098e60883c2
                <h2 className="text-xl font-semibold text-[#2B2B2B]">
                  {user?.office_name === "National Monitor" ? "Province Efficiency Ranking" :
                   user?.office_name === "Gandaki Province Monitor" ? "District Efficiency Ranking" :
                   user?.office_name === "Kaski District Monitor" ? "Municipal Efficiency Ranking" : 
                   "Office Efficiency Ranking"}
                </h2>
<<<<<<< HEAD
=======
>>>>>>> f876da6 (nischal commited)
>>>>>>> 277c4fd8bc6e933c1c322d56a2273098e60883c2
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleChart('efficiency-ranking')}
                    className="text-[#4A4A4A] hover:text-[#2B2B2B] transition-colors"
                    title={collapsedCharts['efficiency-ranking'] ? "Expand" : "Collapse"}
                  >
                    {collapsedCharts['efficiency-ranking'] ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
                  </button>
                  <button
                    onClick={() => setMaximizedChart('efficiency-ranking')}
                    className="text-[#1E90FF] hover:text-[#1873CC] transition-colors"
                    title="Maximize"
                  >
                    <Maximize2 size={20} />
                  </button>
                </div>
              </div>
              {!collapsedCharts['efficiency-ranking'] && (efficiencyData.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={efficiencyData.slice(0, 10)} margin={{ top: 5, right: 30, left: 20, bottom: 80 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45} 
                      textAnchor="end" 
                      height={100}
                      interval={0}
                      tick={{ fontSize: 11 }}
                    />
                    <YAxis 
                      domain={[0, 100]} 
                      tick={{ fontSize: 12 }}
                      label={{ value: 'Efficiency %', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #E0E0E0', 
                        borderRadius: '8px',
                        padding: '10px'
                      }}
                      formatter={(value) => `${value}%`}
                    />
                    <Bar dataKey="efficiency" fill="#1E90FF" name="Efficiency %" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[400px] flex items-center justify-center text-[#4A4A4A]">
                  No efficiency data available
                </div>
              ))}
            </div>

          </div>

          {/* Subordinate Offices Table */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
<<<<<<< HEAD
=======
<<<<<<< HEAD
            <h2 className="text-2xl font-semibold text-[#2B2B2B] mb-4">Subordinate Office Details</h2>
=======
>>>>>>> 277c4fd8bc6e933c1c322d56a2273098e60883c2
            <h2 className="text-2xl font-semibold text-[#2B2B2B] mb-4">
              {user?.office_name === "National Monitor" ? "Province Office Details" :
               user?.office_name === "Gandaki Province Monitor" ? "District Office Details" :
               user?.office_name === "Kaski District Monitor" ? "Municipal Office Details" : 
               "Subordinate Office Details"}
            </h2>
<<<<<<< HEAD
=======
>>>>>>> f876da6 (nischal commited)
>>>>>>> 277c4fd8bc6e933c1c322d56a2273098e60883c2
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-[#E0E0E0]">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-[#2B2B2B]">Office Name</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-[#2B2B2B]">Level</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-[#2B2B2B]">Total</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-[#2B2B2B]">Completed</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-[#2B2B2B]">Pending</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-[#2B2B2B]">Rejected</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-[#2B2B2B]">Efficiency</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-[#2B2B2B]">Avg Time</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-[#2B2B2B]">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {hierarchyData?.subordinate_offices.map((office) => (
                    <tr key={office.office_id} className="border-b border-[#E0E0E0] hover:bg-[#F5F5F5]">
                      <td className="py-3 px-4 text-sm text-[#2B2B2B]">{office.office_name}</td>
                      <td className="text-center py-3 px-4 text-sm text-[#4A4A4A] capitalize">{office.office_level}</td>
                      <td className="text-center py-3 px-4 text-sm font-semibold text-[#2B2B2B]">{office.total_applications}</td>
                      <td className="text-center py-3 px-4 text-sm font-semibold text-[#27AE60]">{office.completed}</td>
                      <td className="text-center py-3 px-4 text-sm font-semibold text-[#F39C12]">{office.pending}</td>
                      <td className="text-center py-3 px-4 text-sm font-semibold text-[#E74C3C]">{office.rejected}</td>
                      <td className="text-center py-3 px-4">
                        <span className={`text-sm font-semibold px-2 py-1 rounded ${
                          office.efficiency >= 80 ? 'bg-[#E8F5E9] text-[#27AE60]' :
                          office.efficiency >= 60 ? 'bg-[#FFF3E0] text-[#F39C12]' :
                          'bg-[#FFEBEE] text-[#E74C3C]'
                        }`}>
                          {office.efficiency}%
                        </span>
                      </td>
                      <td className="text-center py-3 px-4 text-sm text-[#4A4A4A]">{office.avg_processing_time} days</td>
                      <td className="text-center py-3 px-4">
<<<<<<< HEAD
=======
<<<<<<< HEAD
                        <button
                          onClick={() => openMessageModal(office)}
                          className="flex items-center gap-1 text-sm text-[#1E90FF] hover:text-[#1873CC] mx-auto"
                        >
                          <Send size={16} />
                          Contact
                        </button>
=======
>>>>>>> 277c4fd8bc6e933c1c322d56a2273098e60883c2
                        {(user?.office_name === "National Monitor" && office.office_name !== "Gandaki") ||
                         (user?.office_name === "Gandaki Province Monitor" && office.office_name !== "Kaski") ||
                         (user?.office_name === "Kaski District Monitor" && office.office_name !== "Pokhara") ? (
                          <span className="text-xs text-[#B8B8B8] italic">Display Only</span>
                        ) : (
                          <button
                            onClick={() => openMessageModal(office)}
                            className="flex items-center gap-1 text-sm text-[#1E90FF] hover:text-[#1873CC] mx-auto"
                          >
                            <Send size={16} />
                            Contact
                          </button>
                        )}
<<<<<<< HEAD
=======
>>>>>>> f876da6 (nischal commited)
>>>>>>> 277c4fd8bc6e933c1c322d56a2273098e60883c2
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

<<<<<<< HEAD
          {/* Messages Section - Removed inline, now in modal below */}
=======
<<<<<<< HEAD
          {/* Messages Section */}
          {showMessages && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-[#2B2B2B] mb-4">Received Messages</h2>
              {messages.length === 0 ? (
                <p className="text-center text-[#4A4A4A] py-8">No messages yet</p>
              ) : (
                <div className="space-y-3">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-4 rounded-lg border ${
                        message.read ? 'bg-white border-[#E0E0E0]' : 'bg-[#E8F4FD] border-[#1E90FF]'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {message.read ? <MailOpen size={18} className="text-[#4A4A4A]" /> : <Mail size={18} className="text-[#1E90FF]" />}
                          <span className="font-semibold text-[#2B2B2B]">{message.sender_name}</span>
                          <span className="text-xs text-[#4A4A4A]">({message.sender_office})</span>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded ${
                          message.priority === 'urgent' ? 'bg-[#FFEBEE] text-[#E74C3C]' :
                          message.priority === 'high' ? 'bg-[#FFF3E0] text-[#F39C12]' :
                          'bg-[#E0E0E0] text-[#4A4A4A]'
                        }`}>
                          {message.priority}
                        </span>
                      </div>
                      <h4 className="font-semibold text-[#2B2B2B] mb-1">{message.subject}</h4>
                      <p className="text-sm text-[#4A4A4A] mb-2">{message.content}</p>
                      <p className="text-xs text-[#B8B8B8]">{new Date(message.created_at).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
=======
          {/* Messages Section - Removed inline, now in modal below */}
>>>>>>> f876da6 (nischal commited)
>>>>>>> 277c4fd8bc6e933c1c322d56a2273098e60883c2
        </div>
      </div>

      {/* Message Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-[#2B2B2B]">Send Message</h3>
              <button onClick={() => setShowMessageModal(false)} className="text-[#4A4A4A] hover:text-[#2B2B2B]">✕</button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-[#FFEBEE] border-l-4 border-[#E74C3C] rounded">
                <p className="text-sm text-[#E74C3C]">{error}</p>
              </div>
            )}
            
            <form onSubmit={handleSendMessage} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#4A4A4A] mb-2">To Office</label>
                <input
                  type="text"
                  value={messageForm.recipient_office}
                  disabled
                  className="w-full bg-[#F5F5F5] border border-[#E0E0E0] rounded px-4 py-2 text-[#2B2B2B]"
                />
                {messageForm.recipient_id && (
                  <p className="text-xs text-[#27AE60] mt-1">Recipient ID: {messageForm.recipient_id}</p>
                )}
                {!messageForm.recipient_id && (
                  <p className="text-xs text-[#E74C3C] mt-1">Warning: No recipient ID found</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#4A4A4A] mb-2">Subject *</label>
                <input
                  type="text"
                  value={messageForm.subject}
                  onChange={(e) => setMessageForm({...messageForm, subject: e.target.value})}
                  required
                  className="w-full bg-[#F5F5F5] border border-[#E0E0E0] rounded px-4 py-2 text-[#2B2B2B] focus:outline-none focus:border-[#1E90FF]"
                  placeholder="Enter subject"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#4A4A4A] mb-2">Priority</label>
                <select
                  value={messageForm.priority}
                  onChange={(e) => setMessageForm({...messageForm, priority: e.target.value})}
                  className="w-full bg-[#F5F5F5] border border-[#E0E0E0] rounded px-4 py-2 text-[#2B2B2B] focus:outline-none focus:border-[#1E90FF]"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#4A4A4A] mb-2">Message *</label>
                <textarea
                  value={messageForm.content}
                  onChange={(e) => setMessageForm({...messageForm, content: e.target.value})}
                  required
                  rows="6"
                  className="w-full bg-[#F5F5F5] border border-[#E0E0E0] rounded px-4 py-2 text-[#2B2B2B] focus:outline-none focus:border-[#1E90FF] resize-none"
                  placeholder="Enter your message"
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowMessageModal(false)}
                  className="flex-1 bg-[#E0E0E0] text-[#2B2B2B] py-2 rounded hover:bg-[#BDBDBD] transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#1E90FF] text-white py-2 rounded hover:bg-[#1873CC] transition-all"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

<<<<<<< HEAD
=======
<<<<<<< HEAD
      {/* Maximized Chart Modal */}
      {maximizedChart && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-lg shadow-2xl w-full h-full max-w-[92vw] max-h-[92vh] p-8 flex flex-col relative">
=======
>>>>>>> 277c4fd8bc6e933c1c322d56a2273098e60883c2
      {/* Messages Modal */}
      {showMessages && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowMessages(false)}
        >
          <div 
            className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
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

      {/* Maximized Chart Modal */}
      {maximizedChart && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-lg shadow-2xl w-full h-full max-w-[92vw] max-h-[92vh] p-8 flex flex-col relative overflow-hidden">
<<<<<<< HEAD
=======
>>>>>>> f876da6 (nischal commited)
>>>>>>> 277c4fd8bc6e933c1c322d56a2273098e60883c2
            {/* Close button - Top right corner */}
            <button
              onClick={() => setMaximizedChart(null)}
              className="absolute top-4 right-4 bg-[#E74C3C] hover:bg-[#C0392B] text-white rounded-full p-3 transition-all shadow-lg z-10 flex items-center gap-2"
              title="Close fullscreen"
            >
              <X size={24} />
              <span className="text-sm font-medium pr-1">Close</span>
            </button>

            {/* Header */}
            <div className="mb-8">
              <h3 className="text-3xl font-bold text-[#2B2B2B]">
<<<<<<< HEAD
=======
<<<<<<< HEAD
                {maximizedChart === 'applications-by-office' && 'Applications by Office'}
                {maximizedChart === 'applications-by-type' && 'Applications by Type'}
                {maximizedChart === 'efficiency-ranking' && 'Office Efficiency Ranking'}
=======
>>>>>>> 277c4fd8bc6e933c1c322d56a2273098e60883c2
                {maximizedChart === 'applications-by-office' && (
                  user?.office_name === "National Monitor" ? 'Applications by Province' :
                  user?.office_name === "Gandaki Province Monitor" ? 'Applications by District' :
                  user?.office_name === "Kaski District Monitor" ? 'Applications by Municipality' : 
                  'Applications by Office'
                )}
                {maximizedChart === 'applications-by-type' && 'Applications by Type'}
                {maximizedChart === 'efficiency-ranking' && (
                  user?.office_name === "National Monitor" ? 'Province Efficiency Ranking' :
                  user?.office_name === "Gandaki Province Monitor" ? 'District Efficiency Ranking' :
                  user?.office_name === "Kaski District Monitor" ? 'Municipal Efficiency Ranking' : 
                  'Office Efficiency Ranking'
                )}
<<<<<<< HEAD
=======
>>>>>>> f876da6 (nischal commited)
>>>>>>> 277c4fd8bc6e933c1c322d56a2273098e60883c2
              </h3>
              <div className="w-20 h-1 bg-[#1E90FF] rounded-sm mt-2"></div>
            </div>
            
            <div className="flex-1">
              {maximizedChart === 'applications-by-office' && overallStatsData.length > 0 && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={overallStatsData} margin={{ top: 20, right: 30, left: 40, bottom: 100 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45} 
                      textAnchor="end" 
                      height={120}
                      interval={0}
                      tick={{ fontSize: 13 }}
                    />
                    <YAxis tick={{ fontSize: 14 }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #E0E0E0', 
                        borderRadius: '8px',
                        padding: '12px',
                        fontSize: '14px'
                      }}
                    />
                    <Legend 
                      wrapperStyle={{ paddingTop: '20px', fontSize: '14px' }}
                      iconType="circle"
                    />
                    <Bar dataKey="completed" fill="#27AE60" name="Completed" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="pending" fill="#F39C12" name="Pending" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="rejected" fill="#E74C3C" name="Rejected" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}

              {maximizedChart === 'applications-by-type' && pieChartData.length > 0 && (
<<<<<<< HEAD
=======
<<<<<<< HEAD
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius="60%"
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #E0E0E0', 
                        borderRadius: '8px',
                        padding: '12px',
                        fontSize: '14px'
                      }}
                    />
                    <Legend 
                      verticalAlign="bottom" 
                      height={50}
                      iconType="circle"
                      wrapperStyle={{ fontSize: '14px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
=======
>>>>>>> 277c4fd8bc6e933c1c322d56a2273098e60883c2
                <div className="overflow-hidden h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart margin={{ top: 30, right: 30, bottom: 100, left: 30 }}>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="42%"
                        labelLine={false}
                        label={false}
                        outerRadius="50%"
                        fill="#8884d8"
                        dataKey="value"
                        paddingAngle={2}
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #E0E0E0', 
                          borderRadius: '8px',
                          padding: '12px',
                          fontSize: '14px'
                        }}
                        formatter={(value, name) => [value, name]}
                      />
                      <Legend 
                        verticalAlign="bottom" 
                        height={80}
                        iconType="circle"
                        wrapperStyle={{ fontSize: '14px', paddingTop: '20px' }}
                        formatter={(value) => {
                          const truncated = value.length > 30 ? value.substring(0, 30) + '...' : value
                          return truncated
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
<<<<<<< HEAD
=======
>>>>>>> f876da6 (nischal commited)
>>>>>>> 277c4fd8bc6e933c1c322d56a2273098e60883c2
              )}

              {maximizedChart === 'efficiency-ranking' && efficiencyData.length > 0 && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={efficiencyData} margin={{ top: 20, right: 30, left: 40, bottom: 100 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45} 
                      textAnchor="end" 
                      height={120}
                      interval={0}
                      tick={{ fontSize: 13 }}
                    />
                    <YAxis 
                      domain={[0, 100]} 
                      tick={{ fontSize: 14 }}
                      label={{ value: 'Efficiency %', angle: -90, position: 'insideLeft', style: { fontSize: '16px' } }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #E0E0E0', 
                        borderRadius: '8px',
                        padding: '12px',
                        fontSize: '14px'
                      }}
                      formatter={(value) => `${value}%`}
                    />
                    <Bar dataKey="efficiency" fill="#1E90FF" name="Efficiency %" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default HierarchyDashboard

