// Email data cache
let emailCache = {};
const API_BASE = window.location.origin + '/api';

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
async function loadEmails(folder) {
    currentFolder = folder;
    const emailItems = document.getElementById('email-items');
    const folderTitle = document.getElementById('folder-title');
    
    // Update folder title
    folderTitle.textContent = folder.charAt(0).toUpperCase() + folder.slice(1);
    
    // Update active nav item
    document.querySelectorAll('.nav-menu li').forEach(li => li.classList.remove('active'));
    if (event?.target) {
        event.target.classList.add('active');
    }
    
    // Show loading
    emailItems.innerHTML = '<div class="loading">Loading emails...</div>';
    
    try {
        const response = await fetch(`${API_BASE}/emails/${folder}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const emails = await response.json();
        emailCache[folder] = emails;
        
        emailItems.innerHTML = '';
        
        if (emails.length === 0) {
            emailItems.innerHTML = '<div style="padding: 2rem; text-align: center; color: #666;">No emails in this folder</div>';
            return;
        }
        
        emails.forEach(email => {
            const emailElement = createEmailElement(email);
            emailItems.appendChild(emailElement);
        });
        
        // Update folder counts
        updateFolderCounts();
        
    } catch (error) {
        console.error('Error loading emails:', error);
        emailItems.innerHTML = `
            <div style="padding: 2rem; text-align: center; color: #e74c3c;">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Failed to load emails</p>
                <p style="font-size: 0.8rem; color: #666;">${error.message}</p>
                <button onclick="testConnection()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer;">Test Connection</button>
            </div>
        `;
    }
}

// Create email list item element
function createEmailElement(email) {
    const div = document.createElement('div');
    div.className = `email-item ${email.unread ? 'unread' : ''}`;
    div.onclick = () => selectEmail(email, div);
    
    div.innerHTML = `
        <input type="checkbox" class="email-checkbox" onclick="event.stopPropagation(); toggleEmailSelection('${email.uid}', this)">
        <div class="email-sender">${email.sender}</div>
        <div class="email-preview-subject">${email.subject}</div>
        <div class="email-preview">${email.preview || 'No preview available'}</div>
        <div class="email-time">${email.time}</div>
    `;
    
    return div;
}

// Update folder counts based on unread emails
function updateFolderCounts() {
    const folders = ['inbox', 'sent', 'drafts', 'trash', 'spam'];
    
    folders.forEach(folder => {
        const emails = emailCache[folder] || [];
        const unreadCount = emails.filter(email => email.unread).length;
        
        // Find the nav item and update count
        const navItems = document.querySelectorAll('.nav-menu li');
        navItems.forEach(item => {
            if (item.onclick && item.onclick.toString().includes(`'${folder}'`)) {
                const countSpan = item.querySelector('.count');
                if (unreadCount > 0) {
                    if (countSpan) {
                        countSpan.textContent = unreadCount;
                        countSpan.style.display = 'inline';
                    } else {
                        const newCountSpan = document.createElement('span');
                        newCountSpan.className = 'count';
                        newCountSpan.textContent = unreadCount;
                        item.appendChild(newCountSpan);
                    }
                } else if (countSpan) {
                    countSpan.style.display = 'none';
                }
            }
        });
    });
}

// Test connection function
async function testConnection() {
    try {
        const response = await fetch(`${API_BASE}/test-connection`);
        const result = await response.json();
        
        if (result.success) {
            alert('IMAP connection successful!');
        } else {
            alert(`Connection failed: ${result.details}`);
        }
    } catch (error) {
        alert(`Connection test failed: ${error.message}`);
    }
}

// Select and display email
async function selectEmail(email, element) {
    // Update visual selection
    document.querySelectorAll('.email-item').forEach(item => item.classList.remove('selected'));
    element.classList.add('selected');
    
    // Mark as read visually
    element.classList.remove('unread');
    
    currentEmail = email;
    await displayEmailContent(email);
    
    // Mark as read on server if it was unread
    if (email.unread) {
        try {
            await fetch(`${API_BASE}/email/${email.uid}/read`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ folder: currentFolder })
            });
            
            // Update cache
            if (emailCache[currentFolder]) {
                const emailIndex = emailCache[currentFolder].findIndex(e => e.uid === email.uid);
                if (emailIndex !== -1) {
                    emailCache[currentFolder][emailIndex].unread = false;
                }
            }
            
            updateFolderCounts();
        } catch (error) {
            console.error('Error marking email as read:', error);
        }
    }
}

// Display email content
async function displayEmailContent(email) {
    const subjectElement = document.getElementById('email-subject');
    const bodyElement = document.getElementById('email-body');
    
    subjectElement.textContent = email.subject;
    
    // Show loading for email content
    bodyElement.innerHTML = `
        <div class="email-header">
            <div class="email-meta">
                <strong>From:</strong> <span>${email.sender}</span>
                <strong>Subject:</strong> <span>${email.subject}</span>
                <strong>Date:</strong> <span>${email.time}</span>
            </div>
        </div>
        <div class="loading" style="padding: 2rem;">Loading email content...</div>
    `;
    
    try {
        const response = await fetch(`${API_BASE}/email/${email.uid}?folder=${currentFolder}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const emailData = await response.json();
        
        bodyElement.innerHTML = `
            <div class="email-header">
                <div class="email-meta">
                    <strong>From:</strong> <span>${email.sender}</span>
                    <strong>Subject:</strong> <span>${email.subject}</span>
                    <strong>Date:</strong> <span>${email.time}</span>
                </div>
            </div>
            <div class="email-message">${emailData.html || emailData.content || 'No content available'}</div>
            ${emailData.attachments && emailData.attachments.length > 0 ? 
                `<div class="email-attachments">
                    <h4>Attachments:</h4>
                    ${emailData.attachments.map(att => `<div class="attachment">${att.filename || 'Unnamed attachment'}</div>`).join('')}
                </div>` : ''
            }
        `;
    } catch (error) {
        console.error('Error loading email content:', error);
        bodyElement.innerHTML = `
            <div class="email-header">
                <div class="email-meta">
                    <strong>From:</strong> <span>${email.sender}</span>
                    <strong>Subject:</strong> <span>${email.subject}</span>
                    <strong>Date:</strong> <span>${email.time}</span>
                </div>
            </div>
            <div style="padding: 2rem; text-align: center; color: #e74c3c;">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Failed to load email content</p>
                <p style="font-size: 0.8rem; color: #666;">${error.message}</p>
            </div>
        `;
    }
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
    
    checkboxes.forEach((checkbox, index) => {
        checkbox.checked = !allChecked;
        // Get email ID from the current folder cache
        const emails = emailCache[currentFolder] || [];
        if (emails[index]) {
            if (!allChecked) {
                selectedEmails.add(emails[index].uid);
            } else {
                selectedEmails.delete(emails[index].uid);
            }
        }
    });
}

async function deleteSelected() {
    if (selectedEmails.size === 0) {
        alert('Please select emails to delete');
        return;
    }
    
    if (confirm(`Delete ${selectedEmails.size} selected email(s)?`)) {
        // Note: Actual deletion would require IMAP STORE command implementation
        // For now, we'll just remove from cache and reload
        alert('Email deletion not yet implemented with IMAP. This would move emails to trash.');
        selectedEmails.clear();
        await loadEmails(currentFolder);
    }
}

async function markAsRead() {
    if (selectedEmails.size === 0) {
        alert('Please select emails to mark as read');
        return;
    }
    
    try {
        // Mark each selected email as read
        for (const uid of selectedEmails) {
            await fetch(`${API_BASE}/email/${uid}/read`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ folder: currentFolder })
            });
        }
        
        selectedEmails.clear();
        await loadEmails(currentFolder);
    } catch (error) {
        console.error('Error marking emails as read:', error);
        alert('Failed to mark emails as read');
    }
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
