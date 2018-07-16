"===============================================================================
"File: autoload/project.vim
"Maintainer: iamcco <ooiss@qq.com>
"Github: http://github.com/iamcco <年糕小豆汤>
"Licence: Vim Licence
"===============================================================================
scriptencoding utf-8

function! s:lcd_project_root() abort
    let l:current_dir = getcwd()
    if b:project_root !=# ''
        if b:project_root !=# l:current_dir
            silent! execute 'lcd ' . b:project_root
        endif
        "save project path
        silent! call ProjectAdd(b:project_root)
    endif
endfunction

function! s:detect_project() abort
    if !exists('b:project_root')
        let l:find_dir = finddir('.git', expand('%:p:h') . ';')
        " not found .git directory
        if l:find_dir ==# ''
            let b:project_root = ''
        else
            let b:project_root = fnamemodify(fnamemodify(l:find_dir, ':p:h'), ':h')
        endif
    endif
    call s:lcd_project_root()
endfunction

function! project#init(timer_id) abort
    augroup project_init
        autocmd!
        autocmd BufEnter * call s:detect_project()
    augroup END
    au! project_start
    augroup! project_start
    call s:detect_project()
endfunction
