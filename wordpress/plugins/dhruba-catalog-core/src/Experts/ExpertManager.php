<?php
/**
 * Expert Management for Dhruba Power
 *
 * Provides custom post type, admin metaboxes, and REST API for certified engineering team
 * with individual WhatsApp consultation numbers.
 *
 * @package DhrubaCatalog\Experts
 */

declare(strict_types=1);

namespace DhrubaCatalog\Experts;

final class ExpertManager
{
    public const POST_TYPE = 'dp_expert';

    public function register(): void
    {
        add_action('init', [$this, 'register_post_type']);
        add_action('add_meta_boxes', [$this, 'add_expert_meta_boxes']);
        add_action('save_post_' . self::POST_TYPE, [$this, 'save_expert_meta'], 10, 2);
        add_shortcode('dhruba_experts', [$this, 'render_experts_shortcode']);
    }

    public function register_post_type(): void
    {
        $labels = [
            'name'               => _x('Engineering Experts', 'post type general name', 'dhruba-catalog'),
            'singular_name'      => _x('Expert', 'post type singular name', 'dhruba-catalog'),
            'menu_name'          => _x('Experts', 'admin menu', 'dhruba-catalog'),
            'name_admin_bar'     => _x('Expert', 'add new on admin bar', 'dhruba-catalog'),
            'add_new'            => _x('Add New Expert', 'expert', 'dhruba-catalog'),
            'add_new_item'       => __('Add New Expert', 'dhruba-catalog'),
            'new_item'           => __('New Expert', 'dhruba-catalog'),
            'edit_item'          => __('Edit Expert', 'dhruba-catalog'),
            'view_item'          => __('View Expert', 'dhruba-catalog'),
            'all_items'          => __('All Experts', 'dhruba-catalog'),
            'search_items'       => __('Search Experts', 'dhruba-catalog'),
            'not_found'          => __('No experts found.', 'dhruba-catalog'),
            'not_found_in_trash' => __('No experts found in Trash.', 'dhruba-catalog'),
        ];

        $args = [
            'labels'             => $labels,
            'public'             => true,
            'publicly_queryable' => true,
            'show_ui'            => true,
            'show_in_menu'       => true,
            'query_var'          => true,
            'rewrite'            => ['slug' => 'experts', 'with_front' => false],
            'capability_type'    => 'post',
            'has_archive'        => true,
            'hierarchical'       => false,
            'menu_position'      => 27,
            'menu_icon'          => 'dashicons-businessman',
            'supports'           => ['title', 'editor', 'thumbnail', 'page-attributes'],
            'show_in_rest'       => true,
            'rest_base'          => 'experts',
        ];

        register_post_type(self::POST_TYPE, $args);
    }

    public function add_expert_meta_boxes(): void
    {
        add_meta_box(
            'dp_expert_details',
            __('Expert Consultation & WhatsApp Details', 'dhruba-catalog'),
            [$this, 'render_meta_box'],
            self::POST_TYPE,
            'normal',
            'high'
        );
    }

    public function render_meta_box(\WP_Post $post): void
    {
        wp_nonce_field('dp_expert_meta_save', 'dp_expert_nonce');

        $designation = get_post_meta($post->ID, '_dp_designation', true);
        $department  = get_post_meta($post->ID, '_dp_department', true);
        $whatsapp    = get_post_meta($post->ID, '_dp_whatsapp', true) ?: '+8801711197767';
        $active      = get_post_meta($post->ID, '_dp_active', true);
        if ($active === '') {
            $active = '1';
        }
        ?>
        <table class="form-table" role="presentation">
            <tbody>
                <tr>
                    <th scope="row"><label for="dp_designation"><?php esc_html_e('Designation / Title', 'dhruba-catalog'); ?></label></th>
                    <td>
                        <input name="dp_designation" type="text" id="dp_designation" value="<?php echo esc_attr((string)$designation); ?>" class="regular-text" placeholder="e.g. Solar System Specialist" />
                    </td>
                </tr>
                <tr>
                    <th scope="row"><label for="dp_department"><?php esc_html_e('Department / Specialization', 'dhruba-catalog'); ?></label></th>
                    <td>
                        <input name="dp_department" type="text" id="dp_department" value="<?php echo esc_attr((string)$department); ?>" class="regular-text" placeholder="e.g. Solar Power Engineering" />
                    </td>
                </tr>
                <tr>
                    <th scope="row"><label for="dp_whatsapp"><?php esc_html_e('Individual WhatsApp Number', 'dhruba-catalog'); ?></label></th>
                    <td>
                        <input name="dp_whatsapp" type="text" id="dp_whatsapp" value="<?php echo esc_attr((string)$whatsapp); ?>" class="regular-text" placeholder="+8801711197767" />
                        <p class="description"><?php esc_html_e('Direct WhatsApp number for this engineer. Contextual chat will be directed here.', 'dhruba-catalog'); ?></p>
                    </td>
                </tr>
                <tr>
                    <th scope="row"><?php esc_html_e('Active Status', 'dhruba-catalog'); ?></th>
                    <td>
                        <label for="dp_active">
                            <input name="dp_active" type="checkbox" id="dp_active" value="1" <?php checked($active, '1'); ?> />
                            <?php esc_html_e('Display this expert on public homepage & directory', 'dhruba-catalog'); ?>
                        </label>
                    </td>
                </tr>
            </tbody>
        </table>
        <?php
    }

    public function save_expert_meta(int $post_id, \WP_Post $post): void
    {
        if (!isset($_POST['dp_expert_nonce']) || !wp_verify_nonce((string)$_POST['dp_expert_nonce'], 'dp_expert_meta_save')) {
            return;
        }

        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
            return;
        }

        if (!current_user_can('edit_post', $post_id)) {
            return;
        }

        if (isset($_POST['dp_designation'])) {
            update_post_meta($post_id, '_dp_designation', sanitize_text_field((string)$_POST['dp_designation']));
        }

        if (isset($_POST['dp_department'])) {
            update_post_meta($post_id, '_dp_department', sanitize_text_field((string)$_POST['dp_department']));
        }

        if (isset($_POST['dp_whatsapp'])) {
            update_post_meta($post_id, '_dp_whatsapp', sanitize_text_field((string)$_POST['dp_whatsapp']));
        }

        $active = isset($_POST['dp_active']) ? '1' : '0';
        update_post_meta($post_id, '_dp_active', $active);
    }

    /**
     * Get all active experts formatted for REST API and front-end rendering
     */
    public function get_active_experts(): array
    {
        $query = new \WP_Query([
            'post_type'      => self::POST_TYPE,
            'post_status'    => 'publish',
            'posts_per_page' => 50,
            'orderby'        => 'menu_order',
            'order'          => 'ASC',
            'meta_query'     => [
                [
                    'key'     => '_dp_active',
                    'value'   => '1',
                    'compare' => '=',
                ],
            ],
        ]);

        $experts = [];
        while ($query->have_posts()) {
            $query->the_post();
            $id = get_the_ID();
            $whatsapp = (string)get_post_meta($id, '_dp_whatsapp', true) ?: '+8801711197767';
            $clean_phone = preg_replace('/[^0-9]/', '', $whatsapp);
            $name = get_the_title();
            $designation = (string)get_post_meta($id, '_dp_designation', true);
            $department = (string)get_post_meta($id, '_dp_department', true);

            $experts[] = [
                'id'             => $id,
                'name'           => $name,
                'designation'    => $designation,
                'department'     => $department,
                'shortBio'       => get_the_excerpt() ?: wp_trim_words(get_the_content(), 25),
                'photograph'     => get_the_post_thumbnail_url($id, 'large') ?: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
                'whatsappNumber' => $whatsapp,
                'whatsappUrl'    => "https://wa.me/{$clean_phone}?text=" . rawurlencode("Hello, I want to consult with {$name} ({$designation}) from Dhruba Power regarding {$department}."),
                'displayOrder'   => (int)get_post_field('menu_order', $id),
                'active'         => true,
            ];
        }
        wp_reset_postdata();

        return $experts;
    }

    /**
     * Shortcode to output clean 4-card horizontal carousel
     */
    public function render_experts_shortcode(array $atts = []): string
    {
        $experts = $this->get_active_experts();
        if (empty($experts)) {
            return '';
        }

        ob_start();
        ?>
        <div class="ss-card-grid ss-card-grid--experts">
            <?php foreach ($experts as $exp): ?>
                <article class="ss-card ss-expert-card">
                    <div class="ss-card__media">
                        <img src="<?php echo esc_url($exp['photograph']); ?>" alt="<?php echo esc_attr($exp['name']); ?>" loading="lazy" />
                    </div>
                    <div class="ss-card__body">
                        <span class="ss-badge"><?php echo esc_html($exp['department']); ?></span>
                        <h3><?php echo esc_html($exp['name']); ?></h3>
                        <p class="ss-expert-card__role"><?php echo esc_html($exp['designation']); ?></p>
                        <p class="ss-expert-card__bio"><?php echo esc_html($exp['shortBio']); ?></p>
                        <div class="ss-card__actions" style="margin-top: 1rem;">
                            <a href="<?php echo esc_url($exp['whatsappUrl']); ?>" class="ss-btn ss-btn--primary" target="_blank" rel="noopener" style="background:#19a974;border-color:#19a974;display:inline-flex;align-items:center;gap:0.4rem;">
                                <span>WhatsApp Consultation</span>
                            </a>
                        </div>
                    </div>
                </article>
            <?php endforeach; ?>
        </div>
        <?php
        return ob_get_clean();
    }
}
