"""
Dhruba Industrial Product Validator
Enforces structural schemas and data confidence scoring before WordPress ingestion.
"""

from typing import Dict, Any, List, Tuple

class ProductValidator:
    REQUIRED_FIELDS = ['brand', 'mpn', 'name']

    @classmethod
    def validate_and_score(cls, product: Dict[str, Any]) -> Tuple[bool, int, List[str]]:
        errors = []
        score = 0

        # Check required
        for field in cls.REQUIRED_FIELDS:
            if not product.get(field):
                errors.append(f"Missing required field: {field}")

        if errors:
            return False, 0, errors

        # Score calculations:
        # Base brand + mpn + name = 40 pts
        score += 40

        # Specs present: up to 30 pts
        specs = product.get('specifications', [])
        if len(specs) >= 5:
            score += 30
        elif len(specs) >= 2:
            score += 15
        elif len(specs) > 0:
            score += 5
        else:
            errors.append("Warning: Product has zero technical specifications")

        # Official URL: 15 pts
        if product.get('official_url'):
            score += 15

        # Documents (Datasheet): 15 pts
        docs = product.get('documents', [])
        if docs:
            score += 15

        is_valid = len(errors) == 0 or (len(errors) == 1 and errors[0].startswith("Warning"))
        return is_valid, min(100, score), errors
