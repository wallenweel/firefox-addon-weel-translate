const selection = {
    text: '',
    x: '',
    y: '',
    state: 0,
    fab_state: 0,
    s2s: self.options.s2s
};

// Float Action Button
let fab, select2translate;

if ( selection.s2s !== 3 && selection.s2s !== 0 )
    select2translate = () => {
        self.port.emit( 'on_select_nofab', selection );
    };
else if ( selection.s2s === 3 )
    fab = createFAB();


// Listen Events to Response Data
window.addEventListener('mouseup', handleSelect, true);

// iframe elements compatibility
// let iframes = document.querySelectorAll('iframe');

// if ( iframes ) {
//     for ( let i = 0; i < iframes.length; i++ ) {
//         iframes[i].contentWindow.addEventListener('mouseup', handleSelect, true);
//     }
// }

function handleSelect( ev ) {
    // Get Selection Text
    selection.text = this.getSelection().toString();

    // Check Whether Text was selected
    if ( ! selection.text || selection.state ) {
        // Click Blank to Restore FAB
        if ( selection.state ) {
            handleAfterSelect(null, () => {
                fabHide.call( fab );
            });
        };

        return selection;
    }

    if ( selection.s2s !== 0 && selection.s2s !== 1 ) {
        selection.y = ev.clientY;
        selection.x = ev.clientX;

        // let iframe = ev.view.frameElement;
        //
        // if ( iframe ) {
        //     selection.y = iframe.offsetTop + ev.clientY;
        //     selection.x = iframe.offsetLeft + ev.clientX;
        // }
    }

    if ( select2translate ) select2translate( ev );

    // Trigger FAB
    if ( fab ) fabShow( ev );

    // Mark State as Flag
    selection.state = 1;
}

/**
 * Treatment after Selected
 * @param  {Object}   data     Some data
 * @param  {Function} callback
 * @return {Function}          Callback
 */
function handleAfterSelect( data = '', callback ) {
    window.getSelection().removeAllRanges();

    // if ( iframes ) {
    //     for ( let i = 0; i < iframes.length; i++ ) {
    //         iframes[i].contentWindow.getSelection().removeAllRanges();
    //     }
    // }

    selection.state = 0;

    return callback();
}

/**
 * [createFAB description]
 * @return {[type]} [description]
 */
function createFAB() {
    if ( ! document.body ) return;

    // FAB's Styles
    const fab_style = {
        backgroundColor: 'transparent',
        border: '1px solid #cadce7',
        borderRadius: '5px',
        boxShadow: '0 1px 2px hsla(0, 0%, 0%, .225)',
        backgroundImage: 'url(' + self.options.fab_icon + ')',
        backgroundSize: 'cover',
        transition: 'visibility .25s, opacity .25s',
        opacity: 0,
        visibility: 'hidden',
        height: '24px',
        width: '24px',
        position: 'fixed',
        zIndex: 2048,
        left: 0,
        top: 0
    };

    // Create FAB
    let fab = document.createElement('WeeLTranslateFAB');

    fab.className = 'wl__translate-fab';

    for ( let s in fab_style ) {
        if ( fab_style.hasOwnProperty( s ) ) {
            fab.style[s] = fab_style[s];
        }
    }

    document.body.appendChild( fab );

    fab.addEventListener('mousedown', handleFAB, false);

    return fab;
}

/**
 * [handleFAB description]
 * @param  {Object} ev Events
 */
function handleFAB( ev ) {
    self.port.emit('on_fab_click', selection);

    handleAfterSelect(null, () => {
        fabHide.call( this );
    });
}

/**
 * Handle FAB Showing
 */
function fabShow() {
    let style = {
        visibility: 'visible',
        opacity: 1,
        top: selection.y + 'px',
        left: selection.x + 'px'
    };

    for ( let s in style ) {
        if ( style.hasOwnProperty( s ) ) {
            fab.style[s] = style[s];
        }
    }
}

/**
 * Handle FAB Hidding
 */
function fabHide() {
    let style = {
        visibility: 'hidden',
        opacity: 0
    };

    for ( let s in style ) {
        if ( style.hasOwnProperty( s ) ) {
            this.style[s] = style[s];
        }
    }
}
