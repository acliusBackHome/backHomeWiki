in `include/linux/syscalls.h`, add
```
asmlinkage long sys_schello(void);
```
before
```
asmlinkage long sys_ni_syscall(void);
```

in `kernel/sys.c`, add
```
SYSCALL_DEFINE0(schello)
{
  printk("Hello new system call schello!\n");
  return 0;
}
```
after
```
SYSCALL_DEFINE0(gettid)
{
  return task_pid_vnr(current);
}
```

in `arch/x86/entry/syscalls/syscall_64.tbl`, add
```
436 common  schello __x64_sys_schello
```
after
```
435 common  clone3  __x64_sys_clone3/ptregs
```
