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
     <button class="copy-btn" onclick="copyToClipboard('${escapeHtml(song)}')">📋</button>
   </div>`
).join('')}
          </div>
        </div>
      `).join('');
    }
    function copyToClipboard(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      alert(`✅ Скопировано: ${text}`);
    });
  } else {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    alert(`✅ Скопировано: ${text}`);
  }
}

// Делаем функцию доступной для onclick
    copyToClipboard = copyToClipboard;
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