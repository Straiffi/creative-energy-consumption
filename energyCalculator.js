const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

const renderText = text => {
  const eventLog = document.querySelector('#event-log')

  const span = document.createElement('span')
  span.innerHTML = text;

  eventLog.appendChild(span)
}

const calculateLoadingEnergyConsumption = resourceEntry => {
  const loadingDuration = resourceEntry.duration

  const watts = 0.1 * 10 // hard-coded 10 assets per creative
  const renderTimeInHours = (loadingDuration / (1000 * 60 * 60))
  const wh = watts * renderTimeInHours

  renderText(`Ad loaded in ${loadingDuration.toFixed(2)}ms`)
  renderText(`Energy consumption from loading ~${wh.toString().substring(0, 10)}Wh`)
}

const calculateRenderingEnergyConsumption = navigationEntry => {
  const renderDuration = navigationEntry.duration

  const watts = !isMobile ? 100 : 5
  const renderTimeInHours = (renderDuration / (1000 * 60 * 60))
  const wh = watts * renderTimeInHours

  renderText(`Ad rendered in ${renderDuration.toFixed(2)}ms`)
  renderText(`Energy consumption from rendering ~${wh.toString().substring(0, 7)}Wh`)
}

const observer = new PerformanceObserver((list) => {
  const entries = list.getEntries()
  const resourceEntry = entries.find(({ entryType, initiatorType }) =>
      entryType === 'resource' && initiatorType === 'script')
  const navigationEntry = entries.find(({ entryType }) => entryType === 'navigation')

  if (resourceEntry) {
    calculateLoadingEnergyConsumption(resourceEntry)
    return
  }

  if (navigationEntry) {
    calculateRenderingEnergyConsumption(navigationEntry)
  }
});

observer.observe({
  entryTypes: ['resource', 'navigation']
});