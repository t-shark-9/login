// Email Reader JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const imapForm = document.getElementById('imapForm');
    const emailDisplay = document.getElementById('emailDisplay');
    const emailList = document.getElementById('emailList');
    const emailAnalysis = document.getElementById('emailAnalysis');

    imapForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(imapForm);
        const email = formData.get('email');
        const password = formData.get('password');
        const server = formData.get('imapServer');
        const port = formData.get('imapPort');

        // Show loading message
        emailList.innerHTML = '<div style="text-align: center; padding: 20px;">Connecting to email server...</div>';
        emailDisplay.style.display = 'block';

        // Simulate connection (in real implementation, this would make an API call to your backend)
        setTimeout(() => {
            emailList.innerHTML = '<div style="text-align: center; padding: 20px; color: #ff6b6b;">⚠️ Cannot connect directly from browser. Server-side implementation required.</div>';
        }, 2000);
    });
});

function simulateEmailLoad() {
    const emailList = document.getElementById('emailList');
    const emailDisplay = document.getElementById('emailDisplay');
    
    // Sample email data for demonstration
    const sampleEmails = [
        {
            subject: "Welcome to GitHub Copilot",
            from: "github@github.com",
            date: "2025-08-16 10:30",
            preview: "Thank you for trying GitHub Copilot..."
        },
        {
            subject: "Monthly Newsletter - Tech Updates",
            from: "newsletter@techcorp.com",
            date: "2025-08-16 09:15",
            preview: "Here are the latest technology trends..."
        },
        {
            subject: "Account Security Alert",
            from: "security@yourdomain.com",
            date: "2025-08-16 08:45",
            preview: "We noticed a new login to your account..."
        },
        {
            subject: "Project Update - Login System",
            from: "project@company.com",
            date: "2025-08-15 16:20",
            preview: "The login system project has been updated..."
        },
        {
            subject: "Password Reset Request",
            from: "noreply@service.com",
            date: "2025-08-15 14:10",
            preview: "You requested to reset your password..."
        }
    ];

    emailDisplay.style.display = 'block';
    emailList.innerHTML = '';

    sampleEmails.forEach((email, index) => {
        const emailItem = document.createElement('div');
        emailItem.className = 'email-item';
        emailItem.onclick = () => showEmailDetails(email);
        
        emailItem.innerHTML = `
            <div class="email-subject">${email.subject}</div>
            <div class="email-from">From: ${email.from}</div>
            <div class="email-date">${email.date}</div>
            <div style="margin-top: 5px; color: #666; font-size: 0.9rem;">${email.preview}</div>
        `;
        
        emailList.appendChild(emailItem);
    });
}

function showEmailDetails(email) {
    alert(`Email Details:\n\nSubject: ${email.subject}\nFrom: ${email.from}\nDate: ${email.date}\n\nPreview: ${email.preview}\n\n(In a full implementation, this would show the complete email content)`);
}

function refreshEmails() {
    const emailList = document.getElementById('emailList');
    emailList.innerHTML = '<div style="text-align: center; padding: 20px;">Refreshing emails...</div>';
    
    setTimeout(() => {
        simulateEmailLoad();
    }, 1000);
}

function showAnalysis() {
    const emailAnalysis = document.getElementById('emailAnalysis');
    const analysisResults = document.getElementById('analysisResults');
    
    emailAnalysis.style.display = 'block';
    
    // Simulate analysis data
    document.getElementById('emailCount').textContent = 'Total emails: 147';
    document.getElementById('unreadCount').textContent = 'Unread emails: 12';
    
    document.getElementById('topSenders').innerHTML = `
        <div style="margin: 10px 0;">
            <strong>github@github.com:</strong> 15 emails
        </div>
        <div style="margin: 10px 0;">
            <strong>newsletter@techcorp.com:</strong> 12 emails
        </div>
        <div style="margin: 10px 0;">
            <strong>security@yourdomain.com:</strong> 8 emails
        </div>
    `;
    
    document.getElementById('emailFrequency').innerHTML = `
        <div style="margin: 10px 0;">
            <strong>This week:</strong> 23 emails
        </div>
        <div style="margin: 10px 0;">
            <strong>This month:</strong> 89 emails
        </div>
        <div style="margin: 10px 0;">
            <strong>Average per day:</strong> 3.2 emails
        </div>
    `;
}

// Additional analysis functions that could be implemented
function analyzeEmailPatterns() {
    // Analyze email sending patterns, frequency, etc.
    return {
        peakHours: "9:00 AM - 11:00 AM",
        mostActiveDay: "Tuesday",
        averageResponseTime: "2.5 hours"
    };
}

function categorizeEmails() {
    // Categorize emails by type (work, personal, promotions, etc.)
    return {
        work: 65,
        personal: 20,
        promotions: 10,
        social: 5
    };
}

function detectSpam() {
    // Simple spam detection based on common patterns
    return {
        spamCount: 3,
        spamPercentage: 2.1,
        suspiciousEmails: ["suspicious@fake-bank.com", "winner@lottery-scam.com"]
    };
}
