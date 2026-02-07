-- 고객 3명과 주문 2개의 샘플 데이터 삽입 스크립트
-- Supabase SQL Editor나 psql에 그대로 붙여넣어 실행하세요.
-- 주의: create_customers_table.sql과 create_orders_table.sql을 먼저 실행한 후 이 스크립트를 실행하세요.

-- 기존 샘플 데이터 삭제 (선택사항 - 필요시 주석 해제)
-- DELETE FROM orders WHERE order_id LIKE 'SAMPLE-%';
-- DELETE FROM customers WHERE email LIKE '%@sample.com';

-- 고객 데이터 삽입 (user_id는 NULL로 설정 - 실제 사용 시 auth.users의 user_id로 교체하세요)
-- 이미 존재하는 고객이면 기존 ID를 사용하고, 주문이 이미 존재하면 스킵합니다.
DO $$
DECLARE
  customer1_id uuid;
  customer2_id uuid;
  customer3_id uuid;
BEGIN
  -- 고객 1: 김철수 (이미 존재하면 기존 ID 사용)
  INSERT INTO customers (user_id, name, email, phone, address, postal_code)
  VALUES (NULL, '김철수', 'kim.chulsoo@sample.com', '010-1234-5678', '서울특별시 강남구 테헤란로 123', '06142')
  ON CONFLICT (email) DO NOTHING
  RETURNING id INTO customer1_id;
  
  -- 고객이 이미 존재하는 경우 ID 조회
  IF customer1_id IS NULL THEN
    SELECT id INTO customer1_id FROM customers WHERE email = 'kim.chulsoo@sample.com';
  END IF;

  -- 고객 2: 이영희 (이미 존재하면 기존 ID 사용)
  INSERT INTO customers (user_id, name, email, phone, address, postal_code)
  VALUES (NULL, '이영희', 'lee.younghee@sample.com', '010-2345-6789', '서울특별시 서초구 서초대로 456', '06511')
  ON CONFLICT (email) DO NOTHING
  RETURNING id INTO customer2_id;
  
  -- 고객이 이미 존재하는 경우 ID 조회
  IF customer2_id IS NULL THEN
    SELECT id INTO customer2_id FROM customers WHERE email = 'lee.younghee@sample.com';
  END IF;

  -- 고객 3: 박민수 (이미 존재하면 기존 ID 사용)
  INSERT INTO customers (user_id, name, email, phone, address, postal_code)
  VALUES (NULL, '박민수', 'park.minsu@sample.com', '010-3456-7890', '서울특별시 송파구 올림픽로 789', '05510')
  ON CONFLICT (email) DO NOTHING
  RETURNING id INTO customer3_id;
  
  -- 고객이 이미 존재하는 경우 ID 조회
  IF customer3_id IS NULL THEN
    SELECT id INTO customer3_id FROM customers WHERE email = 'park.minsu@sample.com';
  END IF;

  -- 주문 1: 김철수의 주문 (치즈 피자 2개, 페퍼로니 피자 1개)
  -- 이미 존재하는 주문이면 스킵
  INSERT INTO orders (
    order_id,
    user_id,
    customer_id,
    order_name,
    customer_name,
    amount,
    status,
    payment_key,
    items
  )
  VALUES (
    'SAMPLE-ORDER-001',
    NULL,
    customer1_id,
    '치즈 피자 외 1건',
    '김철수',
    55000,
    'paid',
    'sample_payment_key_001',
    '[
      {"productId": "1", "name": "치즈 피자", "price": 18000, "quantity": 2},
      {"productId": "2", "name": "페퍼로니 피자", "price": 19000, "quantity": 1}
    ]'::jsonb
  )
  ON CONFLICT (order_id) DO NOTHING;

  -- 주문 2: 이영희의 주문 (불고기 피자 1개, 바질 크림 피자 1개, 트러플 버섯 피자 1개)
  -- 이미 존재하는 주문이면 스킵
  INSERT INTO orders (
    order_id,
    user_id,
    customer_id,
    order_name,
    customer_name,
    amount,
    status,
    payment_key,
    items
  )
  VALUES (
    'SAMPLE-ORDER-002',
    NULL,
    customer2_id,
    '불고기 피자 외 2건',
    '이영희',
    74000,
    'paid',
    'sample_payment_key_002',
    '[
      {"productId": "3", "name": "불고기 피자", "price": 22000, "quantity": 1},
      {"productId": "4", "name": "바질 크림 피자", "price": 24000, "quantity": 1},
      {"productId": "5", "name": "트러플 버섯 피자", "price": 28000, "quantity": 1}
    ]'::jsonb
  )
  ON CONFLICT (order_id) DO NOTHING;

END $$;

-- 삽입된 데이터 확인
SELECT 
  c.id as customer_id,
  c.name,
  c.email,
  c.phone,
  COUNT(o.id) as order_count
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
WHERE c.email LIKE '%@sample.com'
GROUP BY c.id, c.name, c.email, c.phone
ORDER BY c.name;

SELECT 
  o.order_id,
  o.customer_name,
  o.order_name,
  o.amount,
  o.status,
  o.items
FROM orders o
WHERE o.order_id LIKE 'SAMPLE-%'
ORDER BY o.created_at DESC;

