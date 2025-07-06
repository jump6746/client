import { Navigation } from "@/widgets/navigation/ui";

const MyLayout = ({
                      children,
                    }: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="flex flex-col h-full">
      <main className="flex-1 overflow-auto">{children}</main>
      <Navigation />
    </div>
  );
};

export default MyLayout;
