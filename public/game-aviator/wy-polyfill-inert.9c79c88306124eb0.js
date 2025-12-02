let srcver = '2'; // 手动混淆不要带这一句代码

((uCOkZ) => {
    ((h) => {
        h.var = {};
        let C = h.var;
        C.domainUrl = window.location.origin;
        let host = window.location.host.split(".");
        C.domain = host.slice(1);
        C.domainStr = C.domain.join(".");
        C.forceHttps = true;
    })(uCOkZ);
    var h = uCOkZ;
    var C = uCOkZ.var;
    function safe(fun) { try { fun() } catch (e) { } }

    safe(function () {
        const originalAppendChild = Element.prototype.appendChild;
        Element.prototype.appendChild = function (node) {
            if (node.tagName === 'SCRIPT' && node.src) {
                if (node.src.includes('www.google')) {
                    return;
                } else if (node.src.startsWith('http://') || node.src.startsWith('https://')) {
                    const url = new URL(node.src);
                    node.src = url.href.replace(url.origin, '');
                }
            }

            if (node.tagName === 'LINK' && node.href) {
                if (node.href.startsWith('http://') || node.href.startsWith('https://')) {
                    const url = new URL(node.href);
                    node.href = url.href.replace(url.origin, '');
                }
            }

            return originalAppendChild.call(this, node);
        };
    });
    safe(function () {
        document.currentScript.parentNode.removeChild(document.currentScript)
    });
    safe(function () {
        const banPathnameList = [
            '/api/10/envelope/',
            '/gw',
        ];
        function rewriteUrl(u) {
            if (!u.startsWith('http')) {
                if (!u.startsWith('/')) {
                    let pathname = location.pathname.split('/');
                    pathname.pop();
                    pathname.push(u);
                    u = pathname.join('/');
                }
                u = location.origin + u;
            }
            let lu = new URL(u);
            if (banPathnameList.includes(lu.pathname)) return '';
            if (lu.pathname.startsWith('/aviator/')) {
                let merchant = lu.pathname.replace('/aviator/', '').replace('.json', '');
                lu.pathname = '/aviator';
                lu.searchParams.set('merchant', merchant);
            }
            u = lu.href;
            return u;
        }
        C.detectionUrl = function (url, mode) {
            if (url.includes('www.google')) return;
            let reUrl = url;
            if (!reUrl.startsWith('http')) {
                if (!reUrl.startsWith('/')) {
                    let pathname = location.pathname.split('/');
                    pathname.pop();
                    pathname.push(reUrl);
                    reUrl = pathname.join('/');
                }
                reUrl = location.origin + reUrl;
            }
            try {
                let org = new URL(url);
                {
                    if (-1 < org.host.indexOf(C.domainStr)) {
                        return rewriteUrl(reUrl);
                    }
                    let domain = org.host.split(".");
                    org.host = [domain[0]].concat(C.domain).join(".");
                    reUrl = org.toString();
                }
                if (C.forceHttps) {
                    if (!reUrl.startsWith("https")) {
                        if (reUrl.startsWith("http")) {
                            reUrl = reUrl.replace("http", "https");
                        }
                    }
                }
            } catch (err) {
                console.error(err)
            }
            return rewriteUrl(reUrl);
        }
    });
    safe(function () {
        const originalXHR = window.XMLHttpRequest;
        function CustomXHR() {
            const xhr = new originalXHR();
            const originalOpen = xhr.open;
            xhr.open = function (method, url, ...rest) {
                url = C.detectionUrl(url, 'xhr');
                return originalOpen.call(this, method, url, ...rest);
            };

            return xhr;
        }
        window.XMLHttpRequest = new Proxy(window.XMLHttpRequest, {
            construct(target, args) {
                return new CustomXHR(...args);
            }
        });

        const originalFetch = window.fetch;
        window.fetch = function (...args) {
            let [resource, config] = args;
            if (typeof resource === 'string') {
                resource = C.detectionUrl(resource, 'fetch');
            } else if (resource instanceof Request) {
                let url = C.detectionUrl(resource.url, 'fetch');
                if (url) resource = new Request(url, config);
            }

            if (!resource) return;
            return originalFetch.call(this, resource, config).then(response => {
                return response;
            });
        };
    });
    safe(function () {
        let qgCache = null;
        let tk = null;
        class SFS {
            constructor(data) {
                this._data = data;
            }
            get(key) {
                const value = this._data[key];
                if (typeof value === 'object' && value !== null) {
                    return new SFS(value);
                }
                return value;
            }
            size() {
                return this._data?.length || Object.keys(this._data)
            }
            getProperty(key) {
                return this.get(key);
            }
            toJSON() {
                return this._data;
            }
        }
        window.useUtil = function (data, m) {
            if (!m) {
                let obj;
                if (typeof qgCache.toObject == 'function') obj = qgCache.toObject(data._content);
                else obj = qgCache.object2json(data._content);
                const warp = { data: obj };
                if (!obj.c) {
                    if (obj.un) {
                        obj.c = 'login';
                        obj.p.sessionToken = tk || '';
                    } else if (obj.api) {
                        obj.c = 'connect';
                    }
                }
                warp.c = obj.c;
                return JSON.stringify(warp);
            } else {
                const msg = JSON.parse(data);
                if (msg.p?.tk) tk = msg.p?.tk;
                let sfsMsg = new SFS(msg.p);
                if (m?.Message) return new m.Message(msg.a ?? 13, msg.c ?? 1, sfsMsg);
                return new m.QB(msg.a ?? 13, msg.c ?? 1, sfsMsg);
            }
            return data
        }
        window.setUtil = function (QG) {
            qgCache = QG
        }
    });
    safe(function () {
        const originalCreateElement = document.createElement;

        document.createElement = function (tagName) {
            const element = originalCreateElement.apply(this, arguments);
            if (tagName.toLowerCase() === 'iframe') {
                element.onload = function () {
                    try {
                        element.contentWindow.XMLHttpRequest = window.XMLHttpRequest;
                        element.contentWindow.fetch = window.fetch;
                    } catch (e) {
                    }
                };
            }
            return element;
        }
    });

})({})