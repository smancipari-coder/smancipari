import React, { useState, useEffect } from 'react';
import { 
  UserCog, 
  KeyRound, 
  UserPlus, 
  Edit3, 
  Trash2, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  X,
  Eye,
  EyeOff
} from 'lucide-react';
import { AdminUser, AdminRole } from '../../types';
import { 
  getStoredAdmins, 
  saveAdmins, 
  deleteAdmin, 
  setCurrentAdmin, 
  addActivityLog,
  CBT_EVENT_STATE_UPDATE 
} from '../../utils/storage';

interface AdminManagementTabProps {
  currentAdmin: AdminUser;
  onAdminUpdated: (admin: AdminUser) => void;
}

export const AdminManagementTab: React.FC<AdminManagementTabProps> = ({
  currentAdmin,
  onAdminUpdated
}) => {
  const [admins, setAdmins] = useState<AdminUser[]>(getStoredAdmins());

  useEffect(() => {
    const handleUpdate = () => {
      setAdmins(getStoredAdmins());
    };
    window.addEventListener(CBT_EVENT_STATE_UPDATE, handleUpdate);
    return () => {
      window.removeEventListener(CBT_EVENT_STATE_UPDATE, handleUpdate);
    };
  }, []);

  // Password Change Form State
  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [passwordSuccess, setPasswordSuccess] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');

  // Admin CRUD Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);
  const [formName, setFormName] = useState<string>('');
  const [formUsername, setFormUsername] = useState<string>('');
  const [formPassword, setFormPassword] = useState<string>('');
  const [formRole, setFormRole] = useState<AdminRole>('GURU_MAPEL');
  const [formSubject, setFormSubject] = useState<string>('');
  const [formError, setFormError] = useState<string>('');
  const [crudSuccess, setCrudSuccess] = useState<string>('');
  const [crudError, setCrudError] = useState<string>('');

  // In-app Delete Confirmation Dialog State
  const [adminToDelete, setAdminToDelete] = useState<AdminUser | null>(null);

  // Handle Change Password for Current Admin
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (oldPassword !== currentAdmin.password) {
      setPasswordError('Kata sandi lama yang Anda masukkan tidak tepat.');
      return;
    }
    if (newPassword.length < 5) {
      setPasswordError('Kata sandi baru minimal harus 5 karakter.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Konfirmasi kata sandi baru tidak cocok.');
      return;
    }

    const updatedAdmins = admins.map((adm) =>
      adm.id === currentAdmin.id ? { ...adm, password: newPassword } : adm
    );

    saveAdmins(updatedAdmins);
    setAdmins(updatedAdmins);

    const updatedCurrent = { ...currentAdmin, password: newPassword };
    setCurrentAdmin(updatedCurrent);
    onAdminUpdated(updatedCurrent);

    addActivityLog({
      actor: `${currentAdmin.name} (@${currentAdmin.username})`,
      role: currentAdmin.role,
      action: 'CHANGE_PASSWORD',
      target: currentAdmin.username,
      details: `Administrator ${currentAdmin.name} berhasil memperbarui kata sandi akunnya.`,
      level: 'info'
    });

    setPasswordSuccess('Kata sandi akun Anda berhasil diperbarui!');
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  // Open Create Modal
  const openCreateModal = () => {
    setEditingAdmin(null);
    setFormName('');
    setFormUsername('');
    setFormPassword('');
    setFormRole('GURU_MAPEL');
    setFormSubject('');
    setFormError('');
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (admin: AdminUser) => {
    setEditingAdmin(admin);
    setFormName(admin.name);
    setFormUsername(admin.username);
    setFormPassword(''); // blank if not changing
    setFormRole(admin.role);
    setFormSubject(admin.subject || '');
    setFormError('');
    setIsModalOpen(true);
  };

  // Handle Save Admin (Create or Edit)
  const handleSaveAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setCrudSuccess('');

    try {
      const cleanUsername = formUsername.trim().toLowerCase();
      const cleanName = formName.trim();
      const cleanSubject = formSubject.trim();

      if (!cleanName || !cleanUsername) {
        setFormError('Nama lengkap dan username wajib diisi.');
        return;
      }

      if (!editingAdmin && !formPassword.trim()) {
        setFormError('Kata sandi wajib diisi untuk akun admin baru.');
        return;
      }

      if (formPassword.trim() && formPassword.trim().length < 5) {
        setFormError('Kata sandi baru minimal harus 5 karakter.');
        return;
      }

      // Check duplicate username
      const duplicate = admins.find(
        (a) => a.username.toLowerCase() === cleanUsername && a.id !== editingAdmin?.id
      );
      if (duplicate) {
        setFormError(`Username "${cleanUsername}" sudah digunakan oleh admin lain.`);
        return;
      }

      if (editingAdmin) {
        // Update
        const updated = admins.map((a) => {
          if (a.id === editingAdmin.id) {
            const updatedItem: AdminUser = {
              id: a.id,
              name: cleanName,
              username: cleanUsername,
              role: formRole,
              password: formPassword.trim() ? formPassword.trim() : a.password,
              createdAt: a.createdAt || new Date().toISOString(),
            };
            if (formRole === 'GURU_MAPEL' && cleanSubject) {
              updatedItem.subject = cleanSubject;
            }
            return updatedItem;
          }
          return a;
        });

        saveAdmins(updated);
        setAdmins(updated);

        if (editingAdmin.id === currentAdmin.id) {
          const myUpdate = updated.find((a) => a.id === currentAdmin.id);
          if (myUpdate) {
            setCurrentAdmin(myUpdate);
            onAdminUpdated(myUpdate);
          }
        }

        addActivityLog({
          actor: `${currentAdmin.name} (@${currentAdmin.username})`,
          role: currentAdmin.role,
          action: 'UPDATE_ADMIN',
          target: cleanUsername,
          details: `Memperbarui data akun admin: ${cleanName} (${cleanUsername}) sebagai ${formRole}${cleanSubject ? ` [Mapel: ${cleanSubject}]` : ''}.`,
          level: 'info'
        });

        setCrudSuccess(`Perubahan data admin "${cleanUsername}" berhasil disimpan.`);
      } else {
        // Create
        const newAdmin: AdminUser = {
          id: `admin-${Date.now()}`,
          username: cleanUsername,
          password: formPassword.trim(),
          name: cleanName,
          role: formRole,
          createdAt: new Date().toISOString(),
        };
        if (formRole === 'GURU_MAPEL' && cleanSubject) {
          newAdmin.subject = cleanSubject;
        }

        const updated = [...admins, newAdmin];
        saveAdmins(updated);
        setAdmins(updated);

        addActivityLog({
          actor: `${currentAdmin.name} (@${currentAdmin.username})`,
          role: currentAdmin.role,
          action: 'CREATE_ADMIN',
          target: newAdmin.username,
          details: `Menambahkan akun administrator baru: ${newAdmin.name} (${newAdmin.username}) dengan peran ${newAdmin.role}${cleanSubject ? ` [Mapel: ${cleanSubject}]` : ''}.`,
          level: 'info'
        });

        setCrudSuccess(`Akun admin baru "${newAdmin.username}" (${formRole}) berhasil ditambahkan.`);
      }

      setIsModalOpen(false);
    } catch (err: any) {
      console.error('Error saving admin:', err);
      setFormError(`Gagal menyimpan perubahan: ${err?.message || 'Terjadi kesalahan sistem.'}`);
    }
  };

  // Confirm Delete Admin
  const handleConfirmDelete = () => {
    if (!adminToDelete) return;
    setCrudError('');
    setCrudSuccess('');

    if (adminToDelete.id === currentAdmin.id) {
      setCrudError('Anda tidak dapat menghapus akun Anda sendiri yang sedang aktif digunakan.');
      setAdminToDelete(null);
      return;
    }

    deleteAdmin(adminToDelete.id);
    const updated = admins.filter((a) => a.id !== adminToDelete.id);
    setAdmins(updated);

    addActivityLog({
      actor: `${currentAdmin.name} (@${currentAdmin.username})`,
      role: currentAdmin.role,
      action: 'DELETE_ADMIN',
      target: adminToDelete.username,
      details: `Menghapus akun admin: ${adminToDelete.name} (${adminToDelete.username}) [${adminToDelete.role}].`,
      level: 'danger'
    });

    setCrudSuccess(`Akun admin "${adminToDelete.username}" berhasil dihapus.`);
    setAdminToDelete(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* LEFT COLUMN: GANTI PASSWORD FORM (1 COL) */}
      <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-indigo-600" />
            <span>Ganti Kata Sandi Saya</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Perbarui kata sandi akun admin Anda ({currentAdmin.username}) secara berkala.
          </p>
        </div>

        {passwordSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{passwordSuccess}</span>
          </div>
        )}

        {passwordError && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{passwordError}</span>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wide mb-1">
              Kata Sandi Saat Ini <span className="text-rose-500">*</span>
            </label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Masukkan password saat ini"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wide mb-1">
              Kata Sandi Baru <span className="text-rose-500">*</span>
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimal 5 karakter"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wide mb-1">
              Konfirmasi Kata Sandi Baru <span className="text-rose-500">*</span>
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Ulangi password baru"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              required
            />
          </div>

          <div className="pt-2">
            <button
              id="btn-submit-change-password"
              type="submit"
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-xs transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Simpan Kata Sandi Baru</span>
            </button>
          </div>
        </form>
      </div>

      {/* RIGHT COLUMN: DAFTAR AKUN ADMIN (2 COLS) */}
      <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h2 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <UserCog className="w-5 h-5 text-indigo-600" />
              <span>Manajemen Akun Administrator & Pengawas</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Kelola daftar user yang memiliki hak akses mengawasi ujian dan mengatur bank soal.
            </p>
          </div>

          <button
            id="btn-add-new-admin"
            type="button"
            onClick={openCreateModal}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
          >
            <UserPlus className="w-4 h-4" />
            <span>Tambah Admin Baru</span>
          </button>
        </div>

        {crudSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{crudSuccess}</span>
            </div>
            <button onClick={() => setCrudSuccess('')} className="p-1 hover:text-emerald-950">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {crudError && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{crudError}</span>
            </div>
            <button onClick={() => setCrudError('')} className="p-1 hover:text-rose-950">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Admins Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100/80 text-slate-700 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Nama Lengkap</th>
                <th className="py-3 px-4">Username</th>
                <th className="py-3 px-4">Hak Akses / Peran</th>
                <th className="py-3 px-4">Dibuat Pada</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {admins.map((adm) => {
                const isMe = adm.id === currentAdmin.id;
                return (
                  <tr key={adm.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4">
                      <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                        <span>{adm.name}</span>
                        {isMe && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-indigo-100 text-indigo-700">
                            Saya
                          </span>
                        )}
                      </div>
                      {adm.subject && adm.role === 'GURU_MAPEL' && (
                        <span className="inline-block mt-0.5 text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded font-medium">
                          Mapel: {adm.subject}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-600">
                      @{adm.username}
                    </td>
                    <td className="py-3 px-4">
                      <div className="space-y-0.5">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                          adm.role === 'SUPER_ADMIN'
                            ? 'bg-purple-100 text-purple-800 border border-purple-200'
                            : adm.role === 'GURU_MAPEL'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-blue-100 text-blue-800 border border-blue-200'
                        }`}>
                          {adm.role === 'SUPER_ADMIN' 
                            ? 'Super Admin' 
                            : adm.role === 'GURU_MAPEL' 
                            ? 'Guru Mata Pelajaran' 
                            : 'Pengawas Ujian'}
                        </span>
                        <div className="text-[10px] text-slate-400">
                          {adm.role === 'SUPER_ADMIN' 
                            ? 'Akses Penuh Semua Menu' 
                            : adm.role === 'GURU_MAPEL' 
                            ? 'Pantau, Jadwal, Bank Soal' 
                            : 'Pantau & Nilai Saja'}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {new Date(adm.createdAt).toLocaleDateString('id-ID')}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => openEditModal(adm)}
                          className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-indigo-600 transition cursor-pointer"
                          title="Edit Admin"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setAdminToDelete(adm)}
                          disabled={isMe}
                          className={`p-1.5 rounded-lg transition ${
                            isMe
                              ? 'text-slate-300 cursor-not-allowed'
                              : 'hover:bg-rose-50 text-slate-400 hover:text-rose-600 cursor-pointer'
                          }`}
                          title={isMe ? 'Tidak bisa menghapus akun sendiri' : 'Hapus Admin'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {adminToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden p-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-extrabold text-slate-900 text-base">Hapus Akun Administrator?</h3>
              <p className="text-xs text-slate-500">
                Apakah Anda yakin ingin menghapus akun <strong className="text-slate-900">{adminToDelete.name}</strong> (@{adminToDelete.username})? Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setAdminToDelete(null)}
                className="flex-1 py-2.5 px-4 border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-sm transition cursor-pointer"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE / EDIT ADMIN MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <h3 className="font-extrabold text-base">
                {editingAdmin ? `Edit Akun Admin: ${editingAdmin.username}` : 'Tambah Akun Admin Baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAdmin} className="p-6 space-y-4 text-xs">
              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Nama Lengkap Admin <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Misal: Dra. Hj. Siti Aminah"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Username <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formUsername}
                  onChange={(e) => setFormUsername(e.target.value)}
                  placeholder="Contoh: guru_biologi"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Kata Sandi {editingAdmin ? '(Kosongkan jika tidak diubah)' : <span className="text-rose-500">*</span>}
                </label>
                <input
                  type="password"
                  value={formPassword}
                  onChange={(e) => setFormPassword(e.target.value)}
                  placeholder={editingAdmin ? '•••••••• (Tetap)' : 'Masukkan password baru'}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Hak Akses / Peran
                </label>
                <select
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value as AdminRole)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  <option value="GURU_MAPEL">Guru Mata Pelajaran (Akses: Pantau & Nilai, Jadwal, Bank Soal)</option>
                  <option value="PENGAWAS">Pengawas Ujian (Akses: Pantau & Nilai Siswa Saja)</option>
                  <option value="SUPER_ADMIN">Super Admin (Akses Penuh Semua Menu & Pengawasan)</option>
                </select>
              </div>

              {formRole === 'GURU_MAPEL' && (
                <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2">
                  <div>
                    <label className="block font-bold text-emerald-900 uppercase tracking-wide mb-1 text-[11px]">
                      Mata Pelajaran yang Diampu (Opsional)
                    </label>
                    <input
                      type="text"
                      value={formSubject}
                      onChange={(e) => setFormSubject(e.target.value)}
                      placeholder="Contoh: Matematika, Fisika, Biologi, dll."
                      className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>
                  <p className="text-[11px] text-emerald-800 leading-relaxed">
                    ℹ️ <strong>Hak Akses Guru Mapel:</strong> Hanya dapat mengakses <strong>Pantau & Nilai</strong>, <strong>Jadwal Ujian</strong>, dan <strong>Bank Soal & Excel</strong>. Menu Kelola Admin & Log Aktivitas tidak dapat diakses.
                  </p>
                </div>
              )}

              {formRole === 'PENGAWAS' && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-[11px] text-blue-800 leading-relaxed">
                  ℹ️ <strong>Hak Akses Pengawas:</strong> Hanya dapat mengakses menu <strong>Pantau & Nilai</strong> secara real-time untuk memantau kehadiran, progress, dan pelanggaran siswa.
                </div>
              )}

              {formRole === 'SUPER_ADMIN' && (
                <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-[11px] text-purple-800 leading-relaxed">
                  ℹ️ <strong>Hak Akses Super Admin:</strong> Memiliki wewenang penuh atas seluruh menu, termasuk menambah/mengubah admin dan melihat audit log jejak aktivitas pembuat soal, jadwal, dan pengawas.
                </div>
              )}

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  id="btn-cancel-admin-modal"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold rounded-xl transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  id="btn-save-admin-submit"
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-xs transition cursor-pointer active:scale-95"
                >
                  {editingAdmin ? 'Simpan Perubahan' : 'Tambah Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
