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
        $base_rfq_dir = $upload_dir['basedir'] . '/dhruba-rfqs';
        $target_dir   = $base_rfq_dir . '/' . gmdate('Y/m');

        if (!wp_mkdir_p($target_dir)) {
            return [
                'success' => false,
                'message' => __('Unable to create secure upload directory.', 'dhruba-catalog'),
            ];
        }

        // Place comprehensive .htaccess (Apache 2.4 + 2.2) in dhruba-rfqs root to prevent execution of any script
        $htaccess_path = $base_rfq_dir . '/.htaccess';
        if (!file_exists($htaccess_path)) {
            $htaccess_content = "# Dhruba Industrial Secure Attachments Storage\n"
                . "Options -ExecCGI -Indexes\n"
                . "<FilesMatch \"\.(php|php3|php4|php5|php7|php8|phtml|phar|shtml|cgi|pl|py|sh|bash|env|htaccess)$\">\n"
                . "  <IfModule mod_authz_core.c>\n"
                . "    Require all denied\n"
                . "  </IfModule>\n"
                . "  <IfModule !mod_authz_core.c>\n"
                . "    Order Deny,Allow\n"
                . "    Deny from all\n"
                . "  </IfModule>\n"
                . "</FilesMatch>\n";
            @file_put_contents($htaccess_path, $htaccess_content);
        }

        // Place index.php in root and subdirectories to prevent directory listing on Nginx
        if (!file_exists($base_rfq_dir . '/index.php')) {
            @file_put_contents($base_rfq_dir . '/index.php', "<?php // Silence is golden.\n");
        }
        if (!file_exists($target_dir . '/index.php')) {
            @file_put_contents($target_dir . '/index.php', "<?php // Silence is golden.\n");
        }

        // Check for double extension attacks (e.g. quote.php.pdf or invoice.exe.xlsx)
        $raw_name = (string)($file['name'] ?? 'upload');
        if (preg_match('/\.(php|phtml|phar|shtml|cgi|pl|py|sh|exe|bin|bat)(\.|$)/i', $raw_name)) {
            return [
                'success' => false,
                'message' => __('Potential malicious file extension pattern detected.', 'dhruba-catalog'),
            ];
        }

        $sha256        = hash_file('sha256', $file['tmp_name']);
        $original_name = sanitize_file_name($raw_name);
        $extension     = self::ALLOWED_MIME_TYPES[$mime_type];
        $stored_name   = 'boq_' . gmdate('YmdHis') . '_' . substr($sha256, 0, 12) . '.' . $extension;
        $destination   = $target_dir . '/' . $stored_name;

        if (!move_uploaded_file($file['tmp_name'], $destination)) {
            return [
                'success' => false,
                'message' => __('Failed to persist uploaded document on server.', 'dhruba-catalog'),
            ];
        }

        // Restrict uploaded file permissions
        @chmod($destination, 0644);

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
