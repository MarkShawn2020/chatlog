# Changelog

All notable changes to this project will be documented in this file.

### 0.3.1 (2025-11-09)


### ⚡ Performance

* add limit to contact/chatroom queries and fix types ([708aed9](https://github.com/MarkShawn2020/chatlog/commit/708aed986871a15a2111205d4313fd9d8c460782))
* optimize queries with cache and improve loading states ([8c5bea9](https://github.com/MarkShawn2020/chatlog/commit/8c5bea9bfbdefdaa62e3b3588434af40ffec7f52))


### 📝 Documentation

* add WeChat v4 image decryption fix documentation ([a9410a9](https://github.com/MarkShawn2020/chatlog/commit/a9410a9919f311d0c4b7e7e57f3a3a79dac14680)), closes [#139](https://github.com/MarkShawn2020/chatlog/issues/139) [#192](https://github.com/MarkShawn2020/chatlog/issues/192)
* **docker:** add docker.md ([#227](https://github.com/MarkShawn2020/chatlog/issues/227)) ([74e5680](https://github.com/MarkShawn2020/chatlog/commit/74e568085b8ae5aa3ec72dcd37aac6da969fa121))
* fix session pinned detection logic documentation ([616cb9f](https://github.com/MarkShawn2020/chatlog/commit/616cb9f749b9ed081faa47b456b44768781efa94))
* update pinned session detection logic explanation ([42ca488](https://github.com/MarkShawn2020/chatlog/commit/42ca488ebaf25fabba94b3ca3e04780c9073befa))
* update with correct status field implementation details ([afdb9a5](https://github.com/MarkShawn2020/chatlog/commit/afdb9a5f88490e0cdf233e358acc8d11bb55f215))


### 🐛 Bug Fixes

* add avatar fields to SQL queries in datasource layer ([a42d6fb](https://github.com/MarkShawn2020/chatlog/commit/a42d6fb2c63555152443a04f905ea84514664ee2))
* add Jotai Provider to prevent multiple instances ([e5e07dd](https://github.com/MarkShawn2020/chatlog/commit/e5e07ddae52452f407997ec523a41f483ae468de))
* add QueryClientProvider to ChatlogDashboard ([a666baa](https://github.com/MarkShawn2020/chatlog/commit/a666baa5ee52c1b28f6246fb4c5f6138b4fc01ff))
* **auto decrypt:** fix remote serve fsnotify watch ([#231](https://github.com/MarkShawn2020/chatlog/issues/231)) ([08323e0](https://github.com/MarkShawn2020/chatlog/commit/08323e05df9680ff1868544b563c0e9d9c1dbf02))
* **conf:** tui config write failed ([#235](https://github.com/MarkShawn2020/chatlog/issues/235)) ([a638aa9](https://github.com/MarkShawn2020/chatlog/commit/a638aa9c20350cb8f55910584583e4c8112ca3b9))
* correct WeChat 4.x pinned session detection logic ([911150d](https://github.com/MarkShawn2020/chatlog/commit/911150df447ef63c7ca3a657189007bddf401efb))
* **decrypt:** improve WeChat v4 image decryption reliability ([8e8edd0](https://github.com/MarkShawn2020/chatlog/commit/8e8edd0e1395179683e5b7bf372e7bd9fd75e437))
* dialog overflow with flex layout ([dd4143b](https://github.com/MarkShawn2020/chatlog/commit/dd4143b9a1b609538123fc4d6e4308c88c3cb3c4))
* ensure auto-scroll to bottom works reliably ([5870804](https://github.com/MarkShawn2020/chatlog/commit/5870804162075619ce9028779db2a10c702d2429))
* exclude chatrooms from contacts list ([e5564eb](https://github.com/MarkShawn2020/chatlog/commit/e5564ebdba1afc00f6745d74f878b2f181cabdd0))
* filter placeholders and enrich session display names ([4425264](https://github.com/MarkShawn2020/chatlog/commit/442526403584b4ef6811601f3cfaf92e8c585d51))
* improve system message filter and set interview as default ([76cc2d8](https://github.com/MarkShawn2020/chatlog/commit/76cc2d8163d064f690164586fd4c54b27719871e))
* **model:** enhanced message parsing and display ([#223](https://github.com/MarkShawn2020/chatlog/issues/223)) ([cad198d](https://github.com/MarkShawn2020/chatlog/commit/cad198d7a00906e319e8628528b12362d5bb60cf))
* populate senderName for self-sent messages ([c0cb3a3](https://github.com/MarkShawn2020/chatlog/commit/c0cb3a3d7af7ae625ba1dd36f86d71c210e14547))
* prevent flex item overflow with min-w-0 ([da70056](https://github.com/MarkShawn2020/chatlog/commit/da70056f340b55c0f0327398f360fdd02b9a44f0))
* prevent horizontal overflow in ChatPanel ([302f2c2](https://github.com/MarkShawn2020/chatlog/commit/302f2c2798926f97833de58fdf33fb0a2f5095d3))
* prevent horizontal overflow in conversation list panel ([097836b](https://github.com/MarkShawn2020/chatlog/commit/097836b1d52ad0485e96bc29adcd4ad5c8890f3c))
* prevent horizontal overflow with fixed width panel ([f09f650](https://github.com/MarkShawn2020/chatlog/commit/f09f650816dbfed5641fd00f5c2e44386836cf77))
* preview area scrolling with overflow-auto ([0440beb](https://github.com/MarkShawn2020/chatlog/commit/0440bebd2d68a54a2a277966729a96fc39eecaca))
* rename date-fns format import to avoid conflict ([2a24d71](https://github.com/MarkShawn2020/chatlog/commit/2a24d716bb3609aa01cd1cb0fae60d3a62ecedc6))
* revert to timestamp-based pinned detection (correct approach) ([a12faec](https://github.com/MarkShawn2020/chatlog/commit/a12faec7bfc4dbebcb59d11c960479849cc592ec))
* use double requestAnimationFrame for scroll timing ([692862c](https://github.com/MarkShawn2020/chatlog/commit/692862c3c87d9accb2f75ae59f716bbf20aec7f7))
* use status field for correct pinned session detection ([4b9552e](https://github.com/MarkShawn2020/chatlog/commit/4b9552ed5e2114cbd29860eea5b3904d2e75d01b))
* **wechatdb:** hardlink v4 & init db ([#216](https://github.com/MarkShawn2020/chatlog/issues/216)) ([9c221e6](https://github.com/MarkShawn2020/chatlog/commit/9c221e6e0d2a4cdc9ab344b8f1d065fca4755f56))


### ♻️ Refactoring

* apply Lovpen design system to Lovchat dashboard ([66c0403](https://github.com/MarkShawn2020/chatlog/commit/66c0403c1c0c7196864ab06f47ac7daac76dab9c))
* export dialog with split-pane layout ([5a7583a](https://github.com/MarkShawn2020/chatlog/commit/5a7583aa152345744673bea5bfffbd20225d50d8))
* migrate dashboard to WeChat-style 3-column layout ([77ecfd6](https://github.com/MarkShawn2020/chatlog/commit/77ecfd6129f06563693b0d6faa77f08eaf8f07be))
* use flex-col-reverse for natural bottom alignment ([cf4b0d9](https://github.com/MarkShawn2020/chatlog/commit/cf4b0d9a48274dccdc815bb30cf509d55a42ce4b))
* use react-intersection-observer for infinite scroll ([9f73487](https://github.com/MarkShawn2020/chatlog/commit/9f73487d38f08521e489843703f5c440049cf969))


### ✨ Features

* add avatar and fromNow time to sessions list ([ccbc412](https://github.com/MarkShawn2020/chatlog/commit/ccbc412ccf1c19f24682acc5cf173cdb067c6e57))
* add avatar fields to Contact model ([f38f60b](https://github.com/MarkShawn2020/chatlog/commit/f38f60bf89074d21a872c0c44e47d164613c2afb))
* add avatar support to chat messages and frontend ([58f52bb](https://github.com/MarkShawn2020/chatlog/commit/58f52bb95f641328fa6da6e320b3648f03b3b61c))
* add copy to clipboard button ([3df58e9](https://github.com/MarkShawn2020/chatlog/commit/3df58e9e3fbd521949713c00f9bcfa3a1c427705))
* add export options - sender rename and system message filter ([b670c42](https://github.com/MarkShawn2020/chatlog/commit/b670c42aabeea9e09fb021894637a3b897bef9c2))
* add header/footer and center chat layout to tablet size ([1bdbed8](https://github.com/MarkShawn2020/chatlog/commit/1bdbed84cceeb8fdeb195bc9daab3b4390b27313))
* add infinite scroll for contacts and groups (20 per page) ([e4ea069](https://github.com/MarkShawn2020/chatlog/commit/e4ea06915ad725e1b6a565272cf484e8f5ab72af))
* add interview format for export ([8e43790](https://github.com/MarkShawn2020/chatlog/commit/8e43790fdb7791452d00ce89ce865ab8b7b3900c))
* add pinned session support from contact.flag field ([0f88241](https://github.com/MarkShawn2020/chatlog/commit/0f88241a9525fcf824619f96dcf82ca3a300a439))
* add semantic versioning with auto version display ([4c0afcf](https://github.com/MarkShawn2020/chatlog/commit/4c0afcfc5d9242f4035297aceaa09915478985d3))
* add session grouping with pinned, normal, and minimized states ([292786d](https://github.com/MarkShawn2020/chatlog/commit/292786d068a28a4d1209b2db6e151d6b520ceee9))
* add total count to contacts and chatrooms API response ([42c6241](https://github.com/MarkShawn2020/chatlog/commit/42c62419fbd7b73fdeefdab46c600dbf1d1bf69e))
* auto-scroll to latest message without animation ([ec668cc](https://github.com/MarkShawn2020/chatlog/commit/ec668ccabc4003338b3d0c2b6e891f2ea4ed23f3))
* auto-update version headers in pre-commit ([373d674](https://github.com/MarkShawn2020/chatlog/commit/373d674fcb53912f3858c2d9ffd7acbe33857904))
* center layout with responsive design and mobile back button ([bd8d9ff](https://github.com/MarkShawn2020/chatlog/commit/bd8d9ff497a6a52010bb54be31bbc916c8f17f60))
* implement pinned-first sorting for session list ([8e2d3f1](https://github.com/MarkShawn2020/chatlog/commit/8e2d3f100cccd221179403e06d2505cf8875f8a7))
* init claude ([608c574](https://github.com/MarkShawn2020/chatlog/commit/608c57436e36c973f492dcfeb9b3e9c82472e078))
* integrate standard-version for semantic versioning ([6575ae7](https://github.com/MarkShawn2020/chatlog/commit/6575ae7bce487f71c93adea26af01453a68e8ea2))
* **mcp:** 重构 MCP 服务并修复部分问题（CSV & Voice） ([#214](https://github.com/MarkShawn2020/chatlog/issues/214)) ([cf47d1b](https://github.com/MarkShawn2020/chatlog/commit/cf47d1bdc519e77e8d93b9388d6ef32827505c98))
* move chatlog to dedicated full-screen layout ([f9b09da](https://github.com/MarkShawn2020/chatlog/commit/f9b09daf935e86fb0ebc5dd5d6cf52e829178bf5))
* preserve image links in markdown export ([b1f3471](https://github.com/MarkShawn2020/chatlog/commit/b1f34710c0a1f1f6b15b258abcc152069866e71f))
* rebrand to Lovchat with C2C-optimized UI ([b2d6860](https://github.com/MarkShawn2020/chatlog/commit/b2d68600486ff5074bd94e0b564fe95c968a12b9))
* **setting:** add image key manual setting ([#238](https://github.com/MarkShawn2020/chatlog/issues/238)) ([dfd5faa](https://github.com/MarkShawn2020/chatlog/commit/dfd5faa3ac33421966743fe34344111b900386be))
* sync version.ts with git commit hash ([b149a7d](https://github.com/MarkShawn2020/chatlog/commit/b149a7d823da1e3ed80f0c71d72c3f225446c008))
* **webhook:** add message webhook feature ([#225](https://github.com/MarkShawn2020/chatlog/issues/225)) ([d7c730d](https://github.com/MarkShawn2020/chatlog/commit/d7c730d426d6951299635346836bef55569e8cb0))
* **wechat:** support macOS 26 ([#293](https://github.com/MarkShawn2020/chatlog/issues/293)) ([d1d28eb](https://github.com/MarkShawn2020/chatlog/commit/d1d28eb7bbed1addb5844686b2c910f39356c4b6))
