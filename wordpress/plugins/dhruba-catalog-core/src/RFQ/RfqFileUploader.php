<?php
/**
 * Secure File Uploader for Industrial RFQ Attachments (BOQ, BOM, SLD, Drawings)
 *
 * Implements strict mime-type verification, extension validation, unique SHA256 checksumming,
 * secure non-executable storage outside public directory index, and file size quotas.
 *
 * @package DhrubaCatalog\RFQ
 */

declare(strict_types=1);

namespace DhrubaCatalog\RFQ;

final class RfqFileUploader
{
    public const MAX_FILE_SIZE_BYTES = 26214400; // 25 MB

    private const ALLOWED_MIME_TYPES = [
        'application/pdf'                                                               => 'pdf',
        'application/vnd.ms-excel'                                                      => 'xls',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'             => 'xlsx',
        'application/msword'                                                            => 'doc',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'       => 'docx',
        'text/csv'                                                                      => 'csv',
        'text/plain'                                                                    => 'txt',
        'image/jpeg'                                                                    => 'jpg',
        'image/png'                                                                     => 'png',
        'image/webp'                                                                    => 'webp',
        'application/acad'                                                              => 'dwg',
        'image/vnd.dwg'                                                                 => 'dwg',
    ];

    /**
     * Process an uploaded file array from $_FILES
     */
    public static function process_upload(array $file): array
    {
        if (empty($file['tmp_name']) || !is_uploaded_file($file['tmp_name'])) {
            return [
                'success' => false,
                'message' => __('No valid uploaded file found.', 'dhruba-catalog'),
            ];
        }

        if (($file['error'] ?? UPLOAD_ERR_OK) !== UPLOAD_ERR_OK) {
            return [
                'success' => false,
                'message' => sprintf(__('File upload error code: %d', 'dhruba-catalog'), (int)$file['error']),
            ];
        }

        if ((int)$file['size'] > self::MAX_FILE_SIZE_BYTES) {
            return [
                'success' => false,
                'message' => __('File size exceeds 25MB limit.', 'dhruba-catalog'),
            ];
        }

        // Verify Real MIME Type via finfo
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mime_type = finfo_file($finfo, $file['tmp_name']);
        finfo_close($finfo);

        if (!array_key_exists($mime_type, self::ALLOWED_MIME_TYPES)) {
            return [
                'success' => false,
                'message' => sprintf(__('Unauthorized file format (%s). Only PDF, Excel (XLS/XLSX/CSV), Word, CAD (DWG) or Images allowed.', 'dhruba-catalog'), esc_html($mime_type)),
            ];
        }

        // Target storage directory: wp-content/uploads/dhruba-rfqs/{YEAR}/{MONTH}/
        $upload_dir = wp_upload_dir();
        $target_dir = $upload_dir['basedir'] . '/dhruba-rfqs/' . gmdate('Y/m');

        if (!wp_mkdir_p($target_dir)) {
            return [
                'success' => false,
                'message' => __('Unable to create secure upload directory.', 'dhruba-catalog'),
            ];
        }

        // Place .htaccess in dhruba-rfqs root to prevent PHP execution
        $htaccess_path = $upload_dir['basedir'] . '/dhruba-rfqs/.htaccess';
        if (!file_exists($htaccess_path)) {
            @file_put_contents($htaccess_path, "Options -ExecCGI -Indexes\n<FilesMatch \"\.(php|php5|php7|phtml|phar)$\">\nOrder Deny,Allow\nDeny from all\n</FilesMatch>\n");
        }

        $sha256        = hash_file('sha256', $file['tmp_name']);
        $original_name = sanitize_file_name($file['name']);
        $extension     = self::ALLOWED_MIME_TYPES[$mime_type];
        $stored_name   = 'boq_' . gmdate('YmdHis') . '_' . substr($sha256, 0, 12) . '.' . $extension;
        $destination   = $target_dir . '/' . $stored_name;

        if (!move_uploaded_file($file['tmp_name'], $destination)) {
            return [
                'success' => false,
                'message' => __('Failed to persist uploaded document on server.', 'dhruba-catalog'),
            ];
        }

        return [
            'success'   => true,
            'name'      => $original_name,
            'path'      => $destination,
            'mime'      => $mime_type,
            'size'      => (int)$file['size'],
            'sha256'    => $sha256,
            'extension' => $extension,
        ];
    }
}
