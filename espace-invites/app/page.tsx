import Image from "next/image";
import Link from "next/link";
import { Countdown } from "@/components/countdown";
import { Monogram } from "@/components/monogram";
import { PageFooter } from "@/components/page-footer";
import { siteConfig } from "@/lib/site-config";
import couplePhoto from "@/public/images/couple-jeremie-jess.jpg";

const softTiles = [
  { href: "/don", title: "Faire un don", desc: "Notre cagnotte lune de miel" },
  {
    href: "/playlist",
    title: "Playlist",
    desc: "Proposez vos titres",
  },
] as const;

const darkTiles = [
  {
    href: "/infos-pratiques",
    title: "Infos pratiques",
    desc: "Hôtels, trajets & météo",
  },
  {
    href: "/capsule-temporelle",
    title: "Capsule temporelle",
    desc: "Un mot à lire dans le futur",
  },
] as const;

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <div className="relative h-[520px] w-full overflow-hidden">
        <Image
          src={couplePhoto}
          alt={siteConfig.couple.names}
          fill
          priority
          className="object-cover"
          style={{ objectPosition: "center 32%" }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,18,8,0.72)_0%,rgba(15,18,8,0.15)_20%,rgba(15,18,8,0.05)_50%,rgba(15,18,8,0.2)_70%,rgba(15,18,8,0.85)_100%)]" />

        <Monogram className="absolute top-5 left-5 h-[42px] w-[42px] border border-white/40 bg-white/[0.14] backdrop-blur-md" />

        <div className="absolute top-6 right-0 left-0 text-center">
          <div className="mb-2 text-[10px] tracking-[0.32em] text-[#f2f4e0] uppercase drop-shadow-[0_2px_10px_rgba(10,12,5,0.55)]">
            Nous nous marions
          </div>
          <div className="font-display text-[40px] text-white italic drop-shadow-[0_4px_18px_rgba(10,12,5,0.55)]">
            {siteConfig.couple.names}
          </div>
        </div>

        <div className="absolute right-0 bottom-9 left-0 text-center">
          <div className="text-[11.5px] tracking-[0.08em] text-white drop-shadow-[0_2px_8px_rgba(10,12,5,0.5)]">
            {new Date(siteConfig.weddingDate).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}{" "}
            · {siteConfig.location}
          </div>
        </div>

        <svg
          width="390"
          height="46"
          viewBox="0 0 390 46"
          preserveAspectRatio="none"
          className="absolute right-0 -bottom-px left-0 w-full"
        >
          <path
            d="M0,20 C 90,50 300,-6 390,22 L390,46 L0,46 Z"
            fill="#ffffff"
          />
        </svg>
      </div>

      <div className="relative z-10 px-5 pt-6">
        <Countdown />
      </div>

      {/* Programme banner */}
      <div className="px-5 pt-3.5">
        <Link
          href="/programme"
          className="relative block overflow-hidden rounded-[22px] bg-gradient-to-br from-sage via-olive to-olive-deep px-5.5 py-5 shadow-[0_10px_22px_rgba(40,45,20,0.2)]"
        >
          <div className="pointer-events-none absolute -top-6 -right-5 h-24 w-24 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.16)_0%,rgba(255,255,255,0)_70%)]" />
          <div className="relative flex items-center justify-between">
            <div>
              <div className="text-[13.5px] font-bold text-white">
                Le programme du jour
              </div>
              <div className="mt-0.5 text-[10.5px] text-[#e4e7c8]">
                Cérémonie · Vin d&apos;honneur · Dîner · Soirée
              </div>
            </div>
            <span className="flex-shrink-0 text-lg text-white">→</span>
          </div>
        </Link>
      </div>

      {/* Welcome */}
      <div className="bg-white px-6.5 pt-5.5 pb-1.5">
        <div className="mb-3.5 text-center">
          <span className="inline-block rounded-full bg-sage/[0.15] px-4 py-1.5 text-[10px] font-bold tracking-[0.1em] text-[#525a26] uppercase">
            Espace invités
          </span>
        </div>
        <p className="text-center text-[13.5px] leading-relaxed text-[#565a44]">
          Bienvenue dans notre petit coin dédié à vous, nos invités. Vous y
          trouverez tout ce qu&apos;il faut pour préparer votre venue,
          participer à nos surprises et garder une trace de cette journée
          avec nous.
        </p>
      </div>

      {/* Bento grid */}
      <div className="flex flex-col gap-3 bg-white px-5 pt-6 pb-2">
        <Link
          href="/album-photo"
          className="flex items-center justify-between gap-4 rounded-[24px] border border-ink/[0.06] bg-[#f2f2e6] p-5.5 transition-shadow hover:shadow-[0_4px_8px_rgba(20,30,10,0.08),0_18px_32px_rgba(20,30,10,0.12)]"
        >
          <div>
            <div className="text-base font-bold text-ink">Album photo</div>
            <div className="mt-1.5 max-w-[190px] text-[11.5px] leading-relaxed text-ink-faint">
              Partagez vos photos du jour, on veut tout voir
            </div>
          </div>
          <div className="h-[60px] w-[60px] flex-shrink-0 overflow-hidden rounded-full border-2 border-white shadow-[0_6px_16px_rgba(20,30,10,0.15)]">
            <Image
              src={couplePhoto}
              alt=""
              width={60}
              height={60}
              className="h-full w-full object-cover"
              style={{ objectPosition: "center 30%" }}
            />
          </div>
        </Link>

        <div className="grid grid-cols-2 gap-3">
          <Link
            href={softTiles[0].href}
            className="flex min-h-[110px] flex-col justify-center rounded-[22px] border border-ink/[0.06] bg-[#f2f2e6] px-4.5 py-5 transition-shadow hover:shadow-[0_4px_8px_rgba(20,30,10,0.08),0_18px_32px_rgba(20,30,10,0.12)]"
          >
            <div className="text-sm font-bold text-ink">
              {softTiles[0].title}
            </div>
            <div className="mt-1 text-[10.5px] leading-relaxed text-ink-faint">
              {softTiles[0].desc}
            </div>
          </Link>
          <Link
            href={darkTiles[0].href}
            className="flex min-h-[110px] flex-col justify-center rounded-[22px] bg-olive px-4.5 py-5 transition-shadow hover:shadow-[0_4px_8px_rgba(20,30,10,0.08),0_18px_32px_rgba(20,30,10,0.12)]"
          >
            <div className="text-sm font-bold text-white">
              {darkTiles[0].title}
            </div>
            <div className="mt-1 text-[10.5px] leading-relaxed text-sage-light">
              {darkTiles[0].desc}
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Link
            href={softTiles[1].href}
            className="flex min-h-[110px] flex-col justify-center rounded-[22px] border border-ink/[0.06] bg-[#f2f2e6] px-4.5 py-5 transition-shadow hover:shadow-[0_4px_8px_rgba(20,30,10,0.08),0_18px_32px_rgba(20,30,10,0.12)]"
          >
            <div className="text-sm font-bold text-ink">
              {softTiles[1].title}
            </div>
            <div className="mt-1 text-[10.5px] leading-relaxed text-ink-faint">
              {softTiles[1].desc}
            </div>
          </Link>
          <Link
            href={darkTiles[1].href}
            className="flex min-h-[110px] flex-col justify-center rounded-[22px] bg-sage px-4.5 py-5 transition-shadow hover:shadow-[0_4px_8px_rgba(20,30,10,0.08),0_18px_32px_rgba(20,30,10,0.12)]"
          >
            <div className="text-sm font-bold text-white">
              {darkTiles[1].title}
            </div>
            <div className="mt-1 text-[10.5px] leading-relaxed text-[#f2f4e0]">
              {darkTiles[1].desc}
            </div>
          </Link>
        </div>

        <Link
          href="/mini-jeux"
          className="flex items-center justify-between gap-4 rounded-[22px] border border-ink/[0.06] bg-[#f2f2e6] px-5.5 py-5 transition-shadow hover:shadow-[0_4px_8px_rgba(20,30,10,0.08),0_18px_32px_rgba(20,30,10,0.12)]"
        >
          <div>
            <div className="text-sm font-bold text-ink">Mini-jeux</div>
            <div className="mt-1 text-[10.5px] leading-relaxed text-ink-faint">
              Quiz, bingo &amp; devinettes
            </div>
          </div>
          <span className="text-lg text-olive">→</span>
        </Link>

        <Link
          href="/boite-a-souvenirs"
          className="relative flex items-center justify-between gap-4 overflow-hidden rounded-[24px] bg-gradient-to-br from-sage via-olive to-olive-deep p-5.5 shadow-[0_14px_28px_rgba(40,45,20,0.28)]"
        >
          <div className="pointer-events-none absolute -top-8 -right-5 h-28 w-28 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.16)_0%,rgba(255,255,255,0)_70%)]" />
          <div className="relative">
            <div className="text-sm font-bold text-white">
              Boîte à souvenirs
            </div>
            <div className="mt-1 text-[10.5px] leading-relaxed text-[#e4e7c8]">
              Laissez-nous un mot pour plus tard
            </div>
          </div>
          <span className="relative text-lg text-white">→</span>
        </Link>
      </div>

      <PageFooter signOff="À très vite" />
    </div>
  );
}
