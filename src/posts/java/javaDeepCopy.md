---
title: Java List的浅拷贝与深拷贝
order: 1
author: Roy
date: 2024-02-01
category:
  - Java
tag:
  - Java
  - 笔记
sticky: false
star: true
copyright: Copyright © 2024 Roy
---

# Java List的浅拷贝与深拷贝

## 浅拷贝

将 List A 列表复制时，其实相当于 A 的内容复制给了 B，java 中相同内容的数组指向同一地址，即进行浅拷贝后 A 与 B 指向同一地址。

造成的后果就是，**改变 B 的同时也会改变 A**，两个 list 中的内容其实是一样的。

这也就是 List 的浅拷贝，其常见的实现方式有如下几种：

### **遍历循环复制**

```java
List<Integer> destList = new ArrayList<>(srcList.size());  
for(Integer i : srcList){  
    destList.add(i);  
}
```

### **构造方法**

```java
List<Integer> destList = new ArrayList<>(srcList);
```

### **list.addAll()方法**

```java
List<Integer> destList = new ArrayList<>();  
destList.addAll(srcList);
```

## 深拷贝

深拷贝就是将 A 复制给 B 的同时，给 B 创建新的地址，再将地址 A 的内容传递到地址 B。ListA 与 ListB 内容一致，但是由于所指向的**地址**不同，所以改变相互不受影响。

假如现在有一个 Subject 类，如下：

```java
public class Subject {
    private String subjectName;
    private Integer maxScore;
    private Integer score;
}
```

深拷贝的实现方法具体有两种：clone()方法和序列化方法。

### clone()方法

我们要实现 Cloneable 接口，然后调用父类的 clone()方法，代码如下：

```java
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Subject implements Cloneable{
    private String subjectName;
    private Integer maxScore;
    private Integer score;

    @Override
    public Subject clone() {
        try {
            return (Subject) super.clone();
        } catch (CloneNotSupportedException e) {
            throw new AssertionError();
        }
    }

    public static void main(String[] args) throws CloneNotSupportedException {
        Subject a = new Subject("a", 1, 0);
        Subject b = a.clone();
        b.setSubjectName("b");
        b.setScore(1);
        System.out.println(a);
        System.out.println(b);
    }
}
```

控制台的输出显示：

> Subject(subjectName=a, maxScore=1, score=0)
> Subject(subjectName=b, maxScore=1, score=1)

可以看到深拷贝成功了。

假如现在有一个Subject类，而这个类的内部还有一个Item类的List，此时我们必须重写 clone()方法，来复制一个List。

```java
public class Subject {
    private String subjectName;
    private Integer maxScore;
    private Integer score;
    private List<Item> itemList;
    
    public static class Item {
        private String itemName;
        private Integer score;
    }
}
```

重写 clone()方法是一种 hard code，这也是我不用这种方法实现深拷贝的原因。具体实现如下：

```java
@NoArgsConstructor
@AllArgsConstructor
@Data
public static class Subject implements Cloneable{
    private String subjectName;
    private Integer maxScore;
    private Integer score;
    private List<Item> itemList;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Item implements Cloneable {
        private String itemName;
        private Integer score;

        @Override
        public Item clone() {
            try {
                return (Item) super.clone();
            } catch (CloneNotSupportedException e) {
                throw new AssertionError();
            }
        }
    }

    @Override
    public Subject clone() {
        try {
            Subject clone = (Subject) super.clone();
            List<Item> cloneItemList = new ArrayList<>();
            for (Item i : this.itemList) cloneItemList.add(i.clone());
            clone.setItemList(cloneItemList);
            return clone;
        } catch (CloneNotSupportedException e) {
            throw new AssertionError();
        }
    }

    public static void main(String[] args) {
        List<Item> itemList = Stream.of(new Item("item1", 0), new Item("item2", 0)).collect(Collectors.toList());
        Subject a = new Subject("a", 1, 0, itemList);
        Subject b = a.clone();
        // 修改a中的item里的值
        Item item1 = a.getItemList().get(0);
        item1.setItemName("itemFromA");
        System.out.println(a);
        System.out.println(b);
    }
}
```

值得注意的是：外部类 Subject 和内部类 Item 都需要实现 Cloneable 接口而且重写 clone()方法。只不过外部类 Subject 的重写要更复杂一些，需要调用 item 的 clone()方法，还要 new 一个 list。控制台如下：

> Subject(subjectName=a, maxScore=1, score=0, itemList=[Subject.Item(itemName=itemFromA, score=0), Subject.Item(itemName=item2, score=0)])
> Subject(subjectName=a, maxScore=1, score=0, itemList=[Subject.Item(itemName=item1, score=0), Subject.Item(itemName=item2, score=0)])

可以看到深拷贝成功了。

### 序列化方法

在实际场景中，在代码逻辑层面想要完全实现深拷贝非常困难，因为难免会碰到有一些类套娃套了很多层。但序列化方法的实现就比较简单了，其本质是将对象序列化为**字节流**，再反序列化为新对象，方便好用。

具体实现如下：

```java
@NoArgsConstructor
@AllArgsConstructor
@Data
public static class Subject implements Serializable{
    private String subjectName;
    private Integer maxScore;
    private Integer score;
    private List<Item> itemList;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Item implements Serializable {
        private String itemName;
        private Integer score;
    }

    @SuppressWarnings("unchecked")
    public static <T> List<T> deepCopy(List<T> src) {
        try {
            ByteArrayOutputStream byteOut = new ByteArrayOutputStream();
            ObjectOutputStream out = new ObjectOutputStream(byteOut);
            out.writeObject(src);
            ByteArrayInputStream byteIn = new ByteArrayInputStream(byteOut.toByteArray());
            ObjectInputStream in = new ObjectInputStream(byteIn);
            List<T> dest = (List<T>) in.readObject();
            return dest;
        } catch (Exception e) {
            return null;
        }
    }

    public static void main(String[] args) {
        List<Item> itemList1 = Stream.of(new Item("item1", 1), new Item("item2", 2)).collect(Collectors.toList());
        Subject a = new Subject("a", 1, 0, itemList1);
        List<Item> itemList2 = Stream.of(new Item("item3", 3), new Item("item4", 4)).collect(Collectors.toList());
        Subject b = new Subject("b", 1, 0, itemList2);
        List<Subject> subjectList1 = Stream.of(a, b).collect(Collectors.toList());
        List<Subject> subjectList2 = deepCopy(subjectList1);
        // 修改subjectList1中的item里的值
        Item item1 = subjectList1.get(0).getItemList().get(0);
        item1.setScore(9);
        System.out.println(subjectList1);
        System.out.println(subjectList2);
    }
}
```

控制台打印输出如下：

> [Subject(subjectName=a, maxScore=1, score=0, itemList=[Subject.Item(itemName=item1, score=9), Subject.Item(itemName=item2, score=2)]), Subject(subjectName=b, maxScore=1, score=0, itemList=[Subject.Item(itemName=item3, score=3), Subject.Item(itemName=item4, score=4)])]
> [Subject(subjectName=a, maxScore=1, score=0, itemList=[Subject.Item(itemName=item1, score=1), Subject.Item(itemName=item2, score=2)]), Subject(subjectName=b, maxScore=1, score=0, itemList=[Subject.Item(itemName=item3, score=3), Subject.Item(itemName=item4, score=4)])]

如果项目中刚好引用了 Jackson 包，那也可以使用 Jackson 序列化，甚至不需要实现接口，更加方便。

代码如下：

```java
@SuppressWarnings("unchecked")
public static void main(String[] args) throws IOException {
    List<Item> itemList1 = Stream.of(new Item("item1", 1), new Item("item2", 2)).collect(Collectors.toList());
    Subject a = new Subject("a", 1, 0, itemList1);
    List<Item> itemList2 = Stream.of(new Item("item3", 3), new Item("item4", 4)).collect(Collectors.toList());
    Subject b = new Subject("b", 1, 0, itemList2);
    List<Subject> subjectList1 = Stream.of(a, b).collect(Collectors.toList());
    // Jackson序列化, 反序列化
    ObjectMapper objectMapper = new ObjectMapper();
    List<Subject> subjectList2 = objectMapper.readValue(objectMapper.writeValueAsBytes(subjectList1), List.class);
    // 修改subjectList1中的item里的值
    Item item1 = subjectList1.get(0).getItemList().get(0);
    item1.setScore(9);
    System.out.println(subjectList1);
    System.out.println(subjectList2);
}
```

如果项目中刚好引用了 FastJson 包，那也可以使用 FastJson 序列化

代码如下：

```java
public static void main(String[] args) throws IOException {
    List<Item> itemList1 = Stream.of(new Item("item1", 1), new Item("item2", 2)).collect(Collectors.toList());
    Subject a = new Subject("a", 1, 0, itemList1);
    List<Item> itemList2 = Stream.of(new Item("item3", 3), new Item("item4", 4)).collect(Collectors.toList());
    Subject b = new Subject("b", 1, 0, itemList2);
    List<Subject> subjectList1 = Stream.of(a, b).collect(Collectors.toList());
    // FastJson序列化 反序列化
    String jsonString = JSONObject.toJSONString(subjectList1);
    List<Subject> subjectList2 = JSONObject.parseArray(jsonString, Subject.class);
    // 修改subjectList1中的item里的值
    Item item1 = subjectList1.get(0).getItemList().get(0);
    item1.setScore(9);
    System.out.println(subjectList1);
    System.out.println(subjectList2);
}
```
