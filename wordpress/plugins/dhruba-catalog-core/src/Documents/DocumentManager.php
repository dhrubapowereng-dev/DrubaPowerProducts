<?php
/**
 * Technical Document & Datasheet Manager
 *
 * Handles SHA-256 deduplicated documents, revision tracking,
 * and secure delivery of industrial datasheets, manuals, CAD files, and certificates.
 *
 * @package DhrubaCatalog\Documents
 */

declare(strict_types=1);

namespace DhrubaCatalog\Documents;

use DhrubaCatalog\Database\Schema;

final class DocumentManager
{
    public const TYPE_DATASHEET    = 'datasheet';
    public const TYPE_MANUAL       = 'manual';
    public const TYPE_CATALOGUE    = 'catalogue';
    public const TYPE_CERTIFICATE  = 'certificate';
    public const TYPE_CAD          = 'cad';
    public const TYPE_DRAWING      = 'drawing';
    public const TYPE_INSTALLATION = 'installation_guide';
    public const TYPE_BROCHURE     = 'brochure';

    public function get_product_documents(int $product_id, bool $only_current = true): array
    {
        global $wpdb;
        $table = Schema::get_table_name(Schema::TABLE_DOCUMENTS);

        $sql = "SELECT * FROM {$table} WHERE product_id = %d";
        if ($only_current) {
            $sql .= " AND is_current = 1";
        }
        $sql .= " ORDER BY CASE document_type 
                    WHEN 'datasheet' THEN 1 
                    WHEN 'manual' THEN 2 
                    WHEN 'certificate' THEN 3 
                    ELSE 4 END, title ASC";

        $results = $wpdb->get_results($wpdb->prepare($sql, $product_id), ARRAY_A);
        return $results ?: [];
    }

    /**
     * Add or update document record with SHA-256 deduplication
     */
    public function register_document(
        int $product_id,
        string $document_type,
        string $title,
        string $source_url,
        string $local_path = '',
        string $mime_type = 'application/pdf',
        int $file_size = 0,
        string $sha256 = '',
        string $manufacturer_revision = '',
        string $language = 'en'
    ): int {
        global $wpdb;
        $table = Schema::get_table_name(Schema::TABLE_DOCUMENTS);

        // Check if exact file hash or URL already registered for this product
        $existing = null;
        if (!empty($sha256)) {
            $existing = $wpdb->get_var(
                $wpdb->prepare(
                    "SELECT id FROM {$table} WHERE product_id = %d AND sha256 = %s",
                    $product_id,
                    $sha256
                )
            );
        }

        $data = [
            'product_id'            => $product_id,
            'document_type'         => sanitize_key($document_type),
            'title'                 => sanitize_text_field($title),
            'source_url'            => esc_url_raw($source_url),
            'local_path'            => sanitize_text_field($local_path),
            'mime_type'             => sanitize_mime_type($mime_type),
            'file_size'             => $file_size,
            'sha256'                => sanitize_text_field($sha256),
            'manufacturer_revision' => sanitize_text_field($manufacturer_revision),
            'language'              => sanitize_text_field($language),
            'last_checked_at'       => current_time('mysql'),
            'is_current'            => 1,
        ];

        if ($existing) {
            $wpdb->update($table, $data, ['id' => $existing]);
            return (int)$existing;
        }

        $wpdb->insert($table, $data);
        return (int)$wpdb->insert_id;
    }
}
