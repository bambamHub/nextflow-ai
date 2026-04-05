import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className="
            h-screen w-screen 
            overflow-hidden 
            antialiased 
            bg-transparent
            text-white
          "
        >
          {/* APP CONTAINER */}
          <div className="h-full w-full flex flex-col">{children}</div>
        </body>
      </html>
    </ClerkProvider>
  );
}
