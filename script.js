// Sample email data
const emailData = {
    inbox: [
        {
            id: 1,
            sender: "John Doe",
            subject: "Project Update",
            preview: "Hey team, I wanted to give you an update on the current project status. We've made significant progress this week...",
            content: "Hey team,\n\nI wanted to give you an update on the current project status. We've made significant progress this week and I'm excited to share some of the milestones we've achieved.\n\nKey accomplishments:\n- Completed the user authentication module\n- Finished the database design\n- Started working on the frontend components\n\nNext steps:\n- Implement the API endpoints\n- Create the user dashboard\n- Set up testing framework\n\nLet me know if you have any questions!\n\nBest regards,\nJohn",
            time: "2 hours ago",
            unread: true
        },
        {
            id: 2,
            sender: "Sarah Johnson",
            subject: "Meeting Reminder",
            preview: "Don't forget about our team meeting tomorrow at 2 PM. We'll be discussing the quarterly goals and upcoming deadlines...",
            content: "Hi everyone,\n\nDon't forget about our team meeting tomorrow at 2 PM in Conference Room B. We'll be discussing:\n\n1. Quarterly goals review\n2. Upcoming project deadlines\n3. Resource allocation\n4. Q&A session\n\nPlease come prepared with your progress reports and any questions you might have.\n\nSee you tomorrow!\n\nSarah",
            time: "5 hours ago",
            unread: true
        },
        {
            id: 3,
            sender: "IT Support",
            subject: "System Maintenance Notice",
            preview: "Scheduled system maintenance will occur this weekend. Please save all your work and log out by Friday 6 PM...",
            content: "Dear Users,\n\nThis is to inform you that scheduled system maintenance will occur this weekend from Saturday 8 PM to Sunday 6 AM.\n\nDuring this time:\n- All systems will be unavailable\n- No access to email or internal tools\n- Please save all work and log out by Friday 6 PM\n\nWe apologize for any inconvenience and appreciate your cooperation.\n\nIT Support Team",
            time: "1 day ago",
            unread: false
        },
        {
            id: 4,
            sender: "Marketing Team",
            subject: "New Campaign Launch",
            preview: "We're excited to announce the launch of our new marketing campaign! The creative team has been working hard...",
            content: "Hello Everyone,\n\nWe're excited to announce the launch of our new marketing campaign 'Innovation Forward'!\n\nThe creative team has been working hard on this for the past month, and we're thrilled with the results. The campaign will focus on:\n\n- Brand awareness\n- Product innovation messaging\n- Customer engagement\n- Market expansion\n\nLaunch date: Next Monday\nChannels: Social media, email, and web\n\nLet's make this a success!\n\nMarketing Team",
            time: "2 days ago",
            unread: false
        },
        {
            id: 5,
            sender: "HR Department",
            subject: "Employee Benefits Update",
            preview: "Important updates to our employee benefits package. Please review the attached documents for details...",
            content: "Dear Team,\n\nWe have important updates to our employee benefits package effective next month:\n\n1. Enhanced health insurance coverage\n2. Increased vacation days\n3. New professional development budget\n4. Flexible work arrangements\n5. Wellness program expansion\n\nPlease schedule a meeting with HR if you have questions about these changes.\n\nThank you,\nHR Department",
            time: "3 days ago",
            unread: true
        }
    ],
    sent: [
        {
            id: 101,
            sender: "You",
            subject: "Re: Project Timeline",
            preview: "Thanks for the update. I've reviewed the timeline and it looks good...",
            content: "Hi Team,\n\nThanks for the update. I've reviewed the timeline and it looks good to me.\n\nI have a few suggestions:\n- Consider adding buffer time for testing\n- Schedule regular check-ins\n- Prepare backup plans for critical tasks\n\nLet me know what you think.\n\nBest,\nYou",
            time: "1 hour ago",
            unread: false
        }
    ],
    drafts: [
        {
            id: 201,
            sender: "You",
            subject: "Draft: Quarterly Report",
            preview: "Working on the quarterly report. Need to add more details about performance metrics...",
            content: "Draft content for quarterly report...\n\n[This is a draft email that hasn't been sent yet]",
            time: "30 minutes ago",
            unread: false
        },
        {
            id: 202,
            sender: "You",
            subject: "Draft: Vacation Request",
            preview: "Planning to submit vacation request for next month...",
            content: "Dear Manager,\n\nI would like to request vacation time for...\n\n[Draft not completed]",
            time: "2 hours ago",
            unread: false
        }
    ],
    trash: [],
    spam: []
};

let currentFolder = 'inbox';
let selectedEmails = new Set();
let currentEmail = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadEmails(currentFolder);
    
    // Setup compose form
    document.getElementById('compose-form').addEventListener('submit', function(e) {
        e.preventDefault();
        sendEmail();
    });
});

// Load emails for a specific folder
function loadEmails(folder) {
    currentFolder = folder;
    const emailItems = document.getElementById('email-items');
    const folderTitle = document.getElementById('folder-title');
    
    // Update folder title
    folderTitle.textContent = folder.charAt(0).toUpperCase() + folder.slice(1);
    
    // Update active nav item
    document.querySelectorAll('.nav-menu li').forEach(li => li.classList.remove('active'));
    event?.target.classList.add('active');
    
    // Show loading
    emailItems.innerHTML = '<div class="loading">Loading emails...</div>';
    
    // Simulate loading delay
    setTimeout(() => {
        const emails = emailData[folder] || [];
        emailItems.innerHTML = '';
        
        if (emails.length === 0) {
            emailItems.innerHTML = '<div style="padding: 2rem; text-align: center; color: #666;">No emails in this folder</div>';
            return;
        }
        
        emails.forEach(email => {
            const emailElement = createEmailElement(email);
            emailItems.appendChild(emailElement);
        });
    }, 500);
}

// Create email list item element
function createEmailElement(email) {
    const div = document.createElement('div');
    div.className = `email-item ${email.unread ? 'unread' : ''}`;
    div.onclick = () => selectEmail(email, div);
    
    div.innerHTML = `
        <input type="checkbox" class="email-checkbox" onclick="event.stopPropagation(); toggleEmailSelection(${email.id}, this)">
        <div class="email-sender">${email.sender}</div>
        <div class="email-preview-subject">${email.subject}</div>
        <div class="email-preview">${email.preview}</div>
        <div class="email-time">${email.time}</div>
    `;
    
    return div;
}

// Select and display email
function selectEmail(email, element) {
    // Update visual selection
    document.querySelectorAll('.email-item').forEach(item => item.classList.remove('selected'));
    element.classList.add('selected');
    
    // Mark as read
    element.classList.remove('unread');
    if (emailData[currentFolder]) {
        const emailIndex = emailData[currentFolder].findIndex(e => e.id === email.id);
        if (emailIndex !== -1) {
            emailData[currentFolder][emailIndex].unread = false;
        }
    }
    
    currentEmail = email;
    displayEmailContent(email);
}

// Display email content
function displayEmailContent(email) {
    const subjectElement = document.getElementById('email-subject');
    const bodyElement = document.getElementById('email-body');
    
    subjectElement.textContent = email.subject;
    
    bodyElement.innerHTML = `
        <div class="email-header">
            <div class="email-meta">
                <strong>From:</strong> <span>${email.sender}</span>
                <strong>Subject:</strong> <span>${email.subject}</span>
                <strong>Date:</strong> <span>${email.time}</span>
            </div>
        </div>
        <div class="email-message">${email.content}</div>
    `;
}

// Folder navigation
function showFolder(folder) {
    loadEmails(folder);
    
    // Update active sidebar item
    document.querySelectorAll('.nav-menu li').forEach(li => li.classList.remove('active'));
    event.target.classList.add('active');
}

// Email selection functions
function toggleEmailSelection(emailId, checkbox) {
    if (checkbox.checked) {
        selectedEmails.add(emailId);
    } else {
        selectedEmails.delete(emailId);
    }
}

function selectAllEmails() {
    const checkboxes = document.querySelectorAll('.email-checkbox');
    const allChecked = Array.from(checkboxes).every(cb => cb.checked);
    
    checkboxes.forEach(checkbox => {
        checkbox.checked = !allChecked;
        const emailId = parseInt(checkbox.onclick.toString().match(/\d+/)[0]);
        if (!allChecked) {
            selectedEmails.add(emailId);
        } else {
            selectedEmails.delete(emailId);
        }
    });
}

function deleteSelected() {
    if (selectedEmails.size === 0) {
        alert('Please select emails to delete');
        return;
    }
    
    if (confirm(`Delete ${selectedEmails.size} selected email(s)?`)) {
        // Move to trash
        selectedEmails.forEach(emailId => {
            const emailIndex = emailData[currentFolder].findIndex(e => e.id === emailId);
            if (emailIndex !== -1) {
                const email = emailData[currentFolder].splice(emailIndex, 1)[0];
                emailData.trash.push(email);
            }
        });
        
        selectedEmails.clear();
        loadEmails(currentFolder);
        
        // Clear email content if current email was deleted
        if (currentEmail && selectedEmails.has(currentEmail.id)) {
            document.getElementById('email-subject').textContent = 'Select an email to read';
            document.getElementById('email-body').innerHTML = `
                <div class="welcome-message">
                    <i class="fas fa-envelope-open-text fa-3x"></i>
                    <h3>Welcome to Email Reader</h3>
                    <p>Select an email from the list to start reading.</p>
                </div>
            `;
            currentEmail = null;
        }
    }
}

function markAsRead() {
    if (selectedEmails.size === 0) {
        alert('Please select emails to mark as read');
        return;
    }
    
    selectedEmails.forEach(emailId => {
        const emailIndex = emailData[currentFolder].findIndex(e => e.id === emailId);
        if (emailIndex !== -1) {
            emailData[currentFolder][emailIndex].unread = false;
        }
    });
    
    selectedEmails.clear();
    loadEmails(currentFolder);
}

// Email actions
function replyEmail() {
    if (!currentEmail) {
        alert('Please select an email to reply to');
        return;
    }
    
    const modal = document.getElementById('compose-modal');
    const toField = document.getElementById('to');
    const subjectField = document.getElementById('subject');
    const messageField = document.getElementById('message');
    
    toField.value = currentEmail.sender;
    subjectField.value = `Re: ${currentEmail.subject}`;
    messageField.value = `\n\n--- Original Message ---\nFrom: ${currentEmail.sender}\nSubject: ${currentEmail.subject}\n\n${currentEmail.content}`;
    
    modal.style.display = 'block';
}

function forwardEmail() {
    if (!currentEmail) {
        alert('Please select an email to forward');
        return;
    }
    
    const modal = document.getElementById('compose-modal');
    const subjectField = document.getElementById('subject');
    const messageField = document.getElementById('message');
    
    subjectField.value = `Fwd: ${currentEmail.subject}`;
    messageField.value = `\n\n--- Forwarded Message ---\nFrom: ${currentEmail.sender}\nSubject: ${currentEmail.subject}\n\n${currentEmail.content}`;
    
    modal.style.display = 'block';
}

function deleteCurrentEmail() {
    if (!currentEmail) {
        alert('Please select an email to delete');
        return;
    }
    
    if (confirm('Delete this email?')) {
        const emailIndex = emailData[currentFolder].findIndex(e => e.id === currentEmail.id);
        if (emailIndex !== -1) {
            const email = emailData[currentFolder].splice(emailIndex, 1)[0];
            emailData.trash.push(email);
        }
        
        loadEmails(currentFolder);
        
        // Clear email content
        document.getElementById('email-subject').textContent = 'Select an email to read';
        document.getElementById('email-body').innerHTML = `
            <div class="welcome-message">
                <i class="fas fa-envelope-open-text fa-3x"></i>
                <h3>Welcome to Email Reader</h3>
                <p>Select an email from the list to start reading.</p>
            </div>
        `;
        currentEmail = null;
    }
}

// Compose email functions
function composeEmail() {
    const modal = document.getElementById('compose-modal');
    
    // Clear form
    document.getElementById('compose-form').reset();
    
    modal.style.display = 'block';
}

function closeComposeModal() {
    document.getElementById('compose-modal').style.display = 'none';
}

function sendEmail() {
    const to = document.getElementById('to').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    
    // Create new email object
    const newEmail = {
        id: Date.now(),
        sender: 'You',
        subject: subject,
        preview: message.substring(0, 100) + '...',
        content: message,
        time: 'Just now',
        unread: false
    };
    
    // Add to sent folder
    emailData.sent.unshift(newEmail);
    
    // Close modal
    closeComposeModal();
    
    // Show success message
    alert('Email sent successfully!');
}

function refreshEmails() {
    loadEmails(currentFolder);
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('compose-modal');
    if (event.target === modal) {
        closeComposeModal();
    }
}
