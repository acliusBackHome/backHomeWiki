module.exports = {
  title: 'acliusBackHome',
  description: 'Running',
  base: '/',
  themeConfig: {
    displayAllHeaders: false,
    nav: [
      { text: '留言板', link: '/docs/discussindex'}
    ],
    sidebar: [
      '/',
      {
        title: 'tech doc',
        children: [
          {
            title: 'glut',
            children: [
              '/docs/glut/glut0x0'
            ]
          },
          {
            title: 'wireshark',
            children: [
              '/docs/wireshark/wireshark0x0',
              '/docs/wireshark/wireshark0x1'
            ]
          },
          {
            title: 'programming with cpp',
            children: [
              '/docs/cpp/programmingwithcpp',
              '/docs/cpp/helloworldkernel',
              '/docs/cpp/InfixCalc',
            ]
          },
          {
            title: '从零开始的软工生活',
            children: [
              '/docs/re/rese0x0',
              '/docs/re/rese0x1',
            ]
          }
        ]
      },
      {
        title: 'org',
        children: [
          '/docs/aclius/aclius',
          '/docs/aclius/backhome',
          '/docs/aclius/backhomeparty',
          '/docs/aclius/backhomekernel',
          '/docs/aclius/yuki',
          '/docs/aclius/miu',
          '/docs/aclius/onenumber'
        ]
      }
    ]
  }
}