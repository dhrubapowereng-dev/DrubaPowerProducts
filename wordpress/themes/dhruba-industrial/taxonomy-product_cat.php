<?php
/**
 * Product Category Archive Template
 *
 * Implements division & family level industrial catalog layout:
 * - Electrical Engineering (EEE): MCBs, MCCBs, Contactors, Relays, VFDs
 * - CCTV & Security: IP Cameras, NVRs, PTZ, PoE Switches
 * - Solar Energy: On-Grid & Hybrid Inverters, PV Panels, Lithium Storage
 *
 * @package DhrubaIndustrial
 */

if (!defined('ABSPATH')) {
    exit;
}

// Redirect or render using standard archive layout with category context
wc_get_template('archive-product.php');
