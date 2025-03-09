"use client";
import "@assets/global.css";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { ContextProvider } from '@provider/Context.provider';
import { SessionProvider } from '@provider/Session.provider';
import { GoogleOAuthProvider } from "@react-oauth/google";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENTID}>
          <SessionProvider>
            <ContextProvider>
              { children }
            </ContextProvider>
          </SessionProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  )
}
