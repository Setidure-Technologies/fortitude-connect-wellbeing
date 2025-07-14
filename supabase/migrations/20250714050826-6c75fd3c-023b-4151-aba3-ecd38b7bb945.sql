-- Create bulk users with Indian context (Delhi focus)
INSERT INTO public.profiles (id, email, full_name, role, age_group, location, cancer_type, bio, display_id, created_at, updated_at) VALUES
-- Patients
(gen_random_uuid(), 'amit@fortitude.in', 'Amit Sharma', 'patient', '30-39', 'Lajpat Nagar, Delhi', 'lung', 'Recent diagnosis, looking for support and guidance from the community.', get_unique_display_id(), now(), now()),
(gen_random_uuid(), 'pooja@fortitude.in', 'Pooja Verma', 'patient', '40-49', 'Dwarka, Delhi', 'breast', 'Mother of two, fighting breast cancer with determination and hope.', get_unique_display_id(), now(), now()),
(gen_random_uuid(), 'rahul@fortitude.in', 'Rahul Kumar', 'patient', '25-29', 'Rohini, Delhi', 'blood', 'Young professional dealing with leukemia, staying positive.', get_unique_display_id(), now(), now()),
(gen_random_uuid(), 'neha@fortitude.in', 'Neha Agarwal', 'patient', '35-39', 'Karol Bagh, Delhi', 'cervical', 'Teacher by profession, cancer warrior by choice.', get_unique_display_id(), now(), now()),
(gen_random_uuid(), 'rohan@fortitude.in', 'Rohan Das', 'patient', '45-49', 'Mayur Vihar, Delhi', 'prostate', 'IT professional navigating through prostate cancer treatment.', get_unique_display_id(), now(), now()),

-- Survivors
(gen_random_uuid(), 'swati@fortitude.in', 'Swati Gupta', 'survivor', '50-59', 'Vasant Kunj, Delhi', 'breast', 'Breast cancer survivor of 3 years, helping others in their journey.', get_unique_display_id(), now(), now()),
(gen_random_uuid(), 'suresh@fortitude.in', 'Suresh Joshi', 'survivor', '60-69', 'Janakpuri, Delhi', 'colon', '5-year colon cancer survivor, advocate for early detection.', get_unique_display_id(), now(), now()),
(gen_random_uuid(), 'kajal@fortitude.in', 'Kajal Patel', 'survivor', '30-39', 'Pitampura, Delhi', 'ovarian', 'Young survivor, spreading awareness about womens health.', get_unique_display_id(), now(), now()),
(gen_random_uuid(), 'arun@fortitude.in', 'Arun Bakshi', 'survivor', '55-59', 'Laxmi Nagar, Delhi', 'lung', 'Non-smoker lung cancer survivor, breaking stereotypes.', get_unique_display_id(), now(), now()),
(gen_random_uuid(), 'meena@fortitude.in', 'Meena Pandey', 'survivor', '40-49', 'Preet Vihar, Delhi', 'breast', 'Homemaker turned advocate after surviving breast cancer.', get_unique_display_id(), now(), now()),

-- Caregivers
(gen_random_uuid(), 'sharad@fortitude.in', 'Sharad Oberoi', 'caregiver', '50-59', 'Greater Kailash, Delhi', NULL, 'Husband and primary caregiver, sharing the journey of care.', get_unique_display_id(), now(), now()),
(gen_random_uuid(), 'harsh@fortitude.in', 'Harsh Patel', 'caregiver', '25-29', 'Saket, Delhi', NULL, 'Son caring for his mother during her cancer treatment.', get_unique_display_id(), now(), now()),
(gen_random_uuid(), 'ashwin@fortitude.in', 'Ashwin Hanjra', 'caregiver', '35-39', 'Hauz Khas, Delhi', NULL, 'Brother and caregiver, learning to navigate the healthcare system.', get_unique_display_id(), now(), now()),
(gen_random_uuid(), 'aarav@fortitude.in', 'Aarav Kapoor', 'caregiver', '45-49', 'Connaught Place, Delhi', NULL, 'Supportive husband, advocate for patient rights.', get_unique_display_id(), now(), now()),
(gen_random_uuid(), 'shailee@fortitude.in', 'Shailee Chaudhary', 'caregiver', '40-49', 'Kalkaji, Delhi', NULL, 'Daughter and caregiver, balancing work and care responsibilities.', get_unique_display_id(), now(), now()),

-- NGO Representatives
(gen_random_uuid(), 'nitin@fortitude.in', 'Nitin Kapoor', 'ngo', '35-39', 'New Delhi', NULL, 'Working with Delhi Cancer Foundation, organizing support programs.', get_unique_display_id(), now(), now()),
(gen_random_uuid(), 'kunal@fortitude.in', 'Kunal Patnaik', 'ngo', '40-49', 'AIIMS, New Delhi', NULL, 'Coordinator at cancer support NGO, connecting patients with resources.', get_unique_display_id(), now(), now()),
(gen_random_uuid(), 'shreya@fortitude.in', 'Shreya Dhillon', 'ngo', '30-39', 'Safdarjung, Delhi', NULL, 'Social worker specializing in cancer patient support and advocacy.', get_unique_display_id(), now(), now()),
(gen_random_uuid(), 'fatima@fortitude.in', 'Fatima Suri', 'ngo', '45-49', 'Karol Bagh, Delhi', NULL, 'NGO founder focused on cancer awareness in underserved communities.', get_unique_display_id(), now(), now()),
(gen_random_uuid(), 'kabir@fortitude.in', 'Kabir Nigam', 'ngo', '50-59', 'Rajouri Garden, Delhi', NULL, 'Program manager for cancer support initiatives across Delhi NCR.', get_unique_display_id(), now(), now()),

-- More Patients
(gen_random_uuid(), 'riya@fortitude.in', 'Riya Lal', 'patient', '25-29', 'Tilak Nagar, Delhi', 'thyroid', 'Young professional dealing with thyroid cancer, staying optimistic.', get_unique_display_id(), now(), now()),
(gen_random_uuid(), 'manish@fortitude.in', 'Manish Mohanty', 'patient', '55-59', 'Malviya Nagar, Delhi', 'kidney', 'Retired government employee, fighting kidney cancer with family support.', get_unique_display_id(), now(), now()),
(gen_random_uuid(), 'devendra@fortitude.in', 'Devendra Kulkarni', 'patient', '60-69', 'RK Puram, Delhi', 'bladder', 'Senior citizen, advocating for age-appropriate cancer care.', get_unique_display_id(), now(), now()),
(gen_random_uuid(), 'dinesh@fortitude.in', 'Dinesh Iyer', 'patient', '40-49', 'Alaknanda, Delhi', 'liver', 'Family man dealing with liver cancer, seeking support and guidance.', get_unique_display_id(), now(), now()),
(gen_random_uuid(), 'raghav@fortitude.in', 'Raghav Suri', 'patient', '35-39', 'Nehru Place, Delhi', 'testicular', 'Young father, facing testicular cancer with courage and hope.', get_unique_display_id(), now(), now()),

-- More Survivors
(gen_random_uuid(), 'pallavi@fortitude.in', 'Pallavi Pillai', 'survivor', '45-49', 'Okhla, Delhi', 'breast', 'Survivor advocating for regular screenings and early detection.', get_unique_display_id(), now(), now()),
(gen_random_uuid(), 'shraddha@fortitude.in', 'Shraddha Dwivedi', 'survivor', '35-39', 'Vikaspuri, Delhi', 'cervical', 'HPV awareness advocate and cervical cancer survivor.', get_unique_display_id(), now(), now()),
(gen_random_uuid(), 'jitendra@fortitude.in', 'Jitendra Suri', 'survivor', '50-59', 'Paschim Vihar, Delhi', 'oral', 'Oral cancer survivor, promoting tobacco cessation programs.', get_unique_display_id(), now(), now()),
(gen_random_uuid(), 'aman@fortitude.in', 'Aman Rathi', 'survivor', '30-39', 'Chattarpur, Delhi', 'bone', 'Young bone cancer survivor, inspiring others with his story.', get_unique_display_id(), now(), now()),
(gen_random_uuid(), 'keshav@fortitude.in', 'Keshav Garg', 'survivor', '40-49', 'Shalimar Bagh, Delhi', 'stomach', 'Stomach cancer survivor, advocating for healthy lifestyle changes.', get_unique_display_id(), now(), now()),

-- More Caregivers
(gen_random_uuid(), 'namrata@fortitude.in', 'Namrata Gill', 'caregiver', '35-39', 'Model Town, Delhi', NULL, 'Wife and caregiver, learning about nutritional support during treatment.', get_unique_display_id(), now(), now()),
(gen_random_uuid(), 'ankita@fortitude.in', 'Ankita Nigam', 'caregiver', '25-29', 'Kirti Nagar, Delhi', NULL, 'Sister providing emotional and practical support during treatment.', get_unique_display_id(), now(), now()),
(gen_random_uuid(), 'vijay@fortitude.in', 'Vijay Bedi', 'caregiver', '55-59', 'Green Park, Delhi', NULL, 'Father supporting his daughter through her cancer journey.', get_unique_display_id(), now(), now()),
(gen_random_uuid(), 'asha@fortitude.in', 'Asha Garg', 'caregiver', '50-59', 'Lajpat Nagar, Delhi', NULL, 'Mother and primary caregiver, seeking respite care options.', get_unique_display_id(), now(), now()),
(gen_random_uuid(), 'srishti@fortitude.in', 'Srishti Guha', 'caregiver', '30-39', 'Civil Lines, Delhi', NULL, 'Daughter balancing career and caregiving responsibilities.', get_unique_display_id(), now(), now()),

-- Volunteers
(gen_random_uuid(), 'prachi@fortitude.in', 'Prachi Shetty', 'volunteer', '25-29', 'CP, Delhi', NULL, 'Medical student volunteering with cancer patients at AIIMS.', get_unique_display_id(), now(), now()),
(gen_random_uuid(), 'yash@fortitude.in', 'Yash Goswami', 'volunteer', '30-39', 'Khan Market, Delhi', NULL, 'Corporate professional volunteering on weekends for patient support.', get_unique_display_id(), now(), now()),
(gen_random_uuid(), 'nandini@fortitude.in', 'Nandini Chaudhary', 'volunteer', '20-29', 'University Area, Delhi', NULL, 'Psychology student providing counseling support to patients.', get_unique_display_id(), now(), now()),
(gen_random_uuid(), 'rajat@fortitude.in', 'Rajat Krishna', 'volunteer', '35-39', 'Punjabi Bagh, Delhi', NULL, 'IT professional using tech skills to help cancer organizations.', get_unique_display_id(), now(), now()),
(gen_random_uuid(), 'suraj@fortitude.in', 'Suraj Mishra', 'volunteer', '40-49', 'Vasant Vihar, Delhi', NULL, 'Doctor volunteering for free cancer screenings in rural areas.', get_unique_display_id(), now(), now());

-- Create survivor stories with Indian context
INSERT INTO public.stories (user_id, title, content, excerpt, cancer_type, age_group, tone, is_featured, created_at, updated_at) VALUES
((SELECT id FROM profiles WHERE full_name = 'Swati Gupta'), 
'My Journey Through Breast Cancer in Delhi', 
'Three years ago, during a routine checkup at Max Hospital, my world changed. The words "you have breast cancer" echoed in my mind as I sat in the oncologist''s office in Saket. Being from a middle-class family in Vasant Kunj, the financial burden seemed overwhelming initially.

But Delhi''s medical infrastructure proved to be a blessing. From the excellent care at AIIMS to the support groups at Rajiv Gandhi Cancer Institute, I found hope everywhere. The most challenging part wasn''t the chemotherapy or the surgery - it was telling my elderly parents and my teenage daughter.

The community at Fortitude Network became my second family. Through online forums and offline meetups in CP, I met amazing people who understood my journey. The volunteer drivers who took me to my chemo sessions when my husband couldn''t, the survivors who shared their stories at India Gate during our support walks - these memories kept me going.

Today, I''m cancer-free and working as a peer counselor. Every Diwali, I visit the cancer ward at AIIMS to distribute sweets and hope. If you''re reading this and going through treatment, remember - you''re stronger than you know, and Delhi''s cancer community has your back.',
'A three-year breast cancer survivor from Delhi shares her journey through treatment and recovery with the support of the local medical community.',
'breast', '50-59', 'hopeful', true, now(), now()),

((SELECT id FROM profiles WHERE full_name = 'Suresh Joshi'), 
'Second Innings: Life After Colon Cancer',
'At 62, when most of my friends in Janakpuri were planning their retirement, I was learning to live with a colostomy bag. The diagnosis came as a shock - I had always been health-conscious, walking daily in the local park and eating home-cooked meals.

The surgery at BLK Hospital was successful, but the emotional journey was harder. The stigma around colostomy in our society, the changed bathroom routines, the dietary restrictions - everything felt overwhelming. My wife, bless her soul, researched everything about post-surgery care and nutrition.

What helped me most was joining the Delhi Colostomy Support Group. Meeting other survivors at their monthly meetings in Connaught Place showed me that life doesn''t stop after cancer. I learned to manage my condition, returned to my morning walks, and even started playing cricket again with my society friends.

Five years later, I''m healthier than I was before cancer. I''ve become an advocate for early screening, especially talking to men in my community who are hesitant about colonoscopy. Remember, early detection saved my life - it can save yours too.',
'A 62-year-old colon cancer survivor from Delhi shares how he rebuilt his life after surgery and found community support.',
'colon', '60-69', 'inspirational', true, now(), now()),

((SELECT id FROM profiles WHERE full_name = 'Kajal Patel'),
'Fighting Ovarian Cancer at 32: A Young Woman''s Story',
'When I was diagnosed with ovarian cancer at 32, the first question my gynecologist at Fortis asked was about my family planning. As a newly married woman living in Pitampura, this added another layer of complexity to an already overwhelming situation.

The treatment at Apollo Hospital was aggressive - surgery followed by six rounds of chemotherapy. The hardest part was losing my hair just before my first Karva Chauth. My husband shaved his head in solidarity, and we celebrated with matching bandanas.

The fertility preservation process before chemotherapy gave us hope for the future. The doctors at AIIMS fertility clinic were incredibly supportive, and knowing we had options helped me focus on getting better.

Work was another challenge. As a marketing executive, I worried about taking time off. But my company in Gurgaon was incredibly supportive, allowing flexible hours during treatment. The commute from Pitampura to Gurgaon was tough during chemo, but Delhi Metro''s priority seating helped.

Today, I''m a 2-year survivor and expecting my first child through IVF. Cancer taught me that life is precious, and every day is a gift. To young women facing this diagnosis - there''s life after cancer, and it can be beautiful.',
'A young woman from Delhi overcomes ovarian cancer while preserving her dreams of motherhood.',
'ovarian', '30-39', 'hopeful', true, now(), now()),

((SELECT id FROM profiles WHERE full_name = 'Arun Bakshi'),
'Breaking the Stereotype: Non-Smoker Lung Cancer Survivor',
'The assumption everyone made when I was diagnosed with lung cancer was that I was a heavy smoker. The truth? I had never touched a cigarette in my life. As a 58-year-old living in Laxmi Nagar, this diagnosis came completely out of the blue during a routine chest X-ray.

The pollution in Delhi might have contributed - I''ve been commuting on my motorcycle for 30 years, breathing in the city''s air without much protection. But rather than dwell on the causes, I focused on the cure.

Treatment at Sir Ganga Ram Hospital was excellent. The targeted therapy for my specific lung cancer type meant I didn''t need traditional chemotherapy. The side effects were manageable, and I could continue my work as a shopkeeper in Karol Bagh market.

The most important lesson was about air quality awareness. I now wear N95 masks regularly, have air purifiers at home, and advocate for better pollution control. I''ve connected with other lung cancer patients through Fortitude Network, and we''ve started an awareness campaign about non-smoking lung cancers.

Three years later, my scans are clear. I want everyone to know that lung cancer isn''t just a smoker''s disease, and early detection through regular checkups can save lives.',
'A Delhi shopkeeper breaks stereotypes about lung cancer while advocating for air quality awareness.',
'lung', '55-59', 'inspirational', true, now(), now()),

((SELECT id FROM profiles WHERE full_name = 'Meena Pandey'),
'From Homemaker to Health Advocate',
'I was a typical Delhi homemaker from Preet Vihar - my world revolved around my family, my kitchen, and my small social circle. At 45, breast cancer forced me to step out of my comfort zone in ways I never imagined.

The lump was discovered during a community health camp organized by our RWA. The free mammography van that visited our society literally saved my life. Treatment at GTB Hospital was challenging - the crowds, the long waits, but the care was compassionate.

What surprised me was how much I didn''t know about my own body. Cancer education became my new obsession. I learned about hormones, genetics, nutrition, and exercise. My family initially found it amusing that "mummy" was reading medical journals, but they soon became my biggest supporters.

Post-treatment, I started conducting awareness sessions for women in my society and neighboring areas. Using simple Hindi explanations, I help women understand breast self-examination and the importance of regular checkups. We''ve organized several health camps, and three early-stage cancers have been detected so far.

My kitchen experiments now focus on anti-cancer recipes. I''ve learned to make delicious, healthy meals that support recovery. Cancer took away my naivety but gave me a purpose. Today, I''m not just a cancer survivor - I''m a community health warrior.',
'A homemaker from Delhi transforms into a health advocate after surviving breast cancer.',
'breast', '40-49', 'inspirational', true, now(), now());

-- Create community forum posts with Indian context
INSERT INTO public.forum_posts (user_id, title, content, post_type, created_at, updated_at) VALUES
((SELECT id FROM profiles WHERE full_name = 'Sharad Oberoi'),
'Best Hospitals in Delhi for Cancer Treatment - Your Recommendations?',
'My wife was recently diagnosed with breast cancer, and we''re looking for the best treatment options in Delhi. We''ve consulted at AIIMS and Max Saket so far. Can fellow community members share their experiences with different hospitals?

Particularly interested in:
- Quality of oncology care
- Wait times for appointments
- Insurance acceptance (we have ESI)
- Supportive care services
- Parking and accessibility

Any recommendations for oncologists who are patient-friendly and explain things clearly would be greatly appreciated. This is all new to us, and we want to make the best decisions.

Thanks in advance for your help!',
'question', now(), now()),

((SELECT id FROM profiles WHERE full_name = 'Harsh Patel'),
'Managing Work During Cancer Treatment - Need Advice',
'I''m 27 and supporting my mother through her cancer treatment while working at a startup in Gurgaon. The commute from Saket to Gurgaon, plus hospital visits, is becoming overwhelming.

How do you balance work responsibilities with caregiving? My manager is understanding, but I don''t want to compromise my career. Has anyone successfully negotiated work-from-home arrangements during family medical emergencies?

Also looking for:
- Tips for efficient hospital visits
- Apps for managing medical appointments
- Support for young caregivers in Delhi

Would love to connect with others in similar situations.',
'question', now(), now()),

((SELECT id FROM profiles WHERE full_name = 'Swati Gupta'),
'Celebrating 3 Years Cancer-Free Today! 🎉',
'Three years ago today, I received my first clear scan results. I wanted to share this milestone with my Fortitude family because you all played such a huge role in my journey.

To anyone currently in treatment:
- The fear gets easier to manage
- Side effects are temporary, but strength is permanent
- This community is your biggest asset
- Delhi has excellent medical facilities - trust the process

Special thanks to the volunteers who drove me to AIIMS during my chemo sessions and the survivors who mentored me through the dark days.

Planning to celebrate with my family at India Gate tonight - our tradition for every milestone. Grateful beyond words! 💪❤️',
'celebration', now(), now()),

((SELECT id FROM profiles WHERE full_name = 'Nitin Kapoor'),
'Free Cancer Screening Camp - Greater Kailash - Jan 28th',
'Delhi Cancer Foundation is organizing a free cancer screening camp on January 28th at Greater Kailash Community Center (10 AM - 4 PM).

Services Available:
🔹 Breast cancer screening (mammography)
🔹 Cervical cancer screening (Pap smear)
🔹 Oral cancer screening
🔹 Basic blood tests
🔹 Doctor consultations
🔹 Health education sessions

Registration: Not required, walk-ins welcome
What to bring: ID proof, any previous medical reports

We especially encourage women above 40 and those with family history of cancer to attend. Our team includes experienced oncologists from AIIMS and Max Hospital.

Please spread the word in your society WhatsApp groups! Early detection saves lives.

Contact: 9876543210 for more details.',
'support', now(), now()),

((SELECT id FROM profiles WHERE full_name = 'Shreya Dhillon'),
'Nutrition During Chemo - Indian Food Recommendations',
'As a social worker supporting cancer patients, I often get asked about nutrition during treatment. Here are some Indian foods that are generally well-tolerated during chemotherapy:

✅ Easy to digest:
- Khichdi with ghee
- Daliya porridge
- Steamed idli/dhokla
- Coconut water
- Ginger tea

✅ Protein-rich:
- Dal preparations
- Paneer (if tolerated)
- Boiled eggs
- Protein powder in lassi

✅ For nausea:
- Ginger-based drinks
- Lemon water
- Small frequent meals
- Avoid spicy foods

❌ Avoid during low immunity:
- Street food
- Raw vegetables/salads
- Unpasteurized dairy
- Leftover foods

Always consult your oncologist before making dietary changes. Every patient is different!

What foods helped you during treatment? Share your experiences below 👇',
'support', now(), now()),

((SELECT id FROM profiles WHERE full_name = 'Prachi Shetty'),
'Medical Student Seeking Cancer Patient Perspectives',
'I''m a final-year MBBS student at MAMC, and I''m writing my thesis on patient experiences with cancer care in Delhi. I would be grateful if survivors and current patients could share:

1. What information did you wish you had at diagnosis?
2. Which hospital services were most helpful?
3. What gaps did you notice in patient support?
4. How can medical education better prepare doctors for cancer care?

Your insights will help train future doctors to provide more compassionate care. All responses will be kept confidential and used only for academic purposes.

You can reply here or message me privately. Thank you for helping improve cancer care in Delhi! 🩺📚',
'question', now(), now()),

((SELECT id FROM profiles WHERE full_name = 'Kajal Patel'),
'Fertility Preservation Before Cancer Treatment - My Experience',
'When I was diagnosed with ovarian cancer at 32, fertility preservation became a critical part of my treatment plan. I wanted to share my experience to help other young women facing similar decisions.

The process at AIIMS Fertility Clinic:
🔹 Initial consultation with reproductive endocrinologist
🔹 Hormone injections for 10-12 days
🔹 Egg retrieval procedure (under anesthesia)
🔹 Embryo/egg freezing

Timeline: The entire process took about 2 weeks, which delayed my cancer treatment slightly, but my oncologist assured me it was safe.

Cost: Around ₹1.5-2 lakhs (including medications and storage)
Insurance: Most policies don''t cover this, but some hospitals offer payment plans

Emotional impact: Knowing I had preserved my fertility helped me focus on getting better without losing hope for future motherhood.

Happy to report: I''m now pregnant through IVF, 2 years post-treatment! 

Questions welcome - here to support other young women navigating this decision. 💕',
'experience', now(), now());

-- Create community events for next 3 months (Delhi context)
INSERT INTO public.events (host_id, title, description, start_date, end_date, location, event_type, is_online, max_attendees, created_at, updated_at) VALUES
-- January Events
((SELECT id FROM profiles WHERE full_name = 'Nitin Kapoor'),
'Monthly Support Group Meet - January',
'Join us for our monthly in-person support group meeting. This month we''ll focus on "Managing Treatment Side Effects During Delhi Winter" and "Nutrition Tips for Better Recovery".

Agenda:
- Welcome & introductions (30 mins)
- Guest speaker: Dr. Meera Sharma, Nutritionist from Max Hospital (45 mins)
- Group discussion: Winter care tips (30 mins)
- Tea/coffee and healthy snacks
- Resource sharing and networking

Open to patients, survivors, and caregivers. Free attendance, but registration required for refreshment planning.

Venue has heating, wheelchair access, and nearby metro connectivity.

Looking forward to seeing familiar faces and welcoming newcomers to our supportive community!',
'2025-01-25 15:00:00+05:30',
'2025-01-25 18:00:00+05:30',
'India International Centre, Max Mueller Marg, New Delhi',
'support_group',
false,
50,
now(), now()),

((SELECT id FROM profiles WHERE full_name = 'Shreya Dhillon'),
'Free Cancer Awareness Workshop for Women',
'A comprehensive workshop designed for women to understand cancer prevention, early detection, and available support systems in Delhi.

Workshop Highlights:
🌟 Breast & Cervical Cancer Screening Guidelines
🌟 Self-Examination Techniques (Live Demo)
🌟 Understanding Risk Factors
🌟 Delhi''s Healthcare Resources & Insurance Navigation
🌟 Q&A with Oncology Experts
🌟 Free Basic Health Checkups

Target Audience: Women aged 25+, family members, community health volunteers

Special Features:
- Sessions in Hindi and English
- Take-home information kits
- Directory of affordable healthcare providers
- Connect with local support groups

Light refreshments provided. Bring a friend and empower each other with knowledge!

Register: Call 011-XXXXXXX or email info@delhicancerfoundation.org',
'2025-01-18 10:00:00+05:30',
'2025-01-18 16:00:00+05:30',
'Thyagraj Stadium Community Hall, INA, New Delhi',
'workshop',
false,
100,
now(), now()),

-- February Events
((SELECT id FROM profiles WHERE full_name = 'Kabir Nigam'),
'World Cancer Day Awareness Walk 2025',
'Join hundreds of cancer survivors, fighters, families, and supporters for our annual World Cancer Day Awareness Walk through the heart of Delhi.

Route: India Gate → Rajpath → Raisina Hill → Back to India Gate (5 KM)

Event Schedule:
6:30 AM - Registration & Breakfast
7:30 AM - Opening Ceremony with Chief Guest
8:00 AM - Walk Begins
9:30 AM - Concluding Ceremony at India Gate
10:00 AM - Community Expo & Health Camps

Highlights:
🚶‍♀️ Non-competitive, family-friendly walk
🎗️ Free "I Can, We Can" t-shirts for participants
📋 Free health screenings at finish line
🎪 Cancer resources expo
🎵 Cultural performances by survivors

Registration includes: T-shirt, breakfast, certificate, goody bag with health resources

Register online or on-site. Let''s unite Delhi against cancer!',
'2025-02-04 06:30:00+05:30',
'2025-02-04 11:00:00+05:30',
'India Gate Lawns, Rajpath, New Delhi',
'awareness_walk',
false,
500,
now(), now()),

((SELECT id FROM profiles WHERE full_name = 'Kunal Patnaik'),
'Caregivers'' Wellness & Self-Care Workshop',
'A dedicated workshop for the unsung heroes - the caregivers. Taking care of yourself while caring for a loved one with cancer.

Workshop Modules:
💆‍♀️ Stress Management Techniques
🧘‍♂️ Mindfulness & Meditation for Caregivers
💪 Physical Health Maintenance
🗣️ Communication Skills with Healthcare Teams
👥 Building Support Networks
💰 Financial Planning During Treatment
⚖️ Balancing Work, Family & Caregiving

Expert Speakers:
- Dr. Priya Nair, Psycho-oncologist, AIIMS
- Yoga Instructor: Certified meditation teacher
- Financial Advisor: Cancer treatment planning specialist
- Experienced caregiver panel

Special Features:
- Separate childcare arrangements available
- Resource directory for Delhi caregivers
- Follow-up support group formation
- Free stress-relief kit for participants

Because you matter too! Register now.',
'2025-02-15 09:00:00+05:30',
'2025-02-15 17:00:00+05:30',
'Habitat Centre, Lodhi Road, New Delhi',
'workshop',
false,
75,
now(), now()),

-- March Events
((SELECT id FROM profiles WHERE full_name = 'Fatima Suri'),
'Delhi Cancer Survivors Success Stories Panel',
'An inspiring evening celebrating the strength, resilience, and achievements of cancer survivors from across Delhi. Hear their stories, learn from their journeys, and get motivated!

Featured Speakers:
🌟 Rajesh Kumar - 10-year survivor, started cancer support NGO
🌟 Priya Mehta - Survivor turned oncology nurse
🌟 Suresh Agarwal - Returned to marathon running post-treatment
🌟 Meera Joshi - Author of "Cancer Cannot Define Me"
🌟 Arjun Gupta - Survivor who became motivational speaker

Panel Topics:
- Life after cancer: Career, relationships, dreams
- Overcoming treatment challenges in Delhi
- Building resilience and mental strength
- Giving back to the cancer community
- Advice for newly diagnosed patients

Interactive Session:
- Q&A with panelists
- Networking with survivors
- Resource sharing
- Book signing & photo opportunities

Open to patients, families, medical professionals, and anyone seeking inspiration!',
'2025-03-08 17:00:00+05:30',
'2025-03-08 20:00:00+05:30',
'Constitution Club of India, Rafi Marg, New Delhi',
'panel_discussion',
false,
150,
now(), now()),

((SELECT id FROM profiles WHERE full_name = 'Yash Goswami'),
'Technology & Cancer Care: Digital Health Workshop',
'Learn how technology can simplify your cancer journey. A hands-on workshop for patients, caregivers, and families to leverage digital tools for better health management.

Workshop Content:
📱 Essential Health Apps Demo
- Appointment scheduling apps
- Medication reminder tools
- Symptom tracking applications
- Telemedicine platforms used in Delhi

🌐 Online Resources Navigation
- Reliable cancer information websites
- Delhi hospital online services
- Insurance claim processes online
- Support group platforms

💻 Digital Health Records Management
- Organizing medical reports digitally
- Sharing records with multiple doctors
- Backup and security best practices

🤖 AI Tools for Health
- Symptom checkers (when to use/avoid)
- Nutrition tracking apps
- Mental health support chatbots

Hands-on Practice:
- Bring your smartphones/tablets
- Individual guidance available
- Create your digital health toolkit
- Connect with online communities

Free WiFi, charging stations, and tech support volunteers available!',
'2025-03-22 10:00:00+05:30',
'2025-03-22 16:00:00+05:30',
'Delhi Technological University, Shahbad Daulatpur, Delhi',
'workshop',
false,
80,
now(), now());

-- Update community stats
UPDATE public.community_stats 
SET 
  total_members = (SELECT COUNT(*) FROM profiles),
  total_stories = (SELECT COUNT(*) FROM stories),
  total_events = (SELECT COUNT(*) FROM events),
  updated_at = now()
WHERE id = (SELECT id FROM community_stats LIMIT 1);