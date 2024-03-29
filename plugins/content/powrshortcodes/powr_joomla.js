! function() {
    function c() {
        if ("http://localhost:3000" != a && "https://localhost:3000" != a && "http://10.0.2.2:3000" != a && "http://localhost:8888" != a && "samoanhighlandretreat.com" != location.host) return !1;
        for (var b = 0; b < arguments.length; b++) console.log(arguments[b])
    }

    function d(a, b, c) {
        a.addEventListener ? a.addEventListener(b, c, !1) : a.attachEvent && a.attachEvent("on" + b, c)
    }

    function e(a, b, d, e, f, g) {
        var h = a;
        c("Match:", a);
        var i = h.match(/powr-[^\s\]]*/i),
            j = h.match(/id="[^"]*"/i);
        null == j && (j = h.match(/id='[^']*'/i)), null == j && (j = h.match(/id=[^\]]*/i), null != j && (j = j[0].replace("id=", 'id="') + '"')), null == j && (j = h.match(/label="[^"]*"/i)), null == j && (j = h.match(/label='[^']*'/i)), null == j && (j = "");
        var k = '<div class="' + i + '" ' + j + "></div>";
        return c("Result is:" + k), k
    }

    function f(a) {
        var b = {},
            c = a.search("\\?");
        a = a.substr(c + 1);
        for (var d = a.split("&"), e = 0; e < d.length; e++) {
            var f = d[e].split("=");
            if ("undefined" == typeof b[f[0]]) b[f[0]] = f[1];
            else if ("string" == typeof b[f[0]]) {
                var g = [b[f[0]], f[1]];
                b[f[0]] = g
            } else b[f[0]].push(f[1])
        }
        return b
    }

    function g() {
        var a = navigator.userAgent.toLowerCase();
        return a.indexOf("msie") != -1 && parseInt(a.split("msie")[1])
    }

    function h(a) {
        for (var b = !1, c = a; c && c !== document; c = c.parentNode)
            if (void 0 != c.classList && c.classList.contains("powr-ignore")) {
                b = !0;
                break
            }
        return b
    }

    function i() {
        try {
            return window.top.location.href
        } catch (a) {
            return c("Couldn't get page url:", a), ""
        }
    }

    function j(a, b, d) {
        function e() {
            var e = {
                message: "loaded",
                data: {
                    iframe_index: b,
                    parent_window_width: window.innerWidth || document.documentElement.clientWidth || document.getElementsByTagName("body")[0].clientWidth,
                    parent_window_height: window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName("body")[0].clientHeight
                }
            };
            c("POWr.js sending load message to url" + d + "; iframe:", a), a.contentWindow.postMessage(JSON.stringify(e), d)
        }
        a.addEventListener ? a.addEventListener("load", e) : a.attachEvent("onload", e)
    }

    function k(a, b) {
        var d = new XMLHttpRequest;
        d.open("GET", b, !0), d.withCredentials = !0, d.onreadystatechange = function() {
            if (c("Async ready state change!", d), d.readyState == XMLHttpRequest.DONE || 4 == d.readyState)
                if (200 == d.status) {
                    c("POWr App Data:", d.responseText);
                    var b = JSON.parse(d.responseText);
                    b.iframe_index = a, POWR_RECEIVERS[a].data = b;
                    var e = setInterval(function() {
                        POWR_RECEIVERS[a].loaded && (POWR_RECEIVERS[a].receiver.postMessage(JSON.stringify({
                            message: "loadView",
                            data: b
                        }), POWR_RECEIVERS[a].url), clearInterval(e))
                    }, 10)
                } else c("Error receiving POWr App Data")
        }, d.send()
    }

    function l(a) {
        for (var b = window.getComputedStyle(a), c = a, d = b.backgroundColor;
            ("rgba(0, 0, 0, 0)" == d || "transparent" == d) && c.parentElement;) c = c.parentElement, d = window.getComputedStyle(c).backgroundColor;
        return "&color=" + encodeURIComponent(b.color) + "&backgroundColor=" + encodeURIComponent(d) + "&fontFamily=" + encodeURIComponent(b.fontFamily)
    }

    function m(a) {
        try {
            var b = JSON.parse(a.data);
            if ("viewLoaded" == b.message) {
                c("Settings received view loaded");
                var d = b.data.iframe_index;
                POWR_RECEIVERS[d].loaded = !0
            } else if ("updateSize" == b.message)
                if ("undefined" != typeof gadgets && "undefined" != typeof gadgets.window && "undefined" != typeof gadgets.window.adjustHeight) gadgets.window.adjustHeight(b.data.height);
                else {
                    var d = b.data.iframe_index,
                        e = document.querySelectorAll('[powrindex="' + d + '"]')[0];
                    if (e.height = b.data.height + "px", e.style.height = b.data.height + "px", void 0 != b.data.postCss)
                        for (var f in b.data.postCss) e.style[f] = b.data.postCss[f];
                    c("Updating size of el", e)
                }
            else if ("loadMe" == b.message) {
                c("Settings received loadMe request");
                var d = b.data.iframe_index;
                void 0 != POWR_RECEIVERS[d] && void 0 != POWR_RECEIVERS[d].data && POWR_RECEIVERS[d].receiver.postMessage(JSON.stringify({
                    message: "loadView",
                    data: POWR_RECEIVERS[d].data
                }), POWR_RECEIVERS[d].url)
            }
        } catch (a) {}
    }

    function q(a) {
        if (80 == a.keyCode && (p = !0, setTimeout(function() {
                p = !1
            }, 2e3)), 38 == a.keyCode && p) {
            for (var b = 0; b < POWR_RECEIVERS.length; b++) POWR_RECEIVERS[b].receiver.postMessage(JSON.stringify({
                message: "showEdit"
            }), POWR_RECEIVERS[b].url);
            return a.preventDefault(), !1
        }
        if (40 == a.keyCode && p) {
            for (var b = 0; b < POWR_RECEIVERS.length; b++) POWR_RECEIVERS[b].receiver.postMessage(JSON.stringify({
                message: "hideEdit"
            }), POWR_RECEIVERS[b].url);
            return a.preventDefault(), !1
        }
    }
    var a = "https://www.powr.io",
        b = "https://www.powr.io";
    if ("undefined" != typeof loadPowr) return void c("Powr already loaded");
    window.addEventListener ? window.addEventListener("message", m) : window.attachEvent("onmessage", m);
    var n = 0;
    POWR_RECEIVERS = [], loadPowr = function() {
        for (var o = null, p = null, q = null, r = !1, s = document.querySelectorAll("script"), t = 0; t < s.length; t++) {
            var u = s[t],
                v = u.getAttribute("src");
            if (void 0 != v) {
                var w = u.getAttribute("powr-token"),
                    x = u.getAttribute("external-type"),
                    y = u.getAttribute("template-powr-token"),
                    z = u.getAttribute("powr-load");
                if (void 0 == z && (z = "async"), g() && g() <= 9 && (z = "sync"), r = u.getAttribute("demo-mode"), void 0 != w ? o = w : v.search("powr-token") > -1 && (q = f(v), void 0 !== q["powr-token"] && q["powr-token"].length > 0 && (o = q["powr-token"])), void 0 != x ? p = x : v.search("external-type") > -1 && (q = f(v), void 0 != q["external-type"] && q["external-type"].length > 0 && (p = q["external-type"])), void 0 != o || void 0 != p) break
            }
        }
        if (null == o || 0 == o.length) try {
            o = window.top.location.host
        } catch (a) {
            o = ""
        }
        var A = !0;
        if (A) {
            for (var B = /\[powr-[^\]]*\]/gi, C = /\[powr-[^\s\]]*/gi, D = document.querySelectorAll("a"), t = 0; t < D.length; t++) {
                var E = D[t];
                if (!h(E)) {
                    var F = E.previousSibling,
                        G = E.nextSibling;
                    if (F && G && E.getAttribute("href") && E.getAttribute("href").search("tel") > -1 && 3 == F.nodeType && 3 == G.nodeType && F.nodeValue.match(C) && G.nodeValue.search("]") > -1) {
                        var H = E.innerHTML,
                            I = F.nodeValue.match(/powr-[^\s\]]*/gi)[0],
                            J = document.createElement("div");
                        J.innerHTML = '<div class="' + I + '" label="' + H + '"></div>', F.parentNode.removeChild(F), G.parentNode.removeChild(G), E.parentNode.replaceChild(J, E)
                    }
                }
            }
            for (var D = document.querySelectorAll("body, body *"), t = 0; t < D.length; t++) {
                var E = D[t],
                    K = E.childNodes;
                if (!h(E))
                    for (var L = 0; L < K.length; L++) {
                        var M = K[L];
                        if (3 == M.nodeType) {
                            var N = M.nodeValue,
                                O = N.replace(B, e);
                            if (O != N) {
                                var J = document.createElement("div");
                                J.innerHTML = O, E.replaceChild(J, M)
                            }
                        }
                    }
            }
        }
        if (0 == document.querySelectorAll("#powrIframeLoader").length) {
            var P = document.createElement("div"),
                Q = document.getElementsByTagName("base")[0] || document.getElementsByTagName("script")[0];
            P.id = "powrIframeLoader", P.innerHTML = "&shy;<style> .powrLoaded iframe { visibility: hidden; } </style>", Q.parentNode.insertBefore(P, Q)
        }
        for (var R = document.querySelectorAll("[class*=powr-]"), S = !1, t = 0; t < R.length; t++) {
            var T = R[t];
            if (!(h(T) || T.className.search("powrLoaded") > -1)) {
                for (var U = T.className.split(/\s+/), t = 0; t < U.length; t++)
                    if (0 === U[t].toLowerCase().search("powr-")) {
                        var V = U[t].toLowerCase().replace("powr-", "");
                        break
                    }
                if ("undefined" == typeof V) return;
                "popup" == V && (S = !0);
                var W = T.getAttribute("label");
                if (void 0 == W && (W = ""), "weebly_" != W) {
                    T.className += " powrLoaded", void 0 == y && (y = "");
                    var X = T.getAttribute("id");
                    void 0 == X && (X = "");
                    var Y = T.getAttribute("view-mode"),
                        Z = "true" == r || "true" == T.getAttribute("demo-mode"),
                        $ = a + "/plugins/" + V + "/cached_view?load=" + z + "&index=" + n + "&unique_label=" + X + "&powr_token=" + o + "&user_label=" + encodeURIComponent(W) + "&demo_mode=" + Z,
                        _ = b + "/plugins/" + V + "/view.json?unique_label=" + X + "&powr_token=" + o + "&user_label=" + encodeURIComponent(W) + "&demo_mode=" + Z;
                    void 0 != p && (_ += "&external_type=" + p, $ += "&external_type=" + p), void 0 != y && (_ += "&template_powr_token=" + y, $ += "&template_powr_token=" + y), void 0 != Y && (_ += "&view_mode=" + Y, $ += "&view_mode=" + Y), c("page url IS " + i()), i() && (_ += "&url=" + encodeURIComponent(i())), _ += "&request_url=" + encodeURIComponent(document.location.protocol + "//" + document.location.host), $ += l(T);
                    var aa = document.createElement("iframe");
                    aa.src = $, aa.setAttribute("powrindex", n), aa.width = "100%", aa.height = "100%", aa.frameBorder = "0", aa.style.visibility = "visible", aa.setAttribute("webkitallowfullscreen", ""), aa.setAttribute("mozallowfullscreen", ""), aa.setAttribute("allowfullscreen", "");
                    try {
                        /iPhone|iPod|iPad/.test(navigator.userAgent) && (aa.style.minWidth = "100%", aa.style.width = "1px", aa.setAttribute("scrolling", "no"))
                    } catch (a) {
                        console.log("Err: " + a)
                    }
                    j(aa, n, $), T.appendChild(aa);
                    var ba = aa.contentWindow;
                    POWR_RECEIVERS.push({
                        receiver: ba,
                        url: $
                    }), "async" == z && k(n, _), n++
                }
            }
        }
        S && (d(document, "click", function(a) {
            var a = a ? a : window.event,
                b = a.relatedTarget || a.toElement || a.target;
            if (b && b.classList.contains("trigger-popup"))
                for (var c = 0; c < POWR_RECEIVERS.length; c++) POWR_RECEIVERS[c].receiver.postMessage(JSON.stringify({
                    message: "triggerPowrPopupClick"
                }), POWR_RECEIVERS[c].url)
        }), d(document, "mouseout", function(a) {
            var a = a ? a : window.event;
            if (a.clientY < 5)
                for (var b = 0; b < POWR_RECEIVERS.length; b++) POWR_RECEIVERS[b].receiver.postMessage(JSON.stringify({
                    message: "exitDocument"
                }), POWR_RECEIVERS[b].url)
        }))
    };
    for (var o = 0; o < 10; o++) setTimeout(function() {
        loadPowr()
    }, 2e3 * o);
    d(window, "load", loadPowr);
    var p = !1;
    d(window, "keydown", q)
}();