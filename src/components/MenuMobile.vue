<template>
    <v-slide-y-transition>
        <div class="menu-mobile" v-if="showMenuMobile" @click="toggleMenuVisibility">
            <v-list class="router-links vis-bor">
                <router-link to="/home">
                    <v-list-item class="v-list-item">
                        <div>{{ $t("home") || "Home" }}</div>
                    </v-list-item>
                </router-link>
                <router-link to="/about">
                    <v-list-item class="v-list-item">
                        <div>{{ $t("about") || "About" }}</div>
                    </v-list-item>
                </router-link>
                <router-link to="/store">
                    <v-list-item class="v-list-item">
                        <div>{{ $t("store") || "Store" }}</div>
                    </v-list-item>
                </router-link>
                <!-- <router-link :to="userAuthenticated ? '/account' : '/login'">
                    <v-list-item class="v-list-item">
                        <div>{{ $t("account") || "Account" }}</div>
                    </v-list-item>
                </router-link>

                <router-link to="/manage_users" v-if="true ? true : 'admin_user_logged_in_check'">
                    <v-list-item class="v-list-item">
                        <div>{{ $t("manage_users") || "Manage Users" }}</div>
                    </v-list-item>
                </router-link> -->
            </v-list>
        </div>
    </v-slide-y-transition>
</template>

<script>
export default {
    props: ["showMenuMobile"],
    data() {
        return {};
    },
    mounted() {
        // You can trigger the slide-in animation on component mount or through some event
        this.showList = true;
    },
    methods: {
        toggleMenuVisibility(event) {
            console.log(event);
            this.$emit("toggleMenu");
        },
    },
};
</script>

<style scoped>
.menu-mobile {
    position: fixed;
    top: var(--header-height);
    right: 0;
    height: 100%;
    width: 100%;
    z-index: 90;
    background-color: var(--global-containers-background-color);
    text-decoration: none;
}
.v-list-item:hover {
    cursor: pointer;
    background-color: var(--accent-color);
}
.router-links a.router-link-exact-active {
    color: var(--text-color);
    text-decoration: underline;
}

.v-list {
    padding-bottom: 0;
    background-color: inherit;
}
.router-links > * {
    text-decoration: none;
    font-weight: 500;
}
.v-list-item {
    color: var(--text-color);
    font-size: 1.5rem;
}
.v-card {
    text-decoration: none;
}
</style>
