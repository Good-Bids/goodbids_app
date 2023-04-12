import Script from "next/script";

export const GoogleAnalyticsScript = () => {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=id=G-CXJ4181QHF`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
             window.dataLayer = window.dataLayer || [];
             function gtag(){dataLayer.push(arguments);}
             gtag('js', new Date());
             gtag('config', 'id=G-CXJ4181QHF', {
               page_path: window.location.pathname,
             });
          `}
      </Script>
    </>
  );
};
