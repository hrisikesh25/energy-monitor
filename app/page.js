"use client";

import { useEffect, useState } from "react";

export default function Home() {

  const [data, setData] = useState(null);
  const [connected, setConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);

  const [relayLoading, setRelayLoading] = useState(false);
  const [relayCommand, setRelayCommand] = useState("OFF");

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://energy-monitor-liard.vercel.app";


  // ===================================================
  // FETCH ENERGY DATA
  // ===================================================

  async function fetchEnergyData() {

    try {

      const response = await fetch(`${API_URL}/api/data`, {
        cache: "no-store"
      });

      const result = await response.json();

      if (result.success && result.data) {

        setData(result.data);
        setConnected(true);
        setLastUpdate(new Date());

      } else {

        setConnected(false);

      }

    } catch (error) {

      console.error("Failed to fetch energy data:", error);
      setConnected(false);

    }

  }


  // ===================================================
  // FETCH RELAY COMMAND
  // ===================================================

  async function fetchRelayState() {

    try {

      const response = await fetch(`${API_URL}/api/relay`, {
        cache: "no-store"
      });

      const result = await response.json();

      if (result.success) {

        setRelayCommand(result.relay);

      }

    } catch (error) {

      console.error("Failed to fetch relay state:", error);

    }

  }


  // ===================================================
  // CHANGE RELAY
  // ===================================================

  async function setRelay(state) {

    if (relayLoading) return;

    setRelayLoading(true);

    try {

      const response = await fetch(`${API_URL}/api/relay`, {

        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          relay: state
        })

      });

      const result = await response.json();

      if (result.success) {

        setRelayCommand(result.relay);

      }

    } catch (error) {

      console.error("Failed to control relay:", error);

    } finally {

      setRelayLoading(false);

    }

  }


  // ===================================================
  // START POLLING
  // ===================================================

  useEffect(() => {

    fetchEnergyData();
    fetchRelayState();

    const interval = setInterval(() => {

      fetchEnergyData();
      fetchRelayState();

    }, 2000);

    return () => clearInterval(interval);

  }, []);


  return (

    <main className="dashboard">

      {/* HEADER */}

      <header className="header">

        <div>

          <h1>⚡ Energy Monitoring System</h1>

          <p>
            Real-time electrical energy monitoring
          </p>

        </div>


        <div className="connection">

          <span
            className={`status-dot ${
              connected ? "online" : "offline"
            }`}
          ></span>

          {connected
            ? "Device Online"
            : "Waiting for Device"}

        </div>

      </header>


      {/* DEVICE INFORMATION */}

      <section className="device-card">

        <div>

          <span>Device ID</span>

          <strong>
            {data?.deviceId || "ENERGY-001"}
          </strong>

        </div>


        <div>

          <span>Relay</span>

          <strong>
            {data?.relay || "OFF"}
          </strong>

        </div>


        <div>

          <span>Last Update</span>

          <strong>

            {lastUpdate
              ? lastUpdate.toLocaleTimeString()
              : "--"}

          </strong>

        </div>

      </section>


      {/* RELAY CONTROL */}

      <section className="status-panel">

        <h2>Relay Control</h2>

        <div className="status-grid">

          <div>

            <span>Current Relay State</span>

            <b
              className={
                data?.relay === "ON"
                  ? "good"
                  : "bad"
              }
            >

              {data?.relay || "OFF"}

            </b>

          </div>


          <div>

            <span>Control</span>

            <div>

              <button
                onClick={() => setRelay("ON")}
                disabled={relayLoading}
              >

                {relayLoading && relayCommand === "ON"
                  ? "Turning ON..."
                  : "Turn ON"}

              </button>


              <button
                onClick={() => setRelay("OFF")}
                disabled={relayLoading}
              >

                {relayLoading && relayCommand === "OFF"
                  ? "Turning OFF..."
                  : "Turn OFF"}

              </button>

            </div>

          </div>

        </div>

      </section>


      {/* MAIN METRICS */}

      <section className="metrics">

        <MetricCard
          title="Voltage"
          value={data?.voltage}
          unit="V"
          icon="⚡"
        />

        <MetricCard
          title="Current"
          value={data?.current}
          unit="A"
          icon="🔌"
        />

        <MetricCard
          title="Real Power"
          value={data?.realPower}
          unit="W"
          icon="💡"
        />

        <MetricCard
          title="Apparent Power"
          value={data?.apparentPower}
          unit="VA"
          icon="📊"
        />

        <MetricCard
          title="Power Factor"
          value={data?.powerFactor}
          unit=""
          icon="📈"
        />

        <MetricCard
          title="Reactive Power"
          value={data?.reactivePower}
          unit="VAR"
          icon="🔄"
        />

        <MetricCard
          title="Energy"
          value={data?.energy}
          unit="kWh"
          icon="🏠"
        />

        <MetricCard
          title="Relay"
          value={data?.relay || "OFF"}
          unit=""
          icon="🔘"
        />

      </section>


      {/* SYSTEM STATUS */}

      <section className="status-panel">

        <h2>System Status</h2>

        <div className="status-grid">

          <div>

            <span>Arduino Yún</span>

            <b className={connected ? "good" : "bad"}>

              {connected
                ? "ONLINE"
                : "OFFLINE"}

            </b>

          </div>


          <div>

            <span>Vercel API</span>

            <b className="good">
              ONLINE
            </b>

          </div>


          <div>

            <span>Data Transmission</span>

            <b className={connected ? "good" : "bad"}>

              {connected
                ? "ACTIVE"
                : "WAITING"}

            </b>

          </div>


          <div>

            <span>Relay State</span>

            <b>
              {data?.relay || "OFF"}
            </b>

          </div>

        </div>

      </section>


      <footer>

        Energy Monitoring System •
        Arduino Yún + Vercel

      </footer>

    </main>

  );
}


// =====================================================
// METRIC CARD
// =====================================================

function MetricCard({
  title,
  value,
  unit,
  icon
}) {

  return (

    <div className="metric-card">

      <div className="metric-icon">
        {icon}
      </div>


      <div>

        <p>{title}</p>

        <h2>

          {value !== undefined &&
           value !== null
            ? value
            : "--"}

          <small>{unit}</small>

        </h2>

      </div>

    </div>

  );

}