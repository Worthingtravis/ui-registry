import React from "react";
import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type CreatorSocialData = {
  id: string;
  platform: string;
  url: string;
  description: string | null;
};

export interface SocialCardProps {
  /** Array of social platform links */
  socials: CreatorSocialData[];
  /** Whether the viewer is the owner of this profile */
  isOwner: boolean;
  /** Additional CSS classes for the root container */
  className?: string;
}

// ---------------------------------------------------------------------------
// Platform icons (inline SVG)
// ---------------------------------------------------------------------------

function TwitchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" />
    </svg>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.75a8.27 8.27 0 004.84 1.55V6.85a4.85 4.85 0 01-1.07-.16z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.041.033.052a19.97 19.97 0 005.993 3.03.078.078 0 00.084-.026c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z" />
    </svg>
  );
}

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.737-8.835L1.254 2.25H8.08l4.259 5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function KickIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M2 2h4v6l4-6h5l-5 7 5 7h-5l-4-6v6H2V2zm16 0h4v20h-4z" />
    </svg>
  );
}

function ThreadsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.5 12.068c0-3.52.85-6.374 2.495-8.423C5.845 1.241 8.598.06 12.179.036c3.584.024 6.337 1.205 8.184 3.509 1.645 2.049 2.495 4.903 2.495 8.423 0 3.518-.85 6.372-2.495 8.421-1.846 2.304-4.599 3.485-8.177 3.611zM12.186 2.03c-3.046.02-5.388 1.004-6.961 2.927-1.39 1.73-2.093 4.182-2.093 7.111 0 2.93.703 5.381 2.093 7.11 1.573 1.924 3.915 2.908 6.961 2.927 3.046-.02 5.388-1.003 6.961-2.927 1.39-1.729 2.093-4.18 2.093-7.11 0-2.929-.703-5.381-2.093-7.111-1.573-1.923-3.915-2.907-6.961-2.927zm0 14.37c-1.44 0-2.618-.365-3.502-1.083-.888-.721-1.337-1.688-1.337-2.873 0-1.22.491-2.222 1.46-2.978.914-.712 2.153-1.109 3.58-1.149l.897-.025v-.25c0-.78-.148-1.34-.44-1.664-.285-.315-.764-.475-1.423-.475-.898 0-1.573.385-2.009 1.143l-.072.126-1.735-.547.067-.14C8.8 5.4 10.15 4.61 12.186 4.61c1.264 0 2.3.358 3.082 1.065.785.71 1.183 1.745 1.183 3.076v5.249h-1.88v-1.111c-.581.862-1.538 1.311-2.74 1.531h-.645zm.257-5.638l-.787.022c-1.039.03-1.854.278-2.422.72-.535.418-.807.963-.807 1.621 0 .7.232 1.247.689 1.626.462.384 1.111.578 1.929.578.967 0 1.771-.299 2.39-.888.614-.585.926-1.383.926-2.374v-.351l-.918.046z" />
    </svg>
  );
}

function GenericLinkIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

const PLATFORM_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  twitch: TwitchIcon,
  youtube: YoutubeIcon,
  tiktok: TikTokIcon,
  instagram: InstagramIcon,
  discord: DiscordIcon,
  twitter: TwitterIcon,
  kick: KickIcon,
  threads: ThreadsIcon,
};

const PLATFORM_COLORS: Record<string, string> = {
  twitch: "text-purple-400",
  youtube: "text-red-400",
  tiktok: "text-pink-400",
  instagram: "text-orange-400",
  discord: "text-indigo-400",
  twitter: "text-sky-400",
  kick: "text-green-400",
  threads: "text-foreground",
};

function PlatformIcon({ platform, className }: { platform: string; className?: string }) {
  const Icon = PLATFORM_ICONS[platform.toLowerCase()] ?? GenericLinkIcon;
  return <Icon className={className} />;
}

function platformColor(platform: string): string {
  return PLATFORM_COLORS[platform.toLowerCase()] ?? "text-muted-foreground";
}

function formatPlatformName(platform: string): string {
  return platform.charAt(0).toUpperCase() + platform.slice(1);
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Grid of social platform cards with inline SVG icons, platform names,
 * descriptions, and external link buttons.
 *
 * Supports 8 named platforms (twitch, youtube, tiktok, instagram, discord,
 * twitter, kick, threads) with a fallback generic link icon for unknowns.
 *
 * @example
 * ```tsx
 * <SocialCard
 *   socials={[{ id: "1", platform: "twitch", url: "https://twitch.tv/me", description: "I stream DBD!" }]}
 *   isOwner={false}
 * />
 * ```
 */
export function SocialCard({ socials, isOwner, className }: SocialCardProps) {
  if (socials.length === 0) {
    return (
      <div className={cn("rounded-lg border border-dashed border-border p-8 text-center", className)}>
        <p className="text-sm text-muted-foreground">
          {isOwner ? "Add your social links to let viewers find you everywhere." : "No social links added yet."}
        </p>
      </div>
    );
  }

  return (
    <div className={cn("grid grid-cols-1 gap-4 @sm:grid-cols-2 @lg:grid-cols-3", className)}>
      {socials.map((social) => (
          <a
            key={social.id}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "group flex min-h-[44px] flex-col gap-3 rounded-xl border border-border/60 bg-card/50 p-4",
              "backdrop-blur-sm transition-all duration-200",
              "hover:-translate-y-0.5 hover:border-border hover:bg-card hover:shadow-lg hover:shadow-black/10",
            )}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className={cn("size-6 shrink-0", platformColor(social.platform))}>
                  <PlatformIcon platform={social.platform} className="size-full" />
                </div>
                <span className="text-sm font-semibold text-foreground">
                  {formatPlatformName(social.platform)}
                </span>
              </div>
              <ExternalLink
                className="size-3.5 shrink-0 text-muted-foreground/40 transition-colors group-hover:text-muted-foreground"
                aria-hidden="true"
              />
            </div>
            {social.description && (
              <p className="line-clamp-3 text-xs leading-relaxed text-muted-foreground">{social.description}</p>
            )}
          </a>
        ))}
    </div>
  );
}
