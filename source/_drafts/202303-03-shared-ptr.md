---
title: 智能指针（一）：实现智能指针
tags: c++
---
[为什么多线程读写 shared_ptr 要加锁？ - 陈硕 - 博客园 (cnblogs.com)](https://www.cnblogs.com/solstice/archive/2013/01/28/2879366.html)

1. 如何实现一个简单的智能指针
2. 如何实现一个线程安全的智能指针

# 实现一个简单的智能指针

## 需求

1. 可以指向多种 data type，包括 void ？
2. 支持多个指针共享一个 object
3. 通过 `get()` 获取裸指针
4. 支持解引用
5. 支持比较，至少 <
6. 支持空指针，什么也不指
7. 支持 default deleter 和 custom deleter
8. 支持多线程访问，无须同步

Notes

1. 基于一个其他 `shared_ptr` 的裸指针构造的 `shared_ptr` 是未定义行为

> Defined in header [&lt;memory&gt;](https://omegaup.com/docs/cpp/en/cpp/header/memory.html)
>
> ```cpp
> template< class T > class shared_ptr;
> (since C++11)
> ```
>
> `std::shared_ptr` is a smart pointer that retains shared ownership of an object through a pointer. Several `shared_ptr` objects may own the same object. The object is destroyed and its memory deallocated when either of the following happens:
>
> * the last remaining `shared_ptr` owning the object is destroyed;
> * the last remaining `shared_ptr` owning the object is assigned another pointer via [operator=](https://omegaup.com/docs/cpp/en/cpp/memory/shared_ptr/operator%3D.html "cpp/memory/shared ptr/operator=") or [reset()](https://omegaup.com/docs/cpp/en/cpp/memory/shared_ptr/reset.html "cpp/memory/shared ptr/reset").
>
> The object is destroyed using [delete-expression](https://omegaup.com/docs/cpp/en/cpp/language/delete.html "cpp/language/delete") or a custom deleter that is supplied to `shared_ptr` during construction.
>
> A `shared_ptr` can share ownership of an object while storing a pointer to another object. This feature can be used to point to member objects while owning the object they belong to. The stored pointer is the one accessed by **get**(**)**, the dereference and the comparison operators. The managed pointer is the one passed to the deleter when use count reaches zero.
>
> A `shared_ptr` may also own no objects, in which case it is called *empty* (an empty shared_ptr may have a non-null stored pointer if the aliasing constructor was used to create it).
>
> All specializations of `shared_ptr` meet the requirements of [CopyConstructible](https://omegaup.com/docs/cpp/en/cpp/named_req/CopyConstructible.html "cpp/named req/CopyConstructible"), [CopyAssignable](https://omegaup.com/docs/cpp/en/cpp/named_req/CopyAssignable.html "cpp/named req/CopyAssignable"), and [LessThanComparable](https://omegaup.com/docs/cpp/en/cpp/named_req/LessThanComparable.html "cpp/named req/LessThanComparable") and are [contextually convertible](https://omegaup.com/docs/cpp/en/cpp/language/implicit_cast.html "cpp/language/implicit cast") to `bool`.
>
> All member functions (including copy constructor and copy assignment) can be called by multiple threads on different instances of `shared_ptr` without additional synchronization even if these instances are copies and share ownership of the same object. If multiple threads of execution access the same `shared_ptr` without synchronization and any of those accesses uses a non-const member function of `shared_ptr` then a data race will occur; the [shared_ptr overloads of atomic functions](https://omegaup.com/docs/cpp/en/cpp/memory/shared_ptr/atomic.html "cpp/memory/shared ptr/atomic") can be used to prevent the data race.
>
> [std::shared_ptr - cppreference.com (omegaup.com)](https://omegaup.com/docs/cpp/en/cpp/memory/shared_ptr.html)



### 疑问

1. 拷贝时也会释放右侧object 内存？

## 测试



## 实现

找一个最佳实现，

* [GNU: libstdc++: shared_ptr.h Source File (gnu.org)](https://gcc.gnu.org/onlinedocs/libstdc++/libstdc++-api-4.6/a01033_source.html)
* [Boost.SmartPtr: The Smart Pointer Library - 1.81.0](https://www.boost.org/doc/libs/1_81_0/libs/smart_ptr/doc/html/smart_ptr.html#shared_ptr)
* [boost/shared_ptr.hpp at master · steinwurf/boost (github.com)](https://github.com/steinwurf/boost/blob/master/boost/smart_ptr/shared_ptr.hpp)
* T 类型指针
* int型指针，用于计数，同步更新指向一块内存的智能指针个数

## 总结


# 其他参考

* [Boost C++ Libraries](https://www.boost.org/)，boost，C++最佳实践
* [C++ reference](https://omegaup.com/docs/cpp/en/cpp.html)，参考网站，非 ANSI/ISO 官方，但是几乎官方
* [GotW.ca Home Page](http://www.gotw.ca/)：C++ 大咖


# 后续内容

* 高阶实现，包括：
  * 线程安全
* 一些智能指针的使用建议
  * [M.7 — std::shared_ptr – Learn C++ (learncpp.com)](https://www.learncpp.com/cpp-tutorial/stdshared_ptr/)，shared_ptr best practice，一些使用建议
  * [C++ Core Guidelines: Rules for Smart Pointers - ModernesCpp.com](https://www.modernescpp.com/index.php/c-core-guidelines-rules-to-smart-pointers)， some rules
