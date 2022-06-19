import React from "react";
import Layout from "./src/components/layout";

// require("prismjs/themes/prism-tomorrow.css")
// require("prismjs/themes/prism-coy.css")
require("prismjs/themes/prism-okaidia.css")
// require("prismjs/themes/prism.css")
// require("prismjs/themes/prism-solarizedlight.css");
require("prismjs/plugins/line-numbers/prism-line-numbers.css");
require(`katex/dist/katex.min.css`);
export function wrapPageElement({ element, props }) {
  return <Layout {...props}>{element}</Layout>;
}
