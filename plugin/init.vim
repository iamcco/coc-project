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

function! s:detect_project() abort
    let l:find_dir = finddir('.git', expand('%:p:h') . ';')
    " not found .git directory
    if l:find_dir ==# ''
        return
    endif
    let l:current_dir = getcwd()
    let b:project_root = get(
                \ b:,
                \ 'project_root',
                \ fnamemodify(fnamemodify(l:find_dir, ':p:h'), ':h')
                \)
    if l:current_dir !=# b:project_root
        silent! execute 'lcd ' . b:project_root
    endif
endfunction

augroup project_init
  autocmd!
  autocmd BufEnter * call s:detect_project()
augroup END

let s:save_cpoptions = &cpoptions
set cpoptions&vim
