import React, { createContext, useContext, useMemo, useState, useEffect, useCallback } from 'react';

const LanguageContext = createContext(null);

const STORAGE_KEY = 'app_language';

const dictionary = {
  en: {
    nav_home: 'Home',
    nav_about: 'About Us',
    nav_contact: 'Contact Us',
    nav_assessment: 'Assessment',
    nav_dashboard: 'My Dashboard',
    nav_account: 'Account Settings',
    nav_login: 'Login',
    nav_register: 'Register',
    nav_logout: 'Logout',
    hero_title: 'Digital Type Assessment',
    hero_sub: 'Transforming Cybersecurity Awareness Through Personalized Profiling',
    btn_start_assessment: 'Start Assessment',
    card_title: "What's Your Digital Type?",
    card_body: 'Are you a Careless Clicker, Password Reuser, Update Avoider, Oversharer, or Security Savvy? Take our assessment to find out!',
    btn_learn_more: 'Learn More',
    language_label: 'Language',
    lang_en: 'English',
    lang_zh: '中文',
    lang_ms: 'Bahasa Melayu',
    lang_swk: 'Bahasa Sarawak',
    assessment_results: 'Assessment Results',
    no_results: 'No results available',
    retake_assessment: 'Retake Assessment',
    go_dashboard: 'Go to Dashboard',
    digital_type: 'Digital Type',
    confidence: 'Confidence',
    average_category_score: 'Average Category Score',
    total_risk: 'Total Risk',
    strengths: 'Strengths',
    weaknesses: 'Weaknesses',
    key_mistakes: 'Key Mistakes',
    recommendations: 'Recommendations',
    vulnerability_topics: 'Vulnerability Topics',
    definition: 'Definition',
    primary_risk_profile: 'Primary Risk Profile',
    type_drivers: 'Risk Profile Contributors',
    type_debug: 'Assessment Analysis',
    type_drivers_subtitle: 'Scores that most influence your risk profile',
    type_debug_subtitle: 'Breakdown of how your profile and responses shaped results',
    debug_profile_type_label: 'Profile-Based Type',
    debug_behavioral_type_label: 'Behavioral Type',
    debug_distinctiveness_label: 'Distinctiveness',
    debug_risk_density_label: 'Risk Density',
    debug_responses_label: 'Responses',
    actual_score_label: 'Actual Score',
    correct_answers_label: 'Correct Answers',
    assessment_start_title: 'Have you used digital devices before?',
    yes: 'Yes',
    no: 'No',
    personal_age_label: 'What is your age group?',
    personal_gender_label: 'What is your gender?',
    personal_education_label: 'What is your highest educational qualification?',
    personal_occupation_label: 'What is your primary occupation?',
    back: 'Back',
    next: 'Next',
    loading_questions: 'Loading questions...',
    failed_start_assessment: 'Failed to start assessment',
    no_question_available: 'No question available',
    failed_fetch_next: 'Failed to fetch next question',
    question_label: 'Question',
    of_30: 'of 30',
    tip: 'Tip:',
    cat_phishing: 'Phishing',
    cat_scams: 'Scams',
    cat_passwords: 'Passwords & 2FA',
    cat_malware: 'Malware',
    cat_data: 'Data Handling & Wi-Fi',
    cat_social: 'Social Engineering',
    opt_age_under_18: 'Under 18',
    opt_age_18_24: '18 - 24',
    opt_age_25_34: '25 - 34',
    opt_age_35_44: '35 - 44',
    opt_age_45_54: '45 - 54',
    opt_age_55_64: '55 - 64',
    opt_age_65_plus: '65 or above',
    opt_gender_male: 'Male',
    opt_gender_female: 'Female',
    opt_gender_na: 'Prefer not to say',
    opt_edu_none: 'No formal education',
    opt_edu_school: 'Primary/Secondary School',
    opt_edu_diploma: 'Diploma/Certificate',
    opt_edu_bachelor: "Bachelor's Degree",
    opt_edu_master: "Master's Degree",
    opt_edu_phd: 'Doctorate (Ph.D.) or higher',
    opt_other: 'Other',
    opt_occ_agriculture: 'Agriculture/Farming/Fisheries',
    opt_occ_banking: 'Banking/Finance/Insurance',
    opt_occ_biotech: 'Biotechnology/Life Sciences/Healthcare',
    opt_occ_construction: 'Building/Construction/Engineering',
    opt_occ_business: 'Business/Management/Consulting',
    opt_occ_creative: 'Creative/Design/Media',
    opt_occ_customer: 'Customer Service/Sales/Retail',
    opt_occ_education: 'Education/Academia',
    opt_occ_gov: 'Government/Public Safety/Legal',
    opt_occ_it: 'IT/Computers/Electronics',
    opt_occ_manufacturing: 'Manufacturing/Operations/Logistics',
    opt_occ_hospitality: 'Hospitality/Food Services',
    opt_occ_student: 'Student',
    opt_occ_retired: 'Retired',
    opt_occ_other: 'Other (please specify)',
    opt_occ_unemployed: 'Unemployed',
    category_scores_label: 'Category Scores',
    km_clicking_suspicious_links: 'Clicking on suspicious links without verification',
    km_password_reuse: 'Reusing passwords across multiple accounts',
    km_common_scams: 'Falling for common scam tactics',
    km_sharing_reusing_passwords: 'Sharing or reusing passwords',
    rec_phishing_verify_sender: 'Verify sender and hover links before clicking',
    rec_scams_avoid_pay_links: 'Avoid payments via links or calls; verify via official channels',
    rec_passwords_use_manager_2fa: 'Use a password manager and enable 2FA',
    rec_malware_keep_updated_avoid_cracked: 'Keep software updated and avoid cracked downloads',
    rec_data_use_vpn_mobile: 'Use VPN or mobile data on public Wi‑Fi and protect PII',
    rec_social_validate_identities: 'Challenge unexpected requests and validate identities',
    rec_phishing_login_official: 'Log in via official app or website instead of email links',
    rec_phishing_inspect_domain: 'Inspect domain carefully; beware lookalikes and shortened URLs',
    rec_phishing_disable_remote_images: 'Disable remote image loading to reduce tracking in emails',
    rec_scams_never_share_otp: 'Never share OTP/TAC codes; banks will not ask for them',
    rec_scams_confirm_trusted_numbers: 'Confirm claims using trusted numbers, not those in messages',
    rec_scams_research_sellers: 'Research sellers and check reviews before transacting online',
    rec_passwords_unique_passphrases: 'Create unique passphrases per account to stop credential stuffing',
    rec_passwords_prefer_app_hardware: 'Prefer authenticator apps or hardware keys over SMS 2FA',
    rec_passwords_rotate_revoke: 'Rotate old passwords and revoke sessions after breaches',
    rec_malware_install_official_stores: 'Install apps only from official stores; block unknown APKs',
    rec_malware_backup_offline: 'Back up data offline to mitigate ransomware impact',
    rec_malware_run_av_remove_ext: 'Run antivirus/EDR and remove unused browser extensions',
    rec_data_avoid_banking_on_open_wifi: 'Avoid accessing banking on open Wi‑Fi; use cellular or VPN',
    rec_data_limit_data_sharing: 'Limit data sharing; remove sensitive metadata from files/photos',
    rec_data_set_auto_lock_privacy: 'Set device auto-lock and use screen privacy filters in public',
    rec_social_dual_channel_verification: 'Use dual-channel verification for urgent requests (call back via known numbers)',
    rec_social_no_secrets_policy: 'Establish no‑secrets policy: never share passwords or 2FA codes',
    rec_social_slow_down_urgency: 'Train yourself to slow down when messages impose artificial urgency',
    dash_hello: 'Hello',
    dash_welcome_subtitle: 'Welcome to your personalized security dashboard',
    dash_title: 'Your Security Dashboard',
    dash_overview: 'Dashboard Overview',
    dash_digital_type: 'Your Digital Type',
    dash_security_score: 'Security Score',
    dash_last_assessment: 'Last Assessment',
    dash_personalized_recs: 'Personalized Recommendations',
    dash_take_new: 'Take New Assessment',
    history_title: 'Recent Assessments',
    history_empty: 'No assessment history found',
    history_view: 'View',
    history_delete: 'Delete',
    history_delete_all: 'Delete All',
    history_confirm_delete: 'Delete this assessment?',
    history_confirm_delete_all: 'Delete all assessment history?',
    loading_dashboard_data: 'Loading your dashboard data...',
    preparing_dashboard: 'Preparing your dashboard...',
    login_access_required: 'Access Required',
    login_prompt_message: 'Please log in or create an account to access your personalized security dashboard.',
    login_login_btn: 'Login to Your Account',
    login_register_btn: 'Create New Account',
    login_why_title: 'Why create an account?',
    login_track_progress: 'Track your digital security progress',
    login_personalized_security: 'Get personalized security recommendations',
    login_view_history: 'View your assessment history',
    login_receive_alerts: 'Receive security alerts and tips',
    feat_analysis_title: 'Personalized Analysis',
    feat_analysis_desc: 'Get insights into your digital security habits and behaviors',
    feat_recs_title: 'Actionable Recommendations',
    feat_recs_desc: 'Receive tailored security tips based on your digital type',
    feat_progress_title: 'Track Your Progress',
    feat_progress_desc: 'Monitor your security improvements over time',
    notfound_title: 'Page Not Found',
    notfound_desc: "The page you are looking for doesn't exist or has been moved.",
    notfound_return: 'Return Home',
    about_title: 'About Hornbill Sentinel',
    about_subtitle: 'Digital Type Assessment & Profile Generation System for Cybersecurity Awareness in Malaysia',
    about_mission_title: 'Our Mission',
    about_mission_body: 'To empower Malaysians to recognize and mitigate cybersecurity hygiene risks through personalized Digital Type assessments, insightful profiles, and actionable recommendations.',
    about_story_title: 'Our Story',
    about_story_body: 'Born in early 2025 as a student Final Year Project at the University of Technology Sarawak, Hornbill Sentinel sprang from the understanding that human error is often the weakest link in cybersecurity. Under the guidance of Ts. Dr. Gary Loh, Mr. Tristan designed a system that turns behavioural insights into lasting security improvements.',
    about_approach_title: 'Our Approach',
    about_approach_body1: 'Grounded in Protection Motivation Theory with a questionnaire aligned with the latest research evidence in human-centric cybersecurity, our platform analyzes not only enforces demographic-based profiling, but also patterns of risky behaviours to classify you into one of five “Digital Types.” We then deliver tailored advice to boost your perceived vulnerability, response efficacy, and self-efficacy.',
    about_approach_body2: 'Continuous refinement driven by the latest academic research ensures Hornbill Sentinel stays on the cutting edge of human-centric cybersecurity awareness.',
    about_team_title: 'Our Team',
    role_founder: 'Full Stack Developer',
    role_supervisor: 'Supervisor & Technical Advisor',
    role_project_lead: 'Project Lead Researcher',
    role_backend: 'Back-End Developer'
    , alt_logo: 'Digital Type Assessment'
    , aria_select_language: 'Select language'
    , nav_profile: 'Profile'
    , login_title: 'Login to Your Account'
    , email_label: 'Email Address'
    , email_placeholder: 'Enter your email'
    , password_label: 'Password'
    , password_placeholder: 'Enter your password'
    , login_button: 'Login'
    , logging_in: 'Logging in...'
    , no_account: "Don't have an account?"
    , register_here: 'Register here'
    , forgot_password: 'Forgot your password?'
    , show_password: 'Show password'
    , hide_password: 'Hide password'
    , default_login_error: 'Login failed. Please check your credentials and try again.'
    , twofa_title: 'Two-Factor Authentication'
    , auth_app: 'Authenticator App'
    , backup_code: 'Backup Code'
    , email_otp: 'Email OTP'
    , send_email_otp: 'Send Email OTP'
    , verifying: 'Verifying...'
    , verify: 'Verify'
    , back_to_login: 'Back to Login'
    , totp_prompt: 'Enter 6-digit code from your authenticator app'
    , backup_prompt: 'Enter 8-character backup code'
    , email_prompt: 'Enter 6-digit code from email'
    , old_password_changed_on: 'Your password was last changed on'
    , reset_password_cta: 'Click here to reset your password.'
    , dash_rec_start_tutorials: 'Start with basic device safety tutorials'
    , dash_rec_passwords_security: 'Learn about strong passwords and account security'
    , dash_rec_guidance_links_apps: 'Seek guidance before clicking links or downloading apps'
    , type_security_savvy: 'Security Savvy'
    , type_careless_clicker: 'Careless Clicker'
    , type_password_reuser: 'Password Reuser'
    , type_update_avoider: 'Update Avoider'
    , type_oversharer: 'Oversharer'
    , type_new_to_digital: 'New to Digital'
    , type_strategic_custodian: 'The Strategic Custodian'
    , type_technical_architect: 'The Technical Architect'
    , type_network_liaison: 'The Network Liaison'
    , type_operational_analyst: 'The Operational Analyst'
    , type_digital_consumer: 'The Digital Consumer'
  },
  zh: {
    nav_home: '首页',
    nav_about: '关于我们',
    nav_contact: '联系我们',
    nav_assessment: '评估',
    nav_dashboard: '我的仪表板',
    nav_account: '账号设置',
    nav_login: '登录',
    nav_register: '注册',
    nav_logout: '退出登录',
    hero_title: '数字类型评估',
    hero_sub: '了解您的数字安全画像，并获得个性化建议，保护您在当今网络环境中的在线安全',
    btn_start_assessment: '开始评估',
    card_title: '你的数字类型是什么？',
    card_body: '您是轻率点击者、密码重用者、更新回避者、过度分享者，还是安全达人？进行评估来了解！',
    btn_learn_more: '了解更多',
    language_label: '语言',
    lang_en: 'English',
    lang_zh: '中文',
    lang_ms: 'Bahasa Melayu',
    lang_swk: 'Bahasa Sarawak',
    assessment_results: '评估结果',
    no_results: '暂无结果',
    retake_assessment: '重新评估',
    go_dashboard: '前往仪表板',
    digital_type: '数字类型',
    confidence: '置信度',
    average_category_score: '类别平均得分',
    total_risk: '总风险',
    strengths: '优势',
    weaknesses: '弱项',
    key_mistakes: '关键错误',
    recommendations: '建议',
    vulnerability_topics: '脆弱主题',
    definition: '定义',
    primary_risk_profile: '主要风险画像',
    type_drivers: '类型驱动',
    type_debug: '评估分析',
    type_drivers_subtitle: '最影响你风险画像的分数',
    type_debug_subtitle: '你的资料与答题如何影响结果的拆解',
    debug_profile_type_label: '基于资料的类型',
    debug_behavioral_type_label: '行为类型',
    debug_distinctiveness_label: '区分度',
    debug_risk_density_label: '风险密度',
    debug_responses_label: '作答数',
    actual_score_label: '实际得分',
    correct_answers_label: '答对数',
    assessment_start_title: '您是否使用过数字设备？',
    yes: '是',
    no: '否',
    personal_age_label: '您的年龄段是？',
    personal_gender_label: '您的性别是？',
    personal_education_label: '您最高的教育程度是？',
    personal_occupation_label: '您的主要职业是？',
    back: '返回',
    next: '下一步',
    loading_questions: '题目加载中…',
    failed_start_assessment: '评估启动失败',
    no_question_available: '暂无可用题目',
    failed_fetch_next: '获取下一题失败',
    question_label: '第',
    of_30: '题 / 共30题',
    tip: '提示：',
    cat_phishing: '钓鱼攻击',
    cat_scams: '诈骗',
    cat_passwords: '密码与双重认证',
    cat_malware: '恶意软件',
    cat_data: '数据处理与无线网络',
    cat_social: '社会工程学',
    opt_age_under_18: '未满18岁',
    opt_age_18_24: '18 - 24岁',
    opt_age_25_34: '25 - 34岁',
    opt_age_35_44: '35 - 44岁',
    opt_age_45_54: '45 - 54岁',
    opt_age_55_64: '55 - 64岁',
    opt_age_65_plus: '65岁及以上',
    opt_gender_male: '男',
    opt_gender_female: '女',
    opt_gender_na: '不愿透露',
    opt_edu_none: '无正规教育',
    opt_edu_school: '小学/中学',
    opt_edu_diploma: '文凭/证书',
    opt_edu_bachelor: '学士学位',
    opt_edu_master: '硕士学位',
    opt_edu_phd: '博士及以上',
    opt_other: '其他',
    opt_occ_agriculture: '农业/农牧/渔业',
    opt_occ_banking: '银行/金融/保险',
    opt_occ_biotech: '生物科技/生命科学/医疗',
    opt_occ_construction: '建筑/施工/工程',
    opt_occ_business: '商业/管理/咨询',
    opt_occ_creative: '创意/设计/媒体',
    opt_occ_customer: '客服/销售/零售',
    opt_occ_education: '教育/学术',
    opt_occ_gov: '政府/公共安全/法律',
    opt_occ_it: '信息技术/计算机/电子',
    opt_occ_manufacturing: '制造/运营/物流',
    opt_occ_hospitality: '酒店/餐饮服务',
    opt_occ_student: '学生',
    opt_occ_retired: '退休',
    opt_occ_other: '其他（请注明）',
    opt_occ_unemployed: '待业',
    category_scores_label: '类别得分',
    km_clicking_suspicious_links: '未经核实点击可疑链接',
    km_password_reuse: '多个账号重复使用密码',
    km_common_scams: '容易陷入常见诈骗手法',
    rec_phishing_verify_sender: '核实发件人并悬停查看链接再点击',
    rec_scams_avoid_pay_links: '避免通过链接或来电付款；通过官方渠道核实',
    rec_passwords_use_manager_2fa: '使用密码管理器并启用双重认证',
    rec_malware_keep_updated_avoid_cracked: '保持软件更新并避免使用破解软件',
    rec_data_use_vpn_mobile: '公共Wi‑Fi下使用VPN或移动数据并保护个人信息',
    rec_social_validate_identities: '对意外请求保持警惕并核实身份',
    rec_phishing_login_official: '通过官方App或官网登录，而非邮件内链接',
    rec_phishing_inspect_domain: '仔细检查域名；警惕仿冒与短链接',
    rec_phishing_disable_remote_images: '禁用邮件远程图片加载以减少跟踪',
    rec_scams_never_share_otp: '切勿分享OTP/TAC验证码；银行不会索取',
    rec_scams_confirm_trusted_numbers: '用可信号码核实，不要使用信息中的号码',
    rec_scams_research_sellers: '线上交易前先调查卖家并查看评价',
    rec_passwords_unique_passphrases: '每账户使用唯一口令以防凭证填充',
    rec_passwords_prefer_app_hardware: '优先使用认证器App或硬件密钥而非短信2FA',
    rec_passwords_rotate_revoke: '发生泄露后更换旧密码并撤销会话',
    rec_malware_install_official_stores: '仅从官方商店安装应用；阻止未知APK',
    rec_malware_backup_offline: '离线备份数据以减轻勒索软件影响',
    rec_malware_run_av_remove_ext: '运行杀毒/EDR并移除不必要的浏览器扩展',
    rec_data_avoid_banking_on_open_wifi: '开放Wi‑Fi下避免办理银行业务；改用蜂窝或VPN',
    rec_data_limit_data_sharing: '限制数据分享；移除文件/照片中的敏感元数据',
    rec_data_set_auto_lock_privacy: '启用设备自动锁定并在公共场所使用防窥屏',
    rec_social_dual_channel_verification: '紧急请求使用双通道核实（回拨已知号码）',
    rec_social_no_secrets_policy: '建立“无秘密”政策：绝不分享密码或2FA验证码',
    rec_social_slow_down_urgency: '面对“紧急”信息时训练自己放慢节奏',
    dash_hello: '你好',
    dash_welcome_subtitle: '欢迎来到你的个性化安全仪表板',
    dash_title: '你的安全仪表板',
    dash_overview: '仪表板概览',
    dash_digital_type: '你的数字类型',
    dash_security_score: '安全评分',
    dash_last_assessment: '最近评估',
    dash_personalized_recs: '个性化建议',
    dash_take_new: '进行新评估',
    loading_dashboard_data: '正在加载你的仪表板数据…',
    preparing_dashboard: '正在准备你的仪表板…',
    login_access_required: '需要访问权限',
    login_prompt_message: '请登录或创建账户以访问你的个性化安全仪表板。',
    login_login_btn: '登录你的账户',
    login_register_btn: '创建新账户',
    login_why_title: '为什么要创建账户？',
    login_track_progress: '跟踪你的数字安全进展',
    login_personalized_security: '获取个性化安全建议',
    login_view_history: '查看你的评估历史',
    login_receive_alerts: '接收安全提醒与技巧',
    feat_analysis_title: '个性化分析',
    feat_analysis_desc: '洞察你的数字安全习惯与行为',
    feat_recs_title: '可执行的建议',
    feat_recs_desc: '基于你的数字类型提供定制安全提示',
    feat_progress_title: '跟踪你的进展',
    feat_progress_desc: '随时间监控你的安全改进',
    notfound_title: '页面未找到',
    notfound_desc: '你要访问的页面不存在或已移动。',
    notfound_return: '返回首页',
    about_title: '关于 Hornbill Sentinel',
    about_subtitle: '面向马来西亚的数字类型评估与档案生成系统，用于网络安全意识',
    about_mission_title: '我们的使命',
    about_mission_body: '赋能马来西亚人——尤其是砂拉越人——通过个性化的数字类型评估、洞察档案与可执行建议，识别并缓解网络安全卫生风险。',
    about_story_title: '我们的故事',
    about_story_body: 'Hornbill Sentinel 诞生于 2025 年初，作为砂拉越科技大学毕业设计项目，源于“人为错误常是网络安全的最弱环节”的认识。在 Ts. Dr. Gary Loh 的指导下，Tristan 设计了一个将行为洞察转化为持久安全改进的系统。',
    about_approach_title: '我们的方法',
    about_approach_body1: '基于保护动机理论并与 NIST 网络安全框架 2.0 对齐，平台分析的不是卫生习惯，而是风险行为模式，将你分类为五种“数字类型”之一；随后提供定制建议以提升风险感知、响应效能与自我效能。',
    about_approach_body2: '在最新学术研究与真实用户反馈的驱动下持续迭代，使 Hornbill Sentinel 始终处于以人为本的网络安全意识前沿。',
    about_team_title: '我们的团队',
    role_founder: '创始人与首席研究员',
    role_supervisor: '导师与技术顾问',
    role_project_lead: '项目首席研究员',
    role_backend: '后端开发工程师'
    , alt_logo: '数字类型评估'
    , aria_select_language: '选择语言'
    , nav_profile: '个人资料'
    , login_title: '登录你的账户'
    , email_label: '电子邮箱'
    , email_placeholder: '请输入邮箱'
    , password_label: '密码'
    , password_placeholder: '请输入密码'
    , login_button: '登录'
    , logging_in: '正在登录…'
    , no_account: '还没有账户？'
    , register_here: '点击这里注册'
    , forgot_password: '忘记密码？'
    , show_password: '显示密码'
    , hide_password: '隐藏密码'
    , default_login_error: '登录失败，请检查凭据后重试。'
    , twofa_title: '双重认证'
    , auth_app: '认证器应用'
    , backup_code: '备用验证码'
    , email_otp: '邮箱验证码'
    , send_email_otp: '发送邮箱验证码'
    , verifying: '正在验证…'
    , verify: '验证'
    , back_to_login: '返回登录'
    , totp_prompt: '请输入认证器应用中的6位数字'
    , backup_prompt: '请输入8位备用验证码'
    , email_prompt: '请输入邮箱中的6位验证码'
    , old_password_changed_on: '你的密码上次修改于'
    , reset_password_cta: '点击此处重置密码。'
    , dash_rec_start_tutorials: '从基础设备安全教程开始'
    , dash_rec_passwords_security: '了解强密码与账户安全'
    , dash_rec_guidance_links_apps: '点击链接或下载应用前先寻求指导'
    , type_security_savvy: '安全达人'
    , type_careless_clicker: '轻率点击者'
    , type_password_reuser: '密码重用者'
    , type_update_avoider: '更新回避者'
    , type_oversharer: '过度分享者'
    , type_new_to_digital: '数字新手'
    , type_strategic_custodian: '战略监管者'
    , type_technical_architect: '技术架构师'
    , type_network_liaison: '网络联络者'
    , type_operational_analyst: '运营分析师'
    , type_digital_consumer: '数字消费者'
    , km_sharing_reusing_passwords: '分享或重复使用密码'
  },
  ms: {
    nav_home: 'Laman Utama',
    nav_about: 'Tentang Kami',
    nav_contact: 'Hubungi Kami',
    nav_assessment: 'Penilaian',
    nav_dashboard: 'Papan Pemuka Saya',
    nav_account: 'Tetapan Akaun',
    nav_login: 'Log Masuk',
    nav_register: 'Daftar',
    nav_logout: 'Log Keluar',
    hero_title: 'Penilaian Jenis Digital',
    hero_sub: 'Kenali profil keselamatan digital anda dan dapatkan cadangan diperibadikan untuk melindungi kehadiran dalam talian anda dalam landskap siber masa kini',
    btn_start_assessment: 'Mulakan Penilaian',
    card_title: 'Apakah Jenis Digital Anda?',
    card_body: 'Adakah anda Penekan Cuai, Pengguna Semula Kata Laluan, Pengelak Kemas Kini, Kongsi Berlebihan, atau Celik Keselamatan? Jalankan penilaian untuk mengetahui!',
    btn_learn_more: 'Ketahui Lebih Lanjut',
    language_label: 'Bahasa',
    lang_en: 'English',
    lang_zh: '中文',
    lang_ms: 'Bahasa Melayu',
    lang_swk: 'Bahasa Sarawak',
    assessment_results: 'Keputusan Penilaian',
    no_results: 'Tiada keputusan tersedia',
    retake_assessment: 'Ulang Penilaian',
    go_dashboard: 'Pergi ke Papan Pemuka',
    digital_type: 'Jenis Digital',
    confidence: 'Keyakinan',
    average_category_score: 'Purata Skor Kategori',
    total_risk: 'Jumlah Risiko',
    strengths: 'Kekuatan',
    weaknesses: 'Kelemahan',
    key_mistakes: 'Kesilapan Utama',
    recommendations: 'Cadangan',
    vulnerability_topics: 'Topik Kerentanan',
    definition: 'Definisi',
    primary_risk_profile: 'Profil Risiko Utama',
    type_drivers: 'Penyumbang Profil Risiko',
    type_debug: 'Analisis Penilaian',
    type_drivers_subtitle: 'Skor yang paling mempengaruhi profil risiko anda',
    type_debug_subtitle: 'Perincian bagaimana profil dan jawapan membentuk keputusan',
    debug_profile_type_label: 'Jenis Berasaskan Profil',
    debug_behavioral_type_label: 'Jenis Tingkah Laku',
    debug_distinctiveness_label: 'Keberbezaan',
    debug_risk_density_label: 'Ketumpatan Risiko',
    debug_responses_label: 'Bilangan Jawapan',
    actual_score_label: 'Skor Sebenar',
    correct_answers_label: 'Jawapan Betul',
    assessment_start_title: 'Adakah anda pernah menggunakan peranti digital?',
    yes: 'Ya',
    no: 'Tidak',
    personal_age_label: 'Apakah kumpulan umur anda?',
    personal_gender_label: 'Apakah jantina anda?',
    personal_education_label: 'Apakah kelayakan pendidikan tertinggi anda?',
    personal_occupation_label: 'Apakah pekerjaan utama anda?',
    back: 'Kembali',
    next: 'Seterusnya',
    loading_questions: 'Memuatkan soalan…',
    failed_start_assessment: 'Gagal memulakan penilaian',
    no_question_available: 'Tiada soalan tersedia',
    failed_fetch_next: 'Gagal mendapatkan soalan seterusnya',
    question_label: 'Soalan',
    of_30: 'daripada 30',
    tip: 'Petua:',
    cat_phishing: 'Pancingan Data',
    cat_scams: 'Penipuan',
    cat_passwords: 'Kata Laluan & 2FA',
    cat_malware: 'Perisian Berniat Jahat',
    cat_data: 'Pengendalian Data & Wi‑Fi',
    cat_social: 'Kejuruteraan Sosial',
    opt_age_under_18: 'Bawah 18',
    opt_age_18_24: '18 - 24',
    opt_age_25_34: '25 - 34',
    opt_age_35_44: '35 - 44',
    opt_age_45_54: '45 - 54',
    opt_age_55_64: '55 - 64',
    opt_age_65_plus: '65 ke atas',
    opt_gender_male: 'Lelaki',
    opt_gender_female: 'Perempuan',
    opt_gender_na: 'Tidak mahu nyatakan',
    opt_edu_none: 'Tiada pendidikan formal',
    opt_edu_school: 'Sekolah Rendah/Menengah',
    opt_edu_diploma: 'Diploma/Sijil',
    opt_edu_bachelor: 'Ijazah Sarjana Muda',
    opt_edu_master: 'Ijazah Sarjana',
    opt_edu_phd: 'Doktor Falsafah (Ph.D.) atau lebih tinggi',
    opt_other: 'Lain-lain',
    opt_occ_agriculture: 'Pertanian/Penternakan/Perikanan',
    opt_occ_banking: 'Perbankan/Kewangan/Insurans',
    opt_occ_biotech: 'Bioteknologi/Sains Hayat/Penjagaan Kesihatan',
    opt_occ_construction: 'Bangunan/Konstruksi/Kejuruteraan',
    opt_occ_business: 'Perniagaan/Pengurusan/Perundingan',
    opt_occ_creative: 'Kreatif/Reka Bentuk/Media',
    opt_occ_customer: 'Khidmat Pelanggan/Jualan/Ritel',
    opt_occ_education: 'Pendidikan/Akademia',
    opt_occ_gov: 'Kerajaan/Keselamatan Awam/Perundangan',
    opt_occ_it: 'IT/Komputer/Elektronik',
    opt_occ_manufacturing: 'Pembuatan/Operasi/Logistik',
    opt_occ_hospitality: 'Hospitaliti/Perkhidmatan Makanan',
    opt_occ_student: 'Pelajar',
    opt_occ_retired: 'Bersara',
    opt_occ_other: 'Lain-lain (sila nyatakan)',
    opt_occ_unemployed: 'Tidak bekerja',
    category_scores_label: 'Skor Kategori',
    km_clicking_suspicious_links: 'Mengklik pautan mencurigakan tanpa pengesahan',
    km_password_reuse: 'Menggunakan semula kata laluan pada banyak akaun',
    km_common_scams: 'Mudah terpedaya dengan taktik penipuan biasa',
    rec_phishing_verify_sender: 'Sahkan penghantar dan lihat pautan sebelum klik',
    rec_scams_avoid_pay_links: 'Elak pembayaran melalui pautan atau panggilan; sahkan melalui saluran rasmi',
    rec_passwords_use_manager_2fa: 'Guna pengurus kata laluan dan aktifkan 2FA',
    rec_malware_keep_updated_avoid_cracked: 'Kemas kini perisian dan elakkan muat turun retak',
    rec_data_use_vpn_mobile: 'Guna VPN atau data mudah alih pada Wi‑Fi awam dan lindungi PII',
    rec_social_validate_identities: 'Cabarkan permintaan luar jangka dan sahkan identiti',
    rec_phishing_login_official: 'Log masuk melalui aplikasi atau laman rasmi, bukan pautan emel',
    rec_phishing_inspect_domain: 'Periksa domain dengan teliti; awasi penyerupaan dan pautan dipendekkan',
    rec_phishing_disable_remote_images: 'Matikan pemuatan imej jauh dalam emel untuk kurangkan penjejakan',
    rec_scams_never_share_otp: 'Jangan sekali‑kali kongsi kod OTP/TAC; bank tidak akan memintanya',
    rec_scams_confirm_trusted_numbers: 'Sahkan tuntutan guna nombor dipercayai, bukan nombor dalam mesej',
    rec_scams_research_sellers: 'Kaji penjual dan semak ulasan sebelum berurusan dalam talian',
    rec_passwords_unique_passphrases: 'Cipta frasa laluan unik setiap akaun untuk hentikan stuffing',
    rec_passwords_prefer_app_hardware: 'Utamakan aplikasi pengesah atau kunci perkakasan berbanding SMS 2FA',
    rec_passwords_rotate_revoke: 'Putar kata laluan lama dan batal sesi selepas kebocoran',
    rec_malware_install_official_stores: 'Pasang aplikasi hanya dari gedung rasmi; sekat APK tidak diketahui',
    rec_malware_backup_offline: 'Sandar data luar talian untuk kurangkan kesan ransomware',
    rec_malware_run_av_remove_ext: 'Jalankan antivirus/EDR dan buang sambungan pelayar yang tidak perlu',
    rec_data_avoid_banking_on_open_wifi: 'Elak akses perbankan pada Wi‑Fi terbuka; guna selular atau VPN',
    rec_data_limit_data_sharing: 'Hadkan perkongsian data; buang metadata sensitif dalam fail/foto',
    rec_data_set_auto_lock_privacy: 'Tetapkan kunci automatik peranti dan guna penapis privasi skrin di tempat awam',
    rec_social_dual_channel_verification: 'Guna pengesahan dua saluran untuk permintaan mendesak (panggil semula nombor yang diketahui)',
    rec_social_no_secrets_policy: 'Tetapkan dasar “tiada rahsia”: jangan kongsi kata laluan atau kod 2FA',
    rec_social_slow_down_urgency: 'Latih diri untuk perlahan apabila mesej mengenakan “kecemasan” palsu',
    dash_hello: 'Hai',
    dash_welcome_subtitle: 'Selamat datang ke papan pemuka keselamatan peribadi anda',
    dash_title: 'Papan Pemuka Keselamatan Anda',
    dash_overview: 'Gambaran Papan Pemuka',
    dash_digital_type: 'Jenis Digital Anda',
    dash_security_score: 'Skor Keselamatan',
    dash_last_assessment: 'Penilaian Terkini',
    dash_personalized_recs: 'Cadangan Dipersonalisasi',
    dash_take_new: 'Lakukan Penilaian Baharu',
    loading_dashboard_data: 'Memuatkan data papan pemuka anda…',
    preparing_dashboard: 'Menyediakan papan pemuka anda…',
    login_access_required: 'Akses Diperlukan',
    login_prompt_message: 'Sila log masuk atau daftar akaun untuk mengakses papan pemuka keselamatan peribadi anda.',
    login_login_btn: 'Log Masuk ke Akaun Anda',
    login_register_btn: 'Daftar Akaun Baharu',
    login_why_title: 'Mengapa daftar akaun?',
    login_track_progress: 'Jejak kemajuan keselamatan digital anda',
    login_personalized_security: 'Dapatkan cadangan keselamatan dipersonalisasi',
    login_view_history: 'Lihat sejarah penilaian anda',
    login_receive_alerts: 'Terima amaran dan petua keselamatan',
    feat_analysis_title: 'Analisis Dipersonalisasi',
    feat_analysis_desc: 'Dapatkan pandangan tentang tabiat dan kelakuan keselamatan digital anda',
    feat_recs_title: 'Cadangan Boleh Bertindak',
    feat_recs_desc: 'Terima petua keselamatan yang disesuaikan berdasarkan jenis digital anda',
    feat_progress_title: 'Jejak Kemajuan Anda',
    feat_progress_desc: 'Pantau penambahbaikan keselamatan anda dari semasa ke semasa',
    notfound_title: 'Halaman Tidak Ditemui',
    notfound_desc: 'Halaman yang anda cari tiada atau telah dipindahkan.',
    notfound_return: 'Kembali ke Laman Utama',
    about_title: 'Tentang Hornbill Sentinel',
    about_subtitle: 'Sistem Penilaian Jenis Digital & Penjanaan Profil untuk Kesedaran Keselamatan Siber di Malaysia',
    about_mission_title: 'Misi Kami',
    about_mission_body: 'Memberdayakan rakyat Malaysia—terutamanya Sarawak—untuk mengenal pasti dan mengurangkan risiko kebersihan keselamatan siber melalui penilaian Jenis Digital dipersonalisasi, profil bermakna dan cadangan boleh bertindak.',
    about_story_title: 'Kisah Kami',
    about_story_body: 'Dilahirkan pada awal 2025 sebagai Projek Tahun Akhir di UTS, Hornbill Sentinel muncul daripada kefahaman bahawa ralat manusia sering menjadi pautan paling lemah dalam keselamatan siber. Dengan bimbingan Ts. Dr. Gary Loh, Tristan merangka sistem yang menukar pandangan tingkah laku kepada penambahbaikan keselamatan yang berkekalan.',
    about_approach_title: 'Pendekatan Kami',
    about_approach_body1: 'Berteraskan Protection Motivation Theory dan sejajar dengan NIST CSF 2.0, platform kami menganalisis pola tingkah laku berisiko untuk mengklasifikasikan anda kepada salah satu “Jenis Digital”, kemudian memberi nasihat tersuai untuk meningkatkan kepekaan risiko, keberkesanan tindak balas dan kecekapan diri.',
    about_approach_body2: 'Penambahbaikan berterusan—didorong oleh kajian akademik terkini dan maklum balas pengguna sebenar—memastikan Hornbill Sentinel kekal di barisan hadapan kesedaran keselamatan siber berpusatkan manusia.',
    about_team_title: 'Pasukan Kami',
    role_founder: 'Pengasas & Ketua Penyelidik',
    role_supervisor: 'Penyelia & Penasihat Teknikal',
    role_project_lead: 'Ketua Penyelidik Projek',
    role_backend: 'Pembangun Bahagian Belakang'
    , alt_logo: 'Penilaian Jenis Digital'
    , aria_select_language: 'Pilih bahasa'
    , nav_profile: 'Profil'
    , login_title: 'Log Masuk ke Akaun Anda'
    , email_label: 'Alamat Emel'
    , email_placeholder: 'Masukkan emel anda'
    , password_label: 'Kata Laluan'
    , password_placeholder: 'Masukkan kata laluan anda'
    , login_button: 'Log Masuk'
    , logging_in: 'Sedang log masuk…'
    , no_account: 'Belum ada akaun?'
    , register_here: 'Daftar di sini'
    , forgot_password: 'Lupa kata laluan?'
    , show_password: 'Tunjuk kata laluan'
    , hide_password: 'Sembunyi kata laluan'
    , default_login_error: 'Log masuk gagal. Sila semak kelayakan anda dan cuba lagi.'
    , twofa_title: 'Pengesahan Dua Faktor'
    , auth_app: 'Aplikasi Pengesah'
    , backup_code: 'Kod Sandaran'
    , email_otp: 'OTP Emel'
    , send_email_otp: 'Hantar OTP Emel'
    , verifying: 'Mengesahkan…'
    , verify: 'Sahkan'
    , back_to_login: 'Kembali ke Log Masuk'
    , totp_prompt: 'Masukkan kod 6 digit daripada aplikasi pengesah'
    , backup_prompt: 'Masukkan kod sandaran 8 aksara'
    , email_prompt: 'Masukkan kod 6 digit daripada emel'
    , old_password_changed_on: 'Kata laluan anda kali terakhir diubah pada'
    , reset_password_cta: 'Klik di sini untuk menetapkan semula kata laluan.'
    , dash_rec_start_tutorials: 'Mulakan dengan tutorial keselamatan peranti asas'
    , dash_rec_passwords_security: 'Pelajari kata laluan kukuh dan keselamatan akaun'
    , dash_rec_guidance_links_apps: 'Dapatkan panduan sebelum mengklik pautan atau memuat turun aplikasi'
    , type_security_savvy: 'Celik Keselamatan'
    , type_careless_clicker: 'Penekan Cuai'
    , type_password_reuser: 'Pengguna Semula Kata Laluan'
    , type_update_avoider: 'Pengelak Kemas Kini'
    , type_oversharer: 'Kongsi Berlebihan'
    , type_new_to_digital: 'Baharu Dalam Digital'
    , type_strategic_custodian: 'Penjaga Strategik'
    , type_technical_architect: 'Arkitek Teknikal'
    , type_network_liaison: 'Perantara Rangkaian'
    , type_operational_analyst: 'Penganalisis Operasi'
    , type_digital_consumer: 'Pengguna Digital'
    , km_sharing_reusing_passwords: 'Berkongsi atau guna semula kata laluan'
  },
  swk: {
    nav_home: 'Laman Utama',
    nav_about: 'Tentang Kamek',
    nav_contact: 'Hubungi Kamek',
    nav_assessment: 'Penilaian',
    nav_dashboard: 'Papan Pemuka Kamek',
    nav_account: 'Tetapan Akaun',
    nav_login: 'Masuk',
    nav_register: 'Daftar',
    nav_logout: 'Keluar',
    language_label: 'Basa',
    lang_en: 'English',
    lang_zh: '中文',
    lang_ms: 'Bahasa Melayu',
    lang_swk: 'Bahasa Sarawak',

    hero_title: 'Penilaian Jenih Digital',
    hero_sub: 'Kenali profil keselamatan digital kitak, nemu cadangan diperibadi untuk ngelindung kehadiran dalam talian kitak',
    btn_start_assessment: 'Mulakan Penilaian',
    card_title: 'Apa Jenih Digital Kitak?',
    card_body: 'Kitak Penekan Cuai, Pengguna Semula Kata Laluan, Pengelak Kemas Kini, Kongsi Berlebihan atau Celik Keselamatan? Cuba penilaian tok!',
    btn_learn_more: 'Kenak Lebih Banyak',

    assessment_results: 'Keputusan Penilaian',
    no_results: 'Sikda keputusan tersedia',
    retake_assessment: 'Ulang Penilaian',
    go_dashboard: 'Pergi ke Papan Pemuka',
    digital_type: 'Jenih Digital',
    confidence: 'Keyakinan',
    average_category_score: 'Purata Skor Kategori',
    total_risk: 'Jumlah Risiko',
    strengths: 'Kekuatan',
    weaknesses: 'Kelemahan',
    key_mistakes: 'Kesilapan Utama',
    recommendations: 'Cadangan',
    vulnerability_topics: 'Topik Kerentanan',
    definition: 'Definisi',
    primary_risk_profile: 'Profil Risiko Utama',
    type_drivers: 'Penyumbang Profil Risiko',
    type_debug: 'Analisis Penilaian',
    type_drivers_subtitle: 'Skor nya paling ngaruh profil risiko kitak',
    type_debug_subtitle: 'Perincian macam mana profil enggau jawapan ngubah hasil',
    debug_profile_type_label: 'Jenis Berasaskan Profil',
    debug_behavioral_type_label: 'Jenis Kelakuan',
    debug_distinctiveness_label: 'Keberbezaan',
    debug_risk_density_label: 'Ketumpatan Risiko',
    debug_responses_label: 'Bilangan Jawapan',
    actual_score_label: 'Skor Sebenar',
    correct_answers_label: 'Jawapan Betul',

    assessment_start_title: 'Kitak udah guna peranti digital sebelum tok?',
    yes: 'Udah',
    no: 'Belum',
    personal_age_label: 'Apa kumpulan umur kitak?',
    personal_gender_label: 'Apa jantina kitak?',
    personal_education_label: 'Apa kelayakan pendidikan tertinggi kitak?',
    personal_occupation_label: 'Apa pekerjaan utama kitak?',
    back: 'Balik',
    next: 'Terus',
    loading_questions: 'Ngamuat soalan…',
    failed_start_assessment: 'Gagal mulakan penilaian',
    no_question_available: 'Sikda soalan tersedia',
    failed_fetch_next: 'Gagal ambik soalan seterusnya',
    question_label: 'Soalan',
    of_30: 'dari 30',
    tip: 'Petua:',
    cat_phishing: 'Pancingan Data',
    cat_scams: 'Penipuan',
    cat_passwords: 'Kata Laluan & 2FA',
    cat_malware: 'Perisian Berniat Jahat',
    cat_data: 'Pengendalian Data & Wi‑Fi',
    cat_social: 'Kejuruteraan Sosial',
    opt_age_under_18: 'Bawah 18',
    opt_age_18_24: '18 - 24',
    opt_age_25_34: '25 - 34',
    opt_age_35_44: '35 - 44',
    opt_age_45_54: '45 - 54',
    opt_age_55_64: '55 - 64',
    opt_age_65_plus: '65 ke atas',
    opt_gender_male: 'Lelaki',
    opt_gender_female: 'Perempuan',
    opt_gender_na: 'Sik maok nyebut',
    opt_edu_none: 'Tiada pendidikan formal',
    opt_edu_school: 'Sekolah Rendah/Menengah',
    opt_edu_diploma: 'Diploma/Sijil',
    opt_edu_bachelor: 'Ijazah Sarjana Muda',
    opt_edu_master: 'Ijazah Sarjana',
    opt_edu_phd: 'Doktor Falsafah (Ph.D.) atau lebih tinggi',
    opt_other: 'Lain-lain',
    opt_occ_agriculture: 'Pertanian/Penternakan/Perikanan',
    opt_occ_banking: 'Perbankan/Kewangan/Insurans',
    opt_occ_biotech: 'Bioteknologi/Sains Hayat/Penjagaan Kesihatan',
    opt_occ_construction: 'Bangunan/Konstruksi/Kejuruteraan',
    opt_occ_business: 'Perniagaan/Pengurusan/Perundingan',
    opt_occ_creative: 'Kreatif/Reka Bentuk/Media',
    opt_occ_customer: 'Khidmat Pelanggan/Jualan/Ritel',
    opt_occ_education: 'Pendidikan/Akademia',
    opt_occ_gov: 'Kerajaan/Keselamatan Awam/Perundangan',
    opt_occ_it: 'IT/Komputer/Elektronik',
    opt_occ_manufacturing: 'Pembuatan/Operasi/Logistik',
    opt_occ_hospitality: 'Hospitaliti/Perkhidmatan Makanan',
    opt_occ_student: 'Pelajar',
    opt_occ_retired: 'Bersara',
    opt_occ_other: 'Lain-lain (sila nyatakan)',
    opt_occ_unemployed: 'Tidak bekerja',
    category_scores_label: 'Skor Kategori',

    dash_hello: 'Halo',
    dash_welcome_subtitle: 'Selamat datai ke papan pemuka keselamatan peribadi kitak',
    dash_title: 'Papan Pemuka Keselamatan Kitak',
    dash_overview: 'Gambaran Papan Pemuka',
    dash_digital_type: 'Jenih Digital Kitak',
    dash_security_score: 'Skor Keselamatan',
    dash_last_assessment: 'Penilaian Terakhir',
    dash_personalized_recs: 'Cadangan Dipersonalisasi',
    dash_take_new: 'Buat Penilaian Baru',

    login_access_required: 'Perlu Akses',
    login_prompt_message: 'Sila masuk atau daftar akaun untuk akses papan pemuka keselamatan kitak.',
    login_login_btn: 'Masuk ke Akaun Kitak',
    login_register_btn: 'Daftar Akaun Baru',
    login_why_title: 'Ngapa perlu daftar akaun?',
    login_track_progress: 'Jejak kemajuan keselamatan digital kitak',
    login_personalized_security: 'Dapat cadangan keselamatan diperibadi',
    login_view_history: 'Peda sejarah penilaian kitak',
    login_receive_alerts: 'Terima amaran keselamatan dan petua',

    feat_analysis_title: 'Analisis Dipersonalisasi',
    feat_analysis_desc: 'Dapat pandangan pasal tabiat keselamatan digital kitak',
    feat_recs_title: 'Cadangan Boleh Bertindak',
    feat_recs_desc: 'Terima petua keselamatan berdasarkan jenih digital kitak',
    feat_progress_title: 'Jejak Kemajuan Kitak',
    feat_progress_desc: 'Pantau penambahbaikan keselamatan kitak dari masa ke masa',

    notfound_title: 'Laman Sik Ditemui',
    notfound_desc: 'Laman yang kitak cari sikda atau udah dipindah.',
    notfound_return: 'Balik ke Laman Utama',

    about_title: 'Tentang Hornbill Sentinel',
    about_subtitle: 'Sistem Penilaian Jenih Digital & Penjana Profil untuk Kesedaran Keselamatan Siber di Sarawak/Malaysia',
    about_mission_title: 'Misi Kamek',
    about_mission_body: 'Ngangkat rakyat Malaysia — terutamanya Sarawak — ngenal dan ngurangkan risiko kebersihan keselamatan siber melalui penilaian Jenih Digital dipersonalisasi, profil bermakna, enggau cadangan boleh bertindak.',
    about_story_title: 'Cerita Kamek',
    about_story_body: 'Hornbill Sentinel beranak awal 2025 sebagai Projek Tahun Akhir di UTS — berasaskan paham bahawa kesilapan manusia selalunya pautan paling lemah dalam keselamatan siber.',
    about_approach_title: 'Pendekatan Kamek',
    about_approach_body1: 'Berlandaskan Protection Motivation Theory, sejajar dengan NIST CSF 2.0; kamek analisis pola kelakuan berisiko lalu ngelabel kitak ke salah satu “Jenih Digital” enggau nasihat tersuai.',
    about_approach_body2: 'Penambahbaikan berterusan dengan sokongan penyelidikan terkini enggau maklum balas pengguna sebenar.',
    about_team_title: 'Pasukan Kamek',

    alt_logo: 'Penilaian Jenih Digital',
    aria_select_language: 'Pilih basa',
    nav_profile: 'Profil',

    dash_rec_start_tutorials: 'Mulakan dengan tutorial keselamatan peranti asas',
    dash_rec_passwords_security: 'Belajar pasal kata laluan kukuh enggau keselamatan akaun',
    dash_rec_guidance_links_apps: 'Minta panduan sebelum ngelik pautan atau muat turun aplikasi',
    type_security_savvy: 'Celik Keselamatan',
    type_careless_clicker: 'Penekan Cuai',
    type_password_reuser: 'Pengguna Semula Kata Laluan',
    type_update_avoider: 'Pengelak Kemas Kini',
    type_oversharer: 'Kongsi Berlebihan',
    type_new_to_digital: 'Baharu Dalam Digital'
  }
};

// Question translations (subset with fallback)
const questionDict = {
  zh: {
    PHISH_E_1: {
      text: "来自‘Netflix’的邮件称付款被拒。",
      tip: '钓鱼邮件常模仿正规发件人，务必独立核实。',
      options: { click_enter: '点击并输入信息', ignore: '忽略', login_separately: '单独登录官网核实' }
    },
    PHISH_E_2: {
      text: '识别假邮件最简单的方法是看什么？',
      tip: '检查发件人域名、悬停查看链接、注意语法线索。',
      options: { sender_email: '发件人邮箱地址', blurry_logo: '模糊的标志', urgent_language: '紧急措辞' }
    },
    PHISH_M_1: {
      text: '将鼠标悬停在链接上时，应该看哪里？',
      tip: '状态栏显示真实URL；对比域名。',
      options: { top_bar: '浏览器顶部地址栏', bottom_left: '左下角状态栏', trust_text: '只相信文字' }
    },
    PHISH_M_3: {
      text: "有人冒充‘老板’紧急要求购买礼品卡。这是：",
      tip: '礼品卡请求常见于商业邮件诈骗；请同步方式核实。',
      options: { normal_request: '正常请求', confirm_boss: '诈骗；与老板口头确认', delete: '诈骗；删除' }
    },
    SCAM_E_1: {
      text: "你收到来自‘LHDN’的RM500退款短信并附bit.ly链接。",
      options: { click_refund: '点击领取退款', call_verify: '拨打官方热线核实', forward_friends: '转发给朋友以防万一' }
    },
    DATA_E_1: {
      text: '你在咖啡馆使用“Kopitiam_Free_WiFi”，需要查银行账户。',
      options: { go_ahead: '继续使用', use_cellular: '改用手机数据', password_only: '仅在有密码保护时连接' }
    },
    SOC_E_1: {
      text: '有人自称IT需要你现在提供密码进行“服务器迁移”。',
      options: { give_password_now: '提供密码', verify_helpdesk: '挂断并致电官方服务台核实', prove_identity: '要求其证明身份' }
    }
    , SOC_E_2: { text: '什么是“尾随进入”（物理安全）？' }
    , SOC_M_1: { text: '为何社交媒体上的“趣味问答”存在风险？' }
    , SOC_M_2: { text: '收到一位陌生漂亮人士的好友请求。' }
    , SOC_M_3: { text: '社会工程主要依赖于……' }
    , SOC_H_2: { text: '为何在社交媒体发布登机牌照片存在风险？' }
    , SOC_H_3: { text: '什么是“等价交换”（Quid Pro Quo）？' }
    , MAL_E_1: { text: '弹窗提示你的电脑感染了5个病毒；点击进行扫描。' }
    , MAL_X_1: { text: "你检测到某工作站向已知C2服务器发出“Beacon”，但EDR未告警。你的第一步是什么？" }
    , SCAM_E_3: { text: '网游中有人承诺只要提供登录信息就送你“免费”稀有物品。这是：' }
    , SCAM_M_1: { text: "来自‘Pos Laju’的短信，附.apk用于重新安排投递。" }
    , SCAM_M_3: { text: "来自‘Sarawak Energy’的来电：1小时内将断电，除非电话支付账单。" }
    , SCAM_H_2: { text: '为何短信中的.apk应用如此危险？' }
    , SCAM_H_3: { text: '在Marketplace购买二手物品时，卖家经常……' }
    , PHISH_H_2: { text: '什么是“Vishing”（语音钓鱼）？' }
    , PHISH_H_3: { text: '什么是“同形异义域名”（Punycode）攻击？' }
    , PHISH_M_2: { text: '钓鱼邮件的主要目标是什么？' }
    , PHISH_H_1: { text: '这是一封高度个性化并提到你工作的邮件，这是：' }
    , PHISH_H_4: { text: '绿色锁图标（SSL）表示什么？' }
    , PASS_E_1: { text: '哪一个是最安全的密码？' }
    , PASS_E_2: { text: '你如何管理你的密码？' }
    , PASS_M_1: { text: '什么是双重认证（2FA）？' }
    , PASS_M_2: { text: '同一个邮箱密码已用了5年。这有问题吗？' }
    , PASS_M_3: { text: '管理密码的最佳方式？' }
    , PASS_H_1: { text: '什么是“凭证填充”（Credential Stuffing）？' }
    , PASS_H_2: { text: '朋友向你索要Netflix密码。' }
    , PASS_H_3: { text: '最安全的2FA形式是？' }
    , PASS_H_4: { text: '什么是“口令短语”（Passphrase）？' }
    , MAL_E_2: { text: '从种子站下载“Photoshop”。' }
    , MAL_M_2: { text: '设备提示安装更新，你应该……' }
    , MAL_M_3: { text: '防止勒索软件导致数据损失的最佳保护是？' }
    , MAL_H_1: { text: '什么是“零日漏洞”？' }
    , MAL_H_2: { text: '什么是“僵尸网络”（Botnet）？' }
    , MAL_H_3: { text: '什么是“键盘记录器”（Keylogger）？' }
    , MAL_H_4: { text: '旁加载应用是什么意思？' }
    , MAL_H_5: { text: "你在论坛看到一个‘有用’的代码片段解决你的Bug，你应该：" }
    , DATA_H_4: { text: '什么是“肩窥”（Shoulder Surfing）？' }
    , SOC_H_1: { text: '什么是“借口欺骗”（Pretexting）？' }
    , SOC_H_4: { text: '攻击者冒充愤怒的高层主管，索要敏感信息。这是：' }
    , SOC_H_5: { text: "一位‘客户’来电称账户被锁，急需查询余额，且验证失败仍威胁投诉。你会怎么做？" }
    , SCAM_E_2: { text: "来自‘PDRM’的来电称你的IC涉案，要求转账至‘安全’账户。你应该：" }
    , SCAM_M_2: { text: '一则Facebook广告宣称“砂拉越投资”24小时保证30%收益。' }
    , SCAM_H_1: { text: '你收到包含TAC/OTP的短信，随后有人来电要求你读出数字。' }
    , M2_Q9: {
      text: '你在社交媒体看到一则投资广告称每周都有很高回报且几乎无风险。你最可能会怎么做？',
      tip: '当“轻松高回报”出现时，应放慢脚步，了解其真实运作。',
      options: { invest_test: '先小额尝试', ask_friends: '向推广者询问更多细节', avoid_ponzi: '避免，因为听起来不真实', contact_agent: '发给朋友征求意见' }
    }
    , M2_Q16: {
      options: { ask_id: '结束通话且不提供任何登录信息' }
    }
    , M6_Q44: {
      options: { ask_id: '要求对方提供官方身份信息' }
    }
  },
  ms: {
    PHISH_E_1: {
      text: "Emel daripada 'Netflix' menyatakan pembayaran ditolak.",
      tip: 'Emel pancingan sering meniru penghantar sah; sahkan secara berasingan.',
      options: { click_enter: 'Klik dan masukkan maklumat', ignore: 'Abaikan', login_separately: 'Log masuk secara berasingan' }
    },
    PHISH_E_2: {
      text: 'Cara paling mudah mengenal pasti emel palsu ialah?',
      tip: 'Semak domain penghantar, halakan tetikus pada pautan, perhatikan tatabahasa.',
      options: { sender_email: 'Alamat emel penghantar', blurry_logo: 'Logo kabur', urgent_language: 'Bahasa mendesak' }
    },
    PHISH_M_1: {
      text: 'Apabila menghalakan tetikus pada pautan, di mana anda lihat?',
      tip: 'Bar status menunjukkan URL sebenar; bandingkan domain.',
      options: { top_bar: 'Bar atas pelayar', bottom_left: 'Sudut kiri bawah', trust_text: 'Percaya teks sahaja' }
    },
    PHISH_M_3: {
      text: "Emel daripada 'bos' meminta anda membeli kad hadiah dengan segera. Ini ialah:",
      tip: 'Permintaan kad hadiah biasa dalam penipuan BEC; sahkan secara serentak.',
      options: { normal_request: 'Permintaan biasa', confirm_boss: 'Penipuan; sahkan dengan bos', delete: 'Penipuan; padam' }
    },
    SCAM_E_1: {
      text: "SMS daripada 'LHDN' tentang bayaran balik RM500 dengan pautan bit.ly.",
      options: { click_refund: 'Klik untuk bayaran balik', call_verify: 'Hubungi talian rasmi', forward_friends: 'Hantar kepada rakan' }
    },
    DATA_E_1: {
      text: 'Anda di kafe menggunakan "Kopitiam_Free_WiFi" dan perlu semak bank.',
      options: { go_ahead: 'Teruskan', use_cellular: 'Guna data telefon', password_only: 'Sambung jika dilindungi kata laluan' }
    },
    SOC_E_1: {
      text: 'Seseorang dari IT perlukan kata laluan untuk “migrasi pelayan”.',
      options: { give_password_now: 'Berikan kata laluan', verify_helpdesk: 'Hubungi helpdesk rasmi untuk sahkan', prove_identity: 'Minta bukti identiti' }
    }
    , SOC_E_2: { text: 'Apakah “tailgating” (keselamatan fizikal)?' }
    , SOC_M_1: { text: 'Mengapa kuiz “seronok” di media sosial berisiko?' }
    , SOC_M_2: { text: 'Permintaan rakan baharu daripada individu yang tidak dikenali.' }
    , SOC_M_3: { text: 'Kejuruteraan sosial bergantung kepada…' }
    , SOC_H_2: { text: 'Mengapa memuat naik foto pas masuk penerbangan berisiko?' }
    , SOC_H_3: { text: 'Apakah “Quid Pro Quo”?' }
    , MAL_E_1: { text: 'Pop-up menyatakan komputer anda dijangkiti 5 virus; klik untuk imbas.' }
    , MAL_X_1: { text: "Anda mengesan ‘Beacon’ dari workstation ke pelayan C2 yang diketahui, tetapi EDR tidak menandakan. Apakah langkah pertama anda?" }
    , SCAM_E_3: { text: 'Seseorang dalam permainan menawarkan item “percuma” yang jarang jika anda memberikan butiran log masuk. Ini ialah:' }
    , SCAM_M_1: { text: "SMS daripada ‘Pos Laju’ dengan .apk untuk menjadual semula penghantaran." }
    , SCAM_M_3: { text: "Panggilan daripada ‘Sarawak Energy’: bekalan elektrik diputus dalam 1 jam kecuali bayar melalui telefon." }
    , SCAM_H_2: { text: 'Mengapa fail .apk daripada SMS sangat berbahaya?' }
    , SCAM_H_3: { text: 'Membeli barang terpakai di Marketplace, penjual selalunya…' }
    , PHISH_H_2: { text: 'Apakah “Vishing”?' }
    , PHISH_H_3: { text: 'Apakah serangan “Punycode”?' }
    , PHISH_M_2: { text: 'Apakah tujuan utama emel pancingan?' }
    , PHISH_H_1: { text: 'Emel sangat diperibadikan dan merujuk kerja anda. Ini ialah:' }
    , PHISH_H_4: { text: 'Apakah maksud ikon kunci hijau (SSL)?' }
    , PASS_E_1: { text: 'Yang manakah kata laluan paling selamat?' }
    , PASS_E_2: { text: 'Bagaimana anda mengurus kata laluan anda?' }
    , PASS_M_1: { text: 'Apakah Pengesahan Dua Faktor (2FA)?' }
    , PASS_M_2: { text: 'Kata laluan emel yang sama digunakan selama 5 tahun. Adakah ini masalah?' }
    , PASS_M_3: { text: 'Cara terbaik mengurus kata laluan?' }
    , PASS_H_1: { text: 'Apakah “Credential Stuffing”?' }
    , PASS_H_2: { text: 'Rakan meminta kata laluan Netflix anda.' }
    , PASS_H_3: { text: 'Bentuk 2FA yang paling selamat?' }
    , PASS_H_4: { text: 'Apakah “Passphrase”?' }
    , MAL_E_2: { text: 'Muat turun “Photoshop” daripada laman torrent.' }
    , MAL_M_2: { text: 'Peranti meminta kemas kini, anda patut…' }
    , MAL_M_3: { text: 'Perlindungan terbaik terhadap kehilangan data akibat ransomware?' }
    , MAL_H_1: { text: 'Apakah “Zero‑Day”?' }
    , MAL_H_2: { text: 'Apakah “Botnet”?' }
    , MAL_H_3: { text: 'Apakah “Keylogger”?' }
    , MAL_H_4: { text: 'Apakah maksud “sideloading” aplikasi?' }
    , MAL_H_5: { text: "Anda menemui potongan kod ‘berguna’ di forum untuk menyelesaikan pepijat. Anda patut:" }
    , DATA_H_4: { text: 'Apakah “Shoulder Surfing”?' }
    , SOC_H_1: { text: 'Apakah “Pretexting”?' }
    , SOC_H_4: { text: 'Penyerang berpura‑pura menjadi eksekutif tertinggi yang marah dan menuntut maklumat. Ini ialah:' }
    , SOC_H_5: { text: "‘Pelanggan’ menelefon mendakwa akaun dikunci, mendesak tahu baki; gagal pengesahan dan mengugut untuk mengadu. Apa yang anda lakukan?" }
    , SCAM_E_2: { text: "Panggilan daripada ‘PDRM’ mendakwa IC anda terlibat jenayah dan minta pindah ke akaun ‘selamat’." }
    , SCAM_M_2: { text: 'Iklan Facebook “pelaburan Sarawak” menjamin 30% dalam 24 jam.' }
    , SCAM_H_1: { text: 'Anda terima SMS TAC/OTP; seseorang menelefon minta anda bacakan nombor.' }
    , M2_Q9: {
      text: 'Anda melihat iklan di media sosial mengatakan pelaburan boleh memberi pulangan tinggi setiap minggu dengan hampir tiada risiko. Apa yang paling mungkin anda lakukan?',
      tip: 'Apabila wang “tumbuh laju” dengan usaha minima, perlahan dan fahami cara sebenar ia berfungsi.',
      options: { invest_test: 'Cuba melabur jumlah kecil dahulu', ask_friends: 'Tanya pihak yang mempromosi untuk butiran lanjut', avoid_ponzi: 'Elakkan kerana kedengaran tidak realistik', contact_agent: 'Kongsi kepada rakan untuk minta pandangan' }
    }
    , M2_Q16: {
      options: { ask_id: 'Tamatkan panggilan dan jangan kongsi sebarang butiran log masuk' }
    }
    , M6_Q44: {
      options: { ask_id: 'Minta pengenalan rasmi sebelum meneruskan' }
    }
  },
  swk: {
    M2_Q9: {
      text: 'Kitak meda iklan di media sosial madah pelaburan ulih ngasuh pulangan tinggi tiap minggu hampir nadai risiko. Apa hal kitak paling mungkin buat?',
      tip: 'Mun duit “nambah laju” tanpa usaha besai, pelan lalu paham baka mana nya berjalai.',
      options: { invest_test: 'Cuba melabur jumlah kecik dulu', ask_friends: 'Tanya orang ti mempromosi minta butir lebih', avoid_ponzi: 'Elak laban nadai realistik', contact_agent: 'Kongsi ngena kawan minta pandangan' }
    }
  }
};

// Option value translations (covers all option values in questions.js)
const optionDict = {
  zh: {
    click_enter: '点击并输入信息', ignore: '忽略', login_separately: '单独登录',
    sender_email: '发件人邮箱地址', blurry_logo: '模糊的标志', urgent_language: '紧急措辞',
    top_bar: '浏览器顶部地址栏', bottom_left: '左下角状态栏', trust_text: '只相信文字',
    give_virus: '传播病毒', scare_you: '恐吓你', steal_details: '窃取登录/信用卡信息', sell_product: '向你推销产品',
    normal_request: '正常请求', confirm_boss: '诈骗；与老板口头确认',
    spear: '鱼叉式钓鱼', spam: '垃圾邮件', vishing: '语音钓鱼', viruses: '带病毒的钓鱼', voice: '通过语音/电话的钓鱼', video: '通过视频的钓鱼',
    safe: '网站100%安全', owned_legit: '合法公司所有', encrypted: '加密连接；网站仍可能是骗局',
    lucky: '幸运机会', scam: '常见骗局会盗号', change_later: '可以，只要之后改密码',
    pay: '立即付款', hang_verify: '挂断并通过官方渠道核实', continue_call: '继续通话获取更多信息',
    click: '点击', verify_hotline: '致电官方热线核实', forward: '转发给朋友以防万一',
    install_apk: '安装该应用', delete_apk: '删除', delete: '删除', official_site: '通过官网查询',
    invest_small: '小额试投', too_good: '好得不真实，可能骗局', great_opportunity: '好机会',
    pay_phone: '付款以保留供电', hang_check_app: '挂断并用官方App核实', argue: '与其争论',
    read: '读给他们', hang: '挂断', verify_ic: '要求核实我的身份证',
    only_android: '只在Android上运行', overlay: '可覆盖银行App登录界面', low_quality: '低质量应用',
    meet_in_person: '要求当面见面', pay_outside: '要求平台外支付', big_discount: '提供大幅折扣', ask_address: '索要你的地址',
    quick_theft: '一次性快速盗窃', long_term_groom: '长期诱导后推虚假加密投资', farming: '与农场相关的骗局', small_phish: '很小的钓鱼尝试', unicode_url: '使用特殊字符伪装URL', new_coders: '针对新手的攻击',
    'p@ssw0rd123': 'P@ssw0rd123', mycatfluffy1998: '我的猫Fluffy1998', 'qZ!9#vB*2p': 'qZ!9#vB*2p',
    same_one: '多数账号用同一密码', few_different: '用几组不同密码', notebook: '写在笔记本',
    password_plus_factor: '密码加第二因素', two_words: '由两个词构成的密码', two_passwords: '两个不同密码',
    no_strong: '不，密码很强', yes_breach: '是，可能已泄露', no_hard_remember: '不，新的难记',
    password_manager: '加密的密码管理器', browser_save: '保存在浏览器', word_doc: '桌面上的Word文档',
    many_passwords_one: '对一个账号尝试多个密码', one_leaked_many_sites: '用一个泄露密码登录多站点', too_long: '密码太长',
    give: '给他们', dont_share: '不，分享不安全', give_change: '给，但让他改密码',
    sms: '短信', app: '验证器App', usb_key: '物理USB密钥',
    short_complex: '短而复杂的密码', long_words: '较长的多词短语', security_question: '安全问题',
    close: '关闭浏览器/标签页', call_number: '拨打屏幕上的号码',
    safe_free: '获取免费软件的安全方式', very_high_risk: '风险极高；破解软件传播恶意软件', av_on: '有风险但开着杀毒就好',
    steals_password: '窃取你的密码', encrypts_files: '加密文件并勒索', slows_computer: '让电脑变慢',
    ignore_update: '忽略它', do_asap: '尽快更新', wait_months: '等几个月',
    firewall: '强防火墙', antivirus: '好杀毒软件', offline_backup: '近期离线备份', pay_ransom: '支付赎金',
    easy_exploit: '易被利用的漏洞', unknown_no_patch: '开发者未知；无补丁', first_day: '每月第一天的病毒',
    network_infected: '受控的感染设备网络', fishing_net: '一种渔网', ai_robot: 'AI机器人',
    person_lock: '锁门的人', program_finds_passwords: '寻找密码的程序', records_keys: '记录按键并外传的恶意软件',
    install_unofficial: '从非官方来源安装', move_home: '移到主屏幕', runs_background: '后台运行的应用',
    go_ahead: '继续使用，很安全', use_cellular: '不要；用手机数据', if_passworded: '仅在有密码保护时连接',
    plug_work_pc: '插入工作电脑找失主', give_security: '交给IT/安全部门', wipe_keep: '清空并留下自用',
    regular_bin: '丢进普通垃圾桶', shred_burn: '碎纸或焚烧', recycling_bin: '丢进回收桶',
    send_friend: '发给朋友', refuse_mykad: '拒绝；MyKad高度敏感', cover_photo: '遮住照片后再发',
    faster_internet: '让网更快', encrypts_wifi: '在公共Wi‑Fi加密流量', blocks_all_viruses: '阻止所有病毒',
    physical_between: '黑客在两人之间', intercept_traffic: '黑客拦截你与互联网之间的通信', pop_up: '弹窗广告',
    evil_twin: '恶意孪生网络', two_routers: '只是两台路由器', premium_network: '更快的高级网络',
    anonymous: '让我100%匿名并隐藏', local_only: '仅阻止本机历史/Cookie；他人仍可见', encrypts_all: '加密我的全部数据',
    dance_move: '一种舞蹈动作', look_over: '从肩后偷看密码/PIN', phishing_type: '一种钓鱼',
    give_password_now: '把密码给他们', verify_helpdesk: '挂断并联系官方IT服务台核实', ask_proof: '让其证明身份',
    driving_close: '跟车太近', follow_secure_door: '跟随他人进门而不刷卡', parking_party: '停车场派对',
    not_risky: '不危险', security_questions_info: '用于密码重置的安全问题答案', annoys_friends: '会惹恼朋友',
    accept: '接受好友请求', ignore_delete: '忽略或删除；可能是机器人/骗子', check_mutuals: '先看是否有共同好友',
    hacking_tech: '黑客技术', human_psychology: '人类心理（信任/恐惧/紧迫）', guessing_passwords: '猜密码',
    text_before_call: '先发短信再打电话', fake_scenario: '捏造情景以套信息', book_text: '书的开篇文字',
    shows_travel: '炫耀出行', barcode_risk: '条码泄露姓名和订票信息',
    malware_type: '一种恶意软件', something_for_something: '以物易物（有所交换）', legal_term: '法律术语',
    whaling_vishing: '鲸钓（邮件）或语音钓鱼', authority_intimidation: '权威与恐吓', normal_day: '办公室的日常',
    calm_down: '报余额安抚对方', escalate: '无核实不提供信息并上报经理', find_other_means: '通过其他途径找账号',
    unplug: '拔掉网线', isolate_vlan: '隔离至“隔离”VLAN', pcap: '开始全流量抓包', reimage: '立刻重装系统',
    copy_paste: '直接复制粘贴到生产代码', test_merge: '测试后合并', analyze_sandbox: '先分析安全风险并沙箱测试',
    assume_error: '认为是系统错误并暂不处理',
    review_contact_update: '查看账户活动并联系客服，同时更新账户凭据',
    uninstall_monitor: '卸载应用并在几天内监控银行对账',
    wait_see: '先观望是否会发生更多交易',
    proceed_download: '继续下载以了解内容',
    cancel_download: '取消下载以避免安装不明来源应用',
    open_downloaded: '谨慎打开已下载文件查看',
    share_code: '分享验证码以尽快完成',
    decline_code: '拒绝提供验证码',
    read_code: '仔细读出验证码以核实来电者',
    ask_id: '要求对方提供官方身份信息',
    refund_immediately: '立即退款',
    verify_balance: '先在应用中核实余额',
    block_sender: '未核实即拉黑对方',
    leave_funds: '不检查账户而保持不动',
    ignore_alert: '忽略提醒，因为尚未造成损害',
    change_password: '更改密码并检查安全设置',
    post_online: '发帖询问他人是否遇到同样问题',
    wait_alert: '等待是否会出现另一条提醒',
    pay_sextortion: '付款以避免事态升级',
    block_report: '加固账户、拉黑并向相关机构举报',
    negotiate_less: '尝试协商更低金额',
    delete_social: '删除所有社交媒体账户',
    grant_all: '授予所有权限使应用顺畅运行',
    limit_permissions: '审查并限制权限或不安装该应用',
    adjust_later: '先安装，之后再调整权限',
    ask_others: '询问其他用户是否也授权',
    ship_item: '安排发货',
    verify_bank_app: '在官方银行渠道直接核实交易',
    trust_buyer: '接受截图作为付款证明',
    ask_screenshot: '要求再提供一张截图',
    pay_fee_scholarship: '为确保奖学金而付款',
    ignore_scholarship: '拒绝该提议',
    ask_letter: '要求正式确认文件',
    ask_seniors: '向学长或前辈咨询意见',
    continue_same: '继续使用相同密码以免忘记',
    change_gradually: '逐步为重要账户更改密码',
    write_store: '写下密码并安全存放',
    share_trusted: '与可信任的人共享密码',
    transfer_urgent: '立即汇款',
    hang_verify_child: '保持冷静，并通过其他可信方式核实',
    ask_amount: '询问他们在哪里',
    call_back_scam: '与其保持通话',
    usb: '将文件复制到你的个人U盘',
    cloud: '上传到你的个人云存储',
    official_vpn: '通过官方系统或经批准的VPN访问文件',
    email_self: '把文件发邮件给自己',
    restart: '重启电脑看看是否恢复正常',
    disconnect: '立即将电脑断网',
    inform: '询问同事是否也有同样问题',
    delete_note: '尝试删除该信息并继续工作',
    incognito: '使用浏览器的隐私/无痕模式',
    no_login: '使用咖啡店提供的免费Wi‑Fi',
    vpn: '访问工作系统前使用公司批准的VPN',
    ask_staff: '询问咖啡店员工该Wi‑Fi是否安全',
    click_pay: '点击链接支付费用',
    check_official_app: '通过官方应用进行核实',
    reply_sms: '回复短信以获取更多信息',
    call_sms_number: '拨打短信中的号码',
    call_999: '拨打 999 紧急热线',
    call_997: '联系 997 寻求专门协助',
    call_112: '拨打 112 处理国际紧急情况',
    call_bank: '首先通知你银行的热线',
    login_claim: '登录以领取奖励',
    exit_phishing: '不提供任何登录信息并退出页面',
    fake_password: '输入错误密码测试网站',
    share_friends: '把帖子分享给他人',
    yes_quick: '若会话很短则使用该Wi‑Fi网络',
    no_mobile_data: '优先使用移动数据',
    yes_incognito: '在使用公共Wi‑Fi时启用隐私模式',
    yes_password: '仅在有密码保护的网络连接',
    turn_off_monitor: '关闭显示器',
    webcam_cover: '未使用时使用摄像头物理遮挡',
    ignore_webcam: '忽略风险',
    uninstall_driver: '卸载摄像头驱动',
    click_summon: '点击链接以验证传票',
    ignore_mobile_sms: '忽略该信息',
    reply_summon: '回复以索取更多信息',
    call_summon: '拨打短信中的号码',
    panic_contact: '拨打信息中的号码',
    ignore_warrant: '忽略并通过官方渠道核实',
    forward_friends: '分享给家人',
    pay_lawyer: '回复询问真假',
    upload_selfie: '上传自拍照',
    review_policy: '仔细阅读隐私政策',
    use_friend: '使用朋友的照片',
    ignore_policy: '忽略隐私条款并继续',
    continue_chat: '继续聊天以示礼貌',
    block_pig: '拉黑发件人',
    ask_who: '要求对方说明身份',
    send_photo: '分享个人信息以建立信任',
    enable_macros: '启用宏',
    no_macros: '不要启用宏',
    print_doc: '打印文档',
    convert_pdf: '转换为 PDF',
    continue_atm: '不遮挡快速输入 PIN',
    cover_keypad: '输入时用手遮挡键盘',
    ask_move: '要求对方后退再输入 PIN',
    simple_pin: '改为更简单的 PIN 以免出错',
    plug_direct: '设备直接连接公共充电器',
    use_adapter: '使用个人充电器',
    turn_off: '在使用公共充电器前关闭手机',
    avoid_charge: '完全避免在公共场所充电'
    , pay_premium: '支付费用以提高收益潜力'
    , stop_task: '停止参与并退出该计划'
    , negotiate_premium: '询问为何需要支付费用'
    , ask_withdraw_premium: '询问何时可提现累积收益'
    , ask_waiter: '询问工作人员该下载是否必要'
    , agree_help: '让其详细说明'
    , reject_official_counter: '拒绝并通过官方部门核实'
    , give_ic_copy: '向其提供你的证件复印件'
    , ask_docs: '询问邻居是否见过此人'
    , login_game: '快速登录'
    , refuse_game_phish: '避免登录'
    , share_friends_game: '将链接分享给朋友以确认'
    , secondary_account: '用次要账号测试链接'
    , install_spare: '安装到旧机或不常用的手机上'
    , no_sideload: '避免通过未知链接安装应用'
    , ask_members: '询问群里其他人是否安全'
    , disable_security: '安装看看应用如何运作'
    , provide_details: '提供信息以完成流程'
    , hang_up_bank: '询问来电者的员工信息'
    , visit_later: '稍后到银行咨询'
    , restart_phone: '重启手机'
    , contact_telco_bank: '立即联系电讯商与银行以保护账户并核验交易'
    , wait_signal: '等待信号恢复并监控消息'
    , buy_new_phone: '购买新设备替换可能受影响的旧设备'
    , approve: '为了避免麻烦，尽快批准'
    , verify_channel: '通过已知电话号码或办公渠道联系主管'
    , reply_docs: '回复邮件索取更多细节'
    , delay: '等待看看是否还有其他邮件'
    , stop_pig: '停止与其讨论金钱'
    , video_call: '继续聊天看看情况'
    , visit_office: '他们的办公室地址'
    , review_social: '他们的社交媒体活动'
    , check_bnm_sc: '官方监管机构警示名单'
    , ask_license: '介绍人说话的自信程度'
    , accept_passive: '接受，因为看起来很轻松'
    , refuse_mule: '接受，但限制其使用额度'
    , accept_limit: '拒绝该提议'
    , give_no_card: '询问这些交易用于何处'
    , provide_details_job: '提交所要求的信息'
    , refuse_identity: '拒绝并停止申请'
    , send_blurred: '提供部分或打码的证件'
    , ask_contract: '索要雇佣条款的确认'
    , transfer_deposit: '转账订金以锁定房源'
    , refuse_viewing: '拒绝并寻找其他住处'
    , pay_half: '提出支付一半订金'
    , ask_video: '索要更多照片或视频'
    , use_immediately: '插入SIM卡立即使用'
    , factory_reset: '执行完整的出厂重置'
    , change_lock: '更改锁屏与密码'
    , remove_apps: '移除不熟悉的应用'
    , buy_quickly: '在售罄前尽快购买'
    , scam_price: '由于价格不现实，判定为可能骗局'
    , ask_photos: '向卖家索取更多产品照片'
    , check_followers: '查看卖家的粉丝与互动'
    , press_1: '按下数字以了解更多'
    , hang_up_lhdn: '挂断并稍后通过官方渠道核实'
    , call_back_same: '立即回拨该号码'
    , provide_details_lhdn: '提供个人信息以便他们处理'
    , transfer_audit: '为“审计”而转账'
    , hang_up_police: '挂断并通过官方渠道核实'
    , ask_badge: '询问来电者的警员编号'
    , explain_self: '解释你的情况'
    , give_partial: '提供部分或打码的证件'
    , refuse_verify: '拒绝并通过官方部门核实'
    , ask_hearing: '询问听证详情'
    , explain_unaware: '说明不知情'
    , send_otp: '分享一次性密码'
    , call_friend: '致电好友核实'
    , ignore_msg: '忽略该消息'
    , ask_why: '询问原因'
    , accept_offer: '立即接受邀请以确保职位'
    , verify_embassy: '通过官方政府或使馆渠道核实'
    , ask_accommodation: '询问住宿与工作条件'
    , bring_friend: '询问能否与朋友一同申请'
    , click_login: '点击登录链接'
    , check_url_gov: '通过政府官网核实'
    , reply_email: '回复邮件以获取更多信息'
    , forward_classmates: '转发给同学征求意见'
    , join_early: '尽早加入以最大化回报'
    , reject_pyramid: '拒绝；这是金字塔骗局'
    , ask_products: '询问实际销售的产品'
    , try_month: '先试一个月'
    , pay_blackmail: '付款'
    , report_blackmail: '向有关部门举报'
    , negotiate_blackmail: '协商'
    , ignore_blackmail: '完全忽略'
    , call_microsoft: '拨打屏幕上的号码'
    , close_browser: '关闭浏览器并忽略警告'
    , pay_antivirus: '为推荐的杀毒软件付款'
    , restart_computer: '重启电脑并希望警告消失'
    , click_tng: '点击链接'
    , check_app_tng: '打开官方应用查看账户'
    , reply_tng: '回复短信以澄清'
    , share_tng: '转发信息向朋友咨询'
    , close_browser_hotel: '直接关闭浏览器'
    , logout_clear: '完全登出并清除历史与缓存'
    , leave_immediately: '立刻离开'
    , donate_now: '立即捐款'
    , verify_ngo: '核实请求的合法性'
    , share_post: '分享帖子'
    , donate_crypto: '捐赠加密货币'
    , no_risk: '没有风险'
    , read_data: '扩展可能访问全部浏览数据'
    , slow_browser: '只会让浏览器变慢'
    , safe_popular: '热门就安全'
    , allow_supervise: '看起来正规就让他进入'
    , deny_verify: '请其等待，同时向管理层或厂商核实来访'
    , sign_log: '允许进入但在旁监督'
    , ask_card: '让其签访客簿后继续'
    , install_now: '立刻安装以避免问题'
    , scan_av: '先用杀毒软件扫描'
    , reject_official: '仅从官方厂商网站下载更新'
    , test_personal: '先在备用电脑上安装测试'
    , passphrase_mfa: '使用长口令并启用额外验证步骤'
    , monthly_change: '将密码写下并安全存放'
    , offline_store: '复用与邮箱相同的密码'
    , assist: '向人力或安保部门报告情况'
    , report: '随口询问用途以了解情况'
    , ask: '帮助其搬运文件'
  },
  ms: {
    click_enter: 'Klik dan masukkan maklumat', ignore: 'Abaikan', login_separately: 'Log masuk secara berasingan',
    sender_email: 'Alamat emel penghantar', blurry_logo: 'Logo kabur', urgent_language: 'Bahasa mendesak',
    top_bar: 'Bar atas pelayar', bottom_left: 'Sudut kiri bawah', trust_text: 'Percaya teks sahaja',
    give_virus: 'Memberi virus', scare_you: 'Menakutkan anda', steal_details: 'Mencuri maklumat log masuk/kad kredit', sell_product: 'Menjual produk kepada anda',
    normal_request: 'Permintaan biasa', confirm_boss: 'Penipuan; sahkan dengan bos secara lisan',
    spear: 'Pancingan data bertujuan (spear phishing)', spam: 'Spam', vishing: 'Pancingan suara (vishing)', viruses: 'Pancingan dengan virus', voice: 'Pancingan melalui suara/panggilan', video: 'Pancingan menggunakan video',
    safe: 'Laman 100% selamat', owned_legit: 'Dimiliki syarikat sah', encrypted: 'Sambungan disulitkan; laman masih boleh menipu',
    lucky: 'Peluang bertuah', scam: 'Penipuan biasa untuk mencuri akaun', change_later: 'Baik, asalkan tukar kata laluan kemudian',
    pay: 'Bayar segera', hang_verify: 'Letak dan sahkan melalui saluran rasmi', continue_call: 'Teruskan panggilan untuk maklumat',
    click: 'Klik', verify_hotline: 'Hubungi talian rasmi untuk sahkan', forward: 'Hantar kepada rakan untuk berjaga-jaga',
    install_apk: 'Pasang aplikasi', delete_apk: 'Padam', delete: 'Padam', official_site: 'Semak melalui laman rasmi',
    invest_small: 'Labur sedikit untuk menguji', too_good: 'Terlalu bagus untuk benar; kemungkinan penipuan', great_opportunity: 'Peluang hebat',
    pay_phone: 'Bayar untuk kekalkan bekalan', hang_check_app: 'Letak dan semak melalui aplikasi rasmi', argue: 'Berdebat dengan mereka',
    read: 'Bacakan kepada mereka', hang: 'Letak', verify_ic: 'Minta mereka sahkan IC saya',
    only_android: 'Hanya berfungsi pada Android', overlay: 'Boleh menindih skrin log masuk bank', low_quality: 'Aplikasi berkualiti rendah',
    meet_in_person: 'Minta berjumpa', pay_outside: 'Bayar di luar platform', big_discount: 'Tawar diskaun besar', ask_address: 'Minta alamat anda',
    quick_theft: 'Kecurian pantas sekali', long_term_groom: 'Pujukan jangka panjang untuk pelaburan kripto palsu', farming: 'Penipuan berkaitan pertanian', small_phish: 'Cubaan pancingan kecil', unicode_url: 'Guna huruf khas untuk menyerupai URL', new_coders: 'Serangan terhadap coder baharu',
    'p@ssw0rd123': 'P@ssw0rd123', mycatfluffy1998: 'MyCatFluffy1998', 'qZ!9#vB*2p': 'qZ!9#vB*2p',
    same_one: 'Guna yang sama untuk kebanyakan akaun', few_different: 'Guna beberapa yang berbeza', notebook: 'Tulis dalam buku nota',
    password_plus_factor: 'Kata laluan + faktor kedua', two_words: 'Kata laluan dua perkataan', two_passwords: 'Dua kata laluan berbeza',
    no_strong: 'Tidak, ia kuat', yes_breach: 'Ya, mungkin didedahkan dalam kebocoran', no_hard_remember: 'Tidak, sukar ingat yang baharu',
    password_manager: 'Pengurus kata laluan disulitkan', browser_save: 'Simpan dalam pelayar', word_doc: 'Dokumen Word di desktop',
    many_passwords_one: 'Cuba banyak kata laluan pada satu akaun', one_leaked_many_sites: 'Guna satu kata laluan bocor di banyak laman', too_long: 'Kata laluan terlalu panjang',
    give: 'Berikan kepada mereka', dont_share: 'Tidak, berkongsi tidak selamat', give_change: 'Beri, tapi minta tukar kemudian',
    sms: 'SMS', app: 'Aplikasi Pengesah', usb_key: 'Kunci USB fizikal',
    short_complex: 'Kata laluan pendek dan kompleks', long_words: 'Frasa berbilang perkataan yang panjang', security_question: 'Soalan keselamatan',
    close: 'Tutup pelayar/tab', call_number: 'Hubungi nombor telefon di skrin',
    safe_free: 'Cara selamat mendapatkan perisian percuma', very_high_risk: 'Risiko sangat tinggi; perisian retak sebarkan malware', av_on: 'Berisiko tapi ok jika AV dihidupkan',
    steals_password: 'Mencuri kata laluan anda', encrypts_files: 'Menyulitkan fail dan menuntut bayaran', slows_computer: 'Memperlahan komputer',
    ignore_update: 'Abaikan', do_asap: 'Buat secepat mungkin', wait_months: 'Tunggu beberapa bulan',
    firewall: 'Firewall kukuh', antivirus: 'Antivirus bagus', offline_backup: 'Sandaran luar talian terkini', pay_ransom: 'Bayar tebusan',
    easy_exploit: 'Kerentanan mudah dieksploitasi', unknown_no_patch: 'Tidak diketahui pembangun; tiada patch', first_day: 'Virus hari pertama bulan',
    network_infected: 'Rangkaian peranti dijangkiti dikawal', fishing_net: 'Sejenis jaring ikan', ai_robot: 'Robot dikuasakan AI',
    person_lock: 'Orang yang mengunci pintu', program_finds_passwords: 'Program yang mencari kata laluan', records_keys: 'Malware merekod ketukan kekunci dan menghantar keluar',
    install_unofficial: 'Pasang dari sumber tidak rasmi', move_home: 'Pindah ke skrin utama', runs_background: 'Aplikasi berjalan di latar',
    go_ahead: 'Teruskan, ia selamat', use_cellular: 'Jangan; guna data telefon', if_passworded: 'Sambung jika dilindungi kata laluan',
    plug_work_pc: 'Pasang ke PC kerja untuk mencari pemilik', give_security: 'Serahkan kepada IT/Keselamatan', wipe_keep: 'Padam dan simpan',
    regular_bin: 'Buang ke tong biasa', shred_burn: 'Koyak atau bakar', recycling_bin: 'Buang ke tong kitar semula',
    send_friend: 'Hantar kepada rakan', refuse_mykad: 'Tolak; MyKad sangat sensitif', cover_photo: 'Hantar tapi tutup foto',
    faster_internet: 'Menjadikan internet lebih pantas', encrypts_wifi: 'Menyulitkan trafik pada Wi‑Fi awam', blocks_all_viruses: 'Menyekat semua virus',
    physical_between: 'Penggodam secara fizikal di antara orang', intercept_traffic: 'Penggodam memintas trafik antara anda dan internet', pop_up: 'Iklan timbul',
    evil_twin: 'Rangkaian Evil Twin palsu', two_routers: 'Dua penghala berbeza', premium_network: 'Rangkaian premium lebih pantas',
    anonymous: 'Menjadikan saya 100% tanpa nama dan tersembunyi', local_only: 'Hanya hentikan sejarah/cookie tempatan; orang lain masih nampak', encrypts_all: 'Menyulitkan semua data saya',
    dance_move: 'Gerakan tarian baharu', look_over: 'Melihat dari belakang bahu untuk PIN/kata laluan', phishing_type: 'Jenis pancingan data',
    give_password_now: 'Berikan kata laluan sekarang', verify_helpdesk: 'Letak dan hubungi helpdesk rasmi untuk sahkan', ask_proof: 'Minta bukti identiti',
    driving_close: 'Memandu terlalu rapat', follow_secure_door: 'Mengikut seseorang melalui pintu keselamatan tanpa kad', parking_party: 'Parti di tempat letak kereta',
    not_risky: 'Tidak berisiko', security_questions_info: 'Digunakan untuk soalan keselamatan reset kata laluan', annoys_friends: 'Mengganggu rakan',
    accept: 'Terima permintaan', ignore_delete: 'Abaikan atau padam; mungkin bot/penipu', check_mutuals: 'Semak rakan bersama dahulu',
    hacking_tech: 'Teknologi penggodaman', human_psychology: 'Psikologi manusia (percaya, takut, mendesak)', guessing_passwords: 'Meneka kata laluan',
    text_before_call: 'Hantar teks sebelum menelefon', fake_scenario: 'Cipta senario palsu untuk mendapatkan maklumat', book_text: 'Teks di awal buku',
    shows_travel: 'Menunjukkan perjalanan', barcode_risk: 'Kod bar dedahkan nama dan butiran tempahan',
    malware_type: 'Jenis malware', something_for_something: 'Sesuatu untuk sesuatu (timbal balik)', legal_term: 'Istilah undang-undang',
    whaling_vishing: 'Whaling (emel) atau vishing', authority_intimidation: 'Rayuan kepada autoriti dan intimidasi', normal_day: 'Hari biasa di pejabat',
    calm_down: 'Beritahu baki untuk menenangkan', escalate: 'Tanpa pengesahan tidak boleh bantu dan rujuk kepada pengurus', find_other_means: 'Cari akaun melalui cara lain',
    unplug: 'Cabut dari rangkaian', isolate_vlan: 'Asingkan dalam VLAN kuarantin', pcap: 'Mulakan tangkapan paket penuh', reimage: 'Pasang semula segera',
    copy_paste: 'Salin dan tampal terus ke kod produksi', test_merge: 'Uji, jika berfungsi gabungkan', analyze_sandbox: 'Analisis risiko kemudian uji dalam sandbox',
    assume_error: 'Anggap ia ralat sistem dan jangan bertindak serta-merta',
    review_contact_update: 'Semak aktiviti akaun, hubungi sokongan dan kemas kini kelayakan akaun',
    uninstall_monitor: 'Nyahpasang aplikasi dan pantau penyata bank beberapa hari',
    wait_see: 'Tunggu untuk lihat jika ada transaksi lagi',
    proceed_download: 'Teruskan muat turun untuk kenal pasti kandungan',
    cancel_download: 'Batalkan muat turun elakkan aplikasi dari sumber tidak sah',
    open_downloaded: 'Buka fail yang dimuat turun dengan berhati‑hati',
    share_code: 'Kongsi kod untuk siapkan transaksi dengan cepat',
    decline_code: 'Tolak daripada memberikan kod',
    read_code: 'Bacakan kod dengan teliti untuk mengesahkan niat pemanggil',
    ask_id: 'Minta pengenalan rasmi sebelum meneruskan',
    refund_immediately: 'Pulangkan wang serta‑merta',
    verify_balance: 'Sahkan baki sebenar dalam aplikasi dahulu',
    block_sender: 'Sekat penghantar tanpa mengesahkan',
    leave_funds: 'Biarkan dana tanpa memeriksa akaun',
    ignore_alert: 'Abaikan amaran kerana tiada kerosakan',
    change_password: 'Tukar kata laluan dan semak tetapan keselamatan',
    post_online: 'Siarkan dalam talian untuk tanya orang lain',
    wait_alert: 'Tunggu jika amaran lain muncul',
    pay_sextortion: 'Bayar untuk elak keadaan memuncak',
    block_report: 'Sekat, amankan akaun dan lapor kejadian',
    negotiate_less: 'Cuba berunding jumlah lebih rendah',
    delete_social: 'Padam semua akaun sosial',
    grant_all: 'Benarkan semua kebenaran supaya aplikasi lancar',
    limit_permissions: 'Tinjau dan hadkan kebenaran atau elak memasang aplikasi',
    adjust_later: 'Pasang dahulu, laras kebenaran kemudian',
    ask_others: 'Tanya pengguna lain jika mereka benarkan akses',
    ship_item: 'Teruskan hantar barang',
    verify_bank_app: 'Sahkan transaksi terus melalui saluran perbankan rasmi',
    trust_buyer: 'Terima tangkapan skrin sebagai bukti pembayaran',
    ask_screenshot: 'Minta tangkapan skrin tambahan',
    pay_fee_scholarship: 'Buat bayaran untuk memastikan biasiswa',
    ignore_scholarship: 'Tolak tawaran',
    ask_letter: 'Minta dokumen pengesahan rasmi',
    ask_seniors: 'Minta nasihat daripada senior',
    continue_same: 'Terus guna kata laluan sama supaya tidak lupa',
    change_gradually: 'Ubah kata laluan secara berperingkat untuk akaun penting',
    write_store: 'Tulis kata laluan dan simpan dengan selamat',
    share_trusted: 'Kongsi kata laluan dengan orang dipercayai',
    transfer_urgent: 'Hantar wang serta‑merta',
    hang_verify_child: 'Bertenang dan sahkan melalui cara hubungan dipercayai',
    ask_amount: 'Tanya mereka di mana',
    call_back_scam: 'Teruskan berbual',
    usb: 'Salin fail ke pemacu USB peribadi anda',
    cloud: 'Muat naik ke storan awan peribadi',
    official_vpn: 'Akses fail melalui sistem rasmi atau VPN yang diluluskan',
    email_self: 'Emelkan fail kepada diri sendiri',
    restart: 'Mulakan semula komputer dan lihat jika kembali normal',
    disconnect: 'Putuskan sambungan komputer daripada rangkaian serta‑merta',
    inform: 'Tanya rakan sekerja jika mereka alami masalah yang sama',
    delete_note: 'Cuba padam mesej dan teruskan bekerja',
    incognito: 'Guna mod pelayaran peribadi',
    no_login: 'Guna Wi‑Fi percuma yang disediakan kafe',
    vpn: 'Guna VPN yang diluluskan syarikat sebelum akses sistem kerja',
    ask_staff: 'Tanya kakitangan kafe sama ada Wi‑Fi selamat',
    call_999: 'Dail 999, talian kecemasan',
    call_997: 'Hubungi 997 untuk bantuan khusus',
    call_112: 'Hubungi 112 untuk kecemasan antarabangsa',
    call_bank: 'Maklumkan talian cawangan bank anda dahulu',
    login_claim: 'Log masuk untuk menuntut ganjaran',
    exit_phishing: 'Keluar tanpa memberikan sebarang maklumat log masuk',
    fake_password: 'Masukkan kata laluan salah untuk menguji laman',
    share_friends: 'Kongsi siaran tersebut',
    yes_quick: 'Guna rangkaian Wi‑Fi jika sesi singkat',
    no_mobile_data: 'Utamakan guna data mudah alih',
    yes_incognito: 'Dayakan mod pelayaran peribadi semasa guna Wi‑Fi awam',
    yes_password: 'Sambung hanya jika rangkaian dilindungi kata laluan',
    turn_off_monitor: 'Tutup monitor',
    webcam_cover: 'Guna penutup kamera fizikal apabila tidak digunakan',
    ignore_webcam: 'Abaikan risiko',
    uninstall_driver: 'Nyahpasang pemacu kamera',
    click_summon: 'Klik pautan untuk mengesahkan saman',
    ignore_mobile_sms: 'Abaikan mesej',
    reply_summon: 'Balas untuk minta maklumat lanjut',
    call_summon: 'Hubungi nombor yang tertera dalam mesej',
    panic_contact: 'Hubungi nombor dalam mesej',
    ignore_warrant: 'Abaikan dan sahkan melalui pejabat rasmi',
    forward_friends: 'Kongsi kepada ahli keluarga',
    pay_lawyer: 'Balas tanya sama ada benar',
    upload_selfie: 'Muat naik swafoto',
    review_policy: 'Teliti dasar privasi',
    use_friend: 'Guna gambar rakan',
    ignore_policy: 'Abaikan dasar privasi dan teruskan',
    continue_chat: 'Terus berbual untuk sopan',
    block_pig: 'Sekat penghantar',
    ask_who: 'Tanya identiti penghantar',
    send_photo: 'Kongsi maklumat peribadi untuk bina kepercayaan',
    enable_macros: 'Benarkan makro',
    no_macros: 'Jangan benarkan makro',
    print_doc: 'Cetak dokumen',
    convert_pdf: 'Tukar kepada PDF',
    continue_atm: 'Masukkan PIN dengan cepat tanpa menutup',
    cover_keypad: 'Tutup papan kekunci dengan tangan semasa menaip',
    ask_move: 'Minta orang itu berundur sebelum masukkan PIN',
    simple_pin: 'Tukar kepada PIN lebih ringkas untuk elak silap',
    plug_direct: 'Sambung terus ke pengecas awam',
    use_adapter: 'Guna pengecas peribadi',
    turn_off: 'Tutup telefon sebelum guna pengecas awam',
    avoid_charge: 'Elak mengecas di tempat awam sepenuhnya'
    , pay_premium: 'Buat pembayaran untuk tingkatkan potensi pendapatan'
    , stop_task: 'Hentikan penyertaan dan keluar dari skim'
    , negotiate_premium: 'Minta penjelasan mengapa bayaran diperlukan'
    , ask_withdraw_premium: 'Tanya bila pendapatan terkumpul boleh dikeluarkan'
    , ask_waiter: 'Tanya kakitangan sama ada muat turun diperlukan'
    , agree_help: 'Biarkan mereka terangkan semuanya'
    , reject_official_counter: 'Tolak dan sahkan melalui pejabat rasmi'
    , give_ic_copy: 'Berikan salinan dokumen anda'
    , ask_docs: 'Tanya jiran sama ada pernah nampak mereka'
    , login_game: 'Log masuk dengan cepat'
    , refuse_game_phish: 'Elakkan log masuk'
    , share_friends_game: 'Kongsi pautan dengan rakan untuk sahkan'
    , secondary_account: 'Uji pautan guna akaun sekunder'
    , install_spare: 'Pasang pada telefon lama atau tidak digunakan'
    , no_sideload: 'Elakkan memasang aplikasi daripada pautan tidak diketahui'
    , ask_members: 'Tanya ahli kumpulan lain sama ada ia selamat'
    , disable_security: 'Pasang untuk lihat bagaimana aplikasi berfungsi'
    , provide_details: 'Berikan butiran untuk lengkapkan proses'
    , hang_up_bank: 'Tanya maklumat kakitangan pemanggil'
    , visit_later: 'Lawati bank kemudian untuk bertanya'
    , restart_phone: 'Mulakan semula telefon anda'
    , contact_telco_bank: 'Hubungi penyedia telco dan bank segera untuk amankan akaun dan sahkan transaksi'
    , wait_signal: 'Tunggu sehingga isyarat kembali dan pantau mesej'
    , buy_new_phone: 'Beli peranti baharu untuk mengganti yang mungkin terkompromi'
    , approve: 'Luluskan segera untuk elak masalah'
    , verify_channel: 'Hubungi Pengarah melalui nombor atau saluran pejabat yang diketahui'
    , reply_docs: 'Balas emel untuk minta maklumat lanjut'
    , delay: 'Tunggu dan lihat jika ada emel lain'
    , stop_pig: 'Hentikan perbincangan mengenai wang'
    , video_call: 'Teruskan berbual dan lihat bagaimana'
    , visit_office: 'Alamat pejabat mereka'
    , review_social: 'Aktiviti media sosial mereka'
    , check_bnm_sc: 'Senarai amaran pengawal selia rasmi'
    , ask_license: 'Keyakinan suara si pengenal'
    , accept_passive: 'Terima kerana kedengaran mudah'
    , refuse_mule: 'Terima tetapi hadkan penggunaannya'
    , accept_limit: 'Tolak tawaran'
    , give_no_card: 'Tanya tujuan transaksi tersebut'
    , provide_details_job: 'Hantar maklumat yang diminta'
    , refuse_identity: 'Tolak dan hentikan permohonan'
    , send_blurred: 'Berikan dokumen sebagian/ditutup'
    , ask_contract: 'Minta pengesahan terma pekerjaan'
    , transfer_deposit: 'Pindahkan deposit untuk pastikan unit'
    , refuse_viewing: 'Tolak dan cari penginapan alternatif'
    , pay_half: 'Tawar deposit separuh'
    , ask_video: 'Minta foto atau video tambahan'
    , use_immediately: 'Masukkan SIM dan mula guna'
    , factory_reset: 'Buat tetapan semula kilang penuh'
    , change_lock: 'Tukar skrin kunci dan kata laluan'
    , remove_apps: 'Buang aplikasi yang tidak dikenali'
    , buy_quickly: 'Teruskan pembelian sebelum habis'
    , scam_price: 'Kemungkinan penipuan kerana harga tidak realistik'
    , ask_photos: 'Minta gambar produk tambahan'
    , check_followers: 'Nilai bilangan pengikut dan engagement'
    , press_1: 'Tekan nombor untuk tahu lebih lanjut'
    , hang_up_lhdn: 'Letak telefon dan semak saluran rasmi kemudian'
    , call_back_same: 'Panggil semula nombor itu dengan segera'
    , provide_details_lhdn: 'Berikan butiran untuk mereka proses'
    , transfer_audit: 'Pindahkan wang untuk “audit”'
    , hang_up_police: 'Letak dan semak melalui saluran rasmi'
    , ask_badge: 'Tanya nombor lencana pemanggil'
    , explain_self: 'Terangkan keadaan anda'
    , give_partial: 'Berikan dokumen sebagian/ditutup'
    , refuse_verify: 'Tolak dan sahkan melalui pejabat rasmi'
    , ask_hearing: 'Tanya butiran pendengaran'
    , explain_unaware: 'Nyatakan tidak menyedari perkara itu'
    , send_otp: 'Kongsi OTP'
    , call_friend: 'Hubungi rakan untuk sahkan'
    , ignore_msg: 'Abaikan mesej'
    , ask_why: 'Tanya mengapa diperlukan'
    , accept_offer: 'Terima tawaran segera untuk pastikan jawatan'
    , verify_embassy: 'Sahkan melalui saluran kerajaan/diplomatik rasmi'
    , ask_accommodation: 'Minta butiran penginapan dan syarat kerja'
    , bring_friend: 'Tanya jika rakan boleh mohon bersama'
    , click_login: 'Klik pautan log masuk'
    , check_url_gov: 'Semak melalui laman kerajaan rasmi'
    , reply_email: 'Balas emel untuk penjelasan lanjut'
    , forward_classmates: 'Kongsi kepada rakan sekelas untuk nasihat'
    , join_early: 'Sertai awal untuk memaksimumkan pulangan'
    , reject_pyramid: 'Tolak; skim piramid'
    , ask_products: 'Tanya produk sebenar yang dijual'
    , try_month: 'Cuba sebulan dahulu'
    , pay_blackmail: 'Bayar'
    , report_blackmail: 'Pertimbang lapor kepada pihak berkuasa'
    , negotiate_blackmail: 'Berunding'
    , ignore_blackmail: 'Abaikan sepenuhnya'
    , call_microsoft: 'Hubungi nombor pada skrin'
    , close_browser: 'Tutup pelayar dan abaikan amaran'
    , pay_antivirus: 'Bayar untuk antivirus yang disyorkan'
    , restart_computer: 'Mulakan semula komputer dan harap amaran hilang'
    , click_tng: 'Klik pautan'
    , check_app_tng: 'Buka aplikasi rasmi untuk semak akaun'
    , reply_tng: 'Balas SMS untuk minta penjelasan'
    , share_tng: 'Kongsi mesej kepada rakan untuk nasihat'
    , close_browser_hotel: 'Tutup pelayar sahaja'
    , logout_clear: 'Log keluar penuh dan kosongkan sejarah serta cache'
    , leave_immediately: 'Tinggalkan segera'
    , donate_now: 'Derma serta‑merta'
    , verify_ngo: 'Sahkan kesahihan permintaan'
    , share_post: 'Kongsi kiriman'
    , donate_crypto: 'Derma mata wang kripto'
    , no_risk: 'Tiada risiko'
    , read_data: 'Sambungan mungkin akses semua data pelayaran'
    , slow_browser: 'Hanya perlahan pelayar'
    , safe_popular: 'Selamat jika popular'
    , allow_supervise: 'Benarkan masuk kerana nampak sah'
    , deny_verify: 'Minta tunggu sementara sahkan dengan pengurusan/vendor'
    , sign_log: 'Benarkan masuk tetapi berada berdekatan'
    , ask_card: 'Minta tandatangan buku pelawat kemudian teruskan'
    , install_now: 'Pasang segera untuk elak masalah'
    , scan_av: 'Imbas dahulu dengan antivirus'
    , reject_official: 'Muat turun hanya dari laman rasmi vendor'
    , test_personal: 'Pasang pada komputer simpanan'
    , passphrase_mfa: 'Guna frasa laluan panjang dan langkah pengesahan tambahan'
    , monthly_change: 'Tulis kata laluan dan simpan dengan selamat'
    , offline_store: 'Guna semula kata laluan sama seperti emel'
    , assist: 'Laporkan kepada HR atau keselamatan'
    , report: 'Tanya secara santai untuk mengetahui tujuan'
    , ask: 'Bantu membawa dokumen'
  },
  swk: {
    restart: 'Mula semula komputer lalu meda mun kembali normal',
    disconnect: 'Putus sambungan komputer ari rangkaian terus',
    inform: 'Tanya rakan sekerja mun sida ada masalah sama',
    delete_note: 'Cuba padam mesej lalu neruska bekereja',
    usb: 'Salin fail ke USB peribadi kitak',
    cloud: 'Muat naik ke storan awan peribadi kitak',
    official_vpn: 'Akses fail ngena sistem rasmi atau VPN dilulus',
    email_self: 'Emel fail nya ke diri kitak',
    approve: 'Lulus cepat supaya nadai masalah',
    verify_channel: 'Hubungi Pengarah ngena nombor/ saluran opis ti dikenali',
    reply_docs: 'Balas emel minta butir lebih',
    delay: 'Tunggu lalu meda mun ada emel bukai',
    incognito: 'Guna mod pelayaran peribadi',
    no_login: 'Guna Wi‑Fi percuma disediaka kafe',
    vpn: 'Guna VPN syarikat dilulus sebelum akses sistem kerja',
    ask_staff: 'Tanya staff kafe mun Wi‑Fi nya selamat',
    allow_supervise: 'Benarka masuk laban nampak sah',
    deny_verify: 'Minta nya nunggu sementara kitak ngesahkan ngena pengurusan atau vendor',
    sign_log: 'Benarka masuk tapi tetak dekat',
    ask_card: 'Minta tandatangan buku pelawat lalu neruska',
    install_now: 'Pasang cepat supaya nadai masalah',
    scan_av: 'Imbas ngena antivirus dulu',
    reject_official: 'Muat turun kemas kini ari laman vendor rasmi aja',
    test_personal: 'Pasang di komputer simpanan',
    share_trusted: 'Guna kata laluan senang supaya nadai terlupa',
    passphrase_mfa: 'Guna frasa laluan panjang enggau langkah pengesahan tambahan',
    monthly_change: 'Tulis kata laluan lalu simpan nyaman',
    offline_store: 'Guna semula kata laluan ti sama kedak emel',
    ignore: 'Abaika laban nya nak ninggal',
    assist: 'Laporka situasi nya ka HR atau keselamatan',
    report: 'Tanya santai dokumen nya untuk apa',
    ask: 'Bantu sida ngangkat dokumen',
    invest_test: 'Cuba melabur jumlah kecik dulu',
    ask_friends: 'Tanya orang ti mempromosi minta butir lebih',
    avoid_ponzi: 'Elak laban kedak nadai realistik',
    contact_agent: 'Kongsi ngena kawan minta pandangan',
    install_spare: 'Pasang pada telefon lama atau nadai diguna',
    no_sideload: 'Elak masang aplikasi ari pautan nadai dikenali',
    ask_members: 'Tanya ahli grup mun nya selamat',
    disable_security: 'Pasang untuk meda baka mana aplikasi berjalai',
    visit_office: 'Alamat opis sida',
    review_social: 'Aktiviti media sosial sida',
    check_bnm_sc: 'Senarai amaran pengawal selia rasmi',
    ask_license: 'Keyakinan suara pengenal',
    invest_small: 'Labur sikit untuk nguji',
    ask_withdraw: 'Minta bukti untung',
    stop_pig: 'Berenti madah pasal duit',
    video_call: 'Neruska bersembang lalu meda baka mana',
    pay_fee: 'Bayar yuran supaya pinjaman dilepas',
    negotiate: 'Tanya mun yuran boleh bayar kemudian',
    reject_loan: 'Tinggal tawaran nya',
    ask_receipt: 'Minta perjanjian bertulis',
    accept_passive: 'Terima laban kedak senang',
    refuse_mule: 'Terima tapi hadka penggunaannya',
    accept_limit: 'Tolak tawaran',
    give_no_card: 'Tanya tujuan transaksi',
    provide_details: 'Berika butir untuk nyelesai proses',
    hang_up_bank: 'Tanya maklumat kakitangan pemanggil',
    ask_id: 'Tamatka panggilan lalu nadai berika maklumat login',
    visit_later: 'Pergi bank kemudian untuk bertanya',
    pay_fee_recover: 'Bayar yuran supaya duit ulih diulang',
    ignore_recovery: 'Abaika tawaran “pulih duit”',
    proof_past: 'Minta bukti sida pernah ngulang duit',
    share_details: 'Kongsi butir peribadi ka sida',
    press_1: 'Tekan nombor untuk tau lebih',
    hang_up_lhdn: 'Letak telefon lalu semak saluran rasmi kemudian',
    call_back_same: 'Kelia nombor nya lekas',
    provide_details_lhdn: 'Berika butir ka pemanggil',
    transfer_audit: 'Pindah duit untuk “audit”',
    hang_up_police: 'Letak lalu hubungi talian rasmi',
    ask_badge: 'Tanya nombor lencana pemanggil',
    explain_self: 'Terangkan diri kitak ka sida',
    panic_contact: 'Kelia nombor dalam mesej',
    ignore_warrant: 'Abaika lalu semak ngena saluran rasmi',
    forward_friends: 'Kongsi ka keluarga atau kawan',
    pay_lawyer: 'Bayar peguam ti disebut',
    give_partial: 'Berika dokumen sebagian/ditutup',
    refuse_verify: 'Tolak lalu minta sah melalui pejabat rasmi',
    ask_hearing: 'Minta butir tarikh perbicaraan',
    explain_unaware: 'Madah kitak enda tau hal nya',
    transfer_urgent: 'Hantar duit lekas',
    hang_verify_child: 'Bertenang enggau sahkan melalui saluran dipercayai',
    ask_amount: 'Tanya sida di ditempa',
    call_back_scam: 'Teruska bersembang',
    click_pay: 'Klik pautan minta bayar',
    check_official_app: 'Semak dalam aplikasi rasmi',
    reply_sms: 'Balas SMS minta penjelasan',
    call_sms_number: 'Hubungi nombor dalam SMS',
    send_otp: 'Kongsi OTP',
    call_friend: 'Kelia kawan untuk sahkan',
    ignore_msg: 'Abaika mesej nya',
    ask_why: 'Tanya ngapa perlu',
    pay_premium: 'Bayar untuk nambah potensi pendapatan',
    stop_task: 'Hentika tugas lalu ninggal skim',
    negotiate_premium: 'Minta penjelasan ngapa perlu bayar',
    ask_withdraw_premium: 'Tanya bila pendapatan boleh dikeluarka',
    accept_offer: 'Terima tawaran segera',
    verify_embassy: 'Sahkan liwat saluran kerajaan/diplomatik',
    ask_accommodation: 'Minta butir penginapan enggau syarat kerja',
    bring_friend: 'Tanya mun rakan boleh mohon sama',
    click_login: 'Klik pautan lalu log masuk',
    check_url_gov: 'Semak ngalih laman rasmi kerajaan',
    reply_email: 'Balas emel minta penjelasan',
    forward_classmates: 'Kongsi ka rakan sekelas',
    use_immediately: 'Masuk kad SIM lalu mula ngguna',
    factory_reset: 'Buat tetapan semula kilang penuh',
    change_lock: 'Tukar skrin kunci enggau kata laluan',
    remove_apps: 'Buang aplikasi nadai dikenali',
    pay_fee_scholarship: 'Bayar yuran untuk mastika biasiswa',
    ignore_scholarship: 'Tolak tawaran nya',
    ask_letter: 'Minta surat pengesahan rasmi',
    ask_seniors: 'Minta nasihat ari senior',
    provide_details_job: 'Berika butir untuk lengkap proses',
    refuse_identity: 'Tolak lalu berhenti mohon',
    send_blurred: 'Hantar salinan dokumen ti ditutup',
    ask_contract: 'Minta pengesahan terma kerja',
    join_early: 'Sertai awal untuk “nambah pulangan”',
    reject_pyramid: 'Tolak; kedak skim piramid',
    ask_products: 'Tanya produk sebenar dijual',
    try_month: 'Cuba sebulan dulu',
    restart_phone: 'Mula semula telefon kitak',
    contact_telco_bank: 'Hubungi telco enggau bank terus untuk amanka akaun',
    wait_signal: 'Tunggu isyarat kembali lalu pantau mesej',
    buy_new_phone: 'Beli peranti baru ganti ti mungkin terkompromi',
    call_microsoft: 'Kelia nombor dalam mesej',
    close_browser: 'Tutup pelayar lalu abaika amaran',
    pay_antivirus: 'Bayar antivirus disaran',
    restart_computer: 'Mula semula komputer lalu ngarap amaran hilang',
    click_tng: 'Klik pautan',
    check_app_tng: 'Buka aplikasi rasmi untuk semak akaun',
    reply_tng: 'Balas SMS minta penjelasan',
    share_tng: 'Kongsi mesej ka kawan untuk nasihat',
    close_browser_hotel: 'Tutup pelayar aja',
    logout_clear: 'Log keluar penuh lalu padam sejarah enggau cache',
    continue_chat: 'Neruska bersembang demi sopan',
    block_pig: 'Sekat pengirim',
    ask_who: 'Tanya pengirim ngenal diri',
    send_photo: 'Kongsi butir peribadi untuk bina kepercayaan',
    enable_macros: 'Benarka makro',
    no_macros: 'Jangan benarka makro',
    print_doc: 'Cetak dokumen',
    convert_pdf: 'Tukar jadi PDF',
    continue_atm: 'Masuk PIN lekas tanpa nutup',
    cover_keypad: 'Tutup papan kekunci ngena tangan',
    ask_move: 'Minta orang nya berundur',
    simple_pin: 'Tukar ka PIN senang supaya sik salah',
    donate_now: 'Derma lekas',
    verify_ngo: 'Sahkan kesahan permintaan',
    share_post: 'Kongsi pos',
    donate_crypto: 'Derma kripto',
    no_risk: 'Sikda risiko',
    read_data: 'Extension ulih akses semua data pelayaran',
    slow_browser: 'Semina ngelambat pelayar',
    safe_popular: 'Selamat mun popular'
  }
};

// Simple phrase-based translation fallback for question text
const tx = (lang, s) => {
  if (!s || lang === 'en') return s;
  if (lang === 'swk') {
    return s
      .replace('You are at work in a government office. Suddenly, shared files cannot be opened and their names look strange. A message appears asking for payment. What would you most likely do first?', 'Kitak bekereja di opis kerajaan. Tiba‑tiba, fail sama‑sama nadai dapat dibuka lalu nama nya pelik. Mesej muncul minta bayaran. Apa hal pertama kitak paling mungkin buat?')
      .replace('You need to finish a report that contains MyKad numbers, but you want to work on it over the weekend. Which option feels the safest?', 'Kitak perlu nyelesai report ngandung nombor MyKad, tapi kitak enda kerja nya hujung minggu. Pilihan manakah rasa paling selamat?')
      .replace('You receive an email asking you to urgently approve a large payment. The email claims it is from your Director and sounds serious. What would you do next?', 'Kitak nerima emel minta kelulusan cepat untuk bayaran besai. Emel madah ari Pengarah kitak lalu bunyi serius. Apa kitak buat seterusnya?')
      .replace('You are working in a cafe and need to access work systems that contain sensitive information. What feels like the safest option?', 'Kitak bekereja di kafe lalu perlu akses sistem kerja ngandung maklumat sensitif. Pilihan manakah rasa paling selamat?')
      .replace('A technician arrives at your office saying he needs to check the server. He looks professional but you were not informed earlier. What would you do?', 'Seorang teknisyen datai ke opis madah perlu mansaik server. Nampak profesional, tapi kitak nadai diberitahu awal. Apa tindak kitak?')
      .replace('A vendor sends you an email with a link to download an urgent software update from a file sharing site. What is the safest reaction?', 'Vendor ngir emel ngena pautan muat turun kemas kini software mendesak ari laman perkongsian fail. Apa tindak paling selamat?')
      .replace('You manage an admin account that controls important systems. Which choice sounds the most responsible?', 'Kitak ngurus akaun admin ngawal sistem penting. Pilihan manakah paling bertanggungjawab?')
      .replace('A colleague who just resigned is printing a large number of confidential documents. What would you do?', 'Rakan sekerja baru berhenti kerja sedang mencetak banyak dokumen sulit. Apa kitak buat?')
      .replace('You see an advertisement on social media saying an investment can give very high returns every week with almost no risk. What would you most likely do?', 'Kitak meda iklan di media sosial madah pelaburan ngasuh pulangan tinggi tiap minggu hampir nadai risiko. Apa hal kitak paling mungkin buat?')
      .replace('You are added to a messaging group where people share screenshots of profits. The admin asks everyone to install a trading app using a download link. What would you do?', 'Kitak ditambah ke grup mesej nya orang berkongsi tangkapan skrin untung. Admin minta semua orang pasang aplikasi dagang ngena pautan muat turun. Apa kitak buat?')
      .replace('Someone invites you to invest and says the opportunity is popular and approved in Malaysia. What would you check first?', 'Orang ngajak kitak melabur lalu madah peluang nya popular tanda disahkan di Malaysia. Apa hal kitak periksa dulu?')
      .replace('You have been chatting online with someone for some time. Later, they suggest investing together in a platform they trust. What feels like the safest response?', 'Kitak bersembang dalam talian lama dengan sida. Kemudian sida nyuruh melabur sama di platform sida percaya. Respons manakah paling selamat?')
      .replace('You apply for a loan online. You are told it is approved, but you must pay a fee before receiving the money. What would you do?', 'Kitak minta pinjaman dalam talian. Diberitahu sudah dilulus, tapi perlu bayar yuran sebelum nerima duit. Apa kitak buat?')
      .replace('Someone offers you money each month just to let them use your bank account for transactions. What would you decide?', 'Orang ngetuai duit tiap bulan semina ngena akaun bank kitak buat transaksi. Apa keputusan kitak?')
      .replace('You receive a call offering a special financial product. The caller asks for your online banking login details. What would you do?', 'Kitak nerima panggilan ngetawar produk kewangan istimewa. Pemanggil minta butir login perbankan dalam talian. Apa kitak buat?')
      .replace('After losing money to a scam, someone contacts you claiming they can recover it for a fee. What would you do?', 'Lepas rugi duit kena scam, orang ngir kitak madah sida ulih ngulang duit nya tapi kena bayar yuran. Apa kitak buat?')
      .replace('You receive a call with a recorded message saying it is from a government agency and that you have an urgent issue. It asks you to press a number to continue. What would you do?', 'Kitak nerima call ngena mesej rakaman madah ari agensi kerajaan lalu kitak ada hal mendesak. Minta tekan nombor untuk neruska. Apa kitak buat?')
      .replace('A caller claims to be a police officer and says your identity was used in a crime in another state. He asks you to cooperate immediately. What is your next step?', 'Pemanggil ngaku polis lalu madah identiti kitak diguna dalam kes jenayah di negeri bukai. Sida minta kitak bekerjasama segera. Langkah seterusnya apa?')
      .replace('You receive a message showing an arrest notice with your name and official looking logos. What would you most likely do?', 'Kitak nerima mesej nunjuk notis tangkapan ngena nama kitak enggau logo kedak rasmi. Apa hal paling mungkin kitak buat?')
      .replace('Someone says they are from the court and asks for your MyKad number to check a case linked to your name. What would you do?', 'Orang madah sida ari mahkamah lalu minta nombor MyKad kitak untuk mansaik kes dikait ngena nama kitak. Apa kitak buat?')
      .replace('You receive a call from someone claiming to be a close family member, sounding panicked and asking for urgent help. What should you do first?', 'Kitak nerima call ari orang ngaku ahli keluarga dekat, bunyi panik lalu minta bantuan mendesak. Hal pertama apa patut kitak buat?')
      .replace('You receive a message saying your parcel cannot be delivered unless you pay a small fee through a link. What would you do?', 'Kitak nerima mesej madah parcel kitak nadai dapat dihantar kecuali kitak bayar yuran kecik ngena pautan. Apa kitak buat?')
      .replace('Someone comes to your house claiming they can help resolve a legal or financial issue quickly for a fee. What would you do?', 'Orang datai ke rumah kitak ngaku ulih ngebantu nyelesai hal undang‑undang atau kewangan cepat, tapi kena bayar. Apa kitak buat?')
      .replace('A friend messages you asking for a one time password sent to your phone, saying it was sent by mistake. What would you do?', 'Kawan ngir mesej minta OTP dikirim ke telefon kitak, madah tersalah kirim. Apa kitak buat?')
      .replace('You are invited to participate in an online job that promises daily income through simple digital tasks. After completing several tasks, you are informed that a payment is required to access higher earning opportunities. What is the most appropriate action?', 'Kitak diajak mega kerja dalam talian madah boleh ngasil pendapatan harian ngena tugas digital mudah. Lepas nyelesai beberapa tugas, diberitahu perlu bayar untuk akses peluang pendapatan lebih tinggi. Tindak paling patut apa?')
      .replace('An agent offers you an overseas customer service position with a high salary, no experience requirement, and travel expenses covered. What is the safest course of action?', 'Ejen ngetawar posisi khidmat pelanggan luar negara gaji tinggi, nadai syarat pengalaman, belanja jalan ditanggung. Langkah paling selamat apa?')
      .replace('You identify a rental unit near your institution at a significantly lower price than market rate. The owner claims to be overseas and requests a deposit before viewing. What should you do?', 'Kitak nemu unit sewa dekat institusi kitak harga jauh lebih murah ari pasaran. Pemilik ngaku di luar negara lalu minta deposit sebelum dapat meda. Apa patut kitak buat?')
      .replace('You receive an email claiming your education loan status requires urgent action and provides a link for login. What is the correct response?', 'Kitak nerima emel madah status pinjaman pelajaran kitak perlu tindakan cepat lalu ngasuh pautan untuk login. Respons betul apa?')
      .replace('After purchasing a pre owned smartphone, you intend to begin using it for personal activities. What should be done first?', 'Lepas beli telefon pintar second‑hand, kitak nak mula ngguna untuk aktiviti peribadi. Apa patut dibuat dulu?')
      .replace('You are informed that you have been selected for a guaranteed scholarship, subject to a processing payment. What is the most appropriate response?', 'Kitak diberitahu dipilih untuk biasiswa terjamin, tapi kena bayar pemprosesan. Respons paling patut apa?')
      .replace('An online job application requests a full copy of your identification document and bank account details during registration. What is the safest decision?', 'Permohonan kerja online minta salinan penuh dokumen pengenalan enggau butir akaun bank semasa daftar. Keputusan paling selamat apa?')
      .replace('You are invited to join a business model that requires an upfront payment and generates income mainly through recruiting new participants. What is the correct assessment?', 'Kitak diajak nyertai model perniagaan perlu bayaran awal lalu pendapatan utamanya ari merekrut peserta baru. Penilaian betul apa?')
      .replace('You encounter an online seller on a social media platform offering a latest model smartphone at a price significantly lower than the current market value. What is the most accurate assessment of this situation?', 'Kitak nemu penjual online di platform media sosial ngetawar telefon pintar model baru dengan harga jauh lebih murah ari nilai pasaran. Penilaian paling tepat untuk situasi nya apa?')
      .replace('You receive a notification that someone attempted to log in to your social media account from an unfamiliar location. What should you do first?', 'Kitak nerima notis madah orang nyoba log masuk ke akaun media sosial kitak ari tempat nadai dikenali. Apa patut kitak buat dulu?')
      .replace('An individual you interacted with online threatens to release private content unless payment is made. What is the most appropriate action?', 'Orang ti kitak berinteraksi online ngancam ngelepas kandungan peribadi kecuali dibayar. Tindak paling patut apa?')
      .replace('You are tagged in a post claiming that you have won a shopping voucher. The provided link requests you to log in using your social media account credentials. What should you do?', 'Nama kitak ditag dalam pos madah kitak menang baucar belanja. Pautan diberi minta kitak log masuk ngena kelayakan akaun media sosial. Apa patut kitak buat?')
      .replace('A mobile application requests access to your contacts, photos, and location, even though these features are not clearly related to its function. What is the most appropriate action?', 'Sebuah aplikasi mudah alih minta akses kontak, gambar, enggau lokasi, padahal nadai kait langsung ngena fungsi nya. Tindak paling patut apa?')
      .replace('After selling an item online, the buyer sends a screenshot claiming that payment has been completed. Your bank balance does not reflect the transaction. What should you do?', 'Lepas jual barang online, pembeli ngir tangkapan skrin madah bayaran udah dibuat. Baki bank kitak nadai nunjuk transaksi. Apa patut kitak buat?')
      .replace('You are concerned about unauthorized webcam access on your laptop. What is the MOST effective protection?', 'Kitak risau akses webcam nadai dibenarkan di laptop. Perlindungan PALING berkesan apa?')
      .replace('You use the same password for several online accounts for convenience. What is the most responsible decision?', 'Kitak ngguna kata laluan sama untuk beberapa akaun online demi kemudahan. Keputusan paling bertanggungjawab apa?')
      .replace('You notice a small, unexpected RM20 debit from your S-Pay Global account, which you did not authorize. What is the most appropriate first step?', 'Kitak perasan potongan kecik RM20 nadai dijangka ari akaun S‑Pay Global kitak, nadai kitak benarkan. Langkah pertama paling sesuai apa?')
      .replace('At a café, you scan a QR code expecting to see the menu, but your device prompts to download an unknown application. What should you do?', 'Di kafe, kitak imbas QR code ngharap meda menu, tapi peranti nyuruh muat turun aplikasi ti nadai dikenali. Apa patut kitak buat?')
      .replace('A person claiming to be from your bank calls and requests the TAC sent to your phone to cancel a recent transaction. How should you respond?', 'Orang ngaku dari bank kitak menelefon lalu minta TAC dikirim ke telefon kitak untuk batal transaksi baru‑baru tok. Baka mana patut kitak respond?')
      .replace('You receive a screenshot from someone claiming they accidentally transferred RM100 to your e-wallet and ask you to return the amount. What is the most cautious action?', 'Orang ngir tangkapan skrin madah sida tersalah pindah RM100 ke e‑wallet kitak lalu minta dipulang. Tindak paling berhati‑hati apa?')
      .replace('You need to charge your phone in a public location. Which option reduces the risk of data exposure?', 'Kitak perlu ngecas telefon di tempat awam. Pilihan manakah ngurangkan risiko pendedahan data?')
      .replace('You realize that a recent transfer was made to a potential scammer. Which is the most appropriate contact to report this situation immediately?', 'Kitak sedar pindahan baru‑baru tok dituju ka pemipu berpotensi. Pihak manakah paling sesuai dihubungi terus?')
      .replace('You plan to access your online banking account using public Wi-Fi at an airport or café. Which approach is safest?', 'Kitak rancang akses akaun perbankan online ngena Wi‑Fi awam di lapangan terbang atau kafe. Cara manakah paling selamat?')
      .replace('You receive an SMS stating: “You have an outstanding summon. Click here to view details.” How should you handle it?', 'Kitak nerima SMS madah: “Kitak ada saman belum dibayar. Klik sini untuk meda butir.” Baka mana kitak nangani nya?')
      .replace('Your mobile signal suddenly drops, and you receive an email claiming your SIM card has been replaced without your request. What should you do first?', 'Isyarat telefon kitak tiba‑tiba turun, lalu kitak nerima emel madah SIM kitak udah diganti tanpa minta. Apa hal pertama patut kitak buat?')
      .replace('A fellow gamer offers free in-game currency if you log in to a specific website. What is the safest response?', 'Rakan gamer ngetuai mata wang dalam game percuma mun kitak log masuk ke laman tertentu. Respons paling selamat apa?')
      .replace('After using a paid service to complete an assignment, you receive a threat demanding additional payment or they will report you. How should you respond?', 'Lepas ngguna servis berbayar nyelesai tugasan, kitak nerima ugut minta bayaran tambahan mun enda sida ngadu. Baka mana patut kitak respond?')
      .replace('Your computer shows a pop-up warning: “Your device is infected. Call Microsoft Support immediately.” What is the safest action?', 'Komputer kitak nunjuk pop‑up amaran: “Peranti kitak berjangkit. Kelia Microsoft Support segera.” Tindak paling selamat apa?')
      .replace('You receive a message stating that your Touch ’n Go account has been suspended and asks you to click a link. How should you handle this?', 'Kitak nerima mesej madah akaun Touch ’n Go kitak digantung lalu minta kitak klik pautan. Baka mana kitak nangani nya?')
      .replace('After logging into your email on a hotel business center computer, what steps should you take before leaving?', 'Lepas log masuk emel di komputer pusat bisnes hotel, langkah apa patut diambi sebelum ninggal?')
      .replace('You receive a message: “Hi, is this Mr. Chan? Wrong number, but you seem nice.” What is the safest response?', 'Kitak nerima mesej: “Hi, tok Mr. Chan ka? Salah nombor, tapi kitak kedak orang manis.” Respons paling selamat apa?')
      .replace('A Word document asks you to “Enable Content” to view an invoice. How should you respond?', 'Dokumen Word minta kitak “Enable Content” untuk meda invoice. Baka mana patut kitak respond?')
      .replace('Someone stands unusually close while you are entering your ATM PIN. What is the safest action?', 'Orang bediri dekat amat masa kitak ngisi PIN ATM. Tindak paling selamat apa?')
      .replace('You encounter a social media post requesting donations for flood relief, directing contributions to a personal bank account. What should you do?', 'Kitak nemu pos media sosial minta derma bantuan banjir, nyuruh nyumbang ke akaun bank peribadi. Apa patut kitak buat?')
      .replace('A website prompts you to install a “coupon finder” browser extension. What should you consider before installing?', 'Laman web nyuruh kitak pasang extension pelayar “pencari kupon”. Apa patut kitak peringa sebelum pasang?')
      .replace('An app requests a clear selfie to provide AI face-swap features. What is the safest approach?', 'Aplikasi minta selfie terang untuk fitur AI tukar muka. Cara paling selamat apa?')
      ;
  }
  if (lang === 'zh') {
    return s
      .replace('You see an advertisement on social media saying an investment can give very high returns every week with almost no risk.', '你在社交媒体看到一则投资广告称每周都有很高回报且几乎无风险。')
      .replace('You encounter an online seller on a social media platform offering a latest model smartphone at a price significantly lower than the current market value. What is the most accurate assessment of this situation?', '你在社交媒体平台遇到一位在线卖家，以远低于当前市场价的价格出售最新款智能手机。对此情形，最准确的评估是什么？')
      .replace('A colleague who just resigned is printing a large number of confidential documents. What would you do?', '一位刚辞职的同事正在打印大量机密文件。你会怎么做？')
      .replace('You receive a call offering a special financial product. The caller asks for your online banking login details. What would you do?', '你接到一个电话，提供一种特别的金融产品。来电者索取你的网银登录信息。你会怎么做？')
      .replace('You receive a message saying your parcel cannot be delivered unless you pay a small fee through a link. What would you do?', '你收到一条信息称你的包裹无法派送，需通过链接支付一笔小费用。你会怎么做？')
      .replace('A person claiming to be from your bank calls and requests the TAC sent to your phone to cancel a recent transaction. How should you respond?', '有人自称来自你的银行来电，要求提供手机收到的TAC以取消最近交易。你应如何回应？')
      .replace('You are invited to join a business model that requires an upfront payment and generates income mainly through recruiting new participants. What is the correct assessment?', '你被邀请加入一种商业模式，需预付费用，并主要通过招募新参与者获得收入。正确的评估是什么？')
      .replace(/What is /g, '什么是 ')
      .replace(/What does /g, '是什么意思 ')
      .replace(/Main purpose of/g, 'VPN的主要作用是')
      .replace(/Why /g, '为何 ')
      .replace(/Which /g, '哪一个 ')
      .replace(/Best /g, '最佳 ')
      .replace(/Most secure /g, '最安全的 ')
      .replace(/When /g, '当 ')
      .replace(/At a cafe on /g, '在咖啡馆使用 ')
      .replace(/Two Wi.?Fi names/g, '两个Wi‑Fi名称')
      .replace(/Buying used item on Marketplace/g, '在Marketplace购买二手物品时')
      .replace(/Attacker pretends to be/g, '攻击者假装是')
      .replace(/You find /g, '你在发现 ')
      .replace(/You receive a call/g, '你接到一个电话')
      .replace(/Caller claims/g, '来电者声称')
      .replace(/Pop-up says/g, '弹窗提示')
      .replace(/SMS from/g, '来自的短信')
      .replace(/Facebook ad/g, 'Facebook 广告')
      .replace(/An email from your 'boss' asks you to urgently buy Google Play gift cards\. This is:/g, '有人冒充“老板”紧急要求购买 Google Play 礼品卡。这是：')
      .replace(/An email is highly personalized and references your job\. This is:/g, '这是一封高度个性化并提到你工作的邮件，这是：')
      .replace(/You receive an SMS with a TAC\/OTP\. A person calls and asks you to read the number back\./g, '你收到包含 TAC/OTP 的短信，随后有人来电要求你读出该数字。')
      .replace(/What is a Pig Butchering scam\?/g, '什么是“杀猪盘”骗局？')
      .replace('offering a special financial product', '提供一种特别的金融产品')
      .replace('The caller asks for your online banking login details.', '来电者索取你的网银登录信息。')
      .replace('What would you do?', '你会怎么做？')
      .replace(/What should you do\?/g, '你应该怎么做？')
      .replace(/What should you do first\?/g, '你首先应该做什么？')
      .replace(/What would you most likely do\?/g, '你最可能会怎么做？')
      .replace('You are working in a cafe and need to access work systems that contain sensitive information.', '你在咖啡馆工作，需要访问包含敏感信息的工作系统。')
      .replace('What feels like the safest option?', '哪一个选项看起来最安全？')
      .replace('You notice a small, unexpected RM20 debit from your S-Pay Global account, which you did not authorize.', '你注意到 S‑Pay Global 账户出现一笔意外的 RM20 扣款，并非你授权。')
      .replace('What is the most appropriate first step?', '最合适的第一步是什么？')
      .replace('You see an advertisement on social media saying an investment can give very high returns every week with almost no risk.', '你在社交媒体看到一则投资广告称每周都有很高回报且几乎无风险。')
      .replace('You see an advertisement on social media saying an investment can give very high returns every week with almost no risk. What would you most likely do?', '你在社交媒体看到一则投资广告称每周都有很高回报且几乎无风险。你最可能会怎么做？')
      .replace('Payment Fraud', '支付欺诈')
      .replace('Device Compromise', '设备受损')
      .replace('High-Value Target', '高价值目标')
      .replace('Authority Exploitation', '权威滥用')
      .replace('Infrastructure Gatekeeper', '基础设施守门人')
      .replace('Intellectual Property Theft', '知识产权盗窃')
      .replace('Social Engineering Entry Point', '社会工程入口')
      .replace('Account Takeover', '账户接管')
      .replace('Predatory Scams', '掠夺性骗局')
      .replace('Lifestyle Attacks', '生活方式攻击')
      .replace('E-Wallet Scams', '电子钱包诈骗')
      .replace('E‑Wallet Scams', '电子钱包诈骗')
      .replace('Vulnerable to Fake Payment Receipts and E-Wallet Scams (S-Pay Global) during daily transactions.', '在日常交易中容易被虚假付款凭证与电子钱包诈骗（S‑Pay Global）欺骗。')
      .replace('Vulnerable to Fake Payment Receipts and E‑Wallet Scams (S‑Pay Global) during daily transactions.', '在日常交易中容易被虚假付款凭证与电子钱包诈骗（S‑Pay Global）欺骗。')
      .replace('Vulnerable to Fake Payment Receipts and 电子钱包诈骗 (S-Pay Global) during daily transactions.', '在日常交易中容易被虚假付款凭证与电子钱包诈骗（S‑Pay Global）欺骗。')
      .replace('Risk of "Juice Jacking" or malware from unverified apps (APKs) used for logistics/tracking on personal devices.', '存在“Juice Jacking”或来自未验证应用（APK）的恶意软件风险，这些应用用于物流/追踪并在个人设备上运行。')
      .replace('An individual responsible for high-level decision-making, management of sensitive organizational assets, or financial oversight. They possess elevated authority and access rights.', '负责高层决策、敏感资产管理或财务监管的个人，通常拥有较高的权限与访问权。')
      .replace('Targeted for Business Email Compromise (BEC) and Impersonation (e.g., Fake CEO/Director scams).', '易被“商业邮件入侵（BEC）”与“冒充身份”（如假冒CEO/董事骗局）锁定。')
      .replace('Susceptible to "Macau Scams" (Fake LHDN/Police calls) due to fear of reputational damage or legal repercussions.', '因担忧声誉或法律后果，容易遭遇“澳门骗局”（假LHDN/警方来电）。')
      .replace('A specialist with advanced technical proficiency who designs, builds, or maintains digital infrastructure. They often hold administrative privileges and manage critical system back-ends.', '具备高级技术能力、负责设计/构建/维护数字基础设施的专业人士，常拥有管理权限并负责关键系统后端。')
      .replace('Targeted for Supply Chain Attacks and Ransomware (e.g., the Swinburne Sarawak incident).', '易成为供应链攻击与勒索软件的目标（如 Swinburne Sarawak 事件）。')
      .replace('Risk of data exfiltration regarding proprietary code, blueprints, or patient data (PDPA violations).', '存在专有代码、图纸或患者数据被外泄的风险（可能违反 PDPA）。')
      .replace('A professional whose primary role involves extensive external communication, public engagement, and relationship building across various digital channels.', '以对外沟通、公众互动与跨数字渠道的关系构建为主要职责的专业人士。')
      .replace('Highly exposed to Phishing via WhatsApp/Email and Malicious Links disguised as customer inquiries or invoices.', '高度暴露于通过 WhatsApp/电子邮件的钓鱼与伪装为客户询问/发票的恶意链接。')
      .replace('High risk of "WhatsApp Hijacking" (asking friends for money) due to their wide public visibility.', '因公众可见度较高，存在被“WhatsApp 盗号”（向好友借钱）的高风险。')
      .replace('An independent user who primarily utilizes digital platforms for personal development, lifestyle, financial transactions, or social connectivity, without organizational oversight.', '主要为了个人成长、生活方式、金融交易或社交连接而使用数字平台、且不受组织监管的独立用户。')
      .replace('The primary demographic for Job Scams (Students), Mule Account Recruitment (Youth), and Investment Fraud (Retirees/Unemployed).', '求职骗局（学生）、“人头账户”招募（青年）及投资诈骗（退休者/失业者）的主要人群。')
      .replace('Targets for E-commerce Fraud (Fake Shopee/Facebook sellers) and Romance Scams.', '易受电子商务欺诈（假 Shopee/Facebook 卖家）与爱情骗局的侵害。')
      .replace('An individual focused on execution, logistics, and routine processing. They utilize technology to complete specific operational tasks and ensure workflow continuity.', '专注于执行、物流与常规处理的个体，利用技术完成具体运营任务并确保流程连续性。')
      ;
  }
  if (lang === 'ms') {
    return s
      .replace('You see an advertisement on social media saying an investment can give very high returns every week with almost no risk.', 'Anda melihat iklan di media sosial mengatakan pelaburan boleh memberi pulangan tinggi setiap minggu dengan hampir tiada risiko.')
      .replace('You encounter an online seller on a social media platform offering a latest model smartphone at a price significantly lower than the current market value. What is the most accurate assessment of this situation?', 'Anda menemui penjual dalam talian di platform media sosial menawarkan telefon pintar model terkini pada harga jauh lebih rendah daripada nilai pasaran semasa. Apakah penilaian paling tepat bagi situasi ini?')
      .replace('A colleague who just resigned is printing a large number of confidential documents. What would you do?', 'Seorang rakan sekerja yang baru meletak jawatan sedang mencetak sejumlah besar dokumen sulit. Apa yang anda akan lakukan?')
      .replace('You receive a call offering a special financial product. The caller asks for your online banking login details. What would you do?', 'Anda menerima panggilan menawarkan produk kewangan khas. Pemanggil meminta butiran log masuk perbankan dalam talian anda. Apa yang anda buat?')
      .replace('You receive a message saying your parcel cannot be delivered unless you pay a small fee through a link. What would you do?', 'Anda menerima mesej mengatakan bungkusan tidak dapat dihantar melainkan anda membayar yuran kecil melalui pautan. Apa yang anda buat?')
      .replace('A person claiming to be from your bank calls and requests the TAC sent to your phone to cancel a recent transaction. How should you respond?', 'Seseorang mendakwa dari bank anda menelefon dan meminta TAC yang dihantar ke telefon anda untuk membatalkan transaksi baru‑baru ini. Bagaimana anda harus bertindak?')
      .replace('You are invited to join a business model that requires an upfront payment and generates income mainly through recruiting new participants. What is the correct assessment?', 'Anda dijemput menyertai model perniagaan yang memerlukan bayaran awal dan menjana pendapatan terutamanya melalui merekrut peserta baharu. Apakah penilaian yang betul?')
      .replace(/What is /g, 'Apakah ')
      .replace(/Main purpose of/g, 'Tujuan utama')
      .replace(/What does /g, 'Apakah maksud ')
      .replace(/Why /g, 'Mengapa ')
      .replace(/Which /g, 'Yang manakah ')
      .replace(/Best /g, 'Cara terbaik ')
      .replace(/Most secure /g, 'Paling selamat ')
      .replace(/When /g, 'Apabila ')
      .replace(/At a cafe on /g, 'Di kafe pada ')
      .replace(/Two Wi.?Fi names/g, 'Dua nama Wi‑Fi')
      .replace(/Buying used item on Marketplace/g, 'Membeli barangan terpakai di Marketplace')
      .replace(/Attacker pretends to be/g, 'Penyerang berpura‑pura menjadi')
      .replace(/You find /g, 'Anda menemui ')
      .replace(/You receive a call/g, 'Anda menerima panggilan')
      .replace(/Caller claims/g, 'Pemanggil mendakwa')
      .replace(/Pop-up says/g, 'Pop-up menyatakan')
      .replace(/SMS from/g, 'SMS daripada')
      .replace(/Facebook ad/g, 'Iklan Facebook')
      .replace(/An email from your 'boss' asks you to urgently buy Google Play gift cards\. This is:/g, 'Emel daripada "bos" meminta anda beli kad hadiah Google Play dengan segera. Ini ialah:')
      .replace(/An email is highly personalized and references your job\. This is:/g, 'Emel sangat diperibadikan dan merujuk kerja anda. Ini ialah:')
      .replace(/You receive an SMS with a TAC\/OTP\. A person calls and asks you to read the number back\./g, 'Anda terima SMS TAC/OTP; seseorang menelefon dan minta anda bacakan nombor itu.')
      .replace(/What is a Pig Butchering scam\?/g, 'Apakah penipuan “Pig Butchering”?')
      .replace('offering a special financial product', 'menawarkan produk kewangan khas')
      .replace('The caller asks for your online banking login details.', 'Pemanggil meminta butiran log masuk perbankan dalam talian anda.')
      .replace('What would you do?', 'Apa yang akan anda lakukan?')
      .replace(/What should you do\?/g, 'Apakah yang patut anda lakukan?')
      .replace(/What should you do first\?/g, 'Apakah yang perlu anda lakukan terlebih dahulu?')
      .replace(/What would you most likely do\?/g, 'Apa yang paling mungkin anda lakukan?')
      .replace('You are working in a cafe and need to access work systems that contain sensitive information.', 'Anda bekerja di kafe dan perlu mengakses sistem kerja yang mengandungi maklumat sensitif.')
      .replace('What feels like the safest option?', 'Pilihan manakah rasa paling selamat?')
      .replace('You notice a small, unexpected RM20 debit from your S-Pay Global account, which you did not authorize.', 'Anda perasan potongan RM20 kecil dan tidak dijangka daripada akaun S‑Pay Global anda, yang anda tidak sahkan.')
      .replace('What is the most appropriate first step?', 'Langkah pertama yang paling sesuai?')
      .replace('You see an advertisement on social media saying an investment can give very high returns every week with almost no risk.', 'Anda melihat iklan di media sosial mengatakan pelaburan boleh memberi pulangan tinggi setiap minggu dengan hampir tiada risiko.')
      .replace('You see an advertisement on social media saying an investment can give very high returns every week with almost no risk. What would you most likely do?', 'Anda melihat iklan di media sosial mengatakan pelaburan boleh memberi pulangan tinggi setiap minggu dengan hampir tiada risiko. Apa yang paling mungkin anda lakukan?')
      .replace('Payment Fraud', 'Penipuan Pembayaran')
      .replace('Device Compromise', 'Peranti Terkompromi')
      .replace('High-Value Target', 'Sasaran Bernilai Tinggi')
      .replace('Authority Exploitation', 'Eksploitasi Autoriti')
      .replace('Infrastructure Gatekeeper', 'Penjaga Infrastruktur')
      .replace('Intellectual Property Theft', 'Kecurian Harta Intelek')
      .replace('Social Engineering Entry Point', 'Titik Masuk Kejuruteraan Sosial')
      .replace('Account Takeover', 'Pengambilalihan Akaun')
      .replace('Predatory Scams', 'Penipuan Predator')
      .replace('Lifestyle Attacks', 'Serangan Gaya Hidup')
      .replace('E-Wallet Scams', 'Penipuan Dompet Elektronik')
      .replace('E‑Wallet Scams', 'Penipuan Dompet Elektronik')
      .replace('Vulnerable to Fake Payment Receipts and E-Wallet Scams (S-Pay Global) during daily transactions.', 'Mudah terdedah kepada resit pembayaran palsu dan penipuan e-dompet (S‑Pay Global) semasa transaksi harian.')
      .replace('Vulnerable to Fake Payment Receipts and E‑Wallet Scams (S‑Pay Global) during daily transactions.', 'Mudah terdedah kepada resit pembayaran palsu dan penipuan e-dompet (S‑Pay Global) semasa transaksi harian.')
      .replace('Risk of "Juice Jacking" or malware from unverified apps (APKs) used for logistics/tracking on personal devices.', 'Risiko “Juice Jacking” atau malware daripada aplikasi tidak disahkan (APK) yang digunakan untuk logistik/pengesanan pada peranti peribadi.')
      .replace('An individual focused on execution, logistics, and routine processing. They utilize technology to complete specific operational tasks and ensure workflow continuity.', 'Individu yang fokus kepada pelaksanaan, logistik, dan pemprosesan rutin; menggunakan teknologi untuk menyiapkan tugas operasi khusus dan memastikan kesinambungan aliran kerja.')
      .replace('An individual responsible for high-level decision-making, management of sensitive organizational assets, or financial oversight. They possess elevated authority and access rights.', 'Individu yang bertanggungjawab membuat keputusan peringkat tinggi, mengurus aset sensitif organisasi atau penyeliaan kewangan; mempunyai autoriti dan hak akses yang tinggi.')
      .replace('Targeted for Business Email Compromise (BEC) and Impersonation (e.g., Fake CEO/Director scams).', 'Disasarkan kepada kompromi emel perniagaan (BEC) dan penyamaran (contoh: penipuan CEO/Pengarah palsu).')
      .replace('Susceptible to "Macau Scams" (Fake LHDN/Police calls) due to fear of reputational damage or legal repercussions.', 'Mudah terdedah kepada “Macau Scam” (panggilan LHDN/Polis palsu) kerana takut kerosakan reputasi atau implikasi undang‑undang.')
      .replace('A specialist with advanced technical proficiency who designs, builds, or maintains digital infrastructure. They often hold administrative privileges and manage critical system back-ends.', 'Pakar berkemahiran teknikal tinggi yang mereka bentuk, membina atau menyelenggara infrastruktur digital; lazimnya mempunyai keistimewaan pentadbiran dan mengurus bahagian belakang sistem kritikal.')
      .replace('Targeted for Supply Chain Attacks and Ransomware (e.g., the Swinburne Sarawak incident).', 'Disasarkan kepada serangan rantaian bekalan dan ransomware (cth: insiden Swinburne Sarawak).')
      .replace('Risk of data exfiltration regarding proprietary code, blueprints, or patient data (PDPA violations).', 'Risiko data sulit dieksfiltrasi seperti kod proprietari, pelan, atau data pesakit (melanggar PDPA).')
      .replace('A professional whose primary role involves extensive external communication, public engagement, and relationship building across various digital channels.', 'Profesional yang peranan utamanya melibatkan komunikasi luaran meluas, libat urus awam, dan pembinaan hubungan merentas pelbagai saluran digital.')
      .replace('Highly exposed to Phishing via WhatsApp/Email and Malicious Links disguised as customer inquiries or invoices.', 'Sangat terdedah kepada pancingan data melalui WhatsApp/Emel serta pautan berniat jahat yang menyamar sebagai pertanyaan pelanggan atau invois.')
      .replace('High risk of "WhatsApp Hijacking" (asking friends for money) due to their wide public visibility.', 'Berisiko tinggi “WhatsApp Hijacking” (minta wang daripada rakan) kerana keterlihatan awam yang luas.')
      .replace('An independent user who primarily utilizes digital platforms for personal development, lifestyle, financial transactions, or social connectivity, without organizational oversight.', 'Pengguna bebas yang terutama menggunakan platform digital untuk pembangunan diri, gaya hidup, transaksi kewangan atau keterhubungan sosial tanpa pengawasan organisasi.')
      .replace('The primary demographic for Job Scams (Students), Mule Account Recruitment (Youth), and Investment Fraud (Retirees/Unemployed).', 'Demografik utama bagi penipuan kerja (Pelajar), pengambilan akaun “mule” (Belia), dan penipuan pelaburan (Bersara/Tidak bekerja).')
      .replace('Targets for E-commerce Fraud (Fake Shopee/Facebook sellers) and Romance Scams.', 'Menjadi sasaran penipuan e‑dagang (penjual Shopee/Facebook palsu) dan penipuan cinta.')
      ;
  }
  return s;
};

const textDict = { zh: { "Which is the most secure password?": "哪一个是最安全的密码？", "How do you manage your passwords?": "你如何管理你的密码？", "What is Two-Factor Authentication (2FA)?": "什么是双重认证（2FA）？", "Used the same email password for 5 years. Is this a problem?": "同一个邮箱密码已用了5年。这有问题吗？", "Best way to manage passwords?": "管理密码的最佳方式？", "What is Credential Stuffing?": "什么是凭证填充（Credential Stuffing）？", "Your friend asks for your Netflix password.": "朋友向你索要Netflix密码。", "Most secure form of 2FA?": "最安全的2FA形式是？", "What is a Passphrase?": "什么是口令短语（Passphrase）？", "Pop-up says your computer is infected with 5 viruses; click to scan.": "弹窗提示你的电脑感染了5个病毒；点击进行扫描。", "Download 'Photoshop' from a torrent site.": "从种子站下载“Photoshop”。", "What is Ransomware?": "什么是勒索软件？", "When your device asks to install updates, you should...": "设备提示安装更新时，你应该……", "Best protection for data from ransomware?": "防止勒索软件导致数据损失的最佳保护是？", "What is a Zero-Day vulnerability?": "什么是零日漏洞？", "What is a Botnet?": "什么是僵尸网络（Botnet）？", "What is a Keylogger?": "什么是键盘记录器（Keylogger）？", "What does sideloading an app mean?": "旁加载应用是什么意思？", "You find a 'helpful' code snippet on a forum that solves your bug. You should:": "你在论坛看到一个“有用”的代码片段解决你的Bug，你应该：", "At a cafe on 'Kopitiam_Free_WiFi' you need to check your bank.": "在咖啡馆使用“Kopitiam_Free_WiFi”，你需要查银行账户。", "You find a USB drive in your office parking lot.": "你在办公室停车场捡到一个U盘。", "How should you dispose of old bank statements?": "旧的银行账单该如何处理？", "Friend asks for a photo of your MyKad (IC) via WhatsApp.": "朋友通过WhatsApp向你索要MyKad（IC）照片。", "Main purpose of a VPN?": "VPN的主要作用是什么？", "What is a Man‑in‑the‑Middle (MITM) attack?": "什么是中间人（MITM）攻击？", "Two Wi‑Fi names: Starbucks_Free vs Starbucks_Free_WiFi could be...": "两个Wi‑Fi名称：Starbucks_Free 与 Starbucks_Free_WiFi 可能是……", "What does 'Incognito/Private' mode do?": "“无痕/隐私”模式的作用是什么？", "What is Shoulder Surfing?": "什么是肩窥（Shoulder Surfing）？", "Caller claims to be IT and asks for your password for migration.": "有人自称IT需要你的密码进行迁移。", "What is tailgating (physical security)?": "什么是尾随进入（物理安全）？", "Why are social media “fun quizzes” risky?": "为何社交媒体上的“趣味问答”存在风险？", "New friend request from unknown pretty person.": "收到一位陌生漂亮人士的好友请求。", "Social Engineering relies on…": "社会工程主要依赖于……", "What is Pretexting?": "什么是借口欺骗（Pretexting）？", "Why is posting boarding pass photos risky?": "为何发布登机牌照片存在风险？", "What is Quid Pro Quo?": "什么是等价交换（Quid Pro Quo）？", "Attacker pretends to be an angry high‑level executive demanding info.": "攻击者冒充愤怒的高层主管，索要敏感信息。", "Email from 'Netflix' for payment declined.": "来自Netflix的邮件称付款被拒。", "What's the easiest way to spot a fake email?": "识别假邮件最简单的方法是什么？", "You hover your mouse over a link. Where do you look?": "将鼠标悬停在链接上时，你应该看哪里？", "What is the main goal of a phishing email?": "钓鱼邮件的主要目标是什么？", "An email from your 'boss' asks you to urgently buy Google Play gift cards. This is:": "有人冒充“老板”紧急要求购买Google Play礼品卡。这是：", "An email is highly personalized and references your job. This is:": "这是一封高度个性化并提到你工作的邮件，这是：", "What is Vishing?": "什么是语音钓鱼（Vishing）？", "What is a Punycode attack?": "什么是同形异义域名（Punycode）攻击？", "What does a green lock icon (SSL) mean?": "绿色锁图标（SSL）表示什么？", "SMS from 'LHDN' about RM500 refund with bit.ly link.": "来自LHDN的RM500退款短信并附bit.ly链接。", "Facebook ad for Sarawak investment guarantees 30% in 24 hours.": "Facebook广告宣称“砂拉越投资”24小时保证30%收益。", "Call from 'Sarawak Energy': power cut in 1 hour unless pay by phone.": "来自Sarawak Energy的来电：1小时内将断电，除非电话支付账单。", "You receive a call claiming to be from PDRM asking for immediate payment to avoid arrest. What should you do?": "接到自称PDRM的来电，要求立即付款以避免逮捕。你应该怎么做？", "You receive an SMS with a TAC/OTP. A person calls and asks you to read the number back.": "你收到包含TAC/OTP的短信，随后有人来电要求你读出该数字。", "Why are .apk files from SMS messages so dangerous?": "为何短信中的.apk应用如此危险？", "Buying used item on Marketplace: the seller often...": "在Marketplace购买二手物品时，卖家经常……" }, ms: { "Which is the most secure password?": "Yang manakah kata laluan paling selamat?", "How do you manage your passwords?": "Bagaimana anda mengurus kata laluan anda?", "What is Two-Factor Authentication (2FA)?": "Apakah Pengesahan Dua Faktor (2FA)?", "Used the same email password for 5 years. Is this a problem?": "Kata laluan emel yang sama digunakan selama 5 tahun. Adakah ini masalah?", "Best way to manage passwords?": "Cara terbaik mengurus kata laluan?", "What is Credential Stuffing?": "Apakah Credential Stuffing?", "Your friend asks for your Netflix password.": "Rakan meminta kata laluan Netflix anda.", "Most secure form of 2FA?": "Bentuk 2FA yang paling selamat?", "What is a Passphrase?": "Apakah Passphrase?", "Pop-up says your computer is infected with 5 viruses; click to scan.": "Pop-up menyatakan komputer anda dijangkiti 5 virus; klik untuk imbas.", "Download 'Photoshop' from a torrent site.": "Muat turun ‘Photoshop’ dari laman torrent.", "What is Ransomware?": "Apakah Ransomware?", "When your device asks to install updates, you should...": "Apabila peranti meminta kemas kini, anda patut…", "Best protection for data from ransomware?": "Perlindungan terbaik terhadap kehilangan data akibat ransomware?", "What is a Zero-Day vulnerability?": "Apakah Zero‑Day?", "What is a Botnet?": "Apakah Botnet?", "What is a Keylogger?": "Apakah Keylogger?", "What does sideloading an app mean?": "Apakah maksud sideloading aplikasi?", "You find a 'helpful' code snippet on a forum that solves your bug. You should:": "Anda menemui potongan kod ‘berguna’ di forum untuk menyelesaikan pepijat. Anda patut:", "At a cafe on 'Kopitiam_Free_WiFi' you need to check your bank.": "Di kafe pada ‘Kopitiam_Free_WiFi’, anda perlu semak bank.", "You find a USB drive in your office parking lot.": "Anda jumpa pemacu USB di tempat letak kereta pejabat.", "How should you dispose of old bank statements?": "Bagaimana anda patut melupuskan penyata bank lama?", "Friend asks for a photo of your MyKad (IC) via WhatsApp.": "Rakan meminta foto MyKad (IC) melalui WhatsApp.", "Main purpose of a VPN?": "Tujuan utama VPN?", "What is a Man‑in‑the‑Middle (MITM) attack?": "Apakah serangan MITM?", "Two Wi‑Fi names: Starbucks_Free vs Starbucks_Free_WiFi could be...": "Dua nama Wi‑Fi: Starbucks_Free vs Starbucks_Free_WiFi mungkin…", "What does 'Incognito/Private' mode do?": "Apakah fungsi mod Incognito/Private?", "What is Shoulder Surfing?": "Apakah Shoulder Surfing?", "Caller claims to be IT and asks for your password for migration.": "Pemanggil mendakwa dari IT dan meminta kata laluan untuk migrasi.", "What is tailgating (physical security)?": "Apakah tailgating (keselamatan fizikal)?", "Why are social media “fun quizzes” risky?": "Mengapa kuiz ‘seronok’ di media sosial berisiko?", "New friend request from unknown pretty person.": "Permintaan rakan baharu daripada individu tidak dikenali.", "Social Engineering relies on…": "Kejuruteraan sosial bergantung kepada…", "What is Pretexting?": "Apakah Pretexting?", "Why is posting boarding pass photos risky?": "Mengapa memuat naik foto pas masuk berisiko?", "What is Quid Pro Quo?": "Apakah Quid Pro Quo?", "Attacker pretends to be an angry high‑level executive demanding info.": "Penyerang berpura‑pura menjadi eksekutif tertinggi yang marah dan menuntut maklumat.", "Email from 'Netflix' for payment declined.": "Emel daripada ‘Netflix’ menyatakan pembayaran ditolak.", "What's the easiest way to spot a fake email?": "Cara paling mudah mengenal pasti emel palsu ialah?", "You hover your mouse over a link. Where do you look?": "Apabila menghalakan tetikus pada pautan, di mana anda lihat?", "What is the main goal of a phishing email?": "Apakah tujuan utama emel pancingan?", "An email from your 'boss' asks you to urgently buy Google Play gift cards. This is:": "Emel daripada ‘bos’ meminta anda beli kad hadiah segera. Ini ialah:", "An email is highly personalized and references your job. This is:": "Emel sangat diperibadikan dan merujuk kerja anda. Ini ialah:", "What is Vishing?": "Apakah Vishing?", "What is a Punycode attack?": "Apakah serangan Punycode?", "What does a green lock icon (SSL) mean?": "Apakah maksud ikon kunci hijau (SSL)?", "SMS from 'LHDN' about RM500 refund with bit.ly link.": "SMS daripada ‘LHDN’ tentang bayaran balik RM500 dengan pautan bit.ly.", "Facebook ad for Sarawak investment guarantees 30% in 24 hours.": "Iklan Facebook ‘pelaburan Sarawak’ menjamin 30% dalam 24 jam.", "Call from 'Sarawak Energy': power cut in 1 hour unless pay by phone.": "Panggilan daripada ‘Sarawak Energy’: bekalan elektrik diputus dalam 1 jam kecuali bayar melalui telefon.", "You receive a call claiming to be from PDRM asking for immediate payment to avoid arrest. What should you do?": "Anda menerima panggilan daripada ‘PDRM’ meminta bayaran segera untuk elak ditangkap. Apa patut anda buat?", "You receive an SMS with a TAC/OTP. A person calls and asks you to read the number back.": "Anda terima SMS TAC/OTP; seseorang menelefon dan minta anda bacakan nombor itu.", "Why are .apk files from SMS messages so dangerous?": "Mengapa fail .apk daripada SMS sangat berbahaya?", "Buying used item on Marketplace: the seller often...": "Membeli barang terpakai di Marketplace, penjual selalunya…" } };
const tipDict = {
  zh: {
    'Phishing emails often mimic legitimate senders. Always verify independently.': '钓鱼邮件常模仿正规发件人；请独立核实。',
    'Check sender domain, hover links, and grammar cues.': '检查发件人域名、悬停查看链接、留意语法提示。',
    'Hover reveals the real URL in the status area; compare domain.': '悬停可在状态区显示真实URL；注意域名对比。',
    'Credential or payment theft is typical objective.': '窃取凭证或付款是常见目标。',
    'Gift card requests are common BEC tactics; verify synchronously.': '礼品卡请求是常见BEC手法；务必同步核实。',
    'Spear phishing leverages personalized context to increase success.': '鱼叉式钓鱼利用个性化情境提高成功率。',
    'Voice calls are abused for urgency and impersonation.': '语音来电常被滥用以制造紧迫感与冒充身份。',
    'Homoglyphs make malicious domains resemble trusted ones.': '同形异义字符可让恶意域名看似可信。',
    'TLS ensures transport encryption, not site legitimacy.': 'TLS仅保证传输加密，并不代表网站可信。',
    'Malvertising uses fake alerts; avoid interacting with popups.': '恶意广告常用假警报；避免与弹窗交互。',
    'Cracked software commonly carries trojans and ransomware.': '破解软件常夹带木马和勒索软件。',
    'Backups and patching mitigate ransomware impact.': '备份与及时打补丁可降低勒索软件影响。',
    'Updates contain critical security patches; apply promptly.': '更新包含关键安全补丁；应尽快安装。',
    'Offline backups prevent data loss even if encryption occurs.': '离线备份可在数据被加密时避免丢失。',
    'Zero-days are exploited before patches exist; layered defenses help.': '零日漏洞在补丁发布前即被利用；分层防御有效。',
    'Botnets enable DDoS and spam; devices join via malware.': '僵尸网络用于DDoS与垃圾信息；设备通过恶意软件加入。',
    'Keyloggers capture credentials; watch for unusual behavior and use anti-malware.': '键盘记录器会窃取凭证；留意异常行为并使用反恶意软件。',
    'Sideloading bypasses store checks; increases malware risk.': '旁加载绕过商店审查，提升恶意软件风险。',
    'Avoid public Wi‑Fi for banking; prefer mobile data or VPN.': '办理银行业务避免使用公共Wi‑Fi；优先使用移动数据或VPN。',
    'Unknown USBs may contain malware; hand to IT without connecting.': '未知U盘可能含恶意软件；不要连接，交给IT处理。',
    'Destroy sensitive paper records to prevent data leaks.': '销毁敏感纸质文件以防数据泄露。',
    'Avoid sharing government ID; use secure official channels only.': '避免分享政府证件；仅使用安全的官方渠道。',
    'VPNs encrypt traffic; they are not antivirus.': 'VPN加密流量，但并非杀毒软件。',
    'MITM intercepts data on untrusted networks; use HTTPS and VPN.': '中间人攻击拦截不可信网络中的数据；使用HTTPS与VPN。',
    'Attackers clone SSIDs; verify with staff and use HTTPS/VPN.': '攻击者可克隆SSID；向工作人员核实并使用HTTPS/VPN。',
    'Private mode affects local storage only; not network visibility.': '隐私模式仅影响本地存储，并不隐藏网络可见性。',
    'Shield screens and keypads; be aware of surroundings.': '遮挡屏幕与键盘；注意周围环境。',
    'Never share passwords; verify via official channels.': '切勿分享密码；通过官方渠道核实。',
    'Tailgating bypasses access controls; challenge and report.': '尾随进入绕过门禁；应质询并上报。',
    'Trivia reveals answers to common security questions; avoid sharing.': '趣味问答会暴露常见安全问题答案；避免分享。',
    'Fake accounts harvest info; restrict contacts to known people.': '虚假账号用来收集信息；仅与认识的人互动。',
    'Most attacks exploit people, not systems; stay skeptical and verify.': '多数攻击利用人性而非系统；保持怀疑并核实。',
    'Offer of benefits in exchange for credentials or access.': '以好处交换凭证或访问权的诱骗。',
    'Authority scams use pressure; validate identities and escalate properly.': '权威型骗局利用压力；核实身份并按流程上报。',
    'Use high-entropy, random passwords rather than common patterns.': '使用高熵随机密码而非常见模式。',
    'Unique passwords per site reduce breach blast radius.': '每站点使用独立密码可降低泄露影响范围。',
    'Use app-based or hardware 2FA for strong protection.': '使用App或硬件2FA以获得更强保护。',
    'Rotate important passwords; check for breaches and enable 2FA.': '定期更换重要密码；检查泄露并启用2FA。',
    'Use a reputable password manager with strong master password.': '使用可信密码管理器并设置强主密码。',
    'Supply chain attacks can hide in third-party snippets; vet code in isolation.': '供应链攻击可能隐藏在第三方代码片段中；在隔离环境审查代码。',
    'Network isolation preserves forensic value while mitigating spread.': '网络隔离可保留取证价值并减少传播。',
    'URL shorteners and refunds are common lures; verify independently.': '短链接与退款是常见诱饵；请独立核实。',
    'APK overlays can steal credentials; use official channels.': 'APK覆盖层可窃取凭证；仅用官方渠道。',
    'Utilities do not request payment via inbound calls; verify in app.': '公用事业不会通过来电要求付款；请在官方App核实。',
    'Hardware keys and TOTP apps resist SIM swapping and phishing.': '硬件密钥与TOTP应用可抵御换卡与钓鱼攻击。',
    'Long passphrases provide strong entropy and memorability.': '较长的多词口令具备高熵且易记。',
    'Pretexting fabricates context to manipulate targets.': '借口欺骗通过编造情境来操纵目标。',
    'Barcodes expose PII; avoid posting travel docs online.': '条形码会泄露个人身份信息；避免在网上发布出行证件。'
    , 'Pretexting targets frontline banking roles; never bypass verification workflows.': '借口欺骗常针对银行一线岗位；切勿绕过验证流程。'
    , 'Never share login details; use platform trade systems and MFA.': '切勿分享登录信息；使用平台内交易系统与多因素认证。'
    , 'Authorities do not demand payments over calls; verify independently.': '执法机关不会通过电话要求付款；请独立核实。'
    , 'Guaranteed high returns are hallmark of fraud.': '保证高回报是诈骗的典型特征。'
    , 'Insist on platform payments and protections; avoid off-platform transfers.': '坚持在平台内付款与受保护；避免平台外转账。'
    , 'Scammers build trust over weeks then push fake investments.': '骗子常先长期培养信任，再推动虚假投资。'
    , 'OTP is the last gate; never disclose it to anyone.': '一次性密码（OTP）是最后一道关卡；绝不透露给任何人。'
    , 'Overlays intercept credentials and OTPs in banking apps.': '覆盖层会截取银行应用中的凭证与OTP。'
    , 'Reused passwords enable stuffing; unique passwords and 2FA help.': '复用密码会助长填充攻击；使用唯一密码与2FA可缓解。'
    , 'Sharing credentials increases risk of compromise and lockouts.': '共享凭证会增加被入侵与被锁定的风险。'
    , 'When something unusual happens to many files at once, think about how computers are connected to each other.': '当许多文件同时出现异常时，应考虑计算机之间的连接方式。'
    , 'Personal devices and personal accounts do not follow the same security rules as workplace systems.': '个人设备与个人账户不遵循与工作系统相同的安全规则。'
    , 'Urgency is often used to push people into skipping normal checking steps.': '“紧急”常被用来促使人跳过正常的核查步骤。'
    , 'Not all internet connections offer the same level of protection for your data.': '并非所有网络连接都能提供相同的数据保护水平。'
    , 'Not every security threat comes through a computer screen.': '并非所有安全威胁都来自电脑屏幕。'
    , 'The place where software comes from matters as much as the software itself.': '软件来源与软件本身同样重要。'
    , 'Some accounts are more powerful than others and deserve extra protection.': '部分账户权限更高，理应获得额外保护。'
    , 'Changes in staff status can sometimes increase security risks.': '人员状态的变化有时会增加安全风险。'
    , 'When money grows very fast with little effort, it is worth slowing down and asking how it really works.': '当“轻松高回报”出现时，应放慢脚步，了解其真实运作。'
    , 'Where an app comes from can tell you a lot about whether it should be trusted.': '应用来源常能判断其可信度。'
    , 'Not every business that looks professional is allowed to operate legally.': '外表专业的业务并不一定合法合规。'
    , 'Scammers often focus on building trust before talking about money.': '骗子常先建立信任，再谈金钱。'
    , 'Think about how legitimate lenders usually handle their fees.': '考虑正规放贷方通常如何处理费用。'
    , 'Your bank account is closely tied to your identity and responsibility.': '你的银行账户与个人身份与责任紧密相关。'
    , 'Sensitive information is rarely needed over a phone call.': '敏感信息很少会通过电话索取。'
    , 'People who know you are already stressed may try to take advantage of that situation.': '对方知道你已受挫时，可能会乘虚而入。'
    , 'Government matters usually leave a clear trail that can be checked calmly.': '政府事务通常有清晰的可核查记录。'
    , 'Serious investigations are handled in controlled and traceable ways.': '严肃调查应在可控、可追溯的流程中进行。'
    , 'The way information is delivered often matters as much as the information itself.': '信息的传递方式与信息本身同样重要。'
    , 'Once personal details are shared, they cannot be taken back.': '一旦个人信息泄露，便难以收回。'
    , 'Strong emotions can make it hard to think clearly.': '强烈情绪会影响清晰判断。'
    , 'Small amounts are often used to lower suspicion.': '小额金额常被用来降低警惕。'
    , 'Legitimate services rarely need to visit homes without prior notice.': '正规服务少有不事先通知就上门。'
    , 'Access to accounts often depends on a single piece of information.': '账户访问往往取决于一条关键信息。'
    , 'In legitimate employment arrangements, earnings are linked to completed work, not entry payments.': '正规雇佣安排中，收益应与完成的工作挂钩，而非入场费。'
    , 'Employment opportunities involving international travel should always have verifiable and traceable processes.': '涉及国际旅行的就业机会应具备可核验、可追溯的流程。'
    , 'Financial commitments related to housing should only be made after sufficient verification.': '与住房相关的经济承诺应在充分核实后作出。'
    , 'Official organisations maintain consistent communication methods and domains.': '官方机构的沟通方式与域名应保持一致性。'
    , 'Previously used devices may still retain configurations or software from earlier owners.': '曾被使用的设备可能仍保留前任所有者的配置或软件。'
    , 'Consider the standard procedures followed by recognised funding bodies.': '参考受认可资助机构的标准流程。'
    , 'Personal data, once shared, may be reused beyond its original purpose.': '个人数据一旦共享，可能被用于超出原始目的的场景。'
    , 'Understanding the primary source of income is critical when evaluating business models.': '评估商业模式时，理解其主要收入来源至关重要。'
    , 'Pricing that deviates greatly from market norms often indicates hidden risks.': '远低于市场价格常暗示隐藏风险。'
    , 'Unusual access attempts may indicate early signs of account compromise.': '异常的登录尝试可能是账户被入侵的早期迹象。'
    , 'Responding emotionally to threats can increase vulnerability.': '情绪化应对威胁会增加脆弱性。'
    , 'Legitimate promotions do not require account passwords to distribute rewards.': '正规促销不会要求输入账户密码以发放奖励。'
    , 'Permissions should match the purpose of the application.': '应用权限应与其功能目的相匹配。'
    , 'Visual proof alone may not accurately reflect financial transactions.': '仅凭截图等视觉证据不足以准确反映交易。'
    , 'Physical safeguards can complement digital security controls.': '物理防护可与数字安全控制相辅相成。'
    , 'One compromised account can affect others if protections are reused.': '若重复使用保护，一旦一个账户被攻破会牵连其他账户。'
    , 'Even minor unusual transactions can signal unauthorized access. Think about steps that protect your account immediately.': '即便是小额异常交易也可能是未授权访问的信号；考虑立刻采取保护账户的措施。'
    , 'Unexpected downloads may indicate security risks. Consider whether the action matches the intended outcome of scanning a QR code.': '意外下载可能意味着安全风险；考虑该行为是否符合扫码的原本目的。'
    , 'Question requests for sensitive information that deviate from standard security procedures.': '对偏离标准安全流程的敏感信息请求保持质疑。'
    , 'Visual evidence such as screenshots can be manipulated. Consider how to confirm the information reliably.': '截图等视觉证据可能被操纵；考虑如何可靠地核实信息。'
    , 'Public charging points may carry hidden data risks. Think about ways to maintain security while charging.': '公共充电点可能隐含数据风险；思考充电时如何保持安全。'
    , 'Consider which authorities are best equipped to handle financial fraud rather than general emergencies.': '考虑哪类机构更适合处理金融诈骗，而非一般紧急情况。'
    , 'Public networks may not be secure. Think about the level of protection needed for sensitive transactions.': '公共网络可能不安全；衡量敏感交易所需的保护级别。'
    , 'Evaluate whether the source and format of the communication align with official procedures.': '评估通信来源与形式是否符合官方流程。'
    , 'Consider what actions allow you to check for issues without assuming everything is fine.': '考虑可在不做“没事”假设的前提下进行问题核查的行动。'
    , 'Think about why some offers seem “too good to be true.”': '思考为何某些优惠“好得不真实”。'
    , 'Reflect on the broader implications of how such situations could escalate.': '考虑此类情形可能升级的更广泛影响。'
    , 'Pop-ups pressuring immediate action often indicate scams. Think about whether the message is consistent with legitimate support practices.': '催促“立即操作”的弹窗常是骗局；考虑信息是否与正规支持实践一致。'
    , 'Consider how official communications usually reach users.': '思考官方通信通常如何触达用户。'
    , 'Public computers can store session data. Think about what information might remain accessible after you finish.': '公共电脑可能保留会话数据；考虑你完成操作后仍可被访问的信息。'
    , 'Unsolicited friendly messages can be used to build rapport before exploiting victims. Consider the potential risk.': '未经请求的“友好”消息可能用于建立关系后再行利用受害者；考虑潜在风险。'
    , 'Think about what the document is asking you to do and whether it is typical.': '思考文档要求你做什么以及这是否常见。'
    , 'Physical security is as important as digital security. Protect your input from observation.': '物理安全与数字安全同样重要；防止输入被旁观。'
    , 'Think about ways to ensure a charitable request is genuine.': '考虑如何确保募捐请求的真实性。'
    , 'Reflect on how additional software interacts with your information.': '思考附加软件如何与个人信息交互。'
    , 'Biometric data is highly sensitive. Consider the potential consequences of sharing personal data.': '生物特征数据高度敏感；考虑共享个人数据的潜在后果。'
  },
  ms: {
    'Phishing emails often mimic legitimate senders. Always verify independently.': 'Emel pancingan sering meniru penghantar sah; sentiasa sahkan secara berasingan.',
    'Check sender domain, hover links, and grammar cues.': 'Semak domain penghantar, halakan tetikus pada pautan, dan petunjuk tatabahasa.',
    'Hover reveals the real URL in the status area; compare domain.': 'Halakan tetikus menunjukkan URL sebenar pada bar status; bandingkan domain.',
    'Credential or payment theft is typical objective.': 'Mencuri kelayakan atau bayaran adalah matlamat biasa.',
    'Gift card requests are common BEC tactics; verify synchronously.': 'Permintaan kad hadiah adalah taktik BEC biasa; sahkan secara serentak.',
    'Spear phishing leverages personalized context to increase success.': 'Spear phishing menggunakan konteks peribadi untuk meningkatkan kejayaan.',
    'Voice calls are abused for urgency and impersonation.': 'Panggilan suara disalah guna untuk mendesak dan menyamar.',
    'Homoglyphs make malicious domains resemble trusted ones.': 'Homoglif menjadikan domain jahat kelihatan seperti yang dipercayai.',
    'TLS ensures transport encryption, not site legitimacy.': 'TLS memastikan penyulitan penghantaran, bukan legitimasi laman.',
    'Malvertising uses fake alerts; avoid interacting with popups.': 'Malvertising guna amaran palsu; elakkan berinteraksi dengan pop‑up.',
    'Cracked software commonly carries trojans and ransomware.': 'Perisian retak sering membawa trojan dan ransomware.',
    'Backups and patching mitigate ransomware impact.': 'Sandaran dan tampalan mengurangkan kesan ransomware.',
    'Updates contain critical security patches; apply promptly.': 'Kemas kini mengandungi tampalan keselamatan kritikal; laksanakan segera.',
    'Offline backups prevent data loss even if encryption occurs.': 'Sandaran luar talian mencegah kehilangan data walaupun disulitkan.',
    'Zero-days are exploited before patches exist; layered defenses help.': 'Zero‑day dieksploitasi sebelum wujud tampalan; pertahanan berlapis membantu.',
    'Botnets enable DDoS and spam; devices join via malware.': 'Botnet membolehkan DDoS dan spam; peranti menyertai melalui malware.',
    'Keyloggers capture credentials; watch for unusual behavior and use anti-malware.': 'Keylogger menangkap kelayakan; perhatikan tingkah laku luar biasa dan guna anti‑malware.',
    'Sideloading bypasses store checks; increases malware risk.': 'Sideloading memintas semakan gedung; meningkatkan risiko malware.',
    'Avoid public Wi‑Fi for banking; prefer mobile data or VPN.': 'Elakkan Wi‑Fi awam untuk perbankan; guna data mudah alih atau VPN.',
    'Unknown USBs may contain malware; hand to IT without connecting.': 'USB tidak diketahui mungkin mengandungi malware; serah kepada IT tanpa menyambung.',
    'Destroy sensitive paper records to prevent data leaks.': 'Musnahkan rekod kertas sensitif untuk mengelak kebocoran data.',
    'Avoid sharing government ID; use secure official channels only.': 'Elakkan berkongsi ID kerajaan; guna saluran rasmi yang selamat sahaja.',
    'VPNs encrypt traffic; they are not antivirus.': 'VPN menyulitkan trafik; ia bukan antivirus.',
    'MITM intercepts data on untrusted networks; use HTTPS and VPN.': 'MITM memintas data pada rangkaian tidak dipercayai; guna HTTPS dan VPN.',
    'Attackers clone SSIDs; verify with staff and use HTTPS/VPN.': 'Penyerang mengklon SSID; sahkan dengan kakitangan dan guna HTTPS/VPN.',
    'Private mode affects local storage only; not network visibility.': 'Mod peribadi hanya menjejaskan storan tempatan; bukan keterlihatan rangkaian.',
    'Shield screens and keypads; be aware of surroundings.': 'Lindungi skrin dan papan kekunci; peka dengan persekitaran.',
    'Never share passwords; verify via official channels.': 'Jangan sekali‑kali kongsi kata laluan; sahkan melalui saluran rasmi.',
    'Tailgating bypasses access controls; challenge and report.': 'Tailgating memintas kawalan akses; cabar dan laporkan.',
    'Trivia reveals answers to common security questions; avoid sharing.': 'Kuiz mendedahkan jawapan kepada soalan keselamatan biasa; elak berkongsi.',
    'Fake accounts harvest info; restrict contacts to known people.': 'Akaun palsu mengutip maklumat; hadkan kepada kenalan yang dikenali.',
    'Most attacks exploit people, not systems; stay skeptical and verify.': 'Kebanyakan serangan mengeksploitasi manusia, bukan sistem; kekal skeptikal dan sahkan.',
    'Offer of benefits in exchange for credentials or access.': 'Tawaran manfaat untuk menukar kelayakan atau akses.',
    'Authority scams use pressure; validate identities and escalate properly.': 'Penipuan berautoriti guna tekanan; sahkan identiti dan eskalasi dengan betul.',
    'Use high-entropy, random passwords rather than common patterns.': 'Guna kata laluan rawak berentropi tinggi, bukan corak biasa.',
    'Unique passwords per site reduce breach blast radius.': 'Kata laluan unik bagi setiap laman mengurangkan impak kebocoran.',
    'Use app-based or hardware 2FA for strong protection.': 'Guna 2FA berasaskan aplikasi atau perkakasan untuk perlindungan kukuh.',
    'Rotate important passwords; check for breaches and enable 2FA.': 'Putar kata laluan penting; semak kebocoran dan aktifkan 2FA.',
    'Use a reputable password manager with strong master password.': 'Guna pengurus kata laluan bereputasi dengan kata laluan induk yang kukuh.',
    'Supply chain attacks can hide in third-party snippets; vet code in isolation.': 'Serangan rantaian bekalan boleh tersembunyi dalam snippet pihak ketiga; semak kod dalam persekitaran terasing.',
    'Network isolation preserves forensic value while mitigating spread.': 'Pengasingan rangkaian mengekalkan nilai forensik sambil mengurangkan penyebaran.',
    'URL shorteners and refunds are common lures; verify independently.': 'Pautan pendek dan bayaran balik ialah umpan biasa; sahkan secara berasingan.',
    'APK overlays can steal credentials; use official channels.': 'Lapisan APK boleh mencuri kelayakan; guna saluran rasmi.',
    'Utilities do not request payment via inbound calls; verify in app.': 'Utiliti tidak meminta bayaran melalui panggilan masuk; sahkan dalam aplikasi.',
    'Hardware keys and TOTP apps resist SIM swapping and phishing.': 'Kunci perkakasan dan aplikasi TOTP menahan penipuan tukar SIM dan pancingan.',
    'Long passphrases provide strong entropy and memorability.': 'Frasa laluan panjang menyediakan entropi kuat dan mudah diingati.',
    'Pretexting fabricates context to manipulate targets.': 'Pretexting mencipta konteks palsu untuk memanipulasi mangsa.',
    'Barcodes expose PII; avoid posting travel docs online.': 'Kod bar mendedahkan PII; elakkan menyiarkan dokumen perjalanan dalam talian.'
    , 'Pretexting targets frontline banking roles; never bypass verification workflows.': 'Pretexting menyasarkan peranan barisan hadapan perbankan; jangan sekali‑kali memintas aliran pengesahan.'
    , 'Never share login details; use platform trade systems and MFA.': 'Jangan kongsi butiran log masuk; guna sistem perdagangan dalam platform dan MFA.'
    , 'Authorities do not demand payments over calls; verify independently.': 'Pihak berkuasa tidak menuntut bayaran melalui panggilan; sahkan secara berasingan.'
    , 'Guaranteed high returns are hallmark of fraud.': 'Pulangan tinggi yang dijamin ialah ciri penipuan.'
    , 'Insist on platform payments and protections; avoid off-platform transfers.': 'Bertegas dengan pembayaran dalam platform dan perlindungan; elakkan pindahan di luar platform.'
    , 'Scammers build trust over weeks then push fake investments.': 'Penipu membina kepercayaan selama berminggu‑minggu kemudian menggalakkan pelaburan palsu.'
    , 'OTP is the last gate; never disclose it to anyone.': 'OTP ialah pintu terakhir; jangan sekali‑kali dedahkan kepada sesiapa.'
    , 'Overlays intercept credentials and OTPs in banking apps.': 'Lapisan menindih memintas kelayakan dan OTP dalam aplikasi bank.'
    , 'Reused passwords enable stuffing; unique passwords and 2FA help.': 'Kata laluan diguna semula membolehkan serangan stuffing; kata laluan unik dan 2FA membantu.'
    , 'Sharing credentials increases risk of compromise and lockouts.': 'Berkongsi kelayakan meningkatkan risiko kompromi dan terkunci akaun.'
    , 'When something unusual happens to many files at once, think about how computers are connected to each other.': 'Apabila banyak fail tiba‑tiba menjadi luar biasa, fikirkan bagaimana komputer bersambung antara satu sama lain.'
    , 'Personal devices and personal accounts do not follow the same security rules as workplace systems.': 'Peranti dan akaun peribadi tidak mengikut peraturan keselamatan yang sama seperti sistem tempat kerja.'
    , 'Urgency is often used to push people into skipping normal checking steps.': 'Kecemasan sering digunakan untuk mendesak orang melangkau langkah semakan biasa.'
    , 'Not all internet connections offer the same level of protection for your data.': 'Tidak semua sambungan internet menawarkan tahap perlindungan data yang sama.'
    , 'Not every security threat comes through a computer screen.': 'Tidak semua ancaman keselamatan datang melalui skrin komputer.'
    , 'The place where software comes from matters as much as the software itself.': 'Sumber perisian sama pentingnya dengan perisian itu sendiri.'
    , 'Some accounts are more powerful than others and deserve extra protection.': 'Sesetengah akaun lebih berkuasa dan wajar mendapat perlindungan tambahan.'
    , 'Changes in staff status can sometimes increase security risks.': 'Perubahan status kakitangan kadangkala meningkatkan risiko keselamatan.'
    , 'When money grows very fast with little effort, it is worth slowing down and asking how it really works.': 'Apabila wang “bertambah pantas tanpa usaha”, perlahan dan tanyakan bagaimana ia benar‑benar berfungsi.'
    , 'Where an app comes from can tell you a lot about whether it should be trusted.': 'Sumber aplikasi boleh banyak memberitahu tentang kebolehpercayaannya.'
    , 'Not every business that looks professional is allowed to operate legally.': 'Tidak semua perniagaan yang kelihatan profesional dibenarkan beroperasi secara sah.'
    , 'Scammers often focus on building trust before talking about money.': 'Penipu sering membina kepercayaan sebelum menyentuh soal wang.'
    , 'Think about how legitimate lenders usually handle their fees.': 'Fikirkan bagaimana pemberi pinjaman sah biasanya mengenakan yuran.'
    , 'Your bank account is closely tied to your identity and responsibility.': 'Akaun bank anda berkait rapat dengan identiti dan tanggungjawab anda.'
    , 'Sensitive information is rarely needed over a phone call.': 'Maklumat sensitif jarang diperlukan melalui panggilan telefon.'
    , 'People who know you are already stressed may try to take advantage of that situation.': 'Mereka yang tahu anda tertekan mungkin cuba mengambil kesempatan.'
    , 'Government matters usually leave a clear trail that can be checked calmly.': 'Urusan kerajaan biasanya meninggalkan jejak jelas yang boleh disemak dengan tenang.'
    , 'Serious investigations are handled in controlled and traceable ways.': 'Siasatan serius dikendalikan dengan cara terkawal dan boleh dijejaki.'
    , 'The way information is delivered often matters as much as the information itself.': 'Cara maklumat disampaikan sama penting dengan isi maklumat itu.'
    , 'Once personal details are shared, they cannot be taken back.': 'Butiran peribadi sukar ditarik balik setelah dikongsi.'
    , 'Strong emotions can make it hard to think clearly.': 'Emosi kuat menyukarkan pemikiran yang jelas.'
    , 'Small amounts are often used to lower suspicion.': 'Jumlah kecil sering digunakan untuk menurunkan kecurigaan.'
    , 'Legitimate services rarely need to visit homes without prior notice.': 'Perkhidmatan sah jarang perlu datang ke rumah tanpa notis awal.'
    , 'Access to accounts often depends on a single piece of information.': 'Akses akaun sering bergantung pada satu maklumat penting.'
    , 'In legitimate employment arrangements, earnings are linked to completed work, not entry payments.': 'Dalam susunan pekerjaan sah, pendapatan berkait dengan kerja yang siap, bukan bayaran masuk.'
    , 'Employment opportunities involving international travel should always have verifiable and traceable processes.': 'Peluang kerja melibatkan perjalanan antarabangsa harus mempunyai proses boleh sah dan boleh dijejaki.'
    , 'Financial commitments related to housing should only be made after sufficient verification.': 'Komitmen kewangan berkaitan perumahan harus dibuat selepas pengesahan mencukupi.'
    , 'Official organisations maintain consistent communication methods and domains.': 'Organisasi rasmi mengekalkan kaedah komunikasi dan domain yang konsisten.'
    , 'Previously used devices may still retain configurations or software from earlier owners.': 'Peranti terpakai mungkin mengekalkan konfigurasi atau perisian pemilik terdahulu.'
    , 'Consider the standard procedures followed by recognised funding bodies.': 'Pertimbangkan prosedur standard badan pembiayaan yang diiktiraf.'
    , 'Personal data, once shared, may be reused beyond its original purpose.': 'Data peribadi, setelah dikongsi, mungkin digunakan di luar tujuan asal.'
    , 'Understanding the primary source of income is critical when evaluating business models.': 'Memahami sumber pendapatan utama adalah kritikal ketika menilai model perniagaan.'
    , 'Pricing that deviates greatly from market norms often indicates hidden risks.': 'Harga jauh menyimpang daripada norma pasaran sering menandakan risiko terselindung.'
    , 'Unusual access attempts may indicate early signs of account compromise.': 'Cubaan akses luar biasa mungkin tanda awal kompromi akaun.'
    , 'Responding emotionally to threats can increase vulnerability.': 'Respons emosi terhadap ancaman meningkatkan kelemahan.'
    , 'Legitimate promotions do not require account passwords to distribute rewards.': 'Promosi sah tidak memerlukan kata laluan akaun untuk memberi ganjaran.'
    , 'Permissions should match the purpose of the application.': 'Kebenaran aplikasi harus sepadan dengan tujuan aplikasi.'
    , 'Visual proof alone may not accurately reflect financial transactions.': 'Bukti visual sahaja mungkin tidak tepat menggambarkan transaksi kewangan.'
    , 'Physical safeguards can complement digital security controls.': 'Perlindungan fizikal melengkapi kawalan keselamatan digital.'
    , 'One compromised account can affect others if protections are reused.': 'Jika perlindungan diguna semula, satu akaun dikompromi boleh menjejaskan yang lain.'
    , 'Even minor unusual transactions can signal unauthorized access. Think about steps that protect your account immediately.': 'Transaksi kecil yang luar biasa boleh menandakan akses tidak sah; fikirkan langkah untuk lindungi akaun segera.'
    , 'Unexpected downloads may indicate security risks. Consider whether the action matches the intended outcome of scanning a QR code.': 'Muat turun tidak dijangka mungkin menunjukkan risiko; pertimbangkan sama ada tindakan sepadan dengan tujuan mengimbas kod QR.'
    , 'Question requests for sensitive information that deviate from standard security procedures.': 'Pertikaikan permintaan maklumat sensitif yang menyimpang daripada prosedur keselamatan standard.'
    , 'Visual evidence such as screenshots can be manipulated. Consider how to confirm the information reliably.': 'Bukti visual seperti tangkapan skrin boleh dimanipulasi; fikirkan cara mengesahkan maklumat dengan boleh dipercayai.'
    , 'Public charging points may carry hidden data risks. Think about ways to maintain security while charging.': 'Titik pengecasan awam mungkin membawa risiko data tersembunyi; fikirkan cara kekalkan keselamatan semasa mengecas.'
    , 'Consider which authorities are best equipped to handle financial fraud rather than general emergencies.': 'Pertimbangkan pihak berkuasa yang paling sesuai menangani penipuan kewangan berbanding kecemasan umum.'
    , 'Public networks may not be secure. Think about the level of protection needed for sensitive transactions.': 'Rangkaian awam mungkin tidak selamat; fikirkan tahap perlindungan untuk transaksi sensitif.'
    , 'Evaluate whether the source and format of the communication align with official procedures.': 'Nilai sama ada sumber dan format komunikasi selari dengan prosedur rasmi.'
    , 'Consider what actions allow you to check for issues without assuming everything is fine.': 'Pertimbangkan tindakan yang membolehkan semakan masalah tanpa menganggap semuanya baik.'
    , 'Think about why some offers seem “too good to be true.”': 'Fikirkan mengapa sesetengah tawaran “terlalu bagus untuk benar.”'
    , 'Reflect on the broader implications of how such situations could escalate.': 'Renungkan implikasi lebih luas bagaimana situasi sebegini boleh meningkat.'
    , 'Pop-ups pressuring immediate action often indicate scams. Think about whether the message is consistent with legitimate support practices.': 'Pop‑up mendesak tindakan segera sering menandakan penipuan; fikirkan sama ada mesej selaras dengan amalan sokongan sah.'
    , 'Consider how official communications usually reach users.': 'Pertimbangkan bagaimana komunikasi rasmi biasanya sampai kepada pengguna.'
    , 'Public computers can store session data. Think about what information might remain accessible after you finish.': 'Komputer awam boleh menyimpan data sesi; fikirkan maklumat yang mungkin kekal boleh diakses selepas anda selesai.'
    , 'Unsolicited friendly messages can be used to build rapport before exploiting victims. Consider the potential risk.': 'Mesej mesra tanpa diminta boleh digunakan untuk bina hubungan sebelum mengeksploit mangsa; pertimbangkan risiko.'
    , 'Think about what the document is asking you to do and whether it is typical.': 'Fikirkan apa yang dokumen minta anda lakukan dan sama ada ia lazim.'
    , 'Physical security is as important as digital security. Protect your input from observation.': 'Keselamatan fizikal sama penting; lindungi input anda daripada pemerhatian.'
    , 'Think about ways to ensure a charitable request is genuine.': 'Fikirkan cara memastikan permintaan amal adalah tulen.'
    , 'Reflect on how additional software interacts with your information.': 'Renungkan bagaimana perisian tambahan berinteraksi dengan maklumat anda.'
    , 'Biometric data is highly sensitive. Consider the potential consequences of sharing personal data.': 'Data biometrik sangat sensitif; pertimbangkan kesan berkongsi data peribadi.'
  }
};
const qtx = (lang, s) => (textDict[lang] && textDict[lang][s]) ? textDict[lang][s] : tx(lang, s);
const qtipx = (lang, s) => (tipDict[lang] && tipDict[lang][s]) ? tipDict[lang][s] : tt(lang, s);

textDict.zh["After losing money to a scam, someone contacts you claiming they can recover it for a fee. What would you do?"] = "在遭遇骗局损失钱款后，有人联系你并称只需支付费用即可追回。你会怎么做？";
textDict.ms["After losing money to a scam, someone contacts you claiming they can recover it for a fee. What would you do?"] = "Selepas kerugian akibat penipuan, seseorang menghubungi mendakwa boleh memulangkan dengan bayaran. Apa yang anda buat?";
textDict.zh["You receive a call with a recorded message saying it is from a government agency and that you have an urgent issue. It asks you to press a number to continue. What would you do?"] = "你接到带录音的来电，声称来自政府部门并称你有紧急问题，要求按数字继续。你会怎么做？";
textDict.ms["You receive a call with a recorded message saying it is from a government agency and that you have an urgent issue. It asks you to press a number to continue. What would you do?"] = "Anda menerima panggilan mesej rakaman kononnya dari agensi kerajaan dengan isu mendesak, meminta tekan nombor untuk teruskan. Apa yang anda buat?";
textDict.zh["You are concerned about unauthorized webcam access on your laptop. What is the MOST effective protection?"] = "你担心笔记本摄像头被未经授权访问。最有效的防护是什么？";
textDict.ms["You are concerned about unauthorized webcam access on your laptop. What is the MOST effective protection?"] = "Anda bimbang akses kamera web tanpa kebenaran pada komputer riba. Perlindungan PALING berkesan ialah apa?";
textDict.zh["You receive an SMS stating: “You have an outstanding summon. Click here to view details.” How should you handle it?"] = "你收到短信：“你有未处理的传票。点击此处查看详情。”你应如何处理？";
textDict.ms["You receive an SMS stating: “You have an outstanding summon. Click here to view details.” How should you handle it?"] = "Anda menerima SMS: “Anda mempunyai saman tertunggak. Klik di sini untuk lihat butiran.” Bagaimana menanganinya?";
textDict.zh["You use the same password for several online accounts for convenience. What is the most responsible decision?"] = "为了方便你在多个在线账户使用相同密码。最负责任的做法是什么？";
textDict.ms["You use the same password for several online accounts for convenience. What is the most responsible decision?"] = "Untuk kemudahan, anda guna kata laluan sama bagi beberapa akaun. Keputusan paling bertanggungjawab ialah apa?";
textDict.zh["You apply for a loan online. You are told it is approved, but you must pay a fee before receiving the money. What would you do?"] = "你在网上申请贷款。对方称已获批，但在收款前必须支付一笔费用。你会怎么做？";
textDict.ms["You apply for a loan online. You are told it is approved, but you must pay a fee before receiving the money. What would you do?"] = "Anda memohon pinjaman dalam talian. Diberitahu ia diluluskan, tetapi anda perlu bayar yuran sebelum menerima wang. Apa yang anda buat?";
textDict.zh["An agent offers you an overseas customer service position with a high salary, no experience requirement, and travel expenses covered. What is the safest course of action?"] = "一位中介向你提供海外客服职位：高薪、无需经验、差旅费用全包。什么是最安全的做法？";
textDict.ms["An agent offers you an overseas customer service position with a high salary, no experience requirement, and travel expenses covered. What is the safest course of action?"] = "Seorang ejen menawarkan jawatan khidmat pelanggan luar negara dengan gaji tinggi, tanpa pengalaman, dan kos perjalanan ditanggung. Apakah tindakan paling selamat?";
textDict.zh["You receive a message saying your parcel cannot be delivered unless you pay a small fee through a link. What would you do?"] = "你收到一条信息称你的包裹无法派送，需通过链接支付一笔小费用。你会怎么做？";
textDict.ms["You receive a message saying your parcel cannot be delivered unless you pay a small fee through a link. What would you do?"] = "Anda menerima mesej mengatakan bungkusan tidak dapat dihantar melainkan anda membayar yuran kecil melalui pautan. Apa yang anda buat?";
textDict.zh["A person claiming to be from your bank calls and requests the TAC sent to your phone to cancel a recent transaction. How should you respond?"] = "有人自称来自你的银行来电，要求提供手机收到的TAC以取消最近交易。你应如何回应？";
textDict.ms["A person claiming to be from your bank calls and requests the TAC sent to your phone to cancel a recent transaction. How should you respond?"] = "Seseorang mendakwa dari bank anda menelefon dan meminta TAC yang dihantar ke telefon anda untuk membatalkan transaksi baru‑baru ini. Bagaimana anda harus bertindak?";
textDict.zh["You are invited to join a business model that requires an upfront payment and generates income mainly through recruiting new participants. What is the correct assessment?"] = "你被邀请加入一种商业模式，需预付费用，并主要通过招募新参与者获得收入。正确的评估是什么？";
textDict.ms["You are invited to join a business model that requires an upfront payment and generates income mainly through recruiting new participants. What is the correct assessment?"] = "Anda dijemput menyertai model perniagaan yang memerlukan bayaran awal dan menjana pendapatan terutamanya melalui merekrut peserta baharu. Apakah penilaian yang betul?";
textDict.zh["You are invited to participate in an online job that promises daily income through simple digital tasks. After completing several tasks, you are informed that a payment is required to access higher earning opportunities. What is the most appropriate action?"] = "你受邀参加一个线上“工作”，声称通过简单数字任务可每日收入。完成几项任务后，系统告知需支付费用才能获取更高收益机会。最合适的做法是什么？";
textDict.ms["You are invited to participate in an online job that promises daily income through simple digital tasks. After completing several tasks, you are informed that a payment is required to access higher earning opportunities. What is the most appropriate action?"] = "Anda dijemput menyertai kerja dalam talian yang menjanjikan pendapatan harian melalui tugasan digital ringkas. Selepas beberapa tugasan, anda dimaklumkan bahawa bayaran diperlukan untuk akses peluang pendapatan lebih tinggi. Tindakan paling sesuai ialah apa?";
textDict.zh["At a café, you scan a QR code expecting to see the menu, but your device prompts to download an unknown application. What should you do?"] = "在咖啡馆，你扫描二维码想看菜单，但设备提示下载未知应用。你应该怎么做？";
textDict.ms["At a café, you scan a QR code expecting to see the menu, but your device prompts to download an unknown application. What should you do?"] = "Di kafe, anda imbas kod QR untuk melihat menu, tetapi peranti menggesa memuat turun aplikasi tidak diketahui. Apa yang patut anda lakukan?";
textDict.zh["Someone comes to your house claiming they can help resolve a legal or financial issue quickly for a fee. What would you do?"] = "有人上门称可快速解决法律或财务问题，但需付费。你会怎么做？";
textDict.ms["Someone comes to your house claiming they can help resolve a legal or financial issue quickly for a fee. What would you do?"] = "Seseorang datang ke rumah mendakwa boleh menyelesaikan isu undang‑undang atau kewangan dengan cepat dengan bayaran. Apa yang anda buat?";
textDict.zh["You encounter an online seller on a social media platform offering a latest model smartphone at a price significantly lower than the current market value. What is the most accurate assessment of this situation?"] = "你在社交媒体平台遇到一位在线卖家，以远低于当前市场价的价格出售最新款智能手机。对此情形，最准确的评估是什么？";
textDict.ms["You encounter an online seller on a social media platform offering a latest model smartphone at a price significantly lower than the current market value. What is the most accurate assessment of this situation?"] = "Anda menemui penjual dalam talian di platform media sosial menawarkan telefon pintar model terkini pada harga jauh lebih rendah daripada nilai pasaran semasa. Apakah penilaian paling tepat bagi situasi ini?";

// Full coverage for remaining questionnaire texts (zh/ms)
textDict.zh["You need to finish a report that contains MyKad numbers, but you want to work on it over the weekend. Which option feels the safest?"] = "你需要完成一份包含 MyKad 号码的报告，但你想在周末处理它。哪一个选项看起来最安全？";
textDict.ms["You need to finish a report that contains MyKad numbers, but you want to work on it over the weekend. Which option feels the safest?"] = "Anda perlu menyiapkan laporan yang mengandungi nombor MyKad, tetapi anda mahu bekerja pada hujung minggu. Pilihan manakah rasa paling selamat?";

textDict.zh["You receive an email asking you to urgently approve a large payment. The email claims it is from your Director and sounds serious. What would you do next?"] = "你收到一封邮件，要求你紧急批准一笔大额付款。邮件声称来自你的主管且语气严肃。你接下来会怎么做？";
textDict.ms["You receive an email asking you to urgently approve a large payment. The email claims it is from your Director and sounds serious. What would you do next?"] = "Anda menerima emel meminta kelulusan segera untuk pembayaran besar. Emel mendakwa daripada Pengarah anda dan kedengaran serius. Apa tindakan seterusnya?";

textDict.zh["You are working in a cafe and need to access work systems that contain sensitive information. What feels like the safest option?"] = "你在咖啡馆工作，需要访问包含敏感信息的工作系统。哪一个选项看起来最安全？";
textDict.ms["You are working in a cafe and need to access work systems that contain sensitive information. What feels like the safest option?"] = "Anda bekerja di kafe dan perlu mengakses sistem kerja yang mengandungi maklumat sensitif. Pilihan manakah rasa paling selamat?";

textDict.zh["A technician arrives at your office saying he needs to check the server. He looks professional but you were not informed earlier. What would you do?"] = "一名技术人员来到你的办公室称需要检查服务器。他看起来很专业，但你事先未被通知。你会怎么做？";
textDict.ms["A technician arrives at your office saying he needs to check the server. He looks professional but you were not informed earlier. What would you do?"] = "Seorang juruteknik tiba di pejabat anda mengatakan perlu memeriksa pelayan. Dia nampak profesional tetapi anda tidak dimaklumkan lebih awal. Apa yang anda buat?";

textDict.zh["A vendor sends you an email with a link to download an urgent software update from a file sharing site. What is the safest reaction?"] = "某供应商给你发来邮件，附有从文件共享网站下载紧急软件更新的链接。最安全的反应是什么？";
textDict.ms["A vendor sends you an email with a link to download an urgent software update from a file sharing site. What is the safest reaction?"] = "Seorang vendor menghantar emel dengan pautan untuk memuat turun kemas kini perisian mendesak dari laman perkongsian fail. Respons paling selamat ialah apa?";

textDict.zh["You manage an admin account that controls important systems. Which choice sounds the most responsible?"] = "你管理一个可控制重要系统的管理员账户。哪项选择最负责任？";
textDict.ms["You manage an admin account that controls important systems. Which choice sounds the most responsible?"] = "Anda mengurus akaun pentadbir yang mengawal sistem penting. Pilihan manakah paling bertanggungjawab?";

textDict.zh["Someone invites you to invest and says the opportunity is popular and approved in Malaysia. What would you check first?"] = "有人邀请你投资，并称该机会在马来西亚很受欢迎且已获批准。你首先会检查什么？";
textDict.ms["Someone invites you to invest and says the opportunity is popular and approved in Malaysia. What would you check first?"] = "Seseorang menjemput anda untuk melabur dan berkata peluang itu popular dan diluluskan di Malaysia. Apa yang anda periksa dahulu?";

textDict.zh["You are added to a messaging group where people share screenshots of profits. The admin asks everyone to install a trading app using a download link. What would you do?"] = "你被加入一个群聊，成员分享盈利截图。群管理员要求所有人通过下载链接安装一款交易应用。你会怎么做？";
textDict.ms["You are added to a messaging group where people share screenshots of profits. The admin asks everyone to install a trading app using a download link. What would you do?"] = "Anda ditambah ke kumpulan mesej di mana orang berkongsi tangkapan skrin keuntungan. Pentadbir meminta semua orang memasang aplikasi dagangan melalui pautan muat turun. Apa yang anda buat?";

textDict.zh["You have been chatting online with someone for some time. Later, they suggest investing together in a platform they trust. What feels like the safest response?"] = "你与某人在网上聊了一段时间。后来他建议一起在他信任的平台投资。最安全的回应是什么？";
textDict.ms["You have been chatting online with someone for some time. Later, they suggest investing together in a platform they trust. What feels like the safest response?"] = "Anda telah bersembang dalam talian dengan seseorang untuk beberapa waktu. Kemudian mereka mencadangkan melabur bersama dalam platform yang mereka percayai. Respons manakah paling selamat?";

textDict.zh["Someone offers you money each month just to let them use your bank account for transactions. What would you decide?"] = "有人每月付钱，只要你让他使用你的银行账户进行交易。你会如何决定？";
textDict.ms["Someone offers you money each month just to let them use your bank account for transactions. What would you decide?"] = "Seseorang menawarkan wang setiap bulan hanya untuk menggunakan akaun bank anda bagi urus niaga. Apa keputusan anda?";

textDict.zh["You receive a call offering a special financial product. The caller asks for your online banking login details. What would you do?"] = "你接到一个电话，提供一种特别的金融产品。来电者索取你的网银登录信息。你会怎么做？";
textDict.ms["You receive a call offering a special financial product. The caller asks for your online banking login details. What would you do?"] = "Anda menerima panggilan menawarkan produk kewangan khas. Pemanggil meminta butiran log masuk perbankan dalam talian anda. Apa yang anda buat?";

textDict.zh["After losing money to a scam, someone contacts you claiming they can recover it for a fee. What would you do?"] = "在遭遇骗局损失钱款后，有人联系你并称只需支付费用即可追回。你会怎么做？";
textDict.ms["After losing money to a scam, someone contacts you claiming they can recover it for a fee. What would you do?"] = "Selepas kerugian akibat penipuan, seseorang menghubungi mendakwa boleh memulangkan dengan bayaran. Apa yang anda buat?";

textDict.zh["You receive a call with a recorded message saying it is from a government agency and that you have an urgent issue. It asks you to press a number to continue. What would you do?"] = "你接到带录音的来电，声称来自政府部门并称你有紧急问题，要求按数字继续。你会怎么做？";
textDict.ms["You receive a call with a recorded message saying it is from a government agency and that you have an urgent issue. It asks you to press a number to continue. What would you do?"] = "Anda menerima panggilan mesej rakaman kononnya dari agensi kerajaan dengan isu mendesak, meminta tekan nombor untuk teruskan. Apa yang anda buat?";

textDict.zh["A caller claims to be a police officer and says your identity was used in a crime in another state. He asks you to cooperate immediately. What is your next step?"] = "来电者自称警察，说你的身份在另一州的犯罪中被使用，并要求你立刻配合。你的下一步是什么？";
textDict.ms["A caller claims to be a police officer and says your identity was used in a crime in another state. He asks you to cooperate immediately. What is your next step?"] = "Seorang pemanggil mendakwa sebagai pegawai polis dan berkata identiti anda digunakan dalam jenayah di negeri lain. Dia meminta anda bekerjasama segera. Langkah seterusnya?";

textDict.zh["You receive a message showing an arrest notice with your name and official looking logos. What would you most likely do?"] = "你收到一条信息，显示带有你名字与官方标志的逮捕通知。你最可能会怎么做？";
textDict.ms["You receive a message showing an arrest notice with your name and official looking logos. What would you most likely do?"] = "Anda menerima mesej menunjukkan notis tangkapan dengan nama anda dan logo kelihatan rasmi. Apa yang paling mungkin anda lakukan?";

textDict.zh["Someone says they are from the court and asks for your MyKad number to check a case linked to your name. What would you do?"] = "有人称自己来自法院，要求提供你的 MyKad 号码以查询与你名字相关的案件。你会怎么做？";
textDict.ms["Someone says they are from the court and asks for your MyKad number to check a case linked to your name. What would you do?"] = "Seseorang berkata mereka dari mahkamah dan meminta nombor MyKad anda untuk menyemak kes yang dikaitkan dengan nama anda. Apa yang anda buat?";

textDict.zh["You receive a call from someone claiming to be a close family member, sounding panicked and asking for urgent help. What should you do first?"] = "你接到一个电话，对方自称是你亲近的家人，声音慌张并请求紧急帮助。你首先应该做什么？";
textDict.ms["You receive a call from someone claiming to be a close family member, sounding panicked and asking for urgent help. What should you do first?"] = "Anda menerima panggilan daripada seseorang yang mendakwa ahli keluarga rapat, kedengaran panik dan meminta bantuan segera. Apa yang perlu anda lakukan terlebih dahulu?";

textDict.zh["You receive a message saying your parcel cannot be delivered unless you pay a small fee through a link. What would you do?"] = "你收到一条信息称你的包裹无法派送，需通过链接支付一笔小费用。你会怎么做？";
textDict.ms["You receive a message saying your parcel cannot be delivered unless you pay a small fee through a link. What would you do?"] = "Anda menerima mesej mengatakan bungkusan tidak dapat dihantar melainkan anda membayar yuran kecil melalui pautan. Apa yang anda buat?";

textDict.zh["Someone comes to your house claiming they can help resolve a legal or financial issue quickly for a fee. What would you do?"] = "有人上门称可快速解决法律或财务问题，但需付费。你会怎么做？";
textDict.ms["Someone comes to your house claiming they can help resolve a legal or financial issue quickly for a fee. What would you do?"] = "Seseorang datang ke rumah mendakwa boleh menyelesaikan isu undang‑undang atau kewangan dengan cepat dengan bayaran. Apa yang anda buat?";

textDict.zh["A friend messages you asking for a one time password sent to your phone, saying it was sent by mistake. What would you do?"] = "朋友发消息向你索要发送到你手机的一次性密码，称是误发。你会怎么做？";
textDict.ms["A friend messages you asking for a one time password sent to your phone, saying it was sent by mistake. What would you do?"] = "Seorang rakan menghantar mesej meminta kata laluan sekali guna yang dihantar ke telefon anda, katanya tersalah hantar. Apa yang anda buat?";

textDict.zh["You are invited to participate in an online job that promises daily income through simple digital tasks. After completing several tasks, you are informed that a payment is required to access higher earning opportunities. What is the most appropriate action?"] = "你受邀参加一个线上“工作”，声称通过简单数字任务可每日收入。完成几项任务后，被告知需付费才能获得更高收益机会。最合适的做法是什么？";
textDict.ms["You are invited to participate in an online job that promises daily income through simple digital tasks. After completing several tasks, you are informed that a payment is required to access higher earning opportunities. What is the most appropriate action?"] = "Anda dijemput menyertai kerja dalam talian yang menjanjikan pendapatan harian melalui tugasan digital ringkas. Selepas beberapa tugasan, anda dimaklumkan bahawa bayaran diperlukan untuk akses peluang pendapatan lebih tinggi. Tindakan paling sesuai ialah apa?";

textDict.zh["An agent offers you an overseas customer service position with a high salary, no experience requirement, and travel expenses covered. What is the safest course of action?"] = "一位中介向你提供海外客服职位：高薪、无需经验、差旅费用全包。什么是最安全的做法？";
textDict.ms["An agent offers you an overseas customer service position with a high salary, no experience requirement, and travel expenses covered. What is the safest course of action?"] = "Seorang ejen menawarkan jawatan khidmat pelanggan luar negara dengan gaji tinggi, tanpa pengalaman, dan kos perjalanan ditanggung. Apakah tindakan paling selamat?";

textDict.zh["You identify a rental unit near your institution at a significantly lower price than market rate. The owner claims to be overseas and requests a deposit before viewing. What should you do?"] = "你在院校附近发现一个租房价格明显低于市场价。房主称身在海外并要求看房前支付订金。你该怎么办？";
textDict.ms["You identify a rental unit near your institution at a significantly lower price than market rate. The owner claims to be overseas and requests a deposit before viewing. What should you do?"] = "Anda menemui unit sewaan berhampiran institusi pada harga jauh lebih rendah daripada kadar pasaran. Pemilik mendakwa berada di luar negara dan meminta deposit sebelum melihat. Apa yang patut anda lakukan?";

textDict.zh["You receive an email claiming your education loan status requires urgent action and provides a link for login. What is the correct response?"] = "你收到一封邮件称你的教育贷款状态需要紧急处理，并提供登录链接。正确的回应是什么？";
textDict.ms["You receive an email claiming your education loan status requires urgent action and provides a link for login. What is the correct response?"] = "Anda menerima emel mendakwa status pinjaman pendidikan anda memerlukan tindakan segera dan menyediakan pautan untuk log masuk. Respons yang betul ialah apa?";

textDict.zh["After purchasing a pre owned smartphone, you intend to begin using it for personal activities. What should be done first?"] = "购买了一部二手智能手机，准备开始用于个人活动。首先应该做什么？";
textDict.ms["After purchasing a pre owned smartphone, you intend to begin using it for personal activities. What should be done first?"] = "Selepas membeli telefon pintar terpakai, anda mahu mula menggunakannya untuk aktiviti peribadi. Apa yang patut dilakukan terlebih dahulu?";

textDict.zh["You are informed that you have been selected for a guaranteed scholarship, subject to a processing payment. What is the most appropriate response?"] = "你被告知已被选中获得“保证”奖学金，但需支付办理费用。最恰当的做法是什么？";
textDict.ms["You are informed that you have been selected for a guaranteed scholarship, subject to a processing payment. What is the most appropriate response?"] = "Anda dimaklumkan anda telah dipilih untuk biasiswa terjamin, tertakluk kepada bayaran pemprosesan. Apakah tindakan yang paling sesuai?";

textDict.zh["An online job application requests a full copy of your identification document and bank account details during registration. What is the safest decision?"] = "一个线上求职申请在注册时要求提交身份证完整复印件以及银行账户信息。最安全的决定是什么？";
textDict.ms["An online job application requests a full copy of your identification document and bank account details during registration. What is the safest decision?"] = "Permohonan kerja dalam talian meminta salinan penuh dokumen pengenalan dan butiran akaun bank semasa pendaftaran. Keputusan paling selamat ialah apa?";

textDict.zh["You are invited to join a business model that requires an upfront payment and generates income mainly through recruiting new participants. What is the correct assessment?"] = "你被邀请加入一种商业模式，需预付费用，并主要通过招募新参与者获得收入。正确的评估是什么？";
textDict.ms["You are invited to join a business model that requires an upfront payment and generates income mainly through recruiting new participants. What is the correct assessment?"] = "Anda dijemput menyertai model perniagaan yang memerlukan bayaran awal dan menjana pendapatan terutamanya melalui merekrut peserta baharu. Apakah penilaian yang betul?";

textDict.zh["You encounter an online seller on a social media platform offering a latest model smartphone at a price significantly lower than the current market value. What is the most accurate assessment of this situation?"] = "你在社交媒体平台遇到一位在线卖家，以远低于当前市场价的价格出售最新款智能手机。对此情形，最准确的评估是什么？";
textDict.ms["You encounter an online seller on a social media platform offering a latest model smartphone at a price significantly lower than the current market value. What is the most accurate assessment of this situation?"] = "Anda menemui penjual dalam talian di platform media sosial menawarkan telefon pintar model terkini pada harga jauh lebih rendah daripada nilai pasaran semasa. Apakah penilaian paling tepat bagi situasi ini?";

textDict.zh["You receive a notification that someone attempted to log in to your social media account from an unfamiliar location. What should you do first?"] = "你收到通知称有人从不熟悉的位置尝试登录你的社交媒体账户。你首先应该做什么？";
textDict.ms["You receive a notification that someone attempted to log in to your social media account from an unfamiliar location. What should you do first?"] = "Anda menerima notifikasi bahawa seseorang cuba log masuk ke akaun media sosial anda dari lokasi yang tidak dikenali. Apa yang patut anda lakukan terlebih dahulu?";

textDict.zh["An individual you interacted with online threatens to release private content unless payment is made. What is the most appropriate action?"] = "一位你曾在线互动的人威胁称若不付款就公开你的私密内容。最适当的行动是什么？";
textDict.ms["An individual you interacted with online threatens to release private content unless payment is made. What is the most appropriate action?"] = "Seseorang yang anda berinteraksi dalam talian mengugut untuk menyiarkan kandungan peribadi melainkan bayaran dibuat. Tindakan paling sesuai ialah apa?";

textDict.zh["You are tagged in a post claiming that you have won a shopping voucher. The provided link requests you to log in using your social media account credentials. What should you do?"] = "你被标记在一则声称你赢得购物代金券的帖子中，所给链接要求用你的社交媒体账号登录。你该怎么做？";
textDict.ms["You are tagged in a post claiming that you have won a shopping voucher. The provided link requests you to log in using your social media account credentials. What should you do?"] = "Anda ditag dalam satu kiriman yang mendakwa anda menang baucar membeli‑belah. Pautan yang diberi meminta anda log masuk menggunakan kelayakan akaun media sosial. Apa yang patut anda buat?";

textDict.zh["A mobile application requests access to your contacts, photos, and location, even though these features are not clearly related to its function. What is the most appropriate action?"] = "某移动应用请求访问你的联系人、照片和位置，即便这些与其功能并不明显相关。最适当的做法是什么？";
textDict.ms["A mobile application requests access to your contacts, photos, and location, even though these features are not clearly related to its function. What is the most appropriate action?"] = "Satu aplikasi mudah alih meminta akses kepada kenalan, foto, dan lokasi anda, walaupun ciri‑ciri ini tidak jelas berkaitan dengan fungsinya. Tindakan paling sesuai ialah apa?";

textDict.zh["After selling an item online, the buyer sends a screenshot claiming that payment has been completed. Your bank balance does not reflect the transaction. What should you do?"] = "在网上售出物品后，买家发来截图称已完成付款，但你的银行余额未反映该交易。你应该怎么做？";
textDict.ms["After selling an item online, the buyer sends a screenshot claiming that payment has been completed. Your bank balance does not reflect the transaction. What should you do?"] = "Selepas menjual barang dalam talian, pembeli menghantar tangkapan skrin mendakwa pembayaran telah lengkap, tetapi baki bank anda tidak menunjukkan transaksi tersebut. Apa yang patut anda lakukan?";

textDict.zh["You are concerned about unauthorized webcam access on your laptop. What is the MOST effective protection?"] = "你担心笔记本电脑的摄像头被未经授权访问。最有效的防护是什么？";
textDict.ms["You are concerned about unauthorized webcam access on your laptop. What is the MOST effective protection?"] = "Anda bimbang akses kamera web tanpa kebenaran pada komputer riba. Perlindungan PALING berkesan ialah apa?";

textDict.zh["You use the same password for several online accounts for convenience. What is the most responsible decision?"] = "为了方便，你在多个在线账户使用相同密码。最负责任的做法是什么？";
textDict.ms["You use the same password for several online accounts for convenience. What is the most responsible decision?"] = "Untuk kemudahan, anda guna kata laluan sama bagi beberapa akaun. Keputusan paling bertanggungjawab ialah apa?";

textDict.zh["You notice a small, unexpected RM20 debit from your S-Pay Global account, which you did not authorize. What is the most appropriate first step?"] = "你注意到 S‑Pay Global 账户出现一笔意外的 RM20 扣款，这并非你授权。最合适的第一步是什么？";
textDict.ms["You notice a small, unexpected RM20 debit from your S-Pay Global account, which you did not authorize. What is the most appropriate first step?"] = "Anda perasan potongan RM20 kecil dan tidak dijangka daripada akaun S‑Pay Global anda, yang anda tidak sahkan. Langkah pertama yang paling sesuai?";

textDict.zh["At a café, you scan a QR code expecting to see the menu, but your device prompts to download an unknown application. What should you do?"] = "在咖啡馆，你扫描二维码想看菜单，但设备提示下载未知应用。你应该怎么做？";
textDict.ms["At a café, you scan a QR code expecting to see the menu, but your device prompts to download an unknown application. What should you do?"] = "Di kafe, anda imbas kod QR untuk melihat menu, tetapi peranti menggesa memuat turun aplikasi tidak diketahui. Apa yang patut anda lakukan?";

textDict.zh["A person claiming to be from your bank calls and requests the TAC sent to your phone to cancel a recent transaction. How should you respond?"] = "有人自称来自你的银行来电，要求提供手机收到的 TAC 以取消最近交易。你应如何回应？";
textDict.ms["A person claiming to be from your bank calls and requests the TAC sent to your phone to cancel a recent transaction. How should you respond?"] = "Seseorang mendakwa dari bank anda menelefon dan meminta TAC yang dihantar ke telefon anda untuk membatalkan transaksi baru‑baru ini. Bagaimana anda harus bertindak?";

textDict.zh["You receive a screenshot from someone claiming they accidentally transferred RM100 to your e-wallet and ask you to return the amount. What is the most cautious action?"] = "你收到某人发来的截图，称其误将 RM100 转入你的电子钱包，并要求你返还该金额。最谨慎的做法是什么？";
textDict.ms["You receive a screenshot from someone claiming they accidentally transferred RM100 to your e-wallet and ask you to return the amount. What is the most cautious action?"] = "Anda menerima tangkapan skrin daripada seseorang yang mendakwa tersalah pindah RM100 ke e‑dompet anda dan meminta anda memulangkan jumlah itu. Tindakan paling berhati‑hati ialah apa?";

textDict.zh["You need to charge your phone in a public location. Which option reduces the risk of data exposure?"] = "你需要在公共场所给手机充电。哪个选项能降低数据暴露风险？";
textDict.ms["You need to charge your phone in a public location. Which option reduces the risk of data exposure?"] = "Anda perlu mengecas telefon di tempat awam. Pilihan manakah mengurangkan risiko pendedahan data?";

textDict.zh["You realize that a recent transfer was made to a potential scammer. Which is the most appropriate contact to report this situation immediately?"] = "你意识到最近一笔转账可能转给了骗子。应立即联系哪个最合适的机构举报该情况？";
textDict.ms["You realize that a recent transfer was made to a potential scammer. Which is the most appropriate contact to report this situation immediately?"] = "Anda sedar pindahan baru‑baru ini dibuat kepada penipu berpotensi. Pihak mana paling sesuai untuk dilapor segera?";

textDict.zh["You plan to access your online banking account using public Wi-Fi at an airport or café. Which approach is safest?"] = "你计划在机场或咖啡馆使用公共 Wi‑Fi 访问网上银行。哪种做法最安全？";
textDict.ms["You plan to access your online banking account using public Wi-Fi at an airport or café. Which approach is safest?"] = "Anda merancang mengakses perbankan dalam talian menggunakan Wi‑Fi awam di lapangan terbang atau kafe. Pendekatan manakah paling selamat?";

textDict.zh["You receive an SMS stating: “You have an outstanding summon. Click here to view details.” How should you handle it?"] = "你收到短信：“你有未处理的传票。点击此处查看详情。”你应如何处理？";
textDict.ms["You receive an SMS stating: “You have an outstanding summon. Click here to view details.” How should you handle it?"] = "Anda menerima SMS: “Anda mempunyai saman tertunggak. Klik di sini untuk lihat butiran.” Bagaimana menanganinya?";

textDict.zh["Your mobile signal suddenly drops, and you receive an email claiming your SIM card has been replaced without your request. What should you do first?"] = "你的手机信号突然消失，随后收到邮件称你的 SIM 卡在未经你请求的情况下被更换。你首先应该做什么？";
textDict.ms["Your mobile signal suddenly drops, and you receive an email claiming your SIM card has been replaced without your request. What should you do first?"] = "Isyarat telefon anda tiba‑tiba hilang, dan anda menerima emel mendakwa SIM anda telah diganti tanpa permintaan anda. Apa yang perlu anda lakukan dahulu?";

textDict.zh["A fellow gamer offers free in-game currency if you log in to a specific website. What is the safest response?"] = "有玩家称只要登录某网站即可获得免费游戏币。最安全的做法是什么？";
textDict.ms["A fellow gamer offers free in-game currency if you log in to a specific website. What is the safest response?"] = "Seorang pemain menawarkan mata wang dalam permainan percuma jika anda log masuk ke laman web tertentu. Respons paling selamat ialah apa?";

textDict.zh["After using a paid service to complete an assignment, you receive a threat demanding additional payment or they will report you. How should you respond?"] = "在使用付费服务完成作业后，你收到威胁，要求追加付款，否则他们将举报你。你应如何回应？";
textDict.ms["After using a paid service to complete an assignment, you receive a threat demanding additional payment or they will report you. How should you respond?"] = "Selepas menggunakan perkhidmatan berbayar untuk menyiapkan tugasan, anda menerima ugutan menuntut bayaran tambahan atau mereka akan melaporkan anda. Bagaimana anda harus bertindak?";

textDict.zh["Your computer shows a pop-up warning: “Your device is infected. Call Microsoft Support immediately.” What is the safest action?"] = "你的电脑出现弹窗警告：“你的设备已感染。请立即致电 Microsoft 支持。”最安全的做法是什么？";
textDict.ms["Your computer shows a pop-up warning: “Your device is infected. Call Microsoft Support immediately.” What is the safest action?"] = "Komputer anda memaparkan amaran pop‑up: “Peranti anda dijangkiti. Hubungi Sokongan Microsoft segera.” Tindakan paling selamat ialah apa?";

textDict.zh["You receive a message stating that your Touch ’n Go account has been suspended and asks you to click a link. How should you handle this?"] = "你收到信息称你的 Touch ’n Go 账户已被暂停，并要求你点击一个链接。你该如何处理？";
textDict.ms["You receive a message stating that your Touch ’n Go account has been suspended and asks you to click a link. How should you handle this?"] = "Anda menerima mesej menyatakan akaun Touch ’n Go anda telah digantung dan meminta anda klik pautan. Bagaimana hendak menanganinya?";

textDict.zh["After logging into your email on a hotel business center computer, what steps should you take before leaving?"] = "在酒店商务中心的电脑登录邮箱后，离开前你应该采取哪些步骤？";
textDict.ms["After logging into your email on a hotel business center computer, what steps should you take before leaving?"] = "Selepas log masuk emel pada komputer pusat perniagaan hotel, apakah langkah yang patut diambil sebelum beredar?";

textDict.zh["You receive a message: “Hi, is this Mr. Chan? Wrong number, but you seem nice.” What is the safest response?"] = "你收到消息：“嗨，是陈先生吗？拨错了，不过你看起来不错。”最安全的回应是什么？";
textDict.ms["You receive a message: “Hi, is this Mr. Chan? Wrong number, but you seem nice.” What is the safest response?"] = "Anda menerima mesej: “Hai, ini Encik Chan? Salah nombor, tapi anda nampak baik.” Respons paling selamat ialah apa?";

textDict.zh["A Word document asks you to “Enable Content” to view an invoice. How should you respond?"] = "一个 Word 文档要求你“启用内容”才能查看发票。你该如何回应？";
textDict.ms["A Word document asks you to “Enable Content” to view an invoice. How should you respond?"] = "Satu dokumen Word meminta anda “Benarkan Kandungan” untuk melihat invois. Bagaimana anda harus bertindak?";

textDict.zh["Someone stands unusually close while you are entering your ATM PIN. What is the safest action?"] = "你在输入 ATM PIN 时，有人异常靠近。最安全的行为是什么？";
textDict.ms["Someone stands unusually close while you are entering your ATM PIN. What is the safest action?"] = "Seseorang berdiri terlalu hampir ketika anda memasukkan PIN ATM. Tindakan paling selamat ialah apa?";

textDict.zh["You encounter a social media post requesting donations for flood relief, directing contributions to a personal bank account. What should you do?"] = "你看到社交媒体上请求为洪灾救援捐款，并指向个人银行账户。你应该怎么做？";
textDict.ms["You encounter a social media post requesting donations for flood relief, directing contributions to a personal bank account. What should you do?"] = "Anda menemui kiriman media sosial meminta sumbangan untuk bantuan banjir, mengarah sumbangan ke akaun bank peribadi. Apa yang patut anda buat?";

textDict.zh["A website prompts you to install a “coupon finder” browser extension. What should you consider before installing?"] = "某网站提示你安装一个“优惠券查找器”浏览器扩展。安装前你应该考虑什么？";
textDict.ms["A website prompts you to install a “coupon finder” browser extension. What should you consider before installing?"] = "Sebuah laman web meminta anda memasang sambungan pelayar “pencari kupon”. Apa yang patut dipertimbangkan sebelum memasang?";

textDict.zh["An app requests a clear selfie to provide AI face-swap features. What is the safest approach?"] = "某应用请求上传清晰自拍以提供 AI 换脸功能。最安全的做法是什么？";
textDict.ms["An app requests a clear selfie to provide AI face-swap features. What is the safest approach?"] = "Satu aplikasi meminta swafoto jelas untuk menyediakan ciri pertukaran wajah AI. Pendekatan paling selamat ialah apa?";

textDict.zh["You are informed that you have been selected for a guaranteed scholarship, subject to a processing payment. What is the most appropriate response?"] = "你被告知已被选中获得“保证”奖学金，但需支付办理费用。最恰当的做法是什么？";
textDict.ms["You are informed that you have been selected for a guaranteed scholarship, subject to a processing payment. What is the most appropriate response?"] = "Anda dimaklumkan anda telah dipilih untuk biasiswa terjamin, tertakluk kepada bayaran pemprosesan. Apakah tindakan yang paling sesuai?";
textDict.zh["After selling an item online, the buyer sends a screenshot claiming that payment has been completed. Your bank balance does not reflect the transaction. What should you do?"] = "在网上售出物品后，买家发送截图声称已完成付款，但你的银行余额未显示该交易。你应该怎么做？";
textDict.ms["After selling an item online, the buyer sends a screenshot claiming that payment has been completed. Your bank balance does not reflect the transaction. What should you do?"] = "Selepas menjual barang dalam talian, pembeli menghantar tangkapan skrin mendakwa pembayaran telah lengkap, tetapi baki bank anda tidak mencerminkan transaksi. Apa yang patut anda lakukan?";
textDict.zh["You are at work in a government office. Suddenly, shared files cannot be opened and their names look strange. A message appears asking for payment. What would you most likely do first?"] = "你在政府办公室工作时，突然共享文件无法打开且文件名异常，并出现索要付款的消息。你最可能首先做什么？";
textDict.ms["You are at work in a government office. Suddenly, shared files cannot be opened and their names look strange. A message appears asking for payment. What would you most likely do first?"] = "Anda sedang bekerja di pejabat kerajaan. Tiba‑tiba, fail kongsi tidak dapat dibuka dan namanya kelihatan pelik. Muncul mesej meminta bayaran. Apa yang paling mungkin anda buat dahulu?";
textDict.zh["A friend messages you asking for a one time password sent to your phone, saying it was sent by mistake. What would you do?"] = "朋友发消息向你索要发送到你手机的一次性密码，称是误发。你会怎么做？";
textDict.ms["A friend messages you asking for a one time password sent to your phone, saying it was sent by mistake. What would you do?"] = "Seorang rakan menghantar mesej meminta kata laluan sekali guna yang dihantar ke telefon anda, katanya tersalah hantar. Apa yang anda buat?";
textDict.zh["A colleague who just resigned is printing a large number of confidential documents. What would you do?"] = "一位刚辞职的同事正在打印大量机密文件。你会怎么做？";
textDict.ms["A colleague who just resigned is printing a large number of confidential documents. What would you do?"] = "Seorang rakan sekerja yang baru meletak jawatan sedang mencetak sejumlah besar dokumen sulit. Apa yang anda akan lakukan?";
textDict.zh["You receive a call offering a special financial product. The caller asks for your online banking login details. What would you do?"] = "你接到一个电话，提供一种特别的金融产品。来电者索取你的网银登录信息。你会怎么做？";
textDict.ms["You receive a call offering a special financial product. The caller asks for your online banking login details. What would you do?"] = "Anda menerima panggilan menawarkan produk kewangan khas. Pemanggil meminta butiran log masuk perbankan dalam talian anda. Apa yang anda buat?";
textDict.zh["A fellow gamer offers free in-game currency if you log in to a specific website. What is the safest response?"] = "有玩家称只要登录某网站即可获得免费游戏币。最安全的做法是什么？";
textDict.ms["A fellow gamer offers free in-game currency if you log in to a specific website. What is the safest response?"] = "Seorang pemain menawarkan mata wang dalam permainan percuma jika anda log masuk ke laman web tertentu. Respons paling selamat ialah apa?";
textDict.zh["You receive a call from someone claiming to be a close family member, sounding panicked and asking for urgent help. What should you do first?"] = "你接到一个电话，对方自称是你亲近的家人，声音慌张并请求紧急帮助。你首先应该做什么？";
textDict.ms["You receive a call from someone claiming to be a close family member, sounding panicked and asking for urgent help. What should you do first?"] = "Anda menerima panggilan daripada seseorang yang mendakwa ahli keluarga rapat, kedengaran panik dan meminta bantuan segera. Apa yang perlu anda lakukan terlebih dahulu?";
textDict.zh["Which option feels the safest?"] = "哪一个选项看起来最安全？";
textDict.ms["Which option feels the safest?"] = "Pilihan manakah rasa paling selamat?";
textDict.zh["Which approach is safest?"] = "哪种做法最安全？";
textDict.ms["Which approach is safest?"] = "Pendekatan manakah paling selamat?";
textDict.zh["You receive a notification that someone attempted to log in to your social media account from an unfamiliar location. What should you do first?"] = "你收到通知称有人从陌生地点尝试登录你的社交媒体账户。你首先应该做什么？";
textDict.ms["You receive a notification that someone attempted to log in to your social media account from an unfamiliar location. What should you do first?"] = "Anda menerima pemberitahuan bahawa seseorang cuba log masuk ke akaun media sosial anda dari lokasi yang tidak dikenali. Apa yang perlu anda lakukan dahulu?";
textDict.zh["An individual you interacted with online threatens to release private content unless payment is made. What is the most appropriate action?"] = "一名你在网上互动的人威胁若不付款就公开隐私内容。最合适的做法是什么？";
textDict.ms["An individual you interacted with online threatens to release private content unless payment is made. What is the most appropriate action?"] = "Seorang individu yang anda berinteraksi dalam talian mengugut untuk mendedahkan kandungan peribadi kecuali bayaran dibuat. Tindakan paling sesuai ialah apa?";
textDict.zh["You are tagged in a post claiming that you have won a shopping voucher. The provided link requests you to log in using your social media account credentials. What should you do?"] = "你被标记在一则帖子中，称你赢得购物代金券。所提供链接要求使用社交账户凭据登录。你应该怎么做？";
textDict.ms["You are tagged in a post claiming that you have won a shopping voucher. The provided link requests you to log in using your social media account credentials. What should you do?"] = "Nama anda ditanda dalam satu hantaran mendakwa anda menang baucar membeli-belah. Pautan yang diberi meminta anda log masuk menggunakan kelayakan akaun media sosial. Apa yang patut anda buat?";
textDict.zh["After selling an item online, the buyer sends a screenshot claiming that payment has been completed. Your bank balance does not reflect the transaction. What should you do?"] = "你在网上卖出物品后，买家发送截图称付款已完成，但你的银行余额没有体现该交易。你应该怎么做？";
textDict.ms["After selling an item online, the buyer sends a screenshot claiming that payment has been completed. Your bank balance does not reflect the transaction. What should you do?"] = "Selepas menjual barang dalam talian, pembeli menghantar tangkapan skrin mendakwa bayaran telah dibuat. Baki bank anda tidak menunjukkan transaksi tersebut. Apa yang patut anda buat?";
textDict.zh["A mobile application requests access to your contacts, photos, and location, even though these features are not clearly related to its function. What is the most appropriate action?"] = "某移动应用请求访问你的联系人、照片与位置，尽管这些功能与其用途并无明显关联。最合适的做法是什么？";
textDict.ms["A mobile application requests access to your contacts, photos, and location, even though these features are not clearly related to its function. What is the most appropriate action?"] = "Aplikasi mudah alih meminta akses kepada kenalan, gambar dan lokasi anda walaupun ciri tersebut tidak jelas berkaitan dengan fungsinya. Tindakan paling sesuai ialah apa?";
textDict.zh["After logging into your email on a hotel business center computer, what steps should you take before leaving?"] = "在酒店商务中心电脑登录邮箱后，离开前你应该采取哪些步骤？";
textDict.ms["After logging into your email on a hotel business center computer, what steps should you take before leaving?"] = "Selepas log masuk emel pada komputer pusat perniagaan hotel, langkah apa yang perlu diambil sebelum beredar?";
textDict.zh["You receive a message: “Hi, is this Mr. Chan? Wrong number, but you seem nice.” What is the safest response?"] = "你收到消息：“嗨，这是陈先生吗？打错了，但你看起来很友好。”最安全的回应是什么？";
textDict.ms["You receive a message: “Hi, is this Mr. Chan? Wrong number, but you seem nice.” What is the safest response?"] = "Anda menerima mesej: “Hai, adakah ini Encik Chan? Salah nombor, tapi anda nampak baik.” Respons paling selamat ialah apa?";
textDict.zh["A Word document asks you to “Enable Content” to view an invoice. How should you respond?"] = "一个Word文档要求你“启用内容”以查看发票。你应该如何应对？";
textDict.ms["A Word document asks you to “Enable Content” to view an invoice. How should you respond?"] = "Dokumen Word meminta anda “Enable Content” untuk melihat invois. Bagaimana anda patut bertindak?";
textDict.zh["Someone stands unusually close while you are entering your ATM PIN. What is the safest action?"] = "有人在你输入ATM密码时异常靠近。最安全的做法是什么？";
textDict.ms["Someone stands unusually close while you are entering your ATM PIN. What is the safest action?"] = "Seseorang berdiri terlalu rapat ketika anda memasukkan PIN ATM. Tindakan paling selamat ialah apa?";
textDict.zh["You encounter a social media post requesting donations for flood relief, directing contributions to a personal bank account. What should you do?"] = "你在社交媒体看到请求为洪灾救援捐款的帖子，并要求将款项汇入个人银行账户。你应该怎么做？";
textDict.ms["You encounter a social media post requesting donations for flood relief, directing contributions to a personal bank account. What should you do?"] = "Anda menemui hantaran media sosial meminta derma untuk bantuan banjir dan mengarahkan sumbangan ke akaun bank peribadi. Apa yang patut anda buat?";
textDict.zh["A website prompts you to install a “coupon finder” browser extension. What should you consider before installing?"] = "一个网站提示你安装“优惠券搜索器”浏览器扩展。安装前你应该考虑什么？";
textDict.ms["A website prompts you to install a “coupon finder” browser extension. What should you consider before installing?"] = "Sebuah laman web meminta anda memasang ekstensi pelayar “pencari kupon”. Apa yang perlu dipertimbangkan sebelum memasang?";
textDict.zh["An app requests a clear selfie to provide AI face-swap features. What is the safest approach?"] = "某应用要求上传清晰自拍以提供AI换脸功能。最安全的做法是什么？";
textDict.ms["An app requests a clear selfie to provide AI face-swap features. What is the safest approach?"] = "Sebuah aplikasi meminta selfie yang jelas untuk menyediakan ciri AI tukar muka. Pendekatan paling selamat ialah apa?";
// Exact mappings to ensure full translation coverage for frequently shown questions
textDict.zh["Your mobile signal suddenly drops, and you receive an email claiming your SIM card has been replaced without your request. What should you do first?"] = "你的手机信号突然消失，随后收到邮件称你的SIM卡在未经你请求的情况下被更换。你首先应该做什么？";
textDict.ms["Your mobile signal suddenly drops, and you receive an email claiming your SIM card has been replaced without your request. What should you do first?"] = "Isyarat telefon anda tiba‑tiba hilang, dan anda menerima emel mendakwa SIM anda telah diganti tanpa permintaan anda. Apa yang perlu anda lakukan dahulu?";
textDict.zh["You receive an email asking you to urgently approve a large payment. The email claims it is from your Director and sounds serious. What would you do next?"] = "你收到一封邮件，要求你紧急批准一笔大额付款。邮件声称来自你的主管且语气严肃。你接下来会怎么做？";
textDict.ms["You receive an email asking you to urgently approve a large payment. The email claims it is from your Director and sounds serious. What would you do next?"] = "Anda menerima emel meminta kelulusan segera untuk pembayaran besar. Emel mendakwa daripada Pengarah anda dan kedengaran serius. Apa tindakan seterusnya?";

// Phrase-based translation for option/display texts when no dict entry exists
const otx = (lang, s) => {
  if (!s || lang === 'en') return s;
  if (lang === 'swk') {
    return s
      .replace('Follow instructions to prove innocence', 'Ikut arahan untuk mansaik nadai salah')
      .replace('Ignore it and verify through official offices', 'Abaika lalu ngesahkan ngena pejabat rasmi')
      .replace('Send money immediately', 'Kirim duit lekas')
      .replace('Stay calm and verify through another trusted contact method', 'Bertenang lalu ngesahkan ngena cara dipercayai bukai')
      .replace('Ask where they are', 'Tanya sida di endak')
      .replace('Keep them talking', 'Ngekalkan sida bekereja')
      .replace('Give the number to avoid problems', 'Berika nombor supaya enda ada masalah')
      .replace('Refuse and verify directly with the court', 'Tolak lalu ngesahkan terus ngena mahkamah')
      .replace('Tell them you are busy', 'Madah kitak sibuk')
      .replace('Consider reporting the incident to the proper authorities', 'Peda lapor kejadian nya ke pihak berkuasa patut')
      .replace('Donate immediately', 'Derma lekas')
      .replace('Verify the legitimacy of the request', 'Ngesahkan permintaan nya legit')
      .replace('Share the post', 'Kongsi pos nya')
      .replace('Donate cryptocurrency', 'Derma mata wang kripto')
      .replace('No risk', 'Nada risiko')
      .replace('Extensions may access all browsing data', 'Extension ulih akses semua data pelayaran')
      .replace('Only slows down browser', 'Semina ngenjah pelayar')
      .replace('Safe if popular', 'Selamat mun popular')
      .replace('Restart the computer and see if it goes back to normal', 'Mula semula komputer lalu meda mun kembali normal')
      .replace('Disconnect the computer from the network immediately', 'Putus sambungan komputer ari rangkaian terus')
      .replace('Ask colleagues if they have the same problem', 'Tanya rakan sekerja mun sida ada masalah sama')
      .replace('Try to delete the message and continue working', 'Cuba padam mesej lalu neruska bekereja')
      .replace('Copy the file to your personal USB drive', 'Salin fail ke USB peribadi kitak')
      .replace('Upload it to your personal cloud storage', 'Muat naik ke storan awan peribadi kitak')
      .replace('Access the file through the official system or approved VPN', 'Akses fail ngena sistem rasmi atau VPN dilulus')
      .replace('Email the file to yourself', 'Emel fail nya ke diri kitak')
      .replace('Approve it quickly to avoid problems', 'Lulus cepat supaya nadai masalah')
      .replace('Contact the Director through a known phone number or office channel', 'Hubungi Pengarah ngena nombor/ saluran opis ti dikenali')
      .replace('Reply to the email asking for more details', 'Balas emel minta butir lebih')
      .replace('Wait and see if another email comes', 'Tunggu lalu meda mun ada emel bukai')
      .replace('Use private browsing mode on the browser', 'Guna mod pelayaran peribadi')
      .replace('Use the free WiFi provided by the cafe', 'Guna Wi‑Fi percuma disediaka kafe')
      .replace('Use a company approved VPN before accessing work systems', 'Guna VPN syarikat dilulus sebelum akses sistem kerja')
      .replace('Ask the cafe staff if the WiFi is safe', 'Tanya staff kafe mun Wi‑Fi nya selamat')
      .replace('Let him in since he looks legitimate', 'Benarka masuk laban nampak sah')
      .replace('Ask him to wait while you verify his visit with management or the vendor', 'Minta nya nunggu sementara kitak ngesahkan ngena pengurusan atau vendor')
      .replace('Allow him in but stay nearby', 'Benarka masuk tapi tetak dekat')
      .replace('Ask him to sign the visitor book and proceed', 'Minta tandatangan buku pelawat lalu neruska')
      .replace('Install it quickly to avoid issues', 'Pasang cepat supaya nadai masalah')
      .replace('Scan it with antivirus software first', 'Imbas ngena antivirus dulu')
      .replace('Download updates only from the official vendor website', 'Muat turun kemas kini ari laman vendor rasmi aja')
      .replace('Install it on a spare computer', 'Pasang di komputer simpanan')
      .replace('Use an easy password so it is not forgotten', 'Guna kata laluan senang supaya nadai terlupa')
      .replace('Use a long passphrase and an extra verification step', 'Guna frasa laluan panjang enggau langkah pengesahan tambahan')
      .replace('Write the password down and store it safely', 'Tulis kata laluan lalu simpan nyaman')
      .replace('Reuse the same password as your email', 'Guna semula kata laluan ti sama kedak emel')
      .replace('Try investing a small amount first', 'Cuba melabur jumlah kecik dulu')
      .replace('Avoid it because it sounds unrealistic', 'Elak laban kedak nadai realistik')
      .replace('Ask the person promoting it for more details', 'Tanya orang ti mempromosi minta butir lebih')
      .replace('Share it with friends to ask their opinion', 'Kongsi ngena kawan minta pandangan')
      .replace('Provide details to complete the process', 'Berika butir untuk nyelesai proses')
      .replace('Ask for the caller staff information', 'Tanya maklumat kakitangan pemanggil')
      .replace('Visit the bank later to ask', 'Pergi bank kemudian untuk bertanya')
      .replace('End the call and not share any login details', 'Tamatka panggilan lalu nadai berkongsi butir login')
      .replace('Pay the fee and hope it works', 'Bayar yuran lalu ngarap berhasil')
      .replace('Ignore the offer', 'Abaika tawaran')
      .replace('Ask them how they do it', 'Tanya baka mana sida buat')
      .replace('Share your situation with them', 'Kongsi keadaan kitak ngena sida')
      .replace('Press the number to find out more', 'Tekan nombor untuk tau lebih')
      .replace('Hang up and check official contact channels later', 'Letak telefon lalu semak saluran rasmi kemudian')
      .replace('Call the number back immediately', 'Kelia nombor nya lekas')
      .replace('Wait on the line', 'Tunggu di talian')
      .replace('Use a physical webcam cover when not in use', 'Guna penutup kamera fizikal mun nadai diguna')
      .replace('Uninstall camera drivers', 'Nyahpasang driver kamera')
      .replace('Turn off the monitor', 'Tutup monitor')
      .replace('Ignore the risk', 'Abaika risiko')
      .replace('Click the link to verify the summon', 'Klik pautan untuk ngesahkan saman')
      .replace('Ignore the message', 'Abaika mesej')
      .replace('Reply to request more information', 'Balas minta maklumat lebih')
      .replace('Call the number listed in the message', 'Hubungi nombor dalam mesej')
      .replace('Refund the money immediately', 'Pulang duit lekas')
      .replace('Verify your actual account balance before taking any steps', 'Ngesahkan baki akaun betul sebelum ngambi apa‑apa langkah')
      .replace('Block the sender without verifying the claim', 'Sekat pengirim tanpa ngesahkan tuntutan')
      .replace('Leave the funds untouched without checking your account', 'Empe duit nya nadai dipelawa tanpa mansaik akaun')
      .replace('Ignore the alert since no harm occurred', 'Abaika amaran laban nadai masalah berlakunya')
      .replace('Change your password and review account security settings', 'Tukar kata laluan lalu semak seting keselamatan akaun')
      .replace('Post online to ask if others experienced the same issue', 'Pos online nanya mun orang bukai alami hal sama')
      .replace('Wait to see if another alert appears', 'Tunggu mun ada amaran bukai muncul')
      .replace('Make the payment to increase earning potential', 'Bayar untuk nambah potensi pendapatan')
      .replace('Discontinue participation and exit the scheme', 'Berenti nyereta lalu ninggal skim nya')
      .replace('Request clarification on why payment is required', 'Minta penjelasan ngapa perlu bayar')
      .replace('Ask when accumulated earnings can be withdrawn', 'Tanya bila pendapatan terkumpul boleh dikeluarka')
      .replace('Proceed with the download to identify its content', 'Terus muat turun untuk ngenal isi')
      .replace('Cancel the download to avoid installing applications from unverified sources', 'Batal muat turun supaya enda masang aplikasi ari sumber nadai disahkan')
      .replace('Open the downloaded file cautiously to inspect the contents', 'Buka fail dimuat turun ngena ati‑ati untuk mansaik isi')
      .replace('Share the code to complete the transaction quickly', 'Kongsi kod untuk nyelesai transaksi lekas')
      .replace('Decline to provide the code', 'Tolak berika kod')
      .replace('Read the code carefully to verify the caller’s intentions', 'Bacha kod ati‑ati untuk ngesahkan tujuan pemanggil')
      .replace('Ask the caller to provide official identification before proceeding', 'Minta pemanggil berika pengenalan rasmi sebelum neruska')
      .replace('Log in to claim the reward', 'Log masuk untuk ngaku ganjaran')
      .replace('Exit the page without providing any login information', 'Keluar ari laman tanpa berika apa‑apa maklumat login')
      .replace('Enter an incorrect password to test the site', 'Masuk kata laluan salah untuk nguji laman')
      .replace('Share the post with others', 'Kongsi pos nya ngena orang bukai')
      .replace('Use the Wi-Fi network if the session is brief', 'Guna rangkaian Wi‑Fi mun sesi nya pendek')
      .replace('Prefer using mobile data', 'Lebih suka ngguna data mudah alih')
      .replace('Enable private browsing mode while using public Wi-Fi', 'Dayaka mod pelayaran peribadi masa ngguna Wi‑Fi awam')
      .replace('Connect only if the network is password-protected', 'Sambung semina mun rangkaian dilindung ngena kata laluan')
      .replace('Proceed to ship the item', 'Terus bungkus barang nya')
      .replace('Verify the transaction directly through official banking channels', 'Ngesahkan transaksi terus ngena saluran perbankan rasmi')
      .replace('Accept the screenshot as proof of payment', 'Terima tangkapan skrin nya sebagai bukti bayaran')
      .replace('Request an additional screenshot', 'Minta tangkapan skrin tambahan')
      .replace('Insert a SIM card and begin use', 'Masuk kad SIM lalu mula ngguna')
      .replace('Perform a complete factory reset', 'Buat tetapan semula kilang penuh')
      .replace('Change the lock screen and password', 'Tukar skrin kunci enggau kata laluan')
      .replace('Remove unfamiliar applications', 'Buang aplikasi nadai dikenali')
      .replace('Proceed with the purchase before the item sells out', 'Terus beli sebelum barang abis')
      .replace('Conclude that the offer is likely fraudulent due to unrealistic pricing', 'Simpulka tawaran nya berkemungkinan penipuan laban harga nadai realistik')
      .replace('Request additional product photos from the seller', 'Minta gambar produk tambahan ari penjual')
      .replace('Evaluate the seller follower count and engagement', 'Nilai bilangan pengikut enggau penglibatan penjual')
      ;
  }
  if (lang === 'zh') {
    return s
      .replace('Follow instructions to prove innocence', '按照指示以证明清白')
      .replace('Ignore it and verify through official offices', '忽略，并通过官方部门核实')
      .replace('Send money immediately', '立即汇款')
      .replace('Stay calm and verify through another trusted contact method', '保持冷静，并通过其他可信方式核实')
      .replace('Ask where they are', '询问他们在哪里')
      .replace('Keep them talking', '与其保持通话')
      .replace('Give the number to avoid problems', '提供号码以避免麻烦')
      .replace('Refuse and verify directly with the court', '拒绝并直接与法院核实')
      .replace('Tell them you are busy', '告诉他们你很忙')
      .replace('Consider reporting the incident to the proper authorities', '考虑向相关部门举报')
      .replace('Donate immediately', '立即捐款')
      .replace('Verify the legitimacy of the request', '核实请求的合法性')
      .replace('Share the post', '分享该帖子')
      .replace('Donate cryptocurrency', '捐赠加密货币')
      .replace('No risk', '没有风险')
      .replace('Extensions may access all browsing data', '扩展可能访问所有浏览数据')
      .replace('Only slows down browser', '只会让浏览器变慢')
      .replace('Safe if popular', '如果很受欢迎则安全')
      .replace('Avoid installing apps from unknown links', '避免通过未知链接安装应用')
      .replace('Install it to see how the app works', '安装看看应用如何运作')
      .replace('Install it on an old or unused phone', '安装到旧机或不常用的手机上')
      .replace('Ask others in the group if it is safe', '询问群里其他人是否安全')
      .replace('End the call and not share any login details', '结束通话且不提供任何登录信息')
      .replace('Proceed with the purchase before the item sells out', '在售罄之前尽快购买')
      .replace('Conclude that the offer is likely fraudulent due to unrealistic pricing', '认为该报价因价格不切实际而很可能为骗局')
      .replace('Request additional product photos from the seller', '向卖家索取更多产品照片')
      .replace('Evaluate the seller follower count and engagement', '查看卖家的粉丝数量与互动情况')
      .replace('Ignore it and check through official delivery platforms', '忽略，并通过官方配送平台核实')
      .replace('Call the number provided', '拨打提供的号码')
      .replace('Reply to the message', '回复该信息')
      .replace('Pay the fee since it is a small amount', '因为金额不大而支付费用')
      .replace('Decline to provide the code', '拒绝提供该验证码')
      .replace('Share the code to complete the transaction quickly', '为尽快完成交易而提供验证码')
      .replace('Read the code carefully to verify the caller’s intentions', '仔细读取验证码以核实来电者意图')
      .replace('Ask the caller to provide official identification before proceeding', '要求来电者提供官方身份证明后再继续')
      .replace('Decide not to participate', '决定不参与')
      .replace('Request a detailed explanation of earnings', '要求详细说明收益来源')
      .replace('Join early to maximise potential returns', '尽早加入以最大化回报')
      .replace('Participate on a trial basis', '以试用方式参与')
      .replace('Restart the computer and see if it goes back to normal', '重启电脑看看是否恢复正常')
      .replace('Disconnect the computer from the network immediately', '立即将电脑断网')
      .replace('Ask colleagues if they have the same problem', '询问同事是否也有同样问题')
      .replace('Try to delete the message and continue working', '尝试删除该信息并继续工作')
      .replace('Copy the file to your personal USB drive', '将文件复制到你的个人U盘')
      .replace('Upload it to your personal cloud storage', '上传到你的个人云存储')
      .replace('Access the file through the official system or approved VPN', '通过官方系统或经批准的VPN访问文件')
      .replace('Email the file to yourself', '把文件发邮件给自己')
      .replace('Approve it quickly to avoid problems', '为了避免麻烦，尽快批准')
      .replace('Contact the Director through a known phone number or office channel', '通过已知电话号码或办公渠道联系主管')
      .replace('Reply to the email asking for more details', '回复邮件索取更多细节')
      .replace('Wait and see if another email comes', '等待看看是否还有其他邮件')
      .replace('Use private browsing mode on the browser', '使用浏览器的隐私/无痕模式')
      .replace('Use the free WiFi provided by the cafe', '使用咖啡店提供的免费Wi‑Fi')
      .replace('Use a company approved VPN before accessing work systems', '访问工作系统前使用公司批准的VPN')
      .replace('Ask the cafe staff if the WiFi is safe', '询问咖啡店员工该Wi‑Fi是否安全')
      .replace('Let him in since he looks legitimate', '看起来正规就让他进入')
      .replace('Ask him to wait while you verify his visit with management or the vendor', '请其等待，同时向管理层或厂商核实来访')
      .replace('Allow him in but stay nearby', '允许进入但在旁监督')
      .replace('Ask him to sign the visitor book and proceed', '让其签访客簿后继续')
      .replace('Install it quickly to avoid issues', '立刻安装以避免问题')
      .replace('Scan it with antivirus software first', '先用杀毒软件扫描')
      .replace('Download updates only from the official vendor website', '仅从官方厂商网站下载更新')
      .replace('Install it on a spare computer', '先在备用电脑上安装测试')
      .replace('Use an easy password so it is not forgotten', '使用容易的密码以免忘记')
      .replace('Use a long passphrase and an extra verification step', '使用较长口令并启用额外验证步骤')
      .replace('Write the password down and store it safely', '写下密码并安全保存')
      .replace('Reuse the same password as your email', '重复使用与邮箱相同的密码')
      .replace('Avoid it because it sounds unrealistic', '避免，因为听起来不真实')
      .replace('Try investing a small amount first', '先小额尝试')
      .replace('Ask the person promoting it for more details', '向推广者询问更多细节')
      .replace('Share it with friends to ask their opinion', '发给朋友征求意见')
      .replace('Give the details to complete the process', '提供信息以完成流程')
      .replace('Ask for the caller staff information', '询问来电者的员工信息')
      .replace('Visit the bank later to ask', '稍后到银行咨询')
      .replace('Ask for official identification before continuing', '要求对方提供官方身份证明后再继续')
      .replace('Share your situation with them', '向他们说明你的情况')
      .replace('Pay the fee and hope it works', '支付费用并寄望有效')
      .replace('Ask them how they do it', '询问他们如何操作')
      .replace('Ignore the offer', '忽略该提议')
      .replace('Press the number to find out more', '按下数字以了解更多')
      .replace('Hang up and check official contact channels later', '挂断并稍后通过官方渠道核实')
      .replace('Call the number back immediately', '立即回拨该号码')
      .replace('Wait on the line', '在线等待')
      .replace('Use a physical webcam cover when not in use', '未使用时使用摄像头物理遮挡')
      .replace('Uninstall camera drivers', '卸载摄像头驱动')
      .replace('Turn off the monitor', '关闭显示器')
      .replace('Ignore the risk', '忽略风险')
      .replace('Click the link to verify the summon', '点击链接以验证传票')
      .replace('Ignore the message', '忽略该信息')
      .replace('Reply to request more information', '回复以索取更多信息')
      .replace('Call the number listed in the message', '拨打短信中的号码')
      .replace('Continue using the same password to avoid forgetting', '继续使用相同密码以免忘记')
      .replace('Change passwords gradually for important accounts', '逐步为重要账户更改密码')
      .replace('Share the password with a trusted person', '与可信的人共享密码')
      .replace('Walk away from the offer', '放弃该提议')
      .replace('Ask for a written agreement', '要求书面协议')
      .replace('Pay the fee so the loan can be released', '支付费用以发放贷款')
      .replace('Ask if the fee can be paid later', '询问是否可以稍后支付该费用')
      .replace('Accept the offer immediately to secure the position', '为确保职位，立即接受该邀请')
      .replace('Verify the offer through official government or diplomatic channels', '通过政府或外交渠道核实该邀请')
      .replace('Request details about accommodation and working conditions', '索取住宿与工作条件的详细信息')
      .replace('Ask if friends can apply together', '询问朋友是否可一起申请')
      ;
  }
  if (lang === 'ms') {
    return s
      .replace('Follow instructions to prove innocence', 'Ikut arahan untuk membuktikan tidak bersalah')
      .replace('Ignore it and verify through official offices', 'Abaikan dan sahkan melalui pejabat rasmi')
      .replace('Send money immediately', 'Hantar wang segera')
      .replace('Stay calm and verify through another trusted contact method', 'Bertenang dan sahkan melalui kaedah hubungan dipercayai yang lain')
      .replace('Ask where they are', 'Tanya di mana mereka berada')
      .replace('Keep them talking', 'Teruskan berbual dengan mereka')
      .replace('Give the number to avoid problems', 'Berikan nombor untuk elak masalah')
      .replace('Refuse and verify directly with the court', 'Tolak dan sahkan terus dengan mahkamah')
      .replace('Tell them you are busy', 'Beritahu mereka anda sibuk')
      .replace('Consider reporting the incident to the proper authorities', 'Pertimbangkan untuk melaporkan kepada pihak berkuasa yang sesuai')
      .replace('Donate immediately', 'Derma segera')
      .replace('Verify the legitimacy of the request', 'Sahkan kesahihan permintaan tersebut')
      .replace('Share the post', 'Kongsi hantaran tersebut')
      .replace('Donate cryptocurrency', 'Derma mata wang kripto')
      .replace('No risk', 'Tiada risiko')
      .replace('Extensions may access all browsing data', 'Ekstensi mungkin mengakses semua data pelayaran')
      .replace('Only slows down browser', 'Hanya melambatkan pelayar')
      .replace('Safe if popular', 'Selamat jika popular')
      .replace('Avoid installing apps from unknown links', 'Elakkan memasang aplikasi daripada pautan tidak diketahui')
      .replace('Install it to see how the app works', 'Pasang untuk lihat bagaimana aplikasi berfungsi')
      .replace('Install it on an old or unused phone', 'Pasang pada telefon lama atau tidak digunakan')
      .replace('Ask others in the group if it is safe', 'Tanya ahli kumpulan lain sama ada ia selamat')
      .replace('End the call and not share any login details', 'Tamatkan panggilan dan jangan kongsi sebarang butiran log masuk')
      .replace('Proceed with the purchase before the item sells out', 'Teruskan pembelian sebelum barang habis dijual')
      .replace('Conclude that the offer is likely fraudulent due to unrealistic pricing', 'Simpulkan tawaran berkemungkinan penipuan kerana harga tidak realistik')
      .replace('Request additional product photos from the seller', 'Minta gambar produk tambahan daripada penjual')
      .replace('Evaluate the seller follower count and engagement', 'Nilai bilangan pengikut dan keterlibatan penjual')
      .replace('Ignore it and check through official delivery platforms', 'Abaikan dan semak melalui platform penghantaran rasmi')
      .replace('Call the number provided', 'Hubungi nombor yang diberikan')
      .replace('Reply to the message', 'Balas mesej tersebut')
      .replace('Pay the fee since it is a small amount', 'Bayar yuran kerana jumlahnya kecil')
      .replace('Decline to provide the code', 'Tolak untuk memberikan kod')
      .replace('Share the code to complete the transaction quickly', 'Kongsi kod untuk menyiapkan transaksi dengan cepat')
      .replace('Read the code carefully to verify the caller’s intentions', 'Baca kod dengan teliti untuk mengesahkan niat pemanggil')
      .replace('Ask the caller to provide official identification before proceeding', 'Minta pemanggil memberikan pengenalan rasmi sebelum meneruskan')
      .replace('Decide not to participate', 'Putuskan untuk tidak menyertai')
      .replace('Request a detailed explanation of earnings', 'Minta penjelasan terperinci tentang pendapatan')
      .replace('Join early to maximise potential returns', 'Sertai awal untuk memaksimumkan pulangan')
      .replace('Participate on a trial basis', 'Sertai secara percubaan')
      .replace('Restart the computer and see if it goes back to normal', 'Mulakan semula komputer dan lihat jika kembali normal')
      .replace('Disconnect the computer from the network immediately', 'Putuskan sambungan komputer daripada rangkaian serta‑merta')
      .replace('Ask colleagues if they have the same problem', 'Tanya rakan sekerja jika mereka alami masalah yang sama')
      .replace('Try to delete the message and continue working', 'Cuba padam mesej dan teruskan bekerja')
      .replace('Copy the file to your personal USB drive', 'Salin fail ke pemacu USB peribadi anda')
      .replace('Upload it to your personal cloud storage', 'Muat naik ke storan awan peribadi anda')
      .replace('Access the file through the official system or approved VPN', 'Akses fail melalui sistem rasmi atau VPN yang diluluskan')
      .replace('Email the file to yourself', 'Emelkan fail kepada diri sendiri')
      .replace('Approve it quickly to avoid problems', 'Luluskan segera untuk elak masalah')
      .replace('Contact the Director through a known phone number or office channel', 'Hubungi Pengarah melalui nombor telefon atau saluran pejabat yang diketahui')
      .replace('Reply to the email asking for more details', 'Balas emel untuk minta maklumat lanjut')
      .replace('Wait and see if another email comes', 'Tunggu dan lihat jika ada emel lain')
      .replace('Use private browsing mode on the browser', 'Guna mod pelayaran peribadi')
      .replace('Use the free WiFi provided by the cafe', 'Guna Wi‑Fi percuma yang disediakan kafe')
      .replace('Use a company approved VPN before accessing work systems', 'Guna VPN yang diluluskan syarikat sebelum akses sistem kerja')
      .replace('Ask the cafe staff if the WiFi is safe', 'Tanya kakitangan kafe sama ada Wi‑Fi selamat')
      .replace('Let him in since he looks legitimate', 'Benarkan masuk kerana nampak sah')
      .replace('Ask him to wait while you verify his visit with management or the vendor', 'Minta tunggu sementara anda sahkan dengan pengurusan atau vendor')
      .replace('Allow him in but stay nearby', 'Benarkan masuk tetapi berada berdekatan')
      .replace('Ask him to sign the visitor book and proceed', 'Minta tandatangan buku pelawat dan teruskan')
      .replace('Install it quickly to avoid issues', 'Pasang segera untuk elak masalah')
      .replace('Scan it with antivirus software first', 'Imbas dengan antivirus dahulu')
      .replace('Download updates only from the official vendor website', 'Muat turun kemas kini hanya dari laman vendor rasmi')
      .replace('Install it on a spare computer', 'Pasang pada komputer simpanan')
      .replace('Use an easy password so it is not forgotten', 'Guna kata laluan mudah supaya tidak lupa')
      .replace('Use a long passphrase and an extra verification step', 'Guna frasa laluan panjang dan langkah pengesahan tambahan')
      .replace('Write the password down and store it safely', 'Tulis kata laluan dan simpan dengan selamat')
      .replace('Reuse the same password as your email', 'Guna semula kata laluan yang sama seperti emel')
      .replace('Avoid it because it sounds unrealistic', 'Elakkan sebab kedengaran tidak realistik')
      .replace('Try investing a small amount first', 'Cuba labur jumlah kecil dahulu')
      .replace('Ask the person promoting it for more details', 'Tanya orang yang mempromosi untuk maklumat lanjut')
      .replace('Share it with friends to ask their opinion', 'Kongsi dengan rakan untuk minta pendapat')
      .replace('Give the details to complete the process', 'Berikan butiran untuk lengkapkan proses')
      .replace('Ask for the caller staff information', 'Tanya maklumat kakitangan pemanggil')
      .replace('Visit the bank later to ask', 'Lawati bank kemudian untuk bertanya')
      .replace('Ask for official identification before continuing', 'Minta pengenalan rasmi sebelum meneruskan')
      .replace('Share your situation with them', 'Kongsikan keadaan anda kepada mereka')
      .replace('Pay the fee and hope it works', 'Bayar yuran dan harap berhasil')
      .replace('Ask them how they do it', 'Tanya bagaimana mereka melakukannya')
      .replace('Ignore the offer', 'Abaikan tawaran')
      .replace('Press the number to find out more', 'Tekan nombor untuk tahu lebih lanjut')
      .replace('Hang up and check official contact channels later', 'Letak telefon dan semak saluran rasmi kemudian')
      .replace('Call the number back immediately', 'Panggil semula nombor itu dengan segera')
      .replace('Wait on the line', 'Tunggu di talian')
      .replace('Use a physical webcam cover when not in use', 'Guna penutup kamera fizikal apabila tidak digunakan')
      .replace('Uninstall camera drivers', 'Nyahpasang pemacu kamera')
      .replace('Turn off the monitor', 'Tutup monitor')
      .replace('Ignore the risk', 'Abaikan risiko')
      .replace('Click the link to verify the summon', 'Klik pautan untuk mengesahkan saman')
      .replace('Ignore the message', 'Abaikan mesej')
      .replace('Reply to request more information', 'Balas untuk minta maklumat lanjut')
      .replace('Call the number listed in the message', 'Hubungi nombor yang tertera dalam mesej')
      .replace('Continue using the same password to avoid forgetting', 'Terus guna kata laluan sama supaya tidak lupa')
      .replace('Change passwords gradually for important accounts', 'Ubah kata laluan secara berperingkat untuk akaun penting')
      .replace('Share the password with a trusted person', 'Kongsi kata laluan dengan orang dipercayai')
      .replace('Walk away from the offer', 'Tolak tawaran')
      .replace('Ask for a written agreement', 'Minta perjanjian bertulis')
      .replace('Pay the fee so the loan can be released', 'Bayar yuran supaya pinjaman boleh dilepaskan')
      .replace('Ask if the fee can be paid later', 'Tanya jika yuran boleh dibayar kemudian')
      .replace('Accept the offer immediately to secure the position', 'Terima tawaran segera untuk pastikan jawatan')
      .replace('Verify the offer through official government or diplomatic channels', 'Sahkan tawaran melalui saluran kerajaan atau diplomatik rasmi')
      .replace('Request details about accommodation and working conditions', 'Minta butiran tentang penginapan dan syarat kerja')
      .replace('Ask if friends can apply together', 'Tanya jika rakan boleh memohon bersama')
      ;
  }
  return s;
};

// Phrase-based translation for common Tip strings
const tt = (lang, s) => {
  if (!s || lang === 'en') return s;
  if (lang === 'swk') {
    return s
      .replace('When something unusual happens to many files at once, think about how computers are connected to each other.', 'Mun banyak fail tiba‑tiba pelik serentak, fikir baka mana komputer berhubung satu sama lain.')
      .replace('Personal devices and personal accounts do not follow the same security rules as workplace systems.', 'Peranti enggau akaun peribadi sik ngikut peraturan keselamatan sama kedak sistem tempat kerja.')
      .replace('Urgency is often used to push people into skipping normal checking steps.', '“Mendesak” selalu diguna ngasuh orang melangkau langkah periksa biasa.')
      .replace('Not all internet connections offer the same level of protection for your data.', 'Sik semua sambungan internet ngasih tahap perlindungan data ti sama.')
      .replace('Not every security threat comes through a computer screen.', 'Sik semua ancaman keselamatan datai ari skrin komputer.')
      .replace('The place where software comes from matters as much as the software itself.', 'Asal perisian penting sama ngena perisian nya empun.')
      .replace('Some accounts are more powerful than others and deserve extra protection.', 'Sebahagian akaun ada kuasa lebih tinggi lalu patut diberi perlindungan tambahan.')
      .replace('Changes in staff status can sometimes increase security risks.', 'Perubahan status kakitangan kadang‑kadang nambah risiko keselamatan.')
      .replace('When money grows very fast with little effort, it is worth slowing down and asking how it really works.', 'Mun duit “nambah laju tanpa usaha”, pelan lalu tanya baka mana iya berjalai sebenarnya.')
      .replace('Where an app comes from can tell you a lot about whether it should be trusted.', 'Asal aplikasi ulih madah sama ada patut dipercayai.')
      .replace('Not every business that looks professional is allowed to operate legally.', 'Sik semua bisnes ti kelihatan profesional dibenarka beroperasi secara sah.')
      .replace('Scammers often focus on building trust before talking about money.', 'Pemipu selalunya mula bina kepercayaan baru nya madah pasal duit.')
      .replace('Think about how legitimate lenders usually handle their fees.', 'Fikir baka mana pemberi pinjam sah biasa nangga yuran.')
      .replace('Your bank account is closely tied to your identity and responsibility.', 'Akaun bank kitak rapat kait ngena identiti enggau tanggungjawab kitak.')
      .replace('Sensitive information is rarely needed over a phone call.', 'Maklumat sensitif jarang perlu liwat panggilan telefon.')
      .replace('People who know you are already stressed may try to take advantage of that situation.', 'Mun sida tau kitak stres, sida ulih ngambi peluang keadaan nya.')
      .replace('Government matters usually leave a clear trail that can be checked calmly.', 'Hal kerajaan biasa ninggal jejak jelas ti boleh disemak dengan tenang.')
      .replace('Serious investigations are handled in controlled and traceable ways.', 'Siasatan serius dikendali ngena cara terkawal enggau ulih dijejak.')
      .replace('The way information is delivered often matters as much as the information itself.', 'Cara maklumat disampi sama penting ngena isi maklumat nya empun.')
      .replace('Once personal details are shared, they cannot be taken back.', 'Butir peribadi sekali udah dikongsi, sukar ditarik balik.')
      .replace('Access to accounts often depends on a single piece of information.', 'Akses akaun kerap bergantung ka siti maklumat penting aja.')
      .replace('In legitimate employment arrangements, earnings are linked to completed work, not entry payments.', 'Dalam pengaturan kerja sah, pendapatan patut kait ngena kerja diselesai, bukai bayaran masuk.')
      .replace('Employment opportunities involving international travel should always have verifiable and traceable processes.', 'Peluang kerja ngelibarka perjalanan antarabangsa patut ada proses ti ulih disah enggau dijejak.')
      .replace('Financial commitments related to housing should only be made after sufficient verification.', 'Komitmen kewangan bekait perumahan patut dibuat lepas pengesahan cukup.')
      .replace('Official organisations maintain consistent communication methods and domains.', 'Organisasi rasmi ngerandau ngena kaedah enggau domain ti konsisten.')
      .replace('Previously used devices may still retain configurations or software from earlier owners.', 'Peranti bekas ulih nyimpan konfigurasi atau perisian ari pemilik terdahulu.')
      .replace('Consider the standard procedures followed by recognised funding bodies.', 'Pikir prosedur standard badan pembiayaan ti diiktiraf.')
      .replace('Personal data, once shared, may be reused beyond its original purpose.', 'Data peribadi, sekali dikongsi, ulih diguna ngagai tujuan bukai.')
      .replace('Understanding the primary source of income is critical when evaluating business models.', 'Ngena paham sumber pendapatan utama penting masa nilai model perniagaan.')
      .replace('Pricing that deviates greatly from market norms often indicates hidden risks.', 'Harga ti jauh nyimpang ari norma pasaran sering nunjuk risiko terselindung.')
      .replace('Unusual access attempts may indicate early signs of account compromise.', 'Cubaan akses luar biasa ulih jadi tanda awal akaun terkompromi.')
      .replace('Responding emotionally to threats can increase vulnerability.', 'Respons emosi ngagai ancaman ulih nambah kelemahan.')
      .replace('Legitimate promotions do not require account passwords to distribute rewards.', 'Promosi sah nadai minta kata laluan akaun untuk meri ganjaran.')
      .replace('Permissions should match the purpose of the application.', 'Kebenaran aplikasi patut selaras ngena tujuan aplikasi.')
      .replace('Visual proof alone may not accurately reflect financial transactions. Consider how to confirm the information reliably.', 'Bukti visual aja mungkin enda tepat nunjuk transaksi kewangan; fikir baka mana ngesah maklumat dengan boleh dipercayai.')
      .replace('Physical safeguards can complement digital security controls.', 'Perlindungan fizikal ulih nambah kawalan keselamatan digital.')
      .replace('One compromised account can affect others if protections are reused.', 'Mun perlindungan diguna semula, siti akaun terkompromi ulih ngaruh akaun bukai.')
      .replace('Even minor unusual transactions can signal unauthorized access. Think about steps that protect your account immediately.', 'Transaksi kecik ti luar biasa ulih tanda akses nadai disah; fikir langkah ngamalka akaun terus.')
      .replace('Unexpected downloads may indicate security risks. Consider whether the action matches the intended outcome of scanning a QR code.', 'Muat turun ti nadai dijangka ulih ngisa risiko keselamatan; fikir mun tindakan nya selaras ngena tujuan ngimbas kod QR.')
      .replace('Question requests for sensitive information that deviate from standard security procedures.', 'Pertikai pemintaan maklumat sensitif ti nyimpang ari prosedur keselamatan standard.')
      .replace('Visual evidence such as screenshots can be manipulated. Consider how to confirm the information reliably.', 'Bukti visual kedak tangkapan skrin ulih dipermainkan; fikir baka mana ngesah maklumat dengan boleh dipercayai.')
      .replace('Public charging points may carry hidden data risks. Think about ways to maintain security while charging.', 'Titik ngecas awam ulih ngandung risiko data tersembunyi; fikir cara kekal selamat masa ngecas.')
      .replace('Consider which authorities are best equipped to handle financial fraud rather than general emergencies.', 'Pertimbangka pihak ti paling nyamai nangani penipuan kewangan, bukai kecemasan umum.')
      .replace('Public networks may not be secure. Think about the level of protection needed for sensitive transactions.', 'Rangkaian awam mungkin enda selamat; fikir tahap perlindungan perlu untuk transaksi sensitif.')
      .replace('Evaluate whether the source and format of the communication align with official procedures.', 'Nilai mun sumber enggau bentuk komunikasi selaras ngena prosedur rasmi.')
      .replace('Consider what actions allow you to check for issues without assuming everything is fine.', 'Fikir tindakan ti ngaga kitak mansaik masalah tanpa ngangkap semua nya ok.')
      .replace('Think about why some offers seem “too good to be true.”', 'Fikir ngapa sesetengah tawaran kedak “terlalu bagus untuk benar.”')
      .replace('Reflect on the broader implications of how such situations could escalate.', 'Renung implikasi lebih luas baka mana situasi nya ulih meningkat.')
      .replace('Pop-ups pressuring immediate action often indicate scams. Think about whether the message is consistent with legitimate support practices.', 'Pop‑up nyuruh bertindak segera selalu tanda penipuan; fikir mun mesej nya selaras ngena amalan sokongan sah.')
      .replace('Consider how official communications usually reach users.', 'Pikir baka mana komunikasi rasmi biasa nyampai ka pengguna.')
      .replace('Public computers can store session data. Think about what information might remain accessible after you finish.', 'Komputer awam ulih nyimpan data sesi; fikir maklumat ti mungkin kekal boleh diakses lepas kitak selesai.')
      .replace('Unsolicited friendly messages can be used to build rapport before exploiting victims. Consider the potential risk.', 'Mesej mesra nadai dipinta ulih diguna ngaga hubungan sebelum ngambil kesian mangsa; pertimbangka risiko.')
      .replace('Think about what the document is asking you to do and whether it is typical.', 'Fikir apa dokumen nya minta kitak molah enggau mun nya biasa.')
      .replace('Physical security is as important as digital security. Protect your input from observation.', 'Keselamatan fizikal sama penting ngena keselamatan digital; lindung input kitak ari pengamat.')
      .replace('Think about ways to ensure a charitable request is genuine.', 'Pikir baka mana mastika permintaan amal nya tulen.')
      .replace('Reflect on how additional software interacts with your information.', 'Renung baka mana perisian tambahan berinteraksi ngena maklumat kitak.')
      .replace('Biometric data is highly sensitive. Consider the potential consequences of sharing personal data.', 'Data biometrik sensitif amat; pertimbangka akibat berkongsi data peribadi.');
  }
  if (lang === 'zh') {
    return s
      .replace('Question requests for sensitive information that deviate from standard security procedures.', '对偏离标准安全流程的敏感信息请求保持怀疑。')
      .replace('Understanding the primary source of income is critical when evaluating business models.', '评估商业模式时，了解主要收入来源至关重要。')
      .replace('Phishing emails often mimic legitimate senders. Always verify independently.', '钓鱼邮件常模仿正规发件人；请独立核实。')
      .replace('Check sender domain, hover links, and grammar cues.', '检查发件人域名、悬停查看链接、留意语法提示。')
      .replace('Hover reveals the real URL in the status area; compare domain.', '悬停可在状态区显示真实URL；注意域名对比。')
      .replace('Credential or payment theft is typical objective.', '窃取凭证或付款是常见目标。')
      .replace('Gift card requests are common BEC tactics; verify synchronously.', '礼品卡请求是常见BEC手法；务必同步核实。')
      .replace('Spear phishing leverages personalized context to increase success.', '鱼叉式钓鱼利用个性化情境提高成功率。')
      .replace('Voice calls are abused for urgency and impersonation.', '语音来电常被滥用以制造紧迫感与冒充身份。')
      .replace('Homoglyphs make malicious domains resemble trusted ones.', '同形异义字符可让恶意域名看似可信。')
      .replace('TLS ensures transport encryption, not site legitimacy.', 'TLS仅保证传输加密，并不代表网站可信。')
      .replace('Malvertising uses fake alerts; avoid interacting with popups.', '恶意广告常用假警报；避免与弹窗交互。')
      .replace('Cracked software commonly carries trojans and ransomware.', '破解软件常夹带木马和勒索软件。')
      .replace('Backups and patching mitigate ransomware impact.', '备份与及时打补丁可降低勒索软件影响。')
      .replace('Updates contain critical security patches; apply promptly.', '更新包含关键安全补丁；应尽快安装。')
      .replace('Offline backups prevent data loss even if encryption occurs.', '离线备份可在数据被加密时避免丢失。')
      .replace('Zero-days are exploited before patches exist; layered defenses help.', '零日漏洞在补丁发布前即被利用；分层防御有效。')
      .replace('Botnets enable DDoS and spam; devices join via malware.', '僵尸网络用于DDoS与垃圾信息；设备通过恶意软件加入。')
      .replace('Keyloggers capture credentials; watch for unusual behavior and use anti-malware.', '键盘记录器会窃取凭证；留意异常行为并使用反恶意软件。')
      .replace('Sideloading bypasses store checks; increases malware risk.', '旁加载绕过商店审查，提升恶意软件风险。')
      .replace('Avoid public Wi‑Fi for banking; prefer mobile data or VPN.', '办理银行业务避免使用公共Wi‑Fi；优先使用移动数据或VPN。')
      .replace('Unknown USBs may contain malware; hand to IT without connecting.', '未知U盘可能含恶意软件；不要连接，交给IT处理。')
      .replace('Destroy sensitive paper records to prevent data leaks.', '销毁敏感纸质文件以防数据泄露。')
      .replace('Avoid sharing government ID; use secure official channels only.', '避免分享政府证件；仅使用安全的官方渠道。')
      .replace('VPNs encrypt traffic; they are not antivirus.', 'VPN加密流量，但并非杀毒软件。')
      .replace('MITM intercepts data on untrusted networks; use HTTPS and VPN.', '中间人攻击拦截不可信网络中的数据；使用HTTPS与VPN。')
      .replace('Attackers clone SSIDs; verify with staff and use HTTPS/VPN.', '攻击者可克隆SSID；向工作人员核实并使用HTTPS/VPN。')
      .replace('Private mode affects local storage only; not network visibility.', '隐私模式仅影响本地存储，并不隐藏网络可见性。')
      .replace('Shield screens and keypads; be aware of surroundings.', '遮挡屏幕与键盘；注意周围环境。')
      .replace('Never share passwords; verify via official channels.', '切勿分享密码；通过官方渠道核实。')
      .replace('Tailgating bypasses access controls; challenge and report.', '尾随进入绕过门禁；应质询并上报。')
      .replace('Trivia reveals answers to common security questions; avoid sharing.', '趣味问答会暴露常见安全问题答案；避免分享。')
      .replace('Fake accounts harvest info; restrict contacts to known people.', '虚假账号用来收集信息；仅与认识的人互动。')
      .replace('Most attacks exploit people, not systems; stay skeptical and verify.', '多数攻击利用人性而非系统；保持怀疑并核实。')
      .replace('Offer of benefits in exchange for credentials or access.', '以好处交换凭证或访问权的诱骗。')
      .replace('Authority scams use pressure; validate identities and escalate properly.', '权威型骗局利用压力；核实身份并按流程上报。')
      .replace('Use high-entropy, random passwords rather than common patterns.', '使用高熵随机密码而非常见模式。')
      .replace('Unique passwords per site reduce breach blast radius.', '每站点使用独立密码可降低泄露影响范围。')
      .replace('Use app-based or hardware 2FA for strong protection.', '使用App或硬件2FA以获得更强保护。')
      .replace('Rotate important passwords; check for breaches and enable 2FA.', '定期更换重要密码；检查泄露并启用2FA。')
      .replace('Use a reputable password manager with strong master password.', '使用可信密码管理器并设置强主密码。');
  }
  if (lang === 'ms') {
    return s
      .replace('Question requests for sensitive information that deviate from standard security procedures.', 'Pertanyakan permintaan maklumat sensitif yang menyimpang daripada prosedur keselamatan standard.')
      .replace('Understanding the primary source of income is critical when evaluating business models.', 'Memahami sumber pendapatan utama adalah penting ketika menilai model perniagaan.')
      .replace('Phishing emails often mimic legitimate senders. Always verify independently.', 'Emel pancingan sering meniru penghantar sah; sentiasa sahkan secara berasingan.')
      .replace('Check sender domain, hover links, and grammar cues.', 'Semak domain penghantar, halakan tetikus pada pautan, dan petunjuk tatabahasa.')
      .replace('Hover reveals the real URL in the status area; compare domain.', 'Halakan tetikus menunjukkan URL sebenar pada bar status; bandingkan domain.')
      .replace('Credential or payment theft is typical objective.', 'Mencuri kelayakan atau bayaran adalah matlamat biasa.')
      .replace('Gift card requests are common BEC tactics; verify synchronously.', 'Permintaan kad hadiah adalah taktik BEC biasa; sahkan secara serentak.')
      .replace('Spear phishing leverages personalized context to increase success.', 'Spear phishing menggunakan konteks peribadi untuk meningkatkan kejayaan.')
      .replace('Voice calls are abused for urgency and impersonation.', 'Panggilan suara disalah guna untuk mendesak dan menyamar.')
      .replace('Homoglyphs make malicious domains resemble trusted ones.', 'Homoglif menjadikan domain jahat kelihatan seperti yang dipercayai.')
      .replace('TLS ensures transport encryption, not site legitimacy.', 'TLS memastikan penyulitan penghantaran, bukan legitimasi laman.')
      .replace('Malvertising uses fake alerts; avoid interacting with popups.', 'Malvertising guna amaran palsu; elakkan berinteraksi dengan pop‑up.')
      .replace('Cracked software commonly carries trojans and ransomware.', 'Perisian retak sering membawa trojan dan ransomware.')
      .replace('Backups and patching mitigate ransomware impact.', 'Sandaran dan tampalan mengurangkan kesan ransomware.')
      .replace('Updates contain critical security patches; apply promptly.', 'Kemas kini mengandungi tampalan keselamatan kritikal; laksanakan segera.')
      .replace('Offline backups prevent data loss even if encryption occurs.', 'Sandaran luar talian mencegah kehilangan data walaupun disulitkan.')
      .replace('Zero-days are exploited before patches exist; layered defenses help.', 'Zero‑day dieksploitasi sebelum wujud tampalan; pertahanan berlapis membantu.')
      .replace('Botnets enable DDoS and spam; devices join via malware.', 'Botnet membolehkan DDoS dan spam; peranti menyertai melalui malware.')
      .replace('Keyloggers capture credentials; watch for unusual behavior and use anti-malware.', 'Keylogger menangkap kelayakan; perhatikan tingkah laku luar biasa dan guna anti‑malware.')
      .replace('Sideloading bypasses store checks; increases malware risk.', 'Sideloading memintas semakan gedung; meningkatkan risiko malware.')
      .replace('Avoid public Wi‑Fi for banking; prefer mobile data or VPN.', 'Elakkan Wi‑Fi awam untuk perbankan; guna data mudah alih atau VPN.')
      .replace('Unknown USBs may contain malware; hand to IT without connecting.', 'USB tidak diketahui mungkin mengandungi malware; serah kepada IT tanpa menyambung.')
      .replace('Destroy sensitive paper records to prevent data leaks.', 'Musnahkan rekod kertas sensitif untuk mengelak kebocoran data.')
      .replace('Avoid sharing government ID; use secure official channels only.', 'Elakkan berkongsi ID kerajaan; guna saluran rasmi yang selamat sahaja.')
      .replace('VPNs encrypt traffic; they are not antivirus.', 'VPN menyulitkan trafik; ia bukan antivirus.')
      .replace('MITM intercepts data on untrusted networks; use HTTPS and VPN.', 'MITM memintas data pada rangkaian tidak dipercayai; guna HTTPS dan VPN.')
      .replace('Attackers clone SSIDs; verify with staff and use HTTPS/VPN.', 'Penyerang mengklon SSID; sahkan dengan kakitangan dan guna HTTPS/VPN.')
      .replace('Private mode affects local storage only; not network visibility.', 'Mod peribadi hanya menjejaskan storan tempatan; bukan keterlihatan rangkaian.')
      .replace('Shield screens and keypads; be aware of surroundings.', 'Lindungi skrin dan papan kekunci; peka dengan persekitaran.')
      .replace('Never share passwords; verify via official channels.', 'Jangan sekali‑kali kongsi kata laluan; sahkan melalui saluran rasmi.')
      .replace('Tailgating bypasses access controls; challenge and report.', 'Tailgating memintas kawalan akses; cabar dan laporkan.')
      .replace('Trivia reveals answers to common security questions; avoid sharing.', 'Kuiz mendedahkan jawapan kepada soalan keselamatan biasa; elak berkongsi.')
      .replace('Fake accounts harvest info; restrict contacts to known people.', 'Akaun palsu mengutip maklumat; hadkan kepada kenalan yang dikenali.')
      .replace('Most attacks exploit people, not systems; stay skeptical and verify.', 'Kebanyakan serangan mengeksploitasi manusia, bukan sistem; kekal skeptikal dan sahkan.')
      .replace('Offer of benefits in exchange for credentials or access.', 'Tawaran manfaat untuk menukar kelayakan atau akses.')
      .replace('Authority scams use pressure; validate identities and escalate properly.', 'Penipuan berautoriti guna tekanan; sahkan identiti dan eskalasi dengan betul.')
      .replace('Use high-entropy, random passwords rather than common patterns.', 'Guna kata laluan rawak berentropi tinggi, bukan corak biasa.')
      .replace('Unique passwords per site reduce breach blast radius.', 'Kata laluan unik bagi setiap laman mengurangkan impak kebocoran.')
      .replace('Use app-based or hardware 2FA for strong protection.', 'Guna 2FA berasaskan aplikasi atau perkakasan untuk perlindungan kukuh.')
      .replace('Rotate important passwords; check for breaches and enable 2FA.', 'Putar kata laluan penting; semak kebocoran dan aktifkan 2FA.')
      .replace('Use a reputable password manager with strong master password.', 'Guna pengurus kata laluan bereputasi dengan kata laluan induk yang kukuh.');
  }
  return s;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');
  const [qdictState, setQdictState] = useState(questionDict);
  const [odictState, setOdictState] = useState(optionDict);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setLanguage(saved);
  }, []);

  const changeLanguage = (lang) => {
    setLanguage(lang);
    try { localStorage.setItem(STORAGE_KEY, lang); } catch { }
  };

  const t = useCallback((key) => {
    const dict = dictionary[language] || dictionary.en;
    if (dict[key] !== undefined) return dict[key];
    if (language === 'swk' && dictionary.ms && dictionary.ms[key] !== undefined) return dictionary.ms[key];
    return dictionary.en[key] || key;
  }, [language]);

  const localeFor = (lang) => {
    if (lang === 'zh') return 'zh-CN';
    if (lang === 'ms' || lang === 'swk') return 'ms-MY';
    return 'en-US';
  };

  const formatDate = useCallback((value, options) => {
    const v = value instanceof Date ? value : new Date(value);
    if (isNaN(v)) return value ? String(value) : '';
    const locale = localeFor(language);
    const opts = options || { year: 'numeric', month: 'long', day: 'numeric' };
    return new Intl.DateTimeFormat(locale, opts).format(v);
  }, [language]);

  useEffect(() => {
    const buildAutoI18n = async () => {
      try {
        const res = await fetch('/api/assessment/questions');
        const qs = await res.json();
        if (!Array.isArray(qs) || qs.length === 0) return;
        const langs = ['zh', 'ms', 'swk'];
        const autoQ = {};
        const autoO = {};
        langs.forEach((lg) => {
          autoQ[lg] = {};
          autoO[lg] = {};
        });
        qs.forEach((q) => {
          langs.forEach((lg) => {
            const txText = qtx(lg, q.text);
            const tipText = qtipx(lg, q.tip);
            const optMap = {};
            (q.options || []).forEach((o) => {
              const ot = otx(lg, o.text);
              optMap[o.value] = ot;
              if (!autoO[lg][o.value]) autoO[lg][o.value] = ot;
            });
            autoQ[lg][q.codeId] = { text: txText, tip: tipText, options: optMap };
          });
        });
        setQdictState((prev) => ({
          ...prev,
          zh: { ...(autoQ.zh || {}), ...(prev.zh || {}) },
          ms: { ...(autoQ.ms || {}), ...(prev.ms || {}) },
          swk: { ...(prev.swk || {}), ...(autoQ.swk || {}), ...(prev.ms || {}) }
        }));
        setOdictState((prev) => ({
          ...prev,
          zh: { ...(autoO.zh || {}), ...(prev.zh || {}) },
          ms: { ...(autoO.ms || {}), ...(prev.ms || {}) },
          swk: { ...(prev.swk || {}), ...(autoO.swk || {}), ...(prev.ms || {}) }
        }));
      } catch { }
    };
    buildAutoI18n();
  }, []);

  const value = useMemo(() => ({ language, setLanguage: changeLanguage, t, formatDate, dictionary, qdict: qdictState, odict: odictState, tx, tt, qtx, qtipx, otx }), [language, qdictState, odictState, t, formatDate]);

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
