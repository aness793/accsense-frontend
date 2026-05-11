import { useTranslation } from 'react-i18next';
import './intro.css';
function Intro() {
    const {t} = useTranslation()
    return (
        <div className="main">
            <h1>{t('Welcome to AccSense')}</h1>
            <p>{t('AccSense is an innovative accident detection system designed to enhance road safety and provide timely assistance in emergencies. Our platform utilizes advanced sensors and machine learning algorithms to detect accidents in real-time, allowing for rapid response and potentially saving lives')}.</p>
            <a href="#main"><button>{t('Get Started')}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" height="20" width="20" ><path d="M439.1 297.4C451.6 309.9 451.6 330.2 439.1 342.7L279.1 502.7C266.6 515.2 246.3 515.2 233.8 502.7C221.3 490.2 221.3 469.9 233.8 457.4L371.2 320L233.9 182.6C221.4 170.1 221.4 149.8 233.9 137.3C246.4 124.8 266.7 124.8 279.2 137.3L439.2 297.3z"/></svg>
            </button></a>
        </div>
    )
}
export default Intro