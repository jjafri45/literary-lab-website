<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=UTF-8');

echo json_encode([
    'upload_max_filesize' => ini_get('upload_max_filesize'),
    'post_max_size' => ini_get('post_max_size'),
    'max_file_uploads' => ini_get('max_file_uploads'),
    'max_execution_time' => ini_get('max_execution_time'),
    'max_input_time' => ini_get('max_input_time'),
    'memory_limit' => ini_get('memory_limit'),
    'user_ini_filename' => ini_get('user_ini.filename'),
    'loaded_ini' => php_ini_loaded_file(),
], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
