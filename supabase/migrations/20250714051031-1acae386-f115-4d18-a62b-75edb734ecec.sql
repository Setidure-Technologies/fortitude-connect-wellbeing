-- Create survivor stories with Indian context using existing user
INSERT INTO public.stories (user_id, title, content, excerpt, cancer_type, age_group, tone, is_featured, created_at, updated_at) VALUES
('c42e039b-41ec-40a8-866f-c144f65d0251', 
'My Journey Through Breast Cancer in Delhi', 
'Three years ago, during a routine checkup at Max Hospital, my world changed. The words "you have breast cancer" echoed in my mind as I sat in the oncologist''s office in Saket. Being from a middle-class family in Vasant Kunj, the financial burden seemed overwhelming initially.

But Delhi''s medical infrastructure proved to be a blessing. From the excellent care at AIIMS to the support groups at Rajiv Gandhi Cancer Institute, I found hope everywhere. The most challenging part wasn''t the chemotherapy or the surgery - it was telling my elderly parents and my teenage daughter.

The community at Fortitude Network became my second family. Through online forums and offline meetups in CP, I met amazing people who understood my journey. The volunteer drivers who took me to my chemo sessions when my husband couldn''t, the survivors who shared their stories at India Gate during our support walks - these memories kept me going.

Today, I''m cancer-free and working as a peer counselor. Every Diwali, I visit the cancer ward at AIIMS to distribute sweets and hope. If you''re reading this and going through treatment, remember - you''re stronger than you know, and Delhi''s cancer community has your back.',
'A three-year breast cancer survivor from Delhi shares her journey through treatment and recovery with the support of the local medical community.',
'breast', '50-59', 'hopeful', true, now(), now()),

('c42e039b-41ec-40a8-866f-c144f65d0251', 
'Second Innings: Life After Colon Cancer',
'At 62, when most of my friends in Janakpuri were planning their retirement, I was learning to live with a colostomy bag. The diagnosis came as a shock - I had always been health-conscious, walking daily in the local park and eating home-cooked meals.

The surgery at BLK Hospital was successful, but the emotional journey was harder. The stigma around colostomy in our society, the changed bathroom routines, the dietary restrictions - everything felt overwhelming. My wife, bless her soul, researched everything about post-surgery care and nutrition.

What helped me most was joining the Delhi Colostomy Support Group. Meeting other survivors at their monthly meetings in Connaught Place showed me that life doesn''t stop after cancer. I learned to manage my condition, returned to my morning walks, and even started playing cricket again with my society friends.

Five years later, I''m healthier than I was before cancer. I''ve become an advocate for early screening, especially talking to men in my community who are hesitant about colonoscopy. Remember, early detection saved my life - it can save yours too.',
'A 62-year-old colon cancer survivor from Delhi shares how he rebuilt his life after surgery and found community support.',
'colon', '60-69', 'inspirational', true, now(), now()),

('c42e039b-41ec-40a8-866f-c144f65d0251',
'Fighting Cancer at 32: A Young Professional''s Story',
'When I was diagnosed with cancer at 32, the first thing that came to mind was my career. As a software engineer working in Gurgaon and living in Pitampura, this added another layer of complexity to an already overwhelming situation.

The treatment at Apollo Hospital was aggressive - surgery followed by six rounds of chemotherapy. The hardest part was losing my hair just before my company''s annual function. My colleagues rallied around me, organizing work from home options and covering my responsibilities.

The commute from Pitampura to Gurgaon was tough during chemo, but Delhi Metro''s priority seating helped immensely. My company''s health insurance covered most expenses, and HR was incredibly supportive with flexible working hours.

Work was another challenge. I worried about taking time off and falling behind in my career. But I realized that health comes first, and a good company will always support you through difficult times.

Today, I''m a 2-year survivor and have been promoted to a senior role. Cancer taught me that life is precious, and every day is a gift. To young professionals facing this diagnosis - there''s life after cancer, and your career can thrive too.',
'A young professional from Delhi overcomes cancer while balancing career and treatment.',
'other', '30-39', 'hopeful', true, now(), now()),

('c42e039b-41ec-40a8-866f-c144f65d0251',
'Breaking the Stereotype: Non-Smoker Lung Cancer Survivor',
'The assumption everyone made when I was diagnosed with lung cancer was that I was a heavy smoker. The truth? I had never touched a cigarette in my life. As a 58-year-old living in Laxmi Nagar, this diagnosis came completely out of the blue during a routine chest X-ray.

The pollution in Delhi might have contributed - I''ve been commuting on my motorcycle for 30 years, breathing in the city''s air without much protection. But rather than dwell on the causes, I focused on the cure.

Treatment at Sir Ganga Ram Hospital was excellent. The targeted therapy for my specific lung cancer type meant I didn''t need traditional chemotherapy. The side effects were manageable, and I could continue my work as a shopkeeper in Karol Bagh market.

The most important lesson was about air quality awareness. I now wear N95 masks regularly, have air purifiers at home, and advocate for better pollution control. I''ve connected with other lung cancer patients through Fortitude Network, and we''ve started an awareness campaign about non-smoking lung cancers.

Three years later, my scans are clear. I want everyone to know that lung cancer isn''t just a smoker''s disease, and early detection through regular checkups can save lives.',
'A Delhi shopkeeper breaks stereotypes about lung cancer while advocating for air quality awareness.',
'lung', '55-59', 'inspirational', true, now(), now()),

('c42e039b-41ec-40a8-866f-c144f65d0251',
'From Homemaker to Health Advocate',
'I was a typical Delhi homemaker from Preet Vihar - my world revolved around my family, my kitchen, and my small social circle. At 45, breast cancer forced me to step out of my comfort zone in ways I never imagined.

The lump was discovered during a community health camp organized by our RWA. The free mammography van that visited our society literally saved my life. Treatment at GTB Hospital was challenging - the crowds, the long waits, but the care was compassionate.

What surprised me was how much I didn''t know about my own body. Cancer education became my new obsession. I learned about hormones, genetics, nutrition, and exercise. My family initially found it amusing that "mummy" was reading medical journals, but they soon became my biggest supporters.

Post-treatment, I started conducting awareness sessions for women in my society and neighboring areas. Using simple Hindi explanations, I help women understand breast self-examination and the importance of regular checkups. We''ve organized several health camps, and three early-stage cancers have been detected so far.

My kitchen experiments now focus on anti-cancer recipes. I''ve learned to make delicious, healthy meals that support recovery. Cancer took away my naivety but gave me a purpose. Today, I''m not just a cancer survivor - I''m a community health warrior.',
'A homemaker from Delhi transforms into a health advocate after surviving breast cancer.',
'breast', '40-49', 'inspirational', true, now(), now());