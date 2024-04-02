import { NextRequest, NextResponse } from "next/server";

export const middleware = async (req: NextRequest) => {
  if ((await isAuthenticated(req)) === false)
    return new NextResponse("Unauthorized", {
      status: 401,
      headers: { "WWW-Authenticate": "Basic" },
    });
};

const isAuthenticated = async (req: NextRequest) => {
    const header = req.headers.get("Authorization");
    if (header == null) return false;

    const [username, password] = Buffer.from(header.split(" ")[1], "base64")
      .toString()
      .split(":");

    return (
      username === process.env.ADMIN_USERNAME &&
      (await validatePassword(password, process.env.HASHED_ADMIN_PASSWORD!))
    );
  },
  validatePassword = async (password: string, hashedPassword: string) => {
    const arrayBuffer = await crypto.subtle.digest(
      "SHA-512",
      new TextEncoder().encode(password)
    );

    return Buffer.from(arrayBuffer).toString("base64") === hashedPassword;
  };

export const config = {
  matcher: "/admin/:path*",
};
