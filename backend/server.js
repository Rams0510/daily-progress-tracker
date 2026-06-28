const express = require('express');
const cors = require('cors');
const { google } = require('googleapis');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

const auth = new google.auth.GoogleAuth({
  credentials: {
    project_id: process.env.GOOGLE_PROJECT_ID,
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  },
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const SPREADSHEET_ID = '1QUZtewgyfdkC0zpn5C3WBfSNBSkV2UcyWRo_T4EVqxA';

app.post('/api/log-study', async (req, res) => {
  console.log('Received:', req.body);
  try {
    const { name, aptitudeHours, sqlHours, codingHours, conceptLearned } = req.body;

    const date = new Date().toLocaleDateString('en-IN', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      timeZone: 'Asia/Kolkata',
    });

    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Sheet1!A:F',
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [[date, name, Number(aptitudeHours), Number(sqlHours), Number(codingHours), conceptLearned]],
      },
    });

    console.log('Success!');
    res.status(200).json({ success: true, message: 'Data successfully logged to Google Sheets!' });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});
app.get("/", (req, res) => {
    res.send("Backend Running 🚀");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});