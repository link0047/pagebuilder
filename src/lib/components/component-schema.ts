type ControlSchema = {
  type: "textfield" | "textarea" | "number" | "colorpicker" | "checkbox" | "select" | "segmentedbutton" | "objectgroup" | "tabs";
  property: string;
  label?: string;
  placeholder?: string;
  defaultValue?: any;
  options?: string[] | { value: string; text: string }[];
  min?: number;
  max?: number;
  step?: number;
  fields?: {
    key: string;
    label: string;
    type: "textfield" | "checkbox";
    placeholder?: string;
    defaultValue?: unknown;
  }[];
  tabs?: {
    key: string;
    label: string;
    icon?: string;
    controls: Omit<ControlSchema, "tabs">[];
  }[];
};

type SectionSchema = {
  title: string;
  controls: ControlSchema[];
};

type ComponentSchema = {
  sections: SectionSchema[];
};

// Define component names as a union type
export type ComponentName = "Hero" | "HeroWithText" | "ProductCard" | "StoryBlock" | "StoryCard" | "FeaturedCategories" | "FeaturedCategory";

export const componentSchemas: Record<ComponentName, ComponentSchema> = {
  Hero: {
    sections: [
      {
        title: "Media",
        controls: [
          {
            type: "textfield",
            label: "Desktop Image URL",
            property: "props.images.desktop",
            placeholder: "https://example.com/desktop.jpg"
          },
          {
            type: "textfield",
            label: "Mobile Image URL",
            property: "props.images.mobile",
            placeholder: "https://example.com/mobile.jpg"
          },
          {
            type: "textfield",
            label: "Alt",
            property: "props.alt",
            placeholder: "Hero alt"
          },
        ]
      },
      {
        title: "Styling",
        controls: [
          {
            type: "colorpicker",
            label: "Background Color",
            property: "props.backgroundColor",
            defaultValue: "#fff"
          },
        ]
      }
    ]
  },

  HeroWithText: {
    sections: [
      {
        title: "Content",
        controls: [
          {
            type: "textfield",
            label: "Title",
            property: "props.title",
            placeholder: "Hero title"
          },
          {
            type: "textfield",
            label: "Subtitle", 
            property: "props.subtitle",
            placeholder: "Hero subtitle"
          },
          {
            type: "textarea",
            label: "Description",
            property: "props.description",
            placeholder: "Hero description..."
          },
          {
            type: "textfield",
            label: "CTA Text",
            property: "props.ctaText",
            placeholder: "Learn More"
          },
          {
            type: "textfield",
            label: "CTA Link",
            property: "props.ctaLink",
            placeholder: "https://example.com"
          }
        ]
      },
      {
        title: "Background",
        controls: [
          {
            type: "textfield",
            label: "Background Image",
            property: "props.backgroundImage",
            placeholder: "https://example.com/bg.jpg"
          }
        ]
      }
    ]
  },

  ProductCard: {
    sections: [
      {
        title: "Product Info",
        controls: [
          {
            type: "textfield",
            label: "Product Name",
            property: "props.name",
            placeholder: "Product name"
          },
          {
            type: "number",
            label: "Price",
            property: "props.price",
            defaultValue: 0
          },
          {
            type: "textfield",
            label: "Currency",
            property: "props.currency",
            defaultValue: "$"
          },
          {
            type: "textfield",
            label: "Image URL",
            property: "props.image",
            placeholder: "https://example.com/product.jpg"
          }
        ]
      },
      {
        title: "Details",
        controls: [
          {
            type: "textarea",
            label: "Description",
            property: "props.description",
            placeholder: "Product description..."
          },
          {
            type: "number",
            label: "Rating",
            property: "props.rating",
            min: 0,
            max: 5,
            step: 0.1
          },
          {
            type: "checkbox",
            label: "In Stock",
            property: "props.inStock",
            defaultValue: true
          }
        ]
      }
    ]
  },

  StoryBlock: {
    sections: [
      {
        title: "Content",
        controls: [
          {
            type: "textfield",
            label: "Title",
            property: "props.title",
            placeholder: "Story title"
          },
          {
            type: "segmentedbutton",
            label: "Title Alignment",
            property: "props.titleAlignment",
            options: ["left", "center", "right"],
            defaultValue: "center"
          },
        ]
      },
      {
        title: "Styling",
        controls: [
          {
            type: "colorpicker",
            label: "Background Color",
            property: "props.backgroundColor",
            defaultValue: "#fff"
          }
        ]
      }
    ]
  },

  StoryCard: {
    sections: [
      {
        title: "Link",
        controls: [
          {
            type: "textfield",
            label: "Card URL",
            property: "props.href"
          }
        ]
      },
      {
        title: "Media",
        controls: [
          {
            type: "tabs",
            property: "props.mediaType",
            tabs: [
              {
                key: "image",
                label: "Image",
                icon: "",
                controls: [
                  {
                    type: "textfield",
                    label: "Desktop Image URL",
                    property: "props.images.desktop",
                    placeholder: "https://example.com/desktop.jpg"
                  },
                  {
                    type: "textfield",
                    label: "Tablet Image URL",
                    property: "props.images.tablet",
                    placeholder: "https://example.com/desktop.jpg"
                  },
                  {
                    type: "textfield",
                    label: "Mobile Image URL",
                    property: "props.images.mobile",
                    placeholder: "https://example.com/desktop.jpg"
                  }
                ]
              },
              {
                key: "video",
                label: "Video",
                icon: "",
                controls: [
                  {
                    type: "textfield",
                    label: "Video URL",
                    property: "props.video",
                    placeholder: "https://example.com/desktop.jpg"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        title: "Layout & Sizing",
        controls: [
          {
            type: "tabs",
            property: "props.layout",
            tabs: [
              {
                key: "layout",
                label: "Desktop",
                icon: "",
                controls: [
                  {
                    type: "select",
                    label: "Column Span",
                    property: "props.spanColumn.desktop",
                    defaultValue: "span 3",
                    options: [
                      { value: "span 1", text: "Span 1 columns" },
                      { value: "span 2", text: "Span 2 columns" },
                      { value: "span 3", text: "Span 3 columns" },
                      { value: "span 4", text: "Span 4 columns" },
                      { value: "span 5", text: "Span 5 columns" },
                      { value: "span 6", text: "Span 6 columns" },
                      { value: "span 7", text: "Span 7 columns" },
                      { value: "span 8", text: "Span 8 columns" },
                      { value: "span 9", text: "Span 9 columns" },
                      { value: "span 10", text: "Span 10 columns" },
                      { value: "span 11", text: "Span 11 columns" },
                      { value: "span 12", text: "Span 12 columns" }
                    ]
                  }, 
                  {
                    type: "select",
                    label: "Row Span",
                    property: "props.spanRow.desktop",
                    defaultValue: "span 1",
                    options: [
                      { value: "span 1", text: "Span 1 row" },
                      { value: "span 2", text: "Span 2 row" }
                    ]
                  }
                ]
              },
              {
                key: "layout",
                label: "Tablet",
                icon: "",
                controls: [
                  {
                    type: "select",
                    label: "Column Span",
                    property: "props.spanColumn.tablet",
                    defaultValue: "span 3",
                    options: [
                      { value: "span 1", text: "Span 1 columns" },
                      { value: "span 2", text: "Span 2 columns" },
                      { value: "span 3", text: "Span 3 columns" },
                      { value: "span 4", text: "Span 4 columns" },
                      { value: "span 5", text: "Span 5 columns" },
                      { value: "span 6", text: "Span 6 columns" },
                      { value: "span 7", text: "Span 7 columns" },
                      { value: "span 8", text: "Span 8 columns" },
                      { value: "span 9", text: "Span 9 columns" },
                      { value: "span 10", text: "Span 10 columns" },
                      { value: "span 11", text: "Span 11 columns" },
                      { value: "span 12", text: "Span 12 columns" },
                    ]
                  },
                  {
                    type: "select",
                    label: "Row Span",
                    property: "props.spanRow.tablet",
                    defaultValue: "span 1",
                    options: [
                      { value: "span 1", text: "Span 1 row" },
                      { value: "span 2", text: "Span 2 row" }
                    ]
                  }
                ]
              },
              {
                key: "layout",
                label: "Mobile",
                icon: "",
                controls: [
                  {
                    type: "select",
                    label: "Column Span",
                    property: "props.spanColumn.mobile",
                    defaultValue: "span 6",
                    options: [
                      { value: "span 1", text: "Span 1 columns" },
                      { value: "span 2", text: "Span 2 columns" },
                      { value: "span 3", text: "Span 3 columns" },
                      { value: "span 4", text: "Span 4 columns" },
                      { value: "span 5", text: "Span 5 columns" },
                      { value: "span 6", text: "Span 6 columns" },
                      { value: "span 7", text: "Span 7 columns" },
                      { value: "span 8", text: "Span 8 columns" },
                      { value: "span 9", text: "Span 9 columns" },
                      { value: "span 10", text: "Span 10 columns" },
                      { value: "span 11", text: "Span 11 columns" },
                      { value: "span 12", text: "Span 12 columns" },
                    ]
                  },
                  {
                    type: "select",
                    label: "Row Span",
                    property: "props.spanRow.mobile",
                    defaultValue: "span 1",
                    options: [
                      { value: "span 1", text: "Span 1 row" },
                      { value: "span 2", text: "Span 2 row" }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        title: "Content",
        controls: [
          {
            type: "textfield",
            label: "Headline",
            property: "props.headline",
            placeholder: "Enter headline"
          },
          {
            type: "textfield",
            label: "Subhead",
            property: "props.subhead",
            placeholder: "Enter subhead"
          },
          {
            type: "textarea",
            label: "Details",
            property: "props.supportingText",
            placeholder: "Enter subhead"
          }, 
          {
            type: "segmentedbutton",
            label: "Text Alignment",
            property: "props.textAlignment",
            options: ["left", "center", "right"],
            defaultValue: "center"
          }
        ]
      }, 
      {
        title: "Promo Badge",
        controls: [
          {
            type: "textfield",
            label: "Badge Heading",
            property: "props.promo.heading",
            placeholder: "e.g., Sale from, Up to, Save Up to, BOGO"
          },
          {
            type: "textfield",
            label: "Badge Text",
            property: "props.promo.value",
            placeholder: "e.g., $4, 40%, $15.99, Free"
          }, 
          {
            type: "select",
            label: "Badge Position",
            property: "props.promo.placement",
            options: [
              { value: "top-left", text: "Top Left" },
              { value: "top-right", text: "Top Right" },
              { value: "bottom-left", text: "Bottom Left" },
              { value: "bottom-right", text: "Bottom Right" }
            ]
          }
        ]
      },
      {
        title: "Styling",
        controls: [
          {
            type: "colorpicker",
            label: "Background Color",
            property: "props.backgroundColor",
            defaultValue: "#fff"
          },
          {
            type: "colorpicker",
            label: "Text Color",
            property: "props.textColor",
            defaultValue: "#212121"
          }
        ]
      }
    ]
  },

  FeaturedCategories: {
    sections: []
  },

  FeaturedCategory: {
    sections: []
  }
};