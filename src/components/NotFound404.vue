<template>
    <!-- had to wrap the below in a single div to create a single root component, prevents warning message: Extraneous non-props attributes (class) were passed to component -->
    <div>
        <h2>404</h2>
        <h3>Page not found</h3>
        <div v-if="isNotFound">
            <div>
                Product you searched doesn't exist. Please visit the store to view our whole
                collection.
            </div>
            <router-link to="/store">Store</router-link>
        </div>
        <div v-else>
            You seem a little lost, please find your way back Home by clicking
            <router-link to="/home">here</router-link>.
        </div>
    </div>
</template>

<script>
export default {
    computed: {
        isNotFound() {
            // Access the 'catchAll' route param and check if it's 'not-found'
            return this.$route.params.catchAll === "product-not-found";
        },
    },
};
</script>

<style></style>
