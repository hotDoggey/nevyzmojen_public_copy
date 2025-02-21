<template>
    <h1 class="pt-16">{{ $t("login") || "Login" }}</h1>
    <v-container>
        <v-row align="center" justify="center">
            <v-col cols="12" sm="8" md="6" lg="6" class="pt-12 v-col-custom">
                <v-form action="submit" @submit.prevent="attemptLogin" class="login-form">
                    <v-text-field
                        ref="emailInput"
                        v-model="email"
                        :rules="emailRules"
                        @blur="validateEmailOnBlur"
                        :label="$t('email') || 'Email'"
                        required
                    ></v-text-field>
                    <v-text-field
                        v-model="password"
                        type="password"
                        :rules="[
                            (v) => !!v || $t('required_field') || 'You must enter a Password.',
                        ]"
                        label="Password"
                        required
                    ></v-text-field>
                    <div class="">
                        <v-btn type="submit" class="mt-6 login-btn">{{
                            $t("login") || "Login"
                        }}</v-btn>
                    </div>
                </v-form>
            </v-col>
        </v-row>
    </v-container>
    <div>
        {{ $t("signupText1") || "Don't have an account with us yet?" }}
        <br />
        <router-link to="/signup">{{ $t("signupText2") || "Sign up" }}</router-link>
    </div>
    <div class="demo-text hint-text">
        <p>Demo version. Use the following details to login and view the rest of the system:</p>
        <p>Email: biser9513+nvtest1@gmail.com</p>
        <p>Password: 123456</p>
        <p></p>
    </div>
    <div v-if="isLoading">Loading...</div>
</template>

<script>
export default {
    data() {
        return {
            email: "",
            password: "",
            validateEmailFlag: false, // Add a flag to control email validation so it only triggers once you click away from field
        };
    },
    computed: {
        isLoading() {
            return this.$store.state.isLoading;
        },
        emailRules() {
            return [
                (v) => {
                    if (!this.validateEmailFlag) {
                        return true;
                    }
                    return this.validateEmail(v);
                },
            ];
        },
    },
    methods: {
        validateEmail(v) {
            if (!v) {
                return this.$t("required_field") || "Required field.";
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailRegex.test(v)) return true;
            else return this.$t("invalid_email_format") || "Please enter a valid email.";
        },
        validateEmailOnBlur() {
            this.validateEmailFlag = true;
            this.$refs.emailInput.validate(); // Manually trigger validation on blur
        },
        async attemptLogin() {
            this.validateEmailFlag = true; // Enable validation when login is attempted
            const isValid = this.$refs.emailInput.validate(); // Manually trigger validation on submit

            if (!isValid) {
                return; // Prevent login if email is invalid
            }

            // reset error message before beginning
            this.errorMessage = "";

            let userCredentials = {
                email: this.email,
                password: this.password,
            };

            let result = await this.$store.dispatch("signUserInWithEmail", userCredentials);
            console.log("result within loginpage.vue!: ", result);
            if (result === true) {
                this.$router.push("/account");
            } else {
                this.errorMessage = result;
            }
        },
    },
};
</script>

<style>
.login-form {
    width: 100%;
    font-family: Arial, Helvetica, sans-serif;
}
.login-btn {
    width: 100%;
    margin: 0 auto;
}
.demo-text {
    padding-top: 6rem;
}
</style>
