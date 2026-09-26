const WORKER_URL =
    "https://ТВОЙ-WORKER.workers.dev";


const STORAGE_KEY =
    "settings-app";


const SESSION_KEY =
    "settings-session";


const allToggles =
    document.querySelectorAll(
        ".behavior-toggle, .mood-toggle, .action-toggle"
    );


const loginScreen =
    document.getElementById(
        "loginScreen"
    );


const loginForm =
    document.getElementById(
        "loginForm"
    );


const passwordInput =
    document.getElementById(
        "passwordInput"
    );


const loginError =
    document.getElementById(
        "loginError"
    );


const app =
    document.getElementById(
        "app"
    );


const saveButton =
    document.getElementById(
        "saveButton"
    );


const logoutButton =
    document.getElementById(
        "logoutButton"
    );


/* =========================
   SESSION
========================= */

function getSession() {

    return localStorage.getItem(
        SESSION_KEY
    );

}


function setSession(
    token
) {

    localStorage.setItem(
        SESSION_KEY,
        token
    );

}


function clearSession() {

    localStorage.removeItem(
        SESSION_KEY
    );

}


/* =========================
   LOGIN
========================= */

async function login(
    password
) {

    const response =
        await fetch(
            WORKER_URL,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify({
                        action:
                            "login",

                        password:
                            password
                    })
            }
        );


    const result =
        await response.json();


    if (
        !response.ok ||
        !result.ok
    ) {

        throw new Error(
            result.error ||
            "Ошибка авторизации"
        );

    }


    setSession(
        result.token
    );

}


/* =========================
   LOGOUT
========================= */

function logout() {

    clearSession();

    app.classList.add(
        "app-hidden"
    );

    loginScreen.classList.remove(
        "login-hidden"
    );

    passwordInput.value = "";

    loginError.textContent = "";

    passwordInput.focus();

}


/* =========================
   SHOW APP
========================= */

function showApp() {

    loginScreen.classList.add(
        "login-hidden"
    );

    app.classList.remove(
        "app-hidden"
    );

    loadSettings();

}


/* =========================
   LOGIN FORM
========================= */

loginForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        const password =
            passwordInput.value;


        if (!password) {
            return;
        }


        loginError.textContent =
            "Проверка...";


        try {

            await login(
                password
            );


            passwordInput.value =
                "";


            loginError.textContent =
                "";


            showApp();


        } catch (error) {

            loginError.textContent =
                "Неверный пароль";

            passwordInput.select();

        }

    }
);


/* =========================
   GET SETTINGS
========================= */

function getSettings() {

    const behaviors = [];

    const moods = [];

    const actions = [];


    document
        .querySelectorAll(
            ".behavior-toggle"
        )
        .forEach(
            toggle => {

                if (
                    toggle.checked
                ) {

                    behaviors.push(
                        toggle.value
                    );

                }

            }
        );


    document
        .querySelectorAll(
            ".mood-toggle"
        )
        .forEach(
            toggle => {

                if (
                    toggle.checked
                ) {

                    moods.push(
                        toggle.value
                    );

                }

            }
        );


    document
        .querySelectorAll(
            ".action-toggle"
        )
        .forEach(
            toggle => {

                if (
                    toggle.checked
                ) {

                    actions.push(
                        toggle.value
                    );

                }

            }
        );


    return {
        behaviors:
            behaviors,

        moods:
            moods,

        actions:
            actions
    };

}


/* =========================
   LOCAL STORAGE
========================= */

function saveLocalSettings() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(
            getSettings()
        )
    );

}


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
                .forEach(
                    toggle => {

                        toggle.checked =
                            settings.behaviors
                                .includes(
                                    toggle.value
                                );

                    }
                );

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
                .forEach(
                    toggle => {

                        toggle.checked =
                            settings.moods
                                .includes(
                                    toggle.value
                                );

                    }
                );

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
                .forEach(
                    toggle => {

                        toggle.checked =
                            settings.actions
                                .includes(
                                    toggle.value
                                );

                    }
                );

        }

    } catch {

        localStorage.removeItem(
            STORAGE_KEY
        );

    }

}


/* =========================
   SWITCH ANIMATION
========================= */

function animateSwitch(
    input
) {

    const switchElement =
        input.closest(
            ".switch"
        );


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


    setTimeout(
        () => {

            switchElement.classList.remove(
                "animate-on",
                "animate-off"
            );

        },
        520
    );

}


/* =========================
   SWITCHES
========================= */

allToggles.forEach(
    toggle => {

        toggle.addEventListener(
            "change",
            () => {

                animateSwitch(
                    toggle
                );

                saveLocalSettings();

            }
        );

    }
);


/* =========================
   SAVE TO TELEGRAM
========================= */

saveButton.addEventListener(
    "click",
    async () => {

        const token =
            getSession();


        if (!token) {

            logout();

            return;

        }


        const settings =
            getSettings();


        saveLocalSettings();


        saveButton.disabled =
            true;


        saveButton.textContent =
            "Отправка...";


        try {

            const response =
                await fetch(
                    WORKER_URL,
                    {
                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json",

                            "Authorization":
                                "Bearer " +
                                token

                        },

                        body:
                            JSON.stringify({

                                action:
                                    "save",

                                settings:
                                    settings

                            })

                    }
                );


            const result =
                await response.json();


            if (
                response.status ===
                401
            ) {

                logout();

                alert(
                    "Сессия истекла. Войдите снова."
                );

                return;

            }


            if (
                !response.ok ||
                !result.ok
            ) {

                throw new Error(
                    result.error ||
                    "Ошибка отправки"
                );

            }


            saveButton.classList.add(
                "saved"
            );

            saveButton.textContent =
                "Сохранено";


            setTimeout(
                () => {

                    saveButton.classList.remove(
                        "saved"
                    );

                    saveButton.textContent =
                        "Сохранить";

                },
                1200
            );


        } catch (error) {

            console.error(
                error
            );


            saveButton.textContent =
                "Ошибка";


            alert(
                "Не удалось отправить настройки."
            );


            setTimeout(
                () => {

                    saveButton.textContent =
                        "Сохранить";

                },
                1500
            );

        } finally {

            saveButton.disabled =
                false;

        }

    }
);


/* =========================
   LOGOUT BUTTON
========================= */

logoutButton.addEventListener(
    "click",
    logout
);


/* =========================
   START
========================= */

if (getSession()) {

    showApp();

} else {

    app.classList.add(
        "app-hidden"
    );

    loginScreen.classList.remove(
        "login-hidden"
    );

    passwordInput.focus();

}


/* =========================
   SERVICE WORKER
========================= */

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
