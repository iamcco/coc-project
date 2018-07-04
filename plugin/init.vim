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

augroup project_start
    autocmd!
    autocmd VimEnter * call timer_start(200, 'project#init')
augroup END

let s:save_cpoptions = &cpoptions
set cpoptions&vim
