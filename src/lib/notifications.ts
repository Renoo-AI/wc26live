'use client';

let permissionRequested = false;

export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.warn('[Wc26Live] Browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    permissionRequested = true;
    return true;
  }

  if (Notification.permission === 'denied') {
    return false;
  }

  // 'default' — ask
  const result = await Notification.requestPermission();
  permissionRequested = true;
  return result === 'granted';
}

export function hasNotificationPermission(): boolean {
  return 'Notification' in window && Notification.permission === 'granted';
}

export function sendNotification(title: string, options?: NotificationOptions) {
  if (!hasNotificationPermission()) return;
  try {
    new Notification(title, {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      ...options,
    });
  } catch {
    // Service worker registration might be needed in some contexts
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((reg) => {
        reg.showNotification(title, {
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          ...options,
        });
      }).catch(() => {});
    }
  }
}

export function notifyMatchLive(teamA: string, teamB: string) {
  sendNotification('🔴 Match is LIVE!', {
    body: `${teamA} vs ${teamB} has kicked off on Wc26Live`,
    tag: 'match-live',
    requireInteraction: true,
    vibrate: [200, 100, 200],
  });
}

export function notifyMatchFinished(teamA: string, teamB: string, scoreA: number, scoreB: number) {
  sendNotification('🏁 Full Time!', {
    body: `${teamA} ${scoreA} – ${scoreB} ${teamB}`,
    tag: 'match-finished',
    vibrate: [100, 50, 100],
  });
}

export function notifyGoal(team: string, scoreA: number, scoreB: number) {
  sendNotification('⚽ GOAL!', {
    body: `${team} scores! (${scoreA}–${scoreB})`,
    tag: 'goal',
    vibrate: [300],
  });
}