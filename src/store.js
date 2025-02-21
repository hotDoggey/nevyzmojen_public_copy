const debug = false;

import { createStore } from "vuex";
import {
    firebaseApp,
    firebaseAuth,
    firestoreDB,
    doc,
    collection,
    addDoc,
    getDoc,
    getDocs,
    setDoc,
    signOut,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    serverTimestamp,
} from "@/mainjsHelpers/FirestoreSetup";
import router from "./router";
import i18n from "./assets/text_translations/i18n.js";
import { compile } from "vue";

let store = createStore({
    state: {
        // populated with an object with user details as properties such as lang, name, email etc..
        userDetails: {},
        isLoading: true,
        productsArray: [],
        errorMessage: null,
        fallback_lang: "en",
        basket: [],
    },
    getters: {
        userDetails: (state) => state.userDetails,
        loggedInState: (state) => Object.keys(state.userDetails).length !== 0,
        userLangPreference: (state) => state.userDetails.userLang || "bg", //default to bg lang, change to user set lang if user details available
        pageLang: (state) => i18n.global.locale,
        isLoading: (state) => state.isLoading,
        productsArray: (state) => state.productsArray,
        errorMessage: (state) => state.errorMessage,
        getBasket: (state) => state.basket,
    },
    mutations: {
        // Set the user details fetched from firestore on login within the state
        setUserDetails: (state, userData) => (state.userDetails = userData),
        storeProductsArray: (state, productsArray) => (state.productsArray = productsArray),
        setErrorMessage: (state, messageStr) => (state.errorMessage = messageStr),
        setIsLoading: (state, val) => (state.isLoading = val),
        // Add product or increase quantity if it already exists
        addProductToBasket: (state, product) => {
            const existingProduct = state.basket.find(
                (item) =>
                    item.internalProductId === product.internalProductId &&
                    item.size === product.size
            );
            if (existingProduct) {
                existingProduct.quantity += product.quantity;
            } else {
                state.basket.push({ ...product }); // this is the simple product version with id, quantity and size TODO: might need to add quantity:1 here?
            }
        },
        // Decrease product quantity or remove from basket if quantity reaches 0
        removeProductFromBasket: (state, { internalProductId, size }) => {
            const existingProductIndex = state.basket.findIndex(
                (item) => item.internalProductId === internalProductId && item.size === size
            );

            if (existingProductIndex !== -1) {
                const product = state.basket[existingProductIndex];
                if (product.quantity > 1) {
                    product.quantity -= 1;
                } else {
                    state.basket.splice(existingProductIndex, 1); // Remove the product completely
                }
            }
        },
        // Completely delete a product from the basket
        deleteProductFromBasket: (state, { internalProductId, size }) => {
            state.basket = state.basket.filter(
                (item) => item.internalProductId !== internalProductId || item.size !== size
            );
        },
        // Set the entire basket (from local storage)
        setBasket: (state, basketValue) => (state.basket = basketValue),
    },
    actions: {
        changeLang: ({ dispatch, commit, state }, newLang) => {
            i18n.global.locale = newLang;
        },
        // based on persistance and autosign in check in FirestoreSetup
        fetchUserData: async ({ dispatch, commit, state }, userObjectFromFirestore) => {
            if (debug)
                console.log(
                    "userObjectFromFirestore in fetchUserData action: ",
                    userObjectFromFirestore
                );
            // set loading state
            commit("setIsLoading", true);

            // Fetch user data from Firestore using the UID
            try {
                // define a document reference
                const userDocRef = doc(firestoreDB, "users", userObjectFromFirestore.uid);
                // fetch the actual data
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                    let userData = userDoc.data();
                    // add the userObject given by auth to the stored data obj
                    userData.user = userObjectFromFirestore;
                    if (debug) console.log("User data:", userData);
                    // set the xstore state item for userdetails to the return object
                    commit("setUserDetails", userData);

                    // update the locale for translations in i18n based on user selected language
                    i18n.global.locale = userData.language;
                    console.log(
                        "set the default locale of i18n to the one in firestore loggedin user preferences: ",
                        i18n.global.locale
                    );
                } else {
                    console.error("No such user document!");
                    dispatch("signUserOut");
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }

            // change loading state
            commit("setIsLoading", false);
        },
        signUserInWithEmail: async ({ commit, state }, userCredentials) => {
            // initialise return state
            let returnState;
            commit("setIsLoading", true);
            // complete sign in method using provided details

            try {
                let user = await signInWithEmailAndPassword(
                    firebaseAuth,
                    userCredentials.email,
                    userCredentials.password
                );
                if (debug) console.log(`signUserInWithEmail xstore succeeded: ${user}`);
                returnState = true;
            } catch (err) {
                if (debug) console.log(`There was an error: ${err}`);
                returnState = err;
            }

            state.isLoading = false;
            return returnState;
        },
        signUserOut: async ({ commit, state }) => {
            signOut(firebaseAuth)
                .then(() => {
                    if (debug) console.log("User signed out");
                    // clear the user object in xstore
                    commit("setUserDetails", {});
                })
                .catch((error) => {
                    console.error("Error signing out:", error);
                });
        },
        createUserInFirestore: async ({ commit, state }, enteredSignupData) => {
            try {
                const userObjectFromFirestore = await createUserWithEmailAndPassword(
                    firebaseAuth,
                    enteredSignupData.email,
                    enteredSignupData.password
                );

                if (debug) console.log("success signing up");

                // Create the correct structure to be stored for this new user
                let userData = {
                    first_name: enteredSignupData.first_name,
                    surname: enteredSignupData.surname,
                    email: enteredSignupData.email,
                    basket: [],
                    orders: [],
                    phone_number: {
                        country_code: enteredSignupData.country_code,
                        number: enteredSignupData.number,
                    },
                    language: "bg",
                    createdAt: serverTimestamp(),
                };

                // Create an entry in the users table with the additional user data
                await setDoc(doc(firestoreDB, "users", userObjectFromFirestore.user.uid), userData);

                // Return true to indicate success
                return true;
            } catch (error) {
                console.error("Error creating account:", error);
                // Return the error message
                return error.message;
            }
        },
        createProductInFirestore: async ({ commit, state }, productData) => {
            try {
                // Create an entry in the users table with the additional user data
                await addDoc(collection(firestoreDB, "products"), productData);

                // Return true to indicate success
                return true;
            } catch (error) {
                console.error("Error creating account:", error);
                // Return the error message
                return error.message;
            }
        },
        async fetchProductsFromFirestore({ commit, state }) {
            let offlineTest = 1;
            commit("setIsLoading", true);
            if (offlineTest) {
                let productsArray = [
                    {
                        internalProductId: "thirdProduct", // Unique identifier for the product (auto-generated or custom)
                        translations: {
                            // Translation object containing multiple languages
                            en: {
                                // English translation
                                productName: "Nevyzmojen - Oversize T-shirt Black", // Name in English
                                description:
                                    "Comfortable cotton t-shirt embroidered with unique high quality design of our logo front and center. Unique back design featuring our message to the world. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam laoreet leo id justo congue, faucibus mollis leo venenatis vestibulum mi. Tincidunt tellus laoreet.Mauris aliquam dui in diam varius pulvinar. Nunc commodo, tortor a rutrum sollicitudin.", // Description in English
                                material: "100% cotton", // Material in English
                                colorOptions: [
                                    { color: "White", image: "https://example.com/red-image.jpg" },
                                    { color: "Blue", image: "https://example.com/blue-image.jpg" },
                                ],
                                careInstructions: "Machine wash cold. Do not bleach.", // Care instructions for the product
                            },
                            bg: {
                                // Bulgarian translation
                                productName: "Nevyzmojen - Овърсайз тениска в ЧЕРНО",
                                description:
                                    "Удобна памучна тениска с уникална висококачествена бродерия на нашето лого отпред и в центъра. Уникален дизайн на гърба, който представя нашето послание към света.",
                                material: "??",
                                colorOptions: [
                                    { color: "??", image: "https://example.com/red-image.jpg" },
                                    { color: "??", image: "https://example.com/blue-image.jpg" },
                                ],
                                careInstructions: "??",
                            },
                        },
                        category: "Mens T-shirts", // Product category (e.g., T-shirts, Jeans)
                        subCategory: "Casual", // Optional subcategory (e.g., Casual, Formal)
                        brand: "Nevyzmojen", // Brand or manufacturer of the product
                        price: 89.99, // Price of the product
                        currency: "BGN", // Currency code (e.g., USD, EUR)
                        discount: {
                            amount: 0.0, // Discount amount or percentage (e.g., 10.00 or 15%)
                            type: "fixed", // Type of discount ('fixed' or 'percentage')
                        },
                        availableSizes: ["S", "M", "L", "XL"], // Array of all possible sizes for the product
                        inStockSizes: ["S", "M", "L"], // Array of currently available sizes in stock
                        sizeChartImgUrl: "https://i.imgur.com/SEaH07T.jpeg",
                        images: [
                            "https://i.imgur.com/xKaHHQb.jpeg", // Array of image URLs for the product
                            "https://i.imgur.com/wwnM7jL.jpeg",
                            "https://i.imgur.com/n8SrbTR.jpeg",
                            "https://i.imgur.com/HOqe5zX.jpeg",
                        ],
                        weight: "0.5kg", // Weight of the product (useful for shipping calculations)
                        dimensions: {
                            // Dimensions for packaging/shipping
                            length: "30cm",
                            width: "20cm",
                            height: "5cm",
                        },
                        rating: {
                            average: 4.5, // Average rating of the product
                            reviewsCount: 125, // Number of reviews
                        },
                        releaseDate: "2024-08-01", // Date when the product was added or released
                        isFeatured: true, // Boolean to indicate if the product is featured
                        isActive: true, // Boolean to indicate if the product is active/visible on the store
                        tags: ["new", "summer"], // Array of tags or keywords related to the product
                    },
                    {
                        internalProductId: "secondProduct", // Unique identifier for the product (auto-generated or custom)
                        translations: {
                            // Translation object containing multiple languages
                            en: {
                                // English translation
                                productName: "Nevyzmojen - Oversize T-shirt White", // Name in English
                                description:
                                    "Comfortable cotton t-shirt embroidered with unique high quality design of our logo front and center. Unique back design featuring our message to the world. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam laoreet leo id justo congue, faucibus mollis leo venenatis vestibulum mi. Tincidunt tellus laoreet.Mauris aliquam dui in diam varius pulvinar. Nunc commodo, tortor a rutrum sollicitudin.", // Description in English
                                material: "100% cotton", // Material in English
                                colorOptions: [
                                    { color: "White", image: "https://example.com/red-image.jpg" },
                                    { color: "Blue", image: "https://example.com/blue-image.jpg" },
                                ],
                                careInstructions: "Machine wash cold. Do not bleach.", // Care instructions for the product
                            },
                            bg: {
                                // Bulgarian translation
                                productName: "Nevyzmojen - Овърсайз тениска в ЧЕРНО",
                                description:
                                    "Удобна памучна тениска с уникална висококачествена бродерия на нашето лого отпред и в центъра. Уникален дизайн на гърба, който представя нашето послание към света.",
                                material: "??",
                                colorOptions: [
                                    { color: "??", image: "https://example.com/red-image.jpg" },
                                    { color: "??", image: "https://example.com/blue-image.jpg" },
                                ],
                                careInstructions: "??",
                            },
                        },
                        category: "Mens T-shirts", // Product category (e.g., T-shirts, Jeans)
                        subCategory: "Casual", // Optional subcategory (e.g., Casual, Formal)
                        brand: "Nevyzmojen", // Brand or manufacturer of the product
                        price: 89.99, // Price of the product
                        currency: "BGN", // Currency code (e.g., USD, EUR)
                        discount: {
                            amount: 0.0, // Discount amount or percentage (e.g., 10.00 or 15%)
                            type: "fixed", // Type of discount ('fixed' or 'percentage')
                        },
                        availableSizes: ["S", "M", "L", "XL"], // Array of all possible sizes for the product
                        inStockSizes: ["S", "M", "L"], // Array of currently available sizes in stock
                        sizeChartImgUrl: "https://i.imgur.com/SEaH07T.jpeg",
                        images: [
                            "https://i.imgur.com/vZQT6FV.jpeg", // Array of image URLs for the product
                            "https://i.imgur.com/lsWigXg.jpeg",
                            "https://i.imgur.com/NOSWJid.jpeg",
                            "https://i.imgur.com/HOqe5zX.jpeg",
                        ],
                        weight: "0.5kg", // Weight of the product (useful for shipping calculations)
                        dimensions: {
                            // Dimensions for packaging/shipping
                            length: "30cm",
                            width: "20cm",
                            height: "5cm",
                        },
                        rating: {
                            average: 4.5, // Average rating of the product
                            reviewsCount: 125, // Number of reviews
                        },
                        releaseDate: "2024-08-01", // Date when the product was added or released
                        isFeatured: true, // Boolean to indicate if the product is featured
                        isActive: true, // Boolean to indicate if the product is active/visible on the store
                        tags: ["new", "summer"], // Array of tags or keywords related to the product
                    },
                ];

                console.log("productsArray: ", productsArray);
                // add to the global i18n translations object the details for each product
                productsArray.forEach((product) => {
                    // for each lang in the product
                    let availLangs = Object.keys(product.translations);
                    // add for each lang the translations into the i18n translations object
                    availLangs.forEach((lang) => {
                        // product name
                        i18n.global.messages[lang][product.internalProductId + "ProductName"] =
                            product.translations[lang].productName;
                        // product description
                        i18n.global.messages[lang][
                            product.internalProductId + "ProductDescription"
                        ] = product.translations[lang].description;
                    });
                });
                commit("storeProductsArray", productsArray);
                commit("setIsLoading", false);

                return;
            }
            try {
                // Get a reference to the "products" collection
                const querySnapshot = await getDocs(collection(firestoreDB, "products"));

                // Create an array to store the fetched products
                let productsArray = [];

                // Loop through the documents and extract the data
                querySnapshot.forEach((doc) => {
                    let product = doc.data();
                    productsArray.push(product);
                });

                commit("storeProductsArray", productsArray);

                // add to the global i18n translations object the details for each product
                productsArray.forEach((product) => {
                    // for each lang in the product
                    let availLangs = Object.keys(product.translations);
                    // add for each lang the translations into the i18n translations object
                    availLangs.forEach((lang) => {
                        // product name
                        i18n.global.messages[lang][product.internalProductId + "ProductName"] =
                            product.translations[lang].productName;
                        // product description
                        i18n.global.messages[lang][
                            product.internalProductId + "ProductDescription"
                        ] = product.translations[lang].description;
                    });
                });
            } catch (error) {
                commit("setErrorMessage", error);
                console.error("Error fetching products:", error);
                return error;
            }
            commit("setIsLoading", false);
        }, // Retrieve the basket from local storage, decode and set it in the store
        getBasketFromLocalStorage: ({ commit }) => {
            const basketFromLocalStorageBase64 = localStorage.getItem("basketDetails");
            if (basketFromLocalStorageBase64) {
                try {
                    const decodedBasket = JSON.parse(atob(basketFromLocalStorageBase64)).basket;
                    commit("setBasket", decodedBasket);
                } catch (e) {
                    console.error("Error decoding basket data:", e);
                }
            }
        },
        // Add a product to the basket
        addProductToBasket: ({ commit, dispatch, state }, productToAdd) => {
            commit("addProductToBasket", productToAdd);
            // Sync to local storage
            dispatch("syncBasketToLocalStorage");
        },
        // Remove a product or decrease quantity
        removeProductFromBasket: ({ commit, dispatch }, { internalProductId, size }) => {
            console.log(size);

            commit("removeProductFromBasket", { internalProductId, size });

            // Sync to local storage
            dispatch("syncBasketToLocalStorage");
        },
        // Fully delete a product from the basket
        deleteProductFromBasket: ({ commit, dispatch }, { internalProductId, size }) => {
            commit("deleteProductFromBasket", { internalProductId, size });

            // Sync to local storage
            dispatch("syncBasketToLocalStorage");
        },
        // Sync the current basket to local storage with Base64 encoding
        syncBasketToLocalStorage: ({ state }) => {
            const basketData = {
                basket: state.basket,
            };
            const encodedBasket = btoa(JSON.stringify(basketData));
            localStorage.setItem("basketDetails", encodedBasket);
        },
    },
    // always trigger these actions from firestore on vuex startup
    plugins: [
        (store) => {
            // Get products from firestore
            store.dispatch("fetchProductsFromFirestore");
            // Get basket from local storage TODO: get it from the logged in user's data once logins are enabled
            store.dispatch("getBasketFromLocalStorage");
        },
    ],
});

export default store;
