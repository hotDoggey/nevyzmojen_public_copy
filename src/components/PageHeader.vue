<template>
    <v-toolbar class="toolbar pl-6 pr-8 header" :class="{ 'mobile-always-on-top': showMenuMobile }">
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
        <div class="navigation">
            <!-- Normal nav links for big screens -->
            <nav class="nav-links desktop-view">
                <router-link to="/home">{{ $t("home") || "Home" }}</router-link>
                <router-link to="/about">{{ $t("about") || "About" }}</router-link>
                <router-link to="/store">{{ $t("store") || "Store" }}</router-link>
            </nav>

            <!-- Basket icon and badge -->
            <router-link to="/basket">
                <div class="icon-container">
                    <font-awesome-icon
                        icon="fa-solid fa-cart-shopping"
                        class="header-icon shopping-basket"
                        size="lg"
                    />
                    <span v-if="basketCount > 0" class="badge">{{ basketCount }}</span>
                </div>
            </router-link>

            <!-- Hamburger menu icon for mobile screens -->
            <font-awesome-icon
                icon="fa-solid fa-bars"
                class="header-icon mobile-view toggle-menu-icon"
                size="lg"
                @click="toggleMenu"
            />
        </div>
    </v-toolbar>

    <!-- Mobile Menu -->
    <MenuMobile
        :showMenuMobile="showMenuMobile"
        class="mobile-view"
        @toggleMenu="toggleMenu"
    ></MenuMobile>
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
    },
    computed: {
        basketCount() {
            const basket = this.$store.getters.getBasket || [];
            return basket.reduce((total, item) => total + item.quantity, 0);
        },
    },
};
</script>

<style scoped>
.header {
    background-color: var(--global-containers-background-color);
}
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
    max-width: 325px;
    height: 100%;
    padding: 5px;
    overflow: hidden;
    display: flex;
    align-items: center;
}

.nevyzmojen-page-logo {
    width: 100%;
    max-width: 100%;
    height: auto;
}

.nav-links {
    margin: auto;
    padding-right: 1rem;
    font-weight: 600;
}

.navigation a {
    margin: 0 0.5rem;
}

.header-icon {
    padding: 0 0.6rem 0 0.6rem;
}

.navigation {
    display: flex;
    align-items: center;
}

/* Hide hamburger menu by default on big screens */
.mobile-view {
    display: none;
}

@media screen and (max-width: 768px) {
    /* Show hamburger menu icon */
    .mobile-view {
        display: block;
    }

    /* Hide nav links on small devices */
    .desktop-view {
        display: none;
    }
}

/* Ensure the badge is positioned correctly and styled */
.icon-container {
    position: relative;
    display: inline-block;
}

.badge {
    position: absolute;
    top: 0;
    right: 0;
    transform: translate(0%, -50%);
    background-color: red;
    color: white;
    font-size: 0.75rem;
    font-weight: bold;
    padding: 0.1rem 0.25rem;
    border-radius: 50%;
    line-height: 1;
    z-index: 10;
}
</style>
