/**
* @param {String} el
* @param {String} classNames
* @param {HTMLElement} child
* @param {HTMLElement} parent
* @param {...array} dataAttr
*/

export default function create(el, classNames, child, parent, ...dataAttr) {
  let element = null;

  try {
    element = document.createElement(el);
  } catch (error) {
    throw new Error('Unable to create HTMLElement! Give a proper tag name.');
  }

  if (classNames) {
    element.classList.add(...classNames.split(' '));
  }

  if (child && Array.isArray(child)) {
    child.forEach((childElement) => element.appendChild(childElement));
  } else if (child && typeof child === 'object') {
    element.appendChild(child);
  } else if (child && typeof child === 'string') {
    element.innerHTML = child;
  }

  if (parent) {
    parent.appendChild(element);
  }

  if (dataAttr.length) {
    dataAttr.forEach(([attrName, attrValue]) => {
      element.setAttribute(attrName, attrValue);
    });
  }

  return element;
}
