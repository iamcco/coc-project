"===============================================================================
"File: plugin/init.vim
"Maintainer: iamcco <ooiss@qq.com>
"Github: http://github.com/iamcco <年糕小豆汤>
"Licence: Vim Licence
"===============================================================================
scriptencoding utf-8

if exists('g:project_debug') && g:project_debug
elseif exists('g:project_loaded') && g:project_loaded
    finish
endif
let g:project_loaded = 1

let s:save_cpoptions = &cpoptions
set cpoptions&vim

if get(g:, 'sran_node_channel_id', -1) ==# 1
  call project#init()
else
  augroup project_start
    autocmd!
    autocmd User SranNvimRpcReady call project#init()
  augroup END
endif

let s:save_cpoptions = &cpoptions
set cpoptions&vim
