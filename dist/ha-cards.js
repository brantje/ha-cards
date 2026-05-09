/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const W = globalThis, yt = W.ShadowRoot && (W.ShadyCSS === void 0 || W.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, $t = Symbol(), St = /* @__PURE__ */ new WeakMap();
let Wt = class {
  constructor(t, e, i) {
    if (this._$cssResult$ = !0, i !== $t) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (yt && t === void 0) {
      const i = e !== void 0 && e.length === 1;
      i && (t = St.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && St.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const te = (n) => new Wt(typeof n == "string" ? n : n + "", void 0, $t), T = (n, ...t) => {
  const e = n.length === 1 ? n[0] : t.reduce((i, s, a) => i + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + n[a + 1], n[0]);
  return new Wt(e, n, $t);
}, ee = (n, t) => {
  if (yt) n.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const i = document.createElement("style"), s = W.litNonce;
    s !== void 0 && i.setAttribute("nonce", s), i.textContent = e.cssText, n.appendChild(i);
  }
}, Et = yt ? (n) => n : (n) => n instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const i of t.cssRules) e += i.cssText;
  return te(e);
})(n) : n;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: ie, defineProperty: se, getOwnPropertyDescriptor: ne, getOwnPropertyNames: ae, getOwnPropertySymbols: oe, getPrototypeOf: re } = Object, b = globalThis, Ct = b.trustedTypes, ce = Ct ? Ct.emptyScript : "", Y = b.reactiveElementPolyfillSupport, k = (n, t) => n, pt = { toAttribute(n, t) {
  switch (t) {
    case Boolean:
      n = n ? ce : null;
      break;
    case Object:
    case Array:
      n = n == null ? n : JSON.stringify(n);
  }
  return n;
}, fromAttribute(n, t) {
  let e = n;
  switch (t) {
    case Boolean:
      e = n !== null;
      break;
    case Number:
      e = n === null ? null : Number(n);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(n);
      } catch {
        e = null;
      }
  }
  return e;
} }, Bt = (n, t) => !ie(n, t), Tt = { attribute: !0, type: String, converter: pt, reflect: !1, useDefault: !1, hasChanged: Bt };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), b.litPropertyMetadata ?? (b.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let E = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = Tt) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const i = Symbol(), s = this.getPropertyDescriptor(t, i, e);
      s !== void 0 && se(this.prototype, t, s);
    }
  }
  static getPropertyDescriptor(t, e, i) {
    const { get: s, set: a } = ne(this.prototype, t) ?? { get() {
      return this[e];
    }, set(o) {
      this[e] = o;
    } };
    return { get: s, set(o) {
      const c = s == null ? void 0 : s.call(this);
      a == null || a.call(this, o), this.requestUpdate(t, c, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? Tt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(k("elementProperties"))) return;
    const t = re(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(k("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(k("properties"))) {
      const e = this.properties, i = [...ae(e), ...oe(e)];
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
      for (const s of i) e.unshift(Et(s));
    } else t !== void 0 && e.push(Et(t));
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
    return ee(t, this.constructor.elementStyles), t;
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
      const o = (((a = i.converter) == null ? void 0 : a.toAttribute) !== void 0 ? i.converter : pt).toAttribute(e, i.type);
      this._$Em = t, o == null ? this.removeAttribute(s) : this.setAttribute(s, o), this._$Em = null;
    }
  }
  _$AK(t, e) {
    var a, o;
    const i = this.constructor, s = i._$Eh.get(t);
    if (s !== void 0 && this._$Em !== s) {
      const c = i.getPropertyOptions(s), r = typeof c.converter == "function" ? { fromAttribute: c.converter } : ((a = c.converter) == null ? void 0 : a.fromAttribute) !== void 0 ? c.converter : pt;
      this._$Em = s;
      const l = r.fromAttribute(e, c.type);
      this[s] = l ?? ((o = this._$Ej) == null ? void 0 : o.get(s)) ?? l, this._$Em = null;
    }
  }
  requestUpdate(t, e, i, s = !1, a) {
    var o;
    if (t !== void 0) {
      const c = this.constructor;
      if (s === !1 && (a = this[t]), i ?? (i = c.getPropertyOptions(t)), !((i.hasChanged ?? Bt)(a, e) || i.useDefault && i.reflect && a === ((o = this._$Ej) == null ? void 0 : o.get(t)) && !this.hasAttribute(c._$Eu(t, i)))) return;
      this.C(t, e, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: i, reflect: s, wrapped: a }, o) {
    i && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, o ?? e ?? this[t]), a !== !0 || o !== void 0) || (this._$AL.has(t) || (this.hasUpdated || i || (e = void 0), this._$AL.set(t, e)), s === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
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
        for (const [a, o] of this._$Ep) this[a] = o;
        this._$Ep = void 0;
      }
      const s = this.constructor.elementProperties;
      if (s.size > 0) for (const [a, o] of s) {
        const { wrapped: c } = o, r = this[a];
        c !== !0 || this._$AL.has(a) || r === void 0 || this.C(a, void 0, o, r);
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
E.elementStyles = [], E.shadowRootOptions = { mode: "open" }, E[k("elementProperties")] = /* @__PURE__ */ new Map(), E[k("finalized")] = /* @__PURE__ */ new Map(), Y == null || Y({ ReactiveElement: E }), (b.reactiveElementVersions ?? (b.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const L = globalThis, It = (n) => n, B = L.trustedTypes, kt = B ? B.createPolicy("lit-html", { createHTML: (n) => n }) : void 0, Jt = "$lit$", m = `lit$${Math.random().toFixed(9).slice(2)}$`, Kt = "?" + m, le = `<${Kt}>`, x = document, O = () => x.createComment(""), U = (n) => n === null || typeof n != "object" && typeof n != "function", wt = Array.isArray, he = (n) => wt(n) || typeof (n == null ? void 0 : n[Symbol.iterator]) == "function", tt = `[ 	
\f\r]`, I = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Lt = /-->/g, Dt = />/g, _ = RegExp(`>|${tt}(?:([^\\s"'>=/]+)(${tt}*=${tt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Nt = /'/g, Ot = /"/g, qt = /^(?:script|style|textarea|title)$/i, de = (n) => (t, ...e) => ({ _$litType$: n, strings: t, values: e }), h = de(1), A = Symbol.for("lit-noChange"), p = Symbol.for("lit-nothing"), Ut = /* @__PURE__ */ new WeakMap(), y = x.createTreeWalker(x, 129);
function Gt(n, t) {
  if (!wt(n) || !n.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return kt !== void 0 ? kt.createHTML(t) : t;
}
const ue = (n, t) => {
  const e = n.length - 1, i = [];
  let s, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = I;
  for (let c = 0; c < e; c++) {
    const r = n[c];
    let l, d, u = -1, g = 0;
    for (; g < r.length && (o.lastIndex = g, d = o.exec(r), d !== null); ) g = o.lastIndex, o === I ? d[1] === "!--" ? o = Lt : d[1] !== void 0 ? o = Dt : d[2] !== void 0 ? (qt.test(d[2]) && (s = RegExp("</" + d[2], "g")), o = _) : d[3] !== void 0 && (o = _) : o === _ ? d[0] === ">" ? (o = s ?? I, u = -1) : d[1] === void 0 ? u = -2 : (u = o.lastIndex - d[2].length, l = d[1], o = d[3] === void 0 ? _ : d[3] === '"' ? Ot : Nt) : o === Ot || o === Nt ? o = _ : o === Lt || o === Dt ? o = I : (o = _, s = void 0);
    const f = o === _ && n[c + 1].startsWith("/>") ? " " : "";
    a += o === I ? r + le : u >= 0 ? (i.push(l), r.slice(0, u) + Jt + r.slice(u) + m + f) : r + m + (u === -2 ? c : f);
  }
  return [Gt(n, a + (n[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), i];
};
class H {
  constructor({ strings: t, _$litType$: e }, i) {
    let s;
    this.parts = [];
    let a = 0, o = 0;
    const c = t.length - 1, r = this.parts, [l, d] = ue(t, e);
    if (this.el = H.createElement(l, i), y.currentNode = this.el.content, e === 2 || e === 3) {
      const u = this.el.content.firstChild;
      u.replaceWith(...u.childNodes);
    }
    for (; (s = y.nextNode()) !== null && r.length < c; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const u of s.getAttributeNames()) if (u.endsWith(Jt)) {
          const g = d[o++], f = s.getAttribute(u).split(m), R = /([.?@])?(.*)/.exec(g);
          r.push({ type: 1, index: a, name: R[2], strings: f, ctor: R[1] === "." ? ge : R[1] === "?" ? fe : R[1] === "@" ? me : Q }), s.removeAttribute(u);
        } else u.startsWith(m) && (r.push({ type: 6, index: a }), s.removeAttribute(u));
        if (qt.test(s.tagName)) {
          const u = s.textContent.split(m), g = u.length - 1;
          if (g > 0) {
            s.textContent = B ? B.emptyScript : "";
            for (let f = 0; f < g; f++) s.append(u[f], O()), y.nextNode(), r.push({ type: 2, index: ++a });
            s.append(u[g], O());
          }
        }
      } else if (s.nodeType === 8) if (s.data === Kt) r.push({ type: 2, index: a });
      else {
        let u = -1;
        for (; (u = s.data.indexOf(m, u + 1)) !== -1; ) r.push({ type: 7, index: a }), u += m.length - 1;
      }
      a++;
    }
  }
  static createElement(t, e) {
    const i = x.createElement("template");
    return i.innerHTML = t, i;
  }
}
function C(n, t, e = n, i) {
  var o, c;
  if (t === A) return t;
  let s = i !== void 0 ? (o = e._$Co) == null ? void 0 : o[i] : e._$Cl;
  const a = U(t) ? void 0 : t._$litDirective$;
  return (s == null ? void 0 : s.constructor) !== a && ((c = s == null ? void 0 : s._$AO) == null || c.call(s, !1), a === void 0 ? s = void 0 : (s = new a(n), s._$AT(n, e, i)), i !== void 0 ? (e._$Co ?? (e._$Co = []))[i] = s : e._$Cl = s), s !== void 0 && (t = C(n, s._$AS(n, t.values), s, i)), t;
}
class pe {
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
    const { el: { content: e }, parts: i } = this._$AD, s = ((t == null ? void 0 : t.creationScope) ?? x).importNode(e, !0);
    y.currentNode = s;
    let a = y.nextNode(), o = 0, c = 0, r = i[0];
    for (; r !== void 0; ) {
      if (o === r.index) {
        let l;
        r.type === 2 ? l = new P(a, a.nextSibling, this, t) : r.type === 1 ? l = new r.ctor(a, r.name, r.strings, this, t) : r.type === 6 && (l = new be(a, this, t)), this._$AV.push(l), r = i[++c];
      }
      o !== (r == null ? void 0 : r.index) && (a = y.nextNode(), o++);
    }
    return y.currentNode = x, s;
  }
  p(t) {
    let e = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(t, i, e), e += i.strings.length - 2) : i._$AI(t[e])), e++;
  }
}
class P {
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
    t = C(this, t, e), U(t) ? t === p || t == null || t === "" ? (this._$AH !== p && this._$AR(), this._$AH = p) : t !== this._$AH && t !== A && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : he(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== p && U(this._$AH) ? this._$AA.nextSibling.data = t : this.T(x.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var a;
    const { values: e, _$litType$: i } = t, s = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = H.createElement(Gt(i.h, i.h[0]), this.options)), i);
    if (((a = this._$AH) == null ? void 0 : a._$AD) === s) this._$AH.p(e);
    else {
      const o = new pe(s, this), c = o.u(this.options);
      o.p(e), this.T(c), this._$AH = o;
    }
  }
  _$AC(t) {
    let e = Ut.get(t.strings);
    return e === void 0 && Ut.set(t.strings, e = new H(t)), e;
  }
  k(t) {
    wt(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let i, s = 0;
    for (const a of t) s === e.length ? e.push(i = new P(this.O(O()), this.O(O()), this, this.options)) : i = e[s], i._$AI(a), s++;
    s < e.length && (this._$AR(i && i._$AB.nextSibling, s), e.length = s);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    var i;
    for ((i = this._$AP) == null ? void 0 : i.call(this, !1, !0, e); t !== this._$AB; ) {
      const s = It(t).nextSibling;
      It(t).remove(), t = s;
    }
  }
  setConnected(t) {
    var e;
    this._$AM === void 0 && (this._$Cv = t, (e = this._$AP) == null || e.call(this, t));
  }
}
let Q = class {
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
    let o = !1;
    if (a === void 0) t = C(this, t, e, 0), o = !U(t) || t !== this._$AH && t !== A, o && (this._$AH = t);
    else {
      const c = t;
      let r, l;
      for (t = a[0], r = 0; r < a.length - 1; r++) l = C(this, c[i + r], e, r), l === A && (l = this._$AH[r]), o || (o = !U(l) || l !== this._$AH[r]), l === p ? t = p : t !== p && (t += (l ?? "") + a[r + 1]), this._$AH[r] = l;
    }
    o && !s && this.j(t);
  }
  j(t) {
    t === p ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
};
class ge extends Q {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === p ? void 0 : t;
  }
}
class fe extends Q {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== p);
  }
}
class me extends Q {
  constructor(t, e, i, s, a) {
    super(t, e, i, s, a), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = C(this, t, e, 0) ?? p) === A) return;
    const i = this._$AH, s = t === p && i !== p || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive, a = t !== p && (i === p || s);
    s && this.element.removeEventListener(this.name, this, i), a && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var e;
    typeof this._$AH == "function" ? this._$AH.call(((e = this.options) == null ? void 0 : e.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
let be = class {
  constructor(t, e, i) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    C(this, t);
  }
};
const et = L.litHtmlPolyfillSupport;
et == null || et(H, P), (L.litHtmlVersions ?? (L.litHtmlVersions = [])).push("3.3.2");
const ve = (n, t, e) => {
  const i = (e == null ? void 0 : e.renderBefore) ?? t;
  let s = i._$litPart$;
  if (s === void 0) {
    const a = (e == null ? void 0 : e.renderBefore) ?? null;
    i._$litPart$ = s = new P(t.insertBefore(O(), a), a, void 0, e ?? {});
  }
  return s._$AI(n), s;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const w = globalThis;
let v = class extends E {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = ve(e, this.renderRoot, this.renderOptions);
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
    return A;
  }
};
var jt;
v._$litElement$ = !0, v.finalized = !0, (jt = w.litElementHydrateSupport) == null || jt.call(w, { LitElement: v });
const it = w.litElementPolyfillSupport;
it == null || it({ LitElement: v });
(w.litElementVersions ?? (w.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const _e = { ATTRIBUTE: 1 }, ye = (n) => (...t) => ({ _$litDirective$: n, values: t });
let $e = class {
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
const Zt = "important", we = " !" + Zt, Xt = ye(class extends $e {
  constructor(n) {
    var t;
    if (super(n), n.type !== _e.ATTRIBUTE || n.name !== "style" || ((t = n.strings) == null ? void 0 : t.length) > 2) throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.");
  }
  render(n) {
    return Object.keys(n).reduce((t, e) => {
      const i = n[e];
      return i == null ? t : t + `${e = e.includes("-") ? e : e.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g, "-$&").toLowerCase()}:${i};`;
    }, "");
  }
  update(n, [t]) {
    const { style: e } = n.element;
    if (this.ft === void 0) return this.ft = new Set(Object.keys(t)), this.render(t);
    for (const i of this.ft) t[i] == null && (this.ft.delete(i), i.includes("-") ? e.removeProperty(i) : e[i] = null);
    for (const i in t) {
      const s = t[i];
      if (s != null) {
        this.ft.add(i);
        const a = typeof s == "string" && s.endsWith(we);
        i.includes("-") || a ? e.setProperty(i, a ? s.slice(0, -11) : s, a ? Zt : "") : e[i] = s;
      }
    }
    return A;
  }
});
var $, Ht;
(function(n) {
  n.language = "language", n.system = "system", n.comma_decimal = "comma_decimal", n.decimal_comma = "decimal_comma", n.space_comma = "space_comma", n.none = "none";
})($ || ($ = {})), (function(n) {
  n.language = "language", n.system = "system", n.am_pm = "12", n.twenty_four = "24";
})(Ht || (Ht = {}));
function Qt() {
  return (Qt = Object.assign || function(n) {
    for (var t = 1; t < arguments.length; t++) {
      var e = arguments[t];
      for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (n[i] = e[i]);
    }
    return n;
  }).apply(this, arguments);
}
function xe(n) {
  return n.substr(0, n.indexOf("."));
}
var Ae = function(n) {
  switch (n.number_format) {
    case $.comma_decimal:
      return ["en-US", "en"];
    case $.decimal_comma:
      return ["de", "es", "it"];
    case $.space_comma:
      return ["fr", "sv", "cs"];
    case $.system:
      return;
    default:
      return n.language;
  }
}, Se = function(n, t) {
  return t === void 0 && (t = 2), Math.round(n * Math.pow(10, t)) / Math.pow(10, t);
}, Ee = function(n, t, e) {
  var i = t ? Ae(t) : void 0;
  if (Number.isNaN = Number.isNaN || function s(a) {
    return typeof a == "number" && s(a);
  }, (t == null ? void 0 : t.number_format) !== $.none && !Number.isNaN(Number(n)) && Intl) try {
    return new Intl.NumberFormat(i, Vt(n, e)).format(Number(n));
  } catch (s) {
    return console.error(s), new Intl.NumberFormat(void 0, Vt(n, e)).format(Number(n));
  }
  return typeof n == "string" ? n : Se(n, e == null ? void 0 : e.maximumFractionDigits).toString() + ((e == null ? void 0 : e.style) === "currency" ? " " + e.currency : "");
}, Vt = function(n, t) {
  var e = Qt({ maximumFractionDigits: 2 }, t);
  if (typeof n != "string") return e;
  if (!t || !t.minimumFractionDigits && !t.maximumFractionDigits) {
    var i = n.indexOf(".") > -1 ? n.split(".")[1].length : 0;
    e.minimumFractionDigits = i, e.maximumFractionDigits = i;
  }
  return e;
}, Ce = ["closed", "locked", "off"], S = function(n, t, e, i) {
  i = i || {}, e = e ?? {};
  var s = new Event(t, { bubbles: i.bubbles === void 0 || i.bubbles, cancelable: !!i.cancelable, composed: i.composed === void 0 || i.composed });
  return s.detail = e, n.dispatchEvent(s), s;
}, M = function(n) {
  S(window, "haptic", n);
}, Te = function(n, t, e) {
  e === void 0 && (e = !1), e ? history.replaceState(null, "", t) : history.pushState(null, "", t), S(window, "location-changed", { replace: e });
}, Ie = function(n, t, e) {
  e === void 0 && (e = !0);
  var i, s = xe(t), a = s === "group" ? "homeassistant" : s;
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
  return n.callService(a, i, { entity_id: t });
}, ke = function(n, t) {
  var e = Ce.includes(n.states[t].state);
  return Ie(n, t, e);
}, D = function(n, t, e, i) {
  if (i || (i = { action: "more-info" }), !i.confirmation || i.confirmation.exemptions && i.confirmation.exemptions.some(function(a) {
    return a.user === t.user.id;
  }) || (M("warning"), confirm(i.confirmation.text || "Are you sure you want to " + i.action + "?"))) switch (i.action) {
    case "more-info":
      (e.entity || e.camera_image) && S(n, "hass-more-info", { entityId: e.entity ? e.entity : e.camera_image });
      break;
    case "navigate":
      i.navigation_path && Te(0, i.navigation_path);
      break;
    case "url":
      i.url_path && window.open(i.url_path);
      break;
    case "toggle":
      e.entity && (ke(t, e.entity), M("success"));
      break;
    case "call-service":
      if (!i.service) return void M("failure");
      var s = i.service.split(".", 2);
      t.callService(s[0], s[1], i.service_data, i.target), M("success");
      break;
    case "fire-dom-event":
      S(n, "ll-custom", i);
  }
};
const xt = class xt extends v {
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
        var o, c;
        return ((o = e.states) == null ? void 0 : o[a]) !== ((c = i.states) == null ? void 0 : c[a]);
      });
    }
    return !1;
  }
};
xt.properties = {
  hass: { attribute: !1 },
  config: { attribute: !1 }
};
let V = xt;
function N(n) {
  const { hass: t, label: e, value: i, domains: s, disabled: a = !1, onValueChanged: o } = n;
  return h`
    <div class="field">
      <ha-entity-picker
        .hass=${t}
        .label=${e}
        .value=${i}
        .includeDomains=${s}
        ?disabled=${a}
        allow-custom-entity
        @value-changed=${(c) => o(c.detail.value)}
      ></ha-entity-picker>
    </div>
  `;
}
function J(n) {
  const { label: t, value: e, placeholder: i = "", onInput: s } = n;
  return h`
    <label>
      <span>${t}</span>
      <input .value=${e} placeholder=${i} @input=${(a) => s(a.target.value)} />
    </label>
  `;
}
function st(n) {
  const { hass: t, label: e, value: i, fallback: s, onValueChanged: a } = n;
  return h`
    <div class="field">
      <ha-icon-picker
        .hass=${t}
        .label=${e}
        .value=${i || s}
        @value-changed=${(o) => a(o.detail.value)}
      ></ha-icon-picker>
    </div>
  `;
}
function z(n) {
  const { label: t, value: e, placeholder: i, onInput: s } = n;
  return h`
    <label>
      <span>${t}</span>
      <input .value=${e} placeholder=${i} @input=${(a) => s(a.target.value)} />
    </label>
  `;
}
function Le(n) {
  const { actionConfig: t, formatJson: e, onActionValueChanged: i, onServiceDataChanged: s, serviceDataError: a } = n;
  switch (t.action) {
    case "more-info":
      return z({
        label: "Entity override",
        value: String(t.entity || ""),
        placeholder: "Optional entity",
        onInput: (o) => i("entity", o)
      });
    case "navigate":
      return z({
        label: "Navigation path",
        value: String(t.navigation_path || ""),
        placeholder: "/lovelace/0",
        onInput: (o) => i("navigation_path", o)
      });
    case "url":
      return z({
        label: "URL path",
        value: String(t.url_path || ""),
        placeholder: "https://example.com",
        onInput: (o) => i("url_path", o)
      });
    case "call-service":
      return h`
        ${z({
        label: "Service",
        value: String(t.service || ""),
        placeholder: "light.turn_on",
        onInput: (o) => i("service", o)
      })}
        <label>
          <span>Service data JSON</span>
          <textarea
            .value=${e(t.service_data)}
            placeholder='{"brightness_pct": 50}'
            @change=${(o) => s(o.target.value)}
          ></textarea>
        </label>
        ${a ? h`<div class="error">${a}</div>` : ""}
      `;
    default:
      return "";
  }
}
function De(n) {
  const { label: t, actionConfig: e, actionOptions: i, onActionTypeChanged: s, fields: a, className: o } = n, c = e.action;
  return h`
    <fieldset class=${o || ""}>
      <legend>${t}</legend>

      <label>
        <span>Action</span>
        <select
          .value=${c}
          @change=${(r) => s(r.target.value)}
        >
          ${i.map(
    (r) => h` <option value=${r.value} ?selected=${r.value === c}>${r.label}</option> `
  )}
        </select>
      </label>

      ${a}
    </fieldset>
  `;
}
function Yt(n) {
  const {
    label: t,
    actionConfig: e,
    actionOptions: i,
    onActionTypeChanged: s,
    onActionValueChanged: a,
    onServiceDataChanged: o,
    formatJson: c,
    serviceDataError: r,
    className: l
  } = n;
  return De({
    label: t,
    className: l,
    actionConfig: e,
    actionOptions: i,
    onActionTypeChanged: s,
    fields: Le({
      actionConfig: e,
      formatJson: c,
      onActionValueChanged: a,
      onServiceDataChanged: o,
      serviceDataError: r
    })
  });
}
const Ne = [
  { value: "more-info", label: "More info" },
  { value: "toggle", label: "Toggle" },
  { value: "navigate", label: "Navigate" },
  { value: "url", label: "URL" },
  { value: "call-service", label: "Call service" },
  { value: "fire-dom-event", label: "Fire DOM event" },
  { value: "none", label: "None" }
], K = class K extends v {
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
    return h`
      <div class="editor">
        <div class="grid">
          ${J({
      label: "Name",
      value: String(this.config.name || ""),
      placeholder: "Living room",
      onInput: (t) => this.updateConfigValue("name", t)
    })}
          ${N({
      hass: this.hass,
      label: "Light entity",
      value: String(this.config.entity || ""),
      domains: ["light"],
      onValueChanged: (t) => this.updateConfigValue("entity", t)
    })}
          ${st({
      hass: this.hass,
      label: "Icon",
      value: String(this.config.icon || ""),
      fallback: "mdi:sofa",
      onValueChanged: (t) => this.updateConfigValue("icon", t)
    })}
          ${N({
      hass: this.hass,
      label: "Sensor 1 entity",
      value: String(this.config.sensor1_entity || ""),
      domains: ["sensor"],
      onValueChanged: (t) => this.updateConfigValue("sensor1_entity", t)
    })}
          ${st({
      hass: this.hass,
      label: "Sensor 1 icon",
      value: String(this.config.sensor1_icon || ""),
      fallback: "mdi:thermometer",
      onValueChanged: (t) => this.updateConfigValue("sensor1_icon", t)
    })}
          ${N({
      hass: this.hass,
      label: "Sensor 2 entity",
      value: String(this.config.sensor2_entity || ""),
      domains: ["sensor"],
      onValueChanged: (t) => this.updateConfigValue("sensor2_entity", t)
    })}
          ${st({
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
    return Yt({
      label: t,
      actionConfig: i,
      actionOptions: Ne,
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
    this.config = t, S(this, "config-changed", { config: t });
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
}, K.styles = T`
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
let gt = K;
customElements.define("room-card-editor", gt);
const F = { action: "more-info" }, nt = { action: "toggle" }, at = { action: "more-info" }, ot = "mdi:thermometer", rt = "mdi:water-percent", At = class At extends V {
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
      sensor1_icon: ot,
      sensor2_icon: rt,
      tap_action: F,
      light_tap_action: nt,
      light_hold_action: at
    };
  }
  setConfig(t) {
    if (!t.entity)
      throw new Error("Room Card requires a light entity");
    this.config = {
      icon: "mdi:sofa",
      sensor1_icon: ot,
      sensor2_icon: rt,
      tap_action: F,
      light_tap_action: nt,
      light_hold_action: at,
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
    var c;
    const t = this.getLightEntity(), e = this.isLightOff(t), i = this.config.name || ((c = t == null ? void 0 : t.attributes) == null ? void 0 : c.friendly_name) || "Room", s = this.getLightRgb(t), a = !!(this.config.sensor1_entity || this.config.sensor2_entity), o = s ? {
      "--room-light-rgb": s.join(",")
    } : {};
    return h`
      <ha-card class=${e ? "light-off" : ""} style=${Xt(o)} @click=${this.handleCardTap}>
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
            ${a ? h`
                  <div class="sensors">
                    ${this.config.sensor1_entity ? this.renderSensor(
      this.config.sensor1_icon || ot,
      this.config.sensor1_entity
    ) : ""}
                    ${this.config.sensor2_entity ? this.renderSensor(
      this.config.sensor2_icon || rt,
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
    var a, o;
    const i = e ? (o = (a = this.hass) == null ? void 0 : a.states) == null ? void 0 : o[e] : void 0, s = i ? this.formatEntityState(i) : "-";
    return h`
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
    return t.trim() === "" || !Number.isFinite(e) ? t : Ee(e, (i = this.hass) == null ? void 0 : i.locale, { maximumFractionDigits: 2 });
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
    const s = e / 100, a = i / 100, o = (1 - Math.abs(2 * a - 1)) * s, c = t / 60, r = o * (1 - Math.abs(c % 2 - 1)), l = a - o / 2;
    let d = [0, 0, 0];
    return c >= 0 && c < 1 ? d = [o, r, 0] : c < 2 ? d = [r, o, 0] : c < 3 ? d = [0, o, r] : c < 4 ? d = [0, r, o] : c < 5 ? d = [r, 0, o] : d = [o, 0, r], d.map((u) => Math.round((u + l) * 255));
  }
  handleCardTap(t) {
    t.target.closest(".light-button") || this.runAction(this.config.tap_action || F);
  }
  handleCardKeydown(t) {
    t.key !== "Enter" && t.key !== " " || (t.preventDefault(), this.runAction(this.config.tap_action || F));
  }
  handleLightTap(t) {
    if (t.stopPropagation(), this.lightHoldTriggered) {
      this.lightHoldTriggered = !1;
      return;
    }
    this.cancelLightHold(), this.runAction(this.config.light_tap_action || nt);
  }
  handleLightPointerDown(t) {
    t.stopPropagation(), this.lightHoldTriggered = !1, this.cancelLightHold(), this.holdTimer = window.setTimeout(() => {
      this.lightHoldTriggered = !0, this.runAction(this.config.light_hold_action || at);
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
    D(
      this,
      this.hass,
      {
        entity: this.config.entity
      },
      t
    );
  }
};
At.styles = T`
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
let ft = At;
customElements.define("room-card", ft);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "room-card",
  name: "Room Card",
  description: "Room card with light actions and sensors"
});
const Pt = "Possible Issues", Rt = ["sensor", "light", "switch"], Oe = ["unavailable"], Ue = ["unavailable", "unknown", "none"], Mt = "none", q = class q extends v {
  constructor() {
    super(...arguments), this.config = {}, this.integrationOptions = [], this.integrationsLoading = !1, this.integrationsVersion = 0;
  }
  setConfig(t) {
    this.config = {
      title: Pt,
      domains: Rt,
      issue_states: Oe,
      ignored_entities: [],
      ignored_devices: [],
      ignored_integrations: [],
      ignored_name_patterns: [],
      row_detail: Mt,
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
    return h`
      <div class="editor">
        <div class="grid">
          ${J({
      label: "Title",
      value: String(this.config.title || ""),
      placeholder: Pt,
      onInput: (t) => this.updateConfigValue("title", t)
    })}
          ${this.renderListField("Domains", "domains", Rt, "sensor, light, switch")}
          ${this.renderIssueStatesField()}
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
    return J({
      label: t,
      value: this.formatList(this.config[e], i),
      placeholder: s,
      onInput: (a) => this.updateListValue(e, a)
    });
  }
  renderIssueStatesField() {
    const t = this.parseConfigList(this.config.issue_states), e = new Set(t), i = Ue.filter((s) => !e.has(s));
    return h`
      <div class="field-group">
        <label>
          <span>Issue states</span>
          <select ?disabled=${i.length === 0} @change=${(s) => this.handleIssueStateSelected(s)}>
            <option value="">${i.length ? "Add state" : "All common states selected"}</option>
            ${i.map((s) => h`<option value=${s}>${s}</option>`)}
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

        ${t.length ? h`
              <div class="chips" aria-label="Issue states">
                ${t.map(
      (s) => h`
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
  renderIgnoredIntegrationsField() {
    const t = this.parseConfigList(this.config.ignored_integrations), e = new Set(t), i = this.integrationOptions.filter((a) => !e.has(a)), s = this.integrationsLoading || i.length === 0;
    return h`
      <label>
        <span>Ignored integrations</span>
        <select ?disabled=${s} @change=${(a) => this.handleIgnoredIntegrationSelected(a)}>
          <option value="">
            ${this.integrationsLoading ? "Loading integrations..." : i.length ? "Add integration" : "No integrations available"}
          </option>
          ${i.map((a) => h`<option value=${a}>${this.formatIntegrationName(a)}</option>`)}
        </select>
      </label>
      ${t.length ? h`
            <div class="chips" aria-label="Ignored integrations">
              ${t.map(
      (a) => h`
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
    const t = this.config.row_detail || Mt;
    return h`
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
    this.config = t, S(this, "config-changed", { config: t });
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
q.properties = {
  hass: { attribute: !1 },
  config: { attribute: !1 },
  integrationsVersion: { state: !0 }
}, q.styles = T`
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

    .field-group {
      display: grid;
      gap: 8px;
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
let mt = q;
customElements.define("unavailable-devices-card-editor", mt);
const ct = "Possible Issues", lt = ["sensor", "light", "switch"], ht = ["unavailable"], dt = "none", G = class G extends V {
  constructor() {
    super(...arguments), this.entityRegistry = [], this.deviceRegistry = [], this.registryLoading = !1, this.registryError = !1, this.registryVersion = 0;
  }
  static getConfigElement() {
    return document.createElement("unavailable-devices-card-editor");
  }
  static getStubConfig() {
    return {
      title: ct,
      domains: lt,
      issue_states: ht,
      ignored_entities: [],
      ignored_devices: [],
      ignored_integrations: [],
      ignored_name_patterns: [],
      row_detail: dt
    };
  }
  setConfig(t) {
    this.config = {
      title: ct,
      domains: lt,
      issue_states: ht,
      ignored_entities: [],
      ignored_devices: [],
      ignored_integrations: [],
      ignored_name_patterns: [],
      row_detail: dt,
      ...t
    };
  }
  shouldUpdate(t) {
    if (t.has("config") || t.has("registryVersion"))
      return !0;
    if (t.has("hass")) {
      const e = t.get("hass");
      return e ? this.hass ? this.getDomainEntityIds(this.hass).some((s) => {
        var a, o;
        return ((a = e.states) == null ? void 0 : a[s]) !== ((o = this.hass.states) == null ? void 0 : o[s]);
      }) : !1 : !0;
    }
    return !1;
  }
  updated(t) {
    t.has("hass") && this.loadRegistries();
  }
  render() {
    const t = this.getIssueDevices();
    return t.length ? h`
      <ha-card>
        <div class="card">
          <h2>${this.config.title || ct}</h2>
          <div class="devices">${t.map((e) => this.renderDeviceRow(e))}</div>
        </div>
      </ha-card>
    ` : h``;
  }
  renderDeviceRow(t) {
    const e = this.getDeviceName(t.device), i = this.getIssueIcon(t.entities[0]), s = this.getRowDetail(t);
    return h`
      <button class="device-row" type="button" @click=${() => this.openDevice(t.device.id)}>
        <ha-icon .icon=${i}></ha-icon>
        <span class="row-text">
          <span class="name">${e}</span>
          ${s ? h`<span class="detail">${s}</span>` : ""}
        </span>
      </button>
    `;
  }
  getIssueDevices() {
    var r;
    if (this.registryError || !this.entityRegistry.length || !this.deviceRegistry.length || !this.hass)
      return [];
    const t = new Set(this.normalizeList(this.config.issue_states, ht)), e = this.normalizeList(this.config.ignored_entities), i = this.normalizeList(this.config.ignored_devices), s = new Set(
      this.normalizeList(this.config.ignored_integrations).map((l) => l.toLowerCase())
    ), a = this.normalizeList(this.config.ignored_name_patterns), o = new Map(this.deviceRegistry.map((l) => [l.id, l])), c = /* @__PURE__ */ new Map();
    for (const l of this.entityRegistry) {
      const d = this.hass.states[l.entity_id], u = l.device_id || "", g = o.get(u);
      if (!d || !g || !t.has(d.state) || l.platform && s.has(l.platform.toLowerCase()) || this.isIgnored(l.entity_id, e) || this.isIgnored(u, i))
        continue;
      const f = [this.getDeviceName(g), (r = d.attributes) == null ? void 0 : r.friendly_name, l.name, l.original_name].filter(Boolean).join(" ");
      this.isIgnored(f, a) || c.set(u, [...c.get(u) || [], l]);
    }
    return [...c.entries()].map(([l, d]) => ({
      device: o.get(l),
      entities: d
    })).sort((l, d) => this.getDeviceName(l.device).localeCompare(this.getDeviceName(d.device)));
  }
  getDomainEntityIds(t) {
    var i;
    const e = new Set(this.normalizeList((i = this.config) == null ? void 0 : i.domains, lt));
    return Object.keys(t.states || {}).filter((s) => e.has(this.getDomain(s)));
  }
  getDomain(t) {
    return t.split(".", 1)[0];
  }
  getDeviceName(t) {
    return t.name_by_user || t.name || "Unknown device";
  }
  getIssueIcon(t) {
    var i, s, a;
    const e = t ? (s = (i = this.hass) == null ? void 0 : i.states) == null ? void 0 : s[t.entity_id] : void 0;
    return ((a = e == null ? void 0 : e.attributes) == null ? void 0 : a.icon) || (t == null ? void 0 : t.icon) || (t == null ? void 0 : t.original_icon) || "mdi:devices";
  }
  getRowDetail(t) {
    const e = this.config.row_detail || dt;
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
  openDevice(t) {
    D(
      this,
      this.hass,
      {},
      {
        action: "navigate",
        navigation_path: `/config/devices/device/${t}`
      }
    );
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
G.properties = {
  hass: { attribute: !1 },
  config: { attribute: !1 },
  registryVersion: { state: !0 }
}, G.styles = T`
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
let bt = G;
customElements.define("unavailable-devices-card", bt);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "unavailable-devices-card",
  name: "Unavailable Devices Card",
  description: "Lists devices with unavailable entities across configurable domains"
});
const zt = "/config/dashboard", He = [
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
], Ve = [
  { value: "more-info", label: "More info" },
  { value: "toggle", label: "Toggle" },
  { value: "navigate", label: "Navigate" },
  { value: "url", label: "URL" },
  { value: "call-service", label: "Call service" },
  { value: "fire-dom-event", label: "Fire DOM event" },
  { value: "none", label: "None" }
], Z = class Z extends v {
  constructor() {
    super(...arguments), this.config = {}, this.serviceDataErrors = {};
  }
  connectedCallback() {
    super.connectedCallback(), this.loadHomeAssistantPickers();
  }
  setConfig(t) {
    this.config = {
      show_temperature: !0,
      use_ha_weather_icons: !1,
      settings_navigation_path: zt,
      tabs: He,
      ...t
    };
  }
  shouldUpdate(t) {
    return t.has("config") ? !0 : t.has("hass") ? !t.get("hass") && !!this.hass : !1;
  }
  render() {
    return h`
      <div class="editor">
        <div class="grid">
          ${N({
      hass: this.hass,
      label: "Weather entity",
      value: String(this.config.weather_entity || ""),
      domains: ["weather"],
      onValueChanged: (t) => this.updateConfigValue("weather_entity", t)
    })}
          ${this.renderCheckbox("Show temperature", "show_temperature")}
          ${this.renderCheckbox("Use Home Assistant weather icons", "use_ha_weather_icons")}
          ${N({
      hass: this.hass,
      label: "Temperature entity override",
      value: String(this.config.temperature_entity || ""),
      domains: ["sensor"],
      disabled: !this.config.show_temperature,
      onValueChanged: (t) => this.updateConfigValue("temperature_entity", t)
    })}
          ${J({
      label: "Settings navigation path",
      value: String(this.config.settings_navigation_path || ""),
      placeholder: zt,
      onInput: (t) => this.updateConfigValue("settings_navigation_path", t)
    })}
        </div>

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
    return h`
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
    return h`
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
    return h`
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
    return h`
      <label>
        <span>${i}</span>
        <input
          .value=${String(a[e] || "")}
          placeholder=${s}
          @input=${(o) => this.updateTabValue(t, e, o.target.value)}
        />
      </label>
    `;
  }
  renderTabActionEditor(t, e, i) {
    const s = this.getServiceDataErrorKey(e);
    return Yt({
      label: t,
      className: "action-editor",
      actionConfig: i,
      actionOptions: Ve,
      onActionTypeChanged: (a) => this.updateTabActionType(e, a),
      onActionValueChanged: (a, o) => this.updateTabActionValue(e, a, o),
      onServiceDataChanged: (a) => this.updateServiceData(e, a),
      formatJson: (a) => this.formatJson(a),
      serviceDataError: this.serviceDataErrors[s]
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
  updateTabActionValue(t, e, i) {
    this.updateTab(t, {
      ...this.getTab(t),
      tap_action: {
        ...this.getTab(t).tap_action || { action: "none" },
        [e]: i || void 0
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
  formatJson(t) {
    return t ? JSON.stringify(t, null, 2) : "";
  }
  updateConfig(t) {
    this.config = t, S(this, "config-changed", { config: t });
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
Z.properties = {
  hass: { attribute: !1 },
  config: { attribute: !1 }
}, Z.styles = T`
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
let vt = Z;
customElements.define("welcome-card-editor", vt);
const j = "/config/dashboard", Pe = { action: "none" }, Re = "welcome-card:collapsed", Ft = [
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
], ut = {
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
}, Me = {
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
}, X = class X extends V {
  constructor() {
    super(...arguments), this._collapsed = !1, this._now = /* @__PURE__ */ new Date();
  }
  static getConfigElement() {
    return document.createElement("welcome-card-editor");
  }
  static getStubConfig() {
    return {
      weather_entity: "",
      show_temperature: !0,
      use_ha_weather_icons: !1,
      settings_navigation_path: j,
      tabs: Ft
    };
  }
  setConfig(t) {
    this.config = {
      show_temperature: !0,
      use_ha_weather_icons: !1,
      settings_navigation_path: j,
      tabs: Ft,
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
    return h`
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
              ${this.config.show_temperature ? h`<span class="temperature">${this.formatTemperature()}</span>` : ""}
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
            ${!this._collapsed && t.length ? h`<div class="tabs">${t.map((e) => this.renderTab(e))}</div>` : ""}
          </div>
        </div>
      </ha-card>
    `;
  }
  renderTab(t) {
    const i = {
      "--tab-color": t.color || "var(--primary-color)"
    };
    return h`
      <button
        class="tab"
        style=${Xt(i)}
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
      ((i = this.config) == null ? void 0 : i.settings_navigation_path) || j,
      (((s = this.config) == null ? void 0 : s.tabs) || []).map((a) => a.label || "").join("|")
    ];
    return `${Re}${t.join(":")}`;
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
    D(
      this,
      this.hass,
      {},
      {
        action: "navigate",
        navigation_path: this.config.settings_navigation_path || j
      }
    );
  }
  handleWeatherTap() {
    const t = this.config.weather_entity || this.config.temperature_entity;
    t && D(this, this.hass, { entity: t }, { action: "more-info" });
  }
  runTabAction(t) {
    D(this, this.hass, {}, t.tap_action || Pe);
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
    return t && Me[t] || "mdi:weather-cloudy";
  }
  getWeatherEmoji() {
    var e;
    const t = (e = this.getWeatherEntity()) == null ? void 0 : e.state;
    return t && ut[t] || ut.default;
  }
  renderWeatherIcon() {
    return this.config.use_ha_weather_icons ? h`<ha-icon .icon=${this.getWeatherIcon()}></ha-icon>` : h`<span class="weather-emoji" aria-hidden="true">${this.getWeatherEmoji()}</span>`;
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
    var s, a, o, c, r, l;
    const t = this.getTemperatureEntity();
    if (t)
      return this.formatTemperatureValue(
        t.state,
        (s = t.attributes) == null ? void 0 : s.unit_of_measurement
      );
    const e = this.getWeatherEntity(), i = (a = e == null ? void 0 : e.attributes) == null ? void 0 : a.temperature;
    return i == null || i === "" ? "-" : this.formatTemperatureValue(
      i,
      ((o = e == null ? void 0 : e.attributes) == null ? void 0 : o.temperature_unit) || ((l = (r = (c = this.hass) == null ? void 0 : c.config) == null ? void 0 : r.unit_system) == null ? void 0 : l.temperature)
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
}, X.styles = T`
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
let _t = X;
customElements.define("welcome-card", _t);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "welcome-card",
  name: "Welcome Card",
  description: "Greeting, weather/date pill, and quick-action tabs"
});
