{
    'target_defaults': {
        'libraries': [
            '--js-library=<!(node -p "require(\'@tybys/emnapi\').js_library")'
        ],
        'defines': [
            'NAPI_DISABLE_CPP_EXCEPTIONS'
        ],
        'include_dirs': [
            '<!(node -p "require(\'@tybys/emnapi\').include_dir")',
        ],
        'sources': [
            '<!(node -p "require(\'@tybys/emnapi\').sources.map(x => JSON.stringify(path.relative(process.cwd(), x))).join(\' \')")'
        ]
    }
}
