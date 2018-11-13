let g:ale_linters = { 
    \ 'javascript': ['eslint'], 
    \ }

let g:ale_fixers = { 
    \ 'javascript': ['prettier'], 
    \ }

let g:ale_javascript_eslint_use_global = 0
let g:ale_javascript_prettier_use_local_config = 1
