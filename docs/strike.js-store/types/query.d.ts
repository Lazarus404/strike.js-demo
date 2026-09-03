export type QueryStatus = 'idle' | 'pending' | 'success' | 'error';

export type GroupState = {
	pending: number;
	progress: number | null;
	status: QueryStatus;
	error: unknown | null;
};

export type TaskCtx = {
	signal: AbortSignal;
	reportProgress: (ratio: number) => void;
};

export type RunOptions<T, R> = {
	key?: string;
	signal?: AbortSignal;
	parse?: (raw: unknown) => T;
	map?: (data: T) => R;
	onSuccess?: (data: R, ctx: { key?: string; group: string }) => void;
	onError?: (err: unknown, ctx: { key?: string; group: string }) => void;
};

export type QueryClient = {
	run<T = unknown, R = T>(
		group: string,
		task: (ctx: TaskCtx) => Promise<T> | T,
		opts?: RunOptions<T, R>
	): Promise<R>;
	runAll(
		group: string,
		tasks: Array<((ctx: TaskCtx) => any) | { task: (ctx: TaskCtx) => any; key?: string }>,
		opts?: { settled?: boolean }
	): Promise<any>;
	cancel(group: string, key?: string): void;
	getGroup(group: string): GroupState;
};

export declare function createQueryClient(): QueryClient;
export declare function useQueryGroup(
	client: QueryClient,
	groupName: string
): GroupState;
