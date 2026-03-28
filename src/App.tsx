import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Book, ClipboardList, Users, Plus, ChevronLeft, Search, Tag, Trash2, Edit2, Check, Copy, ShoppingCart, X, ArrowRight, RefreshCw, Dices } from 'lucide-react';
import { Dish, Order, Space } from './types';

const TopBar = ({ onRefreshInspiration }: { onRefreshInspiration?: () => void }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const getTitle = () => {
    if (location.pathname === '/') return '双人食记';
    if (location.pathname === '/library') return '私家菜单';
    if (location.pathname === '/orders') return '下单记忆';
    if (location.pathname === '/space') return '共享空间';
    if (location.pathname === '/order-editor') return '记录下单';
    if (location.pathname === '/dish-editor') return '录入菜品';
    if (location.pathname.startsWith('/dish/')) return '菜品详情';
    if (location.pathname.startsWith('/dish-editor/')) return '编辑菜品';
    return '美食空间';
  };

  const isMainTab = ['/', '/library', '/orders', '/space'].includes(location.pathname);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-xl z-50 border-b border-gray-100/50 flex items-center h-12 px-4 max-w-md mx-auto shadow-[0_1px_10px_rgba(0,0,0,0.02)]">
      <div className="flex-1 flex items-center">
        {!isMainTab && (
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-900 active:opacity-50 transition-opacity">
            <ChevronLeft size={22} />
          </button>
        )}
      </div>
      <h1 className="text-[16px] font-black text-gray-900 tracking-tight absolute left-1/2 -translate-x-1/2">{getTitle()}</h1>
      <div className="flex-1 flex justify-end">
        <div className="flex items-center gap-3 bg-white/50 border border-gray-200/60 rounded-full px-3 py-1 h-7">
          <button className="flex gap-1 items-center px-0.5">
            <div className="w-1 h-1 bg-gray-900 rounded-full" />
            <div className="w-1.5 h-1.5 bg-gray-900 rounded-full" />
            <div className="w-1 h-1 bg-gray-900 rounded-full" />
          </button>
          <div className="w-px h-3 bg-gray-200" />
          <button className="px-0.5 flex items-center justify-center">
            <div className="w-3.5 h-3.5 rounded-full border-2 border-gray-900 flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-gray-900" />
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};

const Navigation = () => {
  const location = useLocation();
  const navItems = [
    { path: '/', icon: Home, label: '首页' },
    { path: '/library', icon: Book, label: '菜谱' },
    { path: '/orders', icon: ClipboardList, label: '记录' },
    { path: '/space', icon: Users, label: '我的' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-gray-100/50 px-6 py-2 flex justify-between items-center z-50 max-w-md mx-auto pb-safe shadow-[0_-1px_10px_rgba(0,0,0,0.02)]">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className="flex flex-col items-center gap-0.5 flex-1 active:opacity-70 transition-opacity"
          >
            <div className={`p-1 transition-all duration-300 ${isActive ? 'text-orange-500 scale-110' : 'text-gray-400'}`}>
              <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            <span className={`text-[10px] font-bold ${isActive ? 'text-orange-500' : 'text-gray-400'}`}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
};

const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="pt-16 pb-24 px-4 max-w-md mx-auto min-h-screen bg-[#f7f7f7]">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </div>
  );
};

// --- Page Components ---

const HomeView = ({ dishes, onRefresh, refreshTrigger }: { dishes: Dish[], onRefresh: () => void, refreshTrigger: number }) => {
  const [inspiration, setInspiration] = useState<Dish[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (dishes.length > 0) {
      const meatDishes = dishes.filter(d => (d.tags || []).includes('荤菜'));
      const vegDishes = dishes.filter(d => (d.tags || []).includes('素菜'));
      
      const shuffledMeat = [...meatDishes].sort(() => 0.5 - Math.random());
      const shuffledVeg = [...vegDishes].sort(() => 0.5 - Math.random());
      
      const selectedMeat = shuffledMeat.slice(0, 2);
      const selectedVeg = shuffledVeg.slice(0, 1);
      
      let result = [...selectedMeat, ...selectedVeg];
      
      if (result.length < 3) {
        const remaining = dishes.filter(d => !result.find(r => r.id === d.id));
        const shuffledRemaining = [...remaining].sort(() => 0.5 - Math.random());
        result = [...result, ...shuffledRemaining.slice(0, 3 - result.length)];
      }
      
      setInspiration(result);
    } else {
      setInspiration([]);
    }
  }, [dishes, refreshTrigger]);

  return (
    <PageWrapper>
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">今日灵感</h2>
          <p className="text-gray-400 text-xs font-bold mt-1">看看今天吃点什么好呢？</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => navigate('/library')}
            className="p-2.5 bg-white rounded-full shadow-sm border border-gray-100 text-gray-400 active:text-orange-500 transition-colors"
          >
            <Search size={18} />
          </button>
        </div>
      </div>

      <div className="space-y-4 mb-10">
        {inspiration.length > 0 ? (
          inspiration.map((dish, index) => (
            <Link key={dish.id} to={`/dish/${dish.id}`}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white rounded-[28px] overflow-hidden shadow-sm border border-gray-100 flex h-32 group"
              >
                <div className="w-32 h-full bg-gray-50 shrink-0 relative overflow-hidden">
                  {dish.imageUrl ? (
                    <img src={dish.imageUrl} alt={dish.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <Book size={24} />
                    </div>
                  )}
                  <div className="absolute top-2 left-2">
                    <span className="text-[9px] bg-black/40 backdrop-blur-md text-white px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
                      {index === 2 ? '素' : '荤'}
                    </span>
                  </div>
                </div>
                <div className="flex-1 p-4 flex flex-col justify-center">
                  <h3 className="text-gray-900 font-black text-lg mb-1 group-hover:text-orange-500 transition-colors">{dish.name}</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {dish.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="text-[10px] bg-orange-50 text-orange-400 px-2 py-0.5 rounded-lg font-bold">{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="w-12 flex items-center justify-center text-gray-300 group-hover:text-orange-300 transition-colors">
                  <ChevronLeft size={20} className="rotate-180" />
                </div>
              </motion.div>
            </Link>
          ))
        ) : (
          <div className="bg-white rounded-[32px] p-10 text-center border-2 border-dashed border-gray-100">
            <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-gray-300">
              <Plus size={28} />
            </div>
            <p className="text-gray-400 font-bold text-sm mb-6">还没有录入菜品哦</p>
            <Link to="/dish-editor" className="inline-flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-2xl font-black shadow-sm shadow-orange-200/30 text-sm">
              <Plus size={18} /> 立即录入
            </Link>
          </div>
        )}
      </div>

      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-black text-gray-900 tracking-tight">全部菜谱</h2>
          <Link to="/library" className="text-orange-500 text-xs font-black flex items-center gap-1 bg-orange-50 px-3 py-1.5 rounded-full">
            查看更多 <ArrowRight size={12} />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {dishes.slice(0, 4).map((dish, index) => (
            <Link key={dish.id} to={`/dish/${dish.id}`}>
              <motion.div 
                whileTap={{ scale: 0.96 }}
                className="bg-white p-2.5 rounded-[24px] border border-gray-100 shadow-sm"
              >
                <div className="aspect-square bg-gray-50 rounded-[18px] mb-2 overflow-hidden">
                   {dish.imageUrl ? (
                     <img src={dish.imageUrl} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center text-gray-200">
                       <Book size={20} />
                     </div>
                   )}
                </div>
                <p className="font-black text-xs truncate text-gray-800 px-1">{dish.name}</p>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* Floating Random Button */}
      <motion.button
        onClick={onRefresh}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        whileTap={{ scale: 0.9, rotate: 180 }}
        className="fixed bottom-28 right-6 w-14 h-14 bg-orange-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-orange-200/40 z-40 active:scale-90 transition-transform"
      >
        <Dices size={28} />
      </motion.button>
    </PageWrapper>
  );
};

const LibraryView = ({ dishes, cart, onAddToCart, onRemoveFromCart, onSaveOrder, onClearCart, showToast }: { dishes: Dish[], cart: string[], onAddToCart: (id: string) => void, onRemoveFromCart: (id: string) => void, onSaveOrder: (data: Partial<Order>) => void, onClearCart: () => void, showToast: (msg: string, type?: 'success' | 'error') => void }) => {
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState('全部');
  const [showCart, setShowCart] = useState(false);
  const navigate = useNavigate();

  const allTags = ['全部', ...Array.from(new Set(dishes.flatMap(d => d.tags || [])))];
  const filteredDishes = dishes.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase()) || (d.ingredients || []).some(i => i.toLowerCase().includes(search.toLowerCase()));
    const matchesTag = selectedTag === '全部' || (d.tags || []).includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const cartDishes = dishes.filter(d => cart.includes(d.id));

  const handleQuickOrder = () => {
    if (cart.length === 0) return;
    onSaveOrder({
      dishIds: cart,
      orderTime: new Date().toISOString(),
      userName: '我'
    });
    onClearCart();
    setShowCart(false);
    navigate('/orders');
  };

  return (
    <PageWrapper>
      <div className="mb-6">
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="搜索菜名、食材..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-100/80 border-none rounded-[20px] py-3 pl-12 pr-6 focus:outline-none focus:bg-white focus:ring-2 focus:ring-orange-500/10 transition-all font-bold text-sm placeholder:text-gray-400"
          />
        </div>
      </div>
      
      <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar items-center">
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-5 py-2 rounded-full text-xs font-black whitespace-nowrap transition-all ${
                selectedTag === tag ? 'bg-orange-500 text-white shadow-sm shadow-orange-200/30' : 'bg-white text-gray-400 border border-gray-100'
              }`}
            >
              {tag}
            </button>
          ))}
          <button 
            onClick={() => navigate('/dish-editor')}
            className="px-4 py-2 rounded-full text-xs font-black whitespace-nowrap bg-orange-50 text-orange-500 border border-dashed border-orange-200 flex items-center gap-1"
          >
            <Plus size={14} /> 录入
          </button>
        </div>

      {filteredDishes.length > 0 ? (
        <div className="grid grid-cols-2 gap-3">
          <AnimatePresence>
            {filteredDishes.map((dish, index) => (
              <motion.div
                layout
                key={dish.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="bg-white p-2.5 rounded-[28px] border border-gray-100 shadow-sm relative group"
              >
                <Link to={`/dish/${dish.id}`}>
                  <div className="aspect-square bg-gray-50 rounded-[20px] mb-3 overflow-hidden">
                    {dish.imageUrl ? (
                      <img src={dish.imageUrl} alt={dish.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-200">
                        <Book size={28} />
                      </div>
                    )}
                  </div>
                  <h3 className="font-black text-gray-900 text-sm mb-1.5 truncate px-1">{dish.name}</h3>
                  <div className="flex flex-wrap gap-1 px-1">
                    {(dish.tags || []).slice(0, 2).map(tag => (
                      <span key={tag} className="text-[8px] bg-gray-50 text-gray-400 px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider">{tag}</span>
                    ))}
                  </div>
                </Link>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    cart.includes(dish.id) ? onRemoveFromCart(dish.id) : onAddToCart(dish.id);
                  }}
                  className={`absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center shadow-md transition-all active:scale-90 ${
                    cart.includes(dish.id) ? 'bg-orange-500 text-white' : 'bg-white/90 backdrop-blur-md text-orange-500'
                  }`}
                >
                  {cart.includes(dish.id) ? <Check size={14} /> : <Plus size={14} />}
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="bg-white rounded-[32px] p-10 text-center border-2 border-dashed border-gray-100">
          <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-gray-300">
            <Search size={28} />
          </div>
          <p className="text-gray-400 font-bold text-sm">没有找到相关菜品</p>
          <button onClick={() => { setSearch(''); setSelectedTag('全部'); }} className="mt-4 text-orange-500 font-black text-xs">清除筛选</button>
        </div>
      )}

      {/* Floating Cart Button */}
      <AnimatePresence>
        {cart.length > 0 && (
          <motion.button
            initial={{ scale: 0, y: 20, x: '-50%' }}
            animate={{ scale: 1, y: 0, x: '-50%' }}
            exit={{ scale: 0, y: 20, x: '-50%' }}
            onClick={() => setShowCart(true)}
            className="fixed bottom-28 left-1/2 bg-gray-900 text-white px-5 py-3.5 rounded-full flex items-center gap-3 shadow-xl z-40 active:scale-95 transition-transform"
          >
            <ShoppingCart size={18} />
            <span className="font-black text-xs">已选 {cart.length} 道菜</span>
            <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center text-[9px] font-black">
              {cart.length}
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Cart Overlay */}
      <AnimatePresence>
        {showCart && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCart(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[32px] p-6 z-[70] max-h-[70vh] overflow-y-auto shadow-2xl"
            >
              <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-6" />
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-black text-gray-900">待下单菜品</h2>
                <button onClick={() => setShowCart(false)} className="p-2 bg-gray-100 rounded-full text-gray-400 active:scale-90 transition-transform">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-3 mb-8">
                {cartDishes.map(dish => (
                  <div key={dish.id} className="flex items-center gap-3 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                    <div className="w-14 h-14 bg-gray-200 rounded-xl overflow-hidden flex-shrink-0">
                      {dish.imageUrl && <img src={dish.imageUrl} className="w-full h-full object-cover" referrerPolicy="no-referrer" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-black text-gray-900 text-sm truncate">{dish.name}</h4>
                      <p className="text-[10px] text-gray-400 truncate">{dish.tags.join(' · ')}</p>
                    </div>
                    <button onClick={() => onRemoveFromCart(dish.id)} className="text-gray-300 hover:text-red-500 p-2 active:scale-90 transition-transform">
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={handleQuickOrder}
                className="w-full bg-orange-500 text-white py-4 rounded-2xl font-black shadow-lg shadow-orange-200/30 flex items-center justify-center gap-2 active:scale-95 transition-transform"
              >
                立即下单 <ArrowRight size={18} />
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
};

const OrdersView = ({ orders, dishes }: { orders: Order[], dishes: Dish[] }) => {
  const [view, setView] = useState<'space' | 'mine'>('space');

  return (
    <PageWrapper>
      <div className="flex bg-gray-100 p-1 rounded-2xl mb-6">
        <button
          onClick={() => setView('space')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all ${view === 'space' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400'}`}
        >
          空间记录
        </button>
        <button
          onClick={() => setView('mine')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all ${view === 'mine' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400'}`}
        >
          我的记录
        </button>
      </div>

      <div className="space-y-4">
        {orders.length > 0 ? (
          orders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] relative overflow-hidden group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500">
                    <Check size={20} strokeWidth={3} />
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900 text-lg leading-none mb-1">已下单</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      {new Date(order.orderTime).toLocaleString('zh-CN', { month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' })}
                    </p>
                  </div>
                </div>
                <div className="bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                  <span className="text-[10px] font-black text-gray-400">{order.userName}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {order.dishIds.map(id => {
                  const dish = dishes.find(d => d.id === id);
                  return (
                    <div key={id} className="flex items-center gap-2 bg-orange-50/50 px-3 py-2 rounded-2xl border border-orange-100/30">
                      <div className="w-1.5 h-1.5 bg-orange-400 rounded-full" />
                      <span className="text-sm font-bold text-gray-800">
                        {dish?.name || '未知菜品'}
                      </span>
                    </div>
                  );
                })}
              </div>

              {order.notes && (
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 relative">
                  <div className="absolute top-0 left-4 -translate-y-1/2 bg-white px-2 text-[9px] font-black text-gray-300 uppercase tracking-widest">备注</div>
                  <p className="text-xs text-gray-600 font-medium leading-relaxed italic">“{order.notes}”</p>
                </div>
              )}
            </motion.div>
          ))
        ) : (
          <div className="bg-white rounded-[32px] p-12 text-center border-2 border-dashed border-gray-100">
            <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-gray-300">
              <ClipboardList size={28} />
            </div>
            <p className="text-gray-400 font-bold text-sm">暂无下单记录</p>
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

const SpaceView = ({ space, onJoin, onCreate }: { space: Space | null, onJoin: (id: string) => void, onCreate: (name: string) => void }) => {
  const [inviteCode, setInviteCode] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (space) {
      navigator.clipboard.writeText(space.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <PageWrapper>
      {space ? (
        <div className="space-y-6">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-8 rounded-[40px] text-center border border-gray-100 shadow-sm"
          >
            <div className="w-20 h-20 bg-orange-50 text-orange-500 rounded-[28px] flex items-center justify-center mx-auto mb-5">
              <Users size={40} />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-1">{space.name}</h2>
            <p className="text-gray-400 text-xs mb-8 font-bold">创建于 {new Date(space.createdAt).toLocaleDateString()}</p>
            
            <div className="bg-gray-50 p-5 rounded-[24px] border border-gray-100 flex items-center justify-between">
              <div className="text-left">
                <p className="text-[9px] text-gray-400 uppercase tracking-widest font-black mb-1">邀请码</p>
                <p className="text-xl font-mono font-black text-gray-900 tracking-wider">{space.id}</p>
              </div>
              <button
                onClick={handleCopy}
                className={`p-3 rounded-xl transition-all active:scale-90 ${copied ? 'bg-green-500 text-white shadow-md shadow-green-100' : 'bg-white text-gray-400 border border-gray-100 shadow-sm'}`}
              >
                {copied ? <Check size={20} /> : <Copy size={20} />}
              </button>
            </div>
          </motion.div>

          <div className="bg-white p-6 rounded-[28px] border border-gray-100 shadow-sm">
            <h3 className="font-black text-gray-900 mb-5 flex items-center gap-2 text-sm">
              <Users size={16} className="text-orange-500" /> 空间成员
            </h3>
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                <div className="w-12 h-12 rounded-full bg-orange-500 border-2 border-white flex items-center justify-center text-white font-black text-xs shadow-sm">我</div>
                <div className="w-12 h-12 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center text-white font-black text-xs shadow-sm">TA</div>
              </div>
              <p className="text-xs font-bold text-gray-500">2 位成员已连接</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-[28px] border border-gray-100 shadow-sm">
            <h3 className="font-black text-gray-900 mb-5 text-sm">加入已有空间</h3>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="输入 6 位邀请码"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-orange-500/10 font-black text-center text-lg tracking-widest placeholder:text-gray-300"
              />
              <button
                onClick={() => onJoin(inviteCode)}
                className="w-full bg-orange-500 text-white py-4 rounded-2xl font-black shadow-lg shadow-orange-200/30 active:scale-95 transition-transform"
              >
                立即加入
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
            <div className="relative flex justify-center text-[9px] font-black uppercase tracking-widest"><span className="bg-[#f7f7f7] px-4 text-gray-300">或者</span></div>
          </div>

          <button
            onClick={() => onCreate('我们的空间')}
            className="w-full bg-white border border-orange-500 text-orange-500 font-black py-4 rounded-[24px] shadow-sm active:bg-orange-50 transition-colors"
          >
            创建新空间
          </button>
        </div>
      )}
    </PageWrapper>
  );
};

const DishEditor = ({ dishes, onSave, showToast }: { dishes: Dish[], onSave: (data: Partial<Dish>) => void, showToast: (msg: string, type?: 'success' | 'error') => void }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const initialData = dishes.find(d => d.id === id);
  
  const [formData, setFormData] = useState<Partial<Dish>>({
    name: '',
    intro: '',
    ingredients: [],
    tags: [],
    imageUrl: ''
  });

  // Get all unique tags from existing dishes
  const existingTags = Array.from(new Set(dishes.flatMap(d => d.tags || [])));

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const [newTag, setNewTag] = useState('');
  const [newIngredient, setNewIngredient] = useState('');

  const toggleTag = (tag: string) => {
    const currentTags = formData.tags || [];
    if (currentTags.includes(tag)) {
      setFormData({ ...formData, tags: currentTags.filter(t => t !== tag) });
    } else {
      setFormData({ ...formData, tags: [...currentTags, tag] });
    }
  };

  const handleSave = () => {
    if (!formData.name) return showToast('请输入菜名', 'error');
    
    let finalData = { ...formData };
    // Auto-add pending tag if user forgot to click "+"
    if (newTag.trim() && !(finalData.tags || []).includes(newTag.trim())) {
      finalData.tags = [...(finalData.tags || []), newTag.trim()];
    }
    // Auto-add pending ingredient if user forgot to click "+"
    if (newIngredient.trim() && !(finalData.ingredients || []).includes(newIngredient.trim())) {
      finalData.ingredients = [...(finalData.ingredients || []), newIngredient.trim()];
    }
    
    onSave(finalData);
    navigate(-1);
  };

  return (
    <PageWrapper>
      <div className="space-y-8 pb-20">
        <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
          <div className="aspect-video bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 mb-8 overflow-hidden relative group">
            {formData.imageUrl ? (
              <img src={formData.imageUrl} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <>
                <Plus size={40} className="mb-2" />
                <span className="text-xs font-black uppercase tracking-widest">点击上传图片 (URL)</span>
              </>
            )}
            <input
              type="text"
              placeholder="图片 URL"
              value={formData.imageUrl || ''}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">菜名</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-orange-500/30 font-bold"
                placeholder="例如：红烧肉"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">简介</label>
              <textarea
                value={formData.intro}
                onChange={(e) => setFormData({ ...formData, intro: e.target.value })}
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-orange-500/30 min-h-[120px] font-medium"
                placeholder="简单描述一下这道菜..."
              />
            </div>
          </div>
        </div>

        {/* Tags Section */}
        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">分类标签</label>
          
          {/* Existing Tags Pool */}
          {existingTags.length > 0 && (
            <div className="mb-6">
              <p className="text-[9px] text-gray-300 font-black uppercase tracking-widest mb-3">从已有分类中选择：</p>
              <div className="flex flex-wrap gap-2">
                {existingTags.map(tag => {
                  const isSelected = (formData.tags || []).includes(tag);
                  return (
                    <motion.button
                      key={tag}
                      whileTap={{ scale: 0.9 }}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => toggleTag(tag)}
                      className={`px-4 py-2 rounded-xl text-xs font-black transition-all duration-200 flex items-center gap-1.5 ${
                        isSelected 
                          ? 'bg-orange-500 text-white shadow-md shadow-orange-200/50 ring-2 ring-orange-200 ring-offset-2' 
                          : 'bg-gray-50 text-gray-400 border border-gray-100 hover:border-orange-200 hover:text-orange-400'
                      }`}
                    >
                      {tag}
                      {isSelected && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}><Check size={12} /></motion.span>}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          )}

          <form 
            onSubmit={(e) => {
              e.preventDefault();
              if (newTag.trim()) {
                toggleTag(newTag.trim());
                setNewTag('');
              }
            }}
            className="flex gap-2 mb-4"
          >
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              className="flex-1 bg-gray-50 border-2 border-gray-100 rounded-xl px-5 py-3 text-sm font-bold focus:outline-none focus:border-orange-500/30"
              placeholder="添加新分类..."
            />
            <button
              type="submit"
              className="p-3 bg-gray-900 text-white rounded-xl active:scale-90 transition-transform flex items-center justify-center"
            >
              <Plus size={20} />
            </button>
          </form>

          <div className="flex flex-wrap gap-2">
            {(formData.tags || []).map((tag, i) => (
              <motion.span
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                key={tag}
                className="bg-orange-100 text-orange-600 px-4 py-2 rounded-xl text-sm font-black flex items-center gap-2"
              >
                {tag}
                <button onClick={() => toggleTag(tag)} className="text-orange-400 hover:text-orange-600">
                  <X size={14} />
                </button>
              </motion.span>
            ))}
          </div>
        </div>

        {/* Ingredients Section */}
        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">食材清单</label>
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              if (newIngredient.trim()) {
                setFormData({ ...formData, ingredients: [...(formData.ingredients || []), newIngredient.trim()] });
                setNewIngredient('');
              }
            }}
            className="flex gap-2 mb-4"
          >
            <input
              type="text"
              value={newIngredient}
              onChange={(e) => setNewIngredient(e.target.value)}
              className="flex-1 bg-gray-50 border-2 border-gray-100 rounded-xl px-5 py-3 text-sm font-bold focus:outline-none focus:border-orange-500/30"
              placeholder="添加食材..."
            />
            <button
              type="submit"
              className="p-3 bg-gray-900 text-white rounded-xl active:scale-90 transition-transform flex items-center justify-center"
            >
              <Plus size={20} />
            </button>
          </form>
          <div className="flex flex-wrap gap-2">
            {(formData.ingredients || []).map((ing, i) => (
              <motion.span
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                key={i}
                className="bg-gray-100 text-gray-800 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2"
              >
                {ing}
                <button onClick={() => setFormData({ ...formData, ingredients: formData.ingredients?.filter((_, idx) => idx !== i) })} className="text-gray-400 hover:text-red-500">
                  <X size={14} />
                </button>
              </motion.span>
            ))}
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-orange-500 text-white font-black py-5 rounded-[32px] shadow-md shadow-orange-200/30 text-lg active:scale-95 transition-transform"
        >
          保存菜品
        </button>
      </div>
    </PageWrapper>
  );
};

const DishDetail = ({ dishes, onDelete, showToast }: { dishes: Dish[], onDelete: (id: string) => void, showToast: (msg: string, type?: 'success' | 'error') => void }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const dish = dishes.find(d => d.id === id);

  if (!dish) return <PageWrapper><div className="text-center py-20 font-black text-gray-400">未找到菜品</div></PageWrapper>;

  return (
    <PageWrapper>
      <div className="bg-white rounded-[40px] overflow-hidden shadow-sm border border-gray-100 mb-8 mt-2">
        <div className="h-72 bg-gray-100 relative group">
          {dish.imageUrl ? (
            <img src={dish.imageUrl} alt={dish.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" referrerPolicy="no-referrer" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-200">
              <Book size={64} strokeWidth={1.5} />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          
          <div className="absolute top-4 right-4 flex gap-2">
            <button 
              onClick={() => navigate(`/dish-editor/${dish.id}`)}
              className="w-9 h-9 bg-white/90 backdrop-blur-md text-gray-700 rounded-full flex items-center justify-center shadow-sm active:scale-90 transition-transform"
            >
              <Edit2 size={16} />
            </button>
            <button 
              onClick={() => setShowDeleteConfirm(true)}
              className="w-9 h-9 bg-white/90 backdrop-blur-md text-red-500 rounded-full flex items-center justify-center shadow-sm active:scale-90 transition-transform"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {showDeleteConfirm && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowDeleteConfirm(false)}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
              />
              <motion.div
                initial={{ scale: 0.9, opacity: 0, x: '-50%', y: '-50%' }}
                animate={{ scale: 1, opacity: 1, x: '-50%', y: '-50%' }}
                exit={{ scale: 0.9, opacity: 0, x: '-50%', y: '-50%' }}
                className="fixed top-1/2 left-1/2 bg-white rounded-[32px] p-8 z-[110] w-[85%] max-w-sm shadow-2xl text-center"
              >
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Trash2 size={32} />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-2">确定要删除吗？</h3>
                <p className="text-gray-400 text-sm font-bold mb-8">删除后将无法找回这道菜品哦</p>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setShowDeleteConfirm(false)}
                    className="py-4 bg-gray-50 text-gray-400 rounded-2xl font-black text-sm active:scale-95 transition-transform"
                  >
                    取消
                  </button>
                  <button 
                    onClick={() => {
                      onDelete(dish.id);
                      showToast('菜品已删除');
                      navigate('/library');
                    }}
                    className="py-4 bg-red-500 text-white rounded-2xl font-black text-sm shadow-lg shadow-red-200/30 active:scale-95 transition-transform"
                  >
                    确定删除
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
        
        <div className="p-8 -mt-10 relative bg-white rounded-t-[40px]">
          <div className="flex flex-wrap gap-1.5 mb-4">
            {dish.tags.map(tag => (
              <span key={tag} className="bg-orange-50 text-orange-500 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider">{tag}</span>
            ))}
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-6 tracking-tight leading-tight">{dish.name}</h1>
          
          <div className="space-y-8">
            <section>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-3 bg-orange-500 rounded-full" />
                <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">菜品简介</h3>
              </div>
              <p className="text-gray-600 leading-relaxed font-medium text-base bg-gray-50/50 p-4 rounded-2xl border border-gray-100/50">
                {dish.intro || '这道菜还没有简介哦，快来补充吧～'}
              </p>
            </section>
            
            <section>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-3 bg-orange-500 rounded-full" />
                <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">食材清单</h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {dish.ingredients.map((ing, i) => (
                  <div key={i} className="bg-white border border-gray-100 px-4 py-3 rounded-2xl flex items-center gap-3 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                    <div className="w-1.5 h-1.5 bg-orange-200 rounded-full" />
                    <span className="text-sm font-bold text-gray-700">{ing}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center pb-10">
        <button 
          onClick={() => navigate(-1)}
          className="text-gray-400 text-xs font-bold flex items-center gap-1 hover:text-gray-600 transition-colors"
        >
          <ChevronLeft size={14} /> 返回上一页
        </button>
      </div>
    </PageWrapper>
  );
};

const OrderEditor = ({ dishes, onSave, onClearCart, showToast }: { dishes: Dish[], onSave: (data: Partial<Order>) => void, onClearCart: () => void, showToast: (msg: string, type?: 'success' | 'error') => void }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const preSelectedIds = location.state?.selectedIds || [];
  const [selectedDishes, setSelectedDishes] = useState<string[]>(preSelectedIds);
  const [notes, setNotes] = useState('');

  const handleSave = () => {
    if (selectedDishes.length === 0) return showToast('请至少选择一道菜', 'error');
    onSave({
      dishIds: selectedDishes,
      notes,
      orderTime: new Date().toISOString(),
      userName: '我'
    });
    onClearCart();
    navigate('/orders');
  };

  return (
    <PageWrapper>
      <div className="space-y-8">
        <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">选择菜品</label>
          <div className="grid grid-cols-2 gap-4">
            {dishes.map(dish => (
              <button
                key={dish.id}
                onClick={() => setSelectedDishes(prev => prev.includes(dish.id) ? prev.filter(id => id !== dish.id) : [...prev, dish.id])}
                className={`p-4 rounded-[24px] border-2 text-left transition-all relative overflow-hidden group ${
                  selectedDishes.includes(dish.id) ? 'bg-orange-500 border-orange-500 text-white shadow-sm shadow-orange-200/30' : 'bg-gray-50 border-gray-100 text-gray-700 hover:border-orange-200'
                }`}
              >
                <p className="font-black text-sm truncate">{dish.name}</p>
                {selectedDishes.includes(dish.id) && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-1 -right-1 bg-white text-orange-500 p-1 rounded-full">
                    <Check size={12} />
                  </motion.div>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">备注</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-orange-500/30 min-h-[140px] font-medium"
            placeholder="这次吃得怎么样？有什么特别想记下来的？"
          />
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-orange-500 text-white font-black py-5 rounded-[32px] shadow-md shadow-orange-200/30 text-lg"
        >
          保存记录
        </button>
      </div>
    </PageWrapper>
  );
};

// --- Main App Component ---

export default function App() {
  const [space, setSpace] = useState<Space | null>(null);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const location = useLocation();

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const initializing = useRef(false);

  const refreshInspiration = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  useEffect(() => {
    if (initializing.current) return;
    initializing.current = true;

    const savedSpaceId = localStorage.getItem('spaceId');
    const savedCart = localStorage.getItem('cart');
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedSpaceId) {
      fetchSpace(savedSpaceId);
    } else {
      // Auto-create a default space for new users
      createSpace('我们的美食空间');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (id: string) => setCart(prev => [...new Set([...prev, id])]);
  const removeFromCart = (id: string) => setCart(prev => prev.filter(i => i !== id));
  const clearCart = () => setCart([]);

  useEffect(() => {
    if (space) {
      fetchDishes();
      fetchOrders();
    }
  }, [space]);

  const fetchSpace = async (id: string) => {
    try {
      const res = await fetch(`/api/spaces/${id}`);
      const data = await res.json();
      if (data) {
        setSpace(data);
        localStorage.setItem('spaceId', data.id);
        setLoading(false); // 关键修复：成功获取空间后结束加载状态
      } else {
        // Space not found (likely server restarted), create a new one
        localStorage.removeItem('spaceId');
        createSpace('我们的美食空间');
      }
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  const createSpace = async (name: string) => {
    try {
      const res = await fetch('/api/spaces', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });
      const data = await res.json();
      setSpace(data);
      localStorage.setItem('spaceId', data.id);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchDishes = async () => {
    if (!space) return;
    try {
      const res = await fetch(`/api/dishes?spaceId=${space.id}`);
      const data = await res.json();
      setDishes(data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchOrders = async () => {
    if (!space) return;
    try {
      const res = await fetch(`/api/orders?spaceId=${space.id}`);
      const data = await res.json();
      setOrders(data);
    } catch (e) {
      console.error(e);
    }
  };

  const saveDish = async (dishData: Partial<Dish>) => {
    if (!space) {
      showToast('请先在“空间”页面创建或加入一个空间', 'error');
      return;
    }
    try {
      const isUpdate = !!dishData.id;
      const url = isUpdate ? `/api/dishes/${dishData.id}` : '/api/dishes';
      const method = isUpdate ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...dishData, spaceId: space.id })
      });
      const data = await res.json();
      
      setDishes(prev => {
        if (isUpdate) {
          return prev.map(d => d.id === data.id ? data : d);
        }
        return [data, ...prev];
      });
    } catch (e) {
      console.error(e);
      showToast('保存失败，请稍后重试', 'error');
    }
  };

  const deleteDish = async (id: string) => {
    try {
      await fetch(`/api/dishes/${id}`, { method: 'DELETE' });
      setDishes(prev => prev.filter(d => d.id !== id));
    } catch (e) {
      console.error(e);
      showToast('删除失败，请稍后重试', 'error');
    }
  };

  const saveOrder = async (orderData: Partial<Order>) => {
    if (!space) return;
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...orderData, spaceId: space.id })
      });
      const data = await res.json();
      setOrders(prev => [data, ...prev]);
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen bg-gray-50"><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full" /></div>;

  return (
    <div className="bg-[#f7f7f7] min-h-screen font-sans text-gray-900 selection:bg-orange-100 selection:text-orange-600">
      <TopBar onRefreshInspiration={refreshInspiration} />
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className={`fixed bottom-24 left-1/2 z-[200] px-6 py-3 rounded-2xl font-black text-sm shadow-xl flex items-center gap-2 min-w-[200px] justify-center ${
              toast.type === 'success' ? 'bg-gray-900 text-white' : 'bg-red-500 text-white'
            }`}
          >
            {toast.type === 'success' ? <Check size={18} /> : <X size={18} />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <Routes location={location}>
          <Route path="/" element={<HomeView dishes={dishes} onRefresh={refreshInspiration} refreshTrigger={refreshTrigger} />} />
          <Route path="/library" element={<LibraryView dishes={dishes} cart={cart} onAddToCart={addToCart} onRemoveFromCart={removeFromCart} onSaveOrder={saveOrder} onClearCart={clearCart} showToast={showToast} />} />
          <Route path="/orders" element={<OrdersView orders={orders} dishes={dishes} />} />
          <Route path="/space" element={<SpaceView space={space} onJoin={fetchSpace} onCreate={createSpace} />} />
          <Route path="/dish-editor" element={<DishEditor dishes={dishes} onSave={saveDish} showToast={showToast} />} />
          <Route path="/dish-editor/:id" element={<DishEditor dishes={dishes} onSave={saveDish} showToast={showToast} />} />
          <Route path="/dish/:id" element={<DishDetail dishes={dishes} onDelete={deleteDish} showToast={showToast} />} />
          <Route path="/order-editor" element={<OrderEditor dishes={dishes} onSave={saveOrder} onClearCart={clearCart} showToast={showToast} />} />
        </Routes>
      </AnimatePresence>
      <Navigation />
    </div>
  );
}

