<template>
    <div class="basket-title">{{ $t("basket") }}</div>
    <BackToStoreLink />

    <div class="center-contents">
        <v-row class="basket-items-container pt-12 ml-4 mr-4" cols="12" sm="12" md="12">
            <!-- empty basket message -->
            <v-row v-if="!basket.length" class="empty-basket" cols="12" sm="12" md="9z">
                <div>
                    {{
                        $t("basket_is_empty") || "Basket is empty! Go to the store to add **link**"
                    }}
                </div>
            </v-row>
            <!-- day of musemum he heard you say about the tickets and was annoyed at that -->
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
                <div class="line-separator mt-8 mb-4">
                    <!-- Basket Summary Section -->
                    <v-row class="mt-6 ml-4 mr-4" align="center">
                        <v-col>
                            <v-row>
                                <v-col cols="1" class=""></v-col>
                                <v-col cols="4" class="subtotal-label text-left">
                                    {{ $t("subtotal") || "Subtotal:" }}
                                </v-col>
                                <v-col cols="4" class="summary-total text-left">{{
                                    basketTotal
                                }}</v-col>
                            </v-row>
                        </v-col>
                        <v-col class="">
                            <v-row>
                                <v-col cols="3" class=""></v-col>
                                <v-col cols="8">
                                    <v-btn
                                        color="primary"
                                        height="2.5rem"
                                        min-width="18rem"
                                        rounded="lg"
                                        class="checkout-btn"
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
                                <v-col cols="1" class=""></v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                </div>
            </div>
        </v-row>
    </div>
</template>

<script>
import BackToStoreLink from "@/components/BackToStoreLink.vue";
export default {
    components: { BackToStoreLink },
    mounted() {},
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
            return "£23.56";
        },
    },
    methods: {
        removeProductFromBasket(internalProductId, size) {
            this.$store.dispatch("deleteProductFromBasket", { internalProductId, size });
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
    font-size: 1.8cqw;
    font-weight: 500;
}
.summary-total {
    font-size: 1.8cqw;
    font-weight: 500;
}
.credit-card-icon {
    margin-right: 8px; /* Adds space between the icon and text */
}
.checkout-btn {
    font-size: 1.5cqw;
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
}
</style>
