require("dotenv").config();

const express = require("express");
const path = require("path");
const { Resend } = require("resend");

const app = express();
const PORT = 3000;

const resend = new Resend(process.env.RESEND_API_KEY);

app.use(express.json());
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/booking", async (req, res) => {
  try {
    const { name, email, phone, date, time, guests, notes } = req.body;

    if (!name || !email || !phone || !date || !time || !guests) {
      return res.status(400).json({
        message: "Please fill in all required booking fields."
      });
    }

    const html = `
      <h2>New Booking Request - Ox & Gate</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Date:</strong> ${date}</p>
      <p><strong>Time:</strong> ${time}</p>
      <p><strong>Guests:</strong> ${guests}</p>
      <p><strong>Notes:</strong> ${notes || "None"}</p>
    `;

    const { data, error } = await resend.emails.send({
      from: process.env.FROM_EMAIL,
      to: [process.env.BOOKINGS_TO_EMAIL],
      subject: `New Booking Request from ${name}`,
      html
    });

    if (error) {
      console.error("BOOKING EMAIL ERROR:", error);
      return res.status(500).json({
        message: "Could not send booking email."
      });
    }

    console.log("BOOKING EMAIL SENT:", data);

    return res.json({
      message: "Booking request sent successfully."
    });
  } catch (error) {
    console.error("BOOKING SERVER ERROR:", error);
    return res.status(500).json({
      message: "Something went wrong sending your booking."
    });
  }
});

app.post("/contact", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        message: "Please fill in all contact fields."
      });
    }

    const html = `
      <h2>New Contact Message - Ox & Gate</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `;

    const { data, error } = await resend.emails.send({
      from: process.env.FROM_EMAIL,
      to: [process.env.CONTACT_TO_EMAIL],
      subject: `New Contact Message: ${subject}`,
      html
    });

    if (error) {
      console.error("CONTACT EMAIL ERROR:", error);
      return res.status(500).json({
        message: "Could not send contact email."
      });
    }

    console.log("CONTACT EMAIL SENT:", data);

    return res.json({
      message: "Your message has been sent successfully."
    });
  } catch (error) {
    console.error("CONTACT SERVER ERROR:", error);
    return res.status(500).json({
      message: "Something went wrong sending your message."
    });
  }
});

app.get("/api/whats-on", async (req, res) => {
  try {
    const data = {
      premierLeague: [
        { date: "18 Apr 2026", event: "Brentford v Fulham" },
        { date: "19 Apr 2026", event: "Manchester City v Arsenal" },
        { date: "25 Apr 2026", event: "Arsenal v Newcastle" }
      ],
      championsLeague: [
        { date: "28 Apr 2026", event: "Semi-final first leg" },
        { date: "5 May 2026", event: "Semi-final second leg" },
        { date: "30 May 2026", event: "Final" }
      ],
      europaLeague: [
        { date: "20 May 2026", event: "Europa League Final" }
      ],
      ipl: [
        { date: "13 Apr 2026", event: "Phase two resumes" },
        { date: "24 May 2026", event: "League stage ends" }
      ],
      horseRacingUk: [
        { date: "5 Jun 2026", event: "Epsom Derby Festival" },
        { date: "16 Jun 2026", event: "Royal Ascot" },
        { date: "28 Jul 2026", event: "Goodwood Festival" }
      ],
      christianFestivals: [
        { date: "14 May 2026", event: "Ascension" },
        { date: "24 May 2026", event: "Pentecost" },
        { date: "25 Dec 2026", event: "Christmas Day" }
      ]
    };

    res.json(data);
  } catch (error) {
    console.error("WHATS ON ERROR:", error);
    res.status(500).json({ message: "Failed to load What's On data." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});