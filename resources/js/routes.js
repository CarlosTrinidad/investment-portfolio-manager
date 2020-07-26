import AllFixedInterest from "./components/FixedInterest/AllFixedInterest.vue";
import AllPurchases from "./components/Purchases/AllPurchases.vue";
import Home from "./components/Home/Home.vue";

export const routes = [
    {
        name: "home",
        path: "/",
        component: Home
    },
    {
        name: "variable-interest",
        path: "/variable-interest",
        component: AllPurchases
    },
    {
        name: "fixed-interest",
        path: "/fixed-interest",
        component: AllFixedInterest
    }
];
