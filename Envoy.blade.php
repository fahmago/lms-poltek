@setup
    // === Konfigurasi utama ===
    $repository     = 'git@github.com:Febryan1453/eLearning.git';
    $ssh_key_path   = '~/.ssh/id_deploy_key';

    // Ambil dari environment GitHub Actions
    $deploy_user    = getenv('DEPLOY_USER');
    $deploy_host    = getenv('DEPLOY_HOST');
    $deploy_port    = getenv('DEPLOY_PORT');
    $project_dir    = '~/domains/politeknikidn.id/sites/lms.politeknikidn.id';
    $php_path       = '/usr/local/php83/bin/php';

    // === Database ===
    $DB_HOST        = getenv('DB_HOST');
    $DB_DATABASE    = getenv('DB_DATABASE');
    $DB_USERNAME    = getenv('DB_USERNAME');
    $DB_PASSWORD    = getenv('DB_PASSWORD');
@endsetup


@servers(['web' => "$deploy_user@$deploy_host -p $deploy_port"])


@story('deploy')
    ensure_repo_uses_ssh
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



{{-- =====================================
🧩 STEP 1: Pastikan remote pakai SSH
===================================== --}}
@task('ensure_repo_uses_ssh', ['on' => 'web'])
    echo "🔍 Ensuring repository uses SSH remote..."
    if [ -d {{ $project_dir }}/.git ]; then
        cd {{ $project_dir }}
        current_remote=$(git remote get-url origin)
        if [[ "$current_remote" == https* ]]; then
            echo "🔄 Changing remote from HTTPS to SSH..."
            git remote set-url origin {{ $repository }}
        else
            echo "✔️ Repository already uses SSH."
        fi
    else
        echo "ℹ️ No .git directory found, skipping."
    fi
@endtask



{{-- =====================================
📦 STEP 2: Clone atau Pull repo
===================================== --}}
@task('clone_or_pull_repo', ['on' => 'web'])
    echo "📥 Checking project directory..."
    if [ ! -d {{ $project_dir }} ]; then
        echo "🆕 Cloning repository via SSH..."
        GIT_SSH_COMMAND="ssh -i {{ $ssh_key_path }} -o StrictHostKeyChecking=no" \
        git clone {{ $repository }} {{ $project_dir }}
    else
        if [ -d {{ $project_dir }}/.git ]; then
            echo "🔄 Pulling latest changes..."
            cd {{ $project_dir }}
            GIT_SSH_COMMAND="ssh -i {{ $ssh_key_path }} -o StrictHostKeyChecking=no" \
            git fetch origin master
            git reset --hard origin/master
        else
            echo "⚠️ WARNING: Directory exists but not a Git repo."
            echo "❌ Skipping removal to protect existing data."
            exit 1
        fi
    fi
@endtask



{{-- =====================================
⚙️ STEP 3: Update .env file
===================================== --}}
@task('update_env_file', ['on' => 'web'])
    echo "⚙️ Updating .env file..."
    cd {{ $project_dir }}

    if [ ! -f .env ]; then
        cp .env.example .env
        echo "📄 Copied .env from .env.example"
    else
        echo "✔️ .env already exists, skipping overwrite."
    fi

    sed -i "s|^APP_NAME=.*|APP_NAME=\"LMS IDN\"|" .env
    sed -i "s|^APP_ENV=.*|APP_ENV=production|" .env
    sed -i "s|^APP_DEBUG=.*|APP_DEBUG=false|" .env
    sed -i "s|^APP_URL=.*|APP_URL=https://lms.politeknikidn.id|" .env

    sed -i "s|^DB_HOST=.*|DB_HOST={{ $DB_HOST }}|" .env
    sed -i "s|^DB_DATABASE=.*|DB_DATABASE={{ $DB_DATABASE }}|" .env
    sed -i "s|^DB_USERNAME=.*|DB_USERNAME={{ $DB_USERNAME }}|" .env
    sed -i "s|^DB_PASSWORD=.*|DB_PASSWORD={{ $DB_PASSWORD }}|" .env

    echo "✅ .env file updated."
@endtask



{{-- =====================================
🔑 STEP 4: Generate APP_KEY jika kosong
===================================== --}}
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



{{-- =====================================
📦 STEP 5: Install Composer
===================================== --}}
@task('run_composer', ['on' => 'web'])
    echo "📦 Installing Composer dependencies..."
    cd {{ $project_dir }}
    {{ $php_path }} /usr/local/bin/composer install \
        --no-dev --no-interaction --prefer-dist --optimize-autoloader
@endtask



{{-- =====================================
🧬 STEP 6: Migrate database
===================================== --}}
@task('migrate_database', ['on' => 'web'])
    echo "🧬 Running database migrations..."
    cd {{ $project_dir }}
    {{ $php_path }} artisan migrate --force
    {{ $php_path }} artisan db:seed --force
@endtask



{{-- =====================================
🔗 STEP 7: Storage link
===================================== --}}
@task('create_storage_symlink', ['on' => 'web'])
    echo "🔗 Creating storage symlink..."
    cd {{ $project_dir }}
    {{ $php_path }} artisan storage:link
@endtask



{{-- =====================================
🔒 STEP 8: Set Permissions
===================================== --}}
@task('set_permissions', ['on' => 'web'])
    echo "🔒 Setting file and directory permissions..."
    cd {{ $project_dir }}
    find . -type f -exec chmod 644 {} \;
    find . -type d -exec chmod 755 {} \;
    chmod -R ug+rwx storage bootstrap/cache
    echo "✅ Permissions set successfully."
@endtask



{{-- =====================================
⚡ STEP 9: Optimize Laravel
===================================== --}}
@task('optimize_laravel', ['on' => 'web'])
    echo "⚡ Optimizing Laravel..."
    cd {{ $project_dir }}
    {{ $php_path }} artisan config:cache
    {{ $php_path }} artisan route:cache
    {{ $php_path }} artisan view:cache
@endtask



{{-- =====================================
🔨 STEP 10: Build Frontend
===================================== --}}
@task('build_assets', ['on' => 'web'])
    echo "🔨 Building frontend assets..."
    cd {{ $project_dir }}
    if command -v npm >/dev/null 2>&1; then
        npm ci && npm run build
    else
        echo "⚠️ npm not found, skipping frontend build."
    fi
@endtask



{{-- =====================================
🎉 Akhir Deploy
===================================== --}}
@after
    echo "🎉 Deployment completed successfully at $(date)";
@endafter