const allToggles = document.querySelectorAll(
    ".behavior-toggle, .mood-toggle, .action-toggle"
);

const STORAGE_KEY = "settings-app";


function getSettings() {

    const behaviors = [];
    const moods = [];
    const actions = [];


    document
        .querySelectorAll(".behavior-toggle")
        .forEach((toggle) => {

            if (toggle.checked) {
                behaviors.push(toggle.value);
            }

        });


    document
        .querySelectorAll(".mood-toggle")
        .forEach((toggle) => {

            if (toggle.checked) {
                moods.push(toggle.value);
            }

        });


    document
        .querySelectorAll(".action-toggle")
        .forEach((toggle) => {

            if (toggle.checked) {
                actions.push(toggle.value);
            }

        });


    return {
        behaviors: behaviors,
        moods: moods,
        actions: actions
    };
}


function saveSettings() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(getSettings())
    );
}


function loadSettings() {

    const saved =
        localStorage.getItem(STORAGE_KEY);


    if (!saved) {
        return;
    }


    try {

        const settings =
            JSON.parse(saved);


        if (Array.isArray(settings.behaviors)) {

            document
                .querySelectorAll(".behavior-toggle")
                .forEach((toggle) => {

                    toggle.checked =
                        settings.behaviors.includes(
                            toggle.value
                        );

                });

        }


        if (Array.isArray(settings.moods)) {

            document
                .querySelectorAll(".mood-toggle")
                .forEach((toggle) => {

                    toggle.checked =
                        settings.moods.includes(
                            toggle.value
                        );

                });

        }


        if (Array.isArray(settings.actions)) {

            document
                .querySelectorAll(".action-toggle")
                .forEach((toggle) => {

                    toggle.checked =
                        settings.actions.includes(
                            toggle.value
                        );

                });

        }

    } catch {

        localStorage.removeItem(
            STORAGE_KEY
        );

    }
}


function animateSwitch(input) {

    const switchElement =
        input.closest(".switch");


    if (!switchElement) {
        return;
    }


    switchElement.classList.remove(
        "animate-on",
        "animate-off"
    );


    void switchElement.offsetWidth;


    switchElement.classList.add(
        input.checked
            ? "animate-on"
            : "animate-off"
    );


    setTimeout(() => {

        switchElement.classList.remove(
            "animate-on",
            "animate-off"
        );

    }, 520);
}


allToggles.forEach((toggle) => {

    toggle.addEventListener(
        "change",
        () => {

            animateSwitch(toggle);

            saveSettings();

        }
    );

});


loadSettings();


if ("serviceWorker" in navigator) {

    window.addEventListener(
        "load",
        () => {

            navigator.serviceWorker.register(
                "./sw.js"
            );

        }
    );

}
