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
                            <div class="ma-1" v-if="!general.loading">
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
                            <div class="ma-1" v-if="!classes.loading">
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
                            <div class="ma-1" v-if="!detail.loading">
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
                            <v-col cols="12" md="3">
                                <div class="mx-1">
                                    <v-text-field
                                        v-model="aggregated.toInvest"
                                        label="Amount to invest"
                                        type="number"
                                        prefix="$"
                                        required
                                    ></v-text-field>
                                </div>
                            </v-col>
                            <v-col cols="12">
                                <div class="mx-5">
                                    <v-data-table
                                        :headers="form.headers"
                                        :items="form.items"
                                        :disable-pagination="true"
                                        :hide-default-footer="true"
                                    >
                                        <template v-slot:body.append>
                                            <tr>
                                                <td>-</td>
                                                <td>
                                                    {{
                                                        Number(
                                                            aggregated.total
                                                        ) | toCurrency
                                                    }}
                                                </td>
                                                <td>
                                                    {{
                                                        Number(
                                                            aggregated.totalWeight
                                                        ) | toDecimal
                                                    }}%
                                                </td>
                                                <td>-</td>
                                            </tr>
                                        </template>

                                        <template v-slot:item.amount="{ item }">
                                            {{
                                                Number(item.amount) | toCurrency
                                            }}
                                        </template>
                                        <template v-slot:item.weight="{ item }">
                                            <v-edit-dialog
                                                :return-value.sync="item.weight"
                                                large
                                                @save="updateAmount"
                                            >
                                                <div>
                                                    {{
                                                        Number(item.weight)
                                                            | toDecimal
                                                    }}%
                                                </div>
                                                <template v-slot:input>
                                                    <div class="mt-4 title">
                                                        Update weight
                                                    </div>
                                                </template>
                                                <template v-slot:input>
                                                    <v-text-field
                                                        v-model="item.weight"
                                                        label="Edit"
                                                        single-line
                                                        autofocus
                                                    ></v-text-field>
                                                </template>
                                            </v-edit-dialog>
                                        </template>
                                        <template v-slot:item.diff="{ item }">
                                            <span
                                                v-bind:class="
                                                    getConditionalFormat(
                                                        item.diff
                                                    )
                                                "
                                                >{{
                                                    Number(item.diff)
                                                        | toCurrency
                                                }}</span
                                            >
                                        </template>
                                    </v-data-table>
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
