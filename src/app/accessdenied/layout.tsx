import { TRPCReactProvider } from "~/trpc/react";
import { cookies } from "next/headers";
import { getServerAuthSession } from "~/server/auth";

export default async function RootLayout(props: { children: React.ReactNode }) {
  const session = await getServerAuthSession();
  return (
    <html lang="es">
      <body>
        <div className="mb-10 flex justify-center">
          <TRPCReactProvider cookies={cookies().toString()}>
            {props.children}
          </TRPCReactProvider>
        </div>
        <div></div>
      </body>
    </html>
  );
}
