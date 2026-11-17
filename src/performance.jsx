import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import './performance.css'

// TODO: fill from your test run. Do not ship XX.
const EVAL_INFO = {
  dataset: 'BTVAD',
  total: '2000',
  clips_per_class: '250',
  split: '70%-15%-15%',
}

// One place for every number. Sizes and params: verify with sum(p.numel()) and os.path.getsize.
// latencyMs: median inference_ms on CPU from your own runs (null shows n/a).
const RAW = [
  {
    id: 'r3d', name: 'R3D-18', params: '~33M', ckptMb: 381, latencyMs: null,
    acc: 89.3, accRecall: 95.09, noAccRecall: 72.0, auc: 92.5,
    macroF1: 63.1, minor: 53.6, moderate: 48.8, major: 74.5, sevAcc: 63.55,
  },
  {
    id: 'slowfast', name: 'SlowFast R50', params: '~35M', ckptMb: 412, latencyMs: null,
    acc: 87.63, accRecall: 97.3, noAccRecall: 58.7, auc: 81.69,
    macroF1: 36.0, minor: 42.0, moderate: 33.0, major: 32.0, sevAcc: 36.67,
  },
  {
    id: 'swin', name: 'Video Swin-T', params: '~28M', ckptMb: 342, latencyMs: null,
    acc: 88.96, accRecall: 98.7, noAccRecall: 60.0, auc: 85.2,
    macroF1: 60.0, minor: 56.0, moderate: 53.0, major: 71.0, sevAcc: 60.68,
  },
]

const DATA = RAW.map((m) => ({ ...m, bal: (m.accRecall + m.noAccRecall) / 2 }))

const KEYS = ['acc', 'bal', 'auc', 'accRecall', 'noAccRecall', 'macroF1', 'minor', 'moderate', 'major', 'sevAcc']
const BEST = Object.fromEntries(KEYS.map((k) => [k, Math.max(...DATA.map((m) => m[k]))]))

const pct = (v) => `${v.toFixed(1)}%`
const fmtMs = (ms) => (ms == null ? 'n/a' : ms >= 1000 ? `${(ms / 1000).toFixed(1)} s` : `${ms} ms`)

// catches the macro F1 inconsistency while developing
if (import.meta.env?.DEV) {
  DATA.forEach((m) => {
    const mean = (m.minor + m.moderate + m.major) / 3
    if (Math.abs(mean - m.macroF1) > 1) {
      console.warn(`[performance] ${m.name}: macro F1 ${m.macroF1} differs from mean of class F1s ${mean.toFixed(1)}`)
    }
  })
}

// your original sub navigation, same labels and state values
const TABS = [
  { id: 'per', label: 'Performance' },
  { id: 'ev', label: 'Evaluation' },
  { id: 'chart', label: 'Charts' },
]

function Num({ m, k, bar }) {
  return (
    <td data-best={m[k] === BEST[k] || undefined}>
      <span className="perf__num">{pct(m[k])}</span>
      {bar && <span className="perf__bar" style={{ '--v': m[k] }} aria-hidden="true" />}
    </td>
  )
}

function Performance({ nightMode }) {
  const { t } = useTranslation()
  const [perChoice, changeChoice] = useState('per')

  return (
    <div className="performance-container">

      <section className={nightMode ? 'perf perf--night' : 'perf'}>
        <div className="sub_nav">
        
        <div className="per-choice" role="tablist">
        {TABS.map(({ id, label }) => (
          <span
          key={id}
          role="tab"
          tabIndex={0}
          id={`tab-${id}`}
          aria-selected={perChoice === id}
          aria-controls={`panel-${id}`}
          className={perChoice === id ? 'per-chosen' : 'nnn'}
          onClick={() => changeChoice(id)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                changeChoice(id)
              }
            }}
            >
            {label}
          </span>
        ))}
      </div>
        </div>
        <header className="perf__head">
          <p className="perf__eyebrow">{t('Model comparison')}</p>
          <h1 className="perf__title">{t('Performance comparison')}</h1>
          <p className="perf__lead">
            {t('Underlined values are the best in their column.')}
          </p>
      
        </header>

        {/* ---------- PERFORMANCE ---------- */}
        {perChoice === 'per' && (
          <div role="tabpanel" id="panel-per" aria-labelledby="tab-per">
            <h2 className="perf__label"><span> {t('Accident detection and cost')}</span></h2>
            <div className="perf__wrap">
              <table className="perf__table">
                <thead>
                  <tr>
                    <th scope="col">{t('Model')}</th>
                    <th scope="col">{t('Accuracy')}</th>
                    <th scope="col">{t('Balanced acc.')}</th>
                    <th scope="col">AUC-ROC</th>
                    <th scope="col">{t('Params')}</th>
                    <th scope="col">{t('Checkpoint')}</th>
                    <th scope="col">{t('Latency (CPU)')}</th>
                  </tr>
                </thead>
                <tbody>
                  {DATA.map((m) => (
                    <tr key={m.id}>
                      <th scope="row">{m.name}</th>
                      <Num m={m} k="acc" />
                      <Num m={m} k="bal" />
                      <Num m={m} k="auc" />
                      <td>{m.params}</td>
                      <td>{m.ckptMb} MB</td>
                      <td>{fmtMs(m.latencyMs)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="perf__note">
              {t('Balanced accuracy is the mean of accident recall and no-accident recall, so it is not inflated by the larger class.')}
            </p>

            <h2 className="perf__label"><span>02 {t('Reading the numbers')}</span></h2>
            <ol className="perf__points">
              <li>{t('R3D-18 has the best AUC-ROC and the best severity macro F1.')}</li>
              <li>{t('All three models are weak on no-accident clips (recall 58.7 to 72.0%), so expect false alarms.')}</li>
              <li>{t('SlowFast severity accuracy is close to chance for three classes (33.3%).')}</li>
            </ol>
          </div>
        )}

        {/* ---------- EVALUATION ---------- */}
        {perChoice === 'ev' && (
          <div role="tabpanel" id="panel-ev" aria-labelledby="tab-ev">
            <h2 className="perf__label"><span>01 {t('Accident detection')}</span></h2>
            <div className="perf__wrap">
              <table className="perf__table">
                <thead>
                  <tr>
                    <th scope="col">{t('Model')}</th>
                    <th scope="col">{t('Accident recall')}</th>
                    <th scope="col">{t('No-accident recall')}</th>
                    <th scope="col">{t('Balanced acc.')}</th>
                    <th scope="col">AUC-ROC</th>
                  </tr>
                </thead>
                <tbody>
                  {DATA.map((m) => (
                    <tr key={m.id}>
                      <th scope="row">{m.name}</th>
                      <Num m={m} k="accRecall" bar />
                      <Num m={m} k="noAccRecall" bar />
                      <Num m={m} k="bal" />
                      <Num m={m} k="auc" />
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h2 className="perf__label">
              <span>02 {t('Severity estimation')}</span>
              <span className="perf__label-hint">{t('chance level: 33.3%')}</span>
            </h2>
            <div className="perf__wrap">
              <table className="perf__table">
                <thead>
                  <tr>
                    <th scope="col">{t('Model')}</th>
                    <th scope="col">Macro F1</th>
                    <th scope="col">Minor F1</th>
                    <th scope="col">Moderate F1</th>
                    <th scope="col">Major F1</th>
                    <th scope="col">{t('Accuracy')}</th>
                  </tr>
                </thead>
                <tbody>
                  {DATA.map((m) => (
                    <tr key={m.id}>
                      <th scope="row">{m.name}</th>
                      <Num m={m} k="macroF1" bar />
                      <Num m={m} k="minor" bar />
                      <Num m={m} k="moderate" bar />
                      <Num m={m} k="major" bar />
                      <Num m={m} k="sevAcc" />
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h2 className="perf__label"><span>03 {t('Evaluation protocol')}</span></h2>
            <dl className="perf__protocol">
              <div><dt>{t('Dataset')}</dt><dd>{EVAL_INFO.dataset}</dd></div>
              <div><dt>{t('Test clips')}</dt><dd>{EVAL_INFO.total} ({EVAL_INFO.accident} {t('accident')} / {EVAL_INFO.noAccident} {t('no accident')})</dd></div>
              <div><dt>{t('clips per class')}</dt><dd>{EVAL_INFO.clips_per_class}</dd></div>
              <div><dt>{t('Split')}</dt><dd>{EVAL_INFO.split}</dd></div>
            </dl>
          </div>
        )}

        {/* ---------- CHARTS ---------- */}
        {perChoice === 'chart' && (
          <div role="tabpanel" id="panel-chart" aria-labelledby="tab-chart">
            <h2 className="perf__label"><span>{t('Charts')}</span></h2>
            <div className="perf__charts">
              <figure>
                <img src="/comparison_bar_chart_left.png" alt={t('Bar chart comparing the three models on accident detection')} />
              </figure>
              <figure>
                <img src="/comparison_bar_chart_right.png" alt={t('Bar chart comparing the three models on severity estimation')} />
              </figure>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

export default Performance