-- ====================================================================
-- HỆ THỐNG CƠ SỞ DỮ LIỆU "KHO TRÒ CHƠI HỌC VUI CẤP 2" (THCS GDPT 2018)
-- SUPABASE POSTGRESQL SCHEMA WITH ROW LEVEL SECURITY (RLS)
-- ====================================================================

-- 1. KÍCH HOẠT EXTENSION UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TẠO CÁC KIỂU DỮ LIỆU (ENUMS)
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'teacher', 'student');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE grade_level AS ENUM ('6', '7', '8', '9');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE game_type AS ENUM ('iframe', 'html5_zip', 'builtin_memory', 'builtin_wordsearch', 'builtin_wheel');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE rank_tier AS ENUM ('Đồng', 'Bạc', 'Vàng', 'Kim Cương');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. BẢNG PROFILES (THÔNG TIN NGUỜI DÙNG TÍCH HỢP SUPABASE AUTH)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE,
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'student',
    avatar_url TEXT DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    student_code TEXT UNIQUE,
    grade_level grade_level DEFAULT '6',
    total_exp INT NOT NULL DEFAULT 0,
    rank_tier rank_tier NOT NULL DEFAULT 'Đồng',
    coins INT NOT NULL DEFAULT 100,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- 4. BẢNG CATEGORIES (KHỐI LỚP & MÔN HỌC CHUẨN GDPT 2018)
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('grade', 'subject')),
    code TEXT NOT NULL UNIQUE,
    icon_name TEXT DEFAULT 'BookOpen',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. BẢNG CLASSES (LỚP HỌC DO GIÁO VIÊN TẠO)
CREATE TABLE IF NOT EXISTS public.classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    grade_level grade_level NOT NULL,
    code TEXT NOT NULL UNIQUE,
    teacher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. BẢNG CLASS_MEMBERS (DANH SÁCH HỌC SINH TRONG LỚP)
CREATE TABLE IF NOT EXISTS public.class_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(class_id, student_id)
);

-- 7. BẢNG GAMES (KHO TRÒ CHƠI HỌC TẬP)
CREATE TABLE IF NOT EXISTS public.games (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    thumbnail_url TEXT,
    game_type game_type NOT NULL DEFAULT 'iframe',
    game_url TEXT,
    grade_level grade_level NOT NULL DEFAULT '6',
    subject TEXT NOT NULL,
    author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    is_public BOOLEAN DEFAULT true,
    play_count INT DEFAULT 0,
    avg_rating NUMERIC(3,2) DEFAULT 5.0,
    config JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. BẢNG ASSIGNMENTS (BÀI TẬP / GAME DO GIÁO VIÊN GIAO)
CREATE TABLE IF NOT EXISTS public.assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    game_id UUID NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    reward_exp INT DEFAULT 50,
    reward_coins INT DEFAULT 20,
    due_date TIMESTAMPTZ,
    max_attempts INT DEFAULT 3,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. BẢNG STUDENT_PROGRESS (TIẾN ĐỘ & KẾT QUẢ CHƠI GAME)
CREATE TABLE IF NOT EXISTS public.student_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assignment_id UUID REFERENCES public.assignments(id) ON DELETE SET NULL,
    game_id UUID NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'completed' CHECK (status IN ('in_progress', 'completed')),
    is_practice BOOLEAN DEFAULT false,
    score INT NOT NULL DEFAULT 0,
    exp_earned INT NOT NULL DEFAULT 0,
    coins_earned INT NOT NULL DEFAULT 0,
    completion_time_seconds INT NOT NULL DEFAULT 0,
    attempts_count INT NOT NULL DEFAULT 1,
    feedback_rating INT CHECK (feedback_rating BETWEEN 1 AND 5),
    feedback_comment TEXT,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. BẢNG BADGES (KHO HUY HIỆU & DANH HIỆU)
CREATE TABLE IF NOT EXISTS public.badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    icon_name TEXT NOT NULL DEFAULT 'Trophy',
    badge_type TEXT DEFAULT 'exp' CHECK (badge_type IN ('exp', 'plays', 'score', 'special')),
    req_condition INT DEFAULT 100,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. BẢNG STUDENT_BADGES (HUY HIỆU HỌC SINH ĐÃ MỞ KHÓA)
CREATE TABLE IF NOT EXISTS public.student_badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, badge_id)
);

-- ====================================================================
-- INDEXES TỐI ƯU HIỆU NĂNG TRUY VẤN
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_games_grade_subject ON public.games(grade_level, subject);
CREATE INDEX IF NOT EXISTS idx_games_author ON public.games(author_id);
CREATE INDEX IF NOT EXISTS idx_progress_student ON public.student_progress(student_id);
CREATE INDEX IF NOT EXISTS idx_progress_game ON public.student_progress(game_id);
CREATE INDEX IF NOT EXISTS idx_classes_teacher ON public.classes(teacher_id);
CREATE INDEX IF NOT EXISTS idx_class_members_student ON public.class_members(student_id);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_badges ENABLE ROW LEVEL SECURITY;

-- Policies cho Profiles
CREATE POLICY "Public profiles are viewable by authenticated users" 
ON public.profiles FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Policies cho Categories
CREATE POLICY "Categories viewable by everyone" 
ON public.categories FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can insert/update categories" 
ON public.categories FOR ALL TO authenticated 
USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Policies cho Games (Công khai đọc/ghi/xóa cho cả Giáo viên, Học sinh và Anon key để đồng bộ game tức thì trên mọi thiết bị)
DROP POLICY IF EXISTS "Public games viewable by everyone" ON public.games;
CREATE POLICY "Public games viewable by everyone" 
ON public.games FOR SELECT USING (true);

DROP POLICY IF EXISTS "Teachers and Admins can create games" ON public.games;
CREATE POLICY "Everyone can create games" 
ON public.games FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Authors and Admins can update games" ON public.games;
CREATE POLICY "Everyone can update games" 
ON public.games FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Everyone can delete games" ON public.games;
CREATE POLICY "Everyone can delete games" 
ON public.games FOR DELETE USING (true);

-- Policies cho Classes
CREATE POLICY "Teachers can view created classes" 
ON public.classes FOR SELECT TO authenticated USING (teacher_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.class_members WHERE class_id = public.classes.id AND student_id = auth.uid()
));

CREATE POLICY "Teachers can create classes" 
ON public.classes FOR INSERT TO authenticated 
WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'teacher'));

-- Policies cho Student Progress
CREATE POLICY "Students can view their own progress" 
ON public.student_progress FOR SELECT TO authenticated USING (student_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('teacher', 'admin')
));

CREATE POLICY "Students can insert their own progress" 
ON public.student_progress FOR INSERT TO authenticated WITH CHECK (student_id = auth.uid());

-- Policies cho Badges & Student Badges
CREATE POLICY "Badges viewable by everyone" ON public.badges FOR SELECT TO authenticated USING (true);
CREATE POLICY "Student Badges viewable by everyone" ON public.student_badges FOR SELECT TO authenticated USING (true);

-- ====================================================================
-- TRIGGERS & FUNCTIONS TỰ ĐỘNG
-- ====================================================================

-- Trigger: Tự động chèn bản ghi khi có user mới từ Supabase Auth (Chỉ lyngangiang83pt@gmail.com mới là admin)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    v_role user_role;
BEGIN
    -- Kiểm tra nghiêm ngặt: Chỉ email lyngangiang83pt@gmail.com mới được cấp quyền Admin
    IF LOWER(NEW.email) = 'lyngangiang83pt@gmail.com' THEN
        v_role := 'admin';
    ELSE
        v_role := COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'student');
        -- Từ chối cấp quyền admin cho bất kỳ email nào khác
        IF v_role = 'admin' THEN
            v_role := 'student';
        END IF;
    END IF;

    INSERT INTO public.profiles (id, email, full_name, role, grade_level, student_code)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        v_role,
        COALESCE((NEW.raw_user_meta_data->>'grade_level')::grade_level, '6'),
        COALESCE(NEW.raw_user_meta_data->>'student_code', 'HS' || FLOOR(100000 + RANDOM() * 900000)::TEXT)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger & Function: Cập nhật tổng EXP, Coins và Rank Tier tự động khi hoàn thành bài
CREATE OR REPLACE FUNCTION public.update_student_exp_rank()
RETURNS TRIGGER AS $$
DECLARE
    v_total_exp INT;
    v_new_rank rank_tier;
BEGIN
    IF NEW.is_practice = false THEN
        -- Cộng EXP và Coins vào profile
        UPDATE public.profiles 
        SET 
            total_exp = total_exp + NEW.exp_earned,
            coins = coins + NEW.coins_earned,
            updated_at = NOW()
        WHERE id = NEW.student_id
        RETURNING total_exp INTO v_total_exp;

        -- Xác định Rank Tier
        IF v_total_exp >= 3000 THEN
            v_new_rank := 'Kim Cương';
        ELSIF v_total_exp >= 1500 THEN
            v_new_rank := 'Vàng';
        ELSIF v_total_exp >= 500 THEN
            v_new_rank := 'Bạc';
        ELSE
            v_new_rank := 'Đồng';
        END IF;

        UPDATE public.profiles SET rank_tier = v_new_rank WHERE id = NEW.student_id;

        -- Cập nhật lượt chơi game
        UPDATE public.games SET play_count = play_count + 1 WHERE id = NEW.game_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_student_progress_inserted ON public.student_progress;
CREATE TRIGGER on_student_progress_inserted
  AFTER INSERT ON public.student_progress
  FOR EACH ROW EXECUTE FUNCTION public.update_student_exp_rank();

-- ====================================================================
-- SEED DATA MẪU KHỞI TẠO HỆ THỐNG (CHƯƠNG TRÌNH GDPT 2018 THCS)
-- ====================================================================

-- Seed Danh Mục Môn Học & Khối Lớp
INSERT INTO public.categories (name, type, code, icon_name) VALUES
('Lớp 6', 'grade', 'G6', 'GraduationCap'),
('Lớp 7', 'grade', 'G7', 'GraduationCap'),
('Lớp 8', 'grade', 'G8', 'GraduationCap'),
('Lớp 9', 'grade', 'G9', 'GraduationCap'),
('Toán Học', 'subject', 'TOAN', 'Calculator'),
('Ngữ Văn', 'subject', 'VAN', 'BookOpen'),
('Tiếng Anh', 'subject', 'ANH', 'Languages'),
('Khoa Học Tự Nhiên', 'subject', 'KHTN', 'Atom'),
('Lịch Sử & Địa Lý', 'subject', 'LS_DL', 'Compass'),
('Tin Học', 'subject', 'TIN', 'Cpu'),
('GDCD', 'subject', 'GDCD', 'ShieldCheck')
ON CONFLICT (code) DO NOTHING;

-- Seed Badges & Danh Hiệu Mẫu
INSERT INTO public.badges (title, description, icon_name, badge_type, req_condition) VALUES
('Tân Binh Học Vui', 'Hoàn thành trò chơi học tập đầu tiên', 'Sparkles', 'plays', 1),
('Chiến Thần Khoa Học', 'Tích lũy 500 EXP từ các game Khoa Học Tự Nhiên', 'Atom', 'exp', 500),
('Bậc Thầy Ngôn Ngữ', 'Đạt điểm tối đa trong 5 game Ngữ Văn & Tiếng Anh', 'BookOpen', 'score', 5),
('Kẻ Hủy Diệt Deadline', 'Hoàn thành 10 bài tập được giáo viên giao trước thời hạn', 'Zap', 'plays', 10),
('Huyền Thoại Kim Cương', 'Đạt hạng Kim Cương với tổng 3000 EXP', 'Trophy', 'exp', 3000)
ON CONFLICT (title) DO NOTHING;

-- Seed Games Mẫu Tích Hợp sẵn (Builtin & iFrame)
INSERT INTO public.games (title, description, thumbnail_url, game_type, game_url, grade_level, subject, is_public, play_count, avg_rating, config) VALUES
(
    'Chinh Phục Nguyên Tử & Phân Tử', 
    'Lật thẻ ghép cặp kí hiệu hóa học & nguyên tử khối KHTN Lớp 7.', 
    'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&auto=format&fit=crop&q=80', 
    'builtin_memory', 
    '', 
    '7', 
    'Khoa Học Tự Nhiên', 
    true, 
    142, 
    4.9,
    '{"pairs": [{"q": "Hydro (H)", "a": "NTK = 1"}, {"q": "Oxy (O)", "a": "NTK = 16"}, {"q": "Carbon (C)", "a": "NTK = 12"}, {"q": "Nito (N)", "a": "NTK = 14"}, {"q": "Natri (Na)", "a": "NTK = 23"}, {"q": "Sắt (Fe)", "a": "NTK = 56"}]}'
),
(
    'Giải Mã Đoạn Văn & Từ Vựng Tiếng Anh 8', 
    'Tìm kiếm từ vựng Unit 1 - 3 Tiếng Anh Lớp 8 trong ô chữ bí mật.', 
    'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80', 
    'builtin_wordsearch', 
    '', 
    '8', 
    'Tiếng Anh', 
    true, 
    98, 
    4.8,
    '{"gridSize": 10, "words": ["LEISURE", "CRAFT", "COMMUNITY", "HERITAGE", "CUSTOM", "VOLUNTEER"]}'
),
(
    'Vòng Quay May Mắn Toán 6: Hình Học Trực Quan', 
    'Quay bánh xe để trả lời các câu hỏi về Hình vuông, Hình tam giác đều, Hình chữ nhật.', 
    'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80', 
    'builtin_wheel', 
    '', 
    '6', 
    'Toán Học', 
    true, 
    215, 
    5.0,
    '{"questions": [{"q": "Hình nào có 4 cạnh bằng nhau và 4 góc vuông?", "a": ["Hình vuông", "Hình chữ nhật", "Hình thoi"], "correct": 0}, {"q": "Tổng 3 góc trong một tam giác bằng bao nhiêu độ?", "a": ["90°", "180°", "360°"], "correct": 1}, {"q": "Hình thoi có mấy đường chéo vuông góc?", "a": ["1", "2", "4"], "correct": 1}]}'
),
(
    'Wordwall Quizizz: Rèn Luyện Lịch Sử Lớp 9', 
    'Game trắc nghiệm nhúng Wordwall về Các mốc Lịch Sử Việt Nam hiện đại.', 
    'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=600&auto=format&fit=crop&q=80', 
    'iframe', 
    'https://wordwall.net/embed/play/123456/789', 
    '9', 
    'Lịch Sử & Địa Lý', 
    true, 
    64, 
    4.7,
    '{}'
),
(
    'Game #26: Đấu Trí Siêu Trí Tuệ',
    'Thử thách trí nhớ siêu phàm: Ghi nhớ chuỗi dữ kiện trong 5 giây và tái hiện sắp xếp chính xác.',
    'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80',
    'iframe',
    '/games/dau-tri-sieu-tri-tue.html',
    '7',
    'Khoa Học Tự Nhiên',
    true,
    320,
    5.0,
    '{}'
),
(
    'Game #52: Lô Tô Tri Thức Ngày Tết',
    'Quay lồng cầu bốc số may mắn, trả lời đúng câu hỏi kiến thức để dò vé trúng thưởng KINH LÔ TÔ.',
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
    'iframe',
    '/games/lo-to-tri-thuc-ngay-tet.html',
    '7',
    'Toán Học',
    true,
    285,
    4.9,
    '{}'
),
(
    'Game #23: Vòng Quay May Mắn',
    'Quay bánh xe lấy điểm thưởng bất ngờ rồi trả lời câu hỏi trắc nghiệm thử thách tương ứng.',
    'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&auto=format&fit=crop&q=80',
    'iframe',
    '/games/vong-quay-may-man-game23.html',
    '7',
    'Toán Học',
    true,
    410,
    5.0,
    '{}'
),
(
    'Game #58: Kéo Co Đồng Đội',
    'Trả lời đúng và tốc độ để kéo đội bạn về phía mình trong đấu trường kéo co hoạt cảnh sống động.',
    'https://images.unsplash.com/photo-1526676037777-05a232554f77?w=600&auto=format&fit=crop&q=80',
    'iframe',
    '/games/keo-co-dong-doi-game58.html',
    '7',
    'Khoa Học Tự Nhiên',
    true,
    375,
    4.9,
    '{}'
),
(
    'Game #59: Hái Hoa Dân Chủ',
    'Hái những bông hoa rực rỡ trên Cây Tri Thức và trả lời câu hỏi bí mật ẩn sau cánh hoa.',
    'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600&auto=format&fit=crop&q=80',
    'iframe',
    '/games/hai-hoa-dan-chu-game59.html',
    '7',
    'GDCD',
    true,
    290,
    5.0,
    '{}'
);
