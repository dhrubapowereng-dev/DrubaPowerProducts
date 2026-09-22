"""
WordPress REST Ingestion Client
Pushes validated product records into the WordPress dhruba-catalog-core engine.
"""

import json
import logging
import urllib.request
import urllib.error
from typing import Dict, Any

logging.basicConfig(level=logging.INFO, format='%(asctime)s [%(levelname)s] %(message)s')

class WordPressSyncClient:
    def __init__(self, api_base: str, secret_token: str):
        self.api_base = api_base.rstrip('/')
        self.secret_token = secret_token

    def ingest_product(self, product_payload: Dict[str, Any]) -> Dict[str, Any]:
        url = f"{self.api_base}/importer/ingest"
        data = json.dumps(product_payload).encode('utf-8')
        req = urllib.request.Request(
            url,
            data=data,
            headers={
                'Authorization': f'Bearer {self.secret_token}',
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'User-Agent': 'DhrubaETL/1.0'
            },
            method='POST'
        )
        try:
            with urllib.request.urlopen(req, timeout=15) as resp:
                resp_body = resp.read().decode('utf-8')
                return json.loads(resp_body)
        except urllib.error.HTTPError as e:
            err = e.read().decode('utf-8')
            logging.error(f"HTTP error ingesting {product_payload.get('mpn')}: {e.code} - {err}")
            return {'success': False, 'error': err}
        except Exception as e:
            logging.error(f"Network error ingesting product: {e}")
            return {'success': False, 'error': str(e)}

