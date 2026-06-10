/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const bt = globalThis, De = bt.ShadowRoot && (bt.ShadyCSS === void 0 || bt.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Pe = Symbol(), je = /* @__PURE__ */ new WeakMap();
let Ti = class {
  constructor(t, e, i) {
    if (this._$cssResult$ = !0, i !== Pe) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (De && t === void 0) {
      const i = e !== void 0 && e.length === 1;
      i && (t = je.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && je.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const ls = (a) => new Ti(typeof a == "string" ? a : a + "", void 0, Pe), _ = (a, ...t) => {
  const e = a.length === 1 ? a[0] : t.reduce((i, s, n) => i + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + a[n + 1], a[0]);
  return new Ti(e, a, Pe);
}, cs = (a, t) => {
  if (De) a.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const i = document.createElement("style"), s = bt.litNonce;
    s !== void 0 && i.setAttribute("nonce", s), i.textContent = e.cssText, a.appendChild(i);
  }
}, qe = De ? (a) => a : (a) => a instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const i of t.cssRules) e += i.cssText;
  return ls(e);
})(a) : a;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: ds, defineProperty: hs, getOwnPropertyDescriptor: us, getOwnPropertyNames: ps, getOwnPropertySymbols: gs, getPrototypeOf: fs } = Object, E = globalThis, Ke = E.trustedTypes, ms = Ke ? Ke.emptyScript : "", Gt = E.reactiveElementPolyfillSupport, nt = (a, t) => a, ve = { toAttribute(a, t) {
  switch (t) {
    case Boolean:
      a = a ? ms : null;
      break;
    case Object:
    case Array:
      a = a == null ? a : JSON.stringify(a);
  }
  return a;
}, fromAttribute(a, t) {
  let e = a;
  switch (t) {
    case Boolean:
      e = a !== null;
      break;
    case Number:
      e = a === null ? null : Number(a);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(a);
      } catch {
        e = null;
      }
  }
  return e;
} }, Ei = (a, t) => !ds(a, t), Ge = { attribute: !0, type: String, converter: ve, reflect: !1, useDefault: !1, hasChanged: Ei };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), E.litPropertyMetadata ?? (E.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let W = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = Ge) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const i = Symbol(), s = this.getPropertyDescriptor(t, i, e);
      s !== void 0 && hs(this.prototype, t, s);
    }
  }
  static getPropertyDescriptor(t, e, i) {
    const { get: s, set: n } = us(this.prototype, t) ?? { get() {
      return this[e];
    }, set(o) {
      this[e] = o;
    } };
    return { get: s, set(o) {
      const r = s == null ? void 0 : s.call(this);
      n == null || n.call(this, o), this.requestUpdate(t, r, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? Ge;
  }
  static _$Ei() {
    if (this.hasOwnProperty(nt("elementProperties"))) return;
    const t = fs(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(nt("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(nt("properties"))) {
      const e = this.properties, i = [...ps(e), ...gs(e)];
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
      for (const s of i) e.unshift(qe(s));
    } else t !== void 0 && e.push(qe(t));
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
    return cs(t, this.constructor.elementStyles), t;
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
    var n;
    const i = this.constructor.elementProperties.get(t), s = this.constructor._$Eu(t, i);
    if (s !== void 0 && i.reflect === !0) {
      const o = (((n = i.converter) == null ? void 0 : n.toAttribute) !== void 0 ? i.converter : ve).toAttribute(e, i.type);
      this._$Em = t, o == null ? this.removeAttribute(s) : this.setAttribute(s, o), this._$Em = null;
    }
  }
  _$AK(t, e) {
    var n, o;
    const i = this.constructor, s = i._$Eh.get(t);
    if (s !== void 0 && this._$Em !== s) {
      const r = i.getPropertyOptions(s), l = typeof r.converter == "function" ? { fromAttribute: r.converter } : ((n = r.converter) == null ? void 0 : n.fromAttribute) !== void 0 ? r.converter : ve;
      this._$Em = s;
      const c = l.fromAttribute(e, r.type);
      this[s] = c ?? ((o = this._$Ej) == null ? void 0 : o.get(s)) ?? c, this._$Em = null;
    }
  }
  requestUpdate(t, e, i, s = !1, n) {
    var o;
    if (t !== void 0) {
      const r = this.constructor;
      if (s === !1 && (n = this[t]), i ?? (i = r.getPropertyOptions(t)), !((i.hasChanged ?? Ei)(n, e) || i.useDefault && i.reflect && n === ((o = this._$Ej) == null ? void 0 : o.get(t)) && !this.hasAttribute(r._$Eu(t, i)))) return;
      this.C(t, e, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: i, reflect: s, wrapped: n }, o) {
    i && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, o ?? e ?? this[t]), n !== !0 || o !== void 0) || (this._$AL.has(t) || (this.hasUpdated || i || (e = void 0), this._$AL.set(t, e)), s === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
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
        for (const [n, o] of this._$Ep) this[n] = o;
        this._$Ep = void 0;
      }
      const s = this.constructor.elementProperties;
      if (s.size > 0) for (const [n, o] of s) {
        const { wrapped: r } = o, l = this[n];
        r !== !0 || this._$AL.has(n) || l === void 0 || this.C(n, void 0, o, l);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), (i = this._$EO) == null || i.forEach((s) => {
        var n;
        return (n = s.hostUpdate) == null ? void 0 : n.call(s);
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
W.elementStyles = [], W.shadowRootOptions = { mode: "open" }, W[nt("elementProperties")] = /* @__PURE__ */ new Map(), W[nt("finalized")] = /* @__PURE__ */ new Map(), Gt == null || Gt({ ReactiveElement: W }), (E.reactiveElementVersions ?? (E.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ot = globalThis, Je = (a) => a, $t = ot.trustedTypes, Ye = $t ? $t.createPolicy("lit-html", { createHTML: (a) => a }) : void 0, zi = "$lit$", T = `lit$${Math.random().toFixed(9).slice(2)}$`, Ii = "?" + T, bs = `<${Ii}>`, H = document, rt = () => H.createComment(""), lt = (a) => a === null || typeof a != "object" && typeof a != "function", Ne = Array.isArray, vs = (a) => Ne(a) || typeof (a == null ? void 0 : a[Symbol.iterator]) == "function", Jt = `[ 	
\f\r]`, X = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Xe = /-->/g, Ze = />/g, M = RegExp(`>|${Jt}(?:([^\\s"'>=/]+)(${Jt}*=${Jt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Qe = /'/g, ti = /"/g, Li = /^(?:script|style|textarea|title)$/i, ys = (a) => (t, ...e) => ({ _$litType$: a, strings: t, values: e }), d = ys(1), L = Symbol.for("lit-noChange"), y = Symbol.for("lit-nothing"), ei = /* @__PURE__ */ new WeakMap(), N = H.createTreeWalker(H, 129);
function Ri(a, t) {
  if (!Ne(a) || !a.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Ye !== void 0 ? Ye.createHTML(t) : t;
}
const _s = (a, t) => {
  const e = a.length - 1, i = [];
  let s, n = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = X;
  for (let r = 0; r < e; r++) {
    const l = a[r];
    let c, p, u = -1, h = 0;
    for (; h < l.length && (o.lastIndex = h, p = o.exec(l), p !== null); ) h = o.lastIndex, o === X ? p[1] === "!--" ? o = Xe : p[1] !== void 0 ? o = Ze : p[2] !== void 0 ? (Li.test(p[2]) && (s = RegExp("</" + p[2], "g")), o = M) : p[3] !== void 0 && (o = M) : o === M ? p[0] === ">" ? (o = s ?? X, u = -1) : p[1] === void 0 ? u = -2 : (u = o.lastIndex - p[2].length, c = p[1], o = p[3] === void 0 ? M : p[3] === '"' ? ti : Qe) : o === ti || o === Qe ? o = M : o === Xe || o === Ze ? o = X : (o = M, s = void 0);
    const g = o === M && a[r + 1].startsWith("/>") ? " " : "";
    n += o === X ? l + bs : u >= 0 ? (i.push(c), l.slice(0, u) + zi + l.slice(u) + T + g) : l + T + (u === -2 ? r : g);
  }
  return [Ri(a, n + (a[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), i];
};
let ye = class Vi {
  constructor({ strings: t, _$litType$: e }, i) {
    let s;
    this.parts = [];
    let n = 0, o = 0;
    const r = t.length - 1, l = this.parts, [c, p] = _s(t, e);
    if (this.el = Vi.createElement(c, i), N.currentNode = this.el.content, e === 2 || e === 3) {
      const u = this.el.content.firstChild;
      u.replaceWith(...u.childNodes);
    }
    for (; (s = N.nextNode()) !== null && l.length < r; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const u of s.getAttributeNames()) if (u.endsWith(zi)) {
          const h = p[o++], g = s.getAttribute(u).split(T), f = /([.?@])?(.*)/.exec(h);
          l.push({ type: 1, index: n, name: f[2], strings: g, ctor: f[1] === "." ? xs : f[1] === "?" ? $s : f[1] === "@" ? Ss : Ut }), s.removeAttribute(u);
        } else u.startsWith(T) && (l.push({ type: 6, index: n }), s.removeAttribute(u));
        if (Li.test(s.tagName)) {
          const u = s.textContent.split(T), h = u.length - 1;
          if (h > 0) {
            s.textContent = $t ? $t.emptyScript : "";
            for (let g = 0; g < h; g++) s.append(u[g], rt()), N.nextNode(), l.push({ type: 2, index: ++n });
            s.append(u[h], rt());
          }
        }
      } else if (s.nodeType === 8) if (s.data === Ii) l.push({ type: 2, index: n });
      else {
        let u = -1;
        for (; (u = s.data.indexOf(T, u + 1)) !== -1; ) l.push({ type: 7, index: n }), u += T.length - 1;
      }
      n++;
    }
  }
  static createElement(t, e) {
    const i = H.createElement("template");
    return i.innerHTML = t, i;
  }
};
function K(a, t, e = a, i) {
  var o, r;
  if (t === L) return t;
  let s = i !== void 0 ? (o = e._$Co) == null ? void 0 : o[i] : e._$Cl;
  const n = lt(t) ? void 0 : t._$litDirective$;
  return (s == null ? void 0 : s.constructor) !== n && ((r = s == null ? void 0 : s._$AO) == null || r.call(s, !1), n === void 0 ? s = void 0 : (s = new n(a), s._$AT(a, e, i)), i !== void 0 ? (e._$Co ?? (e._$Co = []))[i] = s : e._$Cl = s), s !== void 0 && (t = K(a, s._$AS(a, t.values), s, i)), t;
}
class ws {
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
    const { el: { content: e }, parts: i } = this._$AD, s = ((t == null ? void 0 : t.creationScope) ?? H).importNode(e, !0);
    N.currentNode = s;
    let n = N.nextNode(), o = 0, r = 0, l = i[0];
    for (; l !== void 0; ) {
      if (o === l.index) {
        let c;
        l.type === 2 ? c = new G(n, n.nextSibling, this, t) : l.type === 1 ? c = new l.ctor(n, l.name, l.strings, this, t) : l.type === 6 && (c = new As(n, this, t)), this._$AV.push(c), l = i[++r];
      }
      o !== (l == null ? void 0 : l.index) && (n = N.nextNode(), o++);
    }
    return N.currentNode = H, s;
  }
  p(t) {
    let e = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(t, i, e), e += i.strings.length - 2) : i._$AI(t[e])), e++;
  }
}
class G {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, e, i, s) {
    this.type = 2, this._$AH = y, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = i, this.options = s, this._$Cv = (s == null ? void 0 : s.isConnected) ?? !0;
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
    t = K(this, t, e), lt(t) ? t === y || t == null || t === "" ? (this._$AH !== y && this._$AR(), this._$AH = y) : t !== this._$AH && t !== L && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : vs(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== y && lt(this._$AH) ? this._$AA.nextSibling.data = t : this.T(H.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var n;
    const { values: e, _$litType$: i } = t, s = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = ye.createElement(Ri(i.h, i.h[0]), this.options)), i);
    if (((n = this._$AH) == null ? void 0 : n._$AD) === s) this._$AH.p(e);
    else {
      const o = new ws(s, this), r = o.u(this.options);
      o.p(e), this.T(r), this._$AH = o;
    }
  }
  _$AC(t) {
    let e = ei.get(t.strings);
    return e === void 0 && ei.set(t.strings, e = new ye(t)), e;
  }
  k(t) {
    Ne(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let i, s = 0;
    for (const n of t) s === e.length ? e.push(i = new G(this.O(rt()), this.O(rt()), this, this.options)) : i = e[s], i._$AI(n), s++;
    s < e.length && (this._$AR(i && i._$AB.nextSibling, s), e.length = s);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    var i;
    for ((i = this._$AP) == null ? void 0 : i.call(this, !1, !0, e); t !== this._$AB; ) {
      const s = Je(t).nextSibling;
      Je(t).remove(), t = s;
    }
  }
  setConnected(t) {
    var e;
    this._$AM === void 0 && (this._$Cv = t, (e = this._$AP) == null || e.call(this, t));
  }
}
let Ut = class {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, i, s, n) {
    this.type = 1, this._$AH = y, this._$AN = void 0, this.element = t, this.name = e, this._$AM = s, this.options = n, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = y;
  }
  _$AI(t, e = this, i, s) {
    const n = this.strings;
    let o = !1;
    if (n === void 0) t = K(this, t, e, 0), o = !lt(t) || t !== this._$AH && t !== L, o && (this._$AH = t);
    else {
      const r = t;
      let l, c;
      for (t = n[0], l = 0; l < n.length - 1; l++) c = K(this, r[i + l], e, l), c === L && (c = this._$AH[l]), o || (o = !lt(c) || c !== this._$AH[l]), c === y ? t = y : t !== y && (t += (c ?? "") + n[l + 1]), this._$AH[l] = c;
    }
    o && !s && this.j(t);
  }
  j(t) {
    t === y ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
};
class xs extends Ut {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === y ? void 0 : t;
  }
}
class $s extends Ut {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== y);
  }
}
class Ss extends Ut {
  constructor(t, e, i, s, n) {
    super(t, e, i, s, n), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = K(this, t, e, 0) ?? y) === L) return;
    const i = this._$AH, s = t === y && i !== y || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive, n = t !== y && (i === y || s);
    s && this.element.removeEventListener(this.name, this, i), n && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var e;
    typeof this._$AH == "function" ? this._$AH.call(((e = this.options) == null ? void 0 : e.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
let As = class {
  constructor(t, e, i) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    K(this, t);
  }
};
const Cs = { I: G }, Yt = ot.litHtmlPolyfillSupport;
Yt == null || Yt(ye, G), (ot.litHtmlVersions ?? (ot.litHtmlVersions = [])).push("3.3.2");
const ks = (a, t, e) => {
  const i = (e == null ? void 0 : e.renderBefore) ?? t;
  let s = i._$litPart$;
  if (s === void 0) {
    const n = (e == null ? void 0 : e.renderBefore) ?? null;
    i._$litPart$ = s = new G(t.insertBefore(rt(), n), n, void 0, e ?? {});
  }
  return s._$AI(a), s;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const O = globalThis;
let x = class extends W {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = ks(e, this.renderRoot, this.renderOptions);
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
    return L;
  }
};
var ki;
x._$litElement$ = !0, x.finalized = !0, (ki = O.litElementHydrateSupport) == null || ki.call(O, { LitElement: x });
const Xt = O.litElementPolyfillSupport;
Xt == null || Xt({ LitElement: x });
(O.litElementVersions ?? (O.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Mi = { ATTRIBUTE: 1, CHILD: 2 }, Di = (a) => (...t) => ({ _$litDirective$: a, values: t });
let Pi = class {
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
const Ni = "important", Ts = " !" + Ni, J = Di(class extends Pi {
  constructor(a) {
    var t;
    if (super(a), a.type !== Mi.ATTRIBUTE || a.name !== "style" || ((t = a.strings) == null ? void 0 : t.length) > 2) throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.");
  }
  render(a) {
    return Object.keys(a).reduce((t, e) => {
      const i = a[e];
      return i == null ? t : t + `${e = e.includes("-") ? e : e.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g, "-$&").toLowerCase()}:${i};`;
    }, "");
  }
  update(a, [t]) {
    const { style: e } = a.element;
    if (this.ft === void 0) return this.ft = new Set(Object.keys(t)), this.render(t);
    for (const i of this.ft) t[i] == null && (this.ft.delete(i), i.includes("-") ? e.removeProperty(i) : e[i] = null);
    for (const i in t) {
      const s = t[i];
      if (s != null) {
        this.ft.add(i);
        const n = typeof s == "string" && s.endsWith(Ts);
        i.includes("-") || n ? e.setProperty(i, n ? s.slice(0, -11) : s, n ? Ni : "") : e[i] = s;
      }
    }
    return L;
  }
});
var U, j;
(function(a) {
  a.language = "language", a.system = "system", a.comma_decimal = "comma_decimal", a.decimal_comma = "decimal_comma", a.space_comma = "space_comma", a.none = "none";
})(U || (U = {})), (function(a) {
  a.language = "language", a.system = "system", a.am_pm = "12", a.twenty_four = "24";
})(j || (j = {}));
var Es = function(a) {
  if (a.time_format === j.language || a.time_format === j.system) {
    var t = a.time_format === j.language ? a.language : void 0, e = (/* @__PURE__ */ new Date()).toLocaleString(t);
    return e.includes("AM") || e.includes("PM");
  }
  return a.time_format === j.am_pm;
}, zs = function(a, t) {
  return Is(t).format(a);
}, Is = function(a) {
  return new Intl.DateTimeFormat(a.language, { hour: "numeric", minute: "2-digit", hour12: Es(a) });
};
function Ui() {
  return (Ui = Object.assign || function(a) {
    for (var t = 1; t < arguments.length; t++) {
      var e = arguments[t];
      for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (a[i] = e[i]);
    }
    return a;
  }).apply(this, arguments);
}
function Ls(a) {
  return a.substr(0, a.indexOf("."));
}
var Rs = function(a) {
  switch (a.number_format) {
    case U.comma_decimal:
      return ["en-US", "en"];
    case U.decimal_comma:
      return ["de", "es", "it"];
    case U.space_comma:
      return ["fr", "sv", "cs"];
    case U.system:
      return;
    default:
      return a.language;
  }
}, Vs = function(a, t) {
  return t === void 0 && (t = 2), Math.round(a * Math.pow(10, t)) / Math.pow(10, t);
}, Oi = function(a, t, e) {
  var i = t ? Rs(t) : void 0;
  if (Number.isNaN = Number.isNaN || function s(n) {
    return typeof n == "number" && s(n);
  }, (t == null ? void 0 : t.number_format) !== U.none && !Number.isNaN(Number(a)) && Intl) try {
    return new Intl.NumberFormat(i, ii(a, e)).format(Number(a));
  } catch (s) {
    return console.error(s), new Intl.NumberFormat(void 0, ii(a, e)).format(Number(a));
  }
  return typeof a == "string" ? a : Vs(a, e == null ? void 0 : e.maximumFractionDigits).toString() + ((e == null ? void 0 : e.style) === "currency" ? " " + e.currency : "");
}, ii = function(a, t) {
  var e = Ui({ maximumFractionDigits: 2 }, t);
  if (typeof a != "string") return e;
  if (!t || !t.minimumFractionDigits && !t.maximumFractionDigits) {
    var i = a.indexOf(".") > -1 ? a.split(".")[1].length : 0;
    e.minimumFractionDigits = i, e.maximumFractionDigits = i;
  }
  return e;
}, Ms = ["closed", "locked", "off"], S = function(a, t, e, i) {
  i = i || {}, e = e ?? {};
  var s = new Event(t, { bubbles: i.bubbles === void 0 || i.bubbles, cancelable: !!i.cancelable, composed: i.composed === void 0 || i.composed });
  return s.detail = e, a.dispatchEvent(s), s;
}, ut = function(a) {
  S(window, "haptic", a);
}, Ds = function(a, t, e) {
  e === void 0 && (e = !1), e ? history.replaceState(null, "", t) : history.pushState(null, "", t), S(window, "location-changed", { replace: e });
}, Ps = function(a, t, e) {
  e === void 0 && (e = !0);
  var i, s = Ls(t), n = s === "group" ? "homeassistant" : s;
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
  return a.callService(n, i, { entity_id: t });
}, Ns = function(a, t) {
  var e = Ms.includes(a.states[t].state);
  return Ps(a, t, e);
}, z = function(a, t, e, i) {
  if (i || (i = { action: "more-info" }), !i.confirmation || i.confirmation.exemptions && i.confirmation.exemptions.some(function(n) {
    return n.user === t.user.id;
  }) || (ut("warning"), confirm(i.confirmation.text || "Are you sure you want to " + i.action + "?"))) switch (i.action) {
    case "more-info":
      (e.entity || e.camera_image) && S(a, "hass-more-info", { entityId: e.entity ? e.entity : e.camera_image });
      break;
    case "navigate":
      i.navigation_path && Ds(0, i.navigation_path);
      break;
    case "url":
      i.url_path && window.open(i.url_path);
      break;
    case "toggle":
      e.entity && (Ns(t, e.entity), ut("success"));
      break;
    case "call-service":
      if (!i.service) return void ut("failure");
      var s = i.service.split(".", 2);
      t.callService(s[0], s[1], i.service_data, i.target), ut("success");
      break;
    case "fire-dom-event":
      S(a, "ll-custom", i);
  }
};
const kt = class kt extends x {
  constructor() {
    super(...arguments), this.label = "", this.fieldName = "template", this.value = "", this._computeLabel = (t) => t.name === this.fieldName ? this.label : t.name;
  }
  render() {
    return this.hass && customElements.get("ha-form") ? d`
        <ha-form
          class="template-form"
          .hass=${this.hass}
          .data=${{ [this.fieldName]: this.value }}
          .schema=${this._schema}
          .computeLabel=${this._computeLabel}
          @value-changed=${this._handleFormChange}
        ></ha-form>
      ` : customElements.get("ha-selector-template") && this.hass ? d`
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
      ` : d`
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
kt.properties = {
  hass: { attribute: !1 },
  label: { type: String },
  fieldName: { type: String },
  value: { type: String }
}, kt.styles = _`
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
let _e = kt;
customElements.define("ha-cards-jinja-editor", _e);
const Be = class Be extends x {
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
      return s.length === 0 ? !1 : s.some((n) => {
        var o, r;
        return ((o = e.states) == null ? void 0 : o[n]) !== ((r = i.states) == null ? void 0 : r[n]);
      });
    }
    return !1;
  }
  /**
   * For cards that do not read entity state: re-render on config and declared
   * reactive state, but only treat the first `hass` arrival as significant.
   */
  shouldUpdateNonEntityCard(t, e = []) {
    return t.has("config") || e.some((i) => t.has(i)) ? !0 : t.has("hass") ? !t.get("hass") && !!this.hass : !1;
  }
};
Be.properties = {
  hass: { attribute: !1 },
  config: { attribute: !1 }
};
let R = Be;
function I(a) {
  const { hass: t, label: e, value: i, domains: s, disabled: n = !1, onValueChanged: o } = a;
  return s.length ? d`
    <div class="field">
      <ha-entity-picker
        .hass=${t}
        .label=${e}
        .value=${i}
        .includeDomains=${s}
        ?disabled=${n}
        allow-custom-entity
        @value-changed=${(r) => o(r.detail.value)}
      ></ha-entity-picker>
    </div>
  ` : d`
      <div class="field">
        <ha-entity-picker
          .hass=${t}
          .label=${e}
          .value=${i}
          ?disabled=${n}
          allow-custom-entity
          @value-changed=${(r) => o(r.detail.value)}
        ></ha-entity-picker>
      </div>
    `;
}
function we(a) {
  const { hass: t, label: e, fieldName: i, value: s, onValueChanged: n } = a;
  return d`
    <ha-cards-jinja-editor
      .hass=${t}
      .label=${e}
      .fieldName=${i}
      .value=${s}
      @value-changed=${(o) => n(o.detail.value ?? "")}
    ></ha-cards-jinja-editor>
  `;
}
function F(a) {
  const { label: t, value: e, placeholder: i = "", onInput: s } = a;
  return d`
    <label>
      <span>${t}</span>
      <input .value=${e} placeholder=${i} @input=${(n) => s(n.target.value)} />
    </label>
  `;
}
function vt(a) {
  const { hass: t, label: e, value: i, fallback: s, onValueChanged: n } = a;
  return d`
    <div class="field">
      <ha-icon-picker
        .hass=${t}
        .label=${e}
        .value=${i || s}
        @value-changed=${(o) => n(o.detail.value)}
      ></ha-icon-picker>
    </div>
  `;
}
function pt(a) {
  const { label: t, value: e, placeholder: i, onInput: s } = a;
  return d`
    <label>
      <span>${t}</span>
      <input .value=${e} placeholder=${i} @input=${(n) => s(n.target.value)} />
    </label>
  `;
}
function Us(a) {
  const { actionConfig: t, formatJson: e, onActionValueChanged: i, onServiceDataChanged: s, serviceDataError: n } = a;
  switch (t.action) {
    case "more-info":
      return pt({
        label: "Entity override",
        value: String(t.entity || ""),
        placeholder: "Optional entity",
        onInput: (o) => i("entity", o)
      });
    case "navigate":
      return pt({
        label: "Navigation path",
        value: String(t.navigation_path || ""),
        placeholder: "/lovelace/0",
        onInput: (o) => i("navigation_path", o)
      });
    case "url":
      return pt({
        label: "URL path",
        value: String(t.url_path || ""),
        placeholder: "https://example.com",
        onInput: (o) => i("url_path", o)
      });
    case "call-service":
      return d`
        ${pt({
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
        ${n ? d`<div class="error">${n}</div>` : ""}
      `;
    default:
      return "";
  }
}
function Os(a) {
  const { label: t, actionConfig: e, actionOptions: i, onActionTypeChanged: s, fields: n, className: o } = a, r = e.action;
  return d`
    <fieldset class=${o || ""}>
      <legend>${t}</legend>

      <label>
        <span>Action</span>
        <select
          .value=${r}
          @change=${(l) => s(l.target.value)}
        >
          ${i.map(
    (l) => d` <option value=${l.value} ?selected=${l.value === r}>${l.label}</option> `
  )}
        </select>
      </label>

      ${n}
    </fieldset>
  `;
}
function xe(a) {
  const {
    label: t,
    actionConfig: e,
    actionOptions: i,
    onActionTypeChanged: s,
    onActionValueChanged: n,
    onServiceDataChanged: o,
    formatJson: r,
    serviceDataError: l,
    className: c
  } = a;
  return Os({
    label: t,
    className: c,
    actionConfig: e,
    actionOptions: i,
    onActionTypeChanged: s,
    fields: Us({
      actionConfig: e,
      formatJson: r,
      onActionValueChanged: n,
      onServiceDataChanged: o,
      serviceDataError: l
    })
  });
}
function Ue(a) {
  const { label: t, checked: e, disabled: i = !1, onChange: s } = a;
  return d`
    <label class="checkbox">
      <input
        type="checkbox"
        .checked=${e}
        ?disabled=${i}
        @change=${(n) => s(n.target.checked)}
      />
      <span>${t}</span>
    </label>
  `;
}
function Hi(a, t, e, i) {
  const s = Number(a);
  return Number.isFinite(s) ? Math.min(Math.max(Math.round(s), e), i) : t;
}
function Ot(a, t) {
  return /^#[0-9a-f]{6}$/i.test(a) ? a : t;
}
function Hs(a) {
  const {
    hass: t,
    label: e,
    value: i,
    pipelines: s,
    loading: n = !1,
    error: o = "",
    preferredLabel: r = "Preferred pipeline",
    onChange: l
  } = a;
  return d`
    <label>
      <span>${e}</span>
      <select
        .value=${i}
        ?disabled=${n || !t}
        @change=${(c) => l(c.target.value)}
      >
        <option value="preferred">${r}</option>
        ${s.map(
    (c) => d`
            <option value=${c.id} ?selected=${c.id === i}>${c.name}</option>
          `
  )}
      </select>
      ${o ? d`<small>${o}</small>` : ""}
    </label>
  `;
}
const Fs = _`
  .editor {
    display: grid;
    gap: 16px;
  }

  .grid,
  fieldset {
    display: grid;
    gap: 12px;
  }

  fieldset {
    border: 1px solid var(--divider-color, #ddd);
    border-radius: 12px;
    margin: 0;
    padding: 12px;
  }

  legend {
    color: var(--secondary-text-color);
    font-size: 12px;
    font-weight: 700;
    padding: 0 6px;
  }

  label {
    color: var(--primary-text-color);
    display: grid;
    gap: 6px;
    font-size: 12px;
    font-weight: 600;
  }

  input,
  select,
  textarea {
    background: var(--card-background-color, #fff);
    border: 1px solid var(--divider-color, #ddd);
    border-radius: 10px;
    box-sizing: border-box;
    color: var(--primary-text-color);
    font: inherit;
    min-height: 40px;
    padding: 8px 10px;
  }

  .checkbox {
    align-items: center;
    display: flex;
    flex-direction: row;
    gap: 10px;
  }

  .checkbox input {
    min-height: auto;
    width: auto;
  }

  .hint {
    color: var(--secondary-text-color);
    font-size: 11px;
    font-weight: 400;
    line-height: 1.45;
    margin: 0;
  }
`, Bs = [
  { value: "more-info", label: "More info" },
  { value: "toggle", label: "Toggle" },
  { value: "navigate", label: "Navigate" },
  { value: "url", label: "URL" },
  { value: "call-service", label: "Call service" },
  { value: "fire-dom-event", label: "Fire DOM event" },
  { value: "none", label: "None" }
], Tt = class Tt extends x {
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
    return d`
      <div class="editor">
        <div class="grid">
          ${F({
      label: "Name",
      value: String(this.config.name || ""),
      placeholder: "Living room",
      onInput: (t) => this.updateConfigValue("name", t)
    })}
          ${I({
      hass: this.hass,
      label: "Light entity",
      value: String(this.config.entity || ""),
      domains: ["light"],
      onValueChanged: (t) => this.updateConfigValue("entity", t)
    })}
          ${vt({
      hass: this.hass,
      label: "Icon",
      value: String(this.config.icon || ""),
      fallback: "mdi:sofa",
      onValueChanged: (t) => this.updateConfigValue("icon", t)
    })}
          ${I({
      hass: this.hass,
      label: "Sensor 1 entity",
      value: String(this.config.sensor1_entity || ""),
      domains: ["sensor"],
      onValueChanged: (t) => this.updateConfigValue("sensor1_entity", t)
    })}
          ${vt({
      hass: this.hass,
      label: "Sensor 1 icon",
      value: String(this.config.sensor1_icon || ""),
      fallback: "mdi:thermometer",
      onValueChanged: (t) => this.updateConfigValue("sensor1_icon", t)
    })}
          ${I({
      hass: this.hass,
      label: "Sensor 2 entity",
      value: String(this.config.sensor2_entity || ""),
      domains: ["sensor"],
      onValueChanged: (t) => this.updateConfigValue("sensor2_entity", t)
    })}
          ${vt({
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
    return xe({
      label: t,
      actionConfig: i,
      actionOptions: Bs,
      onActionTypeChanged: (s) => this.updateActionType(e, s),
      onActionValueChanged: (s, n) => this.updateActionValue(e, s, n),
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
Tt.properties = {
  hass: { attribute: !1 },
  config: { attribute: !1 }
}, Tt.styles = _`
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
let $e = Tt;
customElements.define("room-card-editor", $e);
const gt = { action: "more-info" }, Zt = { action: "toggle" }, Qt = { action: "more-info" }, te = "mdi:thermometer", ee = "mdi:water-percent", We = class We extends R {
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
      sensor1_icon: te,
      sensor2_icon: ee,
      tap_action: gt,
      light_tap_action: Zt,
      light_hold_action: Qt
    };
  }
  setConfig(t) {
    if (!t.entity)
      throw new Error("Room Card requires a light entity");
    this.config = {
      icon: "mdi:sofa",
      sensor1_icon: te,
      sensor2_icon: ee,
      tap_action: gt,
      light_tap_action: Zt,
      light_hold_action: Qt,
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
    const t = this.getLightEntity(), e = this.isLightOff(t), i = this.config.name || ((r = t == null ? void 0 : t.attributes) == null ? void 0 : r.friendly_name) || "Room", s = this.getLightRgb(t), n = !!(this.config.sensor1_entity || this.config.sensor2_entity), o = s ? {
      "--room-light-rgb": s.join(",")
    } : {};
    return d`
      <ha-card class=${e ? "light-off" : ""} style=${J(o)} @click=${this.handleCardTap}>
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
            ${n ? d`
                  <div class="sensors">
                    ${this.config.sensor1_entity ? this.renderSensor(
      this.config.sensor1_icon || te,
      this.config.sensor1_entity
    ) : ""}
                    ${this.config.sensor2_entity ? this.renderSensor(
      this.config.sensor2_icon || ee,
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
    var n, o;
    const i = e ? (o = (n = this.hass) == null ? void 0 : n.states) == null ? void 0 : o[e] : void 0, s = i ? this.formatEntityState(i) : "-";
    return d`
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
    return t.trim() === "" || !Number.isFinite(e) ? t : Oi(e, (i = this.hass) == null ? void 0 : i.locale, { maximumFractionDigits: 2 });
  }
  getLightEntity() {
    var t, e;
    return (e = (t = this.hass) == null ? void 0 : t.states) == null ? void 0 : e[this.config.entity];
  }
  isLightOff(t) {
    return !t || t.state === "off" || t.state === "unavailable";
  }
  getLightRgb(t) {
    var s, n;
    if (this.isLightOff(t))
      return;
    const e = (s = t.attributes) == null ? void 0 : s.rgb_color;
    if (Array.isArray(e) && e.length >= 3)
      return [Number(e[0]), Number(e[1]), Number(e[2])];
    const i = (n = t.attributes) == null ? void 0 : n.hs_color;
    if (Array.isArray(i) && i.length >= 2)
      return this.hslToRgb(Number(i[0]), Number(i[1]), 50);
  }
  hslToRgb(t, e, i) {
    const s = e / 100, n = i / 100, o = (1 - Math.abs(2 * n - 1)) * s, r = t / 60, l = o * (1 - Math.abs(r % 2 - 1)), c = n - o / 2;
    let p = [0, 0, 0];
    return r >= 0 && r < 1 ? p = [o, l, 0] : r < 2 ? p = [l, o, 0] : r < 3 ? p = [0, o, l] : r < 4 ? p = [0, l, o] : r < 5 ? p = [l, 0, o] : p = [o, 0, l], p.map((u) => Math.round((u + c) * 255));
  }
  handleCardTap(t) {
    t.target.closest(".light-button") || this.runAction(this.config.tap_action || gt);
  }
  handleCardKeydown(t) {
    t.key !== "Enter" && t.key !== " " || (t.preventDefault(), this.runAction(this.config.tap_action || gt));
  }
  handleLightTap(t) {
    if (t.stopPropagation(), this.lightHoldTriggered) {
      this.lightHoldTriggered = !1;
      return;
    }
    this.cancelLightHold(), this.runAction(this.config.light_tap_action || Zt);
  }
  handleLightPointerDown(t) {
    t.stopPropagation(), this.lightHoldTriggered = !1, this.cancelLightHold(), this.holdTimer = window.setTimeout(() => {
      this.lightHoldTriggered = !0, this.runAction(this.config.light_hold_action || Qt);
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
    z(
      this,
      this.hass,
      {
        entity: this.config.entity
      },
      t
    );
  }
};
We.styles = _`
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
let Se = We;
customElements.define("room-card", Se);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "room-card",
  name: "Room Card",
  description: "Room card with light actions and sensors"
});
const Ht = "#324c64", Ws = {
  equals: "is",
  not_equals: "is not",
  gt: ">",
  lt: "<",
  lte: "<=",
  gte: ">=",
  contains: "contains",
  not_contains: "does not contain"
};
function js(a, t) {
  var s;
  const e = a.check.operator === "not_contains" ? a.check.values.join(", ") : a.matchedValue || a.check.values.join(", "), i = String(((s = a.entity.attributes) == null ? void 0 : s.unit_of_measurement) || "");
  return {
    entity: a.check.entity,
    entity_id: a.check.entity,
    name: t(a.check.entity, a.entity),
    state: a.entity.state,
    matched: e,
    matched_value: e,
    operator: a.check.operator,
    operator_label: Ws[a.check.operator],
    unit: i,
    unit_of_measurement: i,
    values: a.check.values.join(", "),
    attributes: a.entity.attributes
  };
}
const Et = class Et extends x {
  constructor() {
    super(...arguments), this.template = "", this.variables = {}, this.entityIds = [], this.fallback = "", this.multiline = !1, this._rendered = "", this._lines = [];
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
    return this.multiline ? d`` : d`<span>${this._rendered || this.fallback}</span>`;
  }
  _parseLines(t) {
    return t.split(`
`).map((e) => e.trim()).filter(Boolean);
  }
  _dispatchLines(t) {
    const e = this._parseLines(t);
    e.join(`
`) !== this._lines.join(`
`) && (this._lines = e, this.dispatchEvent(
      new CustomEvent("lines-changed", {
        detail: { lines: e },
        bubbles: !0,
        composed: !0
      })
    ));
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
      this._rendered = "", this.multiline && this._dispatchLines(this.fallback || "");
      return;
    }
    try {
      this._unsubRenderTemplate = this.hass.connection.subscribeMessage(
        (e) => {
          if ("error" in e)
            this._rendered = this.fallback, this.multiline && this._dispatchLines(this.fallback);
          else {
            const i = this._formatResult(e.result);
            this._rendered = i, this.multiline && this._dispatchLines(i);
          }
          this.requestUpdate();
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
      this._rendered = this.fallback, this.multiline && this._dispatchLines(this.fallback), this._unsubRenderTemplate = void 0, this.requestUpdate();
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
Et.properties = {
  hass: { attribute: !1 },
  template: { type: String },
  variables: { attribute: !1 },
  entityIds: { attribute: !1 },
  fallback: { type: String },
  multiline: { type: Boolean }
}, Et.styles = _`
    :host {
      display: inline;
    }
  `;
let Ae = Et;
customElements.define("ha-cards-template-text", Ae);
async function Fi() {
  if (customElements.get("ha-form") && customElements.get("ha-entity-picker"))
    return !0;
  let a = !1;
  return customElements.get("ha-form") || (a = await si("hui-tile-card", {
    type: "tile",
    entity: "sun.sun"
  }) || a), customElements.get("ha-entity-picker") || (a = await si("hui-entities-card", {
    type: "entities",
    entities: []
  }) || a), a || !!customElements.get("ha-form");
}
async function si(a, t) {
  let e = customElements.get(a);
  if (typeof (e == null ? void 0 : e.getConfigElement) != "function") {
    const i = window.loadCardHelpers;
    if (!i)
      return !1;
    try {
      await (await i()).createCardElement(t), e = customElements.get(a);
    } catch {
      return !1;
    }
  }
  return typeof (e == null ? void 0 : e.getConfigElement) == "function" ? (await e.getConfigElement(), !0) : !1;
}
const ai = "Possible Issues", ni = Ht, oi = ["sensor", "light", "switch"], qs = ["unavailable"], Ks = ["unavailable", "unknown", "none"], ri = "none", Gs = [
  { value: "equals", label: "Equals" },
  { value: "not_equals", label: "Does not equal" },
  { value: "gt", label: "Greater than (>)" },
  { value: "lt", label: "Less than (<)" },
  { value: "lte", label: "Less than or equal (<=)" },
  { value: "gte", label: "Greater than or equal (>=)" },
  { value: "contains", label: "Contains" },
  { value: "not_contains", label: "Does not contain" }
], zt = class zt extends x {
  constructor() {
    super(...arguments), this.config = {}, this.integrationOptions = [], this.integrationsLoading = !1, this.integrationsVersion = 0, this.haComponentsVersion = 0;
  }
  connectedCallback() {
    super.connectedCallback(), this.loadHomeAssistantPickers();
  }
  setConfig(t) {
    this.config = {
      title: ai,
      background_color: ni,
      domains: oi,
      issue_states: qs,
      included_entities: [],
      ignored_entities: [],
      ignored_devices: [],
      ignored_integrations: [],
      ignored_name_patterns: [],
      row_detail: ri,
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
    return d`
      <div class="editor">
        <div class="grid">
          ${F({
      label: "Title",
      value: String(this.config.title || ""),
      placeholder: ai,
      onInput: (t) => this.updateConfigValue("title", t)
    })}
          ${this.renderColorInput("Background color", "background_color", ni)}
          ${this.renderListField("Domains", "domains", oi, "sensor, light, switch")}
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
    return F({
      label: t,
      value: this.formatList(this.config[e], i),
      placeholder: s,
      onInput: (n) => this.updateListValue(e, n)
    });
  }
  renderColorInput(t, e, i) {
    const s = Ot(String(this.config[e] || i), i);
    return d`
      <label>
        <span>${t}</span>
        <input
          type="color"
          .value=${s}
          @input=${(n) => this.updateConfigValue(e, n.target.value)}
        />
      </label>
    `;
  }
  renderIssueStatesField() {
    const t = this.parseConfigList(this.config.issue_states), e = new Set(t), i = Ks.filter((s) => !e.has(s));
    return d`
      <div class="field-group">
        <label>
          <span>Issue states</span>
          <select ?disabled=${i.length === 0} @change=${(s) => this.handleIssueStateSelected(s)}>
            <option value="">${i.length ? "Add state" : "All common states selected"}</option>
            ${i.map((s) => d`<option value=${s}>${s}</option>`)}
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

        ${t.length ? d`
              <div class="chips" aria-label="Issue states">
                ${t.map(
      (s) => d`
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
    return d`
      <div class="field-group">
        <div class="section-header">
          <span>Entity value checks</span>
          <button type="button" @click=${() => this.addValueCheck()}>Add check</button>
        </div>

        ${t.length ? t.map(
      (e, i) => d`
                <div class="value-check">
                  ${I({
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
                      ${Gs.map(
        (s) => d`
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
    ) : d`<p class="hint">Add checks to show an entity when its state matches one or more configured values.</p>`}
      </div>
    `;
  }
  renderIgnoredIntegrationsField() {
    const t = this.parseConfigList(this.config.ignored_integrations), e = new Set(t), i = this.integrationOptions.filter((n) => !e.has(n)), s = this.integrationsLoading || i.length === 0;
    return d`
      <label>
        <span>Ignored integrations</span>
        <select ?disabled=${s} @change=${(n) => this.handleIgnoredIntegrationSelected(n)}>
          <option value="">
            ${this.integrationsLoading ? "Loading integrations..." : i.length ? "Add integration" : "No integrations available"}
          </option>
          ${i.map((n) => d`<option value=${n}>${this.formatIntegrationName(n)}</option>`)}
        </select>
      </label>
      ${t.length ? d`
            <div class="chips" aria-label="Ignored integrations">
              ${t.map(
      (n) => d`
                  <button class="chip" type="button" @click=${() => this.removeIgnoredIntegration(n)}>
                    ${this.formatIntegrationName(n)}
                    <span aria-hidden="true">x</span>
                  </button>
                `
    )}
            </div>
          ` : ""}
    `;
  }
  renderRowDetailField() {
    const t = this.config.row_detail || ri;
    return d`
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
    this.config = t, S(this, "config-changed", { config: t });
  }
  async loadHomeAssistantPickers() {
    try {
      await Fi() && (this.haComponentsVersion += 1);
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
zt.properties = {
  hass: { attribute: !1 },
  config: { attribute: !1 },
  integrationsVersion: { state: !0 },
  haComponentsVersion: { state: !0 }
}, zt.styles = _`
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
let Ce = zt;
customElements.define("possible-issues-card-editor", Ce);
const ie = "Possible Issues", se = Ht, Z = ["sensor", "light", "switch"], ft = ["unavailable"], ae = "none", It = class It extends R {
  constructor() {
    super(...arguments), this.entityRegistry = [], this.deviceRegistry = [], this.registryLoading = !1, this.registryError = !1, this.registryVersion = 0;
  }
  static getConfigElement() {
    return document.createElement("possible-issues-card-editor");
  }
  static getStubConfig() {
    return {
      title: ie,
      background_color: se,
      domains: Z,
      issue_states: ft,
      included_entities: [],
      ignored_entities: [],
      ignored_devices: [],
      ignored_integrations: [],
      ignored_name_patterns: [],
      row_detail: ae,
      value_checks: []
    };
  }
  setConfig(t) {
    this.config = {
      title: ie,
      background_color: se,
      domains: Z,
      issue_states: ft,
      included_entities: [],
      ignored_entities: [],
      ignored_devices: [],
      ignored_integrations: [],
      ignored_name_patterns: [],
      row_detail: ae,
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
        var n, o;
        return ((n = e.states) == null ? void 0 : n[s]) !== ((o = this.hass.states) == null ? void 0 : o[s]);
      }) : !1 : !0;
    }
    return !1;
  }
  updated(t) {
    t.has("hass") && this.loadRegistries();
  }
  render() {
    const t = this.getIssueDevices(), e = [...this.getStateIssueEntities(), ...this.getValueCheckIssues()], i = {
      "--possible-issues-card-background": this.config.background_color || se
    };
    return !t.length && !e.length ? d`` : d`
      <ha-card style=${J(i)}>
        <div class="card">
          <h2>${this.config.title || ie}</h2>
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
    return d`
      <button class="device-row" type="button" @click=${() => this.openIssueDevice(t)}>
        <ha-icon .icon=${i}></ha-icon>
        <span class="row-text">
          <span class="name">${e}</span>
          ${s ? d`<span class="detail">${s}</span>` : ""}
        </span>
      </button>
    `;
  }
  renderEntityRow(t) {
    var l, c, p;
    const e = t.entityId, i = this.isValueCheckIssue(t), s = this.getEntityName(e, t.entity), n = i ? this.getValueCheckDetail(t) : this.getStateIssueDetail(t), o = i ? js(t, (u, h) => this.getEntityName(u, h)) : void 0, r = ((l = t.entity.attributes) == null ? void 0 : l.icon) || ((c = t.registryEntry) == null ? void 0 : c.icon) || ((p = t.registryEntry) == null ? void 0 : p.original_icon) || "mdi:alert-circle-outline";
    return d`
      <button class="device-row" type="button" @click=${() => this.openIssueEntity(t)}>
        <ha-icon .icon=${r}></ha-icon>
        <span class="row-text">
          <span class="name">
            ${i && t.check.message ? d`<ha-cards-template-text
                  .hass=${this.hass}
                  .template=${t.check.message}
                  .variables=${o}
                  .entityIds=${[t.check.entity]}
                  .fallback=${s}
                ></ha-cards-template-text>` : s}
          </span>
          <span class="detail">
            ${i && t.check.submessage ? d`<ha-cards-template-text
                  .hass=${this.hass}
                  .template=${t.check.submessage}
                  .variables=${o}
                  .entityIds=${[t.check.entity]}
                  .fallback=${n}
                ></ha-cards-template-text>` : n}
          </span>
        </span>
      </button>
    `;
  }
  getIssueDevices() {
    var p;
    if (this.registryError || !this.entityRegistry.length || !this.deviceRegistry.length || !this.hass)
      return [];
    const t = new Set(this.normalizeList(this.config.domains, Z)), e = new Set(this.normalizeList(this.config.issue_states, ft)), i = this.normalizeList(this.config.included_entities), s = this.normalizeList(this.config.ignored_entities), n = this.normalizeList(this.config.ignored_devices), o = new Set(
      this.normalizeList(this.config.ignored_integrations).map((u) => u.toLowerCase())
    ), r = this.normalizeList(this.config.ignored_name_patterns), l = new Map(this.deviceRegistry.map((u) => [u.id, u])), c = /* @__PURE__ */ new Map();
    for (const u of this.entityRegistry) {
      const h = this.hass.states[u.entity_id], g = u.device_id || "", f = l.get(g);
      if (!h || !f || !t.has(this.getDomain(u.entity_id)) || !e.has(h.state) || u.platform && o.has(u.platform.toLowerCase()) || i.length && !this.matchesPattern(u.entity_id, i) || this.matchesPattern(u.entity_id, s) || this.matchesPattern(g, n))
        continue;
      const m = [this.getDeviceName(f), (p = h.attributes) == null ? void 0 : p.friendly_name, u.name, u.original_name].filter(Boolean).join(" ");
      this.matchesPattern(m, r) || c.set(g, [...c.get(g) || [], u]);
    }
    return [...c.entries()].map(([u, h]) => ({
      device: l.get(u),
      entities: h
    })).sort((u, h) => this.getDeviceName(u.device).localeCompare(this.getDeviceName(h.device)));
  }
  getStateIssueEntities() {
    if (!this.hass || !this.registryError && !this.registryVersion)
      return [];
    const t = new Set(this.normalizeList(this.config.domains, Z)), e = new Set(this.normalizeList(this.config.issue_states, ft)), i = this.normalizeList(this.config.included_entities), s = this.normalizeList(this.config.ignored_entities), n = this.normalizeList(this.config.ignored_devices), o = new Set(
      this.normalizeList(this.config.ignored_integrations).map((h) => h.toLowerCase())
    ), r = this.normalizeList(this.config.ignored_name_patterns), l = new Map(this.deviceRegistry.map((h) => [h.id, h])), c = new Set(this.entityRegistry.map((h) => h.entity_id)), p = this.entityRegistry.map((h) => {
      var v;
      const g = this.hass.states[h.entity_id], f = h.device_id || "", m = l.get(f);
      if (!g || m || !t.has(this.getDomain(h.entity_id)) || !e.has(g.state) || h.platform && o.has(h.platform.toLowerCase()) || i.length && !this.matchesPattern(h.entity_id, i) || this.matchesPattern(h.entity_id, s) || this.matchesPattern(f, n))
        return;
      const b = [(v = g.attributes) == null ? void 0 : v.friendly_name, h.name, h.original_name].filter(Boolean).join(" ");
      if (!this.matchesPattern(b, r))
        return {
          entityId: h.entity_id,
          entity: g,
          issueState: g.state,
          registryEntry: h
        };
    }).filter((h) => !!h), u = Object.entries(this.hass.states || {}).map(([h, g]) => {
      var m;
      if (c.has(h) || !t.has(this.getDomain(h)) || !e.has(g.state) || i.length && !this.matchesPattern(h, i) || this.matchesPattern(h, s))
        return;
      const f = [(m = g.attributes) == null ? void 0 : m.friendly_name].filter(Boolean).join(" ");
      if (!this.matchesPattern(f, r))
        return {
          entityId: h,
          entity: g,
          issueState: g.state
        };
    }).filter((h) => !!h);
    return [...p, ...u].sort(
      (h, g) => this.getEntityName(h.entityId, h.entity).localeCompare(this.getEntityName(g.entityId, g.entity))
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
    var s, n;
    const e = new Set(this.normalizeList((s = this.config) == null ? void 0 : s.domains, Z)), i = this.normalizeList((n = this.config) == null ? void 0 : n.included_entities);
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
    var i, s, n;
    const e = t ? (s = (i = this.hass) == null ? void 0 : i.states) == null ? void 0 : s[t.entity_id] : void 0;
    return ((n = e == null ? void 0 : e.attributes) == null ? void 0 : n.icon) || (t == null ? void 0 : t.icon) || (t == null ? void 0 : t.original_icon) || "mdi:devices";
  }
  getRowDetail(t) {
    const e = this.config.row_detail || ae;
    if (e === "count") {
      const i = t.entities.length;
      return `${i} unavailable ${i === 1 ? "entity" : "entities"}`;
    }
    return e === "entities" ? t.entities.map((i) => {
      var n;
      const s = this.hass.states[i.entity_id];
      return ((n = s == null ? void 0 : s.attributes) == null ? void 0 : n.friendly_name) || i.name || i.original_name || i.entity_id;
    }).join(", ") : "";
  }
  getStateIssueDetail(t) {
    return `State is ${t.issueState}`;
  }
  getValueCheckDetail(t) {
    var r;
    const e = this.getOperatorLabel(t.check.operator), i = ((r = t.entity.attributes) == null ? void 0 : r.unit_of_measurement) || "", s = t.check.operator === "not_contains" ? t.check.values.join(", ") : t.matchedValue || t.check.values.join(", "), n = `${t.entity.state} ${i ? `${i}` : ""}`, o = `${s} ${i ? `${i}` : ""}`;
    return `${n} ${e} ${o}`;
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
    z(
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
    z(
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
      z(
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
    const s = Number(t), n = Number(e);
    if (!Number.isFinite(s) || !Number.isFinite(n))
      return !1;
    switch (i) {
      case "gt":
        return s > n;
      case "lt":
        return s < n;
      case "lte":
        return s <= n;
      case "gte":
        return s >= n;
      default:
        return !1;
    }
  }
  normalizeList(t, e = []) {
    const i = t == null || t === "" ? e : t;
    return (Array.isArray(i) ? i : String(i).split(",")).map((n) => String(n).trim()).filter(Boolean);
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
It.properties = {
  hass: { attribute: !1 },
  config: { attribute: !1 },
  registryVersion: { state: !0 }
}, It.styles = _`
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
let ke = It;
customElements.define("possible-issues-card", ke);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "possible-issues-card",
  name: "Possible Issues Card",
  description: "Lists devices with unavailable entities and entities matching configurable value checks"
});
const li = "/config/dashboard", Js = [
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
], ci = [
  { value: "more-info", label: "More info" },
  { value: "toggle", label: "Toggle" },
  { value: "navigate", label: "Navigate" },
  { value: "url", label: "URL" },
  { value: "call-service", label: "Call service" },
  { value: "fire-dom-event", label: "Fire DOM event" },
  { value: "none", label: "None" }
], Lt = class Lt extends x {
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
      settings_navigation_path: li,
      tabs: Js,
      ...t
    };
  }
  shouldUpdate(t) {
    return t.has("config") ? !0 : t.has("hass") ? !t.get("hass") && !!this.hass : !1;
  }
  render() {
    return d`
      <div class="editor">
        <div class="grid">
          ${I({
      hass: this.hass,
      label: "Weather entity",
      value: String(this.config.weather_entity || ""),
      domains: ["weather"],
      onValueChanged: (t) => this.updateConfigValue("weather_entity", t)
    })}
          ${this.renderCheckbox("Show temperature", "show_temperature")}
          ${this.renderCheckbox("Use Home Assistant weather icons", "use_ha_weather_icons")}
          ${I({
      hass: this.hass,
      label: "Temperature entity override",
      value: String(this.config.temperature_entity || ""),
      domains: ["sensor"],
      disabled: !this.config.show_temperature,
      onValueChanged: (t) => this.updateConfigValue("temperature_entity", t)
    })}
          ${F({
      label: "Settings navigation path",
      value: String(this.config.settings_navigation_path || ""),
      placeholder: li,
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
    return d`
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
    return Ue({
      label: t,
      checked: !!this.config[e],
      onChange: (i) => this.updateConfigValue(e, i)
    });
  }
  renderTabIconPicker(t, e) {
    const i = this.getTab(t);
    return d`
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
    const n = this.getTab(t);
    return d`
      <label>
        <span>${i}</span>
        <input
          .value=${String(n[e] || "")}
          placeholder=${s}
          @input=${(o) => this.updateTabValue(t, e, o.target.value)}
        />
      </label>
    `;
  }
  renderTabActionEditor(t, e, i) {
    const s = this.getServiceDataErrorKey(e);
    return xe({
      label: t,
      className: "action-editor",
      actionConfig: i,
      actionOptions: ci,
      onActionTypeChanged: (n) => this.updateTabActionType(e, n),
      onActionValueChanged: (n, o) => this.updateTabActionValue(e, n, o),
      onServiceDataChanged: (n) => this.updateServiceData(e, n),
      formatJson: (n) => this.formatJson(n),
      serviceDataError: this.serviceDataErrors[s]
    });
  }
  renderWeatherActionEditor(t, e) {
    const i = this.getWeatherServiceDataErrorKey();
    return xe({
      label: t,
      className: "action-editor",
      actionConfig: e,
      actionOptions: ci,
      onActionTypeChanged: (s) => this.updateWeatherActionType(s),
      onActionValueChanged: (s, n) => this.updateWeatherActionValue(s, n),
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
      const n = JSON.parse(i);
      this.serviceDataErrors = { ...this.serviceDataErrors, [s]: void 0 }, this.updateTab(t, {
        ...this.getTab(t),
        tap_action: {
          ...this.getTab(t).tap_action || { action: "call-service" },
          service_data: n
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
Lt.properties = {
  hass: { attribute: !1 },
  config: { attribute: !1 }
}, Lt.styles = _`
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
let Te = Lt;
customElements.define("welcome-card-editor", Te);
const mt = "/config/dashboard", ne = { action: "more-info" }, Ys = { action: "none" }, Xs = "welcome-card:collapsed", di = [
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
], oe = {
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
}, Zs = {
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
}, Rt = class Rt extends R {
  constructor() {
    super(...arguments), this._collapsed = !1, this._now = /* @__PURE__ */ new Date();
  }
  static getConfigElement() {
    return document.createElement("welcome-card-editor");
  }
  static getStubConfig() {
    return {
      weather_entity: "",
      weather_tap_action: ne,
      show_temperature: !0,
      use_ha_weather_icons: !1,
      settings_navigation_path: mt,
      tabs: di
    };
  }
  setConfig(t) {
    this.config = {
      weather_tap_action: ne,
      show_temperature: !0,
      use_ha_weather_icons: !1,
      settings_navigation_path: mt,
      tabs: di,
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
    return d`
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
              ${this.config.show_temperature ? d`<span class="temperature">${this.formatTemperature()}</span>` : ""}
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
            ${!this._collapsed && t.length ? d`<div class="tabs">${t.map((e) => this.renderTab(e))}</div>` : ""}
          </div>
        </div>
      </ha-card>
    `;
  }
  renderTab(t) {
    const i = {
      "--tab-color": t.color || "var(--primary-color)"
    };
    return d`
      <button
        class="tab"
        style=${J(i)}
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
      ((i = this.config) == null ? void 0 : i.settings_navigation_path) || mt,
      (((s = this.config) == null ? void 0 : s.tabs) || []).map((n) => n.label || "").join("|")
    ];
    return `${Xs}${t.join(":")}`;
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
    z(
      this,
      this.hass,
      {},
      {
        action: "navigate",
        navigation_path: this.config.settings_navigation_path || mt
      }
    );
  }
  handleWeatherTap() {
    const t = this.config.weather_tap_action || ne, e = t.entity || this.config.weather_entity || this.config.temperature_entity;
    !e && t.action === "more-info" || z(this, this.hass, e ? { entity: e } : {}, t);
  }
  runTabAction(t) {
    z(this, this.hass, {}, t.tap_action || Ys);
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
    return t && Zs[t] || "mdi:weather-cloudy";
  }
  getWeatherEmoji() {
    var e;
    const t = (e = this.getWeatherEntity()) == null ? void 0 : e.state;
    return t && oe[t] || oe.default;
  }
  renderWeatherIcon() {
    return this.config.use_ha_weather_icons ? d`<ha-icon .icon=${this.getWeatherIcon()}></ha-icon>` : d`<span class="weather-emoji" aria-hidden="true">${this.getWeatherEmoji()}</span>`;
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
    var s, n, o, r, l, c;
    const t = this.getTemperatureEntity();
    if (t)
      return this.formatTemperatureValue(
        t.state,
        (s = t.attributes) == null ? void 0 : s.unit_of_measurement
      );
    const e = this.getWeatherEntity(), i = (n = e == null ? void 0 : e.attributes) == null ? void 0 : n.temperature;
    return i == null || i === "" ? "-" : this.formatTemperatureValue(
      i,
      ((o = e == null ? void 0 : e.attributes) == null ? void 0 : o.temperature_unit) || ((c = (l = (r = this.hass) == null ? void 0 : r.config) == null ? void 0 : l.unit_system) == null ? void 0 : c.temperature)
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
Rt.properties = {
  hass: { attribute: !1 },
  config: { attribute: !1 },
  _collapsed: { state: !0 },
  _now: { state: !0 }
}, Rt.styles = _`
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
let Ee = Rt;
customElements.define("welcome-card", Ee);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "welcome-card",
  name: "Welcome Card",
  description: "Greeting, weather/date pill, and quick-action tabs"
});
const hi = "mdi:thermostat", ui = "#fbb73c", pi = "#3a8dde", gi = "two_rows", Vt = class Vt extends x {
  constructor() {
    super(...arguments), this.config = {};
  }
  connectedCallback() {
    super.connectedCallback(), this.loadHomeAssistantPickers();
  }
  setConfig(t) {
    this.config = {
      icon: hi,
      compact: !1,
      show_controls: !0,
      show_modes: !1,
      show_presets: !1,
      show_fan_mode: !1,
      show_off_mode: !1,
      modes: [],
      presets: [],
      dual_setpoint_layout: gi,
      step_amount: void 0,
      heating_color: ui,
      cooling_color: pi,
      ...t
    };
  }
  shouldUpdate(t) {
    return t.has("config") ? !0 : t.has("hass") ? !t.get("hass") && !!this.hass : !1;
  }
  render() {
    var s, n;
    const t = this.getSelectedEntity(), e = this.asStringArray((s = t == null ? void 0 : t.attributes) == null ? void 0 : s.hvac_modes).filter((o) => o !== "off"), i = this.asStringArray((n = t == null ? void 0 : t.attributes) == null ? void 0 : n.preset_modes);
    return d`
      <div class="editor">
        <div class="grid">
          ${F({
      label: "Name",
      value: String(this.config.name || ""),
      placeholder: "Thermostat",
      onInput: (o) => this.updateConfigValue("name", o)
    })}
          ${I({
      hass: this.hass,
      label: "Climate entity",
      value: String(this.config.entity || ""),
      domains: ["climate"],
      onValueChanged: (o) => this.updateConfigValue("entity", o)
    })}
          ${vt({
      hass: this.hass,
      label: "Icon",
      value: String(this.config.icon || ""),
      fallback: hi,
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
          ${this.renderColorInput("Heating background", "heating_color", ui)}
          ${this.renderColorInput("Cooling background", "cooling_color", pi)}
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
    return d`
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
    return d`
      <label>
        <span>Dual setpoint layout</span>
        <select
          .value=${this.config.dual_setpoint_layout || gi}
          @change=${(e) => this.updateConfigValue("dual_setpoint_layout", e.target.value)}
        >
          ${t.map((e) => d`
            <option value=${e.value} ?selected=${e.value === this.config.dual_setpoint_layout}>
              ${e.label}
            </option>
          `)}
        </select>
      </label>
    `;
  }
  renderColorInput(t, e, i) {
    const s = Ot(String(this.config[e] || i), i);
    return d`
      <label>
        <span>${t}</span>
        <input
          type="color"
          .value=${s}
          @input=${(n) => this.updateConfigValue(e, n.target.value)}
        />
      </label>
    `;
  }
  renderNumberInput(t, e, i) {
    const s = this.config[e] === void 0 ? "" : String(this.config[e]);
    return d`
      <label>
        <span>${t}</span>
        <input
          type="number"
          min="0.1"
          step="0.1"
          .value=${s}
          placeholder=${i}
          @input=${(n) => this.updateNumberConfigValue(e, n.target.value)}
        />
      </label>
    `;
  }
  renderOptionList(t) {
    const { options: e, selected: i, emptyMessage: s, onChanged: n } = t;
    return e.length ? d`
      <div class="option-list">
        ${e.map((o) => {
      const r = i.includes(o);
      return d`
            <label class="checkbox-row">
              <input
                type="checkbox"
                .checked=${r}
                @change=${(l) => this.updateOptionList(e, i, o, l.target.checked, n)}
              />
              <span>${this.toLabel(o)}</span>
            </label>
          `;
    })}
      </div>
    ` : d`<div class="hint">${s}</div>`;
  }
  updateOptionList(t, e, i, s, n) {
    const o = s ? [...e, i] : e.filter((r) => r !== i);
    n(t.filter((r) => o.includes(r)));
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
    this.config = t, S(this, "config-changed", { config: t });
  }
  getSelectedEntity() {
    var e, i;
    const t = this.config.entity;
    return t ? (i = (e = this.hass) == null ? void 0 : e.states) == null ? void 0 : i[t] : void 0;
  }
  asStringArray(t) {
    return Array.isArray(t) ? t.filter((e) => typeof e == "string") : [];
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
Vt.properties = {
  hass: { attribute: !1 },
  config: { attribute: !1 }
}, Vt.styles = _`
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
let ze = Vt;
customElements.define("thermostat-card-editor", ze);
const re = "mdi:thermostat", le = "#fbb73c", ce = "#3a8dde", de = "two_rows", Qs = 3e4, Mt = class Mt extends R {
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
      icon: re,
      show_controls: !0,
      show_modes: !1,
      show_presets: !1,
      show_fan_mode: !1,
      show_off_mode: !1,
      dual_setpoint_layout: de,
      step_amount: void 0,
      heating_color: le,
      cooling_color: ce
    };
  }
  setConfig(t) {
    if (!t.entity)
      throw new Error("Thermostat Card requires a climate entity");
    if (!t.entity.startsWith("climate."))
      throw new Error("Thermostat Card only supports climate entities");
    this.config = {
      icon: re,
      show_controls: !0,
      show_modes: !1,
      show_presets: !1,
      show_fan_mode: !1,
      show_off_mode: !1,
      modes: [],
      presets: [],
      dual_setpoint_layout: de,
      step_amount: void 0,
      heating_color: le,
      cooling_color: ce,
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
    const t = this.getClimateEntity(), e = this.isHeating(t), i = this.isCooling(t), s = !!(this.config.compact || this.isCollapsed), n = !!this.config.show_controls && !s, o = !!this.config.show_modes && !s, r = !!this.config.show_presets && !s, l = {
      "--thermostat-heating-color": this.config.heating_color || le,
      "--thermostat-cooling-color": this.config.cooling_color || ce
    };
    return d`
      <ha-card
        class=${`${e ? "heating" : ""} ${i ? "cooling" : ""}`}
        style=${J(l)}
      >
        <div class="card">
          ${this.renderHeader(t, s)}
          ${n ? this.renderControls(t) : ""}
          ${o ? this.renderModeRow(t) : ""}
          ${r ? this.renderPresetRow(t) : ""}
        </div>
      </ha-card>
    `;
  }
  renderHeader(t, e) {
    var n;
    const i = this.config.name || ((n = t == null ? void 0 : t.attributes) == null ? void 0 : n.friendly_name) || "Thermostat", s = this.getSubtitle(t);
    return d`
      <div class="header">
        <button
          class="thermostat-icon"
          type="button"
          aria-label=${e ? "Expand thermostat card" : "Collapse thermostat card"}
          aria-expanded=${e ? "false" : "true"}
          @click=${this.toggleCollapsed}
        >
          <ha-icon .icon=${this.config.icon || re}></ha-icon>
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
    return e === void 0 ? "" : d`
      <div class="controls">
        ${this.renderSetpointRow(t, "single", e, "Target temperature")}
      </div>
    `;
  }
  renderDualControls(t) {
    const e = this.asNumber(t.attributes.target_temp_low), i = this.asNumber(t.attributes.target_temp_high), s = this.config.dual_setpoint_layout || de;
    if (e === void 0 || i === void 0)
      return "";
    if (s === "single_row_toggle") {
      const n = this.selectedDualTarget === "low" ? e : i;
      return d`
        <div class="controls">
          <div class="target-toggle" role="group" aria-label="Setpoint target">
            ${this.renderTargetToggleButton("low", "Heat", e)}
            ${this.renderTargetToggleButton("high", "Cool", i)}
          </div>
          ${this.renderSetpointRow(t, this.selectedDualTarget, n, this.selectedDualTarget === "low" ? "Heat setpoint" : "Cool setpoint")}
        </div>
      `;
    }
    return s === "side_by_side" ? d`
        <div class="controls side-by-side">
          ${this.renderCompactSetpoint(t, "low", e, "Heat")}
          ${this.renderCompactSetpoint(t, "high", i, "Cool")}
        </div>
      ` : d`
      <div class="controls">
        ${this.renderSetpointRow(t, "high", i, "Cool setpoint")}
        ${this.renderSetpointRow(t, "low", e, "Heat setpoint")}
      </div>
    `;
  }
  renderSetpointRow(t, e, i, s) {
    return d`
      <div class="setpoint-row" aria-label=${s}>
        <button type="button" @click=${(n) => this.adjustTemperature(n, t, e, -1)} aria-label=${`Decrease ${s}`}>
          −
        </button>
        <div class="setpoint-value">${this.formatTemperature(i, t)}</div>
        <button type="button" @click=${(n) => this.adjustTemperature(n, t, e, 1)} aria-label=${`Increase ${s}`}>
          +
        </button>
      </div>
    `;
  }
  renderCompactSetpoint(t, e, i, s) {
    return d`
      <div class="compact-setpoint" aria-label=${`${s} setpoint`}>
        <div class="setpoint-label">${s}</div>
        <div class="compact-controls">
          <button type="button" @click=${(n) => this.adjustTemperature(n, t, e, -1)} aria-label=${`Decrease ${s} setpoint`}>
            −
          </button>
          <div class="setpoint-value">${this.formatTemperature(i, t)}</div>
          <button type="button" @click=${(n) => this.adjustTemperature(n, t, e, 1)} aria-label=${`Increase ${s} setpoint`}>
            +
          </button>
        </div>
      </div>
    `;
  }
  renderTargetToggleButton(t, e, i) {
    const s = this.selectedDualTarget === t;
    return d`
      <button
        class=${`target-toggle-button ${s ? "active" : ""}`}
        type="button"
        @click=${(n) => this.selectDualTarget(n, t)}
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
    const n = !!this.config.show_fan_mode && this.asStringArray(t.attributes.fan_modes).length > 0;
    return !s.length && !n ? "" : d`
      <div class="chip-row mode-row">
        ${s.map((o) => this.renderModeButton(t, o))}
        ${n ? this.renderFanButton(t) : ""}
      </div>
    `;
  }
  renderModeButton(t, e) {
    const i = t.state === e;
    return d`
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
    return d`
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
    const e = this.asStringArray(t.attributes.preset_modes), s = this.asStringArray(this.config.presets).filter((n) => e.includes(n));
    return s.length ? d`
      <div class="chip-row preset-row">
        ${s.map((n) => this.renderPresetButton(t, n))}
      </div>
    ` : "";
  }
  renderPresetButton(t, e) {
    const i = t.attributes.preset_mode === e;
    return d`
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
    const n = i === "single" ? this.getTargetTemperature(e) : this.asNumber(e.attributes[i === "low" ? "target_temp_low" : "target_temp_high"]);
    if (n === void 0)
      return;
    const o = this.clampTemperature(e, n + this.getStep(e) * s), r = {
      entity_id: this.config.entity
    };
    if (i === "single")
      r.temperature = o, this.setOptimisticClimateState({
        attributes: { temperature: o }
      });
    else {
      const l = this.asNumber(e.attributes.target_temp_low), c = this.asNumber(e.attributes.target_temp_high);
      r.target_temp_low = i === "low" ? o : l, r.target_temp_high = i === "high" ? o : c, this.setOptimisticClimateState({
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
    const s = i.indexOf(String(e.attributes.fan_mode || "")), n = i[(s + 1) % i.length];
    this.setOptimisticClimateState({
      attributes: { fan_mode: n }
    }), this.hass.callService("climate", "set_fan_mode", {
      entity_id: this.config.entity,
      fan_mode: n
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
    var n;
    const i = this.asNumber(t), s = this.getTemperatureUnit(e);
    return i === void 0 ? `-${s}` : `${Oi(i, (n = this.hass) == null ? void 0 : n.locale)}${s}`;
  }
  getTemperatureUnit(t) {
    var e, i, s, n;
    return ((e = t == null ? void 0 : t.attributes) == null ? void 0 : e.temperature_unit) || ((n = (s = (i = this.hass) == null ? void 0 : i.config) == null ? void 0 : s.unit_system) == null ? void 0 : n.temperature) || "";
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
    }, Qs);
  }
  clearAcknowledgedOptimisticState() {
    const t = this.getRawClimateEntity(), e = this.getOptimisticState();
    if (!t || !e)
      return;
    const i = e.state === void 0 || t.state === e.state, s = Object.entries(e.attributes || {}).every(
      ([n, o]) => this.areValuesEqual(t.attributes[n], o)
    );
    i && s && (this.optimisticStateTimer && (window.clearTimeout(this.optimisticStateTimer), this.optimisticStateTimer = void 0), this.optimisticState = void 0);
  }
  areValuesEqual(t, e) {
    const i = this.asNumber(t), s = this.asNumber(e);
    return i !== void 0 && s !== void 0 ? i === s : t === e;
  }
  clampTemperature(t, e) {
    const i = this.asNumber(t.attributes.min_temp), s = this.asNumber(t.attributes.max_temp), n = i === void 0 ? e : Math.max(e, i), o = s === void 0 ? n : Math.min(n, s);
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
Mt.properties = {
  hass: { attribute: !1 },
  config: { attribute: !1 },
  selectedDualTarget: { state: !0 },
  isCollapsed: { state: !0 },
  optimisticState: { state: !0 }
}, Mt.styles = _`
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
let Ie = Mt;
customElements.define("thermostat-card", Ie);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "thermostat-card",
  name: "Thermostat Card",
  description: "Climate entity card with setpoints and modes"
});
const st = {
  stt: "Listening...",
  intent: "Thinking...",
  tts: "Preparing reply...",
  waiting: "Waiting for reply...",
  processing: "Processing..."
}, he = {
  stt: "ui.card.voice_assist.listening",
  intent: "ui.card.voice_assist.thinking",
  tts: "ui.card.voice_assist.preparing"
}, ta = {
  pending: "",
  listening: "Listening...",
  waiting: "Waiting for reply...",
  thinking: "Thinking...",
  preparing: "Preparing reply...",
  streaming: "",
  done: "",
  cancelled: "Cancelled",
  error: ""
};
function fi(a, t = {}) {
  const { localize: e, fallbacks: i = {} } = t;
  return a === "stt" ? (e == null ? void 0 : e(he.stt)) || i.stt || st.stt : a === "intent" ? (e == null ? void 0 : e(he.intent)) || i.intent || st.intent : a === "tts" ? (e == null ? void 0 : e(he.tts)) || i.tts || st.tts : i.processing || st.processing;
}
function ea(a = {}) {
  const { localize: t, fallbacks: e = {} } = a;
  return e.waiting || st.waiting;
}
function ia(a, t) {
  return (t == null ? void 0 : t[a]) ?? ta[a] ?? "";
}
function sa(a, t) {
  return a === "intent" ? "thinking" : a === "tts" ? "preparing" : "waiting";
}
class Bi {
  constructor(t) {
    this.active = !1, this.intervalMs = t.intervalMs, this.maxBackoffMs = t.maxBackoffMs ?? t.intervalMs * 30, this.shouldPoll = t.shouldPoll, this.onPoll = t.onPoll, this.delay = this.intervalMs;
  }
  sync() {
    if (!this.shouldPoll()) {
      this.stop();
      return;
    }
    this.active || (this.timer !== void 0 && (window.clearTimeout(this.timer), this.timer = void 0), this.delay = this.intervalMs, this.schedule(0));
  }
  stop() {
    this.timer !== void 0 && (window.clearTimeout(this.timer), this.timer = void 0);
  }
  reset() {
    this.stop(), this.delay = this.intervalMs;
  }
  /** Schedule the next poll soon, clearing any backed-off timer. */
  requestSoon(t = 0) {
    !this.shouldPoll() || this.active || (this.timer !== void 0 && (window.clearTimeout(this.timer), this.timer = void 0), this.delay = this.intervalMs, this.schedule(t));
  }
  schedule(t) {
    this.timer = window.setTimeout(() => {
      this.runPoll();
    }, t);
  }
  async runPoll() {
    if (this.timer = void 0, !this.shouldPoll())
      return;
    this.active = !0;
    let t = !0;
    try {
      t = await this.onPoll();
    } finally {
      this.active = !1;
    }
    !this.shouldPoll() || this.timer !== void 0 || (this.delay = t ? this.intervalMs : Math.min(this.delay * 2, this.maxBackoffMs), this.schedule(this.delay));
  }
}
const Wi = "assist-chat-card:last-used-pipeline", ji = "assist-chat-card:follow-up-hint-dismissed";
function aa() {
  try {
    return window.localStorage.getItem(Wi);
  } catch {
    return null;
  }
}
function mi(a) {
  try {
    window.localStorage.setItem(Wi, a);
  } catch {
  }
}
function na() {
  try {
    return window.localStorage.getItem(ji) === "true";
  } catch {
    return !1;
  }
}
function oa() {
  try {
    window.localStorage.setItem(ji, "true");
  } catch {
  }
}
function yt() {
  return {
    currentDeltaRole: "",
    assistantText: "",
    thinking: "",
    toolCalls: []
  };
}
function qi(a, t) {
  t.role && (a.currentDeltaRole = t.role), a.currentDeltaRole === "assistant" ? ("content" in t && t.content && (a.assistantText += t.content), "thinking_content" in t && t.thinking_content && (a.thinking += t.thinking_content), "tool_calls" in t && Array.isArray(t.tool_calls) && (a.toolCalls = vi(a.toolCalls, t.tool_calls))) : a.currentDeltaRole === "tool_result" && "tool_call_id" in t && t.tool_call_id && (a.toolCalls = vi(a.toolCalls, [
    {
      id: t.tool_call_id,
      tool_name: t.tool_name || "tool",
      tool_result: "tool_result" in t ? t.tool_result : void 0
    }
  ]));
}
const Ft = 5, ra = 0, la = 20;
function ca(a) {
  const t = a == null ? void 0 : a.conversation_engine;
  return !t || t === "conversation.home_assistant";
}
function Bt(a) {
  return a.callWS({
    type: "assist_pipeline/pipeline/list"
  });
}
function Ki(a, t) {
  return a.callWS({
    type: "assist_pipeline/pipeline_debug/list",
    pipeline_id: t
  });
}
function Gi(a, t, e) {
  return a.callWS({
    type: "assist_pipeline/pipeline_debug/get",
    pipeline_id: t,
    pipeline_run_id: e
  });
}
function da(a) {
  const t = a == null ? void 0 : a.code;
  return t === "unauthorized" || t === "not_allowed" || t === "forbidden";
}
function bi(a, t, e) {
  return a.connection.subscribeMessage(t, {
    ...e,
    type: "assist_pipeline/run"
  });
}
function Ji(a, t) {
  var e, i;
  if (a === "last_used") {
    const s = aa();
    return s && t.pipelines.some((n) => n.id === s) ? s : t.preferred_pipeline || ((e = t.pipelines[0]) == null ? void 0 : e.id) || "";
  }
  return a && a !== "preferred" ? a : t.preferred_pipeline || ((i = t.pipelines[0]) == null ? void 0 : i.id) || "";
}
function Wt(a, t = Ft, e = ra, i = la) {
  const s = Number(a ?? t);
  return Number.isFinite(s) ? Math.min(Math.max(Math.round(s), e), i) : t;
}
function Yi(a, t = Ft) {
  const e = Wt(t);
  return [...a].sort((i, s) => new Date(s.timestamp).getTime() - new Date(i.timestamp).getTime()).slice(0, e);
}
function _t() {
  return {
    stage: "ready",
    stages: {
      stt: { key: "stt", label: "STT", status: "idle" },
      intent: { key: "intent", label: "Intent", status: "idle" },
      tts: { key: "tts", label: "TTS", status: "idle" }
    },
    toolCalls: []
  };
}
function wt(a) {
  var o, r, l, c;
  const t = _t();
  let e = "", i = "", s = null;
  const n = yt();
  for (const p of ha(a)) {
    const u = p.data || {};
    if (Xi(t, p), p.type === "stt-end")
      e = Q((o = u.stt_output) == null ? void 0 : o.text) || e;
    else if (p.type === "intent-start")
      e = Q(u.intent_input) || e;
    else if (p.type === "intent-progress" && u.chat_log_delta)
      qi(n, u.chat_log_delta), t.toolCalls = n.toolCalls;
    else if (p.type === "intent-end") {
      s = ((r = u.intent_output) == null ? void 0 : r.conversation_id) || s;
      const h = Oe(u.intent_output);
      h && (n.assistantText = h), ((c = (l = u.intent_output) == null ? void 0 : l.response) == null ? void 0 : c.response_type) === "error" && (i = n.assistantText || "The assistant run failed.");
    } else if (p.type === "tts-start") {
      const h = Q(u.tts_input);
      h && (n.assistantText = h);
    } else p.type === "error" && (i = Q(u.message) || Q(u.code) || "The assistant run failed.");
  }
  return {
    userText: e,
    assistantText: n.assistantText,
    thinking: ua(n.thinking),
    toolCalls: [...t.toolCalls],
    errorText: i,
    conversationId: s,
    process: Zi(t)
  };
}
function Oe(a) {
  var e, i, s, n, o, r, l, c;
  const t = ((s = (i = (e = a == null ? void 0 : a.response) == null ? void 0 : e.speech) == null ? void 0 : i.plain) == null ? void 0 : s.speech) || ((l = (r = (o = (n = a == null ? void 0 : a.response) == null ? void 0 : n.speech) == null ? void 0 : o.plain) == null ? void 0 : r.extra_data) == null ? void 0 : l.speech) || ((c = a == null ? void 0 : a.response) == null ? void 0 : c.speech) || "";
  return typeof t == "string" ? t : "";
}
function Xi(a, t) {
  var i, s;
  const e = t.timestamp || (/* @__PURE__ */ new Date()).toISOString();
  t.type === "run-start" ? (a.started = e, a.stage = "ready") : t.type === "stt-start" ? ue(a, "stt", e) : t.type === "stt-vad-end" ? (a.stage = "stt", a.stages.stt = {
    ...a.stages.stt,
    status: a.stages.stt.status === "idle" ? "running" : a.stages.stt.status,
    started: e
  }) : t.type === "stt-end" ? pe(a, "stt", e) : t.type === "intent-start" ? ue(a, "intent", e) : t.type === "intent-end" ? pe(a, "intent", e) : t.type === "tts-start" ? ue(a, "tts", e) : t.type === "tts-end" ? pe(a, "tts", e) : t.type === "run-end" ? (a.stage = "done", a.finished = e) : t.type === "error" && (a.stage = "error", a.finished = e, a.error = String(((i = t.data) == null ? void 0 : i.message) || ((s = t.data) == null ? void 0 : s.code) || ""), Object.values(a.stages).forEach((n) => {
    n.status === "running" && (n.status = "error", n.ended = e);
  }));
}
function ue(a, t, e) {
  a.stage = t, a.stages[t] = {
    ...a.stages[t],
    status: "running",
    started: a.stages[t].started || e,
    ended: void 0
  };
}
function pe(a, t, e) {
  a.stages[t] = {
    ...a.stages[t],
    status: "done",
    ended: e
  };
}
function Zi(a) {
  return {
    ...a,
    stages: {
      stt: { ...a.stages.stt },
      intent: { ...a.stages.intent },
      tts: { ...a.stages.tts }
    },
    toolCalls: [...a.toolCalls]
  };
}
function ha(a) {
  return [...a].sort((t, e) => new Date(t.timestamp).getTime() - new Date(e.timestamp).getTime());
}
function vi(a, t) {
  const e = [...a];
  for (const i of t) {
    if (!i.id)
      continue;
    const s = e.findIndex((o) => o.id === i.id);
    if (s === -1) {
      e.push({ ...i });
      continue;
    }
    const n = e[s];
    e[s] = {
      ...n,
      tool_name: i.tool_name || n.tool_name,
      tool_args: i.tool_args ?? n.tool_args,
      tool_result: i.tool_result !== void 0 ? i.tool_result : n.tool_result
    };
  }
  return e;
}
function Q(a) {
  return typeof a == "string" ? a : "";
}
function ua(a) {
  return a.replace(/\r\n/g, `
`).split(`
`).map((t) => t.trimStart()).join(`
`).trim();
}
class Qi {
  constructor() {
    this.entries = /* @__PURE__ */ new Map();
  }
  get(t) {
    return this.entries.get(t);
  }
  set(t, e) {
    this.entries.set(t, e);
  }
  prune(t) {
    for (const e of this.entries.keys())
      t.has(e) || this.entries.delete(e);
  }
}
function ts(a) {
  return a.some((t) => t.type === "run-end" || t.type === "error");
}
async function pa(a, t, e, i, s = ts) {
  const n = Wt(e);
  if (n === 0)
    return [];
  const o = await Ki(a, t), r = Yi(o.pipeline_runs || [], n), l = await Promise.all(
    r.map(async (c) => {
      const p = i.get(c.pipeline_run_id);
      if (p != null && p.finished)
        return { ...c, events: p.events, conversation: p.conversation };
      const h = (await Gi(a, t, c.pipeline_run_id)).events || [], g = wt(h);
      return i.set(c.pipeline_run_id, {
        events: h,
        conversation: g,
        finished: s(h)
      }), { ...c, events: h, conversation: g };
    })
  );
  return i.prune(new Set(r.map((c) => c.pipeline_run_id))), l;
}
const es = _`
  .bubble {
    border-radius: 16px;
    box-sizing: border-box;
    font-size: 14px;
    line-height: 1.45;
    max-width: 88%;
    min-width: 0;
    overflow-wrap: anywhere;
    padding: 10px 12px;
  }

  .message .bubble,
  .bubble.user,
  .bubble.assistant {
    align-items: flex-start;
    display: flex;
    flex-direction: column;
    gap: 8px;
    overflow: hidden;
  }

  .user .bubble,
  .bubble.user {
    background: var(--assist-user-bubble);
    color: var(--assist-user-text);
  }

  .assistant .bubble,
  .bubble.assistant {
    background: var(--assist-assistant-bubble);
    color: var(--assist-assistant-text);
  }

  .assistant .bubble.loading,
  .bubble.loading {
    color: var(--assist-secondary-text, var(--secondary-text-color));
  }

  .assistant .bubble.cancelled-bubble,
  .bubble.cancelled-bubble {
    color: var(--assist-secondary-text, var(--secondary-text-color));
  }

  .error-bubble {
    color: var(--error-color, #db4437);
  }

  .loading-status {
    align-items: center;
    display: inline-flex;
    flex: 0 0 auto;
    flex-shrink: 0;
    gap: 8px;
    max-width: 100%;
  }

  .loading-status > span {
    white-space: nowrap;
  }

  .bubble.cancelled-bubble > span:first-child {
    white-space: nowrap;
  }
`, is = _`
  .typing-dots {
    align-items: center;
    display: inline-flex;
    gap: 3px;
  }

  .typing-dots span {
    animation: assist-typing-dot 1.2s infinite ease-in-out;
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

  @keyframes assist-typing-dot {
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
`;
function St(a, t) {
  if (!a || !t)
    return "";
  const e = a instanceof Date ? a.getTime() : new Date(a).getTime(), i = t instanceof Date ? t.getTime() : new Date(t).getTime();
  if (!Number.isFinite(e) || !Number.isFinite(i))
    return "";
  const s = Math.max(0, (i - e) / 1e3);
  return `${s.toFixed(s < 10 ? 2 : 1)}s`;
}
function Le(a) {
  switch (a) {
    case "done":
      return "mdi:check-circle";
    case "error":
      return "mdi:alert-circle";
    case "cancelled":
      return "mdi:stop-circle-outline";
    case "running":
      return "mdi:progress-clock";
    case "idle":
      return "mdi:circle-outline";
    default:
      return "mdi:progress-clock";
  }
}
function jt(a, t = {}) {
  const e = t.fallback ?? "Request rejected.";
  if (a instanceof DOMException)
    return a.name === "NotAllowedError" ? t.micDenied ?? (a.message || a.name) : a.name === "NotFoundError" ? t.micNotFound ?? (a.message || a.name) : a.name === "NotSupportedError" || a.name === "SecurityError" ? t.micHttps ?? (a.message || a.name) : a.message || a.name;
  if (a && typeof a == "object") {
    const i = a;
    return i.message || i.code || e;
  }
  return e;
}
function ct() {
  return d`
    <span class="typing-dots" aria-hidden="true">
      <span></span>
      <span></span>
      <span></span>
    </span>
  `;
}
const He = {
  title: "Assist debug",
  pipeline_id: "preferred",
  run_count: Ft,
  minimalistic_mode: !1,
  visualization_only: !1,
  conversation_only: !1,
  show_conversation: !1,
  metadata_mode: "compact",
  show_raw: !0,
  show_thinking: !0,
  show_summary: !0,
  show_stt: !0,
  show_intent: !0,
  show_tts: !0,
  mask_transcripts: !1,
  audio_visualization: !1,
  audio_visualization_type: "waveform",
  audio_visualization_position: "below_chat",
  audio_visualization_height: 56,
  audio_visualization_color: "var(--primary-color)",
  audio_visualization_secondary_color: "var(--secondary-text-color)",
  audio_visualization_background: "transparent",
  audio_visualization_opacity: 0.75,
  audio_visualization_start_delay: 0
}, ge = {
  audio_visualization_color: "#03a9f4",
  audio_visualization_secondary_color: "#727272",
  audio_visualization_background: "#000000"
}, ga = "#39ff14", fa = "#000000";
function at(a, t) {
  const e = a[t];
  return e === void 0 ? He[t] : e;
}
const k = He, Dt = class Dt extends x {
  constructor() {
    super(...arguments), this.config = {}, this.pipelines = [], this.pipelinesLoading = !1, this.pipelineError = "";
  }
  setConfig(t) {
    this.config = t || {};
  }
  getValue(t) {
    return at(this.config, t);
  }
  shouldUpdate(t) {
    return t.has("config") || t.has("pipelines") || t.has("pipelinesLoading") || t.has("pipelineError") ? !0 : t.has("hass") ? !t.get("hass") && !!this.hass : !1;
  }
  updated(t) {
    t.has("hass") && !t.get("hass") && this.loadPipelines();
  }
  async loadPipelines() {
    if (!(!this.hass || this.pipelinesLoading)) {
      this.pipelinesLoading = !0, this.pipelineError = "";
      try {
        const t = await Bt(this.hass);
        this.pipelines = t.pipelines || [];
      } catch (t) {
        this.pipelineError = jt(t, { fallback: "Unable to load pipelines." });
      } finally {
        this.pipelinesLoading = !1;
      }
    }
  }
  render() {
    return d`
      <div class="editor">
        <div class="grid">
          ${F({
      label: "Title",
      value: String(this.config.title || ""),
      placeholder: k.title,
      onInput: (t) => this.updateConfigValue("title", t)
    })}
          ${Hs({
      hass: this.hass,
      label: "Pipeline",
      value: String(this.getValue("pipeline_id")),
      pipelines: this.pipelines,
      loading: this.pipelinesLoading,
      error: this.pipelineError,
      onChange: (t) => this.updateConfigValue("pipeline_id", t)
    })}
          ${this.renderNumberField("Recent runs", "run_count", k.run_count, 1, 20)}
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
          ${this.renderNumberField("Height", "audio_visualization_height", k.audio_visualization_height, 24, 180)}
          ${this.renderNumberField("Visualization start delay (ms)", "audio_visualization_start_delay", k.audio_visualization_start_delay, 0, 1e4)}
          ${this.renderDecimalField("Opacity", "audio_visualization_opacity", k.audio_visualization_opacity, 0.05, 1, 0.05)}
          ${this.renderColorInput(
      "Primary color",
      "audio_visualization_color",
      k.audio_visualization_color,
      ge.audio_visualization_color
    )}
          ${this.renderColorInput(
      "Secondary color",
      "audio_visualization_secondary_color",
      k.audio_visualization_secondary_color,
      ge.audio_visualization_secondary_color
    )}
          ${this.renderColorInput(
      "Background",
      "audio_visualization_background",
      k.audio_visualization_background,
      ge.audio_visualization_background
    )}
        </fieldset>
      </div>
    `;
  }
  renderNumberField(t, e, i, s, n) {
    const o = Number(this.config[e] ?? i);
    return d`
      <label>
        <span>${t}</span>
        <input
          type="number"
          min=${String(s)}
          max=${String(n)}
          .value=${String(o)}
          @input=${(r) => this.updateNumberValue(e, r.target.value, i, s, n)}
        />
      </label>
    `;
  }
  renderDecimalField(t, e, i, s, n, o) {
    const r = Number(this.config[e] ?? i);
    return d`
      <label>
        <span>${t}</span>
        <input
          type="number"
          min=${String(s)}
          max=${String(n)}
          step=${String(o)}
          .value=${String(r)}
          @input=${(l) => this.updateDecimalValue(e, l.target.value, i, s, n)}
        />
      </label>
    `;
  }
  renderColorInput(t, e, i, s) {
    const n = Ot(String(this.config[e] || i), s);
    return d`
      <label>
        <span>${t}</span>
        <input
          type="color"
          .value=${n}
          @input=${(o) => this.updateConfigValue(e, o.target.value)}
        />
      </label>
    `;
  }
  renderMetadataModeField() {
    const t = this.getValue("metadata_mode");
    return d`
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
    const t = this.getValue("audio_visualization_type");
    return d`
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
    const t = this.getValue("audio_visualization_position");
    return d`
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
    return Ue({
      label: t,
      checked: !!this.getValue(e),
      onChange: (i) => this.updateConfigValue(e, i)
    });
  }
  updateConfigValue(t, e) {
    this.updateConfig({
      ...this.config,
      [t]: e === "" ? void 0 : e
    });
  }
  updateNumberValue(t, e, i, s, n) {
    this.updateConfigValue(t, Hi(e, i, s, n));
  }
  updateDecimalValue(t, e, i, s, n) {
    const o = Number(e), r = Number.isFinite(o) ? Math.min(Math.max(o, s), n) : i;
    this.updateConfigValue(t, r);
  }
  updateConfig(t) {
    this.config = t, S(this, "config-changed", { config: t });
  }
};
Dt.properties = {
  hass: { attribute: !1 },
  config: { attribute: !1 },
  pipelines: { state: !0 },
  pipelinesLoading: { state: !0 },
  pipelineError: { state: !0 }
}, Dt.styles = _`
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
let At = Dt;
class ma extends At {
}
customElements.define("assist-debug-card-editor", At);
customElements.get("conversation-debug-card-editor") || customElements.define("conversation-debug-card-editor", ma);
const tt = He, yi = 2e3, ba = 48, va = /* @__PURE__ */ new Set([
  "text",
  "intent_input",
  "tts_input",
  "speech",
  "content",
  "thinking_content"
]), q = class q extends R {
  constructor() {
    super(...arguments), this.audioVisualizationId = `assist-debug-audio-${q.nextAudioVisualizationId++}`, this.loading = !1, this.error = "", this.pipelines = [], this.runs = [], this.selectedRunId = "", this.resolvedPipelineId = "", this.sessionStartedAt = Date.now(), this.loadToken = 0, this.lastLoadKey = "", this.runCache = new Qi(), this.thinkingDetailsOpen = !1, this.thinkingDetailsUserCollapsed = !1, this.thinkingDetailsRunId = "", this.thinkingScrollRunId = "", this.thinkingLastScrolledLength = 0, this.thinkingAutoScrollEnabled = !0, this.ulysse31RotationX = 0, this.ulysse31RotationY = 0, this.ulysse31LastFrameAt = 0, this.audioKey = "", this.audioSourceEnded = !1, this.audioAnimationStartedAt = 0, this.audioVisualizationStatus = "", this.audioVisualizationLoading = !1, this.audioVisualizationError = "", this.audioFetchUnavailable = !1, this.audioVisualizationPainted = !1, this.audioNeedsUserStart = !1, this.audioIsVisible = !0, this.handleDocumentVisibilityChange = () => {
      this.audioIsVisible = !document.hidden, this.syncAudioAnimation(), this.syncUlysse31IdleAnimation();
    };
  }
  static getConfigElement() {
    return document.createElement("assist-debug-card-editor");
  }
  static getStubConfig() {
    return { ...tt, type: "custom:assist-debug-card" };
  }
  setConfig(t) {
    this.config = { ...tt, ...t };
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
    const t = at(this.config, "title"), e = this.getPipelineName(this.resolvedPipelineId), i = this.getCardStyles();
    return d`
      <ha-card style=${J(i)}>
        <div class=${this.config.visualization_only ? "card visualization-only-card" : "card"}>
          ${this.renderCardGlowVisualization()}
          ${this.config.visualization_only ? this.renderVisualizationOnlyContent() : d`
                ${this.config.minimalistic_mode ? "" : d`
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
    return this.error ? d`
        <div class="state error-state">
          <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
          <div>
            <strong>Unable to load debug data</strong>
            <span>${this.error}</span>
          </div>
        </div>
      ` : this.config.conversation_only && (this.loading || !this.runModel) ? this.renderConversationOnly(this.runModel) : this.loading && !this.runModel ? d`
        <div class="state">
          <ha-icon icon="mdi:progress-clock"></ha-icon>
          <span>Loading recent conversation runs...</span>
        </div>
      ` : this.runModel ? this.config.conversation_only ? this.renderConversationOnly(this.runModel) : d`
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
    ` : d`
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
    return this.config.audio_visualization ? this.getAudioVisualizationType() === "glow" ? d`<div class="visualization-only-spacer" aria-hidden="true"></div>` : this.renderStandaloneAudioVisualization() : "";
  }
  renderRunPicker() {
    return this.runs.length <= 1 ? "" : d`
      <div class="run-picker" aria-label="Recent debug runs">
        ${this.runs.map(
      (t) => d`
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
    var h;
    const i = this.getAudioVisualizationPosition(), s = this.renderAudioVisualization("background"), n = e ? this.renderAudioVisualization("top") : "", o = this.renderAudioVisualization("below_chat");
    if (!t)
      return d`
        ${n}
        <div class=${i === "background" ? "conversation-shell has-background-visualization" : "conversation-shell"}>
          ${s}
          <div class="conversation conversation-only">
            <div class="bubble assistant loading">
              <div class="loading-status">
                ${ct()}
                <span>${this.loading ? "Loading conversation..." : "Waiting for a conversation..."}</span>
              </div>
            </div>
          </div>
        </div>
        ${o}
      `;
    const { userText: r, assistantText: l } = this.getConversationMessages(t), c = !!l, p = t.stage === "error", u = !c && !p;
    return d`
      ${n}
      <div class=${i === "background" ? "conversation-shell has-background-visualization" : "conversation-shell"}>
        ${s}
        <div class="conversation conversation-only">
          ${r ? d`<div class="bubble user">${r}</div>` : ""}
          ${this.renderAudioVisualization("between")}
          ${c ? d`<div class="bubble assistant">${l}</div>` : p ? d`<div class="bubble assistant error-bubble">${((h = t.error) == null ? void 0 : h.message) || "The assistant run failed."}</div>` : d`
                  <div class="bubble assistant loading">
                    <div class="loading-status">
                      ${ct()}
                      <span>${this.getConversationLoadingText(t, u)}</span>
                    </div>
                  </div>
                `}
        </div>
      </div>
      ${o}
    `;
  }
  renderAudioVisualization(t) {
    var n;
    if (!this.config.audio_visualization || this.getAudioVisualizationType() === "glow" || this.getAudioVisualizationPosition() !== t || !(this.getAudioVisualizationType() === "ulysse31") && !((n = this.runModel) != null && n.ttsAudio) && !this.audioVisualizationLoading && !this.audioVisualizationError)
      return "";
    const s = t === "background" && !this.audioVisualizationPainted ? "audio-visualization audio-visualization-background is-pending" : `audio-visualization audio-visualization-${t}`;
    return d`
      <div class=${s}>
        <canvas
          class="audio-visualization-canvas"
          data-audio-visualization-id=${this.audioVisualizationId}
          aria-hidden="true"
        ></canvas>
        ${this.audioVisualizationError ? d`<div class="audio-visualization-overlay error-message">${this.audioVisualizationError}</div>` : ""}
        ${this.audioNeedsUserStart ? d`
              <button class="audio-start-button" type="button" @click=${this.handleStartAudioVisualization}>
                Start visualization
              </button>
            ` : ""}
      </div>
    `;
  }
  renderStandaloneAudioVisualization() {
    return d`
      <div class="audio-visualization audio-visualization-standalone">
        <canvas
          class="audio-visualization-canvas"
          data-audio-visualization-id=${this.audioVisualizationId}
          aria-hidden="true"
        ></canvas>
        ${this.audioVisualizationError ? d`<div class="audio-visualization-overlay error-message">${this.audioVisualizationError}</div>` : ""}
        ${this.audioNeedsUserStart ? d`
              <button class="audio-start-button" type="button" @click=${this.handleStartAudioVisualization}>
                Start visualization
              </button>
            ` : ""}
      </div>
    `;
  }
  renderCardGlowVisualization() {
    var t;
    return !this.config.audio_visualization || this.getAudioVisualizationType() !== "glow" || !this.config.visualization_only && !((t = this.runModel) != null && t.ttsAudio) && !this.audioVisualizationLoading && !this.audioVisualizationError ? "" : d`
      <div class="audio-visualization audio-visualization-card-background">
        <canvas
          class="audio-visualization-canvas"
          data-audio-visualization-id=${this.audioVisualizationId}
          aria-hidden="true"
        ></canvas>
      </div>
    `;
  }
  renderSummary(t) {
    var s;
    const e = t.stage === "done" || t.stage === "error", i = St(t.started, t.finished);
    return d`
      <details class="section summary" ?open=${e}>
        <summary>
          <span class="status ${t.stage === "error" ? "error" : e ? "done" : "running"}">
            <ha-icon .icon=${Le(t.stage === "error" ? "error" : e ? "done" : "running")}></ha-icon>
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
            ${t.language ? d`
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
          ${t.error ? d`<p class="error-message">${t.error.message || t.error.code}</p>` : ""}
        </div>
      </details>
    `;
  }
  renderStage(t, e, i) {
    const s = this.getStageStatus(e, i), n = at(this.config, "metadata_mode"), o = s === "running" || s === "error", r = this.maskText((i == null ? void 0 : i.output) || (i == null ? void 0 : i.input) || "");
    return d`
      <details class="section" ?open=${o}>
        <summary>
          <span class="status ${s}">
            <ha-icon .icon=${Le(s)}></ha-icon>
          </span>
          <span class="section-title">${t}</span>
          <span class="duration">${this.getStageDuration(e)}</span>
          <ha-icon class="chevron" icon="mdi:chevron-down"></ha-icon>
        </summary>
        <div class="section-body">
          ${r ? d`<p class="stage-text">${r}</p>` : d`<p class="muted">No data recorded for this stage.</p>`}
          ${n !== "hidden" && i ? this.renderStageMetadata(e, i, n) : ""}
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
    const n = s.filter(([, o]) => o != null && o !== "");
    return n.length ? d`
      <dl class=${i === "full" ? "meta-grid full" : "meta-grid"}>
        ${n.map(
      ([o, r]) => d`
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
    const e = this.getThinkingFromEvents(t.events), i = t.stage === "intent" && !((o = t.intent) != null && o.done) && !e;
    if (!e && !i)
      return "";
    const s = this.isThinkingLive(t);
    this.syncThinkingDetailsOpen(t, s);
    const n = s ? "Streaming…" : e ? `${e.length} chars` : "";
    return d`
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
          <span class="duration">${n}</span>
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
    this.thinkingAutoScrollEnabled = i <= ba;
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
    const e = this.getThinkingFromEvents(t.events).length;
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
    return d`
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
    var s, n;
    const e = JSON.stringify({
      pipeline_id: at(this.config, "pipeline_id"),
      run_count: at(this.config, "run_count")
    });
    if (!t && e === this.lastLoadKey && this.runModel)
      return;
    this.lastLoadKey = e;
    const i = ++this.loadToken;
    this.loading = !0, this.error = "";
    try {
      const o = await Bt(this.hass);
      if (i !== this.loadToken)
        return;
      this.pipelines = o.pipelines || [];
      const r = Ji(this.config.pipeline_id, o);
      if (this.resolvedPipelineId = r, !r) {
        this.runs = [], this.selectedRunId = "", this.runModel = void 0;
        return;
      }
      const l = await Ki(this.hass, r);
      if (i !== this.loadToken)
        return;
      const c = ((s = this.runs[0]) == null ? void 0 : s.pipeline_run_id) || "", p = Yi(l.pipeline_runs || [], this.getRunCount());
      this.runs = p;
      const u = ((n = p[0]) == null ? void 0 : n.pipeline_run_id) || "", g = t && this.isLiveConversationMode() && (!this.selectedRunId || this.selectedRunId === c) || !p.some((f) => f.pipeline_run_id === this.selectedRunId) ? u : this.selectedRunId;
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
    const s = this.runs.find((r) => r.pipeline_run_id === e), n = this.runCache.get(e);
    let o = n == null ? void 0 : n.events;
    if (!(n != null && n.finished)) {
      const r = await Gi(this.hass, t, e);
      if (i !== this.loadToken)
        return;
      o = r.events || [];
      const l = wt(o);
      this.runCache.set(e, {
        events: o,
        conversation: l,
        finished: ts(o)
      });
    }
    this.runModel = this.buildRunModel(t, e, o || [], s);
  }
  buildRunModel(t, e, i, s) {
    const n = wt(i), o = this.extractDebugStageMetadata(i), r = this.resolveRunStage(n, i);
    return {
      pipelineId: t,
      pipelineName: this.getPipelineName(t),
      runId: e,
      stage: r,
      started: s != null && s.timestamp ? new Date(s.timestamp) : n.process.started ? new Date(n.process.started) : void 0,
      finished: n.process.finished ? new Date(n.process.finished) : void 0,
      events: i,
      conversation: n,
      language: o.language,
      run: o.run,
      stt: o.stt,
      intent: o.intent,
      tts: o.tts,
      ttsAudio: o.ttsAudio,
      error: o.error || (n.errorText ? { message: n.errorText } : void 0)
    };
  }
  resolveRunStage(t, e) {
    if (e.some((i) => i.type === "wake_word-start" || i.type === "wake_word-end")) {
      const i = t.process.stage;
      if (i === "ready" || i === "stt")
        return "wake_word";
    }
    return t.process.stage;
  }
  extractDebugStageMetadata(t) {
    var c, p;
    let e, i = "", s, n, o, r, l;
    for (const u of t) {
      const h = u.data || {};
      u.type === "run-start" ? (e = h, i = String(h.language || ""), r = this.extractTtsAudio(h.tts_output, u.timestamp) || r) : u.type === "stt-start" ? s = {
        engine: String(h.engine || ""),
        language: (c = h.metadata) == null ? void 0 : c.language,
        done: !1,
        raw: h
      } : u.type === "stt-end" ? s = {
        ...s || { done: !1 },
        output: (p = h.stt_output) == null ? void 0 : p.text,
        done: !0,
        raw: { ...(s == null ? void 0 : s.raw) || {}, ...h }
      } : u.type === "intent-start" ? n = {
        engine: String(h.engine || ""),
        language: String(h.language || ""),
        input: h.intent_input,
        preferLocalIntents: h.prefer_local_intents,
        done: !1,
        raw: h
      } : u.type === "intent-end" ? n = {
        ...n || { done: !1 },
        output: Oe(h.intent_output),
        processedLocally: h.processed_locally,
        done: !0,
        raw: { ...(n == null ? void 0 : n.raw) || {}, ...h }
      } : u.type === "tts-start" ? o = {
        engine: String(h.engine || ""),
        language: String(h.language || ""),
        voice: h.voice,
        input: h.tts_input,
        done: !1,
        raw: h
      } : u.type === "tts-end" ? (o = {
        ...o || { done: !1 },
        done: !0,
        raw: { ...(o == null ? void 0 : o.raw) || {}, ...h }
      }, r = this.extractTtsAudio(h.tts_output, u.timestamp) || r) : u.type === "error" && (l = {
        code: h.code,
        message: h.message
      });
    }
    return { run: e, language: i, stt: s, intent: n, tts: o, ttsAudio: r, error: l };
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
  getConversationPollController() {
    return this.conversationPollController || (this.conversationPollController = new Bi({
      intervalMs: yi,
      maxBackoffMs: yi * 30,
      shouldPoll: () => this.shouldLiveRefresh() && !!this.hass,
      onPoll: async () => {
        if (this.loading)
          return !0;
        try {
          return await this.loadDebugData(!0), !0;
        } catch {
          return !1;
        }
      }
    })), this.conversationPollController;
  }
  syncConversationRefreshTimer() {
    if (!this.shouldLiveRefresh() || !this.hass) {
      this.clearConversationRefreshTimer();
      return;
    }
    this.getConversationPollController().sync();
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
  getThinkingFromEvents(t) {
    const e = wt(t).thinking;
    return this.config.mask_transcripts && e ? "[masked]" : e;
  }
  clearConversationRefreshTimer() {
    var t;
    (t = this.conversationPollController) == null || t.stop();
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
    var s, n, o, r;
    if (!((s = this.config) != null && s.audio_visualization) || !this.hass) {
      this.cleanupAudioVisualization();
      return;
    }
    if (!((o = (n = this.runModel) == null ? void 0 : n.ttsAudio) != null && o.url)) {
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
      const l = this.getAudioContext(), c = await this.fetchAudio(e);
      if (!c.ok) {
        if (i !== this.audioKey)
          return;
        await this.showIdleAudioVisualization();
        return;
      }
      const p = await l.decodeAudioData(await c.arrayBuffer());
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
    const s = window.devicePixelRatio || 1, n = Math.max(1, Math.floor(i.width * s)), o = Math.max(1, Math.floor(i.height * s));
    (t.width !== n || t.height !== o) && (t.width = n, t.height = o), e.clearRect(0, 0, n, o), this.fillAudioVisualizationBackground(e, n, o), this.audioAnimationStartedAt || (this.audioAnimationStartedAt = performance.now());
    const r = performance.now() - this.audioAnimationStartedAt, l = Math.min(1, r / Math.max(1, this.audioBuffer.duration * 1e3)), c = this.getAudioLevelAtProgress(this.audioPlaybackData, l), p = this.getAudioVisualizationType();
    if (p === "spectrum" ? this.drawAnimatedSpectrum(e, n, o, c, l) : p === "meter" ? this.drawMeter(e, n, o, this.scaleAudioFrame(this.audioStaticData || this.audioPlaybackData, c)) : p === "glow" ? this.drawGlow(e, n, o, c) : p === "ulysse31" ? (this.cancelUlysse31Animation(), this.drawUlysse31Wireframe(e, n, o, c)) : this.drawWaveform(e, n, o, this.scaleAudioFrame(this.audioStaticData || this.audioPlaybackData, c)), l >= 1) {
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
    const s = window.devicePixelRatio || 1, n = Math.max(1, Math.floor(i.width * s)), o = Math.max(1, Math.floor(i.height * s));
    if ((t.width !== n || t.height !== o) && (t.width = n, t.height = o), e.clearRect(0, 0, n, o), this.fillAudioVisualizationBackground(e, n, o), this.getAudioVisualizationType() === "meter") {
      this.drawMeter(e, n, o, this.audioStaticData);
      return;
    }
    if (this.getAudioVisualizationType() === "glow") {
      this.drawGlow(e, n, o, 0);
      return;
    }
    if (this.getAudioVisualizationType() === "ulysse31") {
      this.drawUlysse31Wireframe(e, n, o, this.getWaveformLevel(this.audioStaticData));
      return;
    }
    this.drawWaveform(e, n, o, this.audioStaticData);
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
    const s = window.devicePixelRatio || 1, n = Math.max(1, Math.floor(i.width * s)), o = Math.max(1, Math.floor(i.height * s));
    (t.width !== n || t.height !== o) && (t.width = n, t.height = o), e.clearRect(0, 0, n, o), this.fillAudioVisualizationBackground(e, n, o);
    const r = this.getAudioVisualizationType();
    if (r === "spectrum")
      this.drawIdleSpectrum(e, n, o);
    else if (r === "meter")
      this.drawIdleMeter(e, n, o);
    else if (r === "glow")
      this.drawGlow(e, n, o, 0);
    else if (r === "ulysse31") {
      this.drawUlysse31Wireframe(e, n, o, 0), this.markBackgroundVisualizationReady(), this.syncUlysse31IdleAnimation();
      return;
    } else
      this.drawIdleWaveform(e, n, o);
    this.markBackgroundVisualizationReady();
  }
  showUlysse31IdleVisualization() {
    this.clearAudioStartDelayTimer(), this.cancelAudioAnimation(), this.cleanupAudioNodes(), this.audioBuffer = void 0, this.analyser = void 0, this.audioData = void 0, this.audioStaticData = void 0, this.audioPlaybackData = void 0, this.audioSourceEnded = !0, this.audioAnimationStartedAt = 0, this.audioVisualizationLoading = !1, this.audioVisualizationError = "", this.audioFetchUnavailable = !1, this.audioNeedsUserStart = !1, this.audioVisualizationStatus = "idle", this.audioKey = "", this.updateComplete.then(() => this.drawFlatAudioVisualization());
  }
  createStaticWaveformData(t) {
    const e = t.getChannelData(0), i = 512, s = new Uint8Array(i), n = Math.max(1, Math.floor(e.length / i));
    for (let o = 0; o < i; o += 1) {
      let r = 1, l = -1;
      const c = o * n, p = Math.min(c + n, e.length);
      for (let h = c; h < p; h += 1) {
        const g = e[h] || 0;
        r = Math.min(r, g), l = Math.max(l, g);
      }
      const u = Math.max(Math.abs(r), Math.abs(l));
      s[o] = Math.round((u * 0.5 + 0.5) * 255);
    }
    return s;
  }
  createPlaybackWaveformData(t) {
    const e = t.getChannelData(0), i = Math.max(512, Math.min(8192, Math.floor(t.duration * 1200))), s = new Uint8Array(i);
    for (let n = 0; n < i; n += 1) {
      const o = Math.min(e.length - 1, Math.floor(n / i * e.length)), r = Math.max(-1, Math.min(1, e[o] || 0));
      s[n] = Math.round((r * 0.5 + 0.5) * 255);
    }
    return s;
  }
  getAudioLevelAtProgress(t, e) {
    const s = Math.max(0, t.length - 96), n = Math.min(s, Math.floor(e * s));
    let o = 0;
    for (let r = 0; r < 96; r += 1)
      o += Math.abs((t[n + r] ?? 128) - 128) / 128;
    return Math.min(1, Math.max(0.08, o / 96 * 2.8));
  }
  scaleAudioFrame(t, e) {
    const i = new Uint8Array(t.length);
    for (let s = 0; s < t.length; s += 1) {
      const n = (t[s] ?? 128) - 128;
      i[s] = Math.max(0, Math.min(255, Math.round(128 + n * e)));
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
        const n = (s - 128) / 128;
        return i + n * n;
      }, 0) / t.length
    );
    return Math.min(1, Math.max(0, e * 2.4));
  }
  projectUlysse31Point(t, e, i, s, n, o, r, l, c) {
    let p = (i + s * Math.cos(e)) * Math.cos(t), u = (i + s * Math.cos(e)) * Math.sin(t), h = s * Math.sin(e);
    const g = Math.cos(n), f = Math.sin(n), m = u * g - h * f, b = u * f + h * g;
    u = m, h = b;
    const v = Math.cos(o), A = Math.sin(o), $ = p * v + h * A;
    h = -p * A + h * v, p = $;
    const Y = 2.8 / (2.8 + h);
    return {
      x: r + p * c * Y,
      y: l + u * c * Y * 0.82,
      depth: h
    };
  }
  drawUlysse31Wireframe(t, e, i, s) {
    const n = getComputedStyle(t.canvas), o = n.color, r = n.borderTopColor || o, l = 0.08 + s * 0.92, { rotX: c, rotY: p } = this.advanceUlysse31Rotation(s), u = e / 2, h = i / 2, g = Math.min(e, i) * (0.24 + l * 0.08), f = 1, m = 0.34, b = 28, v = 14;
    this.drawUlysse31Backdrop(t, e, i, r), t.save(), t.strokeStyle = o, t.lineWidth = Math.max(1, e / 420), t.shadowBlur = 6 + l * 14, t.shadowColor = o, t.globalAlpha = 0.72 + l * 0.28;
    const A = ($, Y) => {
      t.beginPath();
      let ht = !1;
      if (Y !== null)
        for (let V = 0; V <= b; V += 1) {
          const Kt = V / b * Math.PI * 2, C = this.projectUlysse31Point(
            Kt,
            Y,
            f,
            m,
            c,
            p,
            u,
            h,
            g
          );
          ht ? t.lineTo(C.x, C.y) : (t.moveTo(C.x, C.y), ht = !0);
        }
      else if ($ !== null)
        for (let V = 0; V <= v; V += 1) {
          const Kt = V / v * Math.PI * 2, C = this.projectUlysse31Point(
            $,
            Kt,
            f,
            m,
            c,
            p,
            u,
            h,
            g
          );
          ht ? t.lineTo(C.x, C.y) : (t.moveTo(C.x, C.y), ht = !0);
        }
      t.stroke();
    };
    for (let $ = 0; $ <= v; $ += 1)
      A(null, $ / v * Math.PI * 2);
    for (let $ = 0; $ < b; $ += 2)
      A($ / b * Math.PI * 2, null);
    t.globalAlpha = 0.45 + l * 0.35, t.lineWidth = Math.max(1, e / 520), t.beginPath(), t.ellipse(u, h, g * 0.34, g * 0.22, p * 0.18, 0, Math.PI * 2), t.stroke(), t.restore();
  }
  advanceUlysse31Rotation(t) {
    const e = performance.now();
    if (!this.ulysse31LastFrameAt)
      return this.ulysse31LastFrameAt = e, {
        rotX: this.ulysse31RotationX,
        rotY: this.ulysse31RotationY
      };
    const i = Math.min(Math.max((e - this.ulysse31LastFrameAt) / 1e3, 0), 0.1), s = Math.min(Math.max(t, 0), 1), n = Math.PI * 2;
    return this.ulysse31LastFrameAt = e, this.ulysse31RotationX = (this.ulysse31RotationX + i * (0.35 + s * 1.1)) % n, this.ulysse31RotationY = (this.ulysse31RotationY + i * (0.52 + s * 0.95)) % n, {
      rotX: this.ulysse31RotationX,
      rotY: this.ulysse31RotationY
    };
  }
  drawUlysse31Backdrop(t, e, i, s) {
    t.save(), t.strokeStyle = s, t.globalAlpha = 0.08, t.lineWidth = 1;
    for (let o = 0; o < i; o += Math.max(3, Math.floor(i / 28)))
      t.beginPath(), t.moveTo(0, o + 0.5), t.lineTo(e, o + 0.5), t.stroke();
    t.globalAlpha = 0.18;
    const n = 18;
    for (let o = 0; o < n; o += 1) {
      const r = o * 7919, l = r * 37 % 1e3 / 1e3 * e, c = r * 53 % 1e3 / 1e3 * i, p = 1 + r * 17 % 100 / 100;
      t.fillStyle = s, t.fillRect(l, c, p, p);
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
    const s = window.devicePixelRatio || 1, n = Math.max(1, Math.floor(i.width * s)), o = Math.max(1, Math.floor(i.height * s));
    (t.width !== n || t.height !== o) && (t.width = n, t.height = o), e.clearRect(0, 0, n, o), this.fillAudioVisualizationBackground(e, n, o), this.drawUlysse31Wireframe(e, n, o, 0), this.markBackgroundVisualizationReady(), !(!this.audioIsVisible || document.hidden) && (this.ulysse31AnimationFrame = window.requestAnimationFrame(() => this.drawUlysse31IdleFrame()));
  }
  cancelUlysse31Animation() {
    this.ulysse31AnimationFrame !== void 0 && (window.cancelAnimationFrame(this.ulysse31AnimationFrame), this.ulysse31AnimationFrame = void 0);
  }
  drawWaveform(t, e, i, s) {
    t.lineWidth = Math.max(2, e / 220), t.strokeStyle = getComputedStyle(t.canvas).color, t.beginPath();
    const n = e / s.length;
    for (let o = 0; o < s.length; o += 1) {
      const r = o * n, l = s[o] / 255 * i;
      o === 0 ? t.moveTo(r, l) : t.lineTo(r, l);
    }
    t.stroke();
  }
  drawIdleWaveform(t, e, i) {
    t.lineWidth = Math.max(2, e / 220), t.strokeStyle = getComputedStyle(t.canvas).color, t.beginPath(), t.moveTo(0, i / 2), t.lineTo(e, i / 2), t.stroke();
  }
  drawSpectrum(t, e, i, s) {
    const n = Math.max(1, e / 180), o = Math.max(2, e / s.length - n), r = getComputedStyle(t.canvas), l = r.color, c = r.borderTopColor, p = t.createLinearGradient(0, 0, 0, i);
    p.addColorStop(0, l), p.addColorStop(1, c || l), t.fillStyle = p, s.forEach((u, h) => {
      const g = Math.max(2, u / 255 * i), f = h * (o + n);
      t.fillRect(f, i - g, o, g);
    });
  }
  drawIdleSpectrum(t, e, i) {
    const s = getComputedStyle(t.canvas), n = 32, o = Math.max(1, e / 180), r = Math.max(2, e / n - o);
    t.fillStyle = s.borderTopColor || s.color, t.globalAlpha = 0.35;
    for (let l = 0; l < n; l += 1) {
      const c = l * (r + o);
      t.fillRect(c, i - 2, r, 2);
    }
    t.globalAlpha = 1;
  }
  drawAnimatedSpectrum(t, e, i, s, n) {
    const o = getComputedStyle(t.canvas), r = o.color, l = o.borderTopColor, c = t.createLinearGradient(0, 0, 0, i);
    c.addColorStop(0, r), c.addColorStop(1, l || r), t.fillStyle = c;
    const p = 34, u = Math.max(1, e / 180), h = Math.max(2, e / p - u);
    for (let g = 0; g < p; g += 1) {
      const f = 0.35 + 0.65 * Math.sin(g / (p - 1) * Math.PI), m = 0.72 + 0.28 * ((Math.sin(g * 1.7) + 1) / 2), b = 0.92 + 0.08 * Math.sin(n * Math.PI * 10), v = Math.max(3, i * (0.08 + s * f * m * b)), A = g * (h + u);
      t.fillRect(A, i - v, h, v);
    }
  }
  drawMeter(t, e, i, s) {
    const n = Math.sqrt(
      s.reduce((p, u) => {
        const h = (u - 128) / 128;
        return p + h * h;
      }, 0) / s.length
    ), o = Math.min(1, n * 2.4), r = i / 2, l = getComputedStyle(t.canvas);
    t.fillStyle = l.borderTopColor, t.globalAlpha = 0.25, t.fillRect(0, i * 0.28, e, i * 0.44), t.globalAlpha = 1, t.fillStyle = l.color;
    const c = Math.max(r, e * o);
    t.fillRect((e - c) / 2, i * 0.28, c, i * 0.44);
  }
  drawIdleMeter(t, e, i) {
    const s = getComputedStyle(t.canvas), n = i / 2;
    t.fillStyle = s.borderTopColor, t.globalAlpha = 0.25, t.fillRect(0, i * 0.28, e, i * 0.44), t.globalAlpha = 1, t.fillStyle = s.color;
    const o = Math.max(2, n * 0.18);
    t.fillRect((e - o) / 2, i * 0.28, o, i * 0.44);
  }
  drawGlow(t, e, i, s) {
    const n = getComputedStyle(t.canvas), o = n.color, r = n.borderTopColor || o, l = Math.min(1, Math.max(0, s)), c = e * 0.5, p = i * 0.5, u = Math.max(e, i) * (0.45 + l * 0.25), h = t.createRadialGradient(c, p, 0, c, p, u);
    h.addColorStop(0, this.withAlpha(o, 0.1 + l * 0.72)), h.addColorStop(0.52, this.withAlpha(r, 0.05 + l * 0.24)), h.addColorStop(1, "rgba(0, 0, 0, 0)"), t.fillStyle = h, t.fillRect(0, 0, e, i);
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
    t.stopPropagation(), this.resolvedPipelineId && z(this, this.hass, {}, {
      action: "navigate",
      navigation_path: `/config/voice-assistants/debug/${this.resolvedPipelineId}`
    });
  }
  getRunCount() {
    return Wt(this.config.run_count, tt.run_count, 1);
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
    var n, o, r, l, c, p;
    const e = t === "stt" ? "stt-vad-end" : `${t}-start`;
    let i = (o = (n = this.runModel) == null ? void 0 : n.events.find((u) => u.type === e)) == null ? void 0 : o.timestamp;
    t === "stt" && !i && (i = (l = (r = this.runModel) == null ? void 0 : r.events.find((u) => u.type === "stt-start")) == null ? void 0 : l.timestamp);
    const s = (p = (c = this.runModel) == null ? void 0 : c.events.find((u) => u.type === `${t}-end`)) == null ? void 0 : p.timestamp;
    return St(i, s);
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
    return {
      userText: this.maskText(t.conversation.userText),
      assistantText: this.maskText(t.conversation.assistantText)
    };
  }
  getConversationLoadingText(t, e) {
    return e ? t.stage === "stt" || t.stage === "intent" || t.stage === "tts" ? fi(t.stage) : fi("ready") : ea();
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
        va.has(e) ? "[masked]" : this.maskRaw(i)
      ])
    ) : t;
  }
  extractAssistantSpeech(t) {
    var e;
    return ((e = t.intent) == null ? void 0 : e.output) || "";
  }
  formatError(t) {
    return jt(t, { fallback: "Home Assistant rejected the debug request." });
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
    return t === "spectrum" || t === "meter" || t === "waveform" || t === "glow" || t === "ulysse31" ? t : tt.audio_visualization_type;
  }
  getAudioVisualizationPosition() {
    const t = this.config.audio_visualization_position;
    return t === "background" || t === "top" || t === "between" || t === "below_chat" ? t : tt.audio_visualization_position;
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
      "--assist-debug-audio-color": this.config.audio_visualization_color || (e ? ga : "var(--assist-debug-accent)"),
      "--assist-debug-audio-secondary-color": this.config.audio_visualization_secondary_color || "var(--assist-debug-secondary-text)",
      "--assist-debug-audio-background": this.config.audio_visualization_background || (e ? fa : "transparent"),
      "--assist-debug-audio-opacity": String(this.getAudioVisualizationOpacity())
    };
  }
};
q.nextAudioVisualizationId = 0, q.properties = {
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
}, q.styles = [
  es,
  is,
  _`
    ha-card {
      --assist-user-bubble: var(--assist-debug-user-chat);
      --assist-user-text: var(--assist-debug-user-chat-text);
      --assist-assistant-bubble: var(--assist-debug-assistant-chat);
      --assist-assistant-text: var(--assist-debug-assistant-chat-text);
      --assist-secondary-text: var(--assist-debug-secondary-text);
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
      font-size: 13px;
      line-height: 1.35;
    }

    .bubble.user {
      justify-self: end;
    }

    .bubble.assistant {
      justify-self: start;
    }

    .conversation-only {
      min-height: 68px;
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
  `
];
let Ct = q;
class ya extends Ct {
}
customElements.define("assist-debug-card", Ct);
customElements.get("conversation-debug-card") || customElements.define("conversation-debug-card", ya);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "assist-debug-card",
  name: "Assist Debug Card",
  description: "Modern debug view for Home Assistant Assist pipeline runs"
});
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { I: _a } = Cs, _i = (a) => a, wi = () => document.createComment(""), et = (a, t, e) => {
  var n;
  const i = a._$AA.parentNode, s = t === void 0 ? a._$AB : t._$AA;
  if (e === void 0) {
    const o = i.insertBefore(wi(), s), r = i.insertBefore(wi(), s);
    e = new _a(o, r, a, a.options);
  } else {
    const o = e._$AB.nextSibling, r = e._$AM, l = r !== a;
    if (l) {
      let c;
      (n = e._$AQ) == null || n.call(e, a), e._$AM = a, e._$AP !== void 0 && (c = a._$AU) !== r._$AU && e._$AP(c);
    }
    if (o !== s || l) {
      let c = e._$AA;
      for (; c !== o; ) {
        const p = _i(c).nextSibling;
        _i(i).insertBefore(c, s), c = p;
      }
    }
  }
  return e;
}, D = (a, t, e = a) => (a._$AI(t, e), a), wa = {}, xa = (a, t = wa) => a._$AH = t, $a = (a) => a._$AH, fe = (a) => {
  a._$AR(), a._$AA.remove();
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const xi = (a, t, e) => {
  const i = /* @__PURE__ */ new Map();
  for (let s = t; s <= e; s++) i.set(a[s], s);
  return i;
}, Sa = Di(class extends Pi {
  constructor(a) {
    if (super(a), a.type !== Mi.CHILD) throw Error("repeat() can only be used in text expressions");
  }
  dt(a, t, e) {
    let i;
    e === void 0 ? e = t : t !== void 0 && (i = t);
    const s = [], n = [];
    let o = 0;
    for (const r of a) s[o] = i ? i(r, o) : o, n[o] = e(r, o), o++;
    return { values: n, keys: s };
  }
  render(a, t, e) {
    return this.dt(a, t, e).values;
  }
  update(a, [t, e, i]) {
    const s = $a(a), { values: n, keys: o } = this.dt(t, e, i);
    if (!Array.isArray(s)) return this.ut = o, n;
    const r = this.ut ?? (this.ut = []), l = [];
    let c, p, u = 0, h = s.length - 1, g = 0, f = n.length - 1;
    for (; u <= h && g <= f; ) if (s[u] === null) u++;
    else if (s[h] === null) h--;
    else if (r[u] === o[g]) l[g] = D(s[u], n[g]), u++, g++;
    else if (r[h] === o[f]) l[f] = D(s[h], n[f]), h--, f--;
    else if (r[u] === o[f]) l[f] = D(s[u], n[f]), et(a, l[f + 1], s[u]), u++, f--;
    else if (r[h] === o[g]) l[g] = D(s[h], n[g]), et(a, s[u], s[h]), h--, g++;
    else if (c === void 0 && (c = xi(o, g, f), p = xi(r, u, h)), c.has(r[u])) if (c.has(r[h])) {
      const m = p.get(o[g]), b = m !== void 0 ? s[m] : null;
      if (b === null) {
        const v = et(a, s[u]);
        D(v, n[g]), l[g] = v;
      } else l[g] = D(b, n[g]), et(a, s[u], b), s[m] = null;
      g++;
    } else fe(s[h]), h--;
    else fe(s[u]), u++;
    for (; g <= f; ) {
      const m = et(a, l[f + 1]);
      D(m, n[g]), l[g++] = m;
    }
    for (; u <= h; ) {
      const m = s[u++];
      m !== null && fe(m);
    }
    return this.ut = o, xa(a, l), L;
  }
}), qt = 0.01, Aa = 0.02;
function Ca(a) {
  if (!a.length)
    return { rms: 0, peak: 0 };
  let t = 0, e = 0;
  for (let i = 0; i < a.length; i += 1) {
    const s = Math.abs(a[i]) / 32768;
    e = Math.max(e, s), t += s * s;
  }
  return {
    rms: Math.sqrt(t / a.length),
    peak: e
  };
}
function ka(a, t = qt) {
  if (!a.length)
    return !1;
  const { rms: e, peak: i } = Ca(a);
  return e >= t || i >= Aa;
}
const Ta = `
class RecorderProcessor extends AudioWorkletProcessor {
  process(inputList) {
    if (!inputList[0]?.length) {
      return true;
    }

    const float32Data = inputList[0][0];
    const int16Data = new Int16Array(float32Data.length);

    for (let index = 0; index < float32Data.length; index += 1) {
      const sample = Math.max(-1, Math.min(1, float32Data[index]));
      int16Data[index] = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
    }

    this.port.postMessage(int16Data);
    return true;
  }
}

registerProcessor("assist-recorder-worklet", RecorderProcessor);
`;
class P {
  constructor(t) {
    this.active = !1, this.onChunk = t;
  }
  getAnalyser() {
    return this.analyser;
  }
  static isInsecureConnection() {
    const { protocol: t, hostname: e } = window.location;
    return t === "https:" || t === "http:" && (e === "localhost" || e === "127.0.0.1" || e === "[::1]") ? !1 : t === "http:" ? !0 : !window.isSecureContext;
  }
  static isSupported() {
    return !!(!P.isInsecureConnection() && (window.AudioContext || window.webkitAudioContext));
  }
  async start() {
    var e;
    if (this.active)
      return;
    if (!((e = navigator.mediaDevices) != null && e.getUserMedia))
      throw new DOMException(
        "Microphone access is not available in this browser.",
        "NotSupportedError"
      );
    const t = window.AudioContext || window.webkitAudioContext;
    if (this.audioContext = new t(), this.sampleRate = this.audioContext.sampleRate, this.audioContext.state === "suspended" && await this.audioContext.resume(), this.stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: !0,
        noiseSuppression: !0,
        autoGainControl: !0
      }
    }), this.source = this.audioContext.createMediaStreamSource(this.stream), this.setupAnalyser(), await this.startWorkletRecorder()) {
      this.active = !0;
      return;
    }
    this.startScriptProcessorRecorder(), this.active = !0;
  }
  stop() {
    var t, e, i, s, n;
    !this.active && !this.stream && !this.processor && !this.worklet && !this.source || (this.active = !1, (t = this.processor) == null || t.disconnect(), (e = this.worklet) == null || e.disconnect(), (i = this.analyser) == null || i.disconnect(), (s = this.source) == null || s.disconnect(), this.processor = void 0, this.worklet = void 0, this.analyser = void 0, this.source = void 0, (n = this.stream) == null || n.getTracks().forEach((o) => o.stop()), this.stream = void 0);
  }
  async close() {
    this.stop(), this.audioContext && this.audioContext.state !== "closed" && await this.audioContext.close(), this.workletUrl && (URL.revokeObjectURL(this.workletUrl), this.workletUrl = void 0), this.audioContext = void 0, this.sampleRate = void 0;
  }
  setupAnalyser() {
    !this.audioContext || !this.source || (this.analyser = this.audioContext.createAnalyser(), this.analyser.fftSize = 64, this.source.connect(this.analyser));
  }
  async startWorkletRecorder() {
    if (!this.audioContext || !this.analyser || !this.audioContext.audioWorklet)
      return !1;
    try {
      return this.workletUrl = URL.createObjectURL(
        new Blob([Ta], { type: "application/javascript" })
      ), await this.audioContext.audioWorklet.addModule(this.workletUrl), this.worklet = new AudioWorkletNode(this.audioContext, "assist-recorder-worklet"), this.worklet.port.onmessage = (t) => {
        this.active && this.onChunk(t.data);
      }, this.analyser.connect(this.worklet), !0;
    } catch {
      return this.workletUrl && (URL.revokeObjectURL(this.workletUrl), this.workletUrl = void 0), this.worklet = void 0, !1;
    }
  }
  startScriptProcessorRecorder() {
    !this.audioContext || !this.analyser || (this.processor = this.audioContext.createScriptProcessor(4096, 1, 1), this.processor.onaudioprocess = (t) => {
      this.active && this.onChunk(this.toInt16(t.inputBuffer.getChannelData(0)));
    }, this.analyser.connect(this.processor), this.processor.connect(this.audioContext.destination));
  }
  toInt16(t) {
    const e = new Int16Array(t.length);
    for (let i = 0; i < t.length; i += 1) {
      const s = Math.max(-1, Math.min(1, t[i] || 0));
      e[i] = s < 0 ? s * 32768 : s * 32767;
    }
    return e;
  }
}
const me = 24, Ea = 3;
function za(a, t, e) {
  const i = e && e.length === t.frequencyBinCount ? e : new Uint8Array(t.frequencyBinCount);
  t.getByteFrequencyData(i);
  const s = a.getContext("2d"), n = a.getBoundingClientRect();
  if (!s || n.width === 0 || n.height === 0)
    return i;
  const o = window.devicePixelRatio || 1, r = Math.max(1, Math.floor(n.width * o)), l = Math.max(1, Math.floor(n.height * o));
  (a.width !== r || a.height !== l) && (a.width = r, a.height = l), s.clearRect(0, 0, r, l);
  const p = getComputedStyle(a).color, u = Math.max(1, r / 120), h = Math.max(2, r / me - u), g = l / 2;
  s.fillStyle = p;
  for (let f = 0; f < me; f += 1) {
    const m = Math.floor(f / me * i.length), b = i[m] / 255, v = Math.max(Ea, b * l * 0.85), A = f * (h + u);
    s.fillRect(A, g - v / 2, h, v);
  }
  return i;
}
class Ia {
  start(t, e) {
    this.stop();
    const i = () => {
      const s = e();
      s && (this.dataBuffer = za(t, s, this.dataBuffer)), this.frameId = window.requestAnimationFrame(i);
    };
    i();
  }
  stop() {
    this.frameId !== void 0 && (window.cancelAnimationFrame(this.frameId), this.frameId = void 0, this.dataBuffer = void 0);
  }
}
const La = 500, Ra = 12e4;
function $i(a) {
  return new URL(a, window.location.origin).toString();
}
function Va(a, t, e) {
  const i = t === "playing" || t === "buffering";
  return a.sawPlaying ? i ? a.initialContentId && e === a.initialContentId ? { state: a, step: "complete" } : { state: a, step: "continue" } : { state: a, step: "complete" } : i ? (a.initialState === "playing" || a.initialState === "buffering") && e === a.initialContentId ? { state: a, step: "continue" } : {
    state: { ...a, sawPlaying: !0 },
    step: "started"
  } : { state: a, step: "continue" };
}
class Ma {
  constructor(t) {
    this.onAudioEnded = t, this.remotePlaying = !1, this.remoteState = {
      sawPlaying: !1,
      initialState: null,
      initialContentId: null
    }, this.handleAudioEnded = () => {
      this.stopLocal(), this.onAudioEnded();
    }, this.handleUnload = () => {
      this.stopLocal();
    };
  }
  getAudioElement() {
    return this.audio;
  }
  isPlaying() {
    return !!(this.audio || this.remotePlaying);
  }
  startMicVisualizer(t, e) {
    t && (this.micVisualizer || (this.micVisualizer = new Ia()), this.micVisualizer.start(t, e));
  }
  stopMicVisualizer() {
    var t;
    (t = this.micVisualizer) == null || t.stop();
  }
  sendAudioChunk(t, e, i, s, n, o, r) {
    var h;
    const l = e.length === 0;
    let c = o;
    if (l) {
      if (!c)
        return { buffer: s, hasSpeech: c };
    } else {
      const g = ka(e, n);
      if (!c && !g)
        return { buffer: s, hasSpeech: c };
      g && (c = !0, r());
    }
    if (i == null)
      return { buffer: s ? [...s, e] : [e], hasSpeech: c };
    const p = (h = t == null ? void 0 : t.connection) == null ? void 0 : h.socket;
    if (!p)
      return { buffer: s, hasSpeech: c };
    p.binaryType = "arraybuffer";
    const u = new Uint8Array(1 + e.length * 2);
    return u[0] = i, u.set(new Uint8Array(e.buffer), 1), p.send(u), { buffer: s, hasSpeech: c };
  }
  flushAudioBuffer(t, e, i, s, n, o) {
    if (e)
      for (const r of e)
        this.sendAudioChunk(
          t,
          r,
          i,
          void 0,
          s,
          o,
          n
        );
  }
  playTts(t, e, i, s) {
    if (!(!e || !i)) {
      if (s) {
        this.playRemote(t, e, s);
        return;
      }
      this.playLocal(e);
    }
  }
  unload(t) {
    this.stopRemote(t), this.stopLocal();
  }
  playLocal(t) {
    this.stopRemote(), this.stopLocal(), this.audio = new Audio($i(t)), this.audio.addEventListener("ended", this.handleAudioEnded), this.audio.addEventListener("pause", this.handleUnload), this.audio.play().catch(() => {
      this.stopLocal();
    });
  }
  playRemote(t, e, i) {
    var o, r;
    if (this.stopRemote(), this.stopLocal(), !t)
      return;
    const s = (o = t.states) == null ? void 0 : o[i];
    this.remoteTarget = i, this.remotePlaying = !0, this.remoteHass = t, this.remoteState = {
      sawPlaying: !1,
      initialState: (s == null ? void 0 : s.state) ?? null,
      initialContentId: ((r = s == null ? void 0 : s.attributes) == null ? void 0 : r.media_content_id) ?? null
    };
    const n = $i(e);
    t.callService("media_player", "play_media", {
      entity_id: i,
      media_content_id: n,
      media_content_type: "music",
      announce: !0
    }).catch(() => {
      this.completeRemotePlayback();
    }), this.remotePollTimer = window.setInterval(() => {
      this.pollRemotePlayback();
    }, La), this.remoteSafetyTimer = window.setTimeout(() => {
      this.completeRemotePlayback();
    }, Ra);
  }
  pollRemotePlayback() {
    var s, n, o;
    if (!this.remotePlaying || !this.remoteTarget)
      return;
    const t = (n = (s = this.remoteHass) == null ? void 0 : s.states) == null ? void 0 : n[this.remoteTarget];
    if (!t)
      return;
    const { state: e, step: i } = Va(
      this.remoteState,
      t.state,
      (o = t.attributes) == null ? void 0 : o.media_content_id
    );
    this.remoteState = e, i === "complete" && this.completeRemotePlayback();
  }
  completeRemotePlayback() {
    this.remotePlaying && (this.clearRemoteTimers(), this.remoteTarget = void 0, this.remotePlaying = !1, this.remoteHass = void 0, this.remoteState = {
      sawPlaying: !1,
      initialState: null,
      initialContentId: null
    }, this.onAudioEnded());
  }
  stopRemote(t) {
    const e = this.remoteTarget;
    if (this.clearRemoteTimers(), this.remoteTarget = void 0, this.remotePlaying = !1, this.remoteHass = void 0, this.remoteState = {
      sawPlaying: !1,
      initialState: null,
      initialContentId: null
    }, !e)
      return;
    const i = t || this.remoteHass;
    i && i.callService("media_player", "media_stop", {
      entity_id: e
    });
  }
  clearRemoteTimers() {
    this.remotePollTimer !== void 0 && (window.clearInterval(this.remotePollTimer), this.remotePollTimer = void 0), this.remoteSafetyTimer !== void 0 && (window.clearTimeout(this.remoteSafetyTimer), this.remoteSafetyTimer = void 0);
  }
  stopLocal() {
    this.audio && (this.audio.removeEventListener("ended", this.handleAudioEnded), this.audio.removeEventListener("pause", this.handleUnload), this.audio.pause(), this.audio.removeAttribute("src"), this.audio = void 0);
  }
}
const Da = /* @__PURE__ */ new Set([
  "pending",
  "listening",
  "waiting",
  "thinking",
  "preparing"
]);
function ss(a) {
  return a.role === "assistant" && Da.has(a.status);
}
function Fe(a) {
  return a.status === "streaming" || a.status === "done" || a.status === "error";
}
function as(a) {
  return Object.values(a.stages).some((t) => t.status !== "idle") || a.toolCalls.length > 0;
}
function ns(a) {
  const t = a.stages.stt.status !== "idle", e = a.stages.intent.status !== "idle", i = a.stages.tts.status !== "idle";
  return t && !e && !i && a.toolCalls.length === 0;
}
function dt(a) {
  return a.role === "assistant" && a.status === "listening";
}
function Re(a) {
  return a.role !== "assistant" || a.status === "error" || dt(a) || !a.process || !ns(a.process) ? !1 : !a.text || a.status === "cancelled";
}
function B(a) {
  return a.some((t) => t.type === "run-end" || t.type === "error");
}
function Pa(a) {
  const t = a.some((i) => i.type === "intent-start"), e = a.some(
    (i) => i.type === "stt-start" || i.type === "stt-end" || i.type === "stt-vad-end"
  );
  return t && !e;
}
function os(a, t) {
  if (t.assistantText || t.errorText || !t.userText || !B(a))
    return !1;
  const e = a.some((s) => s.type === "intent-start"), i = a.some((s) => s.type === "intent-end");
  return e && !i;
}
function Na(a, t) {
  if (a.userText || B(t) || Pa(t))
    return !1;
  const { process: e } = a, i = t.some((r) => r.type === "stt-end"), s = t.some((r) => r.type === "stt-vad-end"), n = t.some((r) => r.type === "stt-start"), o = t.some(
    (r) => r.type === "wake_word-start" || r.type === "wake_word-end"
  );
  return i || s ? !1 : e.stage === "stt" || e.stages.stt.status === "running" || n || o || !!e.started && !t.some((r) => r.type === "intent-start");
}
function Ua(a, t, e) {
  return e || B(t) ? "pending" : sa(a.process.stage);
}
function Oa(a, t, e, i) {
  return a.userText || a.assistantText || a.errorText || a.thinking ? !0 : e ? i : ns(a.process) || B(t) ? !1 : as(a.process);
}
function Ha(a, t, e) {
  if (a.finished)
    return a.finished;
  const i = t[t.length - 1];
  return (i == null ? void 0 : i.timestamp) || e;
}
function Fa(a, t) {
  return t === null ? a : a.filter((e) => new Date(e.timestamp).getTime() > t);
}
function Ba(a, t) {
  const e = [];
  let i = null;
  const n = [...Fa(a, t.clearedAt)].sort(
    (o, r) => new Date(o.timestamp).getTime() - new Date(r.timestamp).getTime()
  );
  for (const [o, r] of n.entries()) {
    const l = r.events || [], c = r.conversation, p = Na(c, l), u = o === n.length - 1;
    c.conversationId && (i = c.conversationId), c.userText ? e.push({
      id: `${r.pipeline_run_id}-user`,
      role: "user",
      text: c.userText,
      status: "done",
      timestamp: r.timestamp
    }) : p && u && e.push({
      id: `${r.pipeline_run_id}-assistant-listening`,
      role: "assistant",
      text: "",
      status: "listening",
      process: c.process
    });
    const h = !B(l), g = os(l, c), f = c.assistantText || c.errorText || c.thinking, m = as(c.process) && !p, b = h && !p && !!c.userText && !c.errorText && !g;
    if (Oa(c, l, p, t.active) && (f || m || b)) {
      const v = c.errorText ? "error" : g ? "cancelled" : c.assistantText ? "done" : Ua(c, l, p);
      e.push({
        id: `${r.pipeline_run_id}-assistant`,
        role: "assistant",
        text: c.errorText || c.assistantText || "",
        status: v,
        timestamp: Ha(c.process, l, r.timestamp),
        thinking: g ? void 0 : c.thinking || void 0,
        process: c.process
      });
    }
  }
  return { messages: e, conversationId: i };
}
function Wa(a) {
  return a.map((t) => {
    const e = t.events || [], i = t.conversation, s = e[e.length - 1];
    return [
      t.pipeline_run_id,
      e.length,
      (s == null ? void 0 : s.type) || "",
      (s == null ? void 0 : s.timestamp) || "",
      i.userText,
      i.assistantText,
      i.errorText,
      i.thinking,
      os(e, i),
      i.process.stage,
      i.process.stages.stt.status,
      i.process.stages.intent.status,
      i.process.stages.tts.status,
      i.process.toolCalls.length
    ].join(":");
  }).join("|");
}
function Si(a) {
  return dt(a);
}
function be(a, t) {
  return !(a.persistLocal && t);
}
function ja(a, t) {
  const e = a[0], i = t.findIndex((s) => s.id === e.id);
  if (i !== -1)
    return i;
  if (!e.text)
    return -1;
  for (let s = t.length - 1; s >= 0; s--) {
    const n = t[s];
    if (n.role === e.role && n.text === e.text)
      return s;
  }
  return -1;
}
function Ai(a, t, e) {
  if (e)
    return a;
  const i = new Set(a.map((n) => n.id)), s = t.filter(
    (n) => n.persistLocal && !i.has(n.id)
  );
  return s.length ? [...a, ...s] : a;
}
function Ci(a, t) {
  const e = /* @__PURE__ */ new Map();
  for (let i = 0; i < t.length; i++) {
    const s = t[i];
    if (s.role !== "assistant" || s.status !== "cancelled")
      continue;
    const n = t[i - 1];
    if ((n == null ? void 0 : n.role) === "user") {
      const o = e.get(n.text) || [];
      o.push(s), e.set(n.text, o);
    }
  }
  return e.size ? a.map((i, s) => {
    if (i.role !== "assistant")
      return i;
    const n = a[s - 1];
    if ((n == null ? void 0 : n.role) !== "user")
      return i;
    const o = e.get(n.text);
    if (!(o != null && o.length) || Fe(i) && i.text)
      return i;
    const r = o.shift();
    return {
      ...i,
      text: r.text,
      status: "cancelled",
      thinking: void 0
    };
  }) : a;
}
function qa(a, t, e) {
  const { dropPersistLocal: i } = e;
  if (!a.length)
    return t.filter((r) => be(r, i));
  if (!t.length)
    return a;
  const s = ja(a, t);
  if (s === -1) {
    const r = new Set(t.map((l) => l.id));
    return Ai(
      Ci(
        [
          ...t.filter(
            (l) => be(l, i) && !Si(l)
          ),
          ...a.filter((l) => !r.has(l.id))
        ],
        t
      ),
      t,
      i
    );
  }
  const n = new Set(a.map((r) => r.id)), o = t.slice(0, s).filter(
    (r) => be(r, i) && !n.has(r.id) && !Si(r)
  );
  return Ai(
    Ci([...o, ...a], t),
    t,
    i
  );
}
function Ka(a) {
  return a.map((t) => {
    if (!(dt(t) || Re(t)))
      return t.role === "assistant" && ss(t) ? {
        ...t,
        status: "cancelled",
        thinking: void 0
      } : t;
  }).filter((t) => !!t);
}
function Ga(a, t) {
  return t && a === "running" ? "cancelled" : a;
}
function Ja(a, t, e) {
  try {
    const i = new Date(a);
    return t ? zs(i, t) : new Intl.DateTimeFormat(e || navigator.language, {
      hour: "2-digit",
      minute: "2-digit"
    }).format(i);
  } catch {
    return a;
  }
}
function Ya(a, t) {
  return ia(a, {
    listening: t.listening,
    thinking: t.thinking,
    preparing: t.preparing_reply,
    waiting: t.waiting_reply,
    cancelled: t.cancelled
  });
}
function Xa(a, t) {
  return !!(t && !Fe(a) && a.status !== "cancelled");
}
function Za(a, t, e) {
  return a.status === "cancelled" ? t ? e.thought_for_cancelled(t) : e.cancelled : Fe(a) ? t ? e.thought_for(t) : e.thought : e.thinking_summary;
}
function Qa(a, t) {
  const e = Ya(a.status, t), i = a.status === "listening";
  return d`
    <div class="loading-status">
      ${i ? ct() : ""}
      ${e ? d`<span>${e}</span>` : ""}
      ${i ? "" : ct()}
    </div>
  `;
}
function tn(a, t) {
  var i, s;
  if (a.role !== "assistant" || !a.thinking || a.status === "cancelled")
    return "";
  const e = St(
    (i = a.process) == null ? void 0 : i.stages.intent.started,
    (s = a.process) == null ? void 0 : s.stages.intent.ended
  );
  return d`
    <details class="thinking" ?open=${Xa(a, t.showThinkingUntilResponse)}>
      <summary>${Za(a, e, t.labels)}</summary>
      <pre class="thinking-content" @scroll=${t.onThinkingScroll}>${a.thinking}</pre>
    </details>
  `;
}
function en(a, t) {
  const e = t.formatToolCallJson(a.tool_args), i = t.formatToolCallJson(a.tool_result);
  return !(e || i) ? d`
      <span class="process-chip tool">
        <ha-icon icon="mdi:tools"></ha-icon>
        ${a.tool_name}
      </span>
    ` : d`
    <details class="tool-call-chip">
      <summary class="process-chip tool">
        <ha-icon icon="mdi:tools"></ha-icon>
        ${a.tool_name}
      </summary>
      <div class="tool-call-panel">
        ${e ? d`
              <div class="tool-call-section">
                <span class="tool-call-label">${t.labels.tool_arguments}</span>
                <pre>${e}</pre>
              </div>
            ` : ""}
        ${i ? d`
              <div class="tool-call-section">
                <span class="tool-call-label">${t.labels.tool_result}</span>
                <pre>${i}</pre>
              </div>
            ` : ""}
      </div>
    </details>
  `;
}
function sn(a, t) {
  if (!t.showProcess || !a.process)
    return "";
  const e = a.status === "cancelled", i = Object.values(a.process.stages).filter((n) => n.status !== "idle"), s = a.process.toolCalls.filter((n) => n.tool_name);
  return !i.length && !s.length ? "" : d`
    <div class="process">
      ${i.length ? d`
            <div class="process-stages">
              ${i.map((n) => {
    var c;
    const o = Ga(n.status, e), r = n.ended || (o === "cancelled" ? (c = a.process) == null ? void 0 : c.finished : void 0), l = St(n.started, r);
    return d`
                  <span class=${`process-chip ${o}`}>
                    <ha-icon icon=${Le(o)}></ha-icon>
                    ${n.label}${l ? d` · ${l}` : ""}
                  </span>
                `;
  })}
            </div>
          ` : ""}
      ${s.length ? d`
            <div class="process-tools">
              ${s.map((n) => en(n, t))}
            </div>
          ` : ""}
    </div>
  `;
}
function an(a, t) {
  const e = ss(a), i = a.status === "error" ? "bubble error-bubble" : a.status === "cancelled" ? "bubble cancelled-bubble" : e ? "bubble loading" : "bubble";
  return d`
    <div class=${a.role === "user" ? "message user" : "message assistant"}>
      <div class=${i}>
        ${tn(a, t)}
        ${e ? Qa(a, t.labels) : a.text ? a.status !== "error" && a.status !== "cancelled" ? d`<ha-markdown .content=${a.text}></ha-markdown>` : d`<span>${a.text}</span>` : a.status === "cancelled" ? d`<span>${t.labels.cancelled}</span>` : d`<div class="loading-status">${ct()}</div>`}
        ${a.process ? sn(a, t) : ""}
        ${t.showMessageTime && a.timestamp && !e ? d`<span class="message-time">${Ja(
    a.timestamp,
    t.locale,
    t.language
  )}</span>` : ""}
      </div>
    </div>
  `;
}
const rs = {
  title: "Assist",
  pipeline_id: "preferred",
  run_count: Ft,
  show_header: !0,
  text_input: !0,
  voice_input: !1,
  continue_conversation: !1,
  always_continue_conversation: !1,
  session_conversation: !0,
  disable_speech: !1,
  enable_audio_playback: !1,
  tts_media_player: "",
  speech_rms_threshold: qt,
  show_process: !0,
  show_thinking_until_response: !1,
  show_message_time: !1,
  suggested_prompts: "",
  show_suggested_prompts: !0,
  always_show_suggested_prompts: !1,
  background_color: "var(--card-background-color)",
  surface_color: "var(--secondary-background-color, #2b2b2b)",
  user_chat_color: `var(--primary-color, ${Ht})`,
  user_chat_text_color: "var(--text-primary-color, #ffffff)",
  assistant_chat_color: "var(--secondary-background-color, #2b2b2b)",
  assistant_chat_text_color: "var(--primary-text-color, #ffffff)"
}, nn = {
  background_color: "#1d1d1d",
  surface_color: "#2b2b2b",
  user_chat_color: Ht,
  user_chat_text_color: "#ffffff",
  assistant_chat_color: "#2b2b2b",
  assistant_chat_text_color: "#ffffff"
};
function xt(a) {
  return Array.isArray(a) ? a.map((t) => String(t).trim()).filter(Boolean).join(`
`) : typeof a == "string" ? a : "";
}
const it = rs, Pt = class Pt extends x {
  constructor() {
    super(...arguments), this.config = {}, this.pipelines = [], this.pipelinesLoading = !1, this.pipelineError = "", this.haComponentsVersion = 0;
  }
  /**
   * Keep the stored config as-is. Defaults are applied at read time via
   * `getValue` so the editor only ever emits keys the user actually set —
   * baking defaults in here is how card and editor previously diverged.
   */
  setConfig(t) {
    this.config = t || {};
  }
  getValue(t) {
    const e = this.config[t];
    return e === void 0 ? it[t] : e;
  }
  shouldUpdate(t) {
    return t.has("config") || t.has("pipelines") || t.has("pipelinesLoading") || t.has("pipelineError") || t.has("haComponentsVersion") ? !0 : t.has("hass") ? !t.get("hass") && !!this.hass : !1;
  }
  connectedCallback() {
    super.connectedCallback(), this.loadHomeAssistantPickers();
  }
  updated(t) {
    t.has("hass") && !t.get("hass") && this.loadPipelines();
  }
  render() {
    return d`
      <div class="editor">
        ${this.renderNonAdminNotice()}
        <div class="grid">
          ${F({
      label: "Title",
      value: String(this.config.title || ""),
      placeholder: it.title,
      onInput: (t) => this.updateConfigValue("title", t)
    })}
          ${this.renderCheckbox("Show header (title, pipeline, status)", "show_header")}
          ${this.renderPipelineField()}
          ${this.renderNumberInput("Recent runs", "run_count", it.run_count, 0, 20)}
        </div>

        <fieldset>
          <legend>Input</legend>
          ${this.renderCheckbox("Enable text input", "text_input")}
          ${this.renderCheckbox(
      "Keep conversation in this card only (like built-in Assist)",
      "session_conversation"
    )}
        </fieldset>

        <fieldset>
          <legend>Voice</legend>
          ${this.renderCheckbox("Enable voice input", "voice_input")}
          ${this.renderCheckbox("Enable audio playback", "enable_audio_playback")}
          <p class="hint">
            When enabled, runs the TTS pipeline stage and plays reply audio for text and voice input.
          </p>
          ${I({
      hass: this.hass,
      label: "TTS media player (optional)",
      value: String(this.config.tts_media_player || ""),
      domains: ["media_player"],
      disabled: !this.getValue("enable_audio_playback"),
      onValueChanged: (t) => this.updateConfigValue("tts_media_player", t)
    })}
          <p class="hint">
            When set, reply audio plays on this speaker instead of the browser. Useful for tablets
            that should hear responses on a room speaker.
          </p>
          ${this.renderCheckbox(
      "Continue listening for follow-up questions",
      "continue_conversation",
      !this.getValue("voice_input")
    )}
          ${this.renderCheckbox(
      "Always continue listening after replies",
      "always_continue_conversation",
      !this.getValue("voice_input")
    )}
          ${this.renderCheckbox("Disable speech controls", "disable_speech", !this.getValue("voice_input"))}
         
          ${this.renderFloatInput(
      "Speech RMS threshold",
      "speech_rms_threshold",
      qt,
      0,
      0.5,
      1e-3,
      !this.getValue("voice_input")
    )}
          <p class="hint">
            Minimum audio level (0–1) required before voice is sent for speech-to-text. Lower values
            pick up quieter speech; higher values ignore more background noise.
          </p>
        </fieldset>

        <fieldset>
          <legend>Prompts</legend>
          ${this.renderSuggestedPromptsField()}
          ${this.renderCheckbox("Show suggested prompts when chat is empty", "show_suggested_prompts")}
          ${this.renderCheckbox(
      "Always show suggested prompts",
      "always_show_suggested_prompts",
      !this.getValue("show_suggested_prompts")
    )}
        </fieldset>

        <fieldset>
          <legend>Process</legend>
          ${this.renderCheckbox("Show process and timings", "show_process")}
          ${this.renderCheckbox("Show thinking until response", "show_thinking_until_response")}
          ${this.renderCheckbox("Show message time", "show_message_time")}
        </fieldset>

        <fieldset>
          <legend>Style</legend>
          <div class="style-grid">
            ${this.renderColorInput("Background", "background_color")}
            ${this.renderColorInput("Surface", "surface_color")}
            ${this.renderColorInput("User bubble", "user_chat_color")}
            ${this.renderColorInput("User text", "user_chat_text_color")}
            ${this.renderColorInput("Assistant bubble", "assistant_chat_color")}
            ${this.renderColorInput("Assistant text", "assistant_chat_text_color")}
          </div>
          <p class="hint">
            Colors follow the active theme by default; picking a color overrides the theme for that
            element.
          </p>
        </fieldset>
      </div>
    `;
  }
  isNonAdminUser() {
    var t;
    return !!((t = this.hass) != null && t.user && !this.hass.user.is_admin);
  }
  renderNonAdminNotice() {
    return this.isNonAdminUser() ? d`
      <div class="notice" role="note">
        <strong>Limited for non-admin users</strong>
        <p>
          You are signed in without administrator access. Home Assistant only allows admins to use the
          Assist pipeline debug APIs (<code>assist_pipeline/pipeline_debug/*</code>).
        </p>
        <p>The following will not work on this card:</p>
        <ul>
          <li>Recent run history (<code>run_count</code>)</li>
          <li>Live updates from external or wake-word conversations</li>
          <li>Reloading past messages, thinking text, or process chips after a refresh</li>
        </ul>
        <p>The following still works:</p>
        <ul>
          <li>Live text chat in the current browser session</li>
          <li>Voice input and playback while you are actively using the card</li>
          <li>Thinking and process details for conversations you start yourself</li>
        </ul>
      </div>
    ` : "";
  }
  renderPipelineField() {
    const t = this.getValue("pipeline_id");
    return d`
      <label>
        <span>Pipeline</span>
        <select
          .value=${t}
          ?disabled=${this.pipelinesLoading}
          @change=${(e) => this.updateConfigValue("pipeline_id", e.target.value)}
        >
          <option value=${it.pipeline_id} ?selected=${t === it.pipeline_id}>
            Preferred pipeline
          </option>
          <option value="last_used" ?selected=${t === "last_used"}>Last used pipeline</option>
          ${this.pipelines.map(
      (e) => d`
              <option value=${e.id} ?selected=${t === e.id}>
                ${e.name || e.id}
              </option>
            `
    )}
        </select>
        ${this.pipelineError ? d`<small class="error">${this.pipelineError}</small> ` : ""}
      </label>
    `;
  }
  renderSuggestedPromptsField() {
    return d`
      ${we({
      hass: this.hass,
      label: "Suggested prompts (one per line)",
      fieldName: "suggested_prompts",
      value: xt(this.config.suggested_prompts),
      onValueChanged: (t) => this.updateConfigValue("suggested_prompts", t)
    })}
      <p class="hint">
        Supports Home Assistant templating (<a href="https://www.home-assistant.io/docs/templating/" target="_blank" rel="noopener noreferrer">docs</a>).
        Each rendered line becomes a prompt chip.
      </p>
    `;
  }
  async loadHomeAssistantPickers() {
    try {
      await Fi() && (this.haComponentsVersion += 1);
    } catch (t) {
      console.warn("assist-chat-card: Failed to load Home Assistant editor components", t);
    }
  }
  renderCheckbox(t, e, i = !1) {
    return Ue({
      label: t,
      checked: !!this.getValue(e),
      disabled: i,
      onChange: (s) => this.updateConfigValue(e, s)
    });
  }
  renderColorInput(t, e) {
    const i = nn[e] || "#000000";
    return d`
      <label>
        <span>${t}</span>
        <input
          type="color"
          .value=${Ot(String(this.config[e] || ""), i)}
          @change=${(s) => this.updateConfigValue(e, s.target.value)}
        />
      </label>
    `;
  }
  renderNumberInput(t, e, i, s, n) {
    const o = Number(this.getValue(e));
    return d`
      <label>
        <span>${t}</span>
        <input
          type="number"
          min=${String(s)}
          max=${String(n)}
          .value=${String(Number.isFinite(o) ? o : i)}
          @change=${(r) => this.updateNumberValue(e, r.target.value, i, s, n)}
        />
      </label>
    `;
  }
  renderFloatInput(t, e, i, s, n, o, r = !1) {
    const l = Number(this.getValue(e));
    return d`
      <label>
        <span>${t}</span>
        <input
          type="number"
          min=${String(s)}
          max=${String(n)}
          step=${String(o)}
          ?disabled=${r}
          .value=${String(Number.isFinite(l) ? l : i)}
          @change=${(c) => this.updateFloatValue(e, c.target.value, i, s, n)}
        />
      </label>
    `;
  }
  async loadPipelines() {
    if (!(!this.hass || this.pipelinesLoading)) {
      this.pipelinesLoading = !0, this.pipelineError = "";
      try {
        const t = await Bt(this.hass);
        this.pipelines = t.pipelines || [];
      } catch (t) {
        this.pipelineError = this.formatError(t);
      } finally {
        this.pipelinesLoading = !1;
      }
    }
  }
  updateConfigValue(t, e) {
    this.updateConfig({
      ...this.config,
      [t]: e
    });
  }
  updateNumberValue(t, e, i, s, n) {
    this.updateConfigValue(t, Hi(e, i, s, n));
  }
  updateFloatValue(t, e, i, s, n) {
    const o = Number(e), r = Number.isFinite(o) ? Math.min(Math.max(o, s), n) : i;
    this.updateConfigValue(t, r);
  }
  updateConfig(t) {
    this.config = t, S(this, "config-changed", { config: t });
  }
  formatError(t) {
    return jt(t, { fallback: "Unable to load pipelines." });
  }
};
Pt.properties = {
  hass: { attribute: !1 },
  config: { attribute: !1 },
  pipelines: { state: !0 },
  pipelinesLoading: { state: !0 },
  pipelineError: { state: !0 },
  haComponentsVersion: { state: !0 }
}, Pt.styles = [
  Fs,
  _`
    .style-grid {
      display: grid;
      gap: 12px;
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    textarea {
      min-height: 96px;
      resize: vertical;
    }

    input[type="color"] {
      padding: 4px;
    }

    input:disabled,
    select:disabled {
      cursor: default;
      opacity: 0.55;
    }

    small,
    .error {
      color: var(--error-color, #db4437);
      font-size: 11px;
      font-weight: 500;
    }

    .notice {
      background: rgba(var(--rgb-warning-color, 255, 166, 0), 0.12);
      border: 1px solid var(--warning-color, #ffa600);
      border-radius: 12px;
      color: var(--primary-text-color);
      display: grid;
      font-size: 12px;
      font-weight: 400;
      gap: 8px;
      line-height: 1.45;
      padding: 12px;
    }

    .notice strong {
      font-size: 13px;
      font-weight: 700;
    }

    .notice p {
      margin: 0;
    }

    .notice ul {
      margin: 0;
      padding-left: 18px;
    }

    .notice li + li {
      margin-top: 4px;
    }

    .notice code {
      font-size: 11px;
    }

    .hint a {
      color: var(--primary-color);
    }
  `
];
let Ve = Pt;
customElements.define("assist-chat-card-editor", Ve);
const w = rs, on = 1e3, rn = 3e4, ln = 400, cn = 48, dn = {
  listening: { fallback: "Listening..." },
  thinking: { fallback: "Thinking..." },
  preparing_reply: { fallback: "Preparing reply..." },
  waiting_reply: { fallback: "Waiting for reply..." },
  cancelled: { fallback: "Cancelled" },
  start_listening: { fallback: "Start listening" },
  stop_listening: { fallback: "Stop listening" },
  cancel: { fallback: "Cancel" },
  clear_conversation: { fallback: "Clear conversation" },
  dismiss: { fallback: "Dismiss" },
  conversation: { fallback: "Conversation" },
  status_idle: { fallback: "Idle" },
  status_listening: { fallback: "Listening" },
  status_thinking: { fallback: "Thinking" },
  listening_for_speech: { fallback: "Listening for speech" },
  preferred_pipeline: { fallback: "Preferred pipeline" },
  thinking_summary: { fallback: "Thinking" },
  thought: { fallback: "Thought" },
  thought_for: { fallback: "Thought for {duration}" },
  thought_for_cancelled: { fallback: "Thought for {duration} (cancelled)" },
  tool_arguments: { fallback: "Arguments" },
  tool_result: { fallback: "Result" },
  follow_up_hint: {
    fallback: "Follow-up questions after voice replies require an LLM conversation agent (OpenAI, Ollama, etc.). The built-in Home Assistant agent supports single-turn commands only."
  },
  no_pipeline: { fallback: "No Assist pipeline is available." },
  voice_requires_stt: {
    fallback: "Voice input requires an Assist pipeline with speech-to-text configured."
  },
  voice_not_supported: { fallback: "Voice input is not supported in this browser." },
  run_failed: { fallback: "Assist run failed." },
  request_rejected: { fallback: "Home Assistant rejected the Assist request." },
  mic_denied: {
    fallback: "Microphone access was denied. Allow microphone permission for Home Assistant in your device settings."
  },
  mic_not_found: { fallback: "No microphone was found on this device." },
  mic_https: {
    haKey: "ui.dialogs.voice_command.not_supported_microphone_browser",
    fallback: "Your connection to Home Assistant is not secured using HTTPS. This causes browsers to block Home Assistant from accessing the microphone."
  },
  mic_docs_link: {
    haKey: "ui.dialogs.voice_command.not_supported_microphone_documentation_link",
    fallback: "the documentation"
  },
  mic_docs: {
    haKey: "ui.dialogs.voice_command.not_supported_microphone_documentation",
    fallback: "Use the Home Assistant app or visit {documentation_link} to learn how to use a secure URL"
  },
  how_can_i_help: {
    haKey: "ui.dialogs.voice_command.how_can_i_help",
    fallback: "How can I help?"
  },
  input_placeholder: {
    haKey: "ui.dialogs.voice_command.input_text",
    fallback: "Ask Nabu"
  }
}, Nt = class Nt extends R {
  constructor() {
    super(...arguments), this.pipelines = [], this.resolvedPipelineId = "", this.messages = [], this.inputValue = "", this.processing = !1, this.listening = !1, this.loadingPipelines = !1, this.loadingHistory = !1, this.error = "", this.conversationId = null, this.audioController = new Ma(() => {
      this.maybeContinueConversationAfterRun();
    }), this.chatLogAccumulator = yt(), this.continueConversationAfterRun = !1, this.stickToBottom = !0, this.stickThinkingToBottom = !0, this.loadToken = 0, this.lastHistoryKey = "", this.lastRunsSnapshot = "", this.conversationClearedAt = null, this.lastSeenRunTimestamp = 0, this.hasInProgressHistoryRun = !1, this.historyDisabled = !1, this.historyErrorLogged = !1, this.runCache = new Qi(), this.followUpHintDismissed = na(), this.httpsWarningDismissed = !1, this.suggestedPrompts = [], this.voiceInputHasSpeech = !1, this.userStartedRecordingOnce = !1, this.cardStyles = {}, this.handleSuggestedPromptsChanged = (t) => {
      this.suggestedPrompts = t.detail.lines;
    }, this.handleMessagesScroll = (t) => {
      const e = t.currentTarget;
      this.stickToBottom = this.isNearBottom(e);
    }, this.handleThinkingScroll = (t) => {
      const e = t.currentTarget, i = this.renderRoot.querySelectorAll(".thinking-content"), s = i[i.length - 1];
      e === s && (this.stickThinkingToBottom = this.isNearBottom(e));
    }, this.handleVisibilityChange = () => {
      document.hidden ? this.clearConversationRefreshTimer() : this.syncConversationRefreshTimer();
    }, this.handleDismissFollowUpHint = () => {
      oa(), this.followUpHintDismissed = !0;
    };
  }
  static getConfigElement() {
    return document.createElement("assist-chat-card-editor");
  }
  static getStubConfig() {
    return {
      title: w.title,
      pipeline_id: w.pipeline_id,
      text_input: w.text_input,
      voice_input: w.voice_input,
      show_process: w.show_process
    };
  }
  setConfig(t) {
    this.config = {
      ...w,
      ...t,
      suggested_prompts: xt(t.suggested_prompts)
    }, this.cardStyles = {
      "--assist-chat-background": this.config.background_color || w.background_color,
      "--assist-chat-surface": this.config.surface_color || w.surface_color,
      "--assist-chat-user-bubble": this.config.user_chat_color || w.user_chat_color,
      "--assist-chat-user-text": this.config.user_chat_text_color || w.user_chat_text_color,
      "--assist-chat-assistant-bubble": this.config.assistant_chat_color || w.assistant_chat_color,
      "--assist-chat-assistant-text": this.config.assistant_chat_text_color || w.assistant_chat_text_color
    };
  }
  connectedCallback() {
    super.connectedCallback(), document.addEventListener("visibilitychange", this.handleVisibilityChange), this.scheduleScrollToEnd(3, !0), this.syncConversationRefreshTimer();
  }
  disconnectedCallback() {
    var t;
    super.disconnectedCallback(), document.removeEventListener("visibilitychange", this.handleVisibilityChange), this.scrollFrame !== void 0 && (window.cancelAnimationFrame(this.scrollFrame), this.scrollFrame = void 0), this.stopMicVisualizer(), this.clearConversationRefreshTimer(), this.stopActiveRun(), (t = this.audioRecorder) == null || t.close(), this.audioController.unload(this.hass);
  }
  shouldUpdate(t) {
    return this.shouldUpdateNonEntityCard(t, [
      "pipelines",
      "resolvedPipelineId",
      "messages",
      "inputValue",
      "processing",
      "listening",
      "loadingPipelines",
      "loadingHistory",
      "error",
      "followUpHintDismissed",
      "httpsWarningDismissed",
      "suggestedPrompts"
    ]);
  }
  updated(t) {
    if (t.has("messages") && this.scheduleScrollToEnd(), !this.hass || !this.config)
      return;
    const e = t.has("hass") && !t.get("hass");
    (e || t.has("config") || t.has("resolvedPipelineId") || t.has("processing") || t.has("listening")) && this.syncConversationRefreshTimer(), (e || t.has("config")) && (this.loadPipelines(), xt(this.config.suggested_prompts) || (this.suggestedPrompts = [])), t.has("listening") && (this.listening ? this.updateComplete.then(() => this.startMicVisualizer()) : this.stopMicVisualizer());
  }
  render() {
    const t = this.isVoicePipelineConfigured(), e = this.needsHttpsForVoice();
    return d`
      <ha-card style=${J(this.cardStyles)}>
        <div class="card">
          ${this.renderHeader()}
          ${this.renderCapabilityHint()}
          ${this.renderMessages()}
          ${this.renderSuggestedPrompts()}
          ${this.renderSuggestedPromptsTemplateListener()}
          ${this.error ? d`<div class="error" role="alert">${this.error}</div>` : ""}
          <form class="input-row" @submit=${this.handleSubmit}>
            ${this.config.voice_input ? d`
                  <button
                    class=${this.listening ? "icon-button listening" : "icon-button"}
                    type="button"
                    title=${e ? this.getMicrophoneNotSupportedText().split(`

`)[0] : this.listening ? this.text("stop_listening") : this.text("start_listening")}
                    aria-label=${this.listening ? this.text("stop_listening") : this.text("start_listening")}
                    ?disabled=${!this.listening && this.processing || !t}
                    @click=${this.handleListeningClick}
                  >
                    <ha-icon icon=${this.listening ? "mdi:microphone" : "mdi:microphone-outline"}></ha-icon>
                  </button>
                ` : ""}
            ${this.listening ? this.renderListeningVisualizer() : this.config.text_input ? d`
                    <input
                      .value=${this.inputValue}
                      placeholder=${this.getInputPlaceholder()}
                      aria-label=${this.getInputPlaceholder()}
                      @input=${this.handleInput}
                    />
                    <button
                      class="send-button"
                      type="submit"
                      ?disabled=${this.processing || !this.inputValue.trim()}
                    >
                      <ha-icon icon="mdi:send"></ha-icon>
                    </button>
                  ` : ""}
            ${this.processing ? d`
                  <button
                    class="icon-button cancel-button"
                    type="button"
                    title=${this.text("cancel")}
                    aria-label=${this.text("cancel")}
                    @click=${this.cancelActiveRun}
                  >
                    <ha-icon icon="mdi:stop"></ha-icon>
                  </button>
                ` : ""}
            ${this.messages.length && !this.processing ? d`
                  <button
                    class="icon-button"
                    type="button"
                    title=${this.text("clear_conversation")}
                    aria-label=${this.text("clear_conversation")}
                    @click=${this.clearConversation}
                  >
                    <ha-icon icon="mdi:close-circle-outline"></ha-icon>
                  </button>
                ` : ""}
          </form>
        </div>
      </ha-card>
    `;
  }
  renderHeader() {
    if (this.config.show_header === !1)
      return "";
    const t = this.config.title || w.title, e = this.getPipelineName(this.resolvedPipelineId), i = this.getCardStatus();
    return d`
      <header class="header">
        <div class="header-text">
          <h2 class="header-title">${t}</h2>
          <p class="header-pipeline">
            ${e || this.resolvedPipelineId || this.text("preferred_pipeline")}
          </p>
        </div>
        <span class=${`status-pill ${i}`} role="status">${this.getCardStatusLabel(i)}</span>
      </header>
    `;
  }
  renderCapabilityHint() {
    return this.followUpHintDismissed || !this.shouldOfferFollowUpConversation() || !this.config.voice_input || !ca(this.getActivePipeline()) ? "" : d`
      <div class="info-banner" role="note">
        <span>${this.text("follow_up_hint")}</span>
        <button
          class="icon-button dismiss-button"
          type="button"
          title=${this.text("dismiss")}
          aria-label=${this.text("dismiss")}
          @click=${this.handleDismissFollowUpHint}
        >
          <ha-icon icon="mdi:close"></ha-icon>
        </button>
      </div>
    `;
  }
  renderSuggestedPromptsTemplateListener() {
    const t = xt(this.config.suggested_prompts);
    return t ? d`
      <ha-cards-template-text
        class="template-listener"
        .hass=${this.hass}
        .template=${t}
        .fallback=${t}
        ?multiline=${!0}
        @lines-changed=${this.handleSuggestedPromptsChanged}
      ></ha-cards-template-text>
    ` : "";
  }
  renderSuggestedPrompts() {
    const t = this.suggestedPrompts;
    return this.config.show_suggested_prompts === !1 || !t.length || this.messages.length && !this.config.always_show_suggested_prompts ? "" : d`
      <div class="suggested-prompts">
        ${t.map(
      (e, i) => d`
            <button
              class="prompt-chip"
              type="button"
              data-index=${i}
              ?disabled=${this.processing || this.listening}
              @click=${this.handleSuggestedPromptClick}
            >
              ${e}
            </button>
          `
    )}
      </div>
    `;
  }
  renderMessages() {
    return this.messages.length ? d`
      <div
        class="messages"
        role="log"
        aria-live="polite"
        aria-busy=${this.processing ? "true" : "false"}
        aria-label=${this.text("conversation")}
        @scroll=${this.handleMessagesScroll}
      >
        ${Sa(
      this.messages,
      (t) => t.id,
      (t) => this.renderMessage(t)
    )}
      </div>
    ` : d`
        <div class="messages" role="log" aria-live="polite" aria-label=${this.text("conversation")}>
          <div class="empty-state">
            <ha-icon icon="mdi:message-processing-outline"></ha-icon>
            <span>${this.text("how_can_i_help")}</span>
          </div>
        </div>
      `;
  }
  getRenderContext() {
    var t, e, i;
    return {
      showProcess: !!this.config.show_process,
      showMessageTime: !!this.config.show_message_time,
      showThinkingUntilResponse: !!this.config.show_thinking_until_response,
      locale: (t = this.hass) == null ? void 0 : t.locale,
      language: (i = (e = this.hass) == null ? void 0 : e.locale) == null ? void 0 : i.language,
      labels: {
        cancelled: this.text("cancelled"),
        listening: this.text("listening"),
        thinking: this.text("thinking"),
        preparing_reply: this.text("preparing_reply"),
        waiting_reply: this.text("waiting_reply"),
        thought_for_cancelled: (s) => this.text("thought_for_cancelled", { duration: s }),
        thought_for: (s) => this.text("thought_for", { duration: s }),
        thought: this.text("thought"),
        thinking_summary: this.text("thinking_summary"),
        tool_arguments: this.text("tool_arguments"),
        tool_result: this.text("tool_result")
      },
      formatToolCallJson: (s) => this.formatToolCallJson(s),
      onThinkingScroll: this.handleThinkingScroll
    };
  }
  renderMessage(t) {
    return an(t, this.getRenderContext());
  }
  isNearBottom(t, e = cn) {
    return t.scrollHeight - t.scrollTop - t.clientHeight <= e;
  }
  scheduleScrollToEnd(t = 3, e = !1) {
    if (!e && !this.stickToBottom && !this.stickThinkingToBottom)
      return;
    this.scrollFrame !== void 0 && (window.cancelAnimationFrame(this.scrollFrame), this.scrollFrame = void 0);
    const i = (s) => {
      this.scrollFrame = window.requestAnimationFrame(() => {
        this.scrollFrame = void 0, (e || this.stickToBottom) && this.scrollMessagesToEnd(), (e || this.stickThinkingToBottom) && this.scrollThinkingToEnd(), s > 0 && i(s - 1);
      });
    };
    i(t);
  }
  scrollMessagesToEnd() {
    const t = this.renderRoot.querySelector(".messages");
    t && (t.scrollTop = t.scrollHeight);
  }
  scrollThinkingToEnd() {
    const t = this.renderRoot.querySelectorAll(".thinking-content"), e = t[t.length - 1];
    e && (e.scrollTop = e.scrollHeight);
  }
  handleInput(t) {
    this.inputValue = t.target.value;
  }
  handleSubmit(t) {
    t.preventDefault();
    const e = this.inputValue.trim();
    !e || this.processing || this.listening || (this.inputValue = "", this.processText(e), this.updateComplete.then(() => this.focusTextInput()));
  }
  focusTextInput() {
    var t;
    !this.config.text_input || this.listening || (t = this.renderRoot.querySelector(".input-row input")) == null || t.focus();
  }
  async processText(t) {
    const e = await this.ensurePipeline();
    if (!e || !this.hass)
      return;
    this.stopActiveRun(), this.error = "", this.processing = !0, this.chatLogAccumulator = yt(), this.continueConversationAfterRun = !1, this.stickToBottom = !0, this.stickThinkingToBottom = !0, this.addMessage({ role: "user", text: t, status: "done" });
    const i = this.addMessage({
      role: "assistant",
      text: "",
      status: "pending",
      process: _t()
    });
    mi(e.id);
    try {
      const s = await bi(
        this.hass,
        (n) => this.handleRunEvent(n, i),
        {
          start_stage: "intent",
          end_stage: this.getPipelineEndStage(),
          input: { text: t },
          pipeline: e.id,
          conversation_id: this.conversationId
        }
      );
      this.activeUnsubscribe = s;
    } catch (s) {
      this.setAssistantError(i, this.formatError(s)), this.processing = !1;
    }
  }
  handleListeningClick(t) {
    t.preventDefault(), t.stopPropagation(), this.toggleListening();
  }
  async toggleListening() {
    if (this.listening) {
      this.stopListening();
      return;
    }
    if (!this.isVoicePipelineConfigured()) {
      this.error = this.text("voice_requires_stt");
      return;
    }
    if (P.isInsecureConnection()) {
      this.httpsWarningDismissed = !1, this.showMicrophoneNotSupportedMessage();
      return;
    }
    if (!P.isSupported()) {
      this.error = this.text("voice_not_supported");
      return;
    }
    await this.startListening(!0);
  }
  async startListening(t = !1) {
    var o;
    if (this.processing || !this.supportsVoiceInput())
      return;
    t && (this.userStartedRecordingOnce = !0);
    const e = await this.ensurePipeline();
    if (!e || !this.hass)
      return;
    this.stopActiveRun(), this.audioController.unload(this.hass), this.error = "", this.processing = !0, this.listening = !0, this.chatLogAccumulator = yt(), this.continueConversationAfterRun = !1, this.audioBuffer = [], this.voiceInputHasSpeech = !1, this.sttBinaryHandlerId = void 0, this.stickToBottom = !0, this.stickThinkingToBottom = !0;
    let i, s = _t();
    this.removeListeningPlaceholder();
    const n = this.addMessage({
      role: "assistant",
      text: "",
      status: "listening",
      process: s
    });
    mi(e.id);
    try {
      (o = this.audioRecorder) == null || o.close(), this.audioRecorder = new P((l) => this.sendAudioChunk(l)), await this.audioRecorder.start();
      const r = await bi(
        this.hass,
        (l) => {
          var c, p, u, h, g, f, m;
          if (s = this.applyProcessEvent(s, l), n.process = s, l.type === "stt-end") {
            this.removeListeningPlaceholder();
            const b = String(((p = (c = l.data) == null ? void 0 : c.stt_output) == null ? void 0 : p.text) || "").trim();
            b && (this.addMessage({ role: "user", text: b, status: "done" }), i = this.addMessage({
              role: "assistant",
              text: "",
              status: "pending",
              process: s
            }));
          }
          i ? this.handleRunEvent(l, i) : l.type === "run-end" ? (this.removeUnprocessedSttMessages(), this.finishRun()) : l.type === "error" ? (this.removeUnprocessedSttMessages(), this.error = String(((u = l.data) == null ? void 0 : u.message) || this.text("run_failed")), this.finishRun()) : this.messages = [...this.messages], l.type === "run-start" ? (this.sttBinaryHandlerId = (g = (h = l.data) == null ? void 0 : h.runner_data) == null ? void 0 : g.stt_binary_handler_id, this.playTtsAudio((m = (f = l.data) == null ? void 0 : f.tts_output) == null ? void 0 : m.url)) : l.type === "stt-start" ? this.flushAudioBuffer() : l.type === "stt-vad-end" ? this.sendSpeechEndChunk() : l.type === "stt-end" && (this.sttBinaryHandlerId = void 0, this.stopListening(!1));
        },
        {
          start_stage: "stt",
          end_stage: this.getPipelineEndStage(),
          input: { sample_rate: this.audioRecorder.sampleRate || 16e3 },
          pipeline: e.id,
          conversation_id: this.conversationId
        }
      );
      this.activeUnsubscribe = r;
    } catch (r) {
      this.error = this.formatError(r), this.stopListening(!1), this.processing = !1;
    }
  }
  handleRunEvent(t, e) {
    var i, s, n, o, r, l, c, p;
    e.process = this.applyProcessEvent(e.process, t), t.type === "intent-progress" && ((i = t.data) != null && i.chat_log_delta) ? this.applyIntentDelta(e, t.data.chat_log_delta) : t.type === "intent-end" ? (this.conversationId = ((n = (s = t.data) == null ? void 0 : s.intent_output) == null ? void 0 : n.conversation_id) || this.conversationId, this.continueConversationAfterRun = !!((r = (o = t.data) == null ? void 0 : o.intent_output) != null && r.continue_conversation), this.applyIntentEnd(e, t), this.getPipelineEndStage() === "intent" && this.finishRun()) : t.type === "tts-end" ? this.playTtsAudio((c = (l = t.data) == null ? void 0 : l.tts_output) == null ? void 0 : c.url) : t.type === "run-end" ? this.finishRun() : t.type === "error" && (this.setAssistantError(e, String(((p = t.data) == null ? void 0 : p.message) || this.text("run_failed"))), this.finishRun()), this.messages = [...this.messages];
  }
  applyIntentDelta(t, e) {
    var i;
    this.chatLogAccumulator.assistantText = t.text || "", this.chatLogAccumulator.thinking = t.thinking || "", this.chatLogAccumulator.toolCalls = ((i = t.process) == null ? void 0 : i.toolCalls) || [], qi(this.chatLogAccumulator, e), this.chatLogAccumulator.assistantText && (t.text = this.chatLogAccumulator.assistantText, t.status = "streaming"), this.chatLogAccumulator.thinking && (t.thinking = this.chatLogAccumulator.thinking, this.chatLogAccumulator.assistantText || (t.status = "thinking")), t.process && (t.process.toolCalls = this.chatLogAccumulator.toolCalls);
  }
  applyIntentEnd(t, e) {
    var n, o;
    const i = (n = e.data) == null ? void 0 : n.intent_output, s = Oe(i);
    s && (t.text = s, t.status = ((o = i == null ? void 0 : i.response) == null ? void 0 : o.response_type) === "error" ? "error" : "done");
  }
  applyProcessEvent(t, e) {
    const i = Zi(t || _t());
    return Xi(i, e), i;
  }
  async ensurePipeline() {
    if (!this.hass)
      return;
    (!this.pipelines.length || !this.resolvedPipelineId) && await this.loadPipelines();
    const t = this.getActivePipeline();
    if (!t) {
      this.error = this.text("no_pipeline");
      return;
    }
    return t;
  }
  async loadPipelines(t = !1) {
    if (!this.hass || this.loadingPipelines)
      return;
    const e = ++this.loadToken;
    this.loadingPipelines = !0;
    try {
      const i = await Bt(this.hass);
      if (e !== this.loadToken)
        return;
      this.pipelines = i.pipelines || [];
      const s = Ji(this.config.pipeline_id, i);
      this.resolvedPipelineId = s, this.error = "", s ? await this.loadRecentHistory(s, e, t) : !this.processing && !this.listening && (this.messages = [], this.conversationId = null);
    } catch (i) {
      e === this.loadToken && (this.error = this.formatError(i));
    } finally {
      e === this.loadToken && (this.loadingPipelines = !1);
    }
  }
  /**
   * Best-effort history refresh. Returns false when the fetch failed in a
   * retryable way (drives poll backoff). History errors never surface in the
   * user-facing error slot — that is reserved for the user's own actions.
   */
  async loadRecentHistory(t, e = this.loadToken, i = !1, s = this.messages, n = !1) {
    if (!this.hass || this.processing || this.listening || this.historyDisabled)
      return !0;
    const o = `${t}:${this.getHistoryRunCount()}`;
    if (!i && o === this.lastHistoryKey)
      return !0;
    this.loadingHistory = !0;
    try {
      const r = await this.fetchRunsWithCache(t, this.getHistoryRunCount());
      if (e !== this.loadToken)
        return !0;
      this.historyErrorLogged = !1;
      for (const g of r) {
        const f = new Date(g.timestamp).getTime();
        Number.isFinite(f) && f > this.lastSeenRunTimestamp && (this.lastSeenRunTimestamp = f);
      }
      const l = Wa(r), c = l !== this.lastRunsSnapshot;
      if (this.hasInProgressHistoryRun = r.some((g) => !B(g.events || [])), !c && !n)
        return this.lastHistoryKey = o, this.scheduleInProgressHistoryPoll(), !0;
      const { messages: p, conversationId: u } = Ba(r, {
        active: this.processing || this.listening,
        clearedAt: this.conversationClearedAt
      }), h = n ? qa(p, s, {
        dropPersistLocal: this.httpsWarningDismissed
      }) : p;
      return this.processing || this.listening || (this.messages = h.filter((g) => !Re(g)), this.conversationId = this.resolveConversationId(u, n), this.lastRunsSnapshot = l, this.lastHistoryKey = o, this.scheduleInProgressHistoryPoll()), !0;
    } catch (r) {
      return e !== this.loadToken ? !0 : (this.lastHistoryKey = "", da(r) ? (this.historyDisabled = !0, this.clearConversationRefreshTimer(), !0) : (this.historyErrorLogged || (console.warn("assist-chat-card: failed to load Assist history", r), this.historyErrorLogged = !0), !1));
    } finally {
      e === this.loadToken && (this.loadingHistory = !1);
    }
  }
  /**
   * Fetch recent debug runs, re-downloading details only for runs that are
   * new or still in progress. Finished runs are immutable and served from
   * cache, so a steady-state poll costs one `list` call.
   */
  async fetchRunsWithCache(t, e) {
    return this.hass ? pa(this.hass, t, e, this.runCache, B) : [];
  }
  removeListeningPlaceholder() {
    const t = this.messages.filter((e) => !dt(e));
    t.length !== this.messages.length && (this.messages = t);
  }
  removeUnprocessedSttMessages() {
    const t = this.messages.filter(
      (e) => !dt(e) && !Re(e)
    );
    t.length !== this.messages.length && (this.messages = t);
  }
  getHistoryPollController() {
    return this.historyPollController || (this.historyPollController = new Bi({
      intervalMs: on,
      maxBackoffMs: rn,
      shouldPoll: () => this.shouldLiveRefresh(),
      onPoll: async () => this.resolvedPipelineId ? this.loadRecentHistory(
        this.resolvedPipelineId,
        this.loadToken,
        !0,
        this.messages,
        !0
      ) : !0
    })), this.historyPollController;
  }
  syncConversationRefreshTimer() {
    if (!this.shouldLiveRefresh()) {
      this.clearConversationRefreshTimer();
      return;
    }
    const t = this.getHistoryPollController();
    t.reset(), t.sync();
  }
  shouldLiveRefresh() {
    return !!(this.hass && this.resolvedPipelineId && !this.processing && !this.listening && !this.historyDisabled && this.isConnected && !document.hidden);
  }
  clearConversationRefreshTimer() {
    var t;
    (t = this.historyPollController) == null || t.stop();
  }
  scheduleInProgressHistoryPoll() {
    var t;
    !this.hasInProgressHistoryRun || !this.shouldLiveRefresh() || (t = this.historyPollController) == null || t.requestSoon(ln);
  }
  getActivePipeline() {
    return this.pipelines.find((t) => t.id === this.resolvedPipelineId);
  }
  getPipelineEndStage() {
    const t = this.getActivePipeline();
    return !this.config.enable_audio_playback || !(t != null && t.tts_engine) ? "intent" : "tts";
  }
  renderListeningVisualizer() {
    return d`
      <div
        class="listening-visualizer"
        aria-live="polite"
        aria-label=${this.text("listening_for_speech")}
      >
        <span class="listening-dot" aria-hidden="true"></span>
        <span class="listening-label">${this.text("status_listening")}</span>
        <canvas class="listening-visualizer-canvas"></canvas>
      </div>
    `;
  }
  startMicVisualizer() {
    if (!this.listening)
      return;
    const t = this.renderRoot.querySelector(
      ".listening-visualizer-canvas"
    );
    this.audioController.startMicVisualizer(t, () => {
      var e;
      return (e = this.audioRecorder) == null ? void 0 : e.getAnalyser();
    });
  }
  stopMicVisualizer() {
    this.audioController.stopMicVisualizer();
  }
  isVoicePipelineConfigured() {
    const t = this.getActivePipeline();
    return !!(this.config.voice_input && !this.config.disable_speech && (t != null && t.stt_engine));
  }
  needsHttpsForVoice() {
    return this.isVoicePipelineConfigured() && P.isInsecureConnection();
  }
  supportsVoiceInput() {
    return this.isVoicePipelineConfigured() && P.isSupported();
  }
  showMicrophoneNotSupportedMessage() {
    const t = this.getMicrophoneNotSupportedText();
    if (this.messages.some((e) => e.persistLocal && e.text === t)) {
      this.messages = [...this.messages], this.scheduleScrollToEnd();
      return;
    }
    this.addMessage({
      role: "assistant",
      text: t,
      status: "done",
      persistLocal: !0
    }), this.scheduleScrollToEnd();
  }
  getMicrophoneNotSupportedText() {
    const t = this.text("mic_https"), s = `[${this.text("mic_docs_link")}](https://www.home-assistant.io/docs/configuration/securing/#remote-access)`, n = this.text("mic_docs", { documentation_link: s });
    return `${t}

${n}`;
  }
  getSpeechRmsThreshold() {
    const t = Number(this.config.speech_rms_threshold);
    return Number.isFinite(t) && t >= 0 ? t : qt;
  }
  sendSpeechEndChunk() {
    !this.voiceInputHasSpeech || this.sttBinaryHandlerId === void 0 || this.sttBinaryHandlerId === null || this.sendAudioChunk(new Int16Array());
  }
  sendAudioChunk(t) {
    const e = this.audioController.sendAudioChunk(
      this.hass,
      t,
      this.sttBinaryHandlerId,
      this.audioBuffer,
      this.getSpeechRmsThreshold(),
      this.voiceInputHasSpeech,
      () => {
        this.voiceInputHasSpeech = !0;
      }
    );
    this.audioBuffer = e.buffer, this.voiceInputHasSpeech = e.hasSpeech;
  }
  flushAudioBuffer() {
    this.audioController.flushAudioBuffer(
      this.hass,
      this.audioBuffer,
      this.sttBinaryHandlerId,
      this.getSpeechRmsThreshold(),
      () => {
        this.voiceInputHasSpeech = !0;
      },
      this.voiceInputHasSpeech
    ), this.audioBuffer = void 0;
  }
  stopListening(t = !0) {
    var i, s;
    const e = this.voiceInputHasSpeech;
    t && (e ? (this.flushAudioBuffer(), this.sendSpeechEndChunk()) : ((i = this.activeUnsubscribe) == null || i.call(this), this.activeUnsubscribe = void 0, this.processing = !1, this.removeUnprocessedSttMessages(), this.refreshHistoryAfterRun())), this.stopMicVisualizer(), (s = this.audioRecorder) == null || s.stop(), this.audioBuffer = void 0, this.sttBinaryHandlerId = void 0, this.listening = !1, this.voiceInputHasSpeech = !1;
  }
  cancelActiveRun() {
    this.processing && (this.messages = Ka(this.messages), this.audioController.unload(this.hass), this.continueConversationAfterRun = !1, this.stopActiveRun(), this.refreshHistoryAfterRun());
  }
  stopActiveRun() {
    var t;
    (t = this.activeUnsubscribe) == null || t.call(this), this.activeUnsubscribe = void 0, this.stopListening(!1), this.processing = !1;
  }
  finishRun() {
    var t;
    (t = this.activeUnsubscribe) == null || t.call(this), this.activeUnsubscribe = void 0, this.processing = !1, this.stopListening(!1), this.removeUnprocessedSttMessages(), this.refreshHistoryAfterRun(), this.maybeContinueConversationAfterRun(!this.audioController.isPlaying());
  }
  refreshHistoryAfterRun() {
    if (!this.resolvedPipelineId || this.historyDisabled)
      return;
    const t = ++this.loadToken;
    this.loadRecentHistory(this.resolvedPipelineId, t, !0, this.messages, !0);
  }
  playTtsAudio(t) {
    this.audioController.playTts(
      this.hass,
      t,
      !!this.config.enable_audio_playback,
      this.config.tts_media_player || void 0
    );
  }
  shouldOfferFollowUpConversation() {
    return !!(this.config.continue_conversation || this.config.always_continue_conversation);
  }
  shouldContinueConversationAfterRun() {
    return !this.supportsVoiceInput() || !this.shouldOfferFollowUpConversation() || !this.userStartedRecordingOnce ? !1 : !!(this.config.always_continue_conversation || this.continueConversationAfterRun);
  }
  maybeContinueConversationAfterRun(t = !1) {
    t && this.audioController.isPlaying() || this.shouldContinueConversationAfterRun() && this.startListening();
  }
  addMessage(t) {
    const e = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      ...t,
      timestamp: t.timestamp || (/* @__PURE__ */ new Date()).toISOString()
    };
    return this.messages = [...this.messages, e], e;
  }
  setAssistantError(t, e) {
    t.text = e, t.status = "error", this.messages = [...this.messages];
  }
  clearConversation() {
    this.stopActiveRun(), this.loadToken++, this.conversationClearedAt = this.lastSeenRunTimestamp || Date.now(), this.conversationId = null, this.userStartedRecordingOnce = !1, this.stickToBottom = !0, this.stickThinkingToBottom = !0, this.httpsWarningDismissed = !0, this.messages = [], this.error = "";
  }
  formatToolCallJson(t) {
    if (t == null)
      return "";
    if (typeof t == "string")
      return t;
    try {
      return JSON.stringify(t, null, 2);
    } catch {
      return String(t);
    }
  }
  getPipelineName(t) {
    var e;
    return (e = this.pipelines.find((i) => i.id === t)) == null ? void 0 : e.name;
  }
  getCardStatus() {
    return this.listening ? "listening" : this.processing ? "thinking" : "idle";
  }
  getCardStatusLabel(t) {
    return t === "listening" ? this.text("status_listening") : t === "thinking" ? this.text("status_thinking") : this.text("status_idle");
  }
  handleSuggestedPromptClick(t) {
    const e = Number(t.currentTarget.dataset.index), i = this.suggestedPrompts[e];
    !i || this.processing || this.listening || this.processText(i);
  }
  getInputPlaceholder() {
    return this.text("input_placeholder");
  }
  text(t, e) {
    const i = dn[t];
    let s = i.haKey && this.localize(i.haKey, e) || i.fallback;
    if (e)
      for (const [n, o] of Object.entries(e))
        s = s.replace(`{${n}}`, o);
    return s;
  }
  localize(t, e) {
    var i, s;
    try {
      return ((s = (i = this.hass) == null ? void 0 : i.localize) == null ? void 0 : s.call(i, t, e)) || "";
    } catch {
      return "";
    }
  }
  formatError(t) {
    return jt(t, {
      fallback: this.text("request_rejected"),
      micDenied: this.text("mic_denied"),
      micNotFound: this.text("mic_not_found"),
      micHttps: this.text("mic_https")
    });
  }
  getRunCount() {
    return Wt(this.config.run_count, w.run_count);
  }
  getHistoryRunCount() {
    return Math.max(this.getRunCount(), 1);
  }
  usesSessionConversation() {
    return this.config.session_conversation !== !1;
  }
  resolveConversationId(t, e) {
    return this.usesSessionConversation() ? e ? this.conversationId : null : t || (e ? this.conversationId : null);
  }
};
Nt.properties = {
  hass: { attribute: !1 },
  config: { attribute: !1 },
  pipelines: { state: !0 },
  resolvedPipelineId: { state: !0 },
  messages: { state: !0 },
  inputValue: { state: !0 },
  processing: { state: !0 },
  listening: { state: !0 },
  loadingPipelines: { state: !0 },
  loadingHistory: { state: !0 },
  error: { state: !0 },
  followUpHintDismissed: { state: !0 },
  httpsWarningDismissed: { state: !0 },
  suggestedPrompts: { state: !0 }
}, Nt.styles = [
  es,
  is,
  _`
    :host {
      height: 100%;
    }

    .template-listener {
      display: none;
    }

    ha-card {
      --assist-user-bubble: var(--assist-chat-user-bubble);
      --assist-user-text: var(--assist-chat-user-text);
      --assist-assistant-bubble: var(--assist-chat-assistant-bubble);
      --assist-assistant-text: var(--assist-chat-assistant-text);
      background: var(--assist-chat-background);
      border: 0;
      border-radius: 20px;
      box-sizing: border-box;
      height: 100%;
      overflow: hidden;
    }

    .card {
      background: var(--assist-chat-background);
      box-sizing: border-box;
      color: var(--primary-text-color);
      display: flex;
      flex-direction: column;
      gap: 12px;
      height: 100%;
      min-width: 0;
      padding: 12px;
    }

    .header {
      align-items: flex-start;
      display: flex;
      gap: 10px;
      justify-content: space-between;
      min-width: 0;
    }

    .header-text {
      display: grid;
      gap: 2px;
      min-width: 0;
    }

    .header-title {
      font-size: 14px;
      font-weight: 700;
      line-height: 1.3;
      margin: 0;
    }

    .header-pipeline {
      color: var(--secondary-text-color);
      font-size: 12px;
      line-height: 1.35;
      margin: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .status-pill {
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      border-radius: 999px;
      color: var(--secondary-text-color);
      flex: 0 0 auto;
      font-size: 12px;
      font-weight: 600;
      padding: 4px 8px;
      white-space: nowrap;
    }

    .status-pill.listening,
    .status-pill.thinking {
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.16);
      color: var(--primary-color);
    }

    .info-banner {
      align-items: flex-start;
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.12);
      border-radius: 12px;
      color: var(--primary-text-color);
      display: flex;
      font-size: 12px;
      gap: 8px;
      line-height: 1.45;
      padding: 10px 12px;
    }

    .info-banner .dismiss-button {
      flex: 0 0 auto;
      height: 28px;
      width: 28px;
    }

    .info-banner .dismiss-button ha-icon {
      --mdc-icon-size: 16px;
    }

    .suggested-prompts {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      min-width: 0;
    }

    .prompt-chip {
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      border: 0;
      border-radius: 999px;
      color: var(--primary-text-color);
      cursor: pointer;
      font: inherit;
      font-size: 12px;
      line-height: 1.35;
      max-width: 100%;
      padding: 7px 11px;
      text-align: left;
    }

    .prompt-chip:disabled {
      cursor: default;
      opacity: 0.55;
    }

    .messages {
      align-content: start;
      box-sizing: border-box;
      display: grid;
      flex: 1 1 auto;
      gap: 8px;
      grid-auto-rows: max-content;
      grid-template-columns: minmax(0, 1fr);
      min-height: 0;
      min-width: 0;
      overflow-y: auto;
      padding-right: 2px;
      scrollbar-width: thin;
      width: 100%;
    }

    .message {
      align-items: flex-start;
      display: flex;
      min-width: 0;
      width: 100%;
    }

    .message.user {
      justify-content: flex-end;
    }

    .message.assistant {
      justify-content: flex-start;
    }

    .bubble {
      flex: 0 1 auto;
    }

    .user .bubble {
      gap: 6px;
      max-width: 100%;
    }

    .tool-call-chip {
      display: inline-flex;
      flex-direction: column;
      gap: 6px;
      max-width: 100%;
      min-width: 0;
      width: fit-content;
    }

    .tool-call-chip[open] {
      width: 100%;
    }

    .tool-call-chip summary.process-chip {
      cursor: pointer;
      list-style: none;
    }

    .tool-call-chip summary.process-chip::-webkit-details-marker {
      display: none;
    }

    .tool-call-panel {
      background: rgba(0, 0, 0, 0.18);
      border-radius: 12px;
      box-sizing: border-box;
      display: grid;
      gap: 8px;
      max-width: 100%;
      min-width: 0;
      overflow: hidden;
      padding: 8px;
      width: 100%;
    }

    .tool-call-section {
      display: grid;
      gap: 4px;
      min-width: 0;
    }

    .tool-call-label {
      color: var(--secondary-text-color);
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.02em;
      text-transform: uppercase;
    }

    .tool-call-panel pre {
      background: rgba(0, 0, 0, 0.18);
      border-radius: 8px;
      box-sizing: border-box;
      font-size: 11px;
      line-height: 1.4;
      margin: 0;
      max-height: 180px;
      max-width: 100%;
      min-width: 0;
      overflow: auto;
      overflow-wrap: anywhere;
      padding: 8px;
      white-space: pre-wrap;
      width: 100%;
      word-break: break-word;
    }

    .message-time {
      align-self: flex-end;
      flex-shrink: 0;
      font-size: 12px;
      line-height: 1;
      white-space: nowrap;
    }

    .user .bubble .message-time {
      color: color-mix(in srgb, var(--assist-chat-user-text) 80%, transparent);
    }

    .assistant .bubble .message-time {
      color: var(--secondary-text-color);
    }

    .error {
      color: var(--error-color, #db4437);
    }

    ha-markdown {
      --mdc-typography-body1-font-size: 14px;
      color: inherit;
      display: block;
      max-width: 100%;
      min-width: 0;
      overflow-wrap: anywhere;
      width: 100%;
    }

    ha-markdown::part(content) {
      color: inherit;
      max-width: 100%;
      min-width: 0;
      overflow-wrap: anywhere;
      word-break: break-word;
    }

    .empty-state {
      align-items: center;
      align-self: start;
      background: var(--assist-chat-surface);
      border-radius: 16px;
      color: var(--secondary-text-color);
      display: flex;
      font-size: 14px;
      gap: 10px;
      justify-self: start;
      max-width: 100%;
      min-height: 0;
      padding: 10px 12px;
      width: fit-content;
    }

    .error {
      align-items: center;
      background: var(--assist-chat-surface);
      border-radius: 16px;
      color: var(--error-color, #db4437);
      display: flex;
      font-size: 14px;
      gap: 10px;
      min-height: 0;
      padding: 14px;
    }

    .empty-state ha-icon {
      --mdc-icon-size: 20px;
      color: var(--primary-color);
    }

    .process {
      align-self: stretch;
      display: flex;
      flex-direction: column;
      gap: 6px;
      min-width: 0;
      width: 100%;
    }

    .process-stages,
    .process-tools {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      min-width: 0;
    }

    .process-tools {
      align-items: flex-start;
      width: 100%;
    }

    .process-chip {
      align-items: center;
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      border-radius: 999px;
      color: var(--secondary-text-color);
      display: inline-flex;
      flex: 0 1 auto;
      font-size: 12px;
      gap: 4px;
      max-width: 100%;
      min-width: 0;
      overflow-wrap: anywhere;
      padding: 4px 7px;
    }

    .process-chip ha-icon {
      --mdc-icon-size: 12px;
    }

    .process-chip.running {
      color: var(--primary-color);
    }

    .process-chip.cancelled {
      color: var(--secondary-text-color);
    }

    .user .process-chip.running {
      color: var(--assist-chat-user-text);
    }

    .process-chip.done {
      color: var(--success-color, #43a047);
    }

    .process-chip.error {
      color: var(--error-color, #db4437);
    }

    .thinking {
      align-self: stretch;
      max-width: 100%;
      min-width: 0;
      width: 100%;
    }

    .thinking summary {
      color: var(--secondary-text-color);
      cursor: pointer;
      font-size: 13px;
      white-space: nowrap;
    }

    .thinking pre {
      background: rgba(0, 0, 0, 0.18);
      border-radius: 12px;
      box-sizing: border-box;
      font-size: 12px;
      line-height: 1.45;
      margin: 8px 0 0;
      max-height: 220px;
      overflow: auto;
      overflow-wrap: break-word;
      padding: 10px;
      white-space: pre-wrap;
      width: 100%;
      word-break: break-word;
    }

    .input-row {
      align-items: center;
      display: flex;
      flex: 0 0 auto;
      gap: 8px;
    }

    input {
      background: var(--assist-chat-surface);
      border: 0;
      border-radius: 999px;
      box-sizing: border-box;
      color: var(--primary-text-color);
      flex: 1 1 auto;
      font: inherit;
      font-size: 14px;
      min-width: 0;
      outline: none;
      padding: 11px 13px;
    }

    input::placeholder {
      color: var(--secondary-text-color);
    }

    .listening-visualizer {
      align-items: center;
      background: var(--assist-chat-surface);
      border-radius: 999px;
      box-sizing: border-box;
      color: var(--primary-text-color);
      display: flex;
      flex: 1 1 auto;
      font-size: 14px;
      gap: 8px;
      min-width: 0;
      padding: 8px 13px;
    }

    .listening-dot {
      animation: listening-pulse 1.4s ease-in-out infinite;
      background: var(--assist-chat-user-bubble);
      border-radius: 50%;
      flex: 0 0 auto;
      height: 8px;
      width: 8px;
    }

    .listening-label {
      flex: 0 0 auto;
      font-size: 14px;
    }

    .listening-visualizer-canvas {
      display: block;
      flex: 1 1 auto;
      height: 32px;
      min-width: 0;
      width: 100%;
    }

    @keyframes listening-pulse {
      0%,
      100% {
        opacity: 1;
        transform: scale(1);
      }

      50% {
        opacity: 0.55;
        transform: scale(0.85);
      }
    }

    button {
      -webkit-tap-highlight-color: transparent;
      cursor: pointer;
      font: inherit;
    }

    button:disabled {
      cursor: default;
      opacity: 0.55;
    }

    .icon-button,
    .send-button {
      align-items: center;
      background: var(--assist-chat-surface);
      border: 0;
      border-radius: 50%;
      color: var(--primary-text-color);
      display: inline-flex;
      flex: 0 0 auto;
      height: 42px;
      justify-content: center;
      padding: 0;
      width: 42px;
    }

    .send-button,
    .icon-button.listening {
      background: var(--assist-chat-user-bubble);
      color: var(--assist-chat-user-text);
    }

    .icon-button.cancel-button {
      color: var(--error-color, #db4437);
    }

    .icon-button ha-icon,
    .send-button ha-icon {
      --mdc-icon-size: 20px;
    }

  `
];
let Me = Nt;
customElements.define("assist-chat-card", Me);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "assist-chat-card",
  name: "Assist Chat Card",
  description: "Dashboard chat card for Home Assistant Assist"
});
