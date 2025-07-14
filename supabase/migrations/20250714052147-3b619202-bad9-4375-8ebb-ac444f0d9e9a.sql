-- Create inspiring stories using existing user accounts
INSERT INTO stories (user_id, title, content, excerpt, age_group, cancer_type, tone, is_featured, created_at) VALUES
(
  '8bee96fc-25e8-4b56-8bc5-f8d9447e8988', 
  'My Victory Over Breast Cancer',
  'When I was diagnosed with breast cancer at 34, my world turned upside down. As a working professional in Delhi, I was scared about my future and my familys well-being. The initial shock gave way to determination. Through chemotherapy, surgery, and radiation, I found strength I never knew I had. The support from my family and the medical team at AIIMS was incredible. Today, 2 years post-treatment, I am cancer-free and more grateful for life than ever. I want other women to know that breast cancer is not a death sentence. Early detection, proper treatment, and a positive mindset can work miracles. I now volunteer with cancer support groups in Delhi, sharing my story to give hope to others. Every day is a gift, and I make sure to live it fully.',
  'A breast cancer survivors story of courage, treatment success, and giving back to the community.',
  '30-40',
  'breast',
  'inspirational',
  true,
  now() - interval '1 month'
),
(
  '7ef8cfa3-2db2-44b6-a0dc-3c3ead895fed',
  'Early Detection Saved My Life',
  'At 28, I never thought cancer would touch my life. I was always healthy, never missed my morning walks. But during a routine check-up, some abnormal results led to further testing. The diagnosis was shocking but because we caught it early, the treatment options were excellent. I underwent surgery and targeted therapy at a leading hospital in Delhi. The recovery was challenging, but the support from my family and friends kept me going. Its been 18 months since my treatment, and my latest tests show no signs of cancer. I now advocate for regular health check-ups, especially for young adults. Dont ignore the warning signs - early detection truly saves lives.',
  'How early detection and prompt treatment helped overcome cancer at a young age.',
  '25-35',
  'breast',
  'hopeful',
  true,
  now() - interval '3 weeks'
),
(
  '0962bde2-8ad2-4784-b7a9-905b2103e896',
  'Fighting Cancer with Nutrition',
  'My battle with cancer began with symptoms I initially ignored - fatigue and changes in my daily routine. As someone interested in health and nutrition, I thought I knew my body well. When the diagnosis came, I was shocked. Stage 2 cancer at 25. The treatment included surgery and chemotherapy. During this journey, I realized how crucial nutrition is during cancer treatment. I worked closely with my oncologist to develop meal plans that helped manage side effects and boost my immune system. Fresh fruits, whole grains, and plenty of water became my medicine. Today, I am in remission and have started sharing nutrition tips with other patients. Food can be medicine, and I want to help others heal through proper nutrition during their cancer journey.',
  'Using nutrition as a powerful tool in the fight against cancer.',
  '25-35',
  'colon',
  'inspirational',
  false,
  now() - interval '2 weeks'
),
(
  '3f95954e-42bd-493c-8d9c-9ea1fe9512fd',
  'A Caregivers Journey of Love',
  'When my wife was diagnosed with cancer, our entire family was shaken. As her husband, I took on the role of primary caregiver while continuing my work. The daily trips to hospital, managing medications, and seeing my strong wife become vulnerable was emotionally draining. There were days when I felt overwhelmed and helpless. I learned that being a caregiver means taking care of yourself too. I joined a support group for caregivers at a cancer hospital in Delhi. Sharing experiences with other caregivers helped me cope better. My wife fought bravely and today she is in remission. Though the journey was challenging, I gained immense respect for the strength of cancer patients and their families. I now volunteer to support other caregivers, because no one should face this journey alone.',
  'The emotional journey of being a caregiver for a loved one with cancer.',
  '50-60',
  'breast',
  'hopeful',
  false,
  now() - interval '1 week'
),
(
  '8c95bd75-9b39-4301-9c09-3f90bc8ba9d5',
  'Standing Strong Together',
  'When I was diagnosed with cancer, my family and I decided to face it together as a team. The fear, the uncertainty, the financial stress - it was overwhelming. But we found strength in small victories - completing each treatment session, maintaining a positive attitude, and the support from our community. The support from our families and friends was incredible. Today, I am responding well to treatment, and our family bond is stronger than ever. Cancer tested our relationships, but it also showed us the power of unconditional love and support. To other families facing cancer - communicate openly, seek help when needed, and never lose hope.',
  'How cancer brought a family closer together through love and support.',
  '20-30',
  'blood',
  'hopeful',
  false,
  now() - interval '5 days'
);

-- Create forum posts using existing users
INSERT INTO forum_posts (user_id, title, content, post_type, created_at) VALUES
(
  '4bb4ba00-1483-496f-9357-bec140f4735d',
  'Need advice on managing treatment side effects',
  'Hi everyone, I recently started my treatment at a hospital in Delhi. I am experiencing some side effects like nausea and fatigue. What are some effective ways to manage these? Any home remedies or tips that worked for you? I would really appreciate your suggestions.',
  'question',
  now() - interval '3 days'
),
(
  '8bee96fc-25e8-4b56-8bc5-f8d9447e8988',
  'Tips for staying positive during treatment',
  'During my treatment journey, I found that maintaining a positive attitude was crucial for my recovery. Here are some things that helped me: 1) Keeping a gratitude journal 2) Staying connected with family and friends 3) Gentle exercises like walking 4) Listening to uplifting music. What keeps you motivated during tough times?',
  'support',
  now() - interval '5 days'
),
(
  '7ef8cfa3-2db2-44b6-a0dc-3c3ead895fed',
  'Meditation techniques for patients',
  'I have found that meditation and mindfulness can significantly help cancer patients manage stress and anxiety. Simple breathing exercises, guided meditation apps, and yoga can be very beneficial. I would love to share some techniques that helped me. What relaxation methods have worked for you?',
  'support',
  now() - interval '1 week'
),
(
  'c42e039b-41ec-40a8-866f-c144f65d0251',
  'Understanding your treatment options',
  'Its important for patients to understand their treatment options and feel empowered to ask questions. Different situations require different approaches. Always discuss with your healthcare team about the best plan for your specific case. Second opinions are always welcome in healthcare.',
  'support',
  now() - interval '10 days'
),
(
  '0962bde2-8ad2-4784-b7a9-905b2103e896',
  'Nutrition tips during treatment',
  'I want to share some dietary tips that helped me during treatment: 1) Small, frequent meals 2) Stay hydrated 3) Include protein-rich foods 4) Fresh fruits and vegetables 5) Avoid processed foods. Good nutrition really made a difference in how I felt during treatment. What foods helped you?',
  'support',
  now() - interval '2 weeks'
),
(
  '8c95bd75-9b39-4301-9c09-3f90bc8ba9d5',
  'Celebrating small victories',
  'Today marks an important milestone in my treatment journey! I wanted to share this with this wonderful community that has supported me. To everyone currently going through treatment - there is hope, there is light at the end of the tunnel. Keep fighting, keep believing!',
  'celebration',
  now() - interval '2 days'
),
(
  '3f95954e-42bd-493c-8d9c-9ea1fe9512fd',
  'Support group for caregivers',
  'I am interested in connecting with other caregivers and family members of cancer patients. We could share experiences, coping strategies, and emotional support. Being a caregiver can be challenging, and we need support too. Anyone interested in forming a support network?',
  'question',
  now() - interval '1 week'
),
(
  '4bb4ba00-1483-496f-9357-bec140f4735d',
  'Sharing my experience',
  'I wanted to share my experience with this supportive community and connect with others on similar journeys. The support and encouragement from everyone here has been incredible. Thank you for creating such a safe space to share our stories.',
  'experience',
  now() - interval '4 days'
);

-- Create events hosted by admin users
INSERT INTO events (host_id, title, description, start_date, end_date, location, event_type, is_online, max_attendees, created_at) VALUES
(
  '8bee96fc-25e8-4b56-8bc5-f8d9447e8988',
  'Cancer Awareness Workshop',
  'Join us for an informative workshop on cancer awareness, early detection, and treatment options. Healthcare professionals will share insights on latest treatment advances and support resources. Free for all participants.',
  (current_date + interval '1 week')::timestamp + interval '10 hours',
  (current_date + interval '1 week')::timestamp + interval '12 hours',
  'Community Center, Delhi',
  'workshop',
  false,
  50,
  now() - interval '2 days'
),
(
  '7ef8cfa3-2db2-44b6-a0dc-3c3ead895fed',
  'Nutrition During Treatment Session',
  'Learn about proper nutrition during cancer treatment from qualified nutritionists. Tips for managing side effects through diet, meal planning, and healthy recipes. Includes free nutrition consultation.',
  (current_date + interval '2 weeks')::timestamp + interval '14 hours',
  (current_date + interval '2 weeks')::timestamp + interval '16 hours',
  'Online Session',
  'workshop',
  true,
  30,
  now() - interval '1 day'
),
(
  'c42e039b-41ec-40a8-866f-c144f65d0251',
  'Mental Health Support Session',
  'Mental health is crucial during the cancer journey. Join certified counselors for stress management techniques, meditation, and emotional support strategies. Open to patients and caregivers.',
  (current_date + interval '3 weeks')::timestamp + interval '15 hours',
  (current_date + interval '3 weeks')::timestamp + interval '17 hours',
  'Delhi Cancer Support Center',
  'support_group',
  false,
  25,
  now() - interval '3 days'
),
(
  '0962bde2-8ad2-4784-b7a9-905b2103e896',
  'Caregiver Support Group Meeting',
  'Monthly support group meeting for caregivers and family members of cancer patients. Share experiences, coping strategies, and find emotional support in a safe environment.',
  (current_date + interval '4 weeks')::timestamp + interval '11 hours',
  (current_date + interval '4 weeks')::timestamp + interval '13 hours',
  'Community Hall, Delhi',
  'support_group',
  false,
  20,
  now() - interval '1 day'
),
(
  '8bee96fc-25e8-4b56-8bc5-f8d9447e8988',
  'Cancer Survivors Celebration',
  'Celebrating the strength and courage of cancer survivors. Inspirational stories, music, refreshments, and community bonding. All survivors and their families welcome.',
  (current_date + interval '6 weeks')::timestamp + interval '16 hours',
  (current_date + interval '6 weeks')::timestamp + interval '19 hours',
  'India Gate Lawns, New Delhi',
  'social',
  false,
  100,
  now() - interval '2 days'
);