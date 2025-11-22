
const charts = {}; // si pas déjà défini

function buildLineChart(canvasId, label, points, color, configY = {}) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || !window.Chart) return;

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

    // ⚙️ calcul automatique min/max si non fournis
    let yMin = (configY.min !== undefined) ? configY.min : Math.min(...values);
    let yMax = (configY.max !== undefined) ? configY.max : Math.max(...values);

    // un peu de marge
    const range = yMax - yMin || 1;
    if (configY.min === undefined) yMin = yMin - range * 0.1;
    if (configY.max === undefined) yMax = yMax + range * 0.1;

    // éviter les valeurs négatives pour PM/temp/hum si pas logique
    if (configY.forcePositive) {
        if (yMin < 0) yMin = 0;
    }

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
