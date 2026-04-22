-- データベースの作成
CREATE DATABASE IF NOT EXISTS rpointworker
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- ユーザーの作成と権限付与
CREATE USER IF NOT EXISTS 'rpointworker'@'%' IDENTIFIED BY '331155';
GRANT ALL PRIVILEGES ON *.* TO 'rpointworker'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;

-- 認証方式の変更（互換性のため）
ALTER USER 'rpointworker'@'%' IDENTIFIED WITH mysql_native_password BY '331155';
FLUSH PRIVILEGES;

-- テーブルの作成
USE rpointworker;

CREATE TABLE IF NOT EXISTS history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_date VARCHAR(50) NOT NULL,    -- 発生日
    service VARCHAR(255),               -- サービス
    content TEXT,                       -- 内容
    points INT,                         -- ポイント数
    type VARCHAR(50),                   -- 通常/期間限定など
    note TEXT,                          -- 期間限定の期限や内訳などの補足情報
    hash_key VARCHAR(64) UNIQUE,        -- 重複防止用ハッシュ
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
