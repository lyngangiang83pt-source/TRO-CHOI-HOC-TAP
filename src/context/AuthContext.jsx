import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { soundFx } from '../lib/soundFx';

const AuthContext = createContext();

// Mock initial profile for offline / demo preview
const MOCK_PROFILES = {
  student: {
    id: 'mock-student-id-123',
    email: 'hocsinh6a@school.edu.vn',
    full_name: 'Nguyễn Văn Nam',
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
    full_name: 'Cô Trần Thị Thu Hà',
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
    full_name: 'Lý Ngân Giang (Quản Trị Viên)',
    role: 'admin',
    student_code: 'AD000001',
    grade_level: '9',
    total_exp: 9999,
    rank_tier: 'Kim Cương',
    coins: 9999,
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(MOCK_PROFILES.student);
  const [loading, setLoading] = useState(true);

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

  const signInWithEmail = async (email, password) => {
    soundFx.play('click');
    if (!isSupabaseConfigured) {
      // Demo mock login
      const matchedRole = email.includes('teacher') ? 'teacher' : email.includes('admin') ? 'admin' : 'student';
      setProfile(MOCK_PROFILES[matchedRole]);
      return { data: { user: MOCK_PROFILES[matchedRole] }, error: null };
    }
    return await supabase.auth.signInWithPassword({ email, password });
  };

  const signInWithStudentCode = async (studentCode) => {
    soundFx.play('click');
    if (!isSupabaseConfigured) {
      setProfile({
        ...MOCK_PROFILES.student,
        student_code: studentCode,
        full_name: `Học sinh (${studentCode})`
      });
      return { data: { user: MOCK_PROFILES.student }, error: null };
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
    return { data: { user: data }, error: null };
  };

  const signUp = async (email, password, fullName, role = 'student', gradeLevel = '6') => {
    soundFx.play('click');
    if (!isSupabaseConfigured) {
      const newProf = {
        id: 'mock-' + Date.now(),
        email,
        full_name: fullName,
        role,
        student_code: 'HS' + Math.floor(100000 + Math.random() * 900000),
        grade_level: gradeLevel,
        total_exp: 0,
        rank_tier: 'Đồng',
        coins: 100,
        avatar_url: MOCK_PROFILES[role]?.avatar_url
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
          role,
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
