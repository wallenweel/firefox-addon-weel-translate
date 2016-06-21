const toggleButton = require('sdk/ui').ToggleButton;
const selection = require('sdk/selection');

const mainPanel = require('./panel-main.js');
const conf = require('./config.js');

const button = toggleButton({
    id: "weel-translate",
    label: "weel translation",
    icon: {
        "16": "./images/icon-16.png",
        "32": "./images/icon-32.png",
        "64": "./images/icon-64.png"
    },
    onClick: handleClick
});

function handleClick( state ) {
    if ( state.checked ) {
        mainPanel.self.port.emit( 'on_mainbutton_click', selection.text );

        mainPanel.show();
    }
}

exports.self = button;
