import type * as React from "react"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  )
}

export const showEmpathicToast = {
  success: (message: string, name?: string) => {
    const personalizedMessage = name ? message.replace("You", name) : message
    return personalizedMessage
  },

  encouragement: (name?: string) => {
    const messages = [
      `Great job, ${name || "there"}! Every entry helps us understand your health better.`,
      `Nice work! Your consistency is building a clear picture of your progress.`,
      `Well done! You're taking such good care of yourself.`,
    ]
    return messages[Math.floor(Math.random() * messages.length)]
  },

  gentle_reminder: (action: string, name?: string) => {
    return `No pressure, ${name || "there"} - just a gentle reminder to ${action} when you're ready.`
  },
}

export { Toaster }
