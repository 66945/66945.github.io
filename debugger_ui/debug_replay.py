import json
import os

path  = input('path> ')
style = input('style> ')

with open(path) as f:
    blob = f.read()
    debug = json.loads(blob)

    if style == 'step':

        line = 0
        while line < len(debug['trace']):
            os.system('cls')

            func, lineno, local, depth = debug['trace'][line]

            source = debug['sources'][func]
            for i, source_line in enumerate(source):
                col = '  '
                if i == lineno:
                    col = '>>'
                if abs(i - lineno) <= 5:
                    print(f'{col} {source_line}')

            print('-------------------------------')

            for name, val in local.items():
                print(f'{name.ljust(15)} = {val}')

            line += 1
            x = input('next>')

            if x == 'c':
                current_depth = depth

                while debug['trace'][line][3] > current_depth:
                    line += 1
            elif x == 'o':
                current_depth = depth

                while debug['trace'][line][3] >= current_depth:
                    line += 1

    elif style == 'traceback':
        current_func  = ''
        current_depth = -1
        func_str      = []

        for line in debug['trace']:
            func, lineno, local, depth = line

            if func == current_func and depth == current_depth:
                func_str[lineno] = f'>{func_str[lineno]}'
                continue

            print('\n'.join(func_str))

            print()
            print('-------------------------------')
            print()
            
            if depth > current_depth:
                print(f' >> called {func}')

            if depth < current_depth:
                print(f' << returned from {func}')

            func_str      = debug['sources'][func]
            current_func  = func
            current_depth = depth