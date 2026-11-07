/* WEATHER CHECK — private flying-weather app for Wayne.
   happydrones.co.uk/weather-check (add ?demo=1 for example data)
   Not linked anywhere, not in the sitemap, and marked noindex.
   The app: components/weather/WeatherApp.jsx · logic: lib/wxClient.js
   Server side (Met Office key, passcode): functions/api/wx/ + lib/wxServer.js */
import WeatherApp from "@/components/weather/WeatherApp";

export const metadata = {
  title: "Weather check",
  description: "Private flying-weather check for Happy Drones.",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  manifest: "/weather-check.webmanifest",
  appleWebApp: { capable: true, title: "Weather check", statusBarStyle: "black-translucent" },
};


export default function WeatherCheckPage() {
  return <WeatherApp />;
}
