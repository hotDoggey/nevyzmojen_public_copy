<template>
    <footer>
        <div class="footer-container">
            <div class="footer-contact-us">
                <div class="contact-footer-number">
                    {{ $t("contact_us") || "Contact Us:" }} +359 7874335744
                </div>
                <div class="contact-footer-number">nevazmojen-support@outlook.com</div>
            </div>

            <div class="footer-contact-us">
                <div class="language-setting">
                    <span class="lang-option lang-bg" @click="changeLang('bg')">
                        <img
                            class="bg-flag-image change-lang-flag-icon"
                            src="@/assets/bg_lang_flag.png"
                            alt="Site Language Option - Bulgarian"
                    /></span>
                    <span class="lang-option lang-en" @click="changeLang('en')"
                        ><img
                            class="en-flag-image change-lang-flag-icon"
                            src="@/assets/en_lang_flag.png"
                            alt="Site Language Option - Bulgarian"
                        />
                    </span>
                </div>
                <p>© 2024 Navyzmojen</p>
            </div>
        </div>
    </footer>
</template>

<script>
export default {
    // the purpose of this component is to show the footer at the bottom of the page if its content is
    // not enough to push it down to the bottom
    data() {},
    methods: {
        changeLang(newLang) {
            this.$store.dispatch("changeLang", newLang);
        },
    },
};
</script>

<style scoped>
footer {
    background-color: var(--primary-color);
    color: white;
    padding: 10px 0;
    margin-top: 50px;
    text-align: center;
    width: 100%;
}

/* arrange content in two columns */
.footer-container {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
}

.change-lang-flag-icon {
    max-width: 1.25rem;
    height: auto;
}
.language-setting > span {
    padding: 0 0.25rem 0 0.25rem;
}
</style>
