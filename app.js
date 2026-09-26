const allToggles = document.querySelectorAll(
    ".behavior-toggle, .mood-toggle, .action-toggle"
);

const saveButton =
    document.getElementById("saveButton");


const STORAGE_KEY =
    "settings-app";


/*
 * СЮДА ПОТОМ ВСТАВИТЬ
 * АДРЕС CLOUDFLARE WORKER
 */

const WORKER_URL =
    "https://andrey-settings.andrey-765-sereda.workers.dev";


/* ПОЛУЧЕНИЕ НАСТРОЕК */

function getSettings() {

    const behaviors = [];
    const moods = [];
    const actions = [];


    document
        .querySelectorAll(".behavior-toggle")
        .forEach((toggle) => {

            if (toggle.checked) {

                behaviors.push(
                    toggle.value
                );

            }

        });


    document
        .querySelectorAll(".mood-toggle")
        .forEach((toggle) => {

            if (toggle.checked) {

                moods.push(
                    toggle.value
                );

            }

        });


    document
        .querySelectorAll(".action-toggle")
        .forEach((toggle) => {

            if (toggle.checked) {

                actions.push(
                    toggle.value
                );

            }

        });


    return {

        behaviors:
            behaviors,

        moods:
            moods,

        actions:
            actions

    };
}


/* ЛОКАЛЬНОЕ СОХРАНЕНИЕ */

function saveSettings() {

    localStorage.setItem(

        STORAGE_KEY,

        JSON.stringify(
            getSettings()
        )

    );
}


/* ЗАГРУЗКА */

function loadSettings() {

    const saved =
        localStorage.getItem(
            STORAGE_KEY
        );


    if (!saved) {
        return;
    }


    try {

        const settings =
            JSON.parse(saved);


        if (
            Array.isArray(
                settings.behaviors
            )
        ) {

            document
                .querySelectorAll(
                    ".behavior-toggle"
                )
                .forEach((toggle) => {

                    toggle.checked =
                        settings.behaviors.includes(
                            toggle.value
                        );

                });

        }


        if (
            Array.isArray(
                settings.moods
            )
        ) {

            document
                .querySelectorAll(
                    ".mood-toggle"
                )
                .forEach((toggle) => {

                    toggle.checked =
                        settings.moods.includes(
                            toggle.value
                        );

                });

        }


        if (
            Array.isArray(
                settings.actions
            )
        ) {

            document
                .querySelectorAll(
                    ".action-toggle"
                )
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


/* АНИМАЦИЯ ПЕРЕКЛЮЧАТЕЛЯ */

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


/* ПЕРЕКЛЮЧАТЕЛИ */

allToggles.forEach((toggle) => {

    toggle.addEventListener(
        "change",
        () => {

            animateSwitch(toggle);

            saveSettings();

        }
    );

});


/* КНОПКА СОХРАНИТЬ */

if (saveButton) {

    saveButton.addEventListener(
        "click",
        async () => {

            if (
                !WORKER_URL ||
                WORKER_URL.includes(
                    "ТВОЙ-WORKER"
                )
            ) {

                alert(
                    "Сначала укажи адрес Cloudflare Worker в app.js"
                );

                return;
            }


            const settings =
                getSettings();


            saveSettings();


            saveButton.disabled =
                true;


            saveButton.classList.remove(
                "saved"
            );


            const buttonText =
                saveButton.querySelector(
                    ".save-button-text"
                );


            if (buttonText) {

                buttonText.textContent =
                    "Отправка...";

            }


            try {

                const response =
                    await fetch(
                        WORKER_URL,
                        {
                            method:
                                "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    settings
                                )
                        }
                    );


                const result =
                    await response.json();


                if (
                    !response.ok ||
                    !result.ok
                ) {

                    throw new Error(
                        "Telegram request failed"
                    );

                }


                saveButton.classList.add(
                    "saved"
                );


                if (buttonText) {

                    buttonText.textContent =
                        "Сохранено";

                }


                setTimeout(() => {

                    saveButton.classList.remove(
                        "saved"
                    );


                    if (buttonText) {

                        buttonText.textContent =
                            "Сохранить";

                    }

                }, 1200);


            } catch (error) {

                console.error(
                    error
                );


                if (buttonText) {

                    buttonText.textContent =
                        "Ошибка";

                }


                setTimeout(() => {

                    if (buttonText) {

                        buttonText.textContent =
                            "Сохранить";

                    }

                }, 1500);


                alert(
                    "Не удалось отправить настройки в Telegram."
                );

            } finally {

                saveButton.disabled =
                    false;

            }

        }
    );

}


/* ЗАПУСК */

loadSettings();


/* SERVICE WORKER */

if (
    "serviceWorker" in navigator
) {

    window.addEventListener(
        "load",
        () => {

            navigator.serviceWorker.register(
                "./sw.js"
            );

        }
    );

}
