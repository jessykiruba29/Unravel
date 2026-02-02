console.log('🔌 SERVER REGISTRATION MODULE LOADED 🔌');

/* ===================== RIDDLE SETS ===================== */


function selectRandomRiddleSet() {
  const index = Math.floor(Math.random() * window.RIDDLE_SETS.length);
  return window.RIDDLE_SETS[index].id;
}
/* ===================== END ADDITION ===================== */

function registerUser(e) {
  e.preventDefault();

  const user = {
    name: document.getElementById("name").value.trim(),
    email: document.getElementById("email").value.trim(),
    phone: document.getElementById("phone").value.trim(),

    phase1Denied: 0,
    phase2Denied: 0,
    phase1Completed: false,
    phase2Completed: false,
    phase1Disqualified: false,
    phase2Disqualified: false,
    phase1Score: 0,
    phase2Score: 0,
    timeBonus: 0,
    totalScore: 0
  };

  // Send to backend
  sendRegistrationToBackend(user).then(() => {
    localStorage.setItem("unravel_user", user.name);
    localStorage.setItem("unravel_user_data", JSON.stringify(user));
    localStorage.setItem("unravel_registered", "true");

    console.log("✅ USER REGISTERED:", user);

    window.location.href = "start.html";
  }).catch(err => {
    console.error("❌ REGISTRATION FAILED:", err);
    showServerError("Registration failed. Please try again.");
  });
}

// Utility functions
function getDeviceFingerprint() {
  const fingerprint = {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    screenResolution: `${screen.width}x${screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    hardwareConcurrency: navigator.hardwareConcurrency || 'unknown'
  };
  return btoa(JSON.stringify(fingerprint)).substr(0, 32);
}

function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function isValidPhone(phone) {
  // Basic phone validation - allows international formats
  const re = /^[\d\s\-\+\(\)]{10,}$/;
  return re.test(phone.replace(/\s/g, ''));
}

function showServerError(message) {
  const statusDiv = document.createElement('div');
  statusDiv.className = 'registration-status status-error';
  statusDiv.innerHTML = message;
  statusDiv.style.animation = 'error-shake 0.5s ease-in-out';
  
  const existingStatus = document.querySelector('.registration-status');
  if (existingStatus) {
    existingStatus.remove();
  }
  
  document.querySelector('form').appendChild(statusDiv);
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    statusDiv.style.opacity = '0';
    statusDiv.style.transition = 'opacity 0.5s';
    setTimeout(() => statusDiv.remove(), 500);
  }, 5000);
}

// Backend communication
async function sendRegistrationToBackend(user) {
  const payload = {
    user: user,
    timestamp: Date.now()
  };
  
  try {
    // Detect backend URL dynamically
    const backendURL = `${window.API_BASE}/register`;
    
    console.log('📤 SENDING TO BACKEND:', backendURL);
    console.log('📦 PAYLOAD:', payload);
    
    const response = await fetch(backendURL, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
      mode: 'cors'
    });
    
    const responseData = await response.json();
    console.log('📥 BACKEND RESPONSE:', responseData);
    
    if (response.ok && responseData.success) {
      console.log('✅ REGISTRATION SYNCED WITH BACKEND');
      // Store userId only (riddle set always fetched from backend for security)
      user.id = responseData.userId;
      localStorage.setItem("unravel_user_id", responseData.userId);
      // Store sync timestamp
      localStorage.setItem("last_backend_sync", Date.now());
    } else {
      throw new Error(responseData.message || 'Backend error');
    }
  } catch (err) {
    console.error('❌ BACKEND SYNC FAILED:', err);
    // Don't fail registration if backend is down
    localStorage.setItem("backend_sync_failed", Date.now());
    throw err;
    
  }
}


function showConsentModal() {
  return new Promise((resolve) => {
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 20, 10, 0.95);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10000;
      font-family: 'Courier New', monospace;
    `;
    
    modal.innerHTML = `
      <div style="
        background: rgba(0, 30, 15, 0.9);
        border: 2px solid #00ff88;
        border-radius: 10px;
        padding: 30px;
        max-width: 500px;
        color: #00ff88;
        box-shadow: 0 0 30px rgba(0, 255, 136, 0.3);
      ">
        <h3 style="margin-top: 0; color: #ffb347;">🔒 DATA CONSENT REQUEST</h3>
        <p>Share anonymous usage data with server for:</p>
        <ul style="color: #9ad1ff; font-size: 0.9rem;">
          <li>Bug detection and fixes</li>
          <li>Performance optimization</li>
          <li>Server load balancing</li>
        </ul>
        <p style="font-size: 0.8rem; color: rgba(0, 255, 136, 0.7);">
          <em>No personal information will be shared</em>
        </p>
        <div style="margin-top: 25px; display: flex; gap: 15px;">
          <button id="consent-yes" style="
            flex: 1;
            padding: 12px;
            background: linear-gradient(45deg, #006644, #00a86b);
            border: none;
            color: black;
            font-family: 'Courier New', monospace;
            font-weight: bold;
            cursor: pointer;
            border-radius: 6px;
          ">ALLOW</button>
          <button id="consent-no" style="
            flex: 1;
            padding: 12px;
            background: rgba(255, 77, 77, 0.2);
            border: 1px solid #ff4d4d;
            color: #ff4d4d;
            font-family: 'Courier New', monospace;
            font-weight: bold;
            cursor: pointer;
            border-radius: 6px;
          ">DENY</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.querySelector('#consent-yes').onclick = () => {
      document.body.removeChild(modal);
      resolve(true);
    };
    
    modal.querySelector('#consent-no').onclick = () => {
      document.body.removeChild(modal);
      resolve(false);
    };
  });
}

