const debug = false;

import { createRouter, createWebHashHistory, createWebHistory } from "vue-router";
import NotFound404 from "./components/NotFound404.vue";
import store from "@/store";
import { compile } from "vue";

// create the router instance
const router = createRouter({
    history: createWebHistory(),
    // history: createWebHashHistory(),
    mode: "history", // "hash",

    // define routes and a 404 catch all (fyi the rest of the views/routes are found in the different modules)
    routes: [
        // redirect root to the store page
        { path: "/", redirect: "/store" },
        // 404 catch all
        {
            path: "/:catchAll", // if i want to void having to pass in a parameter when recirecting to a 404 page, i can replace with this "/:pathMatch(.*)*",
            name: "notFound404",
            component: NotFound404,
        },
        // {
        //     path: "/:pathMatch(.*)*",
        //     name: "notFound404",
        //     component: NotFound404,
        // },

        // {
        //     path: "/about",
        //     name: "about",
        //     // route level code-splitting
        //     // this generates a separate chunk (about.[hash].js) for this route
        //     // which is lazy-loaded when the route is visited.
        //     component: () => import("./AboutView.vue"),
        // },
    ],
});

// Global navigation guard
router.beforeEach((to, from, next) => {
    // check auth state and user object in store
    const userAuthenticated = store.getters.loggedInState;
    const isLoading = store.getters.isLoading;

    if (debug) console.log("userAuthenticated: ", userAuthenticated);
    if (debug) console.log(`isLoading: ${isLoading}`);

    // Account page access - if user is not authed, redirect to login
    if (to.path === "/account" && !userAuthenticated && !isLoading) {
        next("/login");
        if (debug) console.log("user is not authed, redirecting account page to login page");

        // Else let user through to relecant page
    } else {
        if (debug) console.log("user is allowed to this url");
        next();
    }
});

// // Function to check logged in state of user and prevent access to account pages unless signed in
// const goToLoginIfNotAuthenticated = (to, _from, next) => {
//     if (!store.getters.loggedInState && to.name !== "login") {
//         // TODO: check if they are accessing a page related to account settings or basket etc
//         if(debug) console.log(`User tried accessing a page without logging in. Redirecting to login Screen.`);
//         // Redirect to login page
//         next("/login");
//     } else {
//         // Proceed to the intended route
//         next();
//         // NOTE: There may be more restrictions for the other pages, e.g. manage users page might have an additional check for only admin roles - see that module's folder and router options
//     }
// };

// // Ensure authentication is required for accessing the user dependent pages, redirect to login page if not signed in
// router.beforeEach((to, from, next) => {
//     next();
//     // goToLoginIfNotAuthenticated(to, from, next);
// });

export default router;
