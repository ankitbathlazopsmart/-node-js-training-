import * as Router from "koa-router";
import { KoaContext } from "../types";

type methods = "GET" | "POST";

function routerHandler(route: Function) {
    return async (ctx: KoaContext, next: () => Promise<any>) => {
        try {
            await next();
            const response = await route(ctx);
            ctx.status = 200;
            if (
                ctx.path === "/list/delete" ||
                (ctx.path === "/list" && ctx.method === "POST")
            ) {
                ctx.redirect("/list");
            } else if (ctx.path === "/list" && ctx.method === "GET") {
                return response;
            } else {
                ctx.body = response;
            }
        } catch (err) {
            const response = await route(ctx);
            ctx.body = response;
        }
    };
}
function routeHelper(
    routes: { url: string; methods: methods[]; route: Function }[],
    router: Router<any, {}>
) {
    for (let item of routes) {
        const { url, methods, route } = item;
        router.register(url, methods, routerHandler(route));
    }
}
export { routerHandler, routeHelper };
