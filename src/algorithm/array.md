---
title: 数组问题
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

# 数组问题
数组是存放在连续内存空间上的相同类型数据的集合。

## 704 二分查找
这道题看起来简单，但要想清楚是用开区间还是闭区间，这里是用的后者，[left, right]
```java
class Solution {
    public int search(int[] nums, int target) {
        int mid;
        int left = 0;
        int right = nums.length - 1;
        while(left <= right){
            mid = left + ((right - left) / 2);
            if(nums[mid] == target){
                return mid;
            } else if(nums[mid] < target){
                left = mid + 1;
            } else{
                right = mid - 1;
            }
        }       
        return -1;
    }
}
```

## 59. 螺旋矩阵 II
二刷这道题还是感觉有难度，对于开闭区间的定义已经清楚很多了，问题在于控制螺旋的循环次数，这可能是硬功夫吧，像是n为奇数时，应该对中心的数值特殊处理，这些感觉很难在一时想清楚，还需努力。
```java
class Solution {
    public int[][] generateMatrix(int n) {
        int count = 1;
        int round = 0;
        int start = 0;
        int row = 0;
        int column = 0;
        int[][] result = new int[n][n];
        while(round++ < n / 2){
            for(column = start; column < n - round; column++){
                result[start][column] = count++;
            }
            for(row = start; row < n - round; row++){
                result[row][column] = count++;
            }
            for(; column >= round; column--){
                result[row][column] = count++;
            }
            for(; row >= round; row--){
                result[row][column] = count++;
            }
            start++;

        }
        if(n % 2 == 1){
            result[start][start] = count;
        }
        return result;
    }
}
```


# 双指针法

## 27 移除元素
也是属于看着简单的题，一开始也是想着用两个for循环暴力解题，甚至已经开始写了才发现不太对，应该再想想，双指针是更好的解法，在数组类的题目中，双指针是非常常用的算法，还是经验不太足，应该继续努力。
```java
class Solution {
    public int removeElement(int[] nums, int val) {
        int slow = 0;
        for(int fast = 0; fast < nums.length; fast++){
            if(nums[fast] != val){
                nums[slow] = nums[fast];
                slow++;
            }
        }
        return slow;
    }
}
```


## 977. 有序数组的平方
一道比较简单的题，一开始想的是直接平方然后再排序，但题目要求时间复杂度为O(n)。可能还是刷的少了，没有第一时间想到双指针。
```java
class Solution {
    public int[] sortedSquares(int[] nums) {
        int[] result = new int[nums.length];
        int left = 0;
        int right = nums.length - 1;

        for(int i = nums.length - 1; i >=0; i--){
            if(nums[left]*nums[left] > nums[right]* nums[right]){
                result[i] = nums[left]*nums[left];
                left++;
            }else{
                result[i] = nums[right]* nums[right];
                right--;
            }
        }
        return result;
    }
}
```

## 15. 三数之和
15.三数之和18.四数之和的解题思路是一样的。最开始想到的肯定是用哈希表来缓存数值，但这种思路非常麻烦，这里用的是双指针。值得注意的是双指针算法的必要条件，**数组必须是排序后的**。
那1.两数之和不能用双指针吗？理论上也可以，只是那道题要求返回索引值，就不能排序也不能用双指针了。
```java
class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        List<List<Integer>> res = new ArrayList<>();
        Arrays.sort(nums);
        for(int i = 0; i < nums.length; i++){
            if(nums[i] > 0) return res;
            if(i > 0 && nums[i] == nums[i-1])
                continue;
            int left = i + 1;
            int right = nums.length - 1;
            while(left < right){
                int sum = nums[i] + nums[left] + nums[right];
                if(sum > 0){
                    right--;
                }else if(sum < 0){
                    left++;
                }else{
                    res.add(Arrays.asList(nums[i], nums[left], nums[right]));
                    while(left < right && nums[right] == nums[right-1])
                        right--;
                    while(left < right && nums[left] == nums[left+1])
                        left++;
                    left++;
                    right--;
                }
            }
        }
        return res;
    }
}
```

## 18. 四数之和
```java
class Solution {
    public List<List<Integer>> fourSum(int[] nums, int target) {
        List<List<Integer>> res = new ArrayList<>();
        Arrays.sort(nums);
        for(int i = 0; i < nums.length; i++){
            if(nums[i] > 0 && nums[i] > target) return res;
            if(i > 0 && nums[i] == nums[i-1]) continue;
            for(int j = i + 1; j < nums.length; j++){
                if(j > i + 1 && nums[j] == nums[j-1]) continue;
                int left = j + 1;
                int right = nums.length - 1;
                while(left < right){
                    int sum = nums[i] + nums[j] + nums[left] + nums[right];
                    if(sum < target){
                        left++;
                    }else if(sum > target){
                        right--;
                    }else{
                        res.add(Arrays.asList(nums[i],nums[j],nums[left],nums[right]));
                        while(left < right && nums[right] == nums[right-1]) right--;
                        while(left < right && nums[left] == nums[left+1]) left++;
                        left++;
                        right--;
                    }
                }
            }
        }
        return res;
    }
}
```


# 滑动窗口
## 209. 长度最小的子数组
二刷的感觉就是有点思路了，知道该用滑动窗口，但对滑动窗口的实现还是不太清楚。比如滑动窗口是两个循环组成的，直觉上感觉不对，时间复杂度不是O(n)，但实际上对于n个数据，每个数据最多进行了一次加，一次减，实际上复杂度是O(2n)而不是O(n^2)。
可能再多刷几次，理解滑动窗口的实现方式就好了。
```java
class Solution {
    public int minSubArrayLen(int target, int[] nums) {
        int left = 0;
        int result = Integer.MAX_VALUE;
        int sum = 0;
        int sublength = 0;
        for(int right = 0;right < nums.length; right++){
            sum += nums[right];
            while(sum >= target){
                sublength = right - left + 1;
                result = sublength < result ? sublength : result;
                sum -= nums[left++];
            }
        }
        return result == Integer.MAX_VALUE ? 0 : result;
    }
}
```

# 哈希表法
那什么时候需要用到哈希表呢，像是hashmap这样的数据结构，我认为是在集合中查找某个值的时候。

## 1. 两数之和
哈希表的典型应用
```java
class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new Collection<>();
        for(int i = 0; i < nums.length; i++){
            if(map.containsKey(target - nums[i])){
                return new int[]{i, map.get(target-nums[i])};
            }else{
                map.put(nums[i], i);
            }
        }
        return new int[]{0,0};
    }
}
```

## 454. 四数相加 II
这道题其实很好理解，可以把四数相加分解成两个两数相加，两数相加用的是哈希表，那四数相加的思路就很清晰了。
```java
class Solution {
    public int fourSumCount(int[] nums1, int[] nums2, int[] nums3, int[] nums4) {
        int res = 0;
        int temp;
        Map<Integer, Integer> map = new Collection<>();
        for(int i : nums1){
            for(int j : nums2){
                temp = i + j;
                if(map.containsKey(temp)){
                    map.put(temp, map.get(temp) + 1);
                }else{
                    map.put(temp, 1);
                }
            }
        }
        for (int i : nums3) {
            for (int j : nums4) {
                temp = i + j;
                if (map.containsKey(0 - temp)) {
                    res += map.get(0 - temp);
                }
            }
        }
        return res;
    }
}
```

## 202. 快乐数
这道题的隐含条件：如果无限循环应该返回false。这意味着我们需要一个set来缓存所有的sum值，遇到重复就退出循环。
```java
class Solution {
    public boolean isHappy(int n) {
       Set<Integer> set = new HashSet<>();
       while( n != 1 && !set.contains(n)){
           set.add(n);
           int sum = 0;
            while(n > 0){
                int mod = n % 10;
                sum += mod * mod;
                n = n / 10;
            }
            n = sum;
       }
       return n == 1;
    }
}
```

## 349. 两个数组的交集
这道题使用两个set来解决，这里用了一个map和一个set，其实思路是一样的。
```java
class Solution {
    public int[] intersection(int[] nums1, int[] nums2) {
        Map<Integer, Integer> map = new Collection<>();
        Set<Integer> result = new HashSet<>();
        for(int n1: nums1){
            if(!map.containsKey(n1)){
                map.put(n1, 1);
            }
        }
        for(int n2: nums2){
            if(map.containsKey(n2)){
                result.add(n2);
            }
        }
        return result.stream().mapToInt(x ->x).toArray();
    }
}
```



## 383. 赎金信
哈希表的简单应用，没什么细节的东西。
```java
class Solution {
    public boolean canConstruct(String ransomNote, String magazine) {
        Map<Character, Integer> map = new Collection<>();
        for(char c: magazine.toCharArray()){
            if(map.containsKey(c)){
                map.put(c, map.get(c) + 1);
            }else{
                map.put(c, 1);
            }
        }
        for(char c: ransomNote.toCharArray()){
            if(map.containsKey(c)){
                map.put(c, map.get(c) - 1);
            }else{
                return false;
            }
        }
        for(Integer value: map.values()){
            if(value < 0) return false;
        }
        return true;
    }
}
```
