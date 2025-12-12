import Navbar from "../pages/navbar.jsx";
import styles from "../styles/dashboard.module.css";
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import SensorsIcon from '@mui/icons-material/Sensors';
import WarningIcon from '@mui/icons-material/Warning';
import EmergencyRecordingIcon from '@mui/icons-material/EmergencyRecording';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';

export default function Dashboard() {
  return (
    <div className={styles.pageWrapper}>
      <Navbar />
      <div className={styles.dashboardGrid}>
        <div className={styles.leftPanel}>
          <div className={styles.liveFeedContainer}>
            <div className={styles.sectionHeader}><LiveTvIcon/> Live Feed</div>
            <div className={`${styles.feedBox} beforeTreatment`}>
              <div className={styles.liveTag}><CameraAltIcon/> LIVE</div>
              <img
                src="/images/placeholder-feed.png"
                alt="Live Camera Feed"
                className={styles.feedImage}
              />
            </div>
          </div>
          <div className={styles.statusSection}>
            <div className={styles.sectionHeader}><SensorsIcon/> IoT System Status</div>
            <div className={styles.statusGrid}>
              <div className={styles.statusItem}>Valve 1: <span className={styles.statusOn}><ToggleOnIcon/></span></div>
              <div className={styles.statusItem}>Valve 2: <span className={styles.statusOff}><ToggleOffIcon/></span></div>
              <div className={styles.statusItem}>Pump 1: <span className={styles.statusOn}><ToggleOnIcon/></span></div>
              <div className={styles.statusItem}>Pump 2: <span className={styles.statusOff}><ToggleOffIcon/></span></div>
              <div className={styles.statusItem}>Filtration Unit: <span className={styles.statusRunning}><SensorsIcon/></span></div>
            </div>
          </div>
        </div>
        <div className={styles.rightPanel}>
          <div className={styles.analysisSection}>
            <div className={styles.sectionHeader}><SensorsIcon/> Analysis Summary</div>
            <div className={styles.metricsBox}>
              <div className={styles.metricCard}>
                <div>Microplastic Confidence</div>
                <div className={styles.metricValue}>95%</div>
              </div>
              <div className={styles.metricCard}>Avg Size: <span className={styles.metricValue}>150 μm</span></div>
              <div className={styles.metricCard}>MP Count: <span className={styles.metricValue}>1520 Pts/L</span></div>
              <div className={styles.metricCard}>Noise Count: <span className={styles.metricValue}>500 Pts/L</span></div>
            </div>
          </div>
          <div className={styles.graphSection}>
            <div className={styles.sectionHeader}>Concentration Trend (Particles/L)</div>
            <div className={styles.graphBox}>[Graph Placeholder]</div>
          </div>
          <div className={styles.alertSection}>
            <div className={styles.sectionHeader}><WarningIcon/> System Alerts</div>
            <div className={styles.alertList}>
              <div className={styles.alertCritical}><EmergencyRecordingIcon/> FEED LOSS: Camera Stream Offline</div>
              <div className={styles.alertWarning}><WarningIcon/> WATER LEVEL CRITICAL: Overflow Imminent</div>
              <div className={styles.alertInfo}><SensorsIcon/> Filtration Cycle Complete</div>
            </div>
          </div>
          <div className={styles.controlSection}>
            <div className={styles.sectionHeader}>IoT System Control</div>
            <div className={styles.controlsGrid}>
              <button className={styles.toggleBtn}><ToggleOnIcon/> Filtration Pump</button>
              <button className={styles.toggleBtn}><ToggleOnIcon/> Bypass Valve</button>
              <button className={styles.emergencyBtn}><EmergencyRecordingIcon/> EMERGENCY SHUTDOWN</button>
              <button className={styles.logBtn}>Capture Data Log</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}