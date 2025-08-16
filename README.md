# Personal Account Manager

A comprehensive web-based personal account manager with email reading capabilities and password management features.

## Features

### 🏠 Main Dashboard
- Clean, modern interface with two main options
- Navigation to Email Reader and Account Overview

### 📧 Email Reader (IMAP Client)
- IMAP email connection interface
- Email list display with sender, subject, and date
- Email analysis tools including:
  - Email statistics (total, unread count)
  - Top senders analysis
  - Email frequency patterns
- **Note**: Full IMAP functionality requires a backend server due to browser security restrictions

### 🔐 Account Overview (Password Manager)
- Personal information management:
  - Multiple email addresses (primary, secondary, work)
  - Phone number storage
  - Generalized password system
- Support for major online services:
  - Google, YouTube, Amazon, Netflix
  - Facebook, Twitter/X, Microsoft, Apple
  - Spotify, LinkedIn, Discord, GitHub
- Features:
  - Checkbox selection for services
  - Individual password fields for each service
  - One-click generalized password application
  - Password visibility toggle
  - Strong password generator
  - Local data persistence
  - Export/Import functionality

## Files Structure

```
/workspaces/login/
├── index.html              # Main dashboard
├── email-reader.html       # IMAP email client interface
├── account-overview.html   # Password management interface
├── styles.css             # Comprehensive styling
├── email-reader.js        # Email reader functionality
├── account-overview.js    # Password manager functionality
└── README.md              # This file
```

## Usage

1. **Start with the main dashboard** (`index.html`)
2. **Email Reader**: 
   - Enter IMAP credentials
   - Use "Simulate Email Loading" for demo purposes
   - View email analysis features
3. **Account Overview**:
   - Fill in personal information
   - Select services you want to manage
   - Use generalized password feature for quick setup
   - Save/load data as needed

## Security Notes

⚠️ **Important Security Considerations**:

- This is a demonstration interface designed for local development/testing
- Data is stored in browser localStorage (not secure for production)
- For production use, implement:
  - Proper encryption for password storage
  - Secure backend authentication
  - HTTPS connections
  - Regular security audits

## IMAP Email Reading

The email reader interface demonstrates how IMAP email reading would work. Due to browser security restrictions (CORS), direct IMAP connections from browsers are not possible. For full functionality, you would need:

1. A backend server (Node.js, Python, etc.)
2. Server-side IMAP connection handling
3. API endpoints to serve email data to the frontend
4. Proper authentication and security measures

## Browser Compatibility

- Modern browsers with JavaScript enabled
- Responsive design for mobile and desktop
- Local storage support required for data persistence

## Getting Started

1. Open `index.html` in a web browser
2. Navigate through the interface
3. Use demo features to explore functionality
4. Consider implementing backend services for production use

## Future Enhancements

- Server-side IMAP implementation
- Enhanced security features
- Database integration
- Multi-user support
- Advanced email analysis
- Password strength validation
- Two-factor authentication support