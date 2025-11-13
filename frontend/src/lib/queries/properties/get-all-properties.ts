import type { TypedSupabaseClient } from "@src/lib/utils/types";

export function getAllProperties(client: TypedSupabaseClient) {
	return client.from("properties").select(
		`
      id,
      title,
      description
    `,
	);
}
