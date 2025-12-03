import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLElement> {
    variant?: "default" | "glass" | "gradient" | "outlined";
    tier?: "bronze" | "silver" | "gold" | "prismatic" | "amber" | null;
    hover?: boolean;
    padding?: "none" | "sm" | "md" | "lg" | "xl";
    rounded?: "sm" | "md" | "lg" | "xl" | "2xl";
    shadow?: "none" | "sm" | "md" | "lg" | "xl" | "2xl";
    as?: "div" | "article" | "section" | "a";
    href?: string;
    className?: string;
    children?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
    variant = "default",
    tier = null,
    hover = false,
    padding = "md",
    rounded = "lg",
    shadow = "md",
    as: Tag = "div",
    href,
    className = "",
    children,
    ...rest
}) => {
    // Estilos base según variante
    const variantClasses = {
        default: "bg-surface-dark border border-slate-700",
        glass: "bg-surface-dark/50 backdrop-blur-glass border border-slate-700/50",
        gradient:
            "bg-gradient-to-br from-surface-dark via-surface-darker to-surface-dark border border-slate-700",
        outlined: "bg-transparent border-2 border-slate-700",
    };

    // Padding
    const paddingClasses = {
        none: "",
        sm: "p-2",
        md: "p-4",
        lg: "p-6",
        xl: "p-8",
    };

    // Border radius
    const roundedClasses = {
        sm: "rounded",
        md: "rounded-md",
        lg: "rounded-lg",
        xl: "rounded-xl",
        "2xl": "rounded-2xl",
    };

    // Shadow
    const shadowClasses = {
        none: "",
        sm: "shadow-sm",
        md: "shadow-md",
        lg: "shadow-lg",
        xl: "shadow-xl",
        "2xl": "shadow-2xl",
    };

    // Tier border y efectos
    const tierClasses = tier
        ? {
            bronze: "tier-bronze border-2 backdrop-blur-[12px]",
            silver: "tier-silver border-2 backdrop-blur-[12px]",
            gold: "tier-gold border-2 backdrop-blur-[12px]",
            prismatic: "tier-prismatic border-2 backdrop-blur-[12px]",
            amber: "tier-amber border-2 backdrop-blur-[12px]",
        }[tier]
        : "";

    // Efectos hover
    const hoverClasses = hover
        ? "transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/20 hover:brightness-110 cursor-pointer group"
        : "";

    // Combinar todas las clases
    const classes = [
        variantClasses[variant],
        paddingClasses[padding],
        roundedClasses[rounded],
        shadowClasses[shadow],
        tierClasses,
        hoverClasses,
        "relative overflow-hidden",
        className,
    ]
        .filter(Boolean)
        .join(" ");

    // Create the element
    const Element = Tag as any;

    return (
        <Element className={classes} {...(Tag === "a" && href ? { href } : {})} {...rest} data-animate="true">
            {/* Glass reflection effect for gradient/glass variants */}
            {(variant === "gradient" || variant === "glass") && (
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            )}
            {children}
        </Element>
    );
};
