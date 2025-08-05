# IMAP Email Reader Setup Guide

## Prerequisites

1. **Node.js** (version 14 or higher)
2. **An email account with IMAP enabled** (Gmail, Outlook, etc.)
3. **App-specific password** (for Gmail and most modern email providers)

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create environment configuration:**
   ```bash
   cp .env.example .env
   ```

3. **Edit the `.env` file** with your email credentials:
   ```env
   # Email Configuration
   IMAP_HOST=imap.gmail.com
   IMAP_PORT=993
   IMAP_SECURE=true
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password

   # Server Configuration
   PORT=3000
   ```

## Email Provider Settings

### Gmail Setup

1. **Enable 2-Factor Authentication** on your Google account
2. **Generate an App Password:**
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
   - Use this password in your `.env` file

3. **Gmail IMAP Settings:**
   ```env
   IMAP_HOST=imap.gmail.com
   IMAP_PORT=993
   IMAP_SECURE=true
   ```

### Outlook/Hotmail Setup

1. **Enable IMAP** in Outlook settings
2. **Use your regular password** or app password

3. **Outlook IMAP Settings:**
   ```env
   IMAP_HOST=outlook.office365.com
   IMAP_PORT=993
   IMAP_SECURE=true
   ```

### Yahoo Mail Setup

1. **Enable IMAP** in Yahoo Mail settings
2. **Generate an App Password**

3. **Yahoo IMAP Settings:**
   ```env
   IMAP_HOST=imap.mail.yahoo.com
   IMAP_PORT=993
   IMAP_SECURE=true
   ```

## Running the Application

1. **Start the server:**
   ```bash
   npm start
   ```

2. **Open your browser** and go to:
   ```
   http://localhost:3000
   ```

3. **Test the connection** by clicking the "Test Connection" button if emails don't load

## Features

- ✅ **Real IMAP Integration** - Connects to your actual email account
- ✅ **Multiple Folders** - Inbox, Sent, Drafts, Trash, Spam
- ✅ **Email Reading** - Full email content with HTML support
- ✅ **Mark as Read** - Automatically mark emails as read when opened
- ✅ **Responsive Design** - Works on desktop and mobile
- ✅ **Real-time Counts** - Shows unread email counts

## Troubleshooting

### Connection Issues

1. **Check your credentials** in the `.env` file
2. **Verify IMAP is enabled** on your email account
3. **Use app-specific passwords** for Gmail and modern email providers
4. **Check firewall settings** - ensure port 993 is not blocked

### Common Error Messages

- **"Invalid credentials"** - Check username/password
- **"Connection timeout"** - Check IMAP host and port
- **"IMAP not enabled"** - Enable IMAP in your email settings

### Gmail Specific Issues

- **"Less secure app access"** - Use App Passwords instead
- **"IMAP disabled"** - Enable IMAP in Gmail settings
- **"Authentication failed"** - Generate a new App Password

## Development Mode

For development with auto-restart:

```bash
npm run dev
```

## Security Notes

- ⚠️ **Never commit your `.env` file** - it contains sensitive credentials
- ⚠️ **Use app-specific passwords** - don't use your main account password
- ⚠️ **Enable 2FA** on your email account for additional security
- ⚠️ **Use HTTPS in production** - never send credentials over HTTP

## API Endpoints

The application provides these REST API endpoints:

- `GET /api/emails/:folder` - Get emails from a folder
- `GET /api/email/:uid` - Get email content by UID
- `POST /api/email/:uid/read` - Mark email as read
- `GET /api/test-connection` - Test IMAP connection

## Limitations

- **No email sending** - Currently read-only (compose feature is disabled)
- **No email deletion** - Safety feature to prevent accidental loss
- **Limited folder support** - Standard IMAP folders only
- **No attachment downloads** - Attachments are listed but not downloadable

## Future Enhancements

- [ ] Email sending via SMTP
- [ ] Email deletion and moving
- [ ] Attachment downloads
- [ ] Search functionality
- [ ] Email filters
- [ ] Multiple account support
- [ ] Push notifications
- [ ] Offline caching
