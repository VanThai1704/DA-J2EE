const { useEffect, useState, useCallback } = React;

// ─── Constants ────────────────────────────────────────────────────────────────
const pages = [
  { key: "home", label: "🏠 Home" },
  { key: "catalog", label: "Catalog" },
  { key: "cart", label: "🛒 Cart" },
  { key: "checkout", label: "Checkout" },
  { key: "orders", label: "My Orders" },
  { key: "account", label: "Account" },
  { key: "admin", label: "Admin" }
];

const categories = ["Women", "Men", "Street", "Office", "Accessories", "Sale"];
const sizes = ["XS", "S", "M", "L", "XL"];
const colors = ["Black", "Ivory", "Stone", "Denim", "Olive"];
const sortOptions = ["Newest", "Price: Low to High", "Price: High to Low", "Best Sellers"];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatVND = (amount) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);

const api = {
  get: (url) => fetch(url).then((r) => r.json()),
  post: (url, body) =>
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then((r) => r.json()),
  put: (url, body) =>
    fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then((r) => r.json()),
  del: (url) => fetch(url, { method: "DELETE" }).then((r) => r.json()),
  patch: (url, body) =>
    fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then((r) => r.json()),
};

// ─── Spinner ─────────────────────────────────────────────────────────────────
function Spinner() {
  return <div className="spinner" aria-label="Loading" />;
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [message, onClose]);

  if (!message) return null;
  return (
    <div className={`toast toast-${type || "info"}`} onClick={onClose}>
      {type === "success" && "✅ "}
      {type === "error" && "❌ "}
      {type === "info" && "ℹ️ "}
      {message}
    </div>
  );
}

// ─── ProductCard ──────────────────────────────────────────────────────────────
function ProductCard({ product, variants, onAddToCart, user, onNavigate }) {
  const defaultVariant = variants && variants[0];
  const price = defaultVariant ? defaultVariant.price : null;
  const stock = defaultVariant ? defaultVariant.stock : 0;

  const handleAdd = () => {
    if (!user) {
      onNavigate("account");
      return;
    }
    if (!defaultVariant) return;
    onAddToCart(defaultVariant.id, 1);
  };

  return (
    <article className="product-card">
      <div className="thumb" style={{ background: "linear-gradient(135deg, #2d2d3a, #1a1a2e)" }}>
        {product && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#a78bfa", fontSize: "2rem" }}>
            👗
          </div>
        )}
        <div className="stock-badge" style={{ opacity: stock === 0 ? 1 : 0 }}>Hết hàng</div>
      </div>
      <div className="product-info">
        <div className="line l1" style={{ fontWeight: 600, color: "#e2e8f0", fontSize: "0.9rem" }}>
          {product ? product.name : "—"}
        </div>
        <div className="line l2" style={{ color: "#a78bfa", fontSize: "0.85rem", marginTop: "0.25rem" }}>
          {price ? formatVND(price) : "—"}
        </div>
        <div className="swatches">
          {variants && variants.slice(0, 3).map((v) => (
            <span key={v.id} title={v.color?.name || ""} />
          ))}
        </div>
      </div>
      <button
        type="button"
        className="btn-add-cart"
        onClick={handleAdd}
        disabled={stock === 0}
      >
        {stock === 0 ? "Hết hàng" : "🛒 Thêm vào giỏ"}
      </button>
    </article>
  );
}

// ─── HomePage ────────────────────────────────────────────────────────────────
function HomePage({ products, variants, onAddToCart, user, onNavigate }) {
  return (
    <section className="panel">
      <article className="hero">
        <div className="hero-copy">
          <p className="tag">NEW SEASON DROP</p>
          <h1>Thời trang hiện đại cho mọi phong cách</h1>
          <p>Khám phá bộ sưu tập mới nhất với chất lượng tốt nhất và phong cách độc đáo.</p>
          <div className="row">
            <button className="btn-main" type="button" onClick={() => onNavigate("catalog")}>
              Mua sắm ngay
            </button>
            <button className="ghost" type="button">Xem lookbook</button>
          </div>
        </div>
        <div className="hero-art">
          <div className="hero-icon">👗</div>
        </div>
      </article>

      <article className="category-strip">
        {categories.map((item) => (
          <button key={item} type="button" className="chip" onClick={() => onNavigate("catalog")}>
            {item}
          </button>
        ))}
      </article>

      <article className="promo-grid">
        <div className="promo-card" style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}>
          ⚡ Flash Sale
        </div>
        <div className="promo-card" style={{ background: "linear-gradient(135deg, #0ea5e9, #2563eb)" }}>
          ⭐ Top Rated
        </div>
        <div className="promo-card" style={{ background: "linear-gradient(135deg, #10b981, #059669)" }}>
          🆕 New In
        </div>
        <div className="promo-card" style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)" }}>
          🎁 Bundle Deals
        </div>
      </article>

      <h2 style={{ padding: "1rem 0 0.5rem", color: "#e2e8f0" }}>Sản phẩm nổi bật</h2>
      <article className="product-grid">
        {products.slice(0, 8).map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            variants={variants.filter((v) => v.product?.id === p.id)}
            onAddToCart={onAddToCart}
            user={user}
            onNavigate={onNavigate}
          />
        ))}
        {products.length === 0 &&
          Array.from({ length: 4 }).map((_, i) => (
            <article key={i} className="product-card skeleton">
              <div className="thumb" />
              <div className="line l1" />
              <div className="line l2" />
            </article>
          ))}
      </article>
    </section>
  );
}

// ─── CatalogPage ──────────────────────────────────────────────────────────────
function CatalogPage({ products, variants, onAddToCart, user, onNavigate }) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  const filtered = products.filter((p) => {
    const matchSearch = !search || p.name?.toLowerCase().includes(search.toLowerCase());
    const matchCat = !selectedCategory || p.category?.name === selectedCategory;
    return matchSearch && matchCat;
  });

  return (
    <section className="panel">
      <div className="toolbar">
        <input
          type="search"
          placeholder="🔍 Tìm sản phẩm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
          <option value="">Tất cả danh mục</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)}>
          <option value="">Kích cỡ</option>
          {sizes.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="layout-2">
        <aside className="card sidebar">
          <h3>Bộ lọc</h3>
          <p>Màu sắc</p>
          <div className="chips-inline">
            {colors.map((c) => (
              <button key={c} type="button" className="chip light">{c}</button>
            ))}
          </div>
          <p style={{ marginTop: "1rem" }}>Kích cỡ</p>
          <div className="chips-inline">
            {sizes.map((s) => (
              <button
                key={s}
                type="button"
                className={selectedSize === s ? "chip light selected" : "chip light"}
                onClick={() => setSelectedSize(selectedSize === s ? "" : s)}
              >
                {s}
              </button>
            ))}
          </div>
        </aside>
        <div className="product-grid">
          {filtered.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              variants={variants.filter((v) => v.product?.id === p.id)}
              onAddToCart={onAddToCart}
              user={user}
              onNavigate={onNavigate}
            />
          ))}
          {filtered.length === 0 && (
            <div className="notice" style={{ gridColumn: "1/-1" }}>
              Không tìm thấy sản phẩm nào.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── CartPage ────────────────────────────────────────────────────────────────
function CartPage({ user, cartCount, setCartCount, onNavigate }) {
  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const loadCart = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await api.get(`/api/carts/user/${user.id}/items`);
      setCartData(data);
      setCartCount((data.items || []).length);
    } catch (e) {
      setMessage("Lỗi tải giỏ hàng");
    } finally {
      setLoading(false);
    }
  }, [user, setCartCount]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const updateQty = async (itemId, qty) => {
    await api.put(`/api/carts/items/${itemId}/quantity`, { quantity: qty });
    loadCart();
  };

  const removeItem = async (itemId) => {
    await api.del(`/api/carts/items/${itemId}`);
    loadCart();
  };

  const clearCart = async () => {
    if (!window.confirm("Xóa tất cả sản phẩm trong giỏ hàng?")) return;
    await api.del(`/api/carts/user/${user.id}/clear`);
    loadCart();
  };

  if (!user) {
    return (
      <section className="panel">
        <div className="card centered-notice">
          <div style={{ fontSize: "4rem" }}>🛒</div>
          <h3>Vui lòng đăng nhập để xem giỏ hàng</h3>
          <button className="btn-main" type="button" onClick={() => onNavigate("account")}>
            Đăng nhập
          </button>
        </div>
      </section>
    );
  }

  const items = cartData?.items || [];
  const total = items.reduce((sum, item) => sum + Number(item.totalPrice || 0), 0);

  return (
    <section className="panel layout-2">
      <article className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3>🛒 Giỏ hàng ({items.length} sản phẩm)</h3>
          {items.length > 0 && (
            <button type="button" className="ghost small" onClick={clearCart}>
              Xóa tất cả
            </button>
          )}
        </div>

        {loading && <Spinner />}
        {message && <div className="notice error">{message}</div>}

        {items.length === 0 && !loading && (
          <div className="empty-cart">
            <div style={{ fontSize: "3rem" }}>🛍️</div>
            <p>Giỏ hàng trống</p>
            <button className="btn-main" type="button" onClick={() => onNavigate("catalog")}>
              Tiếp tục mua sắm
            </button>
          </div>
        )}

        <div className="cart-items">
          {items.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="cart-item-thumb">👗</div>
              <div className="cart-item-info">
                <div className="cart-item-name">
                  {item.productVariant?.product?.name || "Sản phẩm"}
                </div>
                <div className="cart-item-meta">
                  {item.productVariant?.color?.name && (
                    <span className="chip light small">{item.productVariant.color.name}</span>
                  )}
                  {item.productVariant?.size?.name && (
                    <span className="chip light small">{item.productVariant.size.name}</span>
                  )}
                </div>
                <div className="cart-item-price">
                  {formatVND(item.productVariant?.price || 0)} × {item.quantity}
                </div>
              </div>
              <div className="cart-item-controls">
                <div className="qty-control">
                  <button type="button" onClick={() => updateQty(item.id, item.quantity - 1)}>
                    −
                  </button>
                  <span>{item.quantity}</span>
                  <button type="button" onClick={() => updateQty(item.id, item.quantity + 1)}>
                    +
                  </button>
                </div>
                <div className="cart-item-total">{formatVND(item.totalPrice)}</div>
                <button type="button" className="remove-btn" onClick={() => removeItem(item.id)}>
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      </article>

      <article className="card">
        <h3>Tóm tắt đơn hàng</h3>
        <div className="summary-list">
          <p>Tạm tính <span>{formatVND(total)}</span></p>
          <p>Phí vận chuyển <span className="free">Miễn phí</span></p>
          <p className="total-row">Tổng cộng <span>{formatVND(total)}</span></p>
        </div>
        <button
          type="button"
          className="btn-main"
          disabled={items.length === 0}
          onClick={() => onNavigate("checkout")}
          style={{ width: "100%", marginTop: "1rem" }}
        >
          Tiến hành thanh toán →
        </button>
        <button
          type="button"
          className="ghost"
          style={{ width: "100%", marginTop: "0.5rem" }}
          onClick={() => onNavigate("catalog")}
        >
          Tiếp tục mua sắm
        </button>
      </article>
    </section>
  );
}

// ─── CheckoutPage ─────────────────────────────────────────────────────────────
function CheckoutPage({ user, onNavigate }) {
  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const [form, setForm] = useState({
    receiverName: user?.fullName || "",
    receiverPhone: user?.phone || "",
    shippingAddress: "",
    note: "",
    paymentMethod: "MOMO"
  });

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    api.get(`/api/carts/user/${user.id}/items`)
      .then(setCartData)
      .catch(() => setMessage({ text: "Lỗi tải giỏ hàng", type: "error" }))
      .finally(() => setLoading(false));
  }, [user]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!form.receiverName || !form.receiverPhone || !form.shippingAddress) {
      setMessage({ text: "Vui lòng điền đầy đủ thông tin giao hàng", type: "error" });
      return;
    }

    const items = cartData?.items || [];
    if (items.length === 0) {
      setMessage({ text: "Giỏ hàng trống!", type: "error" });
      return;
    }

    setPlacing(true);
    setMessage({ text: "", type: "" });

    try {
      if (form.paymentMethod === "MOMO") {
        const res = await api.post("/api/momo/create-payment", {
          userId: user.id,
          receiverName: form.receiverName,
          receiverPhone: form.receiverPhone,
          shippingAddress: form.shippingAddress,
          note: form.note
        });

        if (res.error) {
          throw new Error(res.error);
        }

        if (res.payUrl) {
          // Redirect to MoMo payment
          setMessage({ text: "Đang chuyển tới MoMo...", type: "success" });
          setTimeout(() => { window.location.href = res.payUrl; }, 1000);
        } else {
          setMessage({ text: `Tạo đơn thành công! Mã đơn: ${res.orderId}. Kết quả: ${res.message}`, type: "info" });
        }
      } else {
        // COD: create order directly
        const res = await api.post("/api/orders/create", {
          userId: user.id,
          receiverName: form.receiverName,
          receiverPhone: form.receiverPhone,
          shippingAddress: form.shippingAddress,
          note: form.note,
          paymentMethod: form.paymentMethod
        });
        if (res.error) throw new Error(res.error);
        setMessage({ text: "Đặt hàng thành công! Cảm ơn bạn.", type: "success" });
        setTimeout(() => onNavigate("orders"), 2000);
      }
    } catch (err) {
      setMessage({ text: "Lỗi: " + err.message, type: "error" });
    } finally {
      setPlacing(false);
    }
  };

  if (!user) {
    return (
      <section className="panel">
        <div className="card centered-notice">
          <h3>Vui lòng đăng nhập để thanh toán</h3>
          <button className="btn-main" type="button" onClick={() => onNavigate("account")}>
            Đăng nhập
          </button>
        </div>
      </section>
    );
  }

  const items = cartData?.items || [];
  const total = items.reduce((sum, i) => sum + Number(i.totalPrice || 0), 0);

  return (
    <section className="panel layout-2">
      <form onSubmit={handlePlaceOrder} style={{ display: "contents" }}>
        <article className="card">
          <h3>📦 Thông tin giao hàng</h3>

          {message.text && (
            <div className={`notice ${message.type}`}>{message.text}</div>
          )}

          <label>
            Tên người nhận *
            <input
              type="text"
              name="receiverName"
              value={form.receiverName}
              onChange={handleChange}
              placeholder="Họ và tên"
              required
            />
          </label>
          <label>
            Số điện thoại *
            <input
              type="tel"
              name="receiverPhone"
              value={form.receiverPhone}
              onChange={handleChange}
              placeholder="0909xxxxxx"
              required
            />
          </label>
          <label>
            Địa chỉ giao hàng *
            <textarea
              rows="3"
              name="shippingAddress"
              value={form.shippingAddress}
              onChange={handleChange}
              placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành"
              required
            />
          </label>
          <label>
            Ghi chú
            <textarea
              rows="2"
              name="note"
              value={form.note}
              onChange={handleChange}
              placeholder="Ghi chú thêm (tuỳ chọn)"
            />
          </label>

          <h3 style={{ marginTop: "1.5rem" }}>💳 Phương thức thanh toán</h3>
          <div className="payment-methods">
            {[
              { value: "MOMO", label: "💜 MoMo", desc: "Thanh toán qua ví MoMo (sandbox)" },
              { value: "COD",  label: "💵 COD",  desc: "Thanh toán khi nhận hàng" },
            ].map((pm) => (
              <label
                key={pm.value}
                className={`payment-method-card ${form.paymentMethod === pm.value ? "selected" : ""}`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={pm.value}
                  checked={form.paymentMethod === pm.value}
                  onChange={handleChange}
                  style={{ display: "none" }}
                />
                <div className="pm-icon">{pm.label}</div>
                <div className="pm-desc">{pm.desc}</div>
              </label>
            ))}
          </div>
        </article>

        <article className="card">
          <h3>🧾 Đơn hàng của bạn</h3>
          {loading ? (
            <Spinner />
          ) : (
            <>
              <div className="order-items-preview">
                {items.map((item) => (
                  <div key={item.id} className="order-item-row">
                    <span className="oi-name">
                      {item.productVariant?.product?.name || "Sản phẩm"} ×{item.quantity}
                    </span>
                    <span className="oi-price">{formatVND(item.totalPrice)}</span>
                  </div>
                ))}
                {items.length === 0 && (
                  <div className="notice">Giỏ hàng trống. Hãy thêm sản phẩm trước.</div>
                )}
              </div>
              <div className="summary-list" style={{ marginTop: "1rem" }}>
                <p>Tạm tính <span>{formatVND(total)}</span></p>
                <p>Phí vận chuyển <span className="free">Miễn phí</span></p>
                <p className="total-row">Tổng cộng <span>{formatVND(total)}</span></p>
              </div>

              {form.paymentMethod === "MOMO" && (
                <div className="momo-badge">
                  <div className="momo-logo">M</div>
                  <div>
                    <strong>Thanh toán MoMo Sandbox</strong>
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "#d8b4fe" }}>
                      Bạn sẽ được chuyển đến trang MoMo test để hoàn tất thanh toán
                    </p>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className={`btn-main btn-place-order ${form.paymentMethod === "MOMO" ? "btn-momo" : ""}`}
                disabled={placing || items.length === 0}
                style={{ width: "100%", marginTop: "1.5rem" }}
              >
                {placing ? (
                  <span>Đang xử lý... <Spinner /></span>
                ) : form.paymentMethod === "MOMO" ? (
                  "💜 Thanh toán với MoMo"
                ) : (
                  "✅ Đặt hàng (COD)"
                )}
              </button>
            </>
          )}
        </article>
      </form>
    </section>
  );
}

// ─── PaymentResultPage ────────────────────────────────────────────────────────
function PaymentResultPage({ onNavigate }) {
  const [status, setStatus] = useState("loading");
  const [detail, setDetail] = useState(null);

  useEffect(() => {
    // Parse MoMo callback params from URL
    const params = new URLSearchParams(window.location.search);
    const orderId    = params.get("orderId");
    const resultCode = params.get("resultCode");
    const transId    = params.get("transId");
    const message    = params.get("message");

    if (!orderId) {
      setStatus("error");
      setDetail({ message: "Không tìm thấy thông tin đơn hàng." });
      return;
    }

    // Call backend to confirm + record result
    api.get(
      `/api/momo/result?orderId=${encodeURIComponent(orderId)}&resultCode=${resultCode}&transId=${transId || ""}&message=${encodeURIComponent(message || "")}`
    ).then((data) => {
      setDetail(data);
      setStatus(data.resultCode === 0 || data.resultCode === "0" ? "success" : "failed");
    }).catch(() => {
      setStatus("error");
      setDetail({ message: "Không thể kết nối máy chủ." });
    });
  }, []);

  const icons  = { loading: "⏳", success: "✅", failed: "❌", error: "⚠️" };
  const titles = {
    loading: "Đang xác nhận thanh toán...",
    success: "Thanh toán thành công!",
    failed:  "Thanh toán thất bại",
    error:   "Lỗi xác nhận"
  };

  return (
    <section className="panel">
      <div className="card payment-result-card">
        <div className="result-icon">{icons[status]}</div>
        <h2 className={`result-title result-${status}`}>{titles[status]}</h2>

        {status === "loading" && <Spinner />}

        {detail && status !== "loading" && (
          <div className="result-detail">
            {detail.dbOrderId && <p>Mã đơn hàng: <strong>#{detail.dbOrderId}</strong></p>}
            {detail.transId    && <p>Mã giao dịch MoMo: <strong>{detail.transId}</strong></p>}
            {detail.message    && <p className="result-msg">{detail.message}</p>}
            {detail.status     && <p>Trạng thái: <span className={`status-badge status-${detail.status}`}>{detail.status}</span></p>}
          </div>
        )}

        <div className="result-actions">
          <button className="btn-main" type="button" onClick={() => { window.history.replaceState({}, "", "/"); onNavigate("orders"); }}>
            Xem đơn hàng của tôi
          </button>
          <button className="ghost" type="button" onClick={() => { window.history.replaceState({}, "", "/"); onNavigate("home"); }}>
            Tiếp tục mua sắm
          </button>
        </div>
      </div>
    </section>
  );
}

// ─── OrdersPage ───────────────────────────────────────────────────────────────
function OrdersPage({ user, onNavigate }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    api.get(`/api/orders/user/${user.id}`)
      .then(setOrders)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  const cancelOrder = async (orderId) => {
    if (!window.confirm("Hủy đơn hàng này?")) return;
    await api.patch(`/api/orders/${orderId}/cancel`, {});
    const updated = await api.get(`/api/orders/user/${user.id}`);
    setOrders(updated);
  };

  if (!user) {
    return (
      <section className="panel">
        <div className="card centered-notice">
          <h3>Vui lòng đăng nhập để xem đơn hàng</h3>
          <button className="btn-main" type="button" onClick={() => onNavigate("account")}>Đăng nhập</button>
        </div>
      </section>
    );
  }

  const statusColor = {
    PENDING: "#f59e0b",
    PAID: "#10b981",
    FAILED: "#ef4444",
    CANCELLED: "#6b7280"
  };

  return (
    <section className="panel layout-2">
      <article className="card">
        <h3>📋 Lịch sử đơn hàng</h3>
        {loading && <Spinner />}
        {orders.length === 0 && !loading && (
          <div className="empty-cart">
            <div style={{ fontSize: "3rem" }}>📦</div>
            <p>Chưa có đơn hàng nào</p>
            <button className="btn-main" type="button" onClick={() => onNavigate("catalog")}>
              Mua sắm ngay
            </button>
          </div>
        )}
        <div className="orders-list">
          {orders.map((order) => (
            <div
              key={order.id}
              className={`order-row ${selected?.id === order.id ? "selected" : ""}`}
              onClick={() => setSelected(order)}
            >
              <div className="order-row-left">
                <strong>Đơn #{order.id}</strong>
                <span className="order-date">
                  {order.createdAt ? new Date(order.createdAt).toLocaleDateString("vi-VN") : "—"}
                </span>
              </div>
              <div className="order-row-right">
                <span className="order-total">{formatVND(order.totalAmount || 0)}</span>
                <span
                  className="status-badge"
                  style={{ background: statusColor[order.status] || "#6b7280" }}
                >
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </article>

      <article className="card">
        <h3>Chi tiết đơn hàng</h3>
        {selected ? (
          <div className="order-detail">
            <p><strong>Mã đơn:</strong> #{selected.id}</p>
            <p><strong>Trạng thái:</strong>{" "}
              <span className="status-badge" style={{ background: statusColor[selected.status] }}>
                {selected.status}
              </span>
            </p>
            <p><strong>Tổng tiền:</strong> {formatVND(selected.totalAmount || 0)}</p>
            <p><strong>Thanh toán:</strong> {selected.paymentMethod}</p>
            {selected.receiverName && <p><strong>Người nhận:</strong> {selected.receiverName}</p>}
            {selected.receiverPhone && <p><strong>Điện thoại:</strong> {selected.receiverPhone}</p>}
            {selected.shippingAddress && <p><strong>Địa chỉ:</strong> {selected.shippingAddress}</p>}
            {selected.momoTransId && <p><strong>Mã GD MoMo:</strong> {selected.momoTransId}</p>}
            {selected.status === "PENDING" && (
              <button
                type="button"
                className="ghost"
                style={{ marginTop: "1rem", color: "#ef4444", borderColor: "#ef4444" }}
                onClick={() => cancelOrder(selected.id)}
              >
                Hủy đơn hàng
              </button>
            )}
          </div>
        ) : (
          <div className="notice">Chọn một đơn hàng để xem chi tiết</div>
        )}
      </article>
    </section>
  );
}

// ─── AccountPage ──────────────────────────────────────────────────────────────
function AccountPage({ user, onLogin, onLogout, onRegister }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setMessage({ text: "Đăng nhập thành công!", type: "success" });
        onLogin(data.user);
      } else {
        setMessage({ text: data.error || "Đăng nhập thất bại", type: "error" });
      }
    } catch (err) {
      setMessage({ text: "Lỗi: " + err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, fullName, phone })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ text: "Đăng ký thành công! Vui lòng đăng nhập.", type: "success" });
        setIsLogin(true);
      } else {
        setMessage({ text: data.error || "Đăng ký thất bại", type: "error" });
      }
    } catch (err) {
      setMessage({ text: "Lỗi: " + err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return (
      <section className="panel layout-2">
        <article className="card">
          <h3>👤 Hồ sơ của tôi</h3>
          <div className="profile-avatar">
            {(user.fullName || user.username || "?")[0].toUpperCase()}
          </div>
          <p style={{ textAlign: "center", fontWeight: 600, fontSize: "1.1rem", color: "#e2e8f0" }}>
            Xin chào, {user.fullName || user.username}!
          </p>
          <label>Tên đăng nhập <input type="text" value={user.username} disabled /></label>
          <label>Email        <input type="email" value={user.email} disabled /></label>
          <label>Họ tên       <input type="text" value={user.fullName || ""} disabled /></label>
          <label>Điện thoại   <input type="text" value={user.phone || ""} disabled /></label>
          <button type="button" className="ghost" onClick={onLogout} style={{ marginTop: "1rem", width: "100%", color: "#ef4444", borderColor: "#ef4444" }}>
            Đăng xuất
          </button>
        </article>
        <article className="card">
          <h3>📍 Địa chỉ của tôi</h3>
          <div className="notice">Chức năng quản lý địa chỉ đang được cập nhật.</div>
        </article>
      </section>
    );
  }

  return (
    <section className="panel">
      <article className="card" style={{ maxWidth: "480px", margin: "0 auto" }}>
        <div className="auth-tabs">
          <button
            type="button"
            className={isLogin ? "auth-tab active" : "auth-tab"}
            onClick={() => { setIsLogin(true); setMessage({ text: "", type: "" }); }}
          >
            Đăng nhập
          </button>
          <button
            type="button"
            className={!isLogin ? "auth-tab active" : "auth-tab"}
            onClick={() => { setIsLogin(false); setMessage({ text: "", type: "" }); }}
          >
            Đăng ký
          </button>
        </div>

        {message.text && (
          <div className={`notice ${message.type}`}>{message.text}</div>
        )}

        <form onSubmit={isLogin ? handleLogin : handleRegister}>
          <label>
            Tên đăng nhập
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="username" required />
          </label>
          {!isLogin && (
            <label>
              Email
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" required />
            </label>
          )}
          <label>
            Mật khẩu
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
          </label>
          {!isLogin && (
            <>
              <label>
                Họ và tên
                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Nguyễn Văn A" />
              </label>
              <label>
                Số điện thoại
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0909xxxxxx" />
              </label>
            </>
          )}
          <button type="submit" className="btn-main" disabled={loading} style={{ width: "100%", marginTop: "1rem" }}>
            {loading ? "Đang xử lý..." : (isLogin ? "Đăng nhập" : "Đăng ký")}
          </button>
        </form>
      </article>
    </section>
  );
}

// ─── AdminPage ────────────────────────────────────────────────────────────────
function AdminPage() {
  const modules = [
    { key: "products",   label: "Sản phẩm",    endpoint: "/api/admin/products" },
    { key: "categories", label: "Danh mục",     endpoint: "/api/admin/categories" },
    { key: "variants",   label: "Biến thể",     endpoint: "/api/admin/product-variants" },
    { key: "users",      label: "Người dùng",   endpoint: "/api/admin/users" },
    { key: "orders",     label: "Đơn hàng",     endpoint: "/api/orders" }
  ];
  const [activeModule, setActiveModule] = useState("products");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const currentModule = modules.find((m) => m.key === activeModule);

  const loadItems = useCallback(async () => {
    if (!currentModule) return;
    setLoading(true);
    setActionMessage("");
    try {
      const data = await api.get(currentModule.endpoint);
      setItems(Array.isArray(data) ? data : []);
      setSelectedId(null);
    } catch (err) {
      setItems([]);
      setActionMessage("Lỗi tải dữ liệu: " + err.message);
    } finally {
      setLoading(false);
    }
  }, [currentModule]);

  useEffect(() => { loadItems(); }, [activeModule]);

  return (
    <section className="panel layout-2">
      <article className="card">
        <h3>⚙️ Quản trị</h3>
        <div className="kpi-grid">
          {modules.map((m) => (
            <button
              key={m.key}
              type="button"
              className={activeModule === m.key ? "kpi active" : "kpi"}
              onClick={() => setActiveModule(m.key)}
            >
              {m.label}
            </button>
          ))}
        </div>
        <div className="notice">
          Module: <strong>{currentModule?.label}</strong>.
          {loading ? " Đang tải..." : ` Tổng ${items.length} mục.`}
        </div>
        {actionMessage && <div className="notice error">{actionMessage}</div>}
        <div className="admin-list">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              className={selectedId === item.id ? "admin-row selected" : "admin-row"}
              onClick={() => setSelectedId(item.id)}
            >
              <strong>#{item.id}</strong>
              <span>{item.name || item.username || item.email || item.status || "(no title)"}</span>
              {item.totalAmount && <span>{formatVND(item.totalAmount)}</span>}
            </button>
          ))}
          {items.length === 0 && !loading && <p className="notice">Không có dữ liệu.</p>}
        </div>
      </article>
      <article className="card">
        <h3>📊 Thống kê nhanh</h3>
        <div className="notice">
          Tổng đơn hàng: <strong>{activeModule === "orders" ? items.length : "—"}</strong>
        </div>
        <div className="notice">
          Đã thanh toán: <strong>{activeModule === "orders" ? items.filter((i) => i.status === "PAID").length : "—"}</strong>
        </div>
        <div className="notice">
          Đang chờ: <strong>{activeModule === "orders" ? items.filter((i) => i.status === "PENDING").length : "—"}</strong>
        </div>
      </article>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="footer">
      <div>
        <h4>VELA</h4>
        <p>Thời trang hiện đại – chất lượng đẳng cấp.</p>
      </div>
      <div>
        <h5>Thông tin</h5>
        <a href="#">Về chúng tôi</a>
        <a href="#">Hướng dẫn size</a>
        <a href="#">Chính sách vận chuyển</a>
      </div>
      <div>
        <h5>Hỗ trợ</h5>
        <a href="#">Liên hệ</a>
        <a href="#">FAQ</a>
        <a href="#">Đổi trả hàng</a>
      </div>
      <div>
        <h5>Đăng ký nhận tin</h5>
        <div className="newsletter">
          <input type="email" placeholder="Email của bạn" />
          <button type="button" className="btn-main">Đăng ký</button>
        </div>
        <p style={{ marginTop: "0.5rem", fontSize: "0.75rem", color: "#6b7280" }}>
          💜 Thanh toán an toàn với MoMo
        </p>
      </div>
    </footer>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
function App() {
  const [activePage, setActivePage] = useState(() => {
    // If redirected from MoMo, show payment result
    if (window.location.pathname === "/payment-result") return "payment-result";
    return "home";
  });

  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("currentUser");
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  const [cartCount, setCartCount] = useState(0);
  const [toast, setToast] = useState({ message: "", type: "" });
  const [products, setProducts] = useState([]);
  const [variants, setVariants] = useState([]);

  useEffect(() => {
    api.get("/api/admin/products")
      .then(data => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setProducts([]));
    api.get("/api/admin/product-variants")
      .then(data => setVariants(Array.isArray(data) ? data : []))
      .catch(() => setVariants([]));
  }, []);

  // Load cart count
  useEffect(() => {
    if (!user) { setCartCount(0); return; }
    api.get(`/api/carts/user/${user.id}/items`)
      .then((data) => setCartCount((data.items || []).length))
      .catch(() => setCartCount(0));
  }, [user]);

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
    localStorage.setItem("currentUser", JSON.stringify(loggedInUser));
    setActivePage("home");
    showToast("Đăng nhập thành công! Chào " + (loggedInUser.fullName || loggedInUser.username), "success");
  };

  const handleLogout = () => {
    setUser(null);
    setCartCount(0);
    localStorage.removeItem("currentUser");
    showToast("Đã đăng xuất", "info");
  };

  const showToast = (message, type = "info") => setToast({ message, type });

  const addToCart = async (variantId, qty = 1) => {
    if (!user) {
      setActivePage("account");
      return;
    }
    try {
      const res = await api.post(`/api/carts/user/${user.id}/add`, {
        productVariantId: variantId,
        quantity: qty
      });
      if (res.error) throw new Error(res.error);
      setCartCount((c) => c + qty);
      showToast("Đã thêm vào giỏ hàng! 🛒", "success");
    } catch (err) {
      showToast("Lỗi: " + err.message, "error");
    }
  };

  const navigate = (page) => setActivePage(page);

  const renderPage = () => {
    switch (activePage) {
      case "home":     return <HomePage products={products} variants={variants} onAddToCart={addToCart} user={user} onNavigate={navigate} />;
      case "catalog":  return <CatalogPage products={products} variants={variants} onAddToCart={addToCart} user={user} onNavigate={navigate} />;
      case "cart":     return <CartPage user={user} cartCount={cartCount} setCartCount={setCartCount} onNavigate={navigate} />;
      case "checkout": return <CheckoutPage user={user} onNavigate={navigate} />;
      case "orders":   return <OrdersPage user={user} onNavigate={navigate} />;
      case "account":  return <AccountPage user={user} onLogin={handleLogin} onLogout={handleLogout} onRegister={handleLogin} />;
      case "admin":    return <AdminPage />;
      case "payment-result": return <PaymentResultPage onNavigate={navigate} />;
      default:         return <HomePage products={products} variants={variants} onAddToCart={addToCart} user={user} onNavigate={navigate} />;
    }
  };

  return (
    <div className="shop-app">
      <div className="announce">
        Miễn phí vận chuyển cho đơn từ 999k · Thanh toán an toàn với MoMo 💜
      </div>

      <header className="header">
        <div className="brand" onClick={() => navigate("home")} style={{ cursor: "pointer" }}>
          VELA
        </div>
        <nav className="nav">
          {pages.filter(p => p.key !== "payment-result").map((page) => (
            <button
              key={page.key}
              type="button"
              className={activePage === page.key ? "tab active" : "tab"}
              onClick={() => navigate(page.key)}
            >
              {page.label}
            </button>
          ))}
        </nav>
        <div className="header-actions">
          <button
            type="button"
            className="cart-btn"
            onClick={() => navigate("cart")}
          >
            🛒
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
          <button
            type="button"
            className={user ? "btn-main small" : "ghost small"}
            onClick={() => navigate("account")}
          >
            {user ? "👤 " + (user.fullName || user.username).split(" ").pop() : "Đăng nhập"}
          </button>
        </div>
      </header>

      <main className="main">{renderPage()}</main>

      <Footer />

      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "" })}
      />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
