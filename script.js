const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("show");
});

const bookingForm = document.getElementById("bookingForm");
const contactForm = document.getElementById("contactForm");
const bookingMessage = document.getElementById("bookingMessage");
const contactMessage = document.getElementById("contactMessage");

bookingForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  bookingMessage.textContent = "Sending booking request...";

  const formData = new FormData(bookingForm);
  const data = Object.fromEntries(formData.entries());

  try {
    const res = await fetch("/booking", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Booking failed");
    }

    bookingMessage.textContent = result.message;
    bookingForm.reset();
  } catch (error) {
    bookingMessage.textContent = error.message;
  }
});

contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  contactMessage.textContent = "Sending message...";

  const formData = new FormData(contactForm);
  const data = Object.fromEntries(formData.entries());

  try {
    const res = await fetch("/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Message failed");
    }

    contactMessage.textContent = result.message;
    contactForm.reset();
  } catch (error) {
    contactMessage.textContent = error.message;
  }
});
async function loadWhatsOn() {
  const eventsGrid = document.getElementById("eventsGrid");
  if (!eventsGrid) return;

  try {
    const res = await fetch("/api/whats-on");
    const data = await res.json();

    const sections = [
      { title: "Premier League", items: data.premierLeague },
      { title: "Champions League", items: data.championsLeague },
      { title: "Europa League", items: data.europaLeague },
      { title: "IPL", items: data.ipl },
      { title: "Horse Racing UK", items: data.horseRacingUk },
      { title: "Christian Festivals", items: data.christianFestivals }
    ];

    eventsGrid.innerHTML = sections.map(section => `
      <div class="event-card">
        <h3>${section.title}</h3>
        <ul>
          ${section.items.map(item => `
            <li>
              <strong>${item.date}</strong> — ${item.event}
            </li>
          `).join("")}
        </ul>
      </div>
    `).join("");

  } catch (error) {
    eventsGrid.innerHTML = "<p>Failed to load events</p>";
  }
}

loadWhatsOn();