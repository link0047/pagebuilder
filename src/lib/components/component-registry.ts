import type { Component } from "svelte";
import type { ComponentNode, ComponentMeta } from "./types";

import Hero from "./Hero.svelte";
import StoryBlock from "./StoryBlock.svelte";
import StoryCard from "./StoryCard.svelte";
import CollectionBlock from "./CollectionBlock.svelte";
import CollectionBlockItem from "./CollectionBlockItem.svelte";
import FeaturedCategories from "./FeaturedCategories.svelte";
import FeaturedCategory from "./FeaturedCategory.svelte";
import Card from "./Card.svelte";
import ProductCard from "./ProductCard.svelte";

// ---------------------------------------------------------------------------
// Component registry
// Maps component name strings (as stored in the page tree) to their Svelte
// component constructors. Add new components here — nowhere else.
//
// Component<any, any, any> is intentional — the registry holds components with
// varying prop signatures and we don't need type-level prop safety here. Props
// are validated at the schema level (component-schema.ts) instead.
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const componentRegistry: Record<string, Component<any, any, any>> = {
  Hero,
  StoryBlock,
  StoryCard,
  CollectionBlock,
  CollectionBlockItem,
  FeaturedCategories,
  FeaturedCategory,
  Card,
  ProductCard,
};

// ---------------------------------------------------------------------------
// PartialComponentNode
// A looser version of ComponentNode used in config definitions — id and meta
// are optional since insertComponent fills in safe defaults for anything
// not explicitly provided.
// ---------------------------------------------------------------------------

export type PartialComponentNode = {
  id?: string;
  type: "component";
  name: string;
  props: ComponentNode["props"];
  data: ComponentNode["data"];
  meta?: Partial<ComponentMeta>;
  children?: PartialComponentNode[];
};

// ---------------------------------------------------------------------------
// Section configs
// Defines the top-level sections available in the "Add Section" menu, along
// with their default props and any default children they start with.
// The page's +page.svelte editor reads this — add new sections here only.
// ---------------------------------------------------------------------------

export type SectionConfig = {
  label: string;
  name: string;
  disabled?: boolean;
  defaultProps: ComponentNode["props"];
  defaultData?: ComponentNode["data"];
  defaultMeta?: Partial<ComponentMeta>;
  defaultChildren?: PartialComponentNode[];
};

export const sectionConfigs: SectionConfig[] = [
  {
    label: "Hero",
    name: "Hero",
    defaultProps: {
      images: {
        desktop: "https://placehold.co/1200x460",
        tablet: "https://placehold.co/460x380",
        mobile: "https://placehold.co/460x380",
      },
      width: 1200,
      height: 460,
    },
    defaultData: { content: "" },
  },
  {
    label: "Featured Categories",
    name: "FeaturedCategories",
    defaultProps: {},
    defaultData: {},
    defaultChildren: [
      {
        type: "component",
        name: "FeaturedCategory",
        data: {},
        props: { image: "", text: "", href: "" },
        meta: { label: "Featured Category" },
      },
    ],
  },
  {
    label: "Story Block",
    name: "StoryBlock",
    defaultProps: { titleAlignment: "center" },
    defaultData: {},
    defaultChildren: [
      {
        type: "component",
        name: "StoryCard",
        data: {},
        props: {
          images: { desktop: "", tablet: "", mobile: "" },
        },
        meta: { label: "Story Card" },
      },
    ],
  },
  {
    label: "Collection Block",
    name: "CollectionBlock",
    defaultProps: {},
    defaultData: {},
    defaultChildren: [
      {
        type: "component",
        name: "CollectionBlockItem",
        data: {},
        props: {
          product: {
            src: {
              desktop: "https://placehold.co/460x380",
              mobile: "https://placehold.co/460x380"
            },
            href: "",
            name: "",
            badge: "",
            price: {
              original: 0,
              sale: null
            }
          },
        },
        meta: { label: "Product Card" },
      },
    ],
  },
  {
    label: "Recommendations Zone",
    name: "RecommendationsZone",
    disabled: true,
    defaultProps: {},
    defaultData: {},
  },
];

// ---------------------------------------------------------------------------
// Child component config
// Describes which components can have children, what child type they accept,
// and the default props for a new child. PageStructure reads this to know
// what "Add" actions to show — no more hardcoded if/else chains.
// ---------------------------------------------------------------------------

export type ChildConfig = {
  label: string;
  childName: string;
  defaultProps: ComponentNode["props"];
  defaultMeta: Partial<ComponentMeta>;
};

export const childConfigs: Record<string, ChildConfig> = {
  StoryBlock: {
    label: "Add Story Card",
    childName: "StoryCard",
    defaultProps: {
      images: { desktop: "", tablet: "", mobile: "" },
      backgroundColor: "#fff",
      textAlignment: "center",
    },
    defaultMeta: { label: "Story Card" },
  },

  CollectionBlock: {
    label: "Add Product Card",
    childName: "CollectionBlockItem",
    defaultProps: {
      product: {
        src: {
          desktop: "https://placehold.co/460x380",
          mobile: "https://placehold.co/460x380"
        },
        href: "",
        name: "",
        badge: "",
        price: {
          original: 0,
          sale: null
        }
      }
    },
    defaultMeta: { label: "Product Card" },
  },

  FeaturedCategories: {
    label: "Add Featured Category",
    childName: "FeaturedCategory",
    defaultProps: {
      image: "",
      text: "",
      href: "",
    },
    defaultMeta: { label: "Featured Category" },
  },

  Hero: {
    label: "Add CTA",
    childName: "HeroCTA",
    defaultProps: {
      href: "",
      variant: "solid",
      size: "medium",
      color: "default",
    },
    defaultMeta: { label: "Hero CTA" },
  },
};
