<<<<<<< HEAD
# Frontend-hackathon
=======
# Sarkaha - Government Monitoring Portal

A comprehensive government official monitoring and accountability system for Nepal. Track applications in real-time, monitor government efficiency, and ensure timely delivery of public services.

## Features

### For Citizens
- **Apply for Services**: Submit applications online for various government services (House Registration, National ID, Passport, Driver's License, etc.)
- **Real-time Tracking**: Get instant ETA and track your application status with a visual flowchart
- **Processing Flowchart**: See exactly where your application is in the process and who's handling it
- **Report Delays**: Hold officials accountable by reporting delays if services aren't delivered on time

### For Government Officials
- **Hierarchical Dashboard**: Monitor applications and track productivity at different government levels (Local → Metropolitan → District → Provincial → National)
- **Performance Analytics**: View real-time statistics on application processing, completion rates, and efficiency metrics
- **Subordinate Monitoring**: Track performance of subordinate offices and identify bottlenecks
- **Chain of Command**: Communicate with superior and subordinate offices in the hierarchy

### Smart System
- **AI-Powered ETA**: Linear regression model predicts completion time based on historical data
- **Automatic Data Collection**: System continuously learns and improves predictions
- **Performance Tracking**: Measure efficiency across all government levels
- **Real-time Updates**: Live progress tracking and status updates

## Tech Stack

- **Frontend**: React 18
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Storage**: localStorage (for demo purposes)

## Installation & Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

4. **Preview Production Build**
   ```bash
   npm run preview
   ```

## Project Structure

```
hackathon-2/
├── src/
│   ├── components/
│   │   ├── Header.jsx           # Navigation header with mobile menu
│   │   ├── Footer.jsx           # Footer with links and contact info
│   │   └── ScrollToTop.jsx      # Scroll to top button
│   ├── pages/
│   │   ├── HomePage.jsx         # Landing page with hero, stats, features
│   │   ├── CitizenForm.jsx      # Application submission form
│   │   ├── TrackApplication.jsx # Application tracking with flowchart
│   │   └── OfficialDashboard.jsx # Official monitoring dashboard
│   ├── App.jsx                  # Main app component with routing
│   ├── main.jsx                 # Entry point
│   └── index.css                # Global styles
├── public/
├── design.json                  # Complete design system specification
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## Design System

The project strictly follows the design system defined in `design.json`:

- **Colors**: Primary blue (#1E90FF), Secondary gold (#D4AF37), Neutral grays
- **Typography**: Inter font family with defined hierarchies
- **Components**: Buttons, forms, cards, navigation - all following exact specifications
- **Responsive**: Mobile-first design with breakpoints for tablet and desktop
- **Accessibility**: High contrast ratios, semantic HTML, ARIA labels

## Key Pages

### 1. Home Page (`/`)
- Hero section with call-to-action buttons
- Statistics section showing system performance
- Features overview explaining how it works
- Fully responsive with mobile menu

### 2. Apply for Services (`/apply`)
- Comprehensive form for submitting applications
- Service type selection (House Registration, NID, Passport, etc.)
- Instant application ID generation
- Form validation and user feedback

### 3. Track Application (`/track`)
- Search by application ID
- Visual flowchart showing processing stages
- Progress bar with percentage completion
- Current stage information and ETA
- Option to report delays

### 4. Official Dashboard (`/dashboard`)
- Hierarchy level selector (Local → National)
- Performance statistics and analytics
- Subordinate office monitoring
- Recent activities feed
- Chain of command communication

## How It Works

### Citizen Journey
1. Citizen fills out an application form online
2. System generates unique application ID
3. ML model calculates estimated completion time
4. Citizen receives tracking ID and ETA
5. Real-time tracking with visual flowchart
6. Option to report if deadline is exceeded

### Official Workflow
1. Officials log into hierarchical dashboard
2. View applications at their level
3. Monitor subordinate office performance
4. Track efficiency metrics and delays
5. Contact underperforming offices
6. Report to superior offices in chain

### ML Model (Concept)
- Linear regression trained on historical data
- X = Application submission date
- Y = Completion date
- Continuously updates as new data comes in
- Provides accurate ETA predictions

## SEO Optimization

- Semantic HTML structure
- Meta tags for description and keywords
- Proper heading hierarchy
- Alt text for images (when implemented)
- Fast loading with Vite optimization
- Mobile-responsive design
- Clean URL structure

## Storage

Currently using localStorage for demo purposes:
- Applications stored as JSON array
- Each application has unique ID, timestamps, status
- Easy to migrate to proper database (MongoDB, PostgreSQL, etc.)

## Future Enhancements

- Backend API integration
- Real database (MongoDB/PostgreSQL)
- Actual ML model implementation
- User authentication and authorization
- Email/SMS notifications
- File upload for documents
- Payment gateway integration
- Multi-language support (Nepali/English)
- Admin panel for system management

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License - Built for Nepal Government Digital Transformation Initiative

## Credits

Built with React, Tailwind CSS, and a vision for transparent governance in Nepal.

>>>>>>> testing
