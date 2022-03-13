import { gql, GraphQLClient } from "graphql-request";
import { redirect } from "remix";

export type RetourResolveRedirect = {
  redirectDestUrl: string | null
  redirectHttpCode: number | null
  enabled: boolean | null
}

export const retourResolveRedirect =
  async (request: Request, uri: string): Promise<RetourResolveRedirect> => {

  const endpoint = process.env.CRAFT_ENDPOINT as string;
  const options = {
    headers: {
      Authorization: process.env.CRAFT_GQL_TOKEN as string,
    },
  };

  const retourRedirected = new Headers(request.headers).has(
    "retour_redirected"
  );

  // If we have already redirected once and we are about to redirect a second time, then we return with a 404 page to prevent a redirect infinite loop. This will also help us identify bad redirects which should go directly to the location. This is only for internal redirects.
  if (retourRedirected) {
    throw new Response("Not found", {
      status: 404,
    });
  }

  const RedirectQuery = gql`
    query ($uri: String!) {
      retourResolveRedirect(uri: $uri) {
        redirectDestUrl
        redirectHttpCode
        enabled
      }
    }
  `;

  try {
    const { retourResolveRedirect } = await new GraphQLClient(
      endpoint,
      options
    ).request(RedirectQuery, { uri }).catch(err => { console.error(err); return null });

    return retourResolveRedirect
  }
  // If Craft is down or doesn't work for some reason we just return a 404 page instead
  catch (error) {
    throw new Response("Not found", {
      status: 404
    });
  }
}

export const checkRedirect = (rrr: RetourResolveRedirect): Response => {
  // If there is no redirect code, then there is no redirect and its a 404.
  // Also if the redirect rule is disabled we also give a 404 page.
  if (!rrr?.redirectHttpCode || !rrr?.enabled) {
    throw new Response("Not found", {
      status: 404
    });
  }

  // Page is gone, works pretty much like a 404
  if (rrr?.redirectHttpCode === 410) {
    throw new Response("Gone", {
      status: 410
    });
  }

  return redirect(rrr.redirectDestUrl as string, {
    status: rrr.redirectHttpCode as number,
    headers: {
      retour_redirected: "true",
    },
  });
}
