import React, { useEffect, useRef, useState } from 'react'
import './architecture.css'
import { useTranslation } from 'react-i18next';
function Architecture() {
    const [archChoice, changeArch] = useState('general')
 const preloadedImages = useRef([]);
    const {t} = useTranslation()
useEffect(() => {
  const srcs = [
    '/figures/accsense_inference_pipeline.png',
    '/figures/r3d.webp',
    '/figures/slowfast.webp',
    '/figures/swin.webp',
  ];
  srcs.forEach((src) => {
    const img = new Image();
    img.src = src;
    img.decode()
      .then(() => {
        preloadedImages.current.push(img); // keep reference alive
        console.log(`${src} ready`);
      })
      .catch(console.error);
  });
}, []);
  return (
      <div className='arch-container'>
          <div className="arch-choice-container">
              <div className="arch-choice">
                  <span className={archChoice == 'general' ? 'arch-chosen' : ''} onClick={() => { changeArch('general');  }} >General Pipeline</span>
              <span className={archChoice=='r3d'? 'arch-chosen' :'' } onClick={()=> changeArch('r3d') } >R3D-18</span>
              <span className={archChoice=='slowfast'? 'arch-chosen' :'' } onClick={()=> changeArch('slowfast') } >SlowFast R50</span>
              <span className={archChoice=='swin'? 'arch-chosen' :'' } onClick={()=> changeArch('swin') } >Swin Transformer</span>
      </div>
          </div>
      <div className="diagram">
              {archChoice == 'general' &&
                  <div>
                      <h1>{t('General Pipeline')}</h1>
                      <img src="/figures/accsense_inference_pipeline.png" alt="" />
                  </div>
                  }
              {archChoice == 'r3d' &&
                  <div>
                      <h1>R3D-18 Architecture</h1>
                      <img src="/figures/r3d.webp" alt="" />
                  </div>
              }
              {archChoice == 'slowfast' &&
              <div>
                      <h1>SlowFast R50 Architecture</h1>
                  <img src="/figures/slowfast.webp" alt="" />
                  </div>
              }
              {archChoice == 'swin' &&
                  <div>
                      <h1>Swin Transformer Architecture</h1>
                      <img src="/figures/swin.webp" alt="" />
                  </div>
              
              }
      </div>
      </div>
  )
}

export default Architecture
