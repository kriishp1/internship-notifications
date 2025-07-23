// server.js
require('dotenv').config();

const express = require('express');
const cors = require("cors");
const axios = require("axios");
const twilio = require("twilio");
const app = express();
const corsOptions = {
    origin: "http://localhost:5173",
};

const options = {
     method: 'GET',
        url: "https://active-jobs-db.p.rapidapi.com/active-ats-7d?limit=100&offset=0&advanced_title_filter=('''Intern'''%20%7C%20'''Internship'''%20%7C%20'''Junior'''%20%7C%20'''Entry%20Level''')%20%26%20('''Software'''%20%7C%20'''Engineer'''%20%7C%20'''Developer'''%20%7C%20'''Data'''%20%7C%20'''AI'''%20%7C%20'''Machine%20Learning'''%20%7C%20'''Backend'''%20%7C%20'''Frontend'''%20%7C%20'''DevOps'''%20%7C%20'''Full%20Stack'''%20%7C%20'''Cybersecurity''')&location_filter=Chicago%20OR%20Illinois&description_type=text&date_filter=2025-06-01",
        headers: {
            'x-rapidapi-host': process.env.JOBS_HOST,
            'x-rapidapi-key': process.env.JOBS_KEY
        }
};

app.use(cors(corsOptions)); 


app.get("/homepage", async (req, res) => {
    try {
        const response = await axios.request(options);
        res.json(response.data);
    } catch (error) {
        console.error("API Error:", error);
        res.status(500).json({ Error: "Failed to fetch data from API" });
    }
});


app.listen(8000, () => {
    console.log("Server started on port 8000");
});





//TWILIO MSG

const accountSID = process.env.ACC_SID;
const AuthToken = process.env.AUTH_TOKEN;

const client = require('twilio')(accountSID, AuthToken);
console.log("Twilio SID:", accountSID);
console.log("Twilio Auth Token:", AuthToken ? "Loaded" : "Missing");

let lastJobs = new Set();

async function CheckNewJobs() {
    try {
        const response = await axios.request(options);
        const jobs = response.data || [];
        
        console.log(`Found ${jobs.length} total jobs`);
        
        const newJobs = jobs.filter(job => !lastJobs.has(job.id));
        console.log(`Found ${newJobs.length} new jobs`);

        for (const job of newJobs) {
            await client.messages.create({
                body: `New Internship: ${job.title} - ${job.location || "Location N/A"}`,
                from: process.env.TWILIO_NUMBER,
                to: process.env.MY_NUMBER
            });
            console.log(`SMS sent for: ${job.title}`);
            lastJobs.add(job.id);
        }

    } catch (error) {
        console.error("Error sending SMS:", error.message);
        console.error("Error code:", error.code);
        console.error("More info:", error.moreInfo);
    }
};

CheckNewJobs();
