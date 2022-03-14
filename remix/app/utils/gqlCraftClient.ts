import { GraphQLClient } from 'graphql-request'

// The code is taken from this blog article:
// https://www.trevor-davis.com/blog/setting-up-live-preview-with-craft-cms-in-headless-mode

// Pass through allowed query params to the requst
const getQueryParams = (request: Request) => {
    const url = new URL(request.url)
    const allowedKeys = ['x-craft-preview', 'x-craft-live-preview', 'token']
    const filteredParams = Object.entries(
        Object.fromEntries(url.searchParams)
    ).filter(([key]) => allowedKeys.includes(key))

    if (!filteredParams.length) {
        return ''
    }

    const queryString = filteredParams.map((val) => val.join('=')).join('&')

    return `?${queryString}`
}

export const gqlCraftClient = (request: Request) => {
    const queryString = request ? getQueryParams(request) : ''

    return new GraphQLClient(`${process.env.CRAFT_ENDPOINT}/${queryString}`, {
        headers: {
            authorization: process.env.CRAFT_GQL_TOKEN as string,
        },
    })
}
