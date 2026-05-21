const synapse      = window.parent
const synapse_host = 'https://pbides.powerbi.com'

let is_playing = false
const play = () => {
    is_playing = !is_playing
    if (is_playing) {
        play_btn.innerText = ''
    }
    else {
		play_btn.innerText = ''
    }
}

const step_forward = () => {
    set_source(current_function)
    synapse.postMessage({type: 'step', content: 'next'}, synapse_host)
}

const step_into = () => {
    set_source(current_function)
    synapse.postMessage({type: 'step', content: 'step'}, synapse_host)
}

const step_out = () => {
    set_source(current_function)
    synapse.postMessage({type: 'step', content: 'step_return'}, synapse_host)
}

const jump_end = () => {
    set_source(current_function)
    synapse.postMessage({type: 'step', content: 'continue'}, synapse_host)
}

const set_breakpoint = (fn, line, enable=true) => {
    synapse.postMessage({
        type:    'breakpoint',
        content: {
            fn:     fn,
            line:   line,
            enable: enable,
        }
    }, synapse_host)
}

const end_session = (e) => {
    synapse.postMessage({type: 'end', content: true}, synapse_host)
}

// TODO: setting breakpoints

window.addEventListener('message', (event) => {
    const {type, content} = event.data

    switch (type) {
    case 'new_tab': {
        console.log('new tab ', content)
        sources[content.name] = content.source

        const tab     = document.createElement('span')
        tab.innerText = content.name
        tab.onclick   = () => set_source(content.name)
        tab.classList.add('tab')
        header.appendChild(tab)

        if (Object.keys(sources).length === 1) {
            set_source(content.name)
        }
        break
    }

    case 'step_to': {
        console.log('step to ', content)
        render_variables(content.vars)
        render_call_stack(content.call_stack)
        set_source(content.name, content.line, content.vars)

        if (is_playing) {
            setTimeout(() => step_forward(), 250)
        }
        break
    }

    case 'print': {
        if (content === null) break
        const [level, output] = content.split('\t')

        const out     = document.createElement('pre')
        out.innerText = output
        out.classList.add('printed')
        out.classList.add(level.toLowerCase())

        console_el.appendChild(out)
        break
    }
    }

    render_refresh()
})


const render_refresh = () => {
    render_breakpoints()
    render_minimap(current_function)
}
