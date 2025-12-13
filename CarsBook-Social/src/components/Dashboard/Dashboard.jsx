
import { useEffect, useRef } from 'react';

export default function Dashboard() {
    const speedRef = useRef(null);
    const rpmRef = useRef(null);
    const tempRef = useRef(null);

    useEffect(() => {
        const handleMouseMove = (e) => {
            const gauges = [
                { ref: speedRef, max: 240 },
                { ref: rpmRef, max: 8000 },
                { ref: tempRef, max: 120 }
            ];

            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            const offsetX = e.clientX - centerX;
            const offsetY = e.clientY - centerY;

            const angle = Math.atan2(offsetY, offsetX) * (180 / Math.PI);
            const value = Math.floor(((angle + 180) / 360) * 100);

            gauges.forEach(({ ref, max }) => {
                if (ref.current) {
                    const val = Math.floor((value / 100) * max);
                    ref.current.style.setProperty('--value', `'${val}'`);
                    ref.current.style.setProperty('--rotation', `${(val / max) * 270 - 135}deg`);
                }
            });
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <div className="dashboard">
            <div className="gauge" ref={speedRef}>
                <h3>Speed</h3>
                <div className="needle" />
                <div className="value">km/h</div>
            </div>
            <div className="gauge" ref={rpmRef}>
                <h3>RPM</h3>
                <div className="needle" />
                <div className="value">rpm</div>
            </div>
            <div className="gauge" ref={tempRef}>
                <h3>Temp</h3>
                <div className="needle" />
                <div className="value">°C</div>
            </div>
        </div>
    );
}
