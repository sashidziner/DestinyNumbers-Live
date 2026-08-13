import { imgUrl } from '../lib/utils';
import { PRODUCT_IMAGE_MAP } from '../lib/productsData';
import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, Plus, MapPin, X, Home, ShoppingBag, ArrowLeft, CreditCard } from 'lucide-react';
import { BRAND_DATA } from '../lib/constants';
import { useSEO } from '../lib/useSEO';

const RAZORPAY_KEY = 'rzp_live_Yu7vn36pcctsMV'; // Replace with your Razorpay Key ID

interface CartItem {
  product: { id: string; name: string; price: number; image: string; category: string };
  quantity: number;
}

interface DeliveryAddress {
  id: string;
  name: string;
  phone: string;
  address: string;
}

const CART_KEY = 'destiny_products_cart';

export default function Checkout() {
  useSEO({
    title: 'Checkout | Destiny Numbers',
    description: 'Complete your purchase securely at Destiny Numbers by Dr. Arun Poovaiah.',
    keywords: 'destiny numbers checkout, secure checkout, order confirmation',
  });
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [deliveryAddresses, setDeliveryAddresses] = useState<DeliveryAddress[]>([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({ name: '', phone: '', address: '' });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_KEY);
      if (saved) setCart(JSON.parse(saved));
    } catch {}
  }, []);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  const handleRazorpayPayment = () => {
    const options = {
      key: RAZORPAY_KEY,
      amount: cartTotal * 100, // in paise
      currency: 'INR',
      name: 'Destiny Numbers',
      description: `Order — ${totalItems} item${totalItems > 1 ? 's' : ''}`,
      image: imgUrl('/assets/img/navbar-logo-main.jpg'),
      prefill: {
        name: deliveryAddresses[0]?.name || '',
        contact: deliveryAddresses[0]?.phone || '',
      },
      notes: {
        address: deliveryAddresses.map((a, i) => `${i + 1}. ${a.name} | ${a.phone} | ${a.address}`).join(' || '),
        items: cart.map(i => `${i.product.name} x${i.quantity}`).join(', '),
      },
      theme: { color: '#1C3557' },
      handler: (response: any) => {
        alert(`✅ Payment successful!\nPayment ID: ${response.razorpay_payment_id}`);
        saveCart([]);
        navigate('/products');
      },
    };
    const rzp = new (window as any).Razorpay(options);
    rzp.on('payment.failed', (res: any) => {
      alert(`❌ Payment failed: ${res.error.description}`);
    });
    rzp.open();
  };

  const saveCart = (updated: CartItem[]) => {
    setCart(updated);
    localStorage.setItem(CART_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('destinyCartUpdate', { detail: updated }));
  };

  const updateQty = (id: string, delta: number) => {
    const updated = cart.map(item =>
      item.product.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ).filter(item => item.quantity > 0);
    saveCart(updated);
  };

  const removeItem = (id: string) => saveCart(cart.filter(i => i.product.id !== id));

  const cartTotal = useMemo(() => cart.reduce((acc, i) => acc + i.product.price * i.quantity, 0), [cart]);
  const totalItems = useMemo(() => cart.reduce((acc, i) => acc + i.quantity, 0), [cart]);

  const addAddress = () => {
    if (!newAddress.name.trim() || !newAddress.address.trim()) return;
    setDeliveryAddresses(prev => [...prev, { ...newAddress, id: Date.now().toString() }]);
    setNewAddress({ name: '', phone: '', address: '' });
    setShowAddressForm(false);
  };

  const handleOrder = () => {
    const phone = BRAND_DATA.phone.replace(/[^0-9]/g, '');
    const items = cart.map((item, i) =>
      `${i + 1}. ${item.product.name} (x${item.quantity}) — ₹${(item.product.price * item.quantity).toLocaleString('en-IN')}`
    ).join('\n');

    const addressText = deliveryAddresses.length > 0
      ? `\n\n📦 Delivery Address(es):\n` + deliveryAddresses.map((a, i) =>
          `${i + 1}. ${a.name}${a.phone ? ` | ${a.phone}` : ''}\n   ${a.address}`
        ).join('\n')
      : '\n\nPlease share delivery address and payment details.';

    const msg = encodeURIComponent(
      `Hello Destiny Numbers, I would like to order the following sacred products:\n\n${items}\n\nTotal: ₹${cartTotal.toLocaleString('en-IN')}${addressText}\n\nThank you!`
    );
    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <div className="bg-[#0D1B3E] py-6 text-center">
        <span className="text-[10px] tracking-[0.3em] font-bold uppercase text-[#C9A84C] opacity-80 block mb-1">Sacred Products</span>
        <h1 className="font-heading text-2xl md:text-3xl text-[#C9A84C] font-normal italic">Checkout</h1>
      </div>

      <div className="max-w-[1140px] mx-auto px-6 py-12">
        {cart.length === 0 ? (
          <div className="text-center py-24 space-y-6">
            <ShoppingBag className="w-16 h-16 text-[#E8E2D8] mx-auto" />
            <h2 className="text-2xl font-display italic text-[#1C3557]">Your cart is empty</h2>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-8 py-3 bg-[#1C3557] text-white text-[11px] font-bold uppercase tracking-widest hover:bg-[#12284c] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* Left — Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display italic text-[#1C3557]">
                  Your Items <span className="text-[#C9A84C]">({totalItems})</span>
                </h2>
                <Link to="/products" className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#1C3557]/50 hover:text-[#C9A84C] transition-colors">
                  <ArrowLeft className="w-3.5 h-3.5" /> Continue Shopping
                </Link>
              </div>

              {cart.map(item => (
                <motion.div
                  key={item.product.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex gap-5 bg-white border border-[#E8E2D8] p-4"
                >
                  <div className="w-24 h-24 bg-[#FAFAF8] border border-[#E8E2D8]/50 flex-shrink-0 overflow-hidden">
                    <img
                      src={PRODUCT_IMAGE_MAP[item.product.id] ?? item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-[#1C3557] text-sm">{item.product.name}</h4>
                        <span className="text-[10px] uppercase tracking-widest text-[#C9A84C] font-bold">{item.product.category}</span>
                      </div>
                      <button onClick={() => removeItem(item.product.id)} className="text-[#1C3557]/30 hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center border border-[#E8E2D8] bg-[#FAFAF8]">
                        <button onClick={() => updateQty(item.product.id, -1)} className="px-3 py-2 text-[#1C3557] hover:text-[#C9A84C] font-bold text-sm transition-colors">−</button>
                        <span className="px-4 text-sm font-bold text-[#1C3557] border-x border-[#E8E2D8]">{item.quantity}</span>
                        <button onClick={() => updateQty(item.product.id, 1)} className="px-3 py-2 text-[#1C3557] hover:text-[#C9A84C] font-bold text-sm transition-colors">+</button>
                      </div>
                      <span className="font-bold text-[#1C3557]">₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Delivery Addresses */}
              <div className="bg-white border border-[#E8E2D8] p-6 mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#1C3557] uppercase tracking-widest flex items-center gap-2">
                    <Home className="w-4 h-4 text-[#C9A84C]" /> Delivery Addresses
                  </h3>
                  <button
                    onClick={() => setShowAddressForm(v => !v)}
                    className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-[#C9A84C] hover:text-[#1C3557] transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Address
                  </button>
                </div>

                {deliveryAddresses.length > 0 && (
                  <div className="space-y-2">
                    {deliveryAddresses.map((a, i) => (
                      <div key={a.id} className="flex items-start gap-3 bg-[#F5ECD7]/50 border border-[#E8E2D8] p-3">
                        <MapPin className="w-4 h-4 text-[#C9A84C] mt-0.5 flex-shrink-0" />
                        <div className="flex-grow">
                          <p className="text-sm font-bold text-[#1C3557]">{a.name}{a.phone && ` · ${a.phone}`}</p>
                          <p className="text-xs text-[#1C3557]/60 mt-0.5">{a.address}</p>
                        </div>
                        <button onClick={() => setDeliveryAddresses(p => p.filter(x => x.id !== a.id))} className="text-[#1C3557]/30 hover:text-red-500 transition-colors">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <AnimatePresence>
                  {showAddressForm && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="border border-[#C9A84C]/40 bg-[#FAFAF8] p-4 space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input
                            type="text"
                            placeholder="Recipient Name *"
                            value={newAddress.name}
                            onChange={e => setNewAddress(p => ({ ...p, name: e.target.value }))}
                            className="w-full border border-[#E8E2D8] px-4 py-2.5 text-sm text-[#1C3557] outline-none focus:border-[#C9A84C] transition-colors bg-white"
                          />
                          <input
                            type="tel"
                            placeholder="Phone Number"
                            value={newAddress.phone}
                            onChange={e => setNewAddress(p => ({ ...p, phone: e.target.value }))}
                            className="w-full border border-[#E8E2D8] px-4 py-2.5 text-sm text-[#1C3557] outline-none focus:border-[#C9A84C] transition-colors bg-white"
                          />
                        </div>
                        <textarea
                          placeholder="Full Delivery Address (House No, Street, City, State, Pincode) *"
                          value={newAddress.address}
                          onChange={e => setNewAddress(p => ({ ...p, address: e.target.value }))}
                          rows={3}
                          className="w-full border border-[#E8E2D8] px-4 py-2.5 text-sm text-[#1C3557] outline-none focus:border-[#C9A84C] transition-colors resize-none bg-white"
                        />
                        <div className="flex gap-3">
                          <button
                            onClick={addAddress}
                            disabled={!newAddress.name.trim() || !newAddress.address.trim()}
                            className="flex-1 py-2.5 bg-[#1C3557] text-white text-[11px] font-bold uppercase tracking-widest hover:bg-[#12284c] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            Save Address
                          </button>
                          <button
                            onClick={() => { setShowAddressForm(false); setNewAddress({ name: '', phone: '', address: '' }); }}
                            className="px-5 py-2.5 border border-[#E8E2D8] text-[#1C3557]/50 text-[11px] font-bold hover:text-[#1C3557] transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {deliveryAddresses.length === 0 && !showAddressForm && (
                  <p className="text-xs text-[#1C3557]/40 italic">No address added yet. You can also share it on WhatsApp.</p>
                )}
              </div>
            </div>

            {/* Right — Order Summary */}
            <div className="space-y-4">
              <div className="bg-white border border-[#E8E2D8] p-6 space-y-4 sticky top-32">
                <h3 className="text-sm font-bold text-[#1C3557] uppercase tracking-widest">Order Summary</h3>

                <div className="space-y-2 text-sm text-[#1C3557]/70 border-b border-[#E8E2D8] pb-4">
                  {cart.map(item => (
                    <div key={item.product.id} className="flex justify-between">
                      <span className="truncate pr-2">{item.product.name} <span className="text-[#C9A84C]">×{item.quantity}</span></span>
                      <span className="font-bold text-[#1C3557] flex-shrink-0">₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between text-xs text-[#1C3557]/60">
                  <span>Sankalpa & Nakshatra Energization</span>
                  <span className="text-green-600 font-bold uppercase tracking-wider">Free</span>
                </div>

                <div className="flex justify-between items-center border-t border-[#E8E2D8] pt-4">
                  <span className="text-sm font-bold text-[#1C3557] uppercase tracking-wider">Total</span>
                  <span className="text-2xl font-bold text-[#C9A84C]">₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>

                {/* Razorpay Payment */}
                <button
                  onClick={handleRazorpayPayment}
                  className="w-full py-4 bg-[#C9A84C] hover:bg-[#b8932f] text-white transition-all flex items-center justify-center gap-3 font-bold text-[11px] tracking-widest uppercase shadow-lg"
                >
                  <CreditCard className="w-4 h-4" />
                  Pay Now — ₹{cartTotal.toLocaleString('en-IN')}
                </button>

                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-[#E8E2D8]" />
                  <span className="text-[10px] text-[#1C3557]/30 uppercase tracking-widest">or</span>
                  <div className="flex-1 h-px bg-[#E8E2D8]" />
                </div>

                {/* WhatsApp Order */}
                <button
                  onClick={handleOrder}
                  className="w-full py-4 bg-[#1C3557] text-white hover:bg-[#12284c] transition-all flex items-center justify-center gap-3 font-bold text-[11px] tracking-widest uppercase"
                >
                  Order via WhatsApp
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-[#25D366]">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.524 5.854L.057 23.57a.5.5 0 0 0 .611.624l5.906-1.498A11.955 11.955 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.9a9.9 9.9 0 0 1-5.031-1.374l-.36-.214-3.733.947.993-3.62-.235-.374A9.862 9.862 0 0 1 2.1 12C2.1 6.533 6.533 2.1 12 2.1c5.466 0 9.9 4.433 9.9 9.9 0 5.466-4.434 9.9-9.9 9.9z"/>
                  </svg>
                </button>

                {/* Chat with us */}
                <a
                  href={`https://wa.me/${BRAND_DATA.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 bg-[#25D366] text-white hover:bg-[#20b858] transition-all flex items-center justify-center gap-3 font-bold text-[11px] tracking-widest uppercase"
                >
                  Chat with us
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.524 5.854L.057 23.57a.5.5 0 0 0 .611.624l5.906-1.498A11.955 11.955 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.9a9.9 9.9 0 0 1-5.031-1.374l-.36-.214-3.733.947.993-3.62-.235-.374A9.862 9.862 0 0 1 2.1 12C2.1 6.533 6.533 2.1 12 2.1c5.466 0 9.9 4.433 9.9 9.9 0 5.466-4.434 9.9-9.9 9.9z"/>
                  </svg>
                </a>

                <p className="text-center text-[9px] text-[#1C3557]/30 tracking-widest uppercase">🔒 Secure & Private</p>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
