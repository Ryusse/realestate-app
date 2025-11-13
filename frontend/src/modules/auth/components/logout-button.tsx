"use client";

import { useRouter } from "next/navigation";

import { Button } from "@src/components/ui/button";
import useSupabaseBrowser from "@src/lib/utils/supabase-browser";

export function LogoutButton() {
	const router = useRouter();
	const supabase = useSupabaseBrowser();

	const logout = async () => {
		await supabase.auth.signOut();
		router.push("/login");
	};

	return (
		<Button onClick={logout} variant="ghost">
			Cerrar sesión
		</Button>
	);
}
