export function debouce(timeout, fn) {
  let isWaiting = false

  return function(...args) {
    if (isWaiting) return

    isWaiting = true

    setTimeout(() => {
      fn(...args)
      isWaiting = false
    }, timeout)
  }
}

export function setCursorGlobal(type = 'auto') {
  document.body.style.cursor = type
}
