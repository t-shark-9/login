// Account Overview JavaScript
document.addEventListener('DOMContentLoaded', function() {
    loadSavedData();
});

function applyGeneralizedPassword() {
    const generalPassword = document.getElementById('generalPassword').value;
    
    if (!generalPassword) {
        alert('Please enter a generalized password first.');
        return;
    }
    
    const checkboxes = document.querySelectorAll('.service-checkbox:checked');
    let appliedCount = 0;
    
    checkboxes.forEach(checkbox => {
        const serviceItem = checkbox.closest('.service-item');
        const passwordInput = serviceItem.querySelector('.password-input');
        passwordInput.value = generalPassword;
        appliedCount++;
    });
    
    if (appliedCount > 0) {
        alert(`Generalized password applied to ${appliedCount} selected service(s).`);
    } else {
        alert('Please select at least one service to apply the generalized password.');
    }
}

function togglePasswordVisibility(element) {
    let passwordInput;
    
    if (typeof element === 'string') {
        // Called with input ID
        passwordInput = document.getElementById(element);
    } else {
        // Called with button element
        const serviceItem = element.closest('.service-item') || element.parentElement;
        passwordInput = serviceItem.querySelector('.password-input') || serviceItem.querySelector('input[type="password"], input[type="text"]');
    }
    
    if (passwordInput) {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
        } else {
            passwordInput.type = 'password';
        }
    }
}

function generatePassword() {
    const length = 16;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    
    for (let i = 0; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    document.getElementById('generalPassword').value = password;
    alert('Strong password generated! You can now apply it to selected services.');
}

function saveAllData() {
    const data = {
        personalInfo: {
            primaryEmail: document.getElementById('primaryEmail').value,
            secondaryEmail: document.getElementById('secondaryEmail').value,
            workEmail: document.getElementById('workEmail').value,
            phoneNumber: document.getElementById('phoneNumber').value,
            generalPassword: document.getElementById('generalPassword').value
        },
        services: {}
    };
    
    // Save service passwords
    const serviceItems = document.querySelectorAll('.service-item');
    serviceItems.forEach(item => {
        const checkbox = item.querySelector('.service-checkbox');
        const passwordInput = item.querySelector('.password-input');
        const serviceName = checkbox.id;
        
        data.services[serviceName] = {
            enabled: checkbox.checked,
            password: passwordInput.value
        };
    });
    
    // Save to localStorage (in production, this should be properly encrypted)
    localStorage.setItem('accountData', JSON.stringify(data));
    alert('All data saved successfully!');
}

function loadSavedData() {
    const savedData = localStorage.getItem('accountData');
    if (!savedData) return;
    
    try {
        const data = JSON.parse(savedData);
        
        // Load personal info
        if (data.personalInfo) {
            document.getElementById('primaryEmail').value = data.personalInfo.primaryEmail || '';
            document.getElementById('secondaryEmail').value = data.personalInfo.secondaryEmail || '';
            document.getElementById('workEmail').value = data.personalInfo.workEmail || '';
            document.getElementById('phoneNumber').value = data.personalInfo.phoneNumber || '';
            document.getElementById('generalPassword').value = data.personalInfo.generalPassword || '';
        }
        
        // Load service data
        if (data.services) {
            Object.keys(data.services).forEach(serviceName => {
                const checkbox = document.getElementById(serviceName);
                const serviceItem = checkbox?.closest('.service-item');
                
                if (serviceItem) {
                    const passwordInput = serviceItem.querySelector('.password-input');
                    const serviceData = data.services[serviceName];
                    
                    checkbox.checked = serviceData.enabled || false;
                    passwordInput.value = serviceData.password || '';
                }
            });
        }
    } catch (error) {
        console.error('Error loading saved data:', error);
    }
}

function clearAllData() {
    if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
        // Clear form fields
        document.getElementById('personalInfoForm').reset();
        
        // Clear service checkboxes and passwords
        const checkboxes = document.querySelectorAll('.service-checkbox');
        const passwordInputs = document.querySelectorAll('.password-input');
        
        checkboxes.forEach(checkbox => checkbox.checked = false);
        passwordInputs.forEach(input => input.value = '');
        
        // Clear localStorage
        localStorage.removeItem('accountData');
        
        alert('All data cleared successfully!');
    }
}

function exportData() {
    const savedData = localStorage.getItem('accountData');
    if (!savedData) {
        alert('No data to export. Please save your data first.');
        return;
    }
    
    const blob = new Blob([savedData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'account-data-backup.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert('Data exported successfully! Keep this file secure.');
}

function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = function(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const importedData = JSON.parse(e.target.result);
                localStorage.setItem('accountData', JSON.stringify(importedData));
                loadSavedData();
                alert('Data imported successfully!');
            } catch (error) {
                alert('Error importing data. Please check the file format.');
                console.error('Import error:', error);
            }
        };
        reader.readAsText(file);
    };
    
    input.click();
}

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl+S to save
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        saveAllData();
    }
    
    // Ctrl+L to load
    if (e.ctrlKey && e.key === 'l') {
        e.preventDefault();
        loadSavedData();
    }
});

// Password strength checker
function checkPasswordStrength(password) {
    const minLength = 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    let strength = 0;
    if (password.length >= minLength) strength++;
    if (hasUppercase) strength++;
    if (hasLowercase) strength++;
    if (hasNumbers) strength++;
    if (hasSpecialChars) strength++;
    
    const levels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    return {
        score: strength,
        level: levels[Math.min(strength, 4)],
        suggestions: []
    };
}

// Auto-save functionality
let autoSaveTimeout;
function scheduleAutoSave() {
    clearTimeout(autoSaveTimeout);
    autoSaveTimeout = setTimeout(() => {
        saveAllData();
        console.log('Auto-saved data');
    }, 30000); // Auto-save every 30 seconds
}

// Add event listeners for auto-save
document.addEventListener('input', scheduleAutoSave);
document.addEventListener('change', scheduleAutoSave);
