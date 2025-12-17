import Navbar from "../pages/navbar.jsx";
import styles from "../styles/dashboard.module.css";
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import SensorsIcon from '@mui/icons-material/Sensors';
import WarningIcon from '@mui/icons-material/Warning';
import EmergencyRecordingIcon from '@mui/icons-material/EmergencyRecording';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import DownloadIcon from '@mui/icons-material/Download';
import PersonIcon from '@mui/icons-material/Person';

export default function Dashboard() {
  return (
    <div className={styles.pageWrapper}>
      <Navbar />
      <div className={styles.fontUniform}>
        <div className={styles.dashboardGrid}>

          {/* LEFT PANEL */}
          <div className={styles.leftPanel}>
            {/* LIVE FEED */}
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

            {/* IOT SYSTEM STATUS */}
            <div className={`${styles.section} ${styles.statusSection}`}>
              <div className={styles.sectionHeader}>
                <span className={styles.headerIcon}><SensorsIcon /></span>
                <span>IoT System Status</span>
              </div>
              <div className={styles.statusGrid}>
                <div className={styles.statusItem}>
                  <div className={styles.statusLabel}>
                    <ToggleOnIcon className={styles.statusIcon} /> Valve 1
                  </div>
                  <span className={styles.statusOn}>ON</span>
                </div>
                <div className={styles.statusItem}>
                  <div className={styles.statusLabel}>
                    <ToggleOffIcon className={styles.statusIcon} /> Valve 2
                  </div>
                  <span className={styles.statusOff}>OFF</span>
                </div>
                <div className={styles.statusItem}>
                  <div className={styles.statusLabel}>
                    <ToggleOnIcon className={styles.statusIcon} /> Pump 1
                  </div>
                  <span className={styles.statusOn}>ON</span>
                </div>
                <div className={styles.statusItem}>
                  <div className={styles.statusLabel}>
                    <ToggleOffIcon className={styles.statusIcon} /> Pump 2
                  </div>
                  <span className={styles.statusOff}>OFF</span>
                </div>
                <div className={styles.statusItem}>
                  <div className={styles.statusLabel}>
                    <SensorsIcon className={styles.statusIcon} /> Filtration Unit
                  </div>
                  <span className={styles.statusRunning}>RUNNING</span>
                </div>
              </div>
            </div>

            {/* THRESHOLD / COMPLIANCE INDICATOR */}
            <div className={`${styles.section} ${styles.thresholdSection}`}>
              <div className={styles.sectionHeader}>
                <span className={styles.headerIcon}><WarningIcon /></span>
                <span>Compliance Check</span>
              </div>
              <div className={styles.thresholdBox}>
                Limit: <strong>500 Pts/L</strong> → Current: <strong>1520 Pts/L</strong>{' '}
                <span className={styles.overLimit}>Over Limit — RED</span>
              </div>
            </div>

            {/* RECENT SAMPLES TABLE */}
            <div className={`${styles.section} ${styles.recentSamplesSection}`}>
              <div className={styles.sectionHeader}>
                <span>Recent Samples</span>
              </div>
              <table className={styles.samplesTable}>
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Confidence</th>
                    <th>Count (Pts/L)</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>13:25</td>
                    <td>92%</td>
                    <td>800</td>
                    <td>Safe</td>
                  </tr>
                  <tr>
                    <td>13:27</td>
                    <td>95%</td>
                    <td>1520</td>
                    <td className={styles.overLimit}>Over</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* WATER QUALITY MULTIMETRICS */}
            <div className={`${styles.section} ${styles.multimetricsSection}`}>
              <div className={styles.sectionHeader}>
                <span>Water Quality Metrics</span>
              </div>
              <div className={styles.metricsBox}>
                <div className={styles.metricCard}>Turbidity: <span className={styles.metricValue}>5 NTU</span></div>
                <div className={styles.metricCard}>pH: <span className={styles.metricValue}>7.2</span></div>
                <div className={styles.metricCard}>Temperature: <span className={styles.metricValue}>28°C</span></div>
                <div className={styles.metricCard}>TDS: <span className={styles.metricValue}>350 ppm</span></div>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className={styles.rightPanel}>

            {/* ANALYSIS SUMMARY */}
            <div className={`${styles.section} ${styles.analysisSection}`}>
              <div className={styles.sectionHeader}>
                <span className={styles.headerIcon}><SensorsIcon /></span>
                <span>Analysis Summary</span>
              </div>
              <div className={styles.metricsBox}>
                <div className={styles.metricCard}>
                  Microplastic Confidence: <span className={styles.metricValue}>95%</span>
                </div>
                <div className={styles.metricCard}>
                  Avg Size: <span className={styles.metricValue}>150 μm</span>
                </div>
                <div className={styles.metricCard}>
                  MP Count: <span className={styles.metricValue}>1520 Pts/L</span>
                </div>
                <div className={styles.metricCard}>
                  Noise Count: <span className={styles.metricValue}>500 Pts/L</span>
                </div>
              </div>
            </div>

            {/* CONCENTRATION TREND */}
            <div className={`${styles.section} ${styles.graphSection}`}>
              <div className={styles.sectionHeader}>
                <span>Concentration Trend (Particles/L)</span>
              </div>
              <div className={styles.graphBox}>
                [Graph Placeholder]
              </div>
            </div>

            {/* IMAGE SNAPSHOTS */}
            <div className={`${styles.section} ${styles.snapshotsSection}`}>
              <div className={styles.sectionHeader}>
                <span>Image Snapshots</span>
              </div>
              <div className={styles.snapshotsGrid}>
                <div className={styles.snapshotItem}>
                  <img src="/images/snapshot1.png" alt="Detected Microplastic" />
                  <button className={styles.downloadBtn}><DownloadIcon /> Download</button>
                </div>
                <div className={styles.snapshotItem}>
                  <img src="/images/snapshot2.png" alt="Detected Microplastic" />
                  <button className={styles.downloadBtn}><DownloadIcon /> Download</button>
                </div>
              </div>
            </div>

            {/* SOP / CONTROLS */}
            <div className={`${styles.section} ${styles.sopSection}`}>
              <div className={styles.sectionHeader}>
                <span>SOP Recommendation</span>
              </div>
              <div className={styles.sopBox}>
                Recommended Action: <strong>Activate Filtration Pump</strong><br />
                <label>
                  <input type="checkbox" />{' '}
                  Auto-Start Treatment if MP &gt; Limit
                </label>
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

            {/* SYSTEM ALERTS */}
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

            {/* DATA EXPORT */}
            <div className={`${styles.section} ${styles.exportSection}`}>
              <div className={styles.sectionHeader}>
                <span>Data Export</span>
              </div>
              <div className={styles.exportBtns}>
                <button className={styles.logBtn}><DownloadIcon /> Export CSV</button>
                <button className={styles.logBtn}><DownloadIcon /> Export JSON</button>
                <button className={styles.logBtn}><DownloadIcon /> Export Images</button>
              </div>
            </div>

            {/* USER / DEVICE / AI INFO */}
            <div className={`${styles.section} ${styles.userSection}`}>
              <div className={styles.sectionHeader}>
                <span>User Info</span>
              </div>
              <div className={styles.userInfo}>
                <PersonIcon /> Operator: John Doe<br />
                Role: Admin<br />
                Last Login: 17/12/2025 14:00
              </div>
            </div>

            <div className={`${styles.section} ${styles.deviceHealthSection}`}>
              <div className={styles.sectionHeader}>
                <span>Device Health</span>
              </div>
              <div className={styles.metricsBox}>
                <div className={styles.metricCard}>Uptime: 12h</div>
                <div className={styles.metricCard}>Signal: 78%</div>
                <div className={styles.metricCard}>Temperature: 45°C</div>
                <div className={styles.metricCard}>Memory: OK</div>
              </div>
            </div>

            <div className={`${styles.section} ${styles.aiDiagnosticsSection}`}>
              <div className={styles.sectionHeader}>
                <span>AI Model Diagnostics</span>
              </div>
              <div className={styles.metricsBox}>
                <div className={styles.metricCard}>Inference Time: 120 ms</div>
                <div className={styles.metricCard}>CPU Usage: 45%</div>
                <div className={styles.metricCard}>Last Update: 15/12/2025</div>
                <div className={styles.metricCard}>Confidence Range: 85%-98%</div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
