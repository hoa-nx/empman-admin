export class JsHelperService {

    //is object check
    public static isObject(obj) {
        return obj && (typeof obj === "object");
    }
    //is array check
    public static isArray(obj) {
        return this.isObject(obj) && (obj instanceof Array);
    }

    //https://stackoverflow.com/questions/27540809/using-stringify-for-nested-json-to-use-in-localstorage
    public static recursiveObjStr(obj, str) {
        str += "{";
        for (var inst in obj) {
            str += "\"" + inst + "\"" + ":";
            if (this.isArray(obj[inst])) {
                str += "[";
                for (var inst2 in obj[inst]) {
                    str += "\"" + obj[inst][inst2] + "\"" + ",";
                }
                str = str.substring(0, str.length - 1);
                str += "]";
            }
            else if (typeof (obj[inst]) == "object") {
                str = this.recursiveObjStr(obj[inst], str);
            }
            else if (typeof (obj[inst]) == "function") {
                str += obj[inst];
            }
            else {
                if (!(isNaN(obj[inst]))) {
                    str += obj[inst];
                }
                else if (typeof (obj[inst]) == "boolean") {
                    str += obj[inst];
                }
                else {
                    str += "\"" + obj[inst] + "\"";
                }
            }
            if (str[str.length - 1] !== ",") {
                str += ",";
            }
        }
        str = str.substring(0, str.length - 1);
        str += "},";
        return str;
    }

    
    //http://jsfiddle.net/5ZWvP/4/
    public static whitelistJson(obj, whitelist, separator) {
        var object = {};

        for (var i = 0, length = whitelist.length; i < length; ++i) {
            var k = 0,
                names = whitelist[i].split(separator || '.'),
                value = obj,
                name,
                count = names.length,
                ref = object,
                exists = true;

            while (k < count - 1) {
                name = names[k++];
                value = value[name];

                if (typeof value !== 'undefined') {
                    if (typeof object[name] === 'undefined') {
                        ref[name] = {};
                    }

                    ref = ref[name];
                }
                else {
                    exists = false;
                    break;
                }
            }

            if (exists) {
                ref[names[count - 1]] = value[names[count - 1]];
            }
        }

        return object;
    }

}