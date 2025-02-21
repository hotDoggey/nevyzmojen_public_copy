<template>
    <div class="basket-title">{{ $t("basket") }}</div>
    <BackToStoreLink />

    <div class="center-contents">
        <v-row class="basket-items-container pt-12 ml-4 mr-4" cols="12" sm="12" md="12">
            <!-- empty basket message -->
            <v-row v-if="!basket.length" class="empty-basket" cols="12" sm="12" md="9z">
                <div>
                    {{ $t("basket_is_empty") || "Basket is empty! Go to the store to add items." }}
                </div>
            </v-row>
            <!-- basket contents -->
            <div v-else class="basket-items">
                <!-- columns row -->
                <v-row class="column-titles pt-4 pb-2 mb-6">
                    <v-col class="title-image-url">{{ $t("item") || "Item" }}</v-col>
                    <v-col class="title-item"></v-col>
                    <v-col class="title-size">{{ $t("size") || "Size" }}</v-col>
                    <v-col class="title-quantity">{{ $t("quantity") || "Quantity" }}</v-col>
                    <v-col class="title-price">{{ $t("price") || "Price" }}</v-col>
                    <v-col class="title-delete-button"></v-col>
                </v-row>
                <!-- dynamic basket item rows -->
                <v-card
                    class="item-card pt-4 pb-4 mt-4 mb-4"
                    v-for="item in basket"
                    :key="item.internalProductId"
                >
                    <v-row class="basket-item pl-4 pr-4">
                        <v-col class="basket-item-thumbnail" cols="2">
                            <v-img :src="item.images[0]" alt="Item Image" contain></v-img>
                        </v-col>
                        <v-col class="basket-item-name">{{
                            item.translations[pageLang].productName
                        }}</v-col>
                        <v-col class="basket-item-size">{{ item.size }}</v-col>
                        <v-col class="basket-item-quantity">{{ item.quantity }}</v-col>
                        <v-col class="basket-item-price">{{ item.price }}</v-col>
                        <v-col class="basket-item-delete">
                            <button
                                @click="removeProductFromBasket(item.internalProductId, item.size)"
                            >
                                <font-awesome-icon
                                    icon="fa-solid fa-trash-can"
                                    class="delete-basket-item-icon"
                                />
                            </button>
                        </v-col>
                    </v-row>
                </v-card>
                <!-- line separator and container-->
                <div class="line-separator mt-6 pt-10 pb-4">
                    <!-- Basket Summary Section -->
                    <v-row class="ml-4 mr-4 summary-section">
                        <v-col
                            cols="12"
                            md="5"
                            offset-md="1"
                            lg="5"
                            offset-lg="1"
                            class="summary-left"
                        >
                            <div class="subtotal-label">
                                {{ $t("subtotal") || "Subtotal:" }}
                            </div>
                            <div class="summary-total">
                                {{ basketTotal + " " + $t("curreny") || "BGN" }}
                            </div>
                        </v-col>
                        <v-col cols="12" md="5" lg="5" class="summary-right">
                            <v-btn
                                color="primary"
                                height="2.5rem"
                                class="checkout-button"
                                rounded="lg"
                                @click="checkout"
                                dark
                            >
                                <font-awesome-icon
                                    icon="fa-solid fa-credit-card"
                                    class="credit-card-icon"
                                />
                                {{ $t("checkout") || "Checkout" }}
                            </v-btn>
                        </v-col>
                    </v-row>
                </div>
            </div>
        </v-row>
    </div>
    <!-- sm: 600px, md: 960px, lg: 1264px.
    {{ windowWidth }} -->
</template>

<script>
import BackToStoreLink from "@/components/BackToStoreLink.vue";
export default {
    components: { BackToStoreLink },
    data() {
        return {
            windowWidth: window.innerWidth,
        };
    },
    mounted() {
        window.addEventListener("resize", this.updateWindowWidth);
    },
    beforeUnmount() {
        window.removeEventListener("resize", this.updateWindowWidth);
    },
    computed: {
        basket() {
            // get the basket from the store
            let basket = this.$store.state.basket;
            console.log("basket: ", basket.length);

            // find the other data for each product in the basket and merge it in
            basket = basket.map((basketItem) => {
                let product = this.$store.state.productsArray.find(
                    (matchedProduct) =>
                        matchedProduct.internalProductId === basketItem.internalProductId
                );
                console.log("product: ", product);
                console.log("basketItem: ", basketItem);
                return {
                    ...basketItem,
                    ...product,
                };
            });

            return basket;
        },
        basketTotal() {
            let total = this.basket.reduce(
                (total, item) => total + Number(item.price) * item.quantity,
                0
            );
            // truncate at 2decimal points and also set 15 to be 15.00
            return (Math.floor(total * 100) / 100).toFixed(2);
        },
    },
    methods: {
        updateWindowWidth() {
            this.windowWidth = window.innerWidth;
        },
        removeProductFromBasket(internalProductId, size) {
            this.$store.dispatch("deleteProductFromBasket", { internalProductId, size });
        },
        checkout() {
            this.$router.go("checkout");
        },
    },
};
</script>

<style scoped>
.empty-basket {
    font-size: 1.25rem;
    font-weight: 600;
    display: flex;
    justify-content: center;
    padding-top: 2rem;
}
.center-contents {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}
.basket-items-container {
    max-width: 1200px;
    width: 100%;
}
.column-titles > div {
    font-size: 1.35cqw;
}
.basket-title {
    font-size: 2rem;
    font-weight: 600;
}
.basket-items {
    width: 100%;
    margin: 0 6rem;
    font-size: 1.2cqw;
    padding: 0 1rem 1rem 1rem;
}
.basket-item {
    display: flex;
    align-items: center;
    font-weight: 500;
}
.column-titles {
    font-size: 1.25rem;
    font-weight: 600;
    border-bottom: 1px solid #ccc;
}
.item-card {
    border-radius: 0.75rem;
    width: 100%;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
}

.basket-items-container {
    max-width: 1200px;
    width: 100%;
}
.line-separator {
    border-top: 1px solid #ccc;
}

.subtotal-label {
    font-size: 1.5rem;
    font-weight: 500;
}
.summary-total {
    font-size: 1.5rem;
    font-weight: 500;
}
.credit-card-icon {
    margin-right: 8px; /* Adds space between the icon and text */
}

/* Summary Section Styles */
.summary-section {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    align-items: center;
}

.summary-left {
    flex: 1;
    text-align: left;
}

.summary-right {
    flex: 1;
    text-align: right;
}

.checkout-button {
    width: 100%; /* Full width on mobile */
}

/* Mobile Styles */
@media screen and (max-width: 768px) {
    .basket-title {
        font-size: 1.5rem;
        text-align: center;
    }

    .center-contents {
        padding: 0 1rem;
    }

    .basket-items-container {
        padding: 0;
    }

    .basket-items {
        margin: 0;
    }

    .column-titles {
        display: none; /* Hide column titles on mobile */
    }

    .item-card {
        margin: 0.5rem 0;
        padding: 1rem;
    }

    .basket-item {
        flex-direction: row; /* Keep items in a row */
        align-items: center;
        gap: 0.5rem; /* Add gap between items */
    }

    .basket-item-thumbnail {
        width: 30%; /* Reduce thumbnail width */
        margin-bottom: 0;
    }

    .basket-item-thumbnail .v-img {
        width: 100%;
        height: auto;
    }

    .basket-item-name,
    .basket-item-size,
    .basket-item-quantity,
    .basket-item-price,
    .basket-item-delete {
        width: auto; /* Allow columns to take up only as much space as needed */
        margin-bottom: 0;
        font-size: 0.9rem; /* Reduce font size for compactness */
    }

    .basket-item-name {
        flex: 1; /* Allow name to take up remaining space */
    }

    .basket-item-delete {
        text-align: right;
    }

    .basket-item-delete button {
        background: none;
        border: none;
        cursor: pointer;
    }

    .empty-basket {
        font-size: 1rem;
        padding-top: 1rem;
    }

    /* Summary Section Mobile Styles */
    .summary-section {
        flex-direction: column;
        align-items: stretch;
    }

    .summary-left,
    .summary-right {
        text-align: center;
    }

    .summary-left {
        margin-bottom: 1rem;
    }

    .checkout-button {
        width: 100%; /* Full width on mobile */
    }
}
</style>
