(() => {
  // Elements
  const tabPaste = document.getElementById('tab-paste');
  const tabUpload = document.getElementById('tab-upload');
  const panePaste = document.getElementById('pane-paste');
  const paneUpload = document.getElementById('pane-upload');
  const emailInput = document.getElementById('email-input');
  const dropzone = document.getElementById('dropzone');
  const fileInput = document.getElementById('file-input');
  const filePreview = document.getElementById('file-preview');
  const fileName = document.getElementById('file-name');
  const fileRemove = document.getElementById('file-remove');
  const verifyBtn = document.getElementById('verify-btn');
  const uploadSection = document.getElementById('upload-section');
  const loadingSection = document.getElementById('loading-section');
  const resultsSection = document.getElementById('results-section');
  const statsGrid = document.getElementById('stats-grid');
  const resultsList = document.getElementById('results-list');
  const exportBtn = document.getElementById('export-csv');
  const newCheckBtn = document.getElementById('new-check');

  let selectedFile = null;
  let currentResults = null;
  let activeFilter = 'all';

  // Tab switching
  [tabPaste, tabUpload].forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const target = tab.dataset.tab;
      document.getElementById(`pane-${target}`).classList.add('active');
    });
  });

  // Dropzone
  dropzone.addEventListener('click', () => fileInput.click());
  dropzone.addEventListener('dragover', e => { e.preventDefault(); dropzone.classList.add('drag-over'); });
  dropzone.addEventListener('dragleave', () => dropzone.classList.remove('drag-over'));
  dropzone.addEventListener('drop', e => {
    e.preventDefault();
    dropzone.classList.remove('drag-over');
    if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
  });
  fileInput.addEventListener('change', () => {
    if (fileInput.files.length) handleFile(fileInput.files[0]);
  });

  function handleFile(file) {
    selectedFile = file;
    fileName.textContent = file.name;
    dropzone.hidden = true;
    filePreview.hidden = false;
  }

  fileRemove.addEventListener('click', () => {
    selectedFile = null;
    fileInput.value = '';
    dropzone.hidden = false;
    filePreview.hidden = true;
  });

  // Verify
  verifyBtn.addEventListener('click', async () => {
    const isPasteMode = tabPaste.classList.contains('active');
    const formData = new FormData();

    if (isPasteMode) {
      const text = emailInput.value.trim();
      if (!text) return alert('Please paste some emails first.');
      formData.append('emails', text);
    } else {
      if (!selectedFile) return alert('Please select a file first.');
      formData.append('file', selectedFile);
    }

    uploadSection.hidden = true;
    loadingSection.hidden = false;
    resultsSection.hidden = true;

    try {
      const res = await fetch('/api/verify', { method: 'POST', body: formData });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Verification failed');
      }
      const data = await res.json();
      currentResults = data;
      renderResults(data);
    } catch (e) {
      alert('Error: ' + e.message);
      uploadSection.hidden = false;
    } finally {
      loadingSection.hidden = true;
    }
  });

  function renderResults(data) {
    resultsSection.hidden = false;
    const s = data.summary;

    statsGrid.innerHTML = `
      <div class="stat-card stat-valid"><div class="stat-number">${s.valid}</div><div class="stat-label">Valid</div></div>
      <div class="stat-card stat-invalid"><div class="stat-number">${s.invalid}</div><div class="stat-label">Invalid</div></div>
      <div class="stat-card stat-uncertain"><div class="stat-number">${s.uncertain}</div><div class="stat-label">Uncertain</div></div>
      <div class="stat-card stat-error"><div class="stat-number">${s.error}</div><div class="stat-label">Error</div></div>
    `;

    // Update filter counts
    document.getElementById('filter-all').textContent = `All (${s.total})`;

    renderList(data.results);
  }

  function renderList(results) {
    const filtered = activeFilter === 'all' ? results : results.filter(r => r.status === activeFilter);
    resultsList.innerHTML = filtered.map((r, i) => `
      <div class="result-item" style="animation-delay: ${i * 30}ms">
        <div class="result-dot ${r.status}"></div>
        <div class="result-info">
          <div class="result-email">${esc(r.email)}</div>
          <div class="result-detail" title="${esc(r.detail)}">${esc(r.detail)}</div>
        </div>
        <span class="result-badge ${r.status}">${r.status}</span>
      </div>
    `).join('');
  }

  // Filters
  document.querySelectorAll('.filter').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.filter;
      if (currentResults) renderList(currentResults.results);
    });
  });

  // Export CSV
  exportBtn.addEventListener('click', () => {
    if (!currentResults) return;
    const rows = [['Email', 'Status', 'Detail']];
    currentResults.results.forEach(r => rows.push([r.email, r.status, r.detail]));
    const csv = rows.map(r => r.map(c => `"${c.replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `email-verification-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
  });

  // New check
  newCheckBtn.addEventListener('click', () => {
    resultsSection.hidden = true;
    uploadSection.hidden = false;
    currentResults = null;
    activeFilter = 'all';
    document.querySelectorAll('.filter').forEach(b => b.classList.remove('active'));
    document.getElementById('filter-all').classList.add('active');
  });

  function esc(s) {
    const d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }
})();
