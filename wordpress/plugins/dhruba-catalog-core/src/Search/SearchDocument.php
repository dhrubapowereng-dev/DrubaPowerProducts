<?php
/**
 * Search Document Representation for Industrial Engineering Products
 *
 * Implements canonical normalization, technical specification mapping,
 * brand/series indexing, and exact MPN & SKU generation.
 *
 * @package DhrubaCatalog\Search
 */

declare(strict_types=1);

namespace DhrubaCatalog\Search;

use DhrubaCatalog\Product\ProductMetaManager;
use DhrubaCatalog\Specs\SpecificationEngine;

final class SearchDocument
{
    private int $id;
    private string $title;
    private string $mpn;
    private string $normalized_mpn;
    private string $sku;
    private string $mfg_code;
    private string $brand;
    private string $series;
    private string $product_type;
    private array $categories;
    private bool $in_stock;
    private string $url;
    private string $image_url;
    private array $specs;
    private array $numeric_specs;
    private int $popularity_score;

    public function __construct(int $product_id)
    {
        $this->id = $product_id;
        $this->build();
    }

    private function build(): void
    {
        $product = wc_get_product($this->id);
        if (!$product) {
            $this->title = '';
            $this->mpn = '';
            $this->normalized_mpn = '';
            $this->sku = '';
            $this->mfg_code = '';
            $this->brand = '';
            $this->series = '';
            $this->product_type = '';
            $this->categories = [];
            $this->in_stock = false;
            $this->url = '';
            $this->image_url = '';
            $this->specs = [];
            $this->numeric_specs = [];
            $this->popularity_score = 0;
            return;
        }

        $this->title = $product->get_name();
        $this->mpn   = (string)(get_post_meta($this->id, ProductMetaManager::META_MPN, true) ?: '');
        $this->normalized_mpn = ProductMetaManager::normalize_mpn($this->mpn);
        $this->mfg_code = (string)(get_post_meta($this->id, ProductMetaManager::META_MANUFACTURER_CODE, true) ?: '');
        $this->sku   = (string)($product->get_sku() ?: ProductMetaManager::generate_sku('DP', $this->mpn));
        $this->in_stock = $product->is_in_stock();
        $this->url   = get_permalink($this->id) ?: '';
        $this->image_url = wp_get_attachment_image_url($product->get_image_id(), 'medium') ?: '';

        // Brands taxonomy
        $brands = wp_get_post_terms($this->id, 'dp_brand', ['fields' => 'names']);
        $this->brand = !empty($brands) && !is_wp_error($brands) ? (string)$brands[0] : '';

        // Series taxonomy
        $series_terms = wp_get_post_terms($this->id, 'dp_series', ['fields' => 'names']);
        $this->series = !empty($series_terms) && !is_wp_error($series_terms) ? (string)$series_terms[0] : '';

        // WooCommerce categories
        $cats = wp_get_post_terms($this->id, 'product_cat', ['fields' => 'names']);
        $this->categories = !empty($cats) && !is_wp_error($cats) ? $cats : [];
        $this->product_type = !empty($this->categories) ? (string)end($this->categories) : '';

        // Technical specifications from custom normalized DB table
        $specs_engine = new SpecificationEngine();
        $raw_specs    = $specs_engine->get_product_specs($this->id);

        $this->specs = [];
        $this->numeric_specs = [];

        foreach ($raw_specs as $s) {
            $key = $s['spec_key'];
            $this->specs[$key] = $s['normalized_value'] ?: $s['value_text'];

            if ($s['value_numeric'] !== null) {
                $this->numeric_specs[$key] = (float)$s['value_numeric'];
            }
        }

        // Popularity score for ranking/boosting (e.g. view count or RFQ frequency)
        $rfq_count = (int)get_post_meta($this->id, '_dp_rfq_submission_count', true);
        $this->popularity_score = $rfq_count;
    }

    public function to_array(): array
    {
        return [
            'id'                => $this->id,
            'title'             => $this->title,
            'mpn'               => $this->mpn,
            'normalized_mpn'    => $this->normalized_mpn,
            'sku'               => $this->sku,
            'mfg_code'          => $this->mfg_code,
            'brand'             => $this->brand,
            'series'            => $this->series,
            'product_type'      => $this->product_type,
            'categories'        => $this->categories,
            'in_stock'          => $this->in_stock,
            'url'               => $this->url,
            'image'             => $this->image_url,
            'specs'             => $this->specs,
            'numeric_specs'     => $this->numeric_specs,
            'rated_current'     => $this->numeric_specs['rated_current'] ?? null,
            'breaking_capacity' => $this->numeric_specs['breaking_capacity'] ?? null,
            'poles'             => $this->specs['poles'] ?? null,
            'rated_voltage'     => $this->specs['rated_voltage'] ?? null,
            'popularity'        => $this->popularity_score,
        ];
    }
}
