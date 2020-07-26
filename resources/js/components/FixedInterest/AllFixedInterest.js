import moment from "moment";

export default {
    data() {
        return {
            dialog: false,
            form: {
                edit: false,
                valid: true,
                inputs: {
                    name: "",
                    rate: "",
                    deadline: "",
                    amount: "",
                    start_date: moment().format("YYYY-MM-DD"),
                    expiration_date: moment().format("YYYY-MM-DD"),
                    gross_return: "",
                    asset_class_id: null
                },
                rules: {
                    name: [v => !!v || "Name is required"],
                    rate: [
                        v => !!v || "Rate is required",
                        v => v > 0 || "Rate should be greather than zero"
                    ],
                    deadline: [
                        v => !!v || "Deadline is required",
                        v => v > 0 || "Deadline should be greather than zero"
                    ],
                    amount: [
                        v => !!v || "Amount is required",
                        v => v > 0 || "Amount should be greather than zero"
                    ],
                    gross_return: [
                        v => !!v || "Gross return is required",
                        v =>
                            v > 0 || "Gross return should be greather than zero"
                    ]
                }
            },
            assetClasses: [],
            start_date_menu: false,
            expiration_date_menu: false,
            snackbar: {
                show: false,
                color: "",
                mode: "multi-line",
                text: "",
                timeout: 2500,
                x: "right",
                y: "top"
            },
            headers: [
                { text: "Name", value: "name" },
                { text: "Rate", value: "rate" },
                { text: "Deadline", value: "deadline" },
                { text: "Amount", value: "amount" },
                { text: "Start date", value: "start_date" },
                { text: "Expiration date", value: "expiration_date" },
                { text: "Gross return", value: "gross_return" }
            ],
            investments: [],
            loading: true,
            selected: {},
            menu: {
                show: false,
                x: 0,
                y: 0
            },
            confirmDeleteDialog: false
        };
    },
    created() {
        this.getAssetClasses();
        this.getFixedInterestInvestments();
    },
    watch: {
        "form.inputs.start_date": {
            handler() {
                this.suggestExpirationDate();
            }
        },
        "form.inputs.deadline": {
            handler() {
                this.suggestExpirationDate();
                this.suggestGrossReturn();
            }
        },
        "form.inputs.rate": {
            handler() {
                this.suggestGrossReturn();
            }
        },
        "form.inputs.amount": {
            handler() {
                this.suggestGrossReturn();
            }
        }
    },
    methods: {
        getAssetClasses() {
            axios.get("/api/asset-classes").then(response => {
                this.assetClasses = response.data;
            });
        },
        close() {
            this.dialog = false;
            this.form.edit = false;
            this.$refs.form.resetValidation();
            this.$refs.form.reset();
        },
        submit() {
            if (this.form.edit) {
                this.update();
            } else {
                this.create();
            }
        },
        create() {
            if (this.$refs.form.validate()) {
                axios
                    .post("/api/fixed-interest", this.form.inputs)
                    .then(response => {
                        if (response.status === 201) {
                            this.snackbar = {
                                ...this.snackbar,
                                show: true,
                                text: "Investment saved correctly",
                                color: "success"
                            };
                            this.dialog = false;
                            this.selected = {};
                            this.$refs.form.resetValidation();
                            this.$refs.form.reset();
                            this.getFixedInterestInvestments();
                        } else {
                            this.snackbar = {
                                ...this.snackbar,
                                show: true,
                                text:
                                    "Investment could not be saved, try again",
                                color: "error"
                            };
                        }
                    })
                    .catch(error => {
                        this.snackbar = {
                            ...this.snackbar,
                            show: true,
                            text: "Investment could not be saved, try again",
                            color: "error"
                        };
                    });
            }
        },
        update() {
            if (this.$refs.form.validate()) {
                axios
                    .put(
                        `/api/fixed-interest/${this.selected.id}`,
                        this.form.inputs
                    )
                    .then(response => {
                        if (response.status === 200) {
                            this.snackbar = {
                                ...this.snackbar,
                                show: true,
                                text: "Investment updated correctly",
                                color: "success"
                            };
                            this.dialog = false;
                            this.form.edit = false;
                            this.selected = {};
                            this.$refs.form.resetValidation();
                            this.$refs.form.reset();
                            this.getFixedInterestInvestments();
                        } else {
                            this.snackbar = {
                                ...this.snackbar,
                                show: true,
                                text:
                                    "Investment could not be updated, try again",
                                color: "error"
                            };
                        }
                    })
                    .catch(error => {
                        this.snackbar = {
                            ...this.snackbar,
                            show: true,
                            text: "Investment could not be saved, try again",
                            color: "error"
                        };
                    });
            }
        },
        deleteInvestment() {
            axios
                .delete(`/api/fixed-interest/${this.selected.id}`)
                .then(response => {
                    if (response.status === 204) {
                        this.snackbar = {
                            ...this.snackbar,
                            show: true,
                            text: "Investment deleted"
                        };
                        this.confirmDeleteDialog = false;
                        this.selected = {};
                        this.getFixedInterestInvestments();
                    } else {
                        this.snackbar = {
                            ...this.snackbar,
                            show: true,
                            text:
                                "Investment action could not be completed, try again",
                            color: "error"
                        };
                    }
                })
                .catch(error => {
                    this.snackbar = {
                        ...this.snackbar,
                        show: true,
                        text:
                            "Investment action could not be completed, try again",
                        color: "error"
                    };
                });
        },
        getFixedInterestInvestments() {
            axios.get("/api/fixed-interest").then(response => {
                this.investments = response.data;
                this.loading = false;
            });
        },
        getConditionalFormat(value) {
            let day = moment(value, "YYYY-MM-DD", "es");
            let diff = moment().diff(day, "days");

            if (day.isSame(moment().format("YYYY-MM-DD", "day"))) {
                // today
                return "orange--text";
            } else if (
                day.isSameOrAfter(moment().format("YYYY-MM-DD", "day"))
            ) {
                //past
                return "red--text";
            } else if (diff <= 7 && diff > 0) {
                // less than 7 days
                return "green--text";
            }

            return "";
        },
        contextMenu(e, row) {
            e.preventDefault();
            this.menu.show = false;
            this.menu.x = e.clientX;
            this.menu.y = e.clientY;
            this.selected = row.item;
            this.$nextTick(() => {
                this.menu.show = true;
            });
        },
        confirmDelete() {
            this.confirmDeleteDialog = true;
        },
        openEdit() {
            this.form.edit = true;
            this.form.inputs = {
                name: this.selected.name,
                rate: this.selected.rate,
                deadline: this.selected.deadline,
                amount: this.selected.amount,
                start_date: this.selected.start_date,
                expiration_date: this.selected.expiration_date,
                gross_return: this.selected.gross_return,
                asset_class_id: this.selected.asset_class_id
            };
            this.dialog = true;
        },
        suggestExpirationDate() {
            if (Number(this.form.inputs.deadline) <= 0) {
                return;
            }

            if (!moment(this.form.inputs.start_date, "YYYY-MM-DD").isValid()) {
                return;
            }

            this.form.inputs.expiration_date = moment(
                this.form.inputs.start_date,
                "YYYY-MM-DD"
            )
                .add(Number(this.form.inputs.deadline), "days")
                .format("YYYY-MM-DD");
        },
        suggestGrossReturn() {
            if (Number(this.form.inputs.deadline) <= 0) {
                return;
            }
            if (Number(this.form.inputs.rate) <= 0) {
                return;
            }
            if (Number(this.form.inputs.amount) <= 0) {
                return;
            }

            if (!this.form.edit || !this.form.inputs.gross_return) {
                this.form.inputs.gross_return = (
                    (Number(this.form.inputs.rate) / 360 / 100) *
                    Number(this.form.inputs.deadline) *
                    Number(this.form.inputs.amount)
                ).toFixed(2);
            }
        }
    }
};
