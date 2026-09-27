"use client";

import { Amplify } from "aws-amplify";

let configured = false;

export default function AmplifyClientProvider({
  outputs,
  children,
}: {
  outputs: unknown;
  children: React.ReactNode;
}) {
  if (outputs && !configured) {
    Amplify.configure(outputs as Parameters<typeof Amplify.configure>[0], {
      ssr: true,
    });
    configured = true;
  }

  return <>{children}</>;
}
