import { CreatePropertyDialog } from "@src/modules/properties/components/CreatePropertyDialog";

export const metadata = {
  title: "Propiedades",
  description: "Gestión de propiedades inmobiliarias",
};

export default function PropertiesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1>Propiedades</h1>
      <CreatePropertyDialog />
      {/* <Link href="/admin/properties/new">
				<Button>
					<Plus className="mr-2 h-4 w-4" />
					Nueva propiedad
				</Button>
			</Link> */}
    </div>
  );
}

