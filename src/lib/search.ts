export default {
    slice: (keys, search) => {
        const params = new URLSearchParams(search);
        return keys.reduce((result, key) => {
            const value = params.get(key);
            if (value) { result[key] = value; }
            return result;
        }, {});
    },
    from: (object) => {
        const params = new URLSearchParams();
        Object.keys(object).forEach(key => params.append(key, object[key]));
        return params.toString();
    }
};
