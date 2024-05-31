---
title: Java List自定义去重
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

# Java List自定义去重

## 需求

工作中经常遇到这样的需求：需要对一个 List 去重，而且我们想自定义去重的规则。

去重这个需求让我们很容易想到 hashSet，那么想用 hashSet 去重一个对象则有必要重写 equals()和 hashCode()。这是因为 hashSet 的 add()方法调用了 hashMap 的 put()，而 put()是根据 key 的 hashcode 值（由 native 方法计算得到，再与该值的高 16 位进行异或运算得到最终的 hash 值）最终判断这个 <key, value> 要放的位置。

根据我们的需求，当两个对象的 3 个字段相同时就需要去重了，所以我们需要重写 equals()和 hashCode()来使用 hashSet 去重。

## 示例

比如我们有 Expert 这一实体

```java
@Data
public class Expert implements Serializable {
    private String exName;

    private String gender;

    private String positionName;

    private String areaName;

    private String jobName;

    private String contactMobile;

    private String majorName;

    private String individualResume;

    private String majorNameZc;

    private String background;

    private String unitName;
}
```

我们想根据专家姓名，专业和专业职称三个字段判断两个实体是否相等，那我们应该重写 equals 方法，因为不重写 equals 方法，执行 expert1.equals(expert2) 比较的就是两个对象的地址（即 expert1== expert2），肯定是不相等的

## 重写 equals()

```java
@Override
public boolean equals(Object obj) {
    if (this == obj) return true;
    if (obj == null) return false;
    if (obj instanceof ExpertDatabaseInfoVo) {
        ExpertDatabaseInfoVo object = (ExpertDatabaseInfoVo) obj;
        return fieldEquals(this.exName, object.exName)
                && fieldEquals(this.majorName, object.majorName)
                && fieldEquals(this.majorNameZc, object.majorNameZc);
    }
    return false;
}

private boolean fieldEquals(String s1, String s2) {
    if (s1.isEmpty() && s2.isEmpty()) return true;
    return !s1.isEmpty() && s1.equals(s2);
}
```

## 重写 hashCode()

当 equals 方法被重写时，通常有必要重写 hashCode 方法，以维护 hashCode 方法的常规协定，该协定声明相等对象必须具有相等的哈希码。那这又是为什么呢？也就是说，如果 expert1.equals(expert2) = true，那么**在 hashMap 中这两个对象作为 key 时也应是相同的**。而 hashMap 计算一个对象的 key 时会调用 hashCode()方法，因此我们需要重写 hashCode()方法。

```java
@Override
public int hashCode(){
    int result = 17;
    result = 31 * result + (exName == null ? 0 : exName.hashCode());
    result = 31 * result + (majorName == null ? 0 : majorName.hashCode());
    result = 31 * result + (majorNameZc == null ? 0 : majorNameZc.hashCode());
    return result;
}
```

> **为什么要使用 31？**
> String 源码中也使用的 31，然后网上说有这两点原因：
>
> - **原因一：更少的乘积结果冲突**
>   31 是质子数中一个“不大不小”的存在，如果你使用的是一个如 2 的较小质数，那么得出的乘积会在一个很小的范围，很容易造成哈希值的冲突。而如果选择一个 100 以上的质数，得出的哈希值会超出 int 的最大范围，这两种都不合适。而如果对超过 50,000 个英文单词（由两个不同版本的 Unix 字典合并而成）进行 hash code 运算，并使用常数 31, 33, 37, 39 和 41 作为乘子，每个常数算出的哈希值冲突数都小于 7 个（国外大神做的测试），那么这几个数就被作为生成 hashCode 值得备选乘数了。
>   所以从 31,33,37,39 等中间选择了 31
> - **原因二：31 可以被 JVM 优化**
>   位运算优化：
>   左移 << : 左边的最高位丢弃，右边补全 0（把 << 左边的数据*2 的移动次幂）。
>   右移 >> : 把 >> 左边的数据/2 的移动次幂。
>   无符号右移 >>> : 无论最高位是 0 还是 1，左边补齐 0。 　　
>   所以 ： 31 * i = (i << 5) - i，JVM 可以优化这个乘法，转化成位运算，提高运算效率

## 去重

对一个List去重，如果有两个entity重复了，我们希望保留year更大的那个。

```java
List<Expert> expertList = mapper.getList();
    // 使用hashMap做缓存
    Map<Expert, Expert> expertMap = new HashMap<>();
    for (Expert info : expertList) {
        if (expertMap.containsKey(info)) {
            Expert pre = expertMap.get(info);
            // 根据年份，替换成最新信息
            if (pre.getYear() < info.getYear()) {
                expertMap.put(info, info);
            }
        } else {
            expertMap.put(info, info);
        }
    }
    // 遍历HashMap获取最新信息
    List<Expert> newExpertList = new ArrayList<>();
    for (Map.Entry<Expert, Expert> entry : expertMap.entrySet()) {
        newExpertList.add(entry.getValue());
    }
```
