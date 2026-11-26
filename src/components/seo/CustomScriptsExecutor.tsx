"use client";

import { useEffect } from "react";

interface CustomScriptsExecutorProps {
  customHeadCode?: string;
  customBodyCode?: string;
}

/**
 * Injects and executes custom scripts and tags in the browser.
 * Browsers do not execute <script> tags inserted via innerHTML/dangerouslySetInnerHTML.
 * This component uses document.createElement to ensure external & inline scripts execute immediately.
 */
export default function CustomScriptsExecutor({
  customHeadCode,
  customBodyCode
}: CustomScriptsExecutorProps) {
  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") {
      return;
    }

    // Clean up previously injected elements
    const existing = document.querySelectorAll("[data-mc-injected]");
    existing.forEach((el) => el.remove());

    const injectContent = (htmlString: string, target: HTMLElement, location: "head" | "body") => {
      const trimmed = (htmlString || "").trim();
      if (!trimmed) return;

      // Check if user entered raw JavaScript without <script> wrapper
      if (!trimmed.includes("<") && !trimmed.includes(">") && (trimmed.includes(";") || trimmed.includes("(") || trimmed.includes("="))) {
        try {
          const s = document.createElement("script");
          s.setAttribute("data-mc-injected", location);
          s.textContent = trimmed;
          target.appendChild(s);
        } catch (err) {
          console.error(`[Maison Tourny SEO] Failed to execute raw ${location} script:`, err);
        }
        return;
      }

      // Parse HTML string using DOMParser
      try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(trimmed, "text/html");

        // Process elements from both head and body in parsed document
        const elementsToProcess: Element[] = [];
        doc.head.childNodes.forEach((n) => {
          if (n.nodeType === Node.ELEMENT_NODE) elementsToProcess.push(n as Element);
        });
        doc.body.childNodes.forEach((n) => {
          if (n.nodeType === Node.ELEMENT_NODE) elementsToProcess.push(n as Element);
        });

        elementsToProcess.forEach((el) => {
          const tagName = el.tagName.toLowerCase();

          if (tagName === "script") {
            const script = document.createElement("script");
            script.setAttribute("data-mc-injected", location);

            // Copy all attributes (src, async, defer, type, id, crossorigin, etc.)
            Array.from(el.attributes).forEach((attr) => {
              script.setAttribute(attr.name, attr.value);
            });

            // Copy inline content
            if (el.textContent) {
              script.textContent = el.textContent;
            }

            target.appendChild(script);
          } else if (tagName === "style" || tagName === "link" || tagName === "meta") {
            const cloned = el.cloneNode(true) as HTMLElement;
            cloned.setAttribute("data-mc-injected", location);
            document.head.appendChild(cloned);
          } else {
            const cloned = el.cloneNode(true) as HTMLElement;
            cloned.setAttribute("data-mc-injected", location);
            target.appendChild(cloned);
          }
        });
      } catch (err) {
        console.error(`[Maison Tourny SEO] Error parsing custom ${location} code:`, err);
      }
    };

    if (customHeadCode) {
      injectContent(customHeadCode, document.head, "head");
    }

    if (customBodyCode) {
      injectContent(customBodyCode, document.body, "body");
    }

    return () => {
      const toRemove = document.querySelectorAll("[data-mc-injected]");
      toRemove.forEach((el) => el.remove());
    };
  }, [customHeadCode, customBodyCode]);

  return null;
}
