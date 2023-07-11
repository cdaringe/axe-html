import type { RunOptions } from "axe-core";
import * as hd from "happy-dom";
import type IHappyDOMOptions from "happy-dom/lib/window/IHappyDOMOptions";

export const analyze = async (
  htmlBody: string,
  opts?: {
    runOptions?: RunOptions;
    windowOptions?: IHappyDOMOptions;
  }
) => {
  const window = new hd.Window({
    ...opts?.windowOptions,
    url: "https://a11y.axe-html.site",
    width: 1024,
    height: 768,
  });
  // https://github.com/capricorn86/happy-dom/issues/978
  Object.assign(window.Node.prototype, { isConnected: false });

  const document = window.document;
  document.body.innerHTML = htmlBody;
  Object.defineProperty(globalThis, "window", {
    get() {
      return window;
    },
  });
  const axe = await import("axe-core");
  axe.setup(window.document.body as unknown as Element);
  const out = await axe.run();
  return out;
};

analyze("<img src='ok'></img>");
