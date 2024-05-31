---
title: 二叉树问题
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

# 二叉树的遍历
二叉树主要有两种遍历方式：

深度优先遍历：先往深走，遇到叶子节点再往回走。

广度优先遍历：一层一层的去遍历。

那么从深度优先遍历和广度优先遍历进一步拓展，才有如下遍历方式：

深度优先遍历
- 前序遍历（递归法，迭代法）
- 中序遍历（递归法，迭代法）
- 后序遍历（递归法，迭代法）

广度优先遍历
- 层次遍历（迭代法）

在深度优先遍历中：有三个顺序，前中后序遍历，这里前中后，其实指的就是中间节点的遍历顺序，只要大家记住 前中后序指的就是中间节点的位置就可以了。
看如下中间节点的顺序，就可以发现，中间节点的顺序就是所谓的遍历方式
- 前序遍历：中左右
- 中序遍历：左中右
- 后序遍历：左右中
## 144. 二叉树的前序遍历
```java
class Solution {
    public List<Integer> preorderTraversal(TreeNode root) {
        List<Integer> res = new LinkedList<>();
        traversal(root, res);
        return res;
    }   
    public void traversal(TreeNode root, List<Integer> res) {
        if(root == null) return;
        res.add(root.val);
        traversal(root.left, res);
        traversal(root.right, res);
    }
}
```

迭代法
```java
class Solution {
    public List<Integer> inorderTraversal(TreeNode root) {
        List<Integer> res = new LinkedList<>();
        Stack<TreeNode> s = new Stack<>();
        if(root != null) s.push(root);
        while(!s.isEmpty()){
            TreeNode node = s.peek();
            if(node != null){
                s.pop();
                if(node.right != null) s.push(node.right); //右
                if(node.left != null) s.push(node.left); //左
                s.push(node); //中
                s.push(null);
            }else{
                s.pop();
                res.add(s.pop().val);
            }
        }
        return res;
    }
}
```

## 145. 二叉树的后序遍历
```java
class Solution {
    public List<Integer> postorderTraversal(TreeNode root) {
        List<Integer> res = new LinkedList<>();
        traversal(root, res);
        return res;
    }
    public void traversal(TreeNode root, List<Integer> res){
        if(root == null) return;
        traversal(root.left, res);
        traversal(root.right, res);
        res.add(root.val);
    }
}
```

迭代法
```java
class Solution {
    public List<Integer> inorderTraversal(TreeNode root) {
        List<Integer> res = new LinkedList<>();
        Stack<TreeNode> s = new Stack<>();
        if(root != null) s.push(root);
        while(!s.isEmpty()){
            TreeNode node = s.peek();
            if(node != null){
                s.pop();
                s.push(node); //中
                s.push(null);
                if(node.right != null) s.push(node.right); //右
                if(node.left != null) s.push(node.left); //左
            }else{
                s.pop();
                res.add(s.pop().val);
            }
        }
        return res;
    }
}
```

## 94.二叉树的中序遍历
递归法
```java
class Solution {
    public List<Integer> inorderTraversal(TreeNode root) {
        List<Integer> res = new LinkedList<>();
        traversal(root, res);
        return res;
    }
    public void traversal(TreeNode root, List<Integer> res) {
        if(root == null) return;
        traversal(root.left, res);
        res.add(root.val);
        traversal(root.right, res);
    }
}
```

迭代法
```java
class Solution {
    public List<Integer> inorderTraversal(TreeNode root) {
        List<Integer> res = new LinkedList<>();
        Stack<TreeNode> s = new Stack<>();
        if(root != null) s.push(root);
        while(!s.isEmpty()){
            TreeNode node = s.peek();
            if(node != null){
                s.pop();
                if(node.right != null) s.push(node.right); //右
                s.push(node); //中
                s.push(null);
                if(node.left != null) s.push(node.left); //左
            }else{
                s.pop();
                res.add(s.pop().val);
            }
        }
        return res;
    }
}
```

## 102. 二叉树的层序遍历
```java
class Solution {
    public List<List<Integer>> levelOrder(TreeNode root) {
        List<List<Integer>> res = new LinkedList<>();
        if(root == null) return res;
        Queue<TreeNode> q = new LinkedList<>();
        q.offer(root);
        while(!q.isEmpty()){
            List<Integer> list = new LinkedList<>();
            int len = q.size();
            while(len-- > 0){
                TreeNode node = q.poll();
                list.add(node.val);
                if(node.left != null) q.offer(node.left);
                if(node.right != null) q.offer(node.right);
            }
            res.add(list);
        }
        return res;
    }
}
```

## 107. 二叉树的层序遍历 II
```java
这道题要求从叶子节点，从下至上进行层序遍历，具体思路是在res链表添加元素时，在头部添加即可。
class Solution {
    public List<List<Integer>> levelOrderBottom(TreeNode root) {
        List<List<Integer>> res = new LinkedList<>();
        Queue<TreeNode> q = new LinkedList<>();
        if(root == null) return res;
        q.offer(root);
        while(!q.isEmpty()){
            List<Integer> list = new LinkedList<>();
            int len = q.size();
            while(len-- > 0){
                TreeNode node = q.poll();
                list.add(node.val);
                if(node.left != null) q.offer(node.left);
                if(node.right != null) q.offer(node.right);
            }
            res.add(0, list);
        }
        return res;
    }
}
```

## 199. 二叉树的右视图
```java
依然是层序遍历，每一层只获取最后一个元素即可。值得注意的是，向队列添加元素时，**要先添加left再添加right**，因为队列先进先出，这样最后弹出的就是最右边的元素。
class Solution {
    public List<Integer> rightSideView(TreeNode root) {
        List<Integer> res = new LinkedList<>();
        Queue<TreeNode> q = new LinkedList<>();
        if(root == null) return res;
        q.offer(root);
        while(!q.isEmpty()){
            int len = q.size();
            int ans = 0;
            while(len-- > 0){
                TreeNode node = q.poll();
                ans = node.val;
                if(node.left != null) q.offer(node.left);
                if(node.right != null) q.offer(node.right);
            }
            res.add(ans);
        }
        return res;
    }
}
```

## 429. N 叉树的层序遍历
```java
class Solution {
    public List<List<Integer>> levelOrder(Node root) {
        List<List<Integer>> res = new LinkedList<>();
        Queue<Node> q = new LinkedList<>();
        if(root == null) return res;
        q.offer(root);
        while(!q.isEmpty()){
            int len = q.size();
            List<Integer> list = new LinkedList<>();
            while(len-- > 0){
                Node node = q.poll();
                list.add(node.val);
                if(node.children != null) {
                    for(Node n : node.children){
                        q.offer(n);
                    }
                }
            }
            res.add(list);
        }
        return res;
    }
}
```

## 116. 填充每个节点的下一个右侧节点指针
```java
class Solution {
    public Node connect(Node root) {
        if(root == null) return root;
        Node cur = root;
        Queue<Node> q = new LinkedList<>();
        q.offer(root);
        while(!q.isEmpty()){
            int len = q.size();
            Stack<Node> s= new Stack<>();
            while(len-- > 0){
                Node node = q.poll();
                if(node.left != null) q.offer(node.left);
                if(node.right != null) q.offer(node.right);
                if(!s.isEmpty()){
                    Node n = s.peek();
                    n.next = node;
                }
                s.push(node);
            }
        }
        return root;
    }
}
```

## 226. 翻转二叉树
```java
class Solution {
    public TreeNode invertTree(TreeNode root) {
        if(root == null) return root;
        TreeNode cur = root;
        Queue<TreeNode> q = new LinkedList<>();
        q.offer(root);
        while(!q.isEmpty()){
            int len = q.size();
            while(len-- > 0){
                TreeNode node = q.poll();
                if(node.left != null) q.offer(node.left);
                if(node.right != null) q.offer(node.right);
                if(node.left != null || node.right != null){
                    TreeNode temp = node.left;
                    node.left = node.right;
                    node.right = temp;    
                }
            }
        }
        return root;
    }
}
```

## 101. 对称二叉树
这道题的思路比较简单，但我一开始没想到。可以用两个指针q,p来遍历左子树和右子树。如果是完全对称的二叉树，其左子树应该和右子树相同。
```java
class Solution {
    public boolean isSymmetric(TreeNode root) {
        return check(root, root);
    }
    public boolean check(TreeNode q, TreeNode p){
        if(q == null && p == null) return true;
        if(q == null || p == null) return false;
        return q.val == p.val && check(q.left, p.right) && check(q.right, p.left);
    }
}
```


## 222. 完全二叉树的节点个数
递归法（后序遍历）
```java
class Solution {
    public int countNodes(TreeNode root) {
        if(root == null) return 0;
        int left = countNodes(root.left);
        int right = countNodes(root.right);
        return left + right + 1;
    }
}
```

层序遍历
```java
class Solution {
    public int countNodes(TreeNode root) {
        if(root == null) return 0;
        int count = 0;
        Queue<TreeNode> q = new LinkedList<>();
        q.offer(root);
        while(!q.isEmpty()){
            int len = q.size();
            while(len-- > 0){
                TreeNode node = q.poll();
                count++;
                if(node.left != null) q.offer(node.left);
                if(node.right != null) q.offer(node.right);
            }
        }
        return count;
    }
}
```

## 404. 左叶子之和
```java
左叶子就是叶子结点，如果不是叶子节点则不算。使用递归法，后序遍历，在返回值上累加即可。
class Solution {
    public int sumOfLeftLeaves(TreeNode root) {
        if(root == null) return 0;
        
        int leftSum = sumOfLeftLeaves(root.left);
        if(root.left != null && root.left.left == null && root.left.right == null){
            leftSum += root.left.val;
        }
        int rightSum = sumOfLeftLeaves(root.right);
        return leftSum + rightSum;
    }
}

```

## 513. 找树左下角的值
递归法
```java
class Solution {
    public int maxDepth = Integer.MIN_VALUE;
    public int result;
    public int findBottomLeftValue(TreeNode root) {
        find(root, 0);
        return result;
    }
    public void find(TreeNode root, int depth){
        if (root == null) return;
        depth++;
        if(depth > maxDepth){
            maxDepth = depth;
            result = root.val; // 中
        }
        find(root.left, depth); // 左
        find(root.right, depth); // 右
    }
}
```

层序遍历法
```java
class Solution {
    public int findBottomLeftValue(TreeNode root) {
        Queue<TreeNode> q = new LinkedList<>();
        q.offer(root);
        int result = 0;
        while(!q.isEmpty()){
            int len = q.size();
            for(int i = 0; i < len;i++){
                TreeNode node = q.poll();
                if(i == 0) result = node.val;
                if(node.left != null) q.offer(node.left);
                if(node.right != null) q.offer(node.right);
            }
        }
        return result;
    }
}
```

## 112. 路径总和
```java
class Solution {
    public Boolean res = false;
    public boolean hasPathSum(TreeNode root, int targetSum) {
        findPath(root, 0, targetSum);
        return res;
    }
    public void findPath(TreeNode root, int sum, int target){
        if(root == null) return;
        sum += root.val; //中
        if(root.left == null && root.right == null && sum == target){
            res = true;
        }
        findPath(root.left, sum, target); //左
        findPath(root.right, sum, target); //右
    }
}
```

## 113. 路径总和 II
```java
class Solution {
    public List<List<Integer>> res = new LinkedList<>();
    public List<Integer> path = new LinkedList<>();
    public List<List<Integer>> pathSum(TreeNode root, int targetSum) {
        findPath(root, 0, targetSum);
        return res;
    }
    public void findPath(TreeNode root, int sum, int target){
        if(root == null) return;
        path.add(root.val); //中
        sum += root.val; 
        if(root.left == null && root.right == null && sum == target){
            res.add(new ArrayList(path));
        }
        findPath(root.left, sum, target); // 左
        findPath(root.right, sum, target); // 右
        path.remove(path.size()-1); //回溯path, sum不需要回溯因为它是临时变量
    }
}
```


# 二叉树的深度
今天依然是二叉树，要注意求二叉树的深度和高度是不同的。
二叉树的深度是从根节点到叶子节点的最大路径边的条数
二叉树的高度指的是从某个节点到叶子节点的最长路径边的条数
[binaryTreeDepth](https://picx.zhimg.com/80/v2-9670cba50e32e8d08fc3825a7ff1b4f0_1440w.png?source=d16d100b)
​
## 104. 二叉树的最大深度
```java
class Solution {
    public int maxDepth(TreeNode root) {
        if(root == null) return 0;
        Queue<TreeNode> q = new LinkedList<>();
        int depth = 0;
        q.offer(root);
        while(!q.isEmpty()){
            int len = q.size();
            while(len-- > 0){
                TreeNode node = q.poll();
                if(node.left != null) q.offer(node.left);
                if(node.right != null) q.offer(node.right);
            }
            depth++;
        }
        return depth;
    }
}
```

## 559. N 叉树的最大深度
层序遍历
```java
class Solution {
    public int maxDepth(Node root) {
        int depth = 0;
        if(root == null) return depth;
        Queue<Node> q = new LinkedList<>();
        q.offer(root);
        while(!q.isEmpty()){
            depth++;
            int len = q.size();
            while(len-- > 0){
                Node node = q.poll();
                for(Node c : node.children){
                    q.offer(c);
                }
            }
        }
        return depth;
    }
}
```

递归遍历（后序遍历）
```java
class Solution {
    public int maxDepth(Node root) {
        int depth = 0;
        if(root == null) return depth;
        for(Node n : root.children){
            depth = Math.max(depth, maxDepth(n));
        }
        return depth+1;
    }
}
```

## 111. 二叉树的最小深度
层序遍历
```java
class Solution {
    public int minDepth(TreeNode root) {
        if(root == null) return 0;
        int depth = 0;
        Queue<TreeNode> q = new LinkedList<>();
        q.offer(root);
        while(!q.isEmpty()){
            depth++;
            int len = q.size();
            while(len-- > 0){
                TreeNode node = q.poll();
                if(node.left != null) q.offer(node.left);
                if(node.right != null) q.offer(node.right);
                if(node.left == null && node.right == null){
                    return depth;
                }
            }
        }
        return depth;
    }
}
```

递归法（后序遍历）
```java
class Solution {
    public int minDepth(TreeNode root) {
        if(root == null) return 0;
        int depth = 0;
        int leftDepth = minDepth(root.left); //左
        int rightDepth = minDepth(root.right); //右
        if(root.left == null) return rightDepth + 1; //中
        if(root.right == null) return leftDepth + 1; //中
        return Math.min(leftDepth, rightDepth) + 1;
    }
}
```

## 110. 平衡二叉树
后序遍历，后序遍历是求高度的方法
```java
class Solution {
    public boolean isBalanced(TreeNode root) {
        int res = getHeight(root);
        return res == -1 ? false : true;
    }
    public int getHeight(TreeNode root){
        if(root == null) return 0;
        int leftDepth = getHeight(root.left); // 左
        if(leftDepth == -1) return -1;
        int rightDepth = getHeight(root.right); // 右
        if(rightDepth == -1) return -1;
        int res = 1;
        res = Math.abs(leftDepth - rightDepth) > 1 ? -1 : Math.max(leftDepth, rightDepth) + 1; // 中
        return res;
    }
}
```

## 257. 二叉树的所有路径
```java
class Solution {
    public List<String> binaryTreePaths(TreeNode root) {
        List<String> res = new LinkedList<>();
        LinkedList<Integer> path = new LinkedList<>();
        if(root == null) return res;
        getPath(root, path, res);
        return res;
    }
    public void getPath(TreeNode root, LinkedList<Integer> path, List<String> res){
        path.offer(root.val);
        if(root.left == null && root.right == null){
            StringBuilder sb = new StringBuilder();
            for(Integer i : path){
                sb.append(i.toString());
                sb.append("->");
            }
            sb.delete(sb.length()-2, sb.length());
            res.add(sb.toString());
            return;
        }
        if(root.left != null){
            getPath(root.left, path, res);
            path.pollLast();
        }
        if(root.right != null){
            getPath(root.right, path, res);
            path.pollLast();
        }
    }
}

```

# 构造二叉树
## 106. 从中序与后序遍历序列构造二叉树
主要思路就是后序遍历的最后一个值就是根节点，我们只需要从后序遍历入手，再找到这个值在中序遍历的索引（需要一个哈希表），就能把中序遍历分成3份，分变为[左子树，根节点，右子树]，再递归创建右子树和左子树，就能创建出整个树。
值得注意的是，一定要先创建右子树，因为只能从右子树中得到根节点，再得到所有右子树的根节点后，左子树的索引才能确定。
```java
class Solution {
    public Collection<Integer, Integer> map = new Collection<>();
    public int postIndex;
    public int[] inorder;
    public int[] postorder;
    public TreeNode buildTree(int[] inorder, int[] postorder) {
        this.inorder = inorder;
        this.postorder = postorder;
        postIndex = postorder.length - 1;
        int i = 0;
        for(int n: inorder){
            map.put(n, i++);
        }
        return build(0, inorder.length - 1);
    }
    public TreeNode build(int inLeft, int inRight){
        if(inLeft > inRight) return null;
        int val = postorder[postIndex--];
        TreeNode root = new TreeNode(val);

        int index = map.get(val);

        root.right = build(index + 1, inRight);
        root.left = build(inLeft, index - 1);
        return root;
    }
}
```

## 105. 从前序与中序遍历序列构造二叉树
 我们只需要从前序遍历入手，再找到这个值在中序遍历的索引（需要一个哈希表），就能把中序遍历分成3份，分变为[左子树，根节点，右子树]，再递归创建左子树和右子树，就能创建出整个树。
 ```java
class Solution {
    public Collection<Integer, Integer> map = new Collection<>();
    public int[] preorder;
    public int[] inorder;
    public int preIndex;
    public TreeNode buildTree(int[] preorder, int[] inorder) {
        this.preorder = preorder;
        this.inorder = inorder;
        preIndex = 0;
        int i = 0;
        for(int n : inorder){
            map.put(n, i++);
        }
        return build(0, preorder.length - 1);
    }
    public TreeNode build(int inLeft, int inRight){
        if(inLeft > inRight) return null;
        int val = preorder[preIndex++];
        TreeNode root = new TreeNode(val);
        int index = map.get(val);

        root.left = build(inLeft, index - 1);
        root.right = build(index + 1, inRight);

        return root;
    }
}
```

## 654. 最大二叉树
```java
递归法求解，前序遍历，构造二叉树一般都是前序遍历，因为要先确定二叉树的根节点，再确定左右节点，时间复杂度O(n^2)
class Solution {
    public TreeNode constructMaximumBinaryTree(int[] nums) {
        if(nums.length == 0) return null;
        return build(nums, 0, nums.length - 1);
    }
    public TreeNode build(int[] nums, int left, int right){
        if(left > right) return null;
        int index = left;
        for(int i = left + 1; i <= right; i++){
            if(nums[i] > nums[index]) index = i;
        }
        TreeNode root = new TreeNode(nums[index]);

        root.left = build(nums, left, index - 1);
        root.right = build(nums, index + 1, right);
        return root;
    }
}
```

## 617. 合并二叉树

没什么说的，简单的递归，前序遍历
```java
class Solution {
    public TreeNode mergeTrees(TreeNode root1, TreeNode root2) {
        if(root1 == null && root2 == null) return null;
        if(root1 == null && root2 != null) return root2;
        if(root1 != null && root2 == null) return root1;
        TreeNode root = new TreeNode(root1.val + root2.val);
        root.left = mergeTrees(root1.left, root2.left);
        root.right = mergeTrees(root1.right, root2.right);
        return root;
    }
}
```

# 二叉搜索树
## 700. 二叉搜索树中的搜索
```java
class Solution {
    public TreeNode searchBST(TreeNode root, int val) {
        while(root != null){
            if(root.val == val) return root;
            if(root.val < val){
                root = root.right;
            }else{
                root = root.left;
            }
        }
        return null;
    }
}
```

## 98. 验证二叉搜索树
中序遍历递归法，中序遍历的二叉搜索树应该是递增序列，所以pre > cur就不是搜索树
```java
class Solution {
    public TreeNode pre = null;
    public boolean isValidBST(TreeNode root) {
        if(root == null) return true;
        boolean left = isValidBST(root.left);
        if(pre != null && pre.val > root.val) return false;
        pre = root;
        boolean right = isValidBST(root.right);
        return left && right;
    }
}
```

中序遍历迭代法，使用null标记中节点。
```java
class Solution {
    public boolean isValidBST(TreeNode root) {
        if(root == null) return true;
        TreeNode pre = null;
        Stack<TreeNode> s = new Stack<>();
        s.push(root);
        while(!s.isEmpty()){
            TreeNode node = s.peek();
            if(node != null){
                s.pop(); //弹出，避免重复操作
                if(node.right != null) s.push(node.right); // right
                s.push(node); //中
                s.push(null); //null标记中节点
                if(node.left != null) s.push(node.left); // left
            }else{
                s.pop(); //弹出空节点
                node = s.pop();
                if(pre != null && pre.val >= node.val) return false;
                pre = node;
            }
        }
        return true;
    }
}
```

## 530. 二叉搜索树的最小绝对差
中序遍历迭代法
```java
class Solution {
    public int getMinimumDifference(TreeNode root) {
        Stack<TreeNode> s = new Stack<>();
        TreeNode pre = null;
        int diff = Integer.MAX_VALUE;
        s.push(root);
        while(!s.isEmpty()){
            TreeNode node = s.peek();
            if(node != null){
                s.pop();
                if(node.right != null) s.push(node.right);
                s.push(node);
                s.push(null);
                if(node.left != null) s.push(node.left);
            }else{
                s.pop();
                node = s.pop();
                if(pre != null) diff = Math.min(diff, Math.abs(node.val - pre.val));
                pre = node;
            }
        }
        return diff;
    }
}
```

中序遍历递归法
```java
class Solution {
    public int diff = Integer.MAX_VALUE;
    public TreeNode pre = null;
    public int getMinimumDifference(TreeNode root) {
        inorder(root);
        return diff;
    }
    public void inorder(TreeNode root){
        if(root == null) return;
        inorder(root.left);
        if(pre != null) diff = Math.min(diff, Math.abs(pre.val - root.val));
        pre = root;
        inorder(root.right);
    }
}
```

## 501. 二叉搜索树中的众数
一般来讲，求众数这种需要计算频率的问题，都会使用哈希表来记录频率，如下面这种算法。但这道题是**二叉搜索树**，一个有序的数组里，如果会出现众数，那他们一定是连续的，其实不需要一个哈希表，只需要记录前一个节点。
中序遍历，哈希表算法
```java
class Solution {
    public LinkedList<Integer> res = new LinkedList<>();
    public Map<Integer, Integer> map = new Collection<>();
    public int[] findMode(TreeNode root) {
        inorder(root);
        return res.stream().mapToInt(Integer::valueOf).toArray();
    }
    public void inorder(TreeNode root){
        if(root == null) return;
        inorder(root.left);
        map.put(root.val, map.getOrDefault(root.val, 0) + 1);
        if(res.size() != 0){
            if(map.get(root.val) > map.get(res.get(0))){
                LinkedList<Integer> result = new LinkedList<>();
                result.add(root.val);
                res = result;
            }
            else if(root.val != res.get(0) && map.get(root.val) == map.get(res.get(0))){
                res.add(root.val);
            }
        }else{
            res.add(root.val);
        }
        inorder(root.right);
    }
}
```

中序遍历，只记录前一个节点
```java
class Solution {
    public LinkedList<Integer> res = new LinkedList<>();
    public TreeNode pre = null;
    public int count = 0;
    public int maxCount = 0;;
    public int[] findMode(TreeNode root) {
        inorder(root);
        return res.stream().mapToInt(Integer::valueOf).toArray();
    }
    public void inorder(TreeNode root){
        if(root == null) return;
        inorder(root.left);

        if(pre == null || root.val != pre.val){
            count = 1;
        }else{
            count++;
        }
        if(count > maxCount){
            res.clear();
            res.add(root.val);
            maxCount = count;
        }else if(count == maxCount){
            res.add(root.val);
        }
        pre = root;

        inorder(root.right);
    }
}
```

## 236. 二叉树的最近公共祖先

最开始的思路肯定是要后序遍历，因为这道题要进行从下至上的遍历，只有后序遍历能从下至上查找。
那怎么才算找到了最近公共祖先呢？也就是说有哪些情况呢？
根据以上定义，若 root 是 p,q 的 最近公共祖先 ，则只可能为以下情况之一：
- p 和 q 在 root 的子树中，且分列 root 的 异侧（即分别在左、右子树中)
- p = root，且 q 在 root 的左或右子树中
- q = root，且 p 在 root 的左或右子树中
这道题很难想出递归的终止条件，主要还是因为，一个节点自己也是自己的祖先。
```java
class Solution {
    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        if(root == null || root == q || root == p) return root;
        TreeNode left = lowestCommonAncestor(root.left, p, q);
        TreeNode right = lowestCommonAncestor(root.right, p, q);
        if(left == null && right == null) return null;
        if(left == null && right != null) return right;
        if(left != null && right == null) return left;
        return root;
    }
}
```


## 235. 二叉搜索树的最近公共祖先
这道题的逻辑大致和[236]相同，区别是这道题是二叉搜索树，如下是二叉树找公共祖先的算法
```java
class Solution {
    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        if(root == null || root == p || root == q) return root;
        TreeNode left = lowestCommonAncestor(root.left, p, q);
        TreeNode right = lowestCommonAncestor(root.right, p, q);
        if(left == null && right == null) return null;
        if(left == null) return right;
        if(right == null) return left;
        return root;
    }
}
```

二叉搜索树是有序的，那么公共祖先已一定在[p, q]区间或者[q, p]区间内，而在这个区间内的数是不是一定是最近的公共祖先呢？
是！所以我们不需要遍历整个树，找到这个节点就立刻返回，算法如下
```java
class Solution {
    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        if (root.val > p.val && root.val > q.val) return lowestCommonAncestor(root.left, p, q);
        if (root.val < p.val && root.val < q.val) return lowestCommonAncestor(root.right, p, q);
        return root;
    }
}
```

## 701. 二叉搜索树中的插入操作
挺简单的题，不需要重构二叉搜索树，只要见缝插针就好
```java
class Solution {
    public TreeNode insertIntoBST(TreeNode root, int val) {
        if(root == null) return new TreeNode(val);
        TreeNode cur = root;
        traversal(cur, val);
        return root;
    }
    public void traversal(TreeNode root, int val){
        if(root == null) return;
        if(root.val < val) traversal(root.right, val);
        if(root.val > val) traversal(root.left, val);
        TreeNode node = new TreeNode(val);
        if(root.val < val && root.right == null) root.right = node;
        if(root.val > val && root.left == null) root.left = node;
        return;
    }
}
```

## 450. 删除二叉搜索树中的节点

在二叉搜索树中删除节点要比添加节点困难一些，主要是对树结构的修改，依然是遍历二叉搜索树（不用遍历全树），找到了要被删除的节点后，分为4种情况
1. 找到了 为叶子结点
2. 找到了 左子树为空
3. 找到了 右子树为空
4. 找到了 左右子树都不为空
复杂的是第4种，我们要将这个节点的左子树移植到这个节点的右子树的最左边，使整个树保持二叉搜索树的性质
```java
class Solution {
    public TreeNode deleteNode(TreeNode root, int key) {
        if(root == null) return root;
        if(root.val == key){
            // 1. 找到了 为叶子结点
            if(root.left == null && root.right == null){
                return null;
            }
            // 2. 找到了 左子树为空
            else if(root.left == null){
                return root.right;
            }
            // 3. 找到了 右子树为空
            else if(root.right == null){
                return root.left;
            }
            // 4. 找到了 左右子树都不为空
            else{
                TreeNode right = root.right;
                TreeNode left = root.left;
                while(right.left != null){
                    right = right.left;
                }
                right.left = left;
                return root.right;
            }
        }
        if(root.val > key) root.left = deleteNode(root.left, key);
        if(root.val < key) root.right = deleteNode(root.right, key);
        return root;
    }
}
```

## 669. 修剪二叉搜索树
看起来挺难的题，对于二叉树的修剪我总是想到左旋和右旋，但实际上这是二叉搜索树，不用那么麻烦。
对于这道题前序遍历是很方便的，实际上对于每个节点，需判断他是否小于下界，如果是就直接把他的右子树遍历返回，再判断是否大于上界，如果是就遍历左子树然后返回。然后再正常遍历左右子树。
```java
class Solution {
    public TreeNode trimBST(TreeNode root, int low, int high) {
        if(root == null) return root;
        if(root.val < low){
            TreeNode right = trimBST(root.right, low, high);
            return right;
        }
        if(root.val > high){
            TreeNode left = trimBST(root.left, low, high);
            return left;
        }
        root.left = trimBST(root.left, low, high);
        root.right = trimBST(root.right, low, high);
        return root;

    }
}
```

## 108. 将有序数组转换为二叉搜索树
构建二叉树需要分割数组，显然这个有序数组是经过中序遍历得到的，那么我们取数组中间的值开始递归构造即可。
```java
class Solution {
    public TreeNode sortedArrayToBST(int[] nums) {
        return build(nums, 0, nums.length - 1);
    }
    public TreeNode build(int[] nums, int left, int right){
        if(left > right) return null;
        int mid = left + (right - left) / 2;
        TreeNode node = new TreeNode(nums[mid]);
        node.left = build(nums, left, mid - 1);
        node.right = build(nums, mid + 1, right);
        return node;
    }
}
```

## 538. 把二叉搜索树转换为累加树
```java
class Solution {
    public int sum = 0;
    public TreeNode convertBST(TreeNode root) {
        traversal(root);
        return root;
    }
    public void traversal(TreeNode root){
        if(root == null) return;
        convertBST(root.right); 
        sum += root.val;
        root.val = sum;
        convertBST(root.left);
    }
}
```
