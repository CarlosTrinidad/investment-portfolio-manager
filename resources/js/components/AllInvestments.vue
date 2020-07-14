<template>
    <div>
        <h3 class="text-center">All Stocks</h3>
        <br />

        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Author</th>
                    <th>Created At</th>
                    <th>Updated At</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="purchase in purchases" :key="purchase.id">
                    <td>{{ purchase.id }}</td>
                    <td>{{ purchase.name }}</td>
                    <td>{{ purchase.shares }}</td>
                    <td>{{ purchase.created_at }}</td>
                    <td>{{ purchase.updated_at }}</td>
                    <td>
                        <div class="btn-group" role="group">
                            <router-link
                                :to="{
                                    name: 'edit',
                                    params: { id: purchase.id }
                                }"
                                class="btn btn-primary"
                                >Edit
                            </router-link>
                            <button
                                class="btn btn-danger"
                                @click="deletepurchase(purchase.id)"
                            >
                                Delete
                            </button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
    data() {
        return {
            purchases: []
        };
    },
    created() {
        // let api_url = process.env.MIX_ALPHA_API_KEY;
        axios.get("/api/purchases").then(response => {
            this.purchases = response.data;
        });
    },
    methods: {
        // deletepurchases(id) {
        //     this.axios
        //         .delete(`http://localhost:8000/api/purchases/delete/${id}`)
        //         .then(response => {
        //             let i = this.purchasess.map(item => item.id).indexOf(id); // find index of your object
        //             this.purchasess.splice(i, 1)
        //         });
        // }
    }
};
</script>
