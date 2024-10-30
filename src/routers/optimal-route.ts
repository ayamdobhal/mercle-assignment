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
        response: t.Object({
            success: t.Boolean(),
            route: t.Optional(
                t.Object({
                    routes: t.Array(
                        t.Object({
                            path: t.String(),
                            amount: t.Number(),
                            gasFee: t.Number(),
                            estimatedTime: t.Number(),
                        }),
                    ),
                    totalGas: t.Number(),
                    totalTime: t.Number(),
                }),
            ),
            error: t.Optional(t.String()),
        }),
    },
);
