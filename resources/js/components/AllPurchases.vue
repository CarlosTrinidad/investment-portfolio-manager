<template>
    <v-row align="start" justify="center" :key="componentKey">
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
                                            label="Description"
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
                show-expand
                :expanded.sync="expanded"
                @item-expanded="getDetail"
                item-key="id"
            >
                <template v-slot:item.total_shares="{ item }">
                    {{ Number(item.total_shares) | toDecimal }}
                </template>
                <template v-slot:item.average_buy_price="{ item }">
                    {{ Number(item.average_buy_price) | toCurrency }}
                </template>
                <template v-slot:expanded-item="{ headers, item }">
                    <fragment v-if="item.detail.length === 0">
                        <td :colspan="headers.length">
                            <div>
                                Loading...
                                <v-progress-circular
                                    indeterminate
                                    :width="3"
                                    color="primary"
                                ></v-progress-circular>
                            </div>
                        </td>
                    </fragment>

                    <fragment v-else>
                        <td :colspan="headers.length" class="no-padding">
                            <v-simple-table class="expanded-row">
                                <template v-slot:default>
                                    <tbody>
                                        <tr
                                            v-for="(line, index) in item.detail"
                                            :key="index"
                                            @contextmenu="
                                                contextMenu($event, line)
                                            "
                                        >
                                            <td width="56px"></td>
                                            <td width="165px">
                                                {{ line.name }}
                                            </td>
                                            <td width="120px">
                                                {{ line.symbol }}
                                            </td>
                                            <td width="110px">
                                                {{
                                                    Number(line.shares)
                                                        | toDecimal
                                                }}
                                            </td>
                                            <td width="155px">
                                                {{
                                                    Number(line.buy_price)
                                                        | toCurrency
                                                }}
                                            </td>
                                            <td
                                                :colspan="headers.length - 5"
                                            ></td>
                                        </tr>
                                    </tbody>
                                </template>
                            </v-simple-table>
                        </td>
                    </fragment>
                </template>
            </v-data-table>
        </v-col>
        <v-menu
            v-model="showMenu"
            :position-x="x"
            :position-y="y"
            absolute
            offset-y
        >
            <v-list>
                <v-list-item @click="openEdit">
                    <v-list-item-title>Edit</v-list-item-title>
                </v-list-item>
                <v-list-item @click="confirmDelete">
                    <v-list-item-title class="pink--text"
                        >Delete</v-list-item-title
                    >
                </v-list-item>
            </v-list>
        </v-menu>
        <v-dialog v-model="confirmDeleteDialog" max-width="290">
            <v-card>
                <v-card-title class="headline"
                    >Use Google's location service?</v-card-title
                >

                <v-card-text>
                    Let Google help apps determine location. This means sending
                    anonymous location data to Google, even when no apps are
                    running.
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn text @click="confirmDeleteDialog = false">
                        Cancel
                    </v-btn>

                    <v-btn color="pink darken-1" text @click="deletePurchase">
                        Delete
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>
</template>

<script>
import { Fragment } from "vue-fragment";

export default {
    components: { Fragment },

    data() {
        return {
            confirmDeleteDialog: false,
            showMenu: false,
            x: 0,
            y: 0,
            selected: {},
            expanded: [],
            componentKey: 0,
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
                { text: "Shares", value: "total_shares", width: "110px" },
                {
                    text: "Avg. Buy Price",
                    value: "average_buy_price",
                    width: "155px"
                },
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
        this.getGroupedPurchases();
    },
    methods: {
        getGroupedPurchases() {
            axios.get("/api/purchases/grouped").then(response => {
                this.purchases = response.data.map(item => {
                    return {
                        detail: [],
                        ...item
                    };
                });
                this.loading = false;
            });
        },
        getDetail({ item }) {
            if (item.detail.length === 0) {
                let indexSymbol = this.purchases.findIndex(element => {
                    return element.symbol === item.symbol;
                });

                if (indexSymbol !== -1) {
                    axios
                        .get("/api/purchases", {
                            params: {
                                symbol: item.symbol
                            }
                        })
                        .then(response => {
                            let newData = this.purchases[indexSymbol];
                            newData["detail"] = response.data;
                            this.purchases[indexSymbol] = Object.assign(
                                {},
                                this.purchases[indexSymbol],
                                {
                                    detail: response.data
                                }
                            );
                        });
                }
            }
        },
        submit() {
            if (this.$refs.form.validate()) {
                axios
                    .post("/api/purchases", this.form.inputs)
                    .then(response => {
                        if (response.status === 201) {
                            this.snackbar = {
                                ...this.snackbar,
                                show: true,
                                text: "Purchase saved correctly",
                                color: "success"
                            };
                            this.dialog = false;
                            this.$refs.form.reset();
                            this.getGroupedPurchases();
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
                        this.snackbar = {
                            ...this.snackbar,
                            show: true,
                            text: "Purchase could not be saved, try again",
                            color: "error"
                        };
                    });
            }
        },
        deletePurchase() {
            axios
                .delete(`/api/purchases/${this.selected.id}`)
                .then(response => {
                    if (response.status === 204) {
                        this.snackbar = {
                            ...this.snackbar,
                            show: true,
                            text: "Purchase deleted"
                        };
                        this.confirmDeleteDialog = false;
                        this.selected = {};
                        this.expanded = [];
                        this.getGroupedPurchases();
                    } else {
                        this.snackbar = {
                            ...this.snackbar,
                            show: true,
                            text:
                                "Purchase action could not be completed, try again",
                            color: "error"
                        };
                    }
                })
                .catch(error => {
                    this.snackbar = {
                        ...this.snackbar,
                        show: true,
                        text:
                            "Purchase action could not be completed, try again",
                        color: "error"
                    };
                });
        },
        confirmDelete() {
            this.confirmDeleteDialog = true;
        },
        openEdit() {},
        close() {
            this.dialog = false;
            this.$refs.form.resetValidation();
        },
        contextMenu(e, item) {
            e.preventDefault();
            this.showMenu = false;
            this.x = e.clientX;
            this.y = e.clientY;
            this.selected = item;
            this.$nextTick(() => {
                this.showMenu = true;
            });
        }
    }
};
</script>

<style scoped>
.no-padding {
    padding: 0 !important;
}
.expanded-row {
    background-color: #151515 !important;
}
</style>
