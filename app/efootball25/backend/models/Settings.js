import db from "../config/db.js";

const Settings = {
  // Get settings (single row)
  getSettings: async () => {
    try {
      const [rows] = await db.query(
        "SELECT * FROM settings LIMIT 1"
      );

      return rows.length > 0 ? rows[0] : null;

    } catch (err) {
      console.error("getSettings error:", err);
      throw err;
    }
  },


  // Get all settings (if needed)
  getAllSettings: async () => {
    try {
      const [rows] = await db.query(
        "SELECT * FROM settings"
      );

      return rows;

    } catch (err) {
      console.error("getAllSettings error:", err);
      throw err;
    }
  },


  // Insert or update settings
  setAllSettings: async (
    deadlineDate,
    currentRound,
    registerIsOpen,
    totalGws,
    whatsapp_url
  ) => {
    try {

      const existingSettings = await Settings.getSettings();

      if (!existingSettings) {

        const [result] = await db.query(
          `
          INSERT INTO settings
          (
            deadlineDate,
            currentRound,
            registerIsOpen,
            totalGws,
            whatsapp_url
          )
          VALUES (?, ?, ?, ?, ?)
          `,
          [
            deadlineDate,
            currentRound,
            registerIsOpen,
            totalGws,
            whatsapp_url
          ]
        );

        return result;

      } else {

        const [result] = await db.query(
          `
          UPDATE settings
          SET
            deadlineDate = ?,
            currentRound = ?,
            registerIsOpen = ?,
            totalGws = ?,
            whatsapp_url = ?
          `,
          [
            deadlineDate,
            currentRound,
            registerIsOpen,
            totalGws,
            whatsapp_url
          ]
        );

        return result;
      }

    } catch (err) {
      console.error("setAllSettings error:", err);
      throw err;
    }
  }
};

export default Settings;
