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
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(getSettings())
    );
}

function loadSettings() {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
        return;
    }

    try {
        const settings = JSON.parse(saved);

        mouthToggle.checked = settings.mouthDisabled === true;

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

function animateSwitch(input) {
    const switchElement = input.closest(".switch");

    if (!switchElement) {
        return;
    }

    switchElement.classList.remove("switch-animation-on");
    switchElement.classList.remove("switch-animation-off");

    void switchElement.offsetWidth;

    if (input.checked) {
        switchElement.classList.add("switch-animation-on");
    } else {
        switchElement.classList.add("switch-animation-off");
    }

    setTimeout(() => {
        switchElement.classList.remove("switch-animation-on");
        switchElement.classList.remove("switch-animation-off");
    }, 600);
}

mouthToggle.addEventListener("change", () => {
    animateSwitch(mouthToggle);
    saveSettings();
});

moodToggles.forEach((toggle) => {
    toggle.addEventListener("change", () => {
        animateSwitch(toggle);
        saveSettings();
    });
});

loadSettings();

if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("./sw.js");
    });
}