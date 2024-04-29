import { defineUserConfig } from "vuepress";
import theme from "./theme.js";

export default defineUserConfig({
  base: "/",

  locales: {
    "/": {
      lang: "en-US",
      title: "Personal Blog of QinYue",
      description: "Personal Blog of QinYue, powered by vuepress",
    },
    "/zh/": {
      lang: "zh-CN",
      title: "QinYue的个人博客",
      description: "QinYue的个人博客, powered by vuepress",
    },
  },

  theme,

  // Enable it with pwa
  // shouldPrefetch: false,
});
