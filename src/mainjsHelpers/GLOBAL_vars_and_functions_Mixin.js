// this helper exports a mixin, this is used for setting global properties and methods that can be used
// in all other places in the App. For example the textVar method can be used directly in the template of pages to fetch
// the correct translation for the given text Example: <router-link to="/about">{{ textVar("about") }} | </router-link>

import store from "../store.js"; // Import the Vuex store
// import textVar from "@/assets/xlang.js";

export default {
    computed: {
        // User details composite to be used later when fetching data from the store as this contains the
        // auth token that should stop users from accessing data that doesnt belong to them
        userDetails() {
            return store.getters.userDetails;
        },

        // TODO: add auth token computed property

        // Get the user lang value
        userLang() {
            return this.userDetails.language;
        },

        userAuthenticated() {
            return store.getters.loggedInState;
        },

        isLoading() {
            return store.getters.isLoading;
        },
        pageLang() {
            return this.$store.getters.pageLang;
        },
    },
    methods: {
        // make the textVar function global to be used to get the correct translation for all text on the pages
        // textVar: textVar,
    },
};
