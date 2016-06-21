const Prefs = require('sdk/simple-prefs');

/**
 * Preferences Register
 * @type {Object}
 */
const prefs = {
    changed: 0,
    main_panel_w: {
        name: 'mainPanelWidth',
        value: null
    },
    float_panel_w: {
        name: 'floatPanelWidth',
        value: null
    },
    api_id: {
        name: 'apiID',
        value: ''
    },
    api_key: {
        name: 'apiKey',
        value: ''
    },
    select_to_show: {
        name: 'select2show',
        value: ''
    }
};

Object.defineProperty(prefs, 'changed', {writable: true});

/**
 * Set Value of Preferences
 */
let _prefsValue = function () {
    for (let p in prefs) {
        if ( prefs.hasOwnProperty(p) ) {
            prefs[p].value = Prefs.prefs[prefs[p].name];
        }
    }

    prefs.changed = 1;
};

_prefsValue();

// Listen Preferences's Change
Prefs.on('', () => _prefsValue());


exports.prefs = prefs;


/**
 * Translation API
 * @type {Object}
 */
const API = {
    query: '', // Query keywords
    provider: 'youdao', // API provider
    /**
     * Get You Dao API URL
     * @param  {Object} cfg Config of the API
     * @return {String}     API URL
     */
    youdao: function (cfg = {}) {
        let arg = {
            url: cfg.url || 'http://fanyi.youdao.com/openapi.do',
            keyfrom: prefs.api_id.value || 'weel-translate',
            key: prefs.api_key.value || '554026358',
            data_type: cfg.data_type || 'json',
            version: cfg.version || '1.1'
        };

        let api = arg.url +
            '?keyfrom=' + arg.keyfrom +
            '&key=' + arg.key +
            '&type=data' +
            '&doctype=' + arg.data_type +
            '&version=' + arg.version +
            '&q=';

        return api;
    },
    /**
     * Generate API URL
     * @return {String} API URL
     */
    get_url: function ( query = '' ) {
        query = query || this.query;

        return this[this.provider]() + query;
    },
    /**
     * [get_formatting_data description]
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    get_formatting_data: function ( data ) {
        const r = {
            translation: '',
            explains: [],
            phonetic: {
                default: '',
                us: '',
                uk: ''
            },
            web: []
        };

        let server = this.provider;

        if ( server === 'youdao' ) {
            data = data.json;

            r.translation = data.translation;

            if ( ! data.basic ) return r;

            r.explains = data.basic.explains;
            r.phonetic.default = data.basic['phonetic'];
            r.phonetic.us = data.basic['us-phonetic'];
            r.phonetic.uk = data.basic['uk-phonetic'];

        } else if ( server === 'baidu' ) {
            // Maybe
        }

        return r;
    }
};

exports.api = API;

const UI = {
    float_action_icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAE3klEQVR4nO2ZW2wUZRTHfzN77bIobQmmTUFbIa2F8AKKtbQmRvtEoLXR1MSKlwR8MeHJBxEQNGpCVOKDl5gYXoxGo4VGTdNAg7pGN1wkhgoYQq2sboqlq2R3u7M7Fx8GSJPu7nx7kS+x83/c+ebs//vNmTNnziiJRMJiAUuVbUC2XACyDciWC0C2AdlyAcg2IFsuANkGZMsFINuAbLkAZBuQLReAbAOy5QKQbUC2XACyDcjWggfgreTkWNLk84s6kbjB+b8NpjMWKlAbUGiv89DV4GFLs5fl4fI4x9MWn17IEYkbnE0Y/DVrEfQqNIYUlodVOhs89DZ7uX1x+ddRKWcqHEua7DuR5fBEDsPhbK8Kvc0+9twdoCGkCMWfSlu8dFzj0ESOnFl8rarY8Xev99NUBuiSAYz8rvPsNxmSudK4hX0Kb3cF2XxH8aT7alLnue8yXM2WFn+RT+GtzgAPt/hKOq8kZO+PZ3ni6GzJmwdI5iyeGZvlg1+yBde8N57lyaOzJW8eIJWz2H4sw7vjhePnkzCAoQmdF6MaZgWfUSzghR81hn/T5x07NKGzK6pRyVcaC9gd1RiamB+/kIQAxJImOyKZisxdlwXsiGT4adq48dsfKavq8WNJh+JxTUIAXj6ZJVVG2hfS1axF/8jsDQivndIK3lZ+Fba1+xnZFGJyMMzkYJiRTSG2tfvxF3CfylnsPaEJeXEsgpeSJus+S1WU+oV0i1/hne4gT4/Nks1zwRpCCh/3hFhTl3+nZ2ZMHhtNE0/PN6cqcPKRRY6PYMcMGLqo/yebBzsTHj+Sf/N+laKbB1hTp/JJTwi/Z/4x07K9O8kRQCRuOC0R1vpleZwW0NY2f9HNX9fqOpWtrf68x0S8O/7D2UT1ADzY5KV1idiDp79FvEkttFbEu6ObK1r18j8S1/nwgRpqvM4d4dql4tmytj7/2isZZ+839WUoOmWwrEZhf0egqnFzFRQpRwD1AbH+XUQ5E8ZiOgOrfAysKt6y/jwtfuudTeR/5tcHnb07AmirFU9FEY3G7I3t7wgUrQdfCFRwp7V3CXh3BNDVUF0AYzGdnAk1XqVoPTh4Psv4jHM3Nz5jcvB8/v5/o4B3RwC9LV7U6t0FJDSL6JSdBa1L1IL1IGvAwGiaM0UgjM+YDIymyea5W1TF9u4kRwArwipbmiuam8zT6CU7ZXUTHl3p497b8l+peNqiZzjFzqjG6WmDtG6R1i1OTxvsjGo8NJzK2wUCbGn2skJgPiA0D4glTTqH0lV7H1h5q8qRzSECHgWfCt/+adA/kq7KyxDYs4Hv+0JCAxKhx2BTWOVAZ5Bq3AkK8FSbj0U+e/MA3Y0eBltLG2QUi3+gMyg8HRLuA/pavLyyIVBRPVCAfRsCbF/tnwfz9Y4g3Y2VFVwF2HtPgL4SusibNhJb7FN4w2FkpRnw/A8ZPvo1V1JssNP+zfsC9N9ZWiaVPRTde0Lj8ITzm6JHgd4WH7vWiQ8tv57UefWUxrkCDc5cqYpd8PasD9ycoehczR2Ln0vYY3EFuwNrq/Vwf6M9ti7HGMDxywZfTuqcvGxw4R+T6YyFT4Wl1+JvlDUW/z9pwX8ZcgHINiBbLgDZBmTLBSDbgGy5AGQbkC0XgGwDsuUCkG1AtlwAsg3IlgtAtgHZWvAA/gVNtNCoAQlFIwAAAABJRU5ErkJggg=='
};

exports.ui = UI;
