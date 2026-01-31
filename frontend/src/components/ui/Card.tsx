import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLElement> {
    variant?: "default" | "glass" | "outlined";
    padding?: "none" | "sm" | "md" | "lg" | "xl";
    rounded?: "sm" | "md" | "lg" | "xl";
    hover?: boolean;
    as?: "div" | "article" | "section" | "a";
    href?: string;
    className?: string;
    children?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
    variant = "default",
    padding = "md",
    rounded = "lg",
    hover = false,
    as: Tag = "div",
    href,
    className = "",
    children,
    ...rest
}) => {
    const variantClasses = {
        default: "bg-slate-900 border border-white/5",
        glass: "bg-slate-800/50 border border-white/10",
        outlined: "bg-transparent border border-white/10",
    };

    const paddingClasses = {
        none: "",
        sm: "p-3",
        md: "p-4",
        lg: "p-6",
        xl: "p-8",
    };

    const roundedClasses = {
        sm: "rounded",
        md: "rounded-md",
        lg: "rounded-lg",
        xl: "rounded-xl",
    };

    const hoverClasses = hover
        ? "transition-all duration-200 hover:border-white/20 hover:-translate-y-0.5 cursor-pointer"
        : "";

    const classes = [
        variantClasses[variant],
        paddingClasses[padding],
        roundedClasses[rounded],
        hoverClasses,
        "overflow-hidden",
        className,
    ]
        .filter(Boolean)
        .join(" ");

    const Element = Tag as any;

    return (
        <Element className={classes} {...(Tag === "a" && href ? { href } : {})} {...rest}>
            {children}
        </Element>
    );
};
