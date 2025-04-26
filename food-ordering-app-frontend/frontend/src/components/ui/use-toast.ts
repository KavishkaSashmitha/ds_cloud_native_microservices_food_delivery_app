type ToastType = "success" | "error" | "info"

interface ToastOptions {
  title?: string
  description?: string
  duration?: number
  type?: ToastType
  className?: string
}

export function toast({ title, description, duration = 3000, type = "info", className  }: ToastOptions) {
  const color =
    type === "success"
      ? "green"
      : type === "error"
      ? "red"
      : type === "info"
      ? "blue"
      : "gray"

  const style = `
    background-color: ${color};
    color: white;
    padding: 12px;
    border-radius: 6px;
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 9999;
    font-size: 14px;
    min-width: 200px;
  `

  const div = document.createElement("div")
  div.style.cssText = style
  div.className = className ?? ""
  div.innerHTML = `<strong>${title ?? ""}</strong><div>${description ?? ""}</div>`
  document.body.appendChild(div)

  setTimeout(() => {
    document.body.removeChild(div)
  }, duration)
}
