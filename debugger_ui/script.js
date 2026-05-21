const stylesheet = document.getElementById('stylesheet')

const header         = document.getElementById('header')
const step_buttons   = document.getElementById('step-buttons')
const grabber        = document.getElementById('grabber')
const code           = document.getElementById('code')
const inspector      = document.getElementById('inspector')
const call_stack_el  = document.getElementById('call-stack')
const variables      = document.getElementById('variables')
const breakpoints_el = document.getElementById('breakpoints')
const exceptions_el  = document.getElementById('exceptions')
const outline        = document.getElementById('outline')
const minimap        = document.getElementById('minimap')
const flame_graph    = document.getElementById('flame-graph')
const footer         = document.getElementById('footer')
const console_el     = document.getElementById('console')
const resize_handle  = document.getElementById('resize')
const foot_resize    = document.getElementById('foot-resize')
const upload         = document.getElementById('json_file_upload')
const drop_file      = document.getElementById('drop-file')

const play_btn = document.getElementById('playbtn')

let sources          = {}
let current_function = ''

// TODO: conditional breakpoints, etc.
let breakpoints = []


document.body.onkeydown = (e) => {
	e.preventDefault()
    if (e.key === 'j')  step_forward(1)
    if (e.key === 'k')  step_forward(-1)
    if (e.key === 'l')  step_into(1)
    if (e.key === 'h')  step_out(-1)
    if (e.key === ' ')  play()
    if (e.key === '\r') jump_end()

    if (e.key === 't') {
        step_buttons.style.left = null
        step_buttons.style.top  = null

		if (stylesheet.href.includes('style_dark_plus.css')) {
			stylesheet.href = "style_noir.css"
		}
		else {
			stylesheet.href = "style_dark_plus.css"
		}
		render_refresh()
	}
}

grabber.onmousedown = e => {
	e.preventDefault()

    const step_rect = step_buttons.getBoundingClientRect()
    const m_x       = e.pageX - step_rect.x
    const m_y       = e.pageY - step_rect.y

    document.body.onmousemove = event => {
        let w = event.pageX - m_x
        let h = event.pageY - m_y

        step_buttons.style.left = `${w}px`
        step_buttons.style.top  = `${h}px`
    }
    document.body.onmouseup = e => {
        document.body.onmousemove  = null
        document.body.onmouseup    = null
    }
}

resize_handle.onmousedown = e => {
    e.preventDefault()
    document.body.onmousemove = event => {
        let w = event.pageX
        if (w < 100) w = 0
        inspector.style.flexBasis = `${w}px`
    }
    document.body.onmouseup = e => {
        document.body.onmousemove  = null
    }
}

foot_resize.ondblclick = e => {
    if (footer.style.display === 'flex') {
        footer.style.display = 'none'
    }
    else {
        footer.style.display   = 'flex'
        footer.style.flexBasis = '200px'
    }
}

foot_resize.onmousedown = e => {
    e.preventDefault()
    document.body.onmousemove = event => {
        let h = window.innerHeight - 50 - event.pageY
        if (h < 100) {
            footer.style.display   = 'none'
        }
        else {
            footer.style.display   = 'flex'
            footer.style.flexBasis = `${h}px`
        }
    }
    document.body.onmouseup = e => {
        document.body.onmousemove  = null
    }
}

const swap_theme = () => {
	document.body.classList.toggle('light-theme')
	render_refresh()
}


const render_call_stack = (stack) => {
    call_stack_el.innerHTML = ''
    for (const call of stack) {
        const call_element     = document.createElement('li')
        call_element.innerHTML = `<span class="function">${call}</span>(...)`

        call_stack_el.prepend(call_element)
    }
}

const render_variables = (vars) => {
    variables.innerHTML = ''
    for (const [varname, value] of Object.entries(vars)) {
        let varhint  = document.createElement('tr')
		let name     = document.createElement('td')
		let equals   = document.createElement('td')
		let value_el = document.createElement('td')

        name.innerText   = varname
		equals.innerText = ' := '

        // TODO: render more complex types
        if (typeof value === 'string') {
            let formatted = value.replaceAll('<', '&lt;')
                .replaceAll('>', '&gt;')
                .replaceAll('\'', '<span class="keyword">&#92;&apos;</span>')
                .replaceAll('\\', '<span class="keyword">&#92;&#92;</span>')
                .replaceAll('\n', '<span class="keyword">&#92;n</span>')
                .replaceAll('\t', '<span class="keyword">&#92;t</span>')

            value_el.classList.add('string')
            value_el.innerHTML = `'${formatted}'`
        }

        varhint.appendChild(name)
        varhint.appendChild(equals)
        varhint.appendChild(value_el)
        variables.appendChild(varhint)
    }
}

const render_breakpoints = (current_line) => {
	breakpoints_el.innerHTML = ''

	for (const bp of breakpoints) {
		const li = document.createElement('li')
		li.innerText = `  ${bp}`
        li.onclick   = e => {
            breakpoints = breakpoints.filter(i => i !== bp)
            render_refresh()
        }

		if (bp === current_line) {
            li.innerText   = `  ${bp}`
			li.style.color = 'var(--breakpoint)'
		}

		breakpoints_el.appendChild(li)
	}
}


// =========================== //
// === Syntax Highlighting === //
// =========================== //

const tokenize_line = (line) => {
    let tokens = []
    let re_matches = []

    while (line.length > 0) {
        if (re_matches = line.match(/^(def|self|is|in|not|and|or|as|True|False|None)\b(.*)/)) {
            tokens.push({type: 'keyword', content: re_matches[1]})
            line = re_matches[2]
        }
        else if (re_matches = line.match(/^(if|elif|else|while|for|return|break|try|except|raise)\b(.*)/)) {
            tokens.push({type: 'control', content: re_matches[1]})
            line = re_matches[2]
        }
        else if (re_matches = line.match(/^(int|str|bool|dict|tuple|list)\b(.*)/)) {
            tokens.push({type: 'type', content: re_matches[1]})
            line = re_matches[2]
        }
        else if (re_matches = line.match(/^([A-Z_][A-Z_0-9]+\b)(.*)/)) {
            tokens.push({type: 'constant', content: re_matches[1]})
            line = re_matches[2]
        }
        else if (re_matches = line.match(/^([A-Z][a-zA-Z_0-9]+)\b(.*)/)) {
            tokens.push({type: 'type', content: re_matches[1]})
            line = re_matches[2]
        }
        else if (re_matches = line.match(/^([a-zA-Z_][a-zA-Z_0-9]+)(\(.*)/)) {
            tokens.push({type: 'function', content: re_matches[1]})
            line = re_matches[2]
        }
        else if (re_matches = line.match(/^([a-zA-Z_][a-zA-Z_0-9]+\b)(.*)/)) {
            tokens.push({type: 'ident', content: re_matches[1]})
            line = re_matches[2]
        }
        else if (re_matches = line.match(/^("[^"]*")(.*)/)) {
            tokens.push({type: 'string', content: re_matches[1]})
            line = re_matches[2]
        }
        else if (re_matches = line.match(/^('[^']*')(.*)/)) {
            tokens.push({type: 'string', content: re_matches[1]})
            line = re_matches[2]
        }
        else if (re_matches = line.match(/^([0-9][0-9_.]*)(.*)/)) {
            tokens.push({type: 'numeric', content: re_matches[1]})
            line = re_matches[2]
        }
        else if (re_matches = line.match(/^(#.*)/)) {
            tokens.push({type: 'comment', content: re_matches[1]})
            return tokens
        }
        else if (re_matches = line.match(/^(\s+)(.*)/)) {
            tokens.push({type: 'whitespace', content: re_matches[1].replaceAll(' ', '‧')})
            line = re_matches[2]
        }
        else {
            tokens.push({type: 'other', content: line[0]})
            line = line.slice(1)
        }
    }

    return tokens
}


// TODO: break apart then redistribute
const set_source = (source_name, lineno=null, vars=null, exception=null) => {
    vars = vars ?? {}

    // NOTE: should tabs be their own thing?
    const tabs = document.getElementsByClassName('tab')
    for (const tab of tabs) {
        tab.classList.add('selected')
        if (tab.innerText === source_name) {
            tab.classList.add('selected')
        }
        else {
            tab.classList.remove('selected')
        }
    }
    current_function = source_name

    code.innerHTML = ''
    const source = sources[source_name]

    const start_indent = source[0].match(/^[\s]*/)[0]
    let   indent_level = 0

    for (const [line_number, _line] of source.entries()) {
        const line = _line.replace(start_indent, '')

        let row        = document.createElement('tr')
        let breakpoint = document.createElement('td')
        let number     = document.createElement('td')
        let python     = document.createElement('td')

        breakpoint.innerText = ' '
        number.innerText     = line_number + 1

		let is_current = line_number === lineno

        if (is_current) {
			breakpoint.innerText   = ' '
            breakpoint.style.color = 'var(--breakpoint)'

            python.classList.add('active-line')
            setTimeout(() => {
				// scroll to breakpoint instead to left align
				breakpoint.scrollIntoView({
					behavior: 'smooth',
					block:    'center',
					inline:   'start',
				})
            }, 5)
        }

        // why am I rerendering the whole thing for 1 breakpoint?
        const breakpoint_number = `${source_name}:${line_number}`
        if (breakpoints.includes(breakpoint_number)) {
			if (is_current) {
				breakpoint.innerText = ' '
			}
            breakpoint.style.color = 'var(--breakpoint)'
        }

        breakpoint.onclick = e => {
            if (breakpoints.includes(breakpoint_number)) {
                breakpoints = breakpoints.filter(i => i !== breakpoint_number)
                breakpoint.style.color = null
                set_breakpoint(source_name, line_number, false)
            }
            else {
                breakpoints.push(breakpoint_number)
                breakpoint.style.color = 'var(--breakpoint)'
                set_breakpoint(source_name, line_number)
            }
            render_refresh()
        }

        breakpoint.classList.add('breakpoint')
        number.classList.add('line-number')
        python.classList.add('python')

        let tokens = tokenize_line(line)
        if (tokens.length > 0 && tokens[0].type === 'whitespace') {
            indent_level = tokens[0].content.length / 4
            tokens       = tokens.slice(1)
        }

		const indent       = document.createElement('span')
		indent.style.color = 'var(--indent)'
		indent.innerText   = '┆    '.repeat(indent_level)

		python.appendChild(indent)

        for (let token of tokens) {
            let token_element       = document.createElement('span')
            token_element.innerText = token.content
            token_element.classList.add(token.type)

            if (token.type === 'ident' && Object.keys(vars).includes(token.content)) {
                token_element.style.borderBottom = '1px solid var(--accent)'
                token_element.title              = vars[token.content]
            }

            python.appendChild(token_element)
        }

        row.appendChild(breakpoint)
        row.appendChild(number)
        row.appendChild(python)

        code.appendChild(row)

        if (is_current && exception !== null) {
            const error_cell = document.createElement('td')
            const error_msg  = document.createElement('div')
            error_msg.innerHTML = `<b>Exception</b><br><p>${exception}</p>`
            error_msg.classList.add('error-msg')
            error_cell.appendChild(error_msg)

            const error_row  = document.createElement('tr')
            const error_icon = document.createElement('td')

            error_row.style.backgroundColor = 'var(--background-error)'
            error_icon.innerText            = ' '
            error_icon.style.textAlign      = 'right'
            error_icon.style.fontSize       = '1.2em'
            error_icon.style.color          = 'red'

            error_row.appendChild(error_icon)
            error_row.appendChild(document.createElement('td'))
            error_row.appendChild(error_cell)

            code.appendChild(error_row)
        }
    }

    render_minimap(source_name)
}


const render_minimap = (source_name) => {
    const rect     = minimap.getBoundingClientRect()
    minimap.width  = rect.width
    minimap.height = rect.height

    const char_x  = 2
    const char_y  = 5
    const space_x = 1
    const space_y = 2
    const pad_top = 10

    const source = sources[source_name]

    const start_indent = source[0].match(/^[\s]*/)[0]
    let   indent_level = 0

	const ctx    = minimap.getContext('2d')
	const canvas = ctx.canvas

	const background = getComputedStyle(canvas).getPropertyValue('--background-dark')
	const keyword    = getComputedStyle(canvas).getPropertyValue('--keyword')
	const control    = getComputedStyle(canvas).getPropertyValue('--control')
	const type       = getComputedStyle(canvas).getPropertyValue('--type')
	const func       = getComputedStyle(canvas).getPropertyValue('--function')
	const constant   = getComputedStyle(canvas).getPropertyValue('--constant')
	const number     = getComputedStyle(canvas).getPropertyValue('--number')
	const string     = getComputedStyle(canvas).getPropertyValue('--string')
	const ident      = getComputedStyle(canvas).getPropertyValue('--ident')
	const comment    = getComputedStyle(canvas).getPropertyValue('--comment')

    ctx.fillStyle = background
    ctx.fillRect(0, 0, minimap.width, minimap.height)

    for (const [line_number, _line] of source.entries()) {
        const line = _line.replace(start_indent, '')

        let   x_pos  = 0
        const tokens = tokenize_line(line)
        for (const token of tokens) {
            // 10 x 5 chars?
            ctx.fillStyle = background

            switch (token.type) {
                case 'keyword':  ctx.fillStyle = keyword;  break
                case 'control':  ctx.fillStyle = control;  break
                case 'type':     ctx.fillStyle = type;     break
                case 'function': ctx.fillStyle = func;     break
                case 'constant': ctx.fillStyle = constant; break
                case 'number':   ctx.fillStyle = number;   break
                case 'string':   ctx.fillStyle = string;   break
                case 'ident':    ctx.fillStyle = ident;    break
                case 'comment':  ctx.fillStyle = comment;  break
            }

            ctx.fillRect(x_pos, pad_top + (char_y + space_y) * line_number, char_x * token.content.length, char_y)
            x_pos += char_x * token.content.length
        }
    }
}

// live vs replay
const env_script = document.createElement('script')
const params     = new URLSearchParams(window.location.search)
const is_live    = params.get('env') === 'live'

if (is_live) {
    document.body.classList.remove('is-replay')
    document.body.classList.add('is-live')
}

env_script.src = is_live ? 'live.js' : 'replay.js'
document.body.appendChild(env_script)