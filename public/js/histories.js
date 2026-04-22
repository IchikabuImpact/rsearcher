let allHistories = [];

document.addEventListener('DOMContentLoaded', () => {
    fetchHistories();
    
    // Set up filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Remove active class from all
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            // Add to clicked
            e.target.classList.add('active');
            
            const days = e.target.getAttribute('data-days');
            applyFilter(days);
        });
    });
});

async function fetchHistories() {
    try {
        const response = await fetch('/api/histories');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        allHistories = await response.json();
        
        // Parse dates for accurate filtering
        allHistories.forEach(r => {
            r.dateObj = new Date(r.raw_date);
            // Default parse PT
            r.parsedPt = parseInt(String(r.pt).replace(/,/g, ''), 10) || 0;
            // Categorize type
            r.cat = getCategory(r.tp); 
        });

        // Trigger default filter (30 days)
        applyFilter('30');
    } catch (error) {
        console.error('Failed to fetch histories:', error);
        document.getElementById('history-tbody').innerHTML = `<tr><td colspan="6" class="txt-center" style="color:#f87171;">データの取得に失敗しました。サーバーを確認してください。</td></tr>`;
    }
}

function getCategory(tp) {
    if (!tp) return 'other';
    if (tp.includes('獲得')) return 'get';
    if (tp.includes('利用')) return 'use';
    if (tp.includes('追加')) return 'add';
    if (tp.includes('チャージ')) return 'charge';
    return 'other';
}

function getBadgeClass(cat) {
    return cat === 'other' ? 'default' : cat;
}

function applyFilter(daysStr) {
    let filtered = allHistories;
    
    if (daysStr !== 'all') {
        const daysLimit = parseInt(daysStr, 10);
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysLimit);
        // Reset time part to midnight for accurate day comparison
        cutoffDate.setHours(0, 0, 0, 0);

        filtered = allHistories.filter(r => r.dateObj >= cutoffDate);
    }
    
    renderSummary(filtered);
    renderServiceTable(filtered);
    renderTypeTable(filtered);
    renderDailyTable(filtered);
    renderRawHistory(filtered);
}

function formatNum(num) {
    return num.toLocaleString();
}

// 1. Render Summary Cards
function renderSummary(data) {
    let getPts = 0;
    let usePts = 0;
    let addPts = 0;
    let chargePts = 0;
    
    // We also need finding the max rewarding service
    const serviceMap = {};

    data.forEach(r => {
        if (r.cat === 'get') getPts += r.parsedPt;
        else if (r.cat === 'use') usePts += r.parsedPt;
        else if (r.cat === 'add') addPts += r.parsedPt;
        else if (r.cat === 'charge') chargePts += r.parsedPt;
        
        if (r.cat === 'get') {
            serviceMap[r.svc] = (serviceMap[r.svc] || 0) + r.parsedPt;
        }
    });

    const netPts = getPts - usePts;
    
    // Find top service
    let topService = '-';
    let maxServicePts = 0;
    for (const [svc, pts] of Object.entries(serviceMap)) {
        if (pts > maxServicePts) {
            maxServicePts = pts;
            topService = svc;
        }
    }

    document.getElementById('sum-get').textContent = formatNum(getPts) + ' P';
    document.getElementById('sum-use').textContent = formatNum(usePts) + ' P';
    document.getElementById('sum-net').textContent = formatNum(netPts) + ' P';
    document.getElementById('sum-add').textContent = formatNum(addPts) + ' P';
    document.getElementById('sum-charge').textContent = formatNum(chargePts) + ' 円';
    
    document.getElementById('top-service').textContent = maxServicePts > 0 ? `${topService} (${formatNum(maxServicePts)}P)` : '-';
}

// 2. Render Service Aggregation Table
function renderServiceTable(data) {
    const map = {};
    data.forEach(r => {
        // We only aggregate 'get' actions for the service effectiveness analysis? 
        // Requirements say "which service is most beneficial". But we will aggregate all for standard view, 
        // wait, let's just aggregate total points related to the service. Or total 'get' points.
        // Actually, the user asked for: "件数, 合計ポイント, 1件あたり平均ポイント".
        // Let's aggregate all points for simplicity. Usually service names are mostly gains or uses.
        if (!map[r.svc]) map[r.svc] = { count: 0, sum: 0 };
        map[r.svc].count += 1;
        
        // For services, maybe they want sum of GET? Let's just sum whatever points attached. 
        // Wait, if a service is 'rakuten pay' and we use 1000 points, it will be +1000 in '合計ポイント'. 
        // Let's sum raw points. The user didn't specify subtracting uses.
        map[r.svc].sum += r.parsedPt;
    });

    const arr = Object.keys(map).map(k => ({
        svc: k,
        count: map[k].count,
        sum: map[k].sum,
        avg: Math.round(map[k].sum / map[k].count)
    })).sort((a, b) => b.sum - a.sum);

    const tbody = document.getElementById('service-tbody');
    tbody.innerHTML = arr.length === 0 ? `<tr><td colspan="4" class="txt-center text-muted">データなし</td></tr>` : '';

    arr.forEach(row => {
        tbody.innerHTML += `
            <tr>
                <td>${row.svc}</td>
                <td class="txt-right">${formatNum(row.count)}</td>
                <td class="txt-right" style="font-weight:600;">${formatNum(row.sum)}</td>
                <td class="txt-right text-muted">${formatNum(row.avg)}</td>
            </tr>
        `;
    });
}

// 3. Render Type Aggregation Table
function renderTypeTable(data) {
    const map = {};
    data.forEach(r => {
        const tp = r.tp_full || r.tp;
        if (!map[tp]) map[tp] = { count: 0, sum: 0 };
        map[tp].count += 1;
        map[tp].sum += r.parsedPt;
    });

    const arr = Object.keys(map).map(k => ({
        tp: k,
        count: map[k].count,
        sum: map[k].sum
    })).sort((a, b) => b.sum - a.sum);

    const tbody = document.getElementById('type-tbody');
    tbody.innerHTML = arr.length === 0 ? `<tr><td colspan="3" class="txt-center text-muted">データなし</td></tr>` : '';

    arr.forEach(row => {
        tbody.innerHTML += `
            <tr>
                <td>${row.tp}</td>
                <td class="txt-right">${formatNum(row.count)}</td>
                <td class="txt-right" style="font-weight:600;">${formatNum(row.sum)}</td>
            </tr>
        `;
    });
}

// 4. Render Daily Trend
function renderDailyTable(data) {
    const map = {};
    data.forEach(r => {
        const d = r.dt_full || r.dt;
        if (!map[d]) {
            map[d] = { get: 0, use: 0, add: 0, charge: 0 };
        }
        if (r.cat === 'get') map[d].get += r.parsedPt;
        else if (r.cat === 'use') map[d].use += r.parsedPt;
        else if (r.cat === 'add') map[d].add += r.parsedPt;
        else if (r.cat === 'charge') map[d].charge += r.parsedPt;
    });

    const arr = Object.keys(map).map(k => {
        return {
            dt: k,
            get: map[k].get,
            use: map[k].use,
            add: map[k].add,
            charge: map[k].charge,
            net: map[k].get - map[k].use
        };
    }).sort((a, b) => b.dt < a.dt ? -1 : 1); // Ascending order to see trend naturally, or descending? 
    // Usually daily trends are descending or ascending. The user said "日付降順" for original list. Let's make this descending so latest is at top.
    arr.sort((a, b) => b.dt < a.dt ? -1 : 1);

    const tbody = document.getElementById('daily-tbody');
    tbody.innerHTML = arr.length === 0 ? `<tr><td colspan="6" class="txt-center text-muted">データなし</td></tr>` : '';

    arr.forEach(row => {
        tbody.innerHTML += `
            <tr>
                <td>${row.dt}</td>
                <td class="txt-right" style="color:var(--color-gain)">${formatNum(row.get)}</td>
                <td class="txt-right" style="color:var(--color-loss)">${formatNum(row.use)}</td>
                <td class="txt-right" style="color:var(--color-add)">${formatNum(row.add)}</td>
                <td class="txt-right" style="color:var(--color-charge)">${formatNum(row.charge)}</td>
                <td class="txt-right" style="font-weight:600; color:${row.net >= 0 ? 'var(--color-net)' : 'var(--color-loss)'}">${row.net > 0 ? '+' : ''}${formatNum(row.net)}</td>
            </tr>
        `;
    });
}

// 5. Render Raw History
function renderRawHistory(data) {
    const tbody = document.getElementById('history-tbody');
    tbody.innerHTML = '';
    
    // Data is already ordered by raw_date DESC, id DESC from API
    // but just in case, we'll slice and render
    
    if (!data || data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="txt-center text-muted h-100">データがありません</td></tr>`;
        return;
    }

    data.forEach(row => {
        const tr = document.createElement('tr');
        const badgeClass = getBadgeClass(row.cat);
        const displayTp = row.tp;
        const displayCnt = row.cnt; // Full text string is returned from backend now

        tr.innerHTML = `
            <td class="id-col text-muted">${row.id}</td>
            <td>${row.dt_full || row.dt}</td>
            <td class="txt-right" style="font-weight:600; color:#facc15;">${formatNum(row.parsedPt)}</td>
            <td>
                <span class="tp-badge ${badgeClass}">${displayTp}</span>
            </td>
            <td>${row.svc}</td>
            <td class="cnt-col" title="${displayCnt}">${displayCnt}</td>
        `;
        tbody.appendChild(tr);
    });
}
