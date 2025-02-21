<template>
    <v-container fluid>
        <v-row class="pl-6 page-title"
            ><h1>{{ $t("store") || "Store" }}</h1></v-row
        >
        <v-row justify="center">
            <v-col cols="12" sm="12" md="3" class="pt-12 v-col-custom">Filters</v-col>
            <v-col cols="12" sm="12" md="9" class="pt-12 v-col-custom">
                <!-- Loading or empty state with skeleton placeholder-->
                <div v-if="isLoading" class="products-grid">
                    <v-skeleton-loader :elevation="1" type="card"></v-skeleton-loader>
                    <v-skeleton-loader :elevation="1" type="card"></v-skeleton-loader>
                    <v-skeleton-loader :elevation="1" type="card"></v-skeleton-loader>
                </div>

                <div class="products-grid">
                    <div v-if="productsArray.length" v-for="product in productsArray">
                        <router-link
                            :to="{
                                name: 'productPage',
                                params: { id: product.internalProductId },
                            }"
                        >
                            <!-- <v-card> -->
                            <v-img
                                :src="product.images[0]"
                                aspect-ratio="1"
                                class="white--text align-end"
                                height="100%"
                            ></v-img>
                            <v-card-title class="justify-center product-title">
                                {{
                                    $t(product.internalProductId + "ProductName") ||
                                    product.internalProductId
                                }}
                            </v-card-title>
                            <!-- </v-card> -->
                        </router-link>
                    </div>
                </div>
            </v-col>
            <!-- <button @click="addProduct">Add product</button>
            <div>{{ errorMessage }}</div> -->
        </v-row>
    </v-container>
</template>

<script>
import { VSkeletonLoader } from "vuetify/lib/components/index.mjs";
export default {
    data() {
        return {};
    },
    computed: {
        errorMessage() {
            return this.$store.getters.errorMessage;
        },
        isLoading() {
            return this.$store.getters.isLoading;
        },
        productsArray() {
            return this.$store.getters.productsArray;
        },
    },
    methods: {
        // async addProduct() {
        //     let newProduct = {
        //         internalProductId: "thirdProduct", // Unique identifier for the product (auto-generated or custom)
        //         translations: {
        //             // Translation object containing multiple languages
        //             en: {
        //                 // English translation
        //                 productName: "Nevyzmojen - The Third", // Name in English
        //                 description:
        //                     "Comfortable cotton t-shirt embroidered with unique high quality design top left", // Description in English
        //                 material: "100% cotton", // Material in English
        //                 colorOptions: [
        //                     { color: "White", image: "https://example.com/red-image.jpg" },
        //                     { color: "Blue", image: "https://example.com/blue-image.jpg" },
        //                 ],
        //                 careInstructions: "Machine wash cold. Do not bleach.", // Care instructions for the product
        //             },
        //             bg: {
        //                 // Bulgarian translation
        //                 productName: "??",
        //                 description: "??",
        //                 material: "??",
        //                 colorOptions: [
        //                     { color: "??", image: "https://example.com/red-image.jpg" },
        //                     { color: "??", image: "https://example.com/blue-image.jpg" },
        //                 ],
        //                 careInstructions: "??",
        //             },
        //         },
        //         category: "Mens T-shirts", // Product category (e.g., T-shirts, Jeans)
        //         subCategory: "Casual", // Optional subcategory (e.g., Casual, Formal)
        //         brand: "Nevyzmojen", // Brand or manufacturer of the product
        //         price: 74.99, // Price of the product
        //         currency: "BGN", // Currency code (e.g., USD, EUR)
        //         discount: {
        //             amount: 0.0, // Discount amount or percentage (e.g., 10.00 or 15%)
        //             type: "fixed", // Type of discount ('fixed' or 'percentage')
        //         },
        //         availableSizes: ["S", "M", "L", "XL"], // Array of all possible sizes for the product
        //         inStockSizes: ["S", "M", "L"], // Array of currently available sizes in stock
        //         images: [
        //             "https://www.careofcarl.com/bilder/artiklar/zoom/21502011r_1.jpg?m=1672843624", // Array of image URLs for the product
        //             "https://files.ekmcdn.com/fa1a33/images/back-to-basics-1000-plain-100-cotton-t-shirt-white-7.99-colour-white-white-size-4xl-16199-p.jpg",
        //         ],
        //         weight: "0.5kg", // Weight of the product (useful for shipping calculations)
        //         dimensions: {
        //             // Dimensions for packaging/shipping
        //             length: "30cm",
        //             width: "20cm",
        //             height: "5cm",
        //         },
        //         rating: {
        //             average: 4.5, // Average rating of the product
        //             reviewsCount: 125, // Number of reviews
        //         },
        //         releaseDate: "2024-08-01", // Date when the product was added or released
        //         isFeatured: true, // Boolean to indicate if the product is featured
        //         isActive: true, // Boolean to indicate if the product is active/visible on the store
        //         tags: ["new", "summer"], // Array of tags or keywords related to the product
        //     };
        //     let result = await this.$store.dispatch("createProductInFirestore", newProduct);
        //     if (result === true) {
        //         // if successful, redirect to the account page (TODO: maybe change to store page?)
        //         this.$store.commit("setErrorMessage", "success");
        //     } else {
        //         this.$store.commit("setErrorMessage", result);
        //     }
        // },
    },
};
</script>

<style scoped>
/* normal responsive layout always */
.products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    grid-gap: 10px; /* Gap between items */
}

a {
    text-decoration: none;
}

.product-title {
    white-space: normal;
    word-wrap: break-word;
    text-align: center;
    overflow: visible;
    font-size: 1.25rem; /* Keep the font size consistent */
    line-height: inherit; /* Maintain line-height from Vuetify defaults */
    margin: inherit; /* Avoid changing margin/padding */
}

/* Handle text wrapping */
.v-card-titlee {
    white-space: normal; /* Allow text to wrap */
    word-wrap: break-word; /* Break long words if needed */
    text-align: center; /* Optional: center the text */
    height: auto; /* Allow height to adjust to content */
    display: flex;
    align-items: center;
    justify-content: center;
}

/* when width gets too small change to mobile view */
@media screen and (max-width: 768px) {
    .products-grid {
        display: grid;
        grid-template-columns: 1fr;
        grid-gap: 10px; /* Gap between items */
    }
}
</style>
