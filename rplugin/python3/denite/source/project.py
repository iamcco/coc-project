# ============================================================================
# FILE: project.py
# AUTHOR: 年糕小豆汤 <ooiss@qq.com>
# License: MIT license
# ============================================================================

import os
import re
import json
import time
from denite import util
from .base import Base
from ..kind.file import Kind as FileKind

# this function come from https://github.com/neoclide/todoapp.vim
def timeago(now, seconds):
    diff = now - seconds
    if diff <= 0:
        return 'just now'
    if diff < 60:
        return str(int(diff)) + ' seconds ago'
    if diff/60 < 60:
        return str(int(diff/60)) + ' minutes ago'
    if diff/3.6e+3 < 24:
        return str(int(diff/3.6e+3)) + ' hours ago'
    if diff/8.64e+4 < 24:
        return str(int(diff/8.64e+4)) + ' days ago'
    if diff/6.048e+5 < 4.34812:
        return str(int(diff/6.048e+5)) + ' weeks ago'
    if diff/2.63e+6 < 12:
        return str(int(diff/2.63e+6)) + ' months ago'
    return str(int(diff/3.156e+7)) + 'years ago'

class Source(Base):

    def __init__(self, vim):
        super().__init__(vim)

        self.name = 'project'
        self.kind = Kind(vim)

    def define_syntax(self):
        self.vim.command('syntax case ignore')
        self.vim.command(r'syntax match deniteAction_header /\v^.*$/ containedin=' + self.syntax_name)
        self.vim.command(r'syntax match deniteAction_name /\v^ *[^ ]+ / contained '
                         r'containedin=deniteAction_header')
        self.vim.command(r'syntax match deniteAction_param /\v(\[|\{)[^ ]*(\]|\})/ contained '
                         r'containedin=deniteAction_header')
        self.vim.command(r'syntax match deniteAction_desc /->.*$/ contained '
                         r'containedin=deniteAction_header')

    def highlight(self):
        self.vim.command('highlight default link deniteAction_name Type')
        self.vim.command('highlight default link deniteAction_param Statement')
        self.vim.command('highlight default link deniteAction_desc Comment')

    def gather_candidates(self, context):
        candidata = []
        path_to_save_project = self.vim.eval('project#util#get_path_to_save_project()');
        project_map = json.loads(open(path_to_save_project).read())
        if path_to_save_project != '':
            candidata = [{
                'word': '%s [%s] -> %s' % (
                        os.path.basename(value),
                        timeago(time.time(), project_map[value] / 1000),
                        value
                    ),
                'source__name': os.path.basename(value),
                'action__path': value,
                } for value in project_map]
        return candidata


class Kind(FileKind):
    def __init__(self, vim):
        super().__init__(vim)
        self.name = 'project_kind'
        self.default_action = 'open'
        self.persist_actions = ['delete']
        self.redraw_actions = ['delete']

    def action_delete(self, context):
        target = context['targets'][0]
        project_name = target['source__name']
        project_path = target['action__path']
        result = util.input(
                self.vim, context, 'delete %s (Yes/No): ' % project_name, 'yes')
        self.vim.command('let g:result_t = "%s"' % result)
        if re.match('^yes$', result, re.I):
            path_to_save_project = self.vim.eval('project#util#get_path_to_save_project()');
            f = open(path_to_save_project, 'r')
            project_map = json.loads(f.read())
            f.close()
            del project_map[project_path]
            f = open(path_to_save_project, 'w')
            f.write(json.dumps(project_map))
            f.close()
