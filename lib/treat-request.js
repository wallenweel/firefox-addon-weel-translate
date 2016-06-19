const Request = require("sdk/request").Request;
const conf = require('./configure.js');

exports.treat = treatRequest;

/**
 * Treat Request to Getting Clear Data
 * @param  {Object} obj   Entry Addon Component
 * @param  {String} query Query Keywors
 */
/**
 * Treat Request to Getting Clear Data
 * @param  {Object} obj   Entry Addon Component
 * @param  {String} query Query Keywors
 * @return {String}       API's URL
 */
function treatRequest( obj, query ) {
    let url, json;

    conf.api.query = query;
    url = conf.api.get_url();

    getRequest( url, ( response ) => {
        if ( ! response && ! typeof response === 'object' ) return 0;

        json = conf.api.get_formatting_data( response );

        obj.port.emit('on_request_final', json);
    } );

    return url;
}

/**
 * SDK's XHR with GET Methon
 * @param  {String}   url      API's URL
 * @param  {Function} callback [description]
 */
function getRequest( url, callback ) {
    return Request( {
        url: url,
        onComplete: callback
    } ).get();
}
