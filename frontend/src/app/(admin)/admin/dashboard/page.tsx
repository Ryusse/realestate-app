import { redirect } from "next/navigation";

import useSupabaseServer from "@src/lib/utils/supabase-server";

export const metadata = {
	title: "Dashboard",
	description: "Gestión de propiedades inmobiliarias",
};

export default async function DashboardPage() {
	const supabase = await useSupabaseServer();

	const { data, error } = await supabase.auth.getClaims();

	if (error || !data?.claims) {
		redirect("/login");
	}
	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-4xl font-semibold">
				Hola {data.claims.user_metadata?.first_name}
			</h1>
			{/* Solo para debug, por que de momento no se como funciona lo del tipado de supabase en frontend 😼 */}
			{/* <div className="flex flex-col gap-2 items-start">
				<h2 className="font-bold text-2xl mb-4">Your user details</h2>
				<pre className="text-xs font-mono p-3 rounded border max-h-32 overflow-auto">
					{JSON.stringify(data.claims, null, 2)}
				</pre>
			</div> */}
		</div>
	);
}
