import type { Component } from "svelte";
import type { ComponentNode, ComponentMeta } from "./types";

import Hero from "./Hero.svelte";
import Heading from "./Heading.svelte";
import Text from "./Text.svelte";
import OfferCallout from "./OfferCallout.svelte";
import Link from "./Link.svelte";
import CTAGroup from "./CtaGroup.svelte";
import EditorialBlock from "./EditorialBlock.svelte";
import EditorialCard from "./EditorialCard.svelte";
import CollectionBlock from "./CollectionBlock.svelte";
import CollectionBlockItem from "./CollectionBlockItem.svelte";
import FeaturedCategories from "./FeaturedCategories.svelte";
import FeaturedCategory from "./FeaturedCategory.svelte";
import Card from "./Card.svelte";
import Badge from "./Badge.svelte";
import ProductCard from "./ProductCard.svelte";
import RecommendationBlock from "./RecommendationBlock.svelte";

// ---------------------------------------------------------------------------
// Component registry
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const componentRegistry: Record<string, Component<any, any, any>> = {
  Hero,
  Heading,
  Text,
  OfferCallout,
  Link,
  CTAButton: Link,
  CTAGroup,
  EditorialBlock,
  EditorialCard,
  CollectionBlock,
  CollectionBlockItem,
  FeaturedCategories,
  FeaturedCategory,
  Card,
  Badge,
  ProductCard,
  RecommendationBlock,
};

// ---------------------------------------------------------------------------
// Types
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

export type ChildOption = {
  label: string;
  childName: string;
  defaultProps: ComponentNode["props"];
  defaultMeta: Partial<ComponentMeta>;
  defaultChildren?: PartialComponentNode[];
};

export type ChildConfig = {
  label: string;
  options: ChildOption[];
};

export type SectionConfig = {
  label: string;
  name: string;
  disabled?: boolean;
  defaultProps: ComponentNode["props"];
  defaultData?: ComponentNode["data"];
  defaultMeta?: Partial<ComponentMeta>;
  defaultChildren?: PartialComponentNode[];
};

// ---------------------------------------------------------------------------
// Section configs
// ---------------------------------------------------------------------------

export const sectionConfigs: SectionConfig[] = [
  {
    label: "Hero",
    name: "Hero",
    defaultProps: {
      config: {
        mobile: {
          image: { src: "https://placehold.co/390x260" },
          content: { placement: "center", padding: "1rem" },
        },
        tablet: { },
        desktop: { },
      },
    },
    defaultData: {},
    defaultChildren: [],
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
    label: "Editorial Block",
    name: "EditorialBlock",
    defaultProps: { titleAlignment: "center" },
    defaultData: {},
    defaultChildren: [
      {
        type: "component",
        name: "EditorialCard",
        data: {},
        props: {
          images: { desktop: "", tablet: "", mobile: "" },
        },
        meta: { label: "Editorial Card" },
        children: [],
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
              mobile: "https://placehold.co/460x380",
              tablet: "https://placehold.co/460x380",
              desktop: "https://placehold.co/460x380"
            },
            href: "",
            name: "",
            badge: "",
            price: {
              original: 0,
              sale: null,
            },
          },
        },
        meta: { label: "Product Card" },
      },
    ],
  },
  {
    label: "Recommendation Block",
    name: "RecommendationBlock",
    // disabled: true,
    defaultProps: {
      title: "Recommended For You",
      titleAlignment: "center",
    },
    defaultData: {},
  },
];

// ---------------------------------------------------------------------------
// Child configs
// ---------------------------------------------------------------------------

export const childConfigs: Record<string, ChildConfig> = {
  Hero: {
    label: "Add Content",
    options: [
      {
        label: "Heading",
        childName: "Heading",
        defaultProps: { text: "", level: "2" },
        defaultMeta: { label: "Heading" },
      },
      {
        label: "Text",
        childName: "Text",
        defaultProps: {
          text: "",
          size: { mobile: "md" },
          weight: { mobile: "normal" },
          color: { mobile: "inherit" },
          lineHeight: { mobile: "1.2" },
          italic: { mobile: false },
          underline: { mobile: false },
          truncate: false,
        },
        defaultMeta: { label: "Text" },
      },
      {
        label: "Offer Callout",
        childName: "OfferCallout",
        defaultProps: { heading: "", value: "" },
        defaultMeta: { label: "Offer Callout" },
      },
      {
        label: "CTA Group",
        childName: "CTAGroup",
        defaultProps: { config: {} },
        defaultMeta: { label: "CTA Group" },
        defaultChildren: [
          {
            type: "component",
            name: "Link",
            props: {
              href: "",
              text: "Shop Now",
              variant: "button",
              shape: "pill",
              color: "default",
            },
            data: {},
            meta: { label: "CTA" },
          },
        ],
      },
      {
        label: "CTA",
        childName: "Link",
        defaultProps: {
          href: "",
          text: "Shop Now",
          variant: "button",
          shape: "pill",
          color: "default",
        },
        defaultMeta: { label: "CTA" },
      },
    ],
  },

  CTAGroup: {
    label: "Add CTA",
    options: [
      {
        label: "CTA",
        childName: "Link",
        defaultProps: {
          href: "",
          text: "Shop Now",
          variant: "button",
          shape: "pill",
          color: "default",
        },
        defaultMeta: { label: "CTA" },
      },
    ],
  },

  EditorialBlock: {
    label: "Add Card",
    options: [
      {
        label: "Editorial Card",
        childName: "EditorialCard",
        defaultProps: {
          images: { desktop: "", tablet: "", mobile: "" },
          backgroundColor: "#fff",
          textAlignment: "center",
        },
        defaultMeta: { label: "Editorial Card" },
        defaultChildren: [],
      },
    ],
  },

  EditorialCard: {
    label: "Add Content",
    options: [
      {
        label: "Text",
        childName: "Text",
        defaultProps: {
          text: "",
          size: { mobile: "md" },
          weight: { mobile: "normal" },
          color: { mobile: "inherit" },
          lineHeight: { mobile: "1.2" },
          italic: { mobile: false },
          underline: { mobile: false },
          truncate: false,
        },
        defaultMeta: { label: "Text" },
      },
      {
        label: "CTA",
        childName: "CTAButton",
        defaultProps: {
          href: null,
          text: "Shop Now",
          variant: "button",
          shape: "pill",
          color: "default",
          external: false,
          fullWidth: false,
        },
        defaultMeta: { label: "CTA" },
      },
      {
        label: "Offer Callout",
        childName: "OfferCallout",
        defaultProps: { heading: "", value: "" },
        defaultMeta: { label: "Offer Callout" },
      },
      {
        label: "Badge",
        childName: "Badge",
        defaultProps: {
          text: "New",
          variant: "filled",
          color: "primary",
          shape: "pill",
          size: "md",
          position: ""
        },
        defaultMeta: { label: "Badge" },
      },
    ],
  },

  CollectionBlock: {
    label: "Add Product Card",
    options: [
      {
        label: "Product Card",
        childName: "CollectionBlockItem",
        defaultProps: {
          product: {
            src: {
              mobile: "https://placehold.co/460x380",
            },
            href: "",
            name: "",
            badge: "",
            price: {
              original: 0,
              sale: null,
            },
          },
        },
        defaultMeta: { label: "Product Card" },
      },
    ],
  },

  FeaturedCategories: {
    label: "Add Category",
    options: [
      {
        label: "Featured Category",
        childName: "FeaturedCategory",
        defaultProps: {
          image: "",
          text: "",
          href: "",
        },
        defaultMeta: { label: "Featured Category" },
      },
    ],
  },
};
