# 编写一个最简单的内核

> 说明：这原本是高中时期的一个实验项目。

## Part One

这一部分是原定的实现方式。
参考 [原文](https://arjunsreedharan.org/post/82710718100/kernel-101-lets-write-a-kernel) ，或者 [译文](http://blog.jobbole.com/79249/) 。

### 环境

debian7
```
Linux version 3.2.0-5-486 (debian-kernel@lists.debian.org) (gcc version 4.6.3 (Debian 4.6.3-14) ) #1 Debian 3.2.96-3
```

### 源文件

```
Length Name
------ ----
   189 kernel.asm
   355 kernel.c
   152 link.ld
```

### 编译

```
#!/bin/bash
nasm -f elf32 kernel.asm -o kasm.o
gcc -m32 -c kernel.c -o kc.o
ld -m elf_i386 -T link.ld -o kernel kasm.o kc.o
```

### 输出

```
Length Name
------ ----
   512 kasm.o
  1124 kc.o
  4933 kernel
```

### 部署

重命名生成的kernel文件，移动到```/boot```下。
```
mv kernel /boot/kernelMAKI
```
编辑```/boot/grub/grub.cfg```，添加：
```
menuentry 'kernelMAKI' {
  set root='hd0,msdos1'
  multiboot /boot/kernelMAKI ro
}
```

### end

重启后即可在grub引导列表中找到```kernelMAKI```。

## Part Two

参考 [知乎](https://www.zhihu.com/question/49580321/answer/287557834) 。
编译链接生成elf文件，使用qemu模拟运行。