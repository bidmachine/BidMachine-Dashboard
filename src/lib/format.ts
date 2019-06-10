export function abbreviate(inValue, inMaxPlaces, inForcePlaces, inForceLetter) {
    const value = Number(inValue);
    const forceLetter = inForceLetter || false;
    if (forceLetter !== false) {
        return annotate(value, inMaxPlaces, inForcePlaces, forceLetter);
    }
    let abbr;
    if (value >= 1e12) { abbr = 'T'; } else if (value >= 1e9) { abbr = 'B'; } else if (value >= 1e6) { abbr = 'M'; } else if (value >= 1e3) { abbr = 'K'; } else { abbr = ''; }
    return annotate(value, inMaxPlaces, inForcePlaces, abbr);
}

function annotate(inValue, inMaxPlaces, inForcePlaces, inAbbr) {
    let rounded;
    switch (inAbbr) {
        case 'T':
            rounded = inValue / 1e12;
            break;
        case 'B':
            rounded = inValue / 1e9;
            break;
        case 'M':
            rounded = inValue / 1e6;
            break;
        case 'K':
            rounded = inValue / 1e3;
            break;
        case '':
            rounded = inValue;
            break;
    }
    if (inMaxPlaces !== false) {
        const test = new RegExp('\\.\\d{' + (inMaxPlaces + 1) + ',}$');
        if (test.test(('' + rounded))) {
            rounded = rounded.toFixed(inMaxPlaces);
        }
    }
    if (inForcePlaces !== false) {
        rounded = Number(rounded).toFixed(inForcePlaces);
    }
    return numberWithCommas(rounded + (inAbbr || ''));
}

export function numberWithCommas(nStr) {
    nStr += '';
    const x = nStr.split('.');
    let x1 = x[0];
    const x2 = x.length > 1 ? '.' + x[1] : '';
    const rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}
