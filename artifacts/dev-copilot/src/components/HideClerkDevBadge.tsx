import { useEffect } from "react";

/**
 * Removes Clerk's "Development mode" badge on development instances.
 *
 * clerk-js (the actual UI) is loaded from Clerk's CDN at runtime, so the
 * badge's class names are unstable across versions and CSS selectors are
 * unreliable. This finds it by its text instead, which is version-proof.
 *
 * "for now" — the real removal is switching to a production Clerk instance.
 */
export function HideClerkDevBadge() {
  useEffect(() => {
    const hide = () => {
      document.querySelectorAll<HTMLElement>("body *").forEach((el) => {
        if (el.childElementCount !== 0) return;
        if (el.textContent?.trim() !== "Development mode") return;

        // Climb to the pill wrapper (max 2 levels) that only wraps this text.
        let target: HTMLElement = el;
        for (let i = 0; i < 2; i++) {
          const p = target.parentElement;
          if (p && p.textContent?.trim() === "Development mode") target = p;
          else break;
        }
        if (target.dataset.devBadgeHidden === "1") return;
        target.dataset.devBadgeHidden = "1";
        target.style.setProperty("display", "none", "important");
      });
    };

    hide();
    // Only watch childList/subtree (not attributes) so our own style edits
    // don't retrigger the observer.
    const obs = new MutationObserver(hide);
    obs.observe(document.body, { childList: true, subtree: true });
    const iv = window.setInterval(hide, 500);
    const stop = window.setTimeout(() => window.clearInterval(iv), 10000);
    return () => {
      obs.disconnect();
      window.clearInterval(iv);
      window.clearTimeout(stop);
    };
  }, []);

  return null;
}
