
1.
vim `include/linux/syscalls.h`
add
```
asmlinkage long_sys_alcall(int cmd, char* bug);
```
after
```
#endif /* CONFIG_ARCH_HAS_SYSCALL_WRAPPER */
```

2.
vim `kernel/sys.c`
add
```
SYSCALL_DEFINE2(alcall,int,cmd,char*,buf)
{
  struct task_struct *p;
  printk("Hello new system call alcall (%d,%x)!\n",cmd,buf);
  printk("%-20 %-6s %-6s\n", "Name", "Pid", "Stat");
  for (p = &init_task; (p=next_task(p))!=&init_task;){
    printk("%-20s %-6d %-6d\n", p->comm, p->pid, p->stat);
    /*
      comm: 去除路径后的可执行文件名称
      pid: pid
      state: state
    */
  }
  return 0;
}
```
after function
```
SYSCALL_DEFINE0(gettid)
```


3.
vim `arch/x86/entry/syscalls/syscall_64.tbl`,
add
```
* common alcall __x64_sys_alcall
```
after
```
334 common resq __x64_sys_rseq
```

4.
```
make clean # make mrproper
make -j5
sudo make modules_install
sudo make install
```


vim `testalcall.c`,
```
#include <unistd.h>
#include <sys/syscall.h>
#include <stdio.h>
#define __NR_alcall *
long alcall(int cmd, char* buf) {
  return syscall(__NR_alcall, cmd, buf);
}
int main(int argc, char** argv) {
  int cmd;
  char buf[256];
  alcall(cmd, buf);
  printf("ok! run dmesg | grep alcall in terminal!\n");
  return 0;
}
```