# 栈与队列
栈是先进后出

队列是先进先出

## 232. 用栈实现队列
用栈实现队列需要两个栈来模拟队列，在弹出时先把in里面的元素全部转移到out里。
在转移之前，如果out里有元素，那就直接弹出。这里写了一个dump函数专门做转移。值得注意的是如果out里有元素了，还进行转移会导致元素顺序混乱。
```java
class MyQueue {
    Stack<Integer> in;
    Stack<Integer> out;

    public MyQueue() {
        in = new Stack<Integer>();
        out = new Stack<Integer>();
    }
    
    public void push(int x) {
        in.push(x);
    }
    
    public int pop() {
        dumpInToOut();
        return out.pop();
    }
    
    public int peek() {
        dumpInToOut();
        return out.peek();
    }
    
    public boolean empty() {
        return in.empty() && out.empty();
    }

    public void dumpInToOut(){
        // 如果out不为空，则不进行dump，否则会导致元素顺序混乱
        if(!out.isEmpty()) return;
        while(!in.isEmpty()){
            int temp = in.pop();
            out.push(temp);
        }
    }
}
```


## 225. 用队列实现栈
这里复习一下java里的双端队列Deque
- 添加元素：offer(), offerFirst(), offerLast()
- 返回元素：peek(), peekFirst(), peekLast()
- 弹出元素：poll(), pollFirst(), pollLast()
```java
class MyStack {
    Deque<Integer> queue;
    public MyStack() {
        queue = new ArrayDeque<>();
    }
    
    public void push(int x) {
        queue.offerLast(x);
    }
    
    public int pop() {
        return queue.pollLast();
    }
    
    public int top() {
        return queue.peekLast();
    }
    
    public boolean empty() {
        return queue.size() == 0;
    }
}
```

## 20. 有效的括号
```java
这道题思路很简单，把每个"(", "\[" ,"{" 都压入栈中，如果栈为空或者栈顶的元素和字符不同直接返回false，相同则弹出栈顶元素。最后判断栈是否为空。
class Solution {
    public boolean isValid(String s) {
        Stack<Character> st = new Stack<>();
        for(int i = 0; i < s.length(); i++){
            if(s.charAt(i) == '('){
                st.push(')');
            }else if(s.charAt(i) == '{'){
                st.push('}');
            }else if(s.charAt(i) == '['){
                st.push(']');
            }else if(st.isEmpty() || s.charAt(i) != st.peek()){
                return false;
            }else{
                st.pop();
            }
        }
        return st.isEmpty();
    }
}
```

## 1047. 删除字符串中的所有相邻重复项

思路很简单，用队列或者栈保存字符，遇到相同的就弹出。
```java
class Solution {
    public String removeDuplicates(String s) {
        Deque<Character> q = new ArrayDeque<>();
        StringBuilder sb = new StringBuilder();
        for(int i = 0; i < s.length(); i++){
            char c = s.charAt(i);
            if(!q.isEmpty() && q.peekLast() == c){
                q.pollLast();
            }else{
                q.offerLast(c);
            }
        }
        while(!q.isEmpty()){
            sb.append(q.pollFirst());
        }
        return sb.toString();
    }
}
```


## 150. 逆波兰表达式求值
用栈来进行四则运算
```java
class Solution {
    public int evalRPN(String[] tokens) {
        Stack<Integer> s = new Stack<>();
        for(int i = 0; i < tokens.length; i++){
            int v1, v2;
            if("+".equals(tokens[i])){
                v2 = s.pop();
                v1 = s.pop();
                s.push(v1 + v2);
            }else if("-".equals(tokens[i])){
                v2 = s.pop();
                v1 = s.pop();
                s.push(v1 - v2);
            }else if("*".equals(tokens[i])){
                v2 = s.pop();
                v1 = s.pop();
                s.push(v1 * v2);
            }else if("/".equals(tokens[i])){
                v2 = s.pop();
                v1 = s.pop();
                s.push(v1 / v2);
            }else{
                s.push(Integer.valueOf(tokens[i]));
            }
        }
        return s.pop();
    }
}
```


# 优先级队列

什么是优先级队列呢？

其实就是一个披着队列外衣的堆，因为优先级队列对外接口只是从队头取元素，从队尾添加元素，再无其他取元素的方式，看起来就是一个队列。
堆是一棵完全二叉树，树中每个结点的值都不小于（或不大于）其左右孩子的值。如果父亲结点是大于等于左右孩子就是大顶堆，小于等于左右孩子就是小顶堆。
## 自定义单调栈
这里我们用Deque作为容器来实现单调栈，关键是要实现队列的push()方法和poll()方法。
push()方法需要让加入的值大于队列最后一个元素，如果最后一个元素小于加入值，则弹出最后一个元素。这样就能维护单调递减了。
poll()方法需要弹出正确的值，这是因为我们的单调队列不是保存了所有值的队列，里面的元素有可能已经在执行push()时因为小于添加值而被弹出了。注意单调队列是因题而异的，因为这道题是滑动窗口，我们需要弹出窗口a,[b,c]前的元素，也就是a。如果单调队列的最大值也就是第一个元素等于我们想弹出的值，也就是a，则弹出。
## 239. 滑动窗口最大值
很显然这道题不能用暴力方法求解，因为暴力解法复杂度为O(n*k)会超时。
为什么不直接是用优先级队列呢？因为我们要移除滑动窗口外的值，但优先级队列做不到。
这就需要用到单调栈了，单调栈指的是单调递增或者单调递减的队列。我们可以自己写一个单调栈，让它保持单调递减，这样队列最前面的值就是最大值。
```java
class Solution {
    public int[] maxSlidingWindow(int[] nums, int k) {
        List<Integer> res = new LinkedList<>();
        MyQueue q = new MyQueue();
        // 先将前k的元素放进队列
        for(int i = 0; i < k; i++){
            q.push(nums[i]);
        }
        res.add(q.peek());
        // 从k开始遍历，此时滑动窗口为[i-k+1, k]
        for(int i = k; i < nums.length; i++){
            // 弹出nums[i-k]元素
            q.poll(nums[i-k]);
            q.push(nums[i]);
            res.add(q.peek());
        }
        return res.stream().mapToInt(x -> x).toArray();
    }
}

class MyQueue {
    private Deque<Integer> queue;
    public MyQueue(){
        queue = new LinkedList<>();
    }
    public void poll(int n){
        if(!queue.isEmpty() && queue.peekFirst() == n){
            queue.pollFirst();
        }
    }
    public void push(int n){
        while(!queue.isEmpty() && queue.peekLast() < n){
            queue.pollLast();
        }
        queue.offerLast(n);
    }
    public int peek(){
        return queue.peekFirst();
    }
}
```


## 347. 前 K 个高频元素
这道题使用的是优先级队列（堆），以后遇到类似的题目，前n个最大值，第n个最大值，这样的题目都可以用优先级队列。
那么为什么要使用小顶堆呢？这是因为大顶堆需要对所有元素（的频率）排序，而小顶堆只需要排序k个元素，小顶堆的时间复杂度更优。
如果新的元素的频率比堆顶端的元素大，则弹出堆顶端的元素，将新的元素添加进堆中
```java
class Solution {
    public int[] topKFrequent(int[] nums, int k) {
        Map<Integer, Integer> map = new Collection<>();
        PriorityQueue<Integer> pq = new PriorityQueue<>((m1, m2) -> map.get(m1) - map.get(m2));
        for(int i = 0; i < nums.length; i++){
            map.put(nums[i], map.getOrDefault(nums[i], 0) + 1);
        }
        //在优先队列中存储二元组(num,cnt),cnt表示元素值num在数组中的出现次数
        //出现次数按从队头到队尾的顺序是从小到大排,出现次数最低的在队头(相当于小顶堆)
        for(Map.Entry<Integer, Integer> entry : map.entrySet()){
            if(pq.size() < k){
                pq.offer(entry.getKey());
            }else if(entry.getValue() > map.get(pq.peek())){
                pq.poll();
                pq.offer(entry.getKey());
            }
        }
        int[] res = new int[k];
        for(int i = 0; i < k; i++){
            res[i] = pq.poll();
        }
        return res;
    }
}
```

