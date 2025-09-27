"use client";

import React, { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ExternalLink, Leaf, Link as LinkIcon } from "lucide-react";

/* ---------------- Locations ---------------- */
const LOCATIONS = [
  { key: "front-porch", label: "Front Porch" },
  { key: "front-lawn", label: "Front Lawn" },
  { key: "sunny-side", label: "Sunny Side" },
  { key: "shady-side", label: "Shady Side" },
  { key: "backyard", label: "Backyard" },
  { key: "basement-patio", label: "Basement Patio" },
  { key: "basement-interior", label: "Basement Interior" },
] as const;

type LocationKey = typeof LOCATIONS[number]["key"];

/* --------------- Maintenance seasons --------------- */
const SEASONS = [
  { key: "spring", label: "Spring" },
  { key: "summer", label: "Summer" },
  { key: "fall", label: "Fall" },
  { key: "winter", label: "Winter" },
  { key: "never", label: "Never" },
  { key: "whenever", label: "As Needed" },
] as const;

type SeasonKey = typeof SEASONS[number]["key"];

type Plant = {
  id: string;
  name: string;
  imageUrl: string;
  link?: string;
  notes?: string;
  location: LocationKey;
  watering?: {
    summer?: string;
    winter?: string;
  };
  /** NEW */
  maintenance?: {
    prune?: SeasonKey;
    feed?: SeasonKey;
  };
  /** Optional extra details for dialog */
  details?: {
    use?: string;
    size?: string;
    sun?: string;
    zone?: string;
    feed?: string;
    prune?: string;
  };
  tagImages?: string[];
};

/* ---------------- Your plants (examples) ---------------- */
const PLANTS: Plant[] = [
  {
    id: "heuchera-1",
    name: "Heuchera (Coral Bells)",
    imageUrl: "/plants/Heuchera_Coral_Bells.jpg",
    link: "https://www.provenwinners.com/learn/heuchera",
    notes: "Partial shade; keep soil evenly moist but well-drained.",
    location: "front-porch",
    watering: { summer: "2–3×/week (even moisture)", winter: "Lightly every 1–2 weeks" },
    maintenance: { prune: "spring", feed: "spring" },
  },
  {
    id: "croton-1",
    name: "Croton (Codiaeum variegatum)",
    imageUrl: "/plants/Croton_Codiaeum_variegatum.jpg",
    link: "https://hort.extension.wisc.edu/articles/croton-codiaeum-variegatum/",
    notes: "Bright, indirect light; likes humidity.",
    location: "front-porch",
    watering: { summer: "Keep evenly moist; every 3–4 days", winter: "Weekly; let top 1–2\" dry" },
    maintenance: { prune: "spring", feed: "summer" },
  },
  {
    id: "heuchera-2",
    name: "Heuchera (Dark Leaf Coral Bells)",
    imageUrl: "/plants/Heuchera_Dark_Leaf.jpg",
    link:"https://www.provenwinners.com/learn/heuchera",
    notes: "Partial shade; dark leaves tolerate a bit more sun.",
    location: "front-porch",
    watering: { summer: "2–3×/week (even moisture)", winter: "Lightly every 1–2 weeks" },
    maintenance: { prune: "spring", feed: "spring" },
  },
  {
    id: "coleus-1",
    name: "Coleus",
    imageUrl: "/plants/Coleus.jpg",
    link: "https://www.provenwinners.com/how-plant/coleus",
    notes: "Partial to full shade; rich, well-draining soil; pinch flowers for foliage.",
    location: "front-porch",
    watering: { summer: "Keep soil evenly moist; water when top 1–2\" is dry", winter: "Reduce; keep lightly moist" },
    maintenance: { prune: "summer", feed: "summer" },
  },
  {
    id: "spider-plant-1",
    name: "Spider Plant (Chlorophytum comosum)",
    imageUrl: "/plants/Spider_Plant.jpg",
    link: "https://hort.extension.wisc.edu/articles/spider-plant-chlorophytum-comosum/",
    notes: "Bright, indirect light. Produces baby spiderettes.",
    location: "front-porch",
    watering: { summer: "1–2×/week; allow top soil to dry slightly", winter: "Every 2–3 weeks" },
    maintenance: { prune: "never", feed: "spring" },
  },
  {
  id: "basket-1",
  name: "Front Porch Hanging Basket",
  imageUrl: "/plants/Front_Porch_Basket.jpg",
  link: "https://www.provenwinners.com/learn/hope-hanging-baskets",
  notes: "Mixed flowers including Impatiens, Tradescantia, and ornamental grasses. Loves partial shade and consistent watering.",
  location: "front-porch",
  maintenance: { prune: "whenever", feed: "spring" },
  watering: {
    summer: "Check daily; water 3–4×/week (dries out quickly)",
    winter: "Not applicable (seasonal basket)",
  },
},
  {
    id: "festuca-1",
    name: "Beyond Blue™ Festuca (Festuca glauca)",
    imageUrl: "/plants/Beyond_Blue_Festuca.jpg",
    link: "https://southernlivingplants.com/the-collection/plant/beyond-blue-festuca/",
    notes: "Powder-blue clumping grass; full sun; well-drained soil.",
    location: "front-lawn",
    watering: { summer: "Medium water ~1×/week; avoid soggy soil", winter: "Minimal; only during drought" },
    maintenance: { prune: "never", feed: "spring" },
    details: {
      use: "Groundcover, mass planting, slopes, containers",
      size: "9–12\" H × 18\" W",
      sun: "Full sun",
      zone: "USDA 4–8 (hardy to −30°F / −34°C)",
      feed: "Fertilize yearly in early spring",
      prune: "No pruning needed",
    },
    tagImages: [
      "/plants/Beyond_Blue_Festuca_tag1.jpg",
      "/plants/Beyond_Blue_Festuca_tag2.jpg",
    ],
  },
{
  id: "salvia-pink-profusion-1",
  name: "Salvia nemorosa 'Pink Profusion'",
  imageUrl: "/plants/Salvia_Pink_Profusion.jpg",
  link: "https://www.provenwinners.com/plants/salvia/pink-profusion-perennial-salvia-salvia-nemorosa",
  notes: "Full sun; well-drained soil. Deadhead after first flush to encourage rebloom. Drought tolerant once established.",
  location: "front-lawn",
  watering: { summer: "Weekly; let top 1\" dry", winter: "Minimal; only if very dry" },
  maintenance: { prune: "summer", feed: "spring" },
  details: {
    use: "Perennial border, pollinator garden, cut flower",
    size: "14–16\" H × 16–20\" W",
    sun: "Full sun",
    zone: "USDA 3–8",
    feed: "Light spring feeding; avoid heavy nitrogen",
    prune: "Deadhead to promote rebloom; cut back in late fall if desired"
  },
  tagImages: [
    "/plants/Salvia_Pink_Profusion_tag1.jpg",
    "/plants/Salvia_Pink_Profusion_tag2.jpg"
  ],
},
{
  id: "juniper-1",
  name: "Daub's Frosted Juniper (Juniperus chinensis 'Daub's Frosted')",
  imageUrl: "/plants/Juniper_Daubs_Frosted.jpg",
  link: "https://www.monrovia.com/daubs-frosted-juniper.html",
  notes: "Golden yellow frosted tips over blue-green mature foliage. Low-growing conifer ideal for groundcover or slopes. Evergreen with dramatic multi-season beauty.",
  location: "front-lawn",
  watering: { 
    summer: "When top 2 in. of soil is dry", 
    winter: "Minimal; only during drought" 
  },
  maintenance: { prune: "never", feed: "spring"},
  details: {
    size: "15 in. tall, up to 5 ft. wide",
    sun: "Full sun",
    zone: "USDA 4–9 (hardy to -30°F / -20°C)",
    feed: "Fertilize in spring if needed",
    prune: "No pruning required"
  },
  tagImages: [
    "/plants/Juniper_Daubs_Frosted_tag1.jpg",
    "/plants/Juniper_Daubs_Frosted_tag2.jpg"
  ]
},
{
  id: "geranium-1",
  name: "Geranium (Pelargonium)",
  imageUrl: "/plants/Geranium.jpg",
  link: "https://www.gardeningknowhow.com/ornamental/flowers/geranium",
  notes: "Bright annual bedding plant with clusters of pink-red flowers. Prefers full sun and well-drained soil. Deadheading encourages continuous blooms.",
  location: "front-lawn",
  watering: { 
    summer: "Moderate; water when top inch of soil is dry", 
    winter: "Not frost hardy; treat as annual or overwinter indoors" 
  },
  maintenance: { prune: "summer", feed: "summer"}
},
{
  id: "barberry-1",
  name: "Orange Rocket Barberry (Berberis thunbergii 'Orange Rocket')",
  imageUrl: "/plants/Orange_Rocket_Barberry.jpg",
  link: "https://southernlivingplants.com/plants/orange-rocket-barberry/",
  notes: "Vibrant coral-red new foliage in spring, maturing to deep ruby red in fall. Great vertical accent for borders or containers.",
  location: "front-lawn",
  watering: { 
    summer: "Low water, water-wise", 
    winter: "Minimal; only as needed" 
  },
  maintenance: { prune: "winter", feed: "spring"},
  details: {
    use: "Borders, landscapes, containers",
    size: "4' H × 1.5' W",
    sun: "Full sun to part shade",
    zone: "USDA Zones 5–9",
  },
  tagImages: [
    "/plants/Orange_Rocket_Barberry_tag1.jpg",
    "/plants/Orange_Rocket_Barberry_tag2.jpg"
  ]
},
{
  id: "loropetalum-1",
  name: "Purple Daydream® Dwarf Loropetalum",
  imageUrl: "/plants/Purple_Daydream.jpg", 
  link: "https://southernlivingplants.com/the-collection/plant/purple-daydream-dwarf-loropetalum/",
  notes: "Compact, mounding shrub with dark purple foliage year-round; bursts of pink fringe flowers each spring. Drought tolerant and deer resistant.",
  location: "front-lawn",
  watering: { 
    summer: "Medium water; water-wise once established", 
    winter: "Minimal, only as needed in dry periods" 
  },
  maintenance: {prune: "spring", feed: "spring"},
  details: {
    size: "2–3' H x 3–4' W",
    sun: "Full sun to part shade",
    zone: "USDA 7–10",
  },
  tagImages: [
    "/plants/Purple_Daydream_tag1.jpg",
    "/plants/Purple_Daydream_tag2.jpg"
  ]
},
{
  id: "thuja-firechief-1",
  name: "Fire Chief™ Thuja (Thuja occidentalis)",
  imageUrl: "/plants/Thuja_Fire_Chief.jpg",
  link: "https://southernlivingplants.com/the-collection/plant/fire-chief-arborvitae/",
  notes: "Compact, globe-shaped arborvitae with soft, feathery foliage. Color transitions from golden green in spring to fiery orange-red in fall.",
  location: "front-lawn",
  watering: { 
    summer: "Water weekly until established; then as needed during dry spells", 
    winter: "Minimal; only during prolonged drought" 
  },
  maintenance: { prune: "never", feed: "spring"},
  details: {
    size: "3–4 ft. tall, 3–4 ft. wide",
    sun: "Full sun to part shade",
    zone: "USDA 5–9",
  }
},
{
  id: "cercis-goldenfalls-1",
  name: "Golden Falls Redbud (Cercis canadensis ‘Golden Falls’)",
  imageUrl: "/plants/Cercis_Golden_Falls.jpg",
  link: "https://www.monrovia.com/golden-falls-redbud.html?srsltid=AfmBOopJlo1t8RD6RpU2eStBBGOIpXjlJNLzS32qGWXCDORQaetfip2m",
  notes: "A weeping redbud with heart-shaped golden-yellow leaves; adds vertical accent and seasonal interest.",
  location: "front-lawn",
  watering: { 
    summer: "Weekly deep watering during establishment; then drought tolerant", 
    winter: "Minimal; water only during prolonged dry spells" 
  },
  maintenance: {prune: "winter", feed: "spring"},
  details: {
    size: "10–12 ft. tall, 4–5 ft. wide",
    sun: "Full sun to part shade",
    zone: "USDA 5–9",
  }
},
{
  id: "lantana-1",
  name: "Lantana (Lantana camara ‘New Gold’)",
  imageUrl: "/plants/Lantana_Yellow.jpg",
  link: "https://www.provenwinners.com/plants/lantana",
  notes: "Bright clusters of golden-yellow flowers; attracts butterflies and hummingbirds. Thrives in heat and drought once established.",
  location: "front-lawn",
  watering: { 
    summer: "Water deeply 1–2x per week until established; drought tolerant afterward", 
    winter: "Minimal; protect if frost threatens" 
  },
  maintenance: {prune: "spring", feed: "spring"},
  details: {
    size: "18–24 in. tall, 24–36 in. spread",
    sun: "Full sun",
    zone: "USDA 9–11 (grown as annual in cooler zones)",
  }
},
{
  id: "sunshine-ligustrum-1",
  name: "‘Sunshine’ Ligustrum (Ligustrum sinense ‘Sunshine’)",
  imageUrl: "/plants/Sunshine_Ligustrum.jpg",
  link: "https://southernlivingplants.com/the-collection/plant/sunshine-ligustrum/",
  notes:
    "Bright golden foliage that holds color in full sun. Sterile, non-invasive, and does not bloom (good for allergy sufferers). Great for hedges, borders, or mass planting.",
  location: "sunny-side",
  watering: {
    summer: "Medium water; water-wise once established",
    winter: "Minimal; only during prolonged dry spells"
  },
  maintenance: { prune: "never", feed: "spring"},
  details: {
    use: "Hedge, border, mass planting, landscape color",
    size: "3–6 ft H × 3–4 ft W",
    sun: "Full sun to part sun",
    zone: "USDA 6–10",
    feed: "Fertilize yearly in spring",
    prune: "Prune as needed to shape"
  },
  tagImages: [
    "/plants/Sunshine_Ligustrum_tag1.jpg",
    "/plants/Sunshine_Ligustrum_tag2.jpg"
  ]
},
{
  id: "sunshine-ligustrum-2",
  name: "'Sunshine’ Ligustrum (Ligustrum sinense ‘Sunshine’",
  imageUrl: "/plants/Large_Sunshine_Ligustrum.jpg",
  link: "https://southernlivingplants.com/the-collection/plant/sunshine-ligustrum/",
  notes:
    "Bright golden foliage that holds color in full sun. Sterile, non-invasive, and does not bloom (good for allergy sufferers). Great for hedges, borders, or mass planting.",
  location: "sunny-side",
  watering: {
    summer: "Medium water; water-wise once established",
    winter: "Minimal; only during prolonged dry spells"
  },
  maintenance: { prune: "never", feed: "spring"},
  details: {
    use: "Hedge, border, mass planting, landscape color",
    size: "3–6 ft H × 3–4 ft W",
    sun: "Full sun to part sun",
    zone: "USDA 6–10",
    feed: "Fertilize yearly in spring",
    prune: "Prune as needed to shape"
  },
},
{
  id: "azalea-george-taber-1",
  name: "Azalea 'George Taber' (Azalea x George L. Taber)",
  imageUrl: "/plants/Azalea_George_Taber.jpg",
  link: "https://plantsexpress.com/products/george-l-taber-azalea?srsltid=AfmBOoq1cUsA4E3VnvM4pBxG4aoFALV9bZmJcVEvKgEdhXSUn5ZpKstn", 
  notes: "Large evergreen azalea with pale pink flowers featuring darker pink throats. A Southern classic, excellent for borders or as a foundation shrub.",
  location: "sunny-side",
  watering: { 
    summer: "Moderate; keep soil consistently moist but not waterlogged", 
    winter: "Minimal; water during extended dry spells" 
  },
  maintenance: {prune: "spring", feed: "spring"},
  details: {
    size: "4–8 ft. tall, 3–6 ft. wide",
    sun: "Full sun to partial shade",
    zone: "USDA 8–10",
    feed: "Fertilize after blooming in spring",
    prune: "Light pruning after flowering to shape"
  },
  tagImages: ["/plants/Azalea_George_Taber_tag1.jpg",]
},
{
  id: "winter-gem-boxwood-1",
  name: "Winter Gem Boxwood (Buxus microphylla var. japonica) 'Winter Gem'",
  imageUrl: "/plants/Winter_Gem_Boxwood.jpg",
  link: "https://www.monrovia.com/winter-gem-boxwood.html?srsltid=AfmBOoqRcDJGbAMEttuil21_R26PN73IZ-oRFlUIBT6mmQ0F60ujvO-4",
  notes: "Dense, evergreen shrub with small, glossy leaves. Excellent for hedges, borders, or topiary. Can be shaped easily with pruning.",
  location: "sunny-side",
  watering: { 
    summer: "Moderate; water weekly during dry spells", 
    winter: "Minimal; water only during prolonged drought" 
  },
  maintenance: {prune: "spring",feed: "spring"},
  details: {
    size: "3–6 ft. tall, 3–6 ft. wide",
    sun: "Full sun to partial shade",
    zone: "USDA 6–9",
    feed: "Fertilize in early spring with balanced shrub fertilizer",
    prune: "Prune in spring to shape and maintain size"
  },
}, 
{
  id: "abelia-1",
  name: "‘Kaleidoscope’ Abelia",
  imageUrl: "/plants/Small_Kaleidoscope_Abelia.jpg",
  link: "https://southernlivingplants.com/the-collection/plant/kaleidoscope-abelia/",
  notes: "Semi-evergreen shrub with arching branches and small, glossy leaves. Produces fragrant, tubular flowers in summer to fall. Foliage may turn bronze or red in cooler weather.",
  location: "shady-side",
  watering: { 
    summer: "Moderate; water weekly during dry spells", 
    winter: "Minimal; water only during prolonged drought" 
  },
  maintenance: {prune: "spring", feed: "spring"},
  details: {
    size: "3–6 ft. tall, 3–6 ft. wide (dwarf cultivars smaller)",
    sun: "Full sun to partial shade",
    zone: "USDA 6–9",
    feed: "Fertilize yearly in spring with balanced shrub fertilizer",
    prune: "Light pruning in spring to shape; remove dead wood as needed"
  },
},
{
id: "hydrangea-limelight-1",
  name: "Limelight Hydrangea (Hydrangea paniculata 'Limelight')",
  imageUrl: "/plants/Limelight_Hydrangea.jpg",
  link: "https://www.gardenia.net/plant/hydrangea-paniculata-limelight",
  notes: "Large, hardy deciduous shrub valued for its striking lime-green flowers that age to pink and burgundy in fall. Blooms on new wood, making it a reliable summer and fall bloomer.",
  location: "shady-side",
  watering: { 
    summer: "Water deeply 1–2 times per week during hot or dry periods", 
    winter: "Minimal; only water during prolonged drought if soil is very dry" 
  },
  maintenance: { prune: "winter", feed: "spring"},
  details: {
    size: "6–8 ft. tall, 6–8 ft. wide",
    sun: "Full sun to partial shade (prefers afternoon shade in hot climates)",
    zone: "USDA 3–9",
    feed: "Fertilize yearly in spring with a slow-release balanced fertilizer",
    prune: "Cut back by 1/3 in late winter or early spring to encourage strong new growth and larger blooms"
  },
},
{
  id: "black-dragon-cedar-1",
  name: "Black Dragon Japanese Cedar (Cryptomeria japonica 'Black Dragon')",
  imageUrl: "/plants/Black_Dragon_Japanese_Cedar.jpg",
  link: "https://www.monrovia.com/black-dragon-japanese-cedar.html?srsltid=AfmBOopVQnzGUS6rnJB1fUOd3Mk_yus4_h0BrFexWMTPEq2UsniDOtZx",
  tagImages: [
    "/plants/Black_Dragon_Japanese_Cedar_tag1.jpg",
    "/plants/Black_Dragon_Japanese_Cedar_tag2.jpg"
  ],
  notes: "A dramatic accent conifer with dense, irregular pyramidal form. Spring growth is light green, maturing to black-green in summer. Evergreen, works well in small gardens or as a specimen plant.",
  location: "shady-side",
  watering: {
    summer: "Water when top 2 inches of soil is dry",
    winter: "Minimal; water only during prolonged dry spells"
  },
  maintenance: { prune: "winter", feed: "spring"},
  details: {
    size: "6–7 ft. tall, 3–4 ft. wide (ultimately 10 ft. tall)",
    sun: "Partial to full sun",
    zone: "USDA 5–9"
  }
},
{
  id: "heuchera-3",
  name: "Carnival Burgundy Blast Coral Bells (Heuchera x hybrida)",
  imageUrl: "/plants/Carnival_Burgundy_Blast.jpg",
  link: "https://www.provenwinners.com/learn/heuchera", 
  notes: "Burgundy-red shades with striking leaf pattern. Thrives in shade gardens and adds bold foliage color.",
  location: "shady-side",
  watering: { 
    summer: "Keep soil evenly moist; do not allow to dry completely", 
    winter: "Minimal; water only during prolonged dry spells" 
  },
  maintenance: { prune: "spring", feed: "spring"},
  details: {
    size: "12–14 in. H × 12–14 in. W",
    sun: "Filtered sun to part shade",
    zone: "USDA 4–9",
  },
  tagImages: [
    "/plants/Carnival_Burgundy_Blast_tag1.jpg",
    "/plants/Carnival_Burgundy_Blast_tag2.jpg"
  ]
},
{
  id: "hydrangea-1",
  name: "Blue Enchantress® Hydrangea (Hydrangea macrophylla 'Monmar')",
  imageUrl: "/plants/Blue_Enchantress_Hydrangea.jpg",
  link: "https://www.monrovia.com/blue-enchantress-hydrangea.html",
  notes: "Ruby-black stems with large mophead flowers. Blooms blue in acidic soil and pink in alkaline soil. Flowers age to cream-splashed green. Excellent cut flower for fresh or dried arrangements.",
  location: "shady-side",
  watering: { 
    summer: "Keep soil moist but not soggy", 
    winter: "Minimal; water only during prolonged dry spells" 
  },
  maintenance: { prune: "summer", feed: "spring"},
  details: {
    size: "3–5 ft. tall and wide",
    sun: "Partial sun",
    zone: "USDA 4–9 (hardy to -30°F / -34°C)",
  },
  tagImages: [
    "/plants/Blue_Enchantress_Hydrangea_tag1.jpg",
    "/plants/Blue_Enchantress_Hydrangea_tag2.jpg"
  ]
},
{
  id: "heavenly-bamboo-1",
  name: "Heavenly Bamboo (Gulf Stream Nandina)",
  imageUrl: "/plants/Heavenly_Bamboo.jpg",
  link: "https://www.gardenia.net/plant/nandina-domestica-heavenly-bamboo",
  notes: "Compact shrub with season-changing foliage (green → red/purple). White spring flowers may be followed by red berries.",
  location: "backyard",
  watering: {
    summer: "Water weekly until established; drought-tolerant when mature",
    winter: "Minimal; only during prolonged dry spells"
  },
  maintenance: { prune: "spring", feed: "spring" },
  details: {
    size: "12–24 in. tall, ~24 in. wide",
    sun: "Full sun to part shade",
    zone: "USDA 6–10 (hardy to about −10°F)"
  },
  tagImages: ["/plants/Heavenly_Bamboo_tag1.jpg"]
},
{
  id: "japanese-maple-tamukeyama-1",
  name: "Japanese Maple Tamukeyama (Acer palmatum var. dissectum)",
  imageUrl: "/plants/Japanese_Maple_Tamukeyama.jpg",
  link: "https://myperfectplants.com/products/weeping-tamukeyama-japanese-maple-tree?srsltid=AfmBOopUecJEIRYK9m6MTTxmf0GuoiaRWyvUFXhzStBOqcUdWd751lpk",
  notes: "A compact ornamental tree with finely dissected foliage, prized for its elegant weeping form and stunning seasonal color. Ideal for shaded to partially sunny garden corners.",
  location: "backyard",
  watering: {
    summer: "Water weekly, keeping soil consistently moist but not soggy",
    winter: "Minimal; only during prolonged dry spells"
  },
  maintenance: { prune: "winter",feed: "spring"},
  details: {
    size: "6–10 ft. tall, 8–12 ft. wide (varies with cultivar)",
    sun: "Partial shade to filtered sun (protect from harsh afternoon sun)",
    zone: "USDA 5–8"
  },
  tagImages: ["/plants/Japanese_Maple_Tamukeyama_tag1.jpg"]
},
{
  id: "abelia-2",
  name: "Kaleidoscope Abelia (Abelia x grandiflora ‘Kaleidoscope’)",
  imageUrl: "/plants/Kaleidoscope_Abelia.jpg",
  link: "https://southernlivingplants.com/the-collection/plant/kaleidoscope-abelia/",
  notes: "Colorful semi-evergreen shrub with variegated foliage that shifts shades throughout the year. Produces white fragrant flowers from spring to fall. Excellent for borders, hedges, or as a foundation planting.",
  location: "backyard",
  watering: {
    summer: "Water twice weekly the first year, then weekly once established",
    winter: "Water occasionally during dry spells"
  },
  maintenance: {prune: "winter", feed: "spring"},
  details: {
    size: "2–3 ft. tall, 3–4 ft. wide",
    sun: "Full sun (6+ hours) for best color and blooms",
    zone: "USDA 6–9"
  },
  tagImages: [
    "/plants/Kaleidoscope_Abelia_tag1.jpg",
    "/plants/Kaleidoscope_Abelia_tag2.jpg"
  ]
},
{
  id: "yellow-ribbon-arborvitae-1",
  name: "Yellow Ribbon Arborvitae (Thuja occidentalis 'Yellow Ribbon')",
  imageUrl: "/plants/Yellow_Ribbon_Arborvitae.jpg",
  link: "https://www.monrovia.com/yellow-ribbon-arborvitae.html",
  notes: "Dense, brilliant, golden-yellow foliage that holds its color year-round. Excellent for hedging or as an accent piece. Deer resistant.",
  location: "backyard",
  watering: {
    summer: "Water weekly, especially during prolonged dry heat",
    winter: "Minimal; water only during extended dry periods"
  },
  maintenance: { prune: "winter", feed: "spring"},
  details: {
    size: "Up to 10 ft. tall, 3 ft. wide",
    sun: "Full sun",
    zone: "USDA Zone 3"
  },
  tagImages: [ "/plants/Yellow_Ribbon_Arborvitae_tag1.jpg", 
    "/plants/Yellow_Ribbon_Arborvitae_tag2.jpg"],
},
{
  id: "hydrangea-2",
  name: "Hydrangea (Hydrangea macrophylla)",
  imageUrl: "/plants/Hydrangea.jpg",
  link: "https://www.thespruce.com/growing-hydrangeas-1402684",
  notes: "Deciduous shrub with large mophead blooms that vary in color depending on soil pH. Provides lush foliage and seasonal flower clusters. Can be used in borders, mass plantings, or as a specimen shrub.",
  location: "backyard",
  watering: {
    summer: "Keep soil moist but not soggy; water 2–3 times per week in heat",
    winter: "Minimal; water only during extended dry periods"
  },
  maintenance: {prune: "summer", feed: "spring"},
  details: {
    size: "3–5 ft. tall and wide",
    sun: "Partial sun",
    zone: "USDA 4–9"
  }
},
{
  id: "chaste-tree-1",
  name: "Chaste Tree (Vitex agnus-castus)",
  imageUrl: "/plants/Chaste_Tree.jpg",
  link: "https://plants.ces.ncsu.edu/plants/vitex-agnus-castus/",
  tagImages: ["/plants/Chaste_Tree_tag1.jpg", "/plants/Chaste_Tree_tag2.jpg"],
  notes: "Large flowering shrub or small tree with fragrant lavender-blue flower spikes that attract butterflies and pollinators. Deciduous with aromatic leaves.",
  location: "backyard",
  watering: {
    summer: "Water 2x per week until established, then weekly",
    winter: "Minimal; water only during extended dry periods"
  },
  maintenance: { prune: "winter", feed: "spring"},
  details: {
    size: "10–15 ft. tall, 10–15 ft. wide",
    sun: "Full sun (6+ hours)",
    zone: "USDA 7–9"
  }
},
{
  id: "heuchera-3",
  name: "Carnival Burgundy Blast Coral Bells (Heuchera x hybrida)",
  imageUrl: "/plants/Carnival_Burgundy_Blast.jpg",
  link: "https://www.provenwinners.com/learn/heuchera", 
  notes: "Burgundy-red shades with striking leaf pattern. Thrives in shade gardens and adds bold foliage color.",
  location: "backyard",
  watering: { 
    summer: "Keep soil evenly moist; do not allow to dry completely", 
    winter: "Minimal; water only during prolonged dry spells" 
  },
  maintenance: {prune: "spring", feed: "spring"},
  details: {
    size: "12–14 in. H × 12–14 in. W",
    sun: "Filtered sun to part shade",
    zone: "USDA 4–9",
  },
  tagImages: [
    "/plants/Carnival_Burgundy_Blast_tag1.jpg",
    "/plants/Carnival_Burgundy_Blast_tag2.jpg"
]
},
{
  id: "bloodgood-japanese-maple-1",
  name: "Japanese Bloodgood Maple (Acer palmatum)",
  imageUrl: "/plants/Japanese_Maple_Bloodgood.jpg",
  link: "https://www.thespruce.com/bloodgood-japanese-maple-trees-2132683",
  notes: "Upright Japanese Maple; provide dappled sun to partial shade to protect from scorching",
  location: "backyard",
  watering: {
    summer: "Water 2x per week until established, then weekly",
    winter: "Minimal; water only during extended dry periods"
  },
  maintenance: { prune: "winter", feed: "spring"},
  details: {
    size: "10–15 ft. tall, 10–15 ft. wide",
    sun: "Full sun (6+ hours)",
    zone: "USDA 7–9"
  }
},
{
  id: "arborvitae-emerald-green-1",
  name: "Emerald Green Arborvitae (Thuja occidentalis 'Smaragd')",
  imageUrl: "/plants/Emerald_Green_Arborvitae.jpg",
  link: "https://www.thespruce.com/emerald-green-arborvitae-trees-2132081",
  notes:
    "Compact, narrow evergreen ideal for hedges or specimen planting. Retains bright green foliage year-round with little bronzing. Low-maintenance once established.",
  location: "backyard",
  watering: {
    summer:
      "Deep water weekly the first 1–2 years (1–1.5 inches including rainfall). Increase frequency during heat or drought.",
    winter:
      "Water during prolonged dry spells if ground isn’t frozen; soak well in late fall to prevent winter burn."
  },
  maintenance: { prune: "winter", feed: "spring"},
  details: {
    size: "10–15 ft. tall, 3–4 ft. wide (columnar habit)",
    sun: "Full sun to partial shade (6+ hrs sun ideal)",
    zone: "USDA 3–7",
    feed: "Fertilize once per year in early spring unless growth is strong",
    prune: "Only tip-prune new growth to shape. Do not cut into bare wood—arborvitae will not regrow from it."
  }
},
]
export default function PlantCareGallery() {
  const [plants] = useState<Plant[]>(PLANTS);
  const [q, setQ] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  // view state
  const [groupByLocation, setGroupByLocation] = useState(true);
  const [locationFilter, setLocationFilter] = useState<LocationKey | "">("");

  // NEW: maintenance filters
  const [pruneFilter, setPruneFilter] = useState<SeasonKey | "">("");
  const [feedFilter, setFeedFilter] = useState<SeasonKey | "">("");

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return plants.filter((p) => {
      const matchesQ =
        !term ||
        p.name.toLowerCase().includes(term) ||
        (p.notes ?? "").toLowerCase().includes(term);
      const matchesLoc = !locationFilter || p.location === locationFilter;
      const matchesPrune =
        !pruneFilter || (p.maintenance?.prune ?? "") === pruneFilter;
      const matchesFeed =
        !feedFilter || (p.maintenance?.feed ?? "") === feedFilter;

      return matchesQ && matchesLoc && matchesPrune && matchesFeed;
    });
  }, [plants, q, locationFilter, pruneFilter, feedFilter]);

  // group after filtering
  const grouped = useMemo(() => {
    const map: Record<LocationKey, Plant[]> = {
      "front-porch": [],
      "front-lawn": [],
      "sunny-side": [],
      "shady-side": [],
      backyard: [],
      "basement-patio": [],
      "basement-interior": [],
    };
    for (const p of filtered) map[p.location].push(p);
    return map;
  }, [filtered]);

  const current = plants.find((p) => p.id === openId) || null;

  return (
    <div className="min-h-screen bg-white text-gray-900 p-6 md:p-10">
      {/* Header */}
      <header className="max-w-6xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Leaf className="w-8 h-8" />
          <h1 className="text-2xl md:text-3xl font-semibold">My PlantCare Gallery</h1>
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name or notes…"
            className="w-64 max-w-full"
            aria-label="Search plants"
          />

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={groupByLocation}
              onChange={(e) => setGroupByLocation(e.target.checked)}
            />
            Group by location
          </label>

          {/* Location filter (only helpful when not grouped, but allowed anytime) */}
          <select
            className="h-10 rounded-md border bg-white px-3 text-sm"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value as LocationKey | "")}
            aria-label="Filter by location"
          >
            <option value="">All locations</option>
            {LOCATIONS.map((l) => (
              <option key={l.key} value={l.key}>
                {l.label}
              </option>
            ))}
          </select>

          {/* NEW: prune & feed filters */}
          <select
            className="h-10 rounded-md border bg-white px-3 text-sm"
            value={pruneFilter}
            onChange={(e) => setPruneFilter(e.target.value as SeasonKey | "")}
            aria-label="Filter by pruning timeframe"
          >
            <option value="">Prune: Any time</option>
            {SEASONS.map((s) => (
              <option key={s.key} value={s.key}>
                Prune: {s.label}
              </option>
            ))}
          </select>

          <select
            className="h-10 rounded-md border bg-white px-3 text-sm"
            value={feedFilter}
            onChange={(e) => setFeedFilter(e.target.value as SeasonKey | "")}
            aria-label="Filter by fertilizing timeframe"
          >
            <option value="">Feed: Any time</option>
            {SEASONS.map((s) => (
              <option key={s.key} value={s.key}>
                Feed: {s.label}
              </option>
            ))}
          </select>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-6xl mx-auto">
        {groupByLocation ? (
          <div className="space-y-10">
            {LOCATIONS.map((loc) => {
              const items = grouped[loc.key];
              if (!items || items.length === 0) return null;
              return (
                <section key={loc.key}>
                  <h2 className="text-xl font-semibold mb-4">{loc.label}</h2>
                  <Grid plants={items} onOpen={setOpenId} />
                </section>
              );
            })}
          </div>
        ) : (
          <Grid plants={filtered} onOpen={setOpenId} />
        )}
      </div>

      {/* Details Dialog */}
      <Dialog open={!!openId} onOpenChange={(v) => !v && setOpenId(null)}>
        <DialogContent className="max-w-2xl">
          {current && (
            <div>
              <DialogHeader>
                <DialogTitle>{current.name}</DialogTitle>
              </DialogHeader>

              <img src={current.imageUrl} alt={current.name} className="w-full rounded-lg" />
              {current.notes && <p className="mt-4">{current.notes}</p>}

              {/* Watering */}
              {current.watering && (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  <div className="rounded-md bg-gray-50 p-3">
                    <div className="font-medium">🌞 Summer</div>
                    <div className="text-gray-700">{current.watering.summer || "—"}</div>
                  </div>
                  <div className="rounded-md bg-gray-50 p-3">
                    <div className="font-medium">❄️ Winter</div>
                    <div className="text-gray-700">{current.watering.winter || "—"}</div>
                  </div>
                </div>
              )}

              {/* Maintenance details (human text if provided) */}
              {(current.details?.prune || current.details?.feed) && (
                <div className="mt-4 rounded-md border p-4 text-sm">
                  <h4 className="font-medium mb-2">Maintenance Notes</h4>
                  {current.details?.prune && <div>✂️ {current.details.prune}</div>}
                  {current.details?.feed && <div>🧪 {current.details.feed}</div>}
                </div>
              )}

              {/* Tag photos */}
              {current.tagImages && current.tagImages.length > 0 && (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {current.tagImages.map((src, i) => (
                    <img key={i} src={src} alt={`${current.name} tag ${i + 1}`} className="rounded-md" />
                  ))}
                </div>
              )}

              {current.link && (
                <a href={current.link} target="_blank" rel="noreferrer">
                  <Button className="mt-4 w-full">
                    Open care guide <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </a>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* --------------- Grid of plant cards --------------- */
function Grid({
  plants,
  onOpen,
}: {
  plants: Plant[];
  onOpen: (id: string | null) => void;
}) {
  return (
    <main className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {plants.map((p) => (
        <Card key={p.id} className="overflow-hidden shadow-sm hover:shadow-md transition">
          <button
            className="block text-left"
            onClick={() => onOpen(p.id)}
            aria-label={`Open details for ${p.name}`}
          >
            <div className="aspect-[4/3] bg-gray-100">
              <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
            </div>
            <CardContent className="p-4">
              <h3 className="font-medium">{p.name}</h3>
              <p className="text-sm text-gray-600">{readableLocation(p.location)}</p>

              {/* Watering preview (two lines) */}
              {p.watering && (
                <div className="mt-1 space-y-1 text-xs text-gray-500">
                  <p>🌞 {p.watering.summer || "—"}</p>
                  <p>❄️ {p.watering.winter || "—"}</p>
                </div>
              )}

              {/* NEW: maintenance badges */}
              {p.maintenance && (
                <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
                  {p.maintenance.prune && (
                    <span className="rounded-full bg-gray-100 px-2 py-0.5">✂️ Prune: {readableSeason(p.maintenance.prune)}</span>
                  )}
                  {p.maintenance.feed && (
                    <span className="rounded-full bg-gray-100 px-2 py-0.5">🧪 Feed: {readableSeason(p.maintenance.feed)}</span>
                  )}
                </div>
              )}
            </CardContent>
          </button>

          <div className="flex items-center justify-between px-4 pb-4 -mt-2">
            <a
              href={p.link || "#"}
              target={p.link ? "_blank" : "_self"}
              rel="noreferrer"
              aria-disabled={!p.link}
              onClick={(e) => {
                if (!p.link) e.preventDefault();
              }}
            >
              <Button variant="outline" size="sm" disabled={!p.link}>
                <LinkIcon className="w-4 h-4 mr-2" />
                Care Guide
              </Button>
            </a>
          </div>
        </Card>
      ))}
    </main>
  );
}

/* ---------------- utils ---------------- */
function readableLocation(key: LocationKey) {
  const found = LOCATIONS.find((l) => l.key === key);
  return found ? found.label : key;
}
function readableSeason(key?: SeasonKey) {
  const found = SEASONS.find((s) => s.key === key);
  return found ? found.label : key ?? "";
}