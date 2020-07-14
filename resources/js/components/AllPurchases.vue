<template>
    <v-row align="start" justify="center">
        <v-col cols="11">
            <v-row>
                <div class="transition-swing text-h4">Purchases</div>
            </v-row>
            <br />

            <v-data-table
                :headers="headers"
                :items="purchases"
                multi-sort
                :disable-pagination="true"
                :hide-default-footer="true"
                :fixed-header="true"
                :calculate-widths="true"
                :loading="loading"
            ></v-data-table>
        </v-col>
    </v-row>
</template>

<script>
export default {
    data() {
        return {
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
    methods: {}
};
</script>
