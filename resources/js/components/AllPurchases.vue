<template>
    <v-row align="start" justify="center">
        <v-col cols="11">
            <v-row justify="space-between">
                <div
                    class="transition-swing text-h5 primary--text font-weight-medium"
                >
                    Purchases
                </div>
                <v-btn
                    class="text-capitalize"
                    outlined
                    color="primary"
                    @click.stop="dialog = true"
                    >Add purchase</v-btn
                >
            </v-row>
            <br />

            <v-dialog v-model="dialog" persistent max-width="800px">
                <v-card>
                    <v-card-title>
                        <span class="headline">Purchase</span>
                    </v-card-title>
                    <v-card-text>
                        <v-form
                            ref="form"
                            v-model="form.valid"
                            :lazy-validation="true"
                            @submit.prevent
                            id="purchase-form"
                        >
                            <v-container>
                                <v-row>
                                    <v-col cols="12" sm="6" md="4">
                                        <v-text-field
                                            v-model="form.inputs.symbol"
                                            required
                                            :rules="form.rules.symbol"
                                            label="Symbol*"
                                        ></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="8">
                                        <v-text-field
                                            v-model="form.inputs.name"
                                            required
                                            :rules="form.rules.name"
                                            label="Company name*"
                                        ></v-text-field>
                                    </v-col>

                                    <v-col cols="12">
                                        <v-textarea
                                            v-model="form.inputs.description"
                                            label="Description*"
                                            :auto-grow="true"
                                            :rows="1"
                                        ></v-textarea>
                                    </v-col>

                                    <v-col cols="12" sm="6">
                                        <v-text-field
                                            v-model="form.inputs.shares"
                                            :rules="form.rules.shares"
                                            label="Shares*"
                                            type="number"
                                            hint="number of shares"
                                            required
                                        ></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6">
                                        <v-text-field
                                            v-model="form.inputs.buy_price"
                                            :rules="form.rules.buy_price"
                                            label="Buy Price*"
                                            type="number"
                                            hint="average price"
                                            prepend-inner-icon="mdi-currency-usd"
                                            required
                                        ></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6">
                                        <v-menu
                                            v-model="showDatePicker"
                                            :close-on-content-click="false"
                                            :nudge-right="40"
                                            transition="scale-transition"
                                            offset-y
                                            min-width="290px"
                                        >
                                            <template
                                                v-slot:activator="{ on, attrs }"
                                            >
                                                <v-text-field
                                                    v-model="
                                                        form.inputs
                                                            .purchase_date
                                                    "
                                                    label="Purchase date"
                                                    prepend-icon="mdi-calendar"
                                                    readonly
                                                    v-bind="attrs"
                                                    v-on="on"
                                                ></v-text-field>
                                            </template>
                                            <v-date-picker
                                                v-model="
                                                    form.inputs.purchase_date
                                                "
                                                @input="showDatePicker = false"
                                            ></v-date-picker>
                                        </v-menu>
                                    </v-col>
                                </v-row>
                            </v-container>
                            <small>*indicates required field</small>
                        </v-form>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn text depressed @click="close">Close</v-btn>
                        <v-btn color="primary" text @click="submit">Save</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>

            <v-snackbar
                v-model="snackbar.show"
                :bottom="snackbar.y === 'bottom'"
                :color="snackbar.color"
                :left="snackbar.x === 'left'"
                :multi-line="snackbar.mode === 'multi-line'"
                :right="snackbar.x === 'right'"
                :timeout="snackbar.timeout"
                :top="snackbar.y === 'top'"
                :vertical="snackbar.mode === 'vertical'"
            >
                {{ snackbar.text }}

                <template v-slot:action="{ attrs }">
                    <v-btn
                        dark
                        text
                        v-bind="attrs"
                        @click="snackbar.show = false"
                    >
                        Close
                    </v-btn>
                </template>
            </v-snackbar>

            <v-data-table
                :headers="headers"
                :items="purchases"
                multi-sort
                :disable-pagination="true"
                :hide-default-footer="true"
                :fixed-header="true"
                :calculate-widths="true"
                :loading="loading"
            >
                <template v-slot:item.buy_price="{ item }">
                    {{ Number(item.buy_price) | toCurrency }}
                </template>
            </v-data-table>
        </v-col>
    </v-row>
</template>

<script>
export default {
    data() {
        return {
            snackbar: {
                show: false,
                color: "",
                mode: "multi-line",
                text: "",
                timeout: 2500,
                x: "right",
                y: "top"
            },
            showDatePicker: false,
            form: {
                valid: true,
                inputs: {
                    symbol: "",
                    shares: "",
                    buy_price: "",
                    name: "",
                    description: "",
                    purchase_date: new Date().toISOString().substr(0, 10)
                },
                rules: {
                    symbol: [v => !!v || "Symbol is required"],
                    name: [v => !!v || "Company name is required"],
                    shares: [
                        v => !!v || "Shares is required",
                        v => v > 0 || "Shares should be greather than zero"
                    ],
                    buy_price: [
                        v => !!v || "Buy price is required",
                        v => v > 0 || "Buy prince should be greather than zero"
                    ]
                }
            },
            dialog: false,
            headers: [
                {
                    text: "Company name",
                    align: "start",
                    value: "name",
                    width: "165px"
                },
                { text: "Symbol", value: "symbol", width: "120px" },
                { text: "Shares", value: "shares", width: "110px" },
                { text: "Avg. Buy Price", value: "buy_price", width: "155px" },
                { text: "Market Price", value: "description", width: "155px" },
                { text: "Cost Basis", value: "description", width: "145px" },
                { text: "Market Value", value: "description", width: "145px" },
                { text: "Gain/Loss", value: "description", width: "130px" },
                { text: "Growth", value: "description", width: "130px" },
                {
                    text: "Annual Dividend",
                    value: "description",
                    width: "170px"
                },
                {
                    text: "Dividend Yield",
                    value: "description",
                    width: "155px"
                },
                { text: "Yield on Cost", value: "description", width: "150px" },
                { text: "Anual Income", value: "description", width: "160px" }
            ],
            purchases: [],
            loading: true
        };
    },
    created() {
        axios.get("/api/purchases").then(response => {
            this.purchases = response.data;
            this.loading = false;
        });
    },
    methods: {
        close() {
            this.dialog = false;
            this.$refs.form.resetValidation();
        },
        submit() {
            if (this.$refs.form.validate()) {
                axios
                    .post("/api/purchases", this.form.inputs)
                    .then(response => {
                        if (response.status === 201) {
                            console.log(response);
                            this.snackbar = {
                                ...this.snackbar,
                                show: true,
                                text: "Purchase saved correctly",
                                color: "success"
                            };
                            this.dialog = false;
                            this.$refs.form.reset();
                            this.purchases.push(response.data);
                        } else {
                            this.snackbar = {
                                ...this.snackbar,
                                show: true,
                                text: "Purchase could not be saved, try again",
                                color: "error"
                            };
                        }
                    })
                    .catch(error => {
                        console.log(error);
                        this.snackbar = {
                            ...this.snackbar,
                            show: true,
                            text: "Purchase could not be saved, try again",
                            color: "error"
                        };
                    });
            }
        }
    }
};
</script>
