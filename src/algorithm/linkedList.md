---
title: 链表问题
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

# 链表问题
链表问题需要熟能生巧，对链表进行增删改的时候添加虚头节点会更方便操作。

## 203. 移除链表元素
比较基础的链表操作，对链表进行增删改的时候使用虚头节点会更方便操作。而遍历链表一般是不需要虚头节点的
```java
class Solution {
    public ListNode removeElements(ListNode head, int val) {
        ListNode pre = new ListNode(){};
        pre.next = head;
        ListNode cur = pre;
        while(cur.next != null){
            if(cur.next.val == val){
                cur.next = cur.next.next;
            }else{
                cur = cur.next;
            }
        }
        return pre.next;
    }
}
```

## 707. 设计链表
也是二刷这道题了，花了半小时勉强做出来，主要还是考察对虚节点的使用，一般定义一个pre节点操作就可以了，我这里定义了pre和cur两个节点，其实有点多余。
```java
class MyLinkedList {
    private int size;
    private ListNode head;

    public MyLinkedList() {
        this.size = 0;
        this.head = new ListNode(0);
    }
    
    public int get(int index) {
        if(index >= size || index < 0) return -1;
        ListNode cur = head;
        for(int i = 0; i <= index; i++){
            cur = cur.next;
        }
        return cur.val;
    }
    
    public void addAtHead(int val) {
        addAtIndex(0, val);
    }
    
    public void addAtTail(int val) {
        addAtIndex(size, val);
    }
    
    public void addAtIndex(int index, int val) {
        if(index > size) return;
        if(index < 0) index = 0;
        ListNode pre = head;
        ListNode newNode = new ListNode(val);
        for(int i = 0; i < index; i++){
            pre = pre.next;
        }
        newNode.next = pre.next;
        pre.next = newNode;
        size++;
    }
    
    public void deleteAtIndex(int index) {
        if(index >= size || index < 0) return;
        ListNode cur = head;
        ListNode pre = new ListNode(0);
        pre.next = head;
        for(int i = 0; i <= index; i++){
            cur = cur.next;
            pre = pre.next;
        }
        pre.next = cur.next;
        size--;
    }
}
class ListNode {
    int val;
    ListNode next;
    ListNode(){}
    ListNode(int val){
        this.val = val;
    }
}
```

## 206. 反转链表
也是比较经典的题，需要两个指针pre和cur，再定义一个temp临时变量储存下一个节点，想清楚逻辑的话，算是比较简单的一道题。
```java
class Solution {
    public ListNode reverseList(ListNode head) {
        ListNode pre = null;
        ListNode cur = head;
        while(cur != null){
            ListNode temp = cur.next;
            cur.next = pre;
            pre = cur;
            cur = temp;
        }
        return pre;
    }
}
```

## 24. 两两交换链表中的节点
有点复杂的链表题，一开始想得是用三个指针，但其实是要定义三个临时变量、一个虚头节点和一个cur节点遍历就好操作了。链表的题做多了就感觉有思路了，还是多加练习吧。
```java
class Solution {
    public ListNode swapPairs(ListNode head) {
        ListNode dummyHead = new ListNode(0);
        dummyHead.next = head;
        ListNode cur = dummyHead;
        ListNode first;
        ListNode second;
        ListNode temp;
        while(cur.next != null && cur.next.next != null){
            first = cur.next;
            second = cur.next.next;
            temp = cur.next.next.next;
            cur.next = second;
            second.next = first;
            first.next = temp;
            cur = first;
        }
        return dummyHead.next;
    }
}
```

## 19. 删除链表的倒数第 N 个结点
这道题是双指针法的小trick，找到倒数第n个节点。记住了就好！
```java
class Solution {
    public ListNode removeNthFromEnd(ListNode head, int n) {
        ListNode dummyHead = new ListNode(0);
        dummyHead.next = head;
        ListNode slow = dummyHead;
        ListNode fast = dummyHead;
        for(int i = 0; i < n; i++){
            fast = fast.next;
        }
        while(fast.next != null){
            fast = fast.next;
            slow = slow.next;
        }
        slow.next = slow.next.next;
        return dummyHead.next;
    }
}
```

## 面试题 02.07. 链表相交
也算是一个小trick，通过让curA指针先移动两个链表的长度差，使得curA和curB两个指针对齐，来比较两个链表的尾部是否相同。感觉也没什么好的思路，先记下来吧

```java
public class Solution {
    public ListNode getIntersectionNode(ListNode headA, ListNode headB) {
        int lenA = 0;
        int lenB = 0;
        ListNode a = headA;
        ListNode b = headB;
        while(a != null){
            a = a.next;
            lenA++;
        }
        while(b != null){
            b = b.next;
            lenB++;
        }
        a = headA;
        b = headB;
        if (lenB > lenA) {
            int tmpLen = lenA;
            lenA = lenB;
            lenB = tmpLen;
            ListNode tmpNode = a;
            a = b;
            b = tmpNode;
        }
        int gap = lenA - lenB;
        while(gap-- > 0){
            a = a.next;
        }
        while(a != null){
            if(a == b){
                return a;
            }
            System.out.println("curA =  " + a.val);
            System.out.println("curB =  " + b.val);
            a = a.next;
            b = b.next;
        }
        return null;
    }
}
```

## 142. 环形链表 II
这道题依然是双指针的应用，比较考察数学功底。这里有两个数学结论可以直接使用
1. 如果链表有换，fast一次走两步，slow一次走一步，双指针一定相遇。
2. 指针相遇后，从相遇节点到环入口节点的距离 等于 头结点到环入口的距离

```java
public class Solution {
    public ListNode detectCycle(ListNode head) {
        ListNode slow = head;
        ListNode fast = head;
        while(fast != null && fast.next != null){
            fast = fast.next.next;
            slow = slow.next;
            if(slow == fast){
                ListNode index1 = fast;
                ListNode index2 = head;
                while (index1 != index2) {
                    index1 = index1.next;
                    index2 = index2.next;
                }
                return index1;
            }
        }
        return null;
    }
}
```

