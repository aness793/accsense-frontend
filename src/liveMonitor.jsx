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
    <div className="mqtt_bigger_container">
      <span style={{ color: connected ? '#22c55e' : '#ef4444' }} className='liveCheck'>
        {connected ? '🟢 Live Feed Active' : '🔴 Disconnected'}
      </span>
      <div className='mqtt_container'>
      {/* Connection status */}
      

      {/* Latest detection */}
      {latest && (
          <>
            <div
          style={{ borderRight: `4px solid ${SEVERITY_COLORS[latest.severity]}` }}
          className='FinalPrediction'>
          <h3>Latest Detection</h3>
          <div className="before-camera">
            <p><span>Severity:</span> {latest.severity.toUpperCase()=='NO_ACCIDENT'? 'no Accident' : latest.severity.toUpperCase()}</p>
            <p> <span>Confidence:</span> {latest.confidence}%</p>
            <p><span>Time:</span> {latest.timestamp}</p>
          </div>
        </div>
      
          {latest.frame && (
        <div className="camera">
        <img
              src={`data:image/jpeg;base64,${latest.frame}`}
              alt="latest frame"
            width={320} />
              </div>
      )}
        </>
            
          )}
      {/* Live feed history */}
      {history.length > 0 && (
        <table className='constantLogins'>
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
    </div>
  )
}