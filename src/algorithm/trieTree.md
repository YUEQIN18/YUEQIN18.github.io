---
title: 前缀树问题
order: 1
author: Roy
date: 2024-01-01
category:
  - 算法
tag:
  - 算法
  - LeetCode
sticky: false
star: false
copyright: Copyright © 2024 Roy
---

# 前缀树

前缀树（Trie，字典树），是一种多叉树。

## 从二叉树说起

为了理解前缀树，我们先从「二叉树」说起。
常见的二叉树结构是下面这样的：
```java
class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
}
```

可以看到一个树的节点包含了三个元素：该节点本身的值，左子树的指针，右子树的指针。

二叉树的每个节点只有两个孩子，那如果每个节点可以有多个孩子呢？
这就形成了「多叉树」。多叉树的子节点数目一般不是固定的，所以会用变长数组来保存所有的子节点的指针。多叉树的结构是下面这样：

```java
class TreeNode {
    int val;
    List<TreeNode> children;
}
```
## 前缀树的结构
「前缀树」是一种特殊的多叉树，它的 TrieNode 中 chidren 是一个大小为 26 的一维数组（当输入只有小写字符），分别对应了26个英文字符 'a' ~ 'z'，也就是说形成了一棵「26 叉树」。

前缀树的结构可以定义为下面这样：
```java
class Trie {
    private boolean isWord;
    private Trie[] next;
    public Trie() {
        this.isWord = false;
        this.next = new Trie[26];
    }
}
```
TrieNode 里面存储了两个信息：
- next 是该节点的所有子节点。
- isWord 表示从根节点到当前节点为止，该路径是否形成了一个有效的字符串。

## 前缀树的查询
在判断一个关键词是否在「前缀树」中时，需要依次遍历该关键词所有字符，在前缀树中找出这条路径。可能出现三种情况：

- 在寻找路径的过程中，发现到某个位置路径断了。比如在上面的前缀树图中寻找 "d" 或者 "ar" 或者 "any" ，由于树中没有构建对应的节点，那么就查找不到这些关键词；
- 找到了这条路径，但是最后一个节点的 isWord 为 false。这也说明没有该关键词。比如在上面的前缀树图中寻找 "a" ；
- 找到了这条路径，并且最后一个节点的 isWord 为 true。这说明前缀树存储了这个关键词，比如上面前缀树图中的 "am" , "cv" 等。

## 前缀树的应用
上面说了这么多前缀树，那前缀树有什么用呢？

比如我们常见的电话拨号键盘，当我们输入一些数字的时候，后面会自动提示以我们的输入数字为开头的所有号码。
比如我们的英文输入法，当我们输入半个单词的时候，输入法上面会自动联想和补全后面可能的单词。
再比如在搜索框搜索的时候，输入"字节"，后面会联想到"跳动"等等。

## 211. 添加与搜索单词 - 数据结构设计

本题是前缀树的变种： '.' 可以表示任何一个小写字符。

在搜索的过程中，如果遇到了 '.' ，则需要对当前节点的所有子树都进行遍历，只要有任何一个子树能最终匹配完成，那么就代表能匹配完成。

这里使用个dfs也就是深度优先遍历，关于dfs和bfs的选择问题，我认为当问题是要查找某个节点时，适合深度优先；当寻找最短路径时使用广度优先。

```java
class WordDictionary {

        private boolean end;

        private WordDictionary[] next;
        public WordDictionary() {
            this.end = false;
            this.next = new WordDictionary[26];
        }

        public void addWord(String word) {
            if (Objects.isNull(word) || word.isEmpty()) return;
            WordDictionary cur = this;
            for (char c : word.toCharArray()) {
                if (cur.next[c - 'a'] == null) {
                    cur.next[c - 'a'] = new WordDictionary();
                }
                cur = cur.next[c - 'a'];
            }
            cur.end = true;
        }

        public boolean search(String word) {
            if (Objects.isNull(word) || word.isEmpty()) return false;
            return dfs(word, this, 0);
        }

        public boolean dfs(String s, WordDictionary cur, int index) {
            int n = s.length();
            if (n == index) return cur.end;
            char c = s.charAt(index);
            if (c == '.') {
                // 遍历所有可能
                for (int i = 0; i < 26; i++) {
                    if (cur.next[i] != null && dfs(s, cur.next[i], index + 1)) return true;
                }
                return false;
            } else {
                if (cur.next[c - 'a'] == null) return false;
                return dfs(s, cur.next[c - 'a'], index + 1);
            }
        }
    }
```