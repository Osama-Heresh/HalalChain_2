import { PlatformView, PlatformTab } from '../types';

export interface RouteInfo {
  platformView: PlatformView;
  platformTab: PlatformTab;
  subTab: string;
  path: string;
}

/**
 * Parses a browser pathname into standard platform and module sub-tab routing metadata.
 */
export function parsePath(pathname: string): RouteInfo {
  const cleanPath = pathname.split('?')[0].split('#')[0];
  const parts = cleanPath.split('/').filter(Boolean);

  if (parts.length === 0) {
    return {
      platformView: 'public_website',
      platformTab: 'public',
      subTab: 'home',
      path: '/public/home'
    };
  }

  const prefix = parts[0];
  const sub = parts[1] || '';

  if (prefix === 'public') {
    return {
      platformView: 'public_website',
      platformTab: 'public',
      subTab: sub || 'home',
      path: `/public/${sub || 'home'}`
    };
  }

  if (prefix === 'customer') {
    return {
      platformView: 'customer_portal',
      platformTab: 'customer',
      subTab: sub || 'overview',
      path: `/customer/${sub || 'overview'}`
    };
  }

  if (prefix === 'ops') {
    return {
      platformView: 'ops_platform',
      platformTab: 'ops',
      subTab: sub || 'my_work',
      path: `/ops/${sub || 'my_work'}`
    };
  }

  if (prefix === 'exec') {
    return {
      platformView: 'exec_platform',
      platformTab: 'exec',
      subTab: sub || 'bi',
      path: `/exec/${sub || 'bi'}`
    };
  }

  // Direct route aliases or fallback
  if (cleanPath === '/registry' || cleanPath === '/verify') {
    const tabName = cleanPath.replace('/', '');
    return {
      platformView: 'public_website',
      platformTab: 'public',
      subTab: tabName,
      path: `/public/${tabName}`
    };
  }

  return {
    platformView: 'public_website',
    platformTab: 'public',
    subTab: 'home',
    path: '/public/home'
  };
}

/**
 * Triggers browser history update and dispatches custom event for reactive SPA navigation.
 */
export function navigateTo(path: string) {
  if (typeof window === 'undefined') return;
  if (window.location.pathname !== path) {
    window.history.pushState({}, '', path);
  }
  window.dispatchEvent(new CustomEvent('app-navigation', { detail: { path } }));
}
