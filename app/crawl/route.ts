import { NextResponse } from "next/server";
import { parse } from "node-html-parser";

export async function GET(request: Request) {
  const reqUrl = new URL(request.url);
  const targetUrl = reqUrl.searchParams.get("u");
  if (targetUrl == null) {
    return new Response("Invalid params", { status: 501 });
  }
  const res = await crawlDu({ targetUrl });
  console.log(res);

  return NextResponse.json({ message: "ok!" });
}

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36";
const REFERER = "https://diskunion.net/used/";

const crawlDu = async ({ targetUrl }: { targetUrl: string }) => {
  const res = await fetch(targetUrl, {
    headers: {
      "User-Agent": UA,
      referer: REFERER,
    },
  });
  const html = await res.text();
  const doc = parse(html);
  return doc.querySelector("title")?.innerText;
};
