<template>
    <v-row>
        <!-- router link to the store -->
        <router-link to="/store" class="back-to-store-link ml-16 mb-2">
            <!-- Back Arrow Icon -->
            <font-awesome-icon icon="fa-solid fa-arrow-left" class="back-arrow-icon" />

            <!-- Back to Store Text -->
            <span class="back-to-store-text">{{ $t("back_to_store_link") }}</span>
        </router-link>
    </v-row>
</template>

<script>
export default {
    name: "BackToStoreRow",
};
</script>

<style scoped>
.back-to-store-link {
    padding: 0.5rem 0;
    display: flex;
    align-items: center;
    font-weight: 600;
    font-size: 1.125rem;
}

.back-to-store-link:hover {
    text-decoration: underline; /* Replace with your hover color */
}

.back-to-store-link > * {
    margin: 0 0.5rem;
}

.back-arrow-icon {
    transition: transform 0.3s ease; /* Smooth animation when moving */
}

.back-to-store-link:hover .back-arrow-icon {
    transform: translateX(-0.25rem); /* Move arrow to the left on hover */
}
</style>
