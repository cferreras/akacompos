import React from 'react';

interface SectionProps {
    title?: string;
    subtitle?: string;
    id?: string;
    spacing?: 'none' | 'sm' | 'md' | 'lg';
    className?: string;
    children?: React.ReactNode;
}

export const Section: React.FC<SectionProps> = ({
    title,
    subtitle,
    id,
    spacing = 'lg',
    className = '',
    children,
}) => {
    const spacingClasses = {
        none: 'py-0',
        sm: 'py-4',
        md: 'py-6',
        lg: 'py-8',
    };

    const classes = [
        spacingClasses[spacing],
        className,
    ].filter(Boolean).join(' ');

    return (
        <section className={classes} id={id}>
            <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-xl">
                {(title || subtitle) && (
                    <div className="mb-6">
                        {title && (
                            <h2 className="text-xl font-semibold text-white mb-2">
                                {title}
                            </h2>
                        )}
                        {subtitle && (
                            <p className="text-slate-400 text-sm">
                                {subtitle}
                            </p>
                        )}
                    </div>
                )}
                {children}
            </div>
        </section>
    );
};
