// src/app/main.jsx
import { mount as mount2 } from "./vendor/strike.core+hooks.js";
import {
  Router,
  Routes,
  Route,
  useParams as useParams2
} from "./strike.js-router/index.js";

// src/app/shell.jsx
import { Text } from "./vendor/strike-ui.js";
import { SnackbarHost } from "./strike.js-component-ui/index.js";
import { NavLink, useLocation, useMatch } from "./strike.js-router/index.js";

// src/lib/motion.jsx
import { useState, useEffect, useLayoutEffect, useRef } from "./vendor/strike.core+hooks.js";
import {
  useTransition,
  flipLayout
} from "./vendor/transition.js";
import { Dialog } from "./vendor/strike-ui.js";
import { jsx } from "./vendor/jsx-runtime.js";
function RouteFade({ routeKey, children, ms = 180 }) {
  return /* @__PURE__ */ jsx(RouteFadeInner, { ms, children }, routeKey);
}
function RouteFadeInner({ children, ms }) {
  const { className, style } = useTransition({
    name: "fade",
    ms,
    open: true
  });
  return /* @__PURE__ */ jsx("div", { class: "shop-route " + className, style, children });
}
function TxDialog({ open, onClose, class: className, children, ...rest }) {
  const [mounted, setMounted] = useState(!!open);
  const { className: txClass, style } = useTransition({
    name: "fade",
    ms: 180,
    open: !!open,
    onExited: () => setMounted(false)
  });
  useEffect(() => {
    if (open) setMounted(true);
  }, [open]);
  if (!mounted) return null;
  const panelClass = [txClass, className].filter(Boolean).join(" ");
  return /* @__PURE__ */ jsx(
    Dialog,
    {
      ...rest,
      open: true,
      onClose,
      class: panelClass,
      style,
      children
    }
  );
}
function useListFlip(ref, deps, ms = 200) {
  const pending = useRef(null);
  useLayoutEffect(() => {
    if (pending.current) pending.current();
    const root = ref.current;
    if (!root) {
      pending.current = null;
      return;
    }
    pending.current = flipLayout(root.children, { ms });
  }, deps);
}

// src/cart/store.js
import {
  atom,
  computed,
  persist,
  useStoreValue
} from "./strike.js-store/index.js";
var cart = atom({ lines: [] });
if (typeof sessionStorage !== "undefined") {
  persist(cart, { name: "harbor-cart", storage: sessionStorage });
}
var cartCount = computed([cart], function(c) {
  return c.lines.reduce(function(n, l) {
    return n + l.qty;
  }, 0);
});
var cartTotal = computed([cart], function(c) {
  return c.lines.reduce(function(n, l) {
    return n + l.qty * l.price;
  }, 0);
});
function addToCart(product, extras) {
  const gift = !!(extras && extras.giftWrap);
  cart.set(function(state) {
    const list = state.lines;
    const i = list.findIndex(
      (l) => l.id === product.id && !!l.giftWrap === gift
    );
    if (i === -1) {
      return {
        lines: list.concat([
          {
            id: product.id,
            name: product.name,
            price: product.price + (gift ? 5 : 0),
            qty: 1,
            giftWrap: gift
          }
        ])
      };
    }
    return {
      lines: list.map(function(l, idx) {
        return idx === i ? Object.assign({}, l, { qty: l.qty + 1 }) : l;
      })
    };
  });
}
function setCartQty(id, qty, giftWrap) {
  cart.set(function(state) {
    return {
      lines: state.lines.map(function(l) {
        return l.id === id && !!l.giftWrap === !!giftWrap ? Object.assign({}, l, { qty }) : l;
      }).filter(function(l) {
        return l.qty > 0;
      })
    };
  });
}
function clearCart() {
  cart.set({ lines: [] });
}
function useCartLines() {
  return useStoreValue(cart, function(c) {
    return c.lines;
  });
}
function useCartCount() {
  return useStoreValue(cartCount);
}
function useCartTotal() {
  return useStoreValue(cartTotal);
}

// src/app/shell.jsx
import { jsx as jsx2, jsxs } from "./vendor/jsx-runtime.js";
function Shell({ children }) {
  const location2 = useLocation();
  const cartActive = !!useMatch("/cart") || !!useMatch("/checkout");
  const count = useCartCount();
  return /* @__PURE__ */ jsxs("div", { class: "shop", children: [
    /* @__PURE__ */ jsx2(
      SnackbarHost,
      {
        placement: "bottom-end",
        max: 3,
        gap: 10,
        transition: {
          enter: "slide-up",
          exit: "slide-up",
          move: "flip",
          ms: 220
        }
      }
    ),
    /* @__PURE__ */ jsxs("header", { class: "shop-top", children: [
      /* @__PURE__ */ jsx2(NavLink, { to: "/", end: true, class: "shop-brand", children: "Harbor Goods" }),
      /* @__PURE__ */ jsxs("nav", { class: "shop-nav", "aria-label": "Primary", children: [
        /* @__PURE__ */ jsx2(NavLink, { to: "/", end: true, class: (on) => on ? "is-active" : void 0, children: "Shop" }),
        /* @__PURE__ */ jsxs(NavLink, { to: "/cart", isActive: () => cartActive, class: (on) => on ? "is-active" : void 0, children: [
          "Cart",
          /* @__PURE__ */ jsx2("span", { class: "shop-nav__count", children: count })
        ] }),
        /* @__PURE__ */ jsx2(NavLink, { to: "/lab", class: (on) => on ? "is-active" : void 0, children: "Lab" })
      ] })
    ] }),
    /* @__PURE__ */ jsx2("main", { class: "shop-main", "data-strike-focus": true, tabindex: "-1", children: /* @__PURE__ */ jsx2(RouteFade, { routeKey: location2.pathname + location2.search, children }) }),
    /* @__PURE__ */ jsx2("footer", { class: "shop-foot", children: /* @__PURE__ */ jsx2(Text, { tone: "muted", as: "span", children: "Harbor Goods \xB7 Strike dist vendor demo" }) })
  ] });
}

// src/pages/shop.jsx
import { useState as useState2, useMemo } from "./vendor/strike.core+hooks.js";
import { Btn, Stack } from "./vendor/strike-ui.js";

// src/data/products.js
var PRODUCTS = [
  {
    id: "board",
    name: "End-grain cutting board",
    price: 68,
    tag: "Kitchen",
    blurb: "Walnut and maple, oiled and ready for daily prep.",
    care: "Hand wash, dry upright, oil monthly with food-safe mineral oil.",
    tone: "#3d2b1f"
  },
  {
    id: "skillet",
    name: "10-inch cast iron",
    price: 42,
    tag: "Cookware",
    blurb: "Pre-seasoned skillet that holds heat for sears and bakes.",
    care: "Wipe clean while warm. Avoid soap when possible; re-season if dull.",
    tone: "#2a2a2a"
  },
  {
    id: "apron",
    name: "Cross-back linen apron",
    price: 54,
    tag: "Apparel",
    blurb: "Stonewashed linen with deep pockets and brass hardware.",
    care: "Cold wash, hang dry. Expect soft wrinkles - that is the linen.",
    tone: "#6b705c"
  },
  {
    id: "bowls",
    name: "Ceramic bowl set",
    price: 36,
    tag: "Table",
    blurb: "Four nesting bowls with a speckled ash glaze.",
    care: "Dishwasher safe. Avoid thermal shock from freezer to oven.",
    tone: "#8a8175"
  },
  {
    id: "mill",
    name: "Hand coffee mill",
    price: 79,
    tag: "Brew",
    blurb: "Steel burrs, adjustable grind, beech wood body.",
    care: "Brush burrs monthly. Wipe wood with a barely damp cloth.",
    tone: "#5c4033"
  },
  {
    id: "towel",
    name: "Heavyweight tea towels",
    price: 24,
    tag: "Kitchen",
    blurb: "Pair of hemmed cotton towels that soften with every wash.",
    care: "Machine wash warm. Tumble low or line dry.",
    tone: "#c2b8a3"
  }
];
function money(n) {
  return "$" + Number(n).toFixed(2);
}
function go(hash) {
  location.hash = hash;
}

// src/pages/shop.jsx
import { jsx as jsx3, jsxs as jsxs2 } from "./vendor/jsx-runtime.js";
function ProductCard({ product }) {
  return /* @__PURE__ */ jsxs2("article", { class: "card", children: [
    /* @__PURE__ */ jsx3(
      "a",
      {
        href: "#/product/" + product.id,
        class: "card-media",
        style: { background: product.tone },
        children: /* @__PURE__ */ jsx3("span", { class: "card-tag", children: product.tag })
      }
    ),
    /* @__PURE__ */ jsxs2("div", { class: "card-body", children: [
      /* @__PURE__ */ jsx3("a", { href: "#/product/" + product.id, class: "card-title", children: product.name }),
      /* @__PURE__ */ jsx3("p", { class: "card-price", children: money(product.price) })
    ] })
  ] });
}
function ShopHome() {
  const [tag, setTag] = useState2("all");
  const tags = useMemo(() => {
    const set = { all: 1 };
    for (let i = 0; i < PRODUCTS.length; i++) set[PRODUCTS[i].tag] = 1;
    return Object.keys(set);
  }, []);
  const list = tag === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.tag === tag);
  return /* @__PURE__ */ jsxs2("div", { class: "shop-home", children: [
    /* @__PURE__ */ jsxs2("section", { class: "shop-hero", children: [
      /* @__PURE__ */ jsx3("p", { class: "shop-hero__eyebrow", children: "Coastal kitchen supply" }),
      /* @__PURE__ */ jsx3("h1", { class: "shop-hero__brand", children: "Harbor Goods" }),
      /* @__PURE__ */ jsx3("p", { class: "shop-hero__lede", children: "Quiet tools for daily cooking - boards, iron, linen, and brew." })
    ] }),
    /* @__PURE__ */ jsxs2(Stack, { gap: 20, children: [
      /* @__PURE__ */ jsx3(Stack, { row: true, gap: 8, class: "filters", children: tags.map((t) => /* @__PURE__ */ jsx3(
        Btn,
        {
          variant: tag === t ? "primary" : "ghost",
          onClick: () => setTag(t),
          children: t
        },
        t
      )) }),
      /* @__PURE__ */ jsx3("div", { class: "grid", children: list.map((p) => /* @__PURE__ */ jsx3(ProductCard, { product: p }, p.id)) })
    ] })
  ] });
}

// src/pages/product.jsx
import { useState as useState3 } from "./vendor/strike.core+hooks.js";
import { Btn as Btn2, Stack as Stack2, Text as Text2, Check } from "./vendor/strike-ui.js";
import { snackbar } from "./strike.js-component-ui/index.js";
import { jsx as jsx4, jsxs as jsxs3 } from "./vendor/jsx-runtime.js";
function ProductPage({ id }) {
  const [giftWrap, setGiftWrap] = useState3(false);
  const [careOpen, setCareOpen] = useState3(false);
  const product = PRODUCTS.find((p) => p.id === id);
  if (!product) {
    return /* @__PURE__ */ jsxs3(Stack2, { gap: 12, children: [
      /* @__PURE__ */ jsx4(Text2, { as: "h1", tone: "title", children: "Not found" }),
      /* @__PURE__ */ jsx4(Btn2, { variant: "ghost", onClick: () => go("#/"), children: "Back to shop" })
    ] });
  }
  return /* @__PURE__ */ jsxs3("div", { class: "product", children: [
    /* @__PURE__ */ jsx4(
      "div",
      {
        class: "product-media",
        style: { background: product.tone },
        "aria-hidden": "true"
      }
    ),
    /* @__PURE__ */ jsxs3(Stack2, { gap: 14, class: "product-copy", children: [
      /* @__PURE__ */ jsx4(Text2, { tone: "muted", as: "span", children: product.tag }),
      /* @__PURE__ */ jsx4(Text2, { as: "h1", tone: "title", children: product.name }),
      /* @__PURE__ */ jsx4(Text2, { children: product.blurb }),
      /* @__PURE__ */ jsx4(Text2, { as: "strong", children: money(product.price) }),
      /* @__PURE__ */ jsx4(
        Check,
        {
          label: "Gift wrap (+$5)",
          checked: giftWrap,
          onChange: (e) => setGiftWrap(e.target.checked)
        }
      ),
      /* @__PURE__ */ jsxs3(Stack2, { row: true, gap: 8, children: [
        /* @__PURE__ */ jsx4(
          Btn2,
          {
            onClick: () => {
              addToCart(product, { giftWrap });
              snackbar.show({
                tone: "ok",
                children: "Added " + product.name,
                autoHideMs: 2800,
                placement: "bottom-end"
              });
              go("#/cart");
            },
            children: "Add to cart"
          }
        ),
        /* @__PURE__ */ jsx4(Btn2, { variant: "ghost", onClick: () => setCareOpen(true), children: "Care guide" }),
        /* @__PURE__ */ jsx4(Btn2, { variant: "ghost", onClick: () => go("#/"), children: "Keep shopping" })
      ] })
    ] }),
    /* @__PURE__ */ jsx4(
      TxDialog,
      {
        open: careOpen,
        title: "Care guide",
        onClose: () => setCareOpen(false),
        children: /* @__PURE__ */ jsxs3(Stack2, { gap: 12, children: [
          /* @__PURE__ */ jsx4(Text2, { children: product.care }),
          /* @__PURE__ */ jsx4(Btn2, { variant: "ghost", onClick: () => setCareOpen(false), children: "Close" })
        ] })
      }
    )
  ] });
}

// src/pages/cart.jsx
import { useState as useState4, useRef as useRef2 } from "./vendor/strike.core+hooks.js";
import { Btn as Btn3, Stack as Stack3, Text as Text3, Select } from "./vendor/strike-ui.js";
import { snackbar as snackbar2 } from "./strike.js-component-ui/index.js";
import { jsx as jsx5, jsxs as jsxs4 } from "./vendor/jsx-runtime.js";
function CartPage() {
  const lines = useCartLines();
  const total = useCartTotal();
  const [pending, setPending] = useState4(null);
  const listRef = useRef2(null);
  useListFlip(listRef, [lines.map((l) => l.id + ":" + l.qty + ":" + !!l.giftWrap).join("|")]);
  if (!lines.length) {
    return /* @__PURE__ */ jsxs4(Stack3, { gap: 12, children: [
      /* @__PURE__ */ jsx5(Text3, { as: "h1", tone: "title", children: "Cart" }),
      /* @__PURE__ */ jsx5(Text3, { tone: "muted", children: "Your cart is empty." }),
      /* @__PURE__ */ jsx5(Btn3, { onClick: () => go("#/"), children: "Browse shop" })
    ] });
  }
  return /* @__PURE__ */ jsxs4(Stack3, { gap: 16, children: [
    /* @__PURE__ */ jsx5(Text3, { as: "h1", tone: "title", children: "Cart" }),
    /* @__PURE__ */ jsx5("ul", { class: "cart-list", ref: listRef, children: lines.map((line) => /* @__PURE__ */ jsx5("li", { children: /* @__PURE__ */ jsxs4(Stack3, { row: true, gap: 12, class: "cart-row", children: [
      /* @__PURE__ */ jsxs4("div", { class: "cart-info", children: [
        /* @__PURE__ */ jsx5(Text3, { as: "strong", children: line.name }),
        line.giftWrap ? /* @__PURE__ */ jsx5(Text3, { tone: "muted", children: "Gift wrap included" }) : null,
        /* @__PURE__ */ jsxs4(Text3, { tone: "muted", children: [
          money(line.price),
          " each"
        ] })
      ] }),
      /* @__PURE__ */ jsx5(
        Select,
        {
          label: "Qty",
          value: String(line.qty),
          options: [1, 2, 3, 4, 5].map((n) => ({
            value: String(n),
            label: String(n)
          })),
          onChange: (e) => setCartQty(
            line.id,
            Number(e.target.value),
            line.giftWrap
          )
        }
      ),
      /* @__PURE__ */ jsx5(
        Btn3,
        {
          variant: "ghost",
          onClick: () => setPending({ id: line.id, giftWrap: line.giftWrap }),
          children: "Remove"
        }
      )
    ] }) }, line.id + (line.giftWrap ? "-gift" : ""))) }),
    /* @__PURE__ */ jsxs4(Stack3, { row: true, gap: 12, class: "cart-total", children: [
      /* @__PURE__ */ jsxs4(Text3, { as: "strong", children: [
        "Total ",
        money(total)
      ] }),
      /* @__PURE__ */ jsx5(Btn3, { onClick: () => go("#/checkout"), children: "Checkout" })
    ] }),
    /* @__PURE__ */ jsx5(
      TxDialog,
      {
        open: !!pending,
        title: "Remove item?",
        onClose: () => setPending(null),
        children: /* @__PURE__ */ jsxs4(Stack3, { gap: 12, children: [
          /* @__PURE__ */ jsx5(Text3, { children: "This removes the line from your cart." }),
          /* @__PURE__ */ jsxs4(Stack3, { row: true, gap: 8, children: [
            /* @__PURE__ */ jsx5(
              Btn3,
              {
                onClick: () => {
                  setCartQty(pending.id, 0, pending.giftWrap);
                  setPending(null);
                  snackbar2.show({
                    children: "Removed from cart",
                    autoHideMs: 2500
                  });
                },
                children: "Remove"
              }
            ),
            /* @__PURE__ */ jsx5(Btn3, { variant: "ghost", onClick: () => setPending(null), children: "Cancel" })
          ] })
        ] })
      }
    )
  ] });
}

// src/pages/checkout.jsx
import { useState as useState5 } from "./vendor/strike.core+hooks.js";
import {
  Btn as Btn4,
  Stack as Stack4,
  Text as Text4,
  Field,
  Select as Select2,
  Form,
  Switch
} from "./vendor/strike-ui.js";
import { jsx as jsx6, jsxs as jsxs5 } from "./vendor/jsx-runtime.js";
function CheckoutPage() {
  const lines = useCartLines();
  const cartTotal2 = useCartTotal();
  const [name, setName] = useState5("");
  const [email, setEmail] = useState5("");
  const [ship, setShip] = useState5("standard");
  const [updates, setUpdates] = useState5(true);
  const [giftNote, setGiftNote] = useState5(false);
  const [note, setNote] = useState5("");
  const [err, setErr] = useState5("");
  if (!lines.length) {
    return /* @__PURE__ */ jsxs5(Stack4, { gap: 12, children: [
      /* @__PURE__ */ jsx6(Text4, { as: "h1", tone: "title", children: "Checkout" }),
      /* @__PURE__ */ jsx6(Text4, { tone: "muted", children: "Add something to the cart first." }),
      /* @__PURE__ */ jsx6(Btn4, { variant: "ghost", onClick: () => go("#/"), children: "Shop" })
    ] });
  }
  const total = cartTotal2 + (ship === "express" ? 12 : 0);
  function submit() {
    if (!name.trim() || !email.trim()) {
      setErr("Name and email are required.");
      return;
    }
    clearCart();
    go("#/thanks");
  }
  return /* @__PURE__ */ jsxs5(Stack4, { gap: 16, children: [
    /* @__PURE__ */ jsx6(Text4, { as: "h1", tone: "title", children: "Checkout" }),
    /* @__PURE__ */ jsx6(Form, { class: "checkout", onSubmit: submit, children: /* @__PURE__ */ jsxs5(Stack4, { gap: 12, children: [
      /* @__PURE__ */ jsx6(
        Field,
        {
          label: "Name",
          value: name,
          onInput: (e) => setName(e.target.value)
        }
      ),
      /* @__PURE__ */ jsx6(
        Field,
        {
          label: "Email",
          value: email,
          onInput: (e) => setEmail(e.target.value)
        }
      ),
      /* @__PURE__ */ jsx6(
        Select2,
        {
          label: "Shipping",
          value: ship,
          onChange: (e) => setShip(e.target.value),
          options: [
            { value: "standard", label: "Standard (free)" },
            { value: "express", label: "Express (+$12)" }
          ]
        }
      ),
      /* @__PURE__ */ jsx6(
        Switch,
        {
          label: "Email me order updates",
          checked: updates,
          onChange: (e) => setUpdates(e.target.checked)
        }
      ),
      /* @__PURE__ */ jsx6(
        Switch,
        {
          label: "Add a gift note",
          checked: giftNote,
          onChange: (e) => setGiftNote(e.target.checked)
        }
      ),
      giftNote ? /* @__PURE__ */ jsx6(
        Field,
        {
          label: "Gift note",
          value: note,
          onInput: (e) => setNote(e.target.value)
        }
      ) : null,
      err ? /* @__PURE__ */ jsx6(Text4, { tone: "danger", class: "strike-err", children: err }) : null,
      /* @__PURE__ */ jsxs5(Stack4, { row: true, gap: 8, children: [
        /* @__PURE__ */ jsxs5(Btn4, { type: "submit", children: [
          "Place order \xB7 ",
          money(total)
        ] }),
        /* @__PURE__ */ jsx6(Btn4, { variant: "ghost", onClick: () => go("#/cart"), children: "Back to cart" })
      ] })
    ] }) })
  ] });
}

// src/pages/thanks.jsx
import { Btn as Btn5, Stack as Stack5, Text as Text5 } from "./vendor/strike-ui.js";
import { jsx as jsx7, jsxs as jsxs6 } from "./vendor/jsx-runtime.js";
function ThanksPage() {
  return /* @__PURE__ */ jsxs6(Stack5, { gap: 12, class: "thanks", children: [
    /* @__PURE__ */ jsx7(Text5, { as: "h1", tone: "title", children: "Order placed" }),
    /* @__PURE__ */ jsx7(Text5, { children: "Thanks - this demo store does not charge a card." }),
    /* @__PURE__ */ jsx7(Btn5, { onClick: () => go("#/"), children: "Return to shop" })
  ] });
}

// src/lab/page.jsx
import {
  useState as useState12,
  useEffect as useEffect2,
  useLayoutEffect as useLayoutEffect2,
  useMemo as useMemo3,
  mount
} from "./vendor/strike.core+hooks.js";
import { useTransition as useTransition2 } from "./vendor/transition.js";
import { html } from "./vendor/html.js";
import {
  Btn as Btn10,
  Stack as Stack11,
  Text as Text11,
  RadioGroup,
  NumberField,
  BtnGroup,
  ToggleGroup,
  Autocomplete
} from "./vendor/strike-ui.js";
import {
  Avatar as Avatar2,
  Badge,
  Chip,
  Divider,
  Icon as Icon2,
  Alert,
  Progress as Progress2,
  Skeleton,
  Paper,
  Box,
  Link,
  Tabs as Tabs2
} from "./strike.js-component-ui/index.js";
import { useParams, useNavigate } from "./strike.js-router/index.js";

// src/lab/island.jsx
import { useState as useState6 } from "./vendor/strike.core+hooks.js";
import { jsx as jsx8 } from "./vendor/jsx-runtime.js";
function IslandCounter({ n: initial = 0 }) {
  const [n, setN] = useState6(Number(initial) || 0);
  return /* @__PURE__ */ jsx8("button", { type: "button", class: "lab-island__btn", onClick: () => setN(n + 1), children: String(n) });
}

// src/lab/structure.jsx
import { useState as useState7 } from "./vendor/strike.core+hooks.js";
import { Btn as Btn6, Stack as Stack6, Text as Text6 } from "./vendor/strike-ui.js";
import {
  Card,
  Container,
  Grid,
  GridItem,
  List,
  ListItem,
  Accordion,
  AccordionItem,
  AppBar,
  Breadcrumbs,
  Tabs,
  Tooltip,
  Avatar,
  Icon
} from "./strike.js-component-ui/index.js";
import { jsx as jsx9, jsxs as jsxs7 } from "./vendor/jsx-runtime.js";
function StructurePlayground() {
  const [tab, setTab] = useState7("overview");
  const [picked, setPicked] = useState7("oak");
  return /* @__PURE__ */ jsxs7(Stack6, { gap: 18, class: "lab-controls", children: [
    /* @__PURE__ */ jsxs7("div", { class: "lab-control", children: [
      /* @__PURE__ */ jsx9(Text6, { as: "h3", class: "lab-control__name", children: "AppBar / Breadcrumbs" }),
      /* @__PURE__ */ jsx9(
        AppBar,
        {
          elevated: true,
          start: /* @__PURE__ */ jsx9(Text6, { as: "strong", children: "Harbor" }),
          end: /* @__PURE__ */ jsx9(Btn6, { variant: "ghost", type: "button", children: "Cart" }),
          children: /* @__PURE__ */ jsx9(Text6, { tone: "muted", children: "Lab chrome" })
        }
      ),
      /* @__PURE__ */ jsx9(
        Breadcrumbs,
        {
          items: [
            { label: "Shop", href: "#/" },
            { label: "Lab", href: "#/lab" },
            { label: "Structure" }
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxs7("div", { class: "lab-control", children: [
      /* @__PURE__ */ jsx9(Text6, { as: "h3", class: "lab-control__name", children: "Card / Container / Grid" }),
      /* @__PURE__ */ jsx9(Container, { size: "md", children: /* @__PURE__ */ jsxs7(Grid, { columns: 2, gap: 2, children: [
        /* @__PURE__ */ jsx9(GridItem, { children: /* @__PURE__ */ jsx9(
          Card,
          {
            title: "Cutting board",
            subtitle: "Oak",
            actions: /* @__PURE__ */ jsx9(Btn6, { variant: "primary", type: "button", children: "View" }),
            children: "Structured surface on Paper."
          }
        ) }),
        /* @__PURE__ */ jsx9(GridItem, { children: /* @__PURE__ */ jsx9(Card, { outlined: true, title: "Cast iron", subtitle: "Skillet", children: "Outlined variant." }) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs7("div", { class: "lab-control", children: [
      /* @__PURE__ */ jsx9(Text6, { as: "h3", class: "lab-control__name", children: "List" }),
      /* @__PURE__ */ jsxs7(List, { children: [
        /* @__PURE__ */ jsx9(
          ListItem,
          {
            selected: picked === "oak",
            onClick: () => setPicked("oak"),
            start: /* @__PURE__ */ jsx9(Avatar, { name: "Oak", size: "sm" }),
            children: "Oak board"
          }
        ),
        /* @__PURE__ */ jsx9(
          ListItem,
          {
            selected: picked === "teak",
            onClick: () => setPicked("teak"),
            start: /* @__PURE__ */ jsx9(Avatar, { name: "Teak", size: "sm" }),
            children: "Teak board"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs7("div", { class: "lab-control", children: [
      /* @__PURE__ */ jsx9(Text6, { as: "h3", class: "lab-control__name", children: "Accordion" }),
      /* @__PURE__ */ jsxs7(Accordion, { defaultValue: "ship", children: [
        /* @__PURE__ */ jsx9(AccordionItem, { id: "ship", title: "Shipping", children: "Standard 3-5 days." }),
        /* @__PURE__ */ jsx9(AccordionItem, { id: "care", title: "Care", children: "Hand wash only." })
      ] })
    ] }),
    /* @__PURE__ */ jsxs7("div", { class: "lab-control", children: [
      /* @__PURE__ */ jsx9(Text6, { as: "h3", class: "lab-control__name", children: "Tabs" }),
      /* @__PURE__ */ jsx9(
        Tabs,
        {
          value: tab,
          onChange: setTab,
          items: [
            { id: "overview", label: "Overview", panel: "Product overview copy." },
            { id: "specs", label: "Specs", panel: "Size and weight details." }
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxs7("div", { class: "lab-control", children: [
      /* @__PURE__ */ jsx9(Text6, { as: "h3", class: "lab-control__name", children: "Tooltip" }),
      /* @__PURE__ */ jsxs7(Stack6, { row: true, gap: 10, children: [
        /* @__PURE__ */ jsx9(Tooltip, { title: "Anchored to this button", placement: "top", children: /* @__PURE__ */ jsx9(Btn6, { variant: "ghost", type: "button", children: "Top" }) }),
        /* @__PURE__ */ jsx9(Tooltip, { title: "Anchored to this button", placement: "bottom", children: /* @__PURE__ */ jsx9(Btn6, { variant: "ghost", type: "button", children: "Bottom" }) }),
        /* @__PURE__ */ jsx9(Tooltip, { title: "Anchored to this button", placement: "left", children: /* @__PURE__ */ jsx9(Btn6, { variant: "ghost", type: "button", children: "Left" }) }),
        /* @__PURE__ */ jsx9(Tooltip, { title: "Anchored to this button", placement: "right", children: /* @__PURE__ */ jsx9(Btn6, { variant: "ghost", type: "button", children: "Right" }) })
      ] })
    ] })
  ] });
}

// src/lab/overlays.jsx
import { useState as useState8, useRef as useRef3 } from "./vendor/strike.core+hooks.js";
import { Btn as Btn7, Stack as Stack7, Text as Text7 } from "./vendor/strike-ui.js";
import {
  Drawer,
  Menu,
  MenuItem,
  MenuBar,
  Snackbar,
  snackbar as snackbar3,
  Pagination,
  Navigation
} from "./strike.js-component-ui/index.js";
import { jsx as jsx10, jsxs as jsxs8 } from "./vendor/jsx-runtime.js";
function OverlaysPlayground() {
  const [drawer, setDrawer] = useState8(false);
  const [menuOpen, setMenuOpen] = useState8(false);
  const [snack, setSnack] = useState8(false);
  const [snackPlace, setSnackPlace] = useState8("bottom-end");
  const [page, setPage] = useState8(3);
  const [n, setN] = useState8(0);
  const menuBtn = useRef3(null);
  function pushToast(placement) {
    const i = n + 1;
    setN(i);
    if (placement) setSnackPlace(placement);
    snackbar3.show({
      tone: "ok",
      children: "Toast " + i,
      autoHideMs: 4e3,
      placement: placement || snackPlace
    });
  }
  return /* @__PURE__ */ jsxs8(Stack7, { gap: 18, class: "lab-controls", children: [
    /* @__PURE__ */ jsxs8("div", { class: "lab-control", children: [
      /* @__PURE__ */ jsx10(Text7, { as: "h3", class: "lab-control__name", children: "Navigation" }),
      /* @__PURE__ */ jsx10(
        Navigation,
        {
          items: [
            { href: "#/", label: "Shop" },
            { href: "#/lab", label: "Lab", current: true }
          ],
          onNavigate: (item) => {
            location.hash = item.href.replace(/^#/, "") ? item.href : "#/";
          }
        }
      )
    ] }),
    /* @__PURE__ */ jsxs8("div", { class: "lab-control", children: [
      /* @__PURE__ */ jsx10(Text7, { as: "h3", class: "lab-control__name", children: "Drawer" }),
      /* @__PURE__ */ jsx10(Btn7, { variant: "ghost", type: "button", onClick: () => setDrawer(true), children: "Open drawer" }),
      /* @__PURE__ */ jsx10(
        Drawer,
        {
          open: drawer,
          onClose: () => setDrawer(false),
          title: "Filters",
          children: "Side panel via overlay."
        }
      )
    ] }),
    /* @__PURE__ */ jsxs8("div", { class: "lab-control", children: [
      /* @__PURE__ */ jsx10(Text7, { as: "h3", class: "lab-control__name", children: "Menu" }),
      /* @__PURE__ */ jsx10("span", { ref: menuBtn, children: /* @__PURE__ */ jsx10(
        Btn7,
        {
          variant: "ghost",
          type: "button",
          onClick: () => setMenuOpen(true),
          children: "Actions"
        }
      ) }),
      /* @__PURE__ */ jsxs8(
        Menu,
        {
          open: menuOpen,
          onClose: () => setMenuOpen(false),
          anchor: menuBtn,
          children: [
            /* @__PURE__ */ jsx10(MenuItem, { onSelect: () => setMenuOpen(false), children: "Edit" }),
            /* @__PURE__ */ jsx10(MenuItem, { onSelect: () => setMenuOpen(false), children: "Duplicate" }),
            /* @__PURE__ */ jsx10(MenuItem, { destructive: true, onSelect: () => setMenuOpen(false), children: "Delete" })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxs8("div", { class: "lab-control", children: [
      /* @__PURE__ */ jsx10(Text7, { as: "h3", class: "lab-control__name", children: "MenuBar" }),
      /* @__PURE__ */ jsx10(
        MenuBar,
        {
          items: [
            {
              id: "file",
              label: "File",
              children: [
                { label: "New", onSelect: () => {
                } },
                { label: "Open", onSelect: () => {
                } }
              ]
            },
            {
              id: "edit",
              label: "Edit",
              children: [{ label: "Undo", onSelect: () => {
              } }]
            }
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxs8("div", { class: "lab-control", children: [
      /* @__PURE__ */ jsx10(Text7, { as: "h3", class: "lab-control__name", children: "Snackbar" }),
      /* @__PURE__ */ jsx10(Text7, { tone: "muted", children: "Uses the app Shell host (slide-up + FLIP). Spam Stack to stack toasts." }),
      /* @__PURE__ */ jsxs8(Stack7, { row: true, gap: 8, children: [
        /* @__PURE__ */ jsx10(
          Btn7,
          {
            variant: "ghost",
            type: "button",
            onClick: () => {
              setSnackPlace("bottom-start");
              setSnack(true);
            },
            children: "Lone start"
          }
        ),
        /* @__PURE__ */ jsx10(
          Btn7,
          {
            variant: "ghost",
            type: "button",
            onClick: () => pushToast("bottom-start"),
            children: "Stack start"
          }
        ),
        /* @__PURE__ */ jsx10(
          Btn7,
          {
            variant: "ghost",
            type: "button",
            onClick: () => pushToast("bottom-center"),
            children: "Stack center"
          }
        ),
        /* @__PURE__ */ jsx10(
          Btn7,
          {
            variant: "ghost",
            type: "button",
            onClick: () => pushToast("bottom-end"),
            children: "Stack end"
          }
        )
      ] }),
      /* @__PURE__ */ jsx10(
        Snackbar,
        {
          open: snack,
          onClose: () => setSnack(false),
          tone: "ok",
          placement: snackPlace,
          children: "Saved to cart"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs8("div", { class: "lab-control", children: [
      /* @__PURE__ */ jsx10(Text7, { as: "h3", class: "lab-control__name", children: "Pagination" }),
      /* @__PURE__ */ jsx10(Pagination, { page, count: 12, onChange: setPage })
    ] })
  ] });
}

// src/lab/media.jsx
import { useState as useState9 } from "./vendor/strike.core+hooks.js";
import { Stack as Stack8, Text as Text8 } from "./vendor/strike-ui.js";
import {
  Table,
  ImageList,
  Video,
  Audio,
  Stepper
} from "./strike.js-component-ui/index.js";
import { jsx as jsx11, jsxs as jsxs9 } from "./vendor/jsx-runtime.js";
function MediaPlayground() {
  const [step, setStep] = useState9(0);
  return /* @__PURE__ */ jsxs9(Stack8, { gap: 18, class: "lab-controls", children: [
    /* @__PURE__ */ jsxs9("div", { class: "lab-control", children: [
      /* @__PURE__ */ jsx11(Text8, { as: "h3", class: "lab-control__name", children: "Table" }),
      /* @__PURE__ */ jsx11(
        Table,
        {
          caption: "Stock",
          columns: [
            { key: "name", label: "Product" },
            { key: "qty", label: "Qty" }
          ],
          rows: [
            { name: "Cutting board", qty: 12 },
            { name: "Skillet", qty: 4 }
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxs9("div", { class: "lab-control", children: [
      /* @__PURE__ */ jsx11(Text8, { as: "h3", class: "lab-control__name", children: "ImageList" }),
      /* @__PURE__ */ jsx11(
        ImageList,
        {
          cols: 3,
          rowHeight: 72,
          items: [
            {
              src: "https://picsum.photos/seed/harbor1/160/160",
              alt: "Board",
              title: "Oak"
            },
            {
              src: "https://picsum.photos/seed/harbor2/160/160",
              alt: "Pan",
              title: "Iron"
            },
            {
              src: "https://picsum.photos/seed/harbor3/160/160",
              alt: "Mill",
              title: "Mill"
            }
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxs9("div", { class: "lab-control", children: [
      /* @__PURE__ */ jsx11(Text8, { as: "h3", class: "lab-control__name", children: "Stepper" }),
      /* @__PURE__ */ jsx11(
        Stepper,
        {
          orientation: "vertical",
          activeStep: step,
          steps: [
            { label: "Cart" },
            { label: "Ship" },
            { label: "Pay" }
          ]
        }
      ),
      /* @__PURE__ */ jsx11(
        Stepper,
        {
          variant: "mobile",
          activeStep: step,
          steps: [
            { label: "Cart" },
            { label: "Ship" },
            { label: "Pay" }
          ],
          onNext: () => setStep(Math.min(2, step + 1)),
          onBack: () => setStep(Math.max(0, step - 1))
        }
      )
    ] }),
    /* @__PURE__ */ jsxs9("div", { class: "lab-control", children: [
      /* @__PURE__ */ jsx11(Text8, { as: "h3", class: "lab-control__name", children: "Video / Audio" }),
      /* @__PURE__ */ jsx11(
        Video,
        {
          ratio: "16 / 9",
          controls: true,
          poster: "https://picsum.photos/seed/harborv/640/360"
        }
      ),
      /* @__PURE__ */ jsx11(Audio, { title: "Sample tone", controls: true })
    ] })
  ] });
}

// src/lab/datagrid.jsx
import { useState as useState10, useMemo as useMemo2 } from "./vendor/strike.core+hooks.js";
import { Stack as Stack9, Text as Text9, Btn as Btn8 } from "./vendor/strike-ui.js";
import { DataGrid, rowsToCsv } from "./strike.js-datagrid/index.js";
import { jsx as jsx12, jsxs as jsxs10 } from "./vendor/jsx-runtime.js";
function makeRows(n) {
  const out = [];
  for (let i = 1; i <= n; i++) {
    out.push({
      id: i,
      name: "Product " + i,
      qty: i * 3 % 40,
      active: i % 2 === 0,
      when: "2024-0" + (i % 9 + 1) + "-15"
    });
  }
  return out;
}
function DataGridPlayground() {
  const [rows, setRows] = useState10(() => makeRows(32));
  const [selected, setSelected] = useState10([]);
  const [visibility, setVisibility] = useState10({});
  const [colWidths, setColWidths] = useState10({
    name: 160,
    qty: 88,
    active: 88,
    when: 120
  });
  const [rowOrder, setRowOrder] = useState10(
    () => makeRows(8).map((r) => r.id)
  );
  const [colOrder, setColOrder] = useState10(["name", "qty", "active"]);
  const [serverModel, setServerModel] = useState10({ page: 0, pageSize: 5 });
  const allServer = useMemo2(() => makeRows(20), []);
  const serverRows = useMemo2(() => {
    const start = serverModel.page * serverModel.pageSize;
    return allServer.slice(start, start + serverModel.pageSize);
  }, [allServer, serverModel]);
  const orderedRows = useMemo2(() => makeRows(8), []);
  const reorderCols = [
    { field: "name", headerName: "Name", editable: true },
    { field: "qty", headerName: "Qty", type: "number" },
    { field: "active", headerName: "Active", type: "boolean" }
  ];
  const cols = [
    { field: "name", headerName: "Product", editable: true },
    { field: "qty", headerName: "Qty", type: "number", editable: true },
    { field: "active", headerName: "Active", type: "boolean", editable: true },
    { field: "when", headerName: "When", type: "date", editable: true }
  ];
  return /* @__PURE__ */ jsxs10(Stack9, { gap: 18, class: "lab-controls", children: [
    /* @__PURE__ */ jsxs10(
      "div",
      {
        class: "lab-control",
        style: {
          "--strike-grid-selected": "#e8f2ee",
          "--strike-data-grid-max-height": "280px"
        },
        children: [
          /* @__PURE__ */ jsx12(Text9, { as: "h3", class: "lab-control__name", children: "DataGrid" }),
          /* @__PURE__ */ jsxs10(Text9, { tone: "muted", children: [
            "Sort (Shift+click multi), filter, page, select, edit. Drag column edges to resize. Selected: ",
            selected.join(", ") || "none"
          ] }),
          /* @__PURE__ */ jsx12(
            Btn8,
            {
              type: "button",
              variant: "ghost",
              onClick: () => setVisibility((v) => ({ ...v, when: v.when === false ? true : false })),
              children: "Toggle When column"
            }
          ),
          /* @__PURE__ */ jsx12(
            Btn8,
            {
              type: "button",
              variant: "ghost",
              onClick: () => {
                const csv = rowsToCsv(rows, cols.filter((c) => visibility[c.field] !== false));
                const blob = new Blob([csv], { type: "text/csv" });
                const a = document.createElement("a");
                a.href = URL.createObjectURL(blob);
                a.download = "grid.csv";
                a.click();
              },
              children: "Download CSV"
            }
          ),
          /* @__PURE__ */ jsx12(
            DataGrid,
            {
              columns: cols,
              rows,
              getRowId: (r) => r.id,
              checkboxSelection: true,
              isRowSelectable: (r) => r.id !== 3,
              columnVisibilityModel: visibility,
              onColumnVisibilityModelChange: setVisibility,
              columnWidthModel: colWidths,
              onColumnWidthChange: setColWidths,
              striped: true,
              stripedRowScope: "dataset",
              headerShade: true,
              pageSizeOptions: [5, 10, 25],
              defaultPaginationModel: { page: 0, pageSize: 5 },
              selectionModel: selected,
              onSelectionModelChange: setSelected,
              editOnClick: false,
              enableGridKeyboard: true,
              processRowUpdate: (next) => {
                setRows((rs) => rs.map((r) => r.id === next.id ? next : r));
                return next;
              }
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxs10("div", { class: "lab-control", children: [
      /* @__PURE__ */ jsx12(Text9, { as: "h3", class: "lab-control__name", children: "DataGrid (reorder + virtualize)" }),
      /* @__PURE__ */ jsx12(Text9, { tone: "muted", children: "Drag the dotted handle on a row or column header (or focus it and use arrow keys). Sort is off while row reorder is on." }),
      /* @__PURE__ */ jsx12(
        DataGrid,
        {
          columns: reorderCols,
          rows: orderedRows,
          getRowId: (r) => r.id,
          rowOrderModel: rowOrder,
          onRowOrderChange: setRowOrder,
          columnOrderModel: colOrder,
          onColumnOrderChange: setColOrder,
          virtualize: true,
          getRowHeight: 36,
          pageSizeOptions: [8],
          defaultPaginationModel: { page: 0, pageSize: 8 },
          disableQuickFilter: true,
          processRowUpdate: (next) => next
        }
      )
    ] }),
    /* @__PURE__ */ jsxs10("div", { class: "lab-control", children: [
      /* @__PURE__ */ jsx12(Text9, { as: "h3", class: "lab-control__name", children: "DataGrid (server page)" }),
      /* @__PURE__ */ jsx12(
        DataGrid,
        {
          columns: [{ field: "name", headerName: "Name" }],
          rows: serverRows,
          getRowId: (r) => r.id,
          paginationMode: "server",
          rowCount: allServer.length,
          paginationModel: serverModel,
          onPaginationModelChange: setServerModel,
          pageSizeOptions: [5, 10],
          disableQuickFilter: true
        }
      )
    ] })
  ] });
}

// src/lab/store.jsx
import { useState as useState11 } from "./vendor/strike.core+hooks.js";
import { Btn as Btn9, Stack as Stack10, Text as Text10 } from "./vendor/strike-ui.js";
import { Progress } from "./strike.js-component-ui/index.js";
import {
  createQueryClient,
  useQueryGroup
} from "./strike.js-store/lib/query-entry.js";
import { jsx as jsx13, jsxs as jsxs11 } from "./vendor/jsx-runtime.js";
var client = createQueryClient();
function delay(ms) {
  return new Promise(function(resolve) {
    setTimeout(resolve, ms);
  });
}
function StorePlayground() {
  const group = useQueryGroup(client, "lab-fetch");
  const [last, setLast] = useState11("");
  function runFetch(report) {
    client.run(
      "lab-fetch",
      async function(ctx) {
        for (let step = 1; step <= 5; step++) {
          await delay(120);
          if (report) ctx.reportProgress(step / 5);
        }
        return { at: Date.now() };
      },
      {
        key: "demo",
        onSuccess: function(data) {
          setLast("Done at " + data.at);
        }
      }
    ).catch(function() {
    });
  }
  return /* @__PURE__ */ jsxs11(Stack10, { gap: 16, class: "lab-store", children: [
    /* @__PURE__ */ jsx13(Text10, { children: "Query groups stack Promise work and expose pending / progress for UI." }),
    /* @__PURE__ */ jsxs11(Stack10, { row: true, gap: 8, children: [
      /* @__PURE__ */ jsx13(Btn9, { onClick: () => runFetch(true), children: "Run with progress" }),
      /* @__PURE__ */ jsx13(Btn9, { variant: "ghost", onClick: () => runFetch(false), children: "Run indeterminate" }),
      /* @__PURE__ */ jsx13(Btn9, { variant: "ghost", onClick: () => client.cancel("lab-fetch"), children: "Cancel" })
    ] }),
    group.pending > 0 ? group.progress == null ? /* @__PURE__ */ jsx13(Progress, { label: "Fetching" }) : /* @__PURE__ */ jsx13(
      Progress,
      {
        label: "Fetching",
        value: Math.round(group.progress * 100)
      }
    ) : null,
    /* @__PURE__ */ jsxs11(Text10, { tone: "muted", children: [
      "Status: ",
      group.status,
      group.pending ? " (" + group.pending + " pending)" : ""
    ] }),
    last ? /* @__PURE__ */ jsx13(Text10, { children: last }) : null
  ] });
}

// src/lab/page.jsx
import { jsx as jsx14, jsxs as jsxs12 } from "./vendor/jsx-runtime.js";
function HtmlPlayground() {
  const [n, setN] = useState12(0);
  const busy = n >= 5;
  return html`
		<div class="lab-html">
			<p class="lab-html__status">Clicked ${n}${busy ? " (disabled)" : ""}</p>
			<button
				type="button"
				class="lab-html__btn"
				?disabled=${busy}
				@click=${() => setN(n + 1)}
			>
				html tagged click
			</button>
		</div>
	`;
}
function HydrateIsland() {
  useLayoutEffect2(() => {
    const host = document.getElementById("lab-hydrate");
    if (!host || host.__strikeLab) return;
    host.__strikeLab = true;
    if (!host.firstChild) {
      host.innerHTML = '<button type="button" class="lab-island__btn">0</button>';
    }
    mount(host, IslandCounter, { n: 0 });
  }, []);
  return /* @__PURE__ */ jsx14(
    "div",
    {
      id: "lab-hydrate",
      class: "lab-island",
      "data-hydrate": true,
      "data-props": '{"n":0}'
    }
  );
}
function ControlsPlayground() {
  const [ship, setShip] = useState12("standard");
  const [size, setSize] = useState12("m");
  const [tags, setTags] = useState12(["kitchen"]);
  const [qty, setQty] = useState12(1);
  const [query, setQuery] = useState12("");
  const [picked, setPicked] = useState12("");
  const all = useMemo3(
    () => [
      { value: "board", label: "Cutting board" },
      { value: "skillet", label: "Cast iron" },
      { value: "apron", label: "Linen apron" },
      { value: "mill", label: "Coffee mill" }
    ],
    []
  );
  const filtered = useMemo3(() => {
    const q = query.trim().toLowerCase();
    if (!q) return all;
    return all.filter(
      (o) => o.label.toLowerCase().includes(q) || o.value.toLowerCase().includes(q)
    );
  }, [all, query]);
  return /* @__PURE__ */ jsxs12(Stack11, { gap: 18, class: "lab-controls", children: [
    /* @__PURE__ */ jsxs12("div", { class: "lab-control", children: [
      /* @__PURE__ */ jsx14(Text11, { as: "h3", class: "lab-control__name", children: "RadioGroup" }),
      /* @__PURE__ */ jsx14(
        RadioGroup,
        {
          label: "Shipping",
          name: "lab-ship",
          row: true,
          value: ship,
          options: [
            { value: "standard", label: "Standard" },
            { value: "express", label: "Express" }
          ],
          onChange: (e) => setShip(e.target.value)
        }
      )
    ] }),
    /* @__PURE__ */ jsxs12("div", { class: "lab-control", children: [
      /* @__PURE__ */ jsx14(Text11, { as: "h3", class: "lab-control__name", children: "ToggleGroup" }),
      /* @__PURE__ */ jsxs12(Stack11, { gap: 10, children: [
        /* @__PURE__ */ jsx14(
          ToggleGroup,
          {
            value: size,
            options: [
              { value: "s", label: "S" },
              { value: "m", label: "M" },
              { value: "l", label: "L" }
            ],
            onChange: setSize
          }
        ),
        /* @__PURE__ */ jsx14(
          ToggleGroup,
          {
            exclusive: false,
            joined: false,
            value: tags,
            options: [
              { value: "kitchen", label: "Kitchen" },
              { value: "brew", label: "Brew" },
              { value: "table", label: "Table" }
            ],
            onChange: setTags
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs12("div", { class: "lab-control", children: [
      /* @__PURE__ */ jsx14(Text11, { as: "h3", class: "lab-control__name", children: "NumberField" }),
      /* @__PURE__ */ jsx14(
        NumberField,
        {
          label: "Quantity",
          value: qty,
          min: 1,
          max: 9,
          onInput: (e) => setQty(Number(e.target.value))
        }
      )
    ] }),
    /* @__PURE__ */ jsxs12("div", { class: "lab-control", children: [
      /* @__PURE__ */ jsx14(Text11, { as: "h3", class: "lab-control__name", children: "BtnGroup" }),
      /* @__PURE__ */ jsxs12(BtnGroup, { children: [
        /* @__PURE__ */ jsx14(Btn10, { variant: "ghost", type: "button", children: "Left" }),
        /* @__PURE__ */ jsx14(Btn10, { variant: "ghost", type: "button", children: "Mid" }),
        /* @__PURE__ */ jsx14(Btn10, { variant: "primary", type: "button", children: "Right" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs12("div", { class: "lab-control", children: [
      /* @__PURE__ */ jsx14(Text11, { as: "h3", class: "lab-control__name", children: "Autocomplete" }),
      /* @__PURE__ */ jsx14(
        Autocomplete,
        {
          label: "Find a tool",
          value: query,
          options: filtered,
          onInput: (e) => setQuery(e.target.value),
          onSelect: (opt) => {
            setQuery(opt.label);
            setPicked(opt.value);
          }
        }
      )
    ] }),
    /* @__PURE__ */ jsxs12(Text11, { tone: "muted", class: "lab-controls__summary", children: [
      "Ship ",
      ship,
      " \xB7 size ",
      size,
      " \xB7 tags ",
      tags.join(", ") || "none",
      " \xB7 qty",
      " ",
      qty,
      picked ? " \xB7 picked " + picked : ""
    ] })
  ] });
}
function CheckIcon() {
  return /* @__PURE__ */ jsx14(Icon2, { size: "sm", label: "ok", children: /* @__PURE__ */ jsx14("svg", { viewBox: "0 0 24 24", "aria-hidden": "true", children: /* @__PURE__ */ jsx14("path", { d: "M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z" }) }) });
}
function FadeAlert({ open, onClose, class: className, children, ...rest }) {
  const [mounted, setMounted] = useState12(!!open);
  const { className: txClass, style } = useTransition2({
    name: "fade",
    ms: 160,
    open: !!open,
    onExited: () => setMounted(false)
  });
  useEffect2(() => {
    if (open) setMounted(true);
  }, [open]);
  if (!mounted) return null;
  return /* @__PURE__ */ jsx14(
    Alert,
    {
      ...rest,
      class: [txClass, className].filter(Boolean).join(" "),
      style,
      onClose,
      children
    }
  );
}
function ExtendedPlayground() {
  const [chipOn, setChipOn] = useState12(true);
  const [chips, setChips] = useState12(["oak", "teak"]);
  const [alertOpen, setAlertOpen] = useState12(true);
  const [prog, setProg] = useState12(35);
  return /* @__PURE__ */ jsxs12(Stack11, { gap: 18, class: "lab-controls", children: [
    /* @__PURE__ */ jsxs12("div", { class: "lab-control", children: [
      /* @__PURE__ */ jsx14(Text11, { as: "h3", class: "lab-control__name", children: "Avatar / Badge / Icon" }),
      /* @__PURE__ */ jsxs12(Stack11, { row: true, gap: 14, children: [
        /* @__PURE__ */ jsx14(Badge, { content: 2, children: /* @__PURE__ */ jsx14(Avatar2, { name: "Harbor Goods" }) }),
        /* @__PURE__ */ jsx14(Avatar2, { name: "Ada Lovelace", size: "lg" }),
        /* @__PURE__ */ jsx14(Badge, { tone: "danger", dot: true, children: /* @__PURE__ */ jsx14(Icon2, { size: "lg", children: /* @__PURE__ */ jsx14("svg", { viewBox: "0 0 24 24", "aria-hidden": "true", children: /* @__PURE__ */ jsx14("path", { d: "M12 22c1.1 0 2-.9 2-2h-4a2 2 0 002 2zm6-6V11c0-3.07-1.64-5.64-4.5-6.32V4a1.5 1.5 0 00-3 0v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" }) }) }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs12("div", { class: "lab-control", children: [
      /* @__PURE__ */ jsx14(Text11, { as: "h3", class: "lab-control__name", children: "Chip" }),
      /* @__PURE__ */ jsxs12(Stack11, { row: true, gap: 8, children: [
        /* @__PURE__ */ jsx14(Chip, { selected: chipOn, onClick: () => setChipOn(!chipOn), children: "Filter" }),
        chips.map((c) => /* @__PURE__ */ jsx14(
          Chip,
          {
            onDelete: () => setChips(chips.filter((x) => x !== c)),
            children: c
          },
          c
        )),
        /* @__PURE__ */ jsx14(Chip, { startIcon: /* @__PURE__ */ jsx14(CheckIcon, {}), tone: "ok", children: "In stock" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs12("div", { class: "lab-control", children: [
      /* @__PURE__ */ jsx14(Text11, { as: "h3", class: "lab-control__name", children: "Alert" }),
      /* @__PURE__ */ jsx14(
        FadeAlert,
        {
          open: alertOpen,
          tone: "info",
          title: "Foundations",
          onClose: () => setAlertOpen(false),
          children: "Dismissible inline feedback with a fade exit."
        }
      ),
      !alertOpen ? /* @__PURE__ */ jsx14(
        Btn10,
        {
          variant: "ghost",
          type: "button",
          onClick: () => setAlertOpen(true),
          children: "Show alert"
        }
      ) : null
    ] }),
    /* @__PURE__ */ jsxs12("div", { class: "lab-control", children: [
      /* @__PURE__ */ jsx14(Text11, { as: "h3", class: "lab-control__name", children: "Progress" }),
      /* @__PURE__ */ jsxs12(Stack11, { gap: 10, children: [
        /* @__PURE__ */ jsx14(Progress2, { value: prog, label: "Load" }),
        /* @__PURE__ */ jsx14(Progress2, { label: "Busy" }),
        /* @__PURE__ */ jsxs12(Stack11, { row: true, gap: 8, children: [
          /* @__PURE__ */ jsx14(
            Btn10,
            {
              variant: "ghost",
              type: "button",
              onClick: () => setProg(Math.max(0, prog - 10)),
              children: "-10"
            }
          ),
          /* @__PURE__ */ jsx14(
            Btn10,
            {
              variant: "ghost",
              type: "button",
              onClick: () => setProg(Math.min(100, prog + 10)),
              children: "+10"
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs12("div", { class: "lab-control", children: [
      /* @__PURE__ */ jsx14(Text11, { as: "h3", class: "lab-control__name", children: "Skeleton" }),
      /* @__PURE__ */ jsxs12(Stack11, { gap: 8, children: [
        /* @__PURE__ */ jsx14(Skeleton, { variant: "text", width: "60%" }),
        /* @__PURE__ */ jsx14(Skeleton, { variant: "rectangular", height: 48, animation: "wave" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs12("div", { class: "lab-control", children: [
      /* @__PURE__ */ jsx14(Text11, { as: "h3", class: "lab-control__name", children: "Paper / Box / Link / Divider" }),
      /* @__PURE__ */ jsx14(Paper, { elevation: 1, children: /* @__PURE__ */ jsxs12(Box, { p: 2, display: "flex", direction: "column", gap: 2, children: [
        /* @__PURE__ */ jsx14(Text11, { as: "h3", children: "Paper surface" }),
        /* @__PURE__ */ jsx14(Text11, { tone: "muted", children: "Box lays out with spacing scale." }),
        /* @__PURE__ */ jsx14(Divider, { label: "or" }),
        /* @__PURE__ */ jsx14(Link, { href: "#/lab", underline: "hover", children: "Lab link" }),
        /* @__PURE__ */ jsx14(Link, { href: "https://example.com", external: true, children: "External" })
      ] }) })
    ] })
  ] });
}
function LabPanel({ title, blurb, sectionKey, children }) {
  return /* @__PURE__ */ jsxs12("div", { class: "lab-panel", children: [
    /* @__PURE__ */ jsxs12("header", { class: "lab-panel__head", children: [
      /* @__PURE__ */ jsx14(Text11, { as: "h2", class: "lab-panel__title", children: title }),
      blurb ? /* @__PURE__ */ jsx14(Text11, { tone: "muted", class: "lab-panel__blurb", children: blurb }) : null
    ] }),
    /* @__PURE__ */ jsx14(RouteFade, { routeKey: sectionKey || title, children })
  ] });
}
function LabPage() {
  const { section: sectionParam } = useParams();
  const navigate = useNavigate();
  const section = sectionParam || "core";
  const setSection = (id) => {
    navigate(id ? "/lab/" + id : "/lab", { replace: true });
  };
  const items = [
    {
      id: "templates",
      label: "Templates",
      panel: /* @__PURE__ */ jsx14(
        LabPanel,
        {
          title: "html templates",
          sectionKey: "templates",
          blurb: "No JSX compile - prefixes .prop ?bool @event.",
          children: /* @__PURE__ */ jsx14(HtmlPlayground, {})
        }
      )
    },
    {
      id: "hydrate",
      label: "Hydrate",
      panel: /* @__PURE__ */ jsx14(
        LabPanel,
        {
          title: "Hydrate island",
          sectionKey: "hydrate",
          blurb: "Pre-rendered button kept on first mount via data-hydrate.",
          children: /* @__PURE__ */ jsx14(HydrateIsland, {})
        }
      )
    },
    {
      id: "core",
      label: "Core UI",
      panel: /* @__PURE__ */ jsx14(
        LabPanel,
        {
          title: "Core UI",
          sectionKey: "core",
          blurb: "RadioGroup, ToggleGroup, NumberField, BtnGroup, Autocomplete - vendor/strike-ui.js.",
          children: /* @__PURE__ */ jsx14(ControlsPlayground, {})
        }
      )
    },
    {
      id: "foundations",
      label: "Foundations",
      panel: /* @__PURE__ */ jsx14(
        LabPanel,
        {
          title: "Foundations",
          sectionKey: "foundations",
          blurb: "Avatar, Badge, Chip, Alert, Progress, Skeleton, Paper, Box, Link, Icon, Divider.",
          children: /* @__PURE__ */ jsx14(ExtendedPlayground, {})
        }
      )
    },
    {
      id: "structure",
      label: "Structure",
      panel: /* @__PURE__ */ jsx14(
        LabPanel,
        {
          title: "Structure",
          sectionKey: "structure",
          blurb: "Card, Container, Grid, List, Accordion, AppBar, Breadcrumbs, Tabs, Tooltip.",
          children: /* @__PURE__ */ jsx14(StructurePlayground, {})
        }
      )
    },
    {
      id: "overlays",
      label: "Overlays",
      panel: /* @__PURE__ */ jsx14(
        LabPanel,
        {
          title: "Overlays",
          sectionKey: "overlays",
          blurb: "Drawer, Menu, MenuBar, Snackbar, Pagination, Navigation.",
          children: /* @__PURE__ */ jsx14(OverlaysPlayground, {})
        }
      )
    },
    {
      id: "media",
      label: "Media",
      panel: /* @__PURE__ */ jsx14(
        LabPanel,
        {
          title: "Media and data",
          sectionKey: "media",
          blurb: "Table, ImageList, Stepper, Video, Audio.",
          children: /* @__PURE__ */ jsx14(MediaPlayground, {})
        }
      )
    },
    {
      id: "store",
      label: "Store",
      panel: /* @__PURE__ */ jsx14(
        LabPanel,
        {
          title: "Store and query",
          sectionKey: "store",
          blurb: "strike-fw-store atoms, persist, and query groups driving Progress.",
          children: /* @__PURE__ */ jsx14(StorePlayground, {})
        }
      )
    },
    {
      id: "datagrid",
      label: "DataGrid",
      panel: /* @__PURE__ */ jsx14(
        LabPanel,
        {
          title: "DataGrid",
          sectionKey: "datagrid",
          blurb: "Sort, filter, page, select, edit, reorder, resize - strike-fw-datagrid.",
          children: /* @__PURE__ */ jsx14(DataGridPlayground, {})
        }
      )
    }
  ];
  return /* @__PURE__ */ jsxs12(Stack11, { gap: 22, class: "lab", children: [
    /* @__PURE__ */ jsxs12("header", { class: "lab-hero", children: [
      /* @__PURE__ */ jsx14("p", { class: "lab-hero__eyebrow", children: "Strike playground" }),
      /* @__PURE__ */ jsx14(Text11, { as: "h1", class: "lab-hero__title", children: "Lab" }),
      /* @__PURE__ */ jsx14(Text11, { class: "lab-hero__lede", children: "Kitchen-sink for Strike APIs outside the shop. Core UI from vendor; extended UI from strike-fw-ui; grid from strike-fw-datagrid; store from strike-fw-store." })
    ] }),
    /* @__PURE__ */ jsx14("div", { class: "lab-shell", children: /* @__PURE__ */ jsx14(
      Tabs2,
      {
        class: "lab-tabs",
        value: section,
        onChange: setSection,
        items
      }
    ) }),
    /* @__PURE__ */ jsx14(
      Btn10,
      {
        variant: "ghost",
        onClick: () => navigate("/", { replace: false }),
        children: "Back to shop"
      }
    )
  ] });
}

// src/app/main.jsx
import { jsx as jsx15, jsxs as jsxs13 } from "./vendor/jsx-runtime.js";
function ProductRoute() {
  const { id } = useParams2();
  return /* @__PURE__ */ jsx15(ProductPage, { id });
}
function AppRoutes() {
  return /* @__PURE__ */ jsxs13(Routes, { children: [
    /* @__PURE__ */ jsx15(Route, { path: "/", element: /* @__PURE__ */ jsx15(ShopHome, {}) }),
    /* @__PURE__ */ jsx15(Route, { path: "/product/:id", element: /* @__PURE__ */ jsx15(ProductRoute, {}) }),
    /* @__PURE__ */ jsx15(Route, { path: "/cart", element: /* @__PURE__ */ jsx15(CartPage, {}) }),
    /* @__PURE__ */ jsx15(Route, { path: "/checkout", element: /* @__PURE__ */ jsx15(CheckoutPage, {}) }),
    /* @__PURE__ */ jsx15(Route, { path: "/thanks", element: /* @__PURE__ */ jsx15(ThanksPage, {}) }),
    /* @__PURE__ */ jsx15(Route, { path: "/lab/:section?", element: /* @__PURE__ */ jsx15(LabPage, {}) })
  ] });
}
function App() {
  return /* @__PURE__ */ jsx15(Router, { children: /* @__PURE__ */ jsx15(Shell, { children: /* @__PURE__ */ jsx15(AppRoutes, {}) }) });
}
if (typeof document !== "undefined" && document.getElementById("app")) {
  if (!location.hash) location.hash = "#/";
  mount2("#app", App);
}
export {
  App,
  PRODUCTS
};
