const { defineConfig } = require("@vue/cli-service");
const webpack = require("webpack");
// Create WebSocket connection
// const socket = new WebSocket("ws://localhost:8080");

// // Listen for possible errors
// socket.addEventListener("error", (event) => {
//     console.log("WebSocket error: ", event);
// });

module.exports = defineConfig({
    // "transpileDependencies": [
    //     "vuetify",
    //     "vue-tel-input-vuetify"
    //   ]
    transpileDependencies: true,
    // devServer: {
    //     hot: true,
    //     watchOptions: {
    //         poll: 1000, // Use polling instead of WebSocket, every second
    //     },
    // },
    chainWebpack: (config) => {
        config.plugin("html").tap((args) => {
            args[0].title = "Nevyzmojen";
            return args;
        });
    },
    // configureWebpack: {
    //     plugins: [
    //         new webpack.DefinePlugin({
    //             // Vue CLI is in maintenance mode, and probably won't merge my PR to fix this in their tooling
    //             // https://github.com/vuejs/vue-cli/pull/7443
    //             __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: "false",
    //         }),
    //     ],
    // },
});
