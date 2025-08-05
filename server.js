const express = require('express');
const Imap = require('imap');
const { simpleParser } = require('mailparser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// IMAP Configuration
const imapConfig = {
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD,
    host: process.env.IMAP_HOST || 'imap.gmail.com',
    port: parseInt(process.env.IMAP_PORT) || 993,
    tls: process.env.IMAP_SECURE === 'true',
    authTimeout: 3000,
    connTimeout: 60000,
    keepalive: true,
    tlsOptions: { rejectUnauthorized: false }
};

// Utility function to create IMAP connection
function createImapConnection() {
    return new Promise((resolve, reject) => {
        const imap = new Imap(imapConfig);
        
        imap.once('ready', () => {
            resolve(imap);
        });
        
        imap.once('error', (err) => {
            reject(err);
        });
        
        imap.connect();
    });
}

// Function to fetch emails from a specific folder
async function fetchEmails(folderName = 'INBOX', limit = 50) {
    return new Promise(async (resolve, reject) => {
        try {
            const imap = await createImapConnection();
            
            imap.openBox(folderName, true, (err, box) => {
                if (err) {
                    imap.end();
                    return reject(err);
                }
                
                if (box.messages.total === 0) {
                    imap.end();
                    return resolve([]);
                }
                
                const emails = [];
                const start = Math.max(1, box.messages.total - limit + 1);
                const end = box.messages.total;
                
                const fetch = imap.seq.fetch(`${start}:${end}`, {
                    bodies: 'HEADER.FIELDS (FROM TO SUBJECT DATE)',
                    struct: true
                });
                
                fetch.on('message', (msg, seqno) => {
                    let email = { seqno };
                    
                    msg.on('body', (stream, info) => {
                        let buffer = '';
                        stream.on('data', chunk => buffer += chunk.toString('utf8'));
                        stream.once('end', () => {
                            const parsed = Imap.parseHeader(buffer);
                            email.from = parsed.from ? parsed.from[0] : '';
                            email.to = parsed.to ? parsed.to[0] : '';
                            email.subject = parsed.subject ? parsed.subject[0] : '';
                            email.date = parsed.date ? new Date(parsed.date[0]) : new Date();
                        });
                    });
                    
                    msg.once('attributes', attrs => {
                        email.uid = attrs.uid;
                        email.flags = attrs.flags;
                        email.unread = !attrs.flags.includes('\\Seen');
                    });
                    
                    msg.once('end', () => {
                        emails.push(email);
                    });
                });
                
                fetch.once('error', err => {
                    imap.end();
                    reject(err);
                });
                
                fetch.once('end', () => {
                    imap.end();
                    // Sort by date (newest first)
                    emails.sort((a, b) => new Date(b.date) - new Date(a.date));
                    resolve(emails);
                });
            });
        } catch (error) {
            reject(error);
        }
    });
}

// Function to fetch email body by UID
async function fetchEmailBody(uid, folderName = 'INBOX') {
    return new Promise(async (resolve, reject) => {
        try {
            const imap = await createImapConnection();
            
            imap.openBox(folderName, true, (err, box) => {
                if (err) {
                    imap.end();
                    return reject(err);
                }
                
                const fetch = imap.fetch(uid, { bodies: '' });
                
                fetch.on('message', (msg) => {
                    msg.on('body', (stream) => {
                        simpleParser(stream, (err, parsed) => {
                            imap.end();
                            if (err) return reject(err);
                            resolve({
                                text: parsed.text,
                                html: parsed.html,
                                attachments: parsed.attachments || []
                            });
                        });
                    });
                });
                
                fetch.once('error', err => {
                    imap.end();
                    reject(err);
                });
            });
        } catch (error) {
            reject(error);
        }
    });
}

// Function to mark email as read
async function markAsRead(uid, folderName = 'INBOX') {
    return new Promise(async (resolve, reject) => {
        try {
            const imap = await createImapConnection();
            
            imap.openBox(folderName, false, (err, box) => {
                if (err) {
                    imap.end();
                    return reject(err);
                }
                
                imap.addFlags(uid, '\\Seen', (err) => {
                    imap.end();
                    if (err) return reject(err);
                    resolve({ success: true });
                });
            });
        } catch (error) {
            reject(error);
        }
    });
}

// API Routes

// Get list of emails from a folder
app.get('/api/emails/:folder?', async (req, res) => {
    try {
        const folder = req.params.folder || 'INBOX';
        const limit = parseInt(req.query.limit) || 50;
        
        // Map frontend folder names to IMAP folder names
        const folderMap = {
            'inbox': 'INBOX',
            'sent': '[Gmail]/Sent Mail',
            'drafts': '[Gmail]/Drafts',
            'trash': '[Gmail]/Trash',
            'spam': '[Gmail]/Spam'
        };
        
        const imapFolder = folderMap[folder.toLowerCase()] || 'INBOX';
        const emails = await fetchEmails(imapFolder, limit);
        
        // Format emails for frontend
        const formattedEmails = emails.map((email, index) => ({
            id: email.uid,
            sender: email.from.replace(/[<>]/g, ''),
            subject: email.subject || '(No Subject)',
            preview: '', // Will be loaded when email is selected
            time: formatDate(email.date),
            unread: email.unread,
            uid: email.uid
        }));
        
        res.json(formattedEmails);
    } catch (error) {
        console.error('Error fetching emails:', error);
        res.status(500).json({ error: 'Failed to fetch emails', details: error.message });
    }
});

// Get email content by UID
app.get('/api/email/:uid', async (req, res) => {
    try {
        const uid = req.params.uid;
        const folder = req.query.folder || 'INBOX';
        
        const folderMap = {
            'inbox': 'INBOX',
            'sent': '[Gmail]/Sent Mail',
            'drafts': '[Gmail]/Drafts',
            'trash': '[Gmail]/Trash',
            'spam': '[Gmail]/Spam'
        };
        
        const imapFolder = folderMap[folder.toLowerCase()] || 'INBOX';
        const emailBody = await fetchEmailBody(uid, imapFolder);
        
        res.json({
            content: emailBody.text || emailBody.html || 'No content available',
            html: emailBody.html,
            attachments: emailBody.attachments
        });
    } catch (error) {
        console.error('Error fetching email body:', error);
        res.status(500).json({ error: 'Failed to fetch email content', details: error.message });
    }
});

// Mark email as read
app.post('/api/email/:uid/read', async (req, res) => {
    try {
        const uid = req.params.uid;
        const folder = req.body.folder || 'INBOX';
        
        const folderMap = {
            'inbox': 'INBOX',
            'sent': '[Gmail]/Sent Mail',
            'drafts': '[Gmail]/Drafts',
            'trash': '[Gmail]/Trash',
            'spam': '[Gmail]/Spam'
        };
        
        const imapFolder = folderMap[folder.toLowerCase()] || 'INBOX';
        await markAsRead(uid, imapFolder);
        
        res.json({ success: true });
    } catch (error) {
        console.error('Error marking email as read:', error);
        res.status(500).json({ error: 'Failed to mark email as read', details: error.message });
    }
});

// Test IMAP connection
app.get('/api/test-connection', async (req, res) => {
    try {
        const imap = await createImapConnection();
        imap.end();
        res.json({ success: true, message: 'IMAP connection successful' });
    } catch (error) {
        console.error('IMAP connection test failed:', error);
        res.status(500).json({ 
            success: false, 
            error: 'IMAP connection failed', 
            details: error.message 
        });
    }
});

// Utility function to format date
function formatDate(date) {
    const now = new Date();
    const emailDate = new Date(date);
    const diffInHours = Math.floor((now - emailDate) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
        return 'Just now';
    } else if (diffInHours < 24) {
        return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
    } else {
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7) {
            return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
        } else {
            return emailDate.toLocaleDateString();
        }
    }
}

// Serve the frontend
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Start server
app.listen(PORT, () => {
    console.log(`Email reader server running on http://localhost:${PORT}`);
    console.log('Make sure to configure your .env file with IMAP credentials');
});

module.exports = app;
