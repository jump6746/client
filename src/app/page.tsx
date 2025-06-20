import LocationMap from "@/widgets/map/ui/LocationMap";

export default function Home() {
  return (
    <div className="w-full h-full">
      <LocationMap width="100%" height="100%" zoom={10} />
    </div>
  );
}
