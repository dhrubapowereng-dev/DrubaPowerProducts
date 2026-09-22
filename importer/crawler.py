"""
Dhruba Industrial ETL Crawler & Pipeline
Curls industrial catalogs, normalizes technical attributes, and syncs to WordPress.
"""

import json
import logging
import argparse
import os
import sys

# Ensure current directory is in sys.path
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
if SCRIPT_DIR not in sys.path:
    sys.path.insert(0, SCRIPT_DIR)

from normalizer import DataNormalizer
from validator import ProductValidator
from wp_sync import WordPressSyncClient

logging.basicConfig(level=logging.INFO, format='%(asctime)s [%(levelname)s] %(message)s')

def resolve_path(p: str) -> str:
    if os.path.exists(p):
        return p
    alt = os.path.join(SCRIPT_DIR, p)
    if os.path.exists(alt):
        return alt
    return p

def run_pipeline(fixture_path: str, sync_to_wp: bool = False, config_path: str = "config.json"):
    config_file = resolve_path(config_path)
    fixtures_file = resolve_path(fixture_path)

    with open(config_file, 'r') as f:
        config = json.load(f)

    with open(fixtures_file, 'r') as f:
        raw_items = json.load(f)


    logging.info(f"Loaded {len(raw_items)} raw industrial items from {fixture_path}")
    
    sync_client = None
    if sync_to_wp:
        sync_client = WordPressSyncClient(config['wp_api_base'], config['importer_secret'])

    processed = []
    success_count = 0

    for item in raw_items:
        # 1. Normalize
        brand = item.get('brand', 'ABB').strip()
        raw_mpn = item.get('mpn') or item.get('model', '')
        mpn = DataNormalizer.normalize_mpn(raw_mpn)
        name = item.get('name') or f"{brand} {mpn}"

        specs = []
        for raw_spec in item.get('specs', []):
            num, unit, norm_val = DataNormalizer.parse_numeric_with_unit(
                str(raw_spec.get('value', '')),
                raw_spec.get('unit', '')
            )
            specs.append({
                'label': raw_spec.get('label', 'Spec'),
                'key': raw_spec.get('key', raw_spec.get('label', '').lower().replace(' ', '_')),
                'value': raw_spec.get('value', ''),
                'numeric': num,
                'unit': unit,
                'normalized': norm_val
            })

        category = DataNormalizer.detect_category(name, {s['key']: s['value'] for s in specs})

        product_payload = {
            'brand': brand,
            'mpn': mpn,
            'name': name,
            'category': category,
            'manufacturer_code': item.get('mfg_code', ''),
            'official_url': item.get('official_url', ''),
            'specifications': specs,
            'documents': item.get('documents', [])
        }

        # 2. Validate
        is_valid, confidence, errors = ProductValidator.validate_and_score(product_payload)
        product_payload['confidence_score'] = confidence

        if not is_valid:
            logging.warning(f"Skipping invalid product {mpn}: {errors}")
            continue

        processed.append(product_payload)

        # 3. Sync if requested
        if sync_client:
            res = sync_client.ingest_product(product_payload)
            if res.get('success'):
                success_count += 1

    logging.info(f"Pipeline complete: {len(processed)} validated products. {success_count} synced to WordPress.")

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Dhruba Power ETL Pipeline")
    parser.add_argument('--fixtures', default='fixtures/products_sample.json', help="Path to JSON test fixtures")
    parser.add_argument('--sync', action='store_true', help="Sync to live WordPress REST API")
    args = parser.parse_args()

    run_pipeline(args.fixtures, args.sync)
