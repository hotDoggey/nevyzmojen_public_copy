import store from "../store.js"; // Import the Vuex store
// This file contains translations for all text on the page.
// If you are going to change any of the eng values - make sure to find and replace the default values in all places that
// it was used in to keep it consistent

// HOW TO USE
// use the function textVar("home") anywhere in the project. replace home with the object path to the relevant text var
// can be just home or somthing like "accountMany.welcomeTextBeforeName"
const translations = {
    // Header Vars
    "login-text": {
        en: "Log In",
        bg: "Влез",
    },
    home: {
        en: "Home",
        bg: "?вкъщи",
    },
    about: {
        en: "About",
        bg: "??",
    },
    store: {
        en: "Store",
        bg: "??",
    },
    manage_users: {
        en: "Manage Users",
        bg: "??",
    },
    account: {
        en: "Account",
        bg: "??",
    },
    accountMany: {
        welcomeTextBeforeName: {
            en: "Welcome back",
            bg: "??",
        },
        noOrdersPt1: {
            en: "It seems like you have no orders yet, click",
            bg: "??",
        },
        noOrdersPt2: {
            en: "to go to the store!",
            bg: "??",
        },
        signupText: {
            en: "Don't have an account with us yet?\nSign up by clicking",
            bg: "??",
        },
        here: {
            en: "here",
            bg: "??",
        },
    },
};
console.log("still need to remove alang.js");

// Global function used to get the correct translation for all text on the pages
function textVar(name_or_path_of_var_to_fetch) {
    // Split the input string by dots to navigate the nested structure
    const keys = name_or_path_of_var_to_fetch.split(".");
    // initialise the value to be the top level of translations object
    let value = translations;

    // Traverse the nested structure using the keys
    for (const key of keys) {
        // keep setting the value to the next level
        value = value?.[key];

        if (value === undefined) {
            return undefined;
        }
    }

    let userLang = store.getters.userLangPreference;

    // Return the value for the user's language
    return value?.[userLang];
}

export default textVar;
