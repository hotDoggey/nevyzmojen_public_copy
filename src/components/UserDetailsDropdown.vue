<template>
    <v-toolbar class="toolbar">
        <!-- Logo -->
        <div class="logo-container">
            <router-link to="/about">
                <img
                    class="nevyzmojen-page-logo"
                    src="@/assets/nevyzmojen_text_logo_noBG.png"
                    alt="Site Header Logo - Link to Home"
                />
            </router-link>
        </div>

        <v-spacer></v-spacer>

        <!-- Navigation Links -->

        <!-- Normal nav links for big sceens -->
        <div class="navigation">
            <nav class="nav-links desktop-view">
                <router-link to="/home">{{ $t("home") || "Home" }}</router-link>
                <router-link to="/about">{{ $t("about") || "About" }}</router-link>
                <router-link to="/store">{{ $t("store") || "Store" }}</router-link>
                <router-link to="/manage_users" v-if="true ? true : 'admin_user_logged_in_check'"
                    >{{ $t("manage_users") || "Manage Users" }}
                </router-link>
            </nav>
            <!-- Login and Basket Icons -->
            <!-- TODO: add a popover menu that shows the user's Name, Account Details, Logout OR Signup and Login<router-link to="/login" v-if="!userIsLoggedIn">Login</router-link> -->
            <font-awesome-icon icon="fa-solid fa-user" class="header-icon desktop-view" size="lg" />
            <font-awesome-icon icon="fa-solid fa-cart-shopping" class="header-icon" size="lg" />

            <!-- hamburger menu icon only for mobile screens -->
            <font-awesome-icon
                icon="fa-solid fa-bars"
                class="header-icon mobile-view toggle-menu-icon"
                size="lg"
                @click="toggleMenu"
            />
        </div>
    </v-toolbar>
    <MenuMobile
        :showMenuMobile="showMenuMobile"
        class="mobile-view"
        @toggleMenu="toggleMenu"
    ></MenuMobile>
    <!-- <div class="error-message" v-if="stateErrorMsg">Error message: {{ stateErrorMsg }}</div> -->
    <div class="account-manage-popover"></div>
</template>

<script>
import MenuMobile from "./MenuMobile.vue";
export default {
    components: {
        MenuMobile,
    },
    data() {
        return {
            showMenuMobile: false,
        };
    },
    methods: {
        toggleMenu() {
            this.showMenuMobile = !this.showMenuMobile;
        },
        // Add more methods as needed
    },
};
</script>

<style scoped>
.toolbar {
    padding: 1.25rem;
    font-size: 1.5rem;
    color: var(--text-color);
    display: flex;
    padding: 0pt 10pt 0pt 10pt;
    height: var(--header-height);
    justify-content: center;
    z-index: 100;
}

.logo-container {
    max-width: 325px; /* Adjust the maximum width of the logo-container as needed */
    height: 100%;
    padding: 5px; /* Add padding around the logo if desired */
    overflow: hidden; /* to ensure the image doesn't overflow the container */
    display: flex; /* Use flexbox */
    align-items: center; /* Center items vertically */
}

.nevyzmojen-page-logo {
    width: 100%; /* to fill the container horizontally */
    max-width: 100%; /* to prevent the image from exceeding the container's width */
    height: auto; /* to maintain the aspect ratio */
}

.nav-links {
    margin: auto;
    padding-right: 1rem;
    padding-top: auto;
    font-weight: bold;
    font-weight: 500;
}

.nav-links * {
    text-decoration: none;
    margin: 0 0.5rem;
}
.navigation a:visited {
    color: var(--text-color) /* your desired color */;
}
nav a.router-link-exact-active {
    text-decoration: underline;
}
nav a:hover {
    text-decoration: underline;
}
.error-message {
    color: red;
}
.header-icon {
    padding: 0 0.6rem 0 0.6rem;
}

.navigation {
    display: flex;
    align-items: center;
}

/* hide hamburger menu by default on big screens */
.mobile-view {
    display: none;
}

@media screen and (max-width: 768px) {
    /* show hamburger menu icon */
    .mobile-view {
        display: block;
    }

    /* Hide nav links on small devices */
    .desktop-view {
        display: none;
    }
}
.account-manage-popover {
    position: absolute;

    display: flex;
}
</style>
