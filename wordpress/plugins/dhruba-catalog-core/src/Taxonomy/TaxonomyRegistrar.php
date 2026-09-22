<?php
/**
 * Taxonomy Registration for Dhruba Catalog
 *
 * Implements strict separation between Product Categories, Brands, Series, Applications, and Certifications.
 *
 * @package DhrubaCatalog\Taxonomy
 */

declare(strict_types=1);

namespace DhrubaCatalog\Taxonomy;

final class TaxonomyRegistrar
{
    public const TAX_BRAND = 'dp_brand';
    public const TAX_SERIES = 'dp_series';
    public const TAX_APPLICATION = 'dp_application';
    public const TAX_CERTIFICATION = 'dp_certification';

    public function register(): void
    {
        $this->register_brand_taxonomy();
        $this->register_series_taxonomy();
        $this->register_application_taxonomy();
        $this->register_certification_taxonomy();
    }

    /**
     * Dedicated Brand Taxonomy (e.g. ABB, Siemens, Schneider Electric, Hikvision, Growatt)
     */
    private function register_brand_taxonomy(): void
    {
        $labels = [
            'name'                       => _x('Brands', 'taxonomy general name', 'dhruba-catalog'),
            'singular_name'              => _x('Brand', 'taxonomy singular name', 'dhruba-catalog'),
            'search_items'               => __('Search Brands', 'dhruba-catalog'),
            'popular_items'              => __('Popular Brands', 'dhruba-catalog'),
            'all_items'                  => __('All Brands', 'dhruba-catalog'),
            'edit_item'                  => __('Edit Brand', 'dhruba-catalog'),
            'update_item'                => __('Update Brand', 'dhruba-catalog'),
            'add_new_item'               => __('Add New Brand', 'dhruba-catalog'),
            'new_item_name'              => __('New Brand Name', 'dhruba-catalog'),
            'separate_items_with_commas' => __('Separate brands with commas', 'dhruba-catalog'),
            'add_or_remove_items'        => __('Add or remove brands', 'dhruba-catalog'),
            'choose_from_most_used'      => __('Choose from most used brands', 'dhruba-catalog'),
            'menu_name'                  => __('Brands', 'dhruba-catalog'),
        ];

        register_taxonomy(self::TAX_BRAND, ['product'], [
            'hierarchical'          => false,
            'labels'                => $labels,
            'show_ui'               => true,
            'show_admin_column'     => true,
            'query_var'             => true,
            'rewrite'               => ['slug' => 'brands', 'with_front' => false],
            'show_in_rest'          => true,
            'rest_base'             => 'brands',
        ]);
    }

    /**
     * Dedicated Series Taxonomy (e.g. ABB SH200, Schneider Acti9, Siemens 3VA1)
     */
    private function register_series_taxonomy(): void
    {
        $labels = [
            'name'          => _x('Product Series', 'taxonomy general name', 'dhruba-catalog'),
            'singular_name' => _x('Series', 'taxonomy singular name', 'dhruba-catalog'),
            'search_items'  => __('Search Series', 'dhruba-catalog'),
            'all_items'     => __('All Series', 'dhruba-catalog'),
            'edit_item'     => __('Edit Series', 'dhruba-catalog'),
            'update_item'   => __('Update Series', 'dhruba-catalog'),
            'add_new_item'  => __('Add New Series', 'dhruba-catalog'),
            'menu_name'     => __('Series', 'dhruba-catalog'),
        ];

        register_taxonomy(self::TAX_SERIES, ['product'], [
            'hierarchical'      => false,
            'labels'            => $labels,
            'show_ui'           => true,
            'show_admin_column' => true,
            'query_var'         => true,
            'rewrite'           => ['slug' => 'series', 'with_front' => false],
            'show_in_rest'      => true,
            'rest_base'         => 'series',
        ]);
    }

    /**
     * Application Taxonomy (Industrial, Commercial, Substation, Solar Plant, Building Management)
     */
    private function register_application_taxonomy(): void
    {
        $labels = [
            'name'          => _x('Applications', 'taxonomy general name', 'dhruba-catalog'),
            'singular_name' => _x('Application', 'taxonomy singular name', 'dhruba-catalog'),
            'search_items'  => __('Search Applications', 'dhruba-catalog'),
            'all_items'     => __('All Applications', 'dhruba-catalog'),
            'menu_name'     => __('Applications', 'dhruba-catalog'),
        ];

        register_taxonomy(self::TAX_APPLICATION, ['product'], [
            'hierarchical'      => true,
            'labels'            => $labels,
            'show_ui'           => true,
            'show_admin_column' => false,
            'query_var'         => true,
            'rewrite'           => ['slug' => 'applications', 'with_front' => false],
            'show_in_rest'      => true,
            'rest_base'         => 'applications',
        ]);
    }

    /**
     * Certification Taxonomy (IEC 60898-1, UL 489, CE, RoHS, TUV)
     */
    private function register_certification_taxonomy(): void
    {
        $labels = [
            'name'          => _x('Certifications', 'taxonomy general name', 'dhruba-catalog'),
            'singular_name' => _x('Certification', 'taxonomy singular name', 'dhruba-catalog'),
            'all_items'     => __('All Certifications', 'dhruba-catalog'),
            'menu_name'     => __('Certifications', 'dhruba-catalog'),
        ];

        register_taxonomy(self::TAX_CERTIFICATION, ['product'], [
            'hierarchical'      => false,
            'labels'            => $labels,
            'show_ui'           => true,
            'show_admin_column' => false,
            'query_var'         => true,
            'rewrite'           => ['slug' => 'certifications', 'with_front' => false],
            'show_in_rest'      => true,
            'rest_base'         => 'certifications',
        ]);
    }
}
