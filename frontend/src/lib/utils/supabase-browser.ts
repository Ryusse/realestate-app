import { useMemo } from "react";

import type { Database } from "@src/lib/utils/database.types";
import type { TypedSupabaseClient } from "@src/lib/utils/types";
import { createBrowserClient } from "@supabase/ssr";

let client: TypedSupabaseClient | undefined;

function getSupabaseBrowserClient() {
	if (client) {
		return client;
	}

	client = createBrowserClient<Database>(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
	);

	return client;
}

function useSupabaseBrowser() {
	return useMemo(getSupabaseBrowserClient, []);
}

export default useSupabaseBrowser;
