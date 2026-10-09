import { Toaster as Sonner } from "sonner";
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({
  ...props
}) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      icons={{
        success: (
          <CircleCheckIcon className="size-4" />
        ),
        info: (
          <InfoIcon className="size-4" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4" />
        ),
        error: (
          <OctagonXIcon className="size-4" />
        ),
        loading: (
          <Loader2Icon className="size-4 animate-spin" />
        ),
      }}
      style={
        {
          "--normal-bg": "hsl(var(--card))",
          "--normal-text": "hsl(var(--card-foreground))",
          "--normal-border": "hsl(var(--border))",
          "--success-bg": "hsl(var(--card))",
          "--success-text": "hsl(var(--primary))",
          "--success-border": "hsl(var(--primary) / 0.4)",
          "--error-bg": "hsl(var(--card))",
          "--error-text": "hsl(var(--destructive))",
          "--error-border": "hsl(var(--destructive) / 0.4)",
          "--warning-bg": "hsl(var(--card))",
          "--warning-text": "hsl(var(--secondary))",
          "--warning-border": "hsl(var(--secondary) / 0.4)",
          "--info-bg": "hsl(var(--card))",
          "--info-text": "hsl(var(--primary))",
          "--info-border": "hsl(var(--primary) / 0.4)",
          "--border-radius": "var(--radius)"
        }
      }
      toastOptions={{
        classNames: {
          toast: "border shadow-lg",
          title: "text-foreground",
          description: "text-muted-foreground",
          closeButton: "bg-background text-muted-foreground hover:bg-muted hover:text-foreground",
        },
      }}
      {...props}
    />
  );
}

export { Toaster }
