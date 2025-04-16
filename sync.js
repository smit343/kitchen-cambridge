
// === sync.js ===
// Replace this with your actual deployed Google Apps Script Web App URL:
const GOOGLE_SHEETS_WEBAPP_URL = "https://script.google.com/macros/s/AKfycbyiOTm5Bj4ej0YZLT8wCd0GfsoZz54qnly6qKKm1uxkLDgWeQ62tksxZwOTFOsdhmYp/exec";

// Send Sabha data to Google Sheets
async function syncSabhaData() {
    const sabhaData = JSON.parse(localStorage.getItem("sabhaData") || "[]");

    if (!sabhaData.length) {
        alert("No Sabha data found to sync.");
        return;
    }

    try {
        const response = await fetch(GOOGLE_SHEETS_WEBAPP_URL, {
            method: "POST",
            body: JSON.stringify({
                type: "sabha",
                data: sabhaData
            }),
            headers: {
                "Content-Type": "application/json"
            }
        });

        const result = await response.text();
        console.log("Sabha Sync Result:", result);
        alert("✅ Sabha data synced to Google Sheets!");
    } catch (error) {
        console.error("Sabha Sync Error:", error);
        alert("❌ Failed to sync Sabha data.");
    }
}

// Send Recipe data to Google Sheets
async function syncRecipeData() {
    const recipeData = JSON.parse(localStorage.getItem("recipeData") || "[]");

    if (!recipeData.length) {
        alert("No Recipe data found to sync.");
        return;
    }

    try {
        const response = await fetch(GOOGLE_SHEETS_WEBAPP_URL, {
            method: "POST",
            body: JSON.stringify({
                type: "recipe",
                data: recipeData
            }),
            headers: {
                "Content-Type": "application/json"
            }
        });

        const result = await response.text();
        console.log("Recipe Sync Result:", result);
        alert("✅ Recipe data synced to Google Sheets!");
    } catch (error) {
        console.error("Recipe Sync Error:", error);
        alert("❌ Failed to sync Recipe data.");
    }
}

// OPTIONAL: call this to sync both
function syncAllData() {
    syncSabhaData();
    syncRecipeData();
}
