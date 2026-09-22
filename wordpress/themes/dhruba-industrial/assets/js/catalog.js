/**
 * Dhruba Industrial Catalog Client Engine
 * Lightweight vanilla JavaScript (< 12KB) handling:
 * - RFQ Basket management & live sync
 * - Side-by-side technical specification matrix comparison (REST API powered)
 * - Project Wishlist / Bill of Materials (BOM) with 1-click batch move to RFQ
 * - Direct WhatsApp inquiry integration with pre-filled part numbers
 * - Badges and responsive feedback
 */
(function () {
  'use strict';

  const STORAGE_KEY_RFQ = 'dp_rfq_basket_v1';
  const STORAGE_KEY_COMPARE = 'dp_compare_list_v1';
  const STORAGE_KEY_WISHLIST = 'dp_wishlist_v1';

  // Configuration from WordPress localized script
  const config = window.dpCatalogConfig || {
    restUrl: '/wp-json/dhruba/v1/',
    nonce: '',
    waNumber: '+8801700000000'
  };

  /* ==========================================================================
     STORAGE HELPERS
     ========================================================================== */
  function getStorage(key) {
    try {
      return JSON.parse(localStorage.getItem(key)) || [];
    } catch (e) {
      return [];
    }
  }

  function setStorage(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {
      console.warn('Storage write failed', e);
    }
  }

  /* ==========================================================================
     RFQ BASKET ENGINE
     ========================================================================== */
  function getRfqBasket() {
    return getStorage(STORAGE_KEY_RFQ);
  }

  function saveRfqBasket(items) {
    setStorage(STORAGE_KEY_RFQ, items);
    updateRfqBadge();
    renderRfqPageTable();
  }

  function updateRfqBadge() {
    const basket = getRfqBasket();
    const count = basket.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const badges = document.querySelectorAll('.dp-rfq-count-badge');
    badges.forEach(b => {
      b.textContent = count;
      b.style.display = count > 0 ? 'inline-flex' : 'none';
    });
  }

  function addToRfq(productId, productName, qty = 1, mpn = '', brand = '') {
    if (!productId) return;
    const basket = getRfqBasket();
    const existing = basket.find(i => i.product_id === productId);

    if (existing) {
      existing.quantity = (existing.quantity || 1) + qty;
    } else {
      basket.push({
        product_id: productId,
        name: productName,
        mpn: mpn || productName,
        brand: brand || '',
        quantity: qty,
        note: ''
      });
    }

    saveRfqBasket(basket);
  }

  /* ==========================================================================
     WISHLIST & BOM ENGINE
     ========================================================================== */
  function getWishlist() {
    return getStorage(STORAGE_KEY_WISHLIST);
  }

  function saveWishlist(items) {
    setStorage(STORAGE_KEY_WISHLIST, items);
    updateWishlistBadge();
    renderWishlistTable();
  }

  function updateWishlistBadge() {
    const list = getWishlist();
    const badges = document.querySelectorAll('.dp-wishlist-count-badge');
    badges.forEach(b => {
      b.textContent = list.length;
      b.style.display = list.length > 0 ? 'inline-flex' : 'none';
    });
  }

  function toggleWishlist(product) {
    let list = getWishlist();
    const index = list.findIndex(i => i.product_id === product.product_id);
    let added = false;

    if (index >= 0) {
      list.splice(index, 1);
    } else {
      list.push(product);
      added = true;
    }

    saveWishlist(list);
    return added;
  }

  function renderWishlistTable() {
    const tbody = document.getElementById('dp-wishlist-tbody');
    const emptyBox = document.getElementById('dp-wishlist-empty');
    if (!tbody || !emptyBox) return;

    const items = getWishlist();
    if (items.length === 0) {
      tbody.innerHTML = '';
      emptyBox.style.display = 'block';
      return;
    }

    emptyBox.style.display = 'none';
    tbody.innerHTML = items.map(item => `
      <tr style="border-bottom:1px solid #f1f5f9;">
        <td style="padding:0.75rem;">
          <a href="${item.url || '#'}" style="font-weight:700; color:#0f172a; text-decoration:none; display:block;">
            ${item.name}
          </a>
          <span style="font-family:monospace; font-size:0.75rem; color:#64748b;">MPN: ${item.mpn || 'N/A'}</span>
        </td>
        <td style="padding:0.75rem; color:#0284c7; font-weight:700; text-transform:uppercase;">
          ${item.brand || 'Industrial'}
        </td>
        <td style="padding:0.75rem; color:#16a34a; font-weight:600; font-size:0.8125rem;">
          ● Ready Stock
        </td>
        <td style="padding:0.75rem; text-align:center;">
          <button type="button" class="dp-btn-wishlist-to-rfq" data-id="${item.product_id}" style="background:#0f172a; color:#fff; border:none; padding:0.4rem 0.8rem; border-radius:4px; font-weight:700; font-size:0.75rem; cursor:pointer;">
            + Add to RFQ
          </button>
        </td>
        <td style="padding:0.75rem; text-align:right;">
          <button type="button" class="dp-btn-wishlist-remove" data-id="${item.product_id}" style="background:none; border:none; color:#ef4444; font-size:1.1rem; cursor:pointer;" title="Remove from BOM">
            &times;
          </button>
        </td>
      </tr>
    `).join('');
  }

  /* ==========================================================================
     COMPARE MATRIX ENGINE
     ========================================================================== */
  function getCompareList() {
    return getStorage(STORAGE_KEY_COMPARE);
  }

  function saveCompareList(items) {
    setStorage(STORAGE_KEY_COMPARE, items);
    updateCompareBadge();
    renderCompareMatrix();
  }

  function updateCompareBadge() {
    const list = getCompareList();
    const badges = document.querySelectorAll('.dp-compare-count-badge');
    badges.forEach(b => {
      b.textContent = list.length;
      b.style.display = list.length > 0 ? 'inline-flex' : 'none';
    });
  }

  function toggleCompare(product) {
    let list = getCompareList();
    const index = list.findIndex(i => i.product_id === product.product_id);
    let added = false;

    if (index >= 0) {
      list.splice(index, 1);
    } else {
      if (list.length >= 4) {
        alert('You can compare up to 4 models simultaneously. Please remove a model first.');
        return false;
      }
      list.push(product);
      added = true;
    }

    saveCompareList(list);
    return added;
  }

  async function renderCompareMatrix() {
    const container = document.getElementById('dp-compare-table-container');
    const emptyBox = document.getElementById('dp-compare-empty');
    if (!container || !emptyBox) return;

    const list = getCompareList();
    if (list.length === 0) {
      container.innerHTML = '';
      emptyBox.style.display = 'block';
      return;
    }

    emptyBox.style.display = 'none';
    container.innerHTML = '<div style="text-align:center; padding:2rem; color:#64748b;">Loading full engineering specifications from catalog database...</div>';

    try {
      // Fetch full details for each product via REST API
      const promises = list.map(item =>
        fetch(`${config.restUrl}products/${item.product_id}`, { credentials: 'same-origin' })
          .then(res => res.ok ? res.json() : null)
          .catch(() => null)
      );

      const products = (await Promise.all(promises)).filter(p => p !== null);

      if (products.length === 0) {
        container.innerHTML = '<div style="color:#ef4444; padding:1.5rem; text-align:center;">Failed to load comparison data. Please try again.</div>';
        return;
      }

      // Collect unique spec keys across all compared models
      const specKeysMap = new Map();
      products.forEach(p => {
        (p.specs || []).forEach(s => {
          if (!specKeysMap.has(s.key)) {
            specKeysMap.set(s.key, s.label);
          }
        });
      });

      let html = `
        <table style="width:100%; border-collapse:collapse; font-size:0.875rem; text-align:left;">
          <thead>
            <tr style="border-bottom:2px solid #0f172a;">
              <th style="padding:1rem; width:220px; background:#f8fafc; font-weight:800; color:#0f172a;">Feature / Specification</th>
              ${products.map(p => `
                <th style="padding:1rem; min-width:200px; vertical-align:top; border-left:1px solid #e2e8f0;">
                  <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.5rem;">
                    <span style="font-size:0.75rem; font-weight:800; color:#0284c7; text-transform:uppercase;">${p.mfg_code || 'Model'}</span>
                    <button type="button" class="dp-btn-compare-remove" data-id="${p.id}" style="border:none; background:#fee2e2; color:#ef4444; border-radius:3px; padding:0.1rem 0.4rem; cursor:pointer; font-size:0.75rem;">&times;</button>
                  </div>
                  <a href="${p.permalink}" style="color:#0f172a; font-weight:700; text-decoration:none; display:block; font-size:0.9rem; line-height:1.3; margin-bottom:0.4rem;">
                    ${p.name}
                  </a>
                  <div style="font-family:monospace; font-size:0.75rem; color:#64748b; margin-bottom:0.75rem;">
                    MPN: ${p.mpn || 'N/A'}
                  </div>
                  <button type="button" class="dp-btn-rfq-add" data-product-id="${p.id}" data-product-name="${p.name}" style="width:100%; background:#0f172a; color:#fff; border:none; padding:0.45rem; border-radius:4px; font-weight:700; font-size:0.8125rem; cursor:pointer;">
                    + Add to RFQ
                  </button>
                </th>
              `).join('')}
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom:1px solid #e2e8f0; background:#f8fafc;">
              <td style="padding:0.75rem 1rem; font-weight:700; color:#334155;">Availability</td>
              ${products.map(p => `
                <td style="padding:0.75rem 1rem; border-left:1px solid #e2e8f0; color:${p.in_stock ? '#16a34a' : '#ef4444'}; font-weight:700;">
                  ${p.in_stock ? '● In Stock (Barishal)' : '○ Order to Indent'}
                </td>
              `).join('')}
            </tr>
            <tr style="border-bottom:1px solid #e2e8f0;">
              <td style="padding:0.75rem 1rem; font-weight:700; color:#334155;">Documentation</td>
              ${products.map(p => {
                const docs = p.documents || [];
                return `
                  <td style="padding:0.75rem 1rem; border-left:1px solid #e2e8f0;">
                    ${docs.length > 0 ? docs.map(d => `
                      <a href="${d.source_url || '#'}" target="_blank" rel="noopener" style="font-size:0.75rem; color:#0284c7; text-decoration:none; display:block; margin-bottom:0.25rem;">
                        📄 ${d.title}
                      </a>
                    `).join('') : '<span style="color:#94a3b8; font-size:0.75rem;">Available on RFQ</span>'}
                  </td>
                `;
              }).join('')}
            </tr>
      `;

      // Render spec rows
      specKeysMap.forEach((label, key) => {
        html += `
          <tr style="border-bottom:1px solid #e2e8f0;">
            <td style="padding:0.75rem 1rem; font-weight:600; color:#475569; background:#fafafa;">
              ${label}
            </td>
            ${products.map(p => {
              const s = (p.specs || []).find(spec => spec.key === key);
              const val = s ? (s.normalized_value || s.value_text || s.value) : '-';
              return `<td style="padding:0.75rem 1rem; border-left:1px solid #e2e8f0; font-weight:500;">${val}</td>`;
            }).join('')}
          </tr>
        `;
      });

      html += `</tbody></table>`;
      container.innerHTML = html;
    } catch (err) {
      console.error(err);
      container.innerHTML = '<div style="color:#ef4444; padding:1.5rem; text-align:center;">Error loading comparison matrix.</div>';
    }
  }

  /* ==========================================================================
     RFQ PAGE DYNAMIC TABLE
     ========================================================================== */
  function renderRfqPageTable() {
    const tbody = document.getElementById('dp-rfq-items-tbody');
    const emptyNotice = document.getElementById('dp-rfq-empty-notice');
    if (!tbody || !emptyNotice) return;

    const basket = getRfqBasket();
    if (basket.length === 0) {
      tbody.innerHTML = '';
      emptyNotice.style.display = 'block';
      return;
    }

    emptyNotice.style.display = 'none';
    tbody.innerHTML = basket.map(item => `
      <tr style="border-bottom:1px solid #f1f5f9;">
        <td style="padding:0.75rem;">
          <div style="font-weight:700; color:#0f172a;">${item.name}</div>
          <div style="font-size:0.75rem; font-family:monospace; color:#64748b;">${item.mpn ? 'MPN: ' + item.mpn : ''}</div>
        </td>
        <td style="padding:0.75rem; width:120px;">
          <input 
            type="number" 
            min="1" 
            value="${item.quantity || 1}" 
            class="dp-rfq-qty-input" 
            data-id="${item.product_id}" 
            style="width:70px; padding:0.35rem 0.5rem; border:1px solid #cbd5e1; border-radius:4px; font-weight:700; text-align:center;"
          />
        </td>
        <td style="padding:0.75rem;">
          <input 
            type="text" 
            value="${item.note || ''}" 
            placeholder="e.g. 3P+N auxiliary contact required" 
            class="dp-rfq-note-input" 
            data-id="${item.product_id}" 
            style="width:100%; padding:0.35rem 0.5rem; border:1px solid #cbd5e1; border-radius:4px; font-size:0.8125rem;"
          />
        </td>
        <td style="padding:0.75rem; text-align:right;">
          <button type="button" class="dp-btn-rfq-remove" data-id="${item.product_id}" style="background:none; border:none; color:#ef4444; font-size:1.25rem; cursor:pointer;" title="Remove">&times;</button>
        </td>
      </tr>
    `).join('');
  }

  /* ==========================================================================
     GLOBAL EVENT LISTENERS
     ========================================================================== */
  document.addEventListener('DOMContentLoaded', function () {
    // Initial badge updates & page rendering
    updateRfqBadge();
    updateWishlistBadge();
    updateCompareBadge();
    renderRfqPageTable();
    renderWishlistTable();
    renderCompareMatrix();

    // 1. ADD TO RFQ BUTTONS
    document.addEventListener('click', function (e) {
      const btn = e.target.closest('.dp-btn-rfq-add');
      if (!btn) return;

      const productId = parseInt(btn.getAttribute('data-product-id'), 10);
      const productName = btn.getAttribute('data-product-name') || 'Industrial Item';

      addToRfq(productId, productName);

      // Visual feedback
      const originalText = btn.textContent;
      btn.textContent = '✓ Added to RFQ';
      btn.style.backgroundColor = '#16a34a';
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.backgroundColor = '';
      }, 1500);
    });

    // 2. TOGGLE WISHLIST
    document.addEventListener('click', function (e) {
      const btn = e.target.closest('.dp-btn-wishlist-toggle');
      if (!btn) return;

      const product = {
        product_id: parseInt(btn.getAttribute('data-product-id'), 10),
        name: btn.getAttribute('data-product-name') || '',
        brand: btn.getAttribute('data-brand') || '',
        mpn: btn.getAttribute('data-mpn') || '',
        url: btn.getAttribute('data-url') || ''
      };

      const added = toggleWishlist(product);
      btn.textContent = added ? '❤️' : '🤍';
      btn.title = added ? 'Saved in Project BOM' : 'Add to Project BOM';
    });

    // 3. TOGGLE COMPARE
    document.addEventListener('click', function (e) {
      const btn = e.target.closest('.dp-btn-compare-toggle');
      if (!btn) return;

      const product = {
        product_id: parseInt(btn.getAttribute('data-product-id'), 10),
        name: btn.getAttribute('data-product-name') || '',
        brand: btn.getAttribute('data-brand') || '',
        mpn: btn.getAttribute('data-mpn') || '',
        url: btn.getAttribute('data-url') || ''
      };

      const added = toggleCompare(product);
      btn.style.borderColor = added ? '#0284c7' : '#cbd5e1';
      btn.style.color = added ? '#0284c7' : '#334155';
    });

    // 4. WISHLIST ACTIONS (Remove, Add individual to RFQ, Move All to RFQ, Clear)
    document.addEventListener('click', function (e) {
      // Remove individual from wishlist
      const removeBtn = e.target.closest('.dp-btn-wishlist-remove');
      if (removeBtn) {
        const id = parseInt(removeBtn.getAttribute('data-id'), 10);
        let list = getWishlist();
        list = list.filter(i => i.product_id !== id);
        saveWishlist(list);
        return;
      }

      // Add individual from wishlist to RFQ
      const toRfqBtn = e.target.closest('.dp-btn-wishlist-to-rfq');
      if (toRfqBtn) {
        const id = parseInt(toRfqBtn.getAttribute('data-id'), 10);
        const item = getWishlist().find(i => i.product_id === id);
        if (item) {
          addToRfq(item.product_id, item.name, 1, item.mpn, item.brand);
          toRfqBtn.textContent = '✓ In RFQ';
          toRfqBtn.style.backgroundColor = '#16a34a';
        }
        return;
      }

      // Move All to RFQ
      const moveAllBtn = e.target.closest('#dp-wishlist-move-to-rfq-all');
      if (moveAllBtn) {
        const items = getWishlist();
        if (items.length === 0) return;
        items.forEach(i => addToRfq(i.product_id, i.name, 1, i.mpn, i.brand));
        alert(`${items.length} items moved to your RFQ Basket!`);
        window.location.href = '/rfq/';
        return;
      }

      // Clear all wishlist
      const clearWishlistBtn = e.target.closest('#dp-wishlist-clear-all');
      if (clearWishlistBtn) {
        if (confirm('Are you sure you want to clear your saved project BOM?')) {
          saveWishlist([]);
        }
        return;
      }

      // Clear all compare
      const clearCompareBtn = e.target.closest('#dp-compare-clear-btn');
      if (clearCompareBtn) {
        saveCompareList([]);
        return;
      }

      // Remove single from compare table
      const removeCompareBtn = e.target.closest('.dp-btn-compare-remove');
      if (removeCompareBtn) {
        const id = parseInt(removeCompareBtn.getAttribute('data-id'), 10);
        let list = getCompareList().filter(i => i.product_id !== id);
        saveCompareList(list);
        return;
      }

      // Remove single item from RFQ page table
      const removeRfqBtn = e.target.closest('.dp-btn-rfq-remove');
      if (removeRfqBtn) {
        const id = parseInt(removeRfqBtn.getAttribute('data-id'), 10);
        let basket = getRfqBasket().filter(i => i.product_id !== id);
        saveRfqBasket(basket);
        return;
      }
    });

    // 5. INPUT CHANGES ON RFQ TABLE (Quantity & Notes)
    document.addEventListener('change', function (e) {
      if (e.target.matches('.dp-rfq-qty-input')) {
        const id = parseInt(e.target.getAttribute('data-id'), 10);
        const qty = Math.max(1, parseInt(e.target.value, 10) || 1);
        let basket = getRfqBasket();
        const item = basket.find(i => i.product_id === id);
        if (item) {
          item.quantity = qty;
          saveRfqBasket(basket);
        }
      }

      if (e.target.matches('.dp-rfq-note-input')) {
        const id = parseInt(e.target.getAttribute('data-id'), 10);
        const note = e.target.value;
        let basket = getRfqBasket();
        const item = basket.find(i => i.product_id === id);
        if (item) {
          item.note = note;
          saveRfqBasket(basket);
        }
      }
    });

    // 6. SUBMIT RFQ FORM HANDLER
    const rfqForm = document.getElementById('dp-rfq-form');
    if (rfqForm) {
      rfqForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        const submitBtn = rfqForm.querySelector('button[type="submit"]');
        const feedback = document.getElementById('dp-rfq-feedback');

        const basket = getRfqBasket();
        if (basket.length === 0) {
          alert('Your RFQ basket is empty. Please add products or attach your BOQ document.');
        }

        const formData = new FormData(rfqForm);
        const payload = {
          contact: formData.get('contact'),
          email: formData.get('email'),
          phone: formData.get('phone'),
          company: formData.get('company'),
          delivery_location: formData.get('delivery_location'),
          notes: formData.get('notes'),
          items: basket
        };

        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Submitting Official RFQ...';
        }

        try {
          const res = await fetch(`${config.restUrl}rfq`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-WP-Nonce': config.nonce
            },
            body: JSON.stringify(payload)
          });

          const result = await res.json();

          if (res.ok && result.success) {
            saveRfqBasket([]); // Empty basket
            if (feedback) {
              feedback.innerHTML = `
                <div style="background:#dcfce7; border:1px solid #86efac; color:#166534; padding:1.5rem; border-radius:6px; margin-top:1.5rem; text-align:center;">
                  <h3 style="margin:0 0 0.5rem 0; font-size:1.25rem;">RFQ Successfully Submitted!</h3>
                  <p style="margin:0 0 0.5rem 0;">Reference Tracking Number: <strong>${result.rfq_number}</strong></p>
                  <p style="font-size:0.875rem; margin:0 0 1rem 0;">Our engineering sales desk is preparing your formal quotation in BDT.</p>
                  <a href="${result.whatsapp_url || '#'}" target="_blank" rel="noopener" style="display:inline-block; background:#22c55e; color:#fff; padding:0.5rem 1rem; border-radius:4px; font-weight:700; text-decoration:none;">
                    Confirm Instant Receipt on WhatsApp ↗
                  </a>
                </div>
              `;
            }
            rfqForm.reset();
          } else {
            alert(result.message || 'Error creating RFQ. Please contact our sales desk.');
          }
        } catch (err) {
          console.error(err);
          alert('Network communication error. Please try again or WhatsApp us directly.');
        } finally {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Formal RFQ for Official Quote';
          }
        }
      });
    }

    /* ==========================================================================
       INSTANT SEARCH & FACETED AUTOCOMPLETE ENGINE
       Handles instant typeahead, MPN boosting, and zero-result tracking
       ========================================================================== */
    const searchInputs = document.querySelectorAll('.dp-instant-search-input');
    searchInputs.forEach(input => {
      let debounceTimer = null;
      const resultsContainer = document.querySelector(input.dataset.resultsTarget || '.dp-instant-search-results');

      input.addEventListener('input', function() {
        const query = this.value.trim();
        clearTimeout(debounceTimer);

        if (!resultsContainer) return;

        if (query.length < 2) {
          resultsContainer.style.display = 'none';
          resultsContainer.innerHTML = '';
          return;
        }

        debounceTimer = setTimeout(async () => {
          resultsContainer.style.display = 'block';
          resultsContainer.innerHTML = '<div style="padding:1rem; color:#64748b; font-size:0.875rem;">Searching 50,000+ electrical SKUs...</div>';

          try {
            const url = `${config.restUrl}search?q=${encodeURIComponent(query)}&per_page=6`;
            const res = await fetch(url);
            const data = await res.json();

            if (!data.success || !data.hits || data.hits.length === 0) {
              resultsContainer.innerHTML = `
                <div style="padding:1rem; font-size:0.875rem; color:#475569;">
                  <div style="font-weight:700; color:#0f172a; margin-bottom:0.25rem;">No exact match for "${query}"</div>
                  <div style="font-size:0.75rem; color:#64748b; margin-bottom:0.75rem;">Our sales engineering team can source this item directly from manufacturers.</div>
                  <a href="https://wa.me/8801700000000?text=${encodeURIComponent('Hello Dhruba Power desk, I am looking for unlisted MPN: ' + query)}" target="_blank" rel="noopener" style="display:inline-block; font-size:0.75rem; background:#22c55e; color:#fff; padding:0.35rem 0.75rem; border-radius:4px; font-weight:700; text-decoration:none;">
                    Request Direct Sourcing on WhatsApp ↗
                  </a>
                </div>
              `;
              return;
            }

            let html = '<div style="max-height:360px; overflow-y:auto; border:1px solid #cbd5e1; border-radius:6px; background:#fff; box-shadow:0 10px 15px -3px rgba(0,0,0,0.1);">';
            data.hits.forEach(hit => {
              html += `
                <a href="${hit.url || '#'}" style="display:flex; align-items:center; gap:0.75rem; padding:0.6rem 0.75rem; border-bottom:1px solid #f1f5f9; text-decoration:none; color:inherit;">
                  <div style="width:40px; height:40px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:4px; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                    ${hit.image ? `<img src="${hit.image}" alt="" style="max-width:100%; max-height:100%; object-fit:contain;">` : '<span style="font-size:0.65rem; color:#94a3b8; font-weight:700;">DP</span>'}
                  </div>
                  <div style="flex:1; min-width:0;">
                    <div style="font-size:0.75rem; font-weight:700; color:#d97706; text-transform:uppercase;">${hit.brand || 'DHRUBA'} &bull; MPN: ${hit.mpn || hit.sku || ''}</div>
                    <div style="font-size:0.875rem; font-weight:600; color:#0f172a; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${hit.title}</div>
                  </div>
                  <span style="font-size:0.7rem; background:#f1f5f9; color:#475569; padding:0.2rem 0.5rem; border-radius:3px; font-weight:600;">View</span>
                </a>
              `;
            });
            html += `
              <div style="padding:0.5rem; background:#f8fafc; text-align:center; font-size:0.75rem; color:#64748b;">
                Found ${data.total} matching items (${data.processingTimeMs || 0}ms)
              </div>
            </div>`;

            resultsContainer.innerHTML = html;
          } catch (err) {
            console.error('Instant search error:', err);
            resultsContainer.style.display = 'none';
          }
        }, 250);
      });

      // Close instant search results on click outside
      document.addEventListener('click', function(e) {
        if (resultsContainer && !input.contains(e.target) && !resultsContainer.contains(e.target)) {
          resultsContainer.style.display = 'none';
        }
      });
    });
  });
})();
