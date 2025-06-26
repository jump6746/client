import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

const Badge = ({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> & { asChild?: boolean }) => {
  const Comp = asChild ? Slot : "span";

  return <Comp data-slot="badge" className={className} {...props} />;
};

export { Badge };
