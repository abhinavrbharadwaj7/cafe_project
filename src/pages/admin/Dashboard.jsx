import { useCafe } from '../../context/CafeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ChefHat, CheckCircle, AlertCircle, RefreshCw, DollarSign, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
    const { orders, updateOrderStatus } = useCafe();

    // Stats Calculation
    const pendingOrders = orders.filter(o => o.status !== 'completed' && o.status !== 'cancelled');
    const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const completedCount = orders.filter(o => o.status === 'completed').length;

    const columns = [
        { id: 'pending', title: 'Queue', icon: <AlertCircle size={18} />, color: 'emerald-500', text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
        { id: 'preparing', title: 'Kitchen', icon: <ChefHat size={18} />, color: 'amber-500', text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
        { id: 'ready', title: 'Service', icon: <CheckCircle size={18} />, color: 'blue-500', text: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' }
    ];

    return (
        <div className="min-h-screen bg-stone-950 text-stone-100 font-sans selection:bg-amber-500/30">
            {/* Top Bar / Command Header */}
            <div className="sticky top-0 z-50 bg-stone-950/80 backdrop-blur-md border-b border-white/5 px-6 py-4">
                <div className="max-w-[1600px] mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center shadow-lg shadow-amber-500/20">
                            <span className="font-black text-stone-950 text-xl">L</span>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight text-white">COMMAND CENTER</h1>
                            <div className="flex items-center gap-2 text-xs font-mono text-stone-500">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span>SYSTEM ONLINE</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <StatCard label="Live Orders" value={pendingOrders.length} icon={<RefreshCw size={14} />} color="text-white" />
                        <StatCard label="Completed" value={completedCount} icon={<CheckCircle size={14} />} color="text-emerald-400" />
                        <StatCard label="Revenue" value={`₹${totalRevenue.toLocaleString()}`} icon={<DollarSign size={14} />} color="text-amber-400" />
                    </div>
                </div>
            </div>

            {/* Main Board */}
            <div className="p-6 h-[calc(100vh-80px)] overflow-hidden">
                <div className="max-w-[1600px] mx-auto h-full grid grid-cols-1 md:grid-cols-3 gap-6">
                    {columns.map(col => (
                        <div key={col.id} className="flex flex-col h-full bg-white/5 rounded-3xl border border-white/5 overflow-hidden ring-1 ring-white/5">
                            {/* Column Header */}
                            <div className={`p-4 border-b border-white/5 flex items-center justify-between ${col.bg}`}>
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg bg-stone-950/50 ${col.text} shadow-sm`}>
                                        {col.icon}
                                    </div>
                                    <h2 className="font-bold tracking-wide text-sm uppercase text-stone-300">{col.title}</h2>
                                </div>
                                <span className="px-2.5 py-0.5 rounded-full bg-stone-950/50 text-xs font-mono font-bold text-stone-400 border border-white/5">
                                    {orders.filter(o => o.status === col.id).length}
                                </span>
                            </div>

                            {/* Cards Area */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                                <AnimatePresence mode='popLayout'>
                                    {orders.filter(o => o.status === col.id).map(order => (
                                        <OrderCard
                                            key={order.id}
                                            order={order}
                                            updateStatus={updateOrderStatus}
                                            colColor={col.text}
                                            colBorder={col.border}
                                        />
                                    ))}
                                </AnimatePresence>
                                {orders.filter(o => o.status === col.id).length === 0 && (
                                    <div className="h-40 flex flex-col items-center justify-center text-stone-600 opacity-50 border-2 border-dashed border-white/5 rounded-2xl">
                                        <p className="text-xs font-mono uppercase tracking-widest">No Active Tasks</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function StatCard({ label, value, icon, color }) {
    return (
        <div className="bg-stone-900/50 border border-white/5 px-4 py-2 rounded-xl flex items-center gap-3 min-w-[140px]">
            <div className={`p-1.5 rounded-md bg-white/5 ${color} opacity-80`}>
                {icon}
            </div>
            <div>
                <p className="text-[10px] text-stone-500 uppercase tracking-wider font-bold">{label}</p>
                <p className={`text-lg font-mono font-bold leading-none ${color}`}>{value}</p>
            </div>
        </div>
    );
}

function OrderCard({ order, updateStatus, colColor, colBorder }) {
    const timeElapsed = Math.floor((new Date() - new Date(order.timestamp)) / 60000); // Minutes

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`bg-stone-900 border border-white/5 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-white/10 transition-colors cursor-default`}
        >
            {/* Neon ID Strip */}
            <div className="flex justify-between items-start mb-4">
                <div>
                    <span className={`font-mono text-2xl font-black tracking-tighter ${colColor}`}>#{order.id.slice(-4)}</span>
                    <p className="text-stone-500 text-xs font-bold uppercase tracking-wider mt-0.5">Table {order.tableId}</p>
                </div>
                <div className="flex flex-col items-end">
                    <div className="text-xs font-mono text-stone-400 flex items-center gap-1 bg-white/5 px-2 py-1 rounded-md">
                        <Clock size={10} />
                        {timeElapsed}m
                    </div>
                </div>
            </div>

            {/* Items List */}
            <div className="space-y-2 mb-6">
                {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-baseline gap-2 text-sm text-stone-300">
                        <span className={`font-bold font-mono ${colColor}`}>{item.quantity}x</span>
                        <span className="font-medium">{item.name}</span>
                    </div>
                ))}
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-white/5 flex gap-2">
                {order.status === 'pending' && (
                    <ActionButton onClick={() => updateStatus(order.id, 'preparing')} label="Start Prep" color="bg-amber-500 hover:bg-amber-400 text-stone-950" />
                )}
                {order.status === 'preparing' && (
                    <ActionButton onClick={() => updateStatus(order.id, 'ready')} label="Ready to Serve" color="bg-blue-500 hover:bg-blue-400 text-white" />
                )}
                {order.status === 'ready' && (
                    <ActionButton onClick={() => updateStatus(order.id, 'completed')} label="Complete" color="bg-emerald-500 hover:bg-emerald-400 text-stone-950" />
                )}
            </div>
        </motion.div>
    );
}

function ActionButton({ onClick, label, color }) {
    return (
        <button
            onClick={onClick}
            className={`w-full py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98] ${color}`}
        >
            {label}
        </button>
    );
}
