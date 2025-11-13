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

import { type RegisterFormData, registerSchema } from "../schemas/register";

type RegisterFormProps = {
	heading?: string;
	buttonText?: string;
	onSubmit?: (data: RegisterFormData) => Promise<void> | void;
	redirectTo?: string;
};

export default function RegisterForm({
	heading = "RedProp",
	buttonText = "Registrarse",
	redirectTo,
}: RegisterFormProps) {
	const form = useForm<RegisterFormData>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			email: "",
			password: "",
			firstName: "",
			lastName: "",
		},
	});

	const router = useRouter();
	const supabase = useSupabaseBrowser();

	const handleSubmit = async (data: RegisterFormData) => {
		const { email, password, firstName, lastName } = data;

		try {
			const { error, data } = await supabase.auth.signUp({
				email,
				password,
				options: {
					emailRedirectTo: `${window.location.origin}/admin`,
					data: {
						first_name: firstName,
						last_name: lastName,
					},
				},
			});
			if (error) throw error;

			if (data.user?.aud === "authenticated") {
				toast.error("El correo ya esta registrado");

				throw new Error("User already exists");
			}

			toast.success("Registrado correctamente");

			const redirect = redirectTo || paths.dashboard();
			router.push(redirect);
		} catch (error: unknown) {
			console.log(error instanceof Error ? error.message : "An error occurred");
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
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<FormField
							control={form.control}
							name="firstName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Nombre</FormLabel>
									<FormControl>
										<Input
											type="text"
											placeholder="Tu nombre"
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
							name="lastName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Apellido</FormLabel>
									<FormControl>
										<Input
											type="text"
											placeholder="Tu apellido"
											className="text-sm"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

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

					{/* <FormField
						control={form.control}
						name="role"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Tipo de cuenta</FormLabel>
								<FormControl>
									<ButtonGroup className="w-full">
										<Button
											type="button"
											variant={field.value === "AGENTE" ? "default" : "outline"}
											className="flex-1"
											onClick={() => field.onChange("AGENTE")}
										>
											Agente
										</Button>
										<Button
											type="button"
											variant={field.value === "ADMIN" ? "default" : "outline"}
											className="flex-1"
											onClick={() => field.onChange("ADMIN")}
										>
											Propietario
										</Button>
									</ButtonGroup>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/> */}

					<Button
						type="submit"
						className="w-full"
						disabled={form.formState.isSubmitting}
					>
						{form.formState.isSubmitting && <Spinner />}
						{form.formState.isSubmitting ? "Creando cuenta..." : buttonText}
					</Button>
				</form>
			</Form>
			<p className="text-sm text-center">
				Ya tienes cuenta?
				<Button asChild className="font-semibold px-2 py-0" variant="link">
					<Link href={paths.auth.login()}>Inicia sesión</Link>
				</Button>
			</p>
		</div>
	);
}
