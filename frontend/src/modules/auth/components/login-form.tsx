"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@src/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@src/components/ui/form";
import { Input } from "@src/components/ui/input";
import { Spinner } from "@src/components/ui/spinner";
import { paths } from "@src/lib/paths";
import useSupabaseBrowser from "@src/lib/utils/supabase-browser";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { type LoginFormData, loginSchema } from "../schemas/login";

type LoginFormProps = {
	heading?: string;
	buttonText?: string;
	onSubmit?: (data: LoginFormData) => Promise<void> | void;
	redirectTo?: string;
};

export default function LoginForm({
	heading = "RedProp",
	buttonText = "Iniciar Sesión",
	redirectTo,
}: LoginFormProps) {
	const form = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const router = useRouter();
	const supabase = useSupabaseBrowser();

	const handleSubmit = async (data: LoginFormData) => {
		const { email, password } = data;

		try {
			const { error, data: authData } = await supabase.auth.signInWithPassword({
				email,
				password,
			});

			if (error) {
				toast.error(error.message);
				return;
			}

			if (authData.session) {
				toast.success("Sesión iniciada correctamente");
				const redirect = redirectTo || paths.dashboard();
				router.push(redirect);
			}
		} catch (error) {
			console.log(error instanceof Error ? error.message : "An error occurred");
			toast.error("Error al iniciar sesión");
		}
	};

	return (
		<div className="border-muted bg-background grid items-center gap-y-4 rounded-md border px-6 py-8 shadow-md">
			{heading && <h1 className="text-xl font-semibold">{heading}</h1>}

			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(handleSubmit)}
					className="w-full space-y-4"
				>
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Correo electrónico</FormLabel>
								<FormControl>
									<Input
										type="email"
										placeholder="correo@ejemplo.com"
										className="text-sm"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Contraseña</FormLabel>
								<FormControl>
									<Input
										type="password"
										placeholder="Tu contraseña"
										className="text-sm"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button
						type="submit"
						className="w-full"
						disabled={form.formState.isSubmitting}
					>
						{form.formState.isSubmitting && <Spinner />}
						{form.formState.isSubmitting ? "Iniciando..." : buttonText}
					</Button>
				</form>
			</Form>
			<p className="text-sm text-center">
				Aun no tienes cuenta?
				<Button asChild className="font-semibold px-2 py-0" variant="link">
					<Link href={paths.auth.register()}>Registrate</Link>
				</Button>
			</p>
		</div>
	);
}
