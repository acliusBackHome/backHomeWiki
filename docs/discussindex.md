# 讨论

这是一个普通的临时讨论页面，在未来随时可能被重构。

所有执行委员都可以在此页面留言。

该讨论页已加入 zero ichi 的邮件监视列表。

## 注意

各执行委员，请留心该页面的文段，如果发现信息污染，请立即予以妥善处理。

在24小时内该页面不会发生超过54.378GB的信息变动。


## 政治避险

1. 发言请符合wiki本体在地的法律。

2. 发言请符合user本体在地的法律。

<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/gitalk@1/dist/gitalk.css">
<script src="https://cdn.jsdelivr.net/npm/gitalk@1/dist/gitalk.min.js"></script>
<div id="gitalk-container"></div>
<script>
window.addEventListener('load', function () {
  window.gitalk = new Gitalk({
    clientID: '934ea055f28220237c9c',
    clientSecret: 'c774d9c05b1222e2b8c48b334fbf4e5a78cdf466',
    repo: 'backHomeWiki',
    owner: 'acliusBackHome',
    admin: ['windring'],
    id: location.pathname,      // Ensure uniqueness and length less than 50
    distractionFreeMode: true  // Facebook-like distraction free mode
  });
  console.log(gitalk);
  gitalk.render('gitalk-container');
  console.log('hello gitalk');
});
</script>
