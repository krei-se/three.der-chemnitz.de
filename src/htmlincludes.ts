import derchemnitzLogo from './logo.svg'
import kreiseLogo from './kreise.svg'

export function getPageOverlayDiv (): HTMLDivElement {

  const pageOverlayDiv: HTMLDivElement = document.createElement('div')
  pageOverlayDiv.setAttribute('id', 'pageOverlay')

  pageOverlayDiv.classList.add('applyInvertFilter')

  const introDiv: HTMLDivElement = document.createElement('div')
  introDiv.setAttribute('id', 'introDiv')
  
  const logoLink: HTMLAnchorElement = document.createElement('a')
  logoLink.setAttribute('href', 'https://der-chemnitz.de')


  const logoImg: HTMLImageElement = document.createElement('img')
  logoImg.setAttribute('src', derchemnitzLogo)
  logoImg.setAttribute('alt', 'Der-Chemnitz.de Logo')
  logoImg.setAttribute('width', '50')
  logoImg.setAttribute('height', 'auto')

  logoImg.classList.add('logo')
  logoImg.classList.add('vanilla')
  logoImg.setAttribute('id', 'derchemnitzLogo')

  logoLink.append(logoImg)

  introDiv.append(logoLink)

  const titleParagraph = document.createElement('p');
  titleParagraph.innerHTML = 'Der-Chemnitz.de<br>'

  const disclaimerParagraph = document.createElement('p');
  disclaimerParagraph.innerHTML = 'Dies ist keine offizielle Seite der Stadt Chemnitz'

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
  kreiseImg.setAttribute('width', '150')
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
  ccParagraph.innerHTML = '<a href="cccredits.html"><img id="ccLogo" src="ccheart.svg" width="50" height="auto"></a>'
  ccParagraph.style.paddingBottom = '2em'




  pageOverlayDiv.append(explainParagraph)
  pageOverlayDiv.append(introDiv)
  //pageOverlayDiv.append(titleParagraph)
  pageOverlayDiv.append(disclaimerParagraph)
  pageOverlayDiv.append(detailsParagraph)
  // pageOverlayDiv.append(authorParagraph)
  // pageOverlayDiv.append(kreiseLink)
  // pageOverlayDiv.append(kreiseParagraph)

  // pageOverlayDiv.append(ccParagraph)

  
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


export function getMailOverlayDiv (): HTMLDivElement {

  let mailinfoDiv = document.createElement('div')
  mailinfoDiv.innerHTML = 'Schreiben Sie an Der-Chemnitz:<br> <a href="mailto:post@der-chemnitz.de">post@der-chemnitz.de</a>'
  mailinfoDiv.id = 'mailInfoDiv'

  mailinfoDiv.classList.add('applyInvertFilter')
  mailinfoDiv.style.zIndex = '100'
  mailinfoDiv.style.fontSize = '14'
  mailinfoDiv.style.position = 'fixed'
  mailinfoDiv.style.visibility = 'hidden'
  mailinfoDiv.style.top = '10em'
  mailinfoDiv.style.right = '1em'
  
  mailinfoDiv.style.transform = 'translate(-50%,0px)'
  
  return mailinfoDiv

}

export function getGenesisInfoDiv (): HTMLDivElement {

  let genesisInfoDiv = document.createElement('div')
  genesisInfoDiv.id = 'genesisInfoDiv'
  genesisInfoDiv.innerHTML = "Genesis-Modus"

  genesisInfoDiv.classList.add('applyInvertFilter')
  genesisInfoDiv.style.zIndex = '100'
  genesisInfoDiv.style.fontSize = '12'
  genesisInfoDiv.style.position = 'fixed'
  genesisInfoDiv.style.visibility = 'hidden'
  genesisInfoDiv.style.transform = 'translate(-50%,0px)'
  
  return genesisInfoDiv

}

export function getKreiseOverlayDiv (): HTMLDivElement {

  let kreiseDiv = document.createElement('div')
  kreiseDiv.id = 'KreiseDiv'
  kreiseDiv.style.alignItems = 'top'
  kreiseDiv.classList.add('applyInvertFilter')

  const kreiseDesc1 = document.createElement('p')
  kreiseDesc1.innerHTML = "Running on "
  kreiseDesc1.style.cssText = "display: inline; white-space: nowrap;"

  const kreiseLink: HTMLAnchorElement = document.createElement('a')
  kreiseLink.setAttribute('href', 'https://krei.se')
  kreiseLink.style.margin = '0'
  kreiseLink.style.whiteSpace = 'nowrap'

  const kreiseDesc2 = document.createElement('p')
  kreiseDesc2.innerHTML = "'n Gin"
  kreiseDesc2.style.cssText = "display: inline; white-space: nowrap;"


  const kreiseImg: HTMLImageElement = document.createElement('img')
  kreiseImg.setAttribute('src', kreiseLogo)
  kreiseImg.setAttribute('width', '150')
  kreiseImg.setAttribute('height', 'auto')
  kreiseImg.setAttribute('id', 'kreiseLogo')
  
  kreiseImg.classList.add('kreiseLogo')
  kreiseImg.classList.add('vanilla')
  
  kreiseImg.setAttribute('alt', 'Krei.se Logo')

  kreiseImg.style.whiteSpace = 'nowrap'


  kreiseLink.append(kreiseImg)

  kreiseDiv.append(kreiseDesc1)
  kreiseDiv.append(kreiseLink)
  kreiseDiv.append(kreiseDesc2)

  kreiseDiv.style.cssText = 'display: flex; align-items: top; z-index: 5; font-size: 8pt; position: fixed; bottom: 2em; left: 50%; transform: translate(-50%, 0);'

  return kreiseDiv

}

export function getCCOverlayDiv (): HTMLDivElement {

  let ccDiv = document.createElement('div')
  ccDiv.id = 'ccDiv'

  ccDiv.classList.add('applyInvertFilter')

  const ccParagraph = document.createElement('p');
  ccParagraph.innerHTML = '<a href="cccredits.html"><img id="ccLogo" src="ccheart.svg" width="50" height="auto"></a>'
  ccParagraph.style.paddingBottom = '2em'

  ccDiv.append(ccParagraph)
  ccDiv.style.cssText = 'z-index: 5; font-size: 8pt; position: fixed; bottom: 2em; right: 5em;'

  return ccDiv

}

export function getDCOverlayDiv (): HTMLDivElement {

  let dcDiv = document.createElement('div')
  dcDiv.id = 'dcDiv'

  dcDiv.classList.add('applyInvertFilter')

  const dcParagraph = document.createElement('p');
  dcParagraph.innerHTML = 'Der-Chemnitz.de Version 0.0.10 )Editor²('
  
  dcDiv.append(dcParagraph)
  dcDiv.style.cssText = 'font-size: 8pt; position: fixed; bottom: 0; left: 1em;'

  return dcDiv

}


export function getOSMOverlayDiv (): HTMLDivElement {

  let osmDiv = document.createElement('div')
  osmDiv.id = 'osmDiv'

  osmDiv.classList.add('applyInvertFilter')

  osmDiv.innerHTML = 'Karte hergestellt aus <a href="https://www.openstreetmap.org">OpenStreetMap-Daten</a> | Lizenz: <a href="https://opendatacommons.org/licenses/odbl/">Open Database License (ODbL)</a>'
  osmDiv.style.cssText = 'font-size: 8pt; position: fixed; bottom: 0; right: 1em;'

  return osmDiv

}

export function getGenesisDiv (): HTMLDivElement {

  let genesisDiv = document.createElement('div')
  genesisDiv.id = 'genesisDiv'

  

  return genesisDiv

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
