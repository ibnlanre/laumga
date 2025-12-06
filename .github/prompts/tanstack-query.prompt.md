---
agent: agent
---

# TanStack Query

## useQuery

A query is a declarative dependency on an asynchronous source of data that is tied to a **unique key**. A query can be used with any Promise based method (including GET and POST methods) to fetch data from a server. If your method modifies data on the server, we recommend using `Mutations` instead.

To subscribe to a query in your components or custom hooks, call the `useQuery` hook with at least:

- A **unique key for the query**
- A function that returns a promise that:
  - Resolves the data, or
  - Throws an error

The **unique key** you provide is used internally for refetching, caching, and sharing your queries throughout your application.

The query result returned by `useQuery` contains all of the information about the query that you'll need for templating and any other usage of the data:

The `result` object contains a few very important states you'll need to be aware of to be productive. A query can only be in one of the following states at any given moment:

- `isPending` or `status === 'pending'` - The query has no data yet
- `isError` or `status === 'error'` - The query encountered an error
- `isSuccess` or `status === 'success'` - The query was successful and data is available

Beyond those primary states, more information is available depending on the state of the query:

- `error` - If the query is in an `isError` state, the error is available via the `error` property.
- `data` - If the query is in an `isSuccess` state, the data is available via the `data` property.
- `isFetching` - In any state, if the query is fetching at any time (including background refetching) `isFetching` will be `true`.

For **most** queries, it's usually sufficient to check for the `isPending` state, then the `isError` state, then finally, assume that the data is available and render the successful state:

If booleans aren't your thing, you can always use the `status` state as well:

TypeScript will also narrow the type of `data` correctly if you've checked for `pending` and `error` before accessing it.

### FetchStatus

In addition to the `status` field, you will also get an additional `fetchStatus` property with the following options:

- `fetchStatus === 'fetching'` - The query is currently fetching.
- `fetchStatus === 'paused'` - The query wanted to fetch, but it is paused. Read more about this in the `Network Mode` guide.
- `fetchStatus === 'idle'` - The query is not doing anything at the moment.

### Why two different states?

Background refetches and stale-while-revalidate logic make all combinations for `status` and `fetchStatus` possible. For example:

- a query in `success` status will usually be in `idle` fetchStatus, but it could also be in `fetching` if a background refetch is happening.
- a query that mounts and has no data will usually be in `pending` status and `fetching` fetchStatus, but it could also be `paused` if there is no network connection.

So keep in mind that a query can be in `pending` state without actually fetching data. As a rule of thumb:

- The `status` gives information about the `data`: Do we have any or not?
- The `fetchStatus` gives information about the `queryFn`: Is it running or not?

### Signature

```tsx
const {
  data,
  dataUpdatedAt,
  error,
  errorUpdatedAt,
  failureCount,
  failureReason,
  fetchStatus,
  isError,
  isFetched,
  isFetchedAfterMount,
  isFetching,
  isInitialLoading,
  isLoading,
  isLoadingError,
  isPaused,
  isPending,
  isPlaceholderData,
  isRefetchError,
  isRefetching,
  isStale,
  isSuccess,
  isEnabled,
  promise,
  refetch,
  status,
} = useQuery(
  {
    queryKey,
    queryFn,
    gcTime,
    enabled,
    networkMode,
    initialData,
    initialDataUpdatedAt,
    meta,
    notifyOnChangeProps,
    placeholderData,
    queryKeyHashFn,
    refetchInterval,
    refetchIntervalInBackground,
    refetchOnMount,
    refetchOnReconnect,
    refetchOnWindowFocus,
    retry,
    retryOnMount,
    retryDelay,
    select,
    staleTime,
    structuralSharing,
    subscribed,
    throwOnError,
  },
  queryClient
);
```

```
const {
  data,
  dataUpdatedAt,
  error,
  errorUpdatedAt,
  failureCount,
  failureReason,
  fetchStatus,
  isError,
  isFetched,
  isFetchedAfterMount,
  isFetching,
  isInitialLoading,
  isLoading,
  isLoadingError,
  isPaused,
  isPending,
  isPlaceholderData,
  isRefetchError,
  isRefetching,
  isStale,
  isSuccess,
  isEnabled,
  promise,
  refetch,
  status,
} = useQuery(
  {
    queryKey,
    queryFn,
    gcTime,
    enabled,
    networkMode,
    initialData,
    initialDataUpdatedAt,
    meta,
    notifyOnChangeProps,
    placeholderData,
    queryKeyHashFn,
    refetchInterval,
    refetchIntervalInBackground,
    refetchOnMount,
    refetchOnReconnect,
    refetchOnWindowFocus,
    retry,
    retryOnMount,
    retryDelay,
    select,
    staleTime,
    structuralSharing,
    subscribed,
    throwOnError,
  },
  queryClient,
)
```

**Parameter1 (Options)**

- queryKey: unknown[]
  - **Required**
  - The query key to use for this query.
  - The query key will be hashed into a stable hash.
  - The query will automatically update when this key changes (as long as enabled is not set to false).
- queryFn: (context: QueryFunctionContext) => Promise<TData>
  - **Required, but only if no default query function has been defined** 
  - The function that the query will use to request data.
  - Receives a QueryFunctionContext
  - Must return a promise that will either resolve data or throw an error. The data cannot be undefined.
- enabled: boolean | (query: Query) => boolean
  - Set this to false to disable this query from automatically running.
  - Can be used for Dependent Queries.
- networkMode: 'online' | 'always' | 'offlineFirst'
  - optional
  - defaults to 'online'
- retry: boolean | number | (failureCount: number, error: TError) => boolean
  - If false, failed queries will not retry by default.
  - If true, failed queries will retry infinitely.
  - If set to a number, e.g. 3, failed queries will retry until the failed query count meets that number.
  - defaults to 3 on the client and 0 on the server
- retryOnMount: boolean
  - If set to false, the query will not be retried on mount if it contains an error. Defaults to true.
- retryDelay: number | (retryAttempt: number, error: TError) => number
  - This function receives a retryAttempt integer and the actual Error and returns the delay to apply before the next attempt in milliseconds.
  - A function like attempt => Math.min(attempt > 1 ? 2 ** attempt * 1000 : 1000, 30 * 1000) applies exponential backoff.
  - A function like attempt => attempt * 1000 applies linear backoff.
- staleTime: number | 'static' | ((query: Query) => number | 'static')
  - Optional
  - Defaults to 0
  - The time in milliseconds after which data is considered stale. This value only applies to the hook it is defined on.
  - If set to Infinity, the data will not be considered stale unless manually invalidated
  - If set to a function, the function will be executed with the query to compute a staleTime.
  - If set to 'static', the data will never be considered stale
- gcTime: number | Infinity
  - Defaults to 5 * 60 * 1000 (5 minutes) or Infinity during SSR
  - The time in milliseconds that unused/inactive cache data remains in memory. When a query's cache becomes unused or inactive, that cache data will be garbage collected after this duration. When different garbage collection times are specified, the longest one will be used.
  - Note: the maximum allowed time is about [24 days](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout#maximum_delay_value), although it is possible to work around this limit using `timeoutManager.setTimeoutProvider`.
  - If set to Infinity, will disable garbage collection
- queryKeyHashFn: (queryKey: QueryKey) => string
  - Optional
  - If specified, this function is used to hash the queryKey to a string.
- refetchInterval: number | false | ((query: Query) => number | false | undefined)
  - Optional
  - If set to a number, all queries will continuously refetch at this frequency in milliseconds
  - If set to a function, the function will be executed with the query to compute a frequency
- refetchIntervalInBackground: boolean
  - Optional
  - If set to true, queries that are set to continuously refetch with a refetchInterval will continue to refetch while their tab/window is in the background
- refetchOnMount: boolean | "always" | ((query: Query) => boolean | "always")
  - Optional
  - Defaults to true
  - If set to true, the query will refetch on mount if the data is stale.
  - If set to false, the query will not refetch on mount.
  - If set to "always", the query will always refetch on mount (except when staleTime: 'static' is used).
  - If set to a function, the function will be executed with the query to compute the value
- refetchOnWindowFocus: boolean | "always" | ((query: Query) => boolean | "always")
  - Optional
  - Defaults to true
  - If set to true, the query will refetch on window focus if the data is stale.
  - If set to false, the query will not refetch on window focus.
  - If set to "always", the query will always refetch on window focus (except when staleTime: 'static' is used).
  - If set to a function, the function will be executed with the query to compute the value
- refetchOnReconnect: boolean | "always" | ((query: Query) => boolean | "always")
  - Optional
  - Defaults to true
  - If set to true, the query will refetch on reconnect if the data is stale.
  - If set to false, the query will not refetch on reconnect.
  - If set to "always", the query will always refetch on reconnect (except when staleTime: 'static' is used).
  - If set to a function, the function will be executed with the query to compute the value
- notifyOnChangeProps: string[] | "all" | (() => string[] | "all" | undefined)
  - Optional
  - If set, the component will only re-render if any of the listed properties change.
  - If set to ['data', 'error'] for example, the component will only re-render when the data or error properties change.
  - If set to "all", the component will opt-out of smart tracking and re-render whenever a query is updated.
  - If set to a function, the function will be executed to compute the list of properties.
  - By default, access to properties will be tracked, and the component will only re-render when one of the tracked properties change.
- select: (data: TData) => unknown
  - Optional
  - This option can be used to transform or select a part of the data returned by the query function. It affects the returned data value, but does not affect what gets stored in the query cache.
  - The select function will only run if data changed, or if the reference to the select function itself changes. To optimize, wrap the function in useCallback.
- initialData: TData | () => TData
  - Optional
  - If set, this value will be used as the initial data for the query cache (as long as the query hasn't been created or cached yet)
  - If set to a function, the function will be called **once** during the shared/root query initialization, and be expected to synchronously return the initialData
  - Initial data is considered stale by default unless a staleTime has been set.
  - initialData **is persisted** to the cache
- initialDataUpdatedAt: number | (() => number | undefined)
  - Optional
  - If set, this value will be used as the time (in milliseconds) of when the initialData itself was last updated.
- placeholderData: TData | (previousValue: TData | undefined, previousQuery: Query | undefined) => TData
  - Optional
  - If set, this value will be used as the placeholder data for this particular query observer while the query is still in the pending state.
  - placeholderData is **not persisted** to the cache
  - If you provide a function for placeholderData, as a first argument you will receive previously watched query data if available, and the second argument will be the complete previousQuery instance.
- structuralSharing: boolean | (oldData: unknown | undefined, newData: unknown) => unknown
  - Optional
  - Defaults to true
  - If set to false, structural sharing between query results will be disabled.
  - If set to a function, the old and new data values will be passed through this function, which should combine them into resolved data for the query. This way, you can retain references from the old data to improve performance even when that data contains non-serializable values.
- subscribed: boolean
  - Optional
  - Defaults to true
  - If set to false, this instance of useQuery will not be subscribed to the cache. This means it won't trigger the queryFn on its own, and it won't receive updates if data gets into cache by other means.
- throwOnError: undefined | boolean | (error: TError, query: Query) => boolean
  - Set this to true if you want errors to be thrown in the render phase and propagate to the nearest error boundary
  - Set this to false to disable suspense's default behavior of throwing errors to the error boundary.
  - If set to a function, it will be passed the error and the query, and it should return a boolean indicating whether to show the error in an error boundary (true) or return the error as state (false)
- meta: Record<string, unknown>
  - Optional
  - If set, stores additional information on the query cache entry that can be used as needed. It will be accessible wherever the query is available, and is also part of the QueryFunctionContext provided to the queryFn.

**Parameter2 (QueryClient)**

- queryClient?: QueryClient
  - Use this to use a custom QueryClient. Otherwise, the one from the nearest context will be used.

**Returns**

- status: QueryStatus
  - Will be:
    - pending if there's no cached data and no query attempt was finished yet.
    - error if the query attempt resulted in an error. The corresponding error property has the error received from the attempted fetch
    - success if the query has received a response with no errors and is ready to display its data. The corresponding data property on the query is the data received from the successful fetch or if the query's enabled property is set to false and has not been fetched yet data is the first initialData supplied to the query on initialization.
- isPending: boolean
  - A derived boolean from the status variable above, provided for convenience.
- isSuccess: boolean
  - A derived boolean from the status variable above, provided for convenience.
- isError: boolean
  - A derived boolean from the status variable above, provided for convenience.
- isLoadingError: boolean
  - Will be true if the query failed while fetching for the first time.
- isRefetchError: boolean
  - Will be true if the query failed while refetching.
- data: TData
  - Defaults to undefined.
  - The last successfully resolved data for the query.
- dataUpdatedAt: number
  - The timestamp for when the query most recently returned the status as "success".
- error: null | TError
  - Defaults to null
  - The error object for the query, if an error was thrown.
- errorUpdatedAt: number
  - The timestamp for when the query most recently returned the status as "error".
- isStale: boolean
  - Will be true if the data in the cache is invalidated or if the data is older than the given staleTime.
- isPlaceholderData: boolean
  - Will be true if the data shown is the placeholder data.
- isFetched: boolean
  - Will be true if the query has been fetched.
- isFetchedAfterMount: boolean
  - Will be true if the query has been fetched after the component mounted.
  - This property can be used to not show any previously cached data.
- fetchStatus: FetchStatus
  - fetching: Is true whenever the queryFn is executing, which includes initial pending as well as background refetches.
  - paused: The query wanted to fetch, but has been paused.
  - idle: The query is not fetching.
- isFetching: boolean
  - A derived boolean from the fetchStatus variable above, provided for convenience.
- isPaused: boolean
  - A derived boolean from the fetchStatus variable above, provided for convenience.
- isRefetching: boolean
  - Is true whenever a background refetch is in-flight, which _does not_ include initial pending
  - Is the same as isFetching && !isPending
- isLoading: boolean
  - Is true whenever the first fetch for a query is in-flight
  - Is the same as isFetching && isPending
- isInitialLoading: boolean
  - **deprecated**
  - An alias for isLoading, will be removed in the next major version.
- isEnabled: boolean
  - Is true if this query observer is enabled, false otherwise.
- failureCount: number
  - The failure count for the query.
  - Incremented every time the query fails.
  - Reset to 0 when the query succeeds.
- failureReason: null | TError
  - The failure reason for the query retry.
  - Reset to null when the query succeeds.
- errorUpdateCount: number
  - The sum of all errors.
- refetch: (options: { throwOnError: boolean, cancelRefetch: boolean }) => Promise<UseQueryResult>
  - A function to manually refetch the query.
  - If the query errors, the error will only be logged. If you want an error to be thrown, pass the throwOnError: true option
  - cancelRefetch?: boolean
    - Defaults to true
      - Per default, a currently running request will be cancelled before a new request is made
    - When set to false, no refetch will be made if there is already a request running.
- promise: Promise<TData>
  - A stable promise that will be resolved with the data of the query.
  - Requires the experimental_prefetchInRender feature flag to be enabled on the QueryClient.

---

## Infinite Queries

Rendering lists that can additively "load more" data onto an existing set of data or "infinite scroll" is also a very common UI pattern. TanStack Query supports a useful version of `useQuery` called `useInfiniteQuery` for querying these types of lists.

When using `useInfiniteQuery`, you'll notice a few things are different:

- `data` is now an object containing infinite query data:
- `data.pages` array containing the fetched pages
- `data.pageParams` array containing the page params used to fetch the pages
- The `fetchNextPage` and `fetchPreviousPage` functions are now available (`fetchNextPage` is required)
- The `initialPageParam` option is now available (and required) to specify the initial page param
- The `getNextPageParam` and `getPreviousPageParam` options are available for both determining if there is more data to load and the information to fetch it. This information is supplied as an additional parameter in the query function
- A `hasNextPage` boolean is now available and is `true` if `getNextPageParam` returns a value other than `null` or `undefined`
- A `hasPreviousPage` boolean is now available and is `true` if `getPreviousPageParam` returns a value other than `null` or `undefined`
- The `isFetchingNextPage` and `isFetchingPreviousPage` booleans are now available to distinguish between a background refresh state and a loading more state

> Note: Options `initialData` or `placeholderData` need to conform to the same structure of an object with `data.pages` and `data.pageParams` properties.

## Example

Let's assume we have an API that returns pages of `projects` 3 at a time based on a `cursor` index along with a cursor that can be used to fetch the next group of projects.

With this information, we can create a "Load More" UI by:

- Waiting for `useInfiniteQuery` to request the first group of data by default
- Returning the information for the next query in `getNextPageParam`
- Calling `fetchNextPage` function

It's essential to understand that calling `fetchNextPage` while an ongoing fetch is in progress runs the risk of overwriting data refreshes happening in the background. This situation becomes particularly critical when rendering a list and triggering `fetchNextPage` simultaneously.

Remember, there can only be a single ongoing fetch for an InfiniteQuery. A single cache entry is shared for all pages, attempting to fetch twice simultaneously might lead to data overwrites.

If you intend to enable simultaneous fetching, you can utilize the `{ cancelRefetch: false }` option (default: true) within `fetchNextPage`.

To ensure a seamless querying process without conflicts, it's highly recommended to verify that the query is not in an `isFetching` state, especially if the user won't directly control that call.

## What happens when an infinite query needs to be refetched?

When an infinite query becomes `stale` and needs to be refetched, each group is fetched `sequentially`, starting from the first one. This ensures that even if the underlying data is mutated, we're not using stale cursors and potentially getting duplicates or skipping records. If an infinite query's results are ever removed from the queryCache, the pagination restarts at the initial state with only the initial group being requested.

## What if I want to implement a bi-directional infinite list?

Bi-directional lists can be implemented by using the `getPreviousPageParam`, `fetchPreviousPage`, `hasPreviousPage` and `isFetchingPreviousPage` properties and functions.

```tsx
useInfiniteQuery({
  ...,
  initialPageParam: 0,
  getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
  getPreviousPageParam: (firstPage, pages) => firstPage.prevCursor,
})
```

## What if I want to show the pages in reversed order?

Sometimes you may want to show the pages in reversed order. If this is case, you can use the `select` option:

```tsx
useInfiniteQuery({
  ...,
  select: (data) => ({
    pages: [...data.pages].reverse(),
    pageParams: [...data.pageParams].reverse(),
  }),
})
```

## What if I want to manually update the infinite query?

### Keep only the first page:

Make sure to always keep the same data structure of pages and pageParams!

## What if I want to limit the number of pages?

In some use cases you may want to limit the number of pages stored in the query data to improve the performance and UX:

- when the user can load a large number of pages (memory usage)
- when you have to refetch an infinite query that contains dozens of pages (network usage: all the pages are sequentially fetched)

The solution is to use a "Limited Infinite Query". This is made possible by using the `maxPages` option in conjunction with `getNextPageParam` and `getPreviousPageParam` to allow fetching pages when needed in both directions.

In the following example only 3 pages are kept in the query data pages array. If a refetch is needed, only 3 pages will be refetched sequentially.

## What if my API doesn't return a cursor?

If your API doesn't return a cursor, you can use the `pageParam` as a cursor. Because `getNextPageParam` and `getPreviousPageParam` also get the `pageParam`of the current page, you can use it to calculate the next / previous page param.

```tsx
const {
  fetchNextPage,
  fetchPreviousPage,
  hasNextPage,
  hasPreviousPage,
  isFetchingNextPage,
  isFetchingPreviousPage,
  promise,
  ...result
} = useInfiniteQuery({
  queryKey,
  queryFn: ({ pageParam }) => fetchPage(pageParam),
  initialPageParam: 1,
  ...options,
  getNextPageParam: (lastPage, allPages, lastPageParam, allPageParams) =>
    lastPage.nextCursor,
  getPreviousPageParam: (firstPage, allPages, firstPageParam, allPageParams) =>
    firstPage.prevCursor,
});
```

**Options**

The options for `useInfiniteQuery` are identical to the `useQuery` hook with the addition of the following:

- `queryFn: (context: QueryFunctionContext) => Promise<TData>`
  - **Required, but only if no default query function has been defined** `defaultQueryFn`
  - The function that the query will use to request data.
  - Receives a QueryFunctionContext
  - Must return a promise that will either resolve data or throw an error.
- `initialPageParam: TPageParam`
  - **Required**
  - The default page param to use when fetching the first page.
- `getNextPageParam: (lastPage, allPages, lastPageParam, allPageParams) => TPageParam | undefined | null`
  - **Required**
  - When new data is received for this query, this function receives both the last page of the infinite list of data and the full array of all pages, as well as pageParam information.
  - It should return a **single variable** that will be passed as the last optional parameter to your query function.
  - Return `undefined` or `null` to indicate there is no next page available.
- `getPreviousPageParam: (firstPage, allPages, firstPageParam, allPageParams) => TPageParam | undefined | null`
  - When new data is received for this query, this function receives both the first page of the infinite list of data and the full array of all pages, as well as pageParam information.
  - It should return a **single variable** that will be passed as the last optional parameter to your query function.
  - Return `undefined` or `null`to indicate there is no previous page available.
- `maxPages: number | undefined`
  - The maximum number of pages to store in the infinite query data.
  - When the maximum number of pages is reached, fetching a new page will result in the removal of either the first or last page from the pages array, depending on the specified direction.
  - If `undefined` or equals `0`, the number of pages is unlimited
  - Default value is `undefined`
  - `getNextPageParam` and `getPreviousPageParam` must be properly defined if `maxPages` value is greater than `0` to allow fetching a page in both directions when needed.

**Returns**

The returned properties for `useInfiniteQuery` are identical to the `useQuery` hook, with the addition of the following properties and a small difference in `isRefetching` and `isRefetchError`:

- `data.pages: TData[]`
  - Array containing all pages.
- `data.pageParams: unknown[]`
  - Array containing all page params.
- `isFetchingNextPage: boolean`
  - Will be `true` while fetching the next page with `fetchNextPage`.
- `isFetchingPreviousPage: boolean`
  - Will be `true` while fetching the previous page with `fetchPreviousPage`.
- `fetchNextPage: (options?: FetchNextPageOptions) => Promise<UseInfiniteQueryResult>`
  - This function allows you to fetch the next "page" of results.
  - `options.cancelRefetch: boolean` if set to `true`, calling `fetchNextPage` repeatedly will invoke `queryFn` every time, whether the previous
    invocation has resolved or not. Also, the result from previous invocations will be ignored. If set to `false`, calling `fetchNextPage`
    repeatedly won't have any effect until the first invocation has resolved. Default is `true`.
- `fetchPreviousPage: (options?: FetchPreviousPageOptions) => Promise<UseInfiniteQueryResult>`
  - This function allows you to fetch the previous "page" of results.
  - `options.cancelRefetch: boolean` same as for `fetchNextPage`.
- `hasNextPage: boolean`
  - Will be `true` if there is a next page to be fetched (known via the `getNextPageParam` option).
- `hasPreviousPage: boolean`
  - Will be `true` if there is a previous page to be fetched (known via the `getPreviousPageParam` option).
- `isFetchNextPageError: boolean`
  - Will be `true` if the query failed while fetching the next page.
- `isFetchPreviousPageError: boolean`
  - Will be `true` if the query failed while fetching the previous page.
- `isRefetching: boolean`
  - Will be `true` whenever a background refetch is in-flight, which _does not_ include initial `pending` or fetching of next or previous page
  - Is the same as `isFetching && !isPending && !isFetchingNextPage && !isFetchingPreviousPage`
- `isRefetchError: boolean`
  - Will be `true` if the query failed while refetching a page.
- `promise: Promise<TData>`
  - A stable promise that resolves to the query result.
  - This can be used with `React.use()` to fetch data
  - Requires the `experimental_prefetchInRender` feature flag to be enabled on the `QueryClient`.

Keep in mind that imperative fetch calls, such as `fetchNextPage`, may interfere with the default refetch behaviour, resulting in outdated data. Make sure to call these functions only in response to user actions, or add conditions like `hasNextPage && !isFetching`.

---

## Mutations

Unlike queries, mutations are typically used to create/update/delete data or perform server side-effects. For this purpose, TanStack Query exports a `useMutation` hook.

A mutation can only be in one of the following states at any given moment:

- `isIdle` or `status === 'idle'` - The mutation is currently idle or in a fresh/reset state
- `isPending` or `status === 'pending'` - The mutation is currently running
- `isError` or `status === 'error'` - The mutation encountered an error
- `isSuccess` or `status === 'success'` - The mutation was successful and mutation data is available

Beyond those primary states, more information is available depending on the state of the mutation:

- `error` - If the mutation is in an `error` state, the error is available via the `error` property.
- `data` - If the mutation is in a `success` state, the data is available via the `data` property.

In the example above, you also saw that you can pass variables to your mutations function by calling the `mutate` function with a **single variable or object**.

Even with just variables, mutations aren't all that special, but when used with the `onSuccess` option, the Query Client's `invalidateQueries` method and the Query Client's `setQueryData` method, mutations become a very powerful tool.

IMPORTANT: The `mutate` function is an asynchronous function, which means you cannot use it directly in an event callback in **React 16 and earlier**. If you need to access the event in `onSubmit` you need to wrap `mutate` in another function. This is due to [React event pooling](https://reactjs.org/docs/legacy-event-pooling.html).

## Resetting Mutation State

It's sometimes the case that you need to clear the `error` or `data` of a mutation request. To do this, you can use the `reset` function to handle this.

## Mutation Side Effects

`useMutation` comes with some helper options that allow quick and easy side-effects at any stage during the mutation lifecycle. These come in handy for both invalidating and refetching queries after mutations and even optimistic updates.

When returning a promise in any of the callback functions it will first be awaited before the next callback is called.

You might find that you want to **trigger additional callbacks** beyond the ones defined on `useMutation` when calling `mutate`. This can be used to trigger component-specific side effects. To do that, you can provide any of the same callback options to the `mutate` function after your mutation variable. Supported options include: `onSuccess`, `onError` and `onSettled`. Please keep in mind that those additional callbacks won't run if your component unmounts _before_ the mutation finishes.

### Consecutive mutations

There is a slight difference in handling `onSuccess`, `onError` and `onSettled` callbacks when it comes to consecutive mutations. When passed to the `mutate` function, they will be fired up only _once_ and only if the component is still mounted. This is due to the fact that mutation observer is removed and resubscribed every time when the `mutate` function is called. On the contrary, `useMutation` handlers execute for each `mutate` call.

Be aware that most likely, `mutationFn` passed to `useMutation` is asynchronous. In that case, the order in which mutations are fulfilled may differ from the order of `mutate` function calls.

## Promises

Use `mutateAsync` instead of `mutate` to get a promise which will resolve on success or throw on an error. This can for example be used to compose side effects.

## Retry

By default, TanStack Query will not retry a mutation on error, but it is possible with the `retry` option.

If mutations fail because the device is offline, they will be retried in the same order when the device reconnects.

## Persist mutations

Mutations can be persisted to storage if needed and resumed at a later point. This can be done with the hydration functions.

### Persisting Offline mutations

If you persist offline mutations with the `persistQueryClient` plugin, mutations cannot be resumed when the page is reloaded unless you provide a default mutation function.

This is a technical limitation. When persisting to an external storage, only the state of mutations is persisted, as functions cannot be serialized. After hydration, the component that triggers the mutation might not be mounted, so calling `resumePausedMutations` might yield an error: `No mutationFn found`.

## Mutation Scopes

Per default, all mutations run in parallel - even if you invoke `.mutate()` of the same mutation multiple times. Mutations can be given a `scope` with an `id` to avoid that. All mutations with the same `scope.id` will run in serial, which means when they are triggered, they will start in `isPaused: true` state if there is already a mutation for that scope in progress. They will be put into a queue and will automatically resume once their time in the queue has come.

```tsx
const mutation = useMutation({
  mutationFn: addTodo,
  scope: {
    id: 'todo',
  },
})
```

---
id: useMutation
title: useMutation
---

```tsx
const {
  data,
  error,
  isError,
  isIdle,
  isPending,
  isPaused,
  isSuccess,
  failureCount,
  failureReason,
  mutate,
  mutateAsync,
  reset,
  status,
  submittedAt,
  variables,
} = useMutation(
  {
    mutationFn,
    gcTime,
    meta,
    mutationKey,
    networkMode,
    onError,
    onMutate,
    onSettled,
    onSuccess,
    retry,
    retryDelay,
    scope,
    throwOnError,
  },
  queryClient,
)

mutate(variables, {
  onError,
  onSettled,
  onSuccess,
})
```

**Parameter1 (Options)**

- `mutationFn: (variables: TVariables, context: MutationFunctionContext) => Promise<TData>`
  - **Required, but only if no default mutation function has been defined**
  - A function that performs an asynchronous task and returns a promise.
  - `variables` is an object that `mutate` will pass to your `mutationFn`
  - `context` is an object that `mutate` will pass to your `mutationFn`. Contains reference to `QueryClient`, `mutationKey` and optional `meta` object.
- `gcTime: number | Infinity`
  - The time in milliseconds that unused/inactive cache data remains in memory. When a mutation's cache becomes unused or inactive, that cache data will be garbage collected after this duration. When different cache times are specified, the longest one will be used.
  - If set to `Infinity`, will disable garbage collection
  - Note: the maximum allowed time is about [24 days](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout#maximum_delay_value), although it is possible to work around this limit using `timeoutManager.setTimeoutProvider`.
- `mutationKey: unknown[]`
  - Optional
  - A mutation key can be set to inherit defaults set with `queryClient.setMutationDefaults`.
- `networkMode: 'online' | 'always' | 'offlineFirst'`
  - Optional
  - defaults to `'online'`
- `onMutate: (variables: TVariables) => Promise<TOnMutateResult | void> | TOnMutateResult | void`
  - Optional
  - This function will fire before the mutation function is fired and is passed the same variables the mutation function would receive
  - Useful to perform optimistic updates to a resource in hopes that the mutation succeeds
  - The value returned from this function will be passed to both the `onError` and `onSettled` functions in the event of a mutation failure and can be useful for rolling back optimistic updates.
- `onSuccess: (data: TData, variables: TVariables, onMutateResult: TOnMutateResult | undefined, context: MutationFunctionContext) => Promise<unknown> | unknown`
  - Optional
  - This function will fire when the mutation is successful and will be passed the mutation's result.
  - If a promise is returned, it will be awaited and resolved before proceeding
- `onError: (err: TError, variables: TVariables, onMutateResult: TOnMutateResult | undefined, context: MutationFunctionContext) => Promise<unknown> | unknown`
  - Optional
  - This function will fire if the mutation encounters an error and will be passed the error.
  - If a promise is returned, it will be awaited and resolved before proceeding
- `onSettled: (data: TData, error: TError, variables: TVariables, onMutateResult: TOnMutateResult | undefined, context: MutationFunctionContext) => Promise<unknown> | unknown`
  - Optional
  - This function will fire when the mutation is either successfully fetched or encounters an error and be passed either the data or error
  - If a promise is returned, it will be awaited and resolved before proceeding
- `retry: boolean | number | (failureCount: number, error: TError) => boolean`
  - Defaults to `0`.
  - If `false`, failed mutations will not retry.
  - If `true`, failed mutations will retry infinitely.
  - If set to an `number`, e.g. `3`, failed mutations will retry until the failed mutations count meets that number.
- `retryDelay: number | (retryAttempt: number, error: TError) => number`
  - This function receives a `retryAttempt` integer and the actual Error and returns the delay to apply before the next attempt in milliseconds.
  - A function like `attempt => Math.min(attempt > 1 ? 2 ** attempt * 1000 : 1000, 30 * 1000)` applies exponential backoff.
  - A function like `attempt => attempt * 1000` applies linear backoff.
- `scope: { id: string }`
  - Optional
  - Defaults to a unique id (so that all mutations run in parallel)
  - Mutations with the same scope id will run in serial
- `throwOnError: undefined | boolean | (error: TError) => boolean`
  - Set this to `true` if you want mutation errors to be thrown in the render phase and propagate to the nearest error boundary
  - Set this to `false` to disable the behavior of throwing errors to the error boundary.
  - If set to a function, it will be passed the error and should return a boolean indicating whether to show the error in an error boundary (`true`) or return the error as state (`false`)
- `meta: Record<string, unknown>`
  - Optional
  - If set, stores additional information on the mutation cache entry that can be used as needed. It will be accessible wherever the `mutation` is available (eg. `onError`, `onSuccess` functions of the `MutationCache`).

**Parameter2 (QueryClient)**

- `queryClient?: QueryClient`
  - Use this to use a custom QueryClient. Otherwise, the one from the nearest context will be used.

**Returns**

- `mutate: (variables: TVariables, { onSuccess, onSettled, onError }) => void`
  - The mutation function you can call with variables to trigger the mutation and optionally hooks on additional callback options.
  - `variables: TVariables`
    - Optional
    - The variables object to pass to the `mutationFn`.
  - `onSuccess: (data: TData, variables: TVariables, onMutateResult: TOnMutateResult | undefined, context: MutationFunctionContext) => void`
    - Optional
    - This function will fire when the mutation is successful and will be passed the mutation's result.
    - Void function, the returned value will be ignored
  - `onError: (err: TError, variables: TVariables, onMutateResult: TOnMutateResult | undefined, context: MutationFunctionContext) => void`
    - Optional
    - This function will fire if the mutation encounters an error and will be passed the error.
    - Void function, the returned value will be ignored
  - `onSettled: (data: TData | undefined, error: TError | null, variables: TVariables, onMutateResult: TOnMutateResult | undefined, context: MutationFunctionContext) => void`
    - Optional
    - This function will fire when the mutation is either successfully fetched or encounters an error and be passed either the data or error
    - Void function, the returned value will be ignored
  - If you make multiple requests, `onSuccess` will fire only after the latest call you've made.
- `mutateAsync: (variables: TVariables, { onSuccess, onSettled, onError }) => Promise<TData>`
  - Similar to `mutate` but returns a promise which can be awaited.
- `status: MutationStatus`
  - Will be:
    - `idle` initial status prior to the mutation function executing.
    - `pending` if the mutation is currently executing.
    - `error` if the last mutation attempt resulted in an error.
    - `success` if the last mutation attempt was successful.
- `isIdle`, `isPending`, `isSuccess`, `isError`: boolean variables derived from `status`
- `isPaused: boolean`
  - will be `true` if the mutation has been `paused`
  - see `Network Mode` for more information.
- `data: undefined | unknown`
  - Defaults to `undefined`
  - The last successfully resolved data for the mutation.
- `error: null | TError`
  - The error object for the query, if an error was encountered.
- `reset: () => void`
  - A function to clean the mutation internal state (i.e., it resets the mutation to its initial state).
- `failureCount: number`
  - The failure count for the mutation.
  - Incremented every time the mutation fails.
  - Reset to `0` when the mutation succeeds.
- `failureReason: null | TError`
  - The failure reason for the mutation retry.
  - Reset to `null` when the mutation succeeds.
- `submittedAt: number`
  - The timestamp for when the mutation was submitted.
  - Defaults to `0`.
- `variables: undefined | TVariables`
  - The `variables` object passed to the `mutationFn`.
  - Defaults to `undefined`.
