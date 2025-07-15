import React from 'react';
import { Banner } from './Banner';
import { getActiveEventsForBanner } from '@/app/actions/events';

const BANNER_EVENT_COUNT = 3;

export async function BannerWrapper() {
  const activeEvents = await getActiveEventsForBanner(BANNER_EVENT_COUNT);
  return <Banner events={activeEvents} />;
}