import derchemnitzLogo from './logo.svg'
import kreiseLogo from './kreise.svg'

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
  logoImg.setAttribute('width', 50)
  logoImg.setAttribute('height', 'auto')

  logoImg.classList.add('logo')
  logoImg.classList.add('vanilla')
  logoImg.setAttribute('id', 'derchemnitzLogo')

  logoLink.append(logoImg)

  introDiv.append(logoLink)

  const titleParagraph = document.createElement('p');
  titleParagraph.innerHTML = 'Der-Chemnitz.de<br>'

  const disclaimerParagraph = document.createElement('p');
  disclaimerParagraph.innerHTML = 'Dies ist derzeit keine offizielle Seite der Stadt Chemnitz'

  const explainParagraph = document.createElement('p');
  explainParagraph.innerHTML = 'Der-Chemnitz.de ist ein 5D-Kunstprojekt zur Sichtbarmachung des "Der Chemnitz"'

  const detailsParagraph = document.createElement('p');
  detailsParagraph.innerHTML = 'Masse: 20.080.000 kg · Gr&ouml;&szlig;e: 1.001 m · BMI: ~20'

  const authorParagraph = document.createElement('p');
  authorParagraph.innerHTML = '<br>Wer baut an Der Chemnitz?<br>'
  authorParagraph.style.paddingBottom = '2em'

  const kreiseLink: HTMLAnchorElement = document.createElement('a')
  kreiseLink.setAttribute('href', 'https://krei.se')
  kreiseLink.style.margin = '0'

  

  const kreiseImg: HTMLImageElement = document.createElement('img')
  kreiseImg.setAttribute('src', kreiseLogo)
  kreiseImg.setAttribute('width', 150)
  kreiseImg.setAttribute('height', 'auto')
  kreiseImg.setAttribute('id', 'kreiseLogo')
  
  kreiseImg.classList.add('kreiseLogo')
  kreiseImg.classList.add('vanilla')
  
  kreiseImg.setAttribute('alt', 'Krei.se Logo')


  kreiseLink.append(kreiseImg)


  const kreiseParagraph = document.createElement('p');
  kreiseParagraph.innerHTML = 'IT-Beratung<br>Richard Wachler</a><br>Lohrstr. 42<br>09113 Chemnitz'
  kreiseParagraph.style.margin = '0'

  const ccParagraph = document.createElement('p');
  ccParagraph.innerHTML = '<a href="cccredits.html"><img src="ccheart.svg" width="50" height="auto"></a>'
  ccParagraph.style.paddingBottom = '2em'




  pageOverlayDiv.append(introDiv)
  //pageOverlayDiv.append(titleParagraph)
  pageOverlayDiv.append(disclaimerParagraph)
  pageOverlayDiv.append(explainParagraph)
  pageOverlayDiv.append(detailsParagraph)
  pageOverlayDiv.append(authorParagraph)
  pageOverlayDiv.append(kreiseLink)
  pageOverlayDiv.append(kreiseParagraph)

  pageOverlayDiv.append(ccParagraph)

  
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


export function getOSMOverlayDiv (): HTMLDivElement {

  let osmDiv = document.createElement('div')

  osmDiv.innerHTML = 'Karte hergestellt aus <a href="https://www.openstreetmap.org">OpenStreetMap-Daten</a> | Lizenz: <a href="https://opendatacommons.org/licenses/odbl/">Open Database License (ODbL)</a>'
  osmDiv.style.cssText = 'font-size: 8pt; position: fixed; bottom: 0; right: 0;'

  return osmDiv

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
