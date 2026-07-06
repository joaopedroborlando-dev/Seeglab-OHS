import { AsyncLocalStorage } from 'async_hooks';

interface RequestContext {
    organizationId: string;
    userId: string;
}

export const requestContext = new AsyncLocalStorage<RequestContext>();

export const getContext = (): RequestContext => {
    const store = requestContext.getStore();
    if (!store) {
        throw new Error("NO_CONTEXT");
    }
    return store;
};