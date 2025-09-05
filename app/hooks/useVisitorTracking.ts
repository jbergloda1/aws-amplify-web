"use client";

import { useEffect, useRef } from 'react';
import { SocialService } from '@/app/services/socialService';

interface VisitorData {
  sessionId: string;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  location?: string;
  country?: string;
  city?: string;
  device?: string;
  browser?: string;
  os?: string;
  referrer?: string;
  page: string;
  timeOnPage?: number;
}

export function useVisitorTracking(userId?: string) {
  const sessionIdRef = useRef<string>();
  const startTimeRef = useRef<number>();
  const pageRef = useRef<string>();

  useEffect(() => {
    // Generate or get session ID
    if (!sessionIdRef.current) {
      sessionIdRef.current = generateSessionId();
    }

    // Track page start time
    startTimeRef.current = Date.now();
    pageRef.current = window.location.pathname;

    // Get visitor information
    const visitorData: VisitorData = {
      sessionId: sessionIdRef.current,
      userId,
      userAgent: navigator.userAgent,
      referrer: document.referrer,
      page: window.location.pathname,
      device: getDeviceType(),
      browser: getBrowser(),
      os: getOS(),
    };

    // Track visitor on page load
    trackVisitor(visitorData);

    // Track visitor on page unload
    const handleBeforeUnload = () => {
      const timeOnPage = startTimeRef.current ? Date.now() - startTimeRef.current : 0;
      trackVisitor({
        ...visitorData,
        timeOnPage: Math.floor(timeOnPage / 1000), // Convert to seconds
      });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [userId]);

  const trackVisitor = async (data: VisitorData) => {
    try {
      const result = await SocialService.trackVisitor(data);
      console.log('Visitor tracked successfully:', result);
    } catch (error) {
      console.error('Error tracking visitor:', error);
      // Don't throw the error to prevent app crashes
    }
  };

  return {
    sessionId: sessionIdRef.current,
    trackPageView: (page: string) => {
      if (pageRef.current !== page) {
        pageRef.current = page;
        trackVisitor({
          sessionId: sessionIdRef.current!,
          userId,
          userAgent: navigator.userAgent,
          referrer: document.referrer,
          page,
          device: getDeviceType(),
          browser: getBrowser(),
          os: getOS(),
        });
      }
    },
  };
}

function generateSessionId(): string {
  return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function getDeviceType(): string {
  const userAgent = navigator.userAgent;
  if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
    return 'Tablet';
  }
  if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(userAgent)) {
    return 'Mobile';
  }
  return 'Desktop';
}

function getBrowser(): string {
  const userAgent = navigator.userAgent;
  if (userAgent.indexOf('Chrome') > -1) return 'Chrome';
  if (userAgent.indexOf('Safari') > -1) return 'Safari';
  if (userAgent.indexOf('Firefox') > -1) return 'Firefox';
  if (userAgent.indexOf('Edge') > -1) return 'Edge';
  if (userAgent.indexOf('Opera') > -1) return 'Opera';
  return 'Unknown';
}

function getOS(): string {
  const userAgent = navigator.userAgent;
  if (userAgent.indexOf('Windows') > -1) return 'Windows';
  if (userAgent.indexOf('Mac') > -1) return 'macOS';
  if (userAgent.indexOf('Linux') > -1) return 'Linux';
  if (userAgent.indexOf('Android') > -1) return 'Android';
  if (userAgent.indexOf('iOS') > -1) return 'iOS';
  return 'Unknown';
}
