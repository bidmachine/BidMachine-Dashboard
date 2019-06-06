export function abbreviate(inValue, inMaxPlaces, inForcePlaces, inForceLetter) {
    let number = Number(inValue);
    let forceLetter = inForceLetter || false;
    if (forceLetter !== false) {
        return annotate(number, inMaxPlaces, inForcePlaces, forceLetter)
    }
    let abbr = undefined;
    if (number >= 1e12) abbr = 'T';
    else if (number >= 1e9) abbr = 'B';
    else if (number >= 1e6) abbr = 'M';
    else if (number >= 1e3) abbr = 'K';
    else abbr = '';
    return annotate(number, inMaxPlaces, inForcePlaces, abbr)
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
            break
    }
    if (inMaxPlaces !== false) {
        let test = new RegExp('\\.\\d{' + (inMaxPlaces + 1) + ',}$');
        if (test.test(('' + rounded))) {
            rounded = rounded.toFixed(inMaxPlaces)
        }
    }
    if (inForcePlaces !== false) {
        rounded = Number(rounded).toFixed(inForcePlaces)
    }
    return numberWithCommas(rounded + (inAbbr || ''))
}

export function numberWithCommas(nStr) {
    nStr += '';
    let x = nStr.split('.');
    let x1 = x[0];
    let x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}
