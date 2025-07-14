-- Create demo profiles for seeding content
-- These are demo profiles that don't require authentication but allow content creation

INSERT INTO profiles (id, email, full_name, role, display_id, bio, age_group, location, cancer_type, created_at) VALUES
(gen_random_uuid(), 'priya.sharma@demo.com', 'Priya Sharma', 'survivor', 'FN' || upper(substr(md5(random()::text), 1, 6)), 'Breast cancer survivor from Delhi. Sharing my journey of hope and healing.', '30-40', 'Delhi', 'breast', now() - interval '6 months'),
(gen_random_uuid(), 'raj.kumar@demo.com', 'Raj Kumar', 'caregiver', 'FN' || upper(substr(md5(random()::text), 1, 6)), 'Caring for my father who is fighting lung cancer. Here to support other caregivers.', '40-50', 'Delhi', 'lung', now() - interval '5 months'),
(gen_random_uuid(), 'anita.verma@demo.com', 'Anita Verma', 'patient', 'FN' || upper(substr(md5(random()::text), 1, 6)), 'Recently diagnosed with breast cancer. Looking for support and guidance.', '25-35', 'Delhi', 'breast', now() - interval '4 months'),
(gen_random_uuid(), 'vikram.singh@demo.com', 'Vikram Singh', 'survivor', 'FN' || upper(substr(md5(random()::text), 1, 6)), 'Prostate cancer survivor. Advocate for early detection and mens health.', '50-60', 'Delhi', 'prostate', now() - interval '3 months'),
(gen_random_uuid(), 'meera.patel@demo.com', 'Meera Patel', 'volunteer', 'FN' || upper(substr(md5(random()::text), 1, 6)), 'Volunteer counselor helping cancer patients navigate their journey.', '35-45', 'Delhi', null, now() - interval '2 months'),
(gen_random_uuid(), 'suresh.gupta@demo.com', 'Dr. Suresh Gupta', 'ngo', 'FN' || upper(substr(md5(random()::text), 1, 6)), 'Oncologist and founder of Delhi Cancer Care Foundation.', '45-55', 'Delhi', null, now() - interval '1 month'),
(gen_random_uuid(), 'kavita.jain@demo.com', 'Kavita Jain', 'survivor', 'FN' || upper(substr(md5(random()::text), 1, 6)), 'Colon cancer survivor. Nutritionist helping others with diet during treatment.', '40-50', 'Delhi', 'colon', now() - interval '2 weeks'),
(gen_random_uuid(), 'amit.shah@demo.com', 'Amit Shah', 'caregiver', 'FN' || upper(substr(md5(random()::text), 1, 6)), 'Supporting my wife through her cancer treatment. Sharing our experience.', '30-40', 'Delhi', 'breast', now() - interval '1 week');

-- Create inspiring stories from our demo users
WITH demo_users AS (
  SELECT id, full_name, role, cancer_type 
  FROM profiles 
  WHERE email LIKE '%@demo.com' 
  ORDER BY created_at DESC 
  LIMIT 8
)
INSERT INTO stories (user_id, title, content, excerpt, age_group, cancer_type, tone, is_featured, created_at)
SELECT 
  du.id,
  CASE 
    WHEN du.full_name = 'Priya Sharma' THEN 'My Victory Over Breast Cancer'
    WHEN du.full_name = 'Vikram Singh' THEN 'Early Detection Saved My Life'
    WHEN du.full_name = 'Kavita Jain' THEN 'Fighting Cancer with Nutrition'
    WHEN du.full_name = 'Raj Kumar' THEN 'A Caregivers Journey of Love'
    WHEN du.full_name = 'Amit Shah' THEN 'Standing Strong Together'
    ELSE 'My Cancer Journey'
  END,
  CASE 
    WHEN du.full_name = 'Priya Sharma' THEN 'When I was diagnosed with breast cancer at 34, my world turned upside down. As a working mother in Delhi, I was scared about my future and my familys well-being. The initial shock gave way to determination. Through chemotherapy, surgery, and radiation, I found strength I never knew I had. The support from my family and the medical team at AIIMS was incredible. Today, 2 years post-treatment, I am cancer-free and more grateful for life than ever. I want other women to know that breast cancer is not a death sentence. Early detection, proper treatment, and a positive mindset can work miracles. I now volunteer with cancer support groups in Delhi, sharing my story to give hope to others. Every day is a gift, and I make sure to live it fully.'
    WHEN du.full_name = 'Vikram Singh' THEN 'At 58, I never thought cancer would touch my life. I was always healthy, never missed my morning walks in Lodhi Garden. But during a routine check-up, my PSA levels were elevated. The biopsy confirmed prostate cancer. I was devastated. However, because we caught it early, the treatment options were excellent. I underwent robotic surgery at Max Hospital in Delhi. The recovery was challenging, but the support from my wife and children kept me going. The doctors assured me that early-stage prostate cancer has a very high cure rate. Its been 18 months since my surgery, and my latest tests show no signs of cancer. I now advocate for regular health check-ups, especially for men over 50. Dont ignore the warning signs - early detection truly saves lives.'
    WHEN du.full_name = 'Kavita Jain' THEN 'My battle with colon cancer began with symptoms I initially ignored - fatigue, changes in bowel habits, and occasional abdominal pain. As a nutritionist in Delhi, I thought I knew my body well. When the diagnosis came, I was shocked. Stage 2 colon cancer at 45. The treatment included surgery to remove the tumor and chemotherapy. During this journey, I realized how crucial nutrition is during cancer treatment. I worked closely with my oncologist to develop meal plans that helped manage side effects and boost my immune system. Fresh fruits from Delhi markets, whole grains, and plenty of water became my medicine. Today, I am in remission and have started a nutrition counseling service specifically for cancer patients. Food can be medicine, and I want to help others heal through proper nutrition during their cancer journey.'
    WHEN du.full_name = 'Raj Kumar' THEN 'When Papa was diagnosed with lung cancer, our entire family was shaken. As his eldest son, I took on the role of primary caregiver while continuing my job in Gurgaon. The daily trips to hospital, managing medications, and seeing my strong father become vulnerable was emotionally draining. There were days when I felt overwhelmed and helpless. I learned that being a caregiver means taking care of yourself too. I joined a support group for caregivers at cancer hospital in Delhi. Sharing experiences with other caregivers helped me cope better. Papa fought bravely for 8 months before he passed away peacefully. Though we lost the battle, I gained immense respect for the strength of cancer patients and their families. I now volunteer to support other caregivers, because no one should face this journey alone.'
    WHEN du.full_name = 'Amit Shah' THEN 'When Priya was diagnosed with breast cancer, our world changed overnight. As her husband, I wanted to be strong for her and our 8-year-old daughter. The fear, the uncertainty, the financial stress - it was overwhelming. But we decided to face it together as a team. I accompanied her to every appointment, took notes during consultations, and learned about her treatment plan. We found strength in small victories - completing each chemo session, her hair growing back, and our daughters innocent questions that made us smile. The support from our families and friends in Delhi was incredible. Today, Priya is cancer-free, and our marriage is stronger than ever. Cancer tested our relationship, but it also showed us the power of unconditional love and support. To other couples facing cancer - communicate openly, seek help when needed, and never lose hope.'
    ELSE 'My journey with cancer has taught me the value of hope, strength, and community support.'
  END,
  CASE 
    WHEN du.full_name = 'Priya Sharma' THEN 'A breast cancer survivors story of courage, treatment success, and giving back to the community.'
    WHEN du.full_name = 'Vikram Singh' THEN 'How early detection and prompt treatment helped overcome prostate cancer.'
    WHEN du.full_name = 'Kavita Jain' THEN 'Using nutrition as a powerful tool in the fight against colon cancer.'
    WHEN du.full_name = 'Raj Kumar' THEN 'The emotional journey of being a caregiver for a loved one with cancer.'
    WHEN du.full_name = 'Amit Shah' THEN 'How cancer brought a couple closer together through love and support.'
    ELSE 'A personal journey through cancer treatment and recovery.'
  END,
  CASE 
    WHEN du.cancer_type IS NOT NULL THEN 
      CASE du.cancer_type
        WHEN 'breast' THEN '30-40'
        WHEN 'prostate' THEN '50-60'
        WHEN 'colon' THEN '40-50'
        WHEN 'lung' THEN '40-50'
        ELSE '30-40'
      END
    ELSE '30-50'
  END,
  du.cancer_type,
  CASE 
    WHEN du.role = 'survivor' THEN 'inspirational'
    WHEN du.role = 'caregiver' THEN 'hopeful'
    ELSE 'hopeful'
  END,
  CASE 
    WHEN du.full_name IN ('Priya Sharma', 'Vikram Singh') THEN true
    ELSE false
  END,
  now() - (random() * interval '30 days')
FROM demo_users du
WHERE du.role IN ('survivor', 'caregiver')
LIMIT 5;

-- Create forum posts from demo users
WITH demo_users AS (
  SELECT id, full_name, role, cancer_type 
  FROM profiles 
  WHERE email LIKE '%@demo.com' 
  ORDER BY created_at DESC 
  LIMIT 8
)
INSERT INTO forum_posts (user_id, title, content, post_type, created_at)
SELECT 
  du.id,
  CASE 
    WHEN du.full_name = 'Anita Verma' THEN 'Need advice on managing chemo side effects'
    WHEN du.full_name = 'Priya Sharma' THEN 'Tips for staying positive during treatment'
    WHEN du.full_name = 'Meera Patel' THEN 'Meditation techniques for cancer patients'
    WHEN du.full_name = 'Dr. Suresh Gupta' THEN 'Understanding your cancer treatment options'
    WHEN du.full_name = 'Kavita Jain' THEN 'Nutrition tips during chemotherapy'
    WHEN du.full_name = 'Vikram Singh' THEN 'Celebrating 1 year cancer-free!'
    WHEN du.full_name = 'Raj Kumar' THEN 'Support group for caregivers in Delhi'
    ELSE 'Sharing my experience'
  END,
  CASE 
    WHEN du.full_name = 'Anita Verma' THEN 'Hi everyone, I recently started my chemo treatment at AIIMS Delhi. I am experiencing nausea and fatigue. What are some effective ways to manage these side effects? Any home remedies or tips that worked for you? I would really appreciate your suggestions.'
    WHEN du.full_name = 'Priya Sharma' THEN 'During my treatment journey, I found that maintaining a positive attitude was crucial for my recovery. Here are some things that helped me: 1) Keeping a gratitude journal 2) Staying connected with family and friends 3) Gentle exercises like walking 4) Listening to uplifting music. What keeps you motivated during tough times?'
    WHEN du.full_name = 'Meera Patel' THEN 'As a volunteer counselor, I have seen how meditation and mindfulness can significantly help cancer patients manage stress and anxiety. Simple breathing exercises, guided meditation apps, and yoga can be very beneficial. I conduct free meditation sessions every Sunday at Delhi Cancer Support Center. Feel free to join us!'
    WHEN du.full_name = 'Dr. Suresh Gupta' THEN 'Its important for patients to understand their treatment options and feel empowered to ask questions. Different types of cancer require different approaches - surgery, chemotherapy, radiation, or a combination. Always discuss with your oncologist about the best treatment plan for your specific case. Second opinions are always welcome in medicine.'
    WHEN du.full_name = 'Kavita Jain' THEN 'As a nutritionist and cancer survivor, I want to share some dietary tips that helped me during chemo: 1) Small, frequent meals 2) Stay hydrated 3) Include protein-rich foods 4) Fresh fruits and vegetables 5) Avoid processed foods. I offer free nutrition consultations for cancer patients in Delhi. Please reach out if you need help!'
    WHEN du.full_name = 'Vikram Singh' THEN 'Today marks exactly one year since I completed my prostate cancer treatment! I wanted to share this milestone with this wonderful community that supported me throughout my journey. To everyone currently fighting cancer - there is hope, there is light at the end of the tunnel. Keep fighting, keep believing!'
    WHEN du.full_name = 'Raj Kumar' THEN 'I am organizing a support group for caregivers and family members of cancer patients in Delhi. We meet every second Saturday at India Gate area. Sharing experiences, coping strategies, and emotional support. Being a caregiver can be challenging, and we need support too. Anyone interested can message me.'
    ELSE 'I wanted to share my experience with this supportive community and connect with others on similar journeys.'
  END,
  CASE 
    WHEN du.full_name IN ('Anita Verma') THEN 'question'
    WHEN du.full_name IN ('Vikram Singh') THEN 'celebration'
    WHEN du.full_name IN ('Priya Sharma', 'Meera Patel', 'Dr. Suresh Gupta', 'Kavita Jain') THEN 'support'
    ELSE 'experience'
  END,
  now() - (random() * interval '14 days')
FROM demo_users du
LIMIT 8;

-- Create events hosted by NGO and admin users
WITH demo_hosts AS (
  SELECT id, full_name, role 
  FROM profiles 
  WHERE email LIKE '%@demo.com' AND role IN ('ngo', 'admin')
  ORDER BY created_at DESC 
  LIMIT 2
)
INSERT INTO events (host_id, title, description, start_date, end_date, location, event_type, is_online, max_attendees, created_at)
SELECT 
  dh.id,
  CASE 
    WHEN row_number() OVER () = 1 THEN 'Breast Cancer Awareness Workshop'
    WHEN row_number() OVER () = 2 THEN 'Nutrition During Cancer Treatment'
    WHEN row_number() OVER () = 3 THEN 'Mental Health Support Session'
    WHEN row_number() OVER () = 4 THEN 'Caregiver Support Group Meeting'
    WHEN row_number() OVER () = 5 THEN 'Cancer Survivors Celebration'
    ELSE 'Cancer Support Event'
  END,
  CASE 
    WHEN row_number() OVER () = 1 THEN 'Join us for an informative workshop on breast cancer awareness, early detection, and treatment options. Expert oncologists from AIIMS will share insights on latest treatment advances. Free for all participants.'
    WHEN row_number() OVER () = 2 THEN 'Learn about proper nutrition during cancer treatment from qualified nutritionists. Tips for managing side effects through diet, meal planning, and healthy recipes. Includes free nutrition consultation.'
    WHEN row_number() OVER () = 3 THEN 'Mental health is crucial during cancer journey. Join our certified counselors for stress management techniques, meditation, and emotional support strategies. Open to patients and caregivers.'
    WHEN row_number() OVER () = 4 THEN 'Monthly support group meeting for caregivers and family members of cancer patients. Share experiences, coping strategies, and find emotional support in a safe environment.'
    WHEN row_number() OVER () = 5 THEN 'Celebrating the strength and courage of cancer survivors. Inspirational stories, music, refreshments, and community bonding. All survivors and their families welcome.'
    ELSE 'Community support event for cancer patients and families.'
  END,
  (current_date + interval '1 week' + (row_number() OVER () * interval '2 weeks'))::timestamp + interval '10 hours',
  (current_date + interval '1 week' + (row_number() OVER () * interval '2 weeks'))::timestamp + interval '12 hours',
  CASE 
    WHEN row_number() OVER () % 2 = 1 THEN 'AIIMS Delhi Auditorium, New Delhi'
    ELSE 'India Gate Lawns, New Delhi'
  END,
  CASE 
    WHEN row_number() OVER () <= 2 THEN 'workshop'
    WHEN row_number() OVER () <= 4 THEN 'support_group'
    ELSE 'social'
  END,
  CASE WHEN row_number() OVER () % 3 = 0 THEN true ELSE false END,
  50,
  now() - interval '2 days'
FROM demo_hosts dh, generate_series(1, 5) AS gs(n)
LIMIT 5;