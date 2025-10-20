"use client"

import { Suspense } from "react";
import Loading from "./loading";

export default function AssetsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<Loading />} >
      {children}
    </Suspense>
  );
}
