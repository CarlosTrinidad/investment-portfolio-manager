import VueApexCharts from "vue-apexcharts";
import yfinance from "../../api/yfinance";

export default {
    components: { VueApexCharts },
    data() {
        return {
            purchases: [],
            quotes: {},
            fixed: [],
            generalData: {
                fixed: 0,
                variable: 0
            },
            classesData: {},
            detailData: {},
            customData: {},
            form: {
                field: 0
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
                                seriesName,
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
    created() {
        this.getPurchases();
        this.getFixedInterestInvestments();
    },
    methods: {
        getPurchases() {
            axios.get("/api/purchases").then(response => {
                this.purchases = response.data;
            });
        },
        getFixedInterestInvestments() {
            axios.get("/api/fixed-interest").then(response => {
                this.fixed = response.data;
            });
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

                if (undefined ?? quotes) {
                    let newQuotes = {};
                    quotes.map(quote => {
                        let symbol = quote?.symbol;
                        newQuotes[symbol] = Number(
                            quote?.regularMarketPrice
                                ? quote?.regularMarketPrice
                                : 0
                        );
                    });
                    this.quotes = newQuotes;
                }
            }
        }
    },
    watch: {
        fixed: {
            handler(value) {
                this.generalData["fixed"] = value
                    .reduce(
                        (acumulator, current) =>
                            acumulator + Number(current.amount),
                        0
                    )
                    .toFixed(2);
            }
        },
        purchases: {
            handler(value) {
                let symbols = value.map(element => element.symbol);
                let uniqueSymbols = [...new Set(symbols)];
                this.getMarketQuotes(uniqueSymbols.sort());
            }
        },
        quotes: {
            handler(value) {
                this.generalData["variable"] = this.purchases
                    .reduce(
                        (acumulator, current) =>
                            acumulator +
                            Number(current.shares) *
                                Number(value[current.symbol]),
                        0
                    )
                    .toFixed(2);
                let newClassesData = {};
                let newDetailData = {};
                this.purchases.forEach(element => {
                    let marketPrice =
                        Number(element.shares) * Number(value[element.symbol]);

                    if (!newDetailData.hasOwnProperty(element.symbol)) {
                        newDetailData[element.symbol] = 0;
                    }
                    newDetailData[element.symbol] += marketPrice;

                    if (element.asset_class !== null) {
                        if (
                            !newClassesData.hasOwnProperty(
                                element.asset_class.name
                            )
                        ) {
                            newClassesData[element.asset_class.name] = 0;
                        }

                        newClassesData[element.asset_class.name] += marketPrice;
                    } else {
                        if (!newClassesData.hasOwnProperty("Other")) {
                            newClassesData["Other"] = 0;
                        }
                        newClassesData["Other"] += marketPrice;
                    }
                });
                this.fixed.forEach(element => {
                    let amount = Number(element.amount);
                    if (!newDetailData.hasOwnProperty(element.name)) {
                        newDetailData[element.name] = 0;
                    }
                    newDetailData[element.name] += amount;

                    if (element.asset_class !== null) {
                        if (
                            !newClassesData.hasOwnProperty(
                                element.asset_class.name
                            )
                        ) {
                            newClassesData[element.asset_class.name] = 0;
                        }

                        newClassesData[element.asset_class.name] += amount;
                    } else {
                        if (!newClassesData.hasOwnProperty("Other")) {
                            newClassesData["Other"] = 0;
                        }
                        newClassesData["Other"] += amount;
                    }
                });
                this.classesData = newClassesData;
                this.customData = newClassesData;
                this.detailData = newDetailData;
            }
        },
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
                this.classes.series = Object.values(value);
                this.classes.options.labels = Object.keys(value);
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
                this.custom.series = Object.values(value);
                this.custom.options.labels = Object.keys(value);
                this.custom.loading = false;
            }
        }
    }
};
