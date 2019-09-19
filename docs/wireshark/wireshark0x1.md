# wireshark 0x1
## The Basic HTTP GET/response interaction

### 1. Is your browser running HTTP version 1.0 or 1.1? What version of HTTP is the
server running?

![my browser HTTP version](http://image-pic-markdown.test.upcdn.net/img/20190918185605.png)

我的浏览器 HTTP 版本为 `1.1`

![server HTTP version](http://image-pic-markdown.test.upcdn.net/img/20190918185949.png)

服务器的 HTTP 版本为 `1.1`

### 2. What languages (if any) does your browser indicate that it can accept to the server?

![languages which my browser accept](http://image-pic-markdown.test.upcdn.net/img/20190918190257.png)

浏览器所接受的语言：zh-CN, zh, zh-TW, zh-HK, en-US, en。

### 3. What is the IP address of your computer? Of the gaia.cs.umass.edu server?

![IP](http://image-pic-markdown.test.upcdn.net/img/20190918191123.png)

本机 IP：`10.22.7.238`

gaia.cs.umass.edu 的 IP: `128.119.245.12`

### 4. What is the status code returned from the server to your browser?

![response status code](http://image-pic-markdown.test.upcdn.net/img/20190918191341.png)

返回的状态码：`200`

### 5. When was the HTML file that you are retrieving last modified at the server?

![last modified time](http://image-pic-markdown.test.upcdn.net/img/20190918191651.png)

文件在服务器上的最后修改时间：`Wed, 18 Sep 2019 05:59:01 GMT`

### 6. How many bytes of content are being returned to your browser?

![content length](http://image-pic-markdown.test.upcdn.net/img/20190918192100.png)

内容长度: `128 bytes`

### 7. By inspecting the raw data in the packet content window, do you see any headers within the data that are not displayed in the packet-listing window? If so, name one.

例举一个不存在的头： `Refresh`

## The HTTP CONDITIONAL GET/response interaction

### 8. Inspect the contents of the first HTTP GET request from your browser to the server. Do you see an “IF-MODIFIED-SINCE” line in the HTTP GET?

![first get](http://image-pic-markdown.test.upcdn.net/img/20190918194434.png)

不存在

### 9. Inspect the contents of the server response. Did the server explicitly return the contents of the file? How can you tell?

![explicitly contents](http://image-pic-markdown.test.upcdn.net/img/20190918194849.png)

服务器显式地返回了文件内容

因为在字节流窗口和详情窗口中可以看到成功解码的 ASCII 字符

### 10. Now inspect the contents of the second HTTP GET request from your browser to the server. Do you see an “IF-MODIFIED-SINCE:” line in the HTTP GET? If so, what information follows the “IF-MODIFIED-SINCE:” header?

![second get](http://image-pic-markdown.test.upcdn.net/img/20190918195259.png)

存在一行 “IF-MODIFIED-SINCE:”

紧跟着“IF-MODIFIED-SINCE:”的是 `If-None-Match: "173-592cd889ead8d"\r\n`


### 11. What is the HTTP status code and phrase returned from the server in response to this second HTTP GET? Did the server explicitly return the contents of the file? Explain.

![second response](http://image-pic-markdown.test.upcdn.net/img/20190918195837.png)

第二次请求的响应代码是：`304`，响应短语是 `Not Modified`

服务器没有显式地返回文件内容，因为服务器的文件最后修改时间和浏览器缓存的页面的最后修改时间一致，为了节省带宽，因此服务器向请求方示意文件没有修改，浏览器可以使用缓存版本

## Retrieving Long Documents

### 12. How many HTTP GET request messages did your browser send? Which packet number in the trace contains the GET message for the Bill or Rights?

![several get requests](http://image-pic-markdown.test.upcdn.net/img/20190918201635.png)

我的浏览器发出了 `2` 条 GET 请求

`2792` 号包含了对 `the Bill or Rights` 的请求信息

### 13. Which packet number in the trace contains the status code and phrase associated with the response to the HTTP GET request?

![packet number](http://image-pic-markdown.test.upcdn.net/img/20190918203050.png)

`2819` 号包含了状态码和状态短语

### 14. What is the status code and phrase in the response?

![status](http://image-pic-markdown.test.upcdn.net/img/20190918203503.png)

状态码：`200`

状态短语：`OK`

### 15. How many data-containing TCP segments were needed to carry the single HTTP response and the text of the Bill of Rights?

![segments](http://image-pic-markdown.test.upcdn.net/img/20190918203738.png)

TCP 分片数：`4`

## HTML Documents with Embedded Objects

### 16. How many HTTP GET request messages did your browser send? To which Internet addresses were these GET requests sent?

![4 gets](http://image-pic-markdown.test.upcdn.net/img/20190918204525.png)

我的浏览器发出了 `4` 个 GET 请求

它们发往了 `128.119.245.12`

### 17. Can you tell whether your browser downloaded the two images serially, or whether they were downloaded from the two web sites in parallel? Explain.

![img download](http://image-pic-markdown.test.upcdn.net/img/20190918212046.png)

这两张图片是串行下载的

由图中可知，对于 `cover_5th_ed.jpg` 的 GET 请求是在 `pearson.png` 的返回完成之后发起的。虽然这两张图片的域名地址不同，但是它们的域名指向的 IP 是同一个IP，因此两次 GET 请求使用同一个 TCP 连接，而同一个 TCP 连接中的包是串行发送的

## HTTP Authentication

### 18. What is the server’s response (status code and phrase) in response to the initial HTTP GET message from your browser?

![401](http://image-pic-markdown.test.upcdn.net/img/20190918214313.png)

对最初 GET 请求的响应的响应码是 `401`

响应短语是 `Unauthorized`

### 19. When your browser’s sends the HTTP GET message for the second time, what new field is included in the HTTP GET message?

![Auth Get](http://image-pic-markdown.test.upcdn.net/img/20190918214601.png)

第二次 GET 请求的消息中的新增字段是 `Authorization`