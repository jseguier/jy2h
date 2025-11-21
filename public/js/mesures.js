function colorPM(element, value, type) {
    // couleur neutre au début
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
    const pm10Span = document.getElementById("pm10-value");

    try {
        const res = await fetch("https://jy2h-api.onrender.com/api/mesures");
        const data = await res.json();

        data.sort((a, b) => new Date(b._time) - new Date(a._time));

        const getLast = field => {
            const row = data.find(d => d._field === field);
            return row ? Number(row._value) : "--";
        };

        const pm1  = getLast("pm1.0");
        const pm25 = getLast("pm2.5");
        const pm10 = getLast("pm10");

        pm1Span.textContent  = (pm1 !== "--")  ? pm1.toFixed(1)  : "--";
        pm25Span.textContent = (pm25 !== "--") ? pm25.toFixed(1) : "--";
        pm10Span.textContent = (pm10 !== "--") ? pm10.toFixed(1) : "--";

        colorPM(pm1Span, pm1, "pm1.0");
        colorPM(pm25Span, pm25, "pm2.5");
        colorPM(pm10Span, pm10, "pm10");

    } catch (err) {
        console.error(err);
        pm1Span.textContent = pm25Span.textContent = pm10Span.textContent = "ERR";
    }
}

mesures();

setInterval(mesures, 30000);
