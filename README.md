# project extension for coc

auto switch current pwd to workspace directory and
save workspace directory to project list.

## Install

``` vim
CocInstall coc-project
```

## Usage & config

``` vim
:CocList project
```

actions:

- open (default): open project directory

config:

``` jsonc
"project.enable": {
  "type": "boolean",
  "default": true,
  "description": "Is enable coc-project"
},
"project.dbpath": {
  "type": "string",
  "default": "~/.coc-project",
  "description": "file path to save project list"
},
"project.trace.server": {
  "type": "string",
  "default": "off",
  "enum": [
    "off",
    "messages",
    "verbose"
  ],
  "description": "Trace level of coc-project server"
}
```

### Buy Me A Coffee ☕️

![btc](https://img.shields.io/keybase/btc/iamcco.svg?style=popout-square)

![image](https://user-images.githubusercontent.com/5492542/42771079-962216b0-8958-11e8-81c0-520363ce1059.png)
