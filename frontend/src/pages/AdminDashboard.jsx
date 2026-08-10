import React from "react";
import Layout from "../components/Layout";
import Tile from "../components/Tile";
import { useApp } from "../context/AppContext";
import { Users, Store, BarChart3, ShieldCheck, Settings2 } from "lucide-react";

const AdminDashboard = () => {
  const { user, apps, systemUsers } = useApp();
  const stats = [
    { label: "Total Apps", value: apps.length },
    { label: "Pending", value: apps.filter((a) => a.status === "Pending Approval").length },
    { label: "System Users", value: systemUsers.length },
    { label: "Subscribers", value: "1.2M" },
  ];

  return (
    <Layout>
      <div className="space-y-10">
        <section>
          <p className="text-xs uppercase tracking-widest text-[#2563EB] font-bold mb-2">Admin Console</p>
          <h1 className="text-4xl sm:text-5xl tracking-tighter font-bold text-[#09090B]" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Operations Control, {user?.name?.split(" ")[0]}.
          </h1>
          <p className="text-slate-500 mt-2 max-w-2xl leading-relaxed">
            Approve apps, manage users, configure the App Store and oversee subscription tap controls.
          </p>
        </section>

        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <div key={i} className="border border-slate-200 rounded-md p-5 bg-white" data-testid={`admin-stat-${i}`}>
              <div className="text-xs uppercase tracking-widest text-slate-500 font-semibold">{s.label}</div>
              <div className="text-3xl mt-2 font-bold tracking-tight text-[#09090B]">{s.value}</div>
            </div>
          ))}
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-4 tracking-tight">Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Tile testid="admin-tile-users" to="/admin/users" title="User Management" description="Manage system users, app creators and App Store users." icon={Users} />
            <Tile testid="admin-tile-appstore" to="/admin/appstore" title="App Store" description="Curate published apps and manage banner layouts." icon={Store} />
            <Tile testid="admin-tile-reporting" to="/reports" title="Reporting" description="Platform-wide analytics across all apps and subscriptions." icon={BarChart3} />
            <Tile testid="admin-tile-tap" to="/admin/tap" title="Tap Admin" description="Subscription manager, governance, advertisements and promotions." icon={ShieldCheck} accent />
            <Tile testid="admin-tile-storeadmin" to="/admin/appstore" title="App Store Admin" description="Application management and layout configuration for the public store." icon={Settings2} />
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
