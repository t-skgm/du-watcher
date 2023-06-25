import { NextResponse } from "next/server";
import { crawlDu } from "../crawlAll/_crawl";

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
