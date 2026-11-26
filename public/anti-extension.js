/**
 * Anti-Browser-Extension DOM & Hydration Shield for Maison Calvé
 *
 * Prevents third-party browser extensions (e.g. Urban VPN, Bitdefender Anti-tracker, Grammarly, ColorZilla)
 * from modifying DOM attributes, hijacking critical SEO scripts (Google Tag Manager, JSON-LD),
 * or injecting unwanted attributes prior to React hydration.
 *
 * Runs synchronously in <head> before React or page scripts execute.
 */
(function () {
  if (typeof window === "undefined") return;

  var EXTENSION_ATTRS = [
    "bis_skin_checked",
    "bis_register",
    "bis_use",
    "data-gramm",
    "cz-shortcut-listen",
    "fdprocessedid",
    "data-dynamic-id",
    "data-config"
  ];

  var PROTECTED_SCRIPT_IDS = [
    "google-tag-manager-init",
    "google-gtag-init",
    "google-secondary-analytics-init",
    "anti-extension-shield"
  ];

  function isProtectedScript(el) {
    if (!el || el.tagName !== "SCRIPT") return false;
    if (el.id && PROTECTED_SCRIPT_IDS.indexOf(el.id) !== -1) return true;
    if (el.getAttribute("type") === "application/ld+json") return true;
    return false;
  }

  function cleanElement(el) {
    if (!el || el.nodeType !== 1) return;
    for (var i = 0; i < EXTENSION_ATTRS.length; i++) {
      if (el.hasAttribute(EXTENSION_ATTRS[i])) {
        el.removeAttribute(EXTENSION_ATTRS[i]);
      }
    }
  }

  function cleanTree(node) {
    if (!node || node.nodeType !== 1) return;
    cleanElement(node);
    var children = node.children;
    if (children) {
      for (var i = 0; i < children.length; i++) {
        cleanTree(children[i]);
      }
    }
  }

  // 1. Intercept Element.prototype.setAttribute to shield critical SEO scripts & block extension attributes
  try {
    var origSetAttribute = Element.prototype.setAttribute;
    Element.prototype.setAttribute = function (name, val) {
      // Block known intrusive extension attributes
      if (EXTENSION_ATTRS.indexOf(name) !== -1) {
        return;
      }

      // Block extensions (like Urban VPN) from hijacking inline SEO scripts by setting extension src
      if (name === "src" && typeof val === "string" && (val.indexOf("chrome-extension://") !== -1 || val.indexOf("moz-extension://") !== -1)) {
        if (isProtectedScript(this)) {
          return;
        }
      }

      // Block extensions from converting application/ld+json to text/javascript
      if (name === "type" && isProtectedScript(this) && this.getAttribute("type") === "application/ld+json") {
        return;
      }

      return origSetAttribute.apply(this, arguments);
    };

    var origRemoveAttribute = Element.prototype.removeAttribute;
    Element.prototype.removeAttribute = function (name) {
      // Prevent extensions from removing IDs on protected Google Tag scripts
      if (name === "id" && isProtectedScript(this)) {
        return;
      }
      return origRemoveAttribute.apply(this, arguments);
    };
  } catch (e) {}

  // 2. Real-time pre-hydration MutationObserver to immediately sanitize extension attributes from the DOM
  if (typeof MutationObserver !== "undefined") {
    var observer = new MutationObserver(function (mutations) {
      for (var i = 0; i < mutations.length; i++) {
        var m = mutations[i];
        if (m.type === "attributes") {
          if (EXTENSION_ATTRS.indexOf(m.attributeName) !== -1) {
            m.target.removeAttribute(m.attributeName);
          }
        } else if (m.type === "childList") {
          for (var j = 0; j < m.addedNodes.length; j++) {
            cleanTree(m.addedNodes[j]);
          }
        }
      }
    });

    try {
      if (document.documentElement) {
        observer.observe(document.documentElement, {
          attributes: true,
          subtree: true,
          childList: true,
          attributeFilter: EXTENSION_ATTRS
        });
      }
    } catch (e) {}

    // Clean DOM once fully parsed
    if (typeof document !== "undefined") {
      document.addEventListener("DOMContentLoaded", function () {
        cleanTree(document.documentElement);
      });
    }
  }

  // 3. Intercept console.error to prevent browser-extension attribute/script hijacking from triggering Next.js Dev Overlay
  try {
    var origConsoleError = console.error;
    console.error = function () {
      var isExtensionMismatch = false;
      for (var i = 0; i < arguments.length; i++) {
        var arg = arguments[i];
        if (typeof arg === "string") {
          var lower = arg.toLowerCase();
          if (
            lower.indexOf("chrome-extension://") !== -1 ||
            lower.indexOf("moz-extension://") !== -1 ||
            lower.indexOf("safari-extension://") !== -1 ||
            lower.indexOf("eppiocemhmnlbhjplcgkofciiegomcon") !== -1 ||
            lower.indexOf("executors/200.js") !== -1 ||
            lower.indexOf("executors/101.js") !== -1 ||
            lower.indexOf("bis_skin_checked") !== -1 ||
            lower.indexOf("bis_register") !== -1 ||
            lower.indexOf("data-gramm") !== -1 ||
            lower.indexOf("cz-shortcut-listen") !== -1 ||
            (lower.indexOf("hydration-mismatch") !== -1 && (
              lower.indexOf("chrome-extension") !== -1 ||
              lower.indexOf("extension") !== -1 ||
              lower.indexOf("google-tag-manager-init") !== -1 ||
              lower.indexOf("application/ld+json") !== -1
            ))
          ) {
            isExtensionMismatch = true;
            break;
          }
        } else if (arg && typeof arg === "object") {
          try {
            var str = JSON.stringify(arg).toLowerCase();
            if (
              str.indexOf("chrome-extension") !== -1 ||
              str.indexOf("eppiocemhmnlbhjplcgkofciiegomcon") !== -1 ||
              str.indexOf("bis_skin_checked") !== -1 ||
              str.indexOf("bis_register") !== -1
            ) {
              isExtensionMismatch = true;
              break;
            }
          } catch (e) {}
        }
      }

      if (isExtensionMismatch) {
        // Suppress browser-extension false positive hydration warning
        return;
      }

      return origConsoleError.apply(console, arguments);
    };
  } catch (e) {}
})();
