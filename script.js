const defaultData = {
    name: "Student Name",
    roll: "",
    college: "Your College",
    course: "B.Tech CSE",
    year: "3rd Year",
    section: "",
    email: "",
    phone: "",
    location: "",
    github: "",
    about: "Add a short introduction about yourself.",
    skills: "",
    projects: "",
    achievements: "",
    photo: ""
};

const fields = Object.keys(defaultData);
const form = document.getElementById("profileForm");

function loadData() {
    const saved = JSON.parse(localStorage.getItem("studentProfile") || "null");
    const data = { ...defaultData, ...(saved || {}) };

    fields.forEach(key => {
        const el = document.getElementById(key);
        if (el) el.value = data[key] || "";
    });
    render(data);
}

function render(data) {
    document.getElementById("displayName").textContent = data.name || "Student Name";
    document.getElementById("displayCourse").textContent =
        [data.course, data.year].filter(Boolean).join(" | ") || "Course & Year";
    document.getElementById("displayRoll").textContent = data.roll ? `Roll No: ${data.roll}` : "Roll Number";
    document.getElementById("displayCollege").textContent = data.college || "-";
    document.getElementById("displaySection").textContent = data.section || "-";
    document.getElementById("displayEmail").textContent = data.email || "-";
    document.getElementById("displayPhone").textContent = data.phone || "-";
    document.getElementById("displayLocation").textContent = data.location || "-";
    document.getElementById("displayGithub").textContent = data.github || "-";
    document.getElementById("displayAbout").textContent = data.about || "No introduction added.";

    const skills = data.skills.split(",").map(x => x.trim()).filter(Boolean);
    document.getElementById("displaySkills").innerHTML = skills.length
        ? skills.map(x => `<span>${escapeHtml(x)}</span>`).join("")
        : "<span>Not added</span>";

    const projects = data.projects.split("\n").map(x => x.trim()).filter(Boolean);
    document.getElementById("displayProjects").innerHTML = projects.length
        ? projects.map(project => {
            const parts = project.split(" - ");
            const title = parts.shift();
            return `<article><h4>${escapeHtml(title)}</h4><p>${escapeHtml(parts.join(" - ") || "Project details not added.")}</p></article>`;
        }).join("")
        : "<p>Not added</p>";

    const achievements = data.achievements.split("\n").map(x => x.trim()).filter(Boolean);
    document.getElementById("displayAchievements").innerHTML = achievements.length
        ? achievements.map(x => `<li>${escapeHtml(x)}</li>`).join("")
        : "<li>Not added</li>";

    const photo = document.getElementById("profilePhoto");
    if (data.photo) {
        photo.innerHTML = `<img src="${escapeAttribute(data.photo)}" alt="Student profile photo">`;
    } else {
        photo.textContent = "PHOTO";
    }
}

form.addEventListener("submit", event => {
    event.preventDefault();
    const data = {};
    fields.forEach(key => data[key] = document.getElementById(key).value.trim());
    localStorage.setItem("studentProfile", JSON.stringify(data));
    render(data);
    showMessage("Profile updated successfully!");
    document.getElementById("profile").scrollIntoView({ behavior: "smooth" });
});

document.getElementById("editTopBtn").addEventListener("click", () => {
    document.querySelector(".form-card").scrollIntoView({ behavior: "smooth" });
});

document.getElementById("clearBtn").addEventListener("click", () => {
    if (confirm("Clear the saved student profile?")) {
        localStorage.removeItem("studentProfile");
        loadData();
        showMessage("Profile cleared.");
    }
});

function showMessage(text) {
    const message = document.getElementById("message");
    message.textContent = text;
    message.classList.add("show");
    setTimeout(() => message.classList.remove("show"), 3000);
}

function escapeHtml(value) {
    return value.replace(/[&<>"']/g, char => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
    }[char]));
}

function escapeAttribute(value) {
    return value.replace(/"/g, "&quot;");
}

loadData();
