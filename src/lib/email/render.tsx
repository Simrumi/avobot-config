import { render } from "@react-email/render";
import type { ReactElement } from "react";

export async function renderEmail(el: ReactElement): Promise<{ html: string; text: string }> {
  const [html, text] = await Promise.all([
    render(el, { pretty: false }),
    render(el, { plainText: true }),
  ]);
  return { html, text };
}
