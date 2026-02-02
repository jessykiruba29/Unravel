/*********************************
 * LOAD ACTIVE RIDDLE SET
 *********************************/
let active_set_id = null;
let active_set = null;
let PHASE1_ANSWER = "";
let PHASE2_ANSWER = "";
let FINAL_ANSWER = "";
let timerInterval = null;

// Fetch riddle set from backend
async function loadRiddleSet() {
  const userId = localStorage.getItem("unravel_user_id");
  
  if (!userId) {
    alert("User session missing. Please re-register.");
    window.location.href = "register.html";
    return false;
  }

  try {
    const response = await fetch(`${window.API_BASE}/user/${userId}/riddle-set`);
    const data = await response.json();
    
    if (data.success && data.riddleSetId) {
      active_set_id = data.riddleSetId;
      
      active_set = window.RIDDLE_SETS.find(
        set => set.id === Number(active_set_id)
      );

      if (!active_set) {
        alert("Invalid riddle set. Please re-register.");
        window.location.href = "register.html";
        return false;
      }

      PHASE1_ANSWER = active_set.phase1.answer.toUpperCase();
      PHASE2_ANSWER = active_set.phase2.answer;
      FINAL_ANSWER = `${PHASE1_ANSWER}_${PHASE2_ANSWER}`;

      document.getElementById("phase1Riddle").innerHTML = active_set.phase1.question;
      document.getElementById("phase2Riddle").innerHTML = active_set.phase2.question;
      document.getElementById("phase2Code").textContent = active_set.phase2.code;
      
      return true;
    } else {
      alert("Riddle set missing. Please re-register.");
      window.location.href = "register.html";
      return false;
    }
  } catch (err) {
    console.error("❌ Failed to load riddle set:", err);
    alert("Failed to connect to server. Please try again.");
    window.location.href = "register.html";
    return false;
  }
}

// Initialize everything after riddle set is loaded
(async function init() {
  const loaded = await loadRiddleSet();
  if (!loaded) return;
  
  // Continue with the rest of the initialization
  attachRiddleHandlers();
  initializeGameState();
  startTimer();
})();

/*********************************
 * ATTACH RIDDLE HANDLERS
 *********************************/
function attachRiddleHandlers() {
  const riddleId = active_set.id;

  // RIDDLE 1: Console Warning
  if (riddleId === 1) {
    console.warn("🔐 Security Key:", "SENTINEL");
  }

  // RIDDLE 2: Hidden Attributes (no JS needed - just inspect element)

  // RIDDLE 3: Text Selection
  if (riddleId === 3) {
    const selectableText = document.getElementById("selectableText");
    const revealDiv = document.getElementById("revealedKey");
    
    if (selectableText && revealDiv) {
      let selectionTimeout = null;
      
      selectableText.addEventListener("mouseup", function() {
        const selectedText = window.getSelection().toString();
        
        if (selectedText.length > 0) {
          clearTimeout(selectionTimeout);
          
          selectionTimeout = setTimeout(() => {
            revealDiv.textContent = "🔓 Access Key: CIPHER";
            revealDiv.style.textShadow = "0 0 10px #00ff88";
          }, 3000);
        }
      });
      
      document.addEventListener("mousedown", function() {
        clearTimeout(selectionTimeout);
      });
    }
  }

  // RIDDLE 4: LocalStorage
  if (riddleId === 4) {
    localStorage.setItem("unravel_hidden_key", "SHADOW");
  }

  // RIDDLE 5: Hover Reveal
  if (riddleId === 5) {
    const target = document.getElementById("hoverTarget");
    
    if (target) {
      let hoverTimer = null;
      let revealed = false;

      // Proximity hint: glow when cursor is near (<= 60px) even if not inside
      const proxListener = (e) => {
        const rect = target.getBoundingClientRect();
        const cx = Math.max(rect.left, Math.min(e.clientX, rect.right));
        const cy = Math.max(rect.top, Math.min(e.clientY, rect.bottom));
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.sqrt(dx*dx + dy*dy);

        if (dist <= 60 && !revealed) {
          target.style.boxShadow = "0 0 12px rgba(0,170,255,0.6)";
          target.style.borderColor = "#66ccff";
        } else if (!revealed) {
          target.style.boxShadow = "none";
          target.style.borderColor = "#00aaff";
        }
      };
      document.addEventListener("mousemove", proxListener);

      const resetVisual = () => {
        if (revealed) return;
        target.textContent = "The key will be revealed to the patient.";
        target.style.background = "rgba(0,170,255,0.2)";
        target.style.borderColor = "#00aaff";
        target.style.color = "inherit";
        target.style.textShadow = "none";
      };

      target.addEventListener("mouseenter", function() {
        if (revealed) return;
        this.textContent = "The key will be revealed to the patient.";
        this.style.borderColor = "#44ffaa";
        this.style.background = "rgba(0,170,255,0.25)";

        clearTimeout(hoverTimer);
        hoverTimer = setTimeout(() => {
          revealed = true;
          this.textContent = "🔓 ACCESS KEY: PHANTOM";
          this.style.background = "rgba(0,255,136,0.2)";
          this.style.borderColor = "#00ff88";
          this.style.color = "#00ff88";
          this.style.textShadow = "0 0 10px #00ff88";
          this.style.boxShadow = "none";
        }, 3000);
      });
      
      target.addEventListener("mouseleave", function() {
        clearTimeout(hoverTimer);
        setTimeout(resetVisual, 200);
      });

      document.addEventListener("mousedown", function() {
        // Clicking breaks trust — reset unless already revealed
        if (!revealed) {
          clearTimeout(hoverTimer);
          resetVisual();
        }
      });
    }
  }
}

attachRiddleHandlers();

/*********************************
 * GLOBAL STATE
 *********************************/
function initializeGameState() {
  let phase1Done = localStorage.getItem("phase1Done") === "true";
  let phase2Done = localStorage.getItem("phase2Done") === "true";
  const PHASE1_MAX_ATTEMPTS = 5;
  const PHASE2_MAX_ATTEMPTS = 5;
  
  if(phase1Done){
    phase1Panel.classList.replace("locked", "unlocked");
    phase1Success.classList.remove("hidden");
    phase1Error.classList.add("hidden");
    document.getElementById("phase1AttemptsLeft").textContent = "";

    phase1Input.disabled = true;
    phase1Btn.disabled = true;
  }
  if(phase2Done){
    phase2Panel.classList.replace("locked", "unlocked");
    phase2Success.classList.remove("hidden");
    phase2Error.classList.add("hidden");
    document.getElementById("phase2AttemptsLeft").textContent = "";

    phase2Input.disabled = true;
    phase2Btn.disabled = true;
  }
}
/*********************************
 * TIMER
 *********************************/
async function startTimer() {
  const TOTAL_TIME = 20 * 60;
  const userId = localStorage.getItem("unravel_user_id");

  // Try to fetch start time from backend first
  let startTime = null;
  
  if (userId) {
    try {
      const response = await fetch(`${window.API_BASE}/user/${userId}/start-time`);
      const data = await response.json();
      
      if (data.success && data.startTime) {
        startTime = Number(data.startTime);
        localStorage.setItem("unravel_start_time", startTime);
      }
    } catch (err) {
      console.error("❌ Failed to fetch start time from backend:", err);
    }
  }

  // If no start time from backend, check localStorage or create new
  if (!startTime) {
    startTime = Number(localStorage.getItem("unravel_start_time"));
    if (!startTime) {
      startTime = Date.now();
      localStorage.setItem("unravel_start_time", startTime);
      
      // Send to backend
      if (userId) {
        fetch(`${window.API_BASE}/user/${userId}/start-time`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ startTime })
        }).catch(err => console.error("❌ Failed to sync start time:", err));
      }
    }
  }

  function getRemainingTime() {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    return Math.max(TOTAL_TIME - elapsed, 0);
  }

  window.getTimeTaken = function() {
    return Math.floor((Date.now() - startTime) / 1000);
  };

  window.getRemainingTime = getRemainingTime;

  timerInterval = setInterval(() => {
    const remaining = getRemainingTime();
    const mins = String(Math.floor(remaining / 60)).padStart(2, "0");
    const secs = String(remaining % 60).padStart(2, "0");

    timer.textContent = `${mins}:${secs}`;

    if (remaining <= 0) {
      clearInterval(timerInterval);
      alert("TIME UP!");
    }
  }, 1000);
}

/*********************************
 * HELPERS
 *********************************/
function getCurrentUserData() {
  const data = localStorage.getItem("unravel_user_data");
  if (!data) {
    alert("User session missing");
    window.location.href = "register.html";
    return null;
  }
  
  const user = JSON.parse(data);
  user.phase1Completed = localStorage.getItem("phase1Done") === "true";
  user.phase2Completed = localStorage.getItem("phase2Done") === "true";
  updateUserInBackend(user);
  return user;
}

async function updateUserInBackend(user) {
  const userId = localStorage.getItem("unravel_user_id");
  if (!userId) return;

  await fetch(`${window.API_BASE}/update-user`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: Number(userId),
      userData: user
    })
  });
}

/*********************************
 * PHASE 1
 *********************************/
function phase1Submit(e) {
  e.preventDefault();
  const user = getCurrentUserData();
  if (!user) return;

  const value = phase1Input.value.trim().toUpperCase();
  let phase1Done = localStorage.getItem("phase1Done") === "true";
  const PHASE1_MAX_ATTEMPTS = 5;
  
  if(!phase1Done){
    if (value === PHASE1_ANSWER) {
      phase1Done = true;
      localStorage.setItem("phase1Done", "true");
      user.phase1Score = 100;
      
      const remaining = window.getRemainingTime();
      user.timeBonus = Math.floor(remaining / 60) * 10;
      user.totalScore = user.phase1Score + user.phase2Score;

      phase1Panel.classList.replace("locked", "unlocked");
      phase1Success.classList.remove("hidden");
      phase1Error.classList.add("hidden");
      document.getElementById("phase1AttemptsLeft").textContent = "";

      phase1Input.disabled = true;
      phase1Btn.disabled = true;

      localStorage.setItem("unravel_user_data", JSON.stringify(user));
      updateUserInBackend(user);
      return;
    }

    user.phase1Denied = (user.phase1Denied || 0) + 1;
    localStorage.setItem("unravel_user_data", JSON.stringify(user));

    updatePhase1AttemptsUI(PHASE1_MAX_ATTEMPTS - user.phase1Denied);
    phase1Error.classList.remove("hidden");
  }
}

/*********************************
 * PHASE 2
 *********************************/
function phase2Submit(e) {
  e.preventDefault();
  const user = getCurrentUserData();
  if (!user) return;

  const value = phase2Input.value.trim();
  let phase2Done = localStorage.getItem("phase2Done") === "true";
  const PHASE2_MAX_ATTEMPTS = 5;
  
  if(!phase2Done){
    if (value === PHASE2_ANSWER) {
      phase2Done = true;
      localStorage.setItem("phase2Done", "true");
      user.phase2Score = 100;

      const remaining = window.getRemainingTime();
      user.timeBonus = Math.floor(remaining / 60) * 10;
      user.totalScore = user.phase1Score + user.phase2Score;

      phase2Panel.classList.replace("locked", "unlocked");
      phase2Success.classList.remove("hidden");
      phase2Error.classList.add("hidden");
      document.getElementById("phase2AttemptsLeft").textContent = "";

      phase2Input.disabled = true;
      phase2Btn.disabled = true;

      localStorage.setItem("unravel_user_data", JSON.stringify(user));
      updateUserInBackend(user);
      return;
    }

    user.phase2Denied = (user.phase2Denied || 0) + 1;
    localStorage.setItem("unravel_user_data", JSON.stringify(user));

    updatePhase2AttemptsUI(PHASE2_MAX_ATTEMPTS - user.phase2Denied);
    phase2Error.classList.remove("hidden");
  }
}

/*********************************
 * FINAL PHASE
 *********************************/
function finalSubmit(e) {
  e.preventDefault();

  let phase1Done = localStorage.getItem("phase1Done") === "true";
  let phase2Done = localStorage.getItem("phase2Done") === "true";
  
  if (!phase1Done || !phase2Done) return;

  const value = finalInput.value.trim().toUpperCase();
  if (value !== FINAL_ANSWER.toUpperCase()) {
    alert("❌ INVALID FINAL KEY");
    return;
  }

  const user = getCurrentUserData();
  if (!user) return;

  clearInterval(timerInterval);

  user.phase3Score = 100;
  user.totalScore = 300;
  user.timeTaken = window.getTimeTaken();
  user.finalScore = user.totalScore + user.timeBonus;

  localStorage.setItem("unravel_user_data", JSON.stringify(user));
  updateUserInBackend(user);

  finalPanel.classList.replace("locked", "unlocked");
  finalSuccess.classList.remove("hidden");

  systemPanel.classList.replace("locked", "unlocked");
  systemState.textContent = "SYSTEM COMPROMISED";

  finalInput.disabled = true;
  syncUserToBackend();

  console.log("🏁 COMPLETE", user);
}

async function syncUserToBackend() {
  const user = getCurrentUserData();
  if (!user) return;

  const userId = localStorage.getItem("unravel_user_id");
  if (!userId) return;

  await fetch(`${window.API_BASE}/update-user`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: Number(userId),
      userData: user   // send full object
    })
  });
}



/*********************************
 * UI HELPERS
 *********************************/
function updatePhase1AttemptsUI(left) {
  document.getElementById("phase1AttemptsLeft").textContent =
    left > 0 ? `${left} attempts remaining` : "";
}

function updatePhase2AttemptsUI(left) {
  document.getElementById("phase2AttemptsLeft").textContent =
    left > 0 ? `${left} attempts remaining` : "";
}
