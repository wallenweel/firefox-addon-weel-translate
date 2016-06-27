const tabs = require('sdk/tabs');
const Data = require('sdk/self').data;

const mainPanel = require('./panel-main.js');
const conf = require('./config.js');

tabs.open('file:///D:/Coding/frontend-study/dev/index.html');

let worker;

tabs.on('ready', ( tab ) => {
    tab.prefs = conf.prefs;

    worker = tab.attach({
        contentScriptFile: Data.url('js/tab-content.js'),
        contentScriptOptions: {
            s2s: tab.prefs.select_to_show.value,
            fab_icon: conf.ui.float_action_icon
        }
    });

    mainPanel.self.port.emit('on_tab_ready', tab);

    worker.port.on('on_select_nofab', ( data ) => {
        mainPanel.self.port.emit('on_text_select', data);
    });

    worker.port.on('on_fab_click', ( data ) => {
        mainPanel.self.port.emit('on_text_select', data);
    });
});
