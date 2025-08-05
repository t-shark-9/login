# Email Reader Website with IMAP Integration

A modern, responsive email client web application that connects to your actual email account via IMAP to read, organize, and manage your real emails.

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure your email credentials:**
   ```bash
   cp .env.example .env
   # Edit .env with your email settings
   ```

3. **Start the server:**
   ```bash
   npm start
   ```

4. **Open your browser:**
   ```
   http://localhost:3000
   ```

## ⚙️ Email Setup

### Gmail Setup (Recommended)

1. **Enable 2-Factor Authentication** on your Google account
2. **Generate an App Password:**
   - Go to [Google Account Settings](https://myaccount.google.com/)
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
3. **Update your `.env` file:**
   ```env
   IMAP_HOST=imap.gmail.com
   IMAP_PORT=993
   IMAP_SECURE=true
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   ```

### Other Email Providers

See [SETUP.md](SETUP.md) for detailed configuration instructions for Outlook, Yahoo, and other providers.

## 📧 Features

### 🔗 Real IMAP Integration
- **Live Email Connection**: Connects to your actual email account
- **Real-time Sync**: Fetches your latest emails from the server
- **Multiple Folders**: Access Inbox, Sent, Drafts, Trash, and Spam
- **Mark as Read**: Automatically updates read status on the server

### 🎨 Modern Interface
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Clean Layout**: Professional three-pane email client interface
- **Unread Indicators**: Visual cues for unread emails with counts
- **Loading States**: Smooth loading animations and error handling

### ⚡ Advanced Features
- **HTML Email Support**: Renders rich HTML emails properly
- **Attachment Detection**: Shows attachments (listing only, no download yet)
- **Email Preview**: Quick preview without opening the full email
- **Batch Operations**: Select multiple emails for marking as read
- **Connection Testing**: Built-in IMAP connection testing

## 📁 File Structure

```
/workspaces/login/
├── server.js           # Node.js IMAP server backend
├── package.json        # Dependencies and scripts
├── index.html          # Frontend email interface
├── styles.css          # Modern responsive styling
├── script.js           # Frontend JavaScript with IMAP API calls
├── .env.example        # Environment configuration template
├── SETUP.md           # Detailed setup instructions
└── README.md          # This documentation
```

## 🛠️ Technical Stack

- **Backend**: Node.js with Express
- **Email**: IMAP protocol with `imap` and `mailparser` libraries
- **Frontend**: Vanilla HTML, CSS, JavaScript
- **Styling**: Modern CSS with Flexbox/Grid
- **Icons**: Font Awesome 6

## 🔒 Security Features

- **App Passwords**: Uses secure app-specific passwords
- **TLS Encryption**: All IMAP connections are encrypted
- **Environment Variables**: Credentials stored securely in `.env`
- **CORS Protection**: Configured for local development
- **Input Validation**: Server-side validation for all inputs

## 📱 Responsive Design

- **Mobile-first**: Optimized for touch interfaces
- **Tablet Support**: Adapted layout for medium screens  
- **Desktop Experience**: Full three-pane layout for large screens
- **Touch-friendly**: Large touch targets and smooth interactions

## 🚨 Current Limitations

- **Read-only Mode**: Email sending not yet implemented
- **No Deletion**: Safety feature to prevent accidental email loss
- **No Attachment Downloads**: Attachments are detected but not downloadable
- **Single Account**: Only one email account at a time

## 🔧 Development

### Development Mode with Auto-restart:
```bash
npm run dev
```

### Testing IMAP Connection:
Visit `http://localhost:3000/api/test-connection` or use the "Test Connection" button in the UI.

### API Endpoints:
- `GET /api/emails/:folder` - Get emails from folder
- `GET /api/email/:uid` - Get email content
- `POST /api/email/:uid/read` - Mark as read
- `GET /api/test-connection` - Test IMAP

## 🔄 Migration from Sample Data

This email reader has been upgraded from using sample data to real IMAP integration. The interface remains the same, but now connects to your actual email account for a real email reading experience.

## 🚀 Deployment

For production deployment:

1. **Use HTTPS**: Never send credentials over HTTP
2. **Environment Variables**: Use secure credential storage
3. **Firewall Configuration**: Ensure IMAP ports are accessible
4. **Rate Limiting**: Consider implementing request rate limits

## 📋 Future Enhancements

- [ ] 📤 Email sending via SMTP
- [ ] 🗑️ Email deletion and moving between folders
- [ ] 📎 Attachment downloads
- [ ] 🔍 Email search functionality
- [ ] 📱 Push notifications
- [ ] 👥 Multiple account support
- [ ] 🌙 Dark mode theme
- [ ] 📊 Email analytics
- [ ] 🔔 Desktop notifications
- [ ] ⚡ Offline caching

## 🆘 Troubleshooting

### Common Issues:

1. **"Invalid credentials"**
   - Check your email and app password
   - Ensure 2FA is enabled and you're using an app password

2. **"Connection timeout"**
   - Verify IMAP host and port settings
   - Check firewall and network connectivity

3. **"No emails loading"**
   - Click "Test Connection" to verify IMAP setup
   - Check browser console for error messages

4. **Gmail not working**
   - Enable IMAP in Gmail settings
   - Use App Password, not regular password
   - Ensure "Less secure app access" is disabled

For detailed troubleshooting, see [SETUP.md](SETUP.md).

## 📄 License

This project is open source and available under the MIT License.