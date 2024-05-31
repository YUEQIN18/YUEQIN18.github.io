import { defineUserConfig } from "vuepress";
import theme from "./theme.js";

export default defineUserConfig({
  base: "/",

  locales: {
    "/": {
      lang: "zh-CN",
      title: "Roy的博客",
      description: "Roy的博客, powered by vuepress",
    },
    // "/zh/": {
    //   lang: "zh-CN",
    //   title: "Roy的博客",
    //   description: "Roy的博客, powered by vuepress",
    // },
  },

  theme,

  

  // Enable it with pwa
  // shouldPrefetch: false,
});
