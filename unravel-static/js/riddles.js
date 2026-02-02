// ===============================
// UNRAVEL — SERVER CTF CHALLENGES
// ===============================

window.RIDDLE_SETS = [
  // ============================
  // RIDDLE 1: Console Warning
  // ============================
  {
    id: 1,
    phase1: {
      question: `
        <div style="margin: 20px 0; color: #9ad1ff; font-family: 'Courier New', monospace; line-height: 1.8;">
          <strong>SYSTEM ALERT</strong><br><br>
          
          <div style="background: rgba(255,100,100,0.1); padding: 15px; border-left: 3px solid #ff4d4d; margin: 10px 0;">
            <em>I do not interrupt.<br>
            I only warn those who listen.<br><br>
            Errors tell stories,<br>
            But logs tell secrets.<br><br>
            Listen carefully.</em>
          </div>

          
        </div>
      `,
      answer: "SENTINEL"
    },
    phase2: {
      question: `
        <div class="phase-hint-box">
          <strong>SEQUENCE PUZZLE</strong><br><br>
          Look at this sequence:<br><br>
          1<br>
          11<br>
          21<br>
          1211<br>
          111221<br>
          312211<br><br>
          What is the next number in this sequence?
        </div>
      `,
      code: "COUNT",
      answer: "13112221"
    }
  },

  // ============================
  // RIDDLE 2: Hidden Attributes
  // ============================
  {
    id: 2,
    phase1: {
      question: `
        <div style="margin: 20px 0; color: #9ad1ff; font-family: 'Courier New', monospace; line-height: 1.8;">
          <strong>METADATA HUNT</strong><br><br>
          
          <div style="background: rgba(100,100,255,0.1); padding: 15px; border-left: 3px solid #4d88ff; margin: 10px 0;">
            <em>I carry meaning without words.<br><br>
            I am not displayed,<br>
            Yet I define behavior.<br><br>
            Read what was never meant to be seen.</em>
          </div>

          <div 
            data-secret-key="PROTOCOL"
            aria-label="Access Key Storage"
            style="margin-top: 20px; padding: 15px; background: rgba(0,255,136,0.05); border: 1px dashed #00ff88; cursor: help;"
          >
            <span style="opacity: 0.7;">🔍 Inspect this element's attributes</span>
          </div>

          
        </div>
      `,
      answer: "PROTOCOL"
    },
    phase2: {
      question: `
        <div class="phase-hint-box">
          <strong>CODING AND DECODING</strong><br><br>
          In a certain code language,<br>
          '134' means 'good and tasty';<br>
          '478' means 'see good pictures' and<br>
          '729' means 'pictures are faint'.<br><br>
          Which digit stands for 'see'?
        </div>
      `,
      code: "DECODE",
      answer: "8"
    }
  },

  // ============================
  // RIDDLE 3: Text Selection
  // ============================
  {
    id: 3,
    phase1: {
      question: `
        <div style="margin: 20px 0; color: #9ad1ff; font-family: 'Courier New', monospace; line-height: 1.8;">
          <strong>PATIENT OBSERVER</strong><br><br>
          
          <div style="background: rgba(255,200,100,0.1); padding: 15px; border-left: 3px solid #ffaa44; margin: 10px 0;">
            <em>The truth reveals itself<br>
            To those who mark their territory<br>
            And wait with patience.<br><br>
            Highlight what matters,<br>
            Then let time do the rest.</em>
          </div>

          <div 
            id="selectableText"
            style="
              margin-top: 20px; 
              padding: 20px; 
              background: rgba(0,255,136,0.05); 
              border: 1px dashed #00ff88;
              user-select: text;
              line-height: 1.6;
            "
          >
            <p style="opacity: 0.8;">The key will be revealed to the patient.</p>
          </div>

          <div id="revealedKey" style="margin-top: 15px; min-height: 30px; color: #00ff88; font-weight: bold;"></div>

          
        </div>
      `,
      answer: "CIPHER"
    },
    phase2: {
      question: `
        <div class="phase-hint-box">
          <strong>RIDDLE</strong><br><br>
          A merchant can place 8 large boxes or 10 small boxes into a carton for shipping.<br>
          In one shipment, he sent a total of 96 boxes.<br>
          If there are more large boxes than small boxes, how many cartons did he ship?
        </div>
      `,
      code: "BOXES",
      answer: "11"
    }
  },

  // ============================
  // RIDDLE 4: Hidden Storage
  // ============================
  {
    id: 4,
    phase1: {
      question: `
        <div style="margin: 20px 0; color: #9ad1ff; font-family: 'Courier New', monospace; line-height: 1.8;">
          <strong>DIGITAL ARCHAEOLOGY</strong><br><br>
          
          <div style="background: rgba(200,100,255,0.1); padding: 15px; border-left: 3px solid #aa44ff; margin: 10px 0;">
            <em>I hide in plain sight,<br>
            Stored in the browser's memory.<br><br>
            Not in the code you see,<br>
            But in the storage you inspect.<br><br>
            Search where sessions persist.</em>
          </div>

          

  
        </div>
      `,
      answer: "SHADOW"
    },
    phase2: {
      question: `
        <div class="phase-hint-box">
          <strong>THE SOCKS RIDDLE</strong><br><br>
          If you have 30 red socks, 20 white socks, and 10 blue socks,<br>
          how many will you pick to get at least 1 matching pair without looking?
        </div>
      `,
      code: "SOCKS",
      answer: "4"
    }
  },

  // ============================
  // RIDDLE 5: Hover Reveal
  // ============================
  {
    id: 5,
    phase1: {
      question: `
        <div style="margin: 20px 0; color: #9ad1ff; font-family: 'Courier New', monospace; line-height: 1.8;">
          <strong>PROXIMITY SENSOR — HOLD STEADY</strong><br><br>
          
          <div style="background: rgba(100,255,200,0.1); padding: 15px; border-left: 3px solid #44ffaa; margin: 10px 0;">
            <em>I respond to your presence,<br>
            Not your touch.<br><br>
            Approach slowly to wake me,<br>
            Then hover and hold — without clicking —
            until I trust your intent.</em>
          </div>

          <div style="margin-top: 20px; text-align: center;">
            <span 
              id="hoverTarget"
              style="
                display: inline-block;
                padding: 15px 30px;
                background: rgba(0,170,255,0.2);
                border: 2px solid #00aaff;
                cursor: help;
                transition: all 0.3s ease;
                font-weight: bold;
                letter-spacing: 2px;
              "
            >
              The key will be revealed to the patient.
            </span>
          </div>

         
        </div>
      `,
      answer: "PHANTOM"
    },
    phase2: {
      question: `
        <div class="phase-hint-box">
          <strong>THE EQUAL SHARING</strong><br><br>
          A group of people collects $529.<br>
          If each person contributes an amount in dollars equal to the total number of people in the group,<br>
          how many people are in the group?
        </div>
      `,
      code: "SHARING",
      answer: "23"
    }
  }
];

// ===============================
// SELECT RIDDLE SET
// ===============================

async function fetchRiddleSetFromBackend() {
  const userId = localStorage.getItem("unravel_user_id");
  if (!userId) {
    console.log("⚠️ No user ID found, generating random riddle set");
    return null;
  }

  try {
    const response = await fetch(`${window.API_BASE}/user/${userId}/riddle-set`);
    const data = await response.json();
    
    if (data.success && data.riddleSetId) {
      console.log("✅ Riddle set fetched from backend:", data.riddleSetId);
      return data.riddleSetId;
    }
  } catch (err) {
    console.error("❌ Failed to fetch riddle set from backend:", err);
  }
  
  return null;
}

(async function initializeRiddleSet() {
  // ALWAYS fetch from backend for security - ignore localStorage
  console.log("🔍 Fetching riddle set from backend...");
  let chosenSetId = await fetchRiddleSetFromBackend();

  // If backend failed or no user, generate random (should not happen in normal flow)
  if (!chosenSetId) {
    console.log("🎲 Backend unavailable - generating random riddle set");
    const randomIndex = Math.floor(Math.random() * window.RIDDLE_SETS.length);
    chosenSetId = window.RIDDLE_SETS[randomIndex].id;
  }

  window.ACTIVE_RIDDLE_SET = window.RIDDLE_SETS.find(
    set => set.id === Number(chosenSetId)
  );

  if (!window.ACTIVE_RIDDLE_SET) {
    const randomIndex = Math.floor(Math.random() * window.RIDDLE_SETS.length);
    chosenSetId = window.RIDDLE_SETS[randomIndex].id;
    window.ACTIVE_RIDDLE_SET = window.RIDDLE_SETS.find(
      set => set.id === Number(chosenSetId)
    );
  }

  console.log("🎯 Active riddle set:", window.ACTIVE_RIDDLE_SET.id);
})();
