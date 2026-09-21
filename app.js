const mouthToggle = document.getElementById("mouthToggle");
const moodToggles = document.querySelectorAll(".mood-toggle");

const STORAGE_KEY = "settings-app";

function getSettings() {
    const moods = [];

    moodToggles.forEach((toggle) => {
        if (toggle.checked) {
            moods.push(toggle.value);
        }
    });

    return {
        mouthDisabled: mouthToggle.checked,
        moods: moods
    };
}

function saveSettings() {
    const settings = getSettings();

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(settings)
    );
}

function loadSettings() {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
        return;
    }

    try {
        const settings = JSON.parse(saved);

        mouthToggle.checked =
            settings.mouthDisabled === true;

        if (Array.isArray(settings.moods)) {
            moodToggles.forEach((toggle) => {
                toggle.checked =
                    settings.moods.includes(toggle.value);
            });
        }
    } catch {
        localStorage.removeItem(STORAGE_KEY);
    }
}

mouthToggle.addEventListener(
    "change",
    saveSettings
);

moodToggles.forEach((toggle) => {
    toggle.addEventListener(
        "change",
        saveSettings
    );
});

loadSettings();

if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("./sw.js");
    });
}