import { useEffect, useState } from 'react'
import './input.css'
import { useTranslation } from 'react-i18next'

function Input({nightMode}) {
    const [srcVideo, setSrcVideo] = useState("")
    const [rawFile, setRawFile] = useState(null) // To store the actual file
    const [model, setModel] = useState('r3d')    // Default model
    const [result, setResult] = useState(null)   // To store backend response
    const [loading, setLoading] = useState(false)
    const [mdl, changeModel] = useState('r3d')
    const [history, setHistory] = useState([])
    
    const { t } = useTranslation()
    useEffect(() => {
    fetch(import.meta.env.VITE_API_URL+"/history")
        .then(res => res.json())
        .then(data => {
            if (data.status === "success") setHistory(data.data)
        })
}, [])
    const handleDownloadReport = async () => {
    try {
        const response = await fetch("http://127.0.0.1:8000/generate-report", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                severity: result.results.severity,
                confidence: result.results.probability,
                model_name: result.model,
                video_name: rawFile?.name || "unknown",
                timestamp: new Date().toISOString()
            })
        })

        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `accident_report_${new Date().toISOString().slice(0,10)}.pdf`
        a.click()
        URL.revokeObjectURL(url)
    } catch (error) {
        console.error("Report generation failed:", error)
        alert("Failed to generate report!")
    }
}
    const vidchange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setRawFile(file) // Store the file for the backend
            const url = URL.createObjectURL(file)
            setSrcVideo(url) // Store the URL for the preview
        }
    }

    const handlePredict = async () => {
        if (!rawFile) return alert("Please upload a video first!");

        const formData = new FormData();
        formData.append("video", rawFile);
        formData.append("model_name", model);

        setLoading(true);
        try {
            const response = await fetch("http://127.0.0.1:8000/predict", {
                method: "POST",
                body: formData,
            });
            const data = await response.json();
            setResult(data);
        } catch (error) {
            console.error("Error connecting to backend:", error);
            alert("Backend server is not running!");
        } finally {
            setLoading(false);
        }
    }

    return (
        <section id="main">
            <div  className={nightMode? 'night main-input' : 'main-input'} >
               
            <div className="import">
                    <span  className='steps' >
                        <h2>1</h2>
                        <h1 >{t('Upload a video')}</h1>
                </span>
                    <div className="uploadButton">
                        <input type="file" name="video" id="upload" 
                    accept='video/*'
                    onChange={vidchange}
                        hidden
                        />
                        <label htmlFor="upload" className='customUpload' >
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M352 173.3L352 384C352 401.7 337.7 416 320 416C302.3 416 288 401.7 288 384L288 173.3L246.6 214.7C234.1 227.2 213.8 227.2 201.3 214.7C188.8 202.2 188.8 181.9 201.3 169.4L297.3 73.4C309.8 60.9 330.1 60.9 342.6 73.4L438.6 169.4C451.1 181.9 451.1 202.2 438.6 214.7C426.1 227.2 405.8 227.2 393.3 214.7L352 173.3zM320 464C364.2 464 400 428.2 400 384L480 384C515.3 384 544 412.7 544 448L544 480C544 515.3 515.3 544 480 544L160 544C124.7 544 96 515.3 96 480L96 448C96 412.7 124.7 384 160 384L240 384C240 428.2 275.8 464 320 464zM464 488C477.3 488 488 477.3 488 464C488 450.7 477.3 440 464 440C450.7 440 440 450.7 440 464C440 477.3 450.7 488 464 488z"/></svg>
                            {t('Click to upload')}
                        </label>
                </div>
                    <div className={srcVideo ? 'no-vid-cont ' : 'video-container'}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M176 544C96.5 544 32 479.5 32 400C32 336.6 73 282.8 129.9 263.5C128.6 255.8 128 248 128 240C128 160.5 192.5 96 272 96C327.4 96 375.5 127.3 399.6 173.1C413.8 164.8 430.4 160 448 160C501 160 544 203 544 256C544 271.7 540.2 286.6 533.5 299.7C577.5 320 608 364.4 608 416C608 486.7 550.7 544 480 544L176 544zM337 255C327.6 245.6 312.4 245.6 303.1 255L231.1 327C221.7 336.4 221.7 351.6 231.1 360.9C240.5 370.2 255.7 370.3 265 360.9L296 329.9L296 432C296 445.3 306.7 456 320 456C333.3 456 344 445.3 344 432L344 329.9L375 360.9C384.4 370.3 399.6 370.3 408.9 360.9C418.2 351.5 418.3 336.3 408.9 327L336.9 255z"/></svg>
                        <p>{t('Upload a video')}</p>
                        {srcVideo && <video src={srcVideo} crossOrigin="anonymous" width="400" controls preload="metadata"></video>}

                </div>
                </div>

            <div className="model">
                    <div className="model-input">
                        <span className="steps">
                        <h2>2</h2>
                            <h1>
                                {t('Choose a model')}</h1>
                </span>
                        
                <div className="models">
                            <div  >
                                <div className="model-choice">
                                <label htmlFor="r3d"
                                className={mdl==='r3d' ? 'highlitedModel':'normal-model'}>
                        <input type="radio" name="model" id="r3d"
                            defaultChecked
                                        onChange={() => {
                                            setModel('r3d')
                                            { mdl==changeModel('r3d') }
                                        }} 
                                        
                        />
                        R3D-18
                    </label>
                                <label htmlFor="Slowfast"
                            className={mdl==='slowfast' ? 'highlitedModel':'normal-model'}
>
                        <input type="radio" name="model" id="Slowfast"
                                        onChange={() => {
                                            setModel('slowfast') 
                                            changeModel('slowfast')
                                        } } 
                          
                        />
                        Slowfast
                    </label  >
                                <label htmlFor="swin"
                                className={mdl==='swin' ? 'highlitedModel':'normal-model'}        >
                        <input type="radio" name="model" id="swin"
                                        onChange={() => {
                                            setModel('swin')
                                            changeModel('swin')
                                        }} 
                                
                        />
                         Swin <br /> Transformer
                            </label>
                    </div>
                            </div>
                            <button className="predict-btn" onClick={handlePredict} disabled={loading}>
                {loading ? t("Analyzing...") : t("Run Detection")}
            </button>
                        </div>
                            {result && result.status === "success" && (
                <div className="results">
                                <h2>{t('Analysis Results')} </h2>
                                {(result.results.severity=='major' || result.results.severity=='moderate') &&
                                <div className={result.results.severity=='major' ? 'results-content major' : 'results-content moderate'}>
                    <p className={result.results.is_accident? 'red' : 'green'} > <span>{t('Decision')}:</span> {result.results.is_accident ? " Accident" : " No Accident"}</p>
                    <p  > <span>{t('Severity')}:</span> {result.results.severity}</p>
                    <p><span>{t('Confidence')}:</span> {result.results.probability}</p>
                                    <p><span>{t('detection time')}:</span> {result.results.time_ms}s</p>
                                        <p><span>{t('Model')}: </span> {result.model}</p>
                                        {(result.results.severity == 'major') && 
                                        <button onClick={handleDownloadReport} >{t('Download Report')}
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M352 96C352 78.3 337.7 64 320 64C302.3 64 288 78.3 288 96L288 306.7L246.6 265.3C234.1 252.8 213.8 252.8 201.3 265.3C188.8 277.8 188.8 298.1 201.3 310.6L297.3 406.6C309.8 419.1 330.1 419.1 342.6 406.6L438.6 310.6C451.1 298.1 451.1 277.8 438.6 265.3C426.1 252.8 405.8 252.8 393.3 265.3L352 306.7L352 96zM160 384C124.7 384 96 412.7 96 448L96 480C96 515.3 124.7 544 160 544L480 544C515.3 544 544 515.3 544 480L544 448C544 412.7 515.3 384 480 384L433.1 384L376.5 440.6C345.3 471.8 294.6 471.8 263.4 440.6L206.9 384L160 384zM464 440C477.3 440 488 450.7 488 464C488 477.3 477.3 488 464 488C450.7 488 440 477.3 440 464C440 450.7 450.7 440 464 440z"/></svg>
                                        </button>} 
                    </div>
                                }
                                {(!result.results.is_accident || result.results.severity == 'minor') &&
                                    <div className={result.results.severity=='N/A' ? 'results-content no-acc' : 'results-content minor'}>
                    <p className={result.results.is_accident? 'red' : 'green'} > <span>{t('Decision')}:</span> {result.results.is_accident ? " Accident" : " No Accident"}</p>
                    <p  > <span>{t('Severity')}:</span> {result.results.severity}</p>
                    <p><span>{t('Confidence')}:</span> {result.results.probability}</p>
                                    <p><span>{t('detection time')}:</span> {result.results.time_ms}s</p>
                                        <p><span>{t('Model')}: </span> {result.model}</p>
                                        
                                    </div>}
                                
                </div>
            )}
                    </div>
                </div>
                        
            </div>  
        
<div className="history">
    <h1>{t('History')}</h1>
                <div className="history-content">
                    {/* {history.length === 0 &&
                        (
                        <p>no accident detected</p>
                    )
                    }
                    {
                        history.length != 0 && 
                        ( */}
            <div className='history-table'>
                <div className="history-titles">
                    <span>{t('Video')}</span>
                    <span>{t('Severity')}</span>
                    <span>{t('Confidence')}</span>
                    <span>{t('Model')}</span>
                    <span>{t('Time')}</span>
                    </div>
                    <div className="history-data">
                    {history.map((item, i) => (
                        <div key={i} className='history-info' >
                        <span>{item.video_name}</span>
                        <span>{item.severity}</span>
                        <span>{item.confidence}</span>
                        <span>{item.model_name?.toUpperCase()}</span>
                        <span>{new Date(item.analyzed_at).toLocaleTimeString()}</span>
                    </div>
                ))}                
                    </div>
                            </div>
                        {/* )
                    } */}
    </div>
                
</div>
            
        
        </section>
    )
}

export default Input