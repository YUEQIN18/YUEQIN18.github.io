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
        prefix: "apple/",
        children: [
          { text: "Apple1", icon: "pen-to-square", link: "1" },
          { text: "Apple2", icon: "pen-to-square", link: "2" },
        ]
      },
      {
        text: "Framework",
        prefix: "banana/",
        children: [
          {text: "Banana 1",icon: "pen-to-square",link: "1",},
        ]
      },
      {
        text: "Database",
        prefix: "banana/",
        children: [
          {text: "Banana 1",icon: "pen-to-square",link: "1",},
        ]
      }
    ]
  },
  {
    text: "算法",
    icon: "book",
    prefix: "/algorithm/",
    children: [
      { text: "数组", icon: "pen-to-square", link: "array" },
      { text: "回溯", icon: "pen-to-square", link: "backtrack" },
      { text: "二叉树", icon: "pen-to-square", link: "binaryTree" },
      { text: "动态规划", icon: "pen-to-square", link: "dynamic" },
      { text: "图论", icon: "pen-to-square", link: "graph" },
      { text: "栈与队列", icon: "pen-to-square", link: "stackAndQueue" },
      { text: "字符串", icon: "pen-to-square", link: "string" },
      { text: "前缀树", icon: "pen-to-square", link: "trieTree" }
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
