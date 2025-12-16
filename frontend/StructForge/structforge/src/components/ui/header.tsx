'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MenuToggleIcon } from '@/components/ui/menu-toggle-icon';
import { createPortal } from 'react-dom';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { ModeToggle } from '@/components/mode-toggle';
import {
    FolderTree,
    FileArchive,
    Terminal,
    Code,
    Users,
    Star,
    Handshake,
    FileText,
    Shield,
    RotateCcw,
    Leaf,
    HelpCircle,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// Type definition
type LinkItem = {
    title: string;
    href: string;
    icon: LucideIcon;
    description?: string;
};

// Header Component
export function Header() {
    const [open, setOpen] = React.useState(false);
    const scrolled = useScroll(10);

    React.useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [open]);

    return (
        <header
            className={cn('sticky top-0 z-50 w-full border-b border-transparent transition-all', {
                'bg-background/95 supports-[backdrop-filter]:bg-background/50 border-border backdrop-blur-lg':
                    scrolled,
            })}
        >
            <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6">

                {/* LEFT: Logo (Simple Text) */}
                <div className="flex items-center shrink-0">
                    <a href="/" className="hover:opacity-80 transition-opacity">
                        <span className="text-xl font-bold tracking-tight text-foreground">
                            StructForge
                        </span>
                    </a>
                </div>

                {/* CENTER: Navigation (Desktop) */}
                <div className="hidden md:flex flex-1 justify-center">
                    <NavigationMenu>
                        <NavigationMenuList className="gap-2">

                            {/* PRODUCT DROPDOWN */}
                            <NavigationMenuItem>
                                <NavigationMenuTrigger className="bg-transparent text-lg font-medium">Product</NavigationMenuTrigger>
                                <NavigationMenuContent className="bg-popover">
                                    <div className="grid w-[600px] grid-cols-2 gap-5 p-4">
                                        {/* Left Column: Actions */}
                                        <div className="flex flex-col gap-2">
                                            <h4 className="text-sm font-semibold leading-none text-muted-foreground mb-2 px-2">Actions</h4>
                                            <ul className="space-y-1">
                                                <ListItem
                                                    title="Convert Text → Directory"
                                                    href="#"
                                                    icon={FolderTree}
                                                    description="Generate folder structures from text"
                                                />
                                                <ListItem
                                                    title="ZIP → Tree"
                                                    href="#"
                                                    icon={FileArchive}
                                                    description="Visualize zip contents as tree"
                                                />
                                            </ul>
                                        </div>
                                        {/* Right Column: Downloads */}
                                        <div className="flex flex-col gap-2 border-l pl-4 border-border">
                                            <h4 className="text-sm font-semibold leading-none text-muted-foreground mb-2 px-2">Downloads</h4>
                                            <ul className="space-y-1">
                                                <ListItem
                                                    title="CLI"
                                                    href="#"
                                                    icon={Terminal}
                                                    description="Command line interface tool"
                                                />
                                                <ListItem
                                                    title="VS Code Extension"
                                                    href="#"
                                                    icon={Code}
                                                    description="Integrate directly into your editor"
                                                />
                                            </ul>
                                        </div>
                                    </div>
                                </NavigationMenuContent>
                            </NavigationMenuItem>

                            {/* COMPANY DROPDOWN */}
                            <NavigationMenuItem>
                                <NavigationMenuTrigger className="bg-transparent text-lg font-medium">Company</NavigationMenuTrigger>
                                <NavigationMenuContent className="bg-popover">
                                    <div className="grid w-[500px] grid-cols-2 gap-5 p-4">
                                        {/* Left Column: Main Links */}
                                        <ul className="space-y-2">
                                            {companyLinks.map((item, i) => (
                                                <li key={i}>
                                                    <ListItem {...item} />
                                                </li>
                                            ))}
                                        </ul>
                                        {/* Right Column: Secondary Links */}
                                        <ul className="space-y-2 border-l pl-4 border-border">
                                            {companyLinks2.map((item, i) => (
                                                <li key={i}>
                                                    <NavigationMenuLink
                                                        href={item.href}
                                                        className="flex p-2 hover:bg-accent hover:text-accent-foreground flex-row rounded-md items-center gap-x-3 transition-colors"
                                                    >
                                                        <item.icon className="text-muted-foreground size-4" />
                                                        <span className="font-medium text-sm">{item.title}</span>
                                                    </NavigationMenuLink>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </NavigationMenuContent>
                            </NavigationMenuItem>

                            <NavigationMenuItem>
                                <NavigationMenuLink className="px-4 py-2" asChild>
                                    <a href="#" className="hover:bg-accent hover:text-accent-foreground rounded-md text-lg font-medium transition-colors">
                                        Pricing
                                    </a>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>

                {/* RIGHT: Auth & Toggle */}
                <div className="hidden md:flex items-center gap-3">
                    <Button variant="ghost" className="text-base">Sign In</Button>
                    <Button className="text-base">Get Started</Button>
                    <div className="border-l pl-3 ml-1 border-border">
                        <ModeToggle />
                    </div>
                </div>

                {/* Mobile Menu Toggle */}
                <div className="flex items-center gap-2 md:hidden">
                    <ModeToggle />
                    <Button
                        size="icon"
                        variant="outline"
                        onClick={() => setOpen(!open)}
                        aria-expanded={open}
                        aria-controls="mobile-menu"
                        aria-label="Toggle menu"
                    >
                        <MenuToggleIcon open={open} className="size-5" duration={300} />
                    </Button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <MobileMenu open={open} className="flex flex-col gap-4 overflow-y-auto pt-8">
                <div className="flex flex-col gap-y-4">
                    <div className="pb-4 border-b">
                        <span className="text-sm font-semibold text-muted-foreground mb-2 block">Actions</span>
                        <ListItem title="Convert Text → Directory" href="#" icon={FolderTree} />
                        <ListItem title="ZIP → Tree" href="#" icon={FileArchive} />
                    </div>

                    <div className="pb-4 border-b">
                        <span className="text-sm font-semibold text-muted-foreground mb-2 block">Downloads</span>
                        <ListItem title="CLI" href="#" icon={Terminal} />
                        <ListItem title="VS Code Extension" href="#" icon={Code} />
                    </div>

                    <div className="pb-4">
                        <span className="text-sm font-semibold text-muted-foreground mb-2 block">Company</span>
                        {companyLinks.map((link) => (
                            <ListItem key={link.title} {...link} />
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-3 mt-auto pb-6">
                    <Button variant="outline" className="w-full justify-center">
                        Sign In
                    </Button>
                    <Button className="w-full justify-center">Get Started</Button>
                </div>
            </MobileMenu>
        </header>
    );
}

// ----------------------------------------------------------------------
// Helper Components & Data
// ----------------------------------------------------------------------

type MobileMenuProps = React.ComponentProps<'div'> & {
    open: boolean;
};

function MobileMenu({ open, children, className, ...props }: MobileMenuProps) {
    if (!open || typeof window === 'undefined') return null;

    return createPortal(
        <div
            id="mobile-menu"
            className={cn(
                'bg-background/95 supports-[backdrop-filter]:bg-background/50 backdrop-blur-lg',
                'fixed top-16 right-0 bottom-0 left-0 z-40 flex flex-col overflow-hidden border-t md:hidden',
            )}
        >
            <div
                data-slot={open ? 'open' : 'closed'}
                className={cn(
                    'data-[slot=open]:animate-in data-[slot=open]:slide-in-from-top-5 ease-out',
                    'size-full p-6',
                    className,
                )}
                {...props}
            >
                {children}
            </div>
        </div>,
        document.body,
    );
}

function ListItem({
    title,
    description,
    icon: Icon,
    className,
    href,
    ...props
}: React.ComponentProps<typeof NavigationMenuLink> & LinkItem) {
    return (
        <NavigationMenuLink className={cn('block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground', className)} {...props} asChild>
            <a href={href} className="flex items-center gap-3">
                <div className="flex items-center justify-center shrink-0">
                    <Icon className="h-5 w-5 text-foreground" />
                </div>
                <div className="flex flex-col gap-0.5">
                    <div className="text-sm font-medium leading-none text-foreground">{title}</div>
                    {description && <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">{description}</p>}
                </div>
            </a>
        </NavigationMenuLink>
    );
}

const companyLinks: LinkItem[] = [
    { title: 'About Us', href: '#', description: 'Learn more about our story and team', icon: Users },
    { title: 'Customer Stories', href: '#', description: 'See how we’ve helped our clients succeed', icon: Star },
    { title: 'Partnerships', href: '#', icon: Handshake, description: 'Collaborate with us for mutual growth' },
];

const companyLinks2: LinkItem[] = [
    { title: 'Terms of Service', href: '#', icon: FileText },
    { title: 'Privacy Policy', href: '#', icon: Shield },
    { title: 'Refund Policy', href: '#', icon: RotateCcw },
    { title: 'Blog', href: '#', icon: Leaf },
    { title: 'Help Center', href: '#', icon: HelpCircle },
];

function useScroll(threshold: number) {
    const [scrolled, setScrolled] = React.useState(false);
    const onScroll = React.useCallback(() => {
        setScrolled(window.scrollY > threshold);
    }, [threshold]);

    React.useEffect(() => {
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, [onScroll]);

    React.useEffect(() => {
        onScroll();
    }, [onScroll]);

    return scrolled;
}