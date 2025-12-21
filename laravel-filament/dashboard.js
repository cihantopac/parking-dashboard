// Chart.js Configuration
document.addEventListener('DOMContentLoaded', function () {

    Chart.defaults.font.family = "'Inter', sans-serif";
    Chart.defaults.color = '#64748B';
    Chart.defaults.scale.grid.color = '#F1F5F9';

    Chart.defaults.scale.grid.color = '#F1F5F9';

    // --- Sticky Filter Bar Logic ---
    const filterCard = document.querySelector('.filter-card');
    let isShrunk = false;
    let scrollTicking = false;

    const updateFilterShrink = () => {
        if (!filterCard) return;
        const y = window.scrollY || window.pageYOffset;
        const shouldShrink = isShrunk ? y > 10 : y > 30;
        if (shouldShrink !== isShrunk) {
            filterCard.classList.toggle('shrink', shouldShrink);
            isShrunk = shouldShrink;
        }
        scrollTicking = false;
    };

    window.addEventListener('scroll', () => {
        if (scrollTicking) return;
        scrollTicking = true;
        window.requestAnimationFrame(updateFilterShrink);
    });

    updateFilterShrink();

    // --- Dynamic Hero Chart Logic ---
    const ctxRevenue = document.getElementById('miniRevenueChart').getContext('2d');

    // Gradient for Line 1 (Total Ciro)
    const gradient1 = ctxRevenue.createLinearGradient(0, 0, 0, 200);
    gradient1.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
    gradient1.addColorStop(1, 'rgba(255, 255, 255, 0)');

    // Gradient for Line 2 (Tahsil Edilen)
    const gradient2 = ctxRevenue.createLinearGradient(0, 0, 0, 200);
    gradient2.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
    gradient2.addColorStop(1, 'rgba(255, 255, 255, 0.1)');

    let revenueChart;
    let densityChart;
    let analysisChart;
    let baremChart;
    let activePeriod = 'daily';
    let customRange = null;

    const periodMeta = {
        daily: { label: 'Günlük', totalMode: 'last' },
        last24: { label: 'Son 24 Saat', totalMode: 'last' },
        weekly: { label: 'Haftalık', totalMode: 'sum' },
        last7: { label: 'Son 7 Gün', totalMode: 'sum' },
        monthly: { label: 'Aylık', totalMode: 'sum' },
        last30: { label: 'Son 30 Gün', totalMode: 'sum' },
        yearly: { label: 'Yıllık', totalMode: 'sum' },
        all: { label: 'Tüm Zamanlar', totalMode: 'sum' }
    };

    const chartData = {
        daily: {
            labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '23:59'],
            ciro: [12000, 15000, 45000, 85000, 110000, 125000, 134590],
            tahsilat: [11000, 14000, 42000, 80000, 105000, 120000, 128450]
        },
        last24: {
            labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '23:59'],
            ciro: [9000, 13000, 38000, 76000, 99000, 116000, 129800],
            tahsilat: [8200, 12200, 36000, 72000, 94000, 110000, 123500]
        },
        weekly: {
            labels: ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'],
            ciro: [125000, 138000, 142000, 131000, 155000, 171000, 168000],
            tahsilat: [119000, 131000, 135000, 124000, 147000, 163000, 160000]
        },
        last7: {
            labels: ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'],
            ciro: [118000, 132000, 126000, 140000, 150000, 158000, 146000],
            tahsilat: [112000, 125000, 120000, 133000, 143000, 150000, 139000]
        },
        monthly: {
            labels: ['1. Hafta', '2. Hafta', '3. Hafta', '4. Hafta'],
            ciro: [890000, 940000, 980000, 1050000],
            tahsilat: [850000, 900000, 935000, 1000000]
        },
        last30: {
            labels: ['1-7', '8-14', '15-21', '22-30'],
            ciro: [920000, 980000, 1010000, 1080000],
            tahsilat: [875000, 935000, 965000, 1030000]
        },
        yearly: {
            labels: ['Q1', 'Q2', 'Q3', 'Q4'],
            ciro: [11000000, 12000000, 10800000, 13000000],
            tahsilat: [10400000, 11400000, 10200000, 12300000]
        },
        all: {
            labels: ['2020', '2021', '2022', '2023', '2024'],
            ciro: [14000000, 20000000, 24000000, 28000000, 33000000],
            tahsilat: [13300000, 19000000, 22800000, 26600000, 31500000]
        }
    };

    const passTotals = {
        daily: 7420,
        last24: 7180,
        weekly: 48500,
        last7: 49800,
        monthly: 195000,
        last30: 206000,
        yearly: 2350000,
        all: 6800000
    };

    const trendMap = {
        daily: 14.2,
        last24: 11.3,
        weekly: 5.8,
        last7: 6.5,
        monthly: 3.1,
        last30: 3.8,
        yearly: 9.4,
        all: 12.0
    };

    const trendLabelMap = {
        daily: 'D\u00fcne g\u00f6re art\u0131\u015f',
        last24: 'Bir \u00f6nceki 24 saate g\u00f6re art\u0131\u015f',
        weekly: 'Bir \u00f6nceki haftaya g\u00f6re art\u0131\u015f',
        last7: 'Bir \u00f6nceki 7 g\u00fcne g\u00f6re art\u0131\u015f',
        monthly: 'Bir \u00f6nceki aya g\u00f6re art\u0131\u015f',
        last30: 'Bir \u00f6nceki 30 g\u00fcne g\u00f6re art\u0131\u015f',
        yearly: 'Bir \u00f6nceki y\u0131la g\u00f6re art\u0131\u015f',
        all: 'Bir \u00f6nceki d\u00f6neme g\u00f6re art\u0131\u015f',
        custom: 'Bir \u00f6nceki d\u00f6neme g\u00f6re art\u0131\u015f'
    };

    const passRatios = {
        paid: 0.929,
        subscriber: 0.054
    };

    const paymentPercents = {
        credit: 0.45,
        hgs: 0.35,
        mobile: 0.2
    };

    const densityBase = [15, 10, 5, 2, 1, 3, 10, 45, 120, 180, 200, 220, 250, 240, 210, 190, 230, 260, 200, 150, 100, 80, 50, 30];
    const densityScale = {
        daily: 1,
        last24: 0.95,
        weekly: 1.2,
        last7: 1.1,
        monthly: 1.35,
        last30: 1.28,
        yearly: 1.6,
        all: 1.75
    };

    const analysisBase = {
        labels: ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'],
        passes: [120, 250, 450, 400, 380, 520, 300, 150],
        ciro: [12000, 25000, 45000, 40000, 38000, 52000, 30000, 15000]
    };

    const analysisScale = {
        daily: 1,
        last24: 0.92,
        weekly: 1.25,
        last7: 1.12,
        monthly: 1.4,
        last30: 1.32,
        yearly: 1.8,
        all: 2.1
    };

    const baremData = {
        daily: [18, 22, 26, 20, 14],
        last24: [20, 21, 25, 19, 15],
        weekly: [16, 23, 27, 20, 14],
        last7: [17, 22, 26, 21, 14],
        monthly: [15, 24, 27, 20, 14],
        last30: [16, 23, 28, 20, 13],
        yearly: [14, 25, 28, 20, 13],
        all: [13, 25, 29, 20, 13]
    };

    const numberFormatter = new Intl.NumberFormat('tr-TR');
    const currencyFormatter = new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY',
        minimumFractionDigits: 2
    });

    function formatPercent(value) {
        return `%${value.toFixed(1)}`;
    }

    function setText(id, value) {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    }

    function setWidth(id, value) {
        const el = document.getElementById(id);
        if (el) el.style.width = value;
    }

    const baseDays = {
        daily: 1,
        weekly: 7,
        monthly: 30,
        yearly: 365,
        all: 1825
    };

    function formatDate(date) {
        const day = `${date.getDate()}`.padStart(2, '0');
        const month = `${date.getMonth() + 1}`.padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    }

    function formatInputDate(date) {
        const day = `${date.getDate()}`.padStart(2, '0');
        const month = `${date.getMonth() + 1}`.padStart(2, '0');
        const year = date.getFullYear();
        return `${year}-${month}-${day}`;
    }

    function getTotalsFromData(data, mode) {
        const totalMode = mode || 'last';
        const ciroTotal = totalMode === 'last'
            ? data.ciro[data.ciro.length - 1]
            : data.ciro.reduce((sum, val) => sum + val, 0);
        const tahsilatTotal = totalMode === 'last'
            ? data.tahsilat[data.tahsilat.length - 1]
            : data.tahsilat.reduce((sum, val) => sum + val, 0);
        return { ciroTotal, tahsilatTotal };
    }

    function getBaseKeyByDays(days) {
        if (days <= 1) return 'daily';
        if (days <= 7) return 'weekly';
        if (days <= 31) return 'monthly';
        if (days <= 365) return 'yearly';
        return 'all';
    }

    function buildCustomRange(startDate, endDate) {
        const start = startDate instanceof Date ? startDate : new Date(startDate);
        const end = endDate instanceof Date ? endDate : new Date(endDate);
        const startTime = start.getTime();
        const endTime = end.getTime();
        const safeStart = startTime <= endTime ? start : end;
        const safeEnd = startTime <= endTime ? end : start;
        const dayMs = 24 * 60 * 60 * 1000;
        const days = Math.max(1, Math.floor((safeEnd - safeStart) / dayMs) + 1);
        const baseKey = getBaseKeyByDays(days);
        const scale = days / (baseDays[baseKey] || 1);
        const baseData = chartData[baseKey];
        const scaledData = {
            labels: baseData.labels,
            ciro: baseData.ciro.map((val) => Math.round(val * scale)),
            tahsilat: baseData.tahsilat.map((val) => Math.round(val * scale))
        };
        const passTotal = Math.max(1, Math.round((passTotals[baseKey] || passTotals.daily) * scale));
        const densityScaleValue = (densityScale[baseKey] || 1) * Math.sqrt(scale);
        const analysisScaleValue = (analysisScale[baseKey] || 1) * Math.sqrt(scale);
        const label = `${formatDate(safeStart)} - ${formatDate(safeEnd)}`;
        return {
            start: safeStart,
            end: safeEnd,
            days,
            baseKey,
            data: scaledData,
            passTotal,
            barem: baremData[baseKey] || baremData.daily,
            densityScale: densityScaleValue,
            analysisScale: analysisScaleValue,
            trend: trendMap[baseKey] || trendMap.daily,
            totalMode: baseKey === 'daily' ? 'last' : 'sum',
            label
        };
    }

    function getPassSplit(totalPass) {
        const paid = Math.round(totalPass * passRatios.paid);
        const subscriber = Math.round(totalPass * passRatios.subscriber);
        const free = Math.max(totalPass - paid - subscriber, 0);
        return { paid, subscriber, free };
    }

    function initHeroChart(data) {
        const chartDataSet = data || chartData.daily;
        const failedData = chartDataSet.ciro.map((val, i) => Math.max(val - chartDataSet.tahsilat[i], 0));

        const config = {
            type: 'bar',
            data: {
                labels: chartDataSet.labels,
                datasets: [
                    {
                        label: 'Başarılı',
                        data: chartDataSet.tahsilat,
                        backgroundColor: '#22c55e',
                        borderColor: '#ffffff',
                        borderWidth: 1,
                        borderRadius: { topLeft: 0, topRight: 0, bottomLeft: 4, bottomRight: 4 },
                        barThickness: 16,
                        stack: 'stack0'
                    },
                    {
                        label: 'Başarısız',
                        data: failedData,
                        backgroundColor: '#ef4444',
                        borderColor: '#ffffff',
                        borderWidth: 1,
                        borderRadius: { topLeft: 4, topRight: 4, bottomLeft: 0, bottomRight: 0 },
                        barThickness: 16,
                        stack: 'stack0'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        titleColor: '#1e293b',
                        bodyColor: '#1e293b',
                        borderColor: '#e2e8f0',
                        borderWidth: 1,
                        padding: 10,
                        displayColors: true,
                        callbacks: {
                            label: function (context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += currencyFormatter.format(context.parsed.y);
                                }
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        stacked: true,
                        display: true,
                        grid: { display: false, drawBorder: false },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)',
                            font: { size: 11, family: 'Inter', weight: '500' },
                            maxRotation: 0,
                            autoSkip: true,
                            maxTicksLimit: 7
                        },
                        border: { display: false }
                    },
                    y: {
                        stacked: true,
                        display: false,
                        grid: { display: false },
                        border: { display: false }
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                },
                animation: {
                    duration: 800,
                    easing: 'easeOutQuart'
                }
            }
        };

        if (revenueChart) {
            revenueChart.destroy();
        }
        revenueChart = new Chart(ctxRevenue, config);
    }

    function updateDensityChart(periodKey, scaleOverride) {
        const ctxDensity = document.getElementById('hourlyDensityChart');
        if (!ctxDensity) return;

        const scale = scaleOverride !== undefined ? scaleOverride : (densityScale[periodKey] || 1);
        const dataPoints = densityBase.map((val) => Math.round(val * scale));
        const hours = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

        if (densityChart) {
            densityChart.data.labels = hours;
            densityChart.data.datasets[0].data = dataPoints;
            densityChart.update();
            return;
        }

        densityChart = new Chart(ctxDensity, {
            type: 'bar',
            data: {
                labels: hours,
                datasets: [{
                    label: 'Araç Yoğunluğu',
                    data: dataPoints,
                    backgroundColor: function (context) {
                        const value = context.raw;
                        const alpha = 0.2 + (value / 300);
                        return `rgba(37, 99, 235, ${alpha})`;
                    },
                    borderRadius: 4,
                    borderSkipped: false,
                    barPercentage: 0.6,
                    categoryPercentage: 0.8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        titleColor: '#1e293b',
                        bodyColor: '#1e293b',
                        borderColor: '#e2e8f0',
                        borderWidth: 1,
                        padding: 10,
                        displayColors: false,
                        callbacks: {
                            label: function (context) {
                                return `Araç: ${context.parsed.y}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: '#f1f5f9',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#94a3b8',
                            font: { size: 10 }
                        }
                    },
                    x: {
                        grid: { display: false, drawBorder: false },
                        ticks: {
                            color: '#94a3b8',
                            font: { size: 10 },
                            maxRotation: 0,
                            autoSkip: true,
                            maxTicksLimit: 12
                        }
                    }
                }
            }
        });
    }

    function updateMainAnalysisChart(periodKey, scaleOverride) {
        const ctxMain = document.getElementById('mainAnalysisChart');
        if (!ctxMain) return;

        const scale = scaleOverride !== undefined ? scaleOverride : (analysisScale[periodKey] || 1);
        const passes = analysisBase.passes.map((val) => Math.round(val * scale));
        const ciro = analysisBase.ciro.map((val) => Math.round(val * scale));

        if (analysisChart) {
            analysisChart.data.labels = analysisBase.labels;
            analysisChart.data.datasets[0].data = passes;
            analysisChart.data.datasets[1].data = ciro;
            analysisChart.update();
            return;
        }

        analysisChart = new Chart(ctxMain.getContext('2d'), {
            type: 'bar',
            data: {
                labels: analysisBase.labels,
                datasets: [
                    {
                        label: 'Ge\u00e7i\u015f Say\u0131s\u0131',
                        data: passes,
                        backgroundColor: '#E2E8F0',
                        borderRadius: 4,
                        order: 2
                    },
                    {
                        label: 'Ciro (\u20ba)',
                        data: ciro,
                        type: 'line',
                        borderColor: '#0066FF',
                        backgroundColor: 'rgba(0, 102, 255, 0.1)',
                        borderWidth: 3,
                        tension: 0.4,
                        fill: true,
                        yAxisID: 'y1',
                        order: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                plugins: {
                    legend: {
                        position: 'top',
                        align: 'end'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        position: 'left',
                        grid: { display: false }
                    },
                    y1: {
                        beginAtZero: true,
                        position: 'right',
                        grid: { drawOnChartArea: true }
                    }
                }
            }
        });
    }
    function updateBaremChart(periodKey, dataOverride) {
        const ctxBarem = document.getElementById('baremPieChart');
        if (!ctxBarem) return;

        const baremLabelsPlugin = {
            id: 'baremLabels',
            afterDatasetsDraw(chart) {
                const { ctx, data } = chart;
                const meta = chart.getDatasetMeta(0);
                ctx.save();
                ctx.font = '600 12px Inter, sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = '#ffffff';
                ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
                ctx.shadowBlur = 4;

                meta.data.forEach((arc, index) => {
                    const label = data.labels[index];
                    if (!label) return;
                    const point = arc.getCenterPoint();
                    ctx.fillText(label, point.x, point.y);
                });

                ctx.restore();
            }
        };

        const datasetValues = dataOverride || baremData[periodKey] || baremData.daily;

        if (baremChart) {
            baremChart.data.datasets[0].data = datasetValues;
            baremChart.update();
            return;
        }

        baremChart = new Chart(ctxBarem.getContext('2d'), {
            type: 'pie',
            data: {
                labels: ['0-2 Saat', '2-4 Saat', '4-8 Saat', '8-12 Saat', '12+ Saat'],
                datasets: [{
                    data: datasetValues,
                    backgroundColor: [
                        '#10B981',
                        '#0F172A',
                        '#64748B',
                        '#0066FF',
                        '#8B5CF6'
                    ],
                    borderWidth: 2,
                    borderColor: '#ffffff',
                    hoverOffset: 8
                }]
            },
            plugins: [baremLabelsPlugin],
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            usePointStyle: true,
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: { enabled: false }
                }
            }
        });
    }

    function updateDashboard(periodKey) {
        const isCustom = periodKey === 'custom' && customRange;
        const baseKey = isCustom ? customRange.baseKey : periodKey;
        const meta = isCustom ? { label: customRange.label } : (periodMeta[baseKey] || periodMeta.daily);
        const data = isCustom ? customRange.data : (chartData[baseKey] || chartData.daily);
        const totalMode = isCustom ? customRange.totalMode : (periodMeta[baseKey]?.totalMode || 'last');
        const totals = getTotalsFromData(data, totalMode);
        const totalPass = isCustom ? customRange.passTotal : (passTotals[baseKey] || passTotals.daily);
        const passSplit = getPassSplit(totalPass);

        const successAmount = totals.tahsilatTotal;
        const gapAmount = Math.max(totals.ciroTotal - successAmount, 0);
        const pendingAmount = Math.round(gapAmount * 0.69);
        const failedAmount = gapAmount - pendingAmount;

        const successRatio = totals.ciroTotal ? (successAmount / totals.ciroTotal) * 100 : 0;
        const pendingRatio = totals.ciroTotal ? (pendingAmount / totals.ciroTotal) * 100 : 0;
        const failedRatio = totals.ciroTotal ? (failedAmount / totals.ciroTotal) * 100 : 0;

        const successCount = Math.round(passSplit.paid * 0.993);
        const pendingCount = Math.round(passSplit.paid * 0.005);
        const failedCount = Math.max(passSplit.paid - successCount - pendingCount, 0);

        const creditCount = Math.round(passSplit.paid * paymentPercents.credit);
        const hgsCount = Math.round(passSplit.paid * paymentPercents.hgs);
        const mobileCount = Math.max(passSplit.paid - creditCount - hgsCount, 0);

        const creditAmount = successAmount * paymentPercents.credit;
        const hgsAmount = successAmount * paymentPercents.hgs;
        const mobileAmount = successAmount - creditAmount - hgsAmount;

        const cameraRatios = { sefakoyIn: 0.34, sefakoyOut: 0.33, e5In: 0.17, e5Out: 0.16 };
        const cameraSefakoyIn = Math.round(totalPass * cameraRatios.sefakoyIn);
        const cameraSefakoyOut = Math.round(totalPass * cameraRatios.sefakoyOut);
        const cameraE5In = Math.round(totalPass * cameraRatios.e5In);
        const cameraE5Out = Math.max(totalPass - cameraSefakoyIn - cameraSefakoyOut - cameraE5In, 0);
        const cameraMax = Math.max(cameraSefakoyIn, cameraSefakoyOut, cameraE5In, cameraE5Out) || 1;

        const trendValue = isCustom ? customRange.trend : (trendMap[baseKey] || trendMap.daily);
        const trendLabel = isCustom ? trendLabelMap.custom : (trendLabelMap[baseKey] || trendLabelMap.daily);

        const mobileFilterLabel = isCustom ? customRange.label : meta.label;

        setText('heroLabel', `Toplam Ciro (${meta.label})`);
        setText('heroValue', currencyFormatter.format(totals.ciroTotal));
        setText('heroPaidCount', numberFormatter.format(passSplit.paid));
        setText('heroTrendValue', `%${trendValue.toFixed(1)}`);
        setText('heroTrendLabel', trendLabel);
        if (filterActiveLabel) {
            filterActiveLabel.textContent = mobileFilterLabel;
        }

        setText('totalPassValue', numberFormatter.format(totalPass));
        setText('paidPassValue', numberFormatter.format(passSplit.paid));
        setText('subscriberPassValue', numberFormatter.format(passSplit.subscriber));
        setText('freePassValue', numberFormatter.format(passSplit.free));

        setText('paidPassRatio', formatPercent((passSplit.paid / totalPass) * 100));
        setText('subscriberPassRatio', formatPercent((passSplit.subscriber / totalPass) * 100));
        setText('freePassRatio', formatPercent((passSplit.free / totalPass) * 100));

        setText('successAmount', currencyFormatter.format(successAmount));
        setText('successCount', numberFormatter.format(successCount));
        setText('successRatio', formatPercent(successRatio));

        setText('pendingAmount', currencyFormatter.format(pendingAmount));
        setText('pendingCount', numberFormatter.format(pendingCount));
        setText('pendingRatio', formatPercent(pendingRatio));

        setText('failedAmount', currencyFormatter.format(failedAmount));
        setText('failedCount', numberFormatter.format(failedCount));
        setText('failedRatio', formatPercent(failedRatio));

        setText('paymentCreditPercent', `%${Math.round(paymentPercents.credit * 100)}`);
        setText('paymentHgsPercent', `%${Math.round(paymentPercents.hgs * 100)}`);
        setText('paymentMobilePercent', `%${Math.round(paymentPercents.mobile * 100)}`);

        setText('paymentCreditCount', numberFormatter.format(creditCount));
        setText('paymentHgsCount', numberFormatter.format(hgsCount));
        setText('paymentMobileCount', numberFormatter.format(mobileCount));

        setText('paymentCreditAmount', currencyFormatter.format(creditAmount));
        setText('paymentHgsAmount', currencyFormatter.format(hgsAmount));
        setText('paymentMobileAmount', currencyFormatter.format(mobileAmount));

        setText('paymentTotalCount', numberFormatter.format(passSplit.paid));
        setText('paymentTotalAmount', currencyFormatter.format(successAmount));

        setWidth('paymentCreditBar', `${paymentPercents.credit * 100}%`);
        setWidth('paymentHgsBar', `${paymentPercents.hgs * 100}%`);
        setWidth('paymentMobileBar', `${paymentPercents.mobile * 100}%`);

        setText('cameraTotal', numberFormatter.format(totalPass));
        setText('cameraSefakoyIn', numberFormatter.format(cameraSefakoyIn));
        setText('cameraSefakoyOut', numberFormatter.format(cameraSefakoyOut));
        setText('cameraE5In', numberFormatter.format(cameraE5In));
        setText('cameraE5Out', numberFormatter.format(cameraE5Out));

        setWidth('cameraBarSefakoyIn', `${(cameraSefakoyIn / cameraMax) * 100}%`);
        setWidth('cameraBarSefakoyOut', `${(cameraSefakoyOut / cameraMax) * 100}%`);
        setWidth('cameraBarE5In', `${(cameraE5In / cameraMax) * 100}%`);
        setWidth('cameraBarE5Out', `${(cameraE5Out / cameraMax) * 100}%`);

        initHeroChart(data);
        updateDensityChart(baseKey, isCustom ? customRange.densityScale : undefined);
        updateMainAnalysisChart(baseKey, isCustom ? customRange.analysisScale : undefined);
        updateBaremChart(baseKey, isCustom ? customRange.barem : undefined);
    }

    // Filter Click Logic
    const filterChips = document.querySelectorAll('.f-chip');
    const datePicker = document.querySelector('.date-picker');
    const datePickerBtn = document.getElementById('datePickerBtn');
    const datePickerLabel = document.getElementById('datePickerLabel');
    const dateStartInput = document.getElementById('dateStart');
    const dateEndInput = document.getElementById('dateEnd');
    const dateApplyBtn = document.getElementById('dateApplyBtn');
    const filterToggleBtn = document.getElementById('filterToggleBtn');
    const filterActiveLabel = document.getElementById('filterActiveLabel');
    const filterMobileHeader = document.querySelector('.filter-mobile-header');

    const syncDateLabel = (periodKey) => {
        if (!datePickerLabel) return;
        if (periodKey === 'custom' && customRange) {
            datePickerLabel.textContent = customRange.label;
            return;
        }
        datePickerLabel.textContent = 'Tarih Aral\u0131\u011f\u0131 Se\u00e7';
    };

    const setActivePeriod = (periodKey) => {
        const isCustom = periodKey === 'custom';
        const normalized = isCustom ? 'custom' : (periodMeta[periodKey] ? periodKey : 'daily');
        if (!isCustom) {
            customRange = null;
        }
        activePeriod = normalized;
        filterChips.forEach((chip) => {
            chip.classList.toggle('active', !isCustom && chip.dataset.filter === normalized);
        });
        updateDashboard(normalized);
        syncDateLabel(normalized);
    };

    const isMobileView = () => window.matchMedia('(max-width: 640px)').matches;

    const syncMobileFilterState = () => {
        if (!filterCard) return;
        if (isMobileView()) {
            if (!filterCard.classList.contains('mobile-collapsed')) {
                filterCard.classList.add('mobile-collapsed');
            }
            if (filterToggleBtn) filterToggleBtn.setAttribute('aria-expanded', 'false');
        } else {
            filterCard.classList.remove('mobile-collapsed');
            if (filterToggleBtn) filterToggleBtn.setAttribute('aria-expanded', 'true');
        }
    };

    if (filterToggleBtn && filterCard) {
        filterToggleBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            filterCard.classList.toggle('mobile-collapsed');
            const expanded = !filterCard.classList.contains('mobile-collapsed');
            filterToggleBtn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
        });
    }

    if (filterMobileHeader && filterCard && filterToggleBtn) {
        filterMobileHeader.addEventListener('click', (event) => {
            if (event.target.closest('.filter-toggle')) return;
            filterCard.classList.toggle('mobile-collapsed');
            const expanded = !filterCard.classList.contains('mobile-collapsed');
            filterToggleBtn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
        });
    }

    window.addEventListener('resize', () => {
        syncMobileFilterState();
    });

    const closeDatePicker = () => {
        if (!datePicker) return;
        datePicker.classList.remove('open');
        if (datePickerBtn) datePickerBtn.setAttribute('aria-expanded', 'false');
    };

    filterChips.forEach((chip) => {
        chip.addEventListener('click', function () {
            const periodKey = this.dataset.filter || 'daily';
            setActivePeriod(periodKey);
        });
    });

    if (datePickerBtn && datePicker) {
        datePickerBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            if (customRange && dateStartInput && dateEndInput) {
                dateStartInput.value = formatInputDate(customRange.start);
                dateEndInput.value = formatInputDate(customRange.end);
            }
            const isOpen = datePicker.classList.toggle('open');
            datePickerBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });
    }

    if (dateApplyBtn) {
        dateApplyBtn.addEventListener('click', () => {
            if (!dateStartInput || !dateEndInput) return;
            const startValue = dateStartInput.value;
            const endValue = dateEndInput.value;
            if (!startValue || !endValue) return;
            const startDate = new Date(startValue);
            const endDate = new Date(endValue);
            if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) return;
            customRange = buildCustomRange(startDate, endDate);
            setActivePeriod('custom');
            closeDatePicker();
        });
    }

    document.addEventListener('click', (event) => {
        if (datePicker && !datePicker.contains(event.target)) {
            closeDatePicker();
        }
    });

    const initialPeriod = document.querySelector('.f-chip.active')?.dataset.filter || 'daily';
    setActivePeriod(initialPeriod);
    syncMobileFilterState();
    // --- Export Options ---
    const printBtn = document.getElementById('printBtn');
    if (printBtn) {
        printBtn.addEventListener('click', () => window.print());
    }

    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            const isCustom = activePeriod === 'custom' && customRange;
            const periodKey = isCustom ? customRange.baseKey : (activePeriod || 'daily');
            const periodLabel = isCustom ? customRange.label : (periodMeta[periodKey]?.label || 'Günlük');
            const data = isCustom ? customRange.data : (chartData[periodKey] || chartData.daily);

            let csvContent = "data:text/csv;charset=utf-8,";
            csvContent += "Zaman,Ciro,Tahsilat,Basarisiz\n";

            data.labels.forEach((label, index) => {
                const row = [
                    label,
                    data.ciro[index],
                    data.tahsilat[index],
                    data.ciro[index] - data.tahsilat[index]
                ].join(",");
                csvContent += row + "\r\n";
            });

            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `dashboard_data_${periodLabel.replace(/\\s+/g, '_')}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }

    const attachClickThrough = (selector) => {
        document.querySelectorAll(selector).forEach((el) => {
            el.addEventListener('click', (event) => {
                if (event.target.closest('a, button, input, select, textarea, .info-btn')) {
                    return;
                }
                const href = el.getAttribute('data-href');
                if (href) {
                    window.location.href = href;
                }
            });
        });
    };

    attachClickThrough('.clickable-row');
    attachClickThrough('.clickable-card');

    // --- Info Button Logic ---
    const infoBtns = document.querySelectorAll('.info-btn');
    infoBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const wrapper = btn.closest('.info-wrapper');
            // Close others
            document.querySelectorAll('.info-wrapper.active').forEach(w => {
                if (w !== wrapper) w.classList.remove('active');
            });
            wrapper.classList.toggle('active');
        });
    });

    // Close tooltips on outside click
    document.addEventListener('click', () => {
        document.querySelectorAll('.info-wrapper.active').forEach(w => w.classList.remove('active'));
    });

});
