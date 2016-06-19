;(function () {
    'use strict';

    let weel = function ( selector, context ) {
        return new weel.fn.init( selector, context );
    };

    weel.fn = weel.prototype = {
        constructor: weel,
        name: 'weel js',
        version: 'v0.0.1',
        author: 'wallen weel',
    };

    let css = weel.fn.css = function ( name, value ) {
        this[ 0 ].style[ name ] = value;

        return this;
    };

    let init = weel.fn.init = function ( selector, context ) {
        if ( ! selector ) return this;

        // If has '@' in the beginning, use original DOM
        let _original = /^\@{1,}/.test( selector );

        // Remove '@' form the string of selector
        selector = /[^\@]\S+/.exec( selector );

        // Custom execution context use in string, e.g. weel( '.item', '.container' )
        if ( context && typeof context === 'string' ) {
            // Clear '@' of context
            let _context = /[^\@]\S+/.exec( context );

            return weel( selector, weel( _context )[ 0 ] );
        }

        let _elem,
            _context = context || document;

        // Whether selector is id selector or not
        if ( /^\#{1,}/.test(selector) ) {
            // Remove '#' form the string of selector
            selector = /[^\#]\S+/.exec(selector)[0];

            this[ 0 ] = document.getElementById(selector);
        } else {
            // Here uses querySelectorAll with select element's DOM
            _elem = _context.querySelectorAll( selector );

            this[ 0 ] = _elem.length === 1 ? _elem[0] : _elem;
        }

        return _original ? this[0] : this;
    };

    /**
     * XMLHttpRequest
     * @return {Object} XHR Object
     */
    let initXHR = () => {
        let xhr;

        try {
            xhr = new XMLHttpRequest();
        } catch(err) {
            xhr = new ActiveXObject( 'Microsoft.XMLHTTP' );
        } finally {
            return xhr;
        }
    };

    let getJSON = weel.getJSON = ( url, callback, method = true ) => {
        let xhr = initXHR();

        xhr.open( 'GET', url, method );

        xhr.onreadystatechange = ( data ) => {

            if ( xhr.readyState === 4 && xhr.status === 200 ) {

                if ( typeof callback === 'function' ) {

                    callback( data );

                }
            }
        };

        xhr.send();
    };

    /**
     * Register
     * @type {[type]}
     */
    weel.fn.init.prototype = weel.fn;

    window.weel = weel;
}());
