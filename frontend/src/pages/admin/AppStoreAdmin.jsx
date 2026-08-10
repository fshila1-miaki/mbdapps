import React, { useState } from "react";
import Layout from "../../components/Layout";
import { useApp } from "../../context/AppContext";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "../../components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../components/ui/dialog";
import { Search } from "lucide-react";
import { toast } from "sonner";

const AppStoreAdmin = () => {
  const { storeApps, updateStoreApp, storeLayout, setStoreLayout } = useApp();
  const [search, setSearch] = useState("");
  const [statusF, setStatusF] = useState("any");
  const [typeF, setTypeF] = useState("any");
  const [editing, setEditing] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [layoutForm, setLayoutForm] = useState(storeLayout);

  const apps = storeApps.map((a) => ({ ...a, status: a.status || "Published", type: a.type || "Orbit-Pro" }));
  const filtered = apps.filter((a) =>
    (!search || a.name.toLowerCase().includes(search.toLowerCase())) &&
    (statusF === "any" || a.status === statusF) &&
    (typeF === "any" || a.type === typeF)
  );

  const togglePublish = () => {
    const ns = editing.status === "Published" ? "Unpublished" : "Published";
    updateStoreApp(editing.id, { status: ns });
    setEditing({ ...editing, status: ns });
    toast.success(ns);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <p className="text-xs uppercase tracking-widest text-[#2563EB] font-bold mb-1">Admin · App Store</p>
          <h1 className="text-3xl sm:text-4xl tracking-tighter font-bold" style={{ fontFamily: "'Outfit', sans-serif" }}>Store Administration</h1>
        </div>

        <Tabs defaultValue="apps">
          <TabsList><TabsTrigger value="apps">Application Management</TabsTrigger><TabsTrigger value="layout">Layout Management</TabsTrigger></TabsList>

          <TabsContent value="apps" className="pt-6 space-y-4">
            <div className="flex flex-col md:flex-row gap-3 items-end">
              <div className="relative flex-1 max-w-md"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><Input data-testid="store-admin-search" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" /></div>
              <Select value={statusF} onValueChange={setStatusF}><SelectTrigger className="md:w-40" data-testid="store-status"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="any">Any Status</SelectItem><SelectItem value="New">New</SelectItem><SelectItem value="Published">Published</SelectItem><SelectItem value="Unpublished">Unpublished</SelectItem></SelectContent></Select>
              <Select value={typeF} onValueChange={setTypeF}><SelectTrigger className="md:w-40" data-testid="store-type"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="any">Any Type</SelectItem><SelectItem value="Orbit-Pro">Orbit-Pro</SelectItem><SelectItem value="Orbit-Lite">Orbit-Lite</SelectItem></SelectContent></Select>
            </div>
            <div className="border border-slate-200 rounded-md overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="text-left p-3">App ID</th><th className="text-left p-3">Name</th><th className="text-left p-3">Category</th><th className="text-left p-3">Service Provider</th><th className="text-left p-3">Status</th></tr></thead>
                <tbody>{filtered.map((a) => <tr key={a.id} onClick={() => { setEditing({ ...a, status: a.status || "Published" }); setEditMode(false); }} data-testid={`store-row-${a.id}`} className="border-t border-slate-100 hover:bg-slate-50 cursor-pointer"><td className="p-3 font-mono text-xs">{a.id}</td><td className="p-3 font-medium">{a.name}</td><td className="p-3">{a.category}</td><td className="p-3">{a.developer}</td><td className="p-3"><span className={`text-xs font-bold uppercase px-2 py-0.5 rounded ${a.status === "Published" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>{a.status}</span></td></tr>)}</tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="layout" className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
              <div className="border border-slate-200 rounded-md p-5">
                <h3 className="font-semibold mb-3">Hero Banner</h3>
                <div className="space-y-3"><Input type="file" accept="image/*" /><div><Label>Title</Label><Input data-testid="hero-title" value={layoutForm.hero} onChange={(e) => setLayoutForm({ ...layoutForm, hero: e.target.value })} /></div></div>
              </div>
              <div className="border border-slate-200 rounded-md p-5">
                <h3 className="font-semibold mb-3">Sub Banner</h3>
                <div className="space-y-3"><Input type="file" accept="image/*" /><div><Label>Title</Label><Input data-testid="sub-title" value={layoutForm.sub} onChange={(e) => setLayoutForm({ ...layoutForm, sub: e.target.value })} /></div></div>
              </div>
            </div>
            <Button onClick={() => { setStoreLayout(layoutForm); toast.success("Layout saved"); }} className="mt-4 bg-[#2563EB] hover:bg-[#1D4ED8]" data-testid="layout-save">Save</Button>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto" data-testid="store-edit-dialog">
          <DialogHeader><DialogTitle>{editing?.name}</DialogTitle></DialogHeader>
          <Tabs defaultValue="basic">
            <TabsList><TabsTrigger value="basic">Basic</TabsTrigger><TabsTrigger value="upload">Upload</TabsTrigger></TabsList>
            <TabsContent value="basic" className="pt-4 space-y-3">
              <div><Label>Publish Name</Label><Input value={editing?.name || ""} disabled={!editMode} /></div>
              <div><Label>Category</Label><Input value={editing?.category || ""} disabled={!editMode} /></div>
              <div><Label>Description</Label><Textarea value={editing?.description || ""} disabled={!editMode} /></div>
              <div><Label>Instructions</Label><Textarea value={editing?.instructions || ""} disabled={!editMode} /></div>
              <div><Label>Charging</Label><Input value={editing?.cost || ""} disabled={!editMode} /></div>
              <Button variant="outline" onClick={() => { setEditMode(!editMode); if (editMode) toast.success("Saved"); }} data-testid="store-edit-toggle">{editMode ? "Save" : "Edit"}</Button>
            </TabsContent>
            <TabsContent value="upload" className="pt-4 space-y-3">
              <div><Label>Icon</Label><Input type="file" accept="image/*" /></div>
              <div><Label>Banner</Label><Input type="file" accept="image/*" /></div>
            </TabsContent>
          </Tabs>
          <DialogFooter><Button onClick={togglePublish} className="bg-[#2563EB] hover:bg-[#1D4ED8]" data-testid="toggle-publish">{editing?.status === "Published" ? "Unpublish" : "Publish"}</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default AppStoreAdmin;
