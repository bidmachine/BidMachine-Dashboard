export default {
    slice: (keys, search) => {
        let params = new URLSearchParams(search);
        return keys.reduce((result, key) => {
            let value = params.get(key);
            if (value) result[key] = value;
            return result
        }, {})
    },
    from: (object) => {
        let params = new URLSearchParams();
        Object.keys(object).forEach(key => params.append(key, object[key]));
        return params.toString()
    }
}
