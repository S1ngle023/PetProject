import { createApp } from "vue";
import App from "@/App.vue";
import "./assets/style.scss";
import store from "@/store/index.js";
import router from "@/router/router.js";

const app = createApp(App);
app.use(store);
app.use(router);
app.mount("#app");
