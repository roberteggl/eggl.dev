import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
	'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-none text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
	{
		variants: {
			variant: {
				default:
					'bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground',
				secondary: 'bg-accent text-accent-foreground hover:bg-accent-light',
				outline:
					'border border-line bg-transparent text-foreground hover:border-accent hover:text-accent',
				ghost: 'text-foreground/80 hover:bg-surface-2 hover:text-foreground',
				link: 'text-accent underline-offset-4 underline decoration-accent/30 hover:decoration-accent rounded-none px-0',
				destructive:
					'bg-destructive text-destructive-foreground hover:bg-destructive/90'
			},
			size: {
				default: 'h-11 px-6 py-2.5',
				sm: 'h-9 px-4 text-[13px]',
				lg: 'h-[52px] px-8 py-3.5 text-[15px]',
				icon: 'h-10 w-10'
			}
		},
		defaultVariants: {
			variant: 'default',
			size: 'default'
		}
	}
)

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, size, asChild = false, ...props }, ref) => {
		const Comp = asChild ? Slot : 'button'
		return (
			<Comp
				className={cn(buttonVariants({ variant, size, className }))}
				ref={ref}
				{...props}
			/>
		)
	}
)
Button.displayName = 'Button'

export { Button, buttonVariants }
