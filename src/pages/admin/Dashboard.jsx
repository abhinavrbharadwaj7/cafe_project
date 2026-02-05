import { useCafe } from '../../context/CafeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ChefHat, CheckCircle, AlertCircle, RefreshCw, DollarSign, Activity } from 'lucide-react';
import LiveTimer from '../../components/ui/LiveTimer';

export default function AdminDashboard() {
    const { orders, updateOrderStatus } = useCafe();

    // Stats Calculation
    const pendingOrders = orders.filter(o => o.status !== 'completed' && o.status !== 'cancelled');
    const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const completedCount = orders.filter(o => o.status === 'completed').length;

    const columns = [
        { id: 'pending', title: 'New Orders', icon: <AlertCircle size={20} />, color: 'text-emerald-400', glow: 'shadow-emerald-500/20', border: 'border-emerald-500/20', bg: 'bg-emerald-500/5' },
        { id: 'preparing', title: 'In Kitchen', icon: <ChefHat size={20} />, color: 'text-amber-400', glow: 'shadow-amber-500/20', border: 'border-amber-500/20', bg: 'bg-amber-500/5' },
        { id: 'ready', title: 'Ready for Pickup', icon: <CheckCircle size={20} />, color: 'text-blue-400', glow: 'shadow-blue-500/20', border: 'border-blue-500/20', bg: 'bg-blue-500/5' }
    ];

    return (
        <div className="min-h-screen bg-[#050505] text-stone-100 font-sans selection:bg-amber-500/30 relative overflow-hidden">

            {/* Ambient Background Effects */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-emerald-900/10 via-stone-900/5 to-transparent pointer-events-none" />
            <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />

            {/* Floating Command Bar */}
            <div className="sticky top-6 z-50 px-6 mb-8">
                <div className="max-w-[1600px] mx-auto bg-stone-900/60 backdrop-blur-2xl border border-white/5 rounded-2xl px-6 py-4 shadow-2xl flex justify-between items-center ring-1 ring-white/5">
                    <div className="flex items-center gap-5">
                        <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                            <span className="font-black text-white text-2xl tracking-tighter">L.</span>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight text-white">KITCHEN OS <span className="text-stone-500 font-normal">v2.0</span></h1>
                            <div className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-500">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                                System Operational
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <StatCard label="Live Payload" value={pendingOrders.length} icon={<Activity size={16} />} color="text-white" />
                        <div className="w-px h-8 bg-white/5" />
                        <StatCard label="Daily Revenue" value={`₹${totalRevenue.toLocaleString()}`} icon={<DollarSign size={16} />} color="text-amber-400" />
                    </div>
                </div>
            </div>

            {/* Kanban Board */}
            <div className="px-6 pb-6 h-[calc(100vh-140px)]">
                <div className="max-w-[1600px] mx-auto h-full grid grid-cols-1 md:grid-cols-3 gap-8">
                    {columns.map((col, i) => (
                        <motion.div
                            key={col.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                            className={`flex flex-col h-full rounded-[2rem] border border-white/5 overflow-hidden relative group/col ${col.bg}`}
                        >
                            {/* Column Glow */}
                            <div className={`absolute inset-0 opacity-0 group-hover/col:opacity-100 transition-opacity duration-700 pointer-events-none bg-gradient-to-b from-white/5 to-transparent`} />

                            {/* Header */}
                            <div className="p-6 flex items-center justify-between relative z-10">
                                <div className="flex items-center gap-3">
                                    <h2 className={`text-lg font-black tracking-tight ${col.color}`}>{col.title}</h2>
                                    <span className="text-xs font-mono text-stone-500 bg-black/20 px-2 py-1 rounded-md border border-white/5">
                                        {orders.filter(o => o.status === col.id).length}
                                    </span>
                                </div>
                                <div className={`p-2 rounded-full bg-black/20 ${col.color} border border-white/5`}>
                                    {col.icon}
                                </div>
                            </div>

                            {/* Cards Container */}
                            <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-4 custom-scrollbar relative z-10">
                                <AnimatePresence mode='popLayout'>
                                    {orders.filter(o => o.status === col.id).map(order => (
                                        <OrderCard
                                            key={order.id}
                                            order={order}
                                            updateStatus={updateOrderStatus}
                                            config={col}
                                        />
                                    ))}
                                </AnimatePresence>
                                {orders.filter(o => o.status === col.id).length === 0 && (
                                    <div className="h-40 flex flex-col items-center justify-center text-stone-600 opacity-30">
                                        <p className="font-mono text-sm">-- NO DATA --</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function StatCard({ label, value, icon, color }) {
    return (
        <div className="flex items-center gap-4">
            <div className={`p-2.5 rounded-xl bg-stone-800/50 border border-white/5 ${color} shadow-inner`}>
                {icon}
            </div>
            <div>
                <p className="text-[10px] text-stone-500 uppercase tracking-widest font-bold mb-0.5">{label}</p>
                <p className={`text-xl font-black tracking-tight leading-none ${color}`}>{value}</p>
            </div>
        </div>
    );
}

function OrderCard({ order, updateStatus, config }) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            whileHover={{ scale: 1.02, y: -2 }}
            className={`
                bg-[#0A0A0A] border rounded-2xl p-5 relative overflow-hidden group cursor-default shadow-xl
                ${config.border} hover:border-opacity-50 transition-all duration-300
            `}
        >
            {/* Neon Glow on Hover */}
            <div className={`absolute -inset-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl ${config.bg}`} />

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-5">
                    <div>
                        <span className={`font-mono text-3xl font-black tracking-tighter ${config.color}`}>#{order.id.slice(-4)}</span>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500 bg-stone-900 px-2 py-0.5 rounded border border-white/5">Table {order.tableId}</span>
                        </div>
                    </div>
                    <div className="flex flex-col items-end">
                        <div className={`text-xs font-mono font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 border border-white/5 text-stone-400`}>
                            <Clock size={12} />
                            <LiveTimer timestamp={order.timestamp} />
                        </div>
                    </div>
                </div>

                {/* Items */}
                <div className="space-y-3 mb-6">
                    {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm group/item">
                            <div className="flex items-baseline gap-3">
                                <span className={`font-mono font-bold text-lg ${config.color} opacity-80`}>{item.quantity}</span>
                                <span className="font-medium text-stone-300 group-hover/item:text-white transition-colors">{item.name}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-white/5 flex gap-2">
                    {order.status === 'pending' && (
                        <ActionButton onClick={() => updateStatus(order.id, 'preparing')} label="Start Prep" baseColor="bg-amber-500" hoverColor="hover:bg-amber-400" textColor="text-black" />
                    )}
                    {order.status === 'preparing' && (
                        <ActionButton onClick={() => updateStatus(order.id, 'ready')} label="Ready" baseColor="bg-blue-500" hoverColor="hover:bg-blue-400" textColor="text-white" />
                    )}
                    {order.status === 'ready' && (
                        <ActionButton onClick={() => updateStatus(order.id, 'completed')} label="Complete" baseColor="bg-emerald-500" hoverColor="hover:bg-emerald-400" textColor="text-black" />
                    )}
                </div>
            </div>
        </motion.div>
    );
}

function ActionButton({ onClick, label, baseColor, hoverColor, textColor }) {
    return (
        <button
            onClick={onClick}
            className={`w-full py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg ${baseColor} ${hoverColor} ${textColor}`}
        >
            {label}
        </button>
    );
}
