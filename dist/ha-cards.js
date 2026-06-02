/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const nt = globalThis, se = nt.ShadowRoot && (nt.ShadyCSS === void 0 || nt.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, ae = Symbol(), le = /* @__PURE__ */ new WeakMap();
let qe = class {
  constructor(t, e, i) {
    if (this._$cssResult$ = !0, i !== ae) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (se && t === void 0) {
      const i = e !== void 0 && e.length === 1;
      i && (t = le.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && le.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const ei = (n) => new qe(typeof n == "string" ? n : n + "", void 0, ae), w = (n, ...t) => {
  const e = n.length === 1 ? n[0] : t.reduce((i, s, a) => i + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + n[a + 1], n[0]);
  return new qe(e, n, ae);
}, ii = (n, t) => {
  if (se) n.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const i = document.createElement("style"), s = nt.litNonce;
    s !== void 0 && i.setAttribute("nonce", s), i.textContent = e.cssText, n.appendChild(i);
  }
}, ce = se ? (n) => n : (n) => n instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const i of t.cssRules) e += i.cssText;
  return ei(e);
})(n) : n;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: si, defineProperty: ai, getOwnPropertyDescriptor: oi, getOwnPropertyNames: ni, getOwnPropertySymbols: ri, getPrototypeOf: li } = Object, C = globalThis, de = C.trustedTypes, ci = de ? de.emptyScript : "", xt = C.reactiveElementPolyfillSupport, G = (n, t) => n, jt = { toAttribute(n, t) {
  switch (t) {
    case Boolean:
      n = n ? ci : null;
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
} }, Ge = (n, t) => !si(n, t), he = { attribute: !0, type: String, converter: jt, reflect: !1, useDefault: !1, hasChanged: Ge };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), C.litPropertyMetadata ?? (C.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let R = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = he) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const i = Symbol(), s = this.getPropertyDescriptor(t, i, e);
      s !== void 0 && ai(this.prototype, t, s);
    }
  }
  static getPropertyDescriptor(t, e, i) {
    const { get: s, set: a } = oi(this.prototype, t) ?? { get() {
      return this[e];
    }, set(o) {
      this[e] = o;
    } };
    return { get: s, set(o) {
      const r = s == null ? void 0 : s.call(this);
      a == null || a.call(this, o), this.requestUpdate(t, r, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? he;
  }
  static _$Ei() {
    if (this.hasOwnProperty(G("elementProperties"))) return;
    const t = li(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(G("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(G("properties"))) {
      const e = this.properties, i = [...ni(e), ...ri(e)];
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
      for (const s of i) e.unshift(ce(s));
    } else t !== void 0 && e.push(ce(t));
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
    return ii(t, this.constructor.elementStyles), t;
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
      const o = (((a = i.converter) == null ? void 0 : a.toAttribute) !== void 0 ? i.converter : jt).toAttribute(e, i.type);
      this._$Em = t, o == null ? this.removeAttribute(s) : this.setAttribute(s, o), this._$Em = null;
    }
  }
  _$AK(t, e) {
    var a, o;
    const i = this.constructor, s = i._$Eh.get(t);
    if (s !== void 0 && this._$Em !== s) {
      const r = i.getPropertyOptions(s), l = typeof r.converter == "function" ? { fromAttribute: r.converter } : ((a = r.converter) == null ? void 0 : a.fromAttribute) !== void 0 ? r.converter : jt;
      this._$Em = s;
      const u = l.fromAttribute(e, r.type);
      this[s] = u ?? ((o = this._$Ej) == null ? void 0 : o.get(s)) ?? u, this._$Em = null;
    }
  }
  requestUpdate(t, e, i, s = !1, a) {
    var o;
    if (t !== void 0) {
      const r = this.constructor;
      if (s === !1 && (a = this[t]), i ?? (i = r.getPropertyOptions(t)), !((i.hasChanged ?? Ge)(a, e) || i.useDefault && i.reflect && a === ((o = this._$Ej) == null ? void 0 : o.get(t)) && !this.hasAttribute(r._$Eu(t, i)))) return;
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
        const { wrapped: r } = o, l = this[a];
        r !== !0 || this._$AL.has(a) || l === void 0 || this.C(a, void 0, o, l);
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
R.elementStyles = [], R.shadowRootOptions = { mode: "open" }, R[G("elementProperties")] = /* @__PURE__ */ new Map(), R[G("finalized")] = /* @__PURE__ */ new Map(), xt == null || xt({ ReactiveElement: R }), (C.reactiveElementVersions ?? (C.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const K = globalThis, ue = (n) => n, lt = K.trustedTypes, pe = lt ? lt.createPolicy("lit-html", { createHTML: (n) => n }) : void 0, Ke = "$lit$", S = `lit$${Math.random().toFixed(9).slice(2)}$`, Je = "?" + S, di = `<${Je}>`, M = document, J = () => M.createComment(""), Y = (n) => n === null || typeof n != "object" && typeof n != "function", oe = Array.isArray, hi = (n) => oe(n) || typeof (n == null ? void 0 : n[Symbol.iterator]) == "function", At = `[ 	
\f\r]`, B = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ge = /-->/g, me = />/g, z = RegExp(`>|${At}(?:([^\\s"'>=/]+)(${At}*=${At}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), fe = /'/g, ve = /"/g, Ye = /^(?:script|style|textarea|title)$/i, ui = (n) => (t, ...e) => ({ _$litType$: n, strings: t, values: e }), c = ui(1), N = Symbol.for("lit-noChange"), f = Symbol.for("lit-nothing"), be = /* @__PURE__ */ new WeakMap(), I = M.createTreeWalker(M, 129);
function Ze(n, t) {
  if (!oe(n) || !n.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return pe !== void 0 ? pe.createHTML(t) : t;
}
const pi = (n, t) => {
  const e = n.length - 1, i = [];
  let s, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = B;
  for (let r = 0; r < e; r++) {
    const l = n[r];
    let u, p, h = -1, d = 0;
    for (; d < l.length && (o.lastIndex = d, p = o.exec(l), p !== null); ) d = o.lastIndex, o === B ? p[1] === "!--" ? o = ge : p[1] !== void 0 ? o = me : p[2] !== void 0 ? (Ye.test(p[2]) && (s = RegExp("</" + p[2], "g")), o = z) : p[3] !== void 0 && (o = z) : o === z ? p[0] === ">" ? (o = s ?? B, h = -1) : p[1] === void 0 ? h = -2 : (h = o.lastIndex - p[2].length, u = p[1], o = p[3] === void 0 ? z : p[3] === '"' ? ve : fe) : o === ve || o === fe ? o = z : o === ge || o === me ? o = B : (o = z, s = void 0);
    const g = o === z && n[r + 1].startsWith("/>") ? " " : "";
    a += o === B ? l + di : h >= 0 ? (i.push(u), l.slice(0, h) + Ke + l.slice(h) + S + g) : l + S + (h === -2 ? r : g);
  }
  return [Ze(n, a + (n[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), i];
};
class Z {
  constructor({ strings: t, _$litType$: e }, i) {
    let s;
    this.parts = [];
    let a = 0, o = 0;
    const r = t.length - 1, l = this.parts, [u, p] = pi(t, e);
    if (this.el = Z.createElement(u, i), I.currentNode = this.el.content, e === 2 || e === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (s = I.nextNode()) !== null && l.length < r; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const h of s.getAttributeNames()) if (h.endsWith(Ke)) {
          const d = p[o++], g = s.getAttribute(h).split(S), m = /([.?@])?(.*)/.exec(d);
          l.push({ type: 1, index: a, name: m[2], strings: g, ctor: m[1] === "." ? mi : m[1] === "?" ? fi : m[1] === "@" ? vi : wt }), s.removeAttribute(h);
        } else h.startsWith(S) && (l.push({ type: 6, index: a }), s.removeAttribute(h));
        if (Ye.test(s.tagName)) {
          const h = s.textContent.split(S), d = h.length - 1;
          if (d > 0) {
            s.textContent = lt ? lt.emptyScript : "";
            for (let g = 0; g < d; g++) s.append(h[g], J()), I.nextNode(), l.push({ type: 2, index: ++a });
            s.append(h[d], J());
          }
        }
      } else if (s.nodeType === 8) if (s.data === Je) l.push({ type: 2, index: a });
      else {
        let h = -1;
        for (; (h = s.data.indexOf(S, h + 1)) !== -1; ) l.push({ type: 7, index: a }), h += S.length - 1;
      }
      a++;
    }
  }
  static createElement(t, e) {
    const i = M.createElement("template");
    return i.innerHTML = t, i;
  }
}
function P(n, t, e = n, i) {
  var o, r;
  if (t === N) return t;
  let s = i !== void 0 ? (o = e._$Co) == null ? void 0 : o[i] : e._$Cl;
  const a = Y(t) ? void 0 : t._$litDirective$;
  return (s == null ? void 0 : s.constructor) !== a && ((r = s == null ? void 0 : s._$AO) == null || r.call(s, !1), a === void 0 ? s = void 0 : (s = new a(n), s._$AT(n, e, i)), i !== void 0 ? (e._$Co ?? (e._$Co = []))[i] = s : e._$Cl = s), s !== void 0 && (t = P(n, s._$AS(n, t.values), s, i)), t;
}
class gi {
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
    const { el: { content: e }, parts: i } = this._$AD, s = ((t == null ? void 0 : t.creationScope) ?? M).importNode(e, !0);
    I.currentNode = s;
    let a = I.nextNode(), o = 0, r = 0, l = i[0];
    for (; l !== void 0; ) {
      if (o === l.index) {
        let u;
        l.type === 2 ? u = new X(a, a.nextSibling, this, t) : l.type === 1 ? u = new l.ctor(a, l.name, l.strings, this, t) : l.type === 6 && (u = new bi(a, this, t)), this._$AV.push(u), l = i[++r];
      }
      o !== (l == null ? void 0 : l.index) && (a = I.nextNode(), o++);
    }
    return I.currentNode = M, s;
  }
  p(t) {
    let e = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(t, i, e), e += i.strings.length - 2) : i._$AI(t[e])), e++;
  }
}
class X {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, e, i, s) {
    this.type = 2, this._$AH = f, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = i, this.options = s, this._$Cv = (s == null ? void 0 : s.isConnected) ?? !0;
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
    t = P(this, t, e), Y(t) ? t === f || t == null || t === "" ? (this._$AH !== f && this._$AR(), this._$AH = f) : t !== this._$AH && t !== N && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : hi(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== f && Y(this._$AH) ? this._$AA.nextSibling.data = t : this.T(M.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var a;
    const { values: e, _$litType$: i } = t, s = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = Z.createElement(Ze(i.h, i.h[0]), this.options)), i);
    if (((a = this._$AH) == null ? void 0 : a._$AD) === s) this._$AH.p(e);
    else {
      const o = new gi(s, this), r = o.u(this.options);
      o.p(e), this.T(r), this._$AH = o;
    }
  }
  _$AC(t) {
    let e = be.get(t.strings);
    return e === void 0 && be.set(t.strings, e = new Z(t)), e;
  }
  k(t) {
    oe(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let i, s = 0;
    for (const a of t) s === e.length ? e.push(i = new X(this.O(J()), this.O(J()), this, this.options)) : i = e[s], i._$AI(a), s++;
    s < e.length && (this._$AR(i && i._$AB.nextSibling, s), e.length = s);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    var i;
    for ((i = this._$AP) == null ? void 0 : i.call(this, !1, !0, e); t !== this._$AB; ) {
      const s = ue(t).nextSibling;
      ue(t).remove(), t = s;
    }
  }
  setConnected(t) {
    var e;
    this._$AM === void 0 && (this._$Cv = t, (e = this._$AP) == null || e.call(this, t));
  }
}
let wt = class {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, i, s, a) {
    this.type = 1, this._$AH = f, this._$AN = void 0, this.element = t, this.name = e, this._$AM = s, this.options = a, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = f;
  }
  _$AI(t, e = this, i, s) {
    const a = this.strings;
    let o = !1;
    if (a === void 0) t = P(this, t, e, 0), o = !Y(t) || t !== this._$AH && t !== N, o && (this._$AH = t);
    else {
      const r = t;
      let l, u;
      for (t = a[0], l = 0; l < a.length - 1; l++) u = P(this, r[i + l], e, l), u === N && (u = this._$AH[l]), o || (o = !Y(u) || u !== this._$AH[l]), u === f ? t = f : t !== f && (t += (u ?? "") + a[l + 1]), this._$AH[l] = u;
    }
    o && !s && this.j(t);
  }
  j(t) {
    t === f ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
};
class mi extends wt {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === f ? void 0 : t;
  }
}
class fi extends wt {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== f);
  }
}
class vi extends wt {
  constructor(t, e, i, s, a) {
    super(t, e, i, s, a), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = P(this, t, e, 0) ?? f) === N) return;
    const i = this._$AH, s = t === f && i !== f || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive, a = t !== f && (i === f || s);
    s && this.element.removeEventListener(this.name, this, i), a && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var e;
    typeof this._$AH == "function" ? this._$AH.call(((e = this.options) == null ? void 0 : e.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
let bi = class {
  constructor(t, e, i) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    P(this, t);
  }
};
const St = K.litHtmlPolyfillSupport;
St == null || St(Z, X), (K.litHtmlVersions ?? (K.litHtmlVersions = [])).push("3.3.2");
const yi = (n, t, e) => {
  const i = (e == null ? void 0 : e.renderBefore) ?? t;
  let s = i._$litPart$;
  if (s === void 0) {
    const a = (e == null ? void 0 : e.renderBefore) ?? null;
    i._$litPart$ = s = new X(t.insertBefore(J(), a), a, void 0, e ?? {});
  }
  return s._$AI(n), s;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const D = globalThis;
let _ = class extends R {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = yi(e, this.renderRoot, this.renderOptions);
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
    return N;
  }
};
var je;
_._$litElement$ = !0, _.finalized = !0, (je = D.litElementHydrateSupport) == null || je.call(D, { LitElement: _ });
const Ct = D.litElementPolyfillSupport;
Ct == null || Ct({ LitElement: _ });
(D.litElementVersions ?? (D.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const _i = { ATTRIBUTE: 1 }, wi = (n) => (...t) => ({ _$litDirective$: n, values: t });
let $i = class {
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
const Xe = "important", xi = " !" + Xe, Q = wi(class extends $i {
  constructor(n) {
    var t;
    if (super(n), n.type !== _i.ATTRIBUTE || n.name !== "style" || ((t = n.strings) == null ? void 0 : t.length) > 2) throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.");
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
        const a = typeof s == "string" && s.endsWith(xi);
        i.includes("-") || a ? e.setProperty(i, a ? s.slice(0, -11) : s, a ? Xe : "") : e[i] = s;
      }
    }
    return N;
  }
});
var V, ye;
(function(n) {
  n.language = "language", n.system = "system", n.comma_decimal = "comma_decimal", n.decimal_comma = "decimal_comma", n.space_comma = "space_comma", n.none = "none";
})(V || (V = {})), (function(n) {
  n.language = "language", n.system = "system", n.am_pm = "12", n.twenty_four = "24";
})(ye || (ye = {}));
function Qe() {
  return (Qe = Object.assign || function(n) {
    for (var t = 1; t < arguments.length; t++) {
      var e = arguments[t];
      for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (n[i] = e[i]);
    }
    return n;
  }).apply(this, arguments);
}
function Ai(n) {
  return n.substr(0, n.indexOf("."));
}
var Si = function(n) {
  switch (n.number_format) {
    case V.comma_decimal:
      return ["en-US", "en"];
    case V.decimal_comma:
      return ["de", "es", "it"];
    case V.space_comma:
      return ["fr", "sv", "cs"];
    case V.system:
      return;
    default:
      return n.language;
  }
}, Ci = function(n, t) {
  return t === void 0 && (t = 2), Math.round(n * Math.pow(10, t)) / Math.pow(10, t);
}, ti = function(n, t, e) {
  var i = t ? Si(t) : void 0;
  if (Number.isNaN = Number.isNaN || function s(a) {
    return typeof a == "number" && s(a);
  }, (t == null ? void 0 : t.number_format) !== V.none && !Number.isNaN(Number(n)) && Intl) try {
    return new Intl.NumberFormat(i, _e(n, e)).format(Number(n));
  } catch (s) {
    return console.error(s), new Intl.NumberFormat(void 0, _e(n, e)).format(Number(n));
  }
  return typeof n == "string" ? n : Ci(n, e == null ? void 0 : e.maximumFractionDigits).toString() + ((e == null ? void 0 : e.style) === "currency" ? " " + e.currency : "");
}, _e = function(n, t) {
  var e = Qe({ maximumFractionDigits: 2 }, t);
  if (typeof n != "string") return e;
  if (!t || !t.minimumFractionDigits && !t.maximumFractionDigits) {
    var i = n.indexOf(".") > -1 ? n.split(".")[1].length : 0;
    e.minimumFractionDigits = i, e.maximumFractionDigits = i;
  }
  return e;
}, ki = ["closed", "locked", "off"], A = function(n, t, e, i) {
  i = i || {}, e = e ?? {};
  var s = new Event(t, { bubbles: i.bubbles === void 0 || i.bubbles, cancelable: !!i.cancelable, composed: i.composed === void 0 || i.composed });
  return s.detail = e, n.dispatchEvent(s), s;
}, et = function(n) {
  A(window, "haptic", n);
}, Ti = function(n, t, e) {
  e === void 0 && (e = !1), e ? history.replaceState(null, "", t) : history.pushState(null, "", t), A(window, "location-changed", { replace: e });
}, Ei = function(n, t, e) {
  e === void 0 && (e = !0);
  var i, s = Ai(t), a = s === "group" ? "homeassistant" : s;
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
}, zi = function(n, t) {
  var e = ki.includes(n.states[t].state);
  return Ei(n, t, e);
}, k = function(n, t, e, i) {
  if (i || (i = { action: "more-info" }), !i.confirmation || i.confirmation.exemptions && i.confirmation.exemptions.some(function(a) {
    return a.user === t.user.id;
  }) || (et("warning"), confirm(i.confirmation.text || "Are you sure you want to " + i.action + "?"))) switch (i.action) {
    case "more-info":
      (e.entity || e.camera_image) && A(n, "hass-more-info", { entityId: e.entity ? e.entity : e.camera_image });
      break;
    case "navigate":
      i.navigation_path && Ti(0, i.navigation_path);
      break;
    case "url":
      i.url_path && window.open(i.url_path);
      break;
    case "toggle":
      e.entity && (zi(t, e.entity), et("success"));
      break;
    case "call-service":
      if (!i.service) return void et("failure");
      var s = i.service.split(".", 2);
      t.callService(s[0], s[1], i.service_data, i.target), et("success");
      break;
    case "fire-dom-event":
      A(n, "ll-custom", i);
  }
};
const ht = class ht extends _ {
  constructor() {
    super(...arguments), this.label = "", this.fieldName = "template", this.value = "", this._computeLabel = (t) => t.name === this.fieldName ? this.label : t.name;
  }
  render() {
    return this.hass && customElements.get("ha-form") ? c`
        <ha-form
          class="template-form"
          .hass=${this.hass}
          .data=${{ [this.fieldName]: this.value }}
          .schema=${this._schema}
          .computeLabel=${this._computeLabel}
          @value-changed=${this._handleFormChange}
        ></ha-form>
      ` : customElements.get("ha-selector-template") && this.hass ? c`
        <div class="template-field">
          <ha-selector-template
            .hass=${this.hass}
            .selector=${{ template: {} }}
            .value=${this.value}
            .label=${this.label}
            ?required=${!1}
            @value-changed=${this._handleSelectorChange}
          ></ha-selector-template>
        </div>
      ` : c`
      <label>
        <span>${this.label}</span>
        <textarea
          .value=${this.value}
          rows="4"
          placeholder="{{ ... }}"
          @input=${(t) => this._emitValueChanged(t.target.value)}
        ></textarea>
      </label>
    `;
  }
  get _schema() {
    return [{ name: this.fieldName, selector: { template: {} }, required: !1 }];
  }
  _emitValueChanged(t) {
    this.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: { value: t },
        bubbles: !0,
        composed: !0
      })
    );
  }
  _handleFormChange(t) {
    t.stopPropagation();
    const e = t.detail.value;
    this._emitValueChanged(e[this.fieldName] ?? "");
  }
  _handleSelectorChange(t) {
    t.stopPropagation(), this._emitValueChanged(t.detail.value ?? "");
  }
};
ht.properties = {
  hass: { attribute: !1 },
  label: { type: String },
  fieldName: { type: String },
  value: { type: String }
}, ht.styles = w`
    :host {
      display: block;
    }

    ha-form,
    ha-selector-template {
      display: block;
      width: 100%;
    }

    label {
      display: grid;
      gap: 6px;
    }

    label span {
      color: var(--secondary-text-color);
      font-size: 12px;
      font-weight: 500;
    }
  `;
let qt = ht;
customElements.define("ha-cards-jinja-editor", qt);
const ne = class ne extends _ {
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
        var o, r;
        return ((o = e.states) == null ? void 0 : o[a]) !== ((r = i.states) == null ? void 0 : r[a]);
      });
    }
    return !1;
  }
};
ne.properties = {
  hass: { attribute: !1 },
  config: { attribute: !1 }
};
let O = ne;
function L(n) {
  const { hass: t, label: e, value: i, domains: s, disabled: a = !1, onValueChanged: o } = n;
  return s.length ? c`
    <div class="field">
      <ha-entity-picker
        .hass=${t}
        .label=${e}
        .value=${i}
        .includeDomains=${s}
        ?disabled=${a}
        allow-custom-entity
        @value-changed=${(r) => o(r.detail.value)}
      ></ha-entity-picker>
    </div>
  ` : c`
      <div class="field">
        <ha-entity-picker
          .hass=${t}
          .label=${e}
          .value=${i}
          ?disabled=${a}
          allow-custom-entity
          @value-changed=${(r) => o(r.detail.value)}
        ></ha-entity-picker>
      </div>
    `;
}
function we(n) {
  const { hass: t, label: e, fieldName: i, value: s, onValueChanged: a } = n;
  return c`
    <ha-cards-jinja-editor
      .hass=${t}
      .label=${e}
      .fieldName=${i}
      .value=${s}
      @value-changed=${(o) => a(o.detail.value ?? "")}
    ></ha-cards-jinja-editor>
  `;
}
function U(n) {
  const { label: t, value: e, placeholder: i = "", onInput: s } = n;
  return c`
    <label>
      <span>${t}</span>
      <input .value=${e} placeholder=${i} @input=${(a) => s(a.target.value)} />
    </label>
  `;
}
function rt(n) {
  const { hass: t, label: e, value: i, fallback: s, onValueChanged: a } = n;
  return c`
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
function it(n) {
  const { label: t, value: e, placeholder: i, onInput: s } = n;
  return c`
    <label>
      <span>${t}</span>
      <input .value=${e} placeholder=${i} @input=${(a) => s(a.target.value)} />
    </label>
  `;
}
function Ii(n) {
  const { actionConfig: t, formatJson: e, onActionValueChanged: i, onServiceDataChanged: s, serviceDataError: a } = n;
  switch (t.action) {
    case "more-info":
      return it({
        label: "Entity override",
        value: String(t.entity || ""),
        placeholder: "Optional entity",
        onInput: (o) => i("entity", o)
      });
    case "navigate":
      return it({
        label: "Navigation path",
        value: String(t.navigation_path || ""),
        placeholder: "/lovelace/0",
        onInput: (o) => i("navigation_path", o)
      });
    case "url":
      return it({
        label: "URL path",
        value: String(t.url_path || ""),
        placeholder: "https://example.com",
        onInput: (o) => i("url_path", o)
      });
    case "call-service":
      return c`
        ${it({
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
        ${a ? c`<div class="error">${a}</div>` : ""}
      `;
    default:
      return "";
  }
}
function Vi(n) {
  const { label: t, actionConfig: e, actionOptions: i, onActionTypeChanged: s, fields: a, className: o } = n, r = e.action;
  return c`
    <fieldset class=${o || ""}>
      <legend>${t}</legend>

      <label>
        <span>Action</span>
        <select
          .value=${r}
          @change=${(l) => s(l.target.value)}
        >
          ${i.map(
    (l) => c` <option value=${l.value} ?selected=${l.value === r}>${l.label}</option> `
  )}
        </select>
      </label>

      ${a}
    </fieldset>
  `;
}
function Gt(n) {
  const {
    label: t,
    actionConfig: e,
    actionOptions: i,
    onActionTypeChanged: s,
    onActionValueChanged: a,
    onServiceDataChanged: o,
    formatJson: r,
    serviceDataError: l,
    className: u
  } = n;
  return Vi({
    label: t,
    className: u,
    actionConfig: e,
    actionOptions: i,
    onActionTypeChanged: s,
    fields: Ii({
      actionConfig: e,
      formatJson: r,
      onActionValueChanged: a,
      onServiceDataChanged: o,
      serviceDataError: l
    })
  });
}
const Di = [
  { value: "more-info", label: "More info" },
  { value: "toggle", label: "Toggle" },
  { value: "navigate", label: "Navigate" },
  { value: "url", label: "URL" },
  { value: "call-service", label: "Call service" },
  { value: "fire-dom-event", label: "Fire DOM event" },
  { value: "none", label: "None" }
], ut = class ut extends _ {
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
    return c`
      <div class="editor">
        <div class="grid">
          ${U({
      label: "Name",
      value: String(this.config.name || ""),
      placeholder: "Living room",
      onInput: (t) => this.updateConfigValue("name", t)
    })}
          ${L({
      hass: this.hass,
      label: "Light entity",
      value: String(this.config.entity || ""),
      domains: ["light"],
      onValueChanged: (t) => this.updateConfigValue("entity", t)
    })}
          ${rt({
      hass: this.hass,
      label: "Icon",
      value: String(this.config.icon || ""),
      fallback: "mdi:sofa",
      onValueChanged: (t) => this.updateConfigValue("icon", t)
    })}
          ${L({
      hass: this.hass,
      label: "Sensor 1 entity",
      value: String(this.config.sensor1_entity || ""),
      domains: ["sensor"],
      onValueChanged: (t) => this.updateConfigValue("sensor1_entity", t)
    })}
          ${rt({
      hass: this.hass,
      label: "Sensor 1 icon",
      value: String(this.config.sensor1_icon || ""),
      fallback: "mdi:thermometer",
      onValueChanged: (t) => this.updateConfigValue("sensor1_icon", t)
    })}
          ${L({
      hass: this.hass,
      label: "Sensor 2 entity",
      value: String(this.config.sensor2_entity || ""),
      domains: ["sensor"],
      onValueChanged: (t) => this.updateConfigValue("sensor2_entity", t)
    })}
          ${rt({
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
    return Gt({
      label: t,
      actionConfig: i,
      actionOptions: Di,
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
    this.config = t, A(this, "config-changed", { config: t });
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
ut.properties = {
  hass: { attribute: !1 },
  config: { attribute: !1 }
}, ut.styles = w`
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
let Kt = ut;
customElements.define("room-card-editor", Kt);
const st = { action: "more-info" }, kt = { action: "toggle" }, Tt = { action: "more-info" }, Et = "mdi:thermometer", zt = "mdi:water-percent", re = class re extends O {
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
      sensor1_icon: Et,
      sensor2_icon: zt,
      tap_action: st,
      light_tap_action: kt,
      light_hold_action: Tt
    };
  }
  setConfig(t) {
    if (!t.entity)
      throw new Error("Room Card requires a light entity");
    this.config = {
      icon: "mdi:sofa",
      sensor1_icon: Et,
      sensor2_icon: zt,
      tap_action: st,
      light_tap_action: kt,
      light_hold_action: Tt,
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
    var r;
    const t = this.getLightEntity(), e = this.isLightOff(t), i = this.config.name || ((r = t == null ? void 0 : t.attributes) == null ? void 0 : r.friendly_name) || "Room", s = this.getLightRgb(t), a = !!(this.config.sensor1_entity || this.config.sensor2_entity), o = s ? {
      "--room-light-rgb": s.join(",")
    } : {};
    return c`
      <ha-card class=${e ? "light-off" : ""} style=${Q(o)} @click=${this.handleCardTap}>
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
            ${a ? c`
                  <div class="sensors">
                    ${this.config.sensor1_entity ? this.renderSensor(
      this.config.sensor1_icon || Et,
      this.config.sensor1_entity
    ) : ""}
                    ${this.config.sensor2_entity ? this.renderSensor(
      this.config.sensor2_icon || zt,
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
    return c`
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
    return t.trim() === "" || !Number.isFinite(e) ? t : ti(e, (i = this.hass) == null ? void 0 : i.locale, { maximumFractionDigits: 2 });
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
    const s = e / 100, a = i / 100, o = (1 - Math.abs(2 * a - 1)) * s, r = t / 60, l = o * (1 - Math.abs(r % 2 - 1)), u = a - o / 2;
    let p = [0, 0, 0];
    return r >= 0 && r < 1 ? p = [o, l, 0] : r < 2 ? p = [l, o, 0] : r < 3 ? p = [0, o, l] : r < 4 ? p = [0, l, o] : r < 5 ? p = [l, 0, o] : p = [o, 0, l], p.map((h) => Math.round((h + u) * 255));
  }
  handleCardTap(t) {
    t.target.closest(".light-button") || this.runAction(this.config.tap_action || st);
  }
  handleCardKeydown(t) {
    t.key !== "Enter" && t.key !== " " || (t.preventDefault(), this.runAction(this.config.tap_action || st));
  }
  handleLightTap(t) {
    if (t.stopPropagation(), this.lightHoldTriggered) {
      this.lightHoldTriggered = !1;
      return;
    }
    this.cancelLightHold(), this.runAction(this.config.light_tap_action || kt);
  }
  handleLightPointerDown(t) {
    t.stopPropagation(), this.lightHoldTriggered = !1, this.cancelLightHold(), this.holdTimer = window.setTimeout(() => {
      this.lightHoldTriggered = !0, this.runAction(this.config.light_hold_action || Tt);
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
    k(
      this,
      this.hass,
      {
        entity: this.config.entity
      },
      t
    );
  }
};
re.styles = w`
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
let Jt = re;
customElements.define("room-card", Jt);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "room-card",
  name: "Room Card",
  description: "Room card with light actions and sensors"
});
const Li = {
  equals: "is",
  not_equals: "is not",
  gt: ">",
  lt: "<",
  lte: "<=",
  gte: ">=",
  contains: "contains",
  not_contains: "does not contain"
};
function Mi(n, t) {
  var s;
  const e = n.check.operator === "not_contains" ? n.check.values.join(", ") : n.matchedValue || n.check.values.join(", "), i = String(((s = n.entity.attributes) == null ? void 0 : s.unit_of_measurement) || "");
  return {
    entity: n.check.entity,
    entity_id: n.check.entity,
    name: t(n.check.entity, n.entity),
    state: n.entity.state,
    matched: e,
    matched_value: e,
    operator: n.check.operator,
    operator_label: Li[n.check.operator],
    unit: i,
    unit_of_measurement: i,
    values: n.check.values.join(", "),
    attributes: n.entity.attributes
  };
}
const pt = class pt extends _ {
  constructor() {
    super(...arguments), this.template = "", this.variables = {}, this.entityIds = [], this.fallback = "", this._rendered = "";
  }
  connectedCallback() {
    super.connectedCallback(), this._subscribeTemplate();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._unsubscribeTemplate();
  }
  updated(t) {
    (t.has("template") || t.has("variables") || t.has("entityIds") || t.has("hass")) && this._subscribeTemplate();
  }
  render() {
    return c`<span>${this._rendered || this.fallback}</span>`;
  }
  _formatResult(t) {
    if (typeof t == "object")
      try {
        return JSON.stringify(t);
      } catch {
        return this.fallback;
      }
    return String(t ?? "");
  }
  async _subscribeTemplate() {
    var t;
    if (await this._unsubscribeTemplate(), !((t = this.hass) != null && t.connection) || !this.template) {
      this._rendered = "";
      return;
    }
    try {
      this._unsubRenderTemplate = this.hass.connection.subscribeMessage(
        (e) => {
          "error" in e ? this._rendered = this.fallback : this._rendered = this._formatResult(e.result), this.requestUpdate();
        },
        {
          type: "render_template",
          template: this.template,
          variables: this.variables,
          entity_ids: this.entityIds.length ? this.entityIds : void 0,
          report_errors: !0
        }
      ), await this._unsubRenderTemplate;
    } catch {
      this._rendered = this.fallback, this._unsubRenderTemplate = void 0, this.requestUpdate();
    }
  }
  async _unsubscribeTemplate() {
    if (this._unsubRenderTemplate)
      try {
        const t = await this._unsubRenderTemplate;
        t == null || t();
      } catch (t) {
        if ((t == null ? void 0 : t.code) !== "not_found")
          throw t;
      } finally {
        this._unsubRenderTemplate = void 0;
      }
  }
};
pt.properties = {
  hass: { attribute: !1 },
  template: { type: String },
  variables: { attribute: !1 },
  entityIds: { attribute: !1 },
  fallback: { type: String }
}, pt.styles = w`
    :host {
      display: inline;
    }
  `;
let Yt = pt;
customElements.define("ha-cards-template-text", Yt);
async function Ni() {
  if (customElements.get("ha-form") && customElements.get("ha-entity-picker"))
    return !0;
  let n = !1;
  return customElements.get("ha-form") || (n = await $e("hui-tile-card", {
    type: "tile",
    entity: "sun.sun"
  }) || n), customElements.get("ha-entity-picker") || (n = await $e("hui-entities-card", {
    type: "entities",
    entities: []
  }) || n), n || !!customElements.get("ha-form");
}
async function $e(n, t) {
  let e = customElements.get(n);
  if (typeof (e == null ? void 0 : e.getConfigElement) != "function") {
    const i = window.loadCardHelpers;
    if (!i)
      return !1;
    try {
      await (await i()).createCardElement(t), e = customElements.get(n);
    } catch {
      return !1;
    }
  }
  return typeof (e == null ? void 0 : e.getConfigElement) == "function" ? (await e.getConfigElement(), !0) : !1;
}
const xe = "Possible Issues", Ae = "#44739e", Se = ["sensor", "light", "switch"], Oi = ["unavailable"], Ui = ["unavailable", "unknown", "none"], Ce = "none", Ri = [
  { value: "equals", label: "Equals" },
  { value: "not_equals", label: "Does not equal" },
  { value: "gt", label: "Greater than (>)" },
  { value: "lt", label: "Less than (<)" },
  { value: "lte", label: "Less than or equal (<=)" },
  { value: "gte", label: "Greater than or equal (>=)" },
  { value: "contains", label: "Contains" },
  { value: "not_contains", label: "Does not contain" }
], gt = class gt extends _ {
  constructor() {
    super(...arguments), this.config = {}, this.integrationOptions = [], this.integrationsLoading = !1, this.integrationsVersion = 0, this.haComponentsVersion = 0;
  }
  connectedCallback() {
    super.connectedCallback(), this.loadHomeAssistantPickers();
  }
  setConfig(t) {
    this.config = {
      title: xe,
      background_color: Ae,
      domains: Se,
      issue_states: Oi,
      included_entities: [],
      ignored_entities: [],
      ignored_devices: [],
      ignored_integrations: [],
      ignored_name_patterns: [],
      row_detail: Ce,
      value_checks: [],
      ...t
    };
  }
  shouldUpdate(t) {
    return t.has("config") || t.has("integrationsVersion") || t.has("haComponentsVersion") ? !0 : t.has("hass") ? !t.get("hass") && !!this.hass : !1;
  }
  updated(t) {
    t.has("hass") && this.loadIntegrationOptions();
  }
  render() {
    return c`
      <div class="editor">
        <div class="grid">
          ${U({
      label: "Title",
      value: String(this.config.title || ""),
      placeholder: xe,
      onInput: (t) => this.updateConfigValue("title", t)
    })}
          ${this.renderColorInput("Background color", "background_color", Ae)}
          ${this.renderListField("Domains", "domains", Se, "sensor, light, switch")}
          ${this.renderIssueStatesField()}
          ${this.renderValueChecksField()}
          ${this.renderListField("Only include entity IDs or patterns", "included_entities", [], "sensor.temperature, light.kitchen")}
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
    return U({
      label: t,
      value: this.formatList(this.config[e], i),
      placeholder: s,
      onInput: (a) => this.updateListValue(e, a)
    });
  }
  renderColorInput(t, e, i) {
    const s = this.toColorInputValue(String(this.config[e] || i), i);
    return c`
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
  renderIssueStatesField() {
    const t = this.parseConfigList(this.config.issue_states), e = new Set(t), i = Ui.filter((s) => !e.has(s));
    return c`
      <div class="field-group">
        <label>
          <span>Issue states</span>
          <select ?disabled=${i.length === 0} @change=${(s) => this.handleIssueStateSelected(s)}>
            <option value="">${i.length ? "Add state" : "All common states selected"}</option>
            ${i.map((s) => c`<option value=${s}>${s}</option>`)}
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

        ${t.length ? c`
              <div class="chips" aria-label="Issue states">
                ${t.map(
      (s) => c`
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
    return c`
      <div class="field-group">
        <div class="section-header">
          <span>Entity value checks</span>
          <button type="button" @click=${() => this.addValueCheck()}>Add check</button>
        </div>

        ${t.length ? t.map(
      (e, i) => c`
                <div class="value-check">
                  ${L({
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
                      ${Ri.map(
        (s) => c`
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

                  ${we({
        hass: this.hass,
        label: "Message",
        fieldName: "message",
        value: e.message || "",
        onValueChanged: (s) => this.updateValueCheck(i, "message", s)
      })}

                  ${we({
        hass: this.hass,
        label: "Submessage",
        fieldName: "submessage",
        value: e.submessage || "",
        onValueChanged: (s) => this.updateValueCheck(i, "submessage", s)
      })}
                  <p class="hint">
                    Supports Home Assistant templating (<a href="https://www.home-assistant.io/docs/templating/" target="_blank" rel="noopener noreferrer">docs</a>).
                    Card variables: entity_id, name, state, matched_value, unit, operator, operator_label, values, attributes.
                    Example: <code>{{ name }}</code> or <code>{{ state_attr(entity_id, 'icon') }}</code>.
                  </p>

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
    ) : c`<p class="hint">Add checks to show an entity when its state matches one or more configured values.</p>`}
      </div>
    `;
  }
  renderIgnoredIntegrationsField() {
    const t = this.parseConfigList(this.config.ignored_integrations), e = new Set(t), i = this.integrationOptions.filter((a) => !e.has(a)), s = this.integrationsLoading || i.length === 0;
    return c`
      <label>
        <span>Ignored integrations</span>
        <select ?disabled=${s} @change=${(a) => this.handleIgnoredIntegrationSelected(a)}>
          <option value="">
            ${this.integrationsLoading ? "Loading integrations..." : i.length ? "Add integration" : "No integrations available"}
          </option>
          ${i.map((a) => c`<option value=${a}>${this.formatIntegrationName(a)}</option>`)}
        </select>
      </label>
      ${t.length ? c`
            <div class="chips" aria-label="Ignored integrations">
              ${t.map(
      (a) => c`
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
    const t = this.config.row_detail || Ce;
    return c`
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
  toColorInputValue(t, e) {
    return /^#[0-9a-fA-F]{6}$/.test(t) ? t : e;
  }
  updateConfig(t) {
    this.config = t, A(this, "config-changed", { config: t });
  }
  async loadHomeAssistantPickers() {
    try {
      await Ni() && (this.haComponentsVersion += 1);
    } catch (t) {
      console.warn("possible-issues-card: Failed to load Home Assistant pickers", t);
    }
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
gt.properties = {
  hass: { attribute: !1 },
  config: { attribute: !1 },
  integrationsVersion: { state: !0 },
  haComponentsVersion: { state: !0 }
}, gt.styles = w`
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

    .hint code {
      font-family: var(--code-font-family, monospace);
      font-size: 11px;
    }

    .hint a {
      color: var(--primary-color);
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
    textarea,
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
let Zt = gt;
customElements.define("possible-issues-card-editor", Zt);
const It = "Possible Issues", Vt = "#44739e", W = ["sensor", "light", "switch"], at = ["unavailable"], Dt = "none", mt = class mt extends O {
  constructor() {
    super(...arguments), this.entityRegistry = [], this.deviceRegistry = [], this.registryLoading = !1, this.registryError = !1, this.registryVersion = 0;
  }
  static getConfigElement() {
    return document.createElement("possible-issues-card-editor");
  }
  static getStubConfig() {
    return {
      title: It,
      background_color: Vt,
      domains: W,
      issue_states: at,
      included_entities: [],
      ignored_entities: [],
      ignored_devices: [],
      ignored_integrations: [],
      ignored_name_patterns: [],
      row_detail: Dt,
      value_checks: []
    };
  }
  setConfig(t) {
    this.config = {
      title: It,
      background_color: Vt,
      domains: W,
      issue_states: at,
      included_entities: [],
      ignored_entities: [],
      ignored_devices: [],
      ignored_integrations: [],
      ignored_name_patterns: [],
      row_detail: Dt,
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
    const t = this.getIssueDevices(), e = [...this.getStateIssueEntities(), ...this.getValueCheckIssues()], i = {
      "--possible-issues-card-background": this.config.background_color || Vt
    };
    return !t.length && !e.length ? c`` : c`
      <ha-card style=${Q(i)}>
        <div class="card">
          <h2>${this.config.title || It}</h2>
          <div class="devices">
            ${t.map((s) => this.renderDeviceRow(s))}
            ${e.map((s) => this.renderEntityRow(s))}
          </div>
        </div>
      </ha-card>
    `;
  }
  renderDeviceRow(t) {
    const e = this.getDeviceName(t.device), i = this.getIssueIcon(t.entities[0]), s = this.getRowDetail(t);
    return c`
      <button class="device-row" type="button" @click=${() => this.openIssueDevice(t)}>
        <ha-icon .icon=${i}></ha-icon>
        <span class="row-text">
          <span class="name">${e}</span>
          ${s ? c`<span class="detail">${s}</span>` : ""}
        </span>
      </button>
    `;
  }
  renderEntityRow(t) {
    var l, u, p;
    const e = t.entityId, i = this.isValueCheckIssue(t), s = this.getEntityName(e, t.entity), a = i ? this.getValueCheckDetail(t) : this.getStateIssueDetail(t), o = i ? Mi(t, (h, d) => this.getEntityName(h, d)) : void 0, r = ((l = t.entity.attributes) == null ? void 0 : l.icon) || ((u = t.registryEntry) == null ? void 0 : u.icon) || ((p = t.registryEntry) == null ? void 0 : p.original_icon) || "mdi:alert-circle-outline";
    return c`
      <button class="device-row" type="button" @click=${() => this.openIssueEntity(t)}>
        <ha-icon .icon=${r}></ha-icon>
        <span class="row-text">
          <span class="name">
            ${i && t.check.message ? c`<ha-cards-template-text
                  .hass=${this.hass}
                  .template=${t.check.message}
                  .variables=${o}
                  .entityIds=${[t.check.entity]}
                  .fallback=${s}
                ></ha-cards-template-text>` : s}
          </span>
          <span class="detail">
            ${i && t.check.submessage ? c`<ha-cards-template-text
                  .hass=${this.hass}
                  .template=${t.check.submessage}
                  .variables=${o}
                  .entityIds=${[t.check.entity]}
                  .fallback=${a}
                ></ha-cards-template-text>` : a}
          </span>
        </span>
      </button>
    `;
  }
  getIssueDevices() {
    var p;
    if (this.registryError || !this.entityRegistry.length || !this.deviceRegistry.length || !this.hass)
      return [];
    const t = new Set(this.normalizeList(this.config.domains, W)), e = new Set(this.normalizeList(this.config.issue_states, at)), i = this.normalizeList(this.config.included_entities), s = this.normalizeList(this.config.ignored_entities), a = this.normalizeList(this.config.ignored_devices), o = new Set(
      this.normalizeList(this.config.ignored_integrations).map((h) => h.toLowerCase())
    ), r = this.normalizeList(this.config.ignored_name_patterns), l = new Map(this.deviceRegistry.map((h) => [h.id, h])), u = /* @__PURE__ */ new Map();
    for (const h of this.entityRegistry) {
      const d = this.hass.states[h.entity_id], g = h.device_id || "", m = l.get(g);
      if (!d || !m || !t.has(this.getDomain(h.entity_id)) || !e.has(d.state) || h.platform && o.has(h.platform.toLowerCase()) || i.length && !this.matchesPattern(h.entity_id, i) || this.matchesPattern(h.entity_id, s) || this.matchesPattern(g, a))
        continue;
      const v = [this.getDeviceName(m), (p = d.attributes) == null ? void 0 : p.friendly_name, h.name, h.original_name].filter(Boolean).join(" ");
      this.matchesPattern(v, r) || u.set(g, [...u.get(g) || [], h]);
    }
    return [...u.entries()].map(([h, d]) => ({
      device: l.get(h),
      entities: d
    })).sort((h, d) => this.getDeviceName(h.device).localeCompare(this.getDeviceName(d.device)));
  }
  getStateIssueEntities() {
    if (!this.hass || !this.registryError && !this.registryVersion)
      return [];
    const t = new Set(this.normalizeList(this.config.domains, W)), e = new Set(this.normalizeList(this.config.issue_states, at)), i = this.normalizeList(this.config.included_entities), s = this.normalizeList(this.config.ignored_entities), a = this.normalizeList(this.config.ignored_devices), o = new Set(
      this.normalizeList(this.config.ignored_integrations).map((d) => d.toLowerCase())
    ), r = this.normalizeList(this.config.ignored_name_patterns), l = new Map(this.deviceRegistry.map((d) => [d.id, d])), u = new Set(this.entityRegistry.map((d) => d.entity_id)), p = this.entityRegistry.map((d) => {
      var b;
      const g = this.hass.states[d.entity_id], m = d.device_id || "", v = l.get(m);
      if (!g || v || !t.has(this.getDomain(d.entity_id)) || !e.has(g.state) || d.platform && o.has(d.platform.toLowerCase()) || i.length && !this.matchesPattern(d.entity_id, i) || this.matchesPattern(d.entity_id, s) || this.matchesPattern(m, a))
        return;
      const $ = [(b = g.attributes) == null ? void 0 : b.friendly_name, d.name, d.original_name].filter(Boolean).join(" ");
      if (!this.matchesPattern($, r))
        return {
          entityId: d.entity_id,
          entity: g,
          issueState: g.state,
          registryEntry: d
        };
    }).filter((d) => !!d), h = Object.entries(this.hass.states || {}).map(([d, g]) => {
      var v;
      if (u.has(d) || !t.has(this.getDomain(d)) || !e.has(g.state) || i.length && !this.matchesPattern(d, i) || this.matchesPattern(d, s))
        return;
      const m = [(v = g.attributes) == null ? void 0 : v.friendly_name].filter(Boolean).join(" ");
      if (!this.matchesPattern(m, r))
        return {
          entityId: d,
          entity: g,
          issueState: g.state
        };
    }).filter((d) => !!d);
    return [...p, ...h].sort(
      (d, g) => this.getEntityName(d.entityId, d.entity).localeCompare(this.getEntityName(g.entityId, g.entity))
    );
  }
  getValueCheckIssues() {
    return this.hass ? this.getValueChecks().map((t) => {
      const e = this.hass.states[t.entity], i = e ? this.getMatchedValue(e.state, t) : void 0;
      return e && i !== void 0 ? {
        entityId: t.entity,
        check: t,
        entity: e,
        matchedValue: i
      } : void 0;
    }).filter((t) => !!t) : [];
  }
  getDomainEntityIds(t) {
    var s, a;
    const e = new Set(this.normalizeList((s = this.config) == null ? void 0 : s.domains, W)), i = this.normalizeList((a = this.config) == null ? void 0 : a.included_entities);
    return Object.keys(t.states || {}).filter(
      (o) => e.has(this.getDomain(o)) && (!i.length || this.matchesPattern(o, i))
    );
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
    const e = this.config.row_detail || Dt;
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
  getStateIssueDetail(t) {
    return `State is ${t.issueState}`;
  }
  getValueCheckDetail(t) {
    var r;
    const e = this.getOperatorLabel(t.check.operator), i = ((r = t.entity.attributes) == null ? void 0 : r.unit_of_measurement) || "", s = t.check.operator === "not_contains" ? t.check.values.join(", ") : t.matchedValue || t.check.values.join(", "), a = `${t.entity.state} ${i ? `${i}` : ""}`, o = `${s} ${i ? `${i}` : ""}`;
    return `${a} ${e} ${o}`;
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
    k(
      this,
      this.hass,
      {},
      {
        action: "navigate",
        navigation_path: `/config/devices/device/${t}`
      }
    );
  }
  openIssueDevice(t) {
    const [e] = t.entities;
    if (e && t.entities.length === 1 && !e.device_id) {
      this.openEntity(e.entity_id);
      return;
    }
    this.openDevice(t.device.id);
  }
  openEntity(t) {
    k(
      this,
      this.hass,
      { entity: t },
      {
        action: "more-info"
      }
    );
  }
  openIssueEntity(t) {
    if (this.isValueCheckIssue(t) && t.check.navigation_path) {
      k(
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
    this.openEntity(t.entityId);
  }
  isValueCheckIssue(t) {
    return "check" in t;
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
  matchesPattern(t, e) {
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
mt.properties = {
  hass: { attribute: !1 },
  config: { attribute: !1 },
  registryVersion: { state: !0 }
}, mt.styles = w`
    ha-card {
      background: var(--possible-issues-card-background);
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
let Xt = mt;
customElements.define("possible-issues-card", Xt);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "possible-issues-card",
  name: "Possible Issues Card",
  description: "Lists devices with unavailable entities and entities matching configurable value checks"
});
const ke = "/config/dashboard", Fi = [
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
], Te = [
  { value: "more-info", label: "More info" },
  { value: "toggle", label: "Toggle" },
  { value: "navigate", label: "Navigate" },
  { value: "url", label: "URL" },
  { value: "call-service", label: "Call service" },
  { value: "fire-dom-event", label: "Fire DOM event" },
  { value: "none", label: "None" }
], ft = class ft extends _ {
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
      settings_navigation_path: ke,
      tabs: Fi,
      ...t
    };
  }
  shouldUpdate(t) {
    return t.has("config") ? !0 : t.has("hass") ? !t.get("hass") && !!this.hass : !1;
  }
  render() {
    return c`
      <div class="editor">
        <div class="grid">
          ${L({
      hass: this.hass,
      label: "Weather entity",
      value: String(this.config.weather_entity || ""),
      domains: ["weather"],
      onValueChanged: (t) => this.updateConfigValue("weather_entity", t)
    })}
          ${this.renderCheckbox("Show temperature", "show_temperature")}
          ${this.renderCheckbox("Use Home Assistant weather icons", "use_ha_weather_icons")}
          ${L({
      hass: this.hass,
      label: "Temperature entity override",
      value: String(this.config.temperature_entity || ""),
      domains: ["sensor"],
      disabled: !this.config.show_temperature,
      onValueChanged: (t) => this.updateConfigValue("temperature_entity", t)
    })}
          ${U({
      label: "Settings navigation path",
      value: String(this.config.settings_navigation_path || ""),
      placeholder: ke,
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
    return c`
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
    return c`
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
    return c`
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
    return c`
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
    return Gt({
      label: t,
      className: "action-editor",
      actionConfig: i,
      actionOptions: Te,
      onActionTypeChanged: (a) => this.updateTabActionType(e, a),
      onActionValueChanged: (a, o) => this.updateTabActionValue(e, a, o),
      onServiceDataChanged: (a) => this.updateServiceData(e, a),
      formatJson: (a) => this.formatJson(a),
      serviceDataError: this.serviceDataErrors[s]
    });
  }
  renderWeatherActionEditor(t, e) {
    const i = this.getWeatherServiceDataErrorKey();
    return Gt({
      label: t,
      className: "action-editor",
      actionConfig: e,
      actionOptions: Te,
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
    this.config = t, A(this, "config-changed", { config: t });
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
ft.properties = {
  hass: { attribute: !1 },
  config: { attribute: !1 }
}, ft.styles = w`
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
let Qt = ft;
customElements.define("welcome-card-editor", Qt);
const ot = "/config/dashboard", Lt = { action: "more-info" }, Pi = { action: "none" }, Hi = "welcome-card:collapsed", Ee = [
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
], Mt = {
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
}, Bi = {
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
}, vt = class vt extends O {
  constructor() {
    super(...arguments), this._collapsed = !1, this._now = /* @__PURE__ */ new Date();
  }
  static getConfigElement() {
    return document.createElement("welcome-card-editor");
  }
  static getStubConfig() {
    return {
      weather_entity: "",
      weather_tap_action: Lt,
      show_temperature: !0,
      use_ha_weather_icons: !1,
      settings_navigation_path: ot,
      tabs: Ee
    };
  }
  setConfig(t) {
    this.config = {
      weather_tap_action: Lt,
      show_temperature: !0,
      use_ha_weather_icons: !1,
      settings_navigation_path: ot,
      tabs: Ee,
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
    return c`
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
              ${this.config.show_temperature ? c`<span class="temperature">${this.formatTemperature()}</span>` : ""}
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
            ${!this._collapsed && t.length ? c`<div class="tabs">${t.map((e) => this.renderTab(e))}</div>` : ""}
          </div>
        </div>
      </ha-card>
    `;
  }
  renderTab(t) {
    const i = {
      "--tab-color": t.color || "var(--primary-color)"
    };
    return c`
      <button
        class="tab"
        style=${Q(i)}
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
      ((i = this.config) == null ? void 0 : i.settings_navigation_path) || ot,
      (((s = this.config) == null ? void 0 : s.tabs) || []).map((a) => a.label || "").join("|")
    ];
    return `${Hi}${t.join(":")}`;
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
    k(
      this,
      this.hass,
      {},
      {
        action: "navigate",
        navigation_path: this.config.settings_navigation_path || ot
      }
    );
  }
  handleWeatherTap() {
    const t = this.config.weather_tap_action || Lt, e = t.entity || this.config.weather_entity || this.config.temperature_entity;
    !e && t.action === "more-info" || k(this, this.hass, e ? { entity: e } : {}, t);
  }
  runTabAction(t) {
    k(this, this.hass, {}, t.tap_action || Pi);
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
    return t && Bi[t] || "mdi:weather-cloudy";
  }
  getWeatherEmoji() {
    var e;
    const t = (e = this.getWeatherEntity()) == null ? void 0 : e.state;
    return t && Mt[t] || Mt.default;
  }
  renderWeatherIcon() {
    return this.config.use_ha_weather_icons ? c`<ha-icon .icon=${this.getWeatherIcon()}></ha-icon>` : c`<span class="weather-emoji" aria-hidden="true">${this.getWeatherEmoji()}</span>`;
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
    var s, a, o, r, l, u;
    const t = this.getTemperatureEntity();
    if (t)
      return this.formatTemperatureValue(
        t.state,
        (s = t.attributes) == null ? void 0 : s.unit_of_measurement
      );
    const e = this.getWeatherEntity(), i = (a = e == null ? void 0 : e.attributes) == null ? void 0 : a.temperature;
    return i == null || i === "" ? "-" : this.formatTemperatureValue(
      i,
      ((o = e == null ? void 0 : e.attributes) == null ? void 0 : o.temperature_unit) || ((u = (l = (r = this.hass) == null ? void 0 : r.config) == null ? void 0 : l.unit_system) == null ? void 0 : u.temperature)
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
vt.properties = {
  hass: { attribute: !1 },
  config: { attribute: !1 },
  _collapsed: { state: !0 },
  _now: { state: !0 }
}, vt.styles = w`
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
let te = vt;
customElements.define("welcome-card", te);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "welcome-card",
  name: "Welcome Card",
  description: "Greeting, weather/date pill, and quick-action tabs"
});
const ze = "mdi:thermostat", Ie = "#fbb73c", Ve = "#3a8dde", De = "two_rows", bt = class bt extends _ {
  constructor() {
    super(...arguments), this.config = {};
  }
  connectedCallback() {
    super.connectedCallback(), this.loadHomeAssistantPickers();
  }
  setConfig(t) {
    this.config = {
      icon: ze,
      compact: !1,
      show_controls: !0,
      show_modes: !1,
      show_presets: !1,
      show_fan_mode: !1,
      show_off_mode: !1,
      modes: [],
      presets: [],
      dual_setpoint_layout: De,
      step_amount: void 0,
      heating_color: Ie,
      cooling_color: Ve,
      ...t
    };
  }
  shouldUpdate(t) {
    return t.has("config") ? !0 : t.has("hass") ? !t.get("hass") && !!this.hass : !1;
  }
  render() {
    var s, a;
    const t = this.getSelectedEntity(), e = this.asStringArray((s = t == null ? void 0 : t.attributes) == null ? void 0 : s.hvac_modes).filter((o) => o !== "off"), i = this.asStringArray((a = t == null ? void 0 : t.attributes) == null ? void 0 : a.preset_modes);
    return c`
      <div class="editor">
        <div class="grid">
          ${U({
      label: "Name",
      value: String(this.config.name || ""),
      placeholder: "Thermostat",
      onInput: (o) => this.updateConfigValue("name", o)
    })}
          ${L({
      hass: this.hass,
      label: "Climate entity",
      value: String(this.config.entity || ""),
      domains: ["climate"],
      onValueChanged: (o) => this.updateConfigValue("entity", o)
    })}
          ${rt({
      hass: this.hass,
      label: "Icon",
      value: String(this.config.icon || ""),
      fallback: ze,
      onValueChanged: (o) => this.updateConfigValue("icon", o)
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
          ${this.renderColorInput("Heating background", "heating_color", Ie)}
          ${this.renderColorInput("Cooling background", "cooling_color", Ve)}
        </fieldset>

        <fieldset>
          <legend>HVAC Modes</legend>
          ${this.renderOptionList({
      options: e,
      selected: this.asStringArray(this.config.modes),
      emptyMessage: this.config.entity ? "This entity does not expose HVAC modes." : "Pick a climate entity to choose modes.",
      onChanged: (o) => this.updateConfigValue("modes", o)
    })}
        </fieldset>

        <fieldset>
          <legend>Preset Modes</legend>
          ${this.renderOptionList({
      options: i,
      selected: this.asStringArray(this.config.presets),
      emptyMessage: this.config.entity ? "This entity does not expose preset modes." : "Pick a climate entity to choose presets.",
      onChanged: (o) => this.updateConfigValue("presets", o)
    })}
        </fieldset>
      </div>
    `;
  }
  renderToggle(t, e) {
    return c`
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
    return c`
      <label>
        <span>Dual setpoint layout</span>
        <select
          .value=${this.config.dual_setpoint_layout || De}
          @change=${(e) => this.updateConfigValue("dual_setpoint_layout", e.target.value)}
        >
          ${t.map((e) => c`
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
    return c`
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
    return c`
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
    return e.length ? c`
      <div class="option-list">
        ${e.map((o) => {
      const r = i.includes(o);
      return c`
            <label class="checkbox-row">
              <input
                type="checkbox"
                .checked=${r}
                @change=${(l) => this.updateOptionList(e, i, o, l.target.checked, a)}
              />
              <span>${this.toLabel(o)}</span>
            </label>
          `;
    })}
      </div>
    ` : c`<div class="hint">${s}</div>`;
  }
  updateOptionList(t, e, i, s, a) {
    const o = s ? [...e, i] : e.filter((r) => r !== i);
    a(t.filter((r) => o.includes(r)));
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
    this.config = t, A(this, "config-changed", { config: t });
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
bt.properties = {
  hass: { attribute: !1 },
  config: { attribute: !1 }
}, bt.styles = w`
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
let ee = bt;
customElements.define("thermostat-card-editor", ee);
const Nt = "mdi:thermostat", Ot = "#fbb73c", Ut = "#3a8dde", Rt = "two_rows", Wi = 3e4, yt = class yt extends O {
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
      icon: Nt,
      show_controls: !0,
      show_modes: !1,
      show_presets: !1,
      show_fan_mode: !1,
      show_off_mode: !1,
      dual_setpoint_layout: Rt,
      step_amount: void 0,
      heating_color: Ot,
      cooling_color: Ut
    };
  }
  setConfig(t) {
    if (!t.entity)
      throw new Error("Thermostat Card requires a climate entity");
    if (!t.entity.startsWith("climate."))
      throw new Error("Thermostat Card only supports climate entities");
    this.config = {
      icon: Nt,
      show_controls: !0,
      show_modes: !1,
      show_presets: !1,
      show_fan_mode: !1,
      show_off_mode: !1,
      modes: [],
      presets: [],
      dual_setpoint_layout: Rt,
      step_amount: void 0,
      heating_color: Ot,
      cooling_color: Ut,
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
    const t = this.getClimateEntity(), e = this.isHeating(t), i = this.isCooling(t), s = !!(this.config.compact || this.isCollapsed), a = !!this.config.show_controls && !s, o = !!this.config.show_modes && !s, r = !!this.config.show_presets && !s, l = {
      "--thermostat-heating-color": this.config.heating_color || Ot,
      "--thermostat-cooling-color": this.config.cooling_color || Ut
    };
    return c`
      <ha-card
        class=${`${e ? "heating" : ""} ${i ? "cooling" : ""}`}
        style=${Q(l)}
      >
        <div class="card">
          ${this.renderHeader(t, s)}
          ${a ? this.renderControls(t) : ""}
          ${o ? this.renderModeRow(t) : ""}
          ${r ? this.renderPresetRow(t) : ""}
        </div>
      </ha-card>
    `;
  }
  renderHeader(t, e) {
    var a;
    const i = this.config.name || ((a = t == null ? void 0 : t.attributes) == null ? void 0 : a.friendly_name) || "Thermostat", s = this.getSubtitle(t);
    return c`
      <div class="header">
        <button
          class="thermostat-icon"
          type="button"
          aria-label=${e ? "Expand thermostat card" : "Collapse thermostat card"}
          aria-expanded=${e ? "false" : "true"}
          @click=${this.toggleCollapsed}
        >
          <ha-icon .icon=${this.config.icon || Nt}></ha-icon>
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
    return e === void 0 ? "" : c`
      <div class="controls">
        ${this.renderSetpointRow(t, "single", e, "Target temperature")}
      </div>
    `;
  }
  renderDualControls(t) {
    const e = this.asNumber(t.attributes.target_temp_low), i = this.asNumber(t.attributes.target_temp_high), s = this.config.dual_setpoint_layout || Rt;
    if (e === void 0 || i === void 0)
      return "";
    if (s === "single_row_toggle") {
      const a = this.selectedDualTarget === "low" ? e : i;
      return c`
        <div class="controls">
          <div class="target-toggle" role="group" aria-label="Setpoint target">
            ${this.renderTargetToggleButton("low", "Heat", e)}
            ${this.renderTargetToggleButton("high", "Cool", i)}
          </div>
          ${this.renderSetpointRow(t, this.selectedDualTarget, a, this.selectedDualTarget === "low" ? "Heat setpoint" : "Cool setpoint")}
        </div>
      `;
    }
    return s === "side_by_side" ? c`
        <div class="controls side-by-side">
          ${this.renderCompactSetpoint(t, "low", e, "Heat")}
          ${this.renderCompactSetpoint(t, "high", i, "Cool")}
        </div>
      ` : c`
      <div class="controls">
        ${this.renderSetpointRow(t, "high", i, "Cool setpoint")}
        ${this.renderSetpointRow(t, "low", e, "Heat setpoint")}
      </div>
    `;
  }
  renderSetpointRow(t, e, i, s) {
    return c`
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
    return c`
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
    return c`
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
    const e = this.asStringArray(t.attributes.hvac_modes), s = this.asStringArray(this.config.modes).filter((o) => e.includes(o));
    this.config.show_off_mode && e.includes("off") && !s.includes("off") && s.push("off");
    const a = !!this.config.show_fan_mode && this.asStringArray(t.attributes.fan_modes).length > 0;
    return !s.length && !a ? "" : c`
      <div class="chip-row mode-row">
        ${s.map((o) => this.renderModeButton(t, o))}
        ${a ? this.renderFanButton(t) : ""}
      </div>
    `;
  }
  renderModeButton(t, e) {
    const i = t.state === e;
    return c`
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
    return c`
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
    return s.length ? c`
      <div class="chip-row preset-row">
        ${s.map((a) => this.renderPresetButton(t, a))}
      </div>
    ` : "";
  }
  renderPresetButton(t, e) {
    const i = t.attributes.preset_mode === e;
    return c`
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
    const o = this.clampTemperature(e, a + this.getStep(e) * s), r = {
      entity_id: this.config.entity
    };
    if (i === "single")
      r.temperature = o, this.setOptimisticClimateState({
        attributes: { temperature: o }
      });
    else {
      const l = this.asNumber(e.attributes.target_temp_low), u = this.asNumber(e.attributes.target_temp_high);
      r.target_temp_low = i === "low" ? o : l, r.target_temp_high = i === "high" ? o : u, this.setOptimisticClimateState({
        attributes: {
          target_temp_low: r.target_temp_low,
          target_temp_high: r.target_temp_high
        }
      });
    }
    this.hass.callService("climate", "set_temperature", r);
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
    return i === void 0 ? `-${s}` : `${ti(i, (a = this.hass) == null ? void 0 : a.locale)}${s}`;
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
    }, Wi);
  }
  clearAcknowledgedOptimisticState() {
    const t = this.getRawClimateEntity(), e = this.getOptimisticState();
    if (!t || !e)
      return;
    const i = e.state === void 0 || t.state === e.state, s = Object.entries(e.attributes || {}).every(
      ([a, o]) => this.areValuesEqual(t.attributes[a], o)
    );
    i && s && (this.optimisticStateTimer && (window.clearTimeout(this.optimisticStateTimer), this.optimisticStateTimer = void 0), this.optimisticState = void 0);
  }
  areValuesEqual(t, e) {
    const i = this.asNumber(t), s = this.asNumber(e);
    return i !== void 0 && s !== void 0 ? i === s : t === e;
  }
  clampTemperature(t, e) {
    const i = this.asNumber(t.attributes.min_temp), s = this.asNumber(t.attributes.max_temp), a = i === void 0 ? e : Math.max(e, i), o = s === void 0 ? a : Math.min(a, s);
    return Number(o.toFixed(2));
  }
  hasDualSetpoints(t) {
    return this.asNumber(t.attributes.target_temp_low) !== void 0 && this.asNumber(t.attributes.target_temp_high) !== void 0;
  }
  isHeating(t) {
    var e;
    return ((e = t == null ? void 0 : t.attributes) == null ? void 0 : e.hvac_action) === "heating";
  }
  isCooling(t) {
    var e;
    return ((e = t == null ? void 0 : t.attributes) == null ? void 0 : e.hvac_action) === "cooling";
  }
  isIdle(t) {
    var e;
    return ((e = t == null ? void 0 : t.attributes) == null ? void 0 : e.hvac_action) === "idle";
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
yt.properties = {
  hass: { attribute: !1 },
  config: { attribute: !1 },
  selectedDualTarget: { state: !0 },
  isCollapsed: { state: !0 },
  optimisticState: { state: !0 }
}, yt.styles = w`
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
let ie = yt;
customElements.define("thermostat-card", ie);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "thermostat-card",
  name: "Thermostat Card",
  description: "Climate entity card with setpoints and modes"
});
const Le = "Assist debug", Ft = "preferred", Me = 5, Ne = "compact", Oe = "waveform", Ue = "below_chat", Re = 56, Fe = "var(--primary-color)", Pe = "var(--secondary-text-color)", He = "transparent", ji = "#03a9f4", qi = "#727272", Gi = "#000000", Be = 0.75, We = 0, _t = class _t extends _ {
  constructor() {
    super(...arguments), this.config = {};
  }
  setConfig(t) {
    this.config = {
      title: Le,
      pipeline_id: Ft,
      run_count: Me,
      minimalistic_mode: !1,
      visualization_only: !1,
      conversation_only: !1,
      show_conversation: !1,
      metadata_mode: Ne,
      show_raw: !0,
      show_thinking: !0,
      show_summary: !0,
      show_stt: !0,
      show_intent: !0,
      show_tts: !0,
      mask_transcripts: !1,
      audio_visualization: !1,
      audio_visualization_type: Oe,
      audio_visualization_position: Ue,
      audio_visualization_height: Re,
      audio_visualization_color: Fe,
      audio_visualization_secondary_color: Pe,
      audio_visualization_background: He,
      audio_visualization_opacity: Be,
      audio_visualization_start_delay: We,
      ...t
    };
  }
  shouldUpdate(t) {
    return t.has("config") ? !0 : t.has("hass") ? !t.get("hass") && !!this.hass : !1;
  }
  render() {
    return c`
      <div class="editor">
        <div class="grid">
          ${U({
      label: "Title",
      value: String(this.config.title || ""),
      placeholder: Le,
      onInput: (t) => this.updateConfigValue("title", t)
    })}
          ${U({
      label: "Pipeline ID",
      value: String(this.config.pipeline_id || Ft),
      placeholder: "preferred or a pipeline id",
      onInput: (t) => this.updateConfigValue("pipeline_id", t || Ft)
    })}
          ${this.renderNumberField("Recent runs", "run_count", Me, 1, 20)}
          ${this.renderMetadataModeField()}
        </div>

        <fieldset>
          <legend>Display</legend>
          ${this.renderCheckbox("Minimalistic mode", "minimalistic_mode")}
          ${this.renderCheckbox("Show only visualization", "visualization_only")}
          ${this.renderCheckbox("Show only conversation", "conversation_only")}
          ${this.renderCheckbox("Show conversation bubbles", "show_conversation")}
          ${this.renderCheckbox("Show collapsible raw JSON", "show_raw")}
          ${this.renderCheckbox("Show LLM thinking (live)", "show_thinking")}
          ${this.renderCheckbox("Mask transcripts and raw text", "mask_transcripts")}
        </fieldset>

        <fieldset>
          <legend>Pipeline stages</legend>
          ${this.renderCheckbox("Show run summary", "show_summary")}
          ${this.renderCheckbox("Show speech-to-text", "show_stt")}
          ${this.renderCheckbox("Show natural language processing", "show_intent")}
          ${this.renderCheckbox("Show text-to-speech", "show_tts")}
        </fieldset>

        <fieldset>
          <legend>Audio visualization</legend>
          ${this.renderCheckbox("Enable audio visualization", "audio_visualization")}
          ${this.renderAudioVisualizationTypeField()}
          ${this.config.audio_visualization_type === "glow" ? "" : this.renderAudioVisualizationPositionField()}
          ${this.renderNumberField("Height", "audio_visualization_height", Re, 24, 180)}
          ${this.renderNumberField("Visualization start delay (ms)", "audio_visualization_start_delay", We, 0, 1e4)}
          ${this.renderDecimalField("Opacity", "audio_visualization_opacity", Be, 0.05, 1, 0.05)}
          ${this.renderColorInput(
      "Primary color",
      "audio_visualization_color",
      Fe,
      ji
    )}
          ${this.renderColorInput(
      "Secondary color",
      "audio_visualization_secondary_color",
      Pe,
      qi
    )}
          ${this.renderColorInput(
      "Background",
      "audio_visualization_background",
      He,
      Gi
    )}
        </fieldset>
      </div>
    `;
  }
  renderNumberField(t, e, i, s, a) {
    const o = Number(this.config[e] ?? i);
    return c`
      <label>
        <span>${t}</span>
        <input
          type="number"
          min=${String(s)}
          max=${String(a)}
          .value=${String(o)}
          @input=${(r) => this.updateNumberValue(e, r.target.value, i, s, a)}
        />
      </label>
    `;
  }
  renderDecimalField(t, e, i, s, a, o) {
    const r = Number(this.config[e] ?? i);
    return c`
      <label>
        <span>${t}</span>
        <input
          type="number"
          min=${String(s)}
          max=${String(a)}
          step=${String(o)}
          .value=${String(r)}
          @input=${(l) => this.updateDecimalValue(e, l.target.value, i, s, a)}
        />
      </label>
    `;
  }
  renderColorInput(t, e, i, s) {
    const a = this.toColorInputValue(String(this.config[e] || i), s);
    return c`
      <label>
        <span>${t}</span>
        <input
          type="color"
          .value=${a}
          @input=${(o) => this.updateConfigValue(e, o.target.value)}
        />
      </label>
    `;
  }
  renderMetadataModeField() {
    const t = this.config.metadata_mode || Ne;
    return c`
      <label>
        <span>Metadata display</span>
        <select .value=${t} @change=${(e) => this.updateConfigValue("metadata_mode", e.target.value)}>
          <option value="hidden" ?selected=${t === "hidden"}>Hidden</option>
          <option value="compact" ?selected=${t === "compact"}>Compact</option>
          <option value="full" ?selected=${t === "full"}>Full</option>
        </select>
      </label>
    `;
  }
  renderAudioVisualizationTypeField() {
    const t = this.config.audio_visualization_type || Oe;
    return c`
      <label>
        <span>Visualization type</span>
        <select .value=${t} @change=${(e) => this.updateConfigValue("audio_visualization_type", e.target.value)}>
          <option value="waveform" ?selected=${t === "waveform"}>Waveform</option>
          <option value="spectrum" ?selected=${t === "spectrum"}>Spectrum</option>
          <option value="meter" ?selected=${t === "meter"}>Meter</option>
          <option value="glow" ?selected=${t === "glow"}>Background glow</option>
          <option value="ulysse31" ?selected=${t === "ulysse31"}>Ulysse 31 (Odyssey wireframe)</option>
        </select>
      </label>
    `;
  }
  renderAudioVisualizationPositionField() {
    const t = this.config.audio_visualization_position || Ue;
    return c`
      <label>
        <span>Position</span>
        <select .value=${t} @change=${(e) => this.updateConfigValue("audio_visualization_position", e.target.value)}>
          <option value="background" ?selected=${t === "background"}>Behind chat</option>
          <option value="top" ?selected=${t === "top"}>Above conversation</option>
          <option value="between" ?selected=${t === "between"}>Between messages</option>
          <option value="below_chat" ?selected=${t === "below_chat"}>Below conversation</option>
        </select>
      </label>
    `;
  }
  renderCheckbox(t, e) {
    return c`
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
  updateConfigValue(t, e) {
    this.updateConfig({
      ...this.config,
      [t]: e === "" ? void 0 : e
    });
  }
  updateNumberValue(t, e, i, s, a) {
    const o = Number(e), r = Number.isFinite(o) ? Math.min(Math.max(Math.round(o), s), a) : i;
    this.updateConfigValue(t, r);
  }
  updateDecimalValue(t, e, i, s, a) {
    const o = Number(e), r = Number.isFinite(o) ? Math.min(Math.max(o, s), a) : i;
    this.updateConfigValue(t, r);
  }
  toColorInputValue(t, e) {
    return /^#[0-9a-fA-F]{6}$/.test(t) ? t : e;
  }
  updateConfig(t) {
    this.config = t, A(this, "config-changed", { config: t });
  }
};
_t.properties = {
  hass: { attribute: !1 },
  config: { attribute: !1 }
}, _t.styles = w`
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

    fieldset {
      border: 1px solid var(--divider-color, #ddd);
      border-radius: 10px;
      display: grid;
      gap: 12px;
      margin: 0;
      padding: 12px;
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
  `;
let ct = _t;
class Ki extends ct {
}
customElements.define("assist-debug-card-editor", ct);
customElements.get("conversation-debug-card-editor") || customElements.define("conversation-debug-card-editor", Ki);
const Pt = "Assist debug", j = "preferred", q = 5, Ht = "compact", Bt = "waveform", Wt = "below_chat", Ji = "#39ff14", Yi = "#000000", Zi = 2e3, Xi = 48, Qi = /* @__PURE__ */ new Set([
  "text",
  "intent_input",
  "tts_input",
  "speech",
  "content",
  "thinking_content"
]), F = class F extends O {
  constructor() {
    super(...arguments), this.audioVisualizationId = `assist-debug-audio-${F.nextAudioVisualizationId++}`, this.loading = !1, this.error = "", this.pipelines = [], this.runs = [], this.selectedRunId = "", this.resolvedPipelineId = "", this.sessionStartedAt = Date.now(), this.loadToken = 0, this.lastLoadKey = "", this.thinkingDetailsOpen = !1, this.thinkingDetailsUserCollapsed = !1, this.thinkingDetailsRunId = "", this.thinkingScrollRunId = "", this.thinkingLastScrolledLength = 0, this.thinkingAutoScrollEnabled = !0, this.ulysse31RotationX = 0, this.ulysse31RotationY = 0, this.ulysse31LastFrameAt = 0, this.audioKey = "", this.audioSourceEnded = !1, this.audioAnimationStartedAt = 0, this.audioVisualizationStatus = "", this.audioVisualizationLoading = !1, this.audioVisualizationError = "", this.audioFetchUnavailable = !1, this.audioVisualizationPainted = !1, this.audioNeedsUserStart = !1, this.audioIsVisible = !0, this.handleDocumentVisibilityChange = () => {
      this.audioIsVisible = !document.hidden, this.syncAudioAnimation(), this.syncUlysse31IdleAnimation();
    };
  }
  static getConfigElement() {
    return document.createElement("assist-debug-card-editor");
  }
  static getStubConfig() {
    return {
      title: Pt,
      pipeline_id: j,
      run_count: q,
      minimalistic_mode: !1,
      visualization_only: !1,
      conversation_only: !1,
      show_conversation: !1,
      metadata_mode: Ht,
      show_raw: !0,
      show_thinking: !0,
      show_summary: !0,
      show_stt: !0,
      show_intent: !0,
      show_tts: !0,
      mask_transcripts: !1,
      audio_visualization: !1,
      audio_visualization_type: Bt,
      audio_visualization_position: Wt
    };
  }
  setConfig(t) {
    this.config = {
      title: Pt,
      pipeline_id: j,
      run_count: q,
      minimalistic_mode: !1,
      visualization_only: !1,
      conversation_only: !1,
      show_conversation: !1,
      metadata_mode: Ht,
      show_raw: !0,
      show_thinking: !0,
      show_summary: !0,
      show_stt: !0,
      show_intent: !0,
      show_tts: !0,
      mask_transcripts: !1,
      audio_visualization: !1,
      audio_visualization_type: Bt,
      audio_visualization_position: Wt,
      ...t
    };
  }
  connectedCallback() {
    super.connectedCallback(), this.setupAudioVisibilityTracking(), this.syncConversationRefreshTimer();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this.clearConversationRefreshTimer(), this.teardownAudioVisibilityTracking(), this.cleanupAudioVisualization(!0, !0);
  }
  shouldUpdate(t) {
    return t.has("config") || t.has("loading") || t.has("error") || t.has("pipelines") || t.has("runs") || t.has("selectedRunId") || t.has("resolvedPipelineId") || t.has("runModel") || t.has("audioVisualizationLoading") || t.has("audioVisualizationError") || t.has("audioVisualizationPainted") || t.has("audioNeedsUserStart") || t.has("thinkingDetailsOpen") ? !0 : t.has("hass") ? t.get("hass") ? super.shouldUpdate(t) : !!this.hass : !1;
  }
  updated(t) {
    if (!(!this.hass || !this.config)) {
      if (t.has("config") || t.has("hass")) {
        const e = t.get("hass");
        this.loadDebugData(!!e);
      }
      (t.has("config") || t.has("hass") || t.has("loading") || t.has("runModel") || t.has("selectedRunId") || t.has("runs")) && this.syncConversationRefreshTimer(), (t.has("config") || t.has("runModel") || t.has("hass")) && this.syncAudioVisualization(), this.config.show_thinking && (t.has("runModel") || t.has("thinkingDetailsOpen")) && this.updateComplete.then(() => this.maybeAutoScrollThinking());
    }
  }
  render() {
    const t = this.config.title || Pt, e = this.getPipelineName(this.resolvedPipelineId), i = this.getCardStyles();
    return c`
      <ha-card style=${Q(i)}>
        <div class=${this.config.visualization_only ? "card visualization-only-card" : "card"}>
          ${this.renderCardGlowVisualization()}
          ${this.config.visualization_only ? this.renderVisualizationOnlyContent() : c`
                ${this.config.minimalistic_mode ? "" : c`
                <header class="header">
                  <div>
                    <div class="eyebrow">${this.localize("ui.panel.config.voice_assistants.debug.title") || "Assist debug"}</div>
                    <h2>${t}</h2>
                    <p>${e || this.resolvedPipelineId || "Preferred pipeline"}</p>
                  </div>
                  <div class="actions">
                    <button class="icon-button" type="button" title="Refresh" aria-label="Refresh" @click=${this.handleRefresh}>
                      <ha-icon icon="mdi:refresh"></ha-icon>
                    </button>
                    <button class="icon-button" type="button" title="Open debug" aria-label="Open debug" @click=${this.openDebugPage}>
                      <ha-icon icon="mdi:open-in-new"></ha-icon>
                    </button>
                  </div>
                </header>
              `}

          ${this.renderContent()}
              `}
        </div>
      </ha-card>
    `;
  }
  renderContent() {
    return this.error ? c`
        <div class="state error-state">
          <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
          <div>
            <strong>Unable to load debug data</strong>
            <span>${this.error}</span>
          </div>
        </div>
      ` : this.config.conversation_only && (this.loading || !this.runModel) ? this.renderConversationOnly(this.runModel) : this.loading && !this.runModel ? c`
        <div class="state">
          <ha-icon icon="mdi:progress-clock"></ha-icon>
          <span>Loading recent conversation runs...</span>
        </div>
      ` : this.runModel ? this.config.conversation_only ? this.renderConversationOnly(this.runModel) : c`
      ${this.renderAudioVisualization("top")}
      ${this.renderRunPicker()}
      ${this.config.show_conversation ? this.renderConversationOnly(this.runModel, !1) : this.renderAudioVisualization("below_chat")}
      <div class="timeline">
        ${this.config.show_summary ? this.renderSummary(this.runModel) : ""}
        ${this.config.show_stt ? this.renderStage("Speech-to-text", "stt", this.runModel.stt) : ""}
        ${this.config.show_intent ? this.renderStage("Natural language processing", "intent", this.runModel.intent) : ""}
        ${this.config.show_tts ? this.renderStage("Text-to-speech", "tts", this.runModel.tts) : ""}
        ${this.renderThinking(this.runModel)}
        ${this.renderRaw(this.runModel)}
      </div>
    ` : c`
        <div class="state">
          <ha-icon icon="mdi:message-processing-outline"></ha-icon>
          <div>
            <strong>No debug runs yet</strong>
            <span>Run a voice assistant conversation, then refresh this card.</span>
          </div>
        </div>
      `;
  }
  renderVisualizationOnlyContent() {
    return this.config.audio_visualization ? this.getAudioVisualizationType() === "glow" ? c`<div class="visualization-only-spacer" aria-hidden="true"></div>` : this.renderStandaloneAudioVisualization() : "";
  }
  renderRunPicker() {
    return this.runs.length <= 1 ? "" : c`
      <div class="run-picker" aria-label="Recent debug runs">
        ${this.runs.map(
      (t) => c`
            <button
              type="button"
              class=${t.pipeline_run_id === this.selectedRunId ? "run-chip selected" : "run-chip"}
              @click=${() => this.selectRun(t.pipeline_run_id)}
            >
              <span>${this.formatTime(t.timestamp)}</span>
              <small>${this.shortId(t.pipeline_run_id)}</small>
            </button>
          `
    )}
      </div>
    `;
  }
  renderConversationOnly(t, e = !0) {
    var d;
    const i = this.getAudioVisualizationPosition(), s = this.renderAudioVisualization("background"), a = e ? this.renderAudioVisualization("top") : "", o = this.renderAudioVisualization("below_chat");
    if (!t)
      return c`
        ${a}
        <div class=${i === "background" ? "conversation-shell has-background-visualization" : "conversation-shell"}>
          ${s}
          <div class="conversation conversation-only">
            <div class="bubble assistant loading">
              ${this.renderTypingDots()}
              <span>${this.loading ? "Loading conversation..." : "Waiting for a conversation..."}</span>
            </div>
          </div>
        </div>
        ${o}
      `;
    const { userText: r, assistantText: l } = this.getConversationMessages(t), u = !!l, p = t.stage === "error", h = !u && !p;
    return c`
      ${a}
      <div class=${i === "background" ? "conversation-shell has-background-visualization" : "conversation-shell"}>
        ${s}
        <div class="conversation conversation-only">
          ${r ? c`<div class="bubble user">${r}</div>` : ""}
          ${this.renderAudioVisualization("between")}
          ${u ? c`<div class="bubble assistant">${l}</div>` : p ? c`<div class="bubble assistant error-bubble">${((d = t.error) == null ? void 0 : d.message) || "The assistant run failed."}</div>` : c`
                  <div class="bubble assistant loading">
                    ${this.renderTypingDots()}
                    <span>${this.getConversationLoadingText(t, h)}</span>
                  </div>
                `}
        </div>
      </div>
      ${o}
    `;
  }
  renderAudioVisualization(t) {
    var a;
    if (!this.config.audio_visualization || this.getAudioVisualizationType() === "glow" || this.getAudioVisualizationPosition() !== t || !(this.getAudioVisualizationType() === "ulysse31") && !((a = this.runModel) != null && a.ttsAudio) && !this.audioVisualizationLoading && !this.audioVisualizationError)
      return "";
    const s = t === "background" && !this.audioVisualizationPainted ? "audio-visualization audio-visualization-background is-pending" : `audio-visualization audio-visualization-${t}`;
    return c`
      <div class=${s}>
        <canvas
          class="audio-visualization-canvas"
          data-audio-visualization-id=${this.audioVisualizationId}
          aria-hidden="true"
        ></canvas>
        ${this.audioVisualizationError ? c`<div class="audio-visualization-overlay error-message">${this.audioVisualizationError}</div>` : ""}
        ${this.audioNeedsUserStart ? c`
              <button class="audio-start-button" type="button" @click=${this.handleStartAudioVisualization}>
                Start visualization
              </button>
            ` : ""}
      </div>
    `;
  }
  renderStandaloneAudioVisualization() {
    return c`
      <div class="audio-visualization audio-visualization-standalone">
        <canvas
          class="audio-visualization-canvas"
          data-audio-visualization-id=${this.audioVisualizationId}
          aria-hidden="true"
        ></canvas>
        ${this.audioVisualizationError ? c`<div class="audio-visualization-overlay error-message">${this.audioVisualizationError}</div>` : ""}
        ${this.audioNeedsUserStart ? c`
              <button class="audio-start-button" type="button" @click=${this.handleStartAudioVisualization}>
                Start visualization
              </button>
            ` : ""}
      </div>
    `;
  }
  renderCardGlowVisualization() {
    var t;
    return !this.config.audio_visualization || this.getAudioVisualizationType() !== "glow" || !this.config.visualization_only && !((t = this.runModel) != null && t.ttsAudio) && !this.audioVisualizationLoading && !this.audioVisualizationError ? "" : c`
      <div class="audio-visualization audio-visualization-card-background">
        <canvas
          class="audio-visualization-canvas"
          data-audio-visualization-id=${this.audioVisualizationId}
          aria-hidden="true"
        ></canvas>
      </div>
    `;
  }
  renderTypingDots() {
    return c`
      <span class="typing-dots" aria-hidden="true">
        <span></span>
        <span></span>
        <span></span>
      </span>
    `;
  }
  renderSummary(t) {
    var s;
    const e = t.stage === "done" || t.stage === "error", i = this.formatDuration(t.started, t.finished);
    return c`
      <details class="section summary" ?open=${e}>
        <summary>
          <span class="status ${t.stage === "error" ? "error" : e ? "done" : "running"}">
            <ha-icon .icon=${this.getStatusIcon(t.stage === "error" ? "error" : e ? "done" : "running")}></ha-icon>
          </span>
          <span class="section-title">Run summary</span>
          <span class="duration">${i || (this.loading ? "Updating" : "In progress")}</span>
          <ha-icon class="chevron" icon="mdi:chevron-down"></ha-icon>
        </summary>
        <div class="section-body">
          <dl class="meta-grid">
            <div>
              <dt>Run</dt>
              <dd>${this.shortId(t.runId)}</dd>
            </div>
            <div>
              <dt>Pipeline</dt>
              <dd>${t.pipelineName || t.pipelineId}</dd>
            </div>
            ${t.language ? c`
                  <div>
                    <dt>Language</dt>
                    <dd>${t.language}</dd>
                  </div>
                ` : ""}
            <div>
              <dt>Status</dt>
              <dd>${((s = t.error) == null ? void 0 : s.message) || this.formatStageName(t.stage)}</dd>
            </div>
          </dl>
          ${t.error ? c`<p class="error-message">${t.error.message || t.error.code}</p>` : ""}
        </div>
      </details>
    `;
  }
  renderStage(t, e, i) {
    const s = this.getStageStatus(e, i), a = this.config.metadata_mode || Ht, o = s === "running" || s === "error", r = this.maskText((i == null ? void 0 : i.output) || (i == null ? void 0 : i.input) || "");
    return c`
      <details class="section" ?open=${o}>
        <summary>
          <span class="status ${s}">
            <ha-icon .icon=${this.getStatusIcon(s)}></ha-icon>
          </span>
          <span class="section-title">${t}</span>
          <span class="duration">${this.getStageDuration(e)}</span>
          <ha-icon class="chevron" icon="mdi:chevron-down"></ha-icon>
        </summary>
        <div class="section-body">
          ${r ? c`<p class="stage-text">${r}</p>` : c`<p class="muted">No data recorded for this stage.</p>`}
          ${a !== "hidden" && i ? this.renderStageMetadata(e, i, a) : ""}
        </div>
      </details>
    `;
  }
  renderStageMetadata(t, e, i) {
    const s = [
      ["Engine", e.engine],
      ["Language", e.language]
    ];
    if (t === "tts" && s.push(["Voice", e.voice]), t === "intent" && i === "full") {
      const o = e;
      s.push(["Prefer local", o == null ? void 0 : o.preferLocalIntents]), s.push(["Processed locally", o == null ? void 0 : o.processedLocally]);
    }
    const a = s.filter(([, o]) => o != null && o !== "");
    return a.length ? c`
      <dl class=${i === "full" ? "meta-grid full" : "meta-grid"}>
        ${a.map(
      ([o, r]) => c`
            <div>
              <dt>${o}</dt>
              <dd>${String(r)}</dd>
            </div>
          `
    )}
      </dl>
    ` : "";
  }
  renderThinking(t) {
    var o;
    if (!this.config.show_thinking)
      return "";
    const e = this.extractThinkingFromEvents(t.events), i = t.stage === "intent" && !((o = t.intent) != null && o.done) && !e;
    if (!e && !i)
      return "";
    const s = this.isThinkingLive(t);
    this.syncThinkingDetailsOpen(t, s);
    const a = s ? "Streaming…" : e ? `${e.length} chars` : "";
    return c`
      <details
        class="section thinking"
        ?open=${this.thinkingDetailsOpen}
        @toggle=${this.handleThinkingToggle}
      >
        <summary>
          <span class="status idle">
            <ha-icon icon="mdi:brain"></ha-icon>
          </span>
          <span class="section-title">Thinking</span>
          <span class="duration">${a}</span>
          <ha-icon class="chevron" icon="mdi:chevron-down"></ha-icon>
        </summary>
        <pre
          class="thinking-content"
          @scroll=${this.handleThinkingScroll}
          .textContent=${e || "Waiting for model thinking…"}
        ></pre>
      </details>
    `;
  }
  syncThinkingDetailsOpen(t, e) {
    t.runId !== this.thinkingDetailsRunId && (this.thinkingDetailsRunId = t.runId, this.thinkingDetailsUserCollapsed = !1, this.thinkingDetailsOpen = !1), e && !this.thinkingDetailsUserCollapsed && (this.thinkingDetailsOpen = !0);
  }
  handleThinkingToggle(t) {
    const e = t.currentTarget;
    this.thinkingDetailsOpen = e.open, e.open || (this.thinkingDetailsUserCollapsed = !0);
  }
  handleThinkingScroll(t) {
    const e = t.currentTarget;
    if (!this.runModel || !this.isThinkingLive(this.runModel))
      return;
    const i = e.scrollHeight - e.scrollTop - e.clientHeight;
    this.thinkingAutoScrollEnabled = i <= Xi;
  }
  scrollThinkingToEnd() {
    var e;
    const t = (e = this.renderRoot) == null ? void 0 : e.querySelector(".thinking-content");
    t && (t.scrollTop = t.scrollHeight);
  }
  maybeAutoScrollThinking() {
    const t = this.runModel;
    if (!t || !this.config.show_thinking || !this.thinkingDetailsOpen || (t.runId !== this.thinkingScrollRunId && (this.thinkingScrollRunId = t.runId, this.thinkingLastScrolledLength = 0, this.thinkingAutoScrollEnabled = !0), !this.isThinkingLive(t)))
      return;
    const e = this.extractThinkingFromEvents(t.events).length;
    e <= this.thinkingLastScrolledLength || !this.thinkingAutoScrollEnabled || (this.scrollThinkingToEnd(), this.thinkingLastScrolledLength = e);
  }
  renderRaw(t) {
    if (!this.config.show_raw)
      return "";
    const e = {
      pipeline_id: t.pipelineId,
      pipeline_run_id: t.runId,
      events: this.config.mask_transcripts ? this.maskRaw(t.events) : t.events
    };
    return c`
      <details class="section raw">
        <summary>
          <span class="status idle">
            <ha-icon icon="mdi:code-json"></ha-icon>
          </span>
          <span class="section-title">Raw payload</span>
          <span class="duration">${t.events.length} events</span>
          <ha-icon class="chevron" icon="mdi:chevron-down"></ha-icon>
        </summary>
        <pre>${JSON.stringify(e, null, 2)}</pre>
      </details>
    `;
  }
  async loadDebugData(t = !1) {
    var s, a;
    const e = JSON.stringify({
      pipeline_id: this.config.pipeline_id || j,
      run_count: this.config.run_count || q
    });
    if (!t && e === this.lastLoadKey && this.runModel)
      return;
    this.lastLoadKey = e;
    const i = ++this.loadToken;
    this.loading = !0, this.error = "";
    try {
      const o = await this.hass.callWS({
        type: "assist_pipeline/pipeline/list"
      });
      if (i !== this.loadToken)
        return;
      this.pipelines = o.pipelines || [];
      const r = this.resolvePipelineId(o);
      if (this.resolvedPipelineId = r, !r) {
        this.runs = [], this.selectedRunId = "", this.runModel = void 0;
        return;
      }
      const l = await this.hass.callWS({
        type: "assist_pipeline/pipeline_debug/list",
        pipeline_id: r
      });
      if (i !== this.loadToken)
        return;
      const u = ((s = this.runs[0]) == null ? void 0 : s.pipeline_run_id) || "", p = [...l.pipeline_runs || []].sort((m, v) => new Date(v.timestamp).getTime() - new Date(m.timestamp).getTime()).slice(0, this.getRunCount());
      this.runs = p;
      const h = ((a = p[0]) == null ? void 0 : a.pipeline_run_id) || "", g = t && this.isLiveConversationMode() && (!this.selectedRunId || this.selectedRunId === u) || !p.some((m) => m.pipeline_run_id === this.selectedRunId) ? h : this.selectedRunId;
      if (this.selectedRunId = g, !g) {
        this.runModel = void 0;
        return;
      }
      await this.loadRun(r, g, i);
    } catch (o) {
      if (i !== this.loadToken)
        return;
      this.error = this.formatError(o), this.runModel = void 0;
    } finally {
      i === this.loadToken && (this.loading = !1);
    }
  }
  async loadRun(t, e, i = this.loadToken) {
    const s = await this.hass.callWS({
      type: "assist_pipeline/pipeline_debug/get",
      pipeline_id: t,
      pipeline_run_id: e
    });
    if (i !== this.loadToken)
      return;
    const a = this.runs.find((o) => o.pipeline_run_id === e);
    this.runModel = this.buildRunModel(t, e, s.events || [], a);
  }
  buildRunModel(t, e, i, s) {
    var o, r, l, u, p;
    const a = {
      pipelineId: t,
      pipelineName: this.getPipelineName(t),
      runId: e,
      stage: "ready",
      started: s ? new Date(s.timestamp) : void 0,
      events: i
    };
    for (const h of i) {
      const d = h.data || {};
      h.type === "run-start" ? (a.run = d, a.language = String(d.language || ""), a.started = new Date(h.timestamp), a.ttsAudio = this.extractTtsAudio(d.tts_output, h.timestamp) || a.ttsAudio) : h.type === "stt-start" ? (a.stage = "stt", a.stt = {
        engine: String(d.engine || ""),
        language: (o = d.metadata) == null ? void 0 : o.language,
        done: !1,
        raw: d
      }) : h.type === "stt-end" ? a.stt = {
        ...a.stt || { done: !1 },
        output: (r = d.stt_output) == null ? void 0 : r.text,
        done: !0,
        raw: { ...((l = a.stt) == null ? void 0 : l.raw) || {}, ...d }
      } : h.type === "intent-start" ? (a.stage = "intent", a.intent = {
        engine: String(d.engine || ""),
        language: String(d.language || ""),
        input: d.intent_input,
        preferLocalIntents: d.prefer_local_intents,
        done: !1,
        raw: d
      }) : h.type === "intent-end" ? a.intent = {
        ...a.intent || { done: !1 },
        output: this.extractSpeechFromIntentOutput(d.intent_output),
        processedLocally: d.processed_locally,
        done: !0,
        raw: { ...((u = a.intent) == null ? void 0 : u.raw) || {}, ...d }
      } : h.type === "tts-start" ? (a.stage = "tts", a.tts = {
        engine: String(d.engine || ""),
        language: String(d.language || ""),
        voice: d.voice,
        input: d.tts_input,
        done: !1,
        raw: d
      }) : h.type === "tts-end" ? (a.tts = {
        ...a.tts || { done: !1 },
        done: !0,
        raw: { ...((p = a.tts) == null ? void 0 : p.raw) || {}, ...d }
      }, a.ttsAudio = this.extractTtsAudio(d.tts_output, h.timestamp) || a.ttsAudio) : h.type === "run-end" ? (a.stage = "done", a.finished = new Date(h.timestamp)) : h.type === "error" && (a.stage = "error", a.finished = new Date(h.timestamp), a.error = {
        code: d.code,
        message: d.message
      });
    }
    return a;
  }
  async selectRun(t) {
    if (!this.resolvedPipelineId || t === this.selectedRunId)
      return;
    const e = ++this.loadToken;
    this.selectedRunId = t, this.loading = !0, this.error = "";
    try {
      await this.loadRun(this.resolvedPipelineId, t, e);
    } catch (i) {
      e === this.loadToken && (this.error = this.formatError(i));
    } finally {
      e === this.loadToken && (this.loading = !1);
    }
  }
  handleRefresh(t) {
    t.stopPropagation(), this.loadDebugData(!0);
  }
  async handleStartAudioVisualization(t) {
    if (t.stopPropagation(), !this.audioContext || !this.audioBuffer) {
      await this.syncAudioVisualization(!0);
      return;
    }
    try {
      await this.audioContext.resume(), this.audioNeedsUserStart = this.audioContext.state !== "running", this.audioNeedsUserStart || (this.prepareAudioAnalyser(), this.syncAudioAnimation());
    } catch (e) {
      this.audioVisualizationError = this.formatError(e), this.audioNeedsUserStart = !0;
    }
  }
  syncConversationRefreshTimer() {
    if (!this.shouldLiveRefresh() || !this.hass) {
      this.clearConversationRefreshTimer();
      return;
    }
    this.conversationRefreshTimer === void 0 && (this.conversationRefreshTimer = window.setInterval(() => {
      this.loading || this.loadDebugData(!0);
    }, Zi));
  }
  shouldLiveRefresh() {
    return this.isLiveConversationMode() ? !0 : !this.config.show_thinking || !this.runModel || !this.isLatestSelectedRun() ? !1 : !this.isRunFinished(this.runModel);
  }
  isLiveConversationMode() {
    var t, e;
    return !!((t = this.config) != null && t.conversation_only || (e = this.config) != null && e.show_conversation);
  }
  isLatestSelectedRun() {
    var e;
    const t = ((e = this.runs[0]) == null ? void 0 : e.pipeline_run_id) || "";
    return !!(t && this.selectedRunId === t);
  }
  isRunFinished(t) {
    return t.stage === "done" || t.stage === "error";
  }
  isThinkingLive(t) {
    return !!this.config.show_thinking && this.isLatestSelectedRun() && !this.isRunFinished(t);
  }
  extractThinkingFromEvents(t) {
    var s, a;
    const e = [...t].sort(
      (o, r) => new Date(o.timestamp).getTime() - new Date(r.timestamp).getTime()
    );
    let i = "";
    for (const o of e) {
      if (o.type !== "intent-progress")
        continue;
      const r = (a = (s = o.data) == null ? void 0 : s.chat_log_delta) == null ? void 0 : a.thinking_content;
      typeof r == "string" && r && (i += r);
    }
    return this.config.mask_transcripts && i ? "[masked]" : this.trimThinkingWhitespace(i);
  }
  trimThinkingWhitespace(t) {
    return t.replace(/\r\n/g, `
`).split(`
`).map((e) => e.trimStart()).join(`
`).trim();
  }
  clearConversationRefreshTimer() {
    this.conversationRefreshTimer !== void 0 && (window.clearInterval(this.conversationRefreshTimer), this.conversationRefreshTimer = void 0);
  }
  setupAudioVisibilityTracking() {
    if (document.addEventListener("visibilitychange", this.handleDocumentVisibilityChange), !("IntersectionObserver" in window)) {
      this.audioIsVisible = !document.hidden;
      return;
    }
    this.intersectionObserver = new IntersectionObserver((t) => {
      const e = t[0];
      this.audioIsVisible = !!(e != null && e.isIntersecting) && !document.hidden, this.syncAudioAnimation(), this.syncUlysse31IdleAnimation();
    }), this.intersectionObserver.observe(this);
  }
  teardownAudioVisibilityTracking() {
    var t;
    document.removeEventListener("visibilitychange", this.handleDocumentVisibilityChange), (t = this.intersectionObserver) == null || t.disconnect(), this.intersectionObserver = void 0;
  }
  async syncAudioVisualization(t = !1) {
    var s, a, o, r;
    if (!((s = this.config) != null && s.audio_visualization) || !this.hass) {
      this.cleanupAudioVisualization();
      return;
    }
    if (!((o = (a = this.runModel) == null ? void 0 : a.ttsAudio) != null && o.url)) {
      this.getAudioVisualizationType() === "ulysse31" ? this.showUlysse31IdleVisualization() : this.cleanupAudioVisualization();
      return;
    }
    const e = this.runModel.ttsAudio.url, i = `${this.runModel.runId}:${e}:${this.getAudioVisualizationType()}:${this.getAudioVisualizationPosition()}`;
    if (!t && i === this.audioKey) {
      if (this.audioFetchUnavailable) {
        await this.updateComplete, this.drawFlatAudioVisualization();
        return;
      }
      if (this.audioBuffer) {
        if (this.audioSourceEnded) {
          this.drawFlatAudioVisualization();
          return;
        }
        this.syncAudioAnimation();
        return;
      }
    }
    this.cleanupAudioVisualization(!1), this.audioKey = i, this.audioFetchUnavailable = !1, this.audioVisualizationPainted = !1, this.audioVisualizationLoading = !0, this.audioVisualizationError = "", this.audioNeedsUserStart = !1, this.audioVisualizationStatus = "fetching audio";
    try {
      const l = this.getAudioContext(), u = await this.fetchAudio(e);
      if (!u.ok) {
        if (i !== this.audioKey)
          return;
        await this.showIdleAudioVisualization();
        return;
      }
      const p = await l.decodeAudioData(await u.arrayBuffer());
      if (i !== this.audioKey)
        return;
      this.audioBuffer = p, this.audioStaticData = this.createStaticWaveformData(p), this.audioPlaybackData = this.createPlaybackWaveformData(p), this.audioVisualizationLoading = !1, this.audioVisualizationStatus = "decoded audio", await this.updateComplete, this.getAudioVisualizationPosition() === "background" ? this.drawFlatAudioVisualization() : this.getAudioVisualizationType() === "ulysse31" ? (this.drawStaticAudioVisualization(), this.syncUlysse31IdleAnimation()) : this.drawStaticAudioVisualization(), this.prepareAudioAnalyser(), this.audioNeedsUserStart = !1, this.shouldAnimateTtsAudio((r = this.runModel) == null ? void 0 : r.ttsAudio) ? this.scheduleAudioAnimationStart(i) : (this.audioSourceEnded = !0, this.audioVisualizationStatus = "past tts", this.drawFlatAudioVisualization());
    } catch (l) {
      if (i !== this.audioKey)
        return;
      this.audioVisualizationLoading = !1, this.audioVisualizationError = this.formatError(l), this.audioVisualizationStatus = "audio visualization error", this.audioNeedsUserStart = !1;
    }
  }
  async showIdleAudioVisualization() {
    this.audioVisualizationLoading = !1, this.audioVisualizationError = "", this.audioNeedsUserStart = !1, this.audioSourceEnded = !0, this.audioFetchUnavailable = !0, this.audioVisualizationStatus = "idle", await this.updateComplete, this.drawFlatAudioVisualization();
  }
  getAudioContext() {
    if (this.audioContext)
      return this.audioContext;
    const t = window.AudioContext || window.webkitAudioContext;
    return this.audioContext = new t(), this.audioContext;
  }
  async fetchAudio(t) {
    const e = new URL(t, window.location.origin), i = this.hass.fetchWithAuth;
    return i && e.origin === window.location.origin ? i(`${e.pathname}${e.search}${e.hash}`) : fetch(e.toString());
  }
  shouldAnimateTtsAudio(t) {
    if (!(t != null && t.timestamp))
      return !1;
    const e = new Date(t.timestamp).getTime();
    return Number.isFinite(e) && e >= this.sessionStartedAt;
  }
  scheduleAudioAnimationStart(t) {
    const e = this.getAudioVisualizationStartDelay();
    if (this.audioStartDelayTimer !== void 0 && (window.clearTimeout(this.audioStartDelayTimer), this.audioStartDelayTimer = void 0), e <= 0) {
      this.audioVisualizationStatus = "speaking", this.syncAudioAnimation();
      return;
    }
    this.audioVisualizationStatus = `waiting ${e}ms`, this.audioStartDelayTimer = window.setTimeout(() => {
      this.audioStartDelayTimer = void 0, !(t !== this.audioKey || this.audioSourceEnded) && (this.audioVisualizationStatus = "speaking", this.syncAudioAnimation());
    }, e);
  }
  prepareAudioAnalyser() {
    !this.audioContext || !this.audioBuffer || (this.cleanupAudioNodes(), this.analyser = this.audioContext.createAnalyser(), this.analyser.fftSize = this.getAudioVisualizationType() === "spectrum" ? 128 : 1024, this.audioData = new Uint8Array(
      this.getAudioVisualizationType() === "spectrum" ? this.analyser.frequencyBinCount : this.analyser.fftSize
    ), this.silentGain = this.audioContext.createGain(), this.silentGain.gain.value = 0, this.analyser.connect(this.silentGain), this.silentGain.connect(this.audioContext.destination), this.audioSourceEnded = !1, this.audioAnimationStartedAt = 0);
  }
  getAudioVisualizationCanvas() {
    return this.renderRoot.querySelector(
      `[data-audio-visualization-id="${this.audioVisualizationId}"]`
    );
  }
  syncAudioAnimation() {
    var t;
    if (!((t = this.config) != null && t.audio_visualization) || !this.analyser || !this.audioBuffer) {
      this.cancelAudioAnimation();
      return;
    }
    if (!this.audioIsVisible || document.hidden) {
      this.cancelAudioAnimation();
      return;
    }
    if (this.audioSourceEnded) {
      this.drawFlatAudioVisualization();
      return;
    }
    this.audioAnimationFrame === void 0 && (this.audioAnimationStartedAt = 0, this.drawAudioVisualization());
  }
  drawAudioVisualization() {
    const t = this.getAudioVisualizationCanvas();
    if (!t || !this.audioPlaybackData || !this.audioBuffer) {
      this.audioAnimationFrame = void 0;
      return;
    }
    const e = t.getContext("2d"), i = t.getBoundingClientRect();
    if (!e || i.width === 0 || i.height === 0) {
      this.audioAnimationFrame = window.requestAnimationFrame(() => this.drawAudioVisualization());
      return;
    }
    const s = window.devicePixelRatio || 1, a = Math.max(1, Math.floor(i.width * s)), o = Math.max(1, Math.floor(i.height * s));
    (t.width !== a || t.height !== o) && (t.width = a, t.height = o), e.clearRect(0, 0, a, o), this.fillAudioVisualizationBackground(e, a, o), this.audioAnimationStartedAt || (this.audioAnimationStartedAt = performance.now());
    const r = performance.now() - this.audioAnimationStartedAt, l = Math.min(1, r / Math.max(1, this.audioBuffer.duration * 1e3)), u = this.getAudioLevelAtProgress(this.audioPlaybackData, l), p = this.getAudioVisualizationType();
    if (p === "spectrum" ? this.drawAnimatedSpectrum(e, a, o, u, l) : p === "meter" ? this.drawMeter(e, a, o, this.scaleAudioFrame(this.audioStaticData || this.audioPlaybackData, u)) : p === "glow" ? this.drawGlow(e, a, o, u) : p === "ulysse31" ? (this.cancelUlysse31Animation(), this.drawUlysse31Wireframe(e, a, o, u)) : this.drawWaveform(e, a, o, this.scaleAudioFrame(this.audioStaticData || this.audioPlaybackData, u)), l >= 1) {
      this.audioSourceEnded = !0, this.audioVisualizationStatus = "audio ended", this.cancelAudioAnimation(), this.drawFlatAudioVisualization();
      return;
    }
    this.audioAnimationFrame = window.requestAnimationFrame(() => this.drawAudioVisualization()), this.markBackgroundVisualizationReady();
  }
  markBackgroundVisualizationReady() {
    this.getAudioVisualizationPosition() !== "background" || this.audioVisualizationPainted || (this.audioVisualizationPainted = !0);
  }
  drawStaticAudioVisualization() {
    const t = this.getAudioVisualizationCanvas();
    if (!t || !this.audioStaticData)
      return;
    const e = t.getContext("2d"), i = t.getBoundingClientRect();
    if (!e || i.width === 0 || i.height === 0)
      return;
    const s = window.devicePixelRatio || 1, a = Math.max(1, Math.floor(i.width * s)), o = Math.max(1, Math.floor(i.height * s));
    if ((t.width !== a || t.height !== o) && (t.width = a, t.height = o), e.clearRect(0, 0, a, o), this.fillAudioVisualizationBackground(e, a, o), this.getAudioVisualizationType() === "meter") {
      this.drawMeter(e, a, o, this.audioStaticData);
      return;
    }
    if (this.getAudioVisualizationType() === "glow") {
      this.drawGlow(e, a, o, 0);
      return;
    }
    if (this.getAudioVisualizationType() === "ulysse31") {
      this.drawUlysse31Wireframe(e, a, o, this.getWaveformLevel(this.audioStaticData));
      return;
    }
    this.drawWaveform(e, a, o, this.audioStaticData);
  }
  drawFlatAudioVisualization() {
    const t = this.getAudioVisualizationCanvas();
    if (!t)
      return;
    const e = t.getContext("2d"), i = t.getBoundingClientRect();
    if (!e || i.width === 0 || i.height === 0) {
      this.getAudioVisualizationPosition() === "background" && !this.audioVisualizationPainted && window.requestAnimationFrame(() => this.drawFlatAudioVisualization());
      return;
    }
    const s = window.devicePixelRatio || 1, a = Math.max(1, Math.floor(i.width * s)), o = Math.max(1, Math.floor(i.height * s));
    (t.width !== a || t.height !== o) && (t.width = a, t.height = o), e.clearRect(0, 0, a, o), this.fillAudioVisualizationBackground(e, a, o);
    const r = this.getAudioVisualizationType();
    if (r === "spectrum")
      this.drawIdleSpectrum(e, a, o);
    else if (r === "meter")
      this.drawIdleMeter(e, a, o);
    else if (r === "glow")
      this.drawGlow(e, a, o, 0);
    else if (r === "ulysse31") {
      this.drawUlysse31Wireframe(e, a, o, 0), this.markBackgroundVisualizationReady(), this.syncUlysse31IdleAnimation();
      return;
    } else
      this.drawIdleWaveform(e, a, o);
    this.markBackgroundVisualizationReady();
  }
  showUlysse31IdleVisualization() {
    this.clearAudioStartDelayTimer(), this.cancelAudioAnimation(), this.cleanupAudioNodes(), this.audioBuffer = void 0, this.analyser = void 0, this.audioData = void 0, this.audioStaticData = void 0, this.audioPlaybackData = void 0, this.audioSourceEnded = !0, this.audioAnimationStartedAt = 0, this.audioVisualizationLoading = !1, this.audioVisualizationError = "", this.audioFetchUnavailable = !1, this.audioNeedsUserStart = !1, this.audioVisualizationStatus = "idle", this.audioKey = "", this.updateComplete.then(() => this.drawFlatAudioVisualization());
  }
  createStaticWaveformData(t) {
    const e = t.getChannelData(0), i = 512, s = new Uint8Array(i), a = Math.max(1, Math.floor(e.length / i));
    for (let o = 0; o < i; o += 1) {
      let r = 1, l = -1;
      const u = o * a, p = Math.min(u + a, e.length);
      for (let d = u; d < p; d += 1) {
        const g = e[d] || 0;
        r = Math.min(r, g), l = Math.max(l, g);
      }
      const h = Math.max(Math.abs(r), Math.abs(l));
      s[o] = Math.round((h * 0.5 + 0.5) * 255);
    }
    return s;
  }
  createPlaybackWaveformData(t) {
    const e = t.getChannelData(0), i = Math.max(512, Math.min(8192, Math.floor(t.duration * 1200))), s = new Uint8Array(i);
    for (let a = 0; a < i; a += 1) {
      const o = Math.min(e.length - 1, Math.floor(a / i * e.length)), r = Math.max(-1, Math.min(1, e[o] || 0));
      s[a] = Math.round((r * 0.5 + 0.5) * 255);
    }
    return s;
  }
  getAudioLevelAtProgress(t, e) {
    const s = Math.max(0, t.length - 96), a = Math.min(s, Math.floor(e * s));
    let o = 0;
    for (let r = 0; r < 96; r += 1)
      o += Math.abs((t[a + r] ?? 128) - 128) / 128;
    return Math.min(1, Math.max(0.08, o / 96 * 2.8));
  }
  scaleAudioFrame(t, e) {
    const i = new Uint8Array(t.length);
    for (let s = 0; s < t.length; s += 1) {
      const a = (t[s] ?? 128) - 128;
      i[s] = Math.max(0, Math.min(255, Math.round(128 + a * e)));
    }
    return i;
  }
  fillAudioVisualizationBackground(t, e, i) {
    const s = getComputedStyle(t.canvas).backgroundColor;
    !s || s === "transparent" || s === "rgba(0, 0, 0, 0)" || (t.fillStyle = s, t.fillRect(0, 0, e, i));
  }
  getWaveformLevel(t) {
    if (!(t != null && t.length))
      return 0;
    const e = Math.sqrt(
      t.reduce((i, s) => {
        const a = (s - 128) / 128;
        return i + a * a;
      }, 0) / t.length
    );
    return Math.min(1, Math.max(0, e * 2.4));
  }
  projectUlysse31Point(t, e, i, s, a, o, r, l, u) {
    let p = (i + s * Math.cos(e)) * Math.cos(t), h = (i + s * Math.cos(e)) * Math.sin(t), d = s * Math.sin(e);
    const g = Math.cos(a), m = Math.sin(a), v = h * g - d * m, $ = h * m + d * g;
    h = v, d = $;
    const b = Math.cos(o), T = Math.sin(o), y = p * b + d * T;
    d = -p * T + d * b, p = y;
    const H = 2.8 / (2.8 + d);
    return {
      x: r + p * u * H,
      y: l + h * u * H * 0.82,
      depth: d
    };
  }
  drawUlysse31Wireframe(t, e, i, s) {
    const a = getComputedStyle(t.canvas), o = a.color, r = a.borderTopColor || o, l = 0.08 + s * 0.92, { rotX: u, rotY: p } = this.advanceUlysse31Rotation(s), h = e / 2, d = i / 2, g = Math.min(e, i) * (0.24 + l * 0.08), m = 1, v = 0.34, $ = 28, b = 14;
    this.drawUlysse31Backdrop(t, e, i, r), t.save(), t.strokeStyle = o, t.lineWidth = Math.max(1, e / 420), t.shadowBlur = 6 + l * 14, t.shadowColor = o, t.globalAlpha = 0.72 + l * 0.28;
    const T = (y, H) => {
      t.beginPath();
      let tt = !1;
      if (H !== null)
        for (let E = 0; E <= $; E += 1) {
          const $t = E / $ * Math.PI * 2, x = this.projectUlysse31Point(
            $t,
            H,
            m,
            v,
            u,
            p,
            h,
            d,
            g
          );
          tt ? t.lineTo(x.x, x.y) : (t.moveTo(x.x, x.y), tt = !0);
        }
      else if (y !== null)
        for (let E = 0; E <= b; E += 1) {
          const $t = E / b * Math.PI * 2, x = this.projectUlysse31Point(
            y,
            $t,
            m,
            v,
            u,
            p,
            h,
            d,
            g
          );
          tt ? t.lineTo(x.x, x.y) : (t.moveTo(x.x, x.y), tt = !0);
        }
      t.stroke();
    };
    for (let y = 0; y <= b; y += 1)
      T(null, y / b * Math.PI * 2);
    for (let y = 0; y < $; y += 2)
      T(y / $ * Math.PI * 2, null);
    t.globalAlpha = 0.45 + l * 0.35, t.lineWidth = Math.max(1, e / 520), t.beginPath(), t.ellipse(h, d, g * 0.34, g * 0.22, p * 0.18, 0, Math.PI * 2), t.stroke(), t.restore();
  }
  advanceUlysse31Rotation(t) {
    const e = performance.now();
    if (!this.ulysse31LastFrameAt)
      return this.ulysse31LastFrameAt = e, {
        rotX: this.ulysse31RotationX,
        rotY: this.ulysse31RotationY
      };
    const i = Math.min(Math.max((e - this.ulysse31LastFrameAt) / 1e3, 0), 0.1), s = Math.min(Math.max(t, 0), 1), a = Math.PI * 2;
    return this.ulysse31LastFrameAt = e, this.ulysse31RotationX = (this.ulysse31RotationX + i * (0.35 + s * 1.1)) % a, this.ulysse31RotationY = (this.ulysse31RotationY + i * (0.52 + s * 0.95)) % a, {
      rotX: this.ulysse31RotationX,
      rotY: this.ulysse31RotationY
    };
  }
  drawUlysse31Backdrop(t, e, i, s) {
    t.save(), t.strokeStyle = s, t.globalAlpha = 0.08, t.lineWidth = 1;
    for (let o = 0; o < i; o += Math.max(3, Math.floor(i / 28)))
      t.beginPath(), t.moveTo(0, o + 0.5), t.lineTo(e, o + 0.5), t.stroke();
    t.globalAlpha = 0.18;
    const a = 18;
    for (let o = 0; o < a; o += 1) {
      const r = o * 7919, l = r * 37 % 1e3 / 1e3 * e, u = r * 53 % 1e3 / 1e3 * i, p = 1 + r * 17 % 100 / 100;
      t.fillStyle = s, t.fillRect(l, u, p, p);
    }
    t.restore();
  }
  syncUlysse31IdleAnimation() {
    if (this.getAudioVisualizationType() !== "ulysse31") {
      this.cancelUlysse31Animation();
      return;
    }
    this.audioAnimationFrame !== void 0 || this.ulysse31AnimationFrame !== void 0 || !this.audioIsVisible || document.hidden || (this.ulysse31AnimationFrame = window.requestAnimationFrame(() => this.drawUlysse31IdleFrame()));
  }
  drawUlysse31IdleFrame() {
    if (this.ulysse31AnimationFrame = void 0, this.getAudioVisualizationType() !== "ulysse31" || this.audioAnimationFrame !== void 0)
      return;
    const t = this.getAudioVisualizationCanvas();
    if (!t)
      return;
    const e = t.getContext("2d"), i = t.getBoundingClientRect();
    if (!e || i.width === 0 || i.height === 0) {
      this.syncUlysse31IdleAnimation();
      return;
    }
    const s = window.devicePixelRatio || 1, a = Math.max(1, Math.floor(i.width * s)), o = Math.max(1, Math.floor(i.height * s));
    (t.width !== a || t.height !== o) && (t.width = a, t.height = o), e.clearRect(0, 0, a, o), this.fillAudioVisualizationBackground(e, a, o), this.drawUlysse31Wireframe(e, a, o, 0), this.markBackgroundVisualizationReady(), !(!this.audioIsVisible || document.hidden) && (this.ulysse31AnimationFrame = window.requestAnimationFrame(() => this.drawUlysse31IdleFrame()));
  }
  cancelUlysse31Animation() {
    this.ulysse31AnimationFrame !== void 0 && (window.cancelAnimationFrame(this.ulysse31AnimationFrame), this.ulysse31AnimationFrame = void 0);
  }
  drawWaveform(t, e, i, s) {
    t.lineWidth = Math.max(2, e / 220), t.strokeStyle = getComputedStyle(t.canvas).color, t.beginPath();
    const a = e / s.length;
    for (let o = 0; o < s.length; o += 1) {
      const r = o * a, l = s[o] / 255 * i;
      o === 0 ? t.moveTo(r, l) : t.lineTo(r, l);
    }
    t.stroke();
  }
  drawIdleWaveform(t, e, i) {
    t.lineWidth = Math.max(2, e / 220), t.strokeStyle = getComputedStyle(t.canvas).color, t.beginPath(), t.moveTo(0, i / 2), t.lineTo(e, i / 2), t.stroke();
  }
  drawSpectrum(t, e, i, s) {
    const a = Math.max(1, e / 180), o = Math.max(2, e / s.length - a), r = getComputedStyle(t.canvas), l = r.color, u = r.borderTopColor, p = t.createLinearGradient(0, 0, 0, i);
    p.addColorStop(0, l), p.addColorStop(1, u || l), t.fillStyle = p, s.forEach((h, d) => {
      const g = Math.max(2, h / 255 * i), m = d * (o + a);
      t.fillRect(m, i - g, o, g);
    });
  }
  drawIdleSpectrum(t, e, i) {
    const s = getComputedStyle(t.canvas), a = 32, o = Math.max(1, e / 180), r = Math.max(2, e / a - o);
    t.fillStyle = s.borderTopColor || s.color, t.globalAlpha = 0.35;
    for (let l = 0; l < a; l += 1) {
      const u = l * (r + o);
      t.fillRect(u, i - 2, r, 2);
    }
    t.globalAlpha = 1;
  }
  drawAnimatedSpectrum(t, e, i, s, a) {
    const o = getComputedStyle(t.canvas), r = o.color, l = o.borderTopColor, u = t.createLinearGradient(0, 0, 0, i);
    u.addColorStop(0, r), u.addColorStop(1, l || r), t.fillStyle = u;
    const p = 34, h = Math.max(1, e / 180), d = Math.max(2, e / p - h);
    for (let g = 0; g < p; g += 1) {
      const m = 0.35 + 0.65 * Math.sin(g / (p - 1) * Math.PI), v = 0.72 + 0.28 * ((Math.sin(g * 1.7) + 1) / 2), $ = 0.92 + 0.08 * Math.sin(a * Math.PI * 10), b = Math.max(3, i * (0.08 + s * m * v * $)), T = g * (d + h);
      t.fillRect(T, i - b, d, b);
    }
  }
  drawMeter(t, e, i, s) {
    const a = Math.sqrt(
      s.reduce((p, h) => {
        const d = (h - 128) / 128;
        return p + d * d;
      }, 0) / s.length
    ), o = Math.min(1, a * 2.4), r = i / 2, l = getComputedStyle(t.canvas);
    t.fillStyle = l.borderTopColor, t.globalAlpha = 0.25, t.fillRect(0, i * 0.28, e, i * 0.44), t.globalAlpha = 1, t.fillStyle = l.color;
    const u = Math.max(r, e * o);
    t.fillRect((e - u) / 2, i * 0.28, u, i * 0.44);
  }
  drawIdleMeter(t, e, i) {
    const s = getComputedStyle(t.canvas), a = i / 2;
    t.fillStyle = s.borderTopColor, t.globalAlpha = 0.25, t.fillRect(0, i * 0.28, e, i * 0.44), t.globalAlpha = 1, t.fillStyle = s.color;
    const o = Math.max(2, a * 0.18);
    t.fillRect((e - o) / 2, i * 0.28, o, i * 0.44);
  }
  drawGlow(t, e, i, s) {
    const a = getComputedStyle(t.canvas), o = a.color, r = a.borderTopColor || o, l = Math.min(1, Math.max(0, s)), u = e * 0.5, p = i * 0.5, h = Math.max(e, i) * (0.45 + l * 0.25), d = t.createRadialGradient(u, p, 0, u, p, h);
    d.addColorStop(0, this.withAlpha(o, 0.1 + l * 0.72)), d.addColorStop(0.52, this.withAlpha(r, 0.05 + l * 0.24)), d.addColorStop(1, "rgba(0, 0, 0, 0)"), t.fillStyle = d, t.fillRect(0, 0, e, i);
  }
  withAlpha(t, e) {
    const i = t.trim(), s = Math.min(Math.max(e, 0), 1);
    return i.startsWith("rgb(") ? i.replace("rgb(", "rgba(").replace(")", `, ${s})`) : i.startsWith("rgba(") ? i.replace(/,\s*[\d.]+\)$/, `, ${s})`) : i;
  }
  cancelAudioAnimation() {
    this.audioAnimationFrame !== void 0 && (window.cancelAnimationFrame(this.audioAnimationFrame), this.audioAnimationFrame = void 0);
  }
  clearAudioStartDelayTimer() {
    this.audioStartDelayTimer !== void 0 && (window.clearTimeout(this.audioStartDelayTimer), this.audioStartDelayTimer = void 0);
  }
  cleanupAudioVisualization(t = !0, e = !1) {
    var i;
    this.clearAudioStartDelayTimer(), this.cancelAudioAnimation(), this.cancelUlysse31Animation(), this.cleanupAudioNodes(), this.audioBuffer = void 0, this.analyser = void 0, this.audioData = void 0, this.audioStaticData = void 0, this.audioPlaybackData = void 0, this.audioSourceEnded = !1, this.audioAnimationStartedAt = 0, this.audioVisualizationStatus = "", this.audioVisualizationLoading = !1, this.audioVisualizationError = "", this.audioFetchUnavailable = !1, this.audioVisualizationPainted = !1, this.audioNeedsUserStart = !1, t && (this.audioKey = ""), e && ((i = this.audioContext) == null || i.close(), this.audioContext = void 0);
  }
  cleanupAudioNodes() {
    var t, e, i, s;
    try {
      (t = this.audioSource) == null || t.stop();
    } catch {
    }
    (e = this.audioSource) == null || e.disconnect(), (i = this.analyser) == null || i.disconnect(), (s = this.silentGain) == null || s.disconnect(), this.audioSource = void 0, this.silentGain = void 0;
  }
  openDebugPage(t) {
    t.stopPropagation(), this.resolvedPipelineId && k(this, this.hass, {}, {
      action: "navigate",
      navigation_path: `/config/voice-assistants/debug/${this.resolvedPipelineId}`
    });
  }
  resolvePipelineId(t) {
    var i, s;
    const e = this.config.pipeline_id || j;
    return e !== j ? e : t.preferred_pipeline || ((s = (i = t.pipelines) == null ? void 0 : i[0]) == null ? void 0 : s.id) || "";
  }
  getRunCount() {
    const t = Number(this.config.run_count || q);
    return Number.isFinite(t) ? Math.min(Math.max(Math.round(t), 1), 20) : q;
  }
  getPipelineName(t) {
    var e;
    return (e = this.pipelines.find((i) => i.id === t)) == null ? void 0 : e.name;
  }
  getStageStatus(t, e) {
    var i, s;
    return e ? ((i = this.runModel) == null ? void 0 : i.stage) === "error" && !e.done ? "error" : e.done ? "done" : ((s = this.runModel) == null ? void 0 : s.stage) === t ? "running" : "idle" : "idle";
  }
  getStageDuration(t) {
    var a, o, r, l, u, p;
    const e = t === "stt" ? "stt-vad-end" : `${t}-start`;
    let i = (o = (a = this.runModel) == null ? void 0 : a.events.find((h) => h.type === e)) == null ? void 0 : o.timestamp;
    t === "stt" && !i && (i = (l = (r = this.runModel) == null ? void 0 : r.events.find((h) => h.type === "stt-start")) == null ? void 0 : l.timestamp);
    const s = (p = (u = this.runModel) == null ? void 0 : u.events.find((h) => h.type === `${t}-end`)) == null ? void 0 : p.timestamp;
    return this.formatDuration(i ? new Date(i) : void 0, s ? new Date(s) : void 0);
  }
  getStatusIcon(t) {
    switch (t) {
      case "done":
        return "mdi:check-circle";
      case "running":
        return "mdi:progress-clock";
      case "error":
        return "mdi:alert-circle";
      default:
        return "mdi:circle-outline";
    }
  }
  formatDuration(t, e) {
    if (!t || !e)
      return "";
    const i = Math.max(0, (e.getTime() - t.getTime()) / 1e3);
    return `${i.toFixed(i < 10 ? 2 : 1)}s`;
  }
  formatTime(t) {
    var e, i;
    try {
      return new Intl.DateTimeFormat(((i = (e = this.hass) == null ? void 0 : e.locale) == null ? void 0 : i.language) || navigator.language, {
        hour: "2-digit",
        minute: "2-digit"
      }).format(new Date(t));
    } catch {
      return t;
    }
  }
  formatStageName(t) {
    return t.replace("_", " ");
  }
  shortId(t) {
    return t.length > 12 ? `${t.slice(0, 6)}...${t.slice(-4)}` : t;
  }
  maskText(t) {
    return t ? this.config.mask_transcripts ? "[masked]" : t : "";
  }
  getConversationMessages(t) {
    var e, i, s;
    return {
      userText: this.maskText(((e = t.stt) == null ? void 0 : e.output) || ((i = t.intent) == null ? void 0 : i.input) || ""),
      assistantText: this.maskText(((s = t.tts) == null ? void 0 : s.input) || this.extractAssistantSpeech(t) || "")
    };
  }
  getConversationLoadingText(t, e) {
    return e ? t.stage === "stt" ? "Listening..." : t.stage === "intent" ? "Thinking..." : t.stage === "tts" ? "Preparing reply..." : "Processing..." : "Waiting for reply...";
  }
  extractTtsAudio(t, e) {
    if (t != null && t.url)
      return {
        url: String(t.url),
        mimeType: t.mime_type,
        token: t.token,
        mediaId: t.media_id,
        timestamp: e
      };
  }
  maskRaw(t) {
    return Array.isArray(t) ? t.map((e) => this.maskRaw(e)) : t && typeof t == "object" ? Object.fromEntries(
      Object.entries(t).map(([e, i]) => [
        e,
        Qi.has(e) ? "[masked]" : this.maskRaw(i)
      ])
    ) : t;
  }
  extractAssistantSpeech(t) {
    var e;
    return ((e = t.intent) == null ? void 0 : e.output) || "";
  }
  extractSpeechFromIntentOutput(t) {
    var i, s, a, o, r, l, u, p;
    const e = ((a = (s = (i = t == null ? void 0 : t.response) == null ? void 0 : i.speech) == null ? void 0 : s.plain) == null ? void 0 : a.speech) || ((u = (l = (r = (o = t == null ? void 0 : t.response) == null ? void 0 : o.speech) == null ? void 0 : r.plain) == null ? void 0 : l.extra_data) == null ? void 0 : u.speech) || ((p = t == null ? void 0 : t.response) == null ? void 0 : p.speech) || "";
    return typeof e == "string" ? e : "";
  }
  formatError(t) {
    if (t && typeof t == "object") {
      const e = t;
      return e.message || e.code || "Home Assistant rejected the debug request.";
    }
    return "Home Assistant rejected the debug request.";
  }
  localize(t) {
    var e, i;
    try {
      return ((i = (e = this.hass) == null ? void 0 : e.localize) == null ? void 0 : i.call(e, t)) || "";
    } catch {
      return "";
    }
  }
  getAudioVisualizationType() {
    const t = this.config.audio_visualization_type;
    return t === "spectrum" || t === "meter" || t === "waveform" || t === "glow" || t === "ulysse31" ? t : Bt;
  }
  getAudioVisualizationPosition() {
    const t = this.config.audio_visualization_position;
    return t === "background" || t === "top" || t === "between" || t === "below_chat" ? t : Wt;
  }
  getAudioVisualizationHeight() {
    const t = Number(this.config.audio_visualization_height || 56);
    return Number.isFinite(t) ? Math.min(Math.max(Math.round(t), 24), 180) : 56;
  }
  getAudioVisualizationOpacity() {
    const t = Number(this.config.audio_visualization_opacity ?? 0.75);
    return Number.isFinite(t) ? Math.min(Math.max(t, 0.05), 1) : 0.75;
  }
  getAudioVisualizationStartDelay() {
    const t = Number(this.config.audio_visualization_start_delay || 0);
    return Number.isFinite(t) ? Math.min(Math.max(Math.round(t), 0), 1e4) : 0;
  }
  getCssValue(t) {
    return getComputedStyle(this).getPropertyValue(t).trim();
  }
  getCardStyles() {
    const e = this.getAudioVisualizationType() === "ulysse31";
    return {
      "--assist-debug-background": this.config.background_color || "#1d1d1d",
      "--assist-debug-surface": this.config.surface_color || "#2b2b2b",
      "--assist-debug-text": this.config.text_color || "var(--primary-text-color)",
      "--assist-debug-secondary-text": this.config.secondary_text_color || "#9b9b9b",
      "--assist-debug-accent": this.config.accent_color || "var(--primary-color)",
      "--assist-debug-user-chat": this.config.user_chat_color || "var(--primary-color)",
      "--assist-debug-user-chat-text": this.config.user_chat_text_color || "var(--text-primary-color, #fff)",
      "--assist-debug-assistant-chat": this.config.assistant_chat_color || "#2b2b2b",
      "--assist-debug-assistant-chat-text": this.config.assistant_chat_text_color || "var(--assist-debug-text)",
      "--assist-debug-audio-height": `${this.getAudioVisualizationHeight()}px`,
      "--assist-debug-audio-color": this.config.audio_visualization_color || (e ? Ji : "var(--assist-debug-accent)"),
      "--assist-debug-audio-secondary-color": this.config.audio_visualization_secondary_color || "var(--assist-debug-secondary-text)",
      "--assist-debug-audio-background": this.config.audio_visualization_background || (e ? Yi : "transparent"),
      "--assist-debug-audio-opacity": String(this.getAudioVisualizationOpacity())
    };
  }
};
F.nextAudioVisualizationId = 0, F.properties = {
  hass: { attribute: !1 },
  config: { attribute: !1 },
  loading: { state: !0 },
  error: { state: !0 },
  pipelines: { state: !0 },
  runs: { state: !0 },
  selectedRunId: { state: !0 },
  resolvedPipelineId: { state: !0 },
  runModel: { state: !0 },
  audioVisualizationLoading: { state: !0 },
  audioVisualizationError: { state: !0 },
  audioVisualizationPainted: { state: !0 },
  audioNeedsUserStart: { state: !0 },
  audioVisualizationStatus: { state: !0 },
  thinkingDetailsOpen: { state: !0 }
}, F.styles = w`
    ha-card {
      background: var(--assist-debug-background);
      border: 0;
      border-radius: 20px;
      overflow: hidden;
    }

    .card {
      background: var(--assist-debug-background);
      color: var(--assist-debug-text);
      display: grid;
      gap: 12px;
      padding: 12px;
      position: relative;
    }

    .visualization-only-card {
      min-height: var(--assist-debug-audio-height);
    }

    .visualization-only-spacer {
      min-height: var(--assist-debug-audio-height);
    }

    .card > :not(.audio-visualization-card-background) {
      position: relative;
      z-index: 1;
    }

    .header {
      align-items: start;
      display: flex;
      gap: 12px;
      justify-content: space-between;
    }

    .eyebrow {
      color: var(--assist-debug-secondary-text);
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    h2,
    p {
      margin: 0;
    }

    h2 {
      color: var(--assist-debug-text);
      font-size: 14px;
      font-weight: 700;
      line-height: 1.2;
      margin-top: 3px;
    }

    .header p {
      color: var(--assist-debug-secondary-text);
      font-size: 12px;
      margin-top: 4px;
    }

    .actions {
      display: inline-flex;
      gap: 6px;
    }

    button {
      -webkit-tap-highlight-color: transparent;
      cursor: pointer;
      font: inherit;
    }

    .icon-button {
      align-items: center;
      background: var(--assist-debug-surface);
      border: 0;
      border-radius: 12px;
      color: var(--assist-debug-text);
      display: inline-flex;
      height: 42px;
      justify-content: center;
      padding: 0;
      width: 42px;
    }

    .icon-button ha-icon {
      --mdc-icon-size: 19px;
    }

    .state {
      align-items: center;
      background: var(--assist-debug-surface);
      border-radius: 16px;
      color: var(--assist-debug-secondary-text);
      display: flex;
      gap: 12px;
      padding: 14px;
    }

    .state strong,
    .state span {
      display: block;
    }

    .state strong {
      color: var(--assist-debug-text);
      font-size: 14px;
    }

    .state span {
      font-size: 12px;
      margin-top: 2px;
    }

    .state ha-icon {
      --mdc-icon-size: 22px;
      color: var(--assist-debug-accent);
    }

    .error-state ha-icon,
    .error-message {
      color: var(--error-color, #db4437);
    }

    .run-picker {
      display: flex;
      gap: 8px;
      overflow-x: auto;
      padding-bottom: 2px;
      scrollbar-width: thin;
    }

    .run-chip {
      background: var(--assist-debug-surface);
      border: 1px solid transparent;
      border-radius: 999px;
      color: var(--assist-debug-text);
      display: grid;
      flex: 0 0 auto;
      gap: 1px;
      min-width: 78px;
      padding: 8px 11px;
      text-align: left;
    }

    .run-chip small {
      color: var(--assist-debug-secondary-text);
      font-size: 10px;
    }

    .run-chip.selected {
      background: var(--assist-debug-surface);
      border-color: var(--assist-debug-accent);
    }

    .conversation {
      display: grid;
      gap: 8px;
      position: relative;
      z-index: 1;
    }

    .conversation-shell {
      display: grid;
      gap: 8px;
      position: relative;
    }

    .conversation-shell.has-background-visualization {
      border-radius: 16px;
      overflow: hidden;
    }

    .bubble {
      border-radius: 16px;
      font-size: 13px;
      line-height: 1.35;
      max-width: 88%;
      padding: 10px 12px;
    }

    .bubble.user {
      background: var(--assist-debug-user-chat);
      color: var(--assist-debug-user-chat-text);
      justify-self: end;
    }

    .bubble.assistant {
      background: var(--assist-debug-assistant-chat);
      color: var(--assist-debug-assistant-chat-text);
      justify-self: start;
    }

    .conversation-only {
      min-height: 68px;
    }

    .bubble.loading {
      align-items: center;
      color: var(--assist-debug-secondary-text);
      display: inline-flex;
      gap: 8px;
    }

    .error-bubble {
      color: var(--error-color, #db4437);
    }

    .audio-visualization {
      background: var(--assist-debug-audio-background);
      border-radius: 16px;
      box-sizing: border-box;
      min-height: var(--assist-debug-audio-height);
      opacity: var(--assist-debug-audio-opacity);
      overflow: hidden;
      position: relative;
      width: 100%;
    }

    .audio-visualization-background {
      inset: 0;
      min-height: 100%;
      position: absolute;
      z-index: 0;
    }

    .audio-visualization-background.is-pending {
      opacity: 0;
    }

    .audio-visualization-card-background {
      border-radius: inherit;
      inset: 0;
      min-height: 100%;
      opacity: var(--assist-debug-audio-opacity);
      pointer-events: none;
      position: absolute;
      z-index: 0;
    }

    .audio-visualization-canvas {
      background: var(--assist-debug-audio-background);
      border-color: var(--assist-debug-audio-secondary-color);
      color: var(--assist-debug-audio-color);
      display: block;
      height: var(--assist-debug-audio-height);
      width: 100%;
    }

    .audio-visualization-background .audio-visualization-canvas {
      height: 100%;
    }

    .audio-visualization-card-background .audio-visualization-canvas {
      height: 100%;
    }

    .audio-visualization-between {
      min-height: calc(var(--assist-debug-audio-height) * 0.72);
    }

    .audio-visualization-between .audio-visualization-canvas {
      height: calc(var(--assist-debug-audio-height) * 0.72);
    }

    .audio-visualization-standalone {
      min-height: var(--assist-debug-audio-height);
    }

    .audio-visualization-overlay,
    .audio-start-button {
      align-items: center;
      background: rgba(0, 0, 0, 0.24);
      border: 0;
      border-radius: 999px;
      color: var(--assist-debug-text);
      display: inline-flex;
      font-size: 12px;
      gap: 6px;
      left: 50%;
      padding: 7px 10px;
      position: absolute;
      top: 50%;
      transform: translate(-50%, -50%);
      white-space: nowrap;
    }

    .audio-start-button {
      background: var(--assist-debug-user-chat);
      color: var(--assist-debug-user-chat-text);
    }

    .typing-dots {
      align-items: center;
      display: inline-flex;
      gap: 3px;
    }

    .typing-dots span {
      animation: typing-dot 1.2s infinite ease-in-out;
      background: currentColor;
      border-radius: 50%;
      display: block;
      height: 5px;
      opacity: 0.45;
      width: 5px;
    }

    .typing-dots span:nth-child(2) {
      animation-delay: 0.15s;
    }

    .typing-dots span:nth-child(3) {
      animation-delay: 0.3s;
    }

    @keyframes typing-dot {
      0%,
      80%,
      100% {
        transform: translateY(0);
      }
      40% {
        opacity: 1;
        transform: translateY(-3px);
      }
    }

    .timeline {
      display: grid;
      gap: 10px;
    }

    .section {
      background: var(--assist-debug-surface);
      border: 0;
      border-radius: 16px;
      overflow: hidden;
    }

    summary {
      align-items: center;
      display: grid;
      gap: 10px;
      grid-template-columns: auto 1fr auto auto;
      list-style: none;
      min-height: 48px;
      padding: 0 12px;
    }

    summary::-webkit-details-marker {
      display: none;
    }

    .status {
      align-items: center;
      display: inline-flex;
      justify-content: center;
    }

    .status ha-icon {
      --mdc-icon-size: 18px;
    }

    .status.done {
      color: var(--success-color, #43a047);
    }

    .status.running {
      color: var(--assist-debug-accent);
    }

    .status.error {
      color: var(--error-color, #db4437);
    }

    .status.idle {
      color: var(--disabled-text-color);
    }

    .section-title {
      font-size: 14px;
      font-weight: 700;
      min-width: 0;
    }

    .duration {
      color: var(--assist-debug-secondary-text);
      font-size: 12px;
      white-space: nowrap;
    }

    .chevron {
      --mdc-icon-size: 18px;
      color: var(--assist-debug-secondary-text);
      transition: transform 160ms ease;
    }

    details[open] .chevron {
      transform: rotate(180deg);
    }

    .section-body {
      display: grid;
      gap: 12px;
      padding: 0 12px 12px 40px;
    }

    .stage-text,
    .muted,
    .error-message {
      font-size: 13px;
      line-height: 1.4;
      margin: 0;
    }

    .muted {
      color: var(--assist-debug-secondary-text);
    }

    .meta-grid {
      display: grid;
      gap: 8px 12px;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      margin: 0;
    }

    .meta-grid.full {
      grid-template-columns: 1fr;
    }

    .meta-grid div {
      min-width: 0;
    }

    dt {
      color: var(--assist-debug-secondary-text);
      font-size: 11px;
      font-weight: 600;
      margin-bottom: 2px;
    }

    dd {
      font-size: 12px;
      margin: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    pre {
      background: rgba(0, 0, 0, 0.18);
      border-radius: 12px;
      box-sizing: border-box;
      color: var(--assist-debug-text);
      font-size: 11px;
      line-height: 1.45;
      margin: 0 12px 12px;
      max-height: 320px;
      overflow: auto;
      padding: 12px;
    }

    .thinking pre.thinking-content {
      max-height: 420px;
      white-space: pre-wrap;
      word-break: break-word;
    }

    @media (max-width: 420px) {
      .card {
        padding: 12px;
      }

      .header {
        align-items: start;
      }

      .meta-grid {
        grid-template-columns: 1fr;
      }

      .section-body {
        padding-left: 12px;
      }
    }
  `;
let dt = F;
class ts extends dt {
}
customElements.define("assist-debug-card", dt);
customElements.get("conversation-debug-card") || customElements.define("conversation-debug-card", ts);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "assist-debug-card",
  name: "Assist Debug Card",
  description: "Modern debug view for Home Assistant Assist pipeline runs"
});
