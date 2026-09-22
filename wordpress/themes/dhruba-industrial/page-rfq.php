<?php
/**
 * Template Name: RFQ Portal
 *
 * Dedicated Request For Quote (RFQ) Submission Page
 *
 * @package DhrubaIndustrial
 */

if (!defined('ABSPATH')) {
    exit;
}

get_header();
?>

<div class="dp-container" style="padding-top:2rem; padding-bottom:4rem;">
  <div style="max-width:900px; margin:0 auto;">
    
    <div style="border-bottom:2px solid #e2e8f0; padding-bottom:1.5rem; margin-bottom:2rem;">
      <span style="font-size:0.8125rem; font-weight:700; color:#d97706; text-transform:uppercase; letter-spacing:0.5px;">Industrial Procurement</span>
      <h1 style="font-size:2rem; font-weight:900; color:#0f172a; margin:0.25rem 0 0.5rem 0;">Request For Formal Quotation (RFQ)</h1>
      <p style="color:#64748b; font-size:0.95rem; margin:0;">
        Submit your required equipment list, quantities, or Bill of Quantities (BOQ). Our Barishal engineering desk provides fast BDT quotations with stock availability and delivery timelines.
      </p>
    </div>

    <!-- RFQ Form -->
    <form id="dp-rfq-form" style="background:#ffffff; border:1px solid #e2e8f0; border-radius:8px; padding:2rem; box-shadow:0 1px 3px rgba(0,0,0,0.05);">
      
      <!-- Section 1: Selected Line Items -->
      <div style="margin-bottom:2rem;">
        <h2 style="font-size:1.15rem; font-weight:800; color:#0f172a; margin:0 0 1rem 0; display:flex; justify-content:space-between; align-items:center;">
          <span>1. Selected Products & Quantities</span>
          <a href="<?php echo esc_url(home_url('/shop/')); ?>" style="font-size:0.8125rem; color:#0284c7; text-decoration:none; font-weight:600;">+ Browse more products</a>
        </h2>

        <div id="dp-rfq-items-container">
          <table style="width:100%; border-collapse:collapse; font-size:0.875rem;">
            <thead>
              <tr style="background:#f8fafc; border-bottom:1px solid #e2e8f0; text-align:left;">
                <th style="padding:0.75rem;">Product / Model</th>
                <th style="padding:0.75rem; width:120px;">Quantity</th>
                <th style="padding:0.75rem;">Notes / Target Specs</th>
                <th style="padding:0.75rem; width:50px;"></th>
              </tr>
            </thead>
            <tbody id="dp-rfq-items-tbody">
              <!-- Dynamically populated from JS localStorage -->
            </tbody>
          </table>
          <div id="dp-rfq-empty-notice" style="display:none; padding:1.5rem; text-align:center; color:#64748b;">
            Your RFQ basket is currently empty. Browse our catalog to add items or upload your BOQ file below.
          </div>
        </div>
      </div>

      <!-- Section 2: BOQ / BOM Upload -->
      <div style="margin-bottom:2rem; background:#f8fafc; border:1px dashed #cbd5e1; border-radius:6px; padding:1.5rem;">
        <h2 style="font-size:1.05rem; font-weight:700; color:#0f172a; margin:0 0 0.5rem 0;">2. Attach Bill of Quantities (BOQ / BOM / SLD)</h2>
        <p style="font-size:0.8125rem; color:#64748b; margin:0 0 1rem 0;">Have an existing Excel spreadsheet, tender schedule, or single-line diagram? Upload it directly (PDF, XLSX, DOCX up to 25MB).</p>
        <input type="file" name="boq_file" id="dp_boq_file" accept=".pdf,.xlsx,.xls,.docx,.dwg" style="font-size:0.875rem;">
      </div>

      <!-- Section 3: Company & Contact Details -->
      <div style="margin-bottom:2rem;">
        <h2 style="font-size:1.15rem; font-weight:800; color:#0f172a; margin:0 0 1rem 0;">3. Contact & Delivery Details</h2>
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:1rem;">
          <div>
            <label style="display:block; font-size:0.8125rem; font-weight:700; margin-bottom:0.35rem; color:#334155;">Company / Factory Name</label>
            <input type="text" name="company" placeholder="e.g. Barishal Engineering Works Ltd." style="width:100%; padding:0.6rem; border:1px solid #cbd5e1; border-radius:4px; font-size:0.875rem;" required>
          </div>

          <div>
            <label style="display:block; font-size:0.8125rem; font-weight:700; margin-bottom:0.35rem; color:#334155;">Contact Person Name *</label>
            <input type="text" name="contact" placeholder="e.g. Engr. Tanvir Ahmed" style="width:100%; padding:0.6rem; border:1px solid #cbd5e1; border-radius:4px; font-size:0.875rem;" required>
          </div>

          <div>
            <label style="display:block; font-size:0.8125rem; font-weight:700; margin-bottom:0.35rem; color:#334155;">Official Email *</label>
            <input type="email" name="email" placeholder="name@company.com" style="width:100%; padding:0.6rem; border:1px solid #cbd5e1; border-radius:4px; font-size:0.875rem;" required>
          </div>

          <div>
            <label style="display:block; font-size:0.8125rem; font-weight:700; margin-bottom:0.35rem; color:#334155;">Phone / Mobile *</label>
            <input type="tel" name="phone" placeholder="+880 1700-000000" style="width:100%; padding:0.6rem; border:1px solid #cbd5e1; border-radius:4px; font-size:0.875rem;" required>
          </div>

          <div>
            <label style="display:block; font-size:0.8125rem; font-weight:700; margin-bottom:0.35rem; color:#334155;">WhatsApp Number</label>
            <input type="tel" name="whatsapp" placeholder="For instant quote updates" style="width:100%; padding:0.6rem; border:1px solid #cbd5e1; border-radius:4px; font-size:0.875rem;">
          </div>

          <div>
            <label style="display:block; font-size:0.8125rem; font-weight:700; margin-bottom:0.35rem; color:#334155;">Delivery Location</label>
            <input type="text" name="location" placeholder="e.g. Barishal BSCIC Industrial Estate" style="width:100%; padding:0.6rem; border:1px solid #cbd5e1; border-radius:4px; font-size:0.875rem;">
          </div>
        </div>

        <div style="margin-top:1rem;">
          <label style="display:block; font-size:0.8125rem; font-weight:700; margin-bottom:0.35rem; color:#334155;">Project Specifications / Commercial Instructions</label>
          <textarea name="message" rows="3" placeholder="Specify brand preferences, required breaking capacities, delivery schedule, or tender deadlines..." style="width:100%; padding:0.6rem; border:1px solid #cbd5e1; border-radius:4px; font-size:0.875rem;"></textarea>
        </div>
      </div>

      <!-- Submit CTA -->
      <div style="border-top:1px solid #e2e8f0; padding-top:1.5rem; display:flex; justify-content:space-between; align-items:center;">
        <span style="font-size:0.8125rem; color:#64748b;">🔒 Protected by Dhruba Commercial Confidentiality.</span>
        <button type="submit" id="dp-rfq-submit-btn" style="background:#0f172a; color:#ffffff; font-size:1rem; font-weight:700; padding:0.85rem 2rem; border:none; border-radius:6px; cursor:pointer;">
          Submit Request For Quote
        </button>
      </div>
    </form>

    <!-- Success Modal Box (Hidden initially) -->
    <div id="dp-rfq-success-modal" style="display:none; background:#ffffff; border:2px solid #16a34a; border-radius:8px; padding:2.5rem; text-align:center; margin-top:2rem;">
      <div style="font-size:3rem; margin-bottom:0.5rem;">✅</div>
      <h2 style="font-size:1.5rem; font-weight:900; color:#0f172a; margin:0 0 0.5rem 0;">Quotation Request Submitted Successfully!</h2>
      <p style="font-size:1rem; color:#334155;">
        Your reference ID is: <strong id="dp-confirmed-rfq-number" style="font-family:monospace; background:#f1f5f9; padding:0.2rem 0.5rem; border-radius:4px; font-size:1.15rem; color:#0f172a;"></strong>
      </p>
      <p style="font-size:0.875rem; color:#64748b; max-width:550px; margin:1rem auto 1.5rem auto;">
        Our Barishal engineering desk is preparing your formal quote in BDT with genuine factory lead times and technical compliance sheets.
      </p>
      <a href="<?php echo esc_url(home_url('/shop/')); ?>" style="display:inline-block; background:#0f172a; color:#ffffff; padding:0.65rem 1.5rem; border-radius:4px; text-decoration:none; font-weight:700; font-size:0.875rem;">
        Return to Catalog
      </a>
    </div>

  </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
  const basketKey = 'dp_rfq_basket_v1';
  let basket = [];
  try {
    basket = JSON.parse(localStorage.getItem(basketKey)) || [];
  } catch (e) { basket = []; }

  const tbody = document.getElementById('dp-rfq-items-tbody');
  const emptyNotice = document.getElementById('dp-rfq-empty-notice');

  function renderTable() {
    tbody.innerHTML = '';
    if (basket.length === 0) {
      emptyNotice.style.display = 'block';
      return;
    }
    emptyNotice.style.display = 'none';

    basket.forEach((item, index) => {
      const tr = document.createElement('tr');
      tr.style.borderBottom = '1px solid #f1f5f9';
      tr.innerHTML = `
        <td style="padding:0.75rem;"><strong>${item.name}</strong></td>
        <td style="padding:0.75rem;">
          <input type="number" min="1" value="${item.quantity || 1}" style="width:70px; padding:0.35rem; border:1px solid #cbd5e1; border-radius:4px;" onchange="updateQty(${index}, this.value)">
        </td>
        <td style="padding:0.75rem;">
          <input type="text" placeholder="e.g. 230V coil, specific auxiliary contact..." value="${item.note || ''}" style="width:100%; padding:0.35rem; border:1px solid #cbd5e1; border-radius:4px;" onchange="updateNote(${index}, this.value)">
        </td>
        <td style="padding:0.75rem; text-align:center;">
          <button type="button" onclick="removeItem(${index})" style="background:none; border:none; color:#ef4444; font-weight:bold; cursor:pointer;">✕</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  window.updateQty = function(idx, val) {
    basket[idx].quantity = Math.max(1, parseInt(val, 10) || 1);
    localStorage.setItem(basketKey, JSON.stringify(basket));
  };

  window.updateNote = function(idx, val) {
    basket[idx].note = val;
    localStorage.setItem(basketKey, JSON.stringify(basket));
  };

  window.removeItem = function(idx) {
    basket.splice(idx, 1);
    localStorage.setItem(basketKey, JSON.stringify(basket));
    renderTable();
  };

  renderTable();

  // Form Submit
  const form = document.getElementById('dp-rfq-form');
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    const btn = document.getElementById('dp-rfq-submit-btn');
    btn.disabled = true;
    btn.textContent = 'Submitting Quote Request...';

    const formData = new FormData(form);
    const payload = {
      company: formData.get('company'),
      contact: formData.get('contact'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      whatsapp: formData.get('whatsapp'),
      location: formData.get('location'),
      message: formData.get('message'),
      items: basket
    };

    try {
      const restEndpoint = (window.dhrubaCatalog && window.dhrubaCatalog.restUrl) ? window.dhrubaCatalog.restUrl + 'rfq' : '/wp-json/dhruba/v1/rfq';
      const res = await fetch(restEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-WP-Nonce': (window.dhrubaCatalog && window.dhrubaCatalog.nonce) || ''
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.removeItem(basketKey);
        form.style.display = 'none';
        const successModal = document.getElementById('dp-rfq-success-modal');
        document.getElementById('dp-confirmed-rfq-number').textContent = data.rfq_number;
        successModal.style.display = 'block';
      } else {
        alert(data.message || 'Error creating RFQ. Please check your contact information.');
        btn.disabled = false;
        btn.textContent = 'Submit Request For Quote';
      }
    } catch (err) {
      alert('Network error submitting quote. Please call our hotline or WhatsApp directly.');
      btn.disabled = false;
      btn.textContent = 'Submit Request For Quote';
    }
  });
});
</script>

<?php
get_footer();
