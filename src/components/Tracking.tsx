import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { doc, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { SiteSettings } from '../types';

const extractContent = (input: string) => {
  if (!input) return '';
  const match = input.match(/content=["']([^"']+)["']/i);
  return match ? match[1] : input.trim();
};

const extractGaId = (input: string) => {
  if (!input) return '';
  const match = input.match(/G-[A-Z0-9]+/i);
  return match ? match[0] : input.trim();
};

const extractGtmId = (input: string) => {
  if (!input) return '';
  const match = input.match(/GTM-[A-Z0-9]+/i);
  return match ? match[0] : input.trim();
};

export default function Tracking() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'settings', 'general'), 
      (docSnap) => {
        if (docSnap.exists()) {
          setSettings(docSnap.data() as SiteSettings);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'settings/general');
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!settings) return;

    const gaId = extractGaId(settings.googleAnalyticsId || '');
    if (gaId) {
      if (!document.getElementById('ga-script')) {
        const script1 = document.createElement('script');
        script1.id = 'ga-script';
        script1.async = true;
        script1.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
        document.head.appendChild(script1);

        const script2 = document.createElement('script');
        script2.id = 'ga-inline';
        script2.innerHTML = `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `;
        document.head.appendChild(script2);
      }
    }

    const gtmId = extractGtmId(settings.googleTagManagerId || '');
    if (gtmId) {
      if (!document.getElementById('gtm-script')) {
        const script = document.createElement('script');
        script.id = 'gtm-script';
        script.innerHTML = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');`;
        document.head.appendChild(script);
      }
      
      if (!document.getElementById('gtm-noscript')) {
        const noscript = document.createElement('noscript');
        noscript.id = 'gtm-noscript';
        noscript.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}"
height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
        document.body.prepend(noscript);
      }
    }
  }, [settings]);

  if (!settings) return null;

  const verification = extractContent(settings.googleSiteVerification || '');

  return (
    <Helmet>
      {verification && (
        <meta name="google-site-verification" content={verification} />
      )}
    </Helmet>
  );
}

