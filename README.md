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
- delete: delete project directory from list

config:

- `project.enable`: "default": true
  > "description": "Is enable coc-project"
- `project.dbpath`: "default": "~/.coc-project",
  > "description": "file path to save project list"
- `project.rootPatterns`: "default": [".git"]
  > "description": "project root patterns"
- `project.trace.server`: "default": "off"
  > "description": "Trace level of coc-project server"

### Buy Me A Coffee ☕️

![btc](https://img.shields.io/keybase/btc/iamcco.svg?style=popout-square)

![image](https://user-images.githubusercontent.com/5492542/42771079-962216b0-8958-11e8-81c0-520363ce1059.png)
