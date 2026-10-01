import { supabase } from './supabase';
import { DEFAULT_TEACHER_PROFILE, INITIAL_STUDENTS } from '../data/constants';
import type { TeacherProfile, Student, SavedMessage } from '../types';

export interface UserData {
  profile: TeacherProfile;
  pin: string | null;
  students: Student[];
  history: SavedMessage[];
}

function check<T extends { error: { message: string } | null }>(res: T): T {
  if (res.error) throw new Error(res.error.message);
  return res;
}

/** Muat semua data guru. Untuk akun baru, data contoh dibuat dulu. */
export async function loadUserData(userId: string): Promise<UserData> {
  const [p, s, m] = await Promise.all([
    supabase.from('teacher_profiles').select('profile, pin').eq('user_id', userId).maybeSingle(),
    supabase.from('students').select('data').eq('user_id', userId),
    supabase.from('messages').select('data').eq('user_id', userId).order('created_at', { ascending: false }),
  ]);
  check(p); check(s); check(m);

  // Akun baru: isi dengan profil & siswa contoh (sama seperti versi lama)
  if (!p.data) {
    await saveProfile(userId, DEFAULT_TEACHER_PROFILE);
    await saveStudents(userId, INITIAL_STUDENTS);
    return { profile: DEFAULT_TEACHER_PROFILE, pin: null, students: INITIAL_STUDENTS, history: [] };
  }

  const students = (s.data ?? []).map((r) => r.data as Student);
  students.sort((a, b) => Number(a.nomorAbsen) - Number(b.nomorAbsen));

  return {
    profile: { ...DEFAULT_TEACHER_PROFILE, ...(p.data.profile as Partial<TeacherProfile>) },
    pin: p.data.pin ?? null,
    students,
    history: (m.data ?? []).map((r) => r.data as SavedMessage),
  };
}

export async function saveProfile(userId: string, profile: TeacherProfile): Promise<void> {
  check(await supabase.from('teacher_profiles').upsert(
    { user_id: userId, profile, updated_at: new Date().toISOString() },
    { onConflict: 'user_id' }
  ));
}

export async function savePin(userId: string, pin: string | null): Promise<void> {
  check(await supabase.from('teacher_profiles').upsert(
    { user_id: userId, pin, updated_at: new Date().toISOString() },
    { onConflict: 'user_id' }
  ));
}

/** Simpan seluruh daftar siswa: upsert yang ada, hapus yang sudah dibuang. */
export async function saveStudents(userId: string, list: Student[]): Promise<void> {
  if (list.length > 0) {
    check(await supabase.from('students').upsert(
      list.map((st) => ({ user_id: userId, id: st.id, data: st, updated_at: new Date().toISOString() })),
      { onConflict: 'user_id,id' }
    ));
    const keep = list.map((st) => `"${st.id.replace(/"/g, '')}"`).join(',');
    check(await supabase.from('students').delete().eq('user_id', userId).not('id', 'in', `(${keep})`));
  } else {
    check(await supabase.from('students').delete().eq('user_id', userId));
  }
}

export async function addMessage(userId: string, msg: SavedMessage): Promise<void> {
  check(await supabase.from('messages').upsert(
    { user_id: userId, id: msg.id, data: msg },
    { onConflict: 'user_id,id' }
  ));
}

export async function deleteMessage(userId: string, id: string): Promise<void> {
  check(await supabase.from('messages').delete().eq('user_id', userId).eq('id', id));
}

export async function clearUserData(userId: string): Promise<void> {
  check(await supabase.from('messages').delete().eq('user_id', userId));
  check(await supabase.from('students').delete().eq('user_id', userId));
  check(await supabase.from('teacher_profiles').delete().eq('user_id', userId));
}
