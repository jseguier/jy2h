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
            return row ? row._value : "--";
        };

        pm1Span.textContent  = getLast("pm1.0");
        pm25Span.textContent = getLast("pm2.5");
        pm10Span.textContent = getLast("pm10");

    } catch (err) {
        console.error(err);
        pm1Span.textContent = pm25Span.textContent = pm10Span.textContent = "ERR";
    }
}

mesures();
