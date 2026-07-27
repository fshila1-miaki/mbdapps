import React, { useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "sonner";
import { useApp } from "../../context/AppContext";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import StorageMeter from "../../components/cms/StorageMeter";
import { Upload, Copy, Pencil, Trash2 } from "lucide-react";

const FOLDERS = ["All","Banners","Products","Profiles","Pages","Miscellaneous"];

const MediaLibrary = () => {
  const { mediaLibrary, addMediaFile, removeMediaFile, renameMediaFile, computeStorageBytes } = useApp();
  const [folder, setFolder] = useState("All");
  const [q, setQ] = useState("");
  const fileRef = useRef(null);

  const onFiles = (files) => {
    Array.from(files || []).forEach((file) => {
      if (!/^image\//.test(file.type)) return;
      const reader = new FileReader();
      reader.onload = (e) => addMediaFile({ name: file.name, dataUrl: e.target.result, size: file.size, folder: folder === "All" ? "Miscellaneous" : folder });
      reader.readAsDataURL(file);
    });
    toast.success(`✓ ${files.length} file(s) uploaded to Orbit Cloud`);
  };

  const filtered = mediaLibrary.filter((m) => (folder === "All" || m.folder === folder) && (!q || m.name?.toLowerCase().includes(q.toLowerCase())));

  return (
    <div className="space-y-4" data-testid="cms-media">
      <div className="flex items-end justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-bold">Media Library</h1>
          <p className="text-xs text-slate-500">Central place for all uploaded images and assets</p>
        </div>
        <div className="flex gap-2 items-center">
          <Input data-testid="media-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search files..." className="w-40 h-9 text-sm" />
          <Button data-testid="upload-files" onClick={() => fileRef.current?.click()} className="bg-[#e11d48] hover:bg-[#be123c] gap-1"><Upload size={14} /> Upload Files</Button>
          <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => onFiles(e.target.files)} />
        </div>
      </div>

      <StorageMeter usedBytes={computeStorageBytes()} />

      <div className="flex items-center gap-1 flex-wrap">
        {FOLDERS.map((f) => <button key={f} onClick={() => setFolder(f)} data-testid={`folder-${f.toLowerCase()}`} className={`text-xs px-3 py-1.5 rounded ${folder === f ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}>{f}</button>)}
      </div>

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); onFiles(e.dataTransfer.files); }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 bg-white border-2 border-dashed border-slate-300 rounded-xl p-3 min-h-[200px]"
        data-testid="media-grid"
      >
        {filtered.length === 0 && <div className="col-span-full text-center py-8 text-sm text-slate-400">Drop files here or click Upload</div>}
        {filtered.map((m) => (
          <div key={m.id} data-testid={`media-${m.id}`} className="group relative bg-slate-50 border border-slate-200 rounded-lg overflow-hidden">
            <div className="aspect-square" style={{ background: `url(${m.dataUrl}) center/cover` }} />
            <div className="p-1.5 text-[10px]">
              <div className="font-bold truncate">{m.name}</div>
              <div className="text-slate-400">{(m.size / 1024).toFixed(0)} KB</div>
            </div>
            <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
              <button onClick={() => { navigator.clipboard?.writeText(m.dataUrl).then(() => toast.success("URL copied")); }} className="bg-white/90 p-1 rounded shadow"><Copy size={10} /></button>
              <button onClick={() => { const n = prompt("Rename", m.name); if (n) renameMediaFile(m.id, n); }} className="bg-white/90 p-1 rounded shadow"><Pencil size={10} /></button>
              <button onClick={() => { if (window.confirm("Delete file?")) { removeMediaFile(m.id); toast.success("Deleted"); } }} className="bg-rose-500 text-white p-1 rounded shadow"><Trash2 size={10} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MediaLibrary;
