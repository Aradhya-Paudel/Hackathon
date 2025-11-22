# National Monitor - Setup Guide

## Overview
The National Monitor displays **7 provinces** of Nepal:
1. **Gandaki** (Real data calculated from all districts in Gandaki)
2. **Koshi** (Mock data for display)
3. **Madhesh** (Mock data for display)
4. **Bagmati** (Mock data for display)
5. **Lumbini** (Mock data for display)
6. **Karnali** (Mock data for display)
7. **Sudurpashchim** (Mock data for display)

## Login Credentials
- **Email**: `monitor@nepal.gov.np`
- **Password**: `password123`
- **Access URL**: After login, go to `/monitor`

## Features

### 1. Province Dashboard View
The National Monitor shows all 7 provinces in a table format with:
- Total Applications
- Completed Applications
- Pending Applications
- Rejected Applications
- Efficiency Percentage
- Average Processing Time
- Applications by Type (chart data)

### 2. Data Sources

#### Gandaki Province (Real Data)
- **Source**: Calculated from all 11 districts in Gandaki
- **Calculation**: Sum of all districts (Kaski + Baglung + Gorkha + Lamjung + Manang + Mustang + Myagdi + Nawalpur + Parbat + Syangja + Tanahun)
- **Kaski District**: Sum of all municipalities (Pokhara from wards + Annapurna + Machhapuchchhre + Madi + Rupa)
- **Pokhara Municipality**: Sum of all Pokhara ward applications
- **Statistics**: Aggregated from actual Gandaki district data
- **Messaging**: Fully functional
- **Message Recipient**: Messages sent to Gandaki go to "Gandaki Province Monitor"

#### Other Provinces (Mock Data)
**Koshi, Madhesh, Bagmati, Lumbini, Karnali, Sudurpashchim**
- **Source**: Generated mock data for display purposes
- **Purpose**: Demonstrates scalability without creating thousands of fake applications
- **Applications**: Not stored in JSON, purely for UI display
- **Statistics**: Realistic but fictional numbers
- **Messaging**: Disabled (shows "Display Only" in Contact column)

### 3. Mock Data Details

#### Koshi Province
- Total Applications: 15,432
- Completed: 13,258
- Efficiency: 85.9%
- Avg Processing Time: 4.3 days

#### Madhesh Province
- Total Applications: 18,765
- Completed: 16,089
- Efficiency: 85.7%
- Avg Processing Time: 4.6 days

#### Bagmati Province
- Total Applications: 23,456
- Completed: 20,321
- Efficiency: 86.6%
- Avg Processing Time: 4.1 days

#### Lumbini Province
- Total Applications: 16,789
- Completed: 14,321
- Efficiency: 85.3%
- Avg Processing Time: 4.5 days

#### Karnali Province
- Total Applications: 8,765
- Completed: 7,234
- Efficiency: 82.5%
- Avg Processing Time: 5.2 days

#### Sudurpashchim Province
- Total Applications: 11,234
- Completed: 9,456
- Efficiency: 84.2%
- Avg Processing Time: 4.8 days

### 4. Charts and Visualizations

The dashboard displays three main charts:

1. **Applications by Province**
   - Bar chart showing completed, pending, and rejected applications
   - Gandaki data is real, others are mock

2. **Applications by Type**
   - Pie chart showing distribution across service types:
     - National ID
     - Birth Certificate
     - Marriage Certificate
     - Land Certificate

3. **Province Efficiency Ranking**
   - Bar chart ranking provinces by efficiency percentage
   - Helps identify high and low performing areas

### 5. Messaging System

#### Functional Messaging (Gandaki Only)
- National Monitor can send messages to Gandaki Province
- Messages are received by: **Gandaki Province Monitor** (`monitor@gandaki.gov.np`)
- Priority levels: Low, Medium, High, Urgent
- Full message tracking with read/unread status

#### Display-Only (Other Provinces)
- Contact button replaced with "Display Only" text
- Clicking will show alert: "Messaging is only available for Gandaki Province..."
- This demonstrates scalability without requiring fake official accounts

### 6. Testing the Setup

#### Test Messaging Flow:
1. Login as National Monitor: `monitor@nepal.gov.np`
2. Go to `/monitor` dashboard
3. Click "Contact" button for Gandaki
4. Send a message with subject and content
5. Logout
6. Login as Gandaki Monitor: `monitor@gandaki.gov.np`
7. Go to `/monitor` dashboard
8. Click "Messages" button in header
9. See the received message from National Monitor

#### Test Data Accuracy:
1. Login as National Monitor
2. Verify Gandaki shows real province data (sum of all districts)
3. Verify other provinces show mock data
4. Check that charts update correctly
5. Expand/collapse charts using chevron icons
6. Maximize charts for full-screen view

## Technical Implementation

### Backend Changes (`main.py`)
- Added special case handling for "National Monitor"
- Calculates Gandaki data by summing all 11 districts in Gandaki
- Each district is calculated from its municipalities
- Kaski district is sum of all municipalities (Pokhara from wards + 4 mock)
- Pokhara is sum of all ward applications
- Generates mock data for other 6 provinces
- Returns combined dataset to frontend

### Frontend Changes (`HierarchyDashboard.jsx`)
- Added conditional rendering for National-specific titles
- Disabled messaging for non-Gandaki provinces
- Updated chart labels to say "Province" instead of "Office"
- Added "Display Only" indicator in Contact column
- Messaging routes to Gandaki Province Monitor

### Database Changes (`officials.json`)
- No new officials needed (Gandaki Province Monitor already exists)
- Uses existing monitor account for message receiving

### Applications Data (`applications.json`)
- **NO NEW APPLICATIONS CREATED**
- Uses existing applications for Gandaki calculations
- Mock provinces don't add to JSON file

## Key Points

✅ **Gandaki**: Real data calculated from all districts (sum of all municipalities)  
✅ **Other Provinces**: Mock display data  
✅ **Messaging**: Only functional for Gandaki  
✅ **No New Applications**: JSON file unchanged  
✅ **Scalability Demo**: Shows how system handles all 7 provinces  
✅ **Message Routing**: National → Gandaki Province Monitor  
✅ **Math Adds Up**: Gandaki = Sum of all districts = Sum of all municipalities = Sum of all ward applications  

## Hierarchy Flow

```
National Monitor (national level)
    ↓
    ├─ Gandaki Province (province - has real data from 11 districts)
    │     ↓
    │     └─ Receives messages from National Monitor
    │     ├─ Kaski District (sum of 5 municipalities)
    │     │   ├─ Pokhara (sum of all wards - REAL)
    │     │   ├─ Annapurna (mock)
    │     │   ├─ Machhapuchchhre (mock)
    │     │   ├─ Madi (mock)
    │     │   └─ Rupa (mock)
    │     └─ Other 10 districts (mock)
    │
    ├─ Koshi Province (display only)
    ├─ Madhesh Province (display only)
    ├─ Bagmati Province (display only)
    ├─ Lumbini Province (display only)
    ├─ Karnali Province (display only)
    └─ Sudurpashchim Province (display only)
```

## Math Verification

### Complete Data Flow:
1. **Pokhara Municipality** = Sum of all Pokhara Ward applications (REAL)
2. **Kaski District** = Pokhara + Annapurna + Machhapuchchhre + Madi + Rupa
3. **Gandaki Province** = Sum of all 11 districts in Gandaki
4. **National Total** = Gandaki (real) + 6 other provinces (mock)

### Example Calculation:
- If Pokhara has 1000 ward applications
- Kaski = 1000 (Pokhara) + 324 + 267 + 198 + 156 = 1945
- Gandaki = 1945 (Kaski) + 1245 + 1567 + 987 + 234 + 312 + 678 + 1456 + 892 + 1123 + 1345 = ~11,784
- National = ~11,784 (Gandaki) + 94,441 (other 6 provinces) = ~106,225

## Comparison with Other Monitors

| Feature | Kaski District Monitor | Gandaki Province Monitor | National Monitor |
|---------|----------------------|-------------------------|------------------|
| **Level** | District | Province | National |
| **Subordinates** | 5 Municipalities | 11 Districts | 7 Provinces |
| **Real Data** | Pokhara | Kaski | Gandaki |
| **Mock Data** | 4 Municipalities | 10 Districts | 6 Provinces |
| **Messaging To** | Pokhara Metropolitan Monitor | Kaski District Monitor | Gandaki Province Monitor |
| **Display Only** | Annapurna, Machhapuchchhre, Madi, Rupa | All districts except Kaski | All provinces except Gandaki |

## Notes for Demonstration

1. **Scalability**: Shows how the system can handle all 7 provinces without database bloat
2. **Real Integration**: Gandaki demonstrates actual integration with subordinate offices
3. **Mixed Data**: Combination of real and mock data for realistic presentation
4. **Messaging Hierarchy**: Proper message routing from national to province level
5. **Performance**: No performance impact from mock data since it's generated on-the-fly
6. **Consistency**: Same pattern as other monitors but at national level
7. **Math Accuracy**: All calculations sum up correctly from wards → municipalities → districts → provinces

---

**Last Updated**: November 21, 2025  
**Version**: 1.0  
**Status**: Fully Functional ✅

