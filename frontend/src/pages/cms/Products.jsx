import React, { useState, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "sonner";
import { Plus, Trash2, Pencil, ExternalLink, Search, Upload, Download as DownloadIcon, AlertCircle } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { Th, Td, StatusPill, SlidePanel, Field, Input, Label, Textarea, Button, ImageDropzone } from "./_shared";

const Products = () => {
  const { app, triggerSave } = useOutletContext();
  const { appContent, updateAppContent, addCmsActivity } = useApp();
  const content = appContent[app.id] || {};
  const isRestaurant = app.kind === "restaurant";
  const sectionKey = isRestaurant ? "menuItems" : "products";
  const items = content[sectionKey] || [];
  const categories = content.categories || [];

  const [filter, setFilter] = useState("All");
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState(null);

  const filtered = useMemo(() => {
    let f = items;
    if (filter === "Active") f = f.filter((i) => i.status !== "Draft" && i.stock !== 0);
    else if (filter === "Draft") f = f.filter((i) => i.status === "Draft");
    else if (filter === "Out of Stock") f = f.filter((i) => i.stock === 0);
    else if (filter === "On Sale") f = f.filter((i) => i.salePrice);
    if (q) f = f.filter((i) => i.name?.toLowerCase().includes(q.toLowerCase()));
    return f;
  }, [items, filter, q]);

  const lowStock = isRestaurant ? [] : items.filter((p) => p.stock > 0 && p.stock <= 3);

  const save = (data) => {
    const updated = data.id ? items.map((i) => i.id === data.id ? data : i) : [...items, { ...data, id: `${sectionKey}-${Math.random().toString(36).slice(2, 8)}` }];
    triggerSave(() => {
      updateAppContent(app.id, sectionKey, updated);
      addCmsActivity(app.id, { type: sectionKey, text: `✏ ${data.id ? "Updated" : "Added"} ${isRestaurant ? "menu item" : "product"}: ${data.name}` });
      setEditing(null);
      toast.success(`✓ ${data.name} ${data.id ? "updated" : "added"} — changes are live on your site`);
    });
  };

  const del = (item) => {
    if (!window.confirm(`Delete ${item.name}?`)) return;
    triggerSave(() => {
      updateAppContent(app.id, sectionKey, items.filter((i) => i.id !== item.id));
      addCmsActivity(app.id, { type: sectionKey, text: `🗑 Deleted ${isRestaurant ? "menu item" : "product"}: ${item.name}` });
      toast.success(`Deleted ${item.name}`);
    });
  };

  const toggleAvailability = (item) => {
    save({ ...item, available: !item.available });
  };

  return (
    <div className="space-y-4" data-testid="cms-products">
      <div className="flex items-end justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-bold">{isRestaurant ? "Menu Items" : "Products"} ({items.length})</h1>
          <p className="text-xs text-slate-500">Manage your live catalog — changes reflect on site within seconds</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button data-testid="csv-import" variant="outline" onClick={() => toast.success("📥 CSV template downloaded")} className="gap-1 text-xs"><Upload size={12} /> Import CSV</Button>
          <Button data-testid="csv-export" variant="outline" onClick={() => toast.success("📤 Export started")} className="gap-1 text-xs"><DownloadIcon size={12} /> Export CSV</Button>
          <Button data-testid="add-product" onClick={() => setEditing({})} className="bg-[#e11d48] hover:bg-[#be123c] gap-1"><Plus size={14} /> Add {isRestaurant ? "Item" : "Product"}</Button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 flex-wrap">
          {["All","Active","Draft","Out of Stock","On Sale"].map((f) => (
            <button key={f} onClick={() => setFilter(f)} data-testid={`filter-${f.toLowerCase().replace(/\s+/g, "-")}`}
              className={`text-xs px-3 py-1.5 rounded ${filter === f ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}>{f}</button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2 bg-slate-50 border border-slate-200 rounded px-2">
          <Search size={14} className="text-slate-400" />
          <Input data-testid="products-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search..." className="border-0 bg-transparent h-8 text-sm w-40" />
        </div>
      </div>

      {lowStock.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3" data-testid="stock-alerts">
          <div className="text-sm font-bold text-amber-800 flex items-center gap-1"><AlertCircle size={14} /> Stock Alerts</div>
          <ul className="text-xs text-amber-900 mt-1 space-y-0.5">
            {lowStock.map((p) => <li key={p.id}>{p.name} — {p.stock === 0 ? "Out of stock" : `${p.stock} items left`}</li>)}
          </ul>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full" data-testid="products-table">
            <thead className="bg-slate-50">
              <tr>
                <Th>Image</Th><Th>Name</Th><Th>Category</Th><Th>Price</Th>
                {!isRestaurant && <Th>Stock</Th>}
                {isRestaurant && <Th>Available</Th>}
                <Th>Status</Th><Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && <tr><Td className="text-center text-slate-400" colSpan={7}>No items found</Td></tr>}
              {filtered.map((p) => (
                <tr key={p.id} data-testid={`product-row-${p.id}`}>
                  <Td>
                    <div className="w-10 h-10 rounded overflow-hidden" style={{ background: p.image ? `url(${p.image}) center/cover` : `linear-gradient(135deg,${app.color},#f59e0b)` }} />
                  </Td>
                  <Td><div className="font-semibold">{p.name}</div><div className="text-[10px] text-slate-400">{p.id}</div></Td>
                  <Td>{p.category}</Td>
                  <Td>
                    {p.salePrice ? <div><span className="line-through text-slate-400 text-xs">৳{p.price}</span> <span className="font-bold text-rose-600">৳{p.salePrice}</span></div> : <span className="font-bold">৳{p.price}</span>}
                  </Td>
                  {!isRestaurant && <Td><span className={p.stock === 0 ? "text-rose-600 font-bold" : p.stock <= 3 ? "text-amber-600 font-bold" : ""}>{p.stock}</span></Td>}
                  {isRestaurant && <Td>
                    <button onClick={() => toggleAvailability(p)} data-testid={`toggle-avail-${p.id}`} className={`px-2 py-1 rounded text-[10px] font-bold ${p.available ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                      {p.available ? "Available" : "Sold Out"}
                    </button>
                  </Td>}
                  <Td><StatusPill status={p.stock === 0 ? "Out of Stock" : (p.status || "Active")} /></Td>
                  <Td>
                    <div className="flex items-center gap-1">
                      <button data-testid={`edit-product-${p.id}`} onClick={() => setEditing(p)} className="p-1.5 hover:bg-slate-100 rounded text-slate-600"><Pencil size={13} /></button>
                      <button data-testid={`del-product-${p.id}`} onClick={() => del(p)} className="p-1.5 hover:bg-rose-50 rounded text-rose-600"><Trash2 size={13} /></button>
                      <button onClick={() => window.open(`https://${app.slug}.orbit.app`, "_blank")} className="p-1.5 hover:bg-slate-100 rounded text-slate-600"><ExternalLink size={13} /></button>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ProductEditor open={!!editing} onClose={() => setEditing(null)} initial={editing || {}} onSave={save} categories={categories} isRestaurant={isRestaurant} />
    </div>
  );
};

const ProductEditor = ({ open, onClose, initial, onSave, categories, isRestaurant }) => {
  const [v, setV] = useState(initial);
  React.useEffect(() => setV(initial), [initial]);
  const upd = (patch) => setV((p) => ({ ...p, ...patch }));

  return (
    <SlidePanel open={open} onClose={onClose} title={`${v.id ? "Edit" : "Add"} ${isRestaurant ? "Menu Item" : "Product"}`} description="Changes will be live on your site immediately"
      footer={<Button data-testid="save-product" onClick={() => onSave(v)} className="w-full bg-[#e11d48] hover:bg-[#be123c]">💾 Save Changes</Button>}>
      <Field label="Image" optional>
        <ImageDropzone testid="prod-image" value={v.image} onChange={(img) => upd({ image: img })} height="h-36" label="Drop primary image" />
      </Field>
      <Field label={isRestaurant ? "Item Name" : "Product Name"} required>
        <Input data-testid="prod-name" value={v.name || ""} onChange={(e) => upd({ name: e.target.value })} />
      </Field>
      <Field label="Category" required>
        <select data-testid="prod-category" value={v.category || ""} onChange={(e) => upd({ category: e.target.value })} className="w-full border border-slate-200 rounded h-9 text-sm px-2">
          <option value="">Select category</option>
          {categories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
        </select>
      </Field>
      <Field label="Short Description" optional>
        <Textarea data-testid="prod-desc" value={v.desc || ""} onChange={(e) => upd({ desc: e.target.value })} maxLength={150} className="text-sm" rows={2} />
      </Field>
      <div className="grid grid-cols-2 gap-2">
        <Field label="Price (BDT)" required><Input data-testid="prod-price" type="number" value={v.price || ""} onChange={(e) => upd({ price: Number(e.target.value) })} /></Field>
        <Field label="Sale Price (BDT)" optional><Input data-testid="prod-saleprice" type="number" value={v.salePrice || ""} onChange={(e) => upd({ salePrice: Number(e.target.value) || null })} /></Field>
      </div>
      {!isRestaurant && (
        <Field label="Stock Quantity" required>
          <Input data-testid="prod-stock" type="number" value={v.stock ?? ""} onChange={(e) => upd({ stock: Number(e.target.value) })} />
        </Field>
      )}
      <Field label="Status">
        <select data-testid="prod-status" value={v.status || "Active"} onChange={(e) => upd({ status: e.target.value })} className="w-full border border-slate-200 rounded h-9 text-sm px-2">
          <option>Active</option><option>Draft</option>
        </select>
      </Field>
    </SlidePanel>
  );
};

export default Products;
