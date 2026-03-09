import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  UserPlus, 
  Trash2, 
  Edit3, 
  Shield, 
  Check, 
  X, 
  Undo2,
  Users
} from 'lucide-react';
import { Permission, User } from '../../shared/types/common.types';
import { PasswordField } from '../../shared/components/PasswordField';
import { useAuth } from '../../contexts/AuthContext';

interface AdministratorUserManagementProps {
  t: any;
  lang: string;
  isRtl: boolean;
  branches: any[];
  setActiveSubView: (view: string) => void;
  setNotification: (notif: any) => void;
}

const AVAILABLE_PERMISSIONS: { id: Permission; labelKey: string }[] = [
  { id: 'SUBSCRIPTION_PLAN_MANAGEMENT', labelKey: 'perm_subscription' },
  { id: 'OFFER_MANAGEMENT', labelKey: 'perm_offer' },
  { id: 'BRANCH_MANAGEMENT', labelKey: 'perm_branch' },
  { id: 'GIFT_CARD_MANAGEMENT', labelKey: 'perm_giftcard' },
  { id: 'PURCHASES_MANAGEMENT', labelKey: 'perm_purchases' },
  { id: 'PRICE_LIST_MANAGEMENT', labelKey: 'perm_pricelist' },
  { id: 'APPROVAL', labelKey: 'perm_approval' },
  { id: 'SALES', labelKey: 'perm_sales' },
];

export const AdministratorUserManagement: React.FC<AdministratorUserManagementProps> = ({
  t,
  lang,
  isRtl,
  branches,
  setActiveSubView,
  setNotification
}) => {
  const { user } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAdmins = async () => {
    if (!user?.id) return;
    try {
      const res = await fetch(`/api/business/admins?ownerId=${user.id}`);
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error('Error fetching admins:', err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchAdmins();
  }, [user?.id]);

  const [newUser, setNewUser] = useState({
    name: '',
    username: '',
    phone: '',
    password: '',
    permissions: ['DASHBOARD_ACCESS'] as Permission[],
    branchIds: [] as number[]
  });

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.phone || !newUser.password || newUser.branchIds.length === 0) {
      setNotification({ message: lang === 'en' ? 'Please fill in all fields and select at least one branch' : 'يرجى ملء جميع الحقول واختيار فرع واحد على الأقل', type: 'error' });
      return;
    }

    try {
      const res = await fetch('/api/business/admins/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ownerId: user?.id,
          ...newUser
        })
      });
      const data = await res.json();
      if (data.success) {
        setNotification({ message: lang === 'en' ? 'User added successfully' : 'تم إضافة المستخدم بنجاح', type: 'success' });
        setNewUser({
          name: '',
          username: '',
          phone: '',
          password: '',
          permissions: ['DASHBOARD_ACCESS'] as Permission[],
          branchIds: []
        });
        fetchAdmins();
      } else {
        setNotification({ message: data.error, type: 'error' });
      }
    } catch (err) {
      setNotification({ message: 'Error adding user', type: 'error' });
    }
  };

  const togglePermission = (perm: Permission) => {
    if (perm === 'DASHBOARD_ACCESS') return; // Mandatory

    setNewUser(prev => ({
      ...prev,
      permissions: prev.permissions.includes(perm)
        ? prev.permissions.filter(p => p !== perm)
        : [...prev.permissions, perm]
    }));
  };

  const deleteUser = async (id: number) => {
    try {
      const res = await fetch('/api/business/admins/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ownerId: user?.id,
          userId: id
        })
      });
      const data = await res.json();
      if (data.success) {
        setNotification({ message: lang === 'en' ? 'User deleted' : 'تم حذف المستخدم', type: 'success' });
        fetchAdmins();
      }
    } catch (err) {
      setNotification({ message: 'Error deleting user', type: 'error' });
    }
  };

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Add User Form */}
        <div className="lg:col-span-5">
          <div className="bg-zinc-900 p-6 rounded-2xl border border-white/5 shadow-xl sticky top-8">
            <div className="flex items-center gap-2 mb-6">
              <UserPlus className="w-5 h-5 text-brand-yellow" />
              <h2 className="text-lg font-bold text-white">{t.addUser}</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] text-zinc-400 mb-1">{t.name} *</label>
                <input 
                  type="text" 
                  value={newUser.name} 
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})} 
                  className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2.5 text-xs outline-none focus:ring-1 focus:ring-brand-yellow text-white" 
                />
              </div>
              <div>
                <label className="block text-[10px] text-zinc-400 mb-1">{t.username} *</label>
                <input 
                  type="text" 
                  value={newUser.username} 
                  onChange={(e) => setNewUser({...newUser, username: e.target.value})} 
                  className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2.5 text-xs outline-none focus:ring-1 focus:ring-brand-yellow text-white" 
                />
              </div>
              <div>
                <label className="block text-[10px] text-zinc-400 mb-1">{t.phone} *</label>
                <input 
                  type="text" 
                  value={newUser.phone} 
                  placeholder="05XXXXXXXX"
                  onChange={(e) => setNewUser({...newUser, phone: e.target.value})} 
                  className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2.5 text-xs outline-none focus:ring-1 focus:ring-brand-yellow text-white" 
                />
              </div>
              <div>
                <label className="block text-[10px] text-zinc-400 mb-1">{t.password} *</label>
                <input 
                  type="password" 
                  value={newUser.password} 
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})} 
                  className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2.5 text-xs outline-none focus:ring-1 focus:ring-brand-yellow text-white" 
                />
              </div>

              <div className="pt-2">
                <label className="block text-[10px] text-zinc-400 mb-3 uppercase tracking-wider font-bold">{t.branchManagement} *</label>
                <div className="flex flex-wrap gap-2">
                  {branches.map(branch => (
                    <button
                      key={branch.id}
                      onClick={() => {
                        setNewUser(prev => ({
                          ...prev,
                          branchIds: prev.branchIds.includes(branch.id)
                            ? prev.branchIds.filter(id => id !== branch.id)
                            : [...prev.branchIds, branch.id]
                        }));
                      }}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all border ${
                        newUser.branchIds.includes(branch.id)
                          ? 'bg-brand-yellow text-zinc-950 border-brand-yellow'
                          : 'bg-zinc-950 text-zinc-500 border-white/10 hover:border-white/20'
                      }`}
                    >
                      {branch.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <label className="block text-[10px] text-zinc-400 mb-3 uppercase tracking-wider font-bold">{t.permissions}</label>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                  {/* Mandatory Permission */}
                  <div className="flex items-center justify-between p-3 bg-zinc-950/50 rounded-lg border border-brand-yellow/20 opacity-80">
                    <span className="text-xs text-zinc-300">{t.dashboardAccess}</span>
                    <div className="w-5 h-5 rounded bg-brand-yellow flex items-center justify-center">
                      <Check className="w-3 h-3 text-zinc-950" />
                    </div>
                  </div>

                  {AVAILABLE_PERMISSIONS.map((perm) => (
                    <div 
                      key={perm.id}
                      onClick={() => togglePermission(perm.id)}
                      className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                        newUser.permissions.includes(perm.id) 
                          ? 'bg-zinc-800 border-brand-yellow/30' 
                          : 'bg-zinc-950 border-white/5 hover:border-white/10'
                      }`}
                    >
                      <span className="text-xs text-zinc-400">{t[perm.labelKey] || perm.id}</span>
                      <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                        newUser.permissions.includes(perm.id)
                          ? 'bg-brand-yellow border-brand-yellow'
                          : 'bg-transparent border-white/20'
                      }`}>
                        {newUser.permissions.includes(perm.id) && <Check className="w-3 h-3 text-zinc-950" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => setNewUser({name: '', username: '', phone: '', password: '', permissions: ['DASHBOARD_ACCESS'], branchIds: []})} 
                  className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white py-3 rounded-xl font-bold text-xs transition-all border border-white/5"
                >
                  {t.cancellation}
                </button>
                <button 
                  onClick={handleAddUser}
                  className="flex-1 bg-brand-yellow hover:bg-yellow-400 text-zinc-950 py-3 rounded-xl font-bold text-xs transition-all shadow-lg shadow-yellow-500/10"
                >
                  {t.addUser}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* User List Table */}
        <div className="lg:col-span-7">
          <div className="bg-zinc-900 p-8 rounded-2xl border border-white/5 shadow-xl min-h-[600px]">
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-3">
                <Users className="w-6 h-6 text-brand-yellow" />
                <h2 className="text-xl font-bold text-white">{t.userAccountManagement}</h2>
              </div>
              <span className="text-xs text-zinc-500">{users.length} {t.businesses}</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-[11px] text-center border-collapse">
                <thead>
                  <tr className="bg-zinc-950 text-zinc-400 border-b border-white/5">
                    <th className="p-4 font-bold text-right">{t.name}</th>
                    <th className="p-4 font-bold">{t.username}</th>
                    <th className="p-4 font-bold">{t.branchName}</th>
                    <th className="p-4 font-bold">{t.phone}</th>
                    <th className="p-4 font-bold">{t.role}</th>
                    <th className="p-4 font-bold">{t.procedures}</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                      <td className="p-4 text-right">
                        <div className="flex flex-col items-end">
                          <span className="font-bold text-white">{u.name}</span>
                          {u.role === 'BUSINESS_OWNER' && (
                            <span className="text-[9px] text-brand-yellow uppercase tracking-tighter">{t.owner}</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-zinc-400 font-mono">@{u.username}</td>
                      <td className="p-4">
                        <div className="flex flex-wrap justify-center gap-1">
                          {u.branchIds?.map((bid: number) => {
                            const b = branches.find(branch => branch.id === bid);
                            return b ? (
                              <span key={bid} className="px-1.5 py-0.5 bg-zinc-800 text-zinc-400 rounded text-[8px] border border-white/5">
                                {b.name}
                              </span>
                            ) : null;
                          })}
                        </div>
                      </td>
                      <td className="p-4 text-zinc-400">{u.phone}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-[9px] font-bold ${
                          u.role === 'BUSINESS_OWNER' 
                            ? 'bg-brand-yellow/10 text-brand-yellow' 
                            : 'bg-blue-500/10 text-blue-400'
                        }`}>
                          {u.role === 'BUSINESS_OWNER' ? t.owner : t.admin}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-1.5 text-zinc-500 hover:text-white transition-colors">
                            <Edit3 className="w-4 h-4" />
                          </button>
                          {u.role !== 'BUSINESS_OWNER' && (
                            <button 
                              onClick={() => deleteUser(u.id)}
                              className="p-1.5 text-zinc-500 hover:text-red-400 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {users.length === 0 && (
              <div className="flex flex-col items-center justify-center h-[400px] text-center space-y-4">
                <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center">
                  <Users className="w-8 h-8 text-zinc-600" />
                </div>
                <p className="text-zinc-500">{t.noWashData}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
