import React, { useState } from 'react';
import { 
  X, 
  DownloadCloud, 
  Database, 
  Layers, 
  Terminal, 
  ShieldCheck, 
  FileCode, 
  CheckCircle2, 
  Search, 
  Cpu 
} from 'lucide-react';

interface SystemArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SystemArchitectureModal: React.FC<SystemArchitectureModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'plugin' | 'theme' | 'etl' | 'db' | 'search'>('overview');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white border border-slate-300 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        id="system-architecture-modal"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 rounded-md text-amber-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold leading-tight">
                Dhruba Power — Production Platform Architecture
              </h2>
              <p className="text-xs text-slate-400">
                Full-Scale WordPress + WooCommerce Industrial Stack (20k - 50k+ Products)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-100 border-b border-slate-200 px-6 flex gap-2 text-xs font-bold text-slate-600">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2.5 px-3 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'overview'
                ? 'border-slate-900 text-slate-900 bg-white'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Architecture Overview & ZIPs
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`py-2.5 px-3 border-b-2 cursor-pointer transition-colors flex items-center gap-1.5 ${
              activeTab === 'search'
                ? 'border-slate-900 text-slate-900 bg-white'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Search className="w-3.5 h-3.5 text-amber-600" />
            Search Architecture
          </button>
          <button
            onClick={() => setActiveTab('plugin')}
            className={`py-2.5 px-3 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'plugin'
                ? 'border-slate-900 text-slate-900 bg-white'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Plugin: dhruba-catalog-core
          </button>
          <button
            onClick={() => setActiveTab('theme')}
            className={`py-2.5 px-3 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'theme'
                ? 'border-slate-900 text-slate-900 bg-white'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Theme: dhruba-industrial
          </button>
          <button
            onClick={() => setActiveTab('db')}
            className={`py-2.5 px-3 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'db'
                ? 'border-slate-900 text-slate-900 bg-white'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Custom DB Schema
          </button>
          <button
            onClick={() => setActiveTab('etl')}
            className={`py-2.5 px-3 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'etl'
                ? 'border-slate-900 text-slate-900 bg-white'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Python ETL Importer
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* ZIP Download Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-slate-300 rounded-lg p-4 bg-slate-50 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black uppercase text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                        WordPress Plugin
                      </span>
                      <span className="font-mono text-slate-500 text-[11px]">26.9 KB</span>
                    </div>
                    <h3 className="font-bold text-sm text-slate-900 mb-1">dhruba-catalog-core.zip</h3>
                    <p className="text-slate-600 text-[11px] leading-relaxed mb-3">
                      Complete custom engine with custom tables (`wp_dp_specs`, `wp_dp_documents`, `wp_dp_rfqs`), high-speed search adapters (Meilisearch + indexed DB), and REST API.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[11px] text-slate-500 bg-white p-2 rounded border border-slate-200">
                    <DownloadCloud className="w-4 h-4 text-emerald-600" />
                    <span>Location: /wordpress/dist/dhruba-catalog-core.zip</span>
                  </div>
                </div>

                <div className="border border-slate-300 rounded-lg p-4 bg-slate-50 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black uppercase text-sky-700 bg-sky-100 px-2 py-0.5 rounded">
                        WordPress Theme
                      </span>
                      <span className="font-mono text-slate-500 text-[11px]">22.3 KB</span>
                    </div>
                    <h3 className="font-bold text-sm text-slate-900 mb-1">dhruba-industrial.zip</h3>
                    <p className="text-slate-600 text-[11px] leading-relaxed mb-3">
                      Lightweight industrial theme with category-aware faceted archives, single-product engineering specs table, series model pickers, and mobile RFQ sticky bars. Zero page-builder bloat.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[11px] text-slate-500 bg-white p-2 rounded border border-slate-200">
                    <DownloadCloud className="w-4 h-4 text-emerald-600" />
                    <span>Location: /wordpress/dist/dhruba-industrial.zip</span>
                  </div>
                </div>
              </div>

              {/* Architectural Highlights */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs">
                  Production Pillars (50,000+ Industrial Products)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 border border-slate-200 rounded-lg bg-white">
                    <div className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                      <Search className="w-4 h-4 text-sky-600" /> Meilisearch & Millisecond Index
                    </div>
                    <p className="text-slate-500 leading-normal">
                      Full-text search ranking prioritizing exact MPN &gt; SKU &gt; Brand &gt; Specs with instant faceting.
                    </p>
                  </div>

                  <div className="p-3 border border-slate-200 rounded-lg bg-white">
                    <div className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                      <Database className="w-4 h-4 text-emerald-600" /> Scalable Custom DB
                    </div>
                    <p className="text-slate-500 leading-normal">
                      Dedicated indexed tables for specifications and documents bypassing postmeta bottle-necks at 50,000 items.
                    </p>
                  </div>

                  <div className="p-3 border border-slate-200 rounded-lg bg-white">
                    <div className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-amber-600" /> Industrial RFQ Flow
                    </div>
                    <p className="text-slate-500 leading-normal">
                      Prices hidden by default; RFQ basket with line notes, BOQ file attachments, and WhatsApp handoff.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'search' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">Industrial Search Architecture (Meilisearch & OpenSearch Adapter)</h4>
                <p className="text-slate-600 leading-relaxed text-xs">
                  Engineered so Dhruba Power can swap search engines between <strong>Meilisearch</strong>, <strong>OpenSearch / Elasticsearch</strong>, or <strong>Indexed MySQL</strong> without rewriting a single line of frontend code or WordPress template logic.
                </p>
              </div>

              {/* Engine Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 border border-slate-300 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900">Meilisearch Driver</span>
                    <span className="text-[10px] font-black uppercase text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">Active Default</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed mb-2">
                    Ultra-fast C++ daemon. Millisecond typo-tolerance, pre-computed facets, and exact MPN boosting.
                  </p>
                  <code className="text-[10px] bg-white p-1 rounded border border-slate-200 block text-slate-700">
                    Search/MeilisearchAdapter.php
                  </code>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-300 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900">OpenSearch / ES</span>
                    <span className="text-[10px] font-black uppercase text-sky-700 bg-sky-100 px-1.5 py-0.5 rounded">Drop-in Ready</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed mb-2">
                    Elasticsearch query DSL with field weights (<code className="text-[10px]">mpn^10</code>, <code className="text-[10px]">sku^7</code>), nested term aggregations.
                  </p>
                  <code className="text-[10px] bg-white p-1 rounded border border-slate-200 block text-slate-700">
                    Search/OpenSearchAdapter.php
                  </code>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-300 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900">Database Fallback</span>
                    <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">Zero-Config</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed mb-2">
                    Native indexed SQL queries against <code className="text-[10px]">wp_posts</code>, normalized MPN meta, and <code className="text-[10px]">wp_dp_specs</code>.
                  </p>
                  <code className="text-[10px] bg-white p-1 rounded border border-slate-200 block text-slate-700">
                    Search/FallbackDatabaseSearch.php
                  </code>
                </div>
              </div>

              {/* Ranking & Zero Result Features */}
              <div className="border border-slate-200 rounded-lg p-3 bg-slate-50 space-y-2">
                <h5 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Industrial Search Features</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                  <div className="bg-white p-2.5 rounded border border-slate-200">
                    <strong className="text-slate-900 block mb-0.5">Exact MPN & SKU Boosting (Weight: 10x)</strong>
                    <span>Exact alphanumeric part numbers (e.g. "SH201-C20", "XT2N 160") bypass typo tolerance to guarantee 100% precision for electrical engineers.</span>
                  </div>
                  <div className="bg-white p-2.5 rounded border border-slate-200">
                    <strong className="text-slate-900 block mb-0.5">Faceted & Numeric Range Filtering</strong>
                    <span>Filter by brand, series, poles (1P, 2P, 3P, 4P), breaking capacity (kA), and continuous numeric current ranges (e.g. 16A - 63A).</span>
                  </div>
                  <div className="bg-white p-2.5 rounded border border-slate-200">
                    <strong className="text-slate-900 block mb-0.5">Zero-Result Demand Tracking (wp_dp_search_logs)</strong>
                    <span>Automatically records customer queries that returned 0 items, giving procurement teams real-time market intelligence on what SKUs to stock.</span>
                  </div>
                  <div className="bg-white p-2.5 rounded border border-slate-200">
                    <strong className="text-slate-900 block mb-0.5">Unified Search REST API</strong>
                    <span>Frontend queries <code className="bg-slate-100 px-1 py-0.5 rounded">/wp-json/dhruba/v1/search?q=ABB&filters[brand]=abb</code> with normalized response contracts.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'plugin' && (
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900">Plugin Structure: dhruba-catalog-core</h4>
              <pre className="bg-slate-900 text-slate-200 p-4 rounded-lg font-mono text-[11px] overflow-x-auto leading-relaxed">
{`wordpress/plugins/dhruba-catalog-core/
├── dhruba-catalog-core.php          (PSR-4 autoloader & container singleton)
└── src/
    ├── Database/
    │   ├── Schema.php               (Definitions for wp_dp_specs, wp_dp_documents, etc.)
    │   └── Migrator.php             (dbDelta migration engine with version control)
    ├── Taxonomy/
    │   └── TaxonomyRegistrar.php    (Registers dp_brand, dp_series, dp_application)
    ├── Product/
    │   └── ProductMetaManager.php   (MPN normalization, SKU generator, quote-only mode)
    ├── Specs/
    │   └── SpecificationEngine.php  (Numeric parsing, units, EEE/CCTV/Solar dictionaries)
    ├── Documents/
    │   └── DocumentManager.php      (Datasheet SHA-256 deduplication & downloads)
    ├── Relations/
    │   └── RelationshipManager.php  (Same-series models, accessories, replacements)
    ├── RFQ/
    │   └── RfqService.php           (State machine, reference numbers, WhatsApp links)
    ├── Search/
    │   ├── SearchInterface.php      (Engine contract)
    │   ├── SearchManager.php        (Strategy context; routes between Meili/OpenSearch/DB)
    │   ├── SearchDocument.php       (Canonical document builder with technical specs & MPN)
    │   ├── MeilisearchAdapter.php   (High-speed typo-tolerant faceted search & MPN boosting)
    │   ├── OpenSearchAdapter.php    (OpenSearch / Elasticsearch adapter with multi-match DSL)
    │   ├── FallbackDatabaseSearch.php (Native indexed SQL search fallback)
    │   └── SearchAnalytics.php      (Tracks zero-result customer searches for demand sensing)
    ├── API/
    │   └── RestController.php       (/wp-json/dhruba/v1/search, rfq, importer/ingest)
    └── Admin/
        └── AdminDashboard.php       (Catalog health, MPN completeness, RFQ management)`}
              </pre>
            </div>
          )}

          {activeTab === 'theme' && (
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900">Theme Structure: dhruba-industrial</h4>
              <pre className="bg-slate-900 text-slate-200 p-4 rounded-lg font-mono text-[11px] overflow-x-auto leading-relaxed">
{`wordpress/themes/dhruba-industrial/
├── style.css                        (Clean industrial styling & design system)
├── functions.php                    (Asset enqueues, rewrite rules, WooCommerce support)
├── header.php                       (Hotline, search bar, RFQ basket trigger)
├── footer.php                       (Authorized brand directory, Barishal contact)
├── taxonomy-dp_brand.php            (Dedicated manufacturer landing page)
├── taxonomy-dp_series.php            (Series family catalogue view)
├── page-rfq.php                     (Dedicated RFQ portal with BOQ attachment)
├── page-compare.php                 (Side-by-side technical matrix)
├── assets/js/catalog.js             (Lightweight vanilla JS for RFQ & compare)
└── woocommerce/
    ├── archive-product.php          (Category-aware faceted archive; no page builders)
    └── single-product.php           (Engineering specs table, datasheets, same-series switcher)`}
              </pre>
            </div>
          )}

          {activeTab === 'db' && (
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900">Custom High-Performance SQL Tables</h4>
              <p className="text-slate-600">
                To guarantee millisecond performance at 50,000+ items without blowing up <code className="bg-slate-100 px-1 py-0.5 rounded">wp_postmeta</code>, we use indexed relational tables:
              </p>
              <div className="space-y-2">
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded font-mono">
                  <strong className="text-sky-800">wp_dp_specs:</strong> id, product_id, spec_key, label, value_text, value_numeric, unit, normalized_value, source_url, source_type, sort_order
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded font-mono">
                  <strong className="text-emerald-800">wp_dp_documents:</strong> id, product_id, document_type, title, source_url, local_path, mime_type, file_size, sha256, is_current
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded font-mono">
                  <strong className="text-amber-800">wp_dp_product_relations:</strong> id, source_product_id, target_product_id, relation_type, confidence, source, sort_order
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded font-mono">
                  <strong className="text-purple-800">wp_dp_rfqs & wp_dp_rfq_items:</strong> rfq_number, user_id, company, contact, email, phone, whatsapp, message, status (NEW &rarr; QUOTED &rarr; CONVERTED)
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded font-mono">
                  <strong className="text-rose-800">wp_dp_search_logs:</strong> id, query, normalized_query, results_count, filters_json, user_ip, user_agent, created_at (Zero-Result demand tracking)
                </div>
              </div>
            </div>
          )}

          {activeTab === 'etl' && (
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900">External Python ETL Pipeline</h4>
              <p className="text-slate-600">
                Industrial scraper and data normalization pipeline located in <code className="bg-slate-100 px-1 py-0.5 rounded">/importer/</code>:
              </p>
              <pre className="bg-slate-900 text-slate-200 p-4 rounded-lg font-mono text-[11px] overflow-x-auto leading-relaxed">
{`# Run pipeline on sample fixtures with normalization & schema validation:
cd importer
python3 crawler.py --fixtures fixtures/products_sample.json

# Ingest directly into WordPress REST API:
python3 crawler.py --fixtures fixtures/products_sample.json --sync`}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Packages verified and ready for deployment</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-bold cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
