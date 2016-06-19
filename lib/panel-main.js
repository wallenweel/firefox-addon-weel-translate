const Panel = require('sdk/panel').Panel;
const Data = require('sdk/self').data;

const request = require('./treat-request.js');
const mainButton = require('./button-main.js').self;
const conf = require('./configure.js');

const panel = Panel({
    contentURL: Data.url('panel-main.html'),
    contentScriptFile: [
        Data.url('js/weel.js'),
        Data.url('js/panel-main-content.js')
    ],
    contentScriptOptions: {
        prefs: conf.prefs
    },
    // contentScriptWhen: 'end',
    onShow: handleShow,
    onHide: handleHide
});

exports.self = panel;

panel.port.on('on_request', ( query ) => {
    return request.treat( panel, query );
});

panel.port.on('on_panel_layout_update', ( layout ) => {

    if ( layout.updater === 'mainButton' )
        layout.width = conf.prefs.main_panel_w.value;
    else if ( layout.updater === 's2s_mode_2' )
        layout.width = conf.prefs.float_panel_w.value;

    panel.resize( layout.width, layout.height );
});

panel.port.on('on_select_final', ( data ) => {
    switch ( data.s2s ) {
    case 1:
        show();
        break;
    case 2:
        panel.port.emit( 'on_select_s2s_2');
        show({
            position: {
                top: data.y,
                left: data.x
            }
        });
        break;
    case 3:
        show();
        break;
    }
});

exports.show = show;
function show( meta = {} ) {
    panel.show({
        height: meta.height || 1,
        width: meta.width || null,
        position: meta.position || mainButton
    });
}

function handleShow() {
    panel.port.emit( 'on_mainpanel_show' );
}

function handleHide() {
    mainButton.state('window', {
        checked: false
    });
}
