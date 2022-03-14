import { LoaderFunction } from "remix";
import {
  checkRedirect,
  retourResolveRedirect,
  RetourResolveRedirect,
} from "~/utils/retourResolveRedirect";

export const loader: LoaderFunction = async ({ request }) => {
  const uri = new URL(request.url).pathname;
  const rrr: RetourResolveRedirect = await retourResolveRedirect(request, uri);
  return checkRedirect(rrr);
};

export default function NotFound() {
  return null;
}
