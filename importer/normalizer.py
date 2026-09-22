"""
Dhruba Industrial Data Normalizer
Transforms raw scraped strings into clean, standardized industrial data structures.
"""

import re
from typing import Dict, Any, Optional, Tuple

class DataNormalizer:
    @staticmethod
    def normalize_mpn(raw_mpn: str) -> str:
        """Strip unnecessary whitespace and standardize capitalization."""
        if not raw_mpn:
            return ""
        return re.sub(r'[^a-zA-Z0-9_\-\./]', '', raw_mpn).strip().upper()

    @staticmethod
    def parse_numeric_with_unit(raw_value: str, default_unit: str = "") -> Tuple[Optional[float], str, str]:
        """
        Extract numeric magnitude and electrical unit.
        e.g. '20 A' -> (20.0, 'A', '20 A')
        e.g. '10kA' -> (10.0, 'kA', '10 kA')
        e.g. '3P+N' -> (None, '', '3P+N')
        """
        raw_clean = raw_value.strip()
        match = re.match(r'^([0-9]+(?:\.[0-9]+)?)\s*([a-zA-Z%]+)?$', raw_clean)
        if match:
            num = float(match.group(1))
            unit = match.group(2) or default_unit
            normalized = f"{num} {unit}".strip()
            return num, unit, normalized
        return None, default_unit, raw_clean

    @staticmethod
    def detect_category(title: str, specs: Dict[str, Any]) -> str:
        """Categorize into EEE, CCTV, or Solar."""
        combined = (title + " " + " ".join(str(v) for v in specs.values())).lower()
        if any(w in combined for w in ['inverter', 'solar', 'mppt', 'pv module', 'photovoltaic']):
            return 'solar'
        if any(w in combined for w in ['camera', 'nvr', 'dvr', 'cctv', 'surveillance', 'poe switch', 'lens']):
            return 'cctv'
        return 'eee'
