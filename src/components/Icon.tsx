/**
 * Icon — set de iconos de línea (Lucide-style, 24/2px, round caps/joins).
 * Heredan color vía la prop `color` (default: currentColor del texto primario).
 * Requiere react-native-svg (incluido en Expo).
 */
import React from 'react';
import Svg, { Path, Circle, Rect, Polyline, Line } from 'react-native-svg';
import { Colors } from '../constants/Theme';

export type IconName =
  | 'home' | 'bell' | 'clipboard' | 'user' | 'settings'
  | 'alert-triangle' | 'check' | 'check-circle' | 'x-circle' | 'x' | 'info'
  | 'chevron-left' | 'chevron-right' | 'chevron-down'
  | 'scan-qr' | 'wifi' | 'wifi-off' | 'plus-circle' | 'target'
  | 'thermometer' | 'droplet' | 'wind' | 'trending-up' | 'clock' | 'mail'
  | 'map-pin' | 'message-circle' | 'phone' | 'moon' | 'smartphone'
  | 'refresh-cw' | 'lock' | 'file-text' | 'camera'
  | 'trash' | 'edit' | 'more-vertical' | 'log-out' | 'shield'
  | 'inbox' | 'cloud-off' | 'search' | 'link'
  | 'eye' | 'eye-off' | 'copy' | 'share-2';

type Props = {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
};

export const ICON_NAMES: IconName[] = [
  'home', 'bell', 'clipboard', 'user', 'settings',
  'alert-triangle', 'check', 'check-circle', 'x-circle', 'x', 'info',
  'chevron-left', 'chevron-right', 'chevron-down',
  'scan-qr', 'wifi', 'wifi-off', 'plus-circle', 'target',
  'thermometer', 'droplet', 'wind', 'trending-up', 'clock', 'mail',
  'map-pin', 'message-circle', 'phone', 'moon', 'smartphone',
  'refresh-cw', 'lock', 'file-text', 'camera',
  'trash', 'edit', 'more-vertical', 'log-out', 'shield',
  'inbox', 'cloud-off', 'search', 'link',
  'eye', 'eye-off', 'copy', 'share-2',
];

export function Icon({ name, size = 24, color = Colors.textPrimary, strokeWidth = 2 }: Props) {
  const common = {
    stroke: color,
    strokeWidth,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    fill: 'none',
  };

  const paths: Record<IconName, React.ReactNode> = {
    home: (
      <>
        <Path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" {...common} />
        <Polyline points="9 22 9 12 15 12 15 22" {...common} />
      </>
    ),
    bell: (
      <>
        <Path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" {...common} />
        <Path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" {...common} />
      </>
    ),
    clipboard: (
      <>
        <Rect x="8" y="2" width="8" height="4" rx="1" ry="1" {...common} />
        <Path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" {...common} />
        <Path d="M9 14h6" {...common} />
        <Path d="M9 18h4" {...common} />
      </>
    ),
    user: (
      <>
        <Path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" {...common} />
        <Circle cx="12" cy="7" r="4" {...common} />
      </>
    ),
    settings: (
      <>
        <Path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" {...common} />
        <Circle cx="12" cy="12" r="3" {...common} />
      </>
    ),
    'alert-triangle': (
      <>
        <Path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" {...common} />
        <Line x1="12" x2="12" y1="9" y2="13" {...common} />
        <Line x1="12" x2="12.01" y1="17" y2="17" {...common} />
      </>
    ),
    check: <Polyline points="20 6 9 17 4 12" {...common} />,
    'check-circle': (
      <>
        <Path d="M21.801 10A10 10 0 1 1 17 3.335" {...common} />
        <Path d="m9 11 3 3L22 4" {...common} />
      </>
    ),
    'x-circle': (
      <>
        <Circle cx="12" cy="12" r="10" {...common} />
        <Path d="m15 9-6 6" {...common} />
        <Path d="m9 9 6 6" {...common} />
      </>
    ),
    x: (
      <>
        <Path d="M18 6 6 18" {...common} />
        <Path d="m6 6 12 12" {...common} />
      </>
    ),
    info: (
      <>
        <Circle cx="12" cy="12" r="10" {...common} />
        <Path d="M12 16v-4" {...common} />
        <Path d="M12 8h.01" {...common} />
      </>
    ),
    'chevron-left': <Path d="m15 18-6-6 6-6" {...common} />,
    'chevron-right': <Path d="m9 18 6-6-6-6" {...common} />,
    'chevron-down': <Path d="m6 9 6 6 6-6" {...common} />,
    'scan-qr': (
      <>
        <Path d="M3 7V5a2 2 0 0 1 2-2h2" {...common} />
        <Path d="M17 3h2a2 2 0 0 1 2 2v2" {...common} />
        <Path d="M21 17v2a2 2 0 0 1-2 2h-2" {...common} />
        <Path d="M7 21H5a2 2 0 0 1-2-2v-2" {...common} />
        <Rect x="7" y="7" width="5" height="5" rx="1" {...common} />
      </>
    ),
    wifi: (
      <>
        <Path d="M12 20h.01" {...common} />
        <Path d="M2 8.82a15 15 0 0 1 20 0" {...common} />
        <Path d="M5 12.859a10 10 0 0 1 14 0" {...common} />
        <Path d="M8.5 16.429a5 5 0 0 1 7 0" {...common} />
      </>
    ),
    'plus-circle': (
      <>
        <Circle cx="12" cy="12" r="10" {...common} />
        <Path d="M8 12h8" {...common} />
        <Path d="M12 8v8" {...common} />
      </>
    ),
    target: (
      <>
        <Circle cx="12" cy="12" r="10" {...common} />
        <Circle cx="12" cy="12" r="6" {...common} />
        <Circle cx="12" cy="12" r="2" {...common} />
      </>
    ),
    thermometer: <Path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z" {...common} />,
    droplet: <Path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" {...common} />,
    wind: (
      <>
        <Path d="M12.8 19.6A2 2 0 1 0 14 16H2" {...common} />
        <Path d="M17.5 8a2.5 2.5 0 1 1 2 4H2" {...common} />
        <Path d="M9.8 4.4A2 2 0 1 1 11 8H2" {...common} />
      </>
    ),
    'trending-up': (
      <>
        <Polyline points="22 7 13.5 15.5 8.5 10.5 2 17" {...common} />
        <Polyline points="16 7 22 7 22 13" {...common} />
      </>
    ),
    clock: (
      <>
        <Circle cx="12" cy="12" r="10" {...common} />
        <Polyline points="12 6 12 12 16 14" {...common} />
      </>
    ),
    mail: (
      <>
        <Rect x="2" y="4" width="20" height="16" rx="2" {...common} />
        <Path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" {...common} />
      </>
    ),
    'map-pin': (
      <>
        <Path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" {...common} />
        <Circle cx="12" cy="10" r="3" {...common} />
      </>
    ),
    'message-circle': <Path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" {...common} />,
    phone: (
      <Path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12 19.79 19.79 0 0 1 1.07 3.18 2 2 0 0 1 3 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" {...common} />
    ),
    moon: <Path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" {...common} />,
    smartphone: (
      <>
        <Rect width="14" height="20" x="5" y="2" rx="2" {...common} />
        <Path d="M12 18h.01" {...common} />
      </>
    ),
    'refresh-cw': (
      <>
        <Path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" {...common} />
        <Path d="M21 3v5h-5" {...common} />
        <Path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" {...common} />
        <Path d="M8 16H3v5" {...common} />
      </>
    ),
    lock: (
      <>
        <Rect width="18" height="11" x="3" y="11" rx="2" {...common} />
        <Path d="M7 11V7a5 5 0 0 1 10 0v4" {...common} />
      </>
    ),
    'file-text': (
      <>
        <Path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" {...common} />
        <Polyline points="14 2 14 8 20 8" {...common} />
        <Line x1="16" x2="8" y1="13" y2="13" {...common} />
        <Line x1="16" x2="8" y1="17" y2="17" {...common} />
        <Line x1="10" x2="8" y1="9" y2="9" {...common} />
      </>
    ),
    camera: (
      <>
        <Path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" {...common} />
        <Circle cx="12" cy="13" r="3" {...common} />
      </>
    ),
    trash: (
      <>
        <Polyline points="3 6 5 6 21 6" {...common} />
        <Path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" {...common} />
      </>
    ),
    edit: (
      <>
        <Path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" {...common} />
        <Path d="m15 5 4 4" {...common} />
      </>
    ),
    'more-vertical': (
      <>
        <Circle cx="12" cy="5" r="1" {...common} />
        <Circle cx="12" cy="12" r="1" {...common} />
        <Circle cx="12" cy="19" r="1" {...common} />
      </>
    ),
    'log-out': (
      <>
        <Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" {...common} />
        <Polyline points="16 17 21 12 16 7" {...common} />
        <Line x1="21" x2="9" y1="12" y2="12" {...common} />
      </>
    ),
    shield: (
      <>
        <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" {...common} />
      </>
    ),
    'wifi-off': (
      <>
        <Line x1="1" x2="23" y1="1" y2="23" {...common} />
        <Path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" {...common} />
        <Path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" {...common} />
        <Path d="M10.71 5.05A16 16 0 0 1 22.56 9" {...common} />
        <Path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" {...common} />
        <Path d="M8.53 16.11a6 6 0 0 1 6.95 0" {...common} />
        <Line x1="12" x2="12.01" y1="20" y2="20" {...common} />
      </>
    ),
    inbox: (
      <>
        <Polyline points="22 12 16 12 14 15 10 15 8 12 2 12" {...common} />
        <Path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" {...common} />
      </>
    ),
    'cloud-off': (
      <>
        <Path d="m2 2 20 20" {...common} />
        <Path d="M5.782 5.782A7 7 0 0 0 9 19h8.5a4.5 4.5 0 0 0 1.307-.193" {...common} />
        <Path d="M21.532 16.5A4.5 4.5 0 0 0 17.5 10h-1.79A7.008 7.008 0 0 0 10 5.07" {...common} />
      </>
    ),
    search: (
      <>
        <Circle cx="11" cy="11" r="7" {...common} />
        <Line x1="21" x2="16.65" y1="21" y2="16.65" {...common} />
      </>
    ),
    link: (
      <>
        <Path d="M10 13a5 5 0 0 0 7.07 0l2.83-2.83a5 5 0 0 0-7.07-7.07L11.5 4.5" {...common} />
        <Path d="M14 11a5 5 0 0 0-7.07 0L4.1 13.83a5 5 0 0 0 7.07 7.07L12.5 19.5" {...common} />
      </>
    ),
    eye: (
      <>
        <Path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" {...common} />
        <Circle cx="12" cy="12" r="3" {...common} />
      </>
    ),
    'eye-off': (
      <>
        <Path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c6.5 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" {...common} />
        <Path d="M6.61 6.61A13.53 13.53 0 0 0 2 11s3.5 7 10 7a9.74 9.74 0 0 0 5.39-1.61" {...common} />
        <Path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" {...common} />
        <Line x1="2" x2="22" y1="2" y2="22" {...common} />
      </>
    ),
    copy: (
      <>
        <Rect x="9" y="9" width="13" height="13" rx="2" {...common} />
        <Path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" {...common} />
      </>
    ),
    'share-2': (
      <>
        <Circle cx="18" cy="5" r="3" {...common} />
        <Circle cx="6" cy="12" r="3" {...common} />
        <Circle cx="18" cy="19" r="3" {...common} />
        <Line x1="8.59" x2="15.42" y1="10.51" y2="6.49" {...common} />
        <Line x1="8.59" x2="15.42" y1="13.49" y2="17.51" {...common} />
      </>
    ),
  };

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {paths[name]}
    </Svg>
  );
}

export default Icon;
