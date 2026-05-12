// src/App.jsx
import './performance.css'
import NavBar from './NavBar'
import Intro from './Intro'
import Input from './input'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
    // const { t } = useTranslation()

function Performance() {
  const {t} = useTranslation()
  const [perChoice,changeChoice] = useState('per')
  return (

    <div className="performance-container">
      <div className="per-choice">
        <span className={perChoice==='per'? 'per-chosen' : 'nnn'} onClick={()=> changeChoice('per')} >Performance</span>
        <span className={perChoice==='ev'? 'per-chosen' : 'nnn'} onClick={()=> changeChoice('ev')}>Evaluation</span>
        <span className={perChoice==='chart'? 'per-chosen' : 'nnn'} onClick={()=> changeChoice('chart')}>Charts</span>
      </div>
      <div className="performance-title">
        <h1>{t('Performance Comparison')}</h1>
      </div>
      <div>
        {perChoice==='per' && (<div className="models-container">
          <div className="r3d">
            <div className="per-img">
              <h1>R3D-18</h1>
            </div>
            <div className="per-info">
              <span>
                {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M64 320C64 178.6 178.6 64 320 64C461.4 64 576 178.6 576 320C576 461.4 461.4 576 320 576C178.6 576 64 461.4 64 320z"/></svg> */}
                {t('Inference Time')}: 5s-20s </span>
                 <span>{t('Model Size')}: 381MB </span>
                 <span>{t('Accuracy')}: 89.30% </span>
            </div>
          </div>
          <div className="slowfast">
             <div className="per-img">
              <h1>SlowFast</h1>
            </div>
            <div className="per-info">
                 <span>{t('Inference Time')}: 5s-20s </span>
                 <span>{t('Model Size')}: 412MB </span>
                 <span>{t('Accuracy')}: 87.63%</span>
            </div>
          </div>
          <div className="swin">
             <div className="per-img">
              <h1>Swin Transformer</h1>
            </div>
            <div className="per-info">
                 <span>{t('Inference Time')}: 5s-20s </span>
                 <span>{t('Model Size')}: 342MB</span>
                 <span>{t('Accuracy')}: 88.96%</span>              
            </div>
          </div>
        </div>)}
        {perChoice == 'ev' && (
          <div className='all-evaluation-metrics' >
            <div className="ev-metrics">
              <h1>{t('Accident Detection Comparison Table')}</h1>
          <div className="comparison-titles">
            <span>{t('Model')}</span>
            <span>{t('Accuracy')}</span>
            <span>{t('Accident Recall')}</span>
            <span>{t('No Accident Recall')}</span>
            <span>AUC-ROC</span>
          </div>
          <div className="comparison-r3d">
            <span>R3D-18</span>
            <span>89.30%</span>
            <span>95.09%</span>
            <span>72.00%</span>
            <span>92.5%</span>

          </div>
          <div className="comparison-slowfast">
            <span>SlowFast R50</span>
            <span>87.63%</span>
            <span>97.30%</span>
            <span>58.70%</span>
            <span>81.69%</span>

          </div>
          <div className="comparison-swin">
            <span>Swin transformer</span>
            <span>88.96%</span>
            <span>98.70%</span>
            <span>60.00%</span>
            <span>85.20%</span>

          </div>
          </div>
            <div className="ev-metrics">
              <h1>Severity Estimation Comparison Table</h1>  
          <div className="comparison-titles">
            <span>{t('Model')}</span>
            <span>Macro F1</span>
            <span>Minor F1</span>
            <span>Moderate F1</span>
            <span>Major F1</span>
            <span>{t('Accuracy')}</span>
          </div>
          <div className="comparison-r3d">
            <span>R3D-18</span>
            <span>63.10%</span>
            <span>53.60%</span>
            <span>48.8%</span>
            <span>74.5%</span>
            <span>63.55%</span>
          </div>
          <div className="comparison-slowfast">
            <span>SlowFast R50</span>
            <span>36.00%</span>
            <span>42.00%</span>
            <span>33.00%</span>
            <span>32.00%</span>
            <span>36.67%</span>
          </div>
          <div className="comparison-swin">
            <span>Swin transformer</span>
            <span>60.00%</span>
            <span>56.00%</span>
            <span>53.00%</span>
            <span>71.00%</span>
            <span>60.68%</span>
          </div>
        </div>
          </div>
        )}

        {perChoice == 'chart' &&
          <div className="charts-container">
            <img src="public/comparison_bar_chart_left.png" alt="" />
            <img src="public/comparison_bar_chart_right.png" alt="" />
          </div>

        }
        
      </div>
      </div>
  )
}

export default Performance
