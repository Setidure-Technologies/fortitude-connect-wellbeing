-- Create bulk users with Indian context (Delhi focus) - Fixed cancer types
INSERT INTO public.profiles (id, email, full_name, role, age_group, location, cancer_type, bio, display_id, created_at, updated_at) VALUES
-- Patients
(gen_random_uuid(), 'amit@fortitude.in', 'Amit Sharma', 'patient', '30-39', 'Lajpat Nagar, Delhi', 'lung', 'Recent diagnosis, looking for support and guidance from the community.', get_unique_display_id(), now(), now()),
(gen_random_uuid(), 'pooja@fortitude.in', 'Pooja Verma', 'patient', '40-49', 'Dwarka, Delhi', 'breast', 'Mother of two, fighting breast cancer with determination and hope.', get_unique_display_id(), now(), now()),
(gen_random_uuid(), 'rahul@fortitude.in', 'Rahul Kumar', 'patient', '25-29', 'Rohini, Delhi', 'blood', 'Young professional dealing with leukemia, staying positive.', get_unique_display_id(), now(), now()),
(gen_random_uuid(), 'neha@fortitude.in', 'Neha Agarwal', 'patient', '35-39', 'Karol Bagh, Delhi', 'other', 'Teacher by profession, cancer warrior by choice.', get_unique_display_id(), now(), now()),
(gen_random_uuid(), 'rohan@fortitude.in', 'Rohan Das', 'patient', '45-49', 'Mayur Vihar, Delhi', 'prostate', 'IT professional navigating through prostate cancer treatment.', get_unique_display_id(), now(), now()),

-- Survivors
(gen_random_uuid(), 'swati@fortitude.in', 'Swati Gupta', 'survivor', '50-59', 'Vasant Kunj, Delhi', 'breast', 'Breast cancer survivor of 3 years, helping others in their journey.', get_unique_display_id(), now(), now()),
(gen_random_uuid(), 'suresh@fortitude.in', 'Suresh Joshi', 'survivor', '60-69', 'Janakpuri, Delhi', 'colon', '5-year colon cancer survivor, advocate for early detection.', get_unique_display_id(), now(), now()),
(gen_random_uuid(), 'kajal@fortitude.in', 'Kajal Patel', 'survivor', '30-39', 'Pitampura, Delhi', 'other', 'Young survivor, spreading awareness about womens health.', get_unique_display_id(), now(), now()),
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
(gen_random_uuid(), 'riya@fortitude.in', 'Riya Lal', 'patient', '25-29', 'Tilak Nagar, Delhi', 'other', 'Young professional dealing with thyroid cancer, staying optimistic.', get_unique_display_id(), now(), now()),
(gen_random_uuid(), 'manish@fortitude.in', 'Manish Mohanty', 'patient', '55-59', 'Malviya Nagar, Delhi', 'other', 'Retired government employee, fighting kidney cancer with family support.', get_unique_display_id(), now(), now()),
(gen_random_uuid(), 'devendra@fortitude.in', 'Devendra Kulkarni', 'patient', '60-69', 'RK Puram, Delhi', 'other', 'Senior citizen, advocating for age-appropriate cancer care.', get_unique_display_id(), now(), now()),
(gen_random_uuid(), 'dinesh@fortitude.in', 'Dinesh Iyer', 'patient', '40-49', 'Alaknanda, Delhi', 'other', 'Family man dealing with liver cancer, seeking support and guidance.', get_unique_display_id(), now(), now()),
(gen_random_uuid(), 'raghav@fortitude.in', 'Raghav Suri', 'patient', '35-39', 'Nehru Place, Delhi', 'other', 'Young father, facing testicular cancer with courage and hope.', get_unique_display_id(), now(), now()),

-- More Survivors
(gen_random_uuid(), 'pallavi@fortitude.in', 'Pallavi Pillai', 'survivor', '45-49', 'Okhla, Delhi', 'breast', 'Survivor advocating for regular screenings and early detection.', get_unique_display_id(), now(), now()),
(gen_random_uuid(), 'shraddha@fortitude.in', 'Shraddha Dwivedi', 'survivor', '35-39', 'Vikaspuri, Delhi', 'other', 'HPV awareness advocate and cervical cancer survivor.', get_unique_display_id(), now(), now()),
(gen_random_uuid(), 'jitendra@fortitude.in', 'Jitendra Suri', 'survivor', '50-59', 'Paschim Vihar, Delhi', 'other', 'Oral cancer survivor, promoting tobacco cessation programs.', get_unique_display_id(), now(), now()),
(gen_random_uuid(), 'aman@fortitude.in', 'Aman Rathi', 'survivor', '30-39', 'Chattarpur, Delhi', 'other', 'Young bone cancer survivor, inspiring others with his story.', get_unique_display_id(), now(), now()),
(gen_random_uuid(), 'keshav@fortitude.in', 'Keshav Garg', 'survivor', '40-49', 'Shalimar Bagh, Delhi', 'other', 'Stomach cancer survivor, advocating for healthy lifestyle changes.', get_unique_display_id(), now(), now()),

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