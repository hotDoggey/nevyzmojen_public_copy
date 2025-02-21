<template>
    <PageHeader></PageHeader>
    <router-view class="router-view" />

    <PageFooter></PageFooter>
</template>

<script>
import PageHeader from "./components/PageHeader.vue";
import PageFooter from "./components/PageFooter.vue";
export default {
    components: {
        PageHeader,
        PageFooter,
    },
    mounted() {},
};
</script>

<style>
/* GLOBAL VARS AND STYLING */
:root {
    /* standard colors */
    --primary-color: #333;
    --secondary-color: #bfc1c3;
    --accent-color: #ffffff;
    --global-containers-background-color: rgb(240, 240, 240);
    --text-color: #05101b;
    --error-color: rgb(169, 6, 6);
    /* darker versions */
    --primary-color-darker: hsl(from var(--primary-color) h s calc(l - 10%));
    --secondary-color-darker: hsl(from var(--secondary-color) h s calc(l - 10%));
    /* lighter versions */
    --primary-color-lighter: #373737;
    /* --secondary-color-lighter: hsl(from var(--secondary-color) h s calc(l + 10%)); */
    /* additional global coloring */
    --primary-btn-text-color: #fff;

    /* gobal styling */
    color: var(--text-color);
    background-color: var(--global-containers-background-color);

    /* specific content sizing */
    --header-height: 135px; /* Header height */
}
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

.router-view {
    background-color: var(--global-containers-background-color);
    flex-grow: 1; /* Allow the main content to grow */
}
/* Prevent visited links from showing the default purple color */
a:visited {
    color: var(--text-color); /* Same color as default */
}
/* BUTTON styles */

/* Primary Button Styles */
button.primary-btn {
    background-color: var(--primary-color);
    color: var(--primary-btn-text-color);
    border-width: 1px;
    border-radius: 4px;
    cursor: pointer;
}
/* on hover */
button.primary-btn:hover {
    background-color: var(--primary-color-lighter);
}
/* Disabled */
button.disabled {
    background-color: #e0e0e0; /* Light gray background for disabled */
    color: #999; /* Gray text for disabled */
    border-color: #e0e0e0; /* No border for disabled */
    cursor: not-allowed; /* Not-allowed cursor for disabled */
}

/* links should not have the default underline */
a {
    text-decoration: none;
}
/* an active router link or hovered ones should be underlined */
nav a.router-link-exact-active {
    text-decoration: underline;
}
nav a:hover {
    text-decoration: underline;
}

/* used to hide stuff all around the application */
.hidden {
    display: none !important;
}
.vis-bor {
    border: 1px solid rgb(247, 106, 12); /* for visualization */
}
.vis-bor2 {
    border: 1px solid rgb(67, 247, 12); /* for visualization */
}
.hint-text {
    color: rgb(196, 196, 197);
}
.error-message {
    color: var(--error-color);
}
/* used on account details page */
.internal-link {
    font-weight: 500;
    text-decoration: underline;
    font-size: medium;
}
</style>
