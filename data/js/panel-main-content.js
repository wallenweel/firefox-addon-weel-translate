const contain = document.querySelector('.wl__container');
const content = document.querySelector('.wl__content');
const footer = document.querySelector('.wl__footer');
const search = content.querySelector('.wl__search');
const searchAct = search.querySelector('.action-btn');
const input = search.querySelector('.input-box .input');
const clearBtn = search.querySelector('.input-box .clear-btn');

const resultCon = document.querySelector('.wl__result');
const result = resultCon.querySelector('.result');
const translation = result.querySelector('.translation');
const phonetic = result.querySelector('.phonetic');

phonetic.tic = phonetic.querySelector('.tic');

const moreResult = resultCon.querySelector('.more');
const explains = moreResult.querySelector('.explains');

const meta = {
    height: '',
    width: '',
    main_panel_w: self.options.prefs.main_panel_w.value,
    float_panel_w: self.options.prefs.float_panel_w.value,
    s2s_mode: self.options.prefs.select_to_show.value,
    status: 0
};

const initStyle = {
    content_padding: content.style.padding,
    result_margin: resultCon.style.margin,
    search_display: search.style.display,
    phonetic_display: phonetic.style.display
};

// Refresh to Getting New Preferences
self.port.on('on_tab_ready', ( tab ) => {
    resultCon.style.display = 'none';

    meta.s2s_mode = tab.prefs.select_to_show.value;

    meta.main_panel_w = tab.prefs.main_panel_w.value;
    meta.float_panel_w = tab.prefs.float_panel_w.value;

    restorePanelLayout();
});

// Trigger Search Action Button
searchAct.addEventListener('click', searchActionTrigger);

input.addEventListener('keydown', ( ev ) => {
    if ( ev.keyCode === 13 ) {
        searchActionTrigger( ev );
    }
});

clearBtn.addEventListener('click', ( ev ) => {
    clearResult();
});

input.addEventListener('change', () => {
    meta.status = 1;
});

// Listen Main Button's click Event
self.port.on('on_mainbutton_click', searchActionTrigger);

// Listen Select Event
self.port.on('on_text_select', selectActionTrigger);

// Listen Request Over Event
self.port.on('on_request_final', requestFinal);

function selectActionTrigger( data ) {
    meta.status = 1;

    let layout, request, query;

    query = data.text;
    input.value = query;

    if ( meta.s2s_mode !== 0 ) {
        self.port.emit( 'on_select_final', data );

        if ( meta.s2s_mode === 2 ) {
            floatPanelLayout();

            data.layout = updateLayout( 's2s_mode_2', null, 1 );
        } else {
            data.layout = updateLayout( 'selection', meta.main_panel_w, 1 );
        }

        return request = onRequest( query );
    }
}

function searchActionTrigger( ev ) {
    if ( meta.s2s_mode === 2 ) restorePanelLayout();

    // Update Layout before Doing Something
    let layout = updateLayout( 'mainButton' );

    if ( ! ev ) return 0;

    if ( meta.s2s_mode !== 0 && ! ev.type ) return 0;

    if ( typeof ev === 'string' ) {
        meta.status = 1;

        input.value = ev;

        return onRequest( ev );
    } else {
        return onRequest( input.value );
    }
}

function clearResult() {
    input.value = '';

    resultCon.style.display = 'none';

    translation.innerHTML = '';
    phonetic.innerHTML = '';
    explains.innerHTML = '';

    let layout = updateLayout( 'clearBtn' );
}

function restorePanelLayout() {
    search.style.display = footer.style.display = initStyle.search_display;
    content.style.padding = initStyle.content_padding;
    resultCon.style.margin = initStyle.result_margin;
}

function floatPanelLayout() {
    search.style.display = footer.style.display = 'none';
    content.style.padding = 0;
    resultCon.style.margin = 0;
}

function updateLayout( updater, width = null, height = null ) {
    let layout = {
        height: height || contain.offsetHeight,
        width: width
    }

    layout.updater = updater || '';

    self.port.emit('on_panel_layout_update', layout);

    return layout;
}

function onRequest( query ) {
    if ( ! query || ! meta.status ) return 0;

    self.port.emit( 'on_request', query );

    return query;
}

function requestFinal( json ) {
    if ( ! json.translation ) return 0;

    resultCon.style.display = '';

    inject2result( json );

    let layout = updateLayout();

    meta.status = 0;
}

function inject2result( data ) {
    if ( ! data.translation ) return 'no translation';

    translation.innerText = data.translation;

    if ( data.explains ) {
        let tempCon = document.createDocumentFragment();

        if ( typeof data.explains === 'object' ) {
            for (let i = 0; i < data.explains.length; i++) {
                let item = document.createElement('span');
                let itemText = document.createTextNode(data.explains[i]);

                item.appendChild(itemText);
                tempCon.appendChild(item);
            }

            explains.innerHTML = '';
            explains.appendChild(tempCon);
        }
    }

    let phonetics = data.phonetic;

    if ( phonetics.default ) {
        phonetic.innerHTML = '';

        let tic = document.createElement('span');
        tic.className = 'tic';
        tic.innerHTML = phonetics.default;

        phonetic.appendChild( tic );
    } else {
        phonetic.innerHTML = '';
    }
}
