// src/App.jsx
import './App.css'
import NavBar from './NavBar'
import Intro from './Intro'
import Input from './input'
import Performance from './performance'
import { useState } from 'react'
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import Architecture from './architecture'
import LiveMonitor from './liveMonitor'
import i18n from './i18n'
import { useTranslation } from 'react-i18next'
function App() {
  const [nightMode, changeMode] = useState(false) 
  const [page,changePage] = useState('home')
    const { t } = useTranslation()
  
  return (

    <div className={nightMode ? 'nightMode ' : 'dayMode '}>
      <div className={nightMode? "navBar navBarNight" : "navBar"}>
            <div className="name" onClick={()=> changePage('home')} >
                AccSense
            </div>
        <div className="menu">
          <div className="navigation-list">
            <span onClick={()=> changePage('home')}>{t('Home')}</span>
              <span onClick={()=> changePage('performance')} >{t('performance')}</span>
              <span onClick={()=> changePage('architecture')}>{t('architecture')}</span>
              <span onClick={()=> changePage('mqtt')}>Live Monitoring</span>
          </div>
                
          <div className="preferences-navbar">
            <span className="language">
            <label htmlFor="menu" className='languagelabel'>
              <svg className='languageicon' xmlns="http://www.w3.org/2000/svg" stroke-width="2" viewBox="0 0 640 640"><path d="M192 64C209.7 64 224 78.3 224 96L224 128L352 128C369.7 128 384 142.3 384 160C384 177.7 369.7 192 352 192L342.4 192L334 215.1C317.6 260.3 292.9 301.6 261.8 337.1C276 345.9 290.8 353.7 306.2 360.6L356.6 383L418.8 243C423.9 231.4 435.4 224 448 224C460.6 224 472.1 231.4 477.2 243L605.2 531C612.4 547.2 605.1 566.1 589 573.2C572.9 580.3 553.9 573.1 546.8 557L526.8 512L369.3 512L349.3 557C342.1 573.2 323.2 580.4 307.1 573.2C291 566 283.7 547.1 290.9 531L330.7 441.5L280.3 419.1C257.3 408.9 235.3 396.7 214.5 382.7C193.2 399.9 169.9 414.9 145 427.4L110.3 444.6C94.5 452.5 75.3 446.1 67.4 430.3C59.5 414.5 65.9 395.3 81.7 387.4L116.2 370.1C132.5 361.9 148 352.4 162.6 341.8C148.8 329.1 135.8 315.4 123.7 300.9L113.6 288.7C102.3 275.1 104.1 254.9 117.7 243.6C131.3 232.3 151.5 234.1 162.8 247.7L173 259.9C184.5 273.8 197.1 286.7 210.4 298.6C237.9 268.2 259.6 232.5 273.9 193.2L274.4 192L64.1 192C46.3 192 32 177.7 32 160C32 142.3 46.3 128 64 128L160 128L160 96C160 78.3 174.3 64 192 64zM448 334.8L397.7 448L498.3 448L448 334.8z"/></svg>:
                      <select name="lang" id="menu" className='selectLang'  onChange={(e) => i18n.changeLanguage(e.target.value)} >
                        {/* <option value="ar">Arabic</option> */}
                          <option value="en" selected >English
                        </option>
                        <option value="fr">French</option>
                    </select>
                    </label>
                </span>
            <span className="displayMode">
                    <span > mode:</span>
                    <span  id='switchMode' 
                        >
                        <label className='modeIcon'>
                            <input type="checkbox" name="displayMode" />
                  <div className={nightMode ? 'dispalynight modeIcons' : '  modeIcons'} >
                    <div className="display-highlight"></div>
                    {nightMode &&
                      <svg className='moon' xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 640 640" onClick={() => changeMode(prev => !prev)}   ><path d="M320 64C178.6 64 64 178.6 64 320C64 461.4 178.6 576 320 576C388.8 576 451.3 548.8 497.3 504.6C504.6 497.6 506.7 486.7 502.6 477.5C498.5 468.3 488.9 462.6 478.8 463.4C473.9 463.8 469 464 464 464C362.4 464 280 381.6 280 280C280 207.9 321.5 145.4 382.1 115.2C391.2 110.7 396.4 100.9 395.2 90.8C394 80.7 386.6 72.5 376.7 70.3C358.4 66.2 339.4 64 320 64z" /></svg>
                    }
                    {!nightMode &&
                      <svg className='sun' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width="25" height="25" onClick={() => changeMode(prev => !prev)} ><path d="M320 32C328.4 32 336.3 36.4 340.6 43.7L396.1 136.3L500.9 110C509.1 108 517.8 110.4 523.7 116.3C529.6 122.2 532 131 530 139.1L503.7 243.8L596.4 299.3C603.6 303.6 608.1 311.5 608.1 319.9C608.1 328.3 603.7 336.2 596.4 340.5L503.7 396.1L530 500.8C532 509 529.6 517.7 523.7 523.6C517.8 529.5 509 532 500.9 530L396.2 503.7L340.7 596.4C336.4 603.6 328.5 608.1 320.1 608.1C311.7 608.1 303.8 603.7 299.5 596.4L243.9 503.7L139.2 530C131 532 122.4 529.6 116.4 523.7C110.4 517.8 108 509 110 500.8L136.2 396.1L43.6 340.6C36.4 336.2 32 328.4 32 320C32 311.6 36.4 303.7 43.7 299.4L136.3 243.9L110 139.1C108 130.9 110.3 122.3 116.3 116.3C122.3 110.3 131 108 139.2 110L243.9 136.2L299.4 43.6L301.2 41C305.7 35.3 312.6 31.9 320 31.9zM320 176C240.5 176 176 240.5 176 320C176 399.5 240.5 464 320 464C399.5 464 464 399.5 464 320C464 240.5 399.5 176 320 176zM320 416C267 416 224 373 224 320C224 267 267 224 320 224C373 224 416 267 416 320C416 373 373 416 320 416z" /></svg>
                    }
                                </div>
                   
                        </label>
                        </span>

            </span>
          </div>
            </div>
        </div>
      <div className="mainContent">
        {page == 'home' &&
          <>
          <Intro></Intro>
          <Input nightMode={nightMode}  ></Input>
          </>}
        {page == 'performance' && 
          <>
          <Performance></Performance>
          </>}
        {page== 'architecture' && 
        <Architecture></Architecture>
        }
        {page == 'mqtt' && 
        <LiveMonitor></LiveMonitor>
        }
        
      </div>
    </div>
  )
}

export default App
