import { data } from "./Data";

function Meta({
  title = "Ikatan Mahasiswa Kendal Yogyakarta",
  excerpt = "Website resmi Ikatan Mahasiswa Kendal Yogyakarta",
  cover = "",
  slug = ""
}: {
  title?: string,
  excerpt?: string,
  cover?: string,
  slug?: string;
}) {
  return (
    <>
      <title>{title}</title>
      <link rel="shortcut icon" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="72x72" href="/images/icons/icon-72x72.png" />
      <link rel="icon" type="image/png" sizes="96x96" href="/images/icons/icon-96x96.png" />
      <link rel="icon" type="image/png" sizes="128x128" href="/images/icons/icon-128x128.png" />
      <link rel="icon" type="image/png" sizes="144x144" href="/images/icons/icon-144x144.png" />
      <link rel="icon" type="image/png" sizes="152x152" href="/images/icons/icon-152x152.png" />
      <link rel="icon" type="image/png" sizes="192x192"  href="/images/icons/icon-192x192.png" />
      <link rel="icon" type="image/png" sizes="384x384" href="/images/icons/icon-384x384.png" />
      <link rel="icon" type="image/png" sizes="512x512" href="/images/icons/icon-512x512.png" />
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover" />
      <meta name="description" content={excerpt || data.desc} />
      <meta name="theme-color" content={data.theme} />

      <meta property="og:type" content="website" />
      <meta property="og:title" content={title || data.name} />
      <meta property="og:site_name" content={data.name} />
      <meta property="og:description" content={excerpt || data.desc} />
      <meta property="og:url" content={`${data.link}/${slug}`} />
      <meta property="og:image" content={cover || data.icon} />

      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title || data.name} />
      <meta name="twitter:descripton" content={excerpt || data.desc} />
      <meta name="twitter:url" content={`${data.link}/${slug}`} />
      <meta name="twitter:image" content={cover || data.icon} />

      <link itemProp="thumbnailUrl" href={cover || data.icon} />
      <link rel="manifest" href="/manifest.json" />
      <meta name="keywords" content={`IMKEY Jogja, IMKEY, Kendal, IMAKEN, Kendal, Mahasiswa Kendal, Mahasiswa Jogja, Mahasiswa, Jogja, ${title}`} />
      <link rel="author" href="Nizar" />
      <link rel="canonical" href={`${data.link}/${slug}`} />

      <link rel="apple-touch-icon" sizes="72x72" href="/images/icons/icon-72x72.png" />
      <link rel="apple-touch-icon" sizes="96x96" href="/images/icons/icon-96x96.png" />
      <link rel="apple-touch-icon" sizes="128x128" href="/images/icons/icon-128x128.png" />
      <link rel="apple-touch-icon" sizes="144x144" href="/images/icons/icon-144x144.png" />
      <link rel="apple-touch-icon" sizes="152x152" href="/images/icons/icon-152x152.png" />
      <link rel="apple-touch-icon" sizes="192x192" href="/images/icons/icon-192x192.png" />
      <link rel="apple-touch-icon" sizes="384x384" href="/images/icons/icon-384x384.png" />
      <link rel="apple-touch-icon" sizes="512x512" href="/images/icons/icon-512x512.png" />
      <link href="/images/splashscreens/iphone5_splash.png" media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)" rel="apple-touch-startup-image" />
      <link href="/images/splashscreens/iphone6_splash.png" media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)" rel="apple-touch-startup-image" />
      <link href="/images/splashscreens/iphoneplus_splash.png" media="(device-width: 621px) and (device-height: 1104px) and (-webkit-device-pixel-ratio: 3)" rel="apple-touch-startup-image" />
      <link href="/images/splashscreens/iphonex_splash.png" media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)" rel="apple-touch-startup-image" />
      <link href="/images/splashscreens/iphonexr_splash.png" media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)" rel="apple-touch-startup-image" />
      <link href="/images/splashscreens/iphonexsmax_splash.png" media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)" rel="apple-touch-startup-image" />
      <link href="/images/splashscreens/ipad_splash.png" media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2)" rel="apple-touch-startup-image" />
      <link href="/images/splashscreens/ipadpro1_splash.png" media="(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2)" rel="apple-touch-startup-image" />
      <link href="/images/splashscreens/ipadpro3_splash.png" media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2)" rel="apple-touch-startup-image" />
      <link href="/images/splashscreens/ipadpro2_splash.png" media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)" rel="apple-touch-startup-image" />

      <meta name="application-name" content={data.name} />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar" content={data.theme} />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content={title || data.name} />
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="msapplication-TileImage" content="/images/icons/icon-144x144.png" />
      <meta name="msapplication-config" content="/browserconfig.xml" />
      <meta name="msapplication-TileColor" content={data.theme} />
      <meta name="msapplication-tap-highlight" content="no" />
    </>
  )
}

export default Meta;
