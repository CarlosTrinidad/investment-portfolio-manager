<template>
    <v-container fluid>
        <v-row dense>
            <v-col cols="12" md="4">
                <v-card :loading="general.loading">
                    <v-list-item three-line>
                        <v-list-item-content>
                            <v-list-item-title>General</v-list-item-title>
                            <v-list-item-subtitle
                                >An overview of the distribution of your
                                investments.</v-list-item-subtitle
                            >
                            <div class="ma-5" v-if="!general.loading">
                                <vue-apex-charts
                                    :options="general.options"
                                    :series="general.series"
                                    height="320px"
                                ></vue-apex-charts>
                            </div>
                        </v-list-item-content>
                    </v-list-item>
                </v-card>
            </v-col>
            <v-col cols="12" md="4">
                <v-card :loading="classes.loading">
                    <v-list-item three-line>
                        <v-list-item-content>
                            <v-list-item-title>Asset Class</v-list-item-title>
                            <v-list-item-subtitle
                                >An overview of the distribution of your
                                investments by asset
                                class.</v-list-item-subtitle
                            >
                            <div class="ma-5" v-if="!classes.loading">
                                <vue-apex-charts
                                    :options="classes.options"
                                    :series="classes.series"
                                    height="320px"
                                ></vue-apex-charts>
                            </div>
                        </v-list-item-content>
                    </v-list-item>
                </v-card>
            </v-col>
            <v-col cols="12" md="4">
                <v-card :loading="detail.loading">
                    <v-list-item three-line>
                        <v-list-item-content>
                            <v-list-item-title>Detail</v-list-item-title>
                            <v-list-item-subtitle
                                >A detailed overview of yout
                                investments.</v-list-item-subtitle
                            >
                            <div class="ma-5" v-if="!detail.loading">
                                <vue-apex-charts
                                    :options="detail.options"
                                    :series="detail.series"
                                    height="320px"
                                ></vue-apex-charts>
                            </div>
                        </v-list-item-content>
                    </v-list-item>
                </v-card>
            </v-col>
            <v-col cols="12">
                <v-card>
                    <v-list-item three-line>
                        <v-list-item-content>
                            <v-list-item-title
                                >Deposit calculator</v-list-item-title
                            >
                            <v-list-item-subtitle
                                >Set your goal and see how it affects your
                                portfolio.
                            </v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                    <v-row>
                        <v-col cols="12" md="8">
                        <v-col cols="4" v-for="(asset, name) in raw.assetClasses" v-bind:key="asset">
                            <div class="mx-5">
                                <v-text-field
                                    v-model="form[name]"
                                    :label="asset"
                                    type="number"
                                    prefix="$"
                                    required
                                ></v-text-field>
                            </div>
                        </v-col>
                        </v-col>
                        <v-col cols="12" md="4">
                            <div class="mx-5" v-if="!custom.loading">
                                <vue-apex-charts
                                    :options="custom.options"
                                    :series="custom.series"
                                    height="320px"
                                ></vue-apex-charts>
                            </div>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script src="./Home.js"></script>
