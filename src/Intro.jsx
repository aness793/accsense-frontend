import { useTranslation } from 'react-i18next';
import './intro.css';

// TODO: fill with real values from one of your precomputed clips. Do not ship the XX placeholders.
const PREVIEW = {
  severity: 'major',   // 'no accident' | 'minor' | 'moderate' | 'major'
  confidence: '88.8%',
  inference: '±5s · CPU',
};

function Intro() {
  const { t } = useTranslation();

  return (
    <section className="intro">
      <div className="intro__text">
        <div>
          <p className="intro__eyebrow">{t('accident detection with machine learning')}</p>
          <h1 className="intro__title">
            {t('Platform for accident detection and severity estimation.')}
          </h1>
          <p className="intro__lead">
            {t('Three video models (R3D-18, SlowFast, Video Swin) trained to output one of four classes: no accident, minor, moderate or major.')}
          </p>
        </div>

        <div className="intro__actions">
          <a className="intro__cta" href="#main">
            {t('Try a sample clip')}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" aria-hidden="true">
              <path d="M439.1 297.4C451.6 309.9 451.6 330.2 439.1 342.7L279.1 502.7C266.6 515.2 246.3 515.2 233.8 502.7C221.3 490.2 221.3 469.9 233.8 457.4L371.2 320L233.9 182.6C221.4 170.1 221.4 149.8 233.9 137.3C246.4 124.8 266.7 124.8 279.2 137.3L439.2 297.3z" />
            </svg>
          </a>
          <p className="intro__hint">{t('or upload your own · mp4 · max 20 MB')}</p>
        </div>
      </div>

      <div className="intro__visual">
        <div className="intro__frame">
          <img
            className="intro__img"
            src="/landing_page.jpg"
            // alt={t('Grad-CAM heatmap on a dashcam frame')}
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
          <span className="intro__corner intro__corner--tl" aria-hidden="true" />
          <span className="intro__corner intro__corner--tr" aria-hidden="true" />
          <span className="intro__corner intro__corner--bl" aria-hidden="true" />
          <span className="intro__corner intro__corner--br" aria-hidden="true" />

          <div className="intro__hud">
            <span>Choose a model - get detection and severity results</span>
            {/* <span>R3D-18 · Grad-CAM, {t('mid frame')}</span> */}
            {/* <span>{t('where the model looked, not the impact')}</span> */}
          </div>
          {/* <span className="intro__replay">{t('replay of a precomputed result')}</span> */}
        </div>

        <dl className="intro__readout">
          <div>
            <dt>{t('Label')}</dt>
            <dd data-severity={PREVIEW.severity.replace(' ', '-')}>{t(PREVIEW.severity)}</dd>
          </div>
          <div>
            <dt>{t('confidence')}</dt>
            <dd>{PREVIEW.confidence}</dd>
          </div>
          <div>
            <dt>{t('Inference')}</dt>
            <dd>{PREVIEW.inference}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}

export default Intro;