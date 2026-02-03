import { useCafe } from '../../context/CafeContext';

export default function AdminDashboard() {
    const { orders, updateOrderStatus } = useCafe();

    const pendingOrders = orders.filter(o => o.status !== 'completed' && o.status !== 'cancelled');

    return (
        <div className="min-h-screen bg-neutral-900 text-neutral-100 p-8 font-sans">
            <header className="flex justify-between items-center mb-10 border-b border-neutral-800 pb-6">
                <div>
                    <h1 className="text-4xl font-bold text-white tracking-tight">Kitchen Display System</h1>
                    <p className="text-neutral-500 mt-1">Live Order Management</p>
                </div>
                <div className="flex gap-4">
                    <div className="px-4 py-2 bg-neutral-800 rounded-lg border border-neutral-700">
                        <span className="text-neutral-400 text-sm uppercase tracking-wider font-semibold">Active Orders</span>
                        <div className="text-2xl font-bold text-yellow-500">{pendingOrders.length}</div>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
                {['pending', 'preparing', 'ready'].map(status => {
                    const statusOrders = pendingOrders.filter(o => o.status === status);
                    const statusConfig = {
                        pending: { color: 'border-blue-500', title: 'New Orders', dot: 'bg-blue-500' },
                        preparing: { color: 'border-yellow-500', title: 'In Progress', dot: 'bg-yellow-500' },
                        ready: { color: 'border-green-500', title: 'Ready to Serve', dot: 'bg-green-500' }
                    }[status];

                    return (
                        <div key={status} className="bg-neutral-800/50 rounded-2xl p-6 border border-neutral-700 flex flex-col h-full">
                            <div className="flex items-center gap-3 mb-6">
                                <div className={`w-3 h-3 rounded-full ${statusConfig.dot} shadow-[0_0_10px_currentColor]`} />
                                <h2 className="text-xl font-bold text-neutral-200">{statusConfig.title}</h2>
                                <span className="ml-auto bg-neutral-800 px-2 py-0.5 rounded text-sm text-neutral-400 border border-neutral-700">{statusOrders.length}</span>
                            </div>

                            <div className="space-y-4 overflow-y-auto pr-2 flex-1 scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-transparent">
                                {statusOrders.map(order => (
                                    <div key={order.id} className={`bg-neutral-900 p-5 rounded-xl border-l-4 ${statusConfig.color} shadow-lg group hover:bg-neutral-800 transition-colors`}>
                                        <div className="flex justify-between mb-4 border-b border-neutral-800 pb-2">
                                            <span className="font-bold text-lg text-white">Table {order.tableId}</span>
                                            <div className="text-right">
                                                <div className="text-xs text-neutral-400">Order #{order.id.slice(-4)}</div>
                                                <div className="text-xs text-neutral-500 font-mono">{new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                            </div>
                                        </div>
                                        <ul className="text-sm space-y-2 mb-6 text-neutral-300">
                                            {order.items.map((item, idx) => (
                                                <li key={idx} className="flex justify-between items-center">
                                                    <span><span className="font-bold text-white">{item.quantity}x</span> {item.name}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        <div className="flex gap-2">
                                            {status === 'pending' && (
                                                <button
                                                    onClick={() => updateOrderStatus(order.id, 'preparing')}
                                                    className="flex-1 bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white py-2 rounded-lg transitions-all font-medium text-sm border border-blue-600/30"
                                                >
                                                    Start Prep
                                                </button>
                                            )}
                                            {status === 'preparing' && (
                                                <button
                                                    onClick={() => updateOrderStatus(order.id, 'ready')}
                                                    className="flex-1 bg-yellow-600/20 hover:bg-yellow-600 text-yellow-400 hover:text-white py-2 rounded-lg transitions-all font-medium text-sm border border-yellow-600/30"
                                                >
                                                    Mark Ready
                                                </button>
                                            )}
                                            {status === 'ready' && (
                                                <button
                                                    onClick={() => updateOrderStatus(order.id, 'completed')}
                                                    className="flex-1 bg-green-600/20 hover:bg-green-600 text-green-400 hover:text-white py-2 rounded-lg transitions-all font-medium text-sm border border-green-600/30"
                                                >
                                                    Completed
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {statusOrders.length === 0 && (
                                    <div className="h-full flex flex-col items-center justify-center text-neutral-600 opacity-50">
                                        <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                        <p className="text-sm font-medium">No orders</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
