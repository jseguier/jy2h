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

async function mesures() {
    const pm1Span  = document.getElementById("pm1.0-value");
    const pm25Span = document.getElementById("pm2.5-value");
    const pm10Span = document.getElementById("pm10-value");;

    if (!pm1Span && !pm25Span && !pm10Span) return;

    try {
        const res = await fetch("https://jy2h-api.onrender.com/api/mesures");
        const data = await res.json();

        console.log("Données reçues:", data);

        if (!Array.isArray(data) || data.length === 0) {
            console.warn("Pas de données reçues");
            return;
        }

        const sorted = [...data].sort(
            (a, b) => new Date(b._time) - new Date(a._time)
        );

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

        if (pm1Span)  pm1Span.textContent  = (pm1  !== "--" && !isNaN(pm1))  ? pm1.toFixed(1)  : "--";
        if (pm25Span) pm25Span.textContent = (pm25 !== "--" && !isNaN(pm25)) ? pm25.toFixed(1) : "--";
        if (pm10Span) pm10Span.textContent = (pm10 !== "--" && !isNaN(pm10)) ? pm10.toFixed(1) : "--";

        colorPM(pm1Span,  pm1,  "pm1.0");
        colorPM(pm25Span, pm25, "pm2.5");
        colorPM(pm10Span, pm10, "pm10");

    } catch (err) {
        console.error("erreur", err);
    }
}

mesures();

setInterval(mesures, 30000);


