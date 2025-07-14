-- Create community events for next 3 months (Delhi context) - 2 per month
INSERT INTO public.events (host_id, title, description, start_date, end_date, location, event_type, is_online, max_attendees, created_at, updated_at) VALUES
-- January Events
('c42e039b-41ec-40a8-866f-c144f65d0251',
'Monthly Support Group Meet - January 2025',
'Join us for our monthly in-person support group meeting. This month we''ll focus on "Managing Treatment Side Effects During Delhi Winter" and "Nutrition Tips for Better Recovery".

Agenda:
- Welcome & introductions (30 mins)
- Guest speaker: Dr. Meera Sharma, Nutritionist from Max Hospital (45 mins)
- Group discussion: Winter care tips (30 mins)
- Tea/coffee and healthy snacks
- Resource sharing and networking

Open to patients, survivors, and caregivers. Free attendance, but registration required for refreshment planning.

Venue has heating, wheelchair access, and nearby metro connectivity (Central Secretariat Station).

Looking forward to seeing familiar faces and welcoming newcomers to our supportive community!',
'2025-01-25 15:00:00+05:30',
'2025-01-25 18:00:00+05:30',
'India International Centre, Max Mueller Marg, New Delhi',
'support_group',
false,
50,
now(), now()),

('c42e039b-41ec-40a8-866f-c144f65d0251',
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
('c42e039b-41ec-40a8-866f-c144f65d0251',
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

('c42e039b-41ec-40a8-866f-c144f65d0251',
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
('c42e039b-41ec-40a8-866f-c144f65d0251',
'Delhi Cancer Survivors Success Stories Panel',
'An inspiring evening celebrating the strength, resilience, and achievements of cancer survivors from across Delhi. Hear their stories, learn from their journeys, and get motivated!

Featured Panel Topics:
🌟 Life after cancer: Career, relationships, dreams
🌟 Overcoming treatment challenges in Delhi
🌟 Building resilience and mental strength
🌟 Giving back to the cancer community
🌟 Advice for newly diagnosed patients

Speakers Include:
- Business leaders who returned to work post-treatment
- Artists who found new creative expression
- Athletes who resumed sports after recovery
- Community advocates making a difference

Interactive Session:
- Q&A with panelists
- Networking with survivors
- Resource sharing
- Inspiration and motivation

Open to patients, families, medical professionals, and anyone seeking inspiration!

Venue: Easily accessible by metro (Mandi House Station)',
'2025-03-08 17:00:00+05:30',
'2025-03-08 20:00:00+05:30',
'Constitution Club of India, Rafi Marg, New Delhi',
'panel_discussion',
false,
150,
now(), now()),

('c42e039b-41ec-40a8-866f-c144f65d0251',
'Technology & Cancer Care: Digital Health Workshop',
'Learn how technology can simplify your cancer journey. A hands-on workshop for patients, caregivers, and families to leverage digital tools for better health management.

Workshop Content:
📱 Essential Health Apps Demo
- Appointment scheduling apps (Practo, Apollo, etc.)
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
- ABHA (Ayushman Bharat Health Account) setup

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