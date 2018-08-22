module.exports = {
  title: 'acliusBackHome',
  description: 'Coming soon',
  base: '/',
  themeConfig: {
    displayAllHeaders: true,
    // sidebar: 'auto',
    sidebar: [
      '/',
      {
        title: 'org',
        children: [
          '/docs/aclius',
          '/docs/backhome',
          '/docs/backhomeparty',
          '/docs/backhomekernel',
          '/docs/yuki',
          '/docs/miu',
          '/docs/onenumber'
        ]
      },
      {
        title: 'tech doc',
        children: [
          '/docs/programmingwithcpp',
          '/docs/helloworldkernel',
          '/docs/rese0x0'
        ]
      }
    ]
  }
}