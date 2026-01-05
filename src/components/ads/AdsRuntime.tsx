'use client'

import { useEffect, useMemo } from 'react'
import AdConsentBanner, { useAdsConsent } from '@/components/ads/AdConsentBanner'
import AdSenseScript from '@/components/ads/AdSenseScript'
import AdBanner from '@/components/ads/AdBanner'
import { getAdsRuntimeConfig } from '@/lib/ads/config'

function safePostJson(url: string, body: unknown) {
  try {
    void fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      keepalive: true,
      body: JSON.stringify(body),
    })
  } catch {
    // ignore
  }
}

export default function AdsRuntime() {
  const cfg = useMemo(() => getAdsRuntimeConfig(), [])
  const { consent } = useAdsConsent()

  const canLoadAds =
    cfg.mode === 'magicwrx-ads' &&
    !!cfg.adsenseClient &&
    (!cfg.requireConsent || consent === 'granted')

  useEffect(() => {
    if (cfg.mode !== 'magicwrx-ads') return

    // Optional: lightweight attribution so MagicWRX can compute revenue-share payouts.
    // Endpoint should be implemented on MagicWRX when ready; failures are ignored.
    const endpoint = `${cfg.magicWrxUrl.replace(/\/$/, '')}/api/ads/context`
    safePostJson(endpoint, {
      ts: Date.now(),
      siteId: cfg.magicWrxSiteId,
      customerId: cfg.magicWrxCustomerId,
      mode: cfg.mode,
      path: globalThis.location?.pathname,
      referrer: document.referrer || undefined,
      consent,
    })
  }, [cfg.magicWrxCustomerId, cfg.magicWrxSiteId, cfg.magicWrxUrl, cfg.mode, consent])

  return (
    <>
      {cfg.mode === 'magicwrx-ads' && cfg.requireConsent ? <AdConsentBanner /> : null}
      {canLoadAds ? <AdSenseScript client={cfg.adsenseClient!} /> : null}
      {canLoadAds ? <AdBanner client={cfg.adsenseClient!} slot={cfg.adsenseSlot} /> : null}
    </>
  )
}
