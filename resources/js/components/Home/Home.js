import VueApexCharts from "vue-apexcharts";
import yfinance from "../../api/yfinance";

export default {
    components: { VueApexCharts },
    data() {
        return {
            raw: {
                purchases: [],
                quotes: {},
                fixed: [],
                assetClasses: [],
                original: {}
            },
            aggregated: {
                toInvest: 0,
                total: 0,
                totalWeight: 0
            },
            generalData: {
                fixed: 0,
                variable: 0
            },
            classesData: {},
            detailData: {},
            customData: {},
            form: {
                headers: [
                    { text: "Asset Class", value: "asset_class_name" },
                    { text: "Amount", value: "amount" },
                    { text: "Weights", value: "weight" },
                    { text: "Gain/Loss", value: "diff" }
                ],
                items: []
            },
            general: {
                loading: true,
                series: [0, 0],
                options: {
                    labels: ["Fixed", "Variable"],
                    theme: {
                        palette: "palette3"
                    },
                    chart: {
                        type: "donut"
                    },
                    responsive: [
                        {
                            breakpoint: 960,
                            options: {
                                chart: {
                                    width: "100%"
                                },
                                legend: {
                                    position: "bottom"
                                }
                            }
                        }
                    ],
                    tooltip: {
                        y: {
                            formatter: function(value) {
                                let formatter = new Intl.NumberFormat("en-US", {
                                    style: "currency",
                                    currency: "USD",
                                    minimumFractionDigits: 2
                                });
                                return formatter.format(value);
                            }
                        }
                    },
                    legend: {
                        labels: {
                            colors: "hsla(0,0%,100%,.7)"
                        }
                    }
                }
            },
            classes: {
                loading: true,
                series: [],
                options: {
                    labels: [],
                    chart: {
                        type: "donut"
                    },
                    theme: {
                        palette: "palette8"
                    },
                    responsive: [
                        {
                            breakpoint: 960,
                            options: {
                                chart: {
                                    width: "100%"
                                },
                                legend: {
                                    position: "bottom"
                                }
                            }
                        }
                    ],
                    tooltip: {
                        y: {
                            formatter: function(value) {
                                let formatter = new Intl.NumberFormat("en-US", {
                                    style: "currency",
                                    currency: "USD",
                                    minimumFractionDigits: 2
                                });
                                return formatter.format(value);
                            }
                        }
                    },
                    legend: {
                        labels: {
                            colors: "hsla(0,0%,100%,.7)"
                        }
                    }
                }
            },
            detail: {
                loading: true,
                series: [],
                options: {
                    labels: [],
                    chart: {
                        type: "donut"
                    },
                    theme: {
                        palette: "palette7"
                    },
                    responsive: [
                        {
                            breakpoint: 960,
                            options: {
                                chart: {
                                    width: "100%"
                                },
                                legend: {
                                    position: "bottom"
                                }
                            }
                        }
                    ],
                    legend: {
                        labels: {
                            colors: "hsla(0,0%,100%,.7)"
                        },
                        formatter: function(seriesName, opts) {
                            let formatter = new Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency: "USD",
                                minimumFractionDigits: 2
                            });

                            return [
                                seriesName.substring(0, 10)+ (seriesName.length >= 10? "..." : ""),
                                " - ",
                                Number(
                                    opts.w.globals.seriesPercent[
                                        opts.seriesIndex
                                    ]
                                ).toFixed(1) + "%",
                                " : ",
                                formatter.format(
                                    opts.w.globals.series[opts.seriesIndex]
                                )
                            ];
                        }
                    },
                    tooltip: {
                        y: {
                            formatter: function(value) {
                                let formatter = new Intl.NumberFormat("en-US", {
                                    style: "currency",
                                    currency: "USD",
                                    minimumFractionDigits: 2
                                });
                                return formatter.format(value);
                            }
                        }
                    }
                }
            },
            custom: {
                loading: true,
                series: [],
                options: {
                    labels: [],
                    chart: {
                        type: "donut"
                    },
                    theme: {
                        palette: "palette2"
                    },
                    responsive: [
                        {
                            breakpoint: 960,
                            options: {
                                chart: {
                                    width: "100%"
                                },
                                legend: {
                                    position: "bottom"
                                }
                            }
                        }
                    ],
                    tooltip: {
                        y: {
                            formatter: function(value) {
                                let formatter = new Intl.NumberFormat("en-US", {
                                    style: "currency",
                                    currency: "USD",
                                    minimumFractionDigits: 2
                                });
                                return formatter.format(value);
                            }
                        }
                    },
                    legend: {
                        labels: {
                            colors: "hsla(0,0%,100%,.7)"
                        }
                    }
                }
            }
        };
    },
    beforeMount: async function() {
        await this.getRawData();
    },
    methods: {
        async getRawData() {
            try {
                let assetClassesResponse = await axios.get(
                    "/api/asset-classes"
                );
                let purchasesResponse = await axios.get("/api/purchases");
                let fixedResponse = await axios.get("/api/fixed-interest");

                // Map classes to object
                let mappedClasses = {
                    0: { name: "Other", id: 0 }
                };
                assetClassesResponse.data.map(el => {
                    mappedClasses[el.id] = {
                        name: el.name,
                        id: el.id
                    };
                });
                this.raw.assetClasses = mappedClasses;
                this.raw.purchases = purchasesResponse.data;
                this.raw.fixed = fixedResponse.data;

                let symbols = purchasesResponse.data.map(
                    element => element.symbol
                );
                let uniqueSymbols = [...new Set(symbols)];
                let quotes = await this.getMarketQuotes(uniqueSymbols.sort());

                this.raw.quotes = quotes;

                let totalFixed = 0;
                let totalVariable = 0;
                let byIndex = {};
                let byClasses = {};

                this.raw.purchases.forEach(element => {
                    let marketPrice =
                        Number(element.shares) * Number(quotes[element.symbol]);

                    totalVariable += marketPrice;

                    if (!byIndex.hasOwnProperty(element.symbol)) {
                        byIndex[element.symbol] = 0;
                    }

                    byIndex[element.symbol] += marketPrice;

                    if (element.asset_class !== null) {
                        if (!byClasses.hasOwnProperty(element.asset_class_id)) {
                            byClasses[element.asset_class_id] = 0;
                        }

                        byClasses[element.asset_class_id] += marketPrice;
                    } else {
                        if (!byClasses.hasOwnProperty("0")) {
                            byClasses["0"] = 0;
                        }
                        byClasses["0"] += marketPrice;
                    }
                });

                this.raw.fixed.forEach(element => {
                    let amount = Number(element.amount);
                    if (!byIndex.hasOwnProperty(element.name)) {
                        byIndex[element.name] = 0;
                    }
                    byIndex[element.name] += amount;
                    totalFixed += amount;

                    if (element.asset_class !== null) {
                        if (!byClasses.hasOwnProperty(element.asset_class_id)) {
                            byClasses[element.asset_class_id] = 0;
                        }

                        byClasses[element.asset_class_id] += amount;
                    } else {
                        if (!byClasses.hasOwnProperty("0")) {
                            byClasses["0"] = 0;
                        }
                        byClasses["0"] += amount;
                    }
                });

                // transform to fixed 2
                let total = totalFixed + totalVariable;
                totalFixed = totalFixed.toFixed(2);
                totalVariable = totalVariable.toFixed(2);
                let indexKeys = Object.keys(byIndex);
                indexKeys.sort(function(a, b) {
                    return (
                        Number(byIndex[b].toFixed(2)) -
                        Number(byIndex[a].toFixed(2))
                    );
                });

                let sortedByIndex = {};

                indexKeys.forEach(key => {
                    if (byIndex.hasOwnProperty(key)) {
                        const element = Number(byIndex[key].toFixed(2));
                        sortedByIndex[key] = element;
                    }
                });

                let classesKeys = Object.keys(byClasses);
                classesKeys.sort(function(a, b) {
                    return (
                        Number(byClasses[b].toFixed(2)) -
                        Number(byClasses[a].toFixed(2))
                    );
                });

                let sortedByClasses = {};

                classesKeys.forEach((key, index) => {
                    if (byClasses.hasOwnProperty(key)) {
                        const element = Number(byClasses[key].toFixed(2));
                        sortedByClasses[index] = {
                            asset_class_id: key,
                            value: element
                        };
                    }
                });

                this.generalData = {
                    fixed: totalFixed,
                    variable: totalVariable
                };
                this.classesData = sortedByClasses;
                this.detailData = sortedByIndex;

                this.customData = { ...byClasses };
                this.raw.original = {
                    classes: byClasses,
                    total: total
                };

                let rows = [];
                let totalWeight = 0;
                for (const key in mappedClasses) {
                    if (mappedClasses.hasOwnProperty(key)) {
                        const element = mappedClasses[key];
                        let value = !!byClasses[element.id]
                            ? byClasses[element.id]
                            : 0;
                        let weight = value > 0 ? (value / total) * 100 : 0;
                        totalWeight += weight;
                        rows.push({
                            asset_class_name: element.name,
                            asset_class_id: element.id,
                            amount: value,
                            weight: weight,
                            diff: 0
                        });
                    }
                }
                this.form.items = rows;
                this.aggregated.total = total;
                this.aggregated.totalWeight = totalWeight;
            } catch (error) {
                console.log("getRawData -> error", error);
            }
        },
        async getMarketQuotes(symbols) {
            if (symbols.length > 0) {
                let getQuotes = localStorage.getItem("get-quotes");
                var quotes;
                if (getQuotes) {
                    quotes = JSON.parse(getQuotes);
                } else {
                    try {
                        let response = await yfinance.get("market/get-quotes", {
                            params: {
                                region: "US",
                                lang: "en",
                                symbols: symbols
                            }
                        });
                        quotes = response?.data?.quoteResponse?.result;
                        if (undefined ?? quotes) {
                            localStorage.setItem(
                                "get-quotes",
                                JSON.stringify(quotes)
                            );
                            let today = moment().format("LLLL");
                            localStorage.setItem("get-quotes-updated", today);
                            this.lastUpdate = today;
                        }
                    } catch (error) {
                        this.snackbar = {
                            ...this.snackbar,
                            show: true,
                            text:
                                "Somenthing went wrong reaching Yahoo API, try again",
                            color: "error"
                        };
                    }
                }

                let newQuotes = {};
                if (undefined ?? quotes) {
                    quotes.map(quote => {
                        let symbol = quote?.symbol;
                        newQuotes[symbol] = Number(
                            quote?.regularMarketPrice
                                ? quote?.regularMarketPrice
                                : 0
                        );
                    });
                }
                return newQuotes;
            }
        },
        getConditionalFormat(val) {
            let value = Number(val);
            if (value < 0) {
                return "red--text";
            }
            if (value > 0) {
                return "green--text";
            }
            return "";
        },
        updateAmount() {
            let value = this.form.items;
            let newTotal = 0;

            if (this.aggregated.toInvest === 0) {
                newTotal = Number(this.raw.original.total);
            } else {
                newTotal =
                    Number(this.raw.original.total) +
                    Number(this.aggregated.toInvest);
            }

            let newTotalWeight = 0;
            let newItems = [];

            for (const element of value) {
                let newItem = { ...element };
                let originalValue =
                    this.raw.original.classes[newItem.asset_class_id] !==
                    undefined
                        ? Number(
                              this.raw.original.classes[newItem.asset_class_id]
                          )
                        : 0;
                newTotalWeight += Number(newItem.weight);
                newItem.amount =
                    (Number(newTotal) * Number(newItem.weight)) / 100;
                newItem.diff = Number(newItem.amount) - Number(originalValue);
                newItems.push(newItem);
            }

            this.form.items = newItems;
            this.aggregated.total = newTotal;
            this.aggregated.totalWeight = newTotalWeight;
        }
    },
    watch: {
        generalData: {
            deep: true,
            handler(value) {
                this.general.series = [
                    Number(value.fixed),
                    Number(value.variable)
                ];
                this.general.loading = false;
            }
        },
        classesData: {
            deep: true,
            handler(value) {
                let values = [];
                let labels = [];

                for (const key in value) {
                    if (value.hasOwnProperty(key)) {
                        const element = value[key];
                        values.push(element.value);
                        labels.push(
                            this.raw.assetClasses[element.asset_class_id].name
                        );
                    }
                }

                this.classes.series = values;
                this.classes.options.labels = labels;
                this.classes.loading = false;
            }
        },
        detailData: {
            deep: true,
            handler(value) {
                this.detail.series = Object.values(value);
                this.detail.options.labels = Object.keys(value);
                this.detail.loading = false;
            }
        },
        customData: {
            deep: true,
            handler(value) {
                let values = [];
                let labels = [];

                for (const key in value) {
                    if (value.hasOwnProperty(key)) {
                        const element = value[key];
                        values.push(element);
                        labels.push(this.raw.assetClasses[key].name);
                    }
                }

                this.custom.series = values;
                this.custom.options.labels = labels;
                this.custom.loading = false;
            }
        },
        "aggregated.toInvest": {
            deep: true,
            handler() {
                this.updateAmount();
            }
        },
        "form.items": {
            deep: true,
            handler(value) {
                let newCustomData = {};
                for (const key in value) {
                    if (value.hasOwnProperty(key)) {
                        const element = value[key];
                        if (element.amount > 0) {
                            newCustomData[key] = element.amount;
                        }
                    }
                }
                this.customData = newCustomData;
            }
        }
    }
};
