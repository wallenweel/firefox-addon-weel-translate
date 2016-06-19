## WeeL Translate V0.1.2

*** `Pre-Alpha step, some bugs in it` ***

An easy well translation of Firefox Add-on.

At Present, the translation API is using by YouDao, the reason is that GFW ...

## How to use?

#### .1 Install

0. Download the `*.xpi` postfix file frome [Release](https://github.com/wallenweel/firefox-addon-weel-translate/releases).

- Find it When you Downloaded

- Drag it into your Firefox Browser

- Confirm on alert panel, finish install.

#### .1.1 Mustn't enable?

0. Try open [about:config](about:config) and confirm that warning

- Search `xpinstall.signatures.required` and change "value" to `false`

- Maybe need to installing again

#### .2 Use your own API

0. You can use your YouDao translation API after you get `keyfrom` and `key` from [here](http://fanyi.youdao.com/openapi).

- Then open [Add-on Page](about:addons) in Firefox Browser, find the add-on and click preferences button.

- Now you will saw some options, input `keyfrom` into "API Key" and `key` into "API ID".

- Refresh your tabs or reload Firefox.

#### .3 Switch translation interaction mode

0. Ditto

- Ditto

- ** use in button: ** selected text then click toolbar button to show result

- ** present near button: ** selected text then show the result near toolbar button

- ** present near selection: ** show result near selected text as lite panel

- ** float button: ** selected text and show a float icon near it, click it to show result near button

- ...

------

This my first with Firefox Add-on, only a experiment for me, a batter method is going ...
If you enjoy this translation add-on, share it with your friends is good.
