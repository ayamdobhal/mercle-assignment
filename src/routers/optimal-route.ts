import { Elysia, t } from "elysia";
import { optimalRouteHandler } from "../handlers/optimal-route";

export const optimalRoute = new Elysia().get(
    "/optimal-route",
    optimalRouteHandler,
    {
        query: t.Object({
            targetChain: t.Number(),
            amount: t.Number(),
            tokenAddress: t.String(),
            userAddress: t.String(),
        }),
    },
);
