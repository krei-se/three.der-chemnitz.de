import derchemnitzLogo from './logo.svg'

export function getPageOverlayDiv (): HTMLDivElement {

  const pageOverlayDiv: HTMLDivElement = document.createElement('div')
  pageOverlayDiv.setAttribute('id', 'pageOverlay')

  const introDiv: HTMLDivElement = document.createElement('div')
  introDiv.setAttribute('id', 'introDiv')
  
  const logoLink: HTMLAnchorElement = document.createElement('a')
  logoLink.setAttribute('href', 'https://der-chemnitz.de')


  const logoImg: HTMLImageElement = document.createElement('img')
  logoImg.setAttribute('src', derchemnitzLogo)
  logoImg.setAttribute('alt', 'Der-Chemnitz.de Logo')

  logoImg.classList.add('logo')
  logoImg.classList.add('vanilla')

  logoLink.append(logoImg)

  introDiv.append(logoLink)

  const titleParagraph = document.createElement('p');
  titleParagraph.innerHTML = 'Der-Chemnitz.de<br>'

  const disclaimerParagraph = document.createElement('p');
  disclaimerParagraph.innerHTML = 'Dies ist derzeit keine offizielle Seite der Stadt Chemnitz'

  const explainParagraph = document.createElement('p');
  explainParagraph.innerHTML = 'Der-Chemnitz.de ist ein 5D-Projekt zur Sichtbarmachung des "Der Chemnitz"'

  const authorParagraph = document.createElement('p');
  authorParagraph.innerHTML = '<br>Wer arbeitet an Der Chemnitz?<br><br><a href="https://krei.se">IT-Beratung<br>Richard Wachler</a><br>Lohrstr. 42<br>09113 Chemnitz'

  
  pageOverlayDiv.append(introDiv)
  //pageOverlayDiv.append(titleParagraph)
  pageOverlayDiv.append(disclaimerParagraph)
  pageOverlayDiv.append(explainParagraph)
  pageOverlayDiv.append(authorParagraph)
  

  
  /*
  
  const infoParagraph: HTMLParagraphElement = document.createElement('p')
  infoParagraph.setAttribute('id', 'info')

  const datenschutzParagraph: HTMLParagraphElement = document.createElement('p')
  datenschutzParagraph.setAttribute('id', 'datenschutz')
  datenschutzParagraph.style.fontWeight = '400'
  const datenschutzLink: HTMLAnchorElement = document.createElement('a')
  datenschutzLink.setAttribute('href', 'datenschutz.html')
  datenschutzLink.innerHTML = 'Impressum · Datenschutz'

  datenschutzParagraph.append(datenschutzLink)
  
  */
  // introDiv.append(datenschutzParagraph)
  //introDiv.append(infoParagraph)

  return pageOverlayDiv
}

export function fadeoutDatenschutzAndInfoParagraphs (): void {
  const datenschutzParagraph: HTMLParagraphElement = document.querySelector('#datenschutz') ?? document.createElement('p')
  datenschutzParagraph.style.cssText = datenschutzParagraph.style.cssText + 'opacity : 0.0; transition:opacity 60s;'
  const infoParagraph: HTMLParagraphElement = document.querySelector('#info') ?? document.createElement('p')
  infoParagraph.style.cssText = infoParagraph.style.cssText + 'opacity : 0.0; transition:opacity 60s;'
  window.setTimeout(() => {
    const introDiv: HTMLDivElement = document.querySelector('#introDiv') ?? document.createElement('div')
    const datenschutzParagraph: HTMLParagraphElement = document.querySelector('#datenschutz') ?? document.createElement('p')
    datenschutzParagraph.style.cssText = datenschutzParagraph.style.cssText + 'opacity : 0.0; transition:opacity 60s;'
    const infoParagraph: HTMLParagraphElement = document.querySelector('#info') ?? document.createElement('p')
    infoParagraph.style.cssText = infoParagraph.style.cssText + 'opacity : 0.0; transition:opacity 60s;'
    introDiv.removeChild(datenschutzParagraph)
    introDiv.removeChild(infoParagraph)
  }, 60000)
}
