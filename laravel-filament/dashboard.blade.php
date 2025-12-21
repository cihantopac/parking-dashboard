@push('styles')
    <link rel="stylesheet" href="{{ asset('parking-dashboard/dashboard.css') }}">
@endpush

@push('scripts')
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="{{ asset('parking-dashboard/dashboard.js') }}"></script>
@endpush

<div class="parking-dashboard">
<!-- Dashboard Grid Container -->
    <div class="dashboard-grid">

        <!-- ROW 0: Date Filters (Redesigned) -->
        <div class="filter-card full-width">
            <div class="filter-mobile-header">
                <div class="filter-icon">
                    <i class="fa-solid fa-filter text-primary"></i>
                </div>
                <div class="filter-mobile-text">
                    <span class="filter-mobile-title">Filtreler</span>
                    <span class="filter-mobile-active" id="filterActiveLabel">G&#252;nl&#252;k</span>
                </div>
                <button class="filter-toggle" id="filterToggleBtn" type="button" aria-expanded="false">
                    <i class="fa-solid fa-chevron-down"></i>
                </button>
            </div>
            <div class="filter-left">
                <div class="filter-icon">
                    <i class="fa-solid fa-filter text-primary"></i>
                </div>
                <div class="filter-groups">
                    <div class="f-group">
                        <span class="f-label">Şimdiki Dönem:</span>
                        <div class="f-chips">
                            <button class="f-chip active" data-filter="daily">Günlük</button>
                            <button class="f-chip" data-filter="weekly">Haftalık</button>
                            <button class="f-chip" data-filter="monthly">Aylık</button>
                        </div>
                    </div>
                    <div class="f-divider"></div>
                    <div class="f-group">
                        <span class="f-label">Geçmiş Dönem:</span>
                        <div class="f-chips">
                            <button class="f-chip" data-filter="last24">Son 24 Saat</button>
                            <button class="f-chip" data-filter="last7">Son 7 Gün</button>
                            <button class="f-chip" data-filter="last30">Son 30 Gün</button>
                        </div>
                    </div>
                    <div class="f-divider"></div>
                    <div class="f-group">
                        <span class="f-label">Uzun Dönem:</span>
                        <div class="f-chips">
                            <button class="f-chip" data-filter="yearly">Yıllık</button>
                            <button class="f-chip" data-filter="all">Tüm Zamanlar</button>
                        </div>
                    </div>
                </div>
                <div class="f-divider"></div>
                <div class="date-picker">
                    <button class="date-picker-btn" id="datePickerBtn" type="button" aria-expanded="false"
                        aria-haspopup="dialog">
                        <i class="fa-regular fa-calendar-days"></i>
                        <span id="datePickerLabel">Tarih Aralığı Seç</span>
                    </button>
                    <div class="date-dropdown" id="datePickerMenu" role="dialog" aria-label="Tarih aralığı seç">
                        <div class="date-inputs">
                            <label for="dateStart">Başlangıç</label>
                            <input type="date" id="dateStart">
                            <label for="dateEnd">Bitiş</label>
                            <input type="date" id="dateEnd">
                        </div>
                        <div class="date-actions">
                            <button class="date-apply" id="dateApplyBtn" type="button">Uygula</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="filter-right">
                <div class="action-buttons">
                    <button class="action-btn" id="printBtn"><i class="fa-solid fa-print"></i><span
                            class="action-label">Yazdır</span></button>
                    <button class="action-btn" id="exportBtn"><i class="fa-solid fa-file-excel"></i><span
                            class="action-label">Excel</span></button>
                </div>
            </div>
        </div>

        <!-- ROW 1.6: Pass Statistics Breakdown (Moved to Top) -->
        <div class="status-row full-width">

            <!-- 1. Total Pass (No Percentage) -->
            <a href="/park-sessions" class="status-card info">
                <div class="info-wrapper">
                    <button class="info-btn"><i class="fa-solid fa-circle-info"></i></button>
                    <div class="tooltip-content">Bu sayı, seçtiğin tarihlerde bariyerden geçen tüm araçların toplamıdır; ücretsiz, abone ve ücretli olanların hepsi dahildir.</div>
                </div>
                <div class="status-content">
                    <div class="status-label">
                        <i class="fa-solid fa-car-side text-primary"></i> Toplam Geçiş
                    </div>
                    <div class="status-value" id="totalPassValue">7,420</div>
                    <div class="status-sub text-primary" id="totalPassSub">Tüm Araçlar</div>
                </div>
                <div class="icon-bg"><i class="fa-solid fa-road"></i></div>
            </a>

            <!-- 2. Paid Pass -->
            <a href="/park-sessions?tableFilters[status_combined][value]=&tableFilters[amount][amount_min]=1&tableFilters[has_exit][value]=1" class="status-card light-green">
                <div class="info-wrapper">
                    <button class="info-btn"><i class="fa-solid fa-circle-info"></i></button>
                    <div class="tooltip-content">Burada, gerçekten ödeme yapan araçların toplamını görürsün; bu sayı ciroya doğrudan katkı yapan geçişlerdir.</div>
                </div>
                <div class="status-content">
                    <div class="status-label">
                        <i class="fa-solid fa-receipt text-light-green"></i> Ücretli Geçiş
                    </div>
                    <div class="status-value" id="paidPassValue">6,900</div>
                    <div class="status-details">
                        <div class="detail-item">
                            <span class="d-val text-light-green" id="paidPassRatio">%93.0</span>
                            <span class="d-lbl">Oran</span>
                        </div>
                    </div>
                </div>
                <div class="icon-bg"><i class="fa-solid fa-coins"></i></div>
            </a>

            <!-- 3. Subscriber -->
            <a href="/park-sessions?tableFilters[status_combined][value]=member&tableFilters[has_exit][value]=1" class="status-card light-yellow">
                <div class="info-wrapper">
                    <button class="info-btn"><i class="fa-solid fa-circle-info"></i></button>
                    <div class="tooltip-content">Aboneler önceden ödeme yaptığı için kasadan para çıkmaz; bu kart o abonelerin geçiş sayısını gösterir.</div>
                </div>
                <div class="status-content">
                    <div class="status-label">
                        <i class="fa-solid fa-id-card text-light-yellow"></i> Abone
                    </div>
                    <div class="status-value" id="subscriberPassValue">400</div>
                    <div class="status-details">
                        <div class="detail-item">
                            <span class="d-val text-light-yellow" id="subscriberPassRatio">%5.4</span>
                            <span class="d-lbl">Oran</span>
                        </div>
                    </div>
                </div>
                <div class="icon-bg"><i class="fa-solid fa-user-tag"></i></div>
            </a>

            <!-- 4. Free / Whitelist -->
            <a href="/park-sessions?tableFilters[amount][amount_max]=0.1&tableFilters[has_exit][value]=1" class="status-card secondary">
                <div class="info-wrapper">
                    <button class="info-btn"><i class="fa-solid fa-circle-info"></i></button>
                    <div class="tooltip-content">Personel veya özel izinli araçlar ücret ödemez; bu sayı sadece ücretsiz geçişleri anlatır.</div>
                </div>
                <div class="status-content">
                    <div class="status-label">
                        <i class="fa-solid fa-ticket text-secondary"></i> Ücretsiz / Beyaz Liste
                    </div>
                    <div class="status-value" id="freePassValue">120</div>
                    <div class="status-details">
                        <div class="detail-item">
                            <span class="d-val text-secondary" id="freePassRatio">%1.6</span>
                            <span class="d-lbl">Oran</span>
                        </div>
                    </div>
                </div>
                <div class="icon-bg"><i class="fa-solid fa-hand-holding-heart"></i></div>
            </a>

        </div>



        <!-- ROW 1: Hero Metric (Total Turnover) -->
        <div class="hero-card span-2 primary-gradient split-left" style="position: relative;">
            <div class="info-wrapper">
                <button class="info-btn" style="color: rgba(255,255,255,0.8);"><i class="fa-solid fa-circle-info"></i></button>
                <div class="tooltip-content" style="color: #333; background: #fff;">Bu alan, se&#231;ti&#287;in d&#246;nem boyunca kasaya giren toplam paray&#305; g&#246;sterir; yani &#252;cretli ge&#231;i&#351;lerden gelen gelirin tamam&#305;d&#305;r. Say&#305; b&#252;y&#252;d&#252;k&#231;e o d&#246;nemde daha fazla ciro yap&#305;ld&#305;&#287;&#305;n&#305; anlayabilirsin.</div>
            </div>
            <div class="hero-left">
                <div class="hero-content">
                    <div class="hero-label" id="heroLabel">Toplam Ciro (Bug&#252;n)</div>
                    <div class="hero-value-row">
                        <div class="hero-value" id="heroValue">&#8378;134,590.00</div>
                        <div class="hero-trend">
                            <span class="badge-trend up"><i class="fa-solid fa-arrow-trend-up"></i> <span id="heroTrendValue">%14.2</span></span>
                            <span class="trend-text" id="heroTrendLabel">D&#252;ne g&#246;re art&#305;&#351;</span>
                        </div>
                    </div>
                    <div class="hero-sub-metric">
                        <span class="sub-val" id="heroPaidCount">6,900</span>
                        <span class="sub-lbl">Toplam &#220;cretli Ara&#231; Ge&#231;i&#351;i</span>
                    </div>
                </div>
            </div>
            <div class="hero-icon">
                <i class="fa-solid fa-sack-dollar"></i>
            </div>
        </div>
        <div class="hero-card span-2 primary-gradient split-right" style="position: relative;">
            <div class="info-wrapper">
                <button class="info-btn" style="color: rgba(255,255,255,0.8);"><i class="fa-solid fa-circle-info"></i></button>
                <div class="tooltip-content" style="color: #333; background: #fff;">Bu mini grafik, se&#231;ti&#287;in d&#246;nemin i&#231;indeki ciro hareketini saat saat g&#246;sterir; &#231;ubuklar y&#252;kseldik&#231;e o saatlerde daha fazla &#246;deme al&#305;nm&#305;&#351; demektir.</div>
            </div>
            <div class="hero-right">
                <div class="hero-right-card">
                    <div class="hero-chart-mini">
                        <canvas id="miniRevenueChart"></canvas>
                    </div>
                </div>
            </div>
        </div>
        <!-- ROW 1.5: Payment Statuses (Flex Row) -->
        <div class="status-row full-width">

            <a href="/payments?tableFilters[status_id][values][0]=2" class="status-card success">
                <div class="info-wrapper">
                    <button class="info-btn"><i class="fa-solid fa-circle-info"></i></button>
                    <div class="tooltip-content">Ödemesi sorunsuz tamamlanmış ve kasaya giren tutar; en güvenilir gelir kalemidir.</div>
                </div>
                <div class="status-content">
                    <div class="status-label">
                        <i class="fa-solid fa-circle-check text-success"></i> Başarılı Tahsilat
                    </div>
                    <div class="status-value" id="successAmount">₺128,450.00</div>
                    <div class="status-details">
                        <div class="detail-item">
                            <span class="d-val" id="successCount">6,853</span>
                            <span class="d-lbl">Araç</span>
                        </div>
                        <div class="detail-divider"></div>
                        <div class="detail-item">
                            <span class="d-val" id="successRatio">%95.4</span>
                            <span class="d-lbl">Ciro Payı</span>
                        </div>
                    </div>
                </div>
                <div class="icon-bg"><i class="fa-solid fa-check-double"></i></div>
            </a>

            <!-- Card 2: Bekleyen -->
            <a href="/hgs-approvals" class="status-card warning">
                <div class="info-wrapper">
                    <button class="info-btn"><i class="fa-solid fa-circle-info"></i></button>
                    <div class="tooltip-content">HGS gibi sonradan düşecek işlemler; şu an tahsil edilmemiş ama daha sonra hesaplara yansıması bekleniyor.</div>
                </div>
                <div class="status-content">
                    <div class="status-label">
                        <i class="fa-solid fa-clock rotate"></i> Bekleyen (HGS)
                    </div>
                    <div class="status-value" id="pendingAmount">₺4,250.00</div>
                    <div class="status-details">
                        <div class="detail-item">
                            <span class="d-val" id="pendingCount">35</span>
                            <span class="d-lbl">Araç</span>
                        </div>
                        <div class="detail-divider"></div>
                        <div class="detail-item">
                            <span class="d-val" id="pendingRatio">%3.2</span>
                            <span class="d-lbl">Ciro Payı</span>
                        </div>
                    </div>
                </div>
                <div class="icon-bg"><i class="fa-solid fa-hourglass-half"></i></div>
            </a>

            <a href="/payments?tableFilters[status_id][values][0]=4&tableFilters[status_id][values][1]=6" class="status-card danger">
                <div class="info-wrapper">
                    <button class="info-btn"><i class="fa-solid fa-circle-info"></i></button>
                    <div class="tooltip-content">Kart hatası, yetersiz bakiye veya kaçak gibi sebeplerle alınamayan ödemeler; bu kısım kayıp riski taşır.</div>
                </div>
                <div class="status-content">
                    <div class="status-label">
                        <i class="fa-solid fa-circle-xmark"></i> Başarısız
                    </div>
                    <div class="status-value" id="failedAmount">₺1,890.00</div>
                    <div class="status-details">
                        <div class="detail-item">
                            <span class="d-val" id="failedCount">12</span>
                            <span class="d-lbl">Araç</span>
                        </div>
                        <div class="detail-divider"></div>
                        <div class="detail-item">
                            <span class="d-val" id="failedRatio">%1.4</span>
                            <span class="d-lbl">Ciro Payı</span>
                        </div>
                    </div>
                </div>
                <div class="icon-bg"><i class="fa-solid fa-ban"></i></div>
            </a>
        </div>



        <!-- ROW 2: Payment Breakdown Table -->
        <div class="payment-table-card full-width">
            <div class="info-wrapper">
                <button class="info-btn"><i class="fa-solid fa-circle-info"></i></button>
                <div class="tooltip-content">Bu tablo, paranın hangi yöntemle geldiğini sade şekilde gösterir; kredi kartı, HGS ve mobil ödeme paylarını karşılaştırırsın.</div>
            </div>
            <div class="card-header">
                <div>
                    <h3>Ödeme Yöntemi Analizi</h3>
                    <p class="subtitle">Yöntem bazlı ciro ve araç dağılımı</p>
                </div>
            </div>
            <div class="table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Ödeme Yöntemi</th>
                            <th>Kullanım Oranı</th>
                            <th class="text-right">Araç Sayısı</th>
                            <th class="text-right">Tahsil Edilen Tutar</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="clickable-row" data-href="/payments?tableFilters[service_id][values][0]=2&tableFilters[service_id][values][1]=10">
                            <td>
                                <div class="method-cell">
                                    <div class="icon-box blue"><i class="fa-solid fa-credit-card"></i></div>
                                    <a class="method-link" href="/payments?tableFilters[service_id][values][0]=2&tableFilters[service_id][values][1]=10">Kredi Kart&#305;</a>
                                </div>
                            </td>
                            <td>
                                <div class="progress-cell">
                                    <span id="paymentCreditPercent">%45</span>
                                    <div class="progress-bar">
                                        <div class="fill blue" id="paymentCreditBar" style="width: 45%"></div>
                                    </div>
                                </div>
                            </td>
                            <td class="text-right"><span id="paymentCreditCount">3,105</span> Araç</td>
                            <td class="text-right"><span id="paymentCreditAmount">₺57,802.50</span></td>
                        </tr>
                        <tr class="clickable-row" data-href="/payments?tableFilters[service_id][values][0]=1&tableFilters[service_id][values][1]=8">
                            <td>
                                <div class="method-cell">
                                    <div class="icon-box orange"><i class="fa-solid fa-road"></i></div>
                                    <a class="method-link" href="/payments?tableFilters[service_id][values][0]=1&tableFilters[service_id][values][1]=8">HGS</a>
                                </div>
                            </td>
                            <td>
                                <div class="progress-cell">
                                    <span id="paymentHgsPercent">%35</span>
                                    <div class="progress-bar">
                                        <div class="fill orange" id="paymentHgsBar" style="width: 35%"></div>
                                    </div>
                                </div>
                            </td>
                            <td class="text-right"><span id="paymentHgsCount">2,415</span> Araç</td>
                            <td class="text-right"><span id="paymentHgsAmount">₺44,957.50</span></td>
                        </tr>
                        <tr class="clickable-row" data-href="/payments?tableFilters[service_id][values][0]=3&tableFilters[service_id][values][1]=5&tableFilters[service_id][values][2]=4">
                            <td>
                                <div class="method-cell">
                                    <div class="icon-box purple"><i class="fa-solid fa-mobile-screen"></i></div>
                                    <a class="method-link" href="/payments?tableFilters[service_id][values][0]=3&tableFilters[service_id][values][1]=5&tableFilters[service_id][values][2]=4">Mobil &#214;deme</a>
                                </div>
                            </td>
                            <td>
                                <div class="progress-cell">
                                    <span id="paymentMobilePercent">%20</span>
                                    <div class="progress-bar">
                                        <div class="fill purple" id="paymentMobileBar" style="width: 20%"></div>
                                    </div>
                                </div>
                            </td>
                            <td class="text-right"><span id="paymentMobileCount">1,380</span> Araç</td>
                            <td class="text-right"><span id="paymentMobileAmount">₺25,690.00</span></td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="2"><strong>TOPLAM</strong></td>
                            <td class="text-right"><strong><span id="paymentTotalCount">6,900</span> Araç</strong></td>
                            <td class="text-right"><strong><span id="paymentTotalAmount">₺128,450.00</span></strong></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>

        <!-- ROW 3: Operational Metrics (2 Columns) -->
        <!-- ROW 3: Hourly Vehicle Density Chart -->
        <div class="chart-card full-width">
            <div class="info-wrapper">
                <button class="info-btn"><i class="fa-solid fa-circle-info"></i></button>
                <div class="tooltip-content">Bu grafik, günün hangi saatlerinde otoparka daha fazla araç girdiğini gösterir; yüksek sütun daha yoğun saat demektir.</div>
            </div>
            <div class="card-header">
                <div>
                    <h3><i class="fa-regular fa-clock"></i> Saatlik Araç Yoğunluğu</h3>
                    <p class="subtitle">Günün hangi saatlerinde araç geçişinin yoğun olduğu istatistiği</p>
                </div>
            </div>
            <div class="chart-wrapper" style="height: 300px;">
                <canvas id="hourlyDensityChart"></canvas>
            </div>
        </div>

        <!-- ROW 4: Payment Scale Analysis (Barem) -->
        <div class="barem-card span-2">
            <div class="info-wrapper">
                <button class="info-btn"><i class="fa-solid fa-circle-info"></i></button>
                <div class="tooltip-content">Ara&#231;lar&#305;n i&#231;eride kalma s&#252;releri bu dilimlere ayr&#305;l&#305;r; dilim b&#252;y&#252;d&#252;k&#231;e o s&#252;re aral&#305;&#287;&#305;n&#305;n daha &#231;ok kullan&#305;ld&#305;&#287;&#305;n&#305; anlars&#305;n.</div>
            </div>
            <div class="card-header">
                <h3>Otopark &#214;deme Baremi (S&#252;re Bazl&#305;)</h3>
            </div>
            <div class="pie-chart-wrapper">
                <canvas id="baremPieChart"></canvas>
            </div>
        </div>
        <div class="barem-card span-2 clickable-card" data-href="/park-pricings">
            <div class="info-wrapper">
                <button class="info-btn"><i class="fa-solid fa-circle-info"></i></button>
                <div class="tooltip-content">Bu kutu, se&#231;ti&#287;in d&#246;nem i&#231;in uygulanan &#252;cret tarifesini g&#246;sterir; burada her s&#252;re aral&#305;&#287;&#305;n&#305;n ka&#231; lira oldu&#287;unu net &#351;ekilde g&#246;rebilirsin.</div>
            </div>
            <div class="card-header">
                <h3>&#220;cret Tarifesi</h3>
            </div>
            <div class="barem-tariff">
                <div class="tariff-item">
                    <span>0-2 Saat</span>
                    <strong>&#8378;40</strong>
                </div>
                <div class="tariff-item">
                    <span>2-4 Saat</span>
                    <strong>&#8378;70</strong>
                </div>
                <div class="tariff-item">
                    <span>4-8 Saat</span>
                    <strong>&#8378;90</strong>
                </div>
                <div class="tariff-item">
                    <span>8-12 Saat</span>
                    <strong>&#8378;120</strong>
                </div>
                <div class="tariff-item">
                    <span>12+ Saat</span>
                    <strong>&#8378;160</strong>
                </div>
                <p class="tariff-note">&#220;cretler &#246;rnek olup se&#231;ilen d&#246;neme g&#246;re sistem taraf&#305;ndan g&#252;ncellenebilir.</p>
            </div>
        </div>
        <!-- ROW 5: Advanced Analysis & Camera Stats -->
        <div class="chart-panel span-3">
            <div class="info-wrapper">
                <button class="info-btn"><i class="fa-solid fa-circle-info"></i></button>
                <div class="tooltip-content">Bu grafik, saatlere g&#246;re hem ge&#231;i&#351; say&#305;s&#305;n&#305; hem de ciroyu birlikte g&#246;sterir; iki veriyi ayn&#305; anda kar&#351;&#305;la&#351;t&#305;rabilirsin.</div>
            </div>
            <div class="panel-header">
                <h3>&#214;deme ve Ge&#231;i&#351; Analizi</h3>
            </div>
            <div class="panel-body">
                <canvas id="mainAnalysisChart"></canvas>
            </div>
        </div>
        <div class="camera-card span-1 clickable-card" data-href="/plate-photos">
            <div class="info-wrapper">
                <button class="info-btn"><i class="fa-solid fa-circle-info"></i></button>
                <div class="tooltip-content">Hangi kapıdan kaç araç geçtiğini net görürsün; giriş ve çıkış yoğunluğunu kıyaslamak için kullanılır.</div>
            </div>
            <div class="card-header">
                <h3><i class="fa-solid fa-video"></i> Kamera Analizi</h3>
                <span class="header-subtitle">Toplam Geçiş: <span id="cameraTotal">6,930</span></span>
            </div>
            <div class="camera-table-header">
                <span>Kamera Noktası</span>
                <span>Geçiş Sayısı</span>
            </div>
            <div class="camera-list">
                <div class="camera-item">
                    <div class="camera-info">
                        <div class="cam-name"><i class="fa-solid fa-arrow-right-to-bracket text-success"></i> Sefaköy
                            Giriş</div>
                        <span class="camera-count"><span id="cameraSefakoyIn">2,450</span> <small>araç</small></span>
                    </div>
                    <div class="camera-bar-bg">
                        <div class="camera-bar-fill sefakoy" id="cameraBarSefakoyIn" style="width: 85%"></div>
                    </div>
                </div>
                <div class="camera-item">
                    <div class="camera-info">
                        <div class="cam-name"><i class="fa-solid fa-arrow-right-from-bracket text-danger"></i> Sefaköy
                            Çıkış</div>
                        <span class="camera-count"><span id="cameraSefakoyOut">2,380</span> <small>araç</small></span>
                    </div>
                    <div class="camera-bar-bg">
                        <div class="camera-bar-fill sefakoy" id="cameraBarSefakoyOut" style="width: 82%"></div>
                    </div>
                </div>
                <div class="camera-item">
                    <div class="camera-info">
                        <div class="cam-name"><i class="fa-solid fa-arrow-right-to-bracket text-success"></i> E5 Kapısı
                            Giriş</div>
                        <span class="camera-count"><span id="cameraE5In">1,120</span> <small>araç</small></span>
                    </div>
                    <div class="camera-bar-bg">
                        <div class="camera-bar-fill e5" id="cameraBarE5In" style="width: 45%"></div>
                    </div>
                </div>
                <div class="camera-item">
                    <div class="camera-info">
                        <div class="cam-name"><i class="fa-solid fa-arrow-right-from-bracket text-danger"></i> E5 Kapısı
                            Çıkış</div>
                        <span class="camera-count"><span id="cameraE5Out">980</span> <small>araç</small></span>
                    </div>
                    <div class="camera-bar-bg">
                        <div class="camera-bar-fill e5" id="cameraBarE5Out" style="width: 38%"></div>
                    </div>
                </div>
            </div>
        </div>

    </div>

    <!-- Script -->
    
    
</div>
