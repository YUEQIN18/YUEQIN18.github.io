# 图问题

## DFS遍历
图问题中的DFS遍历，是在一种「网格」结构中进行的。

岛屿问题是这类网格 DFS 问题的典型代表。网格结构遍历起来要比二叉树复杂一些，如果没有掌握一定的方法，DFS 代码容易写得冗长繁杂。

## 网格问题的基本概念
我们首先明确一下岛屿问题中的网格结构是如何定义的，以方便我们后面的讨论。

网格问题是由 m x n 个小方格组成一个网格，每个小方格与其上下左右四个方格认为是相邻的，要在这样的网格上进行某种搜索。

岛屿问题是一类典型的网格问题。每个格子中的数字可能是 0 或者 1。我们把数字为 0 的格子看成海洋格子，数字为 1 的格子看成陆地格子，这样相邻的陆地格子就连接成一个岛屿。

在这样一个设定下，就出现了各种岛屿问题的变种，包括岛屿的数量、面积、周长等。不过这些问题，基本都可以用 DFS 遍历来解决。

## DFS的基本结构
网格结构要比二叉树结构稍微复杂一些，它其实是一种简化版的图结构。
要写好网格上的 DFS 遍历，我们首先要理解二叉树上的 DFS 遍历方法，再类比写出网格结构上的 DFS 遍历。
我们写的二叉树 DFS 遍历一般是这样的：
```java
class Solution {
    // 二叉树遍历
    public void traverse(TreeNode root) {
        // 判断 base case
        if (root == null) {
            return;
        }
        // 访问两个相邻结点：左子结点、右子结点
        traverse(root.left);
        traverse(root.right);
    }
}
```

可以看到，二叉树的 DFS 有两个要素：「判断递归结束条件」和「访问相邻结点」。

- 第一个要素是 判断递归结束条件。一般来说，二叉树遍历的 base case 是 root == null。
这样一个条件判断其实有两个含义：一方面，这表示 root 指向的子树为空，不需要再往下遍历了。
另一方面，在 root == null 的时候及时返回，可以让后面的 root.left 和 root.right 操作不会出现空指针异常。

- 第二个要素是访问相邻结点。二叉树的相邻结点非常简单，只有左子结点和右子结点两个。
二叉树本身就是一个递归定义的结构：一棵二叉树，它的左子树和右子树也是一棵二叉树。
那么我们的 DFS 遍历只需要递归调用左子树和右子树即可。

对于网格上的 DFS，我们完全可以参考二叉树的 DFS，写出网格 DFS 的两个要素：

- 首先，网格 DFS 中的 递归结束条件 是什么？从二叉树的 base case 对应过来，应该是网格中不需要继续遍历、grid[r][c] 会出现数组下标越界异常的格子，
也就是那些超出网格范围的格子。
这一点稍微有些反直觉，坐标竟然可以临时超出网格的范围？这种方法我称为「先污染后治理」—— 
甭管当前是在哪个格子，先往四个方向走一步再说，如果发现走出了网格范围再赶紧返回。这跟二叉树的遍历方法是一样的，先递归调用，发现 root == null 再返回。

- 其次，网格结构中的格子有多少相邻结点？答案是上下左右四个。对于格子 (r, c) 来说（r 和 c 分别代表行坐标和列坐标），
四个相邻的格子分别是 (r-1, c)、(r+1, c)、(r, c-1)、(r, c+1)。换句话说，网格结构是「四叉」的。

如何避免重复遍历

网格结构的 DFS 与二叉树的 DFS 最大的不同之处在于，遍历中可能遇到遍历过的结点。
这是因为，网格结构本质上是一个「图」，我们可以把每个格子看成图中的结点，每个结点有向上下左右的四条边。在图中遍历时，自然可能遇到重复遍历结点。

如何避免这样的重复遍历呢？答案是标记已经遍历过的格子。以岛屿问题为例，我们需要在所有值为 1 的陆地格子上做 DFS 遍历。
每走过一个陆地格子，就把格子的值改为 2，这样当我们遇到 2 的时候，就知道这是遍历过的格子了。也就是说，每个格子可能取三个值：
- 0 —— 海洋格子
- 1 —— 陆地格子（未遍历过）
- 2 —— 陆地格子（已遍历过）

```java
class SolutionGraphDFS {
    void dfs(int[][] grid, int r, int c) {
        // 判断 base case
        if (!inArea(grid, r, c)) {
            return;
        }
        // 如果这个格子不是岛屿，直接返回
        if (grid[r][c] != 1) {
            return;
        }
        grid[r][c] = 2; // 将格子标记为「已遍历过」

        // 访问上、下、左、右四个相邻结点
        dfs(grid, r - 1, c);
        dfs(grid, r + 1, c);
        dfs(grid, r, c - 1);
        dfs(grid, r, c + 1);
    }

    // 判断坐标 (r, c) 是否在网格中
    boolean inArea(int[][] grid, int r, int c) {
        return 0 <= r && r < grid.length
                && 0 <= c && c < grid[0].length;
    }
}
```

这样，我们就得到了一个岛屿问题、乃至各种网格问题的通用 DFS 遍历方法。


## BFS 遍历

当我们需要找到最短路径的时候，使用广度优先搜索会更合适

### 909. 蛇梯棋

这道题要求从起点（编号为 1 的格子）到终点（编号为 n^2 的格子）的最短路径。

和传统的矩阵路径搜索不一样的是，它的下一个搜索方格不是相邻方格，而是下6个编号。
即如果当前处理的方格编号为 curr，那么其可以转移到编号属于 [curr + 1, min(curr + 6, n2)] 的方格里。

因为是一个顺序复杂的二维矩阵，我们将其转换成一维数组处理会方便很多

```java
public class Solution909 {
    // 这道题的一个难点就是二维数组坐标转换，这里还是建议将二维数组转换为一维
    public int snakesAndLadders(int[][] board) {
        int n = board.length; // n x n 的棋盘
        int length = n * n;
        int step = 0;
        Set<Integer> set = new HashSet<>(); // 记录遍历过的节点
        // 二维数组转换成一维
        int[] nums = twoForOne(board, n);

        Queue<Integer> queue = new LinkedList<>();
        queue.offer(1); // 棋盘index从 1 开始
        while (!queue.isEmpty()) {
            int size = queue.size();
            for (int k = 0; k < size; k++) {
                int curIndex = queue.poll();

                if (curIndex == length) return step;
                if (set.contains(curIndex)) continue;
                set.add(curIndex);
                // 走下一步
                for (int i = curIndex + 1; i <= Math.min(curIndex + 6, length); i++) {
                    int ladder = nums[i];
                    int next = ladder == -1 ? i : ladder;
                    queue.offer(next);
                }
            }
            step++;
        }
        return -1;
    }

    public int[] twoForOne(int[][] board, int n) {
        int[] nums = new int[n * n + 1];
        int index = 1;
        for (int i = n - 1; i >= 0; i--) {
            //取最下方为第一行,奇数行正向,偶数行反向
            int row = n - i;
            if (row % 2 == 1) {
                for (int j = 0; j < n; j++) {
                    nums[index++] = board[i][j];
                }
            } else {
                for (int j = n - 1; j >= 0; j--) {
                    nums[index++] = board[i][j];
                }
            }
        }
        for (int num : nums) System.out.print(num + " ");
        return nums;
    }
}
```