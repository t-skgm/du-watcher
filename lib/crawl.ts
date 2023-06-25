export const crawlHTML = async ({
  targetUrl,
  referer = REFERER_DU,
}: {
  targetUrl: string;
  referer?: string;
}): Promise<string> => {
  const res = await fetch(targetUrl, {
    headers: {
      "User-Agent": UA,
      referer,
    },
  });
  const html = await res.text();
  return html;
};

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36";
const REFERER_DU = "https://diskunion.net/used/";
