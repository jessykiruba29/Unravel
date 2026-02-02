const PASSWORD = "admin"; // 🔐 change before event

async function loginAdmin() {
  const pass = document.getElementById("adminPass").value;

  if (pass !== PASSWORD) {
    alert("ACCESS DENIED");
    return;
  }

  try {
    // 🔹 Fetch users from backend
    const backendURL = `${window.API_BASE}/users`;
    const response = await fetch(backendURL);
    const users = await response.json();

    if (!users || users.length === 0) {
      alert("No users found.");
      return;
    }

    // 🔹 Sort users by time taken (ascending, lower time is better)
    const sortedUsers = [...users].sort((a, b) => {
      const aTime = a.timetaken || Infinity;
      const bTime = b.timetaken || Infinity;
      return aTime - bTime;
    });

    let html = "<h2>LEADERBOARD - RANKED BY TIME TAKEN</h2>";

    sortedUsers.forEach((u, i) => {
      const rank = i + 1;
      const rankColor = rank === 1 ? "gold" : rank === 2 ? "silver" : rank === 3 ? "#CD7F32" : "cyan";

      const phase1Status = u.game_data?.phase1Disqualified ? "DISQUALIFIED" : (u.game_data?.phase1Completed ? "COMPLETED" : "ACTIVE");
      const phase2Status = u.game_data?.phase2Disqualified ? "DISQUALIFIED" : (u.game_data?.phase2Completed ? "COMPLETED" : "ACTIVE");

      const phase1Color = u.game_data?.phase1Disqualified ? "red" : (u.game_data?.phase1Completed ? "lime" : "yellow");
      const phase2Color = u.game_data?.phase2Disqualified ? "red" : (u.game_data?.phase2Completed ? "lime" : "yellow");

      html += `
        <div style="border:2px solid ${rankColor}; padding:16px; margin:16px 0; background: rgba(0,0,0,0.3);">
          <div style="font-size: 1.5rem; color: ${rankColor}; margin-bottom: 8px;">
            ${rank <= 3 ? ["🥇","🥈","🥉"][rank-1] : ""} <strong>RANK #${rank}</strong>
          </div>
          <strong style="font-size: 1.2rem;">${u.name}</strong><br>
          Email: ${u.email}<br>
          Phone: ${u.phoneno}<br>
          Registration Time: ${u.created_at}<br><br>

          <div style="background: rgba(0,100,100,0.2); padding: 12px; margin-top: 8px; border-left: 3px solid cyan;">
            <strong style="font-size: 1.1rem; color: cyan;">📊 SCORE BREAKDOWN</strong><br>
            Phase 1 Score: <strong style="color: lime;">${u.game_data?.phase1Score || 0} pts</strong><br>
            Phase 2 Score: <strong style="color: lime;">${u.game_data?.phase2Score || 0} pts</strong><br>
            Time Bonus: <strong style="color: gold;">${u.timebonus || 0} pts</strong><br>
            Final Score: <strong style="color: gold;">${u.finalscore || 0} pts</strong><br>
            Total Score: <strong style="color: gold;">${(Number(u.scorepoints)+Number(u.timebonus))} pts</strong><br>
            Time Taken: <strong style="color: cyan;">${u.timetaken ? u.timetaken + " sec" : "N/A"}</strong>
          </div><br>

          <strong>Phase 1:</strong> 
          <span style="color:${phase1Color}">${phase1Status}</span> 
          (Denied Attempts: <strong style="color:red;">${u.game_data?.phase1Denied || 0}</strong>)<br>
          
          <strong>Phase 2:</strong> 
          <span style="color:${phase2Color}">${phase2Status}</span> 
          (Denied Attempts: <strong style="color:red;">${u.game_data?.phase2Denied || 0}</strong>)
        </div>
      `;
    });

    document.getElementById("data").innerHTML = html;
    document.getElementById("data").classList.remove("hidden");

  } catch (err) {
    console.error("Error fetching users:", err);
    alert("Failed to fetch users from backend.");
  }
}
