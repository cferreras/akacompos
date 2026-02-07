import React, { useState, useMemo } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/es";
import { Card } from "../ui/Card";
import { championAssets } from "../../utils/assets";
import { getTraitByName } from "../../utils/traits";
import {
  tierStyles,
  getTierHeaderBg,
  type TierLevel,
} from "../../utils/tierStyles";

dayjs.locale("es");
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
  status?: "draft" | "published";
  [key: string]: any;
}

interface CompositionListProps {
  compositions: Composition[];
}

const tierOrder: TierLevel[] = ["S Tier", "A Tier", "B Tier", "C Tier"];

export const CompositionList: React.FC<CompositionListProps> = ({
  compositions,
}) => {
  const [filter, setFilter] = useState<string>("all");

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    compositions.forEach((comp) => {
      if (Array.isArray(comp.tags)) {
        comp.tags.forEach((t) => tags.add(t));
      } else if (typeof comp.tags === "string") {
        comp.tags
          .split(",")
          .map((t) => t.trim())
          .forEach((t) => tags.add(t));
      }
    });
    return Array.from(tags).sort();
  }, [compositions]);

  const filteredCompositions = useMemo(() => {
    if (filter === "all") return compositions;
    return compositions.filter((comp) => {
      if (Array.isArray(comp.tags)) {
        return comp.tags.includes(filter);
      } else if (typeof comp.tags === "string") {
        return comp.tags.includes(filter);
      }
      return false;
    });
  }, [compositions, filter]);

  const compositionsByTier = useMemo(() => {
    return filteredCompositions.reduce(
      (acc, comp) => {
        const tier = comp.tier;
        if (!acc[tier]) {
          acc[tier] = [];
        }
        acc[tier].push(comp);
        return acc;
      },
      {} as Record<string, Composition[]>,
    );
  }, [filteredCompositions]);

  const formatTags = (tags: any): string[] => {
    if (typeof tags === "string") {
      return tags
        .split(",")
        .map((tag: string) => tag.trim())
        .slice(0, 2);
    } else if (Array.isArray(tags)) {
      return tags.slice(0, 2);
    }
    return [];
  };

  const getUpdateTime = (composition: any) => {
    return dayjs(composition.updatedAt || composition.createdAt)
      .utc()
      .fromNow();
  };

  const getTagIcon = (tagName: string) => {
    const lowerTag = tagName.toLowerCase();

    const champKey = Object.keys(championAssets).find(
      (key) => key.toLowerCase() === lowerTag,
    );
    if (champKey) {
      const asset = championAssets[champKey];
      return {
        src: typeof asset === "string" ? asset : asset.src,
        isTrait: false,
      };
    }

    const trait = getTraitByName(tagName);
    if (trait && trait.icon) {
      return {
        src: typeof trait.icon === "string" ? trait.icon : trait.icon.src,
        isTrait: true,
      };
    }

    return null;
  };

  return (
    <div className="space-y-8">
      {/* Filter Section */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === "all"
                ? "bg-primary text-white"
                : "bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
            }`}
            onClick={() => setFilter("all")}
          >
            Todos
          </button>
          {allTags.map((tag) => {
            const tagIcon = getTagIcon(tag);
            return (
              <button
                key={tag}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  filter === tag
                    ? "bg-primary text-white"
                    : "bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
                }`}
                onClick={() => setFilter(tag)}
              >
                {tagIcon && (
                  <img
                    src={tagIcon.src}
                    alt={tag}
                    className={`w-4 h-4 rounded-full object-cover ${tagIcon.isTrait ? "invert brightness-200" : ""}`}
                  />
                )}
                {tag}
              </button>
            );
          })}
        </div>
      )}

      {/* Compositions by Tier */}
      {tierOrder.map((tier) => {
        const tieredComps = compositionsByTier[tier] || [];
        if (tieredComps.length === 0) return null;

        const config = tierStyles[tier];

        return (
          <div
            key={tier}
            id={tier.toLowerCase().replace(" ", "-")}
            className="relative"
          >
            {/* Tier Header with enhanced visual styling */}
            <div
              className={`flex items-center gap-3 mb-5 ${getTierHeaderBg(tier)} ${config?.border || "border-l-4 border-slate-500"} rounded-r-xl py-3 px-4 backdrop-blur-sm`}
            >
              <span className="text-2xl filter drop-shadow-lg">
                {config?.icon || "📋"}
              </span>
              <div className="flex items-center gap-2">
                <h3
                  className={`text-lg font-bold tracking-wide ${config?.text || "text-slate-300"}`}
                >
                  {tier}
                </h3>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${config?.bgSoft} ${config?.text}`}
                >
                  {tieredComps.length} comp{tieredComps.length !== 1 ? "s" : ""}
                </span>
              </div>
              {/* Decorative line extending from header */}
              <div
                className={`hidden sm:block flex-1 h-px ml-4 bg-gradient-to-r ${config?.gradientFrom} to-transparent`}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {tieredComps.map((comp) => (
                <Card
                  key={comp.id}
                  as="a"
                  href={`/compositions/${comp.slug}`}
                  variant="default"
                  hover={true}
                  padding="none"
                  className="group"
                >
                  <div className="aspect-video relative overflow-hidden">
                    {comp.cover ? (
                      <img
                        src={comp.cover}
                        alt={comp.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                        <i className="fa-solid fa-chess text-3xl text-slate-700" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />

                    {/* Preview Badge */}
                    {comp.status === "draft" && (
                      <div className="absolute top-2 right-2 px-2 py-1 bg-amber-500/90 text-white text-xs font-bold rounded-md shadow-lg backdrop-blur-sm border border-amber-400/50">
                        PREVIEW
                      </div>
                    )}

                    {/* Content Overlay */}
                    <div className="absolute inset-0 flex flex-col justify-end p-4">
                      <h4 className="text-lg font-semibold text-white mb-2 group-hover:text-primary transition-colors">
                        {comp.title}
                      </h4>

                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {formatTags(comp.tags).map((tag) => (
                            <span
                              key={tag}
                              className="text-[0.65rem] px-1.5 py-0.5 rounded bg-black/50 text-slate-300"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <span className="text-[0.65rem] text-slate-400">
                          {getUpdateTime(comp)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );
      })}

      {/* Empty State */}
      {filteredCompositions.length === 0 && (
        <div className="text-center py-16">
          <i className="fa-solid fa-folder-open text-4xl text-slate-700 mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">
            No hay composiciones disponibles
          </h3>
          <p className="text-slate-400 text-sm">
            No hay composiciones con los filtros seleccionados.
          </p>
        </div>
      )}
    </div>
  );
};
