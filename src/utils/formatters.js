/**
 * HashGuard Cryptographic & Formatting Utilities
 * Centralized localization and formatters for IST (Asia/Kolkata, UTC+05:30)
 */

export const IST_TIMEZONE = 'Asia/Kolkata';
export const IST_LOCALE = 'en-IN';
export const IST_OFFSET_LABEL = '+05:30';

const monthMap = { Sept: 'Sep' };
const cleanMonth = (m) => monthMap[m] || m;

export function getISTNowString() {
  const d = new Date();
  const parts = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).formatToParts(d);
  const get = (type) => (parts.find(p => p.type === type) || {}).value || '00';
  return `${get('year')}-${get('month')}-${get('day')} ${get('hour')}:${get('minute')}:${get('second')} IST`;
}

export function formatToIST(value) {
  if (!value) return '—';
  if (typeof value === 'string' && value.includes('IST')) return value;
  try {
    let cleanStr = String(value).trim();
    if (cleanStr.endsWith(' U')) cleanStr = cleanStr.slice(0, -2) + ' UTC';
    if (!cleanStr.includes('Z') && !cleanStr.includes('UTC') && !cleanStr.includes('+')) cleanStr += ' UTC';
    const d = new Date(cleanStr);
    if (isNaN(d.getTime())) return value;
    const parts = new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).formatToParts(d);
    const get = (type) => (parts.find(p => p.type === type) || {}).value || '00';
    return `${get('year')}-${get('month')}-${get('day')} ${get('hour')}:${get('minute')}:${get('second')} IST`;
  } catch {
    return value;
  }
}

/**
 * Safely parse any valid timestamp into a Date object without modifying source value.
 * Handles:
 * - ISO 8601 strings ending in Z or with offsets
 * - UTC strings: "2026-08-16 08:30:14 UTC" or "2026-08-16 08:30:14"
 * - Strings with annotations: "2026-09-27T02:35:10Z (RFC 3161 Certified)"
 * - Numeric epoch timestamps (both seconds and milliseconds)
 * - Date instances
 * - Returns { isAlreadyIST: true, formatted: str } if already formatted to prevent double conversion
 */
export function parseTimestamp(value) {
  if (value === null || value === undefined || value === '') return null;
  if (value instanceof Date) return isNaN(value.getTime()) ? null : value;

  if (typeof value === 'number') {
    if (isNaN(value)) return null;
    return new Date(value < 1e11 ? value * 1000 : value);
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed || trimmed === '—' || trimmed === 'null' || trimmed === 'undefined') return null;

    // Handle IST-formatted strings like "2026-09-27 22:14:30 IST"
    // Strip the IST suffix and parse as UTC-equivalent ISO
    if (trimmed.endsWith(' IST') || trimmed.includes('IST')) {
      const stripped = trimmed.replace(/\s*IST$/, '').trim();
      // It was stored as local IST so convert by subtracting IST offset (5h30m = 19800s)
      const d = new Date(stripped.replace(' ', 'T') + 'Z');
      if (!isNaN(d.getTime())) {
        // Subtract 5:30 to convert from stored-as-IST back to real UTC
        return new Date(d.getTime() - 19800000);
      }
    }

    if (/^\d+$/.test(trimmed)) {
      const num = parseInt(trimmed, 10);
      return new Date(num < 1e11 ? num * 1000 : num);
    }

    // Strip parenthetical notes like (RFC 3161 Certified)
    const cleaned = trimmed.replace(/\(.*?\)/g, '').trim();

    // HashGuard canonical format: 'YYYY-MM-DD HH:mm:ss' with optional UTC
    const match = cleaned.match(/^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2}:\d{2}(?:\.\d+)?)(?:\s*UTC)?$/i);
    if (match) {
      const iso = match[1] + 'T' + match[2] + 'Z';
      const d = new Date(iso);
      if (!isNaN(d.getTime())) return d;
    }

    const d = new Date(cleaned);
    if (!isNaN(d.getTime())) return d;
  }

  return null;
}

/**
 * Main timestamp format
 * Example: 27 Sep 2026, 19:14:32 IST
 */
export function formatISTTimestamp(value) {
  const parsed = parseTimestamp(value);
  if (!parsed) return '—';

  const parts = new Intl.DateTimeFormat(IST_LOCALE, {
    timeZone: IST_TIMEZONE,
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).formatToParts(parsed).reduce((acc, p) => ({ ...acc, [p.type]: p.value }), {});

  return `${parts.day} ${cleanMonth(parts.month)} ${parts.year}, ${parts.hour}:${parts.minute}:${parts.second} IST`;
}

/**
 * Date-only format in IST
 * Example: 27 Sep 2026
 */
export function formatISTDate(value) {
  const parsed = parseTimestamp(value);
  if (!parsed) return '—';

  const parts = new Intl.DateTimeFormat(IST_LOCALE, {
    timeZone: IST_TIMEZONE,
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).formatToParts(parsed).reduce((acc, p) => ({ ...acc, [p.type]: p.value }), {});

  return `${parts.day} ${cleanMonth(parts.month)} ${parts.year}`;
}

/**
 * Compact dashboard time format in IST
 * Example: 19:14:32 IST (or 19:14 IST if includeSeconds = false)
 */
export function formatISTTime(value, includeSeconds = true) {
  const parsed = parseTimestamp(value);
  if (!parsed) return '—';

  const parts = new Intl.DateTimeFormat(IST_LOCALE, {
    timeZone: IST_TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
    ...(includeSeconds ? { second: '2-digit' } : {}),
    hour12: false
  }).formatToParts(parsed).reduce((acc, p) => ({ ...acc, [p.type]: p.value }), {});

  return `${parts.hour}:${parts.minute}${includeSeconds ? `:${parts.second}` : ''} IST`;
}

/**
 * Custody / transfer event timestamp in IST
 * Example: 27 Sep 2026 • 19:14 IST
 */
export function formatISTCustodyEvent(value) {
  const parsed = parseTimestamp(value);
  if (!parsed) return '—';

  const parts = new Intl.DateTimeFormat(IST_LOCALE, {
    timeZone: IST_TIMEZONE,
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).formatToParts(parsed).reduce((acc, p) => ({ ...acc, [p.type]: p.value }), {});

  return `${parts.day} ${cleanMonth(parts.month)} ${parts.year} • ${parts.hour}:${parts.minute} IST`;
}

/**
 * Relative timestamp calculator
 * Example: "Just now", "2m ago" / "2 min ago", "3h ago" / "3 hours ago"
 * Fallback to formatISTDate if > 30 days
 */
export function formatRelativeTime(value, compact = false) {
  const parsed = parseTimestamp(value);
  if (!parsed || typeof parsed.getTime !== 'function') return '—';

  const now = Date.now();
  const diffMs = now - parsed.getTime();

  // If clock skew or future timestamp, fallback to full timestamp
  if (diffMs < 0) {
    if (diffMs > -10000) return 'Just now';
    return formatISTTimestamp(parsed);
  }

  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 45) return 'Just now';
  if (diffMin < 60) return compact ? `${diffMin}m ago` : `${diffMin} ${diffMin === 1 ? 'min' : 'mins'} ago`;
  if (diffHr < 24) return compact ? `${diffHr}h ago` : `${diffHr} ${diffHr === 1 ? 'hour' : 'hours'} ago`;
  if (diffDay < 30) return compact ? `${diffDay}d ago` : `${diffDay} ${diffDay === 1 ? 'day' : 'days'} ago`;

  return formatISTDate(parsed);
}

/**
 * Canonical formatDateTime helper (forwards to formatISTTimestamp)
 */
export function formatFileSize(bytes) {
  if (bytes === null || bytes === undefined || isNaN(bytes)) return '—';
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(2)} KB`;
  }
  if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

export function truncateHash(hash, startLen = 8, endLen = 8) {
  if (!hash) return '';
  if (hash.length <= startLen + endLen) return hash;
  return `${hash.slice(0, startLen)}...${hash.slice(-endLen)}`;
}

export function getStatusBadgeVariant(status) {
  const s = (status || '').toUpperCase();
  switch (s) {
    case 'VERIFIED':
    case 'VALID':
    case 'COMPLETED':
    case 'PASS':
      return {
        bg: 'bg-ce-success/10 text-ce-success border-ce-success/30',
        dot: 'bg-ce-success',
        iconText: 'VERIFIED',
        label: 'VERIFIED'
      };
    case 'PENDING':
    case 'TRANSFERRING':
    case 'REQUESTED':
    case 'IN_PROGRESS':
    case 'WARNING':
      return {
        bg: 'bg-ce-warning/10 text-ce-warning border-ce-warning/30',
        dot: 'bg-ce-warning animate-pulse',
        iconText: 'PENDING',
        label: 'PENDING'
      };
    case 'COMPROMISED':
    case 'FAILED':
    case 'INVALID':
    case 'TAMPER DETECTED':
      return {
        bg: 'bg-ce-danger/10 text-ce-danger border-ce-danger/30 shadow-[0_0_8px_rgba(239,68,68,0.2)]',
        dot: 'bg-ce-danger',
        iconText: 'COMPROMISED',
        label: 'COMPROMISED'
      };
    case 'ARCHIVED':
      return {
        bg: 'bg-ce-surface-subtle text-ce-text-muted border-ce-border',
        dot: 'bg-ce-text-muted',
        iconText: 'ARCHIVED',
        label: 'ARCHIVED'
      };
    case 'LEGAL HOLD':
    case 'LEGAL_HOLD':
    case 'ON HOLD':
    case 'SUSPENDED':
      return {
        bg: 'bg-amber-500/15 text-amber-400 border-amber-500/40 shadow-[0_0_8px_rgba(245,158,11,0.2)] font-bold',
        dot: 'bg-amber-400 animate-pulse',
        iconText: 'LEGAL HOLD',
        label: status === 'SUSPENDED' ? 'SUSPENDED' : 'LEGAL HOLD'
      };
    default:
      return {
        bg: 'bg-ce-surface-subtle text-ce-text-secondary border-ce-border',
        dot: 'bg-ce-text-secondary',
        iconText: status,
        label: status
      };
  }
}

export function getEventColor(event) {
  switch (event) {
    case 'COLLECT':
      return 'text-ce-brand bg-ce-brand/10 border-ce-brand/30';
    case 'SEAL':
      return 'text-ce-success bg-ce-success/10 border-ce-success/30';
    case 'TRANSFER':
    case 'RECEIVE':
      return 'text-ce-info bg-ce-info/10 border-ce-info/30';
    case 'ANALYZE':
    case 'DERIVE':
      return 'text-ce-brand bg-ce-brand/10 border-ce-brand/30';
    case 'ARCHIVE':
    case 'EVIDENCE_ARCHIVED':
      return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30';
    case 'LEGAL_HOLD_APPLIED':
      return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    case 'LEGAL_HOLD_RELEASED':
      return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    case 'RETENTION_POLICY_CREATED':
    case 'RETENTION_POLICY_UPDATED':
      return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
    case 'RETENTION_STARTED':
    case 'RETENTION_EXPIRED':
      return 'text-purple-400 bg-purple-500/10 border-purple-500/30';
    case 'EVIDENCE_DELETION_APPROVED':
      return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
    default:
      return 'text-ce-text-secondary bg-ce-surface-subtle border-ce-border';
  }
}
