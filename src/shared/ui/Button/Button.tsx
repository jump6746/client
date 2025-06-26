import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

const Button = ({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> & {
  asChild?: boolean;
}) => {
  const Comp = asChild ? Slot : "button";

  return <Comp data-slot="button" className={className} {...props} />;
};

export default Button;
