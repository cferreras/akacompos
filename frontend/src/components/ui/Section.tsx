import React from 'react';

interface SectionProps {
    title?: string;
    subtitle?: string;
    id?: string;
    variant?: 'default' | 'gradient' | 'glass' | 'bordered';
    spacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
    divider?: boolean;
    dividerPosition?: 'top' | 'bottom' | 'both';
    className?: string;
    children?: React.ReactNode;
}

export const Section: React.FC<SectionProps> = ({
    title,
    subtitle,
    id,
    variant = 'default',
    spacing = 'lg',
    divider = false,
    dividerPosition = 'bottom',
    className = '',
    children,
}) => {
    // Estilos base según variante
    const variantClasses = {
        default: '',
        gradient: 'bg-gradient-to-b from-transparent via-primary/5 to-transparent',
        glass: 'bg-surface-dark/30 backdrop-blur-glass border-y border-slate-700/50',
        bordered: 'border-y-2 border-slate-700',
    };

    // Espaciado
    const spacingClasses = {
        none: 'py-0',
        sm: 'py-4 sm:py-6',
        md: 'py-6 sm:py-8 lg:py-12',
        lg: 'py-8 sm:py-12 lg:py-16',
        xl: 'py-12 sm:py-16 lg:py-24',
    };

    // Mostrar divisor superior
    const showTopDivider = divider && (dividerPosition === 'top' || dividerPosition === 'both');

    // Mostrar divisor inferior
    const showBottomDivider = divider && (dividerPosition === 'bottom' || dividerPosition === 'both');

    // Combinar todas las clases
    const classes = [
        'relative',
        variantClasses[variant],
        spacingClasses[spacing],
        className,
    ].filter(Boolean).join(' ');

    return (
        <section className={classes} id={id}>
            {showTopDivider && (
                <div className="absolute left-0 right-0 top-0 h-px overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
                </div>
            )}

            <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-xl">
                {(title || subtitle) && (
                    <div className="mb-12 sm:mb-16 lg:mb-24">
                        {title && (
                            <div className="flex items-center gap-4 mb-6">
                                <h2 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-white to-primary leading-[1.2] tracking-tight">
                                    {title}
                                </h2>
                                <div className="h-px flex-1 bg-gradient-to-r from-primary/30 to-transparent"></div>
                            </div>
                        )}
                        {subtitle && (
                            <p className="text-base sm:text-lg text-slate-400 mb-8 max-w-3xl leading-[1.6]">
                                {subtitle}
                            </p>
                        )}
                    </div>
                )}

                <div>
                    {children}
                </div>
            </div>

            {showBottomDivider && (
                <div className="absolute left-0 right-0 bottom-0 h-px overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
                </div>
            )}
        </section>
    );
};
