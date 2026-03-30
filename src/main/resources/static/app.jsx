const { useState } = React;

const pages = [
  { key: "home", label: "Home" },
  { key: "catalog", label: "Catalog" },
  { key: "product", label: "Product" },
  { key: "cart", label: "Cart" },
  { key: "checkout", label: "Checkout" },
  { key: "account", label: "Account" },
  { key: "orders", label: "Orders" },
  { key: "admin", label: "Admin" }
];

const categories = ["Women", "Men", "Street", "Office", "Accessories", "Sale"];
const sizes = ["XS", "S", "M", "L", "XL"];
const colors = ["Black", "Ivory", "Stone", "Denim", "Olive"];

function ProductCard() {
  return (
    <article className="product-card">
      <div className="thumb" />
      <div className="line l1" />
      <div className="line l2" />
      <div className="swatches">
        <span />
        <span />
        <span />
      </div>
      <button type="button" className="ghost small">Quick view</button>
    </article>
  );
}

function HomePage() {
  return (
    <section className="panel">
      <article className="hero">
        <div className="hero-copy">
          <p className="tag">NEW SEASON DROP</p>
          <h1>Elevated everyday style for modern wardrobes</h1>
          <p>Full fashion storefront UI: hero, category lanes, product grid, quick cart, checkout, account, orders, admin.</p>
          <div className="row">
            <button className="btn-main" type="button">Shop collection</button>
            <button className="ghost" type="button">View lookbook</button>
          </div>
        </div>
        <div className="hero-art" />
      </article>

      <article className="category-strip">
        {categories.map((item) => (
          <button key={item} type="button" className="chip">{item}</button>
        ))}
      </article>

      <article className="promo-grid">
        <div className="promo-card">Flash Sale</div>
        <div className="promo-card">Top Rated</div>
        <div className="promo-card">New In</div>
        <div className="promo-card">Bundle Offers</div>
      </article>

      <article className="product-grid">
        {Array.from({ length: 8 }).map((_, idx) => <ProductCard key={idx} />)}
      </article>
    </section>
  );
}

function CatalogPage() {
  return (
    <section className="panel">
      <div className="toolbar">
        <input type="search" placeholder="Search by name, sku, tag" />
        <select defaultValue=""><option value="" disabled>Category</option></select>
        <select defaultValue=""><option value="" disabled>Color</option></select>
        <select defaultValue=""><option value="" disabled>Size</option></select>
        <select defaultValue=""><option value="" disabled>Sort</option></select>
      </div>
      <div className="layout-2">
        <aside className="card sidebar">
          <h3>Filters</h3>
          <p>Price range</p>
          <input type="range" min="0" max="100" />
          <p>Colors</p>
          <div className="chips-inline">{colors.map((c) => <span key={c} className="chip light">{c}</span>)}</div>
          <p>Sizes</p>
          <div className="chips-inline">{sizes.map((s) => <span key={s} className="chip light">{s}</span>)}</div>
          <button type="button" className="ghost">Apply</button>
        </aside>
        <div className="product-grid">
          {Array.from({ length: 12 }).map((_, idx) => <ProductCard key={idx} />)}
        </div>
      </div>
    </section>
  );
}

function ProductPage() {
  return (
    <section className="panel layout-2">
      <article className="card gallery">
        <div className="thumb large" />
        <div className="mini-row">
          <div className="thumb" />
          <div className="thumb" />
          <div className="thumb" />
          <div className="thumb" />
        </div>
      </article>
      <article className="card details">
        <p className="tag">WOMEN / DRESS</p>
        <h2>Product detail experience</h2>
        <p>Ready for image zoom, size chart, rating, and related products section.</p>
        <label>Color<select defaultValue=""><option value="" disabled>Select color</option></select></label>
        <label>Size<select defaultValue=""><option value="" disabled>Select size</option></select></label>
        <label>Quantity<input type="number" min="1" defaultValue="1" /></label>
        <div className="row">
          <button className="btn-main" type="button">Add to cart</button>
          <button className="ghost" type="button">Add wishlist</button>
        </div>
        <div className="notice">Review block and shipping timeline are prepared in this layout.</div>
      </article>
    </section>
  );
}

function CartPage() {
  return (
    <section className="panel layout-2">
      <article className="card">
        <h3>Cart items</h3>
        <div className="notice">Cart list placeholder ready for API binding.</div>
        <label>Voucher<input type="text" placeholder="Enter voucher code" /></label>
        <button type="button" className="ghost">Apply voucher</button>
      </article>
      <article className="card">
        <h3>Summary</h3>
        <div className="summary-list">
          <p>Subtotal <span>--</span></p>
          <p>Shipping <span>--</span></p>
          <p>Discount <span>--</span></p>
          <p>Total <span>--</span></p>
        </div>
        <button type="button" className="btn-main">Proceed to checkout</button>
      </article>
    </section>
  );
}

function CheckoutPage() {
  return (
    <section className="panel layout-2">
      <article className="card">
        <h3>Shipping information</h3>
        <label>Receiver name<input type="text" placeholder="Full name" /></label>
        <label>Phone<input type="text" placeholder="Phone" /></label>
        <label>Address<textarea rows="4" placeholder="Delivery address" /></label>
      </article>
      <article className="card">
        <h3>Payment and confirmation</h3>
        <label>Payment method<select defaultValue=""><option value="" disabled>Select payment</option></select></label>
        <label>Order note<textarea rows="4" placeholder="Optional note" /></label>
        <div className="chips-inline">
          <span className="chip light">VNPay</span>
          <span className="chip light">PayPal</span>
          <span className="chip light">Momo</span>
          <span className="chip light">COD</span>
        </div>
        <button type="button" className="btn-main">Place order</button>
      </article>
    </section>
  );
}

function AccountPage() {
  return (
    <section className="panel layout-2">
      <article className="card">
        <h3>Login / Register</h3>
        <label>Email<input type="email" placeholder="you@email.com" /></label>
        <label>Password<input type="password" placeholder="Password" /></label>
        <label>OTP<input type="text" placeholder="OTP code" /></label>
        <button type="button" className="btn-main">Continue</button>
      </article>
      <article className="card">
        <h3>Profile and addresses</h3>
        <label>Display name<input type="text" placeholder="Display name" /></label>
        <label>Phone<input type="text" placeholder="Phone" /></label>
        <label>Default address<input type="text" placeholder="Default shipping address" /></label>
        <button type="button" className="ghost">Save profile</button>
      </article>
    </section>
  );
}

function OrdersPage() {
  return (
    <section className="panel layout-2">
      <article className="card">
        <h3>Order history and tracking</h3>
        <div className="notice">Timeline and map slot are ready for real shipment data.</div>
        <div className="timeline">
          <span>Ordered</span>
          <span>Packed</span>
          <span>Shipped</span>
          <span>Delivered</span>
        </div>
      </article>
      <article className="card">
        <h3>Cancel or return</h3>
        <label>Reason<select defaultValue=""><option value="" disabled>Select reason</option></select></label>
        <label>Description<textarea rows="5" placeholder="Describe issue" /></label>
        <button type="button" className="ghost">Submit request</button>
      </article>
    </section>
  );
}

function AdminPage() {
  return (
    <section className="panel layout-2">
      <article className="card">
        <h3>Admin dashboard</h3>
        <div className="kpi-grid">
          <div className="kpi">Revenue</div>
          <div className="kpi">Orders</div>
          <div className="kpi">Inventory</div>
          <div className="kpi">Users</div>
        </div>
        <div className="notice">Dashboard widgets are ready for backend metrics.</div>
      </article>
      <article className="card">
        <h3>Support chat</h3>
        <label>Message<textarea rows="6" placeholder="Reply to customer" /></label>
        <button type="button" className="btn-main">Send reply</button>
      </article>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div>
        <h4>VELA</h4>
        <p>Modern fashion store experience with scalable frontend architecture.</p>
      </div>
      <div>
        <h5>Information</h5>
        <a href="#">About us</a>
        <a href="#">Size guide</a>
        <a href="#">Shipping policy</a>
      </div>
      <div>
        <h5>Customer care</h5>
        <a href="#">Contact</a>
        <a href="#">FAQ</a>
        <a href="#">Returns</a>
      </div>
      <div>
        <h5>Newsletter</h5>
        <div className="newsletter">
          <input type="email" placeholder="Email address" />
          <button type="button" className="btn-main">Subscribe</button>
        </div>
      </div>
    </footer>
  );
}

function PageView({ activePage }) {
  if (activePage === "home") return <HomePage />;
  if (activePage === "catalog") return <CatalogPage />;
  if (activePage === "product") return <ProductPage />;
  if (activePage === "cart") return <CartPage />;
  if (activePage === "checkout") return <CheckoutPage />;
  if (activePage === "account") return <AccountPage />;
  if (activePage === "orders") return <OrdersPage />;
  return <AdminPage />;
}

function App() {
  const [activePage, setActivePage] = useState("home");

  return (
    <div className="shop-app">
      <div className="announce">Free shipping for orders over 999k · New arrivals every Friday</div>
      <header className="header">
        <div className="brand">VELA</div>
        <nav className="nav">
          {pages.map((page) => (
            <button
              key={page.key}
              type="button"
              className={activePage === page.key ? "tab active" : "tab"}
              onClick={() => setActivePage(page.key)}
            >
              {page.label}
            </button>
          ))}
        </nav>
        <div className="header-actions">
          <button type="button" className="ghost">Search</button>
          <button type="button" className="btn-main">Cart</button>
        </div>
      </header>

      <main className="main">
        <PageView activePage={activePage} />
      </main>

      <Footer />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
