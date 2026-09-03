export type Store<T> = {
	get(): T;
	set(next: T | ((prev: T) => T), opts?: { force?: boolean }): void;
	subscribe(listener: (value: T, prev: T) => void): () => void;
	readonly key?: string;
};

export type Readable<T> = Pick<Store<T>, 'get' | 'subscribe'> & {
	readonly key?: string;
};

export declare function atom<T>(
	initial: T,
	opts?: { key?: string }
): Store<T>;

export declare function computed<T>(
	sources: Readable<any>[],
	fn: (...values: any[]) => T
): Readable<T>;

export declare function batch(fn: () => void): void;

export declare function map<T extends Record<string, any>>(
	initial: T
): Store<T> & {
	setKey<K extends keyof T>(key: K, val: T[K]): void;
	assign(partial: Partial<T>): void;
};

export declare function persist(
	store: Store<any>,
	opts: {
		name: string;
		storage?: {
			getItem(key: string): string | null;
			setItem(key: string, value: string): void;
		};
		serialize?: (v: any) => string;
		deserialize?: (s: string) => any;
		debounceMs?: number;
		onError?: (err: unknown) => void;
	}
): () => void;

export declare function bindStore<T>(store: Store<T>): {
	get(): T;
	set(next: T | ((prev: T) => T), opts?: { force?: boolean }): void;
	onChange(next: T): void;
};

export declare function useStoreValue<T, S = T>(
	store: Readable<T>,
	selector?: (v: T) => S,
	opts?: { eq?: (a: S, b: S) => boolean }
): S;

export declare function useStoreSet<T>(
	store: Store<T>
): (next: T | ((prev: T) => T), opts?: { force?: boolean }) => void;

export declare function useBindStore<T, C = T>(
	store: Store<T>,
	opts?: {
		toControl?: (v: T) => C;
		fromControl?: (v: C) => T;
	}
): { value: C; onChange: (next: C) => void };

export declare function shallow(a: any, b: any): boolean;
