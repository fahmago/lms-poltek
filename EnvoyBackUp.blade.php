@setup
    $repository     = 'git@github.com:Febryan1453/eLearning.git';
    // $repository     = 'https://' . getenv('GHB_TOKEN') . '@github.com/Febryan1453/eLearning.git';
    $deploy_user    = getenv('DEPLOY_USER');
    $deploy_host    = getenv('DEPLOY_HOST');
    $deploy_port    = getenv('DEPLOY_PORT');
    $project_dir    = '~/domains/politeknikidn.id/sites/lms.politeknikidn.id';
    $php_path       = '/usr/local/php83/bin/php';
@endsetup

@servers(['web' => "$deploy_user@$deploy_host -p $deploy_port"])

@story('deploy')
    clone_or_pull_repo
    update_env_file
    generate_app_key
    run_composer
    migrate_database
    create_storage_symlink
    set_permissions        
    optimize_laravel
    build_assets
@endstory

@task('clone_or_pull_repo', ['on' => 'web'])
    echo "📥 Checking project directory..."
    if [ ! -d {{ $project_dir }} ]; then
        echo "🆕 Cloning repository..."
        git clone {{ $repository }} {{ $project_dir }}
    else
        if [ -d {{ $project_dir }}/.git ]; then
            echo "🔄 Pulling latest changes..."
            cd {{ $project_dir }}
            git reset --hard
            git pull origin master
        else
            echo "⚠️ Folder exists but is not a git repo. Removing and cloning again..."
            rm -rf {{ $project_dir }}
            git clone {{ $repository }} {{ $project_dir }}
        fi
    fi
@endtask

@task('run_composer', ['on' => 'web'])
    echo "📦 Installing Composer dependencies..."
    cd {{ $project_dir }}
    {{ $php_path }} /usr/local/bin/composer install --no-dev --optimize-autoloader
@endtask

@task('update_env_file', ['on' => 'web'])
    echo "⚙️ Updating .env file..."
    cd {{ $project_dir }}

    if [ ! -f .env ]; then
        cp .env.example .env
        echo "📄 Copied .env from .env.example"
    fi

    sed -i "s|^APP_NAME=.*|APP_NAME=\"LMS IDN\"|" .env
    sed -i "s|^APP_ENV=.*|APP_ENV=production|" .env
    sed -i "s|^APP_DEBUG=.*|APP_DEBUG=false|" .env
    sed -i "s|^APP_URL=.*|APP_URL=https://lms.politeknikidn.id|" .env

    sed -i "s|^DB_HOST=.*|DB_HOST={{ getenv('DB_HOST') }}|" .env
    sed -i "s|^DB_DATABASE=.*|DB_DATABASE={{ getenv('DB_DATABASE') }}|" .env
    sed -i "s|^DB_USERNAME=.*|DB_USERNAME={{ getenv('DB_USERNAME') }}|" .env
    sed -i "s|^DB_PASSWORD=.*|DB_PASSWORD={{ getenv('DB_PASSWORD') }}|" .env

    echo "✅ .env file updated."
@endtask

@task('generate_app_key', ['on' => 'web'])
    echo "🔑 Checking APP_KEY..."
    cd {{ $project_dir }}

    if grep -q "^APP_KEY=$" .env || ! grep -q "^APP_KEY=" .env; then
        echo "Generating APP_KEY..."
        {{ $php_path }} artisan key:generate --force
        echo "✅ APP_KEY generated."
    else
        echo "✔️ APP_KEY already exists. Skipping generation."
    fi
@endtask

@task('migrate_database', ['on' => 'web'])
    echo "🧬 Running database migrations..."
    cd {{ $project_dir }}
    {{ $php_path }} artisan migrate --force
    {{ $php_path }} artisan db:seed --force
@endtask

@task('create_storage_symlink', ['on' => 'web'])
    echo "🔗 Creating storage symlink..."
    cd {{ $project_dir }}
    {{ $php_path }} artisan storage:link
@endtask

@task('set_permissions', ['on' => 'web'])
    echo "🔒 Setting file and directory permissions..."

    cd {{ $project_dir }}

    # Set file permissions to 644
    find . -type f -exec chmod 644 {} \;

    # Set directory permissions to 755
    find . -type d -exec chmod 755 {} \;

    # Give writable permissions to storage and bootstrap/cache
    chmod -R ug+rwx storage bootstrap/cache

    echo "✅ Permissions set successfully."
@endtask

@task('optimize_laravel', ['on' => 'web'])
    echo "⚡ Optimizing Laravel..."
    cd {{ $project_dir }}
    {{ $php_path }} artisan config:cache
    {{ $php_path }} artisan route:cache
    {{ $php_path }} artisan view:cache
@endtask

@task('build_assets', ['on' => 'web'])
    echo "🔨 Building frontend assets..."
    cd {{ $project_dir }}
    npm ci
    npm run build
@endtask
