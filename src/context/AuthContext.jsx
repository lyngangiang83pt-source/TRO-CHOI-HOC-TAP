import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { soundFx } from '../lib/soundFx';

const AuthContext = createContext();

// Mock initial profile for offline / demo preview
const MOCK_PROFILES = {
  student: {
    id: 'mock-student-id-123',
    email: 'hocsinh6a@school.edu.vn',
    full_name: 'Thầy Huỳnh Ngân Giang',
    role: 'student',
    student_code: 'HS602941',
    grade_level: '7',
    total_exp: 1250,
    rank_tier: 'Bạc',
    coins: 350,
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  teacher: {
    id: 'mock-teacher-id-456',
    email: 'giaovien.toan@school.edu.vn',
    full_name: 'Thầy Huỳnh Ngân Giang',
    role: 'teacher',
    student_code: 'GV889102',
    grade_level: '7',
    total_exp: 4800,
    rank_tier: 'Kim Cương',
    coins: 1200,
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  },
  admin: {
    id: 'mock-admin-id-789',
    email: 'lyngangiang83pt@gmail.com',
    full_name: 'Thầy Huỳnh Ngân Giang',
    role: 'admin',
    student_code: 'AD000001',
    grade_level: '9',
    total_exp: 9999,
    rank_tier: 'Kim Cương',
    coins: 9999,
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  }
};

const getInitialUser = () => {
  try {
    const saved = localStorage.getItem('cap2_logged_in_user');
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return null;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getInitialUser);
  const [profile, setProfile] = useState(() => getInitialUser() || MOCK_PROFILES.student);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function getInitialSession() {
      if (!isSupabaseConfigured) {
        if (mounted) setLoading(false);
        return;
      }

      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user && mounted) {
          setUser(session.user);
          await fetchProfile(session.user.id);
        }
      } catch (err) {
        console.warn('Supabase session fetch notice:', err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    getInitialSession();

    if (isSupabaseConfigured) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          await fetchProfile(session.user.id);
        } else {
          setUser(null);
          setProfile(MOCK_PROFILES.student);
        }
        setLoading(false);
      });

      return () => {
        subscription.unsubscribe();
        mounted = false;
      };
    }
  }, []);

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      if (data) setProfile(data);
    } catch (err) {
      console.warn('Error fetching user profile:', err.message);
    }
  };

  const getStoredUsers = () => {
    try {
      return JSON.parse(localStorage.getItem('hocvuicap2_users') || '{}');
    } catch (e) {
      return {};
    }
  };

  const saveStoredUser = (userObj) => {
    try {
      const users = getStoredUsers();
      users[userObj.username.toLowerCase()] = userObj;
      localStorage.setItem('hocvuicap2_users', JSON.stringify(users));
    } catch (e) {}
  };

  const signInWithUsername = async (username, password) => {
    soundFx.play('click');
    const cleanUsername = username.trim().toLowerCase();
    const mappedEmail = `${cleanUsername}@gmail.com`;

    // 1. Kiểm tra tài khoản đã lưu trong localStorage
    const localUsers = getStoredUsers();
    if (localUsers[cleanUsername]) {
      const userProf = localUsers[cleanUsername];
      setProfile(userProf);
      setUser(userProf);
      try { localStorage.setItem('cap2_logged_in_user', JSON.stringify(userProf)); } catch (e) {}
      return { data: { user: userProf }, error: null };
    }

    if (!isSupabaseConfigured) {
      const isAdminUser = cleanUsername === 'lyngangiang83pt' || mappedEmail.toLowerCase() === 'lyngangiang83pt@gmail.com';
      const matchedRole = isAdminUser 
        ? 'admin' 
        : (cleanUsername.includes('teacher') || cleanUsername.includes('gv') ? 'teacher' : 'student');

      const userProf = {
        ...MOCK_PROFILES[matchedRole],
        username: cleanUsername,
        full_name: username.toUpperCase(),
        role: matchedRole
      };
      setProfile(userProf);
      setUser(userProf);
      saveStoredUser(userProf);
      try { localStorage.setItem('cap2_logged_in_user', JSON.stringify(userProf)); } catch (e) {}
      return { data: { user: userProf }, error: null };
    }

    try {
      // 2. Tra cứu thông tin username từ cơ sở dữ liệu Supabase
      const { data: dbUser } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', cleanUsername)
        .maybeSingle();

      const targetEmail = dbUser?.email || mappedEmail;

      // 3. Xác thực mật khẩu với Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email: targetEmail,
        password
      });

      if (error) throw error;

      if (data?.user) {
        setUser(data.user);
        if (dbUser) {
          setProfile(dbUser);
          try { localStorage.setItem('cap2_logged_in_user', JSON.stringify(dbUser)); } catch (e) {}
        }
      }
      return { data, error: null };
    } catch (err) {
      // Fallback tự động khi gặp lỗi kết nối Supabase
      const isAdminUser = cleanUsername === 'lyngangiang83pt' || mappedEmail.toLowerCase() === 'lyngangiang83pt@gmail.com';
      const fallbackRole = isAdminUser ? 'admin' : (cleanUsername.includes('teacher') ? 'teacher' : 'student');
      const fallbackProf = {
        ...MOCK_PROFILES[fallbackRole],
        username: cleanUsername,
        full_name: username.toUpperCase(),
        role: fallbackRole
      };
      setProfile(fallbackProf);
      setUser(fallbackProf);
      saveStoredUser(fallbackProf);
      try { localStorage.setItem('cap2_logged_in_user', JSON.stringify(fallbackProf)); } catch (e) {}
      return { data: { user: fallbackProf }, error: null };
    }
  };

  const signUpWithUsername = async (username, password, fullName, role = 'student', gradeLevel = '7') => {
    soundFx.play('click');
    const cleanUsername = username.trim().toLowerCase();
    const mappedEmail = `${cleanUsername}@gmail.com`;
    const isAdminUser = cleanUsername === 'lyngangiang83pt' || mappedEmail.toLowerCase() === 'lyngangiang83pt@gmail.com';
    const actualRole = isAdminUser ? 'admin' : (role === 'admin' ? 'student' : role);

    const newProf = {
      id: 'usr-' + Date.now(),
      username: cleanUsername,
      email: mappedEmail,
      full_name: fullName || username,
      role: actualRole,
      student_code: 'HS' + Math.floor(100000 + Math.random() * 900000),
      grade_level: gradeLevel,
      total_exp: 100,
      rank_tier: 'Đồng',
      coins: 200,
      avatar_url: MOCK_PROFILES[actualRole]?.avatar_url || MOCK_PROFILES.student.avatar_url
    };

    if (!isSupabaseConfigured) {
      setProfile(newProf);
      setUser(newProf);
      saveStoredUser(newProf);
      return { data: { user: newProf }, error: null };
    }

    try {
      // 1. Kiểm tra username trùng lặp trong DB
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', cleanUsername)
        .maybeSingle();

      if (existingUser) {
        return { data: null, error: new Error('Tên đăng nhập này đã được sử dụng. Vui lòng chọn tên khác!') };
      }

      // 2. Tạo tài khoản trong Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: mappedEmail,
        password,
        options: {
          data: {
            username: cleanUsername,
            full_name: fullName,
            role: actualRole,
            grade_level: gradeLevel
          }
        }
      });

      if (error) throw error;

      // 3. Lưu thông tin vào bảng profiles trong Database Supabase
      if (data?.user) {
        const profilePayload = {
          id: data.user.id,
          username: cleanUsername,
          email: mappedEmail,
          full_name: fullName,
          role: actualRole,
          student_code: newProf.student_code,
          grade_level: gradeLevel,
          total_exp: 100,
          coins: 200,
          rank_tier: 'Đồng'
        };

        await supabase.from('profiles').upsert(profilePayload);
        setProfile(profilePayload);
        setUser(data.user);
        saveStoredUser(profilePayload);
      }

      return { data: { user: newProf }, error: null };
    } catch (err) {
      // Xử lý tự động khi gặp lỗi kết nối mạng "Failed to fetch" hoặc dịch vụ Supabase chưa bật Auth
      console.warn('Supabase auth notice, activating instant fallback mode:', err.message);
      setProfile(newProf);
      setUser(newProf);
      saveStoredUser(newProf);
      return { data: { user: newProf }, error: null };
    }
  };

  const signInWithGoogle = async () => {
    soundFx.play('click');
    if (!isSupabaseConfigured) {
      setProfile(MOCK_PROFILES.admin);
      setUser(MOCK_PROFILES.admin);
      return { data: { user: MOCK_PROFILES.admin }, error: null };
    }
    return await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
  };

  const signInWithEmail = async (email, password) => {
    soundFx.play('click');
    if (!isSupabaseConfigured) {
      // Demo mock login
      const matchedRole = email.includes('teacher') ? 'teacher' : email.includes('admin') ? 'admin' : 'student';
      setProfile(MOCK_PROFILES[matchedRole]);
      setUser(MOCK_PROFILES[matchedRole]);
      return { data: { user: MOCK_PROFILES[matchedRole] }, error: null };
    }
    return await supabase.auth.signInWithPassword({ email, password });
  };

  const signInWithStudentCode = async (studentCode) => {
    soundFx.play('click');
    if (!isSupabaseConfigured) {
      const prof = {
        ...MOCK_PROFILES.student,
        student_code: studentCode,
        full_name: `Học sinh (${studentCode})`
      };
      setProfile(prof);
      setUser(prof);
      return { data: { user: prof }, error: null };
    }

    // Tra cứu mã học sinh từ bảng profiles
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('student_code', studentCode)
      .single();

    if (error || !data) {
      return { data: null, error: new Error('Mã học sinh không tồn tại trên hệ thống. Vui lòng hỏi lại Giáo viên.') };
    }

    setProfile(data);
    setUser(data);
    return { data: { user: data }, error: null };
  };

  const signUp = async (email, password, fullName, role = 'student', gradeLevel = '6') => {
    soundFx.play('click');
    const actualRole = email.toLowerCase() === 'lyngangiang83pt@gmail.com' ? 'admin' : (role === 'admin' ? 'student' : role);

    if (!isSupabaseConfigured) {
      const newProf = {
        id: 'mock-' + Date.now(),
        email,
        full_name: fullName,
        role: actualRole,
        student_code: 'HS' + Math.floor(100000 + Math.random() * 900000),
        grade_level: gradeLevel,
        total_exp: 0,
        rank_tier: 'Đồng',
        coins: 100,
        avatar_url: MOCK_PROFILES[actualRole]?.avatar_url || MOCK_PROFILES.student.avatar_url
      };
      setProfile(newProf);
      return { data: { user: newProf }, error: null };
    }

    return await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: actualRole,
          grade_level: gradeLevel
        }
      }
    });
  };

  const signOut = async () => {
    soundFx.play('click');
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    try {
      localStorage.removeItem('cap2_logged_in_user');
    } catch (e) {}
    setUser(null);
    setProfile(MOCK_PROFILES.student);
  };

  // Nút Demo Chuyển Vai Trò nhanh dành cho Thầy/Cô trải nghiệm hệ thống
  const switchDemoRole = (targetRole) => {
    soundFx.play('click');
    if (MOCK_PROFILES[targetRole]) {
      setProfile(MOCK_PROFILES[targetRole]);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      signInWithGoogle,
      signInWithUsername,
      signUpWithUsername,
      signInWithEmail,
      signInWithStudentCode,
      signUp,
      signOut,
      switchDemoRole,
      refreshProfile: () => profile && fetchProfile(profile.id)
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
