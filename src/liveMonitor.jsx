import { useLiveFeed } from './hooks/useLiveFeed'
import './mqtt.css'
const SEVERITY_COLORS = {
  no_accident: '#22c55e',
  minor: '#eab308',
  moderate: '#f97316',
  major: '#ef4444',
  uncertain: '#6b7280'
}

export default function LiveMonitor() {
  const { latest, connected, history } = useLiveFeed()

  return (
    <div className='mqtt_container'>
      {/* Connection status */}
      <span style={{ color: connected ? '#22c55e' : '#ef4444' }}>
        {connected ? '🟢 Live Feed Active' : '🔴 Disconnected'}
      </span>

      {/* Latest detection */}
      {latest && (
        <div style={{ borderLeft: `4px solid ${SEVERITY_COLORS[latest.severity]}` }}>
          <h3>Latest Detection</h3>
          <p>Severity: <strong>{latest.severity.toUpperCase()}</strong></p>
          <p>Confidence: {latest.confidence}%</p>
          <p>Time: {latest.timestamp}</p>
          {latest.frame && (
            <img
              src={`data:image/jpeg;base64,${latest.frame}`}
              alt="latest frame"
              width={320}
            />
          )}
        </div>
      )}

      {/* Live feed history */}
      {history.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>Severity</th>
              <th>Confidence</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item, i) => (
              <tr key={i} style={{ color: SEVERITY_COLORS[item.severity] }}>
                <td>{item.timestamp}</td>
                <td>{item.severity}</td>
                <td>{item.confidence}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}