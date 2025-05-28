import { parse as parseUrl } from "url";
import { parse as parseQuery } from "querystring";
import { parse as parseDomain } from "tldts";
import axios from "axios";
import affiliateData from "../config/affiliateParams";

export async function analyzeLink(inputUrl: string) {
  let finalUrl = inputUrl;

  try {
    // Use HEAD to follow redirects but avoid full content download
    const response = await axios.get(inputUrl, {
      maxRedirects: 5,
      timeout: 5000,
      validateStatus: (status) => status >= 200 && status < 400,
    });

    // Axios should expose the final resolved URL
    const redirectedUrl = response.request?.res?.responseUrl;
    if (redirectedUrl) {
      finalUrl = redirectedUrl;
    }
  } catch (err) {
    if (err instanceof Error) {
      console.warn(
        `Redirect resolution failed for ${inputUrl}: ${err.message}`
      );
    } else {
      console.warn(
        `Redirect resolution failed for ${inputUrl}: ${JSON.stringify(err)}`
      );
    }
  }

  // Parse and analyze final URL
  const parsed = parseUrl(finalUrl);
  const queryParams = parseQuery(parsed.query || "");
  const hostname = parsed.hostname || "";
  const domain = parseDomain(hostname).domain || "";

  const matchedParams = Object.keys(queryParams).filter((param) =>
    affiliateData.affiliateParams.includes(param.toLowerCase())
  );

  const isAffiliateDomain = affiliateData.affiliateDomains.includes(domain);

  const reasons: string[] = [];
  if (matchedParams.length > 0) {
    reasons.push(
      `Contains affiliate-like parameters: ${matchedParams.join(", ")}`
    );
  }
  if (isAffiliateDomain) {
    reasons.push(`Matches known affiliate domain: ${domain}`);
  }

  return {
    is_affiliate: matchedParams.length > 0 || isAffiliateDomain,
    reasons,
    matched_params: matchedParams,
    matched_domains: isAffiliateDomain ? [domain] : [],
    final_url: finalUrl,
  };
}
