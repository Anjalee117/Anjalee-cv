begin;
-- Run this in the SQL Editor AFTER schema.sql. It populates the site with your
-- actual resume content so you're not starting from an empty admin panel.
-- FIRST-TIME SETUP ONLY: rerunning replaces all edited sections and projects.
--
-- NOTE: the LinkedIn/GitHub lines on your resume PDF ("Linked-Anjalee\dev",
-- "Anjalee\git\dev.co") read like placeholder text rather than real URLs, so
-- linkedin_url/github_url are left blank below — fill them in from /admin
-- once you've got the real links.

-- ============ PROFILE ============
update profile set
  name = 'Anjalee',
  tagline = 'PRODUCT
MINDED.
WEB BUILT.',
  bio = 'Aspiring Product Manager passionate about building user-centric digital products that solve real-world problems. Experienced in leading cross-functional initiatives, organizing technology communities, and turning ideas into scalable solutions through product thinking, user research, and data-driven decisions.',
  roles = array['Product Management','Web Development'],
  email = 'anjaleemalhotra305@gmail.com',
  accent_color = '#EE8FB5'
where id = 1;

-- ============ SECTIONS ============
delete from sections;

insert into sections (title, layout, content, position, visible) values
('Education', 'cards', '{"items": [
  {"title": "Atria Institute of Technology", "body": "Bachelor of Engineering, Computer Science Engineering", "tag": "2024–2028 · CGPA 9.42"},
  {"title": "Kendriya Vidyalaya Hebbal", "body": "Higher Secondary", "tag": "2018–2024 · 84.5%"}
]}'::jsonb, 0, true),

('Experience', 'cards', '{"items": [
  {"title": "Event Operations Lead — OSCode Atria Chapter", "tag": "Sept 2025 – Present", "body": "Led planning and execution of technical events and community initiatives; coordinated volunteers, speakers, and stakeholders for smooth delivery."},
  {"title": "Guest Speaker, Garden City University", "tag": "Jun 2026", "body": "Led a hands-on workshop on Salesforce Agentforce, guiding students through building AI-powered agents with live demonstrations."},
  {"title": "Product Speaker, HP × CodeMate AI", "tag": "Aug 2026", "body": "Represented CodeMate AI at an HP business client session in Bengaluru, presenting to enterprise stakeholders on product adoption and business value."}
]}'::jsonb, 1, true),

('Achievements', 'cards', '{"items": [
  {"title": "SIH Internal Hackathon Winner 2026", "tag": "Sep 2026", "body": "Won for a solution to ISRO''s SIH26172 — Low Latency Voice Activator for Edge Devices, driving product development from ideation to prototype and supporting the final pitch."},
  {"title": "3rd Place — IDT Project Exhibition", "tag": "Nov 2025", "body": "Awarded 3rd place among 15 competing sections for a rural development hardware model aligned with the UN Sustainable Development Goals."}
]}'::jsonb, 2, true),

('Skills', 'tags', '{"tags": ["Python","C","SQL","HTML","CSS3","JavaScript","AI/ML","Git","Product Strategy","Product Analytics","Problem Solving","Leadership","Cross-functional Collaboration","Team Collaboration","Analytical Thinking","Quick Learning Ability","Adaptability","Logical Thinking","Time Management","Communication Skills"]}'::jsonb, 3, true);

-- ============ PROJECTS ============
delete from projects;

insert into projects (title, description, tech_stack, link_url, position, visible) values
('Taj Finance', 'Personal finance dashboard — designed for income, expense, and budgeting insights, delivering an intuitive experience with real-time analytics and visualization.', array['React','JavaScript','Vite','Tailwind CSS','Recharts'], null, 0, true),
('Jeevandhara', 'AI-powered agriculture dashboard for farmers — farm overview, agricultural insights, and modular service architecture, built with interactive workflows and mock data to demonstrate future capabilities across Kannada Voice AI, crop health, schemes, market intelligence, weather, and IoT modules.', array['Next.js','React','TypeScript','Tailwind CSS'], null, 1, true),
('Sign Language Live', 'Webcam-based application recognizing static sign-language alphabet poses, achieving 84.2% test accuracy. Confidence thresholds and consecutive-frame stability checks give reliable letter capture, sentence building, and text-to-speech output — deployed as a responsive browser app with on-device camera processing and background inference, validated with 58 automated tests.', array['Python','TensorFlow','MediaPipe'], null, 2, true);

commit;
