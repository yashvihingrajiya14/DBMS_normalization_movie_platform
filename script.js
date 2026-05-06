/* ═══════════════════════════════════════════════
   CineDB — Movie Streaming DBMS Analyzer
   script.js  (Pure Vanilla JS — no frameworks)
═══════════════════════════════════════════════ */

'use strict';

/* ══════════════════════════════════════
   NAVIGATION
══════════════════════════════════════ */
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const page = link.dataset.page;
    navigateTo(page);
  });
});

function navigateTo(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  const el = document.getElementById('page-' + page);
  if (el) el.classList.add('active');
  const link = document.querySelector(`[data-page="${page}"]`);
  if (link) link.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ══════════════════════════════════════
   TOAST
══════════════════════════════════════ */
let toastTimer;
function showToast(msg, type = 'info') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = `toast ${type} show`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 3000);
}

/* ══════════════════════════════════════
   DEFAULT SAMPLE INPUT
══════════════════════════════════════ */
function loadDefaults() {
  document.getElementById('attributes-input').value =
    'MovieID, Title, Genre, Language, ReleaseYear, UserID, UserName, SubscriptionType, WatchDate, Rating';
  document.getElementById('fd-input').value =
    'MovieID → Title, Genre, Language, ReleaseYear\nUserID → UserName, SubscriptionType\nSubscriptionType → Discount\nMovieID, UserID → WatchDate, Rating';
  document.getElementById('closure-input').value = 'MovieID, UserID';
  showToast('Sample data loaded!', 'success');
}

/* ══════════════════════════════════════
   PURE-JS NORMALIZATION ENGINE
══════════════════════════════════════ */

// Parse attributes string → Set
function parseAttrs(str) {
  return new Set(str.split(',').map(s => s.trim()).filter(Boolean));
}

// Parse FD lines → Array of { lhs: Set, rhs: Set }
function parseFDs(text) {
  return text.split('\n')
    .map(line => line.trim())
    .filter(line => line.includes('→') || line.includes('->'))
    .map(line => {
      const sep = line.includes('→') ? '→' : '->';
      const parts = line.split(sep);
      return {
        lhs: parseAttrs(parts[0]),
        rhs: parseAttrs(parts[1] || '')
      };
    })
    .filter(fd => fd.lhs.size > 0 && fd.rhs.size > 0);
}

// Compute closure of attrSet under fds
function computeAttrClosure(attrSet, fds) {
  const closure = new Set(attrSet);
  let changed = true;
  while (changed) {
    changed = false;
    for (const fd of fds) {
      if ([...fd.lhs].every(a => closure.has(a))) {
        fd.rhs.forEach(a => { if (!closure.has(a)) { closure.add(a); changed = true; } });
      }
    }
  }
  return closure;
}

// Generate all non-empty subsets of an array
function powerSet(arr) {
  const result = [];
  for (let i = 1; i < (1 << arr.length); i++) {
    const subset = arr.filter((_, j) => i & (1 << j));
    result.push(subset);
  }
  return result;
}

// Find all candidate keys
function findCandidateKeys(attrs, fds) {
  const attrArr = [...attrs];
  const keys = [];
  const subsets = powerSet(attrArr).sort((a, b) => a.length - b.length);
  for (const sub of subsets) {
    const subSet = new Set(sub);
    // Not a superkey of any existing key
    if (keys.some(k => [...k].every(a => subSet.has(a)))) continue;
    const closure = computeAttrClosure(subSet, fds);
    const isSuper = [...attrs].every(a => closure.has(a));
    if (isSuper) keys.push(subSet);
  }
  return keys;
}

// Check if an FD is a partial dependency
// (LHS is a proper subset of some candidate key, and RHS is non-prime)
function findPartialDeps(attrs, fds, candidateKeys) {
  const primeAttrs = new Set();
  candidateKeys.forEach(k => k.forEach(a => primeAttrs.add(a)));
  const violations = [];
  for (const fd of fds) {
    const lhsArr = [...fd.lhs];
    for (const key of candidateKeys) {
      // LHS ⊂ key (proper subset)
      const isProperSubset = lhsArr.every(a => key.has(a)) && lhsArr.length < key.size;
      if (isProperSubset) {
        // RHS has non-prime attributes
        const nonPrimeRHS = [...fd.rhs].filter(a => !primeAttrs.has(a));
        if (nonPrimeRHS.length > 0) {
          violations.push({ fd, nonPrimeRHS });
          break;
        }
      }
    }
  }
  return violations;
}

// Find transitive dependencies
function findTransitiveDeps(attrs, fds, candidateKeys) {
  const primeAttrs = new Set();
  candidateKeys.forEach(k => k.forEach(a => primeAttrs.add(a)));
  const violations = [];
  for (const fd of fds) {
    // LHS is not a superkey
    const lhsClosure = computeAttrClosure(fd.lhs, fds);
    const isSuperKey = [...attrs].every(a => lhsClosure.has(a));
    if (isSuperKey) continue;
    // LHS is not a subset of any candidate key (not prime-only subset)
    const lhsAllPrime = [...fd.lhs].every(a => primeAttrs.has(a));
    if (lhsAllPrime) continue;
    // Some RHS is non-prime and not in LHS
    const nonPrimeRHS = [...fd.rhs].filter(a => !primeAttrs.has(a) && !fd.lhs.has(a));
    if (nonPrimeRHS.length > 0) {
      violations.push({ fd, nonPrimeRHS });
    }
  }
  return violations;
}

// Find BCNF violations (LHS is not a superkey)
function findBCNFViolations(attrs, fds) {
  return fds.filter(fd => {
    const lhsClosure = computeAttrClosure(fd.lhs, fds);
    return ![...attrs].every(a => lhsClosure.has(a));
  });
}

// Get FDs fully contained in attrs
function getRelevantFDs(attrs, fds) {
  return fds.filter(fd => 
    [...fd.lhs].every(a => attrs.has(a)) && [...fd.rhs].every(a => attrs.has(a))
  );
}

// Build HTML for a list of relations
function buildRelationsHTML(relations) {
  if (!relations || relations.length === 0) return '<p>No relations.</p>';
  return `<div class="resulting-tables">
    ${relations.map(r => `
      <div class="result-table-chip">
        <strong>${r.name}</strong>
        <div style="font-size:12px; margin-top:4px; opacity:0.9">{${r.attributes.join(', ')}}</div>
        ${r.fd ? `<div style="font-size:11px; margin-top:4px; color:var(--orange)">${r.fd}</div>` : ''}
      </div>
    `).join('')}
  </div>`;
}

// Sequential Decomposition Engine
function sequentialDecomp(all_attrs, all_fds) {
  const primeAttrs = new Set();
  const keys = findCandidateKeys(all_attrs, all_fds);
  keys.forEach(k => k.forEach(a => primeAttrs.add(a)));

  // 1. 1NF
  const step1 = [{ name: 'R_1NF', attributes: [...all_attrs].sort() }];

  // 2. 2NF
  const partial = findPartialDeps(all_attrs, all_fds, keys);
  const step2 = [];
  const covered2 = new Set();
  partial.forEach((v, i) => {
    const attrs = new Set([...v.fd.lhs, ...v.fd.rhs]);
    step2.push({
      name: `R2_${i+1}`,
      attributes: [...attrs].sort(),
      fd: [...v.fd.lhs].join(', ') + ' → ' + [...v.fd.rhs].join(', ')
    });
    [...v.fd.rhs].forEach(a => covered2.add(a));
  });
  const remaining2 = [...all_attrs].filter(a => !covered2.has(a) || primeAttrs.has(a));
  step2.push({ name: `R2_Main`, attributes: remaining2.sort() });

  // 3. 3NF
  const step3 = [];
  step2.forEach(rel => {
    const relAttrs = new Set(rel.attributes);
    const relFDs = getRelevantFDs(relAttrs, all_fds);
    const relKeys = findCandidateKeys(relAttrs, relFDs);
    const transitive = findTransitiveDeps(relAttrs, relFDs, relKeys);
    
    if (transitive.length > 0) {
      const covered3 = new Set();
      transitive.forEach((v, i) => {
        const attrs = new Set([...v.fd.lhs, ...v.fd.rhs]);
        step3.push({
          name: `${rel.name}_3NF_${i+1}`,
          attributes: [...attrs].sort(),
          fd: [...v.fd.lhs].join(', ') + ' → ' + [...v.fd.rhs].join(', ')
        });
        [...v.fd.rhs].forEach(a => { if (!v.fd.lhs.has(a)) covered3.add(a); });
      });
      const remaining3 = [...relAttrs].filter(a => !covered3.has(a));
      step3.push({ name: `${rel.name}_Main`, attributes: remaining3.sort() });
    } else {
      step3.push(rel);
    }
  });

  // 4. BCNF
  const step4 = [];
  step3.forEach(rel => {
    const relAttrs = new Set(rel.attributes);
    const relFDs = getRelevantFDs(relAttrs, all_fds);
    const violations = findBCNFViolations(relAttrs, relFDs);
    
    if (violations.length > 0) {
      let currentAttrs = new Set(relAttrs);
      violations.forEach((fd, i) => {
        const r1 = new Set([...fd.lhs, ...fd.rhs]);
        step4.push({
          name: `${rel.name}_B${i+1}`,
          attributes: [...r1].sort(),
          fd: [...fd.lhs].join(', ') + ' → ' + [...fd.rhs].join(', ')
        });
        [...fd.rhs].forEach(a => currentAttrs.delete(a));
      });
      step4.push({ name: `${rel.name}_Rem`, attributes: [...currentAttrs].sort() });
    } else {
      step4.push(rel);
    }
  });

  return { step1, step2, step3, step4 };
}

/* ══════════════════════════════════════
   MAIN ANALYZE FUNCTION
══════════════════════════════════════ */
let lastAnalysis = null;

function analyzeAndNormalize() {
  const attrStr = document.getElementById('attributes-input').value.trim();
  const fdStr   = document.getElementById('fd-input').value.trim();

  if (!attrStr) { showToast('Please enter attributes.', 'error'); return; }
  if (!fdStr)   { showToast('Please enter functional dependencies.', 'error'); return; }

  const attrs = parseAttrs(attrStr);
  const fds   = parseFDs(fdStr);
  if (fds.length === 0) { showToast('No valid FDs found. Use format: A → B, C', 'error'); return; }

  const candidateKeys   = findCandidateKeys(attrs, fds);
  const partialViolations    = findPartialDeps(attrs, fds, candidateKeys);
  const transitiveViolations = findTransitiveDeps(attrs, fds, candidateKeys);
  const bcnfViolations       = findBCNFViolations(attrs, fds);

  const highestNF =
    bcnfViolations.length === 0 ? 'BCNF' :
    transitiveViolations.length === 0 ? '3NF' :
    partialViolations.length === 0 ? '2NF' : '1NF';

  lastAnalysis = { attrs, fds, candidateKeys, partialViolations, transitiveViolations, bcnfViolations, highestNF };

  const seq = sequentialDecomp(attrs, fds);
  renderCandidateKeys(candidateKeys);
  renderNFProgress(partialViolations, transitiveViolations, bcnfViolations);
  renderQuickSummary(attrs, fds, candidateKeys, highestNF);
  renderFDAnalyzer(attrs, fds, candidateKeys);
  renderNormalizationAccordion(attrs, fds, candidateKeys, partialViolations, transitiveViolations, bcnfViolations, seq);
  renderDashboard(attrs, fds, candidateKeys, partialViolations, transitiveViolations, bcnfViolations, highestNF);

  showToast('Analysis complete!', 'success');
}

/* ══════════════════════════════════════
   COMPUTE CLOSURE
══════════════════════════════════════ */
function computeClosure() {
  const attrStr    = document.getElementById('attributes-input').value.trim();
  const fdStr      = document.getElementById('fd-input').value.trim();
  const closureStr = document.getElementById('closure-input').value.trim();

  if (!closureStr) { showToast('Enter attribute set X for closure.', 'error'); return; }
  if (!fdStr)      { showToast('Enter functional dependencies first.', 'error'); return; }

  const fds      = parseFDs(fdStr);
  const X        = parseAttrs(closureStr);
  const closure  = computeAttrClosure(X, fds);
  const attrs    = parseAttrs(attrStr);
  const isSuperKey = attrStr ? [...attrs].every(a => closure.has(a)) : false;

  const card = document.getElementById('closure-result-card');
  const body = document.getElementById('closure-result-body');

  body.innerHTML = `
    <div class="closure-box">
      <div class="closure-label">Input X</div>
      <div class="closure-value">{${[...X].join(', ')}}</div>
      <div style="margin:12px 0; border-top:1px solid var(--border)"></div>
      <div class="closure-label">X⁺ (Closure)</div>
      <div class="closure-value">{${[...closure].join(', ')}}</div>
    </div>
    <div style="margin-top:12px; display:flex; gap:8px; align-items:center; font-size:13.5px">
      ${isSuperKey
        ? '<span class="tag tag-ok">✔ Superkey</span><span style="color:var(--text-secondary)">This set determines all attributes.</span>'
        : '<span class="tag tag-violation">✖ Not a Superkey</span><span style="color:var(--text-secondary)">Does not determine all attributes.</span>'}
    </div>`;
  card.style.display = 'block';
  showToast('Closure computed!', 'info');
}

/* ══════════════════════════════════════
   RENDER CANDIDATE KEYS
══════════════════════════════════════ */
function renderCandidateKeys(keys) {
  const card = document.getElementById('keys-card');
  const body = document.getElementById('keys-body');
  body.innerHTML = keys.length === 0
    ? '<p style="color:var(--text-muted);font-size:13.5px">No candidate keys found.</p>'
    : `<div class="tag-group">${keys.map((k, i) =>
        `<span class="tag tag-key" title="Key ${i+1}">🔑 {${[...k].join(', ')}}</span>`
      ).join('')}</div>`;
  card.style.display = 'block';
}

/* ══════════════════════════════════════
   RENDER NF PROGRESS
══════════════════════════════════════ */
function renderNFProgress(partial, transitive, bcnf) {
  const card = document.getElementById('nf-progress-card');
  const el = document.getElementById('nf-progress');
  const steps = [
    { label: '1NF', ok: true },
    { label: '2NF', ok: partial.length === 0 },
    { label: '3NF', ok: transitive.length === 0 },
    { label: 'BCNF', ok: bcnf.length === 0 }
  ];
  el.innerHTML = steps.map((s, i) => {
    const cls = s.ok ? 'achieved' : 'violated';
    const connDone = i > 0 && steps[i-1].ok && s.ok;
    return (i === 0 ? '' : `<div class="progress-connector ${connDone?'done':''}"></div>`) +
      `<div class="progress-step">
        <div class="progress-dot ${cls}">${s.ok?'✔':'✖'}</div>
        <div class="progress-label">${s.label}</div>
      </div>`;
  }).join('');
  card.style.display = 'block';
}

/* ══════════════════════════════════════
   RENDER QUICK SUMMARY
══════════════════════════════════════ */
function renderQuickSummary(attrs, fds, keys, nf) {
  const card = document.getElementById('quick-summary-card');
  const body = document.getElementById('quick-summary-body');
  body.innerHTML = `
    <div class="summary-grid">
      <div class="summary-item">
        <div class="summary-item-label">Attributes</div>
        <div class="summary-item-value">${attrs.size}</div>
      </div>
      <div class="summary-item">
        <div class="summary-item-label">FDs</div>
        <div class="summary-item-value">${fds.length}</div>
      </div>
      <div class="summary-item">
        <div class="summary-item-label">Candidate Keys</div>
        <div class="summary-item-value">${keys.length}</div>
      </div>
      <div class="summary-item">
        <div class="summary-item-label">Highest NF</div>
        <div class="summary-item-value" style="color:var(--teal)">${nf}</div>
      </div>
    </div>`;
  card.style.display = 'block';
}

/* ══════════════════════════════════════
   RENDER FD ANALYZER PAGE
══════════════════════════════════════ */
function renderFDAnalyzer(attrs, fds, keys) {
  const body = document.getElementById('fd-analysis-body');
  const primeAttrs = new Set();
  keys.forEach(k => k.forEach(a => primeAttrs.add(a)));

  body.innerHTML = `
    <div style="overflow-x:auto">
    <table class="fd-table">
      <thead>
        <tr>
          <th>#</th>
          <th>LHS</th>
          <th>RHS</th>
          <th>LHS Closure (X⁺)</th>
          <th>Superkey?</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${fds.map((fd, i) => {
          const closure = computeAttrClosure(fd.lhs, fds);
          const isSuperKey = [...attrs].every(a => closure.has(a));
          const cls = isSuperKey ? 'fd-row-ok' : 'fd-row-viol';
          return `<tr class="${cls}">
            <td>${i+1}</td>
            <td><span class="tag tag-key" style="font-size:12px">${[...fd.lhs].join(', ')}</span></td>
            <td><span class="tag tag-attr" style="font-size:12px">${[...fd.rhs].join(', ')}</span></td>
            <td style="font-family:var(--font-mono);font-size:12px;color:var(--text-secondary)">{${[...closure].join(', ')}}</td>
            <td class="${isSuperKey?'status-ok':'status-viol'}">${isSuperKey?'✔ Yes':'✖ No'}</td>
            <td><span class="tag ${isSuperKey?'tag-ok':'tag-violation'}">${isSuperKey?'BCNF Safe':'BCNF Violation'}</span></td>
          </tr>`;
        }).join('')}
      </tbody>
    </table>
    </div>
    <div style="margin-top:18px">
      <div class="nf-section-label">Prime Attributes</div>
      <div class="tag-group">${[...primeAttrs].map(a => `<span class="tag tag-key">${a}</span>`).join('')}</div>
    </div>`;
}

/* ══════════════════════════════════════
   RENDER NORMALIZATION ACCORDION
══════════════════════════════════════ */
function renderNormalizationAccordion(attrs, fds, keys, partial, transitive, bcnf, seq) {
  const container = document.getElementById('normalization-accordion');
  
  // Update step bar symbols
  const stepsStatus = { 
    '1nf': true, 
    '2nf': partial.length === 0, 
    '3nf': transitive.length === 0, 
    'bcnf': bcnf.length === 0 
  };
  
  Object.entries(stepsStatus).forEach(([nf, ok]) => {
    const el = document.querySelector(`#step-${nf} .nf-dot`);
    if (el) { el.className = `nf-dot ${ok ? 'done' : 'fail'}`; }
  });
  
  document.querySelectorAll('.nf-connector').forEach((c, i) => {
    const ok = i === 0 ? stepsStatus['2nf'] : i === 1 ? stepsStatus['3nf'] : stepsStatus['bcnf'];
    c.classList.toggle('done', ok);
  });

  const sections = [
    {
      id: '1nf', label: '1NF', fullLabel: 'First Normal Form',
      badgeClass: 'acc-badge-1nf',
      rule: 'All attribute values must be atomic.',
      status: true,
      violations: [],
      result: buildRelationsHTML(seq.step1)
    },
    {
      id: '2nf', label: '2NF', fullLabel: 'Second Normal Form',
      badgeClass: 'acc-badge-2nf',
      rule: 'In 1NF and no partial dependencies (non-prime attributes must depend on the whole key).',
      status: partial.length === 0,
      violations: partial,
      result: buildRelationsHTML(seq.step2)
    },
    {
      id: '3nf', label: '3NF', fullLabel: 'Third Normal Form',
      badgeClass: 'acc-badge-3nf',
      rule: 'In 2NF and no transitive dependencies (non-prime attributes must depend directly on the key).',
      status: transitive.length === 0,
      violations: transitive,
      result: buildRelationsHTML(seq.step3)
    },
    {
      id: 'bcnf', label: 'BCNF', fullLabel: 'Boyce-Codd Normal Form',
      badgeClass: 'acc-badge-bcnf',
      rule: 'For every dependency X → Y, X must be a superkey.',
      status: bcnf.length === 0,
      violations: bcnf,
      result: buildRelationsHTML(seq.step4)
    }
  ];

  container.innerHTML = sections.map(sec => `
    <div class="accordion-item">
      <div class="accordion-header" onclick="toggleAccordion('acc-${sec.id}', this)">
        <div class="acc-badge ${sec.badgeClass}">${sec.label}</div>
        <div>
          <div class="acc-title">${sec.fullLabel}</div>
        </div>
        <span class="acc-status-chip ${sec.status ? 'chip-ok' : 'chip-viol'}">
          ${sec.status ? '✔ Satisfied' : `✖ ${sec.violations.length} Violation${sec.violations.length > 1 ? 's' : ''}`}
        </span>
        <span class="acc-arrow">▾</span>
      </div>
      <div class="accordion-body" id="acc-${sec.id}">
        <div class="nf-rule-box">📌 <strong>Rule:</strong> ${sec.rule}</div>
        ${sec.violations && sec.violations.length > 0 ? `
          <div class="nf-section-label">⚠ Violations Detected</div>
          <div style="overflow-x:auto">
          <table class="decomp-table">
            <thead><tr><th>LHS</th><th>RHS</th><th>Issue</th></tr></thead>
            <tbody>
              ${sec.violations.map(v => {
                const fd = v.fd || v; // Handle both violation objects and direct FDs
                return `<tr>
                  <td><span class="tag tag-key" style="font-size:12px">${[...fd.lhs].join(', ')}</span></td>
                  <td><span class="tag tag-violation" style="font-size:12px">${[...fd.rhs].join(', ')}</span></td>
                  <td style="color:#D94040;font-size:12.5px">${v.nonPrimeRHS ? `Non-prime: ${v.nonPrimeRHS.join(', ')}` : 'LHS not a superkey'}</td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
          </div>` : ''}
        <div class="nf-section-label" style="margin-top:18px">${sec.violations && sec.violations.length > 0 ? 'Decomposition Result' : 'Result'}</div>
        <div style="font-size:14px;color:var(--text-secondary);line-height:1.65">${sec.result}</div>
      </div>
    </div>`).join('');
}

function build2NFDecomp(fds, keys, partial, primeAttrs) {
  const decomposed = partial.map((v, i) => {
    const lhs = [...v.fd.lhs].join(', ');
    const rhs = [...v.fd.rhs].join(', ');
    return `<div class="result-table-chip"><strong>R${i+1}</strong>${lhs}, ${rhs}</div>`;
  });
  const keyAttrs = [...primeAttrs];
  const allFDAttrs = new Set();
  partial.forEach(v => { v.fd.lhs.forEach(a => allFDAttrs.add(a)); v.fd.rhs.forEach(a => allFDAttrs.add(a)); });
  decomposed.push(`<div class="result-table-chip"><strong>R${decomposed.length+1} (Key Relation)</strong>${keyAttrs.join(', ')}</div>`);
  return `<div class="resulting-tables">${decomposed.join('')}</div>`;
}

function build3NFDecomp(fds, keys, transitive, primeAttrs) {
  const decomposed = transitive.map((v, i) => {
    const lhs = [...v.fd.lhs].join(', ');
    const rhs = [...v.fd.rhs].join(', ');
    return `<div class="result-table-chip"><strong>R${i+1}</strong>${lhs}, ${rhs}</div>`;
  });
  decomposed.push(`<div class="result-table-chip"><strong>R${decomposed.length+1} (Remaining)</strong>Separate transitive chains removed</div>`);
  return `<div class="resulting-tables">${decomposed.join('')}</div>`;
}

function buildBCNFDecomp(attrs, fds, bcnf) {
  const decomposed = bcnf.map((fd, i) => {
    const lhs = [...fd.lhs].join(', ');
    const rhs = [...fd.rhs].join(', ');
    return `<div class="result-table-chip"><strong>R${i+1}</strong>${lhs}, ${rhs}</div>`;
  });
  const remaining = [...attrs].filter(a => !bcnf.some(fd => fd.rhs.has(a)));
  decomposed.push(`<div class="result-table-chip"><strong>R${decomposed.length+1}</strong>${remaining.join(', ')}</div>`);
  return `<div class="resulting-tables">${decomposed.join('')}</div>
    <p style="margin-top:14px;font-size:13px;color:var(--text-muted)">Note: BCNF decomposition may not always preserve all dependencies. Check for lossless join property.</p>`;
}

function toggleAccordion(id, header) {
  const body = document.getElementById(id);
  const arrow = header.querySelector('.acc-arrow');
  const isOpen = body.classList.toggle('open');
  arrow.classList.toggle('open', isOpen);
}

/* ══════════════════════════════════════
   RENDER DASHBOARD
══════════════════════════════════════ */
function renderDashboard(attrs, fds, keys, partial, transitive, bcnf, nf) {
  const totalViolations = partial.length + transitive.length + bcnf.length;

  const statsGrid = document.getElementById('stats-grid');
  statsGrid.innerHTML = [
    { icon: '📐', value: attrs.size, label: 'Total Attributes', accent: 'accent-teal' },
    { icon: '🔗', value: fds.length, label: 'Functional Dependencies', accent: 'accent-orange' },
    { icon: '🔑', value: keys.length, label: 'Candidate Keys', accent: 'accent-green' },
    { icon: '⚠️', value: totalViolations, label: 'Total Violations', accent: 'accent-yellow' },
    { icon: '📊', value: nf, label: 'Highest Normal Form', accent: 'accent-teal' },
    { icon: '✂️', value: partial.length, label: 'Partial Dep. Violations', accent: 'accent-orange' },
    { icon: '🔄', value: transitive.length, label: 'Transitive Dep. Violations', accent: 'accent-green' },
    { icon: '🛡️', value: bcnf.length, label: 'BCNF Violations', accent: 'accent-yellow' }
  ].map(s => `
    <div class="stat-card ${s.accent}">
      <div class="stat-icon">${s.icon}</div>
      <div class="stat-value">${s.value}</div>
      <div class="stat-label">${s.label}</div>
    </div>`).join('');

  const recBody = document.getElementById('recommendation-body');
  const recMap = {
    'BCNF': { badge: '✅ BCNF', msg: 'Excellent! Your schema is in <strong>Boyce–Codd Normal Form</strong>. All functional dependencies have a superkey on the LHS. Your database is well-designed with minimal redundancy.' },
    '3NF':  { badge: '✅ 3NF',  msg: 'Your schema is in <strong>Third Normal Form</strong>. No transitive dependencies exist, but there are BCNF violations. Consider BCNF decomposition for even better normalization, though this may sacrifice some dependency preservation.' },
    '2NF':  { badge: '⚠ 2NF',  msg: 'Your schema is in <strong>Second Normal Form</strong>. Transitive dependencies exist — consider removing them by decomposing the relation to achieve 3NF. Extract attributes that depend on non-key attributes.' },
    '1NF':  { badge: '⚠ 1NF',  msg: 'Your schema is only in <strong>First Normal Form</strong>. Partial dependencies exist, causing update anomalies. Decompose the relation so every non-prime attribute is fully dependent on the candidate key.' }
  };
  const rec = recMap[nf] || recMap['1NF'];
  recBody.innerHTML = `<div class="recommendation-box"><span class="rec-nf-badge">${rec.badge}</span><br>${rec.msg}</div>`;

  const fdSummary = document.getElementById('fd-summary-body');
  fdSummary.innerHTML = `<ul class="fd-list">${fds.map((fd,i) =>
    `<li><span style="color:var(--text-muted);font-size:11px;width:18px">${i+1}.</span>
     <span class="fd-lhs">${[...fd.lhs].join(', ')}</span>
     <span class="fd-arrow">→</span>
     <span class="fd-rhs">${[...fd.rhs].join(', ')}</span></li>`
  ).join('')}</ul>`;

  document.getElementById('dashboard-empty').style.display = 'none';
  document.getElementById('dashboard-content').style.display = 'block';
}

/* ══════════════════════════════════════
   DATABASE TABLES DATA
══════════════════════════════════════ */
const DB = {
  movies: {
    columns: ['MovieID','Title','Genre','Language','ReleaseYear','Director'],
    rows: [
      [1,'Sacred Games','Crime Thriller','Hindi',2018,'Vikramaditya Motwane'],
      [2,'Mirzapur','Crime Drama','Hindi',2018,'Karan Anshuman'],
      [3,'Panchayat','Comedy Drama','Hindi',2020,'Deepak Kumar Mishra'],
      [4,'The Family Man','Action Thriller','Hindi',2019,'Raj & DK'],
      [5,'Scam 1992','Biography','Hindi',2020,'Hansal Mehta'],
      [6,'Delhi Crime','Crime Drama','Hindi',2019,'Richie Mehta'],
      [7,'Kota Factory','Drama','Hindi',2019,'Pratish Mehta'],
      [8,'Breathe','Thriller','Hindi',2018,'Mayank Sharma'],
      [9,'Four More Shots Please','Comedy','Hindi',2019,'Anu Menon'],
      [10,'Inside Edge','Sports Drama','Hindi',2017,'Karan Anshuman'],
      [11,'Tandav','Political Thriller','Hindi',2021,'Ali Abbas Zafar'],
      [12,'Paatal Lok','Crime Thriller','Hindi',2020,'Avinash Arun'],
      [13,'Maharani','Political Drama','Hindi',2021,'Karan Sharma'],
      [14,'Aranyak','Mystery Thriller','Hindi',2021,'Vinay Waikul'],
      [15,'The Disciple','Music Drama','Marathi',2020,'Chaitanya Tamhane'],
      [16,'Jamtara','Crime Drama','Hindi',2020,'Soumendra Padhi'],
      [17,'Rocket Boys','Biography','Hindi',2022,'Abhay Pannu'],
      [18,'Aspirants','Drama','Hindi',2021,'Apoorv Singh Karki'],
      [19,'Dice Media Girls Hostel','Comedy','Hindi',2018,'Ayappa KM'],
      [20,'College Romance','Romantic Comedy','Hindi',2018,'Simarpreet Singh'],
      [21,'Suzhal','Crime Thriller','Tamil',2022,'Bramma G'],
      [22,'Farzi','Crime Thriller','Hindi',2023,'Raj & DK'],
      [23,'Jubilee','Period Drama','Hindi',2023,'Vikramaditya Motwane'],
      [24,'Dahaad','Crime Thriller','Hindi',2023,'Reema Kagti'],
      [25,'Mirzapur S2','Crime Drama','Hindi',2020,'Gurmmeet Singh'],
      [26,'The Fame Game','Thriller','Hindi',2022,'Bejoy Nambiar'],
      [27,'Tripling','Comedy Drama','Hindi',2016,'Sameer Saxena'],
      [28,'Permanent Roommates','Romantic Comedy','Hindi',2014,'Arunabh Kumar'],
      [29,'Pitchers','Drama','Hindi',2015,'Amit Golani'],
      [30,'The Forgotten Army','Historical','Hindi',2020,'Kabir Khan'],
      [31,'Guilty Minds','Legal Drama','Hindi',2022,'Shefali Bhushan'],
      [32,'Hiccups & Hookups','Romantic Comedy','Hindi',2021,'Kunal Kohli'],
      [33,'Bloody Brothers','Crime Comedy','Hindi',2022,'Danish Aslam'],
      [34,'Yeh Meri Family','Family Drama','Hindi',2018,'Sameer Saxena'],
      [35,'Leila','Dystopian','Hindi',2019,'Deepa Mehta'],
    ]
  },
  users: {
    columns: ['UserID','Name','Email','City','State'],
    rows: [
      [101,'Aarav Sharma','aarav.sharma@gmail.com','Mumbai','Maharashtra'],
      [102,'Riya Patel','riya.patel@gmail.com','Ahmedabad','Gujarat'],
      [103,'Kabir Singh','kabir.singh@gmail.com','Delhi','Delhi'],
      [104,'Ananya Gupta','ananya.gupta@gmail.com','Bangalore','Karnataka'],
      [105,'Vikram Mehta','vikram.mehta@gmail.com','Surat','Gujarat'],
      [106,'Priya Nair','priya.nair@gmail.com','Kochi','Kerala'],
      [107,'Rohan Desai','rohan.desai@gmail.com','Pune','Maharashtra'],
      [108,'Sneha Reddy','sneha.reddy@gmail.com','Hyderabad','Telangana'],
      [109,'Arjun Verma','arjun.verma@gmail.com','Jaipur','Rajasthan'],
      [110,'Diya Iyer','diya.iyer@gmail.com','Chennai','Tamil Nadu'],
      [111,'Aditya Kumar','aditya.kumar@gmail.com','Kolkata','West Bengal'],
      [112,'Meera Joshi','meera.joshi@gmail.com','Lucknow','Uttar Pradesh'],
      [113,'Harsh Pandey','harsh.pandey@gmail.com','Varanasi','Uttar Pradesh'],
      [114,'Kavya Menon','kavya.menon@gmail.com','Thiruvananthapuram','Kerala'],
      [115,'Siddharth Rao','sid.rao@gmail.com','Bangalore','Karnataka'],
      [116,'Tanvi Shah','tanvi.shah@gmail.com','Ahmedabad','Gujarat'],
      [117,'Manav Chopra','manav.chopra@gmail.com','Delhi','Delhi'],
      [118,'Ishaan Tiwari','ishaan.tiwari@gmail.com','Bhopal','Madhya Pradesh'],
      [119,'Naina Agarwal','naina.agarwal@gmail.com','Indore','Madhya Pradesh'],
      [120,'Rahul Bose','rahul.bose@gmail.com','Mumbai','Maharashtra'],
      [121,'Sakshi Malhotra','sakshi.m@gmail.com','Chandigarh','Punjab'],
      [122,'Dev Kapoor','dev.kapoor@gmail.com','Delhi','Delhi'],
      [123,'Pooja Mishra','pooja.mishra@gmail.com','Patna','Bihar'],
      [124,'Kunal Mathur','kunal.mathur@gmail.com','Noida','Uttar Pradesh'],
      [125,'Ayesha Khan','ayesha.khan@gmail.com','Hyderabad','Telangana'],
      [126,'Nikhil Sinha','nikhil.sinha@gmail.com','Ranchi','Jharkhand'],
      [127,'Swati Bhat','swati.bhat@gmail.com','Mangalore','Karnataka'],
      [128,'Yash Tripathi','yash.tripathi@gmail.com','Allahabad','Uttar Pradesh'],
      [129,'Shreya Chatterjee','shreya.c@gmail.com','Kolkata','West Bengal'],
      [130,'Akash Pillai','akash.pillai@gmail.com','Trivandrum','Kerala'],
    ]
  },
  subscriptions: {
    columns: ['SubscriptionID','UserID','Type','Price','Discount','StartDate','EndDate'],
    rows: [
      [201,101,'Premium',499,10,'2024-01-01','2024-12-31'],
      [202,102,'Basic',149,0,'2024-02-01','2024-07-31'],
      [203,103,'Premium',499,10,'2024-01-15','2024-12-15'],
      [204,104,'Mobile',99,5,'2024-03-01','2024-08-31'],
      [205,105,'Basic',149,0,'2024-04-01','2024-09-30'],
      [206,106,'Premium',499,10,'2024-01-01','2024-12-31'],
      [207,107,'Annual',1499,20,'2024-01-01','2024-12-31'],
      [208,108,'Basic',149,0,'2024-02-15','2024-08-15'],
      [209,109,'Premium',499,10,'2024-03-01','2024-08-31'],
      [210,110,'Mobile',99,5,'2024-04-01','2024-09-30'],
      [211,111,'Annual',1499,20,'2024-01-01','2024-12-31'],
      [212,112,'Basic',149,0,'2024-02-01','2024-07-31'],
      [213,113,'Premium',499,10,'2024-03-15','2024-09-15'],
      [214,114,'Mobile',99,5,'2024-01-01','2024-06-30'],
      [215,115,'Annual',1499,20,'2024-01-01','2024-12-31'],
      [216,116,'Basic',149,0,'2024-04-01','2024-09-30'],
      [217,117,'Premium',499,10,'2024-02-01','2024-07-31'],
      [218,118,'Mobile',99,5,'2024-03-01','2024-08-31'],
      [219,119,'Basic',149,0,'2024-01-15','2024-07-15'],
      [220,120,'Annual',1499,20,'2024-01-01','2024-12-31'],
      [221,121,'Premium',499,10,'2024-04-01','2024-09-30'],
      [222,122,'Basic',149,0,'2024-02-15','2024-08-15'],
      [223,123,'Mobile',99,5,'2024-03-01','2024-08-31'],
      [224,124,'Premium',499,10,'2024-01-01','2024-06-30'],
      [225,125,'Annual',1499,20,'2024-01-01','2024-12-31'],
      [226,126,'Basic',149,0,'2024-03-01','2024-08-31'],
      [227,127,'Mobile',99,5,'2024-04-01','2024-09-30'],
      [228,128,'Premium',499,10,'2024-02-01','2024-07-31'],
      [229,129,'Annual',1499,20,'2024-01-01','2024-12-31'],
      [230,130,'Basic',149,0,'2024-03-15','2024-09-15'],
    ]
  },
  watchhistory: {
    columns: ['HistoryID','UserID','MovieID','WatchDate','Rating','Device','Duration(min)'],
    rows: [
      [1001,101,1,'2024-01-05',5,'Smart TV',45],
      [1002,101,2,'2024-01-10',4,'Mobile',60],
      [1003,102,3,'2024-02-03',5,'Laptop',50],
      [1004,102,5,'2024-02-15',5,'Smart TV',55],
      [1005,103,1,'2024-01-20',4,'Mobile',45],
      [1006,103,4,'2024-01-25',5,'Smart TV',60],
      [1007,104,6,'2024-03-02',4,'Tablet',50],
      [1008,104,7,'2024-03-10',5,'Laptop',45],
      [1009,105,2,'2024-04-01',3,'Mobile',60],
      [1010,105,8,'2024-04-05',4,'Smart TV',40],
      [1011,106,3,'2024-01-12',5,'Smart TV',50],
      [1012,106,9,'2024-01-18',4,'Mobile',55],
      [1013,107,4,'2024-02-20',5,'Laptop',60],
      [1014,107,10,'2024-02-28',4,'Smart TV',50],
      [1015,108,5,'2024-03-05',5,'Mobile',55],
      [1016,108,11,'2024-03-12',3,'Tablet',45],
      [1017,109,6,'2024-03-20',4,'Smart TV',50],
      [1018,109,12,'2024-03-25',5,'Laptop',60],
      [1019,110,7,'2024-04-02',5,'Mobile',45],
      [1020,110,13,'2024-04-08',4,'Smart TV',55],
      [1021,111,1,'2024-01-30',5,'Smart TV',45],
      [1022,111,14,'2024-02-05',4,'Laptop',50],
      [1023,112,2,'2024-02-10',3,'Mobile',60],
      [1024,112,15,'2024-02-18','4','Tablet',55],
      [1025,113,3,'2024-03-01',5,'Smart TV',50],
      [1026,113,16,'2024-03-08',4,'Mobile',45],
      [1027,114,4,'2024-03-15',5,'Laptop',60],
      [1028,114,17,'2024-03-22',4,'Smart TV',55],
      [1029,115,5,'2024-04-05',5,'Mobile',50],
      [1030,115,18,'2024-04-10',5,'Smart TV',45],
      [1031,116,6,'2024-01-08',4,'Tablet',50],
      [1032,116,19,'2024-01-15',3,'Mobile',40],
      [1033,117,7,'2024-02-01',5,'Smart TV',45],
      [1034,117,20,'2024-02-08',4,'Laptop',55],
      [1035,118,8,'2024-02-25',4,'Mobile',50],
      [1036,118,21,'2024-03-04',5,'Smart TV',60],
      [1037,119,9,'2024-03-12',3,'Tablet',45],
      [1038,119,22,'2024-03-18',5,'Mobile',55],
      [1039,120,10,'2024-04-01',4,'Smart TV',50],
      [1040,120,23,'2024-04-06',5,'Laptop',60],
    ]
  }
};

let currentTable = 'movies';
let allRows = [];

function showTable(name, btn) {
  currentTable = name;
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  const data = DB[name];
  document.getElementById('active-table-name').textContent =
    name === 'watchhistory' ? 'Watch History' : name.charAt(0).toUpperCase() + name.slice(1);

  const thead = document.getElementById('table-head');
  const tbody = document.getElementById('table-body');

  thead.innerHTML = `<tr>${data.columns.map(c => `<th>${c}</th>`).join('')}</tr>`;
  allRows = data.rows;
  renderTableRows(allRows);
  document.getElementById('active-row-count').textContent = `${allRows.length} rows`;
  document.getElementById('table-search').value = '';
}

function renderTableRows(rows) {
  const tbody = document.getElementById('table-body');
  tbody.innerHTML = rows.map(row =>
    `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`
  ).join('');
}

function filterTable() {
  const q = document.getElementById('table-search').value.toLowerCase();
  const filtered = allRows.filter(row =>
    row.some(cell => String(cell).toLowerCase().includes(q))
  );
  renderTableRows(filtered);
}

// Init default table
window.addEventListener('DOMContentLoaded', () => {
  showTable('movies', document.querySelector('.tab-btn'));
});
