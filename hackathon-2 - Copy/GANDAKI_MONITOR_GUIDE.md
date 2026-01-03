# Gandaki Province Monitor - Setup Guide

## Overview
The Gandaki Province Monitor displays **11 districts** in Gandaki Province, Nepal:
1. **Kaski** (Real data from district/metropolitan/local applications)
2. **Baglung** (Mock data for display)
3. **Gorkha** (Mock data for display)
4. **Lamjung** (Mock data for display)
5. **Manang** (Mock data for display)
6. **Mustang** (Mock data for display)
7. **Myagdi** (Mock data for display)
8. **Nawalpur** (Mock data for display)
9. **Parbat** (Mock data for display)
10. **Syangja** (Mock data for display)
11. **Tanahun** (Mock data for display)

## Login Credentials
- **Email**: `monitor@gandaki.gov.np`
- **Password**: `password123`
- **Access URL**: After login, go to `/monitor`

## Features

### 1. District Dashboard View
The Gandaki Province Monitor shows all 11 districts in a table format with:
- Total Applications
- Completed Applications
- Pending Applications
- Rejected Applications
- Efficiency Percentage
- Average Processing Time
- Applications by Type (chart data)

### 2. Data Sources

#### Kaski District (Real Data)
- **Source**: Calculated from all applications in Kaski district (including Pokhara)
- **Applications**: Real applications submitted to Kaski district offices, metropolitan, and local offices
- **Statistics**: Aggregated from actual Kaski district data
- **Messaging**: Fully functional
- **Message Recipient**: Messages sent to Kaski go to "Kaski District Monitor"

#### Other Districts (Mock Data)
**Baglung, Gorkha, Lamjung, Manang, Mustang, Myagdi, Nawalpur, Parbat, Syangja, Tanahun**
- **Source**: Generated mock data for display purposes
- **Purpose**: Demonstrates scalability without creating thousands of fake applications
- **Applications**: Not stored in JSON, purely for UI display
- **Statistics**: Realistic but fictional numbers
- **Messaging**: Disabled (shows "Display Only" in Contact column)

### 3. Mock Data Details

#### Baglung District
- Total Applications: 1,245
- Completed: 1,089
- Efficiency: 87.5%
- Avg Processing Time: 4.3 days

#### Gorkha District
- Total Applications: 1,567
- Completed: 1,342
- Efficiency: 85.6%
- Avg Processing Time: 4.7 days

#### Lamjung District
- Total Applications: 987
- Completed: 856
- Efficiency: 86.7%
- Avg Processing Time: 4.1 days

#### Manang District
- Total Applications: 234
- Completed: 198
- Efficiency: 84.6%
- Avg Processing Time: 5.2 days

#### Mustang District
- Total Applications: 312
- Completed: 267
- Efficiency: 85.6%
- Avg Processing Time: 5.5 days

#### Myagdi District
- Total Applications: 678
- Completed: 589
- Efficiency: 86.9%
- Avg Processing Time: 4.4 days

#### Nawalpur District
- Total Applications: 1,456
- Completed: 1,278
- Efficiency: 87.8%
- Avg Processing Time: 4.0 days

#### Parbat District
- Total Applications: 892
- Completed: 768
- Efficiency: 86.1%
- Avg Processing Time: 4.6 days

#### Syangja District
- Total Applications: 1,123
- Completed: 967
- Efficiency: 86.1%
- Avg Processing Time: 4.2 days

#### Tanahun District
- Total Applications: 1,345
- Completed: 1,156
- Efficiency: 86.0%
- Avg Processing Time: 4.5 days

### 4. Charts and Visualizations

The dashboard displays three main charts:

1. **Applications by District**
   - Bar chart showing completed, pending, and rejected applications
   - Kaski data is real, others are mock

2. **Applications by Type**
   - Pie chart showing distribution across service types:
     - National ID
     - Birth Certificate
     - Marriage Certificate
     - Land Certificate

3. **District Efficiency Ranking**
   - Bar chart ranking districts by efficiency percentage
   - Helps identify high and low performing areas

### 5. Messaging System

#### Functional Messaging (Kaski Only)
- Gandaki Province Monitor can send messages to Kaski District
- Messages are received by: **Kaski District Monitor** (`monitor@kaski.gov.np`)
- Priority levels: Low, Medium, High, Urgent
- Full message tracking with read/unread status

#### Display-Only (Other Districts)
- Contact button replaced with "Display Only" text
- Clicking will show alert: "Messaging is only available for Kaski District..."
- This demonstrates scalability without requiring fake official accounts

### 6. Testing the Setup

#### Test Messaging Flow:
1. Login as Gandaki Monitor: `monitor@gandaki.gov.np`
2. Go to `/monitor` dashboard
3. Click "Contact" button for Kaski
4. Send a message with subject and content
5. Logout
6. Login as Kaski Monitor: `monitor@kaski.gov.np`
7. Go to `/monitor` dashboard
8. Click "Messages" button in header
9. See the received message from Gandaki Province Monitor

#### Test Data Accuracy:
1. Login as Gandaki Monitor
2. Verify Kaski shows real district application data
3. Verify other districts show mock data
4. Check that charts update correctly
5. Expand/collapse charts using chevron icons
6. Maximize charts for full-screen view

## Technical Implementation

### Backend Changes (`main.py`)
- Added special case handling for "Gandaki Province Monitor"
- Calculates Kaski data by aggregating all applications in Kaski district
- Generates mock data for other 10 districts
- Returns combined dataset to frontend

### Frontend Changes (`HierarchyDashboard.jsx`)
- Added conditional rendering for Gandaki-specific titles
- Disabled messaging for non-Kaski districts
- Updated chart labels to say "District" instead of "Office"
- Added "Display Only" indicator in Contact column
- Messaging routes to Kaski District Monitor

### Database Changes (`officials.json`)
- No new officials needed (Kaski District Monitor already exists)
- Uses existing monitor account for message receiving

### Applications Data (`applications.json`)
- **NO NEW APPLICATIONS CREATED**
- Uses existing applications for Kaski calculations
- Mock districts don't add to JSON file

## Key Points

✅ **Kaski**: Real data from district/metropolitan/local applications  
✅ **Other Districts**: Mock display data  
✅ **Messaging**: Only functional for Kaski  
✅ **No New Applications**: JSON file unchanged  
✅ **Scalability Demo**: Shows how system handles multiple districts  
✅ **Message Routing**: Gandaki → Kaski District Monitor  

## Hierarchy Flow

```
Gandaki Province Monitor (province level)
    ↓
    ├─ Kaski District (district - has real data)
    │     ↓
    │     └─ Receives messages from Gandaki Monitor
    │
    ├─ Baglung District (display only)
    ├─ Gorkha District (display only)
    ├─ Lamjung District (display only)
    ├─ Manang District (display only)
    ├─ Mustang District (display only)
    ├─ Myagdi District (display only)
    ├─ Nawalpur District (display only)
    ├─ Parbat District (display only)
    ├─ Syangja District (display only)
    └─ Tanahun District (display only)
```

## Comparison with Kaski Monitor

| Feature | Kaski District Monitor | Gandaki Province Monitor |
|---------|----------------------|-------------------------|
| **Level** | District | Province |
| **Subordinates** | 5 Municipalities | 11 Districts |
| **Real Data** | Pokhara | Kaski |
| **Mock Data** | 4 Municipalities | 10 Districts |
| **Messaging To** | Pokhara Metropolitan Monitor | Kaski District Monitor |
| **Display Only** | Annapurna, Machhapuchchhre, Madi, Rupa | All districts except Kaski |

## Notes for Demonstration

1. **Scalability**: Shows how the system can handle multiple districts without database bloat
2. **Real Integration**: Kaski demonstrates actual integration with subordinate offices
3. **Mixed Data**: Combination of real and mock data for realistic presentation
4. **Messaging Hierarchy**: Proper message routing from province to district level
5. **Performance**: No performance impact from mock data since it's generated on-the-fly
6. **Consistency**: Same pattern as Kaski monitor but at province level

---

**Last Updated**: November 21, 2025  
**Version**: 1.0  
**Status**: Fully Functional ✅

