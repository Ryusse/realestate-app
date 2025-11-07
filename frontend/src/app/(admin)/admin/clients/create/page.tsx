// type CreateClientPageProps = {
// 	client: {
// 		name: string;
// 		email: string;
// 		number: string;
// 	};
// 	handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
// 	handleAddClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
// };

export default function CreatetPage() {
	return (
		<h1>Crear cliente</h1>
		// <Dialog>
		//   <form>
		//     <DialogTrigger asChild>
		//       <Button variant="outline">Crear cliente</Button>
		//     </DialogTrigger>
		//     <DialogContent className="sm:max-w-[425px]">
		//       <DialogHeader>
		//         <DialogTitle>Creacion del cliente</DialogTitle>
		//         <DialogDescription>
		//           Ingrese los detalles del nuevo inquilino
		//         </DialogDescription>
		//       </DialogHeader>
		//       <div className="grid gap-4">
		//         <div className="grid gap-3">
		//           <Label htmlFor="name">Nombre</Label>
		//           <Input type="text" id="name" name="name" placeholder="Pedro Duarte" value={client.name} onChange={handleChange} />
		//         </div>
		//         <div className="grid gap-3">
		//           <Label htmlFor="email">Email</Label>
		//           <Input type="email" id="email" name="email" placeholder="peduarte@example.com" value={client.email} onChange={handleChange} />
		//         </div>
		//         <div className="grid gap-3">
		//           <Label htmlFor="number">Número</Label>
		//           <Input type="text" name="number" id="number" placeholder="04156218952" value={client.number} onChange={handleChange} />
		//         </div>
		//       </div>
		//       <DialogFooter>
		//           <Button onClick={handleAddClick} type="submit">Guardar</Button>
		//         <DialogClose asChild>
		//         <Button variant="outline">Cancelar</Button>
		//         </DialogClose>
		//       </DialogFooter>
		//     </DialogContent>
		//   </form>
		// </Dialog>
	);
}
