import { useEffect, useRef } from 'react'

interface GistProps {
  id: string
  file?: string
}

export const Gist = ({ id, file }: GistProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const elementId = file ? `gist-${id}-${file}` : `gist-${id}`

  useEffect(() => {
    const iframe = iframeRef.current
    const doc = iframe?.contentDocument ?? iframe?.contentWindow?.document

    if (!doc) return

    const fileArg = file ? `?file=${encodeURIComponent(file)}` : ''
    const gistLink = `https://gist.github.com/${id}.js${fileArg}`
    const resizeScript = `
      <script>
        window.addEventListener('load', function () {
          var iframe = parent.document.getElementById(${JSON.stringify(elementId)});
          if (iframe) iframe.style.height = document.body.scrollHeight + 'px';
        });
      </script>
    `
    const iframeHtml = `
      <html>
        <head>
          <base target="_parent">
          <style>*{font-size:12px;}</style>
        </head>
        <body>
          <script type="text/javascript" src="${gistLink}"></script>
          ${resizeScript}
        </body>
      </html>
    `

    doc.open()
    doc.write(iframeHtml)
    doc.close()
  }, [elementId, file, id])

  return <iframe ref={iframeRef} width="100%" frameBorder="0" id={elementId} title={`GitHub Gist ${id}`} />
}
