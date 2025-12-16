 const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQSG-0QXXOog8H7EFyAMIA-XBh0JFM_e9X-EOkpBzhg5XszVoMbHbDoEAYFLLtCiA/pub?output=csv';

    const loaderEl = document.getElementById('loader');
    const container = document.getElementById('accordion-container');
    const updateTimeEl = document.getElementById('update-time');
    const searchInput = document.getElementById('search-group');
    const suggestionsEl = document.getElementById('suggestions');

    let allGroups = []; // [{name: 'Кино', songs: [...]}]

    // === ДОБАВЛЕНО: управление лоадером ===
    function showLoader() {
      loaderEl.style.display = 'block';
      container.style.display = 'none';
    }
    function hideLoader() {
      loaderEl.style.display = 'none';
      container.style.display = 'block';
    }
    // === конец ===

    // === ДОБАВЛЕНО: поиск и автодополнение ===
    function filterGroups(query) {
      query = query.trim().toLowerCase();
      const filtered = query
        ? allGroups.filter(g => g.name.toLowerCase().includes(query))
        : allGroups;

      renderGroups(filtered);
    }

    function showSuggestions(items) {
      if (items.length === 0) {
        suggestionsEl.style.display = 'none';
        return;
      }
      suggestionsEl.innerHTML = items.map(g =>
        `<li onclick="fillSearch('${escapeHtml(g.name)}')">${escapeHtml(g.name)}</li>`
      ).join('');
      suggestionsEl.style.display = 'block';
    }

    function hideSuggestions() {
      suggestionsEl.style.display = 'none';
    }

        fillSearch = function(text) {
      searchInput.value = text;
      filterGroups(text);
      hideSuggestions();
      searchInput.focus();
    };
    // === конец ===

    function renderGroups(groups) {
      container.innerHTML = groups.map((group, idx) => `
        <div class="accordion">
          <div class="accordion-header" onclick="toggleAccordion(this)">
            ${escapeHtml(group.name)} (${group.songs.length})
          </div>
          <div class="accordion-body">
           ${group.songs.map(song => 
  `<div class="song">
     ${escapeHtml(song)}
    <button class="copy-btn" title="Заказать песню" 
        onclick="donateForSong('${escapeHtml(song)}')">🎁Заказать песню</button>
   </div>`
).join('')}
          </div>
        </div>
      `).join('');
    }
function donateForSong(songName) {
  // Опционально: логгируем (для статистики "какие песни чаще поддерживают")
  console.log('Поддержка для:', songName);
  // внутри donateForSong(songName)
const daComment = encodeURIComponent(`Поддержка песни: ${songName}`);
const daUrl = `https://www.donationalerts.com/r/vitaliy_podzemniy?alert_type=14&comment=${encodeURIComponent('Поддержка песни: ' + songName)}`;
  if (typeof ym !== 'undefined') {
    ym(105800092, 'reachGoal', 'donate_open', { song: songName }); // ← замени 99999999 на свой ID
  }
  if (typeof ym !== 'undefined') {
  ym(105800092, 'reachGoal', 'da_open', { song: songName });
}
  const modal = document.createElement('div');
  modal.innerHTML = `
    <div style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);z-index:10000;display:flex;align-items:center;justify-content:center;">
      <div style="background:white;border-radius:16px;padding:24px;max-width:95%;width:420px;font-family:sans-serif;box-shadow:0 10px 30px rgba(0,0,0,0.3);">
        <h3 style="margin:0 0 14px;color:#1a56db;font-size:1.3rem;">Поддержать исполнение: <em>${escapeHtml(songName)}</em></h3>
        
        <p style="margin-bottom:16px;font-size:0.95rem;color:#555;line-height:1.5;">
          RU → KZ Переводы из РФ — <strong>без комиссии с карты Тинькофф РФ в Казахстан.</strong> 
          💳 (Kaspi Visa):  4400 4303 5158 7859 
        </p>
            <button onclick="copyCard()" style="width:100%;padding:12px;background:#1a56db;color:white;border:none;border-radius:6px;margin-bottom:12px;">
          💳 Скопировать номер карты для перевода
        </button>
        <a href="https://new.donatepay.ru/@581577" target="_blank" onclick="warnVPN();this.parentElement.parentElement.remove()"
           style="display:block;width:100%;padding:14px;text-align:center;background:#ff6b6b;color:white;text-decoration:none;border-radius:8px;margin-bottom:12px;font-weight:bold;">
          🎧DonatePay
        </a>

        <a href="https://www.donationalerts.com/r/vitaliy_podzemniy" target="_blank"
   onclick="warnVPN(); copyToClipboard('${escapeHtml(songName)}'); this.parentElement.parentElement.remove();"
           style="display:block;width:100%;padding:14px;text-align:center;background:#4a90e2;color:white;text-decoration:none;border-radius:8px;margin-bottom:16px;font-weight:bold;">
           💙 DonationAlerts (название песни скопировано → вставьте в комментарий)
        </a>
                <a href="https://destream.net/live/misterfoxxx547/donate" target="_blank" onclick="warnVPN();this.parentElement.parentElement.remove()"
           style="display:block;width:100%;padding:14px;text-align:center;background:#4a90e2;color:white;text-decoration:none;border-radius:8px;margin-bottom:16px;font-weight:bold;">
          🌎 Google Pay
        </a>

        <p style="font-size:0.8rem;color:#888;margin:0;">
          ⚠️ Не открывается? Отключите <strong>VPN / AdBlock</strong>.
        </p>

        <button onclick="this.parentElement.parentElement.remove()" 
                style="width:100%;padding:10px;margin-top:16px;background:#f1f1f1;border:none;border-radius:8px;color:#555;">
          Закрыть
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}
function copyCard() {
  const card = "4400 4303 5158 7859"; 
  navigator.clipboard.writeText(card.replace(/\s/g, ''))
    .then(() => alert(`✅ Скопировано: ${card}`))
    .catch(() => {
      const ta = document.createElement('textarea');
      ta.value = card.replace(/\s/g, '');
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      alert(`✅ Скопировано: ${card}`);
    });
}
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).catch(() => {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  });
}
function warnVPN() {
  // Можно убрать alert, если мешает — он срабатывает только при клике на ссылку
  // alert("Если страница не загружается — отключите VPN или блокировщик рекламы.");
}

// Делаем функцию доступной для onclick
    // copyToClipboard = copyToClipboard;
    function toggleAccordion(header) {
      const body = header.nextElementSibling;
      header.classList.toggle('active');
      body.classList.toggle('active');
    }

    function escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }

    // === ЗАГРУЗКА ===
    showLoader();

    Papa.parse(CSV_URL, {
      download: true,
      header: false,
      skipEmptyLines: true,
      complete: function(results) {
        let data = results.data.filter(row => row.length > 0 && row[0] && row[0].trim() !== '');

        if (data.length === 0) {
          container.innerHTML = '<div class="accordion"><div class="accordion-header">Нет данных</div></div>';
          hideLoader();
          
          return;
        }

        // Группируем данные — НЕ МЕНЯЕМ логику!
        const groups = [];
        let currentGroup = { name: '', songs: [] };

        data.forEach(row => {
          const item = row[0].trim();
          if (item.startsWith('[ГРУППА]')) {
            if (currentGroup.name) groups.push(currentGroup);
            currentGroup = { name: item.replace('[ГРУППА]', '').trim(), songs: [] };
          } else {
            currentGroup.songs.push(item);
          }
        });
        if (currentGroup.name) groups.push(currentGroup);

        allGroups = groups;
        renderGroups(groups);
        console.log(groups);

        const now = new Date();
        updateTimeEl.textContent = now.toLocaleString('ru-RU');

        hideLoader();
      },
      error: function(err) {
        console.error('Ошибка загрузки CSV:', err);
        container.innerHTML = `<div class="accordion"><div class="accordion-header" style="color:red">Ошибка загрузки</div></div>`;
        hideLoader();
      }
    });

    // === ДОБАВЛЕНО: слушатели ===
    searchInput.addEventListener('input', () => {
      const q = searchInput.value;
      filterGroups(q);
      if (q.trim()) {
        const matches = allGroups
          .filter(g => g.name.toLowerCase().includes(q.toLowerCase()))
          .slice(0, 6);
        showSuggestions(matches);
      } else {
        hideSuggestions();
      }
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('header')) hideSuggestions();
    });