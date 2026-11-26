'use client'

import { Command as CommandPrimitive } from 'cmdk'
import { SearchIcon } from 'lucide-react'
import type * as React from 'react'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

function Command({
	className,
	...props
}: React.ComponentProps<typeof CommandPrimitive>) {
	return (
		<CommandPrimitive
			data-slot="command"
			className={cn(
				'flex h-full w-full flex-col overflow-hidden rounded-[8px] bg-surface text-foreground',
				className
			)}
			{...props}
		/>
	)
}

function CommandDialog({
	title = 'Command Palette',
	description = 'Search the site…',
	children,
	className,
	showCloseButton = false,
	filter,
	shouldFilter,
	...props
}: React.ComponentProps<typeof Dialog> & {
	title?: string
	description?: string
	className?: string
	showCloseButton?: boolean
	filter?: React.ComponentProps<typeof CommandPrimitive>['filter']
	shouldFilter?: boolean
}) {
	return (
		<Dialog {...props}>
			<DialogHeader className="sr-only">
				<DialogTitle>{title}</DialogTitle>
				<DialogDescription>{description}</DialogDescription>
			</DialogHeader>
			<DialogContent
				data-slot="command-dialog"
				className={cn(
					'top-[min(20vh,8rem)] translate-y-0 overflow-hidden p-0 outline-none ring-0 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 sm:max-w-xl',
					className
				)}
				showCloseButton={showCloseButton}
			>
				<Command
					filter={filter}
					shouldFilter={shouldFilter}
					className="**:data-[slot=command-input-wrapper]:h-14 [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.18em] [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]]:px-1.5 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-input]]:h-14 [&_[cmdk-item]]:px-3 [&_[cmdk-item]]:py-2.5"
				>
					{children}
				</Command>
			</DialogContent>
		</Dialog>
	)
}

function CommandInput({
	className,
	...props
}: React.ComponentProps<typeof CommandPrimitive.Input>) {
	return (
		<div
			data-slot="command-input-wrapper"
			className="flex h-14 items-center gap-3 border-b border-line px-4"
		>
			<SearchIcon className="size-4 shrink-0 text-accent" strokeWidth={1.75} />
			<CommandPrimitive.Input
				data-slot="command-input"
				className={cn(
					'flex h-14 w-full bg-transparent py-3 font-display text-[17px] outline-none ring-0 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 placeholder:text-muted-foreground/70 disabled:cursor-not-allowed disabled:opacity-50',
					className
				)}
				{...props}
			/>
		</div>
	)
}

function CommandList({
	className,
	...props
}: React.ComponentProps<typeof CommandPrimitive.List>) {
	return (
		<CommandPrimitive.List
			data-slot="command-list"
			className={cn(
				'max-h-[min(60vh,22rem)] scroll-py-2 overflow-x-hidden overflow-y-auto overscroll-contain [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden',
				className
			)}
			{...props}
		/>
	)
}

function CommandEmpty({
	...props
}: React.ComponentProps<typeof CommandPrimitive.Empty>) {
	return (
		<CommandPrimitive.Empty
			data-slot="command-empty"
			className="py-10 text-center text-sm text-muted-foreground"
			{...props}
		/>
	)
}

function CommandGroup({
	className,
	...props
}: React.ComponentProps<typeof CommandPrimitive.Group>) {
	return (
		<CommandPrimitive.Group
			data-slot="command-group"
			className={cn(
				'overflow-hidden p-1.5 text-foreground [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.18em] [&_[cmdk-group-heading]]:text-muted-foreground',
				className
			)}
			{...props}
		/>
	)
}

function CommandSeparator({
	className,
	...props
}: React.ComponentProps<typeof CommandPrimitive.Separator>) {
	return (
		<CommandPrimitive.Separator
			data-slot="command-separator"
			className={cn('-mx-1 h-px bg-line', className)}
			{...props}
		/>
	)
}

function CommandItem({
	className,
	...props
}: React.ComponentProps<typeof CommandPrimitive.Item>) {
	return (
		<CommandPrimitive.Item
			data-slot="command-item"
			className={cn(
				'group relative flex cursor-default items-center gap-3 rounded-[6px] px-3 py-2.5 text-sm outline-none ring-0 select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 data-[selected=true]:bg-accent-soft data-[selected=true]:text-accent focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4 [&_svg:not([class*="text-"])]:text-muted-foreground data-[selected=true]:[&_svg:not([class*="text-"])]:text-accent',
				className
			)}
			{...props}
		/>
	)
}

function CommandShortcut({
	className,
	...props
}: React.ComponentProps<'span'>) {
	return (
		<span
			data-slot="command-shortcut"
			className={cn(
				'ml-auto font-mono text-[11px] tracking-[0.12em] text-muted-foreground',
				className
			)}
			{...props}
		/>
	)
}

export {
	Command,
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
	CommandShortcut
}
