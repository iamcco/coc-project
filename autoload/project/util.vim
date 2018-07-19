"get path to save project
function! project#util#get_path_to_save_project() abort
    return get(g:, 'project_save_path', expand('~/.project.json'))
endfunction
