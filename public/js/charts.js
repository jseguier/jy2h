
// CHATGPT GENERATED PAS LE CHOIX
// ==========================
//  CONFIG GLOBALE CHART.JS
// ==========================
if (typeof Chart !== "undefined") {
    Chart.defaults.color = "#e5e5e5";
    Chart.defaults.borderColor = "rgba(255, 255, 255, 0.08)";
    Chart.defaults.font.family =
        "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
}

const charts = {}; // stockage des instances de charts

// ==========================
//  COULEUR PM (BANDEAU)
// ==========================
function colorPM(element, value, type) {
    if (!element) return;

    if (value === null || value === "--" || isNaN(value)) {
        element.style.color = "white";
        return;
    }

    let color = "green";

    if (type === "pm1.0" || type === "pm2.5") {
        if (value > 35) color = "red";
        else if (value > 12) color = "orange";
    }

    if (type === "pm10") {
        if (value > 150) color = "red";
        else if (value > 50) color = "orange";
    }

    element.style.color = color;
}

// ==========================
//  CREATION / MAJ D'UN CHART
// ==========================
function buildLineChart(canvasId, label, points, color, configY = {}) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || typeof Chart === "undefined") return;

    const ctx = canvas.getContext("2d");

    const values = points
        .map(p => Number(p.value))
        .filter(v => !isNaN(v));

    const labels = points.map(p => p.time);

    if (!values.length) {
        if (charts[canvasId]) {
            charts[canvasId].destroy();
            delete charts[canvasId];
        }
        return;
    }

    // 🔒 Limites FIXES de l'axe Y
    const yMin = (configY.min !== undefined) ? configY.min : 0;
    const yMax = (configY.max !== undefined) ? configY.max : 100;

    if (charts[canvasId]) {
        charts[canvasId].destroy();
    }

    charts[canvasId] = new Chart(ctx, {
        type: "line",
        data: {
            labels,
            datasets: [{
                label,
                data: values,
                tension: 0.25,
                borderWidth: 2,
                pointRadius: 0,
                borderColor: color,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    ticks: {
                        maxTicksLimit: 5
                    },
                    grid: {
                        display: false
                    }
                },
                y: {
                    min: yMin,
                    max: yMax,
                    beginAtZero: false,
                    grid: {
                        color: "rgba(255, 255, 255, 0.06)"
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    mode: "index",
                    intersect: false
                }
            }
        }
    });
}


// ==========================
//  FONCTION PRINCIPALE
//  BANDEAU + CHARTS
// ==========================
async function updateDashboard() {
    // --- Sélection des éléments du bandeau ---
    const pm1Span  = document.getElementById("pm1-value");
    const pm25Span = document.getElementById("pm25-value");
    const pm10Span = document.getElementById("pm10-value");
    const tempSpan = document.getElementById("temp-value");
    const humSpan  = document.getElementById("hum-value");
    const rssiSpan = document.getElementById("rssi-value");

    // Vérifier si la page affiche au moins le bandeau ou un chart
    const hasAnyDisplay =
        pm1Span || pm25Span || pm10Span || tempSpan || humSpan || rssiSpan ||
        document.getElementById("pm1-chart") ||
        document.getElementById("pm25-chart") ||
        document.getElementById("pm10-chart") ||
        document.getElementById("temp-chart") ||
        document.getElementById("hum-chart") ||
        document.getElementById("rssi-chart");

    if (!hasAnyDisplay) return; // page qui n'utilise pas le dashboard

    try {
        const res = await fetch("https://jy2h-api.onrender.com/api/mesures");
        const data = await res.json();

        if (!Array.isArray(data) || data.length === 0) {
            console.warn("Pas de données reçues");
            return;
        }

        // tri du plus récent au plus ancien
        const sorted = [...data].sort(
            (a, b) => new Date(b._time) - new Date(a._time)
        );

        // ---- 1) Dernières valeurs par champ (bandeau) ----
        const latestByField = {};
        for (const row of sorted) {
            const f = row._field;
            if (!(f in latestByField)) {
                const v = Number(row._value);
                latestByField[f] = Number.isNaN(v) ? "--" : v;
            }
        }

        const pm1  = latestByField["pm1.0"] ?? "--";
        const pm25 = latestByField["pm2.5"] ?? "--";
        const pm10 = latestByField["pm10"]  ?? "--";
        const temp = latestByField["temp"]  ?? "--";
        const hum  = latestByField["hum"]   ?? "--";

        // champ pour RSSI : on cherche une clé contenant "rssi"
        let rssi = "--";
        const rssiFieldName = Object.keys(latestByField)
            .find(key => key.toLowerCase().includes("rssi"));
        if (rssiFieldName) {
            const v = Number(latestByField[rssiFieldName]);
            rssi = Number.isNaN(v) ? "--" : v;
        }

        // ---- 2) Mise à jour du bandeau ----
        if (pm1Span)  pm1Span.textContent  = (pm1  !== "--" && !isNaN(pm1))  ? pm1.toFixed(1)  : "--";
        if (pm25Span) pm25Span.textContent = (pm25 !== "--" && !isNaN(pm25)) ? pm25.toFixed(1) : "--";
        if (pm10Span) pm10Span.textContent = (pm10 !== "--" && !isNaN(pm10)) ? pm10.toFixed(1) : "--";
        if (tempSpan) tempSpan.textContent = (temp !== "--" && !isNaN(temp)) ? temp.toFixed(1) : "--";
        if (humSpan)  humSpan.textContent  = (hum  !== "--" && !isNaN(hum))  ? hum.toFixed(1)  : "--";
        if (rssiSpan) rssiSpan.textContent = (rssi !== "--" && !isNaN(rssi)) ? Math.round(rssi) : "--";

        colorPM(pm1Span,  pm1,  "pm1.0");
        colorPM(pm25Span, pm25, "pm2.5");
        colorPM(pm10Span, pm10, "pm10");

        // ---- 3) Séries temporelles pour les charts 3×2 ----
        const MAX_POINTS = 50;

        const makeSeries = (predicate) =>
            sorted
                .filter(predicate)
                .slice(0, MAX_POINTS)
                .map(row => ({
                    time: new Date(row._time).toLocaleTimeString("fr-FR", {
                        hour: "2-digit",
                        minute: "2-digit"
                    }),
                    value: Number(row._value)
                }))
                .reverse(); // du plus ancien au plus récent

        const pm1Series  = makeSeries(row => row._field === "pm1.0");
        const pm25Series = makeSeries(row => row._field === "pm2.5");
        const pm10Series = makeSeries(row => row._field === "pm10");
        const tempSeries = makeSeries(row => row._field === "temp");
        const humSeries  = makeSeries(row => row._field === "hum");
        const rssiSeries = makeSeries(row =>
            row._field && row._field.toLowerCase().includes("rssi")
        );

        // Création / MAJ des 6 charts (si présents dans la page)
        buildLineChart(
            "pm1-chart",
            "PM1.0 (µg/m³)",
            pm1Series,
            "#4bc0c0",
            { min: 0, max: 30 }
        );

        buildLineChart(
            "pm25-chart",
            "PM2.5 (µg/m³)",
            pm25Series,
            "#ff9f40",
            { min: 0, max: 30 }
        );

        buildLineChart(
            "pm10-chart",
            "PM10 (µg/m³)",
            pm10Series,
            "#ff6384",
            { min: 0, max: 50 }
        );

        buildLineChart(
            "temp-chart",
            "Température (°C)",
            tempSeries,
            "#36a2eb",
            { min: -10, max: 50 }
        );

        buildLineChart(
            "hum-chart",
            "Humidité (%)",
            humSeries,
            "#9966ff",
            { min: 0, max: 100 }
        );

        buildLineChart(
            "rssi-chart",
            "RSSI (dBm)",
            rssiSeries,
            "#c9cbcf",
            { min: -100, max: -40 }
        );



    } catch (err) {
        console.error("Erreur dans updateDashboard():", err);
    }
}

// ==========================
//  INIT AU CHARGEMENT
// ==========================
function initDashboard() {
    updateDashboard();
    setInterval(updateDashboard, 30000); // rafraîchit toutes les 30 s
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initDashboard);
} else {
    initDashboard();
}
