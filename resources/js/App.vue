<template>
    <v-app class="dark">
        <v-app-bar app dense flat>
            <v-toolbar-title
                ><router-link to="/">
                    <v-img
                        :src="image_src"
                        width="100%"
                        max-width="120"
                        contain
                    ></v-img> </router-link
            ></v-toolbar-title>
            <v-spacer></v-spacer>

            <div>
                <v-tabs background-color="transparent">
                    <v-tab to="/">
                        Dashboard
                    </v-tab>
                    <v-tab to="/variable-interest">
                        Variable
                    </v-tab>
                    <v-tab to="/fixed-interest">
                        Fixed
                    </v-tab>
                </v-tabs>
            </div>
        </v-app-bar>

        <!-- Sizes your content based upon application components -->
        <v-main>
            <!-- Provides the application the proper gutter -->
            <v-container fluid>
                <!-- If using vue-router -->
                <router-view></router-view>
            </v-container>
        </v-main>

        <v-footer app>
            <v-card-text class="py-0 px-0 white--text">
                Investment Portfolio, &copy; Copyright
                {{ new Date().getFullYear() }}
            </v-card-text>
        </v-footer>
    </v-app>
</template>

<script>
export default {
    data() {
        return {
            model: "tab-1",
            image_src: require("./components/assets/logo.png")
        };
    },
    created() {
        this.$vuetify.theme.dark = true;
    }
};
</script>
