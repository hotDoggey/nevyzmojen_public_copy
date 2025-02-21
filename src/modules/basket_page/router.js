const debug = 0;
const Module = () => import("./Module.vue");
const Page = () => import("./views/BasketPage.vue");

const moduleRoute = {
    path: "/",
    component: Module,
    children: [
        /* if path starts with a / it will indicate to the router that its from the lowest level and not treated as relative */
        { name: "basket", path: "basket", component: Page },
    ],
};

export default (router) => {
    router.addRoute(moduleRoute);
};
