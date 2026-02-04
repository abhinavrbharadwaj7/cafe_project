import { createContext, useContext, useState, useEffect } from 'react';

const CafeContext = createContext();

const initialMenu = [
    {
        id: 'cat_1',
        name: 'Coffee Classics',
        items: [
            { id: '1', name: 'Espresso', price: 180, description: 'Rich and bold single shot.', image: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=800&q=80', available: true },
            { id: '2', name: 'Cappuccino', price: 240, description: 'Espresso with steamed milk foam.', image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=800&q=80', available: true },
            { id: '3', name: 'Latte', price: 260, description: 'Creamy espresso with steamed milk.', image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&q=80', available: true },
            { id: '3b', name: 'Mocha', price: 290, description: 'Espresso with chocolate and milk.', image: 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=800&q=80', available: true },
        ]
    },
    {
        id: 'cat_2',
        name: 'Specialty Brews',
        items: [
            { id: '4', name: 'Cold Brew', price: 280, description: 'Steeped for 24h, smooth finish.', image: 'https://images.unsplash.com/photo-1517701604599-bb29b5c73553?w=800&q=80', available: true },
            { id: '5', name: 'Matcha Latte', price: 320, description: 'Premium grade matcha green tea.', image: 'https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?w=800&q=80', available: true },
        ]
    },
    {
        id: 'cat_3',
        name: 'Bakery & Snacks',
        items: [
            { id: '6', name: 'Butter Croissant', price: 160, description: 'Flaky, buttery, authentic french style.', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&q=80', available: true },
            { id: '7', name: 'Avocado Toast', price: 450, description: 'Sourdough toast with fresh avocado.', image: 'https://images.unsplash.com/photo-1588137372308-15f75323ca8d?w=800&q=80', available: true },
        ]
    }
];

export function CafeProvider({ children }) {
    const [menu, setMenu] = useState(initialMenu);

    const [cart, setCart] = useState(() => {
        try {
            const saved = localStorage.getItem('cafe_cart');
            return saved ? JSON.parse(saved) : [];
        } catch (e) { return []; }
    });

    const [orders, setOrders] = useState(() => {
        try {
            const saved = localStorage.getItem('cafe_orders');
            return saved ? JSON.parse(saved) : [];
        } catch (e) { return []; }
    });

    useEffect(() => {
        localStorage.setItem('cafe_cart', JSON.stringify(cart));
    }, [cart]);

    useEffect(() => {
        localStorage.setItem('cafe_orders', JSON.stringify(orders));
    }, [orders]);

    const addToCart = (item, quantity = 1, variants = {}) => {
        setCart(prev => {
            const existing = prev.find(i => i.id === item.id && JSON.stringify(i.variants) === JSON.stringify(variants));
            if (existing) {
                return prev.map(i => i === existing ? { ...i, quantity: i.quantity + quantity } : i);
            }
            return [...prev, { ...item, quantity, variants, cartId: Date.now() }];
        });
    };

    const removeFromCart = (cartId) => {
        setCart(prev => prev.filter(item => item.cartId !== cartId));
    };

    const updateCartQuantity = (cartId, delta) => {
        setCart(prev => prev.map(item => {
            if (item.cartId === cartId) {
                return { ...item, quantity: Math.max(1, item.quantity + delta) };
            }
            return item;
        }));
    };

    const placeOrder = (tableId = 1) => {
        if (cart.length === 0) return null;
        const newOrder = {
            id: Date.now().toString(),
            tableId,
            items: [...cart],
            status: 'pending', // pending, preparing, ready, completed
            timestamp: new Date().toISOString(),
            total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        };
        setOrders(prev => [newOrder, ...prev]);
        setCart([]);
        return newOrder.id;
    };

    const updateOrderStatus = (orderId, status) => {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    };

    const updateMenuItem = (categoryId, updatedItem) => {
        setMenu(prev => prev.map(cat => {
            if (cat.id !== categoryId) return cat;
            return {
                ...cat,
                items: cat.items.map(i => i.id === updatedItem.id ? updatedItem : i)
            };
        }));
    };

    return (
        <CafeContext.Provider value={{
            menu,
            cart,
            orders,
            addToCart,
            removeFromCart,
            updateCartQuantity,
            placeOrder,
            updateOrderStatus,
            updateMenuItem
        }}>
            {children}
        </CafeContext.Provider>
    );
}

export const useCafe = () => useContext(CafeContext);
