# 字符串问题
## 344. 反转字符串
```java
class Solution {
    public void reverseString(char[] s) {
        char temp;
        int left = 0;
        int right = s.length - 1;
        while(left < right){
            temp = s[left];
            s[left] = s[right];
            s[right] = temp;
            left++;
            right--;
        }
    }
}
```

## 541. 反转字符串 II
每隔2k个数反转前k个数，这道题考察的还是基础的代码能力，循环遍历时i应该i += 2*k ，除此之外，今天又复习了异或运算可以用来交换两个值（具体可以复习异或运算的交换律和恒等律）
```java
class Solution {
    public String reverseStr(String s, int k) {
        char[] res = s.toCharArray();
        int left;
        int right;
        for(int i = 0; i < s.length(); i += 2*k){
            left = i;
            right = Math.min(left + k - 1, s.length() - 1);
            while(left < right){
                res[left] ^=  res[right];
                res[right] ^= res[left];
                res[left] ^= res[right];
                left++;
                right--;
            }
        }
        return new String(res);

    }
}
```

## 151. 反转字符串中的单词
一道看起来很简单，实际上有点复杂的题。
一开始的思路是用split分割字符串，但总是会有额外的空格。
后来借鉴了Carl老师的思路，先去除字符串首尾和中间多余的空格，然后翻转整个字符串，再翻转每个单词。
```java
class Solution {
    public String reverseWords(String s) {
        StringBuilder sb = new StringBuilder();
        //去除字符串首尾和中间多余的空格
        int start = 0;
        int end = s.length() - 1;
        while(s.charAt(start) == ' ') start++;
        while(s.charAt(end) == ' ') end--;
        while(start <= end){
            if(s.charAt(start) != ' ' || sb.charAt(sb.length() - 1) != ' '){
                sb.append(s.charAt(start));
            }
            start++;
        }
        //翻转整个字符串
        int left = 0;
        int right = sb.length() - 1;
        while(left < right){
            char temp = sb.charAt(left);
            sb.setCharAt(left, sb.charAt(right));
            sb.setCharAt(right, temp);
            left++;
            right--;
        }
        //翻转每个单词
        left = 0;
        right = 0;
        for(int i = 0; i < sb.length(); i++){
            if(sb.charAt(i) != ' ' && (i == 0 || sb.charAt(i - 1) == ' ')){
                left = i;
            }
            if(sb.charAt(i) != ' ' && (i == sb.length() - 1 || sb.charAt(i + 1) == ' ')){
                right = i;
                reverseWord(left, right, sb);
            }
        }
        return sb.toString();
    }
    public void reverseWord(int left, int right, StringBuilder sb){
        while(left < right){
            char temp = sb.charAt(left);
            sb.setCharAt(left, sb.charAt(right));
            sb.setCharAt(right, temp);
            left++;
            right--;
        }
    }
}
```

## 剑指 Offer 05. 替换空格
easy题，没什么说的
```java
class Solution {
    public String replaceSpace(String s) {
        StringBuilder sb = new StringBuilder();
        for(int i = 0; i < s.length(); i++){
            if(s.charAt(i) == ' '){
                sb.append("%20");
            }else{
                sb.append(s.charAt(i));
            }
        }
        return sb.toString();
    }
}
```

## 剑指 Offer 58 - II. 左旋转字符串
easy题，没什么说的
```java
class Solution {
    public String reverseLeftWords(String s, int n) {
        StringBuilder sb = new StringBuilder();
        StringBuilder temp = new StringBuilder();
        for(int i = 0; i < n; i++){
            temp.append(s.charAt(i));
        }
        for(int j = n; j < s.length(); j++){
            sb.append(s.charAt(j));
        }
        sb.append(temp);
        return sb.toString();
    }
}
```

## 1071. 字符串的最大公因子
很难相信这是道简单题！

如果它们有公因子 abc，那么 str1 就是 m 个 abc 的重复，str2 是 n 个 abc 的重复，连起来就是 m+n 个 abc，好像 m+n 个 abc 跟 n+m 个 abc 是一样的。

所以如果 str1 + str2 === str2 + str1 就意味着有解。

我们也很容易想到 str1 + str2 !== str2 + str1 也是无解的充要条件。

当确定有解的情况下，最优解是长度为 gcd(str1.length, str2.length) 的字符串。

这个理论最优长度是不是每次都能达到呢？是的。

因为如果能循环以它的约数为长度的字符串，自然也能够循环以它为长度的字符串，所以这个理论长度就是我们要找的最优解。
```java
class Solution {
    public String gcdOfStrings(String str1, String str2) {
        if (!(str1 + str2).equals(str2+str1)) return "";
        int len = gcd(str1.length(), str2.length());
        return str1.substring(0, len);
    }
    // 辗转相除法
    private int gcd(int a, int b){
       while(b != 0){
           int tmp = b;
           b = a % b;
           a = tmp;
       }
       return a;
   }
}
```

# 哈希表法
## 242. 有效的字母异位词
carl老师用的是数组来解这道题，我这里用了map，其实思路是差不多的，数组可能看上去更简洁一些。
```java
class Solution {
    public boolean isAnagram(String s, String t) {
        Map<Character, Integer> map = new Collection<>();
        for(char a: s.toCharArray()){
            if(map.containsKey(a)){
                map.put(a, map.get(a) + 1);
            }else{
                map.put(a, 1);
            }
        }
        for(char b: t.toCharArray()){
            if(map.containsKey(b)){
                map.put(b, map.get(b) - 1);
            }else{
                return false;
            }
        }
        for (Integer value : map.values()) {
            if(value != 0){
                return false;
            }
        }
        return true;
    }
}
```

# KMP算法
KMP的核心就是算出前缀表。

## 什么是前缀表？
前缀表中的值是字符串的前缀集合与后缀集合的交集中最长元素的长度。
例如，对于”aba”，它的前缀集合为{”a”, ”ab”}，后缀 集合为{”ba”, ”a”}。两个集合的交集为{”a”}，那么长度最长的元素就是字符串”a”了，长 度为1，所以对于”aba”而言，它在前缀表中对应的值就是1。再比如，对于字符串”ababa”，它的前缀集合为{”a”, ”ab”, ”aba”, ”abab”}，它的后缀集合为{”baba”, ”aba”, ”ba”, ”a”}， 两个集合的交集为{”a”, ”aba”}，其中最长的元素为”aba”，长度为3。

## 前缀表为什么能加速查找？
当出现字符串不匹配时，可以通过前缀表跳过一部分之前已经匹配的文本内容，避免从头再去做匹配了。
时间复杂度分析：
其中n为文本串长度，m为模式串长度，因为在匹配的过程中，根据前缀表不断调整匹配的位置，可以看出匹配的过程是O(n)，之前还要单独生成next数组，时间复杂度是O(m)。所以整个KMP算法的时间复杂度是O(n+m)的。
暴力的解法显而易见是O(n × m)，所以**KMP在字符串匹配中极大地提高了搜索的效率。**

## 如何计算前缀表（next数组）
见下面例题

## 28. 找出字符串中第一个匹配项的下标
```java
class Solution {
    public int strStr(String haystack, String pattern) {
        int m = haystack.length();
        int n = pattern.length();
        if(n == 0) return 0;

        int[] next = new int[pattern.length()];
        getNext(pattern, next);

        int i = 0;
        int j = 0;
        while(i < m && j < n){
            if(j == -1 || haystack.charAt(i) == pattern.charAt(j)){
                i++;
                j++;
            }else{
                j = next[j];
            }
        }
        if(j == n){
            return i - j;
        }else{
            System.out.println("i = " + i);
            System.out.println("j = " + j);
            return -1;
        }
    }

    public void getNext(String p, int[] next){
        // 因为next表整体右移一位，所以next[0]取-1，方便编程
        next[0] = -1;
        // i指针为字符串指针，从1开始，因为next[0]已经设为-1
        int i = 0;
        // j指针为pattern串指针，从0开始
        int j = -1;
        while(i < p.length() - 1){
            // j = -1 意味着上次匹配不成功，i指针需要移动，此时j指针同时移动，保证下次j==0
            // 匹配成功则同时移动i,j指针 同时将j的值储存到next表中
            if( j == -1|| p.charAt(i) == p.charAt(j)){ 
                i++;
                j++;
                next[i] = j;
            }else{
            // 匹配不成功则将j设置为共同前缀的后面
                j = next[j];
            }
        }
    }
}
```

## 459. 重复的子字符串
```java
class Solution {
    public boolean repeatedSubstringPattern(String s) {
        if(s.length() <= 1) return false;
        int[] next = new int[s.length()];
        String pattern = s.substring(0, getMaxNext(s, next) + 1);
        int j = 0;
        for(int i = 0; i < s.length(); i++){
            if(s.charAt(i) == pattern.charAt(j)){
                j++;
                j = j % pattern.length();
            }else{
                return false;
            }
        }
        return true;
    }
    public int getMaxNext(String s, int[] next){
        next[0] = -1;
        int i = 0;
        int j = -1;
        int res = Integer.MIN_VALUE;
        while(i < s.length() - 1){
            if(j == -1 || s.charAt(i) == s.charAt(j)){
                i++;
                j++;
                next[i] = j;
                res = Math.max(res, j);
            }else{
                j = next[j];
            }
        }
        return res == Integer.MIN_VALUE ? 0 : res;
    }
}
```

