const mouthToggle = document.getElementById("mouthToggle");
const moodInputs = document.querySelectorAll('input[name="mood"]');

function saveSettings() {
    const selectedMood = document.querySelector(
        'input[name="mood"]:checked'
    );

    const settings = {
        mouthDisabled: mouthToggle.checked,
        mood: selectedMood ? selectedMood.value : "happy"
    };

    localStorage.setItem("settings", JSON.stringify(settings));
}

function loadSettings() {
    const saved = localStorage.getItem("settings");

    if (!saved) {
        return;
    }

    try {
        const settings = JSON.parse(saved);

        mouthToggle.checked = settings.mouthDisabled === true;

        if (settings.mood) {
            const mood = document.querySelector(
                `input[name="mood"][value="${settings.mood}"]`
            );

            if (mood) {
                mood.checked = true;
            }
        }
    } catch {
        localStorage.removeItem("settings");
    }
}

mouthToggle.addEventListener("change", saveSettings);

moodInputs.forEach((input) => {
    input.addEventListener("change", saveSettings);
});

loadSettings();

if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("./sw.js");
    });
}