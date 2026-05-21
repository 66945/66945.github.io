let debug_trace     = null
let call_stack      = []
let current_step    = null
let console_content = []

// flame graph
document.body.ondragover = (e) => {
    e.preventDefault()
    drop_file.style.display = 'flex'
}

document.body.ondragleave = (e) => {
    drop_file.style.display = 'none'
}

document.body.ondrop = (e) => {
    e.preventDefault()
    drop_file.style.display = 'none'
    upload.onchange({target: e.dataTransfer})
}

// TODO: seperate function for parsing json? definitely break apart
upload.onchange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
        const data  = JSON.parse(e.target.result)
        debug_trace = data.trace
        sources     = data.sources

        render_outline()
        render_exceptions()

		// build tabs
        header.innerHTML = ''
        for (const key of Object.keys(sources)) {
            const tab = document.createElement('span')
			tab.innerText = key
            tab.onclick = () => set_source(key)
            tab.classList.add('tab')

            header.appendChild(tab)
        }

		// show flame graph
		flame_graph.style.display = 'block'


        // build console
        console_content  = []
        console_el.innerHTML = ''

        for (const [i, [_1, _2, _3, _4, output, _5]] of debug_trace.entries()) {
            if (output === null) continue

            const [level, content] = output.split('\t')

            const out     = document.createElement('pre')
            out.innerText = content
            out.classList.add(level.toLowerCase())

            out.onclick = (e) => {
                current_step = i - 1
                scan_while(0, () => false)
            }

            console_el.appendChild(out)
            console_content.push({start: i, el: out})
        }

        current_step = 1
        jump_end()
    }

    reader.readAsText(file)
}


flame_graph.onmousedown = (e) => {
	document.body.onmousemove = (event) => {
		const total_steps = debug_trace.length
		const step_width  = flame_graph.width / total_steps

		const next_step = Math.floor(event.pageX / step_width)

		if (next_step > current_step)
			scan_while(1, () => current_step !== next_step)
		else if (next_step < current_step)
			scan_while(-1, () => current_step !== next_step)
	}
	document.body.onmouseup = (e) => {
		document.body.onmousemove = null
		document.body.onmouseup   = null
	}

	document.body.onmousemove(e)
}


// replay utilities

const get_stack_at = (at) => {
    let stack = []

    for (const layer of call_stack) {
        for (const call of layer) {
            if (current_step >= call.start && current_step <= call.end) {
                stack.push(call.name)
                break
            }
        }
    }

    return stack
}

const scan_while = (dir, cond) => {
    let [source_name, lineno, locals, depth] = debug_trace[current_step]

    do
    {
        current_step += dir
        current_step = Math.max(0, current_step)
        current_step = Math.min(debug_trace.length - 1, current_step)

        const [new_source_name, new_lineno, new_locals, new_depth] = debug_trace[current_step]; // WARN: load bearing semicolon

		// ...

        [source_name, lineno, locals, depth] = [new_source_name, new_lineno, new_locals, new_depth]
    }
    while (current_step < debug_trace.length - 1
        && current_step > 0
        && !breakpoints.includes(`${source_name}:${lineno}`)
        && cond())

    set_source(source_name, lineno)
    render_refresh()
}

const jump_start = ()      => scan_while(-1, () => true)
const jump_end   = ()      => scan_while(1, () => true)
const step_into  = (dir=1) => scan_while(dir, () => false)

const step_out = (dir=1) => {
    depth = debug_trace[current_step][3] 
    scan_while(dir, () => debug_trace[current_step][3] >= depth)
}

const step_forward = (dir=1) => {
    depth = debug_trace[current_step][3] 
    scan_while(dir, () => debug_trace[current_step][3] > depth)
}


// TODO: seperate into play() and pause()?
let play_interval = null
const play = () => {
	if (play_interval) {
		clearInterval(play_interval)
		play_interval = null
		play_btn.innerText = ''
        return
	}

    play_interval = setInterval(() => {
        step_into(1)

        const [fn, lineno, _1, _2] = debug_trace[current_step]

        if      (current_step === debug_trace.length - 1) play()
        else if (breakpoints.includes(`${fn}:${lineno}`))       play()
    }, 150)
    play_btn.innerText = ''
}

const set_breakpoint = (fn, line, enable=true) => {
    // exists in live mode - maybe do something with it here as well
}


// display
const render_outline = () => {
    outline.innerHTML = ''

    // 5 empty arrays for current depth
    call_stack  = [[], [], [], [], []]
    let prev_fn = {fn: '', depth: 0}

    for (const [i, line] of debug_trace.entries()) {
        const [fn, lineno, _, depth] = line
        if (fn === prev_fn.fn && depth === prev_fn.depth) continue

        const indent = '  '.repeat(depth - 1)
        const fn_li  = document.createElement('li')
        fn_li.style.whiteSpace = 'pre'
        fn_li.style.cursor     = 'pointer'

        if (depth > prev_fn.depth) {
            fn_li.innerHTML = `${indent}<span class="function">${fn}</span>(...)`
            call_stack[depth-1].push({
                name:  fn,
                start: i,
                end:   debug_trace.length,
            })
        }
        else {
            for (let j = prev_fn.depth; j > depth; j--) {
                fn_li.innerHTML      = `${indent}<i>${fn}</i> `
                fn_li.style.fontSize = '.9em'
                fn_li.style.color    = 'var(--text-dark)'

                call_stack.at(j-1).at(-1).end = i - 1
            }
        }

        fn_li.onclick = (e) => {
            current_step = i
            scan_while(0, () => false)
        }

        prev_fn = {fn: fn, depth: depth}
        outline.appendChild(fn_li)
    }
}

const render_exceptions = () => {
    exceptions_el.innerHTML = ''

    for (const [i, line] of debug_trace.entries()) {
        const [fn, lineno, _v, _d, _o, exception] = line
        if (exception === null) continue

        const exc_li     = document.createElement('li')
        exc_li.innerText = `${fn}:${lineno} ${sources[fn][lineno]}`
        exc_li.onclick   = (e) => {
            current_step = i
            scan_while(0, () => false)
        }

        exceptions_el.appendChild(exc_li)
    }
}


const render_flame_graph = () => {
	flame_graph.width  = window.innerWidth
	flame_graph.height = 50

	const total_steps  = debug_trace.length
	const step_width   = flame_graph.width / total_steps


	const ctx    = flame_graph.getContext('2d')
	const canvas = ctx.canvas

	const bg_color = getComputedStyle(canvas).getPropertyValue('--background-dark')
	const fg_color = getComputedStyle(canvas).getPropertyValue('--accent')
	const bp_color = getComputedStyle(canvas).getPropertyValue('--breakpoint')

	ctx.fillStyle   = bg_color
	ctx.strokeStyle = 'none'
	ctx.lineWidth   = 0

	ctx.fillRect(0, 0, flame_graph.width, flame_graph.height)

    ctx.fillStyle   = fg_color + '66'
    ctx.strokeStyle = bg_color
    ctx.lineWidth   = 2

    for (const [depth, calls] of call_stack.entries()) {
        for (const call of calls) {
            const start_x = call.start     * step_width
            const end_x   = (call.end + 1) * step_width

            ctx.fillRect(start_x, 50 - 10 * depth, end_x - start_x, -10)
            ctx.strokeRect(start_x, 50 - 10 * depth, end_x - start_x, -10)
        }
    }

	for (let i = 0; i < total_steps; i++) {
		const [fn, lineno, _, depth, output, exception] = debug_trace[i]

        const height = 50 - 10 * depth
        const center = i * step_width + (step_width / 2)

        if (output !== null) {
			ctx.fillStyle   = '#0a9bfc'

            ctx.font = '18px "Iosevka Nerd Font"'
            ctx.fillText('󱞁 ', center, height + 5)
		}
		else if (exception !== null) {
			ctx.fillStyle   = '#ff0000'

            ctx.font = '18px "Iosevka Nerd Font"'
            ctx.fillText(' ', center, height + 5)
		}
		else if (breakpoints.includes(`${fn}:${lineno}`)) {
			ctx.strokeStyle = bp_color

			ctx.beginPath()
			ctx.ellipse(center, height, 5, 5, 0, 0, 2 * Math.PI)
			ctx.stroke()
		}
	}

    ctx.fillStyle   = fg_color
    ctx.fillRect(current_step * step_width + step_width/2 - 2, 0, 4, 50)
}

const render_refresh = () => {
    const [fn, lineno, vars] = debug_trace[current_step]

    render_call_stack(get_stack_at(current_step))
    render_variables(vars)
    render_breakpoints()

    render_minimap(current_function)
    render_flame_graph()
}