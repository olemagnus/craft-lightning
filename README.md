# Craft Lightning (Remix)

A monorepo containing Headless Craft and Remix. 

It is an experiment by recreating most the Craft frontend in Remix, including the most used plugins at Feed. 

Functionality added
* Retour (redirection and 404 logging)
* Seomatic (SEO fields)
* Editing preview in Craft
* Multi-language

TODO:
* Render rich text from the Redactor plugin
* Add support for the Navigation plugin
* Run Remix on the Edge (Cloudflare Workers, or Deno)
* Add GraphCDN for caching of Craft GraphQL queries, so the content is also on the edge
* Craft webhooks for purging cached data in GraphCDN, like entries
* Add support for category pages
* Add support for singe entry
* Add CSP rules for better frontend security
* Automatic generating TypeScript types from GraphQL queries
* If using Cloudflare workers: Look into using R2 for assets, image optimizing, video streaming and KV storage for caching things like blurhash.
* Matrix block rendering
* Pagination from Craft
* Nested structure entries in Remix router
* Look into if Prisma works with Cloudflare workers, and look into using Cloudflare D1 database for Prisma
* Formie (Craft plugin)
* Make all of this a toolkit installed with NPM
