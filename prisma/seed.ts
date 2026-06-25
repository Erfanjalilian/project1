import "dotenv/config";
import { prisma } from "../lib/prisma";

const brands = [
  { name: "Maison Lumière", slug: "maison-lumiere" },
  { name: "Velvet Line", slug: "velvet-line" },
  { name: "Noir Atelier", slug: "noir-atelier" },
  { name: "Silk & Stone", slug: "silk-and-stone" },
];

const categories = [
  { name: "Outerwear", slug: "outerwear" },
  { name: "Tailoring", slug: "tailoring" },
  { name: "Knitwear", slug: "knitwear" },
  { name: "Dresses", slug: "dresses" },
  { name: "Accessories", slug: "accessories" },
];

const productTemplates = [
  {
    name: "Cashmere Overcoat",
    slug: "cashmere-overcoat",
    description:
      "A refined double-breasted overcoat crafted from premium cashmere with a structured silhouette and satin-lined interior.",
    price: 890,
    discountPercent: 0,
    isBestSeller: true,
    isNewArrival: false,
    isFeatured: true,
    brandSlug: "maison-lumiere",
    categorySlug: "outerwear",
    images: [
      "https://images.unsplash.com/photo-1539533018447-63fcce267608?w=1200&q=80",
      "https://images.unsplash.com/photo-1591047139820-d91aecb6caea?w=1200&q=80",
    ],
    colors: [
      { name: "Obsidian", hex: "#0D0D0D" },
      { name: "Camel", hex: "#C4A574" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
  },
  {
    name: "Structured Wool Blazer",
    slug: "structured-wool-blazer",
    description:
      "Tailored wool blazer with sharp shoulders, horn buttons, and a fluid drape designed for elevated everyday dressing.",
    price: 620,
    discountPercent: 15,
    isBestSeller: true,
    isNewArrival: true,
    isFeatured: true,
    brandSlug: "noir-atelier",
    categorySlug: "tailoring",
    images: [
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=1200&q=80",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1200&q=80",
    ],
    colors: [
      { name: "Charcoal", hex: "#2B2B2B" },
      { name: "Ivory", hex: "#F5F0E8" },
    ],
    sizes: ["S", "M", "L", "XL"],
  },
  {
    name: "Silk Evening Dress",
    slug: "silk-evening-dress",
    description:
      "Floor-length silk dress with a bias cut, subtle sheen, and minimalist neckline for timeless evening elegance.",
    price: 780,
    discountPercent: 20,
    isBestSeller: true,
    isNewArrival: false,
    isFeatured: true,
    brandSlug: "silk-and-stone",
    categorySlug: "dresses",
    images: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1200&q=80",
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=1200&q=80",
    ],
    colors: [
      { name: "Champagne", hex: "#C4A574" },
      { name: "Midnight", hex: "#101820" },
    ],
    sizes: ["XS", "S", "M", "L"],
  },
  {
    name: "Merino Roll Neck",
    slug: "merino-roll-neck",
    description:
      "Fine-gauge merino roll neck with a relaxed fit and clean finish, ideal for layered luxury styling.",
    price: 240,
    discountPercent: 10,
    isBestSeller: false,
    isNewArrival: true,
    isFeatured: false,
    brandSlug: "velvet-line",
    categorySlug: "knitwear",
    images: [
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=1200&q=80",
    ],
    colors: [
      { name: "Stone", hex: "#8E8578" },
      { name: "Black", hex: "#0D0D0D" },
    ],
    sizes: ["S", "M", "L", "XL"],
  },
  {
    name: "Leather Crossbody Bag",
    slug: "leather-crossbody-bag",
    description:
      "Minimal crossbody bag in full-grain leather with brushed gold hardware and an adjustable strap.",
    price: 420,
    discountPercent: 0,
    isBestSeller: true,
    isNewArrival: true,
    isFeatured: false,
    brandSlug: "noir-atelier",
    categorySlug: "accessories",
    images: [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1200&q=80",
    ],
    colors: [{ name: "Espresso", hex: "#3B2F2F" }],
    sizes: ["One Size"],
  },
  {
    name: "Pleated Midi Skirt",
    slug: "pleated-midi-skirt",
    description:
      "Fluid pleated midi skirt with a high waist and movement-focused construction for polished day-to-night wear.",
    price: 310,
    discountPercent: 25,
    isBestSeller: false,
    isNewArrival: true,
    isFeatured: true,
    brandSlug: "maison-lumiere",
    categorySlug: "dresses",
    images: [
      "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=1200&q=80",
    ],
    colors: [
      { name: "Sand", hex: "#D8CFC0" },
      { name: "Noir", hex: "#0D0D0D" },
    ],
    sizes: ["XS", "S", "M", "L"],
  },
  {
    name: "Tailored Trousers",
    slug: "tailored-trousers",
    description:
      "High-rise tailored trousers with a tapered leg, pressed crease, and concealed closure.",
    price: 290,
    discountPercent: 0,
    isBestSeller: true,
    isNewArrival: false,
    isFeatured: false,
    brandSlug: "velvet-line",
    categorySlug: "tailoring",
    images: [
      "https://images.unsplash.com/photo-1594633312681-425a7b956cc9?w=1200&q=80",
    ],
    colors: [
      { name: "Graphite", hex: "#44403C" },
      { name: "Ivory", hex: "#F5F0E8" },
    ],
    sizes: ["S", "M", "L", "XL"],
  },
  {
    name: "Quilted Puffer Jacket",
    slug: "quilted-puffer-jacket",
    description:
      "Lightweight quilted puffer with matte finish, hidden hood, and premium down fill for refined cold-weather layering.",
    price: 540,
    discountPercent: 30,
    isBestSeller: false,
    isNewArrival: true,
    isFeatured: true,
    brandSlug: "silk-and-stone",
    categorySlug: "outerwear",
    images: [
      "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=1200&q=80",
    ],
    colors: [
      { name: "Pearl", hex: "#EDE8DE" },
      { name: "Onyx", hex: "#111111" },
    ],
    sizes: ["S", "M", "L", "XL"],
  },
];

async function main() {
  await prisma.newsletterSubscriber.deleteMany();
  await prisma.productSize.deleteMany();
  await prisma.productColor.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.banner.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.aboutContent.deleteMany();
  await prisma.contactInfo.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.category.deleteMany();

  await prisma.brand.createMany({ data: brands });
  await prisma.category.createMany({ data: categories });

  const brandMap = Object.fromEntries(
    (await prisma.brand.findMany()).map((brand) => [brand.slug, brand.id]),
  );
  const categoryMap = Object.fromEntries(
    (await prisma.category.findMany()).map((category) => [
      category.slug,
      category.id,
    ]),
  );

  for (const product of productTemplates) {
    await prisma.product.create({
      data: {
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        discountPercent: product.discountPercent,
        isBestSeller: product.isBestSeller,
        isNewArrival: product.isNewArrival,
        isFeatured: product.isFeatured,
        stock: 24,
        brandId: brandMap[product.brandSlug],
        categoryId: categoryMap[product.categorySlug],
        images: {
          create: product.images.map((url, index) => ({
            url,
            alt: product.name,
            order: index,
          })),
        },
        colors: {
          create: product.colors,
        },
        sizes: {
          create: product.sizes.map((name) => ({ name })),
        },
      },
    });
  }

  await prisma.banner.createMany({
    data: [
      {
        title: "The Winter Edit",
        subtitle: "Refined layers for the season",
        description:
          "Discover outerwear and knitwear crafted for warmth without compromising elegance.",
        imageUrl:
          "https://images.unsplash.com/photo-1483985988351-763728e81991?w=1600&q=80",
        linkUrl: "/shop?bestSelling=true",
        order: 1,
      },
      {
        title: "New Arrivals",
        subtitle: "Fresh silhouettes, timeless finish",
        description:
          "Explore the latest pieces from our curated contemporary collection.",
        imageUrl:
          "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=80",
        linkUrl: "/shop?sort=newest",
        order: 2,
      },
      {
        title: "Private Sale",
        subtitle: "Up to 30% off selected styles",
        description:
          "Limited-time offers on best-selling tailoring, dresses, and accessories.",
        imageUrl:
          "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1600&q=80",
        linkUrl: "/shop?highestDiscount=true",
        order: 3,
      },
    ],
  });

  await prisma.teamMember.createMany({
    data: [
      {
        name: "Isabella Laurent",
        role: "Creative Director",
        bio: "Isabella leads the design vision with a focus on sculptural tailoring and understated luxury.",
        imageUrl:
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80",
        order: 1,
      },
      {
        name: "Marcus Chen",
        role: "Head of Merchandising",
        bio: "Marcus curates each collection with precision, balancing commercial appeal and editorial quality.",
        imageUrl:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
        order: 2,
      },
      {
        name: "Elena Rossi",
        role: "Brand Experience Lead",
        bio: "Elena shapes the customer journey across digital and in-store touchpoints with a premium standard.",
        imageUrl:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&q=80",
        order: 3,
      },
    ],
  });

  await prisma.aboutContent.create({
    data: {
      introduction:
        "ATELIER NOIR is a contemporary clothing house defined by refined silhouettes, premium materials, and a minimalist design language.",
      story:
        "Founded with the belief that luxury should feel effortless, ATELIER NOIR began as a small tailoring studio and evolved into a modern fashion destination for discerning customers worldwide.",
      mission:
        "To create timeless wardrobe essentials that combine craftsmanship, comfort, and contemporary elegance.",
      vision:
        "To become the leading destination for modern luxury clothing, recognized for quality, sustainability, and exceptional customer experience.",
    },
  });

  await prisma.contactInfo.create({
    data: {
      officeAddress: "742 Madison Avenue, New York, NY 10065",
      telephone: "+1 (212) 555-0198",
      mobile: "+1 (917) 555-0142",
      email: "concierge@ateliernoir.com",
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
