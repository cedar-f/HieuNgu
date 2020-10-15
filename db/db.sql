CREATE TABLE tb_user -- lưu trữ tài khoản
(
    user_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    user_name VARCHAR(30) NOT NULL,
    password VARCHAR(64) NOT NULL,
    reset_password VARCHAR(64) NOT NULL DEFAULT '',
    name VARCHAR(50),
    salt VARCHAR(64),
    email VARCHAR(50),
    active INT DEFAULT 1,
    create_by INT UNSIGNED,
    modify_by INT UNSIGNED,
    create_date DATETIME DEFAULT NOW(),
    modify_date DATETIME,
    CONSTRAINT user_name_only_one UNIQUE (user_name)
);

CREATE TABLE tb_role
(
    role_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    role_name VARCHAR(30),
    role_value TEXT,
    create_by INT UNSIGNED,
    modify_by INT UNSIGNED,
    create_date DATETIME DEFAULT NOW(),
    modify_date DATETIME
);

CREATE TABLE tb_acc_role
(
    acc_role_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNSIGNED NOT NULL,
    role_id INT UNSIGNED NOT NULL,
    create_by INT UNSIGNED,
    create_date DATETIME DEFAULT NOW()
);

