import { navbar } from "vuepress-theme-hope";

export const zhNavbar = navbar([
  "/",
  {
    text: "文章",
    icon: "pen-to-square",
    prefix: "/posts/",
    children: [
      {
        text: "Java",
        prefix: "java/",
        children: [
          { text: "Java ThreadLocal浅析", icon: "pen-to-square", link: "javaThreadLocal" },
          { text: "Java List自定义去重", icon: "pen-to-square", link: "javaListDistinct" },
          { text: "Java List的浅拷贝与深拷贝", icon: "pen-to-square", link: "javaDeepCopy" },
        ]
      },
      {
        text: "Database",
        prefix: "database/",
        children: [
          {text: "MongoDB优化大量插入", icon: "pen-to-square", link: "mongodbMultiInsert"},
          {text: "Elasticsearch基础篇", icon: "pen-to-square", link: "ElasticsearchIntro"},
        ]
      }
    ]
  },
  {
    text: "算法",
    icon: "book",
    prefix: "/algorithm/",
    children: [
      { text: "数组问题", icon: "book", link: "array" },
      { text: "回溯算法问题", icon: "book", link: "backtrack" },
      { text: "二叉树问题", icon: "book", link: "binaryTree" },
      { text: "动态规划问题", icon: "book", link: "dynamic" },
      { text: "图问题", icon: "book", link: "graph" },
      { text: "栈与队列问题", icon: "book", link: "stackAndQueue" },
      { text: "字符串问题", icon: "book", link: "string" },
      { text: "前缀树问题", icon: "book", link: "trieTree" }
    ]
  },
    // "/demo/",
  {
    text: "关于作者",
    // icon: "lightbulb",
    icon: "circle-info",
    link: "intro",
  }
]);
