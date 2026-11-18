import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import './input.css'

const API = import.meta.env.VITE_API_URL
const MAX_MB = 20

const MODELS = [
  { id: 'r3d', name: 'R3D-18', note: '3D ResNet' },
  { id: 'slowfast', name: 'SlowFast', note: 'Two-pathway CNN' },
  { id: 'swin', name: 'Video Swin', note: 'Shifted-window transformer' },
]
const SAMPLES = [
  { id: 'normal',      title: 'normal' },
  { id: 'minor',  title: 'Minor' },
  { id: 'moderate',     title: 'moderate' },
  { id: 'major', title: 'major' },
].map((s) => ({
  ...s,
  video: `/${s.id}.mp4`,
  thumb: `/${s.id}.png`,
  json: `/${s.id}.json`,
}))
const SCALE = ['no accident', 'minor', 'moderate', 'major']

const fmt = (ms) => (ms >= 1000 ? `${(ms / 1000).toFixed(1)} s` : `${ms} ms`)
const levelOf = (label) => String(label || '').replace(' ', '-')

function Input({ nightMode }) {
  const { t } = useTranslation()

  const [srcVideo, setSrcVideo] = useState('')
    const [rawFile, setRawFile] = useState(null)
const [sample, setSample] = useState(null)         // one of SAMPLES, or null
const [sampleData, setSampleData] = useState(null) // { id, data } from the precomputed JSON
  const [model, setModel] = useState('r3d')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [error, setError] = useState('')
  const [dragging, setDragging] = useState(false)
  const [history, setHistory] = useState([])
  const [server, setServer] = useState('waking') // waking | ready | down

  const loadHistory = () => {
    fetch(`${API}/history`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success') setHistory(data.data)
      })
      .catch(() => {})
  }

  // wake the free-tier backend as soon as the page opens
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      for (let i = 0; i < 12 && !cancelled; i++) {
        try {
          const r = await fetch(`${API}/health`, { signal: AbortSignal.timeout(10000) })
          if (r.ok) {
  if (!cancelled) setServer('ready')
  return
}
        } catch {
          /* keep polling */
        }
        await new Promise((res) => setTimeout(res, 4000))
      }
      if (!cancelled) setServer('down')
    })()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (server === 'ready') loadHistory()
  }, [server])

  useEffect(() => {
    if (!loading) return
    setElapsed(0)
    const id = setInterval(() => setElapsed((s) => s + 1), 1000)
    return () => clearInterval(id)
  }, [loading])

 useEffect(() => {
  return () => {
    if (srcVideo.startsWith('blob:')) URL.revokeObjectURL(srcVideo)
  }
}, [srcVideo])

  const onFile = (file) => {
  if (!file) return
  if (!file.type.startsWith('video/')) return setError(t('That file is not a video.'))
  if (file.size > MAX_MB * 1024 * 1024)
    return setError(t('File too large, max {{mb}} MB.', { mb: MAX_MB }))
  setError('')
  setResult(null)
  setSample(null)
  setSampleData(null)
  setRawFile(file)
  setSrcVideo(URL.createObjectURL(file))
}

const pickSample = (s) => {
  setError('')
  setResult(null)
  setRawFile(null)
  setSample(s)
  setSrcVideo(s.video)
  setSampleData(null)
  fetch(s.json)
    .then((r) => {
      const isJson = (r.headers.get('content-type') || '').includes('json')
      if (!r.ok || !isJson) throw new Error('not json')
      return r.json()
    })
    .then((d) => setSampleData({ id: s.id, data: d }))
    .catch(() => {
      setSampleData(null)
      setError(t('Precomputed results for this clip are missing.'))
    })
}

const fileName = sample ? `${sample.id}.mp4` : rawFile?.name

  const onDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    onFile(e.dataTransfer.files?.[0])
  }

const handlePredict = async () => {
  setError('')
  setResult(null)

  // samples: precomputed only, never the backend
  if (sample) {
    const pre = sampleData?.id === sample.id ? sampleData.data.models?.[model] : null
    if (!pre) return setError(t('No precomputed result for this clip and model.'))
    setResult({
      status: 'success',
      model,
      precomputed: true,
      results: { ...pre.clip_level, gradcam: pre.gradcam ?? null },
    })
    return
  }

  // uploads: live inference only if the backend can actually run it
  if (!rawFile) return setError(t('Pick a sample or upload a video first.'))
  if (!LIVE) {
    return setError(
      t('Live inference is unavailable on this server because of memory limits. Pick a sample clip.')
    )
  }

  const formData = new FormData()
  formData.append('video', rawFile)
  formData.append('model_name', model)

  setLoading(true)
  try {
    const res = await fetch(`${API}/predict`, {
      method: 'POST',
      body: formData,
      signal: AbortSignal.timeout(150000),
    })
    const data = await res.json().catch(() => null)
    if (!res.ok || !data || data.status !== 'success') {
      setError(data?.message || t('Request failed.'))
      return
    }
    setResult(data)
    setTimeout(loadHistory, 1500)
  } catch (e) {
    setError(
      e.name === 'TimeoutError'
        ? t('The server took too long and probably ran out of memory.')
        : t('Backend is not reachable. It may still be waking up.')
    )
  } finally {
    setLoading(false)
  }
}

  const r = result?.results
  // new backend sends label, old one only is_accident + severity
  const label = r ? (r.label ?? (r.is_accident ? r.severity : 'no accident')) : null
  const totalMs =
    r && r.inference_ms != null ? Math.round((r.preprocess_ms ?? 0) + r.inference_ms) : null
  const modelName = result ? (MODELS.find((m) => m.id === result.model)?.name ?? result.model) : ''

  const handleDownloadReport = async () => {
    try {
      const response = await fetch(`${API}/generate-report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          severity: r.severity,
          confidence: r.probability,
          model_name: result.model,
          video_name: fileName || 'unknown',
          timestamp: new Date().toISOString(),
        }),
      })
      if (!response.ok) throw new Error('report failed')
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `accident_report_${new Date().toISOString().slice(0, 10)}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      setError(t('Failed to generate the report.'))
    }
  }

  const serverText = {
    waking: t('Waking the server, the first run can take about a minute.'),
    ready: t('Server ready.'),
    down: t('Server unreachable.'),

  }[server]

  return (
    <section id="main" className={nightMode ? 'demo demo--night' : 'demo'}>
      <div className="demo__grid">
        {/* ---------- 01 INPUT ---------- */}
        <div className="demo__col">
  <h2 className="demo__label">
    <span> {t('Input')}</span>
    <span className="demo__label-hint">
      mp4 · {t('max')} {MAX_MB} MB
    </span>
  </h2>

  <div className="demo__samples" role="group" aria-label={t('Sample clips')}>
    {SAMPLES.map((s) => (
      <button
        key={s.id}
        type="button"
        className="demo__sample"
        aria-pressed={sample?.id === s.id}
        onClick={() => pickSample(s)}
      >
        <span className="demo__sample-thumb">
          <img
            src={s.thumb}
            alt=""
            loading="lazy"
            onError={(e) => { e.currentTarget.style.display = 'none' }}
          />
        </span>
        <span className="demo__sample-title">{t(s.title)}</span>
      </button>
    ))}
  </div>

  <input
    className="demo__file"
    type="file"
    id="upload"
    accept="video/*"
    onChange={(e) => onFile(e.target.files[0])}
  />

  {!srcVideo ? (
    <label
      htmlFor="upload"
      className={dragging ? 'demo__drop is-drag' : 'demo__drop'}
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" aria-hidden="true">
        <path d="M352 173.3L352 384C352 401.7 337.7 416 320 416C302.3 416 288 401.7 288 384L288 173.3L246.6 214.7C234.1 227.2 213.8 227.2 201.3 214.7C188.8 202.2 188.8 181.9 201.3 169.4L297.3 73.4C309.8 60.9 330.1 60.9 342.6 73.4L438.6 169.4C451.1 181.9 451.1 202.2 438.6 214.7C426.1 227.2 405.8 227.2 393.3 214.7L352 173.3zM320 464C364.2 464 400 428.2 400 384L480 384C515.3 384 544 412.7 544 448L544 480C544 515.3 515.3 544 480 544L160 544C124.7 544 96 515.3 96 480L96 448C96 412.7 124.7 384 160 384L240 384C240 428.2 275.8 464 320 464z" />
      </svg>
      <span className="demo__drop-title">{t('Or upload your own clip')}</span>
      <span className="demo__drop-sub">{t('drop a file here or click to browse')}</span>
    </label>
  ) : (
    <>
      <div className="demo__player">
        <video key={srcVideo} src={srcVideo} controls preload="metadata" />
      </div>
      <div className="demo__filebar">
        <span className="demo__filename" title={fileName}>{fileName}</span>
        <label htmlFor="upload" className="demo__replace">{t('Upload your own')}</label>
      </div>
    </>
  )}
</div>

        {/* ---------- 02 MODEL + 03 OUTPUT ---------- */}
        <div className="demo__col">
          <h2 className="demo__label" id="model-label">
            <span> {t('Model')}</span>
          </h2>

          <div role="radiogroup" aria-labelledby="model-label">
            {MODELS.map((m) => (
              <label key={m.id} className="demo__model" data-checked={model === m.id}>
                <input
                  type="radio"
                  name="model"
                  value={m.id}
                  checked={model === m.id}
                  onChange={() => setModel(m.id)}
                />
                <span className="demo__model-name">{m.name}</span>
                <span className="demo__model-note">{t(m.note)}</span>
              </label>
            ))}
          </div>

          <div className="demo__run-wrap">
            <button
              type="button"
              className="demo__run"
              onClick={handlePredict}
              aria-busy={loading}
              disabled={loading || (sample && sampleData?.id !== sample.id)}
            >
              {loading ? `${t('Analyzing')}... ${elapsed} s` : t('Run detection')}
            </button>
            <p className="demo__status" data-state={server}>
              {serverText}
            </p>
            
          </div>

          <h2 className="demo__label">
            <span> {t('Output')}</span>
          </h2>

          {error && (
            <p className="demo__error" role="alert">
              {error}
            </p>
          )}

          {!r && !error && (
            <p className="demo__empty">
              {loading
                ? t('Running the model on your clip.')
                : t('Pick a clip and a model, then run detection.')}
                 
            </p>
          )}
         
          {r && (
            <div className="demo__result" data-severity={levelOf(label)}>
              <div className="demo__verdict">
                <span className="demo__swatch" aria-hidden="true" />
                <span className="demo__verdict-label">{t(label)}</span>
                {r.uncertain && <span className="demo__tag">{t('low confidence')}</span>}
                {result.precomputed && (
  <span className="demo__tag demo__tag--neutral">{t('precomputed, hardware issues')}</span>
)}
              </div>

              <dl className="demo__readout">
                <div>
                  <dt>{t('Confidence')}</dt>
                  <dd>{r.probability}</dd>
                </div>
                {r.p_accident != null && (
                  <div>
                    <dt>P({t('accident')})</dt>
                    <dd>{r.p_accident.toFixed(3)}</dd>
                  </div>
                )}
                <div>
                  <dt>{t('Severity')}</dt>
                  <dd>{r.is_accident ? t(r.severity) : 'n/a'}</dd>
                </div>
                {totalMs != null && (
                  <div>
                    <dt>{t('Inference')}</dt>
                    <dd>{fmt(totalMs)} · CPU</dd>
                  </div>
                )}
                <div>
                  <dt>{t('Model')}</dt>
                  <dd>{modelName}</dd>
                </div>
              </dl>

              <ol className="demo__scale" aria-label={t('Severity scale')}>
                {SCALE.map((s) => (
                  <li key={s} data-level={levelOf(s)} data-active={s === label}>
                    {t(s)}
                  </li>
                ))}
              </ol>

              {r.is_accident && r.severity === 'major' && !result.precomputed && (
                <button type="button" className="demo__report" onClick={handleDownloadReport}>
                  {t('Download report')}
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" aria-hidden="true">
                    <path d="M352 96C352 78.3 337.7 64 320 64C302.3 64 288 78.3 288 96L288 306.7L246.6 265.3C234.1 252.8 213.8 252.8 201.3 265.3C188.8 277.8 188.8 298.1 201.3 310.6L297.3 406.6C309.8 419.1 330.1 419.1 342.6 406.6L438.6 310.6C451.1 298.1 451.1 277.8 438.6 265.3C426.1 252.8 405.8 252.8 393.3 265.3L352 306.7L352 96zM160 384C124.7 384 96 412.7 96 448L96 480C96 515.3 124.7 544 160 544L480 544C515.3 544 544 515.3 544 480L544 448C544 412.7 515.3 384 480 384L160 384z" />
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ---------- HISTORY ---------- */}
      <div className="demo__history">
        <h2 className="demo__label">
          <span>{t('History')}</span>
        </h2>
        {history.length === 0 ? (
          <p className="demo__empty">{t('No analyses logged yet.')}</p>
        ) : (
          <div className="demo__table-wrap">
            <table className="demo__table">
              <thead>
                <tr>
                  <th>{t('Video')}</th>
                  <th>{t('Result')}</th>
                  <th>{t('Confidence')}</th>
                  <th>{t('Model')}</th>
                  <th>{t('Time')}</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item, i) => {
                  const l = item.is_accident ? item.severity : 'no accident'
                  return (
                    <tr key={item.id ?? i} data-severity={levelOf(l)}>
                      <td className="demo__cell-name" title={item.video_name}>
                        {item.video_name}
                      </td>
                      <td>
                        <span className="demo__swatch demo__swatch--sm" aria-hidden="true" />
                        {t(l)}
                      </td>
                      <td>{item.confidence}</td>
                      <td>{item.model_name?.toUpperCase()}</td>
                      <td>{new Date(item.analyzed_at).toLocaleString()}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  )
}

export default Input 