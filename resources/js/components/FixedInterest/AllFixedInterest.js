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
                    start_date: new Date().toISOString().substr(0, 10),
                    expiration_date: new Date().toISOString().substr(0, 10),
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
            }
        };
    },
    created() {
        this.getAssetClasses();
    },
    watch: {
        // TODO: add watch to start date to add deadline and calculate expiration date
        // TODO: add watch to calculate gross_return
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
                // this.update();
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
                            // this.selected = {};
                            // this.expanded = [];
                            this.$refs.form.resetValidation();
                            this.$refs.form.reset();
                            // TODO: Change to get list of all investments
                            // this.getGroupedPurchases();
                        } else {
                            this.snackbar = {
                                ...this.snackbar,
                                show: true,
                                text: "Investment could not be saved, try again",
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
        }
    }
};
