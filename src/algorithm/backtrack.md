# 回溯算法

**回溯是递归的副产品，只要有递归就会有回溯**，所以回溯法也经常和二叉树遍历，深度优先搜索混在一起，因为这两种方式都是用了递归。

回溯法就是暴力搜索，并不是什么高效的算法，最多再剪枝一下。

回溯算法能解决如下问题：
- 组合问题：N个数里面按一定规则找出k个数的集合
- 排列问题：N个数按一定规则全排列，有几种排列方式
- 切割问题：一个字符串按一定规则有几种切割方式
- 子集问题：一个N个数的集合里有多少符合条件的子集
- 棋盘问题：N皇后，解数独等等

**将递归遍历过程抽象为树形结构可以便于理解！**

递归回溯算法（深度优先遍历dfs）的模板
```
void backtracking(参数) {
    if (终止条件) {
        存放结果;
        return;
    }

    for (选择：本层集合中元素（树中节点孩子的数量就是集合的大小）) {
        处理节点;
        backtracking(路径，选择列表); // 递归
        回溯，撤销处理结果
    }
}
```

## 组合问题
for循环横向遍历，递归纵向遍历，回溯不断调整结果集，这个理念贯穿整个回溯法系列

组合问题是相对简单的问题，去重时**只需考虑树层的去重**。

所以组合问题中最常用的去重方法就是startIndex，因为[2, 2, 3] 与 [2, 3, 2] 视为相同列表，我们需要按照索引顺序搜索

**关于树层去重的几种方法**：
- 对于数组，先进行排序，然后判断i > start && nums[i] == nums[i-1] 跳过相同的元素
- 使用临时变量哈希表，记录每一层使用的元素，跳过相同的元素


### 77. 组合
```java
class Solution {
    public List<List<Integer>> res = new ArrayList<>();
    public LinkedList<Integer> path = new LinkedList<>();
    public List<List<Integer>> combine(int n, int k) {
        backTracking(n, k, 1);
        return res;
    }
    public void backTracking(int n, int k, int startIndex){
        if(path.size() == k){
            res.add(new ArrayList<>(path));
            return;
        }
        for(int i = startIndex; i <= n; i++){
            path.offerLast(i);
            backTracking(n, k, i + 1);
            path.pollLast();
        }
    }
}
```

优化：分析搜索起点的上界进行剪枝
1. 已经选择的元素个数：path.size();
2. 还需要的元素个数为: k - path.size();
3. 在集合n中至多要从该起始位置 : n - (k - path.size()) + 1，开始遍历
为什么有个+1呢，因为包括起始位置，我们要是一个左闭的集合。

举个例子，n = 4，k = 3， 目前已经选取的元素为0（path.size为0），n - (k - 0) + 1 即 4 - ( 3 - 0) + 1 = 2。

从2开始搜索都是合理的，可以是组合[2, 3, 4]。

这里大家想不懂的话，建议也举一个例子，就知道是不是要+1了。

所以优化之后的for循环是：
```
for (int i = startIndex; i <= n - (k - path.size()) + 1; i++) // i为本次搜索的起始位置
```

### 39. 组合总和

```java
class Solution {
    public List<List<Integer>> res = new ArrayList<>();
    public LinkedList<Integer> path = new LinkedList<>();
    public int sum = 0;
    public List<List<Integer>> combinationSum(int[] candidates, int target) {
        backtracking(candidates, target, 0);
        return res;
    }
    public void backtracking(int[] candidates, int target, int startIndex){
        if(sum > target) return;
        if(sum == target){
            res.add(new ArrayList(path));
            return;
        }
        for(int i = startIndex; i < candidates.length; i++){
            path.offer(candidates[i]);
            sum += candidates[i];
            if (sum > target) { // 剪枝操作
                sum -= candidates[i]; // 剪枝之前先把回溯做了
                path.pollLast(); // 剪枝之前先把回溯做了
                return;
            }
            backtracking(candidates, target, i);
            sum -= candidates[i];
            path.pollLast();
        }
    }
}
```

### 40. 组合总和 II

比39题更难，难点在于去重，把回溯问题看成是一棵N叉树的话，每个树枝上的重复元素时可以接受的，但是每一层上的重复元素要被去除。

显然在[1, 1, 2]这个数组中，想要在每一层去重，我们得先对数组排序。

当candidates[I] = candidates[I-1]时，我们直接跳过循环。但其实这个条件也会同时跳过树枝上的相同元素。

当candidates[I] = candidates[I-1] && I > startIndex时，跳出循环，此时的条件表明仅跳过同一层的元素。这是因为startIndex其实可以表示递归的深度，每次递归时都会将i = startIndex；而递归完成后，回溯时，i自增，回到了上一层。

sum + candidates[i]> target 是另一个去重的条件（大剪枝），跳出循环，不用向下递归了。

![遍历过程](https://pic1.zhimg.com/80/v2-a10bea329bb8240b63cae5838d255053_720w.jpg?source=d16d100b)

```java
class Solution {
    public List<List<Integer>> res = new ArrayList<>();
    public LinkedList<Integer> path = new LinkedList<>();
    public int sum = 0;
    public List<List<Integer>> combinationSum2(int[] candidates, int target) {
        // 对数组排序
        Arrays.sort(candidates);
        backTracking(candidates, target, 0);
        return res;
    }
    public void backTracking(int[] candidates, int target, int startIndex){
        if(sum > target) return;
        if(sum == target){
            res.add(new ArrayList(path));
            return;
        }
        for(int i = startIndex; i < candidates.length; i++){
            if(sum + candidates[i] > target) break;
            if(i > startIndex && candidates[i] == candidates[i-1]) continue;
            path.offer(candidates[i]);
            sum += candidates[i];
            backTracking(candidates, target, i + 1);
            sum -= candidates[i];
            path.pollLast();
        }
    }
}
```

### 216. 组合总和 III

相对简单，没有去重

```java
class Solution {
    public List<List<Integer>> res = new ArrayList<>();
    public LinkedList<Integer> path = new LinkedList<>();
    public List<List<Integer>> combinationSum3(int k, int n) {
        backTracking(k, n, 1);
        return res;
    }
    public void backTracking(int k, int n, int startIndex){
        if(path.size() == k){
            int sum = path.stream().mapToInt(Integer::intValue).sum();
            if(sum == n) res.add(new ArrayList(path));
            return;
        }
        for(int i = startIndex; i <= 9; i++){
            path.offerLast(i);
            backTracking(k, n, i+1);
            path.pollLast();
        }
    }
}
```

### 17. 电话号码的字母组合

一道细节上有点难度的题，要先把题目中输入的数字转换成字母，这就需要一个map来实现转换，实际上我们可以用更简单的string数组，然后再通过digits.charAt() - '0' 的方式实现char到int的转换。后面的内容就是基础的回溯算法了。

```java
class Solution {
    public String[] map = {
            "",
            "",
            "abc",
            "def",
            "ghi",
            "jkl",
            "mno",
            "pqrs",
            "tuv",
            "wxyz"
        };
    public List<String> res = new ArrayList<>();
    public StringBuilder sb = new StringBuilder();
    public List<String> letterCombinations(String digits) {
        if(digits == null || digits.length() == 0) return res;
        backTracking(digits, 0);
        return res;
    }
    public void backTracking(String digits, int startIndex){
        if(startIndex == digits.length()){
            res.add(sb.toString());
            return;
        }
        String letter = map[digits.charAt(startIndex) - '0'];
        for(int i = 0; i < letter.length(); i++){
            sb.append(letter.charAt(i));
            backTracking(digits, startIndex+1);
            sb.deleteCharAt(sb.length() - 1);
        }
    }
}
```

## 分割问题

### 131. 分割回文串

目前遇到的最难的回溯问题！首先很难理解的是分割，什么是分割呢？

![分割过程](https://pic1.zhimg.com/80/v2-9f6f63df357a9fa4098d5bc1d950065c_720w.jpg?source=d16d100b)

能看到分割其实也和组合问题差不多，组合是针对数组的，分割是针对字符串的。
- startIndex在组合问题里就是遍历数组的索引
- startIndex在分割问题里就是substring(startIndex, i+1)的开始位置索引

这里substring函数是如何切割字符串的呢？[startIndex, i+1)这里是左开右闭

到这一步终于能做这道题了，下一个问题就是，如何判断终止条件？
- 对于组合问题，我们一般是找到sum == target
- 对于分割问题，我们的条件就是分割线startIndex >= s.length()，关于为什么startIndex会大于字符串长度，我暂时还没搞懂。

最后就是如何判断回文字符串了，这里是用双指针。

```java
class Solution {
    public List<List<String>> res = new ArrayList<>();
    public LinkedList<String> path = new LinkedList<>();
    public List<List<String>> partition(String s) {
        backTracking(s, 0);
        return res;
    }
    public void backTracking(String s, int startIndex){
        if(startIndex >= s.length()){
            res.add(new ArrayList(path));
            return;
        }
        for(int i = startIndex; i < s.length(); i++){
            if(isValid(s, startIndex, i)){
                path.offer(s.substring(startIndex, i + 1));
            }else{
                continue;
            }
            backTracking(s, i+1);
            path.pollLast();
        }
    }
    public boolean isValid(String s, int startIndex, int endIndex){
        for(int i = startIndex, j = endIndex; i < j; i++, j--){
            if(s.charAt(i) != s.charAt(j)) return false;
        }
        return true;
    }
}
```

### 93. 复原 IP 地址

这道题卡了我大概一个小时，起初我打算用stringbuilder，发现回溯的时候很难找到要删除的位数，而直接在string上添加'.'让我感觉不够清楚。最后还是链表好使，链表永远的神！！！

```java
class Solution {
    List<String> res = new ArrayList<>();
    LinkedList<String> path = new LinkedList<>();

    public List<String> restoreIpAddresses(String s) {
        if(s.length() < 4 || s.length() > 12) return res;
        dfs(s, 0);
        return res;
    }

    public void dfs(String s, int idx) {
        if(path.size() == 4) {
            String str = String.join(".", path);
            // 用完了所有的字符串
            if(str.length() == (s.length() + 3)) {
                res.add(str);
            }
            return;
        }
        for(int i = idx; i < s.length() && i < idx + 3; ++ i) { // 横向遍历
            String str = s.substring(idx, i + 1);
            if(!isValid(str)) break;  
            path.add(str);
            dfs(s, i + 1);
            path.removeLast();
        }
    }

    boolean isValid(String str) {
        if(str.length() <= 0 || str.length() > 3) return false;
        if(str.charAt(0) == '0' && str.length() > 1) return false;
        for(Character c : str.toCharArray()) {
            if(!Character.isDigit(c)) return false;
        }
        if(Integer.parseInt(str) > 255) return false;
        return true;
    }
}
```

### 140. 单词拆分 II

很经典的回溯问题

```java
class Solution {
    public List<String> wordBreak(String s, List<String> wordDict) {
        int len = s.length();
        Set<String> set = new HashSet<>(wordDict);
        LinkedList<String> path = new LinkedList<>();
        List<String> res = new ArrayList<>();
        dfs(s, 0, set, path, res);
        return res;
    }

    private void dfs(String s, int start, Set<String> set, LinkedList<String> path, List<String> res) {
        if (start >= s.length()) {
            res.add(String.join(" ", path));
            return;
        }
        for (int i = start; i < s.length(); i++) {
            String a = s.substring(start, i+1);
            if (set.contains(a)) {
                path.offerLast(a);
                dfs(s, i+1, set, path, res);
                path.pollLast();
            }
        }
    }
}
```

## 子集问题

在树形结构中子集问题是要收集所有节点的结果，而不是只收集叶子节点的结果。

子集问题中的去重和组合问题中差不多，只有树层的去重。

### 78. 子集

一道比较简单的题，子集问题其实就是遍历并收集所有节点，而组合和分割问题是收集叶子节点。

看图更清晰，如果下次遇到不会的，一定要先画图！

![子集遍历](https://pic1.zhimg.com/80/v2-669a28ebd9d2dbc759e394508bbf704e_720w.jpg?source=d16d100b)

```java
class Solution {
    public List<List<Integer>> res = new ArrayList<>();
    public LinkedList<Integer> path = new LinkedList<>();
    public List<List<Integer>> subsets(int[] nums) {
        dfs(nums, 0);
        return res;
    }
    public void dfs(int[] nums, int start){
        res.add(new ArrayList(path));
        if(start > nums.length) return;
        for(int i = start; i < nums.length; i++){
            path.add(nums[i]);
            dfs(nums, i+1);
            path.removeLast();
        }
    }   
}
```

### 90. 子集 II

如何在树层中去重其实很简单，先把数组排序，然后遇到和前一个相同的元素就跳过，这样就可以了。

```java
class Solution {
    public List<List<Integer>> res = new ArrayList<>();
    public LinkedList<Integer> path = new LinkedList<>();
    public List<List<Integer>> subsetsWithDup(int[] nums) {
        Arrays.sort(nums);
        dfs(nums, 0);
        return res;
    }
    public void dfs(int[] nums, int start){
        res.add(new ArrayList(path));
        if(start > nums.length) return;
        for(int i = start; i < nums.length; i++){
            if(i > start && nums[i] == nums[i-1]) continue;
            path.add(nums[i]);
            dfs(nums, i+1);
            path.removeLast();
        }
    }
}
```

### 491. 递增子序列

一道看起来很简单的题，问题在于树层的去重！

在以前的子集问题和组合问题里，遇到去重我们都会先排序。然而这道题不能排序！如果排序了那所有子集都是递增子序列！

那么怎么进行树层去重呢？

用哈希表储存用过的元素就可以了

```java
class Solution {
    public List<List<Integer>> res = new ArrayList<>();
    public LinkedList<Integer> path = new LinkedList<>();
    public List<List<Integer>> findSubsequences(int[] nums) {
        dfs(nums, 0);
        return res;
    }
    public void dfs(int[] nums, int start){
        if(path.size() >= 2) res.add(new ArrayList(path));
        if(start >= nums.length) return;
        Set<Integer> set = new HashSet<>();
        for(int i = start; i < nums.length; i++){
            if(!path.isEmpty() && nums[i] < path.peekLast()) continue;
            if(set.contains(nums[i])) continue;
            set.add(nums[i]);
            path.add(nums[i]);
            dfs(nums, i + 1);
            path.pollLast();
        }
    }
}
```

## 排列问题

对于排列问题是不需要startIndex的，因为元素的顺序不同就成了不同的排列。

关于去重，排列问题是需要在树枝上去重的，可用used[]数组来去重，效率上很好，相比哈希表时间复杂度更低，而且既可以在树层上去重，也可以在树枝上去重。

### 46. 全排列

第一次接触排列问题，对于排列问题是不需要startIndex的，因为元素的顺序不同就成了不同的排列。

这道题的数组元素是不重复的，也不需要再树层上进行去重。

需要关注的问题就是如何在选择元素时排除已经用过的元素，我们可以用一个哈希表来做这个事，但是！

path是个链表，我们直接在链表中查询是否用过这个元素就行了。

```java
class Solution {
    public List<List<Integer>> res = new ArrayList<>();
    public LinkedList<Integer> path = new LinkedList<>();
    public List<List<Integer>> permute(int[] nums) {
        dfs(nums);
        return res;
    }
    public void dfs(int[] nums){
        if(path.size() == nums.length){
            res.add(new ArrayList(path));
            return;
        }
        for(int i = 0; i < nums.length; i++){
            if(path.contains(nums[i])) continue;
            path.add(nums[i]);
            dfs(nums);
            path.pollLast();
        }
    }
}
```

### 47. 全排列 II

相比46.有点复杂了，数组中有重复的元素，想要去重数组中重复的元素，要记得排序！

这道题设置了一个used布尔值数组，一个数组就能同时去重树层和树枝！

之前一直没用used数组，主要还是因为组合问题在去重的时候不常遇到树枝的去重，也就是组合问题，切割问题都仅仅只是在树层中去重。这道全排列问题是既要在树层中去重又要在树枝上去重。

used[i-1] == false 为什么可以在树层中去重？很简单，递归结束了之后used就会被置为false，所以上一个相等的元素还没被用过，那肯定是在树层中的了。

used[i] == true 很好理解，这是在递归时发现这个元素用过了，那就是在树枝上的元素。

```java
class Solution {
    public List<List<Integer>> res = new ArrayList<>();
    public LinkedList<Integer> path = new LinkedList<>();
    public boolean[] used;
    public List<List<Integer>> permuteUnique(int[] nums) {
        Arrays.sort(nums);
        used = new boolean[nums.length];
        dfs(nums);
        return res;
    }
    public void dfs(int[] nums){
        if(path.size() == nums.length){
            res.add(new ArrayList(path));
            return;
        }
        for(int i = 0; i < nums.length; i++){
            // 去重同一树层 相等的元素
            if(i > 0 && nums[i] == nums[i-1] && used[i-1] == false) continue;
            // 去重同一树枝 用过的元素
            if(used[i]) continue;
            
            used[i] = true;
            path.add(nums[i]);
            dfs(nums);
            path.pollLast();
            used[i] = false;
        }
    }
}
```

## 深度优先搜素算法

### 332. 重新安排行程

深度搜索遍历这个思路是可以的

难点在于遍历的结束条件，是找到了一条就立即结束

也就是这个条件

```
if(path.size() == tickets.size() + 1) break;
```

另一个难点在于对字符串按字典排序，这也算是java的一个知识点，在List中对字符串排序，需要compareTo()

最后需要用used数组记录用过的元素，在树枝上进行去重。

```java
class Solution {
    public List<String> res = new ArrayList<>();
    public LinkedList<String> path = new LinkedList<>();
    public boolean[] used;
    public List<String> findItinerary(List<List<String>> tickets) {
        Collections.sort(tickets, (l1, l2)-> {
            if(l1.get(0).equals(l2.get(0))){
                return l1.get(1).compareTo(l2.get(1));
            }else{
                return l1.get(0).compareTo(l2.get(0));
            }
        });
        used = new boolean[tickets.size()];
        path.add("JFK");
        dfs(tickets);
        return res;
    }
    public void dfs(List<List<String>> tickets){
        if(path.size() == tickets.size() + 1) {
            res = new ArrayList(path);
            return;
        }
        for(int i = 0; i < tickets.size(); i++){
            String from = tickets.get(i).get(0);
            String to = tickets.get(i).get(1);
            if(used[i]) continue;
            if(!from.equals(path.peekLast())) continue;
            used[i] = true;
            path.offer(to);
            dfs(tickets);
            if(path.size() == tickets.size() + 1) break;
            path.pollLast();
            used[i] = false;
        }

    }
}
```

## 棋盘问题

### 51. N 皇后

n皇后问题，也可以看做是一颗宽为n，深度为n的树，按这样的思路就能套用回溯问题的模板了。

这道题的难点还是在于如何验证皇后的位置是否合理，这里分别按照行（可省略），列，45度，135度验证

```java
class Solution {
    public List<List<String>> res = new ArrayList<>();
    public char[][] chessboard;
    public List<List<String>> solveNQueens(int n) {
        chessboard = new char[n][n];
        for (char[] c : chessboard) {
            Arrays.fill(c, '.');
        }
        dfs(n, 0);
        return res;
    }
    public void dfs(int n, int row){
        if(row == n){
            List<String> l = new ArrayList<>();
            for(char[] c : chessboard){
                l.add(new String(c));
            }
            res.add(l);
        }
        for(int col = 0; col < n; col++){
            if(isValid(row, col, n)){
                chessboard[row][col] = 'Q';
                dfs(n, row + 1);
                chessboard[row][col] = '.';
            }
        }
    }
    public boolean isValid(int row, int col, int n){
        // check column
        for(int i = 0; i < n; i++){
            if(chessboard[i][col] == 'Q') return false;
        }
        // check 135 degree
        for(int i = row - 1, j = col - 1; i>=0 && j>=0; i--,j--){
            if(chessboard[i][j] == 'Q') return false;
        }
        // check 45 degree
        for(int i = row - 1, j = col + 1; i>=0 && j<n; i--, j++){
            if(chessboard[i][j] == 'Q') return false;
        }
        return true;
    }
}
```

### 37. 解数独

和之前做的一维的递归遍历有所不同。


解数独是二维遍历的，对于每行每列的每个元素都要遍历。因此要用两个for嵌套循环遍历。

那遍历函数为什么有boolean返回值呢，是因为我们找到一种解之后就可以立即返回了！相当于一个终止条件

这道题的难点其实还在于验证数独，在每行，每列，每3x3的小格子都是唯一的数值。有个一小trick：怎么知道这个值是属于哪个3x3矩阵的？可以这么写：

int startRow = (row / 3) * 3;

int startCol = (col / 3) * 3;

总体看上去不难，但其实写出来需要清晰的思路和代码技巧，可能这就是hard吧

```java
class Solution {
    public void solveSudoku(char[][] board) {
        dfs(board);
    }
    public boolean dfs(char[][] res){
        // 不需要终止条件 因为每个格子都会遍历
        for(int i = 0; i < res.length; i++){
            for(int j = 0; j < res[i].length; j++){
                if(res[i][j] != '.') continue;
                // 尝试放入数子
                for(char k = '1'; k <= '9'; k++){
                    if(isValid(res, i, j, k)){
                        res[i][j] = k;
                        if(dfs(res)) return true;
                        res[i][j] = '.';
                    }
                }
                return false;
            }
        }
        return true;
    }
    public boolean isValid(char[][] res, int row , int col, char k){
        //check row
        for(int n = 0; n < 9; n++){
            if(res[row][n] == k) return false;
        }
        // check col
        for(int n = 0; n < 9; n++){
            if(res[n][col] == k) return false;
        }
        //check 3x3
        int startRow = (row / 3) * 3;
        int startCol = (col / 3) * 3;
        for(int i = startRow; i < startRow + 3; i++){
            for(int j = startCol; j < startCol + 3; j++){
                if(res[i][j] == k) return false;
            }
        }
        return true;
    }
}
```
