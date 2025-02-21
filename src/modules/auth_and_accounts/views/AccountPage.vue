<template>
    <h1 class="pt-4 pl-8 page-title">Account Details</h1>

    <LoadingSpinner v-if="isLoading"></LoadingSpinner>
    <!-- fluid below means it will take the full width -->
    <v-container v-else fluid>
        <v-row class="ml-3 internal-link">
            <button @click="signUserOut">Sign out</button>
        </v-row>
        <v-row class="pl-8 pr-8 pt-6">
            <v-col cols="12" sm="12" md="3" class="v-col-custom">
                <div class="account-details-container">
                    <v-row>{{ fullName }}</v-row>
                    <v-row v-if="hasPhoneNumber">{{ userDetails.phone_number.number }}</v-row>
                    <v-row>Address Line 1</v-row>
                    <v-row>Address Line 2</v-row>
                    <v-row>Postcode</v-row>
                    <v-row class="pt-2 internal-link">{{ `Manage Addresses (${0})` }}</v-row>
                </div>
            </v-col>
            <v-col cols="12" sm="12" md="9" class="v-col-custom">
                <p>
                    {{ $t("noOrdersPt1") }}
                    <router-link to="/store">{{ $t("here") || "here" }}</router-link>
                    {{ $t("noOrdersPt2") }}
                </p>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    data() {
        return {
            username: "",
            password: "",
        };
    },
    computed: {
        isLoading() {
            return this.$store.getters.isLoading;
        },
        userDetails() {
            return this.$store.getters.userDetails;
        },
        fullName() {
            return `${this.userDetails.first_name} ${this.userDetails.surname}`;
        },
        hasPhoneNumber() {
            console.log("this.$store.getters.loggedInState: ", this.$store.getters.loggedInState);
            return this.$store.getters.loggedInState
                ? Object.keys(this.userDetails.phone_number).length > 0
                : false;
        },
    },
    mounted() {},
    methods: {
        signUserOut() {
            this.$store.dispatch("signUserOut");
            this.$router.push({ name: "store" });
        },
    },
};
</script>

<style>
.page-title {
    text-align: left;
}
.login-form {
    width: 100%;
    font-family: Arial, Helvetica, sans-serif;
}
.login-btn {
    width: 100%; /* Adjust the width as needed */
    margin: 0 auto; /* center the button */
}
.demo-text {
    padding-top: 6rem;
}
.account-details-container {
    font-size: 1.125rem;
}
</style>
