import { parse as parseUrl } from "url";
import { parse as parseQuery } from "querystring";
import { parse as parseDomain } from "tldts";

import affiliateData from "../../data/affiliateData.json";

export function analyzeLink(url: string) {
  const parsed = parseUrl(url);
  const queryParams = parseQuery(parsed.query || "");
  const hostname = parsed.hostname || "";
  const domain = parseDomain(hostname).domain || "";

  const matchedParams = Object.keys(queryParams).filter((param) =>
    affiliateData.affiliateParams.includes(param.toLowerCase())
  );

  const isAffiliateDomain = affiliateData.affiliateDomains.includes(domain);

  const reasons: string[] = [];
  if (matchedParams.length > 0)
    reasons.push(
      `Contains affiliate-like parameters: ${matchedParams.join(", ")}`
    );
  if (isAffiliateDomain)
    reasons.push(`Matches known affiliate domain: ${domain}`);

  return {
    is_affiliate: matchedParams.length > 0 || isAffiliateDomain,
    reasons,
    matched_params: matchedParams,
    matched_domains: isAffiliateDomain ? [domain] : [],
    final_url: url,
  };
}
