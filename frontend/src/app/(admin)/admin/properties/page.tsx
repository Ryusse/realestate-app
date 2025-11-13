import { getAllProperties } from "@src/lib/queries/properties/get-all-properties";
import useSupabaseServer from "@src/lib/utils/supabase-server";
import PropertiesList from "@src/modules/properties/components/properties-list";
import { prefetchQuery } from "@supabase-cache-helpers/postgrest-react-query";
import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";

export default async function PropertiesPage() {
	const queryClient = new QueryClient();
	const supabase = await useSupabaseServer();

	await prefetchQuery(queryClient, getAllProperties(supabase));
	return (
		<div className="container mx-auto px-4 py-8">
			<HydrationBoundary state={dehydrate(queryClient)}>
				<PropertiesList />
			</HydrationBoundary>
		</div>
	);
}
