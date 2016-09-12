set( 'MFILE_APPNAME', 'dochazka-www' );
set( 'DOCHAZKA_WWW_BACKEND_URI', 'http://localhost:5000' );
set( 'MFILE_WWW_LOG_FILE', $ENV{'HOME'} . '/dochazka-www.log' );
set( 'MFILE_WWW_LOG_FILE_RESET', 1 );
set( 'MFILE_WWW_BYPASS_LOGIN_DIALOG', 0 );
set( 'MFILE_WWW_DEFAULT_LOGIN_CREDENTIALS', {
    'nam' => 'root',
    'pwd' => 'immutable'
} );
