import { BrandWordmark } from "@/components/BrandWordmark";

import { GuideViewFooter } from "./GuideViewFooter";

type GuideViewShellProps = {
  children: React.ReactNode;
};

export function GuideViewShell({ children }: GuideViewShellProps) {
  return (
    <div className="guide-view-shell flex min-h-screen flex-col bg-background">
      <header className="guide-view-content-header border-b border-outline-variant/40 py-5 sm:py-6 dark:border-outline-variant/20">
        <div className="mx-auto max-w-[960px] px-6">
          <BrandWordmark className="h-8 w-auto sm:h-9" />
        </div>
      </header>

      <div className="flex-1">{children}</div>

      <GuideViewFooter />
    </div>
  );
}
