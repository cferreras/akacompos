import React, { useState, useMemo } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/es';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Section } from '../ui/Section';
import { championAssets } from '../../utils/assets';

// Configurar dayjs
dayjs.locale('es');
dayjs.extend(utc);
dayjs.extend(relativeTime);

interface Composition {
    id: number;
    title: string;
    slug: string;
    tier: string;
    tags: string | string[];
    cover?: string;
    updatedAt?: string;
    createdAt?: string;
    [key: string]: any;
}

interface CompositionListProps {
    compositions: Composition[];
}

const tierOrder = ["S Tier", "A Tier", "B Tier", "C Tier"];

export const CompositionList: React.FC<CompositionListProps> = ({ compositions }) => {
    const [filter, setFilter] = useState<string>('all');

    // Extract all unique tags
    const allTags = useMemo(() => {
        const tags = new Set<string>();
        compositions.forEach(comp => {
            if (Array.isArray(comp.tags)) {
                comp.tags.forEach(t => tags.add(t));
            } else if (typeof comp.tags === 'string') {
                comp.tags.split(',').map(t => t.trim()).forEach(t => tags.add(t));
            }
        });
        return Array.from(tags).sort();
    }, [compositions]);

    // Filter compositions
    const filteredCompositions = useMemo(() => {
        if (filter === 'all') return compositions;
        return compositions.filter(comp => {
            if (Array.isArray(comp.tags)) {
                return comp.tags.includes(filter);
            } else if (typeof comp.tags === 'string') {
                return comp.tags.includes(filter);
            }
            return false;
        });
    }, [compositions, filter]);

    // Group by tier
    const compositionsByTier = useMemo(() => {
        return filteredCompositions.reduce((acc, comp) => {
            const tier = comp.tier;
            if (!acc[tier]) {
                acc[tier] = [];
            }
            acc[tier].push(comp);
            return acc;
        }, {} as Record<string, Composition[]>);
    }, [filteredCompositions]);

    // Helper functions
    const getTierBadgeVariant = (tier: string) => {
        switch (tier) {
            case "S Tier": return "primary";
            case "A Tier": return "success";
            case "B Tier": return "warning";
            case "C Tier": return "default";
            default: return "default";
        }
    };

    const getCardTier = (tier: string) => {
        switch (tier) {
            case "S Tier": return "prismatic";
            case "A Tier": return "gold";
            case "B Tier": return "silver";
            case "C Tier": return "bronze";
            default: return null;
        }
    };

    const getTagVariant = (tag: string) => {
        const lowerTag = tag.toLowerCase();
        if (lowerTag.includes("fast")) return "fast";
        if (lowerTag.includes("reroll")) return "reroll";
        if (lowerTag.includes("aggressive") || lowerTag.includes("agresivo")) return "aggressive";
        if (lowerTag.includes("defensive") || lowerTag.includes("defensivo")) return "defensive";
        return "primary";
    };

    const formatTags = (tags: any): string[] => {
        if (typeof tags === "string") {
            return tags.split(",").map((tag: string) => tag.trim()).slice(0, 3);
        } else if (Array.isArray(tags)) {
            return tags.slice(0, 3);
        }
        return [];
    };

    const getUpdateTime = (composition: any) => {
        return dayjs(composition.updatedAt || composition.createdAt).utc().fromNow();
    };

    return (
        <>
            {/* Filter Section */}
            {allTags.length > 0 && (
                <Section spacing="md">
                    <div className="flex flex-wrap gap-2">
                        <button
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${filter === 'all'
                                ? 'bg-primary text-white shadow-lg shadow-primary/25 capitalize'
                                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700 hover:text-white border border-slate-700/50 capitalize'
                                }`}
                            onClick={() => setFilter('all')}
                        >
                            Todos
                        </button>
                        {allTags.map((tag) => (
                            <button
                                key={tag}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${filter === tag
                                    ? 'bg-primary text-white shadow-lg shadow-primary/25 capitalize'
                                    : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700 hover:text-white border border-slate-700/50 capitalize'
                                    }`}
                                onClick={() => setFilter(tag)}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </Section>
            )}

            {/* Compositions List */}
            {tierOrder.map((tier) => {
                const tieredComps = compositionsByTier[tier] || [];
                if (tieredComps.length === 0) return null;

                return (
                    <Section
                        key={tier}
                        title={tier}
                        spacing="lg"
                        variant="default"
                        id={tier.toLowerCase().replace(" ", "-")}
                    >
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-8">
                            {tieredComps.map((comp) => (
                                <Card
                                    key={comp.id}
                                    as="a"
                                    href={`/compositions/${comp.slug}`}
                                    variant="gradient"
                                    hover={true}
                                    rounded="xl"
                                    shadow="lg"
                                    padding="none"
                                    tier={getCardTier(tier)}
                                    className="group h-full"
                                >
                                    <div className="relative h-full aspect-[16/9] overflow-hidden">
                                        {/* Cover Image */}
                                        {comp.cover ? (
                                            <img
                                                src={comp.cover}
                                                alt={comp.title}
                                                className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                                                loading="lazy"
                                                decoding="async"
                                            />
                                        ) : (
                                            <img
                                                src={championAssets.Aatrox.src}
                                                alt={comp.title}
                                                className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                                                width={480}
                                                height={270}
                                                loading="lazy"
                                                decoding="async"
                                            />
                                        )}

                                        {/* Gradient Overlay - Darker at bottom for text readability */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent z-10" />
                                        
                                        {/* Bottom Fade/Blur Area */}
                                        <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent z-10" />

                                        {/* Tier Badge Overlay */}
                                        <div className="absolute top-3 left-3 z-20">
                                            <Badge
                                                variant={getTierBadgeVariant(tier) as any}
                                                icon="star"
                                                size="sm"
                                                className="shadow-lg"
                                            >
                                                {tier}
                                            </Badge>
                                        </div>

                                        {/* Content Overlay */}
                                        <div className="absolute inset-0 flex flex-col justify-end p-5 z-20">
                                            <h3 className="text-xl font-bold text-white mb-2 line-clamp-1 group-hover:text-primary transition-colors duration-300 drop-shadow-xl">
                                                {comp.title}
                                            </h3>

                                            <div className="flex items-center justify-between gap-3">
                                                {/* Tags */}
                                                {comp.tags && (
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {formatTags(comp.tags).map((tag) => (
                                                            <Badge
                                                                key={tag}
                                                                variant={getTagVariant(tag) as any}
                                                                size="xs"
                                                                className="bg-black/60 backdrop-blur-md border-white/10"
                                                            >
                                                                {tag}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Update Time */}
                                                <div className="flex items-center gap-1.5 text-[11px] text-slate-300 whitespace-nowrap drop-shadow-md">
                                                    <i className="fa-solid fa-clock" />
                                                    <span>
                                                        {getUpdateTime(comp)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </Section>
                );
            })}

            {/* Empty State */}
            {filteredCompositions.length === 0 && (
                <Section spacing="xl">
                    <Card variant="glass" padding="xl" className="text-center">
                        <div className="flex flex-col items-center gap-4">
                            <div className="text-6xl opacity-50">
                                <i className="fa-solid fa-folder-open" />
                            </div>
                            <h3 className="text-2xl font-bold text-white">
                                No hay composiciones disponibles
                            </h3>
                            <p className="text-slate-400 max-w-md">
                                No hay composiciones disponibles con los filtros seleccionados.
                            </p>
                        </div>
                    </Card>
                </Section>
            )}
        </>
    );
};
