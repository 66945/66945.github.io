async function render({ model, el, experimental }) {
    // editor logic

    const local_host   = 'http://localhost:8001'
    //const editor_frame = document.createElement('iframe')
    //editor_frame.src = `${local_host}/debugger_real.html?env=live`

    //el.appendChild(editor_frame)

    //const editor = editor_frame.contentWindow
    const editor = window.open(`${local_host}/debugger_real.html?env=live`, 'Connected', 600, 600)

    const message_listener = async (event) => {
        if (event.origin !== local_host) return
        const {type, content} = event.data

        switch (type) {
        case 'step': {
            await experimental.invoke('breakpoint_cmd', content)
            break
        }

        case 'breakpoint': {
            await experimental.invoke('set_breakpoint', content)
            break
        }

        case 'end': {
            window.removeEventListener('message', message_listener)
            editor.close()
            //editor_frame.style.display = 'none'
            break
        }
        }
    }

    model.on('change:debug_frame', () => {
        const frame = model.get('debug_frame')
        editor.postMessage({
            type:    'step_to',
            content: {
                name:       frame.name,
                line:       frame.line,
                vars:       frame.vars,
                call_stack: ['unsupported', frame.name],
            },
        }, local_host)
    })

    model.on('change:log_output', () => {
        const log_output = model.get('log_output')
        editor.postMessage({
            type:    'print',
            content: log_output,
        }, local_host)
    })

    model.on('change:source', () => {
        const source = model.get('source')
        editor.postMessage({
            type:    'new_tab',
            content: {
                name:   source.name,
                source: source.code,
            },
        }, local_host)
    })


    // widget logic (not much)
    // TODO: add editor to fabric taskbar?

    const btns = document.createElement('div')

    const endpoint_buttons = () => {
        const endpoints = model.get('endpoints')
        for (const endpoint of endpoints) {
            const endpoint_btn = document.createElement('button')

            endpoint_btn.innerText = endpoint
            endpoint_btn.onclick   = async () => {
                window.addEventListener('message', message_listener)
                //editor_frame.style.display = 'block'
                await experimental.invoke('debug_endpoint', endpoint)
            }

            btns.appendChild(endpoint_btn)
        }
    }

    model.on('change:endpoints', () => endpoint_buttons())

    el.appendChild(btns)
    el.classList.add('debug-widget')
}

export default { render }