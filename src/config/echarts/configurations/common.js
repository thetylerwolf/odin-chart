const base = (options, color) => {
  const settings = {
    title: {
      text: options.title || 'Untitled Chart',
      show: options.showTitle,
      left: '10%',
    },
    backgroundColor: options.backgroundColor || 'transparent',
    color,
    grid: {
      top: 62
    },
    animation: options.drawAnimation,
    // Footnote
    graphic: [{
      type: 'text',
      z: 100,
      left: '10%',
      bottom: '10',
      cursor: 'default',
      style: {
        fill: '#555',
        text: options.footnote,
        // font: '14px Microsoft YaHei'
      }
    }],
  }

  // TODO: Do this more sensibly
  const isViewer = /^\/_\//.test(window.location.pathname)

  if(isViewer) {
    settings.graphic.push({
      type: 'text',
      z: 100,
      right: '10%',
      bottom: '10',
      cursor: 'pointer',
      style: {
        fill: '#999',
        text: 'Made with Odin Chart',
        // font: 'underline',
      },
      onmouseup: () => {
        window.open('https://odinchart.com')
      },
    })
  }

  return settings

}

export {
  // eslint-disable-next-line
  base
}