import { navbar } from "vuepress-theme-hope";

export const enNavbar = navbar([
  "/en/",
  {
    text: "Posts",
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
    text: "Algorithm",
    icon: "book",
    prefix: "/algorithm/",
    children: [
      { text: "Array", icon: "pen-to-square", link: "array" },
      { text: "Backtrack", icon: "pen-to-square", link: "backtrack" },
      { text: "BinaryTree", icon: "pen-to-square", link: "binaryTree" },
      { text: "Dynamic", icon: "pen-to-square", link: "dynamic" },
      { text: "Graph", icon: "pen-to-square", link: "graph" },
      { text: "StackAndQueue", icon: "pen-to-square", link: "stackAndQueue" },
      { text: "String", icon: "pen-to-square", link: "string" },
      { text: "TrieTree", icon: "pen-to-square", link: "trieTree" }
    ]
  },
    // "/demo/",
  {
    text: "About",
    // icon: "lightbulb",
    icon: "circle-info",
    link: "intro",
  }
]);
