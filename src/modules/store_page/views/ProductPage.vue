<template>
    <v-container fluid>
        <BackToStoreLink />
        <!-- Product Details -->
        <div v-if="!productsArray.length">Loading product...</div>
        <div v-else>
            <div v-if="isValidProduct">
                <v-row>
                    <!-- product images -->
                    <v-col cols="12" sm="12" md="6" class="pt-6">
                        <!-- <v-card > -->
                        <v-carousel show-arrows="hover" cover hide-delimiters height="auto">
                            <v-carousel-item v-for="imgUrl in currentProduct.images" :key="imgUrl">
                                <img :src="imgUrl" class="carousel-image" alt="Product image"
                            /></v-carousel-item>
                        </v-carousel>
                        <!-- </v-card> -->
                    </v-col>

                    <!-- product details -->
                    <v-col cols="12" sm="12" md="5" class="pt-10 pl-6 product-details">
                        <!-- product title -->
                        <v-row class="pb-2 product-title">
                            {{ currentProduct.translations[pageLang].productName }}
                        </v-row>

                        <!-- price -->
                        <v-row class="pb-12 product-price">
                            {{ currentProduct.price }} {{ $t("currency") || "BGN" }}
                        </v-row>

                        <v-row class="item-description">
                            {{
                                $t(currentProduct.internalProductId + "ProductDescription") ||
                                product.internalProductId
                            }}
                        </v-row>

                        <!-- size select -->
                        <v-row class="pt-6 pb-2 select-size">
                            <div class="size-title">{{ $t("select_size") || "SELECT SIZE:" }}</div>
                            <!-- <div class="size-chart-link-container pl-4">
                                <font-awesome-icon
                                    icon="fa-solid fa-ruler size-chart-icon"
                                    size="md"
                                />

                                <div class="size-chart-text pl-2">
                                    {{ $t("size_chart_link") || "Size chart" }}
                                </div>
                            </div> -->
                        </v-row>
                        <v-row>
                            <div class="size-buttons" @click="setSelectedSize">
                                <!-- prettier-ignore -->
                                <button v-for="size in currentProduct.availableSizes" :key="size" :data-btn-size="size" class="pt-2 pb-2 pl-4 pr-4 ml-0 size-button btn" :class="{ 'disabled': !checkInStock(size) }">
                                    {{ size }}
                                </button>
                            </div>
                        </v-row>
                        <v-row class="pt-8">
                            <button
                                class="pt-4 pb-4 add-to-chart-btn btn primary-btn"
                                :class="{ disabled: !selectedSize }"
                                @click="addToChart(currentProduct)"
                            >
                                {{ $t("add_to_basket") || "Add to Chart" }}
                            </button>
                        </v-row>
                    </v-col>
                </v-row>
            </div>
        </div>
    </v-container>
</template>

<script>
import BackToStoreLink from "@/components/BackToStoreLink.vue";
export default {
    components: { BackToStoreLink },
    props: ["id"],
    data() {
        return {
            isValidProduct: false,
            selectedSize: "",
        };
    },
    mounted() {
        this.fetchProduct(); // Get the product details on mounted (if they refresh the site entirely and land on that page)
    },
    watch: {
        id() {
            this.fetchProduct(); // Watch for route changes and fetch new product data if we come from the store page or another place
        },
    },

    methods: {
        setSelectedSize(elTrigger) {
            let target = elTrigger.target;
            // check if button (not container) was clicked and that its not disabled
            if (
                target.classList.contains("size-button") &&
                !target.classList.contains("disabled")
            ) {
                // set data prop with the clicked on button data attribute
                this.selectedSize = target.getAttribute("data-btn-size");

                // get all select-size buttons
                let allSizebuttons = target.closest(".size-buttons").querySelectorAll("button");

                // remove selected class from all buttons
                allSizebuttons.forEach((btn) => {
                    btn.classList.remove("selected");
                });

                // add selected class to clicked on button
                target.classList.add("selected");
            }
        },
        fetchProduct() {
            // Fetch products if not already done
            if (!this.productsArray.length) {
                this.$store.dispatch("fetchProductsFromFirestore").then(() => {
                    this.checkProductExists();
                });
            } else {
                this.checkProductExists(); // If products are already fetched, just check for the current product
            }
        },
        // redirect to error404 page if product doesnt exist
        checkProductExists() {
            const productExists = this.productsArray.some(
                (product) => product.internalProductId === this.id
            );

            if (productExists) {
                this.isValidProduct = true; // If valid, set data var and allow display of it in the template
            } else {
                // if current route is not notFound404 (prevent infinite redirect)
                if (this.$route.name != "notFound404") {
                    //"productPage") { delete if unneeded
                    this.$router.replace({
                        name: "notFound404",
                        params: { catchAll: "product-not-found" }, // can omit this if I set main router.js 404 path to
                    }); // Redirect to a 404 error page
                }
            }
        },
        checkInStock(size) {
            return this.currentProduct.inStockSizes.includes(size);
        },
        addToChart(currentProduct) {
            // check a valid size is selected and the button should not be disabled
            if (this.selectedSize && currentProduct.availableSizes.includes(this.selectedSize)) {
                console.log("this.$store: ", this.$store.dispatch);
                this.$store.dispatch("addProductToBasket", {
                    internalProductId: currentProduct.internalProductId,
                    quantity: 1,
                    size: this.selectedSize,
                });
            }
        },
    },

    computed: {
        productsArray() {
            return this.$store.getters.productsArray;
        },
        currentProduct() {
            return this.productsArray.find((product) => product.internalProductId == this.id);
        },
        errorMessage() {
            return this.$store.getters.errorMessage;
        },
    },
};
</script>

<style>
.carousel-image {
    width: 500px;
    /* object-fit: contain;  */
    /* Maintains aspect ratio, fits entire image */
}

.product-title {
    font-size: 2rem;
    font-weight: 600;
}
.product-price {
    font-size: 1.25rem;
    font-weight: 600;
}

.item-description {
    text-align: left;
    width: 90%;
}

.size-chart-link-container {
    display: flex;
    align-items: center;
}

.size-buttons {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    font-weight: 600;
}
.select-size {
    font-weight: 500;
}

/* General Button Style */
.size-button {
    background-color: #f0f0f0; /* Light background */
    color: #333; /* Dark text */
    border: 2px solid #ccc; /* Light border */
    border-radius: 5px; /* Rounded corners */
    padding: 10px;
    margin: 0 0.75rem;
    font-size: 16px; /* Font size */
    cursor: pointer; /* Change cursor to pointer on hover */
    transition: background-color 0.3s, border-color 0.3s, transform 0.2s; /* Smooth transitions */
}

/* Hover Effect size buttons */
.size-button:hover {
    background-color: #333; /* Dark background on hover */
    color: var(--primary-btn-text-color); /* Light text on hover */
    border-color: #333; /* Dark border on hover */
    transform: scale(1.05); /* Slightly enlarge button on hover */
}

/* Selected Button */
.size-button.selected {
    background-color: #565555; /* Blue background when selected */
    color: #fff; /* White text when selected */
    border-color: #333; /* Blue border when selected */
}

/* Responsive Style */
@media (max-width: 600px) {
    .size-button {
        padding: 8px 16px; /* Smaller padding on small screens */
        font-size: 14px; /* Smaller font size on small screens */
    }
}

/* Add to Chart button */
.add-to-chart-btn {
    width: 95%;
}

/* Hover Effect add-to-chart button */
.add-to-chart-btn:hover {
    transform: scale(1.01); /* Slightly enlarge button on hover */
}
</style>
