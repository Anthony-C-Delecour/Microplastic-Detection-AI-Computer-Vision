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
      <div className={styles.fontUniform}>
        <div className={styles.dashboardGrid}>
          <div className={styles.leftPanel}>
            <div className={`${styles.section} ${styles.liveFeedContainer}`}>
              <div className={styles.sectionHeader}>
                <span className={styles.headerIcon}><LiveTvIcon /></span>
                <span>Live Feed</span>
              </div>
              <div className={`${styles.feedBox} beforeTreatment`}>
                <div className={styles.liveTag}>
                  <CameraAltIcon className={styles.statusIcon} /> LIVE
                </div>
                <img
                  src="/images/placeholder-feed.png"
                  alt="Live Camera Feed"
                  className={styles.feedImage}
                />
              </div>
            </div>
            <div className={`${styles.section} ${styles.statusSection}`}>
              <div className={styles.sectionHeader}>
                <span className={styles.headerIcon}><SensorsIcon /></span>
                <span>IoT System Status</span>
              </div>
              <div className={styles.statusGrid}>
                <div className={styles.statusItem}>
                  <div className={styles.statusLabel}>
                    <ToggleOnIcon className={styles.statusIcon} />
                    Valve 1
                  </div>
                  <span className={styles.statusOn}>ON</span>
                </div>
                <div className={styles.statusItem}>
                  <div className={styles.statusLabel}>
                    <ToggleOffIcon className={styles.statusIcon} />
                    Valve 2
                  </div>
                  <span className={styles.statusOff}>OFF</span>
                </div>
                <div className={styles.statusItem}>
                  <div className={styles.statusLabel}>
                    <ToggleOnIcon className={styles.statusIcon} />
                    Pump 1
                  </div>
                  <span className={styles.statusOn}>ON</span>
                </div>
                <div className={styles.statusItem}>
                  <div className={styles.statusLabel}>
                    <ToggleOffIcon className={styles.statusIcon} />
                    Pump 2
                  </div>
                  <span className={styles.statusOff}>OFF</span>
                </div>
                <div className={styles.statusItem}>
                  <div className={styles.statusLabel}>
                    <SensorsIcon className={styles.statusIcon} />
                    Filtration Unit
                  </div>
                  <span className={styles.statusRunning}>RUNNING</span>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.rightPanel}>
            <div className={`${styles.section} ${styles.analysisSection}`}>
              <div className={styles.sectionHeader}>
                <span className={styles.headerIcon}><SensorsIcon /></span>
                <span>Analysis Summary</span>
              </div>
              <div className={styles.metricsBox}>
                <div className={styles.metricCard}>
                  Microplastic Confidence:
                  <span className={styles.metricValue}>95%</span>
                </div>
                <div className={styles.metricCard}>
                  Avg Size:
                  <span className={styles.metricValue}>150 μm</span>
                </div>
                <div className={styles.metricCard}>
                  MP Count:
                  <span className={styles.metricValue}>1520 Pts/L</span>
                </div>
                <div className={styles.metricCard}>
                  Noise Count:
                  <span className={styles.metricValue}>500 Pts/L</span>
                </div>
              </div>
            </div>
            <div className={`${styles.section} ${styles.graphSection}`}>
              <div className={styles.sectionHeader}>
                <span>Concentration Trend (Particles/L)</span>
              </div>
              <div className={styles.graphBox}>
                [Graph Placeholder]
              </div>
            </div>
            <div className={`${styles.section} ${styles.alertSection}`}>
              <div className={styles.sectionHeader}>
                <span className={styles.headerIcon}><WarningIcon /></span>
                <span>System Alerts</span>
              </div>
              <div className={styles.alertList}>
                <div className={styles.alertCritical}>
                  <EmergencyRecordingIcon className={styles.statusIcon} />
                  FEED LOSS: Camera Stream Offline
                </div>
                <div className={styles.alertWarning}>
                  <WarningIcon className={styles.statusIcon} />
                  WATER LEVEL CRITICAL: Overflow Imminent
                </div>
                <div className={styles.alertInfo}>
                  <SensorsIcon className={styles.statusIcon} />
                  Filtration Cycle Complete
                </div>
              </div>
            </div>
            <div className={`${styles.section} ${styles.controlSection}`}>
              <div className={styles.sectionHeader}>
                <span>IoT System Control</span>
              </div>

              <div className={styles.controlsGrid}>
                <button className={styles.toggleBtn}>
                  <ToggleOnIcon /> Filtration Pump
                </button>
                <button className={styles.toggleBtn}>
                  <ToggleOnIcon /> Bypass Valve
                </button>
                <button className={styles.emergencyBtn}>
                  <EmergencyRecordingIcon /> EMERGENCY SHUTDOWN
                </button>
                <button className={styles.logBtn}>Capture Data Log</button>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}