## 实验题目：表达式求值

### 算法说明

这个算法解决这样的一个问题：

> 描述:
> 
> 设计一个表达式求值的程序。该程序必须可以接受包含`(`，`)`，`+`，`-`，`*`，`/`，`%`和`^`(求幂)的中缀表达式，并求出结果。如果> 表达式正确，则输出表达式的值，如果表达式非法，则输出错误信息。
> 注意`2^2^3`转为后缀应为`223^^`。
>
> 输入要求：
>
>多个表达式，每个表达式占一行。
> 
> 输出要求：
> 
>对每个表达式，如果为正确表达式则输出结果（精确到小数点后两位），如果为错误表达式则输出`ERROR IN INFIX >NOTATION`。

为了解决这个问题，将其划分为以下部分：

1：检测括号匹配  
2：输入预处理  
3：将中缀表达式转换为后缀表达式  
4：利用栈计算后缀表达式

为了满足数学习惯，我们不允许连续的'+','-'的出现（当然这在编译原理中认为是正确的）。我们将输入字符串称为raw。
以下为详述：

1.为了检测括号匹配，我们利用栈先进后出的性质，这样处理序列中的字符：从左到右扫描字符串，当遇到左括号时，将其压栈，当遇到右括号时，如果栈不是空的，则出栈一个左括号，如果栈是空的，表明表达式的括号是不匹配的，即可抛出“括号不匹配”错误异常。字符串扫描完毕，如果栈不是空的，说明有多余的左括号，即可抛出“括号不匹配”的错误异常，否则进行下一步。

2.
2.1.运算符'+','-'具有二义性，当其左侧无运算数，则是双目运算符，当其左侧有运算数，则是单目运算符。我们发现，对于单目运算符的'+','-'，在其左侧插入立即数0不影响原表达式的正误性，且不影响计算结果。我们在原字符串外裹上一层括号，这样我们就可以在相邻的'('和'+'或者相邻的'('和'-'之间插入'0'。
2.2.同时我们发现，在使用cin，scanf等函数读取double型数据时，'+','-'会被当成double型数据的一部分读入。于是，我们将字符串中的'+','-'替换为不显示字符，具体为将'+'替换为'\2'，将'-'替换为'\1'。
2.3.同时我们还发现，在使用cin，scanf等函数读取double数据时，没有前导数字的'.'和没有后接数字的'.'会被当为double数据的一部分读入，但是这是不符合一般数学习惯的。因此，我们检测字符串raw中的'.'，如果其两侧不同时存在数字字符，即可抛出“非法的小数点”错误异常。
2.4.如果raw中出现空格，直接抛出“非法空格”错误异常。

我们将完成上述预处理的字符串称为parsed。

3.我们利用栈来进行中缀表达式到后缀表达式的转换。
3.1.首先初始化一份运算符的优先级。约定数字越高，等级越高，那么有下表：

|项目|等级|
|:--|:--|
|普通的左括号|141|
|普通的右括号|141|
|栈中的左括号|-141|
|加号|1|
|减号|1|
|除号|2|
|乘号|2|
|取模符号|2|
|乘方符号|3|

在中缀表达式中，等级相同的符号从左到右结合运算。
3.2.我们准备一个符号栈和一个表达式容器。
3.3.将字符串parsed初始化为字符串流ss。我们在读取到流的末端前，总是先尝试从ss读取一个double型数据real，如果读取成功，我们把它压入表达式容器。如果失败，我们再清除字符串流ss的错误信息，读取一个char型数据，对于这个字符sign：

* 如果符号栈是空的，把这个字符压入符号栈，进行下一轮读取

* 如果是右括号，依次将符号栈中的字符弹出，压入表达式容器，直至弹出一个左括号，或者符号栈已为空。然后进行下一轮读取。

* 如果符号栈顶符号的优先级小于或等于sign的优先级，且sign不是'^'，依次弹出符号栈顶符号，压入表达式容器，直至出现下一个符号栈顶元素是左括号或者符号栈顶元素的优先级大于sign的优先级。将sign压入符号栈。然后进行下一轮读取。

* 如果符号栈顶元素的优先级小于或等于sign的优先级，sign是'^'，符号栈顶元素不是'^'，依次弹出符号栈顶符号，压入表达式容器，直至出现下一个符号栈顶元素是左括号或者符号栈顶元素的优先级大于sign的优先级。将sign压入符号栈。然后进行下一轮读取。

* 对于非上述情形的其他字符，压入符号栈。进行下一轮读取。

4.通过3，我们已经得到构造好的后缀表达式。我们准备一个实数栈。从左向右扫描表达式容器，对于当前元素i：

4.1.如果i是一个实数，将其压入实数栈，读取下一个元素。

4.2.如果i是一个符号，如果实数栈大小小于2，即可抛出一个“缺少实数”的错误异常，否则从实数栈弹第一个实数为右操作数r，弹第二个实数为左操作数l，对于符号i：

4.2.1.如果i为'-'，计算中间值mid=l-r，压mid入实数栈。

4.2.2.如果i为'+'，计算中间值mid=l+r，压mid入实数栈。

4.2.3.如果i为'\*'，计算中间值mid=l\*r，压mid入实数栈。

4.2.4.如果i为'/'，如果r为0，即可抛出一个“除以0”的错误异常，否则，计算中间值mid=l/r，压mid入实数栈。

4.2.5.如果i为'%'，如果l和r的小数域不全为0，即可抛出一个“小数模”的错误异常；如果r为0，即可抛出一个“模0”的错误异常；否则计算中间值mid=l%r，压mid入实数栈。

4.2.6.如果i为'\^'，如果l为0且r<0，即可抛出一个“0的负数幂”的错误异常；如果l<0且分数化的r可写为整数 N+2\^(-n)，n为正整数，则可以抛出一个“负数底的偶开根”错误异常，当然如果引入i\^2=-1，这是可以计算的，但是我们这里我们认为不妥；否则使用`math.h`的pow函数计算mid=pow(l,r)，压mid入实数栈。

4.2.7.如果i不在上述情形之列，即可抛出一个“非法运算符”的错误异常。

最终后缀表达式扫描完毕，我们检查实数栈的大小是否为1，如果否，即可抛出一个“缺少运算符”的错误异常；如果是，即可取出实数栈唯一的实数，该实数即为表达式的计算结果。

### 测试结果
|测试输入|测试目的|正确输出|实际输出|
|:--|:--|:--|:--|
|(1+2|检测括号匹配|ERROR IN INFIX NOTATION|ERROR IN INFIX NOTATION|
|1.+2|检测小数点合法性|ERROR IN INFIX NOTATION|ERROR IN INFIX NOTATION|
|1 +2|检测空格|ERROR IN INFIX NOTATION|ERROR IN INFIX NOTATION|
|1+2+|检测实数数量和运算符数量合法性|ERROR IN INFIX NOTATION|ERROR IN INFIX NOTATION|
|(1+2)2|检测实数数量和运算符数量合法性|ERROR IN INFIX NOTATION|ERROR IN INFIX NOTATION|
|1/0|检测除数合法性|ERROR IN INFIX NOTATION|ERROR IN INFIX NOTATION|
|1.2%2.3|检测模法运算数合法性|ERROR IN INFIX NOTATION|ERROR IN INFIX NOTATION|
|1.3%0|检测模法运算数合法性|ERROR IN INFIX NOTATION|ERROR IN INFIX NOTATION|
|0^(-2)|检测乘方运算指数合法性|ERROR IN INFIX NOTATION|ERROR IN INFIX NOTATION|
|(-1)^(1.25)|检测负数底的乘方运算指数合法性|ERROR IN INFIX NOTATION|ERROR IN INFIX NOTATION|
|1+2@9|检测符号合法性|ERROR IN INFIX NOTATION|ERROR IN INFIX NOTATION|
|2^2^3|检测连续幂运算顺序正确性|256.00|256.00|
|2^(2^3)|检测连续幂运算顺序正确性|256.00|256.00|
|(2^2)^3|检测连续幂运算顺序正确性|64.00|64.00|
|1+2/3-4%2\*8^2|检测运算顺序正确性|1.67|1.67|
|14.232\*4.23/2+5.2321/3.123%24.0|检测小数运算正确性|ERROR IN INFIX NOTATION|ERROR IN INFIX NOTATION|
|(3.14\*231)+(2^3^4)-(2+1)-23.2312+(2\*(1+(2312.231+231)))|检测复杂运算|2417851639229258349412352.00|2417851639229258349412352.00|

#### 错误原因

终版的程序对接收的输入没有产生错误。在调试修改的过程中产生过这样的问题：

|问题|原因|
|--|--|
|在线上的测试无论如何都是错误的。|对于g++，在没有返回语句时，double 型函数的最后一个声明定义的 double 变量会被当成返回值返回，但是线上的OJ的编译命令加入了-O2 参数，使得这个feature失效。|
|括号匹配结果错误。|步骤2.1（加括号）错误地在步骤1（括号匹配）之前执行，使得形如'1+1)+(1+1'被判正确。|
|括号匹配产生段错误。|弹空栈。|

#### 当前状态

当前版本的程序可以基本正确地处理测试输入数据。对于运算符的优先级，连续幂运算的运算顺序，都可以正确处理。对于非法字符，非法括号，错误的运算符数量都可以指出。也可以很好地处理正负数，小数的运算。但是当前版本能处理的精度仅限于double的精度范围，不能处理复数域的运算，也仅支持普通数学习惯的表达式。如果继续改进，可以向提高精度，添加复数域支持的方向进行。

### 分析与探讨

1.测试结果分析：
为了偏求于符合普通的数学习惯，我们将形如(1---1)，(23123.)，(.141)，都认为是错误的，但是在许多程序设计语言当中，这样的表达式普遍认为是正确的，这些程序设计语言的表达式计算在实现上依赖于语法树而不是后缀表达式计算，因此与本算法有着很大的区别（当然 '\^' 的意义有别）。
为了偏求实现简单，我们将形如((-1)\^(1/2))，认为是错误的，事实上如果引入复数域，这是可计算的。改写这样一个pow函数难度颇大，而且计算结果将不再能由double型数据存储，至少是一个pair<double,double>。
为了偏向书写习惯，我们将形如(1+ 2)带空格的表达式认为是错误的，但是在许多程序设计语言中这样的表达式也普遍认为是正确的。
在处理'-','+'的问题上，我将他们普遍化为双目运算符，并且替代为通常不会在文本中出现的字符，这在结果上看不出区别，但是实属奇技淫巧；在处理符号栈中的'('的优先级的问题上，我也将栈中的'('替换为不会在文本中出现的字符；但是当比较古怪的输入中出现这些特殊字符，势必会产生错误。

2.探到解决问题的更多途径：
解决表达式计算的问题，也可以采用语法树的大的框架设计，这样就可以解决前述的侠义性缺陷，也可以扩展很多功能，是更优的解决方案。但是语法树所使用的数据结构和算法我尚未掌握，实现起来颇为困难，因此在当前境遇下向后缀表达式计算寻求解决途径较为合理。

### 附录：

```c++
#pragma GCC diagnostic warning "-std=c++11"
#include <bits/stdc++.h>
using namespace std;
class Exp {
  struct node{
    int type; // 0 real, 1 sign, 41 ans return
    double real;
    char sign;
  };
  enum{
    SP_MINU=1, // 特殊处理的 -
    SP_PLUS=2, // 特殊处理的 +
    SP_LPIN=3, // 栈中的左括号
    LBRA='(',
    RBRA=')',
    MOLD='%',
    MULT='*',
    DIVI='/',
    POWE='^',
    MINU='-',
    PLUS='+',
    ZERO='0',
    BLAN=' '
  };
  string raw,parsed;
  vector<node> exps;
  stack<char> sgns;
  map<char,int> mp;
  node CalcPosfixEx(){
    int sz=exps.size();
    stack<double> rs;
    for(auto i : exps){
      if(i.type==0){
        rs.push(i.real);
      }else if(i.type==1){
        if(rs.size()<2){
          throw "Invaild Exp: Lose Real";
        }
        double r=rs.top();rs.pop();
        double l=rs.top();rs.pop();
        double mid=0;
        switch(i.sign){
          case SP_MINU:
            mid=l-r;break;
          case SP_PLUS:
            mid=l+r;break;
          case DIVI:
            if(r==0){
              throw "Invaild Exp: Divide Zero";
            }
            mid=l/r;break;
          case MULT:
            mid=l*r;break;
          case MOLD:
            if(int(l)!=l||int(r)!=r){
              throw "Invaild Exp: Decimal Molding";
            }
            if(r==0){
              throw "Invaild Exp: Mod Zero";
            }
            mid=int(l)%int(r);break;
          case POWE:
            if(l==0&&r<0){
              throw "Invaild Exp: 0 Base Of Negative Power";
            }
            if(r!=1&&__builtin_popcount(abs(int(1.0/(r-double(int(r))))))==1){
              if(l<0){
                throw "Invaild Exp: Negative Base Of Index N+2^(-n)";
              }
            }
            mid=pow(l,r);break;
          default:
            throw "Invaild Exp: Invaild Sign";
        }
        rs.push(mid);
      }
    }
    if(rs.size()>1||rs.empty()){
      throw "Invaild Exp: Lose Sign";
    }
    double ret=rs.top();rs.pop();
    return node{41,ret,0};
  }
  void Infix2Posfix(){
    stack<char> stk;
    stringstream ss(parsed);
    double real;
    char sign;
    while(1){
      if(ss>>real){// 空格会被吞掉 update: 已加入 blank 检测
        exps.push_back(node{0,real,0});
      }else{
        if(ss.eof())break;
        ss.clear();
        ss>>sign; // 空格会被吞掉 udate: 已加入 blank 检测
        if(sgns.empty()){
          sgns.push(sign==LBRA?SP_LPIN:sign);
          continue;
        }
        int rk=mp[sgns.top()];
        if(sign==RBRA){ // pop到左括号
          while(1){
            char now=sgns.top();
            sgns.pop();
            if(now==SP_LPIN)break;
            exps.push_back(node{1,0,now==SP_LPIN?char(LBRA):now});
            if(sgns.empty())break;
          }
        }else if((mp[sign]<=rk) // pop 到低权或者左括号
                 &&
                 (sign==POWE?(sgns.empty()?1:(sgns.top()==POWE?0:1)):1) // 连续的第二个右结合的 ^ 不使用这个策略，而是直接入栈
                ){ 
          while((!sgns.empty())&&sgns.top()!=SP_LPIN&&mp[sign]<=mp[sgns.top()]){
            char now=sgns.top();
            sgns.pop();
            exps.push_back(node{1,0,now});
          }
          sgns.push(sign);
        }else{
          sgns.push(sign==LBRA?SP_LPIN:sign);
        }
      }
    }
    while(!sgns.empty()){
      char now=sgns.top();sgns.pop();
      exps.push_back(node{1,0,now==SP_LPIN?char(LBRA):now});
    }
  }
  void prmtc(){
    stack<char> stk;
    int ssz=raw.size();
    for(int j=0;j<ssz;j++){
      char i=raw[j];
      if(i==LBRA){
        stk.push(i);
      }else if(i==RBRA){
        if(j>0&&raw[j-1]==LBRA){
          throw "Invaild Exp: Empty LRBrackets";
        }
        if(!stk.empty()&&stk.top()==LBRA){
          stk.pop();
        }else{
          throw "Invaild Exp: Unmatch Brackets";
        }
      }
    }
    if(!stk.empty()){
      throw "Invaild Exp: Unmatch Brackets";
    }
  }
  void svstr(){
    string tmp;
    tmp=char(LBRA)+raw+char(RBRA);
    int tsz=tmp.size();
    for(int i=0;i<tsz;i++){
      if(tmp[i]==BLAN){
        throw "Invaild Exp: Blank";
      }
      if(tmp[i]=='.'){ // 1.的.会被吞掉
        if(i>0){
          if(tmp[i-1]>'9'||tmp[i-1]<'0'){
            throw "Invaild Exp: Invaild Dot";
          }
        }
        if(i+1<tsz){
          if(tmp[i+1]>'9'||tmp[i+1]<'0'){
            throw "Invaild Exp: Invaild Dot";
          }
        }
      }
      parsed+=(tmp[i]==MINU?SP_MINU:tmp[i]==PLUS?SP_PLUS:tmp[i]); // 不让 +- 被吞掉
      if(tmp[i]==LBRA&&i+1<tsz)
        if(tmp[i+1]==MINU||tmp[i+1]==PLUS)parsed+=char(ZERO); // 将 +- 严格转化为双目运算符
    }
  }
  void inimp(){
    mp[RBRA]=141;
    mp[LBRA]=141;
    mp[SP_LPIN]=-141; // 栈中的左括号优先级最小，只有右括号能将其弹出
    mp[SP_PLUS]=1;
    mp[SP_MINU]=1;
    mp[DIVI]=2;
    mp[MULT]=2;
    mp[MOLD]=2;
    mp[POWE]=3;
  }
  void debug(){
    for(auto i : exps){
      cout<<"["<<(i.sign==SP_MINU?char(MINU):i.sign==SP_PLUS?char(PLUS):i.sign)<<","<<i.real<<"]";
    }
  }
  public:
  Exp(string ins){
    inits();
    inimp();
    raw=ins;
  }
  void inits(){
    raw.clear();
    parsed.clear();
    exps.clear();
    while(!sgns.empty())sgns.pop();
  }
  double cacls(){
    prmtc();
    svstr();
    Infix2Posfix();
    // debug();
    double ret=CalcPosfixEx().real;
    return ret;
  }
};
int main() try{
  string ins;
  while(getline(cin,ins)){
    try{
      double ans=Exp(ins).cacls();
      cout<<setiosflags(ios::fixed)<<setprecision(2)<<ans<<endl;
    }catch(const char *e){
      // cout<<e<<endl;
      cout<<"ERROR IN INFIX NOTATION"<<endl;
    }
  }
  return 0;
}catch(exception e){
  // cout<<e.what()<<endl;
  return 0;
}
```