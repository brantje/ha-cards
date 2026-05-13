/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const W = globalThis, Lt = W.ShadowRoot && (W.ShadyCSS === void 0 || W.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Dt = Symbol(), Ut = /* @__PURE__ */ new WeakMap();
let re = class {
  constructor(t, e, i) {
    if (this._$cssResult$ = !0, i !== Dt) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (Lt && t === void 0) {
      const i = e !== void 0 && e.length === 1;
      i && (t = Ut.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && Ut.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const me = (o) => new re(typeof o == "string" ? o : o + "", void 0, Dt), y = (o, ...t) => {
  const e = o.length === 1 ? o[0] : t.reduce((i, s, a) => i + ((r) => {
    if (r._$cssResult$ === !0) return r.cssText;
    if (typeof r == "number") return r;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + r + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + o[a + 1], o[0]);
  return new re(e, o, Dt);
}, fe = (o, t) => {
  if (Lt) o.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const i = document.createElement("style"), s = W.litNonce;
    s !== void 0 && i.setAttribute("nonce", s), i.textContent = e.cssText, o.appendChild(i);
  }
}, Ht = Lt ? (o) => o : (o) => o instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const i of t.cssRules) e += i.cssText;
  return me(e);
})(o) : o;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: be, defineProperty: ve, getOwnPropertyDescriptor: _e, getOwnPropertyNames: ye, getOwnPropertySymbols: $e, getPrototypeOf: we } = Object, v = globalThis, Mt = v.trustedTypes, xe = Mt ? Mt.emptyScript : "", it = v.reactiveElementPolyfillSupport, N = (o, t) => o, yt = { toAttribute(o, t) {
  switch (t) {
    case Boolean:
      o = o ? xe : null;
      break;
    case Object:
    case Array:
      o = o == null ? o : JSON.stringify(o);
  }
  return o;
}, fromAttribute(o, t) {
  let e = o;
  switch (t) {
    case Boolean:
      e = o !== null;
      break;
    case Number:
      e = o === null ? null : Number(o);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(o);
      } catch {
        e = null;
      }
  }
  return e;
} }, ne = (o, t) => !be(o, t), Rt = { attribute: !0, type: String, converter: yt, reflect: !1, useDefault: !1, hasChanged: ne };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), v.litPropertyMetadata ?? (v.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let k = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = Rt) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const i = Symbol(), s = this.getPropertyDescriptor(t, i, e);
      s !== void 0 && ve(this.prototype, t, s);
    }
  }
  static getPropertyDescriptor(t, e, i) {
    const { get: s, set: a } = _e(this.prototype, t) ?? { get() {
      return this[e];
    }, set(r) {
      this[e] = r;
    } };
    return { get: s, set(r) {
      const n = s == null ? void 0 : s.call(this);
      a == null || a.call(this, r), this.requestUpdate(t, n, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? Rt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(N("elementProperties"))) return;
    const t = we(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(N("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(N("properties"))) {
      const e = this.properties, i = [...ye(e), ...$e(e)];
      for (const s of i) this.createProperty(s, e[s]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [i, s] of e) this.elementProperties.set(i, s);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, i] of this.elementProperties) {
      const s = this._$Eu(e, i);
      s !== void 0 && this._$Eh.set(s, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const i = new Set(t.flat(1 / 0).reverse());
      for (const s of i) e.unshift(Ht(s));
    } else t !== void 0 && e.push(Ht(t));
    return e;
  }
  static _$Eu(t, e) {
    const i = e.attribute;
    return i === !1 ? void 0 : typeof i == "string" ? i : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var t;
    this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (t = this.constructor.l) == null || t.forEach((e) => e(this));
  }
  addController(t) {
    var e;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(t), this.renderRoot !== void 0 && this.isConnected && ((e = t.hostConnected) == null || e.call(t));
  }
  removeController(t) {
    var e;
    (e = this._$EO) == null || e.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), e = this.constructor.elementProperties;
    for (const i of e.keys()) this.hasOwnProperty(i) && (t.set(i, this[i]), delete this[i]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return fe(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    var t;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (t = this._$EO) == null || t.forEach((e) => {
      var i;
      return (i = e.hostConnected) == null ? void 0 : i.call(e);
    });
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    var t;
    (t = this._$EO) == null || t.forEach((e) => {
      var i;
      return (i = e.hostDisconnected) == null ? void 0 : i.call(e);
    });
  }
  attributeChangedCallback(t, e, i) {
    this._$AK(t, i);
  }
  _$ET(t, e) {
    var a;
    const i = this.constructor.elementProperties.get(t), s = this.constructor._$Eu(t, i);
    if (s !== void 0 && i.reflect === !0) {
      const r = (((a = i.converter) == null ? void 0 : a.toAttribute) !== void 0 ? i.converter : yt).toAttribute(e, i.type);
      this._$Em = t, r == null ? this.removeAttribute(s) : this.setAttribute(s, r), this._$Em = null;
    }
  }
  _$AK(t, e) {
    var a, r;
    const i = this.constructor, s = i._$Eh.get(t);
    if (s !== void 0 && this._$Em !== s) {
      const n = i.getPropertyOptions(s), c = typeof n.converter == "function" ? { fromAttribute: n.converter } : ((a = n.converter) == null ? void 0 : a.fromAttribute) !== void 0 ? n.converter : yt;
      this._$Em = s;
      const h = c.fromAttribute(e, n.type);
      this[s] = h ?? ((r = this._$Ej) == null ? void 0 : r.get(s)) ?? h, this._$Em = null;
    }
  }
  requestUpdate(t, e, i, s = !1, a) {
    var r;
    if (t !== void 0) {
      const n = this.constructor;
      if (s === !1 && (a = this[t]), i ?? (i = n.getPropertyOptions(t)), !((i.hasChanged ?? ne)(a, e) || i.useDefault && i.reflect && a === ((r = this._$Ej) == null ? void 0 : r.get(t)) && !this.hasAttribute(n._$Eu(t, i)))) return;
      this.C(t, e, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: i, reflect: s, wrapped: a }, r) {
    i && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, r ?? e ?? this[t]), a !== !0 || r !== void 0) || (this._$AL.has(t) || (this.hasUpdated || i || (e = void 0), this._$AL.set(t, e)), s === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (e) {
      Promise.reject(e);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var i;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [a, r] of this._$Ep) this[a] = r;
        this._$Ep = void 0;
      }
      const s = this.constructor.elementProperties;
      if (s.size > 0) for (const [a, r] of s) {
        const { wrapped: n } = r, c = this[a];
        n !== !0 || this._$AL.has(a) || c === void 0 || this.C(a, void 0, r, c);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), (i = this._$EO) == null || i.forEach((s) => {
        var a;
        return (a = s.hostUpdate) == null ? void 0 : a.call(s);
      }), this.update(e)) : this._$EM();
    } catch (s) {
      throw t = !1, this._$EM(), s;
    }
    t && this._$AE(e);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    var e;
    (e = this._$EO) == null || e.forEach((i) => {
      var s;
      return (s = i.hostUpdated) == null ? void 0 : s.call(i);
    }), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Eq && (this._$Eq = this._$Eq.forEach((e) => this._$ET(e, this[e]))), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
k.elementStyles = [], k.shadowRootOptions = { mode: "open" }, k[N("elementProperties")] = /* @__PURE__ */ new Map(), k[N("finalized")] = /* @__PURE__ */ new Map(), it == null || it({ ReactiveElement: k }), (v.reactiveElementVersions ?? (v.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const O = globalThis, zt = (o) => o, J = O.trustedTypes, Pt = J ? J.createPolicy("lit-html", { createHTML: (o) => o }) : void 0, ce = "$lit$", b = `lit$${Math.random().toFixed(9).slice(2)}$`, le = "?" + b, Ce = `<${le}>`, T = document, V = () => T.createComment(""), U = (o) => o === null || typeof o != "object" && typeof o != "function", It = Array.isArray, Se = (o) => It(o) || typeof (o == null ? void 0 : o[Symbol.iterator]) == "function", st = `[ 	
\f\r]`, I = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Ft = /-->/g, jt = />/g, $ = RegExp(`>|${st}(?:([^\\s"'>=/]+)(${st}*=${st}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Bt = /'/g, Wt = /"/g, he = /^(?:script|style|textarea|title)$/i, Ae = (o) => (t, ...e) => ({ _$litType$: o, strings: t, values: e }), l = Ae(1), E = Symbol.for("lit-noChange"), p = Symbol.for("lit-nothing"), qt = /* @__PURE__ */ new WeakMap(), w = T.createTreeWalker(T, 129);
function de(o, t) {
  if (!It(o) || !o.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Pt !== void 0 ? Pt.createHTML(t) : t;
}
const Te = (o, t) => {
  const e = o.length - 1, i = [];
  let s, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", r = I;
  for (let n = 0; n < e; n++) {
    const c = o[n];
    let h, d, u = -1, g = 0;
    for (; g < c.length && (r.lastIndex = g, d = r.exec(c), d !== null); ) g = r.lastIndex, r === I ? d[1] === "!--" ? r = Ft : d[1] !== void 0 ? r = jt : d[2] !== void 0 ? (he.test(d[2]) && (s = RegExp("</" + d[2], "g")), r = $) : d[3] !== void 0 && (r = $) : r === $ ? d[0] === ">" ? (r = s ?? I, u = -1) : d[1] === void 0 ? u = -2 : (u = r.lastIndex - d[2].length, h = d[1], r = d[3] === void 0 ? $ : d[3] === '"' ? Wt : Bt) : r === Wt || r === Bt ? r = $ : r === Ft || r === jt ? r = I : (r = $, s = void 0);
    const m = r === $ && o[n + 1].startsWith("/>") ? " " : "";
    a += r === I ? c + Ce : u >= 0 ? (i.push(h), c.slice(0, u) + ce + c.slice(u) + b + m) : c + b + (u === -2 ? n : m);
  }
  return [de(o, a + (o[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), i];
};
class H {
  constructor({ strings: t, _$litType$: e }, i) {
    let s;
    this.parts = [];
    let a = 0, r = 0;
    const n = t.length - 1, c = this.parts, [h, d] = Te(t, e);
    if (this.el = H.createElement(h, i), w.currentNode = this.el.content, e === 2 || e === 3) {
      const u = this.el.content.firstChild;
      u.replaceWith(...u.childNodes);
    }
    for (; (s = w.nextNode()) !== null && c.length < n; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const u of s.getAttributeNames()) if (u.endsWith(ce)) {
          const g = d[r++], m = s.getAttribute(u).split(b), z = /([.?@])?(.*)/.exec(g);
          c.push({ type: 1, index: a, name: z[2], strings: m, ctor: z[1] === "." ? ke : z[1] === "?" ? Le : z[1] === "@" ? De : et }), s.removeAttribute(u);
        } else u.startsWith(b) && (c.push({ type: 6, index: a }), s.removeAttribute(u));
        if (he.test(s.tagName)) {
          const u = s.textContent.split(b), g = u.length - 1;
          if (g > 0) {
            s.textContent = J ? J.emptyScript : "";
            for (let m = 0; m < g; m++) s.append(u[m], V()), w.nextNode(), c.push({ type: 2, index: ++a });
            s.append(u[g], V());
          }
        }
      } else if (s.nodeType === 8) if (s.data === le) c.push({ type: 2, index: a });
      else {
        let u = -1;
        for (; (u = s.data.indexOf(b, u + 1)) !== -1; ) c.push({ type: 7, index: a }), u += b.length - 1;
      }
      a++;
    }
  }
  static createElement(t, e) {
    const i = T.createElement("template");
    return i.innerHTML = t, i;
  }
}
function L(o, t, e = o, i) {
  var r, n;
  if (t === E) return t;
  let s = i !== void 0 ? (r = e._$Co) == null ? void 0 : r[i] : e._$Cl;
  const a = U(t) ? void 0 : t._$litDirective$;
  return (s == null ? void 0 : s.constructor) !== a && ((n = s == null ? void 0 : s._$AO) == null || n.call(s, !1), a === void 0 ? s = void 0 : (s = new a(o), s._$AT(o, e, i)), i !== void 0 ? (e._$Co ?? (e._$Co = []))[i] = s : e._$Cl = s), s !== void 0 && (t = L(o, s._$AS(o, t.values), s, i)), t;
}
class Ee {
  constructor(t, e) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = e;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: e }, parts: i } = this._$AD, s = ((t == null ? void 0 : t.creationScope) ?? T).importNode(e, !0);
    w.currentNode = s;
    let a = w.nextNode(), r = 0, n = 0, c = i[0];
    for (; c !== void 0; ) {
      if (r === c.index) {
        let h;
        c.type === 2 ? h = new R(a, a.nextSibling, this, t) : c.type === 1 ? h = new c.ctor(a, c.name, c.strings, this, t) : c.type === 6 && (h = new Ie(a, this, t)), this._$AV.push(h), c = i[++n];
      }
      r !== (c == null ? void 0 : c.index) && (a = w.nextNode(), r++);
    }
    return w.currentNode = T, s;
  }
  p(t) {
    let e = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(t, i, e), e += i.strings.length - 2) : i._$AI(t[e])), e++;
  }
}
class R {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, e, i, s) {
    this.type = 2, this._$AH = p, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = i, this.options = s, this._$Cv = (s == null ? void 0 : s.isConnected) ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const e = this._$AM;
    return e !== void 0 && (t == null ? void 0 : t.nodeType) === 11 && (t = e.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, e = this) {
    t = L(this, t, e), U(t) ? t === p || t == null || t === "" ? (this._$AH !== p && this._$AR(), this._$AH = p) : t !== this._$AH && t !== E && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Se(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== p && U(this._$AH) ? this._$AA.nextSibling.data = t : this.T(T.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var a;
    const { values: e, _$litType$: i } = t, s = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = H.createElement(de(i.h, i.h[0]), this.options)), i);
    if (((a = this._$AH) == null ? void 0 : a._$AD) === s) this._$AH.p(e);
    else {
      const r = new Ee(s, this), n = r.u(this.options);
      r.p(e), this.T(n), this._$AH = r;
    }
  }
  _$AC(t) {
    let e = qt.get(t.strings);
    return e === void 0 && qt.set(t.strings, e = new H(t)), e;
  }
  k(t) {
    It(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let i, s = 0;
    for (const a of t) s === e.length ? e.push(i = new R(this.O(V()), this.O(V()), this, this.options)) : i = e[s], i._$AI(a), s++;
    s < e.length && (this._$AR(i && i._$AB.nextSibling, s), e.length = s);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    var i;
    for ((i = this._$AP) == null ? void 0 : i.call(this, !1, !0, e); t !== this._$AB; ) {
      const s = zt(t).nextSibling;
      zt(t).remove(), t = s;
    }
  }
  setConnected(t) {
    var e;
    this._$AM === void 0 && (this._$Cv = t, (e = this._$AP) == null || e.call(this, t));
  }
}
let et = class {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, i, s, a) {
    this.type = 1, this._$AH = p, this._$AN = void 0, this.element = t, this.name = e, this._$AM = s, this.options = a, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = p;
  }
  _$AI(t, e = this, i, s) {
    const a = this.strings;
    let r = !1;
    if (a === void 0) t = L(this, t, e, 0), r = !U(t) || t !== this._$AH && t !== E, r && (this._$AH = t);
    else {
      const n = t;
      let c, h;
      for (t = a[0], c = 0; c < a.length - 1; c++) h = L(this, n[i + c], e, c), h === E && (h = this._$AH[c]), r || (r = !U(h) || h !== this._$AH[c]), h === p ? t = p : t !== p && (t += (h ?? "") + a[c + 1]), this._$AH[c] = h;
    }
    r && !s && this.j(t);
  }
  j(t) {
    t === p ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
};
class ke extends et {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === p ? void 0 : t;
  }
}
class Le extends et {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== p);
  }
}
class De extends et {
  constructor(t, e, i, s, a) {
    super(t, e, i, s, a), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = L(this, t, e, 0) ?? p) === E) return;
    const i = this._$AH, s = t === p && i !== p || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive, a = t !== p && (i === p || s);
    s && this.element.removeEventListener(this.name, this, i), a && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var e;
    typeof this._$AH == "function" ? this._$AH.call(((e = this.options) == null ? void 0 : e.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
let Ie = class {
  constructor(t, e, i) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    L(this, t);
  }
};
const at = O.litHtmlPolyfillSupport;
at == null || at(H, R), (O.litHtmlVersions ?? (O.litHtmlVersions = [])).push("3.3.2");
const Ne = (o, t, e) => {
  const i = (e == null ? void 0 : e.renderBefore) ?? t;
  let s = i._$litPart$;
  if (s === void 0) {
    const a = (e == null ? void 0 : e.renderBefore) ?? null;
    i._$litPart$ = s = new R(t.insertBefore(V(), a), a, void 0, e ?? {});
  }
  return s._$AI(o), s;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const C = globalThis;
let f = class extends k {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var e;
    const t = super.createRenderRoot();
    return (e = this.renderOptions).renderBefore ?? (e.renderBefore = t.firstChild), t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Ne(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var t;
    super.connectedCallback(), (t = this._$Do) == null || t.setConnected(!0);
  }
  disconnectedCallback() {
    var t;
    super.disconnectedCallback(), (t = this._$Do) == null || t.setConnected(!1);
  }
  render() {
    return E;
  }
};
var oe;
f._$litElement$ = !0, f.finalized = !0, (oe = C.litElementHydrateSupport) == null || oe.call(C, { LitElement: f });
const ot = C.litElementPolyfillSupport;
ot == null || ot({ LitElement: f });
(C.litElementVersions ?? (C.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Oe = { ATTRIBUTE: 1 }, Ve = (o) => (...t) => ({ _$litDirective$: o, values: t });
let Ue = class {
  constructor(t) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(t, e, i) {
    this._$Ct = t, this._$AM = e, this._$Ci = i;
  }
  _$AS(t, e) {
    return this.update(t, e);
  }
  update(t, e) {
    return this.render(...e);
  }
};
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ue = "important", He = " !" + ue, Nt = Ve(class extends Ue {
  constructor(o) {
    var t;
    if (super(o), o.type !== Oe.ATTRIBUTE || o.name !== "style" || ((t = o.strings) == null ? void 0 : t.length) > 2) throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.");
  }
  render(o) {
    return Object.keys(o).reduce((t, e) => {
      const i = o[e];
      return i == null ? t : t + `${e = e.includes("-") ? e : e.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g, "-$&").toLowerCase()}:${i};`;
    }, "");
  }
  update(o, [t]) {
    const { style: e } = o.element;
    if (this.ft === void 0) return this.ft = new Set(Object.keys(t)), this.render(t);
    for (const i of this.ft) t[i] == null && (this.ft.delete(i), i.includes("-") ? e.removeProperty(i) : e[i] = null);
    for (const i in t) {
      const s = t[i];
      if (s != null) {
        this.ft.add(i);
        const a = typeof s == "string" && s.endsWith(He);
        i.includes("-") || a ? e.setProperty(i, a ? s.slice(0, -11) : s, a ? ue : "") : e[i] = s;
      }
    }
    return E;
  }
});
var x, Jt;
(function(o) {
  o.language = "language", o.system = "system", o.comma_decimal = "comma_decimal", o.decimal_comma = "decimal_comma", o.space_comma = "space_comma", o.none = "none";
})(x || (x = {})), (function(o) {
  o.language = "language", o.system = "system", o.am_pm = "12", o.twenty_four = "24";
})(Jt || (Jt = {}));
function pe() {
  return (pe = Object.assign || function(o) {
    for (var t = 1; t < arguments.length; t++) {
      var e = arguments[t];
      for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (o[i] = e[i]);
    }
    return o;
  }).apply(this, arguments);
}
function Me(o) {
  return o.substr(0, o.indexOf("."));
}
var Re = function(o) {
  switch (o.number_format) {
    case x.comma_decimal:
      return ["en-US", "en"];
    case x.decimal_comma:
      return ["de", "es", "it"];
    case x.space_comma:
      return ["fr", "sv", "cs"];
    case x.system:
      return;
    default:
      return o.language;
  }
}, ze = function(o, t) {
  return t === void 0 && (t = 2), Math.round(o * Math.pow(10, t)) / Math.pow(10, t);
}, ge = function(o, t, e) {
  var i = t ? Re(t) : void 0;
  if (Number.isNaN = Number.isNaN || function s(a) {
    return typeof a == "number" && s(a);
  }, (t == null ? void 0 : t.number_format) !== x.none && !Number.isNaN(Number(o)) && Intl) try {
    return new Intl.NumberFormat(i, Kt(o, e)).format(Number(o));
  } catch (s) {
    return console.error(s), new Intl.NumberFormat(void 0, Kt(o, e)).format(Number(o));
  }
  return typeof o == "string" ? o : ze(o, e == null ? void 0 : e.maximumFractionDigits).toString() + ((e == null ? void 0 : e.style) === "currency" ? " " + e.currency : "");
}, Kt = function(o, t) {
  var e = pe({ maximumFractionDigits: 2 }, t);
  if (typeof o != "string") return e;
  if (!t || !t.minimumFractionDigits && !t.maximumFractionDigits) {
    var i = o.indexOf(".") > -1 ? o.split(".")[1].length : 0;
    e.minimumFractionDigits = i, e.maximumFractionDigits = i;
  }
  return e;
}, Pe = ["closed", "locked", "off"], _ = function(o, t, e, i) {
  i = i || {}, e = e ?? {};
  var s = new Event(t, { bubbles: i.bubbles === void 0 || i.bubbles, cancelable: !!i.cancelable, composed: i.composed === void 0 || i.composed });
  return s.detail = e, o.dispatchEvent(s), s;
}, P = function(o) {
  _(window, "haptic", o);
}, Fe = function(o, t, e) {
  e === void 0 && (e = !1), e ? history.replaceState(null, "", t) : history.pushState(null, "", t), _(window, "location-changed", { replace: e });
}, je = function(o, t, e) {
  e === void 0 && (e = !0);
  var i, s = Me(t), a = s === "group" ? "homeassistant" : s;
  switch (s) {
    case "lock":
      i = e ? "unlock" : "lock";
      break;
    case "cover":
      i = e ? "open_cover" : "close_cover";
      break;
    default:
      i = e ? "turn_on" : "turn_off";
  }
  return o.callService(a, i, { entity_id: t });
}, Be = function(o, t) {
  var e = Pe.includes(o.states[t].state);
  return je(o, t, e);
}, S = function(o, t, e, i) {
  if (i || (i = { action: "more-info" }), !i.confirmation || i.confirmation.exemptions && i.confirmation.exemptions.some(function(a) {
    return a.user === t.user.id;
  }) || (P("warning"), confirm(i.confirmation.text || "Are you sure you want to " + i.action + "?"))) switch (i.action) {
    case "more-info":
      (e.entity || e.camera_image) && _(o, "hass-more-info", { entityId: e.entity ? e.entity : e.camera_image });
      break;
    case "navigate":
      i.navigation_path && Fe(0, i.navigation_path);
      break;
    case "url":
      i.url_path && window.open(i.url_path);
      break;
    case "toggle":
      e.entity && (Be(t, e.entity), P("success"));
      break;
    case "call-service":
      if (!i.service) return void P("failure");
      var s = i.service.split(".", 2);
      t.callService(s[0], s[1], i.service_data, i.target), P("success");
      break;
    case "fire-dom-event":
      _(o, "ll-custom", i);
  }
};
const Ot = class Ot extends f {
  setConfig(t) {
    this.config = t;
  }
  getEntity() {
    var t, e, i;
    return (i = (t = this.hass) == null ? void 0 : t.states) == null ? void 0 : i[(e = this.config) == null ? void 0 : e.entity];
  }
  /**
   * Entity ids whose state changes should trigger a re-render.
   * Override in subclasses that depend on more than the primary entity.
   */
  getWatchedEntities() {
    var t;
    return (t = this.config) != null && t.entity ? [this.config.entity] : [];
  }
  shouldUpdate(t) {
    if (t.has("config"))
      return !0;
    if (t.has("hass")) {
      const e = t.get("hass"), i = this.hass;
      if (!e)
        return !0;
      if (!i)
        return !1;
      const s = this.getWatchedEntities();
      return s.length === 0 ? !1 : s.some((a) => {
        var r, n;
        return ((r = e.states) == null ? void 0 : r[a]) !== ((n = i.states) == null ? void 0 : n[a]);
      });
    }
    return !1;
  }
};
Ot.properties = {
  hass: { attribute: !1 },
  config: { attribute: !1 }
};
let D = Ot;
function A(o) {
  const { hass: t, label: e, value: i, domains: s, disabled: a = !1, onValueChanged: r } = o;
  return s.length ? l`
    <div class="field">
      <ha-entity-picker
        .hass=${t}
        .label=${e}
        .value=${i}
        .includeDomains=${s}
        ?disabled=${a}
        allow-custom-entity
        @value-changed=${(n) => r(n.detail.value)}
      ></ha-entity-picker>
    </div>
  ` : l`
      <div class="field">
        <ha-entity-picker
          .hass=${t}
          .label=${e}
          .value=${i}
          ?disabled=${a}
          allow-custom-entity
          @value-changed=${(n) => r(n.detail.value)}
        ></ha-entity-picker>
      </div>
    `;
}
function M(o) {
  const { label: t, value: e, placeholder: i = "", onInput: s } = o;
  return l`
    <label>
      <span>${t}</span>
      <input .value=${e} placeholder=${i} @input=${(a) => s(a.target.value)} />
    </label>
  `;
}
function q(o) {
  const { hass: t, label: e, value: i, fallback: s, onValueChanged: a } = o;
  return l`
    <div class="field">
      <ha-icon-picker
        .hass=${t}
        .label=${e}
        .value=${i || s}
        @value-changed=${(r) => a(r.detail.value)}
      ></ha-icon-picker>
    </div>
  `;
}
function F(o) {
  const { label: t, value: e, placeholder: i, onInput: s } = o;
  return l`
    <label>
      <span>${t}</span>
      <input .value=${e} placeholder=${i} @input=${(a) => s(a.target.value)} />
    </label>
  `;
}
function We(o) {
  const { actionConfig: t, formatJson: e, onActionValueChanged: i, onServiceDataChanged: s, serviceDataError: a } = o;
  switch (t.action) {
    case "more-info":
      return F({
        label: "Entity override",
        value: String(t.entity || ""),
        placeholder: "Optional entity",
        onInput: (r) => i("entity", r)
      });
    case "navigate":
      return F({
        label: "Navigation path",
        value: String(t.navigation_path || ""),
        placeholder: "/lovelace/0",
        onInput: (r) => i("navigation_path", r)
      });
    case "url":
      return F({
        label: "URL path",
        value: String(t.url_path || ""),
        placeholder: "https://example.com",
        onInput: (r) => i("url_path", r)
      });
    case "call-service":
      return l`
        ${F({
        label: "Service",
        value: String(t.service || ""),
        placeholder: "light.turn_on",
        onInput: (r) => i("service", r)
      })}
        <label>
          <span>Service data JSON</span>
          <textarea
            .value=${e(t.service_data)}
            placeholder='{"brightness_pct": 50}'
            @change=${(r) => s(r.target.value)}
          ></textarea>
        </label>
        ${a ? l`<div class="error">${a}</div>` : ""}
      `;
    default:
      return "";
  }
}
function qe(o) {
  const { label: t, actionConfig: e, actionOptions: i, onActionTypeChanged: s, fields: a, className: r } = o, n = e.action;
  return l`
    <fieldset class=${r || ""}>
      <legend>${t}</legend>

      <label>
        <span>Action</span>
        <select
          .value=${n}
          @change=${(c) => s(c.target.value)}
        >
          ${i.map(
    (c) => l` <option value=${c.value} ?selected=${c.value === n}>${c.label}</option> `
  )}
        </select>
      </label>

      ${a}
    </fieldset>
  `;
}
function $t(o) {
  const {
    label: t,
    actionConfig: e,
    actionOptions: i,
    onActionTypeChanged: s,
    onActionValueChanged: a,
    onServiceDataChanged: r,
    formatJson: n,
    serviceDataError: c,
    className: h
  } = o;
  return qe({
    label: t,
    className: h,
    actionConfig: e,
    actionOptions: i,
    onActionTypeChanged: s,
    fields: We({
      actionConfig: e,
      formatJson: n,
      onActionValueChanged: a,
      onServiceDataChanged: r,
      serviceDataError: c
    })
  });
}
const Je = [
  { value: "more-info", label: "More info" },
  { value: "toggle", label: "Toggle" },
  { value: "navigate", label: "Navigate" },
  { value: "url", label: "URL" },
  { value: "call-service", label: "Call service" },
  { value: "fire-dom-event", label: "Fire DOM event" },
  { value: "none", label: "None" }
], K = class K extends f {
  constructor() {
    super(...arguments), this.config = {}, this.serviceDataErrors = {};
  }
  connectedCallback() {
    super.connectedCallback(), this.loadHomeAssistantPickers();
  }
  setConfig(t) {
    this.config = {
      icon: "mdi:sofa",
      sensor1_icon: "mdi:thermometer",
      sensor2_icon: "mdi:water-percent",
      tap_action: { action: "more-info" },
      light_tap_action: { action: "toggle" },
      light_hold_action: { action: "more-info" },
      ...t
    };
  }
  shouldUpdate(t) {
    return t.has("config") ? !0 : t.has("hass") ? !t.get("hass") && !!this.hass : !1;
  }
  render() {
    return l`
      <div class="editor">
        <div class="grid">
          ${M({
      label: "Name",
      value: String(this.config.name || ""),
      placeholder: "Living room",
      onInput: (t) => this.updateConfigValue("name", t)
    })}
          ${A({
      hass: this.hass,
      label: "Light entity",
      value: String(this.config.entity || ""),
      domains: ["light"],
      onValueChanged: (t) => this.updateConfigValue("entity", t)
    })}
          ${q({
      hass: this.hass,
      label: "Icon",
      value: String(this.config.icon || ""),
      fallback: "mdi:sofa",
      onValueChanged: (t) => this.updateConfigValue("icon", t)
    })}
          ${A({
      hass: this.hass,
      label: "Sensor 1 entity",
      value: String(this.config.sensor1_entity || ""),
      domains: ["sensor"],
      onValueChanged: (t) => this.updateConfigValue("sensor1_entity", t)
    })}
          ${q({
      hass: this.hass,
      label: "Sensor 1 icon",
      value: String(this.config.sensor1_icon || ""),
      fallback: "mdi:thermometer",
      onValueChanged: (t) => this.updateConfigValue("sensor1_icon", t)
    })}
          ${A({
      hass: this.hass,
      label: "Sensor 2 entity",
      value: String(this.config.sensor2_entity || ""),
      domains: ["sensor"],
      onValueChanged: (t) => this.updateConfigValue("sensor2_entity", t)
    })}
          ${q({
      hass: this.hass,
      label: "Sensor 2 icon",
      value: String(this.config.sensor2_icon || ""),
      fallback: "mdi:water-percent",
      onValueChanged: (t) => this.updateConfigValue("sensor2_icon", t)
    })}
        </div>

        ${this.renderActionEditor("Card tap action", "tap_action")}
        ${this.renderActionEditor("Light short press action", "light_tap_action")}
        ${this.renderActionEditor("Light long press action", "light_hold_action")}
      </div>
    `;
  }
  renderActionEditor(t, e) {
    const i = this.config[e] || { action: "none" };
    return $t({
      label: t,
      actionConfig: i,
      actionOptions: Je,
      onActionTypeChanged: (s) => this.updateActionType(e, s),
      onActionValueChanged: (s, a) => this.updateActionValue(e, s, a),
      onServiceDataChanged: (s) => this.updateServiceData(e, s),
      formatJson: (s) => this.formatJson(s),
      serviceDataError: this.serviceDataErrors[e]
    });
  }
  updateConfigValue(t, e) {
    const i = {
      ...this.config,
      [t]: e || void 0
    };
    this.updateConfig(i);
  }
  updateActionType(t, e) {
    this.updateConfig({
      ...this.config,
      [t]: { action: e }
    });
  }
  updateActionValue(t, e, i) {
    this.updateConfig({
      ...this.config,
      [t]: {
        ...this.config[t] || { action: "none" },
        [e]: i || void 0
      }
    });
  }
  updateServiceData(t, e) {
    const i = e.trim();
    if (!i) {
      this.serviceDataErrors = { ...this.serviceDataErrors, [t]: void 0 }, this.updateActionValue(t, "service_data", "");
      return;
    }
    try {
      const s = JSON.parse(i);
      this.serviceDataErrors = { ...this.serviceDataErrors, [t]: void 0 }, this.updateConfig({
        ...this.config,
        [t]: {
          ...this.config[t] || { action: "call-service" },
          service_data: s
        }
      });
    } catch {
      this.serviceDataErrors = {
        ...this.serviceDataErrors,
        [t]: "Service data must be valid JSON."
      }, this.requestUpdate();
    }
  }
  formatJson(t) {
    return t ? JSON.stringify(t, null, 2) : "";
  }
  updateConfig(t) {
    this.config = t, _(this, "config-changed", { config: t });
  }
  async loadHomeAssistantPickers() {
    const t = window.loadCardHelpers;
    if (customElements.get("ha-entity-picker") && customElements.get("ha-icon-picker") || !t)
      return;
    await (await (await t()).createCardElement({
      type: "entities",
      entities: []
    })).constructor.getConfigElement(), this.requestUpdate();
  }
};
K.properties = {
  hass: { attribute: !1 },
  config: { attribute: !1 }
}, K.styles = y`
    .editor {
      display: grid;
      gap: 18px;
    }

    .grid {
      display: grid;
      gap: 12px;
    }

    label {
      display: grid;
      gap: 6px;
    }

    .field {
      display: block;
    }

    ha-entity-picker,
    ha-icon-picker {
      display: block;
      width: 100%;
    }

    label span,
    legend {
      color: var(--secondary-text-color);
      font-size: 12px;
      font-weight: 500;
    }

    input,
    select,
    textarea {
      background: var(--card-background-color, #fff);
      border: 1px solid var(--divider-color, #ddd);
      border-radius: 6px;
      box-sizing: border-box;
      color: var(--primary-text-color);
      font: inherit;
      min-height: 40px;
      padding: 8px 10px;
      width: 100%;
    }

    textarea {
      min-height: 86px;
      resize: vertical;
    }

    fieldset {
      border: 1px solid var(--divider-color, #ddd);
      border-radius: 10px;
      display: grid;
      gap: 12px;
      margin: 0;
      padding: 12px;
    }

    .error {
      color: var(--error-color, #db4437);
      font-size: 12px;
    }
  `;
let wt = K;
customElements.define("room-card-editor", wt);
const j = { action: "more-info" }, rt = { action: "toggle" }, nt = { action: "more-info" }, ct = "mdi:thermometer", lt = "mdi:water-percent", Vt = class Vt extends D {
  constructor() {
    super(...arguments), this.lightHoldTriggered = !1;
  }
  static getConfigElement() {
    return document.createElement("room-card-editor");
  }
  static getStubConfig() {
    return {
      entity: "",
      name: "Living room",
      icon: "mdi:sofa",
      sensor1_icon: ct,
      sensor2_icon: lt,
      tap_action: j,
      light_tap_action: rt,
      light_hold_action: nt
    };
  }
  setConfig(t) {
    if (!t.entity)
      throw new Error("Room Card requires a light entity");
    this.config = {
      icon: "mdi:sofa",
      sensor1_icon: ct,
      sensor2_icon: lt,
      tap_action: j,
      light_tap_action: rt,
      light_hold_action: nt,
      ...t
    };
  }
  getWatchedEntities() {
    var t, e, i;
    return [
      (t = this.config) == null ? void 0 : t.entity,
      (e = this.config) == null ? void 0 : e.sensor1_entity,
      (i = this.config) == null ? void 0 : i.sensor2_entity
    ].filter((s) => !!s);
  }
  render() {
    var n;
    const t = this.getLightEntity(), e = this.isLightOff(t), i = this.config.name || ((n = t == null ? void 0 : t.attributes) == null ? void 0 : n.friendly_name) || "Room", s = this.getLightRgb(t), a = !!(this.config.sensor1_entity || this.config.sensor2_entity), r = s ? {
      "--room-light-rgb": s.join(",")
    } : {};
    return l`
      <ha-card class=${e ? "light-off" : ""} style=${Nt(r)} @click=${this.handleCardTap}>
        <div class="card" role="button" tabindex="0" @keydown=${this.handleCardKeydown}>
          <div class="top-row">
            <div class="room-icon">
              <ha-icon .icon=${this.config.icon || "mdi:sofa"}></ha-icon>
            </div>

            <button
              class=${`light-button ${e ? "light-button-off" : ""}`}
              type="button"
              aria-label="Light actions"
              @click=${this.handleLightTap}
              @pointerdown=${this.handleLightPointerDown}
              @pointerup=${this.handleLightPointerUp}
              @pointercancel=${this.cancelLightHold}
              @pointerleave=${this.cancelLightHold}
              @contextmenu=${this.preventContextMenu}
            >
              <ha-icon .icon=${e ? "mdi:lightbulb-off" : "mdi:lightbulb"}></ha-icon>
            </button>
          </div>

          <div class="details">
            <div class="name">${i}</div>
            ${a ? l`
                  <div class="sensors">
                    ${this.config.sensor1_entity ? this.renderSensor(
      this.config.sensor1_icon || ct,
      this.config.sensor1_entity
    ) : ""}
                    ${this.config.sensor2_entity ? this.renderSensor(
      this.config.sensor2_icon || lt,
      this.config.sensor2_entity
    ) : ""}
                  </div>
                ` : ""}
          </div>
        </div>
      </ha-card>
    `;
  }
  renderSensor(t, e) {
    var a, r;
    const i = e ? (r = (a = this.hass) == null ? void 0 : a.states) == null ? void 0 : r[e] : void 0, s = i ? this.formatEntityState(i) : "-";
    return l`
      <span class="sensor">
        <ha-icon .icon=${t}></ha-icon>
        <span>${s}</span>
      </span>
    `;
  }
  formatEntityState(t) {
    var s;
    const e = ((s = t.attributes) == null ? void 0 : s.unit_of_measurement) || "";
    return `${this.formatSensorValue(t.state)}${e ? ` ${e}` : ""}`;
  }
  formatSensorValue(t) {
    var i;
    const e = Number(t);
    return t.trim() === "" || !Number.isFinite(e) ? t : ge(e, (i = this.hass) == null ? void 0 : i.locale, { maximumFractionDigits: 2 });
  }
  getLightEntity() {
    var t, e;
    return (e = (t = this.hass) == null ? void 0 : t.states) == null ? void 0 : e[this.config.entity];
  }
  isLightOff(t) {
    return !t || t.state === "off" || t.state === "unavailable";
  }
  getLightRgb(t) {
    var s, a;
    if (this.isLightOff(t))
      return;
    const e = (s = t.attributes) == null ? void 0 : s.rgb_color;
    if (Array.isArray(e) && e.length >= 3)
      return [Number(e[0]), Number(e[1]), Number(e[2])];
    const i = (a = t.attributes) == null ? void 0 : a.hs_color;
    if (Array.isArray(i) && i.length >= 2)
      return this.hslToRgb(Number(i[0]), Number(i[1]), 50);
  }
  hslToRgb(t, e, i) {
    const s = e / 100, a = i / 100, r = (1 - Math.abs(2 * a - 1)) * s, n = t / 60, c = r * (1 - Math.abs(n % 2 - 1)), h = a - r / 2;
    let d = [0, 0, 0];
    return n >= 0 && n < 1 ? d = [r, c, 0] : n < 2 ? d = [c, r, 0] : n < 3 ? d = [0, r, c] : n < 4 ? d = [0, c, r] : n < 5 ? d = [c, 0, r] : d = [r, 0, c], d.map((u) => Math.round((u + h) * 255));
  }
  handleCardTap(t) {
    t.target.closest(".light-button") || this.runAction(this.config.tap_action || j);
  }
  handleCardKeydown(t) {
    t.key !== "Enter" && t.key !== " " || (t.preventDefault(), this.runAction(this.config.tap_action || j));
  }
  handleLightTap(t) {
    if (t.stopPropagation(), this.lightHoldTriggered) {
      this.lightHoldTriggered = !1;
      return;
    }
    this.cancelLightHold(), this.runAction(this.config.light_tap_action || rt);
  }
  handleLightPointerDown(t) {
    t.stopPropagation(), this.lightHoldTriggered = !1, this.cancelLightHold(), this.holdTimer = window.setTimeout(() => {
      this.lightHoldTriggered = !0, this.runAction(this.config.light_hold_action || nt);
    }, 500);
  }
  handleLightPointerUp(t) {
    t.stopPropagation(), this.cancelLightHold();
  }
  cancelLightHold() {
    this.holdTimer && (window.clearTimeout(this.holdTimer), this.holdTimer = void 0);
  }
  preventContextMenu(t) {
    t.preventDefault();
  }
  runAction(t) {
    S(
      this,
      this.hass,
      {
        entity: this.config.entity
      },
      t
    );
  }
};
Vt.styles = y`
    ha-card {
      --room-light-rgb: 94, 124, 84;
      background: #332d1d;
      border-radius: 20px;
      color: var(--primary-text-color);
      overflow: hidden;
      border: none;
    }

    ha-card.light-off {
      background: var(--card-background-color);
    }

    .card {
      cursor: pointer;
      padding: 12px 12px 12px 24px;
    }

    .card:focus {
      outline: none;
    }

    .card:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: -6px;
    }

    .top-row {
      align-items: stretch;
      display: flex;
      gap: 50px;
    }

    .room-icon {
      align-items: center;
      background: rgba(255, 211, 76, 0.18);
      border-radius: 999px;
      color: #ffd34c;
      display: flex;
      flex: 0 0 auto;
      height: 42px;
      justify-content: center;
      width: 42px;
    }

    ha-card.light-off .room-icon {
      background: #2b2b2b;
      color: #656565;
    }

    .room-icon ha-icon {
      --mdc-icon-size: 20px;
    }

    .light-button {
      align-items: center;
      background: rgba(var(--room-light-rgb), 0.33);
      border: 0;
      border-radius: 12px;
      color: #ffd968;
      cursor: pointer;
      display: flex;
      flex: 1 1 0;
      height: 42px;
      justify-content: center;
      min-width: 0;
      padding: 0;
      transition: filter 120ms ease, transform 120ms ease;
    }

    .light-button-off {
      background: #2b2b2b;
      color: #d7d7d7;
    }

    .light-button:active {
      filter: brightness(1.08);
      transform: scale(0.99);
    }

    .light-button:focus {
      outline: none;
    }

    .light-button:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 3px;
    }

    .light-button ha-icon {
      --mdc-icon-size: 20px;
    }

    .details {
      margin-top: 12px;
    }

    .name {
      color: #ffd968;
      font-size: 14px;
      font-weight: 700;
      line-height: 1.1;
    }

    ha-card.light-off .name {
      color: #9b9b9b;
    }

    .sensors {
      align-items: center;
      color: rgba(255, 217, 104, 0.68);
      display: flex;
      flex-wrap: wrap;
      font-size: 12px;
      font-weight: 700;
      gap: 14px;
      margin-top: 6px;
    }

    ha-card.light-off .sensors {
      color: #777;
    }

    .sensor {
      align-items: center;
      display: inline-flex;
      gap: 7px;
      white-space: nowrap;
    }

    .sensor ha-icon {
      --mdc-icon-size: 12px;
    }

    @media (max-width: 420px) {
      .card {
        padding: 10px;
      }
      .top-row {
        gap: 12px;
      }
      .room-icon {
        height: 50px;
        width: 50px;
        border-radius: 50%;
      }

      .sensors {
        gap: 10px;
      }
    }
  `;
let xt = Vt;
customElements.define("room-card", xt);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "room-card",
  name: "Room Card",
  description: "Room card with light actions and sensors"
});
const Gt = "Possible Issues", Zt = ["sensor", "light", "switch"], Ke = ["unavailable"], Ge = ["unavailable", "unknown", "none"], Yt = "none", Ze = [
  { value: "equals", label: "Equals" },
  { value: "not_equals", label: "Does not equal" },
  { value: "gt", label: "Greater than (>)" },
  { value: "lt", label: "Less than (<)" },
  { value: "lte", label: "Less than or equal (<=)" },
  { value: "gte", label: "Greater than or equal (>=)" },
  { value: "contains", label: "Contains" },
  { value: "not_contains", label: "Does not contain" }
], G = class G extends f {
  constructor() {
    super(...arguments), this.config = {}, this.integrationOptions = [], this.integrationsLoading = !1, this.integrationsVersion = 0;
  }
  connectedCallback() {
    super.connectedCallback(), this.loadHomeAssistantPickers();
  }
  setConfig(t) {
    this.config = {
      title: Gt,
      domains: Zt,
      issue_states: Ke,
      ignored_entities: [],
      ignored_devices: [],
      ignored_integrations: [],
      ignored_name_patterns: [],
      row_detail: Yt,
      value_checks: [],
      ...t
    };
  }
  shouldUpdate(t) {
    return t.has("config") || t.has("integrationsVersion") ? !0 : t.has("hass") ? !t.get("hass") && !!this.hass : !1;
  }
  updated(t) {
    t.has("hass") && this.loadIntegrationOptions();
  }
  render() {
    return l`
      <div class="editor">
        <div class="grid">
          ${M({
      label: "Title",
      value: String(this.config.title || ""),
      placeholder: Gt,
      onInput: (t) => this.updateConfigValue("title", t)
    })}
          ${this.renderListField("Domains", "domains", Zt, "sensor, light, switch")}
          ${this.renderIssueStatesField()}
          ${this.renderValueChecksField()}
          ${this.renderListField("Ignored entity IDs or patterns", "ignored_entities", [], "sensor.openweathermap_weather")}
          ${this.renderListField("Ignored device IDs or patterns", "ignored_devices", [], "nuki, 65oled855")}
          ${this.renderIgnoredIntegrationsField()}
          ${this.renderListField("Ignored name patterns", "ignored_name_patterns", [], "Printer, Test device")}
          ${this.renderRowDetailField()}
        </div>
      </div>
    `;
  }
  renderListField(t, e, i, s) {
    return M({
      label: t,
      value: this.formatList(this.config[e], i),
      placeholder: s,
      onInput: (a) => this.updateListValue(e, a)
    });
  }
  renderIssueStatesField() {
    const t = this.parseConfigList(this.config.issue_states), e = new Set(t), i = Ge.filter((s) => !e.has(s));
    return l`
      <div class="field-group">
        <label>
          <span>Issue states</span>
          <select ?disabled=${i.length === 0} @change=${(s) => this.handleIssueStateSelected(s)}>
            <option value="">${i.length ? "Add state" : "All common states selected"}</option>
            ${i.map((s) => l`<option value=${s}>${s}</option>`)}
          </select>
        </label>

        <div class="custom-row">
          <input
            class="custom-issue-state"
            placeholder="Custom state"
            @keydown=${(s) => this.handleCustomIssueStateKeydown(s)}
          />
          <button type="button" @click=${() => this.addCustomIssueState()}>Add</button>
        </div>

        ${t.length ? l`
              <div class="chips" aria-label="Issue states">
                ${t.map(
      (s) => l`
                    <button class="chip" type="button" @click=${() => this.removeIssueState(s)}>
                      ${s}
                      <span aria-hidden="true">x</span>
                    </button>
                  `
    )}
              </div>
            ` : ""}
      </div>
    `;
  }
  renderValueChecksField() {
    const t = this.config.value_checks || [];
    return l`
      <div class="field-group">
        <div class="section-header">
          <span>Entity value checks</span>
          <button type="button" @click=${() => this.addValueCheck()}>Add check</button>
        </div>

        ${t.length ? t.map(
      (e, i) => l`
                <div class="value-check">
                  ${A({
        hass: this.hass,
        label: "Entity",
        value: String(e.entity || ""),
        domains: [],
        onValueChanged: (s) => this.updateValueCheck(i, "entity", s)
      })}

                  <label>
                    <span>Operator</span>
                    <select
                      .value=${e.operator || "equals"}
                      @change=${(s) => this.updateValueCheck(
        i,
        "operator",
        s.target.value
      )}
                    >
                      ${Ze.map(
        (s) => l`
                          <option value=${s.value} ?selected=${(e.operator || "equals") === s.value}>
                            ${s.label}
                          </option>
                        `
      )}
                    </select>
                  </label>

                  <label>
                    <span>Values</span>
                    <input
                      .value=${this.formatList(e.values, [])}
                      placeholder="error, jammed, offline"
                      @input=${(s) => this.updateValueCheck(i, "values", this.parseList(s.target.value))}
                    />
                  </label>

                  <label>
                    <span>Message</span>
                    <input
                      .value=${e.message || ""}
                      placeholder="Washing machine issue"
                      @input=${(s) => this.updateValueCheck(i, "message", s.target.value)}
                    />
                  </label>

                  <label>
                    <span>Submessage</span>
                    <input
                      .value=${e.submessage || ""}
                      placeholder="Check the machine before starting a new cycle"
                      @input=${(s) => this.updateValueCheck(i, "submessage", s.target.value)}
                    />
                  </label>

                  <label>
                    <span>Navigation path</span>
                    <input
                      .value=${e.navigation_path || ""}
                      placeholder="/lovelace/issues"
                      @input=${(s) => this.updateValueCheck(i, "navigation_path", s.target.value)}
                    />
                  </label>

                  <button type="button" @click=${() => this.removeValueCheck(i)}>Remove check</button>
                </div>
              `
    ) : l`<p class="hint">Add checks to show an entity when its state matches one or more configured values.</p>`}
      </div>
    `;
  }
  renderIgnoredIntegrationsField() {
    const t = this.parseConfigList(this.config.ignored_integrations), e = new Set(t), i = this.integrationOptions.filter((a) => !e.has(a)), s = this.integrationsLoading || i.length === 0;
    return l`
      <label>
        <span>Ignored integrations</span>
        <select ?disabled=${s} @change=${(a) => this.handleIgnoredIntegrationSelected(a)}>
          <option value="">
            ${this.integrationsLoading ? "Loading integrations..." : i.length ? "Add integration" : "No integrations available"}
          </option>
          ${i.map((a) => l`<option value=${a}>${this.formatIntegrationName(a)}</option>`)}
        </select>
      </label>
      ${t.length ? l`
            <div class="chips" aria-label="Ignored integrations">
              ${t.map(
      (a) => l`
                  <button class="chip" type="button" @click=${() => this.removeIgnoredIntegration(a)}>
                    ${this.formatIntegrationName(a)}
                    <span aria-hidden="true">x</span>
                  </button>
                `
    )}
            </div>
          ` : ""}
    `;
  }
  renderRowDetailField() {
    const t = this.config.row_detail || Yt;
    return l`
      <label>
        <span>Row detail</span>
        <select
          .value=${t}
          @change=${(e) => this.updateConfigValue("row_detail", e.target.value)}
        >
          <option value="none" ?selected=${t === "none"}>None</option>
          <option value="count" ?selected=${t === "count"}>Affected entity count</option>
          <option value="entities" ?selected=${t === "entities"}>Affected entity names</option>
        </select>
      </label>
    `;
  }
  updateConfigValue(t, e) {
    this.updateConfig({
      ...this.config,
      [t]: e === "" ? void 0 : e
    });
  }
  updateListValue(t, e) {
    this.updateConfig({
      ...this.config,
      [t]: this.parseList(e)
    });
  }
  addValueCheck() {
    this.updateConfig({
      ...this.config,
      value_checks: [...this.config.value_checks || [], { entity: "", operator: "equals", values: [] }]
    });
  }
  updateValueCheck(t, e, i) {
    const s = [...this.config.value_checks || []];
    s[t] = {
      ...s[t],
      [e]: i
    }, this.updateConfig({
      ...this.config,
      value_checks: s
    });
  }
  removeValueCheck(t) {
    this.updateConfig({
      ...this.config,
      value_checks: (this.config.value_checks || []).filter((e, i) => i !== t)
    });
  }
  handleIssueStateSelected(t) {
    const e = t.target, i = e.value;
    e.value = "", i && this.addIssueState(i);
  }
  handleCustomIssueStateKeydown(t) {
    t.key === "Enter" && (t.preventDefault(), this.addCustomIssueState(t.target));
  }
  addCustomIssueState(t) {
    const e = t || this.renderRoot.querySelector(".custom-issue-state"), i = e == null ? void 0 : e.value.trim();
    i && (this.addIssueState(i), e && (e.value = ""));
  }
  addIssueState(t) {
    const e = this.parseConfigList(this.config.issue_states);
    e.includes(t) || this.updateConfig({
      ...this.config,
      issue_states: [...e, t]
    });
  }
  removeIssueState(t) {
    this.updateConfig({
      ...this.config,
      issue_states: this.parseConfigList(this.config.issue_states).filter((e) => e !== t)
    });
  }
  handleIgnoredIntegrationSelected(t) {
    const e = t.target, i = e.value;
    e.value = "", i && this.updateConfig({
      ...this.config,
      ignored_integrations: [...this.parseConfigList(this.config.ignored_integrations), i]
    });
  }
  removeIgnoredIntegration(t) {
    this.updateConfig({
      ...this.config,
      ignored_integrations: this.parseConfigList(this.config.ignored_integrations).filter(
        (e) => e !== t
      )
    });
  }
  parseList(t) {
    return t.split(",").map((e) => e.trim()).filter(Boolean);
  }
  parseConfigList(t) {
    return t == null || t === "" ? [] : Array.isArray(t) ? t : this.parseList(String(t));
  }
  formatList(t, e) {
    const i = t == null || t === "" ? e : t;
    return Array.isArray(i) ? i.join(", ") : String(i);
  }
  formatIntegrationName(t) {
    return t.split("_").map((e) => e.charAt(0).toUpperCase() + e.slice(1)).join(" ");
  }
  updateConfig(t) {
    this.config = t, _(this, "config-changed", { config: t });
  }
  async loadHomeAssistantPickers() {
    const t = window.loadCardHelpers;
    if (customElements.get("ha-entity-picker") || !t)
      return;
    await (await (await t()).createCardElement({
      type: "entities",
      entities: []
    })).constructor.getConfigElement(), this.requestUpdate();
  }
  async loadIntegrationOptions() {
    if (!(!this.hass || this.integrationsLoading || this.integrationOptions.length)) {
      this.integrationsLoading = !0, this.integrationsVersion += 1;
      try {
        const t = await this.hass.callWS({
          type: "config/entity_registry/list"
        });
        this.integrationOptions = [...new Set(t.map((e) => e.platform).filter(Boolean))].sort();
      } finally {
        this.integrationsLoading = !1, this.integrationsVersion += 1;
      }
    }
  }
};
G.properties = {
  hass: { attribute: !1 },
  config: { attribute: !1 },
  integrationsVersion: { state: !0 }
}, G.styles = y`
    .editor {
      display: grid;
      gap: 18px;
    }

    .grid {
      display: grid;
      gap: 12px;
    }

    label {
      display: grid;
      gap: 6px;
    }

    .field {
      display: block;
    }

    ha-entity-picker {
      display: block;
      width: 100%;
    }

    .field-group {
      display: grid;
      gap: 8px;
    }

    .section-header {
      align-items: center;
      display: flex;
      gap: 12px;
      justify-content: space-between;
    }

    .section-header span {
      color: var(--secondary-text-color);
      font-size: 12px;
      font-weight: 500;
    }

    label span {
      color: var(--secondary-text-color);
      font-size: 12px;
      font-weight: 500;
    }

    input,
    select,
    button {
      background: var(--card-background-color, #fff);
      border: 1px solid var(--divider-color, #ddd);
      border-radius: 6px;
      box-sizing: border-box;
      color: var(--primary-text-color);
      font: inherit;
      min-height: 40px;
      padding: 8px 10px;
      width: 100%;
    }

    button {
      cursor: pointer;
      width: auto;
    }

    button:disabled,
    select:disabled {
      cursor: default;
      opacity: 0.55;
    }

    .custom-row {
      display: grid;
      gap: 8px;
      grid-template-columns: minmax(0, 1fr) auto;
    }

    .value-check {
      border: 1px solid var(--divider-color, #ddd);
      border-radius: 10px;
      display: grid;
      gap: 8px;
      padding: 10px;
    }

    .hint {
      color: var(--secondary-text-color);
      font-size: 12px;
      margin: 0;
    }

    .chips {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .chip {
      align-items: center;
      background: var(--card-background-color, #fff);
      border: 1px solid var(--divider-color, #ddd);
      border-radius: 999px;
      color: var(--primary-text-color);
      cursor: pointer;
      display: inline-flex;
      font: inherit;
      gap: 8px;
      min-height: 32px;
      padding: 5px 10px;
    }

    .chip span {
      color: var(--secondary-text-color);
      font-size: 13px;
      line-height: 1;
    }
  `;
let Ct = G;
customElements.define("possible-issues-card-editor", Ct);
const ht = "Possible Issues", dt = ["sensor", "light", "switch"], ut = ["unavailable"], pt = "none", Z = class Z extends D {
  constructor() {
    super(...arguments), this.entityRegistry = [], this.deviceRegistry = [], this.registryLoading = !1, this.registryError = !1, this.registryVersion = 0;
  }
  static getConfigElement() {
    return document.createElement("possible-issues-card-editor");
  }
  static getStubConfig() {
    return {
      title: ht,
      domains: dt,
      issue_states: ut,
      ignored_entities: [],
      ignored_devices: [],
      ignored_integrations: [],
      ignored_name_patterns: [],
      row_detail: pt,
      value_checks: []
    };
  }
  setConfig(t) {
    this.config = {
      title: ht,
      domains: dt,
      issue_states: ut,
      ignored_entities: [],
      ignored_devices: [],
      ignored_integrations: [],
      ignored_name_patterns: [],
      row_detail: pt,
      value_checks: [],
      ...t
    };
  }
  shouldUpdate(t) {
    if (t.has("config") || t.has("registryVersion"))
      return !0;
    if (t.has("hass")) {
      const e = t.get("hass");
      return e ? this.hass ? this.getWatchedEntityIds(this.hass).some((s) => {
        var a, r;
        return ((a = e.states) == null ? void 0 : a[s]) !== ((r = this.hass.states) == null ? void 0 : r[s]);
      }) : !1 : !0;
    }
    return !1;
  }
  updated(t) {
    t.has("hass") && this.loadRegistries();
  }
  render() {
    const t = this.getIssueDevices(), e = this.getValueCheckIssues();
    return !t.length && !e.length ? l`` : l`
      <ha-card>
        <div class="card">
          <h2>${this.config.title || ht}</h2>
          <div class="devices">
            ${t.map((i) => this.renderDeviceRow(i))}
            ${e.map((i) => this.renderEntityRow(i))}
          </div>
        </div>
      </ha-card>
    `;
  }
  renderDeviceRow(t) {
    const e = this.getDeviceName(t.device), i = this.getIssueIcon(t.entities[0]), s = this.getRowDetail(t);
    return l`
      <button class="device-row" type="button" @click=${() => this.openDevice(t.device.id)}>
        <ha-icon .icon=${i}></ha-icon>
        <span class="row-text">
          <span class="name">${e}</span>
          ${s ? l`<span class="detail">${s}</span>` : ""}
        </span>
      </button>
    `;
  }
  renderEntityRow(t) {
    var r;
    const e = t.check.entity, i = t.check.message || this.getEntityName(e, t.entity), s = t.check.submessage || this.getValueCheckDetail(t), a = ((r = t.entity.attributes) == null ? void 0 : r.icon) || "mdi:alert-circle-outline";
    return l`
      <button class="device-row" type="button" @click=${() => this.openValueCheckIssue(t)}>
        <ha-icon .icon=${a}></ha-icon>
        <span class="row-text">
          <span class="name">${i}</span>
          <span class="detail">${s}</span>
        </span>
      </button>
    `;
  }
  getIssueDevices() {
    var c;
    if (this.registryError || !this.entityRegistry.length || !this.deviceRegistry.length || !this.hass)
      return [];
    const t = new Set(this.normalizeList(this.config.issue_states, ut)), e = this.normalizeList(this.config.ignored_entities), i = this.normalizeList(this.config.ignored_devices), s = new Set(
      this.normalizeList(this.config.ignored_integrations).map((h) => h.toLowerCase())
    ), a = this.normalizeList(this.config.ignored_name_patterns), r = new Map(this.deviceRegistry.map((h) => [h.id, h])), n = /* @__PURE__ */ new Map();
    for (const h of this.entityRegistry) {
      const d = this.hass.states[h.entity_id], u = h.device_id || "", g = r.get(u);
      if (!d || !g || !t.has(d.state) || h.platform && s.has(h.platform.toLowerCase()) || this.isIgnored(h.entity_id, e) || this.isIgnored(u, i))
        continue;
      const m = [this.getDeviceName(g), (c = d.attributes) == null ? void 0 : c.friendly_name, h.name, h.original_name].filter(Boolean).join(" ");
      this.isIgnored(m, a) || n.set(u, [...n.get(u) || [], h]);
    }
    return [...n.entries()].map(([h, d]) => ({
      device: r.get(h),
      entities: d
    })).sort((h, d) => this.getDeviceName(h.device).localeCompare(this.getDeviceName(d.device)));
  }
  getValueCheckIssues() {
    return this.hass ? this.getValueChecks().map((t) => {
      const e = this.hass.states[t.entity], i = e ? this.getMatchedValue(e.state, t) : void 0;
      return e && i !== void 0 ? {
        check: t,
        entity: e,
        matchedValue: i
      } : void 0;
    }).filter(Boolean) : [];
  }
  getDomainEntityIds(t) {
    var i;
    const e = new Set(this.normalizeList((i = this.config) == null ? void 0 : i.domains, dt));
    return Object.keys(t.states || {}).filter((s) => e.has(this.getDomain(s)));
  }
  getWatchedEntityIds(t) {
    return [.../* @__PURE__ */ new Set([...this.getDomainEntityIds(t), ...this.getValueChecks().map((e) => e.entity)])];
  }
  getDomain(t) {
    return t.split(".", 1)[0];
  }
  getDeviceName(t) {
    return t.name_by_user || t.name || "Unknown device";
  }
  getEntityName(t, e) {
    var i;
    return ((i = e.attributes) == null ? void 0 : i.friendly_name) || t;
  }
  getIssueIcon(t) {
    var i, s, a;
    const e = t ? (s = (i = this.hass) == null ? void 0 : i.states) == null ? void 0 : s[t.entity_id] : void 0;
    return ((a = e == null ? void 0 : e.attributes) == null ? void 0 : a.icon) || (t == null ? void 0 : t.icon) || (t == null ? void 0 : t.original_icon) || "mdi:devices";
  }
  getRowDetail(t) {
    const e = this.config.row_detail || pt;
    if (e === "count") {
      const i = t.entities.length;
      return `${i} unavailable ${i === 1 ? "entity" : "entities"}`;
    }
    return e === "entities" ? t.entities.map((i) => {
      var a;
      const s = this.hass.states[i.entity_id];
      return ((a = s == null ? void 0 : s.attributes) == null ? void 0 : a.friendly_name) || i.name || i.original_name || i.entity_id;
    }).join(", ") : "";
  }
  getValueCheckDetail(t) {
    var n;
    const e = this.getOperatorLabel(t.check.operator), i = ((n = t.entity.attributes) == null ? void 0 : n.unit_of_measurement) || "", s = t.check.operator === "not_contains" ? t.check.values.join(", ") : t.matchedValue || t.check.values.join(", "), a = `${t.entity.state} ${i ? `${i}` : ""}`, r = `${s} ${i ? `${i}` : ""}`;
    return `${a} ${e} ${r}`;
  }
  getOperatorLabel(t) {
    return {
      equals: "is",
      not_equals: "is not",
      gt: ">",
      lt: "<",
      lte: "<=",
      gte: ">=",
      contains: "contains",
      not_contains: "does not contain"
    }[t];
  }
  openDevice(t) {
    S(
      this,
      this.hass,
      {},
      {
        action: "navigate",
        navigation_path: `/config/devices/device/${t}`
      }
    );
  }
  openEntity(t) {
    S(
      this,
      this.hass,
      {},
      {
        action: "more-info",
        entity: t
      }
    );
  }
  openValueCheckIssue(t) {
    if (t.check.navigation_path) {
      S(
        this,
        this.hass,
        {},
        {
          action: "navigate",
          navigation_path: t.check.navigation_path
        }
      );
      return;
    }
    this.openEntity(t.check.entity);
  }
  getValueChecks() {
    return (this.config.value_checks || []).map((t) => ({
      entity: String(t.entity || "").trim(),
      operator: this.normalizeOperator(t.operator),
      values: this.normalizeList(t.values),
      message: this.normalizeOptionalText(t.message),
      submessage: this.normalizeOptionalText(t.submessage),
      navigation_path: this.normalizeOptionalText(t.navigation_path)
    })).filter((t) => t.entity && t.values.length);
  }
  normalizeOptionalText(t) {
    return String(t || "").trim() || void 0;
  }
  normalizeOperator(t) {
    return ["equals", "not_equals", "gt", "lt", "lte", "gte", "contains", "not_contains"].includes(t) ? t : "equals";
  }
  getMatchedValue(t, e) {
    if (e.operator === "not_contains") {
      const i = t.toLowerCase();
      return e.values.every((s) => !i.includes(s.toLowerCase())) ? e.values.join(", ") : void 0;
    }
    return e.values.find((i) => this.matchesValue(t, i, e.operator));
  }
  matchesValue(t, e, i) {
    switch (i) {
      case "equals":
        return t === e;
      case "not_equals":
        return t !== e;
      case "contains":
        return t.toLowerCase().includes(e.toLowerCase());
      case "gt":
      case "lt":
      case "lte":
      case "gte":
        return this.matchesNumericValue(t, e, i);
      case "not_contains":
        return !1;
    }
  }
  matchesNumericValue(t, e, i) {
    const s = Number(t), a = Number(e);
    if (!Number.isFinite(s) || !Number.isFinite(a))
      return !1;
    switch (i) {
      case "gt":
        return s > a;
      case "lt":
        return s < a;
      case "lte":
        return s <= a;
      case "gte":
        return s >= a;
      default:
        return !1;
    }
  }
  normalizeList(t, e = []) {
    const i = t == null || t === "" ? e : t;
    return (Array.isArray(i) ? i : String(i).split(",")).map((a) => String(a).trim()).filter(Boolean);
  }
  isIgnored(t, e) {
    const i = t.toLowerCase();
    return e.some((s) => i.includes(s.toLowerCase()));
  }
  async loadRegistries() {
    if (!(!this.hass || this.registryLoading || this.entityRegistry.length || this.registryError)) {
      this.registryLoading = !0;
      try {
        const [t, e] = await Promise.all([
          this.hass.callWS({ type: "config/entity_registry/list" }),
          this.hass.callWS({ type: "config/device_registry/list" })
        ]);
        this.entityRegistry = t, this.deviceRegistry = e;
      } catch {
        this.registryError = !0;
      } finally {
        this.registryLoading = !1, this.registryVersion += 1;
      }
    }
  }
};
Z.properties = {
  hass: { attribute: !1 },
  config: { attribute: !1 },
  registryVersion: { state: !0 }
}, Z.styles = y`
    ha-card {
      background: rgba(68, 115, 158, 1);
      border: none;
      border-radius: 20px;
      color: white;
      overflow: hidden;
      --primary-color: white;
      --paper-item-icon-color: white;
      --secondary-text-color: white;
    }

    .card {
      padding: 12px;
    }

    h2 {
      color: white;
      font-size: 22px;
      font-weight: 400;
      line-height: 1.2;
      margin: 12px 4px 18px;
    }

    .devices {
      display: grid;
      gap: 2px;
    }

    .device-row {
      align-items: center;
      background: transparent;
      border: 0;
      color: white;
      cursor: pointer;
      display: grid;
      font: inherit;
      gap: 20px;
      grid-template-columns: 36px minmax(0, 1fr);
      min-height: 46px;
      padding: 4px 8px;
      text-align: left;
      width: 100%;
    }

    .device-row:active {
      filter: brightness(1.08);
    }

    .device-row:focus {
      outline: none;
    }

    .device-row:focus-visible {
      outline: 2px solid white;
      outline-offset: -2px;
    }

    .device-row ha-icon {
      justify-self: center;
      --mdc-icon-size: 20px;
    }

    .row-text {
      display: grid;
      gap: 3px;
      min-width: 0;
    }

    .name {
      font-size: 14px;
      line-height: 1.25;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .detail {
      color: rgba(255, 255, 255, 0.76);
      font-size: 12px;
      line-height: 1.25;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  `;
let St = Z;
customElements.define("possible-issues-card", St);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "possible-issues-card",
  name: "Possible Issues Card",
  description: "Lists devices with unavailable entities and entities matching configurable value checks"
});
const Xt = "/config/dashboard", Ye = [
  {
    icon: "mdi:home",
    label: "Home",
    color: "#86a9f8",
    tap_action: { action: "navigate", navigation_path: "/lovelace/home" }
  },
  {
    icon: "mdi:lightbulb",
    label: "Lights",
    color: "#ffd34c",
    tap_action: { action: "navigate", navigation_path: "/lovelace/lights" }
  },
  {
    icon: "mdi:shield",
    label: "Secur...",
    color: "#7fd493",
    tap_action: { action: "navigate", navigation_path: "/lovelace/security" }
  },
  {
    icon: "mdi:keyboard",
    label: "Lab",
    color: "#7c3cff",
    tap_action: { action: "navigate", navigation_path: "/lovelace/lab" }
  }
], Qt = [
  { value: "more-info", label: "More info" },
  { value: "toggle", label: "Toggle" },
  { value: "navigate", label: "Navigate" },
  { value: "url", label: "URL" },
  { value: "call-service", label: "Call service" },
  { value: "fire-dom-event", label: "Fire DOM event" },
  { value: "none", label: "None" }
], Y = class Y extends f {
  constructor() {
    super(...arguments), this.config = {}, this.serviceDataErrors = {};
  }
  connectedCallback() {
    super.connectedCallback(), this.loadHomeAssistantPickers();
  }
  setConfig(t) {
    this.config = {
      weather_tap_action: { action: "more-info" },
      show_temperature: !0,
      use_ha_weather_icons: !1,
      settings_navigation_path: Xt,
      tabs: Ye,
      ...t
    };
  }
  shouldUpdate(t) {
    return t.has("config") ? !0 : t.has("hass") ? !t.get("hass") && !!this.hass : !1;
  }
  render() {
    return l`
      <div class="editor">
        <div class="grid">
          ${A({
      hass: this.hass,
      label: "Weather entity",
      value: String(this.config.weather_entity || ""),
      domains: ["weather"],
      onValueChanged: (t) => this.updateConfigValue("weather_entity", t)
    })}
          ${this.renderCheckbox("Show temperature", "show_temperature")}
          ${this.renderCheckbox("Use Home Assistant weather icons", "use_ha_weather_icons")}
          ${A({
      hass: this.hass,
      label: "Temperature entity override",
      value: String(this.config.temperature_entity || ""),
      domains: ["sensor"],
      disabled: !this.config.show_temperature,
      onValueChanged: (t) => this.updateConfigValue("temperature_entity", t)
    })}
          ${M({
      label: "Settings navigation path",
      value: String(this.config.settings_navigation_path || ""),
      placeholder: Xt,
      onInput: (t) => this.updateConfigValue("settings_navigation_path", t)
    })}
        </div>

        ${this.renderWeatherActionEditor("Weather tap action", this.config.weather_tap_action || { action: "more-info" })}

        <section>
          <div class="section-header">
            <h3>Tabs</h3>
            <button type="button" @click=${this.addTab}>Add tab</button>
          </div>
          <div class="tabs-editor">${(this.config.tabs || []).map((t, e) => this.renderTab(t, e))}</div>
        </section>
      </div>
    `;
  }
  renderTab(t, e) {
    return l`
      <fieldset class="tab-editor">
        <legend>Tab ${e + 1}</legend>

        <div class="tab-controls">
          <button type="button" ?disabled=${e === 0} @click=${() => this.moveTab(e, -1)}>
            Move up
          </button>
          <button
            type="button"
            ?disabled=${e === (this.config.tabs || []).length - 1}
            @click=${() => this.moveTab(e, 1)}
          >
            Move down
          </button>
          <button type="button" @click=${() => this.removeTab(e)}>Remove</button>
        </div>

        <div class="grid">
          ${this.renderTabIconPicker(e, t.icon || "mdi:shape")}
          ${this.renderTabTextField(e, "label", "Label", "Home")}
          ${this.renderTabTextField(e, "color", "Color", "#86a9f8")}
        </div>

        ${this.renderTabActionEditor("Tap action", e, t.tap_action || { action: "none" })}
      </fieldset>
    `;
  }
  renderCheckbox(t, e) {
    return l`
      <label class="checkbox">
        <input
          type="checkbox"
          .checked=${!!this.config[e]}
          @change=${(i) => this.updateConfigValue(e, i.target.checked)}
        />
        <span>${t}</span>
      </label>
    `;
  }
  renderTabIconPicker(t, e) {
    const i = this.getTab(t);
    return l`
      <div class="field">
        <ha-icon-picker
          .hass=${this.hass}
          .label=${"Icon"}
          .value=${i.icon || e}
          @value-changed=${(s) => this.updateTabValue(t, "icon", s.detail.value)}
        ></ha-icon-picker>
      </div>
    `;
  }
  renderTabTextField(t, e, i, s = "") {
    const a = this.getTab(t);
    return l`
      <label>
        <span>${i}</span>
        <input
          .value=${String(a[e] || "")}
          placeholder=${s}
          @input=${(r) => this.updateTabValue(t, e, r.target.value)}
        />
      </label>
    `;
  }
  renderTabActionEditor(t, e, i) {
    const s = this.getServiceDataErrorKey(e);
    return $t({
      label: t,
      className: "action-editor",
      actionConfig: i,
      actionOptions: Qt,
      onActionTypeChanged: (a) => this.updateTabActionType(e, a),
      onActionValueChanged: (a, r) => this.updateTabActionValue(e, a, r),
      onServiceDataChanged: (a) => this.updateServiceData(e, a),
      formatJson: (a) => this.formatJson(a),
      serviceDataError: this.serviceDataErrors[s]
    });
  }
  renderWeatherActionEditor(t, e) {
    const i = this.getWeatherServiceDataErrorKey();
    return $t({
      label: t,
      className: "action-editor",
      actionConfig: e,
      actionOptions: Qt,
      onActionTypeChanged: (s) => this.updateWeatherActionType(s),
      onActionValueChanged: (s, a) => this.updateWeatherActionValue(s, a),
      onServiceDataChanged: (s) => this.updateWeatherServiceData(s),
      formatJson: (s) => this.formatJson(s),
      serviceDataError: this.serviceDataErrors[i]
    });
  }
  updateConfigValue(t, e) {
    const i = {
      ...this.config,
      [t]: e === "" ? void 0 : e
    };
    this.updateConfig(i);
  }
  updateTabValue(t, e, i) {
    this.updateTab(t, {
      ...this.getTab(t),
      [e]: i || void 0
    });
  }
  updateTabActionType(t, e) {
    this.updateTab(t, {
      ...this.getTab(t),
      tap_action: { action: e }
    });
  }
  updateWeatherActionType(t) {
    this.updateConfig({
      ...this.config,
      weather_tap_action: { action: t }
    });
  }
  updateTabActionValue(t, e, i) {
    this.updateTab(t, {
      ...this.getTab(t),
      tap_action: {
        ...this.getTab(t).tap_action || { action: "none" },
        [e]: i || void 0
      }
    });
  }
  updateWeatherActionValue(t, e) {
    this.updateConfig({
      ...this.config,
      weather_tap_action: {
        ...this.config.weather_tap_action || { action: "more-info" },
        [t]: e || void 0
      }
    });
  }
  updateServiceData(t, e) {
    const i = e.trim(), s = this.getServiceDataErrorKey(t);
    if (!i) {
      this.serviceDataErrors = { ...this.serviceDataErrors, [s]: void 0 }, this.updateTabActionValue(t, "service_data", "");
      return;
    }
    try {
      const a = JSON.parse(i);
      this.serviceDataErrors = { ...this.serviceDataErrors, [s]: void 0 }, this.updateTab(t, {
        ...this.getTab(t),
        tap_action: {
          ...this.getTab(t).tap_action || { action: "call-service" },
          service_data: a
        }
      });
    } catch {
      this.serviceDataErrors = {
        ...this.serviceDataErrors,
        [s]: "Service data must be valid JSON."
      }, this.requestUpdate();
    }
  }
  updateWeatherServiceData(t) {
    const e = t.trim(), i = this.getWeatherServiceDataErrorKey();
    if (!e) {
      this.serviceDataErrors = { ...this.serviceDataErrors, [i]: void 0 }, this.updateWeatherActionValue("service_data", "");
      return;
    }
    try {
      const s = JSON.parse(e);
      this.serviceDataErrors = { ...this.serviceDataErrors, [i]: void 0 }, this.updateConfig({
        ...this.config,
        weather_tap_action: {
          ...this.config.weather_tap_action || { action: "call-service" },
          service_data: s
        }
      });
    } catch {
      this.serviceDataErrors = {
        ...this.serviceDataErrors,
        [i]: "Service data must be valid JSON."
      }, this.requestUpdate();
    }
  }
  addTab() {
    this.updateConfig({
      ...this.config,
      tabs: [
        ...this.config.tabs || [],
        {
          icon: "mdi:shape",
          label: "New tab",
          color: "#86a9f8",
          tap_action: { action: "none" }
        }
      ]
    });
  }
  removeTab(t) {
    this.updateConfig({
      ...this.config,
      tabs: (this.config.tabs || []).filter((e, i) => i !== t)
    });
  }
  moveTab(t, e) {
    const i = [...this.config.tabs || []], s = t + e;
    s < 0 || s >= i.length || ([i[t], i[s]] = [i[s], i[t]], this.updateConfig({
      ...this.config,
      tabs: i
    }));
  }
  updateTab(t, e) {
    const i = [...this.config.tabs || []];
    i[t] = e, this.updateConfig({
      ...this.config,
      tabs: i
    });
  }
  getTab(t) {
    return (this.config.tabs || [])[t] || {};
  }
  getServiceDataErrorKey(t) {
    return `tab-${t}`;
  }
  getWeatherServiceDataErrorKey() {
    return "weather";
  }
  formatJson(t) {
    return t ? JSON.stringify(t, null, 2) : "";
  }
  updateConfig(t) {
    this.config = t, _(this, "config-changed", { config: t });
  }
  async loadHomeAssistantPickers() {
    const t = window.loadCardHelpers;
    if (customElements.get("ha-entity-picker") && customElements.get("ha-icon-picker") || !t)
      return;
    await (await (await t()).createCardElement({
      type: "entities",
      entities: []
    })).constructor.getConfigElement(), this.requestUpdate();
  }
};
Y.properties = {
  hass: { attribute: !1 },
  config: { attribute: !1 }
}, Y.styles = y`
    .editor {
      display: grid;
      gap: 18px;
    }

    .grid {
      display: grid;
      gap: 12px;
    }

    section {
      display: grid;
      gap: 12px;
    }

    .section-header {
      align-items: center;
      display: flex;
      gap: 12px;
      justify-content: space-between;
    }

    h3 {
      color: var(--primary-text-color);
      font-size: 16px;
      margin: 0;
    }

    .tabs-editor {
      display: grid;
      gap: 12px;
    }

    .tab-controls {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    label {
      display: grid;
      gap: 6px;
    }

    .checkbox {
      align-items: center;
      display: flex;
      gap: 10px;
    }

    .checkbox input {
      min-height: auto;
      width: auto;
    }

    .field {
      display: block;
    }

    ha-entity-picker,
    ha-icon-picker {
      display: block;
      width: 100%;
    }

    label span,
    legend {
      color: var(--secondary-text-color);
      font-size: 12px;
      font-weight: 500;
    }

    button,
    input,
    select,
    textarea {
      font: inherit;
    }

    button {
      background: var(--card-background-color, #fff);
      border: 1px solid var(--divider-color, #ddd);
      border-radius: 6px;
      color: var(--primary-text-color);
      cursor: pointer;
      min-height: 36px;
      padding: 7px 10px;
    }

    button:disabled {
      cursor: default;
      opacity: 0.45;
    }

    input,
    select,
    textarea {
      background: var(--card-background-color, #fff);
      border: 1px solid var(--divider-color, #ddd);
      border-radius: 6px;
      box-sizing: border-box;
      color: var(--primary-text-color);
      min-height: 40px;
      padding: 8px 10px;
      width: 100%;
    }

    textarea {
      min-height: 86px;
      resize: vertical;
    }

    fieldset {
      border: 1px solid var(--divider-color, #ddd);
      border-radius: 10px;
      display: grid;
      gap: 12px;
      margin: 0;
      padding: 12px;
    }

    .action-editor {
      background: color-mix(in srgb, var(--card-background-color, #fff) 86%, transparent);
    }

    .error {
      color: var(--error-color, #db4437);
      font-size: 12px;
    }
  `;
let At = Y;
customElements.define("welcome-card-editor", At);
const B = "/config/dashboard", gt = { action: "more-info" }, Xe = { action: "none" }, Qe = "welcome-card:collapsed", te = [
  {
    icon: "mdi:home",
    label: "Home",
    color: "#86a9f8",
    tap_action: { action: "navigate", navigation_path: "/lovelace/home" }
  },
  {
    icon: "mdi:lightbulb",
    label: "Lights",
    color: "#ffd34c",
    tap_action: { action: "navigate", navigation_path: "/lovelace/lights" }
  },
  {
    icon: "mdi:shield",
    label: "Secur...",
    color: "#7fd493",
    tap_action: { action: "navigate", navigation_path: "/lovelace/security" }
  },
  {
    icon: "mdi:keyboard",
    label: "Lab",
    color: "#7c3cff",
    tap_action: { action: "navigate", navigation_path: "/lovelace/lab" }
  }
], mt = {
  "clear-night": "🌙",
  cloudy: "☁️",
  exceptional: "🌞",
  fog: "🌫️",
  hail: "⛈️",
  lightning: "⚡",
  "lightning-rainy": "⛈️",
  partlycloudy: "⛅",
  pouring: "🌧️",
  rainy: "💧",
  snowy: "❄️",
  "snowy-rainy": "🌨️",
  sunny: "☀️",
  windy: "🌪️",
  default: "🌡️"
}, ti = {
  "clear-night": "mdi:weather-night",
  cloudy: "mdi:weather-cloudy",
  exceptional: "mdi:alert-circle-outline",
  fog: "mdi:weather-fog",
  hail: "mdi:weather-hail",
  lightning: "mdi:weather-lightning",
  "lightning-rainy": "mdi:weather-lightning-rainy",
  partlycloudy: "mdi:weather-partly-cloudy",
  pouring: "mdi:weather-pouring",
  rainy: "mdi:weather-rainy",
  snowy: "mdi:weather-snowy",
  "snowy-rainy": "mdi:weather-snowy-rainy",
  sunny: "mdi:weather-sunny",
  windy: "mdi:weather-windy",
  "windy-variant": "mdi:weather-windy-variant"
}, X = class X extends D {
  constructor() {
    super(...arguments), this._collapsed = !1, this._now = /* @__PURE__ */ new Date();
  }
  static getConfigElement() {
    return document.createElement("welcome-card-editor");
  }
  static getStubConfig() {
    return {
      weather_entity: "",
      weather_tap_action: gt,
      show_temperature: !0,
      use_ha_weather_icons: !1,
      settings_navigation_path: B,
      tabs: te
    };
  }
  setConfig(t) {
    this.config = {
      weather_tap_action: gt,
      show_temperature: !0,
      use_ha_weather_icons: !1,
      settings_navigation_path: B,
      tabs: te,
      ...t
    }, this._collapsed = this.loadCollapsedState();
  }
  connectedCallback() {
    super.connectedCallback(), this.clockTimer = window.setInterval(() => {
      this._now = /* @__PURE__ */ new Date();
    }, 6e4);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this.clockTimer && (window.clearInterval(this.clockTimer), this.clockTimer = void 0);
  }
  shouldUpdate(t) {
    return t.has("_collapsed") || t.has("_now") ? !0 : super.shouldUpdate(t);
  }
  getWatchedEntities() {
    var t, e, i;
    return [
      (t = this.config) == null ? void 0 : t.weather_entity,
      (e = this.config) != null && e.show_temperature ? (i = this.config) == null ? void 0 : i.temperature_entity : void 0
    ].filter((s) => !!s);
  }
  render() {
    const t = this.config.tabs || [];
    return l`
      <ha-card>
        <div class="card">
          <div class="top-row">
            <button
              class="circle-button"
              type="button"
              aria-label=${this._collapsed ? "Expand welcome card" : "Collapse welcome card"}
              @click=${this.toggleCollapsed}
            >
              <ha-icon .icon=${this._collapsed ? "mdi:chevron-down" : "mdi:chevron-up"}></ha-icon>
            </button>

            <button
              class="date-pill"
              type="button"
              aria-label="Open weather details"
              @click=${this.handleWeatherTap}
            >
              ${this.renderWeatherIcon()}
              <span>${this.formatDate()}</span>
              ${this.config.show_temperature ? l`<span class="temperature">${this.formatTemperature()}</span>` : ""}
            </button>

            <button
              class="circle-button"
              type="button"
              aria-label="Open dashboard settings"
              @click=${this.handleSettingsTap}
            >
              <ha-icon icon="mdi:cog"></ha-icon>
            </button>
          </div>

          <div class="content">
            <h2>${this.getGreeting()},<br />${this.getUserName()}!</h2>
            ${!this._collapsed && t.length ? l`<div class="tabs">${t.map((e) => this.renderTab(e))}</div>` : ""}
          </div>
        </div>
      </ha-card>
    `;
  }
  renderTab(t) {
    const i = {
      "--tab-color": t.color || "var(--primary-color)"
    };
    return l`
      <button
        class="tab"
        style=${Nt(i)}
        type="button"
        aria-label=${t.label}
        @click=${() => this.runTabAction(t)}
      >
        <span class="tab-icon">
          <ha-icon .icon=${t.icon || "mdi:shape"}></ha-icon>
        </span>
        <span class="tab-label">${t.label || "Tab"}</span>
      </button>
    `;
  }
  toggleCollapsed() {
    this._collapsed = !this._collapsed, this.saveCollapsedState();
  }
  getStorageKey() {
    var e, i, s;
    const t = [
      ((e = this.config) == null ? void 0 : e.weather_entity) || "no-weather",
      ((i = this.config) == null ? void 0 : i.settings_navigation_path) || B,
      (((s = this.config) == null ? void 0 : s.tabs) || []).map((a) => a.label || "").join("|")
    ];
    return `${Qe}${t.join(":")}`;
  }
  loadCollapsedState() {
    try {
      return window.localStorage.getItem(this.getStorageKey()) === "true";
    } catch {
      return !1;
    }
  }
  saveCollapsedState() {
    try {
      window.localStorage.setItem(this.getStorageKey(), String(this._collapsed));
    } catch {
    }
  }
  handleSettingsTap() {
    S(
      this,
      this.hass,
      {},
      {
        action: "navigate",
        navigation_path: this.config.settings_navigation_path || B
      }
    );
  }
  handleWeatherTap() {
    const t = this.config.weather_tap_action || gt, e = t.entity || this.config.weather_entity || this.config.temperature_entity;
    !e && t.action === "more-info" || S(this, this.hass, e ? { entity: e } : {}, t);
  }
  runTabAction(t) {
    S(this, this.hass, {}, t.tap_action || Xe);
  }
  getGreeting() {
    const t = this._now.getHours();
    return t > 5 && t < 12 ? "Good morning" : t > 15 && t < 18 ? "Good afternoon" : "Good evening";
  }
  getUserName() {
    var t, e;
    return ((e = (t = this.hass) == null ? void 0 : t.user) == null ? void 0 : e.name) || "there";
  }
  getWeatherEntity() {
    var t, e;
    return this.config.weather_entity ? (e = (t = this.hass) == null ? void 0 : t.states) == null ? void 0 : e[this.config.weather_entity] : void 0;
  }
  getTemperatureEntity() {
    var t, e;
    return this.config.temperature_entity ? (e = (t = this.hass) == null ? void 0 : t.states) == null ? void 0 : e[this.config.temperature_entity] : void 0;
  }
  getWeatherIcon() {
    var e;
    const t = (e = this.getWeatherEntity()) == null ? void 0 : e.state;
    return t && ti[t] || "mdi:weather-cloudy";
  }
  getWeatherEmoji() {
    var e;
    const t = (e = this.getWeatherEntity()) == null ? void 0 : e.state;
    return t && mt[t] || mt.default;
  }
  renderWeatherIcon() {
    return this.config.use_ha_weather_icons ? l`<ha-icon .icon=${this.getWeatherIcon()}></ha-icon>` : l`<span class="weather-emoji" aria-hidden="true">${this.getWeatherEmoji()}</span>`;
  }
  formatDate() {
    var e, i;
    const t = (i = (e = this.hass) == null ? void 0 : e.locale) == null ? void 0 : i.language;
    return new Intl.DateTimeFormat(t, {
      month: "short",
      day: "numeric"
    }).format(this._now);
  }
  formatTemperature() {
    var s, a, r, n, c, h;
    const t = this.getTemperatureEntity();
    if (t)
      return this.formatTemperatureValue(
        t.state,
        (s = t.attributes) == null ? void 0 : s.unit_of_measurement
      );
    const e = this.getWeatherEntity(), i = (a = e == null ? void 0 : e.attributes) == null ? void 0 : a.temperature;
    return i == null || i === "" ? "-" : this.formatTemperatureValue(
      i,
      ((r = e == null ? void 0 : e.attributes) == null ? void 0 : r.temperature_unit) || ((h = (c = (n = this.hass) == null ? void 0 : n.config) == null ? void 0 : c.unit_system) == null ? void 0 : h.temperature)
    );
  }
  formatTemperatureValue(t, e) {
    const i = String(t), s = this.formatTemperatureUnit(e);
    return `${i}${s}`;
  }
  formatTemperatureUnit(t) {
    return t ? t.startsWith("°") ? t : t === "C" || t === "F" ? `°${t}` : t : "°";
  }
};
X.properties = {
  hass: { attribute: !1 },
  config: { attribute: !1 },
  _collapsed: { state: !0 },
  _now: { state: !0 }
}, X.styles = y`
    ha-card {
      background: var(--card-background-color);
      border: none;
      border-radius: 20px;
      color: var(--primary-text-color);
      overflow: hidden;
    }

    .card {
      padding: 17px 19px 14px;
    }

    .top-row {
      align-items: center;
      display: grid;
      gap: 12px;
      grid-template-columns: 36px minmax(0, 1fr) 36px;
    }

    .circle-button,
    .date-pill {
      align-items: center;
      background: #242424;
      border: 0;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.45);
      color: rgb(221, 221, 221);
      display: inline-flex;
      justify-content: center;
    }

    .circle-button {
      border-radius: 999px;
      cursor: pointer;
      height: 36px;
      padding: 0;
      transition: filter 120ms ease, transform 120ms ease;
      width: 36px;
    }

    .circle-button:active,
    .tab:active {
      filter: brightness(1.08);
      transform: scale(0.98);
    }

    .circle-button:focus,
    .tab:focus {
      outline: none;
    }

    .circle-button:focus-visible,
    .tab:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 3px;
    }

    .circle-button ha-icon {
      --mdc-icon-size: 18px;
    }

    .date-pill {
      border-radius: 999px;
      box-sizing: border-box;
      cursor: pointer;
      font-size: 14px;
      font-weight: 800;
      gap: 5px;
      justify-self: center;
      line-height: 1;
      min-height: 36px;
      min-width: 125px;
      padding: 0 18px;
    }

    .date-pill ha-icon {
      --mdc-icon-size: 14px;
    }

    .weather-emoji {
      font-size: 13px;
      line-height: 1;
    }

    .temperature::before {
      content: "\\00b7";
      margin: 0 6px 0 1px;
      opacity: 0.55;
    }

    .content {
      margin-top: 17px;
      font-weight: bold;
      font-size: 24px;
    }

    h2 {
      color: #ddd;
      font-size: 20px;
      font-weight: 800;
      letter-spacing: -0.03em;
      line-height: 1.2;
      margin: 0;
    }

    .tabs {
      display: grid;
      grid-template-columns: repeat(4, 55px);
      justify-content: space-between;
      margin-top: 16px;
    }

    .tab {
      align-items: center;
      background: #202020;
      border: 0;
      border-radius: 29px;
      box-shadow: 0 5px 12px rgba(0, 0, 0, 0.38);
      color: rgb(221, 221, 221);
      cursor: pointer;
      display: grid;
      gap: 8px;
      justify-items: center;
      min-height: 74px;
      padding: 6px 5px 10px;
      transition: filter 120ms ease, transform 120ms ease;
    }

    .tab-icon {
      align-items: center;
      background: color-mix(in srgb, var(--tab-color) 28%, transparent);
      border-radius: 999px;
      color: var(--tab-color);
      display: flex;
      height: 43px;
      justify-content: center;
      width: 43px;
    }

    .tab-icon ha-icon {
      --mdc-icon-size: 22px;
    }

    .tab-label {
      font-size: 12px;
      font-weight: 800;
      line-height: 1.1;
      max-width: 48px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    @media (max-width: 720px) {
      .card {
        padding: 17px 19px 14px;
      }

      .top-row {
        grid-template-columns: 36px minmax(0, 1fr) 36px;
      }

      .circle-button {
        height: 36px;
        width: 36px;
      }

      .circle-button ha-icon {
        --mdc-icon-size: 18px;
      }

      .date-pill {
        font-size: 16px;
        min-height: 36px;
        min-width: 125px;
        padding: 0 18px;
      }

      h2 {
        font-size: 20px;
      }

      .tabs {
        grid-template-columns: repeat(4, 55px);
      }

      .tab {
        min-height: 74px;
      }

      .tab-icon {
        height: 43px;
        width: 43px;
      }

      .tab-icon ha-icon {
        --mdc-icon-size: 22px;
      }

      .tab-label {
        font-size: 12px;
      }
    }
  `;
let Tt = X;
customElements.define("welcome-card", Tt);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "welcome-card",
  name: "Welcome Card",
  description: "Greeting, weather/date pill, and quick-action tabs"
});
const ee = "mdi:thermostat", ie = "#fbb73c", se = "#3a8dde", ae = "two_rows", Q = class Q extends f {
  constructor() {
    super(...arguments), this.config = {};
  }
  connectedCallback() {
    super.connectedCallback(), this.loadHomeAssistantPickers();
  }
  setConfig(t) {
    this.config = {
      icon: ee,
      compact: !1,
      show_controls: !0,
      show_modes: !1,
      show_presets: !1,
      show_fan_mode: !1,
      show_off_mode: !1,
      modes: [],
      presets: [],
      dual_setpoint_layout: ae,
      step_amount: void 0,
      heating_color: ie,
      cooling_color: se,
      ...t
    };
  }
  shouldUpdate(t) {
    return t.has("config") ? !0 : t.has("hass") ? !t.get("hass") && !!this.hass : !1;
  }
  render() {
    var s, a;
    const t = this.getSelectedEntity(), e = this.asStringArray((s = t == null ? void 0 : t.attributes) == null ? void 0 : s.hvac_modes).filter((r) => r !== "off"), i = this.asStringArray((a = t == null ? void 0 : t.attributes) == null ? void 0 : a.preset_modes);
    return l`
      <div class="editor">
        <div class="grid">
          ${M({
      label: "Name",
      value: String(this.config.name || ""),
      placeholder: "Thermostat",
      onInput: (r) => this.updateConfigValue("name", r)
    })}
          ${A({
      hass: this.hass,
      label: "Climate entity",
      value: String(this.config.entity || ""),
      domains: ["climate"],
      onValueChanged: (r) => this.updateConfigValue("entity", r)
    })}
          ${q({
      hass: this.hass,
      label: "Icon",
      value: String(this.config.icon || ""),
      fallback: ee,
      onValueChanged: (r) => this.updateConfigValue("icon", r)
    })}
        </div>

        <fieldset>
          <legend>Layout</legend>
          ${this.renderToggle("Compact header only", "compact")}
          ${this.renderToggle("Show temperature controls", "show_controls")}
          ${this.renderToggle("Show HVAC mode buttons", "show_modes")}
          ${this.renderToggle("Show preset buttons", "show_presets")}
          ${this.renderToggle("Show fan mode button", "show_fan_mode")}
          ${this.renderToggle("Show off mode button", "show_off_mode")}
          ${this.renderDualLayoutSelect()}
          ${this.renderNumberInput("Step amount", "step_amount", "Entity target_temp_step")}
        </fieldset>

        <fieldset>
          <legend>Colors</legend>
          ${this.renderColorInput("Heating background", "heating_color", ie)}
          ${this.renderColorInput("Cooling background", "cooling_color", se)}
        </fieldset>

        <fieldset>
          <legend>HVAC Modes</legend>
          ${this.renderOptionList({
      options: e,
      selected: this.asStringArray(this.config.modes),
      emptyMessage: this.config.entity ? "This entity does not expose HVAC modes." : "Pick a climate entity to choose modes.",
      onChanged: (r) => this.updateConfigValue("modes", r)
    })}
        </fieldset>

        <fieldset>
          <legend>Preset Modes</legend>
          ${this.renderOptionList({
      options: i,
      selected: this.asStringArray(this.config.presets),
      emptyMessage: this.config.entity ? "This entity does not expose preset modes." : "Pick a climate entity to choose presets.",
      onChanged: (r) => this.updateConfigValue("presets", r)
    })}
        </fieldset>
      </div>
    `;
  }
  renderToggle(t, e) {
    return l`
      <label class="toggle">
        <span>${t}</span>
        <input
          type="checkbox"
          .checked=${!!this.config[e]}
          @change=${(i) => this.updateConfigValue(e, i.target.checked)}
        />
      </label>
    `;
  }
  renderDualLayoutSelect() {
    const t = [
      { value: "two_rows", label: "Two rows" },
      { value: "single_row_toggle", label: "Single row with toggle" },
      { value: "side_by_side", label: "Side by side" }
    ];
    return l`
      <label>
        <span>Dual setpoint layout</span>
        <select
          .value=${this.config.dual_setpoint_layout || ae}
          @change=${(e) => this.updateConfigValue("dual_setpoint_layout", e.target.value)}
        >
          ${t.map((e) => l`
            <option value=${e.value} ?selected=${e.value === this.config.dual_setpoint_layout}>
              ${e.label}
            </option>
          `)}
        </select>
      </label>
    `;
  }
  renderColorInput(t, e, i) {
    const s = this.toColorInputValue(String(this.config[e] || i), i);
    return l`
      <label>
        <span>${t}</span>
        <input
          type="color"
          .value=${s}
          @input=${(a) => this.updateConfigValue(e, a.target.value)}
        />
      </label>
    `;
  }
  renderNumberInput(t, e, i) {
    const s = this.config[e] === void 0 ? "" : String(this.config[e]);
    return l`
      <label>
        <span>${t}</span>
        <input
          type="number"
          min="0.1"
          step="0.1"
          .value=${s}
          placeholder=${i}
          @input=${(a) => this.updateNumberConfigValue(e, a.target.value)}
        />
      </label>
    `;
  }
  renderOptionList(t) {
    const { options: e, selected: i, emptyMessage: s, onChanged: a } = t;
    return e.length ? l`
      <div class="option-list">
        ${e.map((r) => {
      const n = i.includes(r);
      return l`
            <label class="checkbox-row">
              <input
                type="checkbox"
                .checked=${n}
                @change=${(c) => this.updateOptionList(e, i, r, c.target.checked, a)}
              />
              <span>${this.toLabel(r)}</span>
            </label>
          `;
    })}
      </div>
    ` : l`<div class="hint">${s}</div>`;
  }
  updateOptionList(t, e, i, s, a) {
    const r = s ? [...e, i] : e.filter((n) => n !== i);
    a(t.filter((n) => r.includes(n)));
  }
  updateConfigValue(t, e) {
    const i = this.normalizeConfigValue(e), s = {
      ...this.config,
      [t]: i
    };
    this.updateConfig(s);
  }
  updateNumberConfigValue(t, e) {
    const i = Number(e);
    this.updateConfigValue(t, e.trim() && Number.isFinite(i) && i > 0 ? i : void 0);
  }
  normalizeConfigValue(t) {
    return typeof t == "string" ? t.trim() || void 0 : Array.isArray(t) ? t.length ? t : void 0 : t;
  }
  updateConfig(t) {
    this.config = t, _(this, "config-changed", { config: t });
  }
  getSelectedEntity() {
    var e, i;
    const t = this.config.entity;
    return t ? (i = (e = this.hass) == null ? void 0 : e.states) == null ? void 0 : i[t] : void 0;
  }
  asStringArray(t) {
    return Array.isArray(t) ? t.filter((e) => typeof e == "string") : [];
  }
  toColorInputValue(t, e) {
    return /^#[0-9a-f]{6}$/i.test(t) ? t : e;
  }
  toLabel(t) {
    return t.replace(/_/g, " ").replace(/\b\w/g, (e) => e.toUpperCase());
  }
  async loadHomeAssistantPickers() {
    const t = window.loadCardHelpers;
    if (customElements.get("ha-entity-picker") && customElements.get("ha-icon-picker") || !t)
      return;
    await (await (await t()).createCardElement({
      type: "entities",
      entities: []
    })).constructor.getConfigElement(), this.requestUpdate();
  }
};
Q.properties = {
  hass: { attribute: !1 },
  config: { attribute: !1 }
}, Q.styles = y`
    .editor {
      display: grid;
      gap: 18px;
    }

    .grid {
      display: grid;
      gap: 12px;
    }

    label {
      display: grid;
      gap: 6px;
    }

    .field {
      display: block;
    }

    ha-entity-picker,
    ha-icon-picker {
      display: block;
      width: 100%;
    }

    label span,
    legend {
      color: var(--secondary-text-color);
      font-size: 12px;
      font-weight: 500;
    }

    input,
    select {
      background: var(--card-background-color, #fff);
      border: 1px solid var(--divider-color, #ddd);
      border-radius: 6px;
      box-sizing: border-box;
      color: var(--primary-text-color);
      font: inherit;
      min-height: 40px;
      padding: 8px 10px;
      width: 100%;
    }

    input[type="checkbox"] {
      accent-color: var(--primary-color);
      min-height: auto;
      padding: 0;
      width: auto;
    }

    input[type="color"] {
      cursor: pointer;
      padding: 4px;
    }

    fieldset {
      border: 1px solid var(--divider-color, #ddd);
      border-radius: 10px;
      display: grid;
      gap: 12px;
      margin: 0;
      padding: 12px;
    }

    .toggle,
    .checkbox-row {
      align-items: center;
      display: flex;
      gap: 10px;
      justify-content: space-between;
    }

    .checkbox-row {
      justify-content: flex-start;
    }

    .option-list {
      display: grid;
      gap: 8px;
    }

    .hint {
      color: var(--secondary-text-color);
      font-size: 12px;
    }
  `;
let Et = Q;
customElements.define("thermostat-card-editor", Et);
const ft = "mdi:thermostat", bt = "#fbb73c", vt = "#3a8dde", _t = "two_rows", ei = 3e4, tt = class tt extends D {
  constructor() {
    super(...arguments), this.selectedDualTarget = "low", this.isCollapsed = !1;
  }
  static getConfigElement() {
    return document.createElement("thermostat-card-editor");
  }
  static getStubConfig() {
    return {
      entity: "",
      name: "Thermostat",
      icon: ft,
      show_controls: !0,
      show_modes: !1,
      show_presets: !1,
      show_fan_mode: !1,
      show_off_mode: !1,
      dual_setpoint_layout: _t,
      step_amount: void 0,
      heating_color: bt,
      cooling_color: vt
    };
  }
  setConfig(t) {
    if (!t.entity)
      throw new Error("Thermostat Card requires a climate entity");
    if (!t.entity.startsWith("climate."))
      throw new Error("Thermostat Card only supports climate entities");
    this.config = {
      icon: ft,
      show_controls: !0,
      show_modes: !1,
      show_presets: !1,
      show_fan_mode: !1,
      show_off_mode: !1,
      modes: [],
      presets: [],
      dual_setpoint_layout: _t,
      step_amount: void 0,
      heating_color: bt,
      cooling_color: vt,
      ...t
    };
  }
  getWatchedEntities() {
    var t;
    return (t = this.config) != null && t.entity ? [this.config.entity] : [];
  }
  shouldUpdate(t) {
    return t.has("selectedDualTarget") || t.has("isCollapsed") || t.has("optimisticState") ? !0 : super.shouldUpdate(t);
  }
  updated(t) {
    t.has("hass") && this.clearAcknowledgedOptimisticState();
  }
  render() {
    const t = this.getClimateEntity(), e = this.isHeating(t), i = this.isCooling(t), s = !!(this.config.compact || this.isCollapsed), a = !!this.config.show_controls && !s, r = !!this.config.show_modes && !s, n = !!this.config.show_presets && !s, c = {
      "--thermostat-heating-color": this.config.heating_color || bt,
      "--thermostat-cooling-color": this.config.cooling_color || vt
    };
    return l`
      <ha-card
        class=${`${e ? "heating" : ""} ${i ? "cooling" : ""}`}
        style=${Nt(c)}
      >
        <div class="card">
          ${this.renderHeader(t, s)}
          ${a ? this.renderControls(t) : ""}
          ${r ? this.renderModeRow(t) : ""}
          ${n ? this.renderPresetRow(t) : ""}
        </div>
      </ha-card>
    `;
  }
  renderHeader(t, e) {
    var a;
    const i = this.config.name || ((a = t == null ? void 0 : t.attributes) == null ? void 0 : a.friendly_name) || "Thermostat", s = this.getSubtitle(t);
    return l`
      <div class="header">
        <button
          class="thermostat-icon"
          type="button"
          aria-label=${e ? "Expand thermostat card" : "Collapse thermostat card"}
          aria-expanded=${e ? "false" : "true"}
          @click=${this.toggleCollapsed}
        >
          <ha-icon .icon=${this.config.icon || ft}></ha-icon>
        </button>

        <div class="heading">
          <div class="name">${i}</div>
          <div class="subtitle">${s}</div>
        </div>
      </div>
    `;
  }
  toggleCollapsed(t) {
    t.stopPropagation(), this.isCollapsed = !this.isCollapsed;
  }
  renderControls(t) {
    if (!t)
      return "";
    if (this.hasDualSetpoints(t))
      return this.renderDualControls(t);
    const e = this.getTargetTemperature(t);
    return e === void 0 ? "" : l`
      <div class="controls">
        ${this.renderSetpointRow(t, "single", e, "Target temperature")}
      </div>
    `;
  }
  renderDualControls(t) {
    const e = this.asNumber(t.attributes.target_temp_low), i = this.asNumber(t.attributes.target_temp_high), s = this.config.dual_setpoint_layout || _t;
    if (e === void 0 || i === void 0)
      return "";
    if (s === "single_row_toggle") {
      const a = this.selectedDualTarget === "low" ? e : i;
      return l`
        <div class="controls">
          <div class="target-toggle" role="group" aria-label="Setpoint target">
            ${this.renderTargetToggleButton("low", "Heat", e)}
            ${this.renderTargetToggleButton("high", "Cool", i)}
          </div>
          ${this.renderSetpointRow(t, this.selectedDualTarget, a, this.selectedDualTarget === "low" ? "Heat setpoint" : "Cool setpoint")}
        </div>
      `;
    }
    return s === "side_by_side" ? l`
        <div class="controls side-by-side">
          ${this.renderCompactSetpoint(t, "low", e, "Heat")}
          ${this.renderCompactSetpoint(t, "high", i, "Cool")}
        </div>
      ` : l`
      <div class="controls">
        ${this.renderSetpointRow(t, "high", i, "Cool setpoint")}
        ${this.renderSetpointRow(t, "low", e, "Heat setpoint")}
      </div>
    `;
  }
  renderSetpointRow(t, e, i, s) {
    return l`
      <div class="setpoint-row" aria-label=${s}>
        <button type="button" @click=${(a) => this.adjustTemperature(a, t, e, -1)} aria-label=${`Decrease ${s}`}>
          −
        </button>
        <div class="setpoint-value">${this.formatTemperature(i, t)}</div>
        <button type="button" @click=${(a) => this.adjustTemperature(a, t, e, 1)} aria-label=${`Increase ${s}`}>
          +
        </button>
      </div>
    `;
  }
  renderCompactSetpoint(t, e, i, s) {
    return l`
      <div class="compact-setpoint" aria-label=${`${s} setpoint`}>
        <div class="setpoint-label">${s}</div>
        <div class="compact-controls">
          <button type="button" @click=${(a) => this.adjustTemperature(a, t, e, -1)} aria-label=${`Decrease ${s} setpoint`}>
            −
          </button>
          <div class="setpoint-value">${this.formatTemperature(i, t)}</div>
          <button type="button" @click=${(a) => this.adjustTemperature(a, t, e, 1)} aria-label=${`Increase ${s} setpoint`}>
            +
          </button>
        </div>
      </div>
    `;
  }
  renderTargetToggleButton(t, e, i) {
    const s = this.selectedDualTarget === t;
    return l`
      <button
        class=${`target-toggle-button ${s ? "active" : ""}`}
        type="button"
        @click=${(a) => this.selectDualTarget(a, t)}
        aria-pressed=${s ? "true" : "false"}
      >
        <span>${e}</span>
        <span>${this.formatTemperature(i, this.getClimateEntity())}</span>
      </button>
    `;
  }
  renderModeRow(t) {
    if (!t)
      return "";
    const e = this.asStringArray(t.attributes.hvac_modes), s = this.asStringArray(this.config.modes).filter((r) => e.includes(r));
    this.config.show_off_mode && e.includes("off") && !s.includes("off") && s.push("off");
    const a = !!this.config.show_fan_mode && this.asStringArray(t.attributes.fan_modes).length > 0;
    return !s.length && !a ? "" : l`
      <div class="chip-row mode-row">
        ${s.map((r) => this.renderModeButton(t, r))}
        ${a ? this.renderFanButton(t) : ""}
      </div>
    `;
  }
  renderModeButton(t, e) {
    const i = t.state === e;
    return l`
      <button
        class=${`chip mode-chip mode-${this.getModeClass(e)} ${i ? "active" : ""}`}
        type="button"
        @click=${(s) => this.setHvacMode(s, e)}
        aria-pressed=${i ? "true" : "false"}
        title=${this.getModeLabel(e)}
      >
        <ha-icon .icon=${this.getModeIcon(e)}></ha-icon>
        <span>${this.getModeLabel(e)}</span>
      </button>
    `;
  }
  renderFanButton(t) {
    const e = String(t.attributes.fan_mode || ""), i = e ? this.toLabel(e) : "Fan";
    return l`
      <button
        class="chip mode-chip mode-fan"
        type="button"
        @click=${(s) => this.cycleFanMode(s, t)}
        title=${`Fan: ${i}`}
      >
        <ha-icon icon="mdi:fan"></ha-icon>
        <span>${i}</span>
      </button>
    `;
  }
  renderPresetRow(t) {
    if (!t)
      return "";
    const e = this.asStringArray(t.attributes.preset_modes), s = this.asStringArray(this.config.presets).filter((a) => e.includes(a));
    return s.length ? l`
      <div class="chip-row preset-row">
        ${s.map((a) => this.renderPresetButton(t, a))}
      </div>
    ` : "";
  }
  renderPresetButton(t, e) {
    const i = t.attributes.preset_mode === e;
    return l`
      <button
        class=${`chip preset-chip ${i ? "active" : ""}`}
        type="button"
        @click=${(s) => this.setPresetMode(s, e)}
        aria-pressed=${i ? "true" : "false"}
      >
        ${this.toLabel(e)}
      </button>
    `;
  }
  adjustTemperature(t, e, i, s) {
    t.stopPropagation();
    const a = i === "single" ? this.getTargetTemperature(e) : this.asNumber(e.attributes[i === "low" ? "target_temp_low" : "target_temp_high"]);
    if (a === void 0)
      return;
    const r = this.clampTemperature(e, a + this.getStep(e) * s), n = {
      entity_id: this.config.entity
    };
    if (i === "single")
      n.temperature = r, this.setOptimisticClimateState({
        attributes: { temperature: r }
      });
    else {
      const c = this.asNumber(e.attributes.target_temp_low), h = this.asNumber(e.attributes.target_temp_high);
      n.target_temp_low = i === "low" ? r : c, n.target_temp_high = i === "high" ? r : h, this.setOptimisticClimateState({
        attributes: {
          target_temp_low: n.target_temp_low,
          target_temp_high: n.target_temp_high
        }
      });
    }
    this.hass.callService("climate", "set_temperature", n);
  }
  selectDualTarget(t, e) {
    t.stopPropagation(), this.selectedDualTarget = e;
  }
  setHvacMode(t, e) {
    t.stopPropagation(), this.setOptimisticClimateState({ state: e }), this.hass.callService("climate", "set_hvac_mode", {
      entity_id: this.config.entity,
      hvac_mode: e
    });
  }
  setPresetMode(t, e) {
    t.stopPropagation(), this.setOptimisticClimateState({
      attributes: { preset_mode: e }
    }), this.hass.callService("climate", "set_preset_mode", {
      entity_id: this.config.entity,
      preset_mode: e
    });
  }
  cycleFanMode(t, e) {
    t.stopPropagation();
    const i = this.asStringArray(e.attributes.fan_modes);
    if (!i.length)
      return;
    const s = i.indexOf(String(e.attributes.fan_mode || "")), a = i[(s + 1) % i.length];
    this.setOptimisticClimateState({
      attributes: { fan_mode: a }
    }), this.hass.callService("climate", "set_fan_mode", {
      entity_id: this.config.entity,
      fan_mode: a
    });
  }
  getClimateEntity() {
    const t = this.getRawClimateEntity(), e = this.getOptimisticState();
    return !t || !e ? t : {
      ...t,
      state: e.state ?? t.state,
      attributes: {
        ...t.attributes,
        ...e.attributes || {}
      }
    };
  }
  getRawClimateEntity() {
    var t, e;
    return (e = (t = this.hass) == null ? void 0 : t.states) == null ? void 0 : e[this.config.entity];
  }
  getSubtitle(t) {
    if (!t)
      return "Unavailable";
    const e = this.formatTemperature(t.attributes.current_temperature, t), i = this.formatCurrentMode(t), s = this.formatCurrentAction(t);
    return `${e} • ${i}${s ? ` (${s})` : ""}`;
  }
  formatCurrentMode(t) {
    const e = this.hass.formatEntityState;
    return e ? e(t) : this.getModeLabel(t.state);
  }
  formatCurrentAction(t) {
    const e = t.attributes.hvac_action;
    if (!e)
      return "";
    const i = this.hass.formatEntityAttributeValue;
    return i ? i(t, "hvac_action") : this.toLabel(String(e));
  }
  formatTemperature(t, e) {
    var a;
    const i = this.asNumber(t), s = this.getTemperatureUnit(e);
    return i === void 0 ? `-${s}` : `${ge(i, (a = this.hass) == null ? void 0 : a.locale)}${s}`;
  }
  getTemperatureUnit(t) {
    var e, i, s, a;
    return ((e = t == null ? void 0 : t.attributes) == null ? void 0 : e.temperature_unit) || ((a = (s = (i = this.hass) == null ? void 0 : i.config) == null ? void 0 : s.unit_system) == null ? void 0 : a.temperature) || "";
  }
  getStep(t) {
    const e = this.asNumber(this.config.step_amount);
    if (e && e > 0)
      return e;
    const i = this.asNumber(t.attributes.target_temp_step);
    return i && i > 0 ? i : 0.5;
  }
  getTargetTemperature(t) {
    const e = this.asNumber(t.attributes.temperature);
    return e !== void 0 ? e : this.isIdle(t) ? this.asNumber(t.attributes.current_temperature) : void 0;
  }
  getOptimisticState() {
    var t;
    return ((t = this.optimisticState) == null ? void 0 : t.entityId) === this.config.entity ? this.optimisticState : void 0;
  }
  setOptimisticClimateState(t) {
    const e = this.getOptimisticState();
    this.optimisticState = {
      ...e,
      entityId: this.config.entity,
      state: t.state ?? (e == null ? void 0 : e.state),
      attributes: {
        ...(e == null ? void 0 : e.attributes) || {},
        ...t.attributes || {}
      }
    }, this.scheduleOptimisticStateClear();
  }
  scheduleOptimisticStateClear() {
    this.optimisticStateTimer && window.clearTimeout(this.optimisticStateTimer), this.optimisticStateTimer = window.setTimeout(() => {
      this.optimisticState = void 0, this.optimisticStateTimer = void 0;
    }, ei);
  }
  clearAcknowledgedOptimisticState() {
    const t = this.getRawClimateEntity(), e = this.getOptimisticState();
    if (!t || !e)
      return;
    const i = e.state === void 0 || t.state === e.state, s = Object.entries(e.attributes || {}).every(
      ([a, r]) => this.areValuesEqual(t.attributes[a], r)
    );
    i && s && (this.optimisticStateTimer && (window.clearTimeout(this.optimisticStateTimer), this.optimisticStateTimer = void 0), this.optimisticState = void 0);
  }
  areValuesEqual(t, e) {
    const i = this.asNumber(t), s = this.asNumber(e);
    return i !== void 0 && s !== void 0 ? i === s : t === e;
  }
  clampTemperature(t, e) {
    const i = this.asNumber(t.attributes.min_temp), s = this.asNumber(t.attributes.max_temp), a = i === void 0 ? e : Math.max(e, i), r = s === void 0 ? a : Math.min(a, s);
    return Number(r.toFixed(2));
  }
  hasDualSetpoints(t) {
    return this.asNumber(t.attributes.target_temp_low) !== void 0 && this.asNumber(t.attributes.target_temp_high) !== void 0;
  }
  isHeating(t) {
    var e;
    return ((e = t == null ? void 0 : t.attributes) == null ? void 0 : e.hvac_action) === "heating" || (t == null ? void 0 : t.state) === "heat";
  }
  isCooling(t) {
    var e;
    return ((e = t == null ? void 0 : t.attributes) == null ? void 0 : e.hvac_action) === "cooling" || (t == null ? void 0 : t.state) === "cool";
  }
  isIdle(t) {
    var e;
    return ((e = t == null ? void 0 : t.attributes) == null ? void 0 : e.hvac_action) === "idle" || (t == null ? void 0 : t.state) === "idle";
  }
  asNumber(t) {
    const e = Number(t);
    return t == null || t === "" || !Number.isFinite(e) ? void 0 : e;
  }
  asStringArray(t) {
    return Array.isArray(t) ? t.filter((e) => typeof e == "string") : [];
  }
  getModeIcon(t) {
    return {
      heat: "mdi:fire",
      cool: "mdi:snowflake",
      heat_cool: "mdi:sun-snowflake",
      auto: "mdi:autorenew",
      fan_only: "mdi:fan",
      dry: "mdi:water-percent",
      off: "mdi:power"
    }[t] || "mdi:thermostat";
  }
  getModeLabel(t) {
    return {
      heat: "Heat",
      cool: "Cool",
      heat_cool: "Heat/Cool",
      auto: "Auto",
      fan_only: "Fan",
      dry: "Dry",
      off: "Off"
    }[t] || this.toLabel(t);
  }
  getModeClass(t) {
    return {
      heat: "heat",
      cool: "cool",
      heat_cool: "heat-cool",
      auto: "auto",
      fan_only: "fan",
      dry: "dry",
      off: "off"
    }[t] || "default";
  }
  toLabel(t) {
    return t.replace(/_/g, " ").replace(/\b\w/g, (e) => e.toUpperCase());
  }
};
tt.properties = {
  hass: { attribute: !1 },
  config: { attribute: !1 },
  selectedDualTarget: { state: !0 },
  isCollapsed: { state: !0 },
  optimisticState: { state: !0 }
}, tt.styles = y`
    ha-card {
      --thermostat-heating-color: #fbb73c;
      --thermostat-cooling-color: #3a8dde;
      --thermostat-mode-heat-color: var(--error-color, #db4437);
      --thermostat-mode-cool-color: var(--thermostat-cooling-color);
      --thermostat-mode-heat-cool-color: var(--primary-color);
      --thermostat-mode-auto-color: var(--primary-color);
      --thermostat-mode-fan-color: var(--success-color, #43a047);
      --thermostat-mode-dry-color: var(--info-color, #00acc1);
      --thermostat-mode-off-color: var(--disabled-text-color);
      --thermostat-mode-default-color: var(--primary-color);
      --thermostat-card-background: var(--card-background-color);
      --thermostat-control-background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      --thermostat-control-active-background: color-mix(in srgb, var(--primary-text-color) 14%, transparent);
      --thermostat-icon-background: color-mix(in srgb, var(--primary-color) 16%, transparent);
      --thermostat-chip-color: var(--primary-color);
      --thermostat-text-color: var(--primary-text-color);
      --thermostat-secondary-text-color: var(--secondary-text-color);
      --thermostat-active-chip-text-color: var(--thermostat-text-color);
      background: var(--thermostat-card-background);
      border: none;
      border-radius: 20px;
      color: var(--thermostat-text-color);
      overflow: hidden;
    }

    ha-card.heating {
      --thermostat-card-background: var(--thermostat-heating-color);
      --thermostat-control-background: rgba(120, 82, 0, 0.16);
      --thermostat-control-active-background: rgba(120, 82, 0, 0.24);
      --thermostat-icon-background: #ffd8d6;
      --thermostat-chip-color: #ff4545;
      --thermostat-mode-heat-color: #ff713d;
      --thermostat-text-color: #000;
      --thermostat-secondary-text-color: rgba(0, 0, 0, 0.42);
      --thermostat-active-chip-text-color: #000;
    }

    ha-card.cooling {
      --thermostat-card-background: var(--thermostat-cooling-color);
      --thermostat-icon-background: color-mix(in srgb, var(--primary-text-color) 10%, transparent);
      --thermostat-chip-color: var(--thermostat-mode-cool-color);
    }

    .card {
      display: grid;
      gap: 12px;
      padding: 12px;
    }

    .header {
      align-items: center;
      display: flex;
      gap: 12px;
      min-width: 0;
    }

    .thermostat-icon {
      align-items: center;
      background: var(--thermostat-icon-background);
      border: 0;
      border-radius: 999px;
      color: var(--thermostat-chip-color);
      cursor: pointer;
      display: flex;
      flex: 0 0 auto;
      height: 42px;
      justify-content: center;
      padding: 0;
      width: 42px;
    }

    .thermostat-icon ha-icon {
      --mdc-icon-size: 20px;
    }

    .heading {
      min-width: 0;
    }

    .name {
      color: var(--thermostat-text-color);
      font-size: 14px;
      font-weight: 700;
      line-height: 1.15;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .subtitle {
      color: var(--thermostat-secondary-text-color);
      font-size: 12px;
      font-weight: 600;
      line-height: 1.25;
      margin-top: 2px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .controls {
      display: grid;
      gap: 12px;
    }

    .controls.side-by-side {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .setpoint-row {
      align-items: center;
      display: grid;
      gap: 12px;
      grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
    }

    .setpoint-row button,
    .compact-controls button,
    .target-toggle-button,
    .chip {
      align-items: center;
      background: var(--thermostat-control-background);
      border: 0;
      border-radius: 14px;
      color: var(--thermostat-text-color);
      cursor: pointer;
      display: inline-flex;
      font: inherit;
      justify-content: center;
      min-height: 42px;
      padding: 0 12px;
      transition: background 120ms ease, filter 120ms ease, transform 120ms ease;
    }

    .setpoint-row button,
    .compact-controls button {
      font-size: 28px;
      line-height: 1;
      width: 100%;
    }

    button:active {
      filter: brightness(1.08);
      transform: scale(0.99);
    }

    button:focus {
      outline: none;
    }

    button:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }

    .setpoint-value {
      color: var(--thermostat-text-color);
      font-size: 20px;
      font-weight: 500;
      min-width: 72px;
      text-align: center;
      white-space: nowrap;
    }

    .target-toggle {
      display: grid;
      gap: 8px;
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .target-toggle-button {
      flex-direction: column;
      gap: 2px;
      min-height: 48px;
    }

    .target-toggle-button.active {
      background: var(--thermostat-control-active-background);
    }

    .compact-setpoint {
      display: grid;
      gap: 8px;
      min-width: 0;
    }

    .setpoint-label {
      color: var(--thermostat-secondary-text-color);
      font-size: 12px;
      font-weight: 700;
      text-align: center;
    }

    .compact-controls {
      align-items: center;
      display: grid;
      gap: 6px;
      grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
    }

    .compact-controls .setpoint-value {
      font-size: 16px;
      min-width: 54px;
    }

    .chip-row {
      display: grid;
      gap: 8px;
      grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
    }

    .chip {
      gap: 8px;
      min-width: 0;
    }

    .chip ha-icon {
      --mdc-icon-size: 20px;
      flex: 0 0 auto;
    }

    .chip span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .mode-chip.active,
    .preset-chip.active {
      background: color-mix(in srgb, var(--thermostat-active-mode-color, var(--primary-color)) 72%, transparent);
      color: var(--thermostat-active-chip-text-color);
    }

    .mode-heat {
      --thermostat-active-mode-color: var(--thermostat-mode-heat-color);
    }

    .mode-cool {
      --thermostat-active-mode-color: var(--thermostat-mode-cool-color);
    }

    .mode-heat-cool {
      --thermostat-active-mode-color: var(--thermostat-mode-heat-cool-color);
    }

    .mode-auto {
      --thermostat-active-mode-color: var(--thermostat-mode-auto-color);
    }

    .mode-fan {
      --thermostat-active-mode-color: var(--thermostat-mode-fan-color);
    }

    .mode-dry {
      --thermostat-active-mode-color: var(--thermostat-mode-dry-color);
    }

    .mode-off {
      --thermostat-active-mode-color: var(--thermostat-mode-off-color);
    }

    .mode-default {
      --thermostat-active-mode-color: var(--thermostat-mode-default-color);
    }

    .preset-chip.active {
      --thermostat-active-mode-color: var(--primary-color);
    }

    @media (max-width: 420px) {
      .controls.side-by-side {
        grid-template-columns: 1fr;
      }

      .setpoint-row {
        gap: 8px;
      }

      .setpoint-value {
        font-size: 18px;
        min-width: 64px;
      }
    }
  `;
let kt = tt;
customElements.define("thermostat-card", kt);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "thermostat-card",
  name: "Thermostat Card",
  description: "Climate entity card with setpoints and modes"
});
