/**
 * class extening HTMLElement to enable deferred rendering on attribute changes
 * either via `setAttribute(name, value)` or `this[name] = value`.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement
 * @example
 * class Example extends WcElement {
 *  // internal references go here
 *  $ = {}
 *  // define all observed attributes.
 *  // attributes are accessible via `this[prop]`
 *  // avoid using attributes which are HTMLElement properties
 *  static attributes = {
 *    text: 'Hi'
 *  }
 *  // as with HTMLElement 
 *  connectedCallback() {
 *    // do initial mount of component here
 *    this._shadow = this.shadow = this.attachShadow({ mode: 'closed' })
 *    this._shadow.innerHTML = `<div></div>`
 *    this.$.div = this._shadow.querySelector('div')
 *    this.render()
 *  }
 *  // render method called every time an attribute changes
 *  render() {
 *    this.$.div.textContent = this.text
 *  }
 * }
 * // create a custom element with the `define` function (see below)
 * define('x-example', Example)
 * // create a DOM node and re-render via attribute or property changes
 * const elem = document.createElement('x-example')
 * elem.setAttribute('text', 'set attribute')
 * elem.text = 'set property'
 */
export class WcElement extends HTMLElement {
  _attr = {}
  _removers = []

  constructor() {
    super()
    this._attr = structuredClone(this.constructor.attributes || {})
    observedAttributes(this)
  }

  /**
   * set attribute and re-render
   * @param {string} name 
   * @param {any} value 
   */
  setAttribute(name, value) {
    this._attr[name] = value
    this.isConnected && this.deferredRender()
  }

  /**
   * @param {string} name change attribute
   * @param {any} _oldValue 
   * @param {any} newValue new value
   */
  attributeChangedCallback(name, _oldValue, newValue) {
    this._attr[name] = newValue
    this.deferredRender()
  }

  /**
   * helper function to remove event listeners when component gets disconnected
   * @param {HTMLElement} node 
   * @param {string} event 
   * @param {function} fn 
   */
  addEventListener(node, event, fn) {
    node.addEventListener(event, fn)
    this._removers.push(() => node.removeEventListener(event, fn))
  }

  /**
   * remove possible event listeners
   */
  disconnectedCallback() {
    this._removers.forEach((remover) => remover())
  }

  /**
   * deferred render
   */
  deferredRender() {
    window.requestAnimationFrame(() => {
      this.render()
    })
  }
}

/**
 * re-render component when property changes
 * @param {HTMLElement} elem 
 */
const observedAttributes = (elem) => {
  for (const prop of Object.keys(elem._attr)) {
    Object.defineProperty(elem, prop, {
      get() {
        return elem._attr[prop]
      },
      set(newValue) {
        const oldValue = elem._attr[prop]
        if (oldValue === newValue) return
        elem._attr[prop] = newValue
        elem.isConnected && elem.deferredRender()
      }
    })
  }
}

/**
 * defines a custom element adding observedAttributes from default static
 * attributes
 * @param {string} name custom element tag
 * @param {HTMLElement} Element
 */
export const define = (name, Element) => {
  Element.observedAttributes =
    Element.observedAttributes || Object.keys(Element.attributes || [])
  window.customElements.define(name, Element)
}

const toNumber = (n) => {
  const _n = Number(n)
  return !isNaN(_n) ? _n : undefined
}

/**
 * convert number to css unit
 * @param {numbers|string} unit 
 * @returns {string}
 */
export const cssUnit = (unit) => {
  const n = toNumber(unit)
  return typeof n === 'number' ? `${n}px` : unit
}
