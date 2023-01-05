/*
  Based on the ClassAttributor:
  https://github.com/quilljs/parchment/blob/main/src/attributor/class.ts
 */

import Quill from "quill"
const Parchment = Quill.import("parchment")

function match(node, prefix) {
  const className = node.getAttribute('class') || ''
  return className
    .split(/\s+/)
    .filter((name) => name.indexOf(prefix) === 0)
}

function add(node, value) {
  if (!this.canAdd(node, value)) {
    return false
  }
  this.remove(node)
  
  // add style class
  node.classList.add(this.keyName)

  // add identifier class
  node.classList.add(`${this.keyName}-${value}`)

  return true
}

function canAdd(node, value) {
  if (this.whitelist == null) {
    return true;
  }
  if (typeof value === 'string') {
    return this.whitelist.indexOf(value.replace(/["']/g, '')) > -1
  } else {
    return this.whitelist.indexOf(value) > -1
  }
}

function remove(node) {
  const matches = match(node, this.keyName)
  matches.forEach((name) => {
    node.classList.remove(name)
  })
  if (node.classList.length === 0) {
    node.removeAttribute('class')
  }
}

function value(node) {
  const result = match(node, this.keyName + "-")[0] || ''
  const value = result.slice(this.keyName.length)
  return this.canAdd(node, value) ? value : ''
}

export function highlightAttributorFactory(attributeName, cssClass, whitelist) {
  const attributorInstance = new Parchment.Attributor.Class(
    attributeName,
    cssClass,
    {
      scope: Parchment.Scope.INLINE,
      whitelist: whitelist
    }
  )

  // see the actual original source code:
  // console.log(attributorInstance.add)

  // HACK: Lobotomize the instance, because I couldn't get
  // the class inheritance to work. Time wasted counter: 2h
  attributorInstance.add = add.bind(attributorInstance)
  attributorInstance.canAdd = canAdd.bind(attributorInstance)
  attributorInstance.remove = remove.bind(attributorInstance)
  attributorInstance.value = value.bind(attributorInstance)

  return attributorInstance
}
