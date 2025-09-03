type ControlSchema = {
  type: "textfield" | "textarea" | "number" | "colorpicker" | "checkbox" | "select" | "segmentedbutton" | "group" | "tabs";
  property?: string;
  label?: string;
  placeholder?: string;
  description?: string;
  defaultValue?: any;
  options?: string[] | { value: string; text: string }[];
  min?: number;
  max?: number;
  step?: number;
  controls?: ControlSchema[];
  tabs?: {
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
export type ComponentName = "Hero" | "ProductCard" | "StoryBlock" | "StoryCard" | "FeaturedCategories" | "FeaturedCategory";

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
            placeholder: "https://example.com/desktop.jpg",
            description: "Required - This image will be used on tablet/desktop devices"
          },
          {
            type: "textfield",
            label: "Mobile Image URL",
            property: "props.images.mobile",
            placeholder: "https://example.com/mobile.jpg",
            description: "Required - This image will be used on mobile devices"
          },
          {
            type: "textfield",
            label: "Alt",
            property: "props.alt",
            placeholder: "Describe the image for accessibility"
          },
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
            label: "Subheading",
            property: "props.subheading",
            placeholder: "Enter subheading"
          },
          {
            type: "textarea",
            label: "Details",
            property: "props.supportingText",
            placeholder: "Enter details"
          },
          {
            type: "textfield",
            label: "Link (Optional)",
            property: "props.href",
            placeholder: "https://example.com"
          }
        ]
      },
      {
        title: "Content Positioning",
        controls: [
          {
            type: "tabs",
            tabs: [
              {
                label: "Mobile",
                controls: [
                  {
                    type: "segmentedbutton",
                    label: "Title Alignment",
                    property: "props.contentConfig.mobile.textAlign",
                    options: ["left", "center", "right"],
                    defaultValue: "center"
                  },
                  {
                    type: "select",
                    label: "Vertical Alignment",
                    property: "props.contentConfig.mobile.justify",
                    defaultValue: "center",
                    options: [
                      { value: "start", text: "Top" },
                      { value: "center", text: "Center" },
                      { value: "end", text: "Bottom" },
                    ]
                  },
                  {
                    type: "select",
                    label: "Horizontal Position",
                    property: "props.contentConfig.mobile.align",
                    defaultValue: "center",
                    options: [
                      { value: "start", text: "Left" },
                      { value: "center", text: "Center" },
                      { value: "end", text: "Right" },
                    ]
                  },
                  {
                    type: "textfield",
                    label: "Padding",
                    property: "props.contentConfig.mobile.padding",
                    defaultValue: "1rem"
                  }
                ]
              },
              {
                label: "Tablet",
                controls: [
                  {
                    type: "segmentedbutton",
                    label: "Title Alignment",
                    property: "props.contentConfig.tablet.textAlign",
                    options: ["left", "center", "right"],
                    defaultValue: "center"
                  },
                  {
                    type: "select",
                    label: "Vertical Alignment",
                    property: "props.contentConfig.tablet.justify",
                    defaultValue: "center",
                    options: [
                      { value: "start", text: "Top" },
                      { value: "center", text: "Center" },
                      { value: "end", text: "Bottom" },
                    ]
                  },
                  {
                    type: "select",
                    label: "Horizontal Position",
                    property: "props.contentConfig.tablet.align",
                    defaultValue: "center",
                    options: [
                      { value: "start", text: "Left" },
                      { value: "center", text: "Center" },
                      { value: "end", text: "Right" },
                    ]
                  },
                  {
                    type: "textfield",
                    label: "Padding",
                    property: "props.contentConfig.tablet.padding",
                    defaultValue: "1rem"
                  }
                ]
              },
              {
                label: "Desktop",
                controls: [
                  {
                    type: "segmentedbutton",
                    label: "Title Alignment",
                    property: "props.contentConfig.desktop.textAlign",
                    options: ["left", "center", "right"],
                    defaultValue: "center"
                  },
                  {
                    type: "select",
                    label: "Vertical Alignment",
                    property: "props.contentConfig.desktop.justify",
                    defaultValue: "center",
                    options: [
                      { value: "start", text: "Top" },
                      { value: "center", text: "Center" },
                      { value: "end", text: "Bottom" },
                    ]
                  },
                  {
                    type: "select",
                    label: "Horizontal Position",
                    property: "props.contentConfig.desktop.align",
                    defaultValue: "center",
                    options: [
                      { value: "start", text: "Left" },
                      { value: "center", text: "Center" },
                      { value: "end", text: "Right" },
                    ]
                  },
                  {
                    type: "textfield",
                    label: "Padding",
                    property: "props.contentConfig.desktop.padding",
                    defaultValue: "1rem"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        title: "Layout",
        controls: [
          {
            type: "segmentedbutton",
            label: "Layout Type",
            property: "props.layout",
            options: ["overlay", "split-left", "split-right"],
            defaultValue: "overlay"
          },
          {
            type: "group",
            label: "Dimensions",
            controls: [
              {
                type: "textfield",
                label: "Width",
                property: "props.width",
                defaultValue: 1200
              },
              {
                type: "textfield",
                label: "Height",
                property: "props.height",
                defaultValue: 460
              }
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
          {
            type: "select",
            label: "Heading Level",
            property: "props.headingLevel",
            description: "Choose appropiate headin level for document structure",
            defaultValue: "2",
            options: [
              { value: "1", text: "H1 - Section heading" },
              { value: "2", text: "H2 - Section heading" },
              { value: "3", text: "H3 - Section heading" },
              { value: "4", text: "H4 - Section heading" },
              { value: "5", text: "H5 - Section heading" },
              { value: "6", text: "H6 - Section heading" },
            ]
          }
        ]
      }
    ]
  },

  FeaturedCategory: {
    sections: [
      {
        title: "Content",
        controls: [
          {
            type: "textfield",
            label: "Category Text",
            property: "props.text",
            placeholder: "Category Name"
          }, 
          {
            type: "textfield",
            label: "Link URL",
            property: "props.href",
            placeholder: "https://example.com/category"
          }
        ]
      }, 
      {
        title: "Image",
        controls: [
          {
            type: "textfield",
            label: "Image URL",
            property: "props.image",
            placeholder: "https://example.com/image.jpg"
          },
          {
            type: "textfield",
            label: "Alt Text",
            property: "props.alt",
            placeholder: "Describe the image..."
          }
        ]
      }
    ]
  }
};