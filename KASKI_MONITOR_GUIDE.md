# Kaski District Monitor - Setup Guide

## Overview
The Kaski District Monitor displays **5 municipalities** in the Kaski District:
1. **Pokhara** (Real data from ward applications)
2. **Annapurna** (Mock data for display)
3. **Machhapuchchhre** (Mock data for display)
4. **Madi** (Mock data for display)
5. **Rupa** (Mock data for display)

## Login Credentials
- **Email**: `monitor@kaski.gov.np`
- **Password**: `password123`
- **Access URL**: After login, go to `/monitor`

## Features

### 1. Municipal Dashboard View
The Kaski District Monitor shows all 5 municipalities in a table format with:
- Total Applications
- Completed Applications
- Pending Applications
- Rejected Applications
- Efficiency Percentage
- Average Processing Time
- Applications by Type (chart data)

### 2. Data Sources

#### Pokhara (Real Data)
- **Source**: Calculated from all 33 ward offices in Pokhara
- **Applications**: Real applications submitted to ward offices
- **Statistics**: Averaged/aggregated from actual ward data
- **Messaging**: Fully functional
- **Message Recipient**: Messages sent to Pokhara go to "Pokhara Metropolitan Monitor"

#### Other Municipalities (Mock Data)
**Annapurna, Machhapuchchhre, Madi, Rupa**
- **Source**: Generated mock data for display purposes
- **Purpose**: Demonstrates scalability without creating thousands of fake applications
- **Applications**: Not stored in JSON, purely for UI display
- **Statistics**: Realistic but fictional numbers
- **Messaging**: Disabled (shows "Display Only" in Contact column)

### 3. Mock Data Details

#### Annapurna Rural Municipality
- Total Applications: 324
- Completed: 278
- Efficiency: 85.8%
- Avg Processing Time: 4.2 days

#### Machhapuchchhre Rural Municipality
- Total Applications: 267
- Completed: 221
- Efficiency: 82.8%
- Avg Processing Time: 4.8 days

#### Madi Rural Municipality
- Total Applications: 198
- Completed: 167
- Efficiency: 84.3%
- Avg Processing Time: 4.5 days

#### Rupa Rural Municipality
- Total Applications: 156
- Completed: 128
- Efficiency: 82.1%
- Avg Processing Time: 5.1 days

### 4. Charts and Visualizations

The dashboard displays three main charts:

1. **Applications by Municipality**
   - Bar chart showing completed, pending, and rejected applications
   - Pokhara data is real, others are mock

2. **Applications by Type**
   - Pie chart showing distribution across service types:
     - National ID
     - Birth Certificate
     - Marriage Certificate
     - Land Certificate

3. **Municipal Efficiency Ranking**
   - Bar chart ranking municipalities by efficiency percentage
   - Helps identify high and low performing areas

### 5. Messaging System

#### Functional Messaging (Pokhara Only)
- Kaski District Monitor can send messages to Pokhara
- Messages are received by: **Pokhara Metropolitan Monitor** (`monitor@pokhara.gov.np`)
- Priority levels: Low, Medium, High, Urgent
- Full message tracking with read/unread status

#### Display-Only (Other Municipalities)
- Contact button replaced with "Display Only" text
- Clicking will show alert: "Messaging is only available for Pokhara..."
- This demonstrates scalability without requiring fake official accounts

### 6. Testing the Setup

#### Test Messaging Flow:
1. Login as Kaski Monitor: `monitor@kaski.gov.np`
2. Go to `/monitor` dashboard
3. Click "Contact" button for Pokhara
4. Send a message with subject and content
5. Logout
6. Login as Pokhara Monitor: `monitor@pokhara.gov.np`
7. Go to `/monitor` dashboard
8. Click "Messages" button in header
9. See the received message from Kaski District Monitor

#### Test Data Accuracy:
1. Login as Kaski Monitor
2. Verify Pokhara shows real ward application data
3. Verify other municipalities show mock data
4. Check that charts update correctly
5. Expand/collapse charts using chevron icons
6. Maximize charts for full-screen view

## Technical Implementation

### Backend Changes (`main.py`)
- Added special case handling for "Kaski District Monitor"
- Calculates Pokhara data by aggregating all ward applications
- Generates mock data for other 4 municipalities
- Returns combined dataset to frontend

### Frontend Changes (`HierarchyDashboard.jsx`)
- Added conditional rendering for Kaski-specific titles
- Disabled messaging for non-Pokhara municipalities
- Updated chart labels to say "Municipality" instead of "Office"
- Added "Display Only" indicator in Contact column

### Database Changes (`officials.json`)
- Added 5 new municipal-level officials:
  - `off-pokhara-municipal`: Pokhara
  - `off-annapurna-municipal`: Annapurna
  - `off-machhapuchchhre-municipal`: Machhapuchchhre
  - `off-madi-municipal`: Madi
  - `off-rupa-municipal`: Rupa

### Applications Data (`applications.json`)
- **NO NEW APPLICATIONS CREATED**
- Uses existing ward applications for Pokhara calculations
- Mock municipalities don't add to JSON file

## Key Points

✅ **Pokhara**: Real data from 33 wards  
✅ **Other Municipalities**: Mock display data  
✅ **Messaging**: Only functional for Pokhara  
✅ **No New Applications**: JSON file unchanged  
✅ **Scalability Demo**: Shows how system handles multiple municipalities  
✅ **Message Routing**: Kaski → Pokhara Metropolitan Monitor  

## Hierarchy Flow

```
Kaski District Monitor (district level)
    ↓
    ├─ Pokhara (municipal - has 33 wards with real data)
    │     ↓
    │     └─ Receives messages from Kaski Monitor
    │
    ├─ Annapurna (municipal - display only)
    ├─ Machhapuchchhre (municipal - display only)
    ├─ Madi (municipal - display only)
    └─ Rupa (municipal - display only)
```

## Notes for Demonstration

1. **Scalability**: Shows how the system can handle multiple municipalities without database bloat
2. **Real Integration**: Pokhara demonstrates actual integration with subordinate offices
3. **Mixed Data**: Combination of real and mock data for realistic presentation
4. **Messaging Hierarchy**: Proper message routing from district to metropolitan level
5. **Performance**: No performance impact from mock data since it's generated on-the-fly

---

**Last Updated**: November 21, 2025  
**Version**: 1.0  
**Status**: Fully Functional ✅

