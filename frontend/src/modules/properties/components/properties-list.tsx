"use client";

import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@src/components/ui/card";
import { getAllProperties } from "@src/lib/queries/properties/get-all-properties";
import useSupabaseBrowser from "@src/lib/utils/supabase-browser";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";

export default function PropertiesList() {
	const supabase = useSupabaseBrowser();

	const { data: properties } = useQuery(getAllProperties(supabase));

	return (
		<section className="grid gap-6">
			<h1 className="text-3xl font-semibold">Lista de propiedades</h1>

			<div className="grid lg:grid-cols-3 grid-cols-2 gap-4">
				{properties &&
					properties.length > 0 &&
					properties?.map((propertie) => (
						<Card key={propertie.id}>
							<CardHeader>
								<CardTitle>{propertie.title}</CardTitle>
								<CardDescription>{propertie.description}</CardDescription>
							</CardHeader>
						</Card>
					))}
			</div>
		</section>
	);
}
