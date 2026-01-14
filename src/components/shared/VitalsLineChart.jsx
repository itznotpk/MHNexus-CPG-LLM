import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';

// Simple line chart component for vital signs using pure SVG
export function VitalsLineChart({ data, metrics, height = 300 }) {
    const { isDark } = useTheme();
    const [hoveredPoint, setHoveredPoint] = useState(null);
    const [activeMetrics, setActiveMetrics] = useState({});

    // Reset activeMetrics when metrics prop changes
    useEffect(() => {
        setActiveMetrics(metrics.reduce((acc, m) => ({ ...acc, [m.key]: true }), {}));
    }, [metrics]);

    if (!data || data.length === 0) {
        return (
            <div className={`flex items-center justify-center h-64 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                No vital signs data available
            </div>
        );
    }

    const padding = { top: 20, right: 30, bottom: 50, left: 50 };
    const width = 800;
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    // Calculate scales for each metric
    const getMetricRange = (key) => {
        const values = data.map(d => {
            try {
                const item = typeof d === 'string' ? JSON.parse(d) : d;
                return parseFloat(item[key]);
            } catch (e) {
                return NaN;
            }
        }).filter(v => !isNaN(v));
        if (values.length === 0) return { min: 0, max: 100 };
        const min = Math.min(...values);
        const max = Math.max(...values);
        const buffer = (max - min) * 0.1 || 10;
        return { min: min - buffer, max: max + buffer };
    };

    const xScale = (index) => padding.left + (index / (data.length - 1 || 1)) * chartWidth;

    const yScale = (value, range) => {
        const val = parseFloat(value);
        if (isNaN(val)) return padding.top + chartHeight; // Bottom of chart
        const normalized = (val - range.min) / (range.max - range.min || 1);
        return padding.top + chartHeight - (normalized * chartHeight);
    };

    // Generate path for a metric
    const generatePath = (metricKey, range) => {
        const points = data
            .map((d, i) => {
                try {
                    const item = typeof d === 'string' ? JSON.parse(d) : d;
                    const val = parseFloat(item[metricKey]);
                    return !isNaN(val) ? { x: xScale(i), y: yScale(val, range), value: val } : null;
                } catch (e) {
                    return null;
                }
            })
            .filter(Boolean);

        if (points.length < 2) return '';

        return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    };

    const toggleMetric = (key) => {
        setActiveMetrics(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        if (dateStr === 'Current') return 'Current';
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <div className="w-full">
            {/* Legend - only show for multiple metrics */}
            {metrics.length > 1 && (
                <div className="flex flex-wrap gap-3 mb-4">
                    {metrics.map((metric) => (
                        <button
                            key={metric.key}
                            onClick={() => toggleMetric(metric.key)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${activeMetrics[metric.key]
                                ? isDark ? 'bg-white/10' : 'bg-slate-100'
                                : isDark ? 'bg-white/5 opacity-50' : 'bg-slate-50 opacity-50'
                                }`}
                        >
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: metric.color }}
                            />
                            <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-700'}`}>
                                {metric.label}
                            </span>
                            {activeMetrics[metric.key] && data.length > 0 && (
                                <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                    ({data[data.length - 1][metric.key]} {metric.unit})
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            )}

            {/* Chart */}
            <div className="relative overflow-x-auto">
                <svg
                    viewBox={`0 0 ${width} ${height}`}
                    className="w-full"
                    style={{ minWidth: '600px' }}
                >
                    {/* Grid lines */}
                    {[...Array(5)].map((_, i) => (
                        <line
                            key={i}
                            x1={padding.left}
                            y1={padding.top + (i * chartHeight / 4)}
                            x2={width - padding.right}
                            y2={padding.top + (i * chartHeight / 4)}
                            stroke={isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}
                            strokeDasharray="4,4"
                        />
                    ))}

                    {/* Y-axis labels - show actual data range */}
                    {metrics.length > 0 && activeMetrics[metrics[0].key] && (() => {
                        const range = getMetricRange(metrics[0].key);
                        const labels = [0, 1, 2, 3, 4].map(i => {
                            const value = range.max - (i * (range.max - range.min) / 4);
                            return Math.round(value);
                        });
                        return labels.map((val, i) => (
                            <text
                                key={i}
                                x={padding.left - 10}
                                y={padding.top + (i * chartHeight / 4) + 4}
                                textAnchor="end"
                                className={`text-xs ${isDark ? 'fill-slate-400' : 'fill-slate-500'}`}
                            >
                                {val}
                            </text>
                        ));
                    })()}

                    {/* X-axis labels */}
                    {data.map((d, i) => (
                        <text
                            key={i}
                            x={xScale(i)}
                            y={height - 10}
                            textAnchor="middle"
                            className={`text-xs ${isDark ? 'fill-slate-400' : 'fill-slate-500'}`}
                        >
                            {formatDate(d.date)}
                        </text>
                    ))}

                    {/* Lines for each active metric */}
                    {metrics.map((metric) => {
                        if (!activeMetrics[metric.key]) return null;
                        const range = getMetricRange(metric.key);
                        const path = generatePath(metric.key, range);

                        return (
                            <g key={metric.key}>
                                {/* Line */}
                                <path
                                    d={path}
                                    fill="none"
                                    stroke={metric.color}
                                    strokeWidth={2.5}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="transition-opacity duration-300"
                                />

                                {/* Data points */}
                                {data.map((d, i) => {
                                    let item = d;
                                    try {
                                        item = typeof d === 'string' ? JSON.parse(d) : d;
                                    } catch (e) {
                                        item = d;
                                    }
                                    const val = parseFloat(item[metric.key]);
                                    if (isNaN(val)) return null;
                                    const x = xScale(i);
                                    const y = yScale(val, range);
                                    const isHovered = hoveredPoint?.index === i && hoveredPoint?.key === metric.key;

                                    return (
                                        <g key={i}>
                                            <circle
                                                cx={x}
                                                cy={y}
                                                r={isHovered ? 6 : 4}
                                                fill={metric.color}
                                                stroke={isDark ? '#1e293b' : '#fff'}
                                                strokeWidth={2}
                                                className="cursor-pointer transition-all duration-200"
                                                onMouseEnter={() => setHoveredPoint({ index: i, key: metric.key, value: d[metric.key], date: d.date })}
                                                onMouseLeave={() => setHoveredPoint(null)}
                                            />
                                        </g>
                                    );
                                })}
                            </g>
                        );
                    })}

                    {/* Hover tooltip */}
                    {hoveredPoint && (
                        <g>
                            <rect
                                x={xScale(hoveredPoint.index) - 40}
                                y={yScale(hoveredPoint.value, getMetricRange(hoveredPoint.key)) - 35}
                                width={80}
                                height={28}
                                rx={4}
                                fill={isDark ? '#1e293b' : '#fff'}
                                stroke={isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'}
                            />
                            <text
                                x={xScale(hoveredPoint.index)}
                                y={yScale(hoveredPoint.value, getMetricRange(hoveredPoint.key)) - 16}
                                textAnchor="middle"
                                className={`text-xs font-semibold ${isDark ? 'fill-white' : 'fill-slate-800'}`}
                            >
                                {hoveredPoint.value} {metrics.find(m => m.key === hoveredPoint.key)?.unit}
                            </text>
                        </g>
                    )}
                </svg>
            </div>
        </div>
    );
}

export default VitalsLineChart;
