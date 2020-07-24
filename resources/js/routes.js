import AllFixedInterest from "./components/FixedInterest/AllFixedInterest.vue";
import AllPurchases from "./components/Purchases/AllPurchases.vue";

export const routes = [
    {
        name: "home",
        path: "/",
        component: AllPurchases
    },
    {
        name: "fixed-interest",
        path: "/fixed-interest",
        component: AllFixedInterest
    }
];
