import { useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { SiteSettings } from '../types';

export default function Analytics() {
  useEffect(() => {
    const initAnalytics = async () => {
      try {
        const snap = await getDoc(doc(db, 'settings', 'general'));
        if (snap.exists()) {
          const data = snap.data() as SiteSettings;
          
          if (data.googleSiteVerification) {
            let meta = document.querySelector('meta[name="google-site-verification"]');
            if (!meta) {
              meta = document.createElement('meta');
              meta.setAttribute('name', 'google-site-verification');
              document.head.appendChild(meta);
            }
            meta.setAttribute('content', data.googleSiteVerification);
          }

          if (data.googleAnalyticsId) {
            const gaId = data.googleAnalyticsId;
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

          if (data.googleTagManagerId) {
            const gtmId = data.googleTagManagerId;
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
        }
      } catch (error) {
        console.error("Error loading analytics settings", error);
      }
    };
    initAnalytics();
  }, []);

  return null;
}
