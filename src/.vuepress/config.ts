import { defineUserConfig } from "vuepress";
import theme from "./theme.js";

export default defineUserConfig({
  base: "/",

  locales: {
    "/": {
      lang: "zh-CN",
      title: "Roy的个站",
      description: "Roy的个站, powered by vuepress",
    },
    // "/zh/": {
    //   lang: "zh-CN",
    //   title: "Roy的个站",
    //   description: "Roy的个站, powered by vuepress",
    // },
  },

  theme,

  

  // Enable it with pwa
  // shouldPrefetch: false,
});
