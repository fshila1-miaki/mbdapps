import React, { useState } from "react";
import Layout from "../../components/Layout";
import { useApp } from "../../context/AppContext";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "../../components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "../../components/ui/dialog";
import { Search, Plus, ArrowLeft, KeyRound, Lock, Trash2, Power } from "lucide-react";
import { toast } from "sonner";

const UserManagement = () => {
  const { systemUsers, setSystemUsers, appCreators, appstoreUsers } = useApp();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("any");
  const [editing, setEditing] = useState(null);
  const [editingCreator, setEditingCreator] = useState(null);
  const [viewingStore, setViewingStore] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const [newUser, setNewUser] = useState({ username: "", firstName: "", lastName: "", email: "", group: "" });
  const [errors, setErrors] = useState({});

  const filteredSystem = systemUsers.filter((u) =>
    (!search || u.firstName.toLowerCase().includes(search.toLowerCase()) || u.username.toLowerCase().includes(search.toLowerCase())) &&
    (statusFilter === "any" || u.status === statusFilter)
  );

  const addUser = () => {
    const e = {};
    if (!newUser.username) e.username = "Required";
    if (!newUser.firstName) e.firstName = "Required";
    if (!newUser.email) e.email = "Required";
    if (!newUser.group) e.group = "Required";
    setErrors(e);
    if (Object.keys(e).length) return;
    setSystemUsers((p) => [...p, { ...newUser, lastName: newUser.lastName || "", status: "Initial" }]);
    setNewUser({ username: "", firstName: "", lastName: "", email: "", group: "" });
    setAddOpen(false);
    toast.success("User added");
  };

  // EDIT VIEW
  if (editing) return (
    <Layout>
      <div className="space-y-6 max-w-3xl">
        <Button variant="outline" size="sm" onClick={() => setEditing(null)} data-testid="back-edit-user"><ArrowLeft size={14} className="mr-1" /> Back</Button>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl tracking-tighter font-bold" style={{ fontFamily: "'Outfit', sans-serif" }}>{editing.firstName} {editing.lastName}</h1>
          <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded ${editing.status === "Active" ? "bg-emerald-100 text-emerald-700" : editing.status === "Disabled" ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"}`}>{editing.status}</span>
        </div>
        <Tabs defaultValue="basic">
          <TabsList><TabsTrigger value="basic">Basic Details</TabsTrigger><TabsTrigger value="security">Security</TabsTrigger></TabsList>
          <TabsContent value="basic" className="pt-4 space-y-3">
            <div><Label>Username</Label><Input value={editing.username} disabled /></div>
            <div className="grid grid-cols-2 gap-3"><div><Label>First Name</Label><Input value={editing.firstName} disabled /></div><div><Label>Last Name</Label><Input value={editing.lastName} disabled /></div></div>
            <div><Label>Email</Label><Input value={editing.email} disabled /></div>
            <div><Label>User Group</Label><Input value={editing.group} disabled /></div>
            <div className="flex gap-2 pt-3 flex-wrap">
              <Button variant="outline" onClick={() => toast.success("User updated")} data-testid="edit-save">Edit</Button>
              <Button variant="outline" className="text-rose-600" onClick={() => { setSystemUsers((p) => p.filter((u) => u.username !== editing.username)); setEditing(null); toast.success("User deleted"); }} data-testid="user-delete"><Trash2 size={14} className="mr-1" /> Delete</Button>
              <Button variant="outline" onClick={() => { const ns = editing.status === "Active" ? "Disabled" : "Active"; setSystemUsers((p) => p.map((u) => u.username === editing.username ? { ...u, status: ns } : u)); setEditing({ ...editing, status: ns }); toast.success(`Now ${ns}`); }} data-testid="user-toggle"><Power size={14} className="mr-1" /> {editing.status === "Active" ? "Disable" : "Activate"}</Button>
              <Button variant="outline" onClick={() => toast.success("User unlocked")} data-testid="user-unlock"><Lock size={14} className="mr-1" /> Unlock</Button>
            </div>
          </TabsContent>
          <TabsContent value="security" className="pt-4">
            <div className="border border-slate-200 rounded-md p-5">
              <h3 className="font-semibold mb-3">Reset Password</h3>
              <Button onClick={() => toast.success("Reset link sent to user")} data-testid="reset-pwd"><KeyRound size={14} className="mr-1" /> Reset Password</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <p className="text-xs uppercase tracking-widest text-[#2563EB] font-bold mb-1">Admin · User Management</p>
          <h1 className="text-3xl sm:text-4xl tracking-tighter font-bold" style={{ fontFamily: "'Outfit', sans-serif" }}>Users</h1>
        </div>

        <Tabs defaultValue="system">
          <TabsList><TabsTrigger value="system" data-testid="tab-system">System Users</TabsTrigger><TabsTrigger value="creators" data-testid="tab-creators">App Creators</TabsTrigger><TabsTrigger value="store" data-testid="tab-store">Appstore Users</TabsTrigger></TabsList>

          <TabsContent value="system" className="pt-6 space-y-4">
            <div className="flex flex-col md:flex-row gap-3 md:items-end justify-between">
              <div className="flex flex-col md:flex-row gap-3 flex-1">
                <div className="relative flex-1 max-w-md"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><Input data-testid="user-search" placeholder="Search by name/username (required)" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" /></div>
                <Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger className="md:w-44" data-testid="user-status-filter"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="any">Any Status</SelectItem><SelectItem value="Initial">Initial</SelectItem><SelectItem value="Active">Active</SelectItem><SelectItem value="Disabled">Disabled</SelectItem></SelectContent></Select>
              </div>
              <Button data-testid="add-user-btn" onClick={() => setAddOpen(true)} className="bg-[#2563EB] hover:bg-[#1D4ED8]"><Plus size={14} className="mr-1" /> Add User</Button>
            </div>
            <div className="border border-slate-200 rounded-md overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="text-left p-3">Username</th><th className="text-left p-3">First Name</th><th className="text-left p-3">Last Name</th><th className="text-left p-3">Status</th><th className="text-left p-3">Group</th><th className="text-left p-3">Email</th></tr></thead>
                <tbody>{filteredSystem.map((u) => <tr key={u.username} onClick={() => setEditing(u)} data-testid={`user-row-${u.username}`} className="border-t border-slate-100 hover:bg-slate-50 cursor-pointer"><td className="p-3 font-mono text-xs">{u.username}</td><td className="p-3">{u.firstName}</td><td className="p-3">{u.lastName}</td><td className="p-3"><span className={`text-xs font-bold uppercase px-2 py-0.5 rounded ${u.status === "Active" ? "bg-emerald-100 text-emerald-700" : u.status === "Disabled" ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"}`}>{u.status}</span></td><td className="p-3">{u.group}</td><td className="p-3 text-slate-500">{u.email}</td></tr>)}{filteredSystem.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-slate-500">No users found.</td></tr>}</tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="creators" className="pt-6">
            <div className="border border-slate-200 rounded-md overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="text-left p-3">Username</th><th className="text-left p-3">Status</th><th className="text-left p-3">Profile</th><th className="text-left p-3">Email</th><th className="text-left p-3">Mobile</th></tr></thead>
                <tbody>{appCreators.map((u) => <tr key={u.username} onClick={() => setEditingCreator(u)} data-testid={`creator-row-${u.username}`} className="border-t border-slate-100 hover:bg-slate-50 cursor-pointer"><td className="p-3 font-mono text-xs">{u.username}</td><td className="p-3">{u.status}</td><td className="p-3">{u.profileStatus}</td><td className="p-3 text-slate-500">{u.email}</td><td className="p-3 font-mono">{u.mobile}</td></tr>)}</tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="store" className="pt-6">
            <div className="border border-slate-200 rounded-md overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="text-left p-3">First Name</th><th className="text-left p-3">Last Name</th><th className="text-left p-3">Mobile</th></tr></thead>
                <tbody>{appstoreUsers.map((u, i) => <tr key={i} onClick={() => setViewingStore(u)} data-testid={`store-user-${i}`} className="border-t border-slate-100 hover:bg-slate-50 cursor-pointer"><td className="p-3">{u.firstName}</td><td className="p-3">{u.lastName}</td><td className="p-3 font-mono">{u.mobile}</td></tr>)}</tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add User */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent data-testid="add-user-dialog">
          <DialogHeader><DialogTitle>Add System User</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>User Group *</Label><Select value={newUser.group} onValueChange={(v) => setNewUser({ ...newUser, group: v })}><SelectTrigger data-testid="new-group" className={errors.group ? "border-rose-500" : ""}><SelectValue placeholder="Choose group" /></SelectTrigger><SelectContent><SelectItem value="SuperAdmin">SuperAdmin</SelectItem><SelectItem value="Operator">Operator</SelectItem><SelectItem value="Reviewer">Reviewer</SelectItem><SelectItem value="Finance">Finance</SelectItem></SelectContent></Select></div>
            <div><Label>Username *</Label><Input data-testid="new-username" value={newUser.username} onChange={(e) => setNewUser({ ...newUser, username: e.target.value })} className={errors.username ? "border-rose-500" : ""} /></div>
            <div className="grid grid-cols-2 gap-3"><div><Label>First Name *</Label><Input data-testid="new-firstname" value={newUser.firstName} onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })} className={errors.firstName ? "border-rose-500" : ""} /></div><div><Label>Last Name</Label><Input value={newUser.lastName} onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })} /></div></div>
            <div><Label>Email *</Label><Input data-testid="new-email" type="email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} className={errors.email ? "border-rose-500" : ""} /></div>
          </div>
          <DialogFooter><Button data-testid="new-submit" onClick={addUser} className="bg-[#2563EB] hover:bg-[#1D4ED8]">Create User</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingCreator} onOpenChange={(o) => !o && setEditingCreator(null)}>
        <DialogContent><DialogHeader><DialogTitle>{editingCreator?.username}</DialogTitle><DialogDescription>App creator profile</DialogDescription></DialogHeader>
          <div className="space-y-3"><div><Label>Email</Label><Input value={editingCreator?.email || ""} disabled /></div><div><Label>Mobile</Label><Input value={editingCreator?.mobile || ""} /></div><Button onClick={() => { toast.success("Profile saved"); setEditingCreator(null); }} className="bg-[#2563EB] hover:bg-[#1D4ED8]" data-testid="creator-save">Save</Button></div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!viewingStore} onOpenChange={(o) => !o && setViewingStore(null)}>
        <DialogContent><DialogHeader><DialogTitle>{viewingStore?.firstName} {viewingStore?.lastName}</DialogTitle></DialogHeader>
          <div className="space-y-2 text-sm"><div className="flex justify-between"><span className="text-slate-500">Mobile</span><span className="font-mono">{viewingStore?.mobile}</span></div><p className="text-xs text-slate-500 italic">View only · App Store users cannot be edited.</p></div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default UserManagement;
