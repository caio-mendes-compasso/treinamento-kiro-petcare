-- ============================================================
-- Dados iniciais para desenvolvimento (profile: local)
-- ============================================================

-- Planos
INSERT INTO plans (id, name, price, active) VALUES (1, 'Básico', 49.90, true);
INSERT INTO plans (id, name, price, active) VALUES (2, 'Plus', 89.90, true);
INSERT INTO plans (id, name, price, active) VALUES (3, 'Premium', 149.90, true);

INSERT INTO plan_features (plan_id, feature) VALUES (1, 'Consultas');
INSERT INTO plan_features (plan_id, feature) VALUES (1, 'Vacinas');
INSERT INTO plan_features (plan_id, feature) VALUES (2, 'Consultas');
INSERT INTO plan_features (plan_id, feature) VALUES (2, 'Vacinas');
INSERT INTO plan_features (plan_id, feature) VALUES (2, 'Exames');
INSERT INTO plan_features (plan_id, feature) VALUES (2, 'Emergência');
INSERT INTO plan_features (plan_id, feature) VALUES (3, 'Consultas');
INSERT INTO plan_features (plan_id, feature) VALUES (3, 'Vacinas');
INSERT INTO plan_features (plan_id, feature) VALUES (3, 'Exames');
INSERT INTO plan_features (plan_id, feature) VALUES (3, 'Emergência');
INSERT INTO plan_features (plan_id, feature) VALUES (3, 'Cirurgias');
INSERT INTO plan_features (plan_id, feature) VALUES (3, 'Internação');

-- Usuário de teste: Maria Silva
INSERT INTO users (id, name, email, cpf, plan_type, created_at, updated_at)
VALUES ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Maria Silva', 'maria@email.com', '12345678901', 'PLUS', NOW(), NOW());

-- Pets de teste
INSERT INTO pets (id, user_id, name, species, breed, birth_date, weight, color, created_at, updated_at)
VALUES ('b1c2d3e4-f5a6-7890-bcde-f12345678901', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Thor', 'DOG', 'Golden Retriever', '2022-03-15', 32.0, 'Dourado', NOW(), NOW());

INSERT INTO pets (id, user_id, name, species, breed, birth_date, weight, color, created_at, updated_at)
VALUES ('c1d2e3f4-a5b6-7890-cdef-123456789012', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Luna', 'CAT', 'Siamês', '2023-07-20', 4.5, 'Creme', NOW(), NOW());

-- Subscription ativa (Plus)
INSERT INTO subscriptions (id, user_id, plan_id, status, start_date, end_date)
VALUES ('d1e2f3a4-b5c6-7890-defa-234567890123', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 2, 'ACTIVE', '2025-01-01', '2026-01-01');

-- Agendamentos (2 futuros, 2 passados, 1 cancelado)
INSERT INTO appointments (id, pet_id, type, date, time, status, created_at)
VALUES ('e1f2a3b4-c5d6-7890-efab-345678901234', 'b1c2d3e4-f5a6-7890-bcde-f12345678901', 'CONSULTATION', CURRENT_DATE + 7, '09:00', 'CONFIRMED', NOW());

INSERT INTO appointments (id, pet_id, type, date, time, status, created_at)
VALUES ('f1a2b3c4-d5e6-7890-fabc-456789012345', 'c1d2e3f4-a5b6-7890-cdef-123456789012', 'EXAM', CURRENT_DATE + 14, '14:00', 'CONFIRMED', NOW());

INSERT INTO appointments (id, pet_id, type, date, time, status, created_at)
VALUES ('a2b3c4d5-e6f7-8901-abcd-567890123456', 'b1c2d3e4-f5a6-7890-bcde-f12345678901', 'CONSULTATION', CURRENT_DATE - 30, '10:00', 'CONFIRMED', NOW());

INSERT INTO appointments (id, pet_id, type, date, time, status, created_at)
VALUES ('b2c3d4e5-f6a7-8901-bcde-678901234567', 'c1d2e3f4-a5b6-7890-cdef-123456789012', 'EXAM', CURRENT_DATE - 60, '15:00', 'CONFIRMED', NOW());

INSERT INTO appointments (id, pet_id, type, date, time, status, created_at)
VALUES ('c2d3e4f5-a6b7-8901-cdef-789012345678', 'b1c2d3e4-f5a6-7890-bcde-f12345678901', 'CONSULTATION', CURRENT_DATE - 15, '11:00', 'CANCELLED', NOW());

-- Faturas (12 meses: 8 pagas, 2 pendentes, 2 vencidas)
INSERT INTO invoices (id, user_id, reference_month, amount, status, due_date, paid_at)
VALUES ('11111111-1111-1111-1111-111111111101', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', '2025-01', 89.90, 'PAID', '2025-01-15', '2025-01-12 10:30:00');

INSERT INTO invoices (id, user_id, reference_month, amount, status, due_date, paid_at)
VALUES ('11111111-1111-1111-1111-111111111102', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', '2025-02', 89.90, 'PAID', '2025-02-15', '2025-02-14 09:15:00');

INSERT INTO invoices (id, user_id, reference_month, amount, status, due_date, paid_at)
VALUES ('11111111-1111-1111-1111-111111111103', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', '2025-03', 89.90, 'PAID', '2025-03-15', '2025-03-10 14:00:00');

INSERT INTO invoices (id, user_id, reference_month, amount, status, due_date, paid_at)
VALUES ('11111111-1111-1111-1111-111111111104', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', '2025-04', 89.90, 'PAID', '2025-04-15', '2025-04-15 08:45:00');

INSERT INTO invoices (id, user_id, reference_month, amount, status, due_date, paid_at)
VALUES ('11111111-1111-1111-1111-111111111105', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', '2025-05', 89.90, 'PAID', '2025-05-15', '2025-05-13 11:20:00');

INSERT INTO invoices (id, user_id, reference_month, amount, status, due_date, paid_at)
VALUES ('11111111-1111-1111-1111-111111111106', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', '2025-06', 89.90, 'PAID', '2025-06-15', '2025-06-14 16:30:00');

INSERT INTO invoices (id, user_id, reference_month, amount, status, due_date, paid_at)
VALUES ('11111111-1111-1111-1111-111111111107', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', '2025-07', 89.90, 'PAID', '2025-07-15', '2025-07-15 09:00:00');

INSERT INTO invoices (id, user_id, reference_month, amount, status, due_date, paid_at)
VALUES ('11111111-1111-1111-1111-111111111108', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', '2025-08', 89.90, 'PAID', '2025-08-15', '2025-08-12 10:00:00');

INSERT INTO invoices (id, user_id, reference_month, amount, status, due_date)
VALUES ('11111111-1111-1111-1111-111111111109', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', '2025-09', 89.90, 'PENDING', '2025-09-15');

INSERT INTO invoices (id, user_id, reference_month, amount, status, due_date)
VALUES ('11111111-1111-1111-1111-111111111110', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', '2025-10', 89.90, 'PENDING', '2025-10-15');

INSERT INTO invoices (id, user_id, reference_month, amount, status, due_date)
VALUES ('11111111-1111-1111-1111-111111111111', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', '2025-11', 89.90, 'OVERDUE', '2025-11-15');

INSERT INTO invoices (id, user_id, reference_month, amount, status, due_date)
VALUES ('11111111-1111-1111-1111-111111111112', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', '2025-12', 89.90, 'OVERDUE', '2025-12-15');
