"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = require("./db");
const app = (0, express_1.default)();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
let users = [];
let nextId = 1;
/*********************************
 * REGISTER USER
 *********************************/
app.post("/register", async (req, res) => {
    const { user } = req.body;
    try {
        // Generate random riddle set ID (1-5)
        const riddleSetId = Math.floor(Math.random() * 5) + 1;
        const result = await db_1.pool.query(`
      INSERT INTO users (name, email, phoneno, riddle_set_id)
      VALUES ($1, $2, $3, $4)
      RETURNING id, riddle_set_id
      `, [user.name, user.email, user.phone, riddleSetId]);
        console.log("✅ User registered:", result.rows[0].id, "with riddle set:", result.rows[0].riddle_set_id);
        res.json({ success: true, userId: result.rows[0].id, riddleSetId: result.rows[0].riddle_set_id });
    }
    catch (err) {
        console.error("❌ Register error:", err);
        res.status(500).json({ success: false });
    }
});
/*********************************
 * UPDATE USER – FULL JSON MERGE
 *********************************/
app.post("/update-user", async (req, res) => {
    const { userId, userData } = req.body;
    try {
        await db_1.pool.query(`
      UPDATE users
      SET
        scorepoints = $1,
        timebonus   = $2,
        finalscore  = $3,
        timetaken   = $4,
        game_data   = $5,
        updated_at  = NOW()
      WHERE id = $6
      `, [
            userData.totalScore,
            userData.timeBonus,
            userData.finalScore,
            userData.timeTaken,
            userData, // FULL JSON stored here 👈
            userId
        ]);
        console.log("✅ User updated:", userId);
        res.json({ success: true });
    }
    catch (err) {
        console.error("❌ Update error:", err);
        res.status(500).json({ success: false });
    }
});
/*********************************
 * LEADERBOARD
 *********************************/
app.get("/users", async (req, res) => {
    try {
        const result = await db_1.pool.query(`
      SELECT
        id,
        name,
        email,
        phoneno,
        riddle_set_id,
        scorepoints,
        timebonus,
        finalscore,
        timetaken,
        game_data,
        created_at
      FROM users
      ORDER BY finalscore DESC, timetaken ASC NULLS LAST
    `);
        console.log("📊 Users fetched:", result.rows.length);
        res.json(result.rows);
    }
    catch (err) {
        console.error("❌ Users fetch error:", err);
        res.status(500).json([]);
    }
});
/*********************************
 * GET RIDDLE SET BY USER ID
 *********************************/
app.get("/user/:userId/riddle-set", async (req, res) => {
    const { userId } = req.params;
    try {
        const result = await db_1.pool.query(`SELECT riddle_set_id FROM users WHERE id = $1`, [userId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        console.log("🎲 Riddle set fetched for user:", userId);
        res.json({ success: true, riddleSetId: result.rows[0].riddle_set_id });
    }
    catch (err) {
        console.error("❌ Riddle set fetch error:", err);
        res.status(500).json({ success: false });
    }
});
/*********************************
 * SET/GET START TIME
 *********************************/
app.post("/user/:userId/start-time", async (req, res) => {
    const { userId } = req.params;
    const { startTime } = req.body;
    try {
        await db_1.pool.query(`UPDATE users SET start_time = $1 WHERE id = $2`, [startTime, userId]);
        console.log("⏰ Start time set for user:", userId, "at", startTime);
        res.json({ success: true });
    }
    catch (err) {
        console.error("❌ Start time set error:", err);
        res.status(500).json({ success: false });
    }
});
app.get("/user/:userId/start-time", async (req, res) => {
    const { userId } = req.params;
    try {
        const result = await db_1.pool.query(`SELECT start_time FROM users WHERE id = $1`, [userId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        console.log("⏰ Start time fetched for user:", userId);
        res.json({ success: true, startTime: result.rows[0].start_time });
    }
    catch (err) {
        console.error("❌ Start time fetch error:", err);
        res.status(500).json({ success: false });
    }
});
/*********************************
 * START SERVER
 *********************************/
app.listen(PORT, () => console.log(`🔥 UNRAVEL backend running on port ${PORT}`));
