CREATE TABLE IF NOT EXISTS player (
  id SERIAL PRIMARY KEY,
  username varchar(50) NOT NULL,
  email varchar(50) UNIQUE NOT NULL,
  phone varchar(20),
  password varchar(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS spaces (
  id SERIAL PRIMARY KEY,
  name varchar(50) NOT NULL,
  type varchar(50) NOT NULL,
  capacity integer,
  location varchar(100)
);

CREATE TABLE IF NOT EXISTS reservation (
  id SERIAL PRIMARY KEY,
  user_id integer NOT NULL,
  space_id integer NOT NULL,
  reservation_date date NOT NULL,
  initial_hour timestamp NOT NULL,
  final_hour timestamp NOT NULL,
  status varchar(50) NOT NULL DEFAULT 'pending',
  FOREIGN KEY (user_id) REFERENCES player(id) ON DELETE CASCADE,
  FOREIGN KEY (space_id) REFERENCES spaces (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS employees (
  id SERIAL PRIMARY KEY,
  name varchar(50) NOT NULL,
  role varchar(50) NOT NULL,
  phone varchar(20),
  email varchar(50) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS cleaning (
  id SERIAL PRIMARY KEY,
  reservation_id integer NOT NULL,
  space_id integer NOT NULL,
  employee_id integer NOT NULL,
  cleaning_date date NOT NULL,
  status varchar(50) NOT NULL DEFAULT 'pending',
  FOREIGN KEY (reservation_id) REFERENCES reservation (id) ON DELETE CASCADE,
  FOREIGN KEY (space_id) REFERENCES spaces (id) ON DELETE CASCADE,
  FOREIGN KEY (employee_id) REFERENCES employees (id) ON DELETE CASCADE
);

INSERT INTO player(username, email, phone, password) VALUES
('admin', 'admin@admin.com', '123456789', '123456'),
('user1', 'user1@user.com', '987654321', '654321'),
('user2', 'user2@user.com', '456789123', '789123'),
('user3', 'user3@user.com', '321654987', '321654');

INSERT INTO spaces (name, type, capacity, location) VALUES
('Sala de Reuniões A', 'Reunião', 10, 'Andar 1'),
('Auditório', 'Evento', 100, 'Térreo'),
('Escritório Compartilhado', 'Trabalho', 20, 'Andar 2');

INSERT INTO employees (name, role, phone, email) VALUES
('João Silva', 'Limpeza', '111222333', 'joao@empresa.com'),
('Maria Oliveira', 'Manutenção', '444555666', 'maria@empresa.com'),
('Carlos Santos', 'Supervisor', '777888999', 'carlos@empresa.com');