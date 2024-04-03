import { unstable_cache as nextCache } from "next/cache";
import { cache as reactCache } from "react";

const cache = (
  callback: (...args: any[]) => Promise<any>,
  keyParts: string[],
  options: { revalidate?: number | false; tags?: string[] } = {}
) => {
  return nextCache(reactCache(callback), keyParts, options);
};

export default cache;
