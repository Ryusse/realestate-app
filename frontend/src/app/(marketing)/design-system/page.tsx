"use client";

import {
	AcademicCapIcon,
	BeakerIcon,
	BellIcon,
	BookmarkIcon,
	CakeIcon,
	CameraIcon,
	ChatBubbleLeftIcon,
	ClockIcon,
	CloudIcon,
	CogIcon,
	CubeIcon,
	FaceSmileIcon,
	FireIcon,
	GlobeAltIcon,
	HeartIcon,
	HomeIcon,
	LightBulbIcon,
	MapPinIcon,
	MusicalNoteIcon,
	RocketLaunchIcon,
} from "@heroicons/react/24/outline";
import MainLayout from "@src/components/layouts/main-layout";
import { Heading } from "@src/components/ui/heading";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@src/components/ui/tabs";
import { Text } from "@src/components/ui/text";

export default function StylePage() {
	const icons = [
		{ Icon: AcademicCapIcon, name: "Academic Cap" },
		{ Icon: BeakerIcon, name: "Beaker" },
		{ Icon: BellIcon, name: "Bell" },
		{ Icon: BookmarkIcon, name: "Bookmark" },
		{ Icon: CakeIcon, name: "Cake" },
		{ Icon: CameraIcon, name: "Camera" },
		{ Icon: ChatBubbleLeftIcon, name: "Chat" },
		{ Icon: ClockIcon, name: "Clock" },
		{ Icon: CloudIcon, name: "Cloud" },
		{ Icon: CogIcon, name: "Cog" },
		{ Icon: CubeIcon, name: "Cube" },
		{ Icon: FaceSmileIcon, name: "Face Smile" },
		{ Icon: FireIcon, name: "Fire" },
		{ Icon: GlobeAltIcon, name: "Globe" },
		{ Icon: HeartIcon, name: "Heart" },
		{ Icon: HomeIcon, name: "Home" },
		{ Icon: LightBulbIcon, name: "Light Bulb" },
		{ Icon: MapPinIcon, name: "Map Pin" },
		{ Icon: MusicalNoteIcon, name: "Musical Note" },
		{ Icon: RocketLaunchIcon, name: "Rocket Launch" },
	];

	return (
		<MainLayout as="main" className="space-y-8 py-10">
			<div>
				<Heading as="h1" variant="h3">
					Design System
				</Heading>
				<Text variant="large" className="mt-2">
					Explore the design system components and styles
				</Text>
			</div>

			<Tabs defaultValue="typography" className="w-full">
				<TabsList>
					<TabsTrigger value="typography">Typography</TabsTrigger>
					<TabsTrigger value="icons">Icons</TabsTrigger>
				</TabsList>

				<TabsContent value="typography" className="space-y-6 pt-6">
					<div className="space-y-4">
						<Heading as="h2" variant="h3" className="border-b border-b-border">
							Headings
						</Heading>
						<div className="space-y-3">
							<Heading variant="h1">Heading 1</Heading>
							<Heading variant="h2">Heading 2</Heading>
							<Heading variant="h3">Heading 3</Heading>
						</div>
					</div>

					<div className="space-y-4">
						<Heading as="h2" variant="h3" className="border-b border-b-border">
							Text Variants
						</Heading>
						<div className="space-y-3">
							<Text variant="large">
								Large text - Lorem ipsum dolor sit amet
							</Text>
							<Text variant="body">Body text - Lorem ipsum dolor sit amet</Text>
							<Text variant="small">
								Small text - Lorem ipsum dolor sit amet
							</Text>
							<Text variant="tiny">Tiny text - Lorem ipsum dolor sit amet</Text>
						</div>
					</div>
				</TabsContent>

				<TabsContent value="icons" className="pt-6">
					<div className="space-y-4">
						<Heading as="h2" variant="h3" className="border-b border-b-border">
							Heroicons Collection
						</Heading>
						<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
							{icons.map(({ Icon, name }) => (
								<div
									key={name}
									className="flex flex-col items-center gap-2 rounded-lg border p-4 transition-colors hover:bg-accent"
								>
									<Icon className="size-8" />
									<Text variant="tiny" align="center">
										{name}
									</Text>
								</div>
							))}
						</div>
					</div>
				</TabsContent>
			</Tabs>
		</MainLayout>
	);
}
