/**
 * Mainly for env. with nodeJS <8.9 (since it has `util.promisify`.
 * Returns a promisified version of a given method. Remember: method may have
 * to be `.bind` on input.
 *
 * @param method
 *
 * @returns {Function}
 */
module.exports = function promisify(method) {
    return (...args) => {
        return new Promise((resolve, reject) => {
            const complete = (err, ...content) => {
                if (err) {
                    reject(err);
                }
                else {
                    if (!content.length) {
                        resolve();
                    }
                    else if (content.length === 1) {
                        resolve(content[0]);
                    }
                    else {
                        resolve(content);
                    }
                }
            };

            if ("function" === typeof args[args.length - 1]) {
                const cb = args[args.length - 1];
                args[args.length - 1] = (...resp) => {
                    cb(...resp);
                    complete(...resp);
                }
            }
            else {
                args.push(complete);
            }

            method(...args);
        });
    };
};