# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

```
MusicApplicationFrontEnd
├─ .eslintrc.cjs
├─ .git
│  ├─ COMMIT_EDITMSG
│  ├─ config
│  ├─ description
│  ├─ HEAD
│  ├─ hooks
│  │  ├─ applypatch-msg.sample
│  │  ├─ commit-msg.sample
│  │  ├─ fsmonitor-watchman.sample
│  │  ├─ post-update.sample
│  │  ├─ pre-applypatch.sample
│  │  ├─ pre-commit.sample
│  │  ├─ pre-merge-commit.sample
│  │  ├─ pre-push.sample
│  │  ├─ pre-rebase.sample
│  │  ├─ pre-receive.sample
│  │  ├─ prepare-commit-msg.sample
│  │  ├─ push-to-checkout.sample
│  │  ├─ sendemail-validate.sample
│  │  └─ update.sample
│  ├─ index
│  ├─ info
│  │  └─ exclude
│  ├─ objects
│  │  ├─ 02
│  │  │  └─ aec9bb7c66c08398ae59aaafe86181ad9717a8
│  │  ├─ 05
│  │  │  └─ c75c045b9c7dbe95f7a9832a025b2515b9f5e4
│  │  ├─ 0c
│  │  │  └─ 589eccd4d48e270e161a1ab91baee5e5f4b4bc
│  │  ├─ 10
│  │  │  └─ d6867114a7a3421755f971af909fa52dce9f3c
│  │  ├─ 11
│  │  │  ├─ 1e055be92e2aa2a7df3657e31a9307bb3719f4
│  │  │  └─ 603f2f09faa788c573e41a3f0b55a0af5ef583
│  │  ├─ 13
│  │  │  └─ 1887c4d99d4924101520ee697febe09911ae94
│  │  ├─ 17
│  │  │  └─ 7f3aa69a63ed066be2e9dfd514107df3b16d82
│  │  ├─ 21
│  │  │  └─ 0d852afce9d48e2307d41735a8bb495efc2f6e
│  │  ├─ 23
│  │  │  └─ cfc6af87259e978a0d01a9e01119e9e9a8beec
│  │  ├─ 24
│  │  │  └─ 0e8a0201202eee0dedc063d8beeef5e47b151b
│  │  ├─ 28
│  │  │  └─ 12922ec2f350a76c1fdb937a6f85cac5cb5013
│  │  ├─ 29
│  │  │  └─ 5176a316a9a1dee291c33acefb3f5086e98015
│  │  ├─ 2b
│  │  │  └─ d4efbbfe0032b061d0bb5ed546ed683f00e7d2
│  │  ├─ 2d
│  │  │  └─ c9a9566d00cbda7bf6789bc0de845bb8e1bddb
│  │  ├─ 2e
│  │  │  └─ fe9b15fb899447bc141d7977e22316ac1ed3c0
│  │  ├─ 35
│  │  │  └─ c70f1a83f3ef9bf3e21338d1bbed0135e643bb
│  │  ├─ 37
│  │  │  ├─ 429beb25e168db08b951c2a6c6e09b261d7f2d
│  │  │  └─ cf7a1f660744b8a2cfe542304319ec84222dd8
│  │  ├─ 38
│  │  │  ├─ 6ee124ed10943200be848805c9d58955ffe668
│  │  │  ├─ 8cad14a0218dcccac8ff49e0972c91916a46ad
│  │  │  └─ e1dae6c6d87c02b9cf9de65b9540ae0826a331
│  │  ├─ 39
│  │  │  └─ 1e876092d6e99570a14a03e74d3e2e4e911232
│  │  ├─ 3a
│  │  │  └─ a83608d8b334353f82670d3da1e9fdf2d38cd9
│  │  ├─ 3c
│  │  │  └─ dcb4994db2b40bdec22f2d645d31e467d5ef01
│  │  ├─ 3e
│  │  │  └─ 212e1d4307a332e8511f530bc48a4ad5ed6f95
│  │  ├─ 51
│  │  │  └─ ad380a5003cebae117118736cc4b8155a38c33
│  │  ├─ 54
│  │  │  └─ b39dd1d900e866bb91ee441d372a8924b9d87a
│  │  ├─ 55
│  │  │  └─ 7b37c44d5cb352ff331f90e7fba0189cdfa65e
│  │  ├─ 57
│  │  │  └─ c5233cc6b155cd3d77fcba9d23739f75652f42
│  │  ├─ 58
│  │  │  └─ ef980b873f7270f620c475c2ab979fd1a8b59c
│  │  ├─ 5a
│  │  │  └─ 33944a9b41b59a9cf06ee4bb5586c77510f06b
│  │  ├─ 61
│  │  │  └─ 19ad9a8faaa5073a454f67b50fb98a25972fd2
│  │  ├─ 62
│  │  │  └─ c90e425990cbe7debc6f8b92e6fce226422f27
│  │  ├─ 67
│  │  │  └─ 25d1a86898080431b5095ca64a00350318288a
│  │  ├─ 69
│  │  │  └─ de905035f9e99919349f35cbe68f55643f5191
│  │  ├─ 6c
│  │  │  └─ 87de9bb3358469122cc991d5cf578927246184
│  │  ├─ 6f
│  │  │  └─ 356f418b770244e1f15dbd565c4c00d3b446d1
│  │  ├─ 71
│  │  │  ├─ a5328a35ac54073d1938d496d3a8d313353dd4
│  │  │  └─ bd0424cbfd9386c6935ce9dc069c20a567da92
│  │  ├─ 73
│  │  │  └─ 75d37d1320ab1cad938a4785d7dc241216f15e
│  │  ├─ 76
│  │  │  └─ e2e1848f223e274fb01144525f286f42d8dbc9
│  │  ├─ 7a
│  │  │  └─ 1d780dabbdc65d85b18a7e517e9f5364185a0e
│  │  ├─ 7d
│  │  │  └─ 51a9d7c9bc78d9bef647baf8f67ecea05a5f37
│  │  ├─ 86
│  │  │  └─ 6aad3607a8fd12c517f68ccec1e44b7db49f11
│  │  ├─ 89
│  │  │  └─ 71bbe8983736c8e4ab0d22abfaa6b95a18bfef
│  │  ├─ 8f
│  │  │  └─ ec16f5dbb412d009fdfcb7d8caec96d17aceb1
│  │  ├─ 94
│  │  │  └─ c0b2fc152a086447a04f62793957235d2475be
│  │  ├─ 96
│  │  │  └─ a0dfa9a8ca98877c193ba1aa8c10289ca79c97
│  │  ├─ 97
│  │  │  └─ acbf802e9b4c8829f11179a8ea8e6b49cba18d
│  │  ├─ 98
│  │  │  ├─ 432dfb9b56b3d2b7ce4098af686f8adc0a7f1d
│  │  │  └─ 47074a343f38748c08a9c94865c028b522c1ae
│  │  ├─ a2
│  │  │  ├─ 6a58c3378e830e640882ad5fadb5ed4dfcc4b0
│  │  │  └─ cf31aec0d3737c1064c03a73a55dcad1c31483
│  │  ├─ a4
│  │  │  └─ b940618e62959b53f9e587b9c3379dcce10ea8
│  │  ├─ a5
│  │  │  ├─ 47bf36d8d11a4f89c59c144f24795749086dd1
│  │  │  └─ 707ba09612ff80e62f85d338085e292ec3ff05
│  │  ├─ a9
│  │  │  └─ 31f754cd0c5fac5421727a6f8e264ad786838f
│  │  ├─ ae
│  │  │  └─ d6f280c6f66f1bb3b14ff86538fc867a54ecd2
│  │  ├─ b0
│  │  │  ├─ 3f8fe4481c7a80e5219231e1c34c34be523cb7
│  │  │  └─ 7c7b9652199d80a0a2cb5cdc5b185c71599481
│  │  ├─ b6
│  │  │  └─ 64cc94e788a50fa3e2e5c4413d45ee70e094b4
│  │  ├─ b8
│  │  │  └─ b8473a3696b4f77deff889a84ab45629c42079
│  │  ├─ b9
│  │  │  ├─ abe51bff0721ba72995ca5d12ff14088f0b228
│  │  │  └─ d355df2a5956b526c004531b7b0ffe412461e0
│  │  ├─ bd
│  │  │  └─ f4f5059a9035d9e7af5d33b0664e38d247d3d2
│  │  ├─ c3
│  │  │  └─ 4c69f7c9ced9ead58fe9b97fe2815dfcff6d0c
│  │  ├─ c8
│  │  │  └─ 40ec2ffa8ba15c18a47df03d20fa4064fb7169
│  │  ├─ d0
│  │  │  └─ 36fc74ae204e01f6e29b801832e86191bd860d
│  │  ├─ d1
│  │  │  └─ 212a26fcb008632b0aba8c47bf008e660827f5
│  │  ├─ d6
│  │  │  └─ ca653a43afbfddc9cd8e0d255984da966a33e2
│  │  ├─ de
│  │  │  └─ e89797fed72648ea7387a6f630665a315b7c2b
│  │  ├─ e6
│  │  │  ├─ 5bd1a7bf322abb32cca8eaa21ea903e7dc0fa0
│  │  │  └─ 9de29bb2d1d6434b8b29ae775ad8c2e48c5391
│  │  ├─ e7
│  │  │  └─ b8dfb1b2a60bd50538bec9f876511b9cac21e3
│  │  ├─ f6
│  │  │  ├─ 2c0385c10498903305cc9f4a980361a10756b5
│  │  │  └─ a8ab1477111f30b41e930d42af0e8d5145103f
│  │  ├─ f7
│  │  │  ├─ 37720987fe22572a7129d65962a1e3ecd904ab
│  │  │  └─ 68e33fc946e6074d6bd3ce5d454853adb3615e
│  │  ├─ fc
│  │  │  └─ db2b67bacc322699c61026f60cb03e36fbaf52
│  │  ├─ ff
│  │  │  └─ 4be405bd0ce1c07c171fb3c289f0fc4a54ce5a
│  │  ├─ info
│  │  └─ pack
│  └─ refs
│     ├─ heads
│     │  └─ master
│     ├─ remotes
│     │  └─ origin
│     │     └─ master
│     └─ tags
├─ .gitignore
├─ index.html
├─ package-lock.json
├─ package.json
├─ public
│  ├─ testing
│  │  └─ audio
│  │     ├─ Come-on-Girls.mp3
│  │     └─ Poo-Nee-Poo.mp3
│  └─ vite.svg
├─ README.md
├─ src
│  ├─ api
│  │  └─ axiosConfig.js
│  ├─ App.css
│  ├─ App.jsx
│  ├─ assets
│  │  ├─ images
│  │  │  └─ RegisterLoginImage.jpg
│  │  └─ logo
│  │     └─ logo.jpg
│  ├─ Components
│  │  ├─ AdminDashboard.jsx
│  │  ├─ ArtistDashboard.jsx
│  │  ├─ DashboardComponent.jsx
│  │  ├─ LeftNavbar.jsx
│  │  ├─ LoginComponent.jsx
│  │  ├─ MusicPlayerComponent.jsx
│  │  ├─ NavbarComponent.jsx
│  │  ├─ RegisterComponent.jsx
│  │  ├─ SongsComponent.jsx
│  │  ├─ TopNavbar.jsx
│  │  ├─ UserDashboard.jsx
│  │  └─ VerificationComponent.jsx
│  ├─ contexts
│  │  └─ AuthContext.jsx
│  ├─ css
│  │  ├─ LeftNavbar.css
│  │  ├─ MusicPlayer.css
│  │  ├─ NavbarComponent.css
│  │  ├─ SongsComponent.css
│  │  ├─ TopNavbar.css
│  │  └─ UserDashboard.css
│  ├─ index.css
│  ├─ main.jsx
│  └─ ProtectedRoute.jsx
└─ vite.config.js

```