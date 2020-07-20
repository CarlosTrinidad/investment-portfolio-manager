import { Fragment } from "vue-fragment";
import yfinance from "../../api/yfinance";

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
                edit: false,
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
                    width: "225px"
                },
                { text: "Symbol", value: "symbol", width: "120px" },
                { text: "Shares", value: "total_shares", width: "110px" },
                {
                    text: "Avg. Buy Price",
                    value: "average_buy_price",
                    width: "155px"
                },
                { text: "Market Price", value: "market_price", width: "155px" },
                { text: "Cost Basis", value: "cost_basis", width: "145px" },
                { text: "Market Value", value: "market_value", width: "145px" },
                { text: "Gain/Loss", value: "gain_loss", width: "130px" },
                { text: "Growth", value: "growth", width: "130px" },
                {
                    text: "Annual Dividend",
                    value: "anual_dividend",
                    width: "170px"
                },
                {
                    text: "Dividend Yield",
                    value: "dividend_yield",
                    width: "155px"
                },
                { text: "Anual Income", value: "anual_income", width: "160px" }
            ],
            purchases: [],
            aggregated: {
                total_shares: 0,
                cost_basis: 0,
                market_value: 0,
                gain_loss: 0,
                growth: 0,
                anual_income: 0
            },
            loading: true,
            marketQuery: {
                loading: false,
                items: [],
                search: null,
                timeout: null,
                done: false
            }
        };
    },
    created() {
        this.getGroupedPurchases();
    },
    watch: {
        purchases: {
            deep: true,
            handler(value) {
                let aggregated = {
                    total_shares: 0,
                    cost_basis: 0,
                    market_value: 0,
                    gain_loss: 0,
                    growth: 0,
                    anual_income: 0
                };
                value.map(purchase => {
                    aggregated.total_shares += Number(purchase.total_shares);
                    aggregated.cost_basis += Number(purchase.cost_basis);
                    aggregated.market_value += Number(purchase.market_value);
                    aggregated.gain_loss += Number(purchase.gain_loss);
                    aggregated.growth += Number(purchase.growth);
                    aggregated.anual_income += Number(purchase.anual_income);
                });

                this.aggregated = aggregated;
            }
        },
        "marketQuery.search": {
            handler(value) {
                if (value === null) return;
                if (value.length === 0) return;

                let search = value.trim();
                // Items have already been requested
                if (this.marketQuery.loading) return;
                // If item has been selected theres no need to refetch, unless value changes again
                if (this.marketQuery.timeout !== null)
                    clearTimeout(this.marketQuery.timeout);

                this.marketQuery.timeout = setTimeout(() => {
                    if (
                        search &&
                        search !== this.marketQuery.select &&
                        !this.marketQuery.done
                    ) {
                        this.queryMarket(search);
                    }
                    if (this.marketQuery.done) {
                        this.marketQuery.done = false;
                        return;
                    }
                    this.marketQuery.timeout = null;
                }, 500);
            }
        }
    },
    methods: {
        getMarketQuotes(symbols) {
            if (symbols.length > 0) {
                yfinance
                    .get("market/get-quotes", {
                        params: {
                            region: "US",
                            lang: "en",
                            symbols: symbols
                        }
                    })
                    .then(response => {
                        let quotes = response.data?.quoteResponse?.result;

                        if (undefined ?? quotes) {
                            quotes.map((quote, index) => {
                                this.purchases[index].market_price = Number(
                                    quote?.regularMarketPrice
                                        ? quote?.regularMarketPrice
                                        : 0
                                );
                                this.purchases[index].market_value =
                                    Number(this.purchases[index].total_shares) *
                                    Number(this.purchases[index].market_price);
                                this.purchases[index].market_value =
                                    Number(this.purchases[index].total_shares) *
                                    Number(this.purchases[index].market_price);
                                this.purchases[index].gain_loss =
                                    Number(this.purchases[index].market_value) -
                                    Number(this.purchases[index].cost_basis);
                                this.purchases[index].growth =
                                    (Number(
                                        this.purchases[index].market_value
                                    ) /
                                        Number(
                                            this.purchases[index].cost_basis
                                        ) -
                                        1) *
                                    100;
                                this.purchases[index].anual_dividend = Number(
                                    quote?.dividendsPerShare
                                        ? quote?.dividendsPerShare
                                        : 0
                                );
                                this.purchases[index].dividend_yield = Number(
                                    quote?.dividendYield
                                        ? quote?.dividendYield
                                        : 0
                                );
                                this.purchases[index].anual_income =
                                    Number(this.purchases[index].market_value) *
                                    (Number(
                                        this.purchases[index].dividend_yield
                                    )/100);
                            });
                        }
                    })
                    .catch(error => {
                        this.snackbar = {
                            ...this.snackbar,
                            show: true,
                            text:
                                "Somenthing went wrong reaching Yahoo API, try again",
                            color: "error"
                        };
                    })
                    .finally(() => {});
            }
        },
        queryMarket(v) {
            if (v.length > 0) {
                this.marketQuery.loading = true;
                yfinance
                    .get("/market/auto-complete", {
                        params: {
                            lang: "en",
                            region: "US",
                            query: v
                        }
                    })
                    .then(response => {
                        if (
                            response.data.hasOwnProperty("ResultSet") &&
                            response.data.ResultSet.hasOwnProperty("Result")
                        ) {
                            let result = response.data.ResultSet.Result;
                            this.marketQuery.items = result.map(res => {
                                return {
                                    symbol: res.symbol,
                                    name: res.name,
                                    description: res.typeDisp
                                };
                            });
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    })
                    .finally(() => {
                        this.marketQuery.loading = false;
                    });
            }
        },
        getGroupedPurchases() {
            axios.get("/api/purchases/grouped").then(response => {
                this.purchases = response.data.map(item => {
                    return {
                        detail: [],
                        market_price: 0,
                        cost_basis: item.total_shares * item.average_buy_price,
                        market_value: 0,
                        gain_loss: 0,
                        growth: 0,
                        anual_dividend: 0,
                        dividend_yield: 0,
                        anual_income: 0,
                        ...item
                    };
                });
                this.getMarketQuotes(
                    this.purchases.map(el => el.symbol).join(",")
                );
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
        create() {
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
                            this.selected = {};
                            this.expanded = [];
                            this.$refs.form.resetValidation();
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
        update() {
            if (this.$refs.form.validate()) {
                axios
                    .put(`/api/purchases/${this.selected.id}`, this.form.inputs)
                    .then(response => {
                        if (response.status === 200) {
                            this.snackbar = {
                                ...this.snackbar,
                                show: true,
                                text: "Purchase updated correctly",
                                color: "success"
                            };
                            this.dialog = false;
                            this.form.edit = false;
                            this.selected = {};
                            this.expanded = [];
                            this.$refs.form.resetValidation();
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
        submit() {
            if (this.form.edit) {
                this.update();
            } else {
                this.create();
            }
        },
        confirmDelete() {
            this.confirmDeleteDialog = true;
        },
        openEdit() {
            this.form.edit = true;
            this.marketQuery.done = true;
            this.form.inputs = {
                symbol: this.selected.symbol,
                shares: this.selected.shares,
                buy_price: this.selected.buy_price,
                name: this.selected.name,
                description: this.selected.description,
                purchase_date: this.selected.purchase_date
            };
            this.dialog = true;
        },
        close() {
            this.dialog = false;
            this.form.edit = false;
            this.$refs.form.resetValidation();
            this.$refs.form.reset();
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
        },
        selectSymbol(item) {
            this.marketQuery.done = true;
            this.form.inputs.name = item.name;
            this.form.inputs.description = item.description;
        },
        getConditionalFormat(value) {
            if (value < 0) {
                return "red--text";
            }
            if (value > 0) {
                return "green--text";
            }
            return "";
        }
    }
};
