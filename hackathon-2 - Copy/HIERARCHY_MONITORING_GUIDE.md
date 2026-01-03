# Hierarchy Monitoring System - Implementation Guide

## Overview
A comprehensive monitoring system for tracking government office performance across all levels of hierarchy with messaging capabilities and data visualization.

## System Architecture

### Hierarchy Levels
1. **Local (Ward Offices)** - Execute services (33 wards in Pokhara)
2. **Metropolitan** - Monitors all ward offices
3. **District** - Monitors metropolitan and ward offices
4. **Province** - Monitors district, metropolitan, and ward offices
5. **National** - Monitors all levels

## Monitoring Accounts Created

### Login Credentials (Password: `password123` for all)

1. **Pokhara Metropolitan Monitor**
   - Email: `monitor@pokhara.gov.np`
   - Monitors: All 33 ward offices
   - Access: City-level application tracking

2. **Kaski District Monitor**
   - Email: `monitor@kaski.gov.np`
   - Monitors: Pokhara Metropolitan + Ward offices
   - Access: District-level tracking

3. **Gandaki Province Monitor**
   - Email: `monitor@gandaki.gov.np`
   - Monitors: District + Metropolitan + Ward offices
   - Access: Province-level tracking

4. **National Monitor**
   - Email: `monitor@nepal.gov.np`
   - Monitors: All levels (Province, District, Metropolitan, Ward)
   - Access: National-level tracking

## Features Implemented

### 1. Hierarchy Dashboard (`/monitor`)
Accessible only to monitoring accounts (`is_monitor: true`)

#### Statistics Cards
- **Subordinate Offices**: Total count of monitored offices
- **Total Applications**: Aggregate across all subordinate offices
- **Overall Efficiency**: Performance percentage
- **Unread Messages**: Inbox notification count

#### Data Visualizations

**Bar Chart - Applications by Office**
- Shows completed, pending, and rejected applications per office
- Color-coded: Green (completed), Yellow (pending), Red (rejected)

**Pie Chart - Applications by Type**
- Displays distribution of service types
- Shows: National ID, Birth Certificate, Marriage Certificate, Passport, etc.

**Bar Chart - Efficiency Ranking**
- Ranks offices by completion percentage
- Sorted from highest to lowest efficiency

**Scatter Plot - Processing Time vs Volume**
- X-axis: Number of applications
- Y-axis: Average processing time (days)
- Helps identify bottlenecks

#### Office Details Table
Displays for each subordinate office:
- Office Name & Level
- Total Applications
- Completed/Pending/Rejected counts
- Efficiency percentage (color-coded: 80%+ green, 60-79% yellow, <60% red)
- Average processing time
- **Contact button** - Opens messaging modal

### 2. Messaging System

#### Features
- **Send Messages**: Monitor → Subordinate office
- **Priority Levels**: Low, Medium, High, Urgent
- **Message Inbox**: View received messages
- **Read/Unread Status**: Track which messages are new
- **Message Details**: Sender info, timestamp, subject, content

#### Message Modal
- Pre-filled recipient office
- Subject line
- Priority selector
- Message content textarea
- Send/Cancel buttons

### 3. Backend API Endpoints

#### Hierarchy Monitoring
```
GET /api/monitor/hierarchy-stats
```
- Returns comprehensive statistics for all subordinate offices
- Includes efficiency, processing times, application breakdowns by type
- Filtered based on monitor's level

#### Messaging
```
POST /api/messages
- Send a message
Body: {recipient_id, recipient_office, subject, content, priority}

GET /api/messages/received
- Get all received messages

GET /api/messages/sent
- Get all sent messages

PUT /api/messages/{message_id}/read
- Mark message as read

GET /api/officials
- Get list of all officials (for recipient lookup)
```

## Data Models

### User Model (Extended)
```javascript
{
  id: string
  email: string
  full_name: string
  user_type: "official"
  office_level: string
  office_name: string
  is_monitor: boolean  // NEW
  monitors: string[]   // NEW - levels this account monitors
}
```

### Message Model
```javascript
{
  id: string
  sender_id: string
  sender_office: string
  sender_name: string
  recipient_id: string
  recipient_office: string
  subject: string
  content: string
  priority: "low" | "medium" | "high" | "urgent"
  created_at: datetime
  read: boolean
}
```

### HierarchyStats Model
```javascript
{
  monitor_office: string
  monitor_level: string
  total_subordinates: number
  total_applications: number
  overall_efficiency: number
  subordinate_offices: [
    {
      office_id: string
      office_name: string
      office_level: string
      total_applications: number
      completed: number
      pending: number
      rejected: number
      in_progress: number
      efficiency: number
      avg_processing_time: number
      applications_by_type: {[key: string]: number}
    }
  ]
}
```

## Chain of Command Flow

### Example: Low-performing Ward Office

1. **Ward 5** (Local) - Has low efficiency (50%)
2. **Metropolitan Monitor** sees Ward 5's performance
3. Monitor sends HIGH priority message to Ward 5 official
4. Ward 5 official receives message in their dashboard
5. **District Monitor** also sees the issue
6. District contacts Metropolitan Monitor
7. **Province Monitor** tracks district-level aggregate
8. Province contacts District if district-wide issue
9. **National Monitor** oversees entire chain
10. National contacts Province for systemic issues

### Message Escalation
- **Low Priority**: General updates, reminders
- **Medium Priority**: Performance concerns
- **High Priority**: Significant delays, quality issues
- **Urgent Priority**: Critical failures, system-wide problems

## How to Use

### As a Monitoring Account

1. **Login** at `/official/login`
   - Use one of the monitor emails
   - Password: `password123`

2. **Navigate** to Monitor Dashboard
   - Automatic redirect for monitor accounts
   - Or click "Monitor Dashboard" in header

3. **View Analytics**
   - Review all charts and statistics
   - Identify underperforming offices

4. **Contact Offices**
   - Click "Contact" button in office table
   - Fill in subject, priority, message
   - Send to subordinate office

5. **Check Messages**
   - Click "Messages" button in header area
   - View unread count
   - Read and respond to messages

### As a Regular Official (Receiving Messages)

1. **Login** to your official account
2. Navigate to **Official Dashboard** (`/dashboard`)
3. Messages from monitors appear in a dedicated section
4. Read message content and priority
5. Take action based on message urgency

## Technical Implementation

### Frontend Components
- **HierarchyDashboard.jsx**: Main monitoring interface
- Uses `recharts` library for visualizations
- Responsive design with Tailwind CSS
- Real-time data from backend API

### Backend
- **FastAPI** endpoints for hierarchy and messaging
- **JSON file storage** for messages
- Permission checks: Only monitors access hierarchy stats
- Automatic data aggregation by office level

### Navigation
- Header shows different links based on `is_monitor` flag
- Monitoring accounts see "Monitor Dashboard"
- Regular officials see "Official Portal"

## Database Files

```
backend/data/
├── citizens.json      # Citizen accounts
├── officials.json     # Official accounts (includes monitors)
├── applications.json  # All applications
└── messages.json      # Messaging data (NEW)
```

## Key Features

✅ **Real-time Statistics**: Live data from actual applications
✅ **Visual Analytics**: 4 different chart types for insights
✅ **Office Comparison**: Side-by-side performance metrics
✅ **Messaging System**: Direct communication channel
✅ **Chain of Command**: Clear hierarchical structure
✅ **Priority Handling**: Urgent message flagging
✅ **Efficiency Tracking**: Percentage-based performance
✅ **Processing Time Analysis**: Identify slow offices
✅ **Application Type Breakdown**: Service-specific tracking

## Color Coding

### Efficiency Status
- 🟢 **80%+**: Green (Excellent)
- 🟡 **60-79%**: Yellow (Needs Improvement)
- 🔴 **<60%**: Red (Critical)

### Message Priority
- ⚪ **Low**: Gray
- 🟡 **Medium**: Yellow
- 🟠 **High**: Orange
- 🔴 **Urgent**: Red

### Application Status
- 🔵 **Submitted**: Blue
- 🟡 **In Progress**: Yellow
- 🟢 **Completed**: Green
- 🔴 **Rejected**: Red

## Next Steps / Future Enhancements

1. **Email Notifications**: Auto-send emails for urgent messages
2. **Performance Reports**: Generate PDF reports
3. **Trend Analysis**: Historical data comparison
4. **Automated Alerts**: Trigger alerts for efficiency drops
5. **Response Tracking**: Monitor how quickly officials respond
6. **SLA Management**: Set and track service level agreements
7. **Export Data**: Download charts and statistics
8. **Mobile App**: Monitoring on the go

## Troubleshooting

### Monitor dashboard shows no data
- Ensure applications exist in the system
- Check that offices are properly configured
- Verify monitor account has correct `is_monitor` flag

### Cannot send messages
- Verify recipient office exists in officials list
- Check that backend is running
- Ensure authentication token is valid

### Charts not rendering
- Verify recharts is installed: `npm install recharts`
- Check browser console for errors
- Ensure data format matches chart requirements

## Testing the System

1. **Create test applications** as different wards
2. **Login as metropolitan monitor**: `monitor@pokhara.gov.np`
3. **View ward statistics** on monitor dashboard
4. **Send a message** to a low-performing ward
5. **Login as that ward official**
6. **Check dashboard** for received message
7. **Complete some applications** in that ward
8. **Login back as monitor**
9. **Verify updated statistics**

---

**Password for ALL monitoring accounts**: `password123`

**Access Monitoring Dashboard**: Login → `/monitor` (auto-redirect)

This system creates complete accountability and transparency in government operations! 🎯

