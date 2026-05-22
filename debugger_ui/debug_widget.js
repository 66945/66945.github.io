async function render({ model, el, experimental }) {
    // editor logic

    const local_host   = 'http://localhost:8001'
    let   editor       = null

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
            await experimental.invoke('breakpoint_cmd', 'quit')
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
                call_stack: frame.stack,
                exception:  frame.exception,
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

    model.on('change:is_active', () => {
        const is_active = model.get('is_active')

        if (is_active) {
            window.addEventListener('message', message_listener)
            editor = window.open(`${local_host}/debugger_real.html?env=live`)
            status.innerText = 'Running ...'
        }
        else {
            window.removeEventListener('message', message_listener)
            editor.close()
            status.innerText = 'Done!'
        }
    })


    // widget logic (not much)
    let debug_btn = document.getElementById('custom-debug-btn')
    if (debug_btn === null) {
        debug_btn           = document.createElement('button')
        debug_btn.id        = 'custom-debug-btn'
        debug_btn.innerText = 'Debug'


        // add to ribbon
        const selector = 'div[data-sa-nm2="appDevToolsPanelRibbonTab"]'
        const ribbons  = document.body.querySelectorAll(selector)
        for (const ribbon of ribbons) {
            if (ribbon.checkVisibility({visibilityProperty: true})) {
                ribbon.appendChild(debug_btn)
            }
        }

        debug_btn.onclick = () => {
            const rect = debug_btn.getBoundingClientRect()
            const ec   = document.getElementById('custom-debug-dropdown')

            ec.style.top     = `${rect.bottom}px`
            ec.style.left    = `${rect.left}px`
            ec.style.display = 'flex'
        }
    }

    const endpoints_container = document.createElement('div')
    endpoints_container.id    = 'custom-debug-dropdown'
    el.appendChild(endpoints_container)


    const status     = document.createElement('p')
    status.innerText = 'standby'
    el.appendChild(status)


    const btns = document.createElement('div')
    const endpoint_buttons = () => {
        const endpoints = model.get('endpoints')
        for (const endpoint of endpoints) {
            const dropdown_btn = document.createElement('button')
            
            dropdown_btn.innerText = endpoint
            dropdown_btn.onclick   = async () => {
                endpoints_container.style.display = 'none'
                await experimental.invoke('debug_endpoint', endpoint)
            }
            endpoints_container.appendChild(dropdown_btn)
        }
    }

    model.on('change:endpoints', () => endpoint_buttons())

    el.appendChild(btns)
    el.classList.add('debug-widget')
}

export default { render }