<template>
    <h1 class="pt-16">{{ $t("create_account") || "Create Account" }}</h1>
    <v-container>
        <v-row align="center" justify="center">
            <v-col cols="12" sm="8" md="6" lg="6" class="pt-12 v-col-custom">
                <v-form
                    action="submit"
                    ref="form_to_validate"
                    @submit.prevent="handleSubmit"
                    class="login-form"
                >
                    <!-- Name Fields only allow letters -->
                    <v-text-field
                        ref="first_name"
                        v-model="first_name"
                        :rules="[
                            (v) =>
                                !!v ? validateName(v) : $t('required_field') || 'Required field.',
                        ]"
                        :label="$t('first_name') || 'First Name'"
                        required
                    ></v-text-field>
                    <v-text-field
                        ref="surname"
                        v-model="surname"
                        :rules="[
                            (v) =>
                                !!v ? validateName(v) : $t('required_field') || 'Required field.',
                        ]"
                        :label="$t('surname') || 'Surname Name'"
                        required
                    ></v-text-field>

                    <!-- TODO: find out if i want to use this type of single field entry. need to change the styling to match my other fields though
                    <vue-tel-input
                        style="margin-bottom: 1.3rem"
                        v-bind="temp_number"
                    ></vue-tel-input> -->

                    <!-- Country code field dropdown-->
                    <v-select
                        ref="countryCode"
                        v-model="countryCode"
                        :items="countryCodeItems"
                        item-title="countryTitle"
                        item-value="countryValue"
                        :label="$t('country') || 'Country'"
                    >
                        <!-- <template v-slot:append-inner> TODO: move it more to the right
                            <font-awesome-icon
                                icon="fa-solid fa-chevron-down"
                                size="md"
                            /> </template
                    > -->
                    </v-select>

                    <!-- Phone number field -->
                    <v-text-field
                        ref="phoneNumberInput"
                        v-model="phoneNumber"
                        :rules="phoneNumberRules"
                        @blur="validatePhoneNumberOnBlur"
                        :label="$t('phone_number') || 'Phone Number'"
                        required
                    ></v-text-field>
                    <!-- <vue-tel-input-vuetify v-model="temp_number"></vue-tel-input-vuetify> -->

                    <!-- Email field, with abc@x.y format validation-->
                    <v-text-field
                        ref="emailInput"
                        v-model="email"
                        :rules="emailRules"
                        @blur="validateEmailOnBlur"
                        :label="$t('email') || 'Email'"
                        required
                    ></v-text-field>

                    <!-- Password field -->
                    <v-text-field
                        ref="passwordInput"
                        v-model="password"
                        type="password"
                        :rules="passwordRules"
                        @blur="validatePasswordOnBlur"
                        :label="$t('password') || 'Password'"
                        required
                    ></v-text-field>

                    <div v-if="errorMessage" class="error-message pt-4">{{ errorMessage }}</div>
                    <!-- Submit Button -->
                    <div class="">
                        <v-btn type="submit" class="mt-6 login-btn">{{
                            $t("continue") || "Continue"
                        }}</v-btn>
                    </div>
                </v-form>
            </v-col>
        </v-row>
    </v-container>
    <div>
        {{ $t("loginText1") || "Already have an account with us? Click " }}
        <router-link to="/login">{{ $t("here") || "here" }}</router-link>
        {{ $t("loginText2") || "to log in." }}
    </div>
    <div v-if="isLoading">Loading...</div>
</template>

<script>
// import { VueTelInputVuetify } from "vue-tel-input-vuetify";
// console.log("VueTelInputVuetify: ", VueTelInputVuetify);

export default {
    components: {
        // VueTelInputVuetify,
    },
    data() {
        return {
            errorMessage: "",
            temp_number: "",
            email: "",
            first_name: "",
            surname: "",
            password: "",
            countryCode: "",
            countryCodeItems: [
                { countryTitle: "Bulgaria (+359)", countryValue: "bg" },
                { countryTitle: "United Kingdom (+44)", countryValue: "gb" },
            ],
            phoneNumber: "",
            number: "",
            validateEmailFlag: false, // Add a flag to control email validation so it only triggers once you click away from field
            validatePhoneNumberFlag: false, // Add a flag to control phone number validation so it only triggers once you click away from field
            validatePasswordFlag: false, // Add a flag to control password validation so it only triggers once you click away from field
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
        phoneNumberRules() {
            return [
                (v) => {
                    if (!this.validatePhoneNumberFlag) {
                        return true;
                    }
                    return this.validatePhoneNumber(v);
                },
            ];
        },
        passwordRules() {
            return [
                (v) => {
                    if (!this.validatePasswordFlag) {
                        return true;
                    }
                    return this.validatePassword(v);
                },
            ];
        },
    },
    methods: {
        validateName(v) {
            // regex for only letters
            let regex = /^[a-zA-Z]+$/;
            // returns true if all letters
            if (regex.test(v)) return true;
            // returns string to display if invalid
            else return this.$t("invalid_name") || "Please enter a valid name.";
        },
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
        validatePhoneNumber(v) {
            if (!v) {
                return this.$t("required_field") || "Required field.";
            }
            const phoneNumberRegex = /^[0-9]{4,}$/; // four or more digits only
            if (phoneNumberRegex.test(v)) return true;
            else
                return (
                    this.$t("invalid_phone_number_format") || "Please enter a valid phone number."
                );
        },
        validatePhoneNumberOnBlur() {
            this.validatePhoneNumberFlag = true;
            this.$refs.phoneNumberInput.validate(); // Manually trigger validation on blur
        },
        validatePassword(v) {
            if (!v) {
                return this.$t("required_field") || "Required field.";
            }
            // Check length is over 8 chars; check it has at least one letter (upper and lower case) and at least one number
            const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
            // return true if it passes
            if (regex.test(v)) return true;
            // return string to display to user
            else
                return (
                    this.$t("invalid_password_format") ||
                    "Password must be at least 8 characters and contain a combination of numbers and upper and lower case letters."
                );
        },
        validatePasswordOnBlur() {
            this.validatePasswordFlag = true;
            this.$refs.passwordInput.validate(); // Manually trigger validation on blur
        },
        handleSubmit() {
            // reset error message before beginning
            this.errorMessage = "";

            this.validateEmailFlag = true; // Enable validation when singup is attempted
            this.validatePasswordFlag = true; // Enable validation when singup is attempted

            // check form is valid and all fields passed their validation rules
            this.$refs.form_to_validate.validate().then(({ valid }) => {
                // check form validity
                if (valid) {
                    this.signUserUp();
                } else {
                    this.errorMessage =
                        this.$t("correct_form_errors") || "Please correct form errors to proceed.";
                    return;
                }
            });
        },
        // create a payload and run the store action to create a user in firestore with the correct credentials
        async signUserUp() {
            let newUserCredentials = {
                email: this.email,
                password: this.password,
                first_name: this.first_name,
                country_code: this.countryCode,
                number: this.phoneNumber,
                surname: this.surname,
            };

            // xStore create user action
            let result = await this.$store.dispatch("createUserInFirestore", newUserCredentials);
            if (result === true) {
                // if successful, redirect to the account page (TODO: maybe change to store page?)
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
.chev-icon-alighment {
    margin-left: 5rem;
}
</style>
