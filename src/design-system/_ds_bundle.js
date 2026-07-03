/* @ds-bundle: {"format":3,"namespace":"SiloGuardDesignSystem_633342","components":[{"name":"AlertCard","sourcePath":"components/alert-card/AlertCard.jsx"},{"name":"Button","sourcePath":"components/button/Button.jsx"},{"name":"EmptyState","sourcePath":"components/empty-state/EmptyState.jsx"},{"name":"Icon","sourcePath":"components/icon/Icon.jsx"},{"name":"ICON_NAMES","sourcePath":"components/icon/Icon.jsx"},{"name":"Input","sourcePath":"components/input/Input.jsx"},{"name":"ListItem","sourcePath":"components/list-item/ListItem.jsx"},{"name":"Modal","sourcePath":"components/modal/Modal.jsx"},{"name":"BottomSheet","sourcePath":"components/modal/Modal.jsx"},{"name":"NavBar","sourcePath":"components/nav-bar/NavBar.jsx"},{"name":"SensorStat","sourcePath":"components/sensor-stat/SensorStat.jsx"},{"name":"StatusDot","sourcePath":"components/status-badge/StatusBadge.jsx"},{"name":"StatusBadge","sourcePath":"components/status-badge/StatusBadge.jsx"},{"name":"Tabs","sourcePath":"components/tabs/Tabs.jsx"},{"name":"ToastProvider","sourcePath":"components/toast/Toast.jsx"},{"name":"Toast","sourcePath":"components/toast/Toast.jsx"},{"name":"Toggle","sourcePath":"components/toggle/Toggle.jsx"}],"sourceHashes":{"components/alert-card/AlertCard.jsx":"68f820293ed4","components/button/Button.jsx":"f7af2f58e79e","components/empty-state/EmptyState.jsx":"95c4b1f3d478","components/icon/Icon.jsx":"6447ae401ea6","components/input/Input.jsx":"a4f499ba44e2","components/list-item/ListItem.jsx":"e3b17e8ed743","components/modal/Modal.jsx":"5b65dab9c003","components/nav-bar/NavBar.jsx":"1c7caa862d98","components/sensor-stat/SensorStat.jsx":"88b8197a9680","components/status-badge/StatusBadge.jsx":"e77a2cff4357","components/tabs/Tabs.jsx":"2de5fb27ff52","components/toast/Toast.jsx":"4e00a615dcd1","components/toggle/Toggle.jsx":"6b396f91a503","screens/historial-screen.jsx":"9bd1742180cb","screens/mock-data.js":"d67dc6a25c5b","screens/profile-screens.jsx":"8f40daf13468","screens/tweaks-panel.jsx":"6591467622ed","ui_kits/onboarding/ScreensAuth.jsx":"b907a0cb732b","ui_kits/onboarding/ScreensAuth.standalone.jsx":"a0eb0a1e081d","ui_kits/onboarding/ScreensOnboarding.jsx":"919796cef44b","ui_kits/onboarding/Shell.jsx":"54851f0f542a","ui_kits/onboarding/Shell.standalone.jsx":"51c8315dbdf6"},"inlinedExternals":[],"unexposedExports":[{"name":"useToast","sourcePath":"components/toast/Toast.jsx"}]} */

(() => {

const __ds_ns = (window.SiloGuardDesignSystem_633342 = window.SiloGuardDesignSystem_633342 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/button/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const SIZES = {
  sm: {
    height: 36,
    padding: '0 14px',
    font: 'var(--text-caption)'
  },
  md: {
    height: 44,
    padding: '0 18px',
    font: 'var(--text-body)'
  },
  lg: {
    height: 48,
    padding: '0 22px',
    font: 'var(--text-body)'
  }
};

/**
 * SiloGuard button. Primary is the signature solid-green CTA; secondary is an
 * outlined surface button; ghost is text-only. Matches the prototype's
 * full-width green action buttons (radius-md, bold, +0.3 tracking).
 */
function Button({
  children,
  variant = 'primary',
  size = 'lg',
  fullWidth = false,
  disabled = false,
  leadingIcon,
  trailingIcon,
  style,
  ...rest
}) {
  const s = SIZES[size] || SIZES.lg;
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--space-sm)',
    height: s.height,
    padding: s.padding,
    width: fullWidth ? '100%' : undefined,
    fontFamily: 'var(--font-sans)',
    fontSize: s.font,
    fontWeight: 'var(--fw-bold)',
    letterSpacing: 'var(--ls-label)',
    lineHeight: 1,
    borderRadius: 'var(--radius-md)',
    border: '1px solid transparent',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'background var(--dur-fast) var(--ease-standard), border-color var(--dur-fast) var(--ease-standard), opacity var(--dur-fast) var(--ease-standard), transform var(--dur-fast) var(--ease-standard)',
    WebkitTapHighlightColor: 'transparent',
    userSelect: 'none',
    whiteSpace: 'nowrap'
  };
  const variants = {
    primary: {
      background: 'var(--action-primary)',
      color: 'var(--action-primary-text)'
    },
    secondary: {
      background: 'var(--surface-card)',
      color: 'var(--text-primary)',
      borderColor: 'var(--border-default)'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-link)'
    },
    danger: {
      background: 'var(--status-critical)',
      color: '#fff'
    }
  };
  const disabledStyle = disabled ? {
    opacity: 0.4,
    pointerEvents: 'none'
  } : null;
  const [hover, setHover] = React.useState(false);
  const [active, setActive] = React.useState(false);
  const hoverStyle = !disabled && hover ? {
    primary: {
      background: 'var(--action-primary-hover)'
    },
    secondary: {
      borderColor: 'var(--border-strong)',
      background: 'var(--surface-hover)'
    },
    ghost: {
      background: 'var(--surface-card)'
    },
    danger: {
      filter: 'brightness(0.92)'
    }
  }[variant] : null;
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    disabled: disabled,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setActive(false);
    },
    onMouseDown: () => setActive(true),
    onMouseUp: () => setActive(false),
    style: {
      ...base,
      ...variants[variant],
      ...hoverStyle,
      ...(active && !disabled ? {
        transform: 'scale(0.985)'
      } : null),
      ...disabledStyle,
      ...style
    }
  }, rest), leadingIcon, children, trailingIcon);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/button/Button.jsx", error: String((e && e.message) || e) }); }

// components/icon/Icon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * SiloGuard line-icon set.
 *
 * The Figma file ships a handful of simple single-stroke icons (bell, clipboard,
 * user, target). To give the system full coverage we use a curated set drawn in
 * the SAME visual language — 24×24, 2px stroke, round caps/joins — sourced from
 * Lucide (ISC licensed). This is a documented substitution; see ICONOGRAPHY in
 * the README. Icons inherit `color` via `currentColor`.
 */
const PATHS = {
  // ---- Navigation / app sections ----
  home: '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
  bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
  clipboard: '<rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M9 14h6"/><path d="M9 18h4"/>',
  user: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  settings: '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
  // ---- Status / alerts ----
  'alert-triangle': '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/>',
  check: '<polyline points="20 6 9 17 4 12"/>',
  'check-circle': '<path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="m9 11 3 3L22 4"/>',
  'x-circle': '<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>',
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
  // ---- Chevrons ----
  'chevron-left': '<path d="m15 18-6-6 6-6"/>',
  'chevron-right': '<path d="m9 18 6-6-6-6"/>',
  'chevron-down': '<path d="m6 9 6 6 6-6"/>',
  // ---- Onboarding / device ----
  'scan-qr': '<path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><rect width="5" height="5" x="7" y="7" rx="1"/>',
  wifi: '<path d="M12 20h.01"/><path d="M2 8.82a15 15 0 0 1 20 0"/><path d="M5 12.859a10 10 0 0 1 14 0"/><path d="M8.5 16.429a5 5 0 0 1 7 0"/>',
  'plus-circle': '<circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/>',
  target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.62 3.38 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
  // ---- Empty / offline states ----
  'wifi-off': '<line x1="2" y1="2" x2="22" y2="22"/><path d="M8.5 16.429a5 5 0 0 1 7 0"/><path d="M5 12.859a10 10 0 0 1 5.17-2.824"/><path d="M10.71 5.05A16 16 0 0 1 22.56 9"/><path d="M2 8.82a15.928 15.928 0 0 1 3.29-2.722"/><path d="M12 20h.01"/>',
  inbox: '<polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>',
  'cloud-off': '<path d="m2 2 20 20"/><path d="M5.782 5.782A7 7 0 0 0 9 19h8.5a4.5 4.5 0 0 0 1.307-.193"/><path d="M21.532 16.5A4.5 4.5 0 0 0 17.5 10h-1.79A7.008 7.008 0 0 0 10 5.07"/>',
  // ---- Sensors (grain health) ----
  thermometer: '<path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"/>',
  droplet: '<path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/>',
  wind: '<path d="M12.8 19.6A2 2 0 1 0 14 16H2"/><path d="M17.5 8a2.5 2.5 0 1 1 2 4H2"/><path d="M9.8 4.4A2 2 0 1 1 11 8H2"/>',
  'more-vertical': '<circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/>',
  trash: '<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>',
  'trending-up': '<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>',
  clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  // ---- Profile / settings ----
  edit: '<path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/>',
  'log-out': '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/>',
  shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
  'map-pin': '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
  mail: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
  camera: '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>',
  'message-circle': '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z"/>',
  'file-text': '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/>',
  lock: '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>'
};
function Icon({
  name,
  size = 24,
  strokeWidth = 2,
  color = 'currentColor',
  style,
  className,
  title,
  ...rest
}) {
  const d = PATHS[name];
  return /*#__PURE__*/React.createElement("svg", _extends({
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    role: title ? 'img' : 'presentation',
    "aria-hidden": title ? undefined : true,
    "aria-label": title,
    className: className,
    style: {
      display: 'block',
      flexShrink: 0,
      ...style
    },
    dangerouslySetInnerHTML: {
      __html: (title ? `<title>${title}</title>` : '') + (d || '')
    }
  }, rest));
}

/** Names available in the SiloGuard icon set. */
const ICON_NAMES = Object.keys(PATHS);
Object.assign(__ds_scope, { Icon, ICON_NAMES });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/icon/Icon.jsx", error: String((e && e.message) || e) }); }

// components/empty-state/EmptyState.jsx
try { (() => {
const VARIANTS = {
  empty: {
    icon: 'inbox',
    title: 'Sin registros',
    body: 'Aún no hay elementos aquí.',
    iconColor: 'var(--text-secondary)'
  },
  offline: {
    icon: 'wifi-off',
    title: 'Sin conexión',
    body: 'Verificá tu red e intentá de nuevo.',
    iconColor: 'var(--status-warn)'
  },
  error: {
    icon: 'cloud-off',
    title: 'Error al cargar',
    body: 'No se pudo obtener la información del servidor.',
    iconColor: 'var(--status-critical)'
  },
  'no-alerts': {
    icon: 'check-circle',
    title: 'Todo en orden',
    body: 'No hay alertas activas en este momento.',
    iconColor: 'var(--status-ok)'
  }
};
const ICON_PX = {
  sm: 36,
  md: 48,
  lg: 64
};
const BOX_PX = {
  sm: 64,
  md: 88,
  lg: 112
};
const BOX_RADII = {
  sm: 'var(--radius-lg)',
  md: 'var(--radius-xl)',
  lg: 'var(--radius-2xl)'
};

/**
 * SiloGuard EmptyState — centred fallback panel. Four built-in variants cover
 * the main no-content scenarios. All copy and the optional CTA are overrideable.
 *
 * variant: 'empty' | 'offline' | 'error' | 'no-alerts'
 * action:  pass a <Button> or any ReactNode to render below the copy.
 */
function EmptyState({
  variant = 'empty',
  title,
  body,
  action,
  size = 'md',
  style
}) {
  const v = VARIANTS[variant] || VARIANTS.empty;
  const iconSize = ICON_PX[size] || ICON_PX.md;
  const boxSize = BOX_PX[size] || BOX_PX.md;
  const boxRadius = BOX_RADII[size] || BOX_RADII.md;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: 'var(--space-2xl) var(--space-lg)',
      gap: 'var(--space-md)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      width: boxSize,
      height: boxSize,
      borderRadius: boxRadius,
      background: 'var(--surface-input)',
      border: '1px solid var(--border-default)',
      color: v.iconColor,
      marginBottom: 'var(--space-xs)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: v.icon,
    size: iconSize,
    strokeWidth: 1.5
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      maxWidth: 260
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-h3)',
      fontWeight: 'var(--fw-semibold)',
      lineHeight: 'var(--lh-h3)',
      color: 'var(--text-primary)'
    }
  }, title ?? v.title), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-body)',
      lineHeight: 'var(--lh-body)',
      color: 'var(--text-secondary)'
    }
  }, body ?? v.body)), action && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-sm)'
    }
  }, action));
}
Object.assign(__ds_scope, { EmptyState });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/empty-state/EmptyState.jsx", error: String((e && e.message) || e) }); }

// components/input/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * SiloGuard text field. Stacked label + control, matching the app's forms:
 * surface-2 fill, hairline border, radius-md. Focus shows a green ring; error
 * turns the border red and reveals helper text. Set `as="select"` for the
 * dropdown variant (e.g. "Tipo de grano").
 */
function Input({
  label,
  hint,
  error,
  value,
  placeholder,
  disabled = false,
  as = 'input',
  options = [],
  leadingIcon,
  id,
  style,
  ...rest
}) {
  const [focused, setFocused] = React.useState(false);
  const reactId = React.useId();
  const fieldId = id || reactId;
  const isError = Boolean(error);
  const borderColor = isError ? 'var(--status-critical)' : focused ? 'var(--action-primary)' : 'var(--border-default)';
  const shell = {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-sm)',
    height: 44,
    padding: '0 16px',
    background: 'var(--surface-input)',
    border: `1px solid ${borderColor}`,
    borderRadius: 'var(--radius-md)',
    boxShadow: focused && !isError ? '0 0 0 3px var(--green-tint)' : 'none',
    transition: 'border-color var(--dur-fast) var(--ease-standard), box-shadow var(--dur-fast) var(--ease-standard)',
    opacity: disabled ? 0.5 : 1,
    cursor: disabled ? 'not-allowed' : 'text'
  };
  const control = {
    flex: 1,
    minWidth: 0,
    appearance: 'none',
    WebkitAppearance: 'none',
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-sans)',
    fontSize: 'var(--text-body)',
    lineHeight: 'var(--lh-body)',
    cursor: disabled ? 'not-allowed' : as === 'select' ? 'pointer' : 'text'
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      width: '100%',
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: fieldId,
    className: "sg-label",
    style: {
      display: 'block'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: shell
  }, leadingIcon && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-secondary)',
      display: 'flex'
    }
  }, leadingIcon), as === 'select' ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("select", _extends({
    id: fieldId,
    value: value,
    disabled: disabled,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    style: {
      ...control,
      color: value ? 'var(--text-primary)' : 'var(--text-secondary)'
    }
  }, rest), placeholder && /*#__PURE__*/React.createElement("option", {
    value: ""
  }, placeholder), options.map(o => {
    const opt = typeof o === 'string' ? {
      value: o,
      label: o
    } : o;
    return /*#__PURE__*/React.createElement("option", {
      key: opt.value,
      value: opt.value
    }, opt.label);
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-secondary)',
      display: 'flex',
      pointerEvents: 'none'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "m6 9 6 6 6-6"
  })))) : /*#__PURE__*/React.createElement("input", _extends({
    id: fieldId,
    value: value,
    placeholder: placeholder,
    disabled: disabled,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    style: control
  }, rest))), (error || hint) && /*#__PURE__*/React.createElement("span", {
    className: "sg-caption",
    style: {
      color: isError ? 'var(--status-critical)' : 'var(--text-secondary)',
      letterSpacing: 0
    }
  }, error || hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/input/Input.jsx", error: String((e && e.message) || e) }); }

// components/modal/Modal.jsx
try { (() => {
const MODAL_WIDTHS = {
  sm: 360,
  md: 480,
  lg: 600
};

/* ─── shared close button ─────────────────────────────────────────────────── */
function CloseBtn({
  onClose
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": "Cerrar",
    onClick: onClose,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      width: 32,
      height: 32,
      padding: 0,
      background: hover ? 'var(--surface-hover)' : 'transparent',
      border: 'none',
      borderRadius: 'var(--radius-sm)',
      color: hover ? 'var(--text-primary)' : 'var(--text-secondary)',
      cursor: 'pointer',
      transition: `background var(--dur-fast) var(--ease-standard), color var(--dur-fast) var(--ease-standard)`
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "x",
    size: 18
  }));
}

/* ─── shared animation hook ──────────────────────────────────────────────── */
function usePresence(open, exitDuration = 280) {
  const [mounted, setMounted] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  React.useEffect(() => {
    if (open) {
      setMounted(true);
      const id = requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
      return () => cancelAnimationFrame(id);
    } else {
      setVisible(false);
      const t = setTimeout(() => setMounted(false), exitDuration);
      return () => clearTimeout(t);
    }
  }, [open, exitDuration]);
  return {
    mounted,
    visible
  };
}

/* ─── Modal ──────────────────────────────────────────────────────────────── */

/**
 * SiloGuard Modal — centred overlay dialog for confirmations, detail views,
 * and destructive actions. ESC key and backdrop click close by default.
 *
 * actions: ReactNode[] — rendered right-aligned in the footer.
 * size: 'sm' (360) | 'md' (480, default) | 'lg' (600)
 */
function Modal({
  open,
  onClose,
  title,
  children,
  actions,
  size = 'md',
  preventClose = false,
  style
}) {
  const {
    mounted,
    visible
  } = usePresence(open);
  React.useEffect(() => {
    if (!open || preventClose) return;
    const handler = e => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, preventClose, onClose]);
  if (!mounted) return null;
  return /*#__PURE__*/React.createElement("div", {
    role: "dialog",
    "aria-modal": "true",
    onClick: !preventClose ? e => {
      if (e.target === e.currentTarget) onClose?.();
    } : undefined,
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--space-lg)',
      background: `rgba(0,0,0,${visible ? 0.65 : 0})`,
      backdropFilter: visible ? 'blur(4px)' : 'blur(0px)',
      transition: `background var(--dur-slow) var(--ease-standard), backdrop-filter var(--dur-slow) var(--ease-standard)`,
      boxSizing: 'border-box'
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      width: '100%',
      maxWidth: MODAL_WIDTHS[size] || MODAL_WIDTHS.md,
      background: 'var(--surface-card)',
      border: '1px solid var(--border-strong)',
      borderRadius: 'var(--radius-xl)',
      boxShadow: 'var(--shadow-lg)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.97)',
      transition: `opacity var(--dur-slow) var(--ease-standard), transform var(--dur-slow) var(--ease-standard)`,
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-md)',
      padding: '18px var(--space-lg)',
      borderBottom: '1px solid var(--border-default)'
    }
  }, title && /*#__PURE__*/React.createElement("h2", {
    style: {
      flex: 1,
      margin: 0,
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-h3)',
      fontWeight: 'var(--fw-semibold)',
      lineHeight: 'var(--lh-h3)',
      color: 'var(--text-primary)'
    }
  }, title), !preventClose && /*#__PURE__*/React.createElement(CloseBtn, {
    onClose: onClose
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-lg)',
      flex: 1,
      overflowY: 'auto',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-body)',
      lineHeight: 'var(--lh-body)',
      color: 'var(--text-secondary)'
    }
  }, children), actions && actions.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: 'var(--space-sm)',
      padding: 'var(--space-md) var(--space-lg)',
      borderTop: '1px solid var(--border-default)'
    }
  }, actions)));
}

/* ─── BottomSheet ─────────────────────────────────────────────────────────── */

/**
 * SiloGuard BottomSheet — slides up from the bottom edge (mobile-first).
 * For contextual menus, confirmation sheets, and sensor detail panels.
 * Same props as Modal minus `size`. Actions stack vertically full-width.
 */
function BottomSheet({
  open,
  onClose,
  title,
  children,
  actions,
  preventClose = false,
  style
}) {
  const {
    mounted,
    visible
  } = usePresence(open);
  React.useEffect(() => {
    if (!open || preventClose) return;
    const handler = e => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, preventClose, onClose]);
  if (!mounted) return null;
  return /*#__PURE__*/React.createElement("div", {
    role: "dialog",
    "aria-modal": "true",
    onClick: !preventClose ? e => {
      if (e.target === e.currentTarget) onClose?.();
    } : undefined,
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 1000,
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center',
      background: `rgba(0,0,0,${visible ? 0.65 : 0})`,
      backdropFilter: visible ? 'blur(4px)' : 'blur(0px)',
      transition: `background var(--dur-slow) var(--ease-standard), backdrop-filter var(--dur-slow) var(--ease-standard)`
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      width: '100%',
      maxWidth: 480,
      background: 'var(--surface-card)',
      border: '1px solid var(--border-strong)',
      borderTopLeftRadius: 'var(--radius-2xl)',
      borderTopRightRadius: 'var(--radius-2xl)',
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      boxShadow: 'var(--shadow-lg)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      transform: visible ? 'translateY(0)' : 'translateY(100%)',
      transition: `transform var(--dur-slow) var(--ease-standard)`,
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      paddingTop: 12,
      paddingBottom: 4,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      width: 36,
      height: 4,
      borderRadius: 'var(--radius-full)',
      background: 'var(--border-strong)'
    }
  })), title && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-md)',
      padding: '8px var(--space-lg) 14px'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      flex: 1,
      margin: 0,
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-h3)',
      fontWeight: 'var(--fw-semibold)',
      lineHeight: 'var(--lh-h3)',
      color: 'var(--text-primary)'
    }
  }, title), !preventClose && /*#__PURE__*/React.createElement(CloseBtn, {
    onClose: onClose
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: title ? `0 var(--space-lg) var(--space-md)` : `var(--space-md) var(--space-lg) var(--space-md)`,
      flex: 1,
      overflowY: 'auto',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-body)',
      lineHeight: 'var(--lh-body)',
      color: 'var(--text-secondary)'
    }
  }, children), actions && actions.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-sm)',
      padding: 'var(--space-sm) var(--space-lg) var(--space-xl)'
    }
  }, actions)));
}
Object.assign(__ds_scope, { Modal, BottomSheet });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/modal/Modal.jsx", error: String((e && e.message) || e) }); }

// components/nav-bar/NavBar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const DEFAULT_TABS = [{
  id: 'dashboard',
  label: 'Dashboard',
  icon: 'home'
}, {
  id: 'alertas',
  label: 'Alertas',
  icon: 'bell'
}, {
  id: 'pasaporte',
  label: 'Pasaporte',
  icon: 'clipboard'
}, {
  id: 'perfil',
  label: 'Perfil',
  icon: 'user'
}];

/**
 * NAVBAR — Active = Dashboard / Alertas / Pasaporte / Perfil.
 * The app's bottom tab bar. The active tab is green (icon + label); the rest
 * sit muted. Tabs can carry a numeric badge (e.g. unread alerts).
 */
function NavBar({
  active = 'dashboard',
  tabs = DEFAULT_TABS,
  onChange,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("nav", _extends({
    style: {
      display: 'flex',
      alignItems: 'stretch',
      background: 'var(--surface-card)',
      borderTop: '1px solid var(--border-default)',
      paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      ...style
    }
  }, rest), tabs.map(tab => {
    const isActive = tab.id === active;
    const color = isActive ? 'var(--action-primary)' : 'var(--text-secondary)';
    return /*#__PURE__*/React.createElement("button", {
      key: tab.id,
      type: "button",
      onClick: () => onChange && onChange(tab.id),
      "aria-current": isActive ? 'page' : undefined,
      style: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5,
        height: 64,
        padding: 0,
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        WebkitTapHighlightColor: 'transparent',
        transition: 'color var(--dur-fast) var(--ease-standard)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'relative',
        display: 'flex',
        color
      }
    }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      name: tab.icon,
      size: 22,
      strokeWidth: isActive ? 2.25 : 2
    }), tab.badge ? /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        top: -5,
        right: -8,
        minWidth: 16,
        height: 16,
        padding: '0 4px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 'var(--radius-full)',
        background: 'var(--status-critical)',
        color: '#fff',
        fontSize: 10,
        fontWeight: 'var(--fw-bold)',
        lineHeight: 1
      }
    }, tab.badge) : null), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-sans)',
        fontSize: 10,
        fontWeight: 'var(--fw-bold)',
        letterSpacing: '0.07px',
        color
      }
    }, tab.label));
  }));
}
Object.assign(__ds_scope, { NavBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/nav-bar/NavBar.jsx", error: String((e && e.message) || e) }); }

// components/sensor-stat/SensorStat.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const KINDS = {
  co2: {
    icon: 'wind',
    label: 'CO₂',
    unit: 'ppm'
  },
  temp: {
    icon: 'thermometer',
    label: 'Temperatura',
    unit: '°C'
  },
  humidity: {
    icon: 'droplet',
    label: 'Humedad',
    unit: '%'
  }
};
const TONES = {
  ok: 'var(--status-ok)',
  warn: 'var(--status-warn)',
  critical: 'var(--status-critical)'
};

/**
 * Sensor reading tile for the three grain-health variables (CO₂, temperatura,
 * humedad). Icon + label header, a large value with unit, and an optional
 * trend line. The accent colour follows the reading's status tone.
 */
function SensorStat({
  kind = 'co2',
  label,
  value,
  unit,
  tone = 'ok',
  trend,
  style,
  ...rest
}) {
  const k = KINDS[kind] || KINDS.co2;
  const accent = TONES[tone] || TONES.ok;
  const resolvedLabel = label || k.label;
  const resolvedUnit = unit != null ? unit : k.unit;
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-md)',
      padding: 'var(--space-md)',
      background: 'var(--surface-card)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-lg)',
      minWidth: 0,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      color: accent
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: k.icon,
    size: 16
  })), /*#__PURE__*/React.createElement("span", {
    className: "sg-label",
    style: {
      color: 'var(--text-secondary)'
    }
  }, resolvedLabel)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 28,
      fontWeight: 'var(--fw-bold)',
      letterSpacing: '-0.5px',
      lineHeight: 1,
      color: 'var(--text-primary)'
    }
  }, value), resolvedUnit && /*#__PURE__*/React.createElement("span", {
    className: "sg-caption",
    style: {
      letterSpacing: 0
    }
  }, resolvedUnit)), trend && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      color: accent
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "trending-up",
    size: 14
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 'var(--fw-medium)',
      color: 'var(--text-secondary)'
    }
  }, trend)));
}
Object.assign(__ds_scope, { SensorStat });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/sensor-stat/SensorStat.jsx", error: String((e && e.message) || e) }); }

// components/status-badge/StatusBadge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const TONES = {
  ok: {
    color: 'var(--status-ok)',
    tint: 'var(--status-ok-tint)',
    label: 'OK'
  },
  warn: {
    color: 'var(--status-warn)',
    tint: 'var(--status-warn-tint)',
    label: 'Advertencia'
  },
  critical: {
    color: 'var(--status-critical)',
    tint: 'var(--status-critical-tint)',
    label: 'Crítica'
  },
  resolved: {
    color: 'var(--text-secondary)',
    tint: 'rgba(107,114,128,0.15)',
    label: 'Resuelta'
  },
  info: {
    color: 'var(--status-info)',
    tint: 'var(--status-info-tint)',
    label: 'Info'
  }
};

/** A small status dot — the colour-coded silo health indicator. */
function StatusDot({
  tone = 'ok',
  size = 8,
  glow = false,
  style
}) {
  const t = TONES[tone] || TONES.ok;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      width: size,
      height: size,
      borderRadius: 'var(--radius-full)',
      background: t.color,
      flexShrink: 0,
      boxShadow: glow ? `0 0 8px ${t.color}` : 'none',
      ...style
    }
  });
}

/**
 * Status pill for grain-health / alert state: Crítica · Advertencia · OK ·
 * Resuelta. Tinted background + coloured label, with an optional leading dot.
 */
function StatusBadge({
  tone = 'ok',
  children,
  dot = true,
  style,
  ...rest
}) {
  const t = TONES[tone] || TONES.ok;
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      height: 22,
      padding: '0 10px',
      background: t.tint,
      color: t.color,
      borderRadius: 'var(--radius-full)',
      fontFamily: 'var(--font-sans)',
      fontSize: 11,
      fontWeight: 'var(--fw-bold)',
      letterSpacing: '0.4px',
      textTransform: 'uppercase',
      whiteSpace: 'nowrap',
      ...style
    }
  }, rest), dot && /*#__PURE__*/React.createElement(StatusDot, {
    tone: tone,
    size: 6
  }), children || t.label);
}
Object.assign(__ds_scope, { StatusDot, StatusBadge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/status-badge/StatusBadge.jsx", error: String((e && e.message) || e) }); }

// components/alert-card/AlertCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const VARIANTS = {
  critical: {
    tone: 'critical',
    color: 'var(--status-critical)',
    tint: 'var(--status-critical-tint)',
    icon: 'alert-triangle',
    label: 'Crítica'
  },
  warning: {
    tone: 'warn',
    color: 'var(--status-warn)',
    tint: 'var(--status-warn-tint)',
    icon: 'alert-triangle',
    label: 'Advertencia'
  },
  resolved: {
    tone: 'resolved',
    color: 'var(--text-secondary)',
    tint: 'rgba(107,114,128,0.15)',
    icon: 'check-circle',
    label: 'Resuelta'
  }
};

/**
 * CARD ALERT ITEM — Crítica / Aviso / Resuelta.
 * The alert row in the Lista de alertas and the deep-linked notification.
 * Severity drives the left accent, icon badge and pill. Critical/warning show
 * the estimated time-to-loss and recommended action; resolved dims and shows
 * the resolution note.
 */
function AlertCard({
  variant = 'critical',
  title,
  silo,
  time,
  description,
  estimate,
  action,
  resolutionNote,
  onClick,
  style,
  ...rest
}) {
  const v = VARIANTS[variant] || VARIANTS.critical;
  const interactive = typeof onClick === 'function';
  const [hover, setHover] = React.useState(false);
  const isResolved = variant === 'resolved';
  return /*#__PURE__*/React.createElement("div", _extends({
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    role: interactive ? 'button' : undefined,
    tabIndex: interactive ? 0 : undefined,
    style: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-md)',
      padding: 'var(--space-md)',
      paddingLeft: 'calc(var(--space-md) + 3px)',
      background: 'var(--surface-card)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      cursor: interactive ? 'pointer' : 'default',
      opacity: isResolved ? 0.72 : 1,
      boxShadow: hover && interactive ? 'var(--shadow-md)' : 'none',
      transition: 'box-shadow var(--dur-base) var(--ease-standard), opacity var(--dur-base) var(--ease-standard)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      width: 3,
      background: v.color
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 'var(--space-md)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 40,
      height: 40,
      flexShrink: 0,
      borderRadius: 'var(--radius-md)',
      background: v.tint,
      color: v.color
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: v.icon,
    size: 20
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.StatusBadge, {
    tone: v.tone
  }, v.label), time && /*#__PURE__*/React.createElement("span", {
    className: "sg-caption",
    style: {
      letterSpacing: 0
    }
  }, time)), /*#__PURE__*/React.createElement("h3", {
    className: "sg-h3",
    style: {
      margin: 0,
      color: 'var(--text-primary)',
      textDecoration: isResolved ? 'none' : 'none'
    }
  }, title), silo && /*#__PURE__*/React.createElement("span", {
    className: "sg-caption",
    style: {
      letterSpacing: 0,
      color: 'var(--text-secondary)'
    }
  }, silo)), interactive && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-secondary)',
      flexShrink: 0,
      marginTop: 2
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chevron-right",
    size: 18
  }))), description && /*#__PURE__*/React.createElement("p", {
    className: "sg-body",
    style: {
      margin: 0,
      color: 'var(--text-secondary)'
    }
  }, description), !isResolved && (estimate || action) && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 'var(--space-sm)'
    }
  }, estimate && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '5px 10px',
      borderRadius: 'var(--radius-sm)',
      background: 'var(--surface-input)',
      color: v.color,
      fontSize: 12,
      fontWeight: 'var(--fw-semibold)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "clock",
    size: 14
  }), estimate), action && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '5px 10px',
      borderRadius: 'var(--radius-sm)',
      background: 'var(--surface-input)',
      color: 'var(--text-primary)',
      fontSize: 12,
      fontWeight: 'var(--fw-medium)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "wind",
    size: 14,
    color: "var(--text-secondary)"
  }), action)), isResolved && resolutionNote && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      color: 'var(--status-ok)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "check",
    size: 14
  }), /*#__PURE__*/React.createElement("span", {
    className: "sg-caption",
    style: {
      letterSpacing: 0,
      color: 'var(--text-secondary)'
    }
  }, resolutionNote)));
}
Object.assign(__ds_scope, { AlertCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/alert-card/AlertCard.jsx", error: String((e && e.message) || e) }); }

// components/list-item/ListItem.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * LIST ITEM — Default / Selected / Resolved.
 * The silo row in the Dashboard (and any tappable list row). A leading health
 * dot or icon, a title + subtitle, and a trailing value/score. `selected`
 * highlights the active row with a green edge + tint; `resolved` dims it and
 * swaps in a check.
 */
function ListItem({
  state = 'default',
  tone = 'ok',
  leading,
  title,
  subtitle,
  value,
  valueUnit,
  trailing,
  showChevron = true,
  onClick,
  style,
  ...rest
}) {
  const interactive = typeof onClick === 'function';
  const [hover, setHover] = React.useState(false);
  const isSelected = state === 'selected';
  const isResolved = state === 'resolved';
  const borderColor = isSelected ? 'var(--action-primary)' : 'var(--border-default)';
  const bg = isSelected ? 'var(--green-tint)' : hover && interactive ? 'var(--surface-hover)' : 'var(--surface-card)';

  // Leading visual: explicit node, a resolved check, or the health dot.
  let leadingNode = leading;
  if (!leadingNode) {
    if (isResolved) {
      leadingNode = /*#__PURE__*/React.createElement("span", {
        style: {
          display: 'flex',
          color: 'var(--status-ok)'
        }
      }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
        name: "check-circle",
        size: 20
      }));
    } else {
      leadingNode = /*#__PURE__*/React.createElement(__ds_scope.StatusDot, {
        tone: tone,
        size: 10,
        glow: tone === 'critical'
      });
    }
  }
  return /*#__PURE__*/React.createElement("div", _extends({
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    role: interactive ? 'button' : undefined,
    tabIndex: interactive ? 0 : undefined,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-md)',
      padding: '14px 16px',
      background: bg,
      border: `1px solid ${borderColor}`,
      borderRadius: 'var(--radius-lg)',
      cursor: interactive ? 'pointer' : 'default',
      opacity: isResolved ? 0.7 : 1,
      transition: 'background var(--dur-fast) var(--ease-standard), border-color var(--dur-fast) var(--ease-standard)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 24,
      flexShrink: 0
    }
  }, leadingNode), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "sg-h3",
    style: {
      fontSize: 'var(--text-h3)',
      color: 'var(--text-primary)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, title), subtitle && /*#__PURE__*/React.createElement("span", {
    className: "sg-caption",
    style: {
      letterSpacing: 0,
      color: 'var(--text-secondary)'
    }
  }, subtitle)), trailing ? trailing : value != null ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 3,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 22,
      fontWeight: 'var(--fw-bold)',
      letterSpacing: '-0.4px',
      color: isResolved ? 'var(--text-secondary)' : 'var(--text-primary)'
    }
  }, value), valueUnit && /*#__PURE__*/React.createElement("span", {
    className: "sg-caption",
    style: {
      letterSpacing: 0
    }
  }, valueUnit)) : null, showChevron && interactive && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-secondary)',
      flexShrink: 0,
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chevron-right",
    size: 18
  })));
}
Object.assign(__ds_scope, { ListItem });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/list-item/ListItem.jsx", error: String((e && e.message) || e) }); }

// components/tabs/Tabs.jsx
try { (() => {
/**
 * SiloGuard Tabs — navigation bar with a sliding active indicator.
 *
 * `underline` (default) — 2 px green rule under the active tab. Use for primary
 *   section navigation rows (Historial, Reportes, Configuración).
 * `pill` — filled capsule behind the active tab. Use for secondary filter /
 *   segmented-control rows (Todos · Crítico · Advertencia · OK).
 *
 * items: Array<{ id: string, label: string, icon?: ReactNode, count?: number }>
 */
function Tabs({
  items = [],
  activeId,
  onChange,
  variant = 'underline',
  fullWidth = false,
  style
}) {
  const tabRefs = React.useRef({});
  const [indicator, setIndicator] = React.useState({
    left: 0,
    width: 0,
    ready: false
  });
  const isPill = variant === 'pill';
  const updateIndicator = React.useCallback(() => {
    const el = tabRefs.current[activeId];
    if (!el) return;
    setIndicator({
      left: el.offsetLeft,
      width: el.offsetWidth,
      ready: true
    });
  }, [activeId]);
  React.useLayoutEffect(() => {
    updateIndicator();
  }, [updateIndicator]);
  React.useEffect(() => {
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [updateIndicator]);
  return /*#__PURE__*/React.createElement("div", {
    role: "tablist",
    style: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      gap: isPill ? 2 : 0,
      overflowX: 'auto',
      scrollbarWidth: 'none',
      WebkitOverflowScrolling: 'touch',
      ...(isPill ? {
        background: 'var(--surface-input)',
        borderRadius: 'var(--radius-md)',
        padding: 4
      } : {
        borderBottom: '1px solid var(--border-default)'
      }),
      ...style
    }
  }, indicator.ready && /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: isPill ? {
      position: 'absolute',
      top: 4,
      bottom: 4,
      left: 0,
      width: indicator.width,
      transform: `translateX(${indicator.left}px)`,
      borderRadius: 'var(--radius-sm)',
      background: 'var(--surface-card)',
      boxShadow: 'var(--shadow-sm)',
      zIndex: 0,
      pointerEvents: 'none',
      transition: `transform var(--dur-base) var(--ease-standard), width var(--dur-base) var(--ease-standard)`
    } : {
      position: 'absolute',
      bottom: -1,
      height: 2,
      left: 0,
      width: indicator.width,
      transform: `translateX(${indicator.left}px)`,
      borderRadius: 'var(--radius-full)',
      background: 'var(--action-primary)',
      zIndex: 1,
      pointerEvents: 'none',
      transition: `transform var(--dur-base) var(--ease-standard), width var(--dur-base) var(--ease-standard)`
    }
  }), items.map(item => {
    const isActive = item.id === activeId;
    return /*#__PURE__*/React.createElement("button", {
      key: item.id,
      ref: el => {
        tabRefs.current[item.id] = el;
      },
      type: "button",
      role: "tab",
      "aria-selected": isActive,
      onClick: () => onChange?.(item.id),
      style: {
        position: 'relative',
        zIndex: 1,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        flexShrink: 0,
        ...(fullWidth ? {
          flex: 1
        } : {}),
        padding: isPill ? '7px 14px' : '10px 16px',
        background: 'transparent',
        border: 'none',
        borderRadius: isPill ? 'var(--radius-sm)' : 0,
        cursor: 'pointer',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-body)',
        fontWeight: isActive ? 'var(--fw-semibold)' : 'var(--fw-regular)',
        color: isActive ? isPill ? 'var(--text-primary)' : 'var(--action-primary)' : 'var(--text-secondary)',
        transition: `color var(--dur-fast) var(--ease-standard)`,
        WebkitTapHighlightColor: 'transparent',
        whiteSpace: 'nowrap'
      }
    }, item.icon && /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'flex',
        opacity: isActive ? 1 : 0.5,
        transition: `opacity var(--dur-fast) var(--ease-standard)`
      }
    }, item.icon), item.label, item.count != null && /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 18,
        height: 18,
        padding: '0 5px',
        borderRadius: 'var(--radius-full)',
        background: isActive ? 'var(--green-tint)' : 'var(--surface-3)',
        color: isActive ? 'var(--action-primary)' : 'var(--text-secondary)',
        fontSize: 11,
        fontWeight: 'var(--fw-bold)',
        lineHeight: 1,
        transition: `background var(--dur-fast) var(--ease-standard), color var(--dur-fast) var(--ease-standard)`
      }
    }, item.count));
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/tabs/Tabs.jsx", error: String((e && e.message) || e) }); }

// components/toast/Toast.jsx
try { (() => {
const TONES = {
  ok: {
    color: 'var(--status-ok)',
    icon: 'check-circle'
  },
  warn: {
    color: 'var(--status-warn)',
    icon: 'alert-triangle'
  },
  critical: {
    color: 'var(--status-critical)',
    icon: 'alert-triangle'
  },
  info: {
    color: 'var(--status-info)',
    icon: 'info'
  }
};

/* ─── context ─────────────────────────────────────────────────────────────── */

const ToastCtx = React.createContext(null);
let _nextId = 1;

/* ─── ToastProvider ───────────────────────────────────────────────────────── */

/**
 * Wrap your root (or any subtree) with ToastProvider. All descendants can
 * then call useToast().addToast({…}) to fire notifications.
 * Max 3 toasts visible at once (oldest is evicted first).
 */
function ToastProvider({
  children
}) {
  const [toasts, setToasts] = React.useState([]);
  const removeToast = React.useCallback(id => {
    // mark exiting → fade out → clean up
    setToasts(prev => prev.map(t => t.id === id ? {
      ...t,
      exiting: true
    } : t));
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 300);
  }, []);
  const addToast = React.useCallback(opts => {
    const id = _nextId++;
    const duration = opts.duration ?? 4000;
    setToasts(prev => [...prev.slice(-2), {
      ...opts,
      id,
      exiting: false
    }]);
    if (duration > 0) setTimeout(() => removeToast(id), duration);
    return id;
  }, [removeToast]);
  return /*#__PURE__*/React.createElement(ToastCtx.Provider, {
    value: {
      addToast,
      removeToast
    }
  }, children, /*#__PURE__*/React.createElement("div", {
    "aria-live": "polite",
    "aria-atomic": "false",
    style: {
      position: 'fixed',
      bottom: 24,
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 2000,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      gap: 8,
      width: 'min(400px, calc(100vw - 32px))',
      pointerEvents: 'none'
    }
  }, toasts.map(t => /*#__PURE__*/React.createElement(LiveToastItem, {
    key: t.id,
    toast: t,
    onDismiss: removeToast
  }))));
}

/* ─── useToast ────────────────────────────────────────────────────────────── */

/** Returns { addToast, removeToast }. Must be used inside a <ToastProvider>. */
function useToast() {
  const ctx = React.useContext(ToastCtx);
  if (!ctx) throw new Error('useToast must be called inside a <ToastProvider>.');
  return ctx;
}

/* ─── live tile (internal, used by provider) ──────────────────────────────── */

function LiveToastItem({
  toast,
  onDismiss
}) {
  const [visible, setVisible] = React.useState(false);
  React.useEffect(() => {
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
    return () => cancelAnimationFrame(id);
  }, []);
  const t = TONES[toast.tone] || TONES.info;
  const showing = visible && !toast.exiting;
  return /*#__PURE__*/React.createElement("div", {
    role: "alert",
    onClick: () => onDismiss(toast.id),
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 12,
      padding: '12px 14px',
      background: 'var(--surface-card)',
      border: '1px solid var(--border-strong)',
      borderLeft: `3px solid ${t.color}`,
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-lg)',
      cursor: 'pointer',
      pointerEvents: 'all',
      userSelect: 'none',
      opacity: showing ? 1 : 0,
      transform: showing ? 'translateY(0)' : 'translateY(16px)',
      transition: `opacity var(--dur-base) var(--ease-standard), transform var(--dur-base) var(--ease-standard)`
    }
  }, /*#__PURE__*/React.createElement(ToastInner, {
    tone: toast.tone,
    title: toast.title,
    message: toast.message
  }), /*#__PURE__*/React.createElement(DismissBtn, {
    onDismiss: () => onDismiss(toast.id)
  }));
}

/* ─── Toast (standalone display tile) ────────────────────────────────────── */

/**
 * Standalone Toast tile — renders a single notification for design specs and
 * static contexts (no provider needed). For live firing, use ToastProvider +
 * useToast().addToast({…}) instead.
 */
function Toast({
  tone = 'info',
  title,
  message,
  onDismiss,
  style
}) {
  const t = TONES[tone] || TONES.info;
  return /*#__PURE__*/React.createElement("div", {
    role: "alert",
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 12,
      padding: '12px 14px',
      background: 'var(--surface-card)',
      border: '1px solid var(--border-strong)',
      borderLeft: `3px solid ${t.color}`,
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-lg)',
      ...style
    }
  }, /*#__PURE__*/React.createElement(ToastInner, {
    tone: tone,
    title: title,
    message: message
  }), onDismiss && /*#__PURE__*/React.createElement(DismissBtn, {
    onDismiss: onDismiss
  }));
}

/* ─── shared inner parts ──────────────────────────────────────────────────── */

function ToastInner({
  tone,
  title,
  message
}) {
  const t = TONES[tone] || TONES.info;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    style: {
      color: t.color,
      flexShrink: 0,
      marginTop: 1,
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: t.icon,
    size: 18
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, title && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-body)',
      fontWeight: 'var(--fw-semibold)',
      lineHeight: 'var(--lh-body)',
      color: 'var(--text-primary)'
    }
  }, title), message && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: title ? '2px 0 0' : 0,
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-caption)',
      lineHeight: 'var(--lh-body)',
      color: 'var(--text-secondary)'
    }
  }, message)));
}
function DismissBtn({
  onDismiss
}) {
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": "Cerrar notificaci\xF3n",
    onClick: e => {
      e.stopPropagation();
      onDismiss();
    },
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      width: 24,
      height: 24,
      padding: 0,
      marginTop: -2,
      background: 'transparent',
      border: 'none',
      borderRadius: 'var(--radius-xs)',
      color: 'var(--text-secondary)',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "x",
    size: 16
  }));
}
Object.assign(__ds_scope, { ToastProvider, useToast, Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/toast/Toast.jsx", error: String((e && e.message) || e) }); }

// components/toggle/Toggle.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * SiloGuard Toggle — switch control for settings and notification preferences.
 * Green when on, dark surface when off. Controlled: always pass checked + onChange.
 * Sizes: md (default, 48×28) and sm (36×20).
 */
function Toggle({
  checked = false,
  onChange,
  disabled = false,
  label,
  labelPosition = 'right',
  size = 'md',
  id,
  style,
  ...rest
}) {
  const reactId = React.useId();
  const inputId = id || reactId;
  const S = size === 'sm' ? {
    w: 36,
    h: 20,
    thumb: 14,
    pad: 3
  } : {
    w: 48,
    h: 28,
    thumb: 20,
    pad: 4
  };
  const thumbX = checked ? S.w - S.thumb - S.pad : S.pad;
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: inputId,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      flexDirection: labelPosition === 'left' ? 'row-reverse' : 'row',
      cursor: disabled ? 'not-allowed' : 'pointer',
      userSelect: 'none',
      opacity: disabled ? 0.45 : 1,
      ...style
    }
  }, /*#__PURE__*/React.createElement("input", _extends({
    type: "checkbox",
    role: "switch",
    id: inputId,
    checked: checked,
    disabled: disabled,
    onChange: e => onChange?.(e.target.checked),
    "aria-checked": checked,
    style: {
      position: 'absolute',
      opacity: 0,
      width: 0,
      height: 0,
      pointerEvents: 'none',
      margin: 0
    }
  }, rest)), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      position: 'relative',
      display: 'inline-block',
      flexShrink: 0,
      width: S.w,
      height: S.h,
      borderRadius: 'var(--radius-full)',
      background: checked ? 'var(--action-primary)' : 'var(--surface-3)',
      border: `1px solid ${checked ? 'var(--action-primary)' : 'var(--border-default)'}`,
      boxSizing: 'border-box',
      transition: `background var(--dur-base) var(--ease-standard), border-color var(--dur-base) var(--ease-standard)`
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: '50%',
      left: thumbX,
      transform: 'translateY(-50%)',
      width: S.thumb,
      height: S.thumb,
      borderRadius: 'var(--radius-full)',
      background: checked ? 'var(--text-on-green)' : 'var(--text-primary)',
      boxShadow: 'var(--shadow-sm)',
      transition: `left var(--dur-base) var(--ease-standard)`
    }
  })), label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-body)',
      lineHeight: 'var(--lh-body)',
      color: 'var(--text-primary)'
    }
  }, label));
}
Object.assign(__ds_scope, { Toggle });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/toggle/Toggle.jsx", error: String((e && e.message) || e) }); }

// screens/historial-screen.jsx
try { (() => {
/* SiloGuard — Historial de Sensores v2
   Diseño: Tres paneles apilados (Idea B)
   Exports: HistorialScreen */

const _HS = (() => {
  const DS = window.SiloGuardDesignSystem_633342;
  const {
    Icon,
    Tabs
  } = DS;
  const IB = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    background: 'transparent',
    border: 'none',
    borderRadius: 'var(--radius-md)',
    color: 'var(--text-primary)',
    cursor: 'pointer',
    flexShrink: 0
  };

  /* ── Umbrales de alerta ── */
  const TH = {
    temp: {
      warn: 28,
      critical: 35
    },
    hum: {
      warn: 16,
      critical: 20
    },
    co2: {
      warn: 600,
      critical: 800
    }
  };

  /* ── Config visual por variable ── */
  const VCFG = {
    temp: {
      label: 'Temperatura',
      icon: 'thermometer',
      unit: '°C'
    },
    hum: {
      label: 'Humedad',
      icon: 'droplet',
      unit: '%'
    },
    co2: {
      label: 'CO₂',
      icon: 'wind',
      unit: 'ppm'
    }
  };

  /* ── Colores semáforo ── */
  const THX = {
    ok: '#22C55E',
    warn: '#F59E0B',
    critical: '#EF4444'
  };

  /* ─────────────────────────────────────────────────────────────────────────
     Generación de datos de ejemplo (determinista por silo)
     ───────────────────────────────────────────────────────────────────────── */
  function rng(seed) {
    let s = (seed % 2147483647 + 2147483647) % 2147483647 || 1;
    return () => {
      s = s * 16807 % 2147483647;
      return (s - 1) / 2147483646;
    };
  }
  function genData(silo) {
    const r = rng(silo.id * 7919 + 42),
      N = 169;
    function curve(end, range, shape, noise, daily) {
      const start = end - range,
        arr = [];
      for (let i = 0; i < N; i++) {
        const t = i / (N - 1);
        let b;
        if (shape === 'exp') b = start + range * Math.pow(t, 2.2);else if (shape === 'sig') b = start + range / (1 + Math.exp(-10 * (t - 0.45)));else b = start + range * t;
        arr.push(+(b + (r() - 0.5) * 2 * noise + daily * Math.sin(i / 24 * Math.PI * 2 - 0.9)).toFixed(1));
      }
      arr[N - 1] = end;
      return arr;
    }
    const c = silo.status === 'critical',
      w = silo.status === 'warn';
    return {
      temp: curve(silo.temp, c ? 16 : w ? 5 : 2, c ? 'exp' : 'linear', c ? 0.6 : 0.3, c ? 0.8 : 1.2),
      hum: curve(silo.hum, c ? 3 : w ? 3 : 1, 'linear', 0.4, 0.3),
      co2: curve(silo.co2, c ? 400 : w ? 120 : 40, c ? 'sig' : 'linear', c ? 15 : 8, 5)
    };
  }

  /* ─────────────────────────────────────────────────────────────────────────
     Helpers
     ───────────────────────────────────────────────────────────────────────── */
  function getTone(silo, v) {
    const val = v === 'temp' ? silo.temp : v === 'hum' ? silo.hum : silo.co2;
    return val >= TH[v].critical ? 'critical' : val >= TH[v].warn ? 'warn' : 'ok';
  }
  function getVal(silo, v) {
    return v === 'temp' ? silo.temp : v === 'hum' ? silo.hum : silo.co2;
  }
  function niceScale(mn, mx) {
    if (mx - mn < 0.01) {
      mn -= 1;
      mx += 1;
    }
    const range = mx - mn,
      rough = range / 4;
    const mag = Math.pow(10, Math.floor(Math.log10(rough))),
      r = rough / mag;
    const step = r <= 1 ? mag : r <= 2 ? 2 * mag : r <= 5 ? 5 * mag : 10 * mag;
    return {
      min: Math.floor(mn / step) * step,
      max: Math.ceil(mx / step) * step
    };
  }

  /* Mensaje de estado en lenguaje llano */
  function statusMsg(tone, slice, th) {
    const len = slice.length;
    const critIdx = slice.findIndex(v => v >= th.critical);
    const warnIdx = slice.findIndex(v => v >= th.warn);
    if (tone === 'critical' && critIdx >= 0 && critIdx < len - 1) {
      const h = len - 1 - critIdx;
      return `Superó el límite hace ${h}h`;
    }
    if (tone === 'warn' && warnIdx >= 0 && warnIdx < len - 1) {
      const h = len - 1 - warnIdx;
      return `En advertencia hace ${h}h`;
    }
    if (tone === 'ok') return 'Dentro del rango seguro';
    return '';
  }

  /* Catmull-Rom → cubic bezier */
  function smooth(pts) {
    if (pts.length < 3) return pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
    let d = 'M' + pts[0][0].toFixed(1) + ',' + pts[0][1].toFixed(1);
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(0, i - 1)],
        p1 = pts[i],
        p2 = pts[i + 1],
        p3 = pts[Math.min(pts.length - 1, i + 2)];
      d += ' C' + (p1[0] + (p2[0] - p0[0]) / 6).toFixed(1) + ',' + (p1[1] + (p2[1] - p0[1]) / 6).toFixed(1) + ' ' + (p2[0] - (p3[0] - p1[0]) / 6).toFixed(1) + ',' + (p2[1] - (p3[1] - p1[1]) / 6).toFixed(1) + ' ' + p2[0].toFixed(1) + ',' + p2[1].toFixed(1);
    }
    return d;
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     ZONE CHART
     Gráfico con bandas de color de fondo: verde (seguro) · amarillo (advertencia) · rojo (crítico)
     El usuario ve de un vistazo si la línea está en zona segura o de peligro.
     ═══════════════════════════════════════════════════════════════════════════ */
  function ZoneChart({
    slice,
    variable,
    timeRange
  }) {
    const th = TH[variable];
    const len = slice.length;

    /* layout SVG */
    const W = 340,
      H = 108,
      ml = 32,
      mr = 6,
      mt = 6,
      mb = 20;
    const pw = W - ml - mr,
      ph = H - mt - mb;

    /* escala Y — siempre incluye ambos umbrales para que las bandas sean visibles */
    const dataMn = Math.min(...slice),
      dataMx = Math.max(...slice);
    const scMin = Math.min(dataMn, th.warn * 0.88);
    const scMax = Math.max(dataMx, th.critical * 1.06);
    const sc = niceScale(scMin, scMax);
    const yr = sc.max - sc.min || 1;
    const toX = i => ml + i / (len - 1) * pw;
    const toY = v => mt + (1 - (v - sc.min) / yr) * ph;

    /* límites de banda en px */
    const yBottom = mt + ph;
    const yTop = mt;
    const yWarn = Math.min(yBottom, Math.max(yTop, toY(th.warn)));
    const yCrit = Math.min(yBottom, Math.max(yTop, toY(th.critical)));

    /* paths */
    const pts = slice.map((v, i) => [toX(i), toY(v)]);
    const line = smooth(pts);
    const area = line + ` L${pts[len - 1][0].toFixed(1)},${yBottom} L${pts[0][0].toFixed(1)},${yBottom} Z`;

    /* color actual */
    const curVal = slice[len - 1];
    const tn = curVal >= th.critical ? 'critical' : curVal >= th.warn ? 'warn' : 'ok';
    const hex = THX[tn];

    /* línea vertical en el primer cruce */
    const critIdx = slice.findIndex(v => v >= th.critical);
    const warnIdx = slice.findIndex(v => v >= th.warn);
    const crossIdx = critIdx >= 0 ? critIdx : warnIdx >= 0 ? warnIdx : -1;

    /* etiquetas eje X */
    const steps = timeRange === 24 ? [0, 6, 12, 18, 24] : timeRange === 48 ? [0, 12, 24, 36, 48] : timeRange === 72 ? [0, 24, 48, 72] : [0, 48, 96, 144, 168];
    const xLabels = steps.map(h => ({
      x: toX(Math.round(h / timeRange * (len - 1))),
      label: h === timeRange ? 'Ahora' : `${timeRange - h}h`
    }));

    /* etiquetas eje Y: solo los umbrales */
    const yTickWarn = th.warn >= sc.min && th.warn <= sc.max;
    const yTickCrit = th.critical >= sc.min && th.critical <= sc.max;
    const gid = 'zg-' + variable;
    return /*#__PURE__*/React.createElement("svg", {
      viewBox: `0 0 ${W} ${H}`,
      style: {
        width: '100%',
        height: 'auto',
        display: 'block'
      }
    }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
      id: gid,
      x1: "0",
      y1: "0",
      x2: "0",
      y2: "1"
    }, /*#__PURE__*/React.createElement("stop", {
      offset: "0%",
      stopColor: hex,
      stopOpacity: "0.25"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "100%",
      stopColor: hex,
      stopOpacity: "0.02"
    }))), /*#__PURE__*/React.createElement("rect", {
      x: ml,
      y: yWarn,
      width: pw,
      height: Math.max(0, yBottom - yWarn),
      fill: "#22C55E",
      opacity: "0.08"
    }), /*#__PURE__*/React.createElement("rect", {
      x: ml,
      y: yCrit,
      width: pw,
      height: Math.max(0, yWarn - yCrit),
      fill: "#F59E0B",
      opacity: "0.10"
    }), /*#__PURE__*/React.createElement("rect", {
      x: ml,
      y: yTop,
      width: pw,
      height: Math.max(0, yCrit - yTop),
      fill: "#EF4444",
      opacity: "0.10"
    }), yTickWarn && /*#__PURE__*/React.createElement("line", {
      x1: ml,
      x2: W - mr,
      y1: yWarn,
      y2: yWarn,
      stroke: THX.warn,
      strokeWidth: "0.8",
      strokeDasharray: "3 2",
      opacity: "0.55"
    }), yTickCrit && /*#__PURE__*/React.createElement("line", {
      x1: ml,
      x2: W - mr,
      y1: yCrit,
      y2: yCrit,
      stroke: THX.critical,
      strokeWidth: "0.8",
      strokeDasharray: "3 2",
      opacity: "0.65"
    }), yTickWarn && /*#__PURE__*/React.createElement("text", {
      x: ml - 4,
      y: yWarn + 3.5,
      textAnchor: "end",
      style: {
        fontSize: 9,
        fontFamily: 'var(--font-sans)',
        fill: THX.warn,
        opacity: 0.85
      }
    }, th.warn), yTickCrit && /*#__PURE__*/React.createElement("text", {
      x: ml - 4,
      y: yCrit + 3.5,
      textAnchor: "end",
      style: {
        fontSize: 9,
        fontFamily: 'var(--font-sans)',
        fill: THX.critical,
        opacity: 0.9
      }
    }, th.critical), crossIdx > 0 && crossIdx < len - 1 && /*#__PURE__*/React.createElement("line", {
      x1: toX(crossIdx),
      x2: toX(crossIdx),
      y1: mt,
      y2: mt + ph,
      stroke: THX[tn],
      strokeWidth: "1",
      strokeDasharray: "2 3",
      opacity: "0.45"
    }), /*#__PURE__*/React.createElement("path", {
      d: area,
      fill: `url(#${gid})`
    }), /*#__PURE__*/React.createElement("path", {
      d: line,
      fill: "none",
      stroke: hex,
      strokeWidth: "2.2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: pts[len - 1][0],
      cy: pts[len - 1][1],
      r: "4.5",
      fill: hex,
      stroke: "var(--surface-card)",
      strokeWidth: "2"
    }), xLabels.map((xl, i) => /*#__PURE__*/React.createElement("text", {
      key: i,
      x: xl.x,
      y: H - 4,
      textAnchor: i === xLabels.length - 1 ? 'end' : i === 0 ? 'start' : 'middle',
      style: {
        fontSize: 9,
        fontFamily: 'var(--font-sans)',
        fill: xl.label === 'Ahora' ? hex : 'var(--text-muted)',
        fontWeight: xl.label === 'Ahora' ? 600 : 400
      }
    }, xl.label)));
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     VARIABLE PANEL
     Tarjeta individual para cada sensor (Temp / Humedad / CO₂)
     ═══════════════════════════════════════════════════════════════════════════ */
  function VariablePanel({
    variable,
    silo,
    data,
    timeRange,
    panelRef
  }) {
    const cfg = VCFG[variable];
    const th = TH[variable];
    const slice = data[variable].slice(168 - timeRange);
    const cv = getVal(silo, variable);
    const tn = getTone(silo, variable);
    const hex = THX[tn];
    const msg = statusMsg(tn, slice, th);
    const mn = Math.min(...slice).toFixed(1);
    const mx = Math.max(...slice).toFixed(1);
    const avg = (slice.reduce((a, b) => a + b, 0) / slice.length).toFixed(1);
    const toneLabel = tn === 'critical' ? 'CRÍTICO' : tn === 'warn' ? 'ADVERTENCIA' : 'OK';
    return /*#__PURE__*/React.createElement("div", {
      ref: panelRef,
      style: {
        background: 'var(--surface-card)',
        border: '1px solid var(--border-default)',
        borderTop: `3px solid ${hex}`,
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        padding: '14px 16px 10px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 7
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: cfg.icon,
      size: 15,
      color: "var(--text-secondary)"
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-sans)',
        fontSize: 13,
        fontWeight: 600,
        color: 'var(--text-secondary)',
        letterSpacing: '.02em'
      }
    }, cfg.label)), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 5,
        flexWrap: 'wrap'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 7,
        height: 7,
        borderRadius: '50%',
        background: hex,
        flexShrink: 0,
        boxShadow: tn !== 'ok' ? `0 0 6px 1px ${hex}55` : undefined
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-sans)',
        fontSize: 11,
        fontWeight: 700,
        color: hex,
        letterSpacing: '.05em'
      }
    }, toneLabel), msg && /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-sans)',
        fontSize: 11,
        color: 'var(--text-muted)'
      }
    }, "\xB7 ", msg))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'baseline',
        gap: 3,
        flexShrink: 0,
        marginLeft: 12
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-sans)',
        fontSize: 30,
        fontWeight: 700,
        color: 'var(--text-primary)',
        letterSpacing: '-1px',
        lineHeight: 1
      }
    }, cv), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-sans)',
        fontSize: 13,
        color: 'var(--text-secondary)',
        fontWeight: 500
      }
    }, cfg.unit))), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '0 8px 4px'
      }
    }, /*#__PURE__*/React.createElement(ZoneChart, {
      slice: slice,
      variable: variable,
      timeRange: timeRange
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 12,
        padding: '8px 16px',
        borderTop: '1px solid var(--border-default)',
        background: 'var(--surface-app)'
      }
    }, [['#22C55E', 'Seguro'], ['#F59E0B', 'Advertencia'], ['#EF4444', 'Crítico']].map(([c, l]) => /*#__PURE__*/React.createElement("div", {
      key: l,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 4
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 8,
        height: 8,
        borderRadius: 2,
        background: c,
        opacity: 0.7
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-sans)',
        fontSize: 10,
        color: 'var(--text-muted)'
      }
    }, l)))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        borderTop: '1px solid var(--border-default)'
      }
    }, [['Mín', mn], ['Máx', mx], ['Prom', avg]].map(([label, val], i) => /*#__PURE__*/React.createElement("div", {
      key: label,
      style: {
        padding: '10px 0',
        textAlign: 'center',
        borderRight: i < 2 ? '1px solid var(--border-default)' : undefined
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-sans)',
        fontSize: 10,
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '.05em',
        marginBottom: 3
      }
    }, label), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-sans)',
        fontSize: 14,
        fontWeight: 700,
        color: 'var(--text-primary)',
        letterSpacing: '-0.3px'
      }
    }, val, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        fontWeight: 400,
        color: 'var(--text-secondary)',
        marginLeft: 1
      }
    }, cfg.unit))))));
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     BACK HEADER
     ═══════════════════════════════════════════════════════════════════════════ */
  function BackHeader({
    title,
    onBack,
    subtitle,
    right
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        padding: '10px 16px 10px 8px',
        background: 'var(--surface-app)',
        borderBottom: '1px solid var(--border-default)',
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: onBack,
      style: {
        ...IB,
        color: 'var(--action-primary)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "chevron-left",
      size: 24
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-sans)',
        fontSize: 17,
        fontWeight: 600,
        color: 'var(--text-primary)',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }
    }, title), subtitle && /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-sans)',
        fontSize: 12,
        color: 'var(--text-secondary)',
        marginTop: 1
      }
    }, subtitle)), right && /*#__PURE__*/React.createElement("div", {
      style: {
        flexShrink: 0,
        marginLeft: 8
      }
    }, right));
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     HISTORIAL SCREEN — pantalla principal
     ═══════════════════════════════════════════════════════════════════════════ */
  function HistorialScreen({
    silo,
    nav,
    initialVariable
  }) {
    const [timeRange, setTimeRange] = React.useState(48);
    const data = React.useMemo(() => genData(silo), [silo.id]);

    /* refs para scroll automático al panel de la variable tocada */
    const panelRefs = {
      temp: React.useRef(null),
      hum: React.useRef(null),
      co2: React.useRef(null)
    };

    /* al montar, hacer scroll al panel de la variable con la que se entró */
    React.useEffect(() => {
      if (initialVariable && panelRefs[initialVariable] && panelRefs[initialVariable].current) {
        setTimeout(() => {
          const el = panelRefs[initialVariable].current;
          if (el) el.scrollIntoView({
            block: 'start'
          });
        }, 80);
      }
    }, [initialVariable]);
    const dev = (window.SG.profile.devices || []).find(d => d.silo === silo.name);
    const lastSync = dev ? dev.lastSync : 'Hace 10 min';
    const timeItems = [{
      id: '24',
      label: '24h'
    }, {
      id: '48',
      label: '48h'
    }, {
      id: '72',
      label: '72h'
    }, {
      id: '168',
      label: '7 días'
    }];
    return /*#__PURE__*/React.createElement("div", {
      "data-screen-label": "Historial de sensores",
      style: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        background: 'var(--surface-app)'
      }
    }, /*#__PURE__*/React.createElement(BackHeader, {
      title: "Historial de sensores",
      subtitle: `${silo.name} · ${silo.grain}`,
      onBack: () => nav('silo', {
        silo
      }),
      right: /*#__PURE__*/React.createElement("span", {
        style: {
          fontFamily: 'var(--font-sans)',
          fontSize: 11,
          color: 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          gap: 4
        }
      }, /*#__PURE__*/React.createElement(Icon, {
        name: "wifi",
        size: 12
      }), lastSync)
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '10px 16px 10px',
        background: 'var(--surface-app)',
        borderBottom: '1px solid var(--border-default)',
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement(Tabs, {
      variant: "pill",
      items: timeItems,
      activeId: String(timeRange),
      onChange: id => setTimeRange(Number(id)),
      fullWidth: true
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        overflowY: 'auto',
        padding: '14px 16px 28px',
        display: 'flex',
        flexDirection: 'column',
        gap: 14
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: 8,
        padding: '10px 12px',
        background: 'var(--surface-card)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-md)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "info",
      size: 14,
      color: "var(--text-muted)"
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-sans)',
        fontSize: 12,
        color: 'var(--text-muted)',
        lineHeight: 1.5
      }
    }, "Las bandas de color muestran las ", /*#__PURE__*/React.createElement("strong", {
      style: {
        color: 'var(--text-secondary)',
        fontWeight: 600
      }
    }, "zonas segura, de advertencia y cr\xEDtica"), ". La l\xEDnea blanca es el recorrido del sensor en el per\xEDodo elegido.")), ['temp', 'hum', 'co2'].map(v => /*#__PURE__*/React.createElement(VariablePanel, {
      key: v,
      variable: v,
      silo: silo,
      data: data,
      timeRange: timeRange,
      panelRef: panelRefs[v]
    }))));
  }
  return {
    HistorialScreen
  };
})();
Object.assign(window, _HS);
})(); } catch (e) { __ds_ns.__errors.push({ path: "screens/historial-screen.jsx", error: String((e && e.message) || e) }); }

// screens/mock-data.js
try { (() => {
/* SiloGuard — mock data for App Screens prototype */
window.SG = {
  silos: [{
    id: 1,
    name: 'Silo Norte',
    grain: 'Soja',
    tons: 180,
    acopio: '15 mar 2024',
    status: 'ok',
    temp: 22.1,
    hum: 13.8,
    co2: 420,
    trend: [21.0, 21.4, 21.8, 22.0, 22.1, 22.3, 22.1],
    storage: 'Silo fijo',
    lastUpdate: 'Hace 5 min'
  }, {
    id: 2,
    name: 'Silo Sur',
    grain: 'Maíz',
    tons: 240,
    acopio: '20 ene 2024',
    status: 'critical',
    temp: 42.3,
    hum: 15.1,
    co2: 890,
    trend: [28.1, 31.2, 34.5, 37.8, 39.4, 41.1, 42.3],
    storage: 'Silo fijo',
    lastUpdate: 'Hace 12 min'
  }, {
    id: 3,
    name: 'Silo Este',
    grain: 'Trigo',
    tons: 95,
    acopio: '08 feb 2024',
    status: 'warn',
    temp: 28.4,
    hum: 18.2,
    co2: 550,
    trend: [25.0, 25.8, 26.4, 27.0, 27.8, 28.1, 28.4],
    storage: 'Silobolsa',
    lastUpdate: 'Hace 8 min'
  }, {
    id: 4,
    name: 'Silo Oeste',
    grain: 'Soja',
    tons: 210,
    acopio: '01 abr 2024',
    status: 'ok',
    temp: 21.8,
    hum: 13.2,
    co2: 390,
    trend: [22.1, 21.9, 21.8, 21.6, 21.7, 21.9, 21.8],
    storage: 'Silo fijo',
    lastUpdate: 'Hace 3 min'
  }, {
    id: 5,
    name: 'Silo 5',
    grain: 'Girasol',
    tons: 120,
    acopio: '10 mar 2024',
    status: 'ok',
    temp: 23.0,
    hum: 12.9,
    co2: 410,
    trend: [22.8, 23.0, 23.1, 22.9, 23.0, 23.2, 23.0],
    storage: 'Silo fijo',
    lastUpdate: 'Hace 15 min'
  }, {
    id: 6,
    name: 'Silo 6',
    grain: 'Maíz',
    tons: 155,
    acopio: '22 feb 2024',
    status: 'warn',
    temp: 30.1,
    hum: 16.8,
    co2: 620,
    trend: [26.0, 27.1, 28.0, 29.0, 29.5, 30.0, 30.1],
    storage: 'Silobolsa',
    lastUpdate: 'Hace 20 min'
  }],
  alerts: [{
    id: 1,
    siloId: 2,
    silo: 'Silo Sur',
    variant: 'critical',
    title: 'Temperatura crítica',
    time: 'Hace 2 h',
    estimate: 'Crítico en 24 h',
    action: 'Inspección presencial',
    desc: 'La temperatura superó el umbral crítico de 35 °C. Riesgo de desarrollo de hongos y pérdida de calidad del grano.',
    sensor: 'temp',
    value: '42.3',
    unit: '°C',
    threshold: '35°C',
    status: 'active'
  }, {
    id: 2,
    siloId: 3,
    silo: 'Silo Este',
    variant: 'warning',
    title: 'Humedad elevada',
    time: 'Hace 5 h',
    estimate: 'Revisar en 48 h',
    action: 'Encender aireación',
    desc: 'La humedad relativa superó el umbral recomendado. Posible condensación y riesgo de hongos a corto plazo.',
    sensor: 'humidity',
    value: '18.2',
    unit: '%',
    threshold: '14%',
    status: 'active'
  }, {
    id: 3,
    siloId: 6,
    silo: 'Silo 6',
    variant: 'warning',
    title: 'CO₂ elevado',
    time: 'Ayer 14:30',
    estimate: null,
    action: 'Ventilación recomendada',
    desc: 'Niveles de CO₂ levemente por encima del umbral. Monitorear en las próximas horas.',
    sensor: 'co2',
    value: '620',
    unit: 'ppm',
    threshold: '600 ppm',
    status: 'active'
  }, {
    id: 4,
    siloId: 1,
    silo: 'Silo Norte',
    variant: 'resolved',
    title: 'Temperatura elevada',
    time: 'Hace 3 días',
    action: 'Encender aireación',
    desc: 'Temperatura levemente elevada. Resuelta mediante aireación.',
    sensor: 'temp',
    value: '31.0',
    unit: '°C',
    status: 'resolved',
    resolutionNote: 'Activé la aireación por 3 horas.'
  }, {
    id: 5,
    siloId: 4,
    silo: 'Silo Oeste',
    variant: 'resolved',
    title: 'Humedad elevada',
    time: 'Hace 6 días',
    action: 'Encender aireación',
    desc: 'Humedad levemente elevada. Resuelta por ventilación.',
    sensor: 'humidity',
    value: '15.8',
    unit: '%',
    status: 'resolved',
    resolutionNote: 'Aireé el silo. Bajó a 13.2 %.'
  }],
  profile: {
    name: 'Lucas Escobar',
    email: 'lucas.escobar@gmail.com',
    phone: '+54 9 341 555-0123',
    farm: {
      name: 'Estancia La Esperanza',
      location: 'Pergamino, Buenos Aires',
      hectares: 320
    },
    devices: [{
      id: 1,
      name: 'Lanza #1',
      silo: 'Silo Norte',
      status: 'online',
      battery: 87,
      lastSync: 'Hace 5 min'
    }, {
      id: 2,
      name: 'Lanza #2',
      silo: 'Silo Sur',
      status: 'online',
      battery: 64,
      lastSync: 'Hace 12 min'
    }, {
      id: 3,
      name: 'Lanza #3',
      silo: 'Silo Este',
      status: 'offline',
      battery: 12,
      lastSync: 'Hace 3 días'
    }],
    notifications: {
      push: true,
      critical: true,
      warning: true,
      weeklySummary: true,
      nightSilence: false,
      nightStart: '22:00',
      nightEnd: '07:00'
    }
  }
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "screens/mock-data.js", error: String((e && e.message) || e) }); }

// screens/profile-screens.jsx
try { (() => {
/* SiloGuard — Profile Screens
   Exports: ProfileScreen, EditProfileScreen, NotificationsScreen, DevicesScreen */
const _PDS = window.SiloGuardDesignSystem_633342;
const {
  Button: PBtn,
  Icon: PIcon,
  Toggle: PTgl,
  Input: PInp,
  BottomSheet: PSheet,
  StatusBadge: PSBadge
} = _PDS;

/* ── shared ── */
const _L = {
  fontFamily: 'var(--font-sans)',
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: '.06em',
  textTransform: 'uppercase',
  color: 'var(--text-muted)',
  margin: '0 0 8px',
  display: 'block'
};
function PBackHeader({
  title,
  onBack,
  right
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      padding: '10px 16px 10px 8px',
      background: 'var(--surface-app)',
      borderBottom: '1px solid var(--border-default)',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onBack,
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 40,
      height: 40,
      background: 'transparent',
      border: 'none',
      borderRadius: 'var(--radius-md)',
      color: 'var(--action-primary)',
      cursor: 'pointer',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(PIcon, {
    name: "chevron-left",
    size: 24
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 17,
      fontWeight: 600,
      color: 'var(--text-primary)',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, title)), right && /*#__PURE__*/React.createElement("div", {
    style: {
      flexShrink: 0,
      marginLeft: 8
    }
  }, right));
}
function PAvatar({
  name,
  size = 72,
  editable,
  onEdit
}) {
  const ini = (name || '?').split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2).toUpperCase();
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: size,
      height: size,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: size,
      height: size,
      borderRadius: '50%',
      background: 'var(--green-tint)',
      border: '2px solid var(--action-primary)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: size * .35,
      fontWeight: 700,
      color: 'var(--action-primary)',
      letterSpacing: '-0.5px'
    }
  }, ini)), editable && /*#__PURE__*/React.createElement("button", {
    onClick: onEdit,
    style: {
      position: 'absolute',
      bottom: -2,
      right: -2,
      width: 26,
      height: 26,
      borderRadius: '50%',
      background: 'var(--action-primary)',
      border: '2px solid var(--surface-app)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      padding: 0
    }
  }, /*#__PURE__*/React.createElement(PIcon, {
    name: "camera",
    size: 12,
    color: "#000"
  })));
}
function MRow({
  icon,
  label,
  value,
  onClick,
  danger,
  last,
  toggle
}) {
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    role: onClick ? 'button' : undefined,
    tabIndex: onClick ? 0 : undefined,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '13px 0',
      borderBottom: last ? 'none' : '1px solid var(--border-default)',
      cursor: onClick ? 'pointer' : 'default'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      flexShrink: 0,
      color: danger ? 'var(--status-critical)' : 'var(--text-secondary)'
    }
  }, /*#__PURE__*/React.createElement(PIcon, {
    name: icon,
    size: 20
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      fontFamily: 'var(--font-sans)',
      fontSize: 15,
      fontWeight: 500,
      color: danger ? 'var(--status-critical)' : 'var(--text-primary)'
    }
  }, label), value && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 13,
      color: 'var(--text-muted)',
      marginRight: 4
    }
  }, value), toggle, onClick && !danger && !toggle && /*#__PURE__*/React.createElement(PIcon, {
    name: "chevron-right",
    size: 18,
    color: "var(--text-muted)"
  }));
}
function SCard({
  label,
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 14,
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: _L
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-lg)',
      padding: '0 14px'
    }
  }, children));
}
function SMini({
  label,
  value,
  color = 'var(--text-primary)'
}) {
  const isN = typeof value === 'number';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-md)',
      padding: '10px 12px',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: isN ? 20 : 14,
      fontWeight: 700,
      color,
      lineHeight: 1.15,
      height: 24,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, value), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 10,
      color: 'var(--text-muted)',
      letterSpacing: '.05em',
      textTransform: 'uppercase',
      marginTop: 4
    }
  }, label));
}

/* ═══════════════════════════════════════════════════════════
   PROFILE — main screen (2 variations via variant prop)
   ═══════════════════════════════════════════════════════════ */
function ProfileScreen({
  profile,
  siloCount,
  variant,
  nav
}) {
  const [showLogout, setShowLogout] = React.useState(false);
  const onl = profile.devices.filter(d => d.status === 'online').length;
  const tot = profile.devices.length;
  const isC = variant === 'centrado';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      background: 'var(--surface-app)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px 16px 0',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 26,
      fontWeight: 700,
      color: 'var(--text-primary)',
      letterSpacing: '-0.3px',
      margin: 0
    }
  }, "Mi Perfil")), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: 'auto',
      padding: '12px 16px 24px'
    }
  }, isC ?
  /*#__PURE__*/
  /* ─── CENTRADO ─── */
  React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '16px 0 20px'
    }
  }, /*#__PURE__*/React.createElement(PAvatar, {
    name: profile.name,
    size: 72,
    editable: true,
    onEdit: () => nav('edit-profile')
  }), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 20,
      fontWeight: 700,
      color: 'var(--text-primary)',
      margin: '12px 0 2px',
      letterSpacing: '-0.3px'
    }
  }, profile.name), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 13,
      color: 'var(--text-secondary)',
      margin: 0
    }
  }, profile.email)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: 8,
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement(SMini, {
    label: "Silos",
    value: siloCount
  }), /*#__PURE__*/React.createElement(SMini, {
    label: "Lanzas",
    value: tot
  }), /*#__PURE__*/React.createElement(SMini, {
    label: "Alertas",
    value: 0,
    color: "var(--status-ok)"
  })), /*#__PURE__*/React.createElement(SCard, {
    label: "MI CUENTA"
  }, /*#__PURE__*/React.createElement(MRow, {
    icon: "user",
    label: "Datos personales",
    onClick: () => nav('edit-profile')
  }), /*#__PURE__*/React.createElement(MRow, {
    icon: "map-pin",
    label: "Mi campo",
    value: profile.farm.location.split(',')[0].trim(),
    onClick: () => nav('edit-profile'),
    last: true
  })), /*#__PURE__*/React.createElement(SCard, {
    label: "CONFIGURACI\xD3N"
  }, /*#__PURE__*/React.createElement(MRow, {
    icon: "wifi",
    label: "Mis lanzas",
    value: `${onl}/${tot}`,
    onClick: () => nav('devices')
  }), /*#__PURE__*/React.createElement(MRow, {
    icon: "bell",
    label: "Notificaciones",
    onClick: () => nav('notifications')
  }), /*#__PURE__*/React.createElement(MRow, {
    icon: "target",
    label: "Umbrales de alerta",
    onClick: () => nav('umbrales')
  }), /*#__PURE__*/React.createElement(MRow, {
    icon: "lock",
    label: "Cambiar contrase\xF1a",
    onClick: () => {}
  }), /*#__PURE__*/React.createElement(MRow, {
    icon: "refresh-cw",
    label: "Repetir tutorial",
    onClick: () => {},
    last: true
  })), /*#__PURE__*/React.createElement(SCard, {
    label: "SOPORTE"
  }, /*#__PURE__*/React.createElement(MRow, {
    icon: "message-circle",
    label: "WhatsApp",
    onClick: () => window.open('https://wa.me/5491100000000')
  }), /*#__PURE__*/React.createElement(MRow, {
    icon: "file-text",
    label: "Legal",
    onClick: () => {}
  }), /*#__PURE__*/React.createElement(MRow, {
    icon: "info",
    label: "Versi\xF3n",
    value: "1.0.0",
    last: true
  }))) :
  /*#__PURE__*/
  /* ─── COMPACTO ─── */
  React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    onClick: () => nav('edit-profile'),
    role: "button",
    tabIndex: 0,
    style: {
      display: 'flex',
      gap: 14,
      alignItems: 'center',
      padding: '12px 0 16px',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(PAvatar, {
    name: profile.name,
    size: 52
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 18,
      fontWeight: 700,
      color: 'var(--text-primary)',
      margin: 0,
      letterSpacing: '-0.2px'
    }
  }, profile.name), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 13,
      color: 'var(--text-secondary)',
      margin: '2px 0 0'
    }
  }, profile.email)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 13,
      fontWeight: 500,
      color: 'var(--action-primary)'
    }
  }, "Editar"), /*#__PURE__*/React.createElement(PIcon, {
    name: "chevron-right",
    size: 16,
    color: "var(--action-primary)"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--green-tint)',
      border: '1px solid rgba(34,197,94,.2)',
      borderRadius: 'var(--radius-lg)',
      padding: 14,
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement(PIcon, {
    name: "map-pin",
    size: 16,
    color: "var(--action-primary)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 15,
      fontWeight: 600,
      color: 'var(--text-primary)'
    }
  }, profile.farm.name)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 12,
      color: 'var(--text-secondary)',
      display: 'flex',
      gap: 6,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("span", null, profile.farm.location), /*#__PURE__*/React.createElement("span", null, "\xB7"), /*#__PURE__*/React.createElement("span", null, siloCount, " silos"), /*#__PURE__*/React.createElement("span", null, "\xB7"), /*#__PURE__*/React.createElement("span", null, profile.farm.hectares, " ha"))), /*#__PURE__*/React.createElement(SCard, null, /*#__PURE__*/React.createElement(MRow, {
    icon: "wifi",
    label: "Mis lanzas",
    value: `${onl}/${tot} online`,
    onClick: () => nav('devices')
  }), /*#__PURE__*/React.createElement(MRow, {
    icon: "bell",
    label: "Notificaciones",
    onClick: () => nav('notifications')
  }), /*#__PURE__*/React.createElement(MRow, {
    icon: "target",
    label: "Umbrales de alerta",
    onClick: () => nav('umbrales')
  }), /*#__PURE__*/React.createElement(MRow, {
    icon: "refresh-cw",
    label: "Repetir tutorial",
    onClick: () => {},
    last: true
  })), /*#__PURE__*/React.createElement(SCard, null, /*#__PURE__*/React.createElement(MRow, {
    icon: "message-circle",
    label: "Soporte WhatsApp",
    onClick: () => window.open('https://wa.me/5491100000000')
  }), /*#__PURE__*/React.createElement(MRow, {
    icon: "file-text",
    label: "Legal",
    onClick: () => {},
    last: true
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement(PBtn, {
    variant: "ghost",
    style: {
      width: '100%',
      color: 'var(--status-critical)'
    },
    onClick: () => setShowLogout(true)
  }, "Cerrar sesi\xF3n")), !isC && /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 11,
      color: 'var(--text-muted)',
      textAlign: 'center',
      margin: '12px 0 0'
    }
  }, "SiloGuard v1.0.0")), /*#__PURE__*/React.createElement(PSheet, {
    open: showLogout,
    onClose: () => setShowLogout(false),
    title: "\xBFCerrar sesi\xF3n?",
    actions: [/*#__PURE__*/React.createElement(PBtn, {
      key: "y",
      variant: "danger",
      style: {
        width: '100%'
      },
      onClick: () => setShowLogout(false)
    }, "S\xED, cerrar sesi\xF3n"), /*#__PURE__*/React.createElement(PBtn, {
      key: "n",
      variant: "ghost",
      style: {
        width: '100%'
      },
      onClick: () => setShowLogout(false)
    }, "Cancelar")]
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 14,
      color: 'var(--text-secondary)',
      margin: 0
    }
  }, "Vas a salir de tu cuenta en este dispositivo. Pod\xE9s volver a iniciar sesi\xF3n en cualquier momento.")));
}

/* ═══════════════════════════════════════════════════════════
   EDIT PROFILE
   ═══════════════════════════════════════════════════════════ */
function EditProfileScreen({
  profile,
  onSave,
  nav
}) {
  const [f, setF] = React.useState({
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
    farmName: profile.farm.name,
    farmLoc: profile.farm.location,
    farmHa: String(profile.farm.hectares)
  });
  const [saved, setSaved] = React.useState(false);
  const set = (k, v) => setF(p => ({
    ...p,
    [k]: v
  }));
  const save = () => {
    onSave({
      ...profile,
      name: f.name,
      email: f.email,
      phone: f.phone,
      farm: {
        ...profile.farm,
        name: f.farmName,
        location: f.farmLoc,
        hectares: Number(f.farmHa) || 0
      }
    });
    setSaved(true);
    setTimeout(() => nav('perfil'), 800);
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      background: 'var(--surface-app)'
    }
  }, /*#__PURE__*/React.createElement(PBackHeader, {
    title: "Editar perfil",
    onBack: () => nav('perfil')
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: 'auto',
      padding: 16,
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      paddingTop: 4,
      paddingBottom: 8
    }
  }, /*#__PURE__*/React.createElement(PAvatar, {
    name: f.name,
    size: 80,
    editable: true,
    onEdit: () => {}
  })), /*#__PURE__*/React.createElement("span", {
    style: _L
  }, "Datos personales"), /*#__PURE__*/React.createElement(PInp, {
    label: "Nombre completo",
    value: f.name,
    onChange: e => set('name', e.target.value)
  }), /*#__PURE__*/React.createElement(PInp, {
    label: "Email",
    value: f.email,
    onChange: e => set('email', e.target.value),
    type: "email"
  }), /*#__PURE__*/React.createElement(PInp, {
    label: "Tel\xE9fono",
    value: f.phone,
    onChange: e => set('phone', e.target.value),
    type: "tel"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 4
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: _L
  }, "Mi campo"), /*#__PURE__*/React.createElement(PInp, {
    label: "Nombre del campo",
    value: f.farmName,
    onChange: e => set('farmName', e.target.value)
  }), /*#__PURE__*/React.createElement(PInp, {
    label: "Ubicaci\xF3n",
    value: f.farmLoc,
    onChange: e => set('farmLoc', e.target.value)
  }), /*#__PURE__*/React.createElement(PInp, {
    label: "Hect\xE1reas",
    value: f.farmHa,
    onChange: e => set('farmHa', e.target.value),
    type: "number"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '12px 16px',
      borderTop: '1px solid var(--border-default)',
      background: 'var(--surface-app)',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(PBtn, {
    variant: "primary",
    style: {
      width: '100%'
    },
    onClick: save,
    disabled: saved
  }, saved ? '✓ Guardado' : 'Guardar cambios')));
}

/* ═══════════════════════════════════════════════════════════
   NOTIFICATIONS
   ═══════════════════════════════════════════════════════════ */
function NRow({
  icon,
  label,
  desc,
  checked,
  onChange,
  last,
  disabled
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '14px 0',
      borderBottom: last ? 'none' : '1px solid var(--border-default)',
      opacity: disabled ? .5 : 1,
      transition: 'opacity .15s'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      flexShrink: 0,
      color: 'var(--text-secondary)'
    }
  }, /*#__PURE__*/React.createElement(PIcon, {
    name: icon,
    size: 20
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 15,
      fontWeight: 500,
      color: 'var(--text-primary)'
    }
  }, label), desc && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 12,
      color: 'var(--text-muted)',
      marginTop: 2
    }
  }, desc)), /*#__PURE__*/React.createElement(PTgl, {
    checked: checked,
    onChange: onChange,
    size: "sm",
    disabled: disabled
  }));
}
function NotificationsScreen({
  settings,
  onChange,
  nav
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      background: 'var(--surface-app)'
    }
  }, /*#__PURE__*/React.createElement(PBackHeader, {
    title: "Notificaciones",
    onBack: () => nav('perfil')
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: 'auto',
      padding: 16
    }
  }, /*#__PURE__*/React.createElement(SCard, {
    label: "ALERTAS"
  }, /*#__PURE__*/React.createElement(NRow, {
    icon: "alert-triangle",
    label: "Alertas cr\xEDticas",
    desc: "Siempre activas \u2014 Requerido",
    checked: true,
    onChange: () => {},
    disabled: true
  }), /*#__PURE__*/React.createElement(NRow, {
    icon: "trending-up",
    label: "Advertencias",
    desc: "Lecturas por encima del umbral",
    checked: settings.warning,
    onChange: v => onChange('warning', v),
    last: true
  })), /*#__PURE__*/React.createElement(SCard, {
    label: "RESUMEN SEMANAL"
  }, /*#__PURE__*/React.createElement(NRow, {
    icon: "clock",
    label: "Recibir resumen semanal",
    desc: "Todos los lunes a las 8:00 AM",
    checked: settings.weeklySummary !== false,
    onChange: v => onChange('weeklySummary', v),
    last: true
  })), /*#__PURE__*/React.createElement(SCard, {
    label: "SILENCIO NOCTURNO"
  }, /*#__PURE__*/React.createElement(NRow, {
    icon: "moon",
    label: "Silenciar de noche",
    desc: "Las alertas cr\xEDticas se env\xEDan siempre, incluso en horario de silencio.",
    checked: settings.nightSilence || false,
    onChange: v => onChange('nightSilence', v)
  }), settings.nightSilence && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '12px 0',
      borderTop: '1px solid var(--border-default)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      flexShrink: 0,
      color: 'var(--text-secondary)'
    }
  }, /*#__PURE__*/React.createElement(PIcon, {
    name: "clock",
    size: 18
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 13,
      color: 'var(--text-secondary)'
    }
  }, "De"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 14,
      fontWeight: 600,
      color: 'var(--text-primary)',
      background: 'var(--surface-input)',
      padding: '4px 10px',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border-default)'
    }
  }, settings.nightStart || '22:00'), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 13,
      color: 'var(--text-secondary)'
    }
  }, "a"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 14,
      fontWeight: 600,
      color: 'var(--text-primary)',
      background: 'var(--surface-input)',
      padding: '4px 10px',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border-default)'
    }
  }, settings.nightEnd || '07:00')), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '10px 0',
      borderTop: '1px solid var(--border-default)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      flexShrink: 0,
      color: 'var(--text-secondary)'
    }
  }, /*#__PURE__*/React.createElement(PIcon, {
    name: "smartphone",
    size: 18
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 13,
      color: 'var(--text-muted)'
    }
  }, "Permisos de notificaciones: ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: 'var(--status-ok)'
    }
  }, "Activados")))))));
}

/* ═══════════════════════════════════════════════════════════
   DEVICES (Mis Lanzas)
   ═══════════════════════════════════════════════════════════ */
function DCard({
  device,
  last
}) {
  const on = device.status === 'online';
  const bc = device.battery > 50 ? 'var(--status-ok)' : device.battery > 20 ? 'var(--status-warn)' : 'var(--status-critical)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '14px 0',
      borderBottom: last ? 'none' : '1px solid var(--border-default)',
      display: 'flex',
      gap: 12,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 44,
      height: 44,
      borderRadius: 'var(--radius-md)',
      background: on ? 'var(--green-tint)' : 'var(--surface-input)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(PIcon, {
    name: "wifi",
    size: 20,
    color: on ? 'var(--action-primary)' : 'var(--text-muted)'
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 15,
      fontWeight: 600,
      color: 'var(--text-primary)'
    }
  }, device.name), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      borderRadius: '50%',
      background: on ? 'var(--status-ok)' : 'var(--text-muted)',
      flexShrink: 0
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 12,
      color: 'var(--text-muted)',
      marginTop: 2
    }
  }, device.silo, " \xB7 ", device.lastSync)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: 2
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 13,
      fontWeight: 600,
      color: bc
    }
  }, device.battery, "%"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 10,
      color: 'var(--text-muted)'
    }
  }, "Bater\xEDa")));
}
function DevicesScreen({
  devices,
  nav
}) {
  const onl = devices.filter(d => d.status === 'online').length;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      background: 'var(--surface-app)'
    }
  }, /*#__PURE__*/React.createElement(PBackHeader, {
    title: "Mis lanzas",
    onBack: () => nav('perfil')
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: 'auto',
      padding: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 8,
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--green-tint)',
      border: '1px solid rgba(34,197,94,.2)',
      borderRadius: 'var(--radius-md)',
      padding: '10px 12px',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 22,
      fontWeight: 700,
      color: 'var(--action-primary)'
    }
  }, onl), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 10,
      color: 'var(--text-muted)',
      letterSpacing: '.05em',
      textTransform: 'uppercase',
      marginTop: 4
    }
  }, "Online")), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-md)',
      padding: '10px 12px',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 22,
      fontWeight: 700,
      color: 'var(--text-muted)'
    }
  }, devices.length - onl), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 10,
      color: 'var(--text-muted)',
      letterSpacing: '.05em',
      textTransform: 'uppercase',
      marginTop: 4
    }
  }, "Offline"))), /*#__PURE__*/React.createElement(SCard, {
    label: "DISPOSITIVOS"
  }, devices.map((d, i) => /*#__PURE__*/React.createElement(DCard, {
    key: d.id,
    device: d,
    last: i === devices.length - 1
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement(PBtn, {
    variant: "secondary",
    style: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(PIcon, {
    name: "plus-circle",
    size: 16
  }), "Vincular nueva lanza"))));
}

/* ── export to window ── */
Object.assign(window, {
  ProfileScreen,
  EditProfileScreen,
  NotificationsScreen,
  DevicesScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "screens/profile-screens.jsx", error: String((e && e.message) || e) }); }

// screens/tweaks-panel.jsx
try { (() => {
// @ds-adherence-ignore -- omelette starter scaffold (raw elements/hex/px by design)

/* BEGIN USAGE */
// tweaks-panel.jsx
// Reusable Tweaks shell + form-control helpers.
// Exports (to window): useTweaks, TweaksPanel, TweakSection, TweakRow, TweakSlider,
//   TweakToggle, TweakRadio, TweakSelect, TweakText, TweakNumber, TweakColor, TweakButton.
//
// Owns the host protocol (listens for __activate_edit_mode / __deactivate_edit_mode,
// posts __edit_mode_available / __edit_mode_set_keys / __edit_mode_dismissed) so
// individual prototypes don't re-roll it. Ships a consistent set of controls so you
// don't hand-draw <input type="range">, segmented radios, steppers, etc.
//
// Usage (in an HTML file that loads React + Babel):
//
//   const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
//     "primaryColor": "#D97757",
//     "palette": ["#D97757", "#29261b", "#f6f4ef"],
//     "fontSize": 16,
//     "density": "regular",
//     "dark": false
//   }/*EDITMODE-END*/;
//
//   function App() {
//     const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
//     return (
//       <div style={{ fontSize: t.fontSize, color: t.primaryColor }}>
//         Hello
//         <TweaksPanel>
//           <TweakSection label="Typography" />
//           <TweakSlider label="Font size" value={t.fontSize} min={10} max={32} unit="px"
//                        onChange={(v) => setTweak('fontSize', v)} />
//           <TweakRadio  label="Density" value={t.density}
//                        options={['compact', 'regular', 'comfy']}
//                        onChange={(v) => setTweak('density', v)} />
//           <TweakSection label="Theme" />
//           <TweakColor  label="Primary" value={t.primaryColor}
//                        options={['#D97757', '#2A6FDB', '#1F8A5B', '#7A5AE0']}
//                        onChange={(v) => setTweak('primaryColor', v)} />
//           <TweakColor  label="Palette" value={t.palette}
//                        options={[['#D97757', '#29261b', '#f6f4ef'],
//                                  ['#475569', '#0f172a', '#f1f5f9']]}
//                        onChange={(v) => setTweak('palette', v)} />
//           <TweakToggle label="Dark mode" value={t.dark}
//                        onChange={(v) => setTweak('dark', v)} />
//         </TweaksPanel>
//       </div>
//     );
//   }
//
// TweakRadio is the segmented control for 2–3 short options (auto-falls-back to
// TweakSelect past ~16/~10 chars per label); reach for TweakSelect directly when
// options are many or long. For color tweaks always curate 3-4 options rather than
// a free picker; an option can also be a whole 2–5 color palette (the stored value
// is the array). The Tweak* controls are a floor, not a ceiling — build custom
// controls inside the panel if a tweak calls for UI they don't cover.
/* END USAGE */
// ─────────────────────────────────────────────────────────────────────────────

const __TWEAKS_STYLE = `
  .twk-panel{position:fixed;right:16px;bottom:16px;z-index:2147483646;width:280px;
    max-height:calc(100vh - 32px);display:flex;flex-direction:column;
    transform:scale(var(--dc-inv-zoom,1));transform-origin:bottom right;
    background:rgba(250,249,247,.78);color:#29261b;
    -webkit-backdrop-filter:blur(24px) saturate(160%);backdrop-filter:blur(24px) saturate(160%);
    border:.5px solid rgba(255,255,255,.6);border-radius:14px;
    box-shadow:0 1px 0 rgba(255,255,255,.5) inset,0 12px 40px rgba(0,0,0,.18);
    font:11.5px/1.4 ui-sans-serif,system-ui,-apple-system,sans-serif;overflow:hidden}
  .twk-hd{display:flex;align-items:center;justify-content:space-between;
    padding:10px 8px 10px 14px;cursor:move;user-select:none}
  .twk-hd b{font-size:12px;font-weight:600;letter-spacing:.01em}
  .twk-x{appearance:none;border:0;background:transparent;color:rgba(41,38,27,.55);
    width:22px;height:22px;border-radius:6px;cursor:default;font-size:13px;line-height:1}
  .twk-x:hover{background:rgba(0,0,0,.06);color:#29261b}
  .twk-body{padding:2px 14px 14px;display:flex;flex-direction:column;gap:10px;
    overflow-y:auto;overflow-x:hidden;min-height:0;
    scrollbar-width:thin;scrollbar-color:rgba(0,0,0,.15) transparent}
  .twk-body::-webkit-scrollbar{width:8px}
  .twk-body::-webkit-scrollbar-track{background:transparent;margin:2px}
  .twk-body::-webkit-scrollbar-thumb{background:rgba(0,0,0,.15);border-radius:4px;
    border:2px solid transparent;background-clip:content-box}
  .twk-body::-webkit-scrollbar-thumb:hover{background:rgba(0,0,0,.25);
    border:2px solid transparent;background-clip:content-box}
  .twk-row{display:flex;flex-direction:column;gap:5px}
  .twk-row-h{flex-direction:row;align-items:center;justify-content:space-between;gap:10px}
  .twk-lbl{display:flex;justify-content:space-between;align-items:baseline;
    color:rgba(41,38,27,.72)}
  .twk-lbl>span:first-child{font-weight:500}
  .twk-val{color:rgba(41,38,27,.5);font-variant-numeric:tabular-nums}

  .twk-sect{font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;
    color:rgba(41,38,27,.45);padding:10px 0 0}
  .twk-sect:first-child{padding-top:0}

  .twk-field{appearance:none;box-sizing:border-box;width:100%;min-width:0;height:26px;padding:0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;
    background:rgba(255,255,255,.6);color:inherit;font:inherit;outline:none}
  .twk-field:focus{border-color:rgba(0,0,0,.25);background:rgba(255,255,255,.85)}
  select.twk-field{padding-right:22px;
    background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'><path fill='rgba(0,0,0,.5)' d='M0 0h10L5 6z'/></svg>");
    background-repeat:no-repeat;background-position:right 8px center}

  .twk-slider{appearance:none;-webkit-appearance:none;width:100%;height:4px;margin:6px 0;
    border-radius:999px;background:rgba(0,0,0,.12);outline:none}
  .twk-slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;
    width:14px;height:14px;border-radius:50%;background:#fff;
    border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}
  .twk-slider::-moz-range-thumb{width:14px;height:14px;border-radius:50%;
    background:#fff;border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}

  .twk-seg{position:relative;display:flex;padding:2px;border-radius:8px;
    background:rgba(0,0,0,.06);user-select:none}
  .twk-seg-thumb{position:absolute;top:2px;bottom:2px;border-radius:6px;
    background:rgba(255,255,255,.9);box-shadow:0 1px 2px rgba(0,0,0,.12);
    transition:left .15s cubic-bezier(.3,.7,.4,1),width .15s}
  .twk-seg.dragging .twk-seg-thumb{transition:none}
  .twk-seg button{appearance:none;position:relative;z-index:1;flex:1;border:0;
    background:transparent;color:inherit;font:inherit;font-weight:500;min-height:22px;
    border-radius:6px;cursor:default;padding:4px 6px;line-height:1.2;
    overflow-wrap:anywhere}

  .twk-toggle{position:relative;width:32px;height:18px;border:0;border-radius:999px;
    background:rgba(0,0,0,.15);transition:background .15s;cursor:default;padding:0}
  .twk-toggle[data-on="1"]{background:#34c759}
  .twk-toggle i{position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;
    background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.25);transition:transform .15s}
  .twk-toggle[data-on="1"] i{transform:translateX(14px)}

  .twk-num{display:flex;align-items:center;box-sizing:border-box;min-width:0;height:26px;padding:0 0 0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;background:rgba(255,255,255,.6)}
  .twk-num-lbl{font-weight:500;color:rgba(41,38,27,.6);cursor:ew-resize;
    user-select:none;padding-right:8px}
  .twk-num input{flex:1;min-width:0;height:100%;border:0;background:transparent;
    font:inherit;font-variant-numeric:tabular-nums;text-align:right;padding:0 8px 0 0;
    outline:none;color:inherit;-moz-appearance:textfield}
  .twk-num input::-webkit-inner-spin-button,.twk-num input::-webkit-outer-spin-button{
    -webkit-appearance:none;margin:0}
  .twk-num-unit{padding-right:8px;color:rgba(41,38,27,.45)}

  .twk-btn{appearance:none;height:26px;padding:0 12px;border:0;border-radius:7px;
    background:rgba(0,0,0,.78);color:#fff;font:inherit;font-weight:500;cursor:default}
  .twk-btn:hover{background:rgba(0,0,0,.88)}
  .twk-btn.secondary{background:rgba(0,0,0,.06);color:inherit}
  .twk-btn.secondary:hover{background:rgba(0,0,0,.1)}

  .twk-swatch{appearance:none;-webkit-appearance:none;width:56px;height:22px;
    border:.5px solid rgba(0,0,0,.1);border-radius:6px;padding:0;cursor:default;
    background:transparent;flex-shrink:0}
  .twk-swatch::-webkit-color-swatch-wrapper{padding:0}
  .twk-swatch::-webkit-color-swatch{border:0;border-radius:5.5px}
  .twk-swatch::-moz-color-swatch{border:0;border-radius:5.5px}

  .twk-chips{display:flex;gap:6px}
  .twk-chip{position:relative;appearance:none;flex:1;min-width:0;height:46px;
    padding:0;border:0;border-radius:6px;overflow:hidden;cursor:default;
    box-shadow:0 0 0 .5px rgba(0,0,0,.12),0 1px 2px rgba(0,0,0,.06);
    transition:transform .12s cubic-bezier(.3,.7,.4,1),box-shadow .12s}
  .twk-chip:hover{transform:translateY(-1px);
    box-shadow:0 0 0 .5px rgba(0,0,0,.18),0 4px 10px rgba(0,0,0,.12)}
  .twk-chip[data-on="1"]{box-shadow:0 0 0 1.5px rgba(0,0,0,.85),
    0 2px 6px rgba(0,0,0,.15)}
  .twk-chip>span{position:absolute;top:0;bottom:0;right:0;width:34%;
    display:flex;flex-direction:column;box-shadow:-1px 0 0 rgba(0,0,0,.1)}
  .twk-chip>span>i{flex:1;box-shadow:0 -1px 0 rgba(0,0,0,.1)}
  .twk-chip>span>i:first-child{box-shadow:none}
  .twk-chip svg{position:absolute;top:6px;left:6px;width:13px;height:13px;
    filter:drop-shadow(0 1px 1px rgba(0,0,0,.3))}
`;

// ── useTweaks ───────────────────────────────────────────────────────────────
// Single source of truth for tweak values. setTweak persists via the host
// (__edit_mode_set_keys → host rewrites the EDITMODE block on disk).
function useTweaks(defaults) {
  const [values, setValues] = React.useState(defaults);
  // Accepts either setTweak('key', value) or setTweak({ key: value, ... }) so a
  // useState-style call doesn't write a "[object Object]" key into the persisted
  // JSON block.
  const setTweak = React.useCallback((keyOrEdits, val) => {
    const edits = typeof keyOrEdits === 'object' && keyOrEdits !== null ? keyOrEdits : {
      [keyOrEdits]: val
    };
    setValues(prev => ({
      ...prev,
      ...edits
    }));
    window.parent.postMessage({
      type: '__edit_mode_set_keys',
      edits
    }, '*');
    // Same-window signal so in-page listeners (deck-stage rail thumbnails)
    // can react — the parent message only reaches the host, not peers.
    window.dispatchEvent(new CustomEvent('tweakchange', {
      detail: edits
    }));
  }, []);
  return [values, setTweak];
}

// ── TweaksPanel ─────────────────────────────────────────────────────────────
// Floating shell. Registers the protocol listener BEFORE announcing
// availability — if the announce ran first, the host's activate could land
// before our handler exists and the toolbar toggle would silently no-op.
// The close button posts __edit_mode_dismissed so the host's toolbar toggle
// flips off in lockstep; the host echoes __deactivate_edit_mode back which
// is what actually hides the panel.
function TweaksPanel({
  title = 'Tweaks',
  children
}) {
  const [open, setOpen] = React.useState(false);
  const dragRef = React.useRef(null);
  const offsetRef = React.useRef({
    x: 16,
    y: 16
  });
  const PAD = 16;
  const clampToViewport = React.useCallback(() => {
    const panel = dragRef.current;
    if (!panel) return;
    const w = panel.offsetWidth,
      h = panel.offsetHeight;
    const maxRight = Math.max(PAD, window.innerWidth - w - PAD);
    const maxBottom = Math.max(PAD, window.innerHeight - h - PAD);
    offsetRef.current = {
      x: Math.min(maxRight, Math.max(PAD, offsetRef.current.x)),
      y: Math.min(maxBottom, Math.max(PAD, offsetRef.current.y))
    };
    panel.style.right = offsetRef.current.x + 'px';
    panel.style.bottom = offsetRef.current.y + 'px';
  }, []);
  React.useEffect(() => {
    if (!open) return;
    clampToViewport();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', clampToViewport);
      return () => window.removeEventListener('resize', clampToViewport);
    }
    const ro = new ResizeObserver(clampToViewport);
    ro.observe(document.documentElement);
    return () => ro.disconnect();
  }, [open, clampToViewport]);
  React.useEffect(() => {
    const onMsg = e => {
      const t = e?.data?.type;
      if (t === '__activate_edit_mode') setOpen(true);else if (t === '__deactivate_edit_mode') setOpen(false);
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({
      type: '__edit_mode_available'
    }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);
  const dismiss = () => {
    setOpen(false);
    window.parent.postMessage({
      type: '__edit_mode_dismissed'
    }, '*');
  };
  const onDragStart = e => {
    const panel = dragRef.current;
    if (!panel) return;
    const r = panel.getBoundingClientRect();
    const sx = e.clientX,
      sy = e.clientY;
    const startRight = window.innerWidth - r.right;
    const startBottom = window.innerHeight - r.bottom;
    const move = ev => {
      offsetRef.current = {
        x: startRight - (ev.clientX - sx),
        y: startBottom - (ev.clientY - sy)
      };
      clampToViewport();
    };
    const up = () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  };
  if (!open) return null;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("style", null, __TWEAKS_STYLE), /*#__PURE__*/React.createElement("div", {
    ref: dragRef,
    className: "twk-panel",
    "data-omelette-chrome": "",
    style: {
      right: offsetRef.current.x,
      bottom: offsetRef.current.y
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-hd",
    onMouseDown: onDragStart
  }, /*#__PURE__*/React.createElement("b", null, title), /*#__PURE__*/React.createElement("button", {
    className: "twk-x",
    "aria-label": "Close tweaks",
    onMouseDown: e => e.stopPropagation(),
    onClick: dismiss
  }, "\u2715")), /*#__PURE__*/React.createElement("div", {
    className: "twk-body"
  }, children)));
}

// ── Layout helpers ──────────────────────────────────────────────────────────

function TweakSection({
  label,
  children
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "twk-sect"
  }, label), children);
}
function TweakRow({
  label,
  value,
  children,
  inline = false
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: inline ? 'twk-row twk-row-h' : 'twk-row'
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-lbl"
  }, /*#__PURE__*/React.createElement("span", null, label), value != null && /*#__PURE__*/React.createElement("span", {
    className: "twk-val"
  }, value)), children);
}

// ── Controls ────────────────────────────────────────────────────────────────

function TweakSlider({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  unit = '',
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label,
    value: `${value}${unit}`
  }, /*#__PURE__*/React.createElement("input", {
    type: "range",
    className: "twk-slider",
    min: min,
    max: max,
    step: step,
    value: value,
    onChange: e => onChange(Number(e.target.value))
  }));
}
function TweakToggle({
  label,
  value,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "twk-row twk-row-h"
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-lbl"
  }, /*#__PURE__*/React.createElement("span", null, label)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "twk-toggle",
    "data-on": value ? '1' : '0',
    role: "switch",
    "aria-checked": !!value,
    onClick: () => onChange(!value)
  }, /*#__PURE__*/React.createElement("i", null)));
}
function TweakRadio({
  label,
  value,
  options,
  onChange
}) {
  const trackRef = React.useRef(null);
  const [dragging, setDragging] = React.useState(false);
  // The active value is read by pointer-move handlers attached for the lifetime
  // of a drag — ref it so a stale closure doesn't fire onChange for every move.
  const valueRef = React.useRef(value);
  valueRef.current = value;

  // Segments wrap mid-word once per-segment width runs out. The track is
  // ~248px (280 panel − 28 body pad − 4 seg pad), each button loses 12px
  // to its own padding, and 11.5px system-ui averages ~6.3px/char — so 2
  // options fit ~16 chars each, 3 fit ~10. Past that (or >3 options), fall
  // back to a dropdown rather than wrap.
  const labelLen = o => String(typeof o === 'object' ? o.label : o).length;
  const maxLen = options.reduce((m, o) => Math.max(m, labelLen(o)), 0);
  const fitsAsSegments = maxLen <= ({
    2: 16,
    3: 10
  }[options.length] ?? 0);
  if (!fitsAsSegments) {
    // <select> emits strings — map back to the original option value so the
    // fallback stays type-preserving (numbers, booleans) like the segment path.
    const resolve = s => {
      const m = options.find(o => String(typeof o === 'object' ? o.value : o) === s);
      return m === undefined ? s : typeof m === 'object' ? m.value : m;
    };
    return /*#__PURE__*/React.createElement(TweakSelect, {
      label: label,
      value: value,
      options: options,
      onChange: s => onChange(resolve(s))
    });
  }
  const opts = options.map(o => typeof o === 'object' ? o : {
    value: o,
    label: o
  });
  const idx = Math.max(0, opts.findIndex(o => o.value === value));
  const n = opts.length;
  const segAt = clientX => {
    const r = trackRef.current.getBoundingClientRect();
    const inner = r.width - 4;
    const i = Math.floor((clientX - r.left - 2) / inner * n);
    return opts[Math.max(0, Math.min(n - 1, i))].value;
  };
  const onPointerDown = e => {
    setDragging(true);
    const v0 = segAt(e.clientX);
    if (v0 !== valueRef.current) onChange(v0);
    const move = ev => {
      if (!trackRef.current) return;
      const v = segAt(ev.clientX);
      if (v !== valueRef.current) onChange(v);
    };
    const up = () => {
      setDragging(false);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("div", {
    ref: trackRef,
    role: "radiogroup",
    onPointerDown: onPointerDown,
    className: dragging ? 'twk-seg dragging' : 'twk-seg'
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-seg-thumb",
    style: {
      left: `calc(2px + ${idx} * (100% - 4px) / ${n})`,
      width: `calc((100% - 4px) / ${n})`
    }
  }), opts.map(o => /*#__PURE__*/React.createElement("button", {
    key: o.value,
    type: "button",
    role: "radio",
    "aria-checked": o.value === value
  }, o.label))));
}
function TweakSelect({
  label,
  value,
  options,
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("select", {
    className: "twk-field",
    value: value,
    onChange: e => onChange(e.target.value)
  }, options.map(o => {
    const v = typeof o === 'object' ? o.value : o;
    const l = typeof o === 'object' ? o.label : o;
    return /*#__PURE__*/React.createElement("option", {
      key: v,
      value: v
    }, l);
  })));
}
function TweakText({
  label,
  value,
  placeholder,
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("input", {
    className: "twk-field",
    type: "text",
    value: value,
    placeholder: placeholder,
    onChange: e => onChange(e.target.value)
  }));
}
function TweakNumber({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  onChange
}) {
  const clamp = n => {
    if (min != null && n < min) return min;
    if (max != null && n > max) return max;
    return n;
  };
  const startRef = React.useRef({
    x: 0,
    val: 0
  });
  const onScrubStart = e => {
    e.preventDefault();
    startRef.current = {
      x: e.clientX,
      val: value
    };
    const decimals = (String(step).split('.')[1] || '').length;
    const move = ev => {
      const dx = ev.clientX - startRef.current.x;
      const raw = startRef.current.val + dx * step;
      const snapped = Math.round(raw / step) * step;
      onChange(clamp(Number(snapped.toFixed(decimals))));
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "twk-num"
  }, /*#__PURE__*/React.createElement("span", {
    className: "twk-num-lbl",
    onPointerDown: onScrubStart
  }, label), /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: value,
    min: min,
    max: max,
    step: step,
    onChange: e => onChange(clamp(Number(e.target.value)))
  }), unit && /*#__PURE__*/React.createElement("span", {
    className: "twk-num-unit"
  }, unit));
}

// Relative-luminance contrast pick — checkmarks drawn over a swatch need to
// read on both #111 and #fafafa without per-option configuration. Hex input
// only (#rgb / #rrggbb); named or rgb()/hsl() colors fall through to "light".
function __twkIsLight(hex) {
  const h = String(hex).replace('#', '');
  const x = h.length === 3 ? h.replace(/./g, c => c + c) : h.padEnd(6, '0');
  const n = parseInt(x.slice(0, 6), 16);
  if (Number.isNaN(n)) return true;
  const r = n >> 16 & 255,
    g = n >> 8 & 255,
    b = n & 255;
  return r * 299 + g * 587 + b * 114 > 148000;
}
const __TwkCheck = ({
  light
}) => /*#__PURE__*/React.createElement("svg", {
  viewBox: "0 0 14 14",
  "aria-hidden": "true"
}, /*#__PURE__*/React.createElement("path", {
  d: "M3 7.2 5.8 10 11 4.2",
  fill: "none",
  strokeWidth: "2.2",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  stroke: light ? 'rgba(0,0,0,.78)' : '#fff'
}));

// TweakColor — curated color/palette picker. Each option is either a single
// hex string or an array of 1-5 hex strings; the card adapts — a lone color
// renders solid, a palette renders colors[0] as the hero (left ~2/3) with the
// rest stacked in a sharp column on the right. onChange emits the
// option in the shape it was passed (string stays string, array stays array).
// Without options it falls back to the native color input for back-compat.
function TweakColor({
  label,
  value,
  options,
  onChange
}) {
  if (!options || !options.length) {
    return /*#__PURE__*/React.createElement("div", {
      className: "twk-row twk-row-h"
    }, /*#__PURE__*/React.createElement("div", {
      className: "twk-lbl"
    }, /*#__PURE__*/React.createElement("span", null, label)), /*#__PURE__*/React.createElement("input", {
      type: "color",
      className: "twk-swatch",
      value: value,
      onChange: e => onChange(e.target.value)
    }));
  }
  // Native <input type=color> emits lowercase hex per the HTML spec, so
  // compare case-insensitively. String() guards JSON.stringify(undefined),
  // which returns the primitive undefined (no .toLowerCase).
  const key = o => String(JSON.stringify(o)).toLowerCase();
  const cur = key(value);
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-chips",
    role: "radiogroup"
  }, options.map((o, i) => {
    const colors = Array.isArray(o) ? o : [o];
    const [hero, ...rest] = colors;
    const sup = rest.slice(0, 4);
    const on = key(o) === cur;
    return /*#__PURE__*/React.createElement("button", {
      key: i,
      type: "button",
      className: "twk-chip",
      role: "radio",
      "aria-checked": on,
      "data-on": on ? '1' : '0',
      "aria-label": colors.join(', '),
      title: colors.join(' · '),
      style: {
        background: hero
      },
      onClick: () => onChange(o)
    }, sup.length > 0 && /*#__PURE__*/React.createElement("span", null, sup.map((c, j) => /*#__PURE__*/React.createElement("i", {
      key: j,
      style: {
        background: c
      }
    }))), on && /*#__PURE__*/React.createElement(__TwkCheck, {
      light: __twkIsLight(hero)
    }));
  })));
}
function TweakButton({
  label,
  onClick,
  secondary = false
}) {
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: secondary ? 'twk-btn secondary' : 'twk-btn',
    onClick: onClick
  }, label);
}
Object.assign(window, {
  useTweaks,
  TweaksPanel,
  TweakSection,
  TweakRow,
  TweakSlider,
  TweakToggle,
  TweakRadio,
  TweakSelect,
  TweakText,
  TweakNumber,
  TweakColor,
  TweakButton
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "screens/tweaks-panel.jsx", error: String((e && e.message) || e) }); }

// ui_kits/onboarding/ScreensAuth.jsx
try { (() => {
/* SiloGuard onboarding UI kit — authentication screens.
   Faithful recreations of Prototype screens 01–05, composed from DS components. */

const B = window.SiloGuardDesignSystem_633342;
const bodyScroll = {
  flex: 1,
  minHeight: 0,
  overflowY: 'auto',
  padding: '0 24px',
  display: 'flex',
  flexDirection: 'column'
};

/* 01 · Splash */
function Splash({
  go
}) {
  React.useEffect(() => {
    const t = setTimeout(() => go('login'), 1600);
    return () => clearTimeout(t);
  }, []);
  return /*#__PURE__*/React.createElement(PhoneShell, null, /*#__PURE__*/React.createElement(StatusBar, null), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 28
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      filter: 'drop-shadow(0 0 24px rgba(34,197,94,0.3))'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo-mark.svg",
    alt: "",
    style: {
      width: 84,
      height: 84
    }
  })), /*#__PURE__*/React.createElement(Logo, {
    size: 34
  }), /*#__PURE__*/React.createElement("span", {
    className: "sg-caption",
    style: {
      position: 'absolute',
      bottom: 80
    }
  }, "Monitoreo inteligente de granos"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 48,
      width: 28,
      height: 28,
      border: '3px solid var(--border)',
      borderTopColor: 'var(--green)',
      borderRadius: '50%',
      animation: 'sg-spin 0.8s linear infinite'
    }
  })), /*#__PURE__*/React.createElement("style", null, `@keyframes sg-spin { to { transform: rotate(360deg); } }`));
}

/* 02 · Login */
function Login({
  go
}) {
  return /*#__PURE__*/React.createElement(PhoneShell, null, /*#__PURE__*/React.createElement(StatusBar, null), /*#__PURE__*/React.createElement("div", {
    style: {
      ...bodyScroll,
      paddingTop: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: 36
    }
  }, /*#__PURE__*/React.createElement(Logo, {
    size: 28
  })), /*#__PURE__*/React.createElement("h1", {
    className: "sg-h1",
    style: {
      margin: '0 0 28px'
    }
  }, "Iniciar sesi\xF3n"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 18
    }
  }, /*#__PURE__*/React.createElement(B.Input, {
    label: "Email",
    placeholder: "tu@email.com",
    type: "email"
  }), /*#__PURE__*/React.createElement(B.Input, {
    label: "Contrase\xF1a",
    placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
    type: "password"
  })), /*#__PURE__*/React.createElement("button", {
    style: linkBtn
  }, "\xBFOlvidaste tu contrase\xF1a?"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 24
    }
  }, /*#__PURE__*/React.createElement(B.Button, {
    fullWidth: true,
    onClick: () => go('dashboard')
  }, "Ingresar")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      margin: '24px 0'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      height: 1,
      background: 'var(--border)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "sg-caption"
  }, "o continu\xE1 con"), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      height: 1,
      background: 'var(--border)'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(B.Button, {
    variant: "secondary",
    fullWidth: true
  }, "Google"), /*#__PURE__*/React.createElement(B.Button, {
    variant: "secondary",
    fullWidth: true
  }, "Apple")), /*#__PURE__*/React.createElement("p", {
    className: "sg-body",
    style: {
      textAlign: 'center',
      color: 'var(--text-muted)',
      marginTop: 28
    }
  }, "\xBFNo ten\xE9s cuenta? ", /*#__PURE__*/React.createElement("button", {
    style: {
      ...linkInline
    },
    onClick: () => go('registro')
  }, "Registrate"))));
}

/* 03 · Registro */
function Registro({
  go
}) {
  return /*#__PURE__*/React.createElement(PhoneShell, null, /*#__PURE__*/React.createElement(StatusBar, null), /*#__PURE__*/React.createElement(AppHeader, {
    title: "Crear cuenta",
    onBack: () => go('login')
  }), /*#__PURE__*/React.createElement(StepDots, {
    total: 5,
    active: 0
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      ...bodyScroll,
      paddingTop: 8,
      paddingBottom: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(B.Input, {
    label: "Email",
    placeholder: "juan@email.com"
  }), /*#__PURE__*/React.createElement(B.Input, {
    label: "Tel\xE9fono",
    placeholder: "+54 9 341 555-0123"
  }), /*#__PURE__*/React.createElement(B.Input, {
    label: "Nombre del establecimiento",
    placeholder: "Estancia La Esperanza"
  }), /*#__PURE__*/React.createElement(B.Input, {
    label: "Localidad / Provincia",
    placeholder: "Pergamino, Buenos Aires"
  }), /*#__PURE__*/React.createElement(B.Input, {
    label: "Contrase\xF1a",
    placeholder: "M\xEDnimo 8 caracteres",
    type: "password"
  }), /*#__PURE__*/React.createElement(B.Input, {
    label: "Confirmar contrase\xF1a",
    placeholder: "Repet\xED tu contrase\xF1a",
    type: "password"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 24
    }
  }, /*#__PURE__*/React.createElement(B.Button, {
    fullWidth: true,
    onClick: () => go('verificar')
  }, "Crear cuenta")), /*#__PURE__*/React.createElement("p", {
    className: "sg-caption",
    style: {
      textAlign: 'center',
      marginTop: 16,
      letterSpacing: 0
    }
  }, "Al registrarte, acept\xE1s los T\xE9rminos y Condiciones y la Pol\xEDtica de Privacidad.")));
}

/* 04 · Verificar email */
function VerificarEmail({
  go
}) {
  return /*#__PURE__*/React.createElement(PhoneShell, null, /*#__PURE__*/React.createElement(StatusBar, null), /*#__PURE__*/React.createElement(AppHeader, {
    title: "Verificar email",
    onBack: () => go('registro')
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '0 32px',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement(IconBadge, {
    icon: "bell",
    tone: "info",
    shape: "squircle"
  }), /*#__PURE__*/React.createElement("h2", {
    className: "sg-h2",
    style: {
      margin: 0
    }
  }, "Revis\xE1 tu correo"), /*#__PURE__*/React.createElement("p", {
    className: "sg-body",
    style: {
      margin: 0,
      color: 'var(--text-muted)'
    }
  }, "Te enviamos un enlace de verificaci\xF3n a ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text)'
    }
  }, "juan@email.com"), ". Toc\xE1 el enlace para activar tu cuenta."), /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement(B.Button, {
    fullWidth: true,
    onClick: () => go('exitoso')
  }, "Ya verifiqu\xE9")), /*#__PURE__*/React.createElement("button", {
    style: linkBtnCentered
  }, "Reenviar email")));
}

/* 05 · Registro exitoso */
function RegistroExitoso({
  go
}) {
  return /*#__PURE__*/React.createElement(PhoneShell, null, /*#__PURE__*/React.createElement(StatusBar, null), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '0 38px',
      gap: 22
    }
  }, /*#__PURE__*/React.createElement(IconBadge, {
    icon: "check",
    tone: "ok",
    shape: "circle",
    glow: true
  }), /*#__PURE__*/React.createElement("h2", {
    className: "sg-h2",
    style: {
      margin: 0
    }
  }, "\xA1Cuenta creada!"), /*#__PURE__*/React.createElement("p", {
    className: "sg-body",
    style: {
      margin: 0,
      color: 'var(--text-muted)'
    }
  }, "Tu cuenta fue creada con \xE9xito. Ahora vamos a configurar tu primer dispositivo."), /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement(B.Button, {
    fullWidth: true,
    onClick: () => go('permisos')
  }, "Continuar"))));
}
const linkBtn = {
  alignSelf: 'flex-end',
  marginTop: 12,
  background: 'none',
  border: 'none',
  color: 'var(--green)',
  fontSize: 12,
  fontFamily: 'var(--font-sans)',
  cursor: 'pointer',
  padding: 0
};
const linkBtnCentered = {
  background: 'none',
  border: 'none',
  color: 'var(--green)',
  fontSize: 13,
  fontFamily: 'var(--font-sans)',
  cursor: 'pointer',
  padding: 0
};
const linkInline = {
  background: 'none',
  border: 'none',
  color: 'var(--green)',
  fontSize: 14,
  fontWeight: 700,
  fontFamily: 'var(--font-sans)',
  cursor: 'pointer',
  padding: 0
};
Object.assign(window, {
  Splash,
  Login,
  Registro,
  VerificarEmail,
  RegistroExitoso
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/onboarding/ScreensAuth.jsx", error: String((e && e.message) || e) }); }

// ui_kits/onboarding/ScreensAuth.standalone.jsx
try { (() => {
/* SiloGuard onboarding UI kit — authentication screens.
   Faithful recreations of Prototype screens 01–05, composed from DS components. */

const B = window.SiloGuardDesignSystem_633342;
const bodyScroll = {
  flex: 1,
  minHeight: 0,
  overflowY: 'auto',
  padding: '0 24px',
  display: 'flex',
  flexDirection: 'column'
};

/* 01 · Splash */
function Splash({
  go
}) {
  React.useEffect(() => {
    const t = setTimeout(() => go('login'), 1600);
    return () => clearTimeout(t);
  }, []);
  return /*#__PURE__*/React.createElement(PhoneShell, null, /*#__PURE__*/React.createElement(StatusBar, null), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 28
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      filter: 'drop-shadow(0 0 24px rgba(34,197,94,0.3))'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: window.__resources.logoMark,
    alt: "",
    style: {
      width: 84,
      height: 84
    }
  })), /*#__PURE__*/React.createElement(Logo, {
    size: 34
  }), /*#__PURE__*/React.createElement("span", {
    className: "sg-caption",
    style: {
      position: 'absolute',
      bottom: 80
    }
  }, "Monitoreo inteligente de granos"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 48,
      width: 28,
      height: 28,
      border: '3px solid var(--border)',
      borderTopColor: 'var(--green)',
      borderRadius: '50%',
      animation: 'sg-spin 0.8s linear infinite'
    }
  })), /*#__PURE__*/React.createElement("style", null, `@keyframes sg-spin { to { transform: rotate(360deg); } }`));
}

/* 02 · Login */
function Login({
  go
}) {
  return /*#__PURE__*/React.createElement(PhoneShell, null, /*#__PURE__*/React.createElement(StatusBar, null), /*#__PURE__*/React.createElement("div", {
    style: {
      ...bodyScroll,
      paddingTop: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: 36
    }
  }, /*#__PURE__*/React.createElement(Logo, {
    size: 28
  })), /*#__PURE__*/React.createElement("h1", {
    className: "sg-h1",
    style: {
      margin: '0 0 28px'
    }
  }, "Iniciar sesi\xF3n"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 18
    }
  }, /*#__PURE__*/React.createElement(B.Input, {
    label: "Email",
    placeholder: "tu@email.com",
    type: "email"
  }), /*#__PURE__*/React.createElement(B.Input, {
    label: "Contrase\xF1a",
    placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
    type: "password"
  })), /*#__PURE__*/React.createElement("button", {
    style: linkBtn
  }, "\xBFOlvidaste tu contrase\xF1a?"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 24
    }
  }, /*#__PURE__*/React.createElement(B.Button, {
    fullWidth: true,
    onClick: () => go('dashboard')
  }, "Ingresar")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      margin: '24px 0'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      height: 1,
      background: 'var(--border)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "sg-caption"
  }, "o continu\xE1 con"), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      height: 1,
      background: 'var(--border)'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(B.Button, {
    variant: "secondary",
    fullWidth: true
  }, "Google"), /*#__PURE__*/React.createElement(B.Button, {
    variant: "secondary",
    fullWidth: true
  }, "Apple")), /*#__PURE__*/React.createElement("p", {
    className: "sg-body",
    style: {
      textAlign: 'center',
      color: 'var(--text-muted)',
      marginTop: 28
    }
  }, "\xBFNo ten\xE9s cuenta? ", /*#__PURE__*/React.createElement("button", {
    style: {
      ...linkInline
    },
    onClick: () => go('registro')
  }, "Registrate"))));
}

/* 03 · Registro */
function Registro({
  go
}) {
  return /*#__PURE__*/React.createElement(PhoneShell, null, /*#__PURE__*/React.createElement(StatusBar, null), /*#__PURE__*/React.createElement(AppHeader, {
    title: "Crear cuenta",
    onBack: () => go('login')
  }), /*#__PURE__*/React.createElement(StepDots, {
    total: 5,
    active: 0
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      ...bodyScroll,
      paddingTop: 8,
      paddingBottom: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(B.Input, {
    label: "Email",
    placeholder: "juan@email.com"
  }), /*#__PURE__*/React.createElement(B.Input, {
    label: "Tel\xE9fono",
    placeholder: "+54 9 341 555-0123"
  }), /*#__PURE__*/React.createElement(B.Input, {
    label: "Nombre del establecimiento",
    placeholder: "Estancia La Esperanza"
  }), /*#__PURE__*/React.createElement(B.Input, {
    label: "Localidad / Provincia",
    placeholder: "Pergamino, Buenos Aires"
  }), /*#__PURE__*/React.createElement(B.Input, {
    label: "Contrase\xF1a",
    placeholder: "M\xEDnimo 8 caracteres",
    type: "password"
  }), /*#__PURE__*/React.createElement(B.Input, {
    label: "Confirmar contrase\xF1a",
    placeholder: "Repet\xED tu contrase\xF1a",
    type: "password"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 24
    }
  }, /*#__PURE__*/React.createElement(B.Button, {
    fullWidth: true,
    onClick: () => go('verificar')
  }, "Crear cuenta")), /*#__PURE__*/React.createElement("p", {
    className: "sg-caption",
    style: {
      textAlign: 'center',
      marginTop: 16,
      letterSpacing: 0
    }
  }, "Al registrarte, acept\xE1s los T\xE9rminos y Condiciones y la Pol\xEDtica de Privacidad.")));
}

/* 04 · Verificar email */
function VerificarEmail({
  go
}) {
  return /*#__PURE__*/React.createElement(PhoneShell, null, /*#__PURE__*/React.createElement(StatusBar, null), /*#__PURE__*/React.createElement(AppHeader, {
    title: "Verificar email",
    onBack: () => go('registro')
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '0 32px',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement(IconBadge, {
    icon: "bell",
    tone: "info",
    shape: "squircle"
  }), /*#__PURE__*/React.createElement("h2", {
    className: "sg-h2",
    style: {
      margin: 0
    }
  }, "Revis\xE1 tu correo"), /*#__PURE__*/React.createElement("p", {
    className: "sg-body",
    style: {
      margin: 0,
      color: 'var(--text-muted)'
    }
  }, "Te enviamos un enlace de verificaci\xF3n a ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text)'
    }
  }, "juan@email.com"), ". Toc\xE1 el enlace para activar tu cuenta."), /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement(B.Button, {
    fullWidth: true,
    onClick: () => go('exitoso')
  }, "Ya verifiqu\xE9")), /*#__PURE__*/React.createElement("button", {
    style: linkBtnCentered
  }, "Reenviar email")));
}

/* 05 · Registro exitoso */
function RegistroExitoso({
  go
}) {
  return /*#__PURE__*/React.createElement(PhoneShell, null, /*#__PURE__*/React.createElement(StatusBar, null), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '0 38px',
      gap: 22
    }
  }, /*#__PURE__*/React.createElement(IconBadge, {
    icon: "check",
    tone: "ok",
    shape: "circle",
    glow: true
  }), /*#__PURE__*/React.createElement("h2", {
    className: "sg-h2",
    style: {
      margin: 0
    }
  }, "\xA1Cuenta creada!"), /*#__PURE__*/React.createElement("p", {
    className: "sg-body",
    style: {
      margin: 0,
      color: 'var(--text-muted)'
    }
  }, "Tu cuenta fue creada con \xE9xito. Ahora vamos a configurar tu primer dispositivo."), /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement(B.Button, {
    fullWidth: true,
    onClick: () => go('permisos')
  }, "Continuar"))));
}
const linkBtn = {
  alignSelf: 'flex-end',
  marginTop: 12,
  background: 'none',
  border: 'none',
  color: 'var(--green)',
  fontSize: 12,
  fontFamily: 'var(--font-sans)',
  cursor: 'pointer',
  padding: 0
};
const linkBtnCentered = {
  background: 'none',
  border: 'none',
  color: 'var(--green)',
  fontSize: 13,
  fontFamily: 'var(--font-sans)',
  cursor: 'pointer',
  padding: 0
};
const linkInline = {
  background: 'none',
  border: 'none',
  color: 'var(--green)',
  fontSize: 14,
  fontWeight: 700,
  fontFamily: 'var(--font-sans)',
  cursor: 'pointer',
  padding: 0
};
Object.assign(window, {
  Splash,
  Login,
  Registro,
  VerificarEmail,
  RegistroExitoso
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/onboarding/ScreensAuth.standalone.jsx", error: String((e && e.message) || e) }); }

// ui_kits/onboarding/ScreensOnboarding.jsx
try { (() => {
/* SiloGuard onboarding UI kit — device-linking screens (06–10) + dashboard.
   Recreations of Prototype screens 06–10, plus the dashboard the flow lands on. */

const O = window.SiloGuardDesignSystem_633342;
const scrollBody = {
  flex: 1,
  minHeight: 0,
  overflowY: 'auto',
  padding: '0 24px',
  display: 'flex',
  flexDirection: 'column'
};

/* 06 · Permiso de notificaciones */
function PermisoNotificaciones({
  go
}) {
  const rows = [['alert-triangle', 'Notificación con 48 hs de anticipación a pérdidas'], ['clock', 'Resumen semanal cada lunes'], ['trending-up', 'Tendencias después de cada acción correctiva']];
  return /*#__PURE__*/React.createElement(PhoneShell, null, /*#__PURE__*/React.createElement(StatusBar, null), /*#__PURE__*/React.createElement(StepDots, {
    total: 5,
    active: 1
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      ...scrollBody,
      paddingTop: 24,
      alignItems: 'center',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement(IconBadge, {
    icon: "bell",
    tone: "ok",
    shape: "squircle"
  }), /*#__PURE__*/React.createElement("h2", {
    className: "sg-h2",
    style: {
      margin: '28px 0 0'
    }
  }, "Activ\xE1 las notificaciones"), /*#__PURE__*/React.createElement("p", {
    className: "sg-body",
    style: {
      color: 'var(--text-muted)',
      margin: '12px 0 24px'
    }
  }, "SiloGuard te avisa cuando un silo necesita atenci\xF3n. Las alertas pueden anticipar p\xE9rdidas con 48 hs de anticipaci\xF3n."), /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
      padding: 18,
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      textAlign: 'left'
    }
  }, rows.map(([icon, label]) => /*#__PURE__*/React.createElement("div", {
    key: label,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--green)',
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement(O.Icon, {
    name: icon,
    size: 18
  })), /*#__PURE__*/React.createElement("span", {
    className: "sg-body",
    style: {
      color: 'var(--text)'
    }
  }, label)))), /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      marginTop: 24
    }
  }, /*#__PURE__*/React.createElement(O.Button, {
    fullWidth: true,
    onClick: () => go('instrucciones')
  }, "Activar notificaciones")), /*#__PURE__*/React.createElement("button", {
    style: ghostLink,
    onClick: () => go('instrucciones')
  }, "Ahora no")));
}

/* 07 · Instrucciones lanza IoT */
function InstruccionesLanza({
  go
}) {
  const steps = [['Clavá la lanza en el silo', 'Insertala verticalmente hasta la marca, en el centro del silo o silobolsa.'], ['Encendé el dispositivo', 'Mantené presionado el botón hasta que la luz verde parpadee.'], ['Tené el QR a mano', 'Vas a escanear el código del costado de la lanza en el próximo paso.']];
  return /*#__PURE__*/React.createElement(PhoneShell, null, /*#__PURE__*/React.createElement(StatusBar, null), /*#__PURE__*/React.createElement(AppHeader, {
    title: "Vincular lanza",
    onBack: () => go('permisos')
  }), /*#__PURE__*/React.createElement(StepDots, {
    total: 5,
    active: 2
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      ...scrollBody,
      paddingTop: 8,
      paddingBottom: 24
    }
  }, /*#__PURE__*/React.createElement("h2", {
    className: "sg-h2",
    style: {
      margin: '8px 0 4px'
    }
  }, "Preparemos tu lanza IoT"), /*#__PURE__*/React.createElement("p", {
    className: "sg-body",
    style: {
      color: 'var(--text-muted)',
      margin: '0 0 20px'
    }
  }, "Segu\xED estos pasos antes de escanear el dispositivo."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, steps.map(([t, d], i) => /*#__PURE__*/React.createElement("div", {
    key: t,
    style: {
      display: 'flex',
      gap: 14,
      padding: 16,
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flexShrink: 0,
      width: 28,
      height: 28,
      borderRadius: '50%',
      background: 'var(--green-tint)',
      color: 'var(--green)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 700,
      fontSize: 14
    }
  }, i + 1), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "sg-h3",
    style: {
      color: 'var(--text)'
    }
  }, t), /*#__PURE__*/React.createElement("span", {
    className: "sg-caption",
    style: {
      letterSpacing: 0
    }
  }, d))))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 24
    }
  }, /*#__PURE__*/React.createElement(O.Button, {
    fullWidth: true,
    onClick: () => go('qr'),
    leadingIcon: /*#__PURE__*/React.createElement(O.Icon, {
      name: "scan-qr",
      size: 18
    })
  }, "Escanear QR"))));
}

/* 08 · Escáner QR */
function EscanerQR({
  go
}) {
  return /*#__PURE__*/React.createElement(PhoneShell, {
    bg: "#000"
  }, /*#__PURE__*/React.createElement(StatusBar, null), /*#__PURE__*/React.createElement(AppHeader, {
    title: "Escanear QR",
    onBack: () => go('instrucciones')
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 28,
      padding: '0 24px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: 240,
      height: 240
    }
  }, [['top', 'left'], ['top', 'right'], ['bottom', 'left'], ['bottom', 'right']].map(([v, h]) => /*#__PURE__*/React.createElement("span", {
    key: v + h,
    style: {
      position: 'absolute',
      [v]: 0,
      [h]: 0,
      width: 44,
      height: 44,
      [`border${v[0].toUpperCase() + v.slice(1)}`]: '3px solid var(--green)',
      [`border${h[0].toUpperCase() + h.slice(1)}`]: '3px solid var(--green)',
      [`border${v === 'top' ? 'TopLeftRadius' : ''}`]: undefined,
      borderRadius: v === 'top' && h === 'left' ? '12px 0 0 0' : v === 'top' && h === 'right' ? '0 12px 0 0' : v === 'bottom' && h === 'left' ? '0 0 0 12px' : '0 0 12px 0'
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: 24,
      right: 24,
      top: '50%',
      height: 2,
      background: 'var(--green)',
      boxShadow: '0 0 12px var(--green)',
      animation: 'sg-scan 2s ease-in-out infinite'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 90,
      border: '1px dashed rgba(34,197,94,0.4)',
      borderRadius: 8
    }
  })), /*#__PURE__*/React.createElement("p", {
    className: "sg-body",
    style: {
      textAlign: 'center',
      color: 'var(--text-muted)',
      maxWidth: 220
    }
  }, "Apunt\xE1 la c\xE1mara al c\xF3digo QR en el costado de la lanza"), /*#__PURE__*/React.createElement("button", {
    style: ghostLink,
    onClick: () => go('vinculado')
  }, "Ingresar c\xF3digo manual")), /*#__PURE__*/React.createElement("style", null, `@keyframes sg-scan { 0%,100% { transform: translateY(-86px); } 50% { transform: translateY(86px); } }`));
}

/* 09 · Dispositivo vinculado */
function DispositivoVinculado({
  go
}) {
  return /*#__PURE__*/React.createElement(PhoneShell, null, /*#__PURE__*/React.createElement(StatusBar, null), /*#__PURE__*/React.createElement(StepDots, {
    total: 5,
    active: 3
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '0 32px',
      gap: 22
    }
  }, /*#__PURE__*/React.createElement(IconBadge, {
    icon: "wifi",
    tone: "ok",
    shape: "circle",
    glow: true
  }), /*#__PURE__*/React.createElement("h2", {
    className: "sg-h2",
    style: {
      margin: 0
    }
  }, "Dispositivo vinculado"), /*#__PURE__*/React.createElement("p", {
    className: "sg-body",
    style: {
      margin: 0,
      color: 'var(--text-muted)'
    }
  }, "La lanza ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text)'
    }
  }, "SG-04821"), " se conect\xF3 correctamente a tu red WiFi y ya est\xE1 enviando datos."), /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: 16,
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)'
    }
  }, /*#__PURE__*/React.createElement(O.StatusDot, {
    tone: "ok",
    size: 10,
    glow: true
  }), /*#__PURE__*/React.createElement("span", {
    className: "sg-body",
    style: {
      color: 'var(--text)'
    }
  }, "Se\xF1al estable"), /*#__PURE__*/React.createElement("span", {
    className: "sg-caption",
    style: {
      letterSpacing: 0,
      marginLeft: 'auto'
    }
  }, "Lanza \xB7 WiFi \xB7 IA")), /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement(O.Button, {
    fullWidth: true,
    onClick: () => go('configurar')
  }, "Continuar"))));
}

/* 10 · Configurar silo */
function ConfigurarSilo({
  go
}) {
  return /*#__PURE__*/React.createElement(PhoneShell, null, /*#__PURE__*/React.createElement(StatusBar, null), /*#__PURE__*/React.createElement(AppHeader, {
    title: "Configurar silo",
    onBack: () => go('vinculado')
  }), /*#__PURE__*/React.createElement(StepDots, {
    total: 5,
    active: 4
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      ...scrollBody,
      paddingTop: 8,
      paddingBottom: 24
    }
  }, /*#__PURE__*/React.createElement("h2", {
    className: "sg-h2",
    style: {
      margin: '8px 0 4px'
    }
  }, "Asign\xE1 un nombre a tu silo"), /*#__PURE__*/React.createElement("p", {
    className: "sg-caption",
    style: {
      letterSpacing: 0,
      margin: '0 0 20px'
    }
  }, "Estos datos te ayudan a identificar y monitorear cada punto de almacenamiento."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(O.Input, {
    label: "Nombre del silo",
    defaultValue: "Silo Norte"
  }), /*#__PURE__*/React.createElement(O.Input, {
    label: "Tipo de grano",
    as: "select",
    defaultValue: "Soja",
    options: ['Soja', 'Maíz', 'Trigo', 'Girasol']
  }), /*#__PURE__*/React.createElement(O.Input, {
    label: "Tonelaje estimado",
    defaultValue: "380 tn"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      padding: 16,
      marginTop: 20,
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--info)',
      flexShrink: 0,
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement(O.Icon, {
    name: "info",
    size: 18
  })), /*#__PURE__*/React.createElement("span", {
    className: "sg-caption",
    style: {
      letterSpacing: 0
    }
  }, "Pod\xE9s cambiar estos datos en cualquier momento desde la configuraci\xF3n del silo.")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 24
    }
  }, /*#__PURE__*/React.createElement(O.Button, {
    fullWidth: true,
    onClick: () => go('dashboard')
  }, "Guardar y continuar"))));
}

/* Destination · Dashboard (lista de silos) — shows the flow paid off */
function Dashboard({
  go
}) {
  const [tab, setTab] = React.useState('dashboard');
  return /*#__PURE__*/React.createElement(PhoneShell, null, /*#__PURE__*/React.createElement(StatusBar, null), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '8px 24px 16px'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "sg-caption",
    style: {
      letterSpacing: 0
    }
  }, "Estancia La Esperanza"), /*#__PURE__*/React.createElement("h1", {
    className: "sg-h1",
    style: {
      margin: '2px 0 0',
      fontSize: 28
    }
  }, "Mis silos")), /*#__PURE__*/React.createElement("button", {
    style: {
      width: 44,
      height: 44,
      borderRadius: 'var(--radius-md)',
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      color: 'var(--green)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(O.Icon, {
    name: "plus-circle",
    size: 22
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minHeight: 0,
      overflowY: 'auto',
      padding: '0 24px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(O.ListItem, {
    state: "selected",
    title: "Silo Norte",
    subtitle: "Soja \xB7 380 tn \xB7 hace 2 min",
    tone: "ok",
    value: 94,
    valueUnit: "/100",
    onClick: () => {}
  }), /*#__PURE__*/React.createElement(O.ListItem, {
    title: "Silo Sur",
    subtitle: "Ma\xEDz \xB7 210 tn \xB7 hace 5 min",
    tone: "warn",
    value: 67,
    valueUnit: "/100",
    onClick: () => {}
  }), /*#__PURE__*/React.createElement(O.ListItem, {
    title: "Silobolsa A3",
    subtitle: "Trigo \xB7 95 tn \xB7 hace 8 min",
    tone: "critical",
    value: 38,
    valueUnit: "/100",
    onClick: () => {}
  }), /*#__PURE__*/React.createElement(O.ListItem, {
    state: "resolved",
    title: "Silo Oeste",
    subtitle: "Temporada cerrada",
    value: "\u2014"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "sg-overline"
  }, "Alerta activa"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10
    }
  }, /*#__PURE__*/React.createElement(O.AlertCard, {
    variant: "critical",
    title: "Fermentaci\xF3n detectada",
    silo: "Silobolsa A3 \xB7 zona inferior",
    time: "hace 12 min",
    description: "El CO\u2082 subi\xF3 38% en 6 horas.",
    estimate: "~36 h",
    action: "Encender aireaci\xF3n",
    onClick: () => {}
  })))), /*#__PURE__*/React.createElement(O.NavBar, {
    active: tab,
    onChange: setTab,
    tabs: [{
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'home'
    }, {
      id: 'alertas',
      label: 'Alertas',
      icon: 'bell',
      badge: 1
    }, {
      id: 'pasaporte',
      label: 'Pasaporte',
      icon: 'clipboard'
    }, {
      id: 'perfil',
      label: 'Perfil',
      icon: 'user'
    }]
  }));
}
const ghostLink = {
  background: 'none',
  border: 'none',
  color: 'var(--text-muted)',
  fontSize: 13,
  fontFamily: 'var(--font-sans)',
  cursor: 'pointer',
  padding: 0,
  marginTop: 16
};
Object.assign(window, {
  PermisoNotificaciones,
  InstruccionesLanza,
  EscanerQR,
  DispositivoVinculado,
  ConfigurarSilo,
  Dashboard
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/onboarding/ScreensOnboarding.jsx", error: String((e && e.message) || e) }); }

// ui_kits/onboarding/Shell.jsx
try { (() => {
/* SiloGuard onboarding UI kit — shared chrome.
   Phone shell, iOS status bar, app header and step dots. These are recreation
   scaffolding (not DS primitives); screens compose them with DS components. */

const BRAND = window.SiloGuardDesignSystem_633342;
function StatusBar() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: 44,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: 'var(--text)'
    }
  }, "9:41"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      color: 'var(--text)'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "17",
    height: "11",
    viewBox: "0 0 17 11",
    fill: "currentColor"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "0",
    y: "6",
    width: "3",
    height: "5",
    rx: "1"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "4.5",
    y: "4",
    width: "3",
    height: "7",
    rx: "1"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "9",
    y: "2",
    width: "3",
    height: "9",
    rx: "1"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "13.5",
    y: "0",
    width: "3",
    height: "11",
    rx: "1"
  })), /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "11",
    viewBox: "0 0 16 11",
    fill: "currentColor"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M8 2.2c2.1 0 4 .8 5.4 2.2l1.3-1.3C13 1.3 10.6.3 8 .3S3 1.3 1.3 3.1l1.3 1.3C4 3 5.9 2.2 8 2.2zm0 3.3c1.2 0 2.3.5 3.1 1.3l1.3-1.3C12.3 4.3 10.3 3.5 8 3.5s-4.3.8-4.4 2L4.9 6.8c.8-.8 1.9-1.3 3.1-1.3zm0 3.3c.6 0 1.2.3 1.6.7L8 11 6.4 9.2c.4-.4 1-.7 1.6-.7z"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 24,
      height: 12,
      borderRadius: 3,
      border: '1px solid rgba(245,245,245,0.5)',
      padding: 1.5,
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      background: 'var(--text)',
      borderRadius: 1
    }
  }))));
}
function AppHeader({
  title,
  onBack
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: 54,
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      padding: '0 12px',
      background: 'var(--surface)',
      borderBottom: '1px solid var(--border)',
      flexShrink: 0
    }
  }, onBack && /*#__PURE__*/React.createElement("button", {
    onClick: onBack,
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 36,
      height: 36,
      background: 'transparent',
      border: 'none',
      color: 'var(--text-muted)',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(BRAND.Icon, {
    name: "chevron-left",
    size: 24
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 20,
      fontWeight: 700,
      letterSpacing: '-0.3px',
      color: 'var(--text)'
    }
  }, title));
}
function StepDots({
  total = 5,
  active = 0
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      height: 28,
      flexShrink: 0
    }
  }, Array.from({
    length: total
  }).map((_, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      height: 4,
      borderRadius: 2,
      width: i === active ? 20 : 4,
      background: i <= active ? 'var(--green)' : 'var(--border)',
      transition: 'all 240ms cubic-bezier(0.4,0,0.2,1)'
    }
  })));
}

/** A round/squircle tinted icon badge used on the empty-state / success screens. */
function IconBadge({
  icon,
  tone = 'ok',
  shape = 'circle',
  glow = false,
  size = 88
}) {
  const color = tone === 'ok' ? 'var(--green)' : tone === 'info' ? 'var(--info)' : 'var(--green)';
  const tint = tone === 'ok' ? 'var(--green-tint)' : 'var(--info-tint)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: size,
      height: size,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: shape === 'circle' ? '50%' : 'var(--radius-xl)',
      background: tint,
      border: `1.5px solid ${glow ? color : 'var(--border)'}`,
      boxShadow: glow ? '0 0 24px rgba(34,197,94,0.3)' : 'none',
      color
    }
  }, /*#__PURE__*/React.createElement(BRAND.Icon, {
    name: icon,
    size: size * 0.42,
    strokeWidth: 2
  }));
}

/** Logo lockup (mark + wordmark). */
function Logo({
  size = 30
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 9
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo-mark.svg",
    alt: "",
    style: {
      width: size,
      height: size
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: size * 0.82,
      fontWeight: 600,
      letterSpacing: '-0.5px',
      color: 'var(--text)'
    }
  }, "SiloGuard"));
}

/** The phone shell. children fill the body; bottomBar pins to the bottom. */
function PhoneShell({
  children,
  bg = 'var(--bg)'
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: 390,
      height: 844,
      background: bg,
      borderRadius: 44,
      border: '10px solid #000',
      boxShadow: 'var(--shadow-lg)',
      overflow: 'hidden',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column'
    }
  }, children);
}
Object.assign(window, {
  StatusBar,
  AppHeader,
  StepDots,
  IconBadge,
  Logo,
  PhoneShell
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/onboarding/Shell.jsx", error: String((e && e.message) || e) }); }

// ui_kits/onboarding/Shell.standalone.jsx
try { (() => {
/* SiloGuard onboarding UI kit — shared chrome.
   Phone shell, iOS status bar, app header and step dots. These are recreation
   scaffolding (not DS primitives); screens compose them with DS components. */

const BRAND = window.SiloGuardDesignSystem_633342;
function StatusBar() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: 44,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: 'var(--text)'
    }
  }, "9:41"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      color: 'var(--text)'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "17",
    height: "11",
    viewBox: "0 0 17 11",
    fill: "currentColor"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "0",
    y: "6",
    width: "3",
    height: "5",
    rx: "1"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "4.5",
    y: "4",
    width: "3",
    height: "7",
    rx: "1"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "9",
    y: "2",
    width: "3",
    height: "9",
    rx: "1"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "13.5",
    y: "0",
    width: "3",
    height: "11",
    rx: "1"
  })), /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "11",
    viewBox: "0 0 16 11",
    fill: "currentColor"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M8 2.2c2.1 0 4 .8 5.4 2.2l1.3-1.3C13 1.3 10.6.3 8 .3S3 1.3 1.3 3.1l1.3 1.3C4 3 5.9 2.2 8 2.2zm0 3.3c1.2 0 2.3.5 3.1 1.3l1.3-1.3C12.3 4.3 10.3 3.5 8 3.5s-4.3.8-4.4 2L4.9 6.8c.8-.8 1.9-1.3 3.1-1.3zm0 3.3c.6 0 1.2.3 1.6.7L8 11 6.4 9.2c.4-.4 1-.7 1.6-.7z"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 24,
      height: 12,
      borderRadius: 3,
      border: '1px solid rgba(245,245,245,0.5)',
      padding: 1.5,
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      background: 'var(--text)',
      borderRadius: 1
    }
  }))));
}
function AppHeader({
  title,
  onBack
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: 54,
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      padding: '0 12px',
      background: 'var(--surface)',
      borderBottom: '1px solid var(--border)',
      flexShrink: 0
    }
  }, onBack && /*#__PURE__*/React.createElement("button", {
    onClick: onBack,
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 36,
      height: 36,
      background: 'transparent',
      border: 'none',
      color: 'var(--text-muted)',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(BRAND.Icon, {
    name: "chevron-left",
    size: 24
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 20,
      fontWeight: 700,
      letterSpacing: '-0.3px',
      color: 'var(--text)'
    }
  }, title));
}
function StepDots({
  total = 5,
  active = 0
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      height: 28,
      flexShrink: 0
    }
  }, Array.from({
    length: total
  }).map((_, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      height: 4,
      borderRadius: 2,
      width: i === active ? 20 : 4,
      background: i <= active ? 'var(--green)' : 'var(--border)',
      transition: 'all 240ms cubic-bezier(0.4,0,0.2,1)'
    }
  })));
}

/** A round/squircle tinted icon badge used on the empty-state / success screens. */
function IconBadge({
  icon,
  tone = 'ok',
  shape = 'circle',
  glow = false,
  size = 88
}) {
  const color = tone === 'ok' ? 'var(--green)' : tone === 'info' ? 'var(--info)' : 'var(--green)';
  const tint = tone === 'ok' ? 'var(--green-tint)' : 'var(--info-tint)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: size,
      height: size,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: shape === 'circle' ? '50%' : 'var(--radius-xl)',
      background: tint,
      border: `1.5px solid ${glow ? color : 'var(--border)'}`,
      boxShadow: glow ? '0 0 24px rgba(34,197,94,0.3)' : 'none',
      color
    }
  }, /*#__PURE__*/React.createElement(BRAND.Icon, {
    name: icon,
    size: size * 0.42,
    strokeWidth: 2
  }));
}

/** Logo lockup (mark + wordmark). */
function Logo({
  size = 30
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 9
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: window.__resources.logoMark,
    alt: "",
    style: {
      width: size,
      height: size
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: size * 0.82,
      fontWeight: 600,
      letterSpacing: '-0.5px',
      color: 'var(--text)'
    }
  }, "SiloGuard"));
}

/** The phone shell. children fill the body; bottomBar pins to the bottom. */
function PhoneShell({
  children,
  bg = 'var(--bg)'
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: 390,
      height: 844,
      background: bg,
      borderRadius: 44,
      border: '10px solid #000',
      boxShadow: 'var(--shadow-lg)',
      overflow: 'hidden',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column'
    }
  }, children);
}
Object.assign(window, {
  StatusBar,
  AppHeader,
  StepDots,
  IconBadge,
  Logo,
  PhoneShell
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/onboarding/Shell.standalone.jsx", error: String((e && e.message) || e) }); }

__ds_ns.AlertCard = __ds_scope.AlertCard;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.EmptyState = __ds_scope.EmptyState;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.ICON_NAMES = __ds_scope.ICON_NAMES;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.ListItem = __ds_scope.ListItem;

__ds_ns.Modal = __ds_scope.Modal;

__ds_ns.BottomSheet = __ds_scope.BottomSheet;

__ds_ns.NavBar = __ds_scope.NavBar;

__ds_ns.SensorStat = __ds_scope.SensorStat;

__ds_ns.StatusDot = __ds_scope.StatusDot;

__ds_ns.StatusBadge = __ds_scope.StatusBadge;

__ds_ns.Tabs = __ds_scope.Tabs;

__ds_ns.ToastProvider = __ds_scope.ToastProvider;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.Toggle = __ds_scope.Toggle;

})();
