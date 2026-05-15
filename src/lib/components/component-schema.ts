import { BREAKPOINTS } from "$lib/constants/breakpoints";

export type ControlSchema = {
  type: "textfield" | "textarea" | "number" | "colorpicker" | "checkbox" | "select" | "segmentedbutton" | "group" | "tabs" | "hint";
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
  icon?: "desktop" | "tablet" | "mobile" | "image" | "video" | "styling" | "content" | "layout" | "text" | "content-positioning";
  collapsed?: boolean;
  controls: ControlSchema[];
};

type ComponentSchema = {
  sections: SectionSchema[];
};

// Define component names as a union type
export type ComponentName =
  | "Hero"
  | "Heading"
  | "Text"
  | "OfferCallout"
  | "Badge"
  | "Link"
  | "CTAButton"
  | "CTAGroup"
  | "EditorialBlock"
  | "EditorialCard"
  | "CollectionBlock"
  | "CollectionBlockItem"
  | "FeaturedCategories"
  | "FeaturedCategory"
  | "RecommendationBlock";

export const componentSchemas: Record<ComponentName, ComponentSchema> = {
  Hero: {
    sections: [
      {
        title: "Media",
        icon: "image",
        controls: [
          {
            type: "tabs",
            tabs: [
              {
                label: "Mobile",
                controls: [
                  {
                    type: "textfield",
                    label: "Image URL",
                    property: "props.config.mobile.image.src",
                    placeholder: "https://example.com/mobile.jpg",
                    description: "Used below 668px"
                  },
                  {
                    type: "textfield",
                    label: "Image URL 2x",
                    property: "props.config.mobile.image.src2x",
                    placeholder: "https://example.com/mobile@2x.jpg",
                    description: "Optional — for retina displays"
                  }
                ]
              },
              {
                label: "Tablet",
                controls: [
                  {
                    type: "textfield",
                    label: "Image URL",
                    property: "props.config.tablet.image.src",
                    placeholder: "https://example.com/tablet.jpg",
                    description: "Used from 668px"
                  },
                  {
                    type: "textfield",
                    label: "Image URL 2x",
                    property: "props.config.tablet.image.src2x",
                    placeholder: "https://example.com/tablet@2x.jpg",
                    description: "Optional — for retina displays"
                  }
                ]
              },
              {
                label: "Desktop",
                controls: [
                  {
                    type: "textfield",
                    label: "Image URL",
                    property: "props.config.desktop.image.src",
                    placeholder: "https://example.com/desktop.jpg",
                    description: "Used from 1025px"
                  },
                  {
                    type: "textfield",
                    label: "Image URL 2x",
                    property: "props.config.desktop.image.src2x",
                    placeholder: "https://example.com/desktop@2x.jpg",
                    description: "Optional — for retina displays"
                  }
                ]
              },
            ]
          },
          {
            type: "textfield",
            label: "Alt Text",
            property: "props.alt",
            placeholder: "Describe the image for accessibility"
          },
          {
            type: "textfield",
            label: "Link URL",
            property: "props.href",
            placeholder: "https://example.com",
            description: "Makes the entire hero a clickable link"
          }
        ]
      },
      {
        title: "Content",
        icon: "content-positioning",
        collapsed: true,
        controls: [
          {
            type: "select",
            label: "Layout",
            property: "props.layout",
            defaultValue: "overlay",
            options: [
              { value: "overlay", text: "Overlay" },
              { value: "split-start", text: "Split Left" },
              { value: "split-end", text: "Split Right" },
            ]
          },
          {
            type: "hint",
            description: "Overlay places content on top of the image. Split Left/Right divides the hero into image and content side by side."
          },
          {
            type: "tabs",
            tabs: [
              {
                label: "Mobile",
                controls: [
                  {
                    type: "select",
                    label: "Content Placement",
                    property: "props.config.mobile.content.placement",
                    defaultValue: "center",
                    options: [
                      { value: "top-left", text: "Top Left" },
                      { value: "top-center", text: "Top Center" },
                      { value: "top-right", text: "Top Right" },
                      { value: "inline-left", text: "Center Left" },
                      { value: "center", text: "Center" },
                      { value: "inline-right", text: "Center Right" },
                      { value: "bottom-left", text: "Bottom Left" },
                      { value: "bottom-center", text: "Bottom Center" },
                      { value: "bottom-right", text: "Bottom Right" },
                    ]
                  },
                  {
                    type: "segmentedbutton",
                    label: "Text Alignment",
                    property: "props.config.mobile.content.textAlign",
                    defaultValue: "left",
                    options: ["left", "center", "right"]
                  },
                  {
                    type: "textfield",
                    label: "Content Padding",
                    property: "props.config.mobile.content.padding",
                    defaultValue: "1rem",
                    description: "Space around the content area"
                  },
                  {
                    type: "textfield",
                    label: "Content Spacing",
                    property: "props.config.mobile.content.gap",
                    defaultValue: "0.5rem",
                    description: "Space between child elements"
                  },
                ]
              },
              {
                label: "Tablet",
                controls: [
                  {
                    type: "hint",
                    description: "Only set values you want to change from mobile. Everything else inherits automatically."
                  },
                  {
                    type: "select",
                    label: "Content Placement",
                    property: "props.config.tablet.content.placement",
                    defaultValue: "",
                    options: [
                      { value: "", text: "— Inherit —" },
                      { value: "top-left", text: "Top Left" },
                      { value: "top-center", text: "Top Center" },
                      { value: "top-right", text: "Top Right" },
                      { value: "inline-left", text: "Center Left" },
                      { value: "center", text: "Center" },
                      { value: "inline-right", text: "Center Right" },
                      { value: "bottom-left", text: "Bottom Left" },
                      { value: "bottom-center", text: "Bottom Center" },
                      { value: "bottom-right", text: "Bottom Right" },
                    ]
                  },
                  {
                    type: "segmentedbutton",
                    label: "Text Alignment",
                    property: "props.config.tablet.content.textAlign",
                    options: ["left", "center", "right"]
                  },
                  {
                    type: "textfield",
                    label: "Content Padding",
                    property: "props.config.tablet.content.padding",
                    description: "Space around the content area"
                  },
                  {
                    type: "textfield",
                    label: "Content Spacing",
                    property: "props.config.tablet.content.gap",
                    description: "Space between child elements"
                  },
                ]
              },
              {
                label: "Desktop",
                controls: [
                  {
                    type: "hint",
                    description: "Only set values you want to change from tablet. Everything else inherits automatically."
                  },
                  {
                    type: "select",
                    label: "Content Placement",
                    property: "props.config.desktop.content.placement",
                    defaultValue: "",
                    options: [
                      { value: "", text: "— Inherit —" },
                      { value: "top-left", text: "Top Left" },
                      { value: "top-center", text: "Top Center" },
                      { value: "top-right", text: "Top Right" },
                      { value: "inline-left", text: "Center Left" },
                      { value: "center", text: "Center" },
                      { value: "inline-right", text: "Center Right" },
                      { value: "bottom-left", text: "Bottom Left" },
                      { value: "bottom-center", text: "Bottom Center" },
                      { value: "bottom-right", text: "Bottom Right" },
                    ]
                  },
                  {
                    type: "segmentedbutton",
                    label: "Text Alignment",
                    property: "props.config.desktop.content.textAlign",
                    options: ["left", "center", "right"]
                  },
                  {
                    type: "textfield",
                    label: "Content Padding",
                    property: "props.config.desktop.content.padding",
                    description: "Space around the content area"
                  },
                  {
                    type: "textfield",
                    label: "Content Spacing",
                    property: "props.config.desktop.content.gap",
                    description: "Space between child elements"
                  },
                ]
              }
            ]
          }
        ]
      }
    ]
  },

  Heading: {
    sections: [
      {
        title: "Content",
        icon: "text",
        controls: [
          {
            type: "textarea",
            label: "Text",
            property: "props.text",
            placeholder: "Enter heading text"
          },
          {
            type: "select",
            label: "Heading Level",
            property: "props.tag",
            defaultValue: "h2",
            description: "Use the correct level for your page structure — H1 should only appear once per page",
            options: [
              { value: "h1", text: "H1" },
              { value: "h2", text: "H2" },
              { value: "h3", text: "H3" },
              { value: "h4", text: "H4" },
              { value: "h5", text: "H5" },
              { value: "h6", text: "H6" },
            ]
          },
          {
            type: "segmentedbutton",
            label: "Alignment",
            property: "props.alignment",
            options: ["left", "center", "right"],
            defaultValue: "left"
          }
        ]
      },
      {
        title: "Appearance",
        icon: "styling",
        collapsed: true,
        controls: [
          {
            type: "select",
            label: "Size",
            property: "props.size",
            options: [
              { value: "sm", text: "Small" },
              { value: "md", text: "Medium" },
              { value: "lg", text: "Large" },
              { value: "12", text: ".75rem" },
              { value: "14", text: ".875rem" },
              { value: "16", text: "1rem" },
              { value: "18", text: "1.125rem" },
              { value: "20", text: "1.25rem" },
              { value: "22", text: "1.375rem" },
              { value: "24", text: "1.5rem" },
              { value: "26", text: "1.625rem" },
              { value: "28", text: "1.75rem" },
              { value: "30", text: "1.875rem" },
              { value: "32", text: "2rem" },
              { value: "34", text: "2.125rem" },
              { value: "36", text: "2.25rem" },
              { value: "38", text: "2.375rem" },
              { value: "40", text: "2.5rem" },
            ]
          },
          {
            type: "select",
            label: "Weight",
            property: "props.weight",
            options: [
              { value: "normal", text: "Normal" },
              { value: "medium", text: "Medium" },
              { value: "semibold", text: "Semibold" },
              { value: "bold", text: "Bold" },
              { value: "extrabold", text: "Extrabold" },
            ]
          },
          {
            type: "colorpicker",
            label: "Color",
            property: "props.color",
            defaultValue: "inherit"
          }
        ]
      }
    ]
  },

  Text: {
    sections: [
      {
        title: "Content",
        icon: "content",
        controls: [
          {
            type: "textarea",
            label: "Text",
            property: "props.text",
            placeholder: "Enter text"
          }
        ]
      },
      {
        title: "Appearance",
        icon: "styling",
        collapsed: true,
        controls: [
          {
            type: "hint",
            description: "Mobile values apply to all screen sizes unless overridden per breakpoint."
          },
          {
            type: "tabs",
            tabs: [
              {
                label: "Mobile",
                controls: [
                  {
                    type: "select",
                    label: "Size",
                    property: "props.size.mobile",
                    defaultValue: "md",
                    options: [
                      { value: "sm", text: "Small" },
                      { value: "md", text: "Medium" },
                      { value: "lg", text: "Large" },
                      { value: ".75rem", text: "12" },
                      { value: ".875rem", text: "14" },
                      { value: "1rem", text: "16" },
                      { value: "1.25rem", text: "18" },
                      { value: "1.5rem", text: "20" },
                      { value: "1.75rem", text: "22" },
                      { value: "2rem", text: "24" },
                      { value: "2.25rem", text: "26" },
                      { value: "2.5rem", text: "28" },
                      { value: "2.75rem", text: "30" },
                      { value: "3rem", text: "32" },
                      { value: "3.25rem", text: "34" },
                      { value: "3.5rem", text: "36" },
                      { value: "3.75rem", text: "38" },
                      { value: "4rem", text: "40" },
                      { value: "4.25rem", text: "42" },
                      { value: "4.5rem", text: "44" },
                    ]
                  },
                  {
                    type: "select",
                    label: "Weight",
                    property: "props.weight.mobile",
                    defaultValue: "inherit",
                    options: [
                      { value: "inherit", text: "Inherit" },
                      { value: "normal", text: "Normal" },
                      { value: "medium", text: "Medium" },
                      { value: "semibold", text: "Semibold" },
                      { value: "bold", text: "Bold" },
                    ]
                  },
                  {
                    type: "textfield",
                    label: "Line Height",
                    property: "props.lineHeight.mobile",
                    defaultValue: "1.2",
                    placeholder: "e.g. 1.5",
                    description: "Unitless values recommended e.g. 1.5"
                  },
                  {
                    type: "colorpicker",
                    label: "Color",
                    property: "props.color.mobile",
                    defaultValue: "inherit"
                  },
                  {
                    type: "checkbox",
                    label: "Italic",
                    property: "props.italic.mobile",
                    defaultValue: false
                  },
                  {
                    type: "checkbox",
                    label: "Underline",
                    property: "props.underline.mobile",
                    defaultValue: false
                  },
                ]
              },
              {
                label: "Tablet",
                controls: [
                  {
                    type: "hint",
                    description: "Only set values you want to change from mobile. Everything else inherits automatically."
                  },
                  {
                    type: "select",
                    label: "Size",
                    property: "props.size.tablet",
                    options: [
                      { value: "sm", text: "Small" },
                      { value: "md", text: "Medium" },
                      { value: "lg", text: "Large" },
                      { value: ".75rem", text: "12" },
                      { value: ".875rem", text: "14" },
                      { value: "1rem", text: "16" },
                      { value: "1.25rem", text: "18" },
                      { value: "1.5rem", text: "20" },
                      { value: "1.75rem", text: "22" },
                      { value: "2rem", text: "24" },
                      { value: "2.25rem", text: "26" },
                      { value: "2.5rem", text: "28" },
                      { value: "2.75rem", text: "30" },
                      { value: "3rem", text: "32" },
                      { value: "3.25rem", text: "34" },
                      { value: "3.5rem", text: "36" },
                      { value: "3.75rem", text: "38" },
                      { value: "4rem", text: "40" },
                      { value: "4.25rem", text: "42" },
                      { value: "4.5rem", text: "44" },
                    ]
                  },
                  {
                    type: "select",
                    label: "Weight",
                    property: "props.weight.tablet",
                    options: [
                      { value: "inherit", text: "Inherit" },
                      { value: "normal", text: "Normal" },
                      { value: "medium", text: "Medium" },
                      { value: "semibold", text: "Semibold" },
                      { value: "bold", text: "Bold" },
                    ]
                  },
                  {
                    type: "textfield",
                    label: "Line Height",
                    property: "props.lineHeight.tablet",
                    placeholder: "e.g. 1.5",
                    description: "Unitless values recommended e.g. 1.5"
                  },
                  {
                    type: "colorpicker",
                    label: "Color",
                    property: "props.color.tablet",
                  },
                  {
                    type: "checkbox",
                    label: "Italic",
                    property: "props.italic.tablet",
                  },
                  {
                    type: "checkbox",
                    label: "Underline",
                    property: "props.underline.tablet",
                  },
                ]
              },
              {
                label: "Desktop",
                controls: [
                  {
                    type: "hint",
                    description: "Only set values you want to change from tablet. Everything else inherits automatically."
                  },
                  {
                    type: "select",
                    label: "Size",
                    property: "props.size.desktop",
                    options: [
                      { value: "sm", text: "Small" },
                      { value: "md", text: "Medium" },
                      { value: "lg", text: "Large" },
                      { value: ".75rem", text: "12" },
                      { value: ".875rem", text: "14" },
                      { value: "1rem", text: "16" },
                      { value: "1.25rem", text: "18" },
                      { value: "1.5rem", text: "20" },
                      { value: "1.75rem", text: "22" },
                      { value: "2rem", text: "24" },
                      { value: "2.25rem", text: "26" },
                      { value: "2.5rem", text: "28" },
                      { value: "2.75rem", text: "30" },
                      { value: "3rem", text: "32" },
                      { value: "3.25rem", text: "34" },
                      { value: "3.5rem", text: "36" },
                      { value: "3.75rem", text: "38" },
                      { value: "4rem", text: "40" },
                      { value: "4.25rem", text: "42" },
                      { value: "4.5rem", text: "44" },
                    ]
                  },
                  {
                    type: "select",
                    label: "Weight",
                    property: "props.weight.desktop",
                    options: [
                      { value: "inherit", text: "Inherit" },
                      { value: "normal", text: "Normal" },
                      { value: "medium", text: "Medium" },
                      { value: "semibold", text: "Semibold" },
                      { value: "bold", text: "Bold" },
                    ]
                  },
                  {
                    type: "textfield",
                    label: "Line Height",
                    property: "props.lineHeight.desktop",
                    placeholder: "e.g. 1.5",
                    description: "Unitless values recommended e.g. 1.5"
                  },
                  {
                    type: "colorpicker",
                    label: "Color",
                    property: "props.color.desktop",
                  },
                  {
                    type: "checkbox",
                    label: "Italic",
                    property: "props.italic.desktop",
                  },
                  {
                    type: "checkbox",
                    label: "Underline",
                    property: "props.underline.desktop",
                  },
                ]
              }
            ]
          }
        ]
      }
    ]
  },

  OfferCallout: {
    sections: [
      {
        title: "Content",
        icon: "content",
        controls: [
          {
            type: "hint",
            description: "Value is the main offer — shown largest. Heading and Prefix appear above it, Legal Text appears below."
          },
          {
            type: "textfield",
            label: "Value",
            property: "props.value",
            placeholder: "e.g. 40%, $15.99, Free",
            description: "The primary offer amount or text"
          },
          {
            type: "textfield",
            label: "Heading",
            property: "props.heading",
            placeholder: "e.g. Sale from, Up to, Save"
          },
          {
            type: "textfield",
            label: "Prefix",
            property: "props.prefix",
            placeholder: "e.g. Up to, Save"
          },
          {
            type: "textfield",
            label: "Legal Text",
            property: "props.legalText",
            placeholder: "e.g. *Exclusions apply"
          },
          {
            type: "textfield",
            label: "Aria Label",
            property: "props.ariaLabel",
            placeholder: "e.g. Save 40% on selected items",
            description: "Describes the full offer for screen readers"
          }
        ]
      },
      {
        title: "Appearance",
        icon: "styling",
        collapsed: true,
        controls: [
          {
            type: "select",
            label: "Size",
            property: "props.size",
            defaultValue: "md",
            options: [
              { value: "sm", text: "Small" },
              { value: "md", text: "Medium" },
              { value: "lg", text: "Large" },
            ]
          },
          {
            type: "colorpicker",
            label: "Color",
            property: "props.color",
            defaultValue: "#212121"
          }
        ]
      }
    ]
  },

  CTAGroup: {
    sections: [
      {
        title: "Layout",
        icon: "layout",
        controls: [
          {
            type: "hint",
            description: "Controls how CTAs are arranged. Columns sets how many appear side by side. Spacing is the gap between them."
          },
          {
            type: "tabs",
            tabs: [
              {
                label: "Mobile",
                controls: [
                  {
                    type: "select",
                    label: "Columns",
                    property: "props.config.mobile.columns",
                    defaultValue: "2",
                    options: [
                      { value: "1", text: "1" },
                      { value: "2", text: "2" },
                      { value: "3", text: "3" },
                      { value: "4", text: "4" },
                    ]
                  },
                  {
                    type: "textfield",
                    label: "Spacing",
                    property: "props.config.mobile.spacing",
                    defaultValue: "0.5rem",
                    description: "Gap between CTAs"
                  },
                  {
                    type: "textfield",
                    label: "Padding",
                    property: "props.config.mobile.padding",
                    defaultValue: "0",
                    description: "Space around the CTA group"
                  },
                  {
                    type: "colorpicker",
                    label: "Background Color",
                    property: "props.config.mobile.bgColor",
                    defaultValue: "transparent"
                  }
                ]
              },
              {
                label: "Tablet",
                controls: [
                  {
                    type: "select",
                    label: "Columns",
                    property: "props.config.tablet.columns",
                    defaultValue: "2",
                    options: [
                      { value: "1", text: "1" },
                      { value: "2", text: "2" },
                      { value: "3", text: "3" },
                      { value: "4", text: "4" },
                    ]
                  },
                  {
                    type: "textfield",
                    label: "Spacing",
                    property: "props.config.tablet.spacing",
                    defaultValue: "0.5rem",
                    description: "Gap between CTAs"
                  },
                  {
                    type: "textfield",
                    label: "Padding",
                    property: "props.config.tablet.padding",
                    defaultValue: "0",
                    description: "Space around the CTA group"
                  },
                  {
                    type: "colorpicker",
                    label: "Background Color",
                    property: "props.config.tablet.bgColor",
                    defaultValue: "transparent"
                  }
                ]
              },
              {
                label: "Desktop",
                controls: [
                  {
                    type: "select",
                    label: "Columns",
                    property: "props.config.desktop.columns",
                    defaultValue: "2",
                    options: [
                      { value: "1", text: "1" },
                      { value: "2", text: "2" },
                      { value: "3", text: "3" },
                      { value: "4", text: "4" },
                    ]
                  },
                  {
                    type: "textfield",
                    label: "Spacing",
                    property: "props.config.desktop.spacing",
                    defaultValue: "0.5rem",
                    description: "Gap between CTAs"
                  },
                  {
                    type: "textfield",
                    label: "Padding",
                    property: "props.config.desktop.padding",
                    defaultValue: "0",
                    description: "Space around the CTA group"
                  },
                  {
                    type: "colorpicker",
                    label: "Background Color",
                    property: "props.config.desktop.bgColor",
                    defaultValue: "transparent"
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },

  CTAButton: {
    sections: [
      {
        title: "Content",
        icon: "content",
        controls: [
          {
            type: "textfield",
            label: "Label",
            property: "props.text",
            placeholder: "e.g. Shop Now, Learn More"
          },
        ]
      },
      {
        title: "Appearance",
        icon: "styling",
        collapsed: true,
        controls: [
          {
            type: "select",
            label: "Variant",
            property: "props.variant",
            defaultValue: "button",
            options: [
              { value: "default", text: "Default" },
              { value: "outlined", text: "Outlined" },
              { value: "button", text: "Button" },
            ]
          },
          {
            type: "select",
            label: "Shape",
            property: "props.shape",
            defaultValue: "pill",
            options: [
              { value: "default", text: "Default" },
              { value: "pill", text: "Pill" },
            ]
          },
          {
            type: "select",
            label: "Color",
            property: "props.color",
            defaultValue: "default",
            options: [
              { value: "default", text: "Default" },
              { value: "primary", text: "Primary" },
              { value: "secondary", text: "Secondary" },
              { value: "success", text: "Success" },
              { value: "danger", text: "Danger" },
              { value: "warning", text: "Warning" },
              { value: "info", text: "Info" },
              { value: "neutral", text: "Neutral" },
            ]
          },
          {
            type: "checkbox",
            label: "Full width",
            property: "props.fullWidth",
            defaultValue: false
          },
        ]
      },
      {
        title: "Custom Color",
        collapsed: true,
        controls: [
          {
            type: "hint",
            description: "Overrides the preset color. Leave all fields empty to use the Color setting above."
          },
          {
            type: "tabs",
            tabs: [
              {
                label: "Base",
                controls: [
                  { type: "colorpicker", label: "Text", property: "props.customColor.base.color" },
                  { type: "colorpicker", label: "Background", property: "props.customColor.base.bgColor" },
                  { type: "colorpicker", label: "Border", property: "props.customColor.base.borderColor" },
                ]
              },
              {
                label: "Hover",
                controls: [
                  { type: "colorpicker", label: "Text", property: "props.customColor.hover.color" },
                  { type: "colorpicker", label: "Background", property: "props.customColor.hover.bgColor" },
                  { type: "colorpicker", label: "Border", property: "props.customColor.hover.borderColor" },
                ]
              },
              {
                label: "Focus",
                controls: [
                  { type: "colorpicker", label: "Text", property: "props.customColor.focus.color" },
                  { type: "colorpicker", label: "Background", property: "props.customColor.focus.bgColor" },
                  { type: "colorpicker", label: "Border", property: "props.customColor.focus.borderColor" },
                ]
              },
            ]
          },
        ]
      }
    ]
  },

  Link: {
    sections: [
      {
        title: "Content",
        icon: "content",
        controls: [
          {
            type: "textfield",
            label: "Label",
            property: "props.text",
            placeholder: "e.g. Shop Now, Learn More"
          },
          {
            type: "textfield",
            label: "URL",
            property: "props.href",
            placeholder: "https://example.com",
            description: "Leave empty to render as a decorative button with no link"
          },
          {
            type: "checkbox",
            label: "Open in new tab",
            property: "props.external",
            defaultValue: false
          }
        ]
      },
      {
        title: "Appearance",
        icon: "styling",
        collapsed: true,
        controls: [
          {
            type: "select",
            label: "Variant",
            property: "props.variant",
            defaultValue: "button",
            options: [
              { value: "default", text: "Default" },
              { value: "outlined", text: "Outlined" },
              { value: "button", text: "Button" },
            ]
          },
          {
            type: "select",
            label: "Shape",
            property: "props.shape",
            defaultValue: "pill",
            options: [
              { value: "default", text: "Default" },
              { value: "pill", text: "Pill" },
            ]
          },
          {
            type: "select",
            label: "Color",
            property: "props.color",
            defaultValue: "inherit",
            options: [
              { value: "default", text: "Default" },
              { value: "primary", text: "Primary" },
              { value: "secondary", text: "Secondary" },
              { value: "success", text: "Success" },
              { value: "danger", text: "Danger" },
              { value: "warning", text: "Warning" },
              { value: "info", text: "Info" },
              { value: "neutral", text: "Neutral" },
            ]
          },
          {
            type: "select",
            label: "Underline",
            property: "props.underline",
            defaultValue: "none",
            options: [
              { value: "always", text: "Always" },
              { value: "hover", text: "On hover" },
              { value: "none", text: "None" },
            ]
          },
          {
            type: "checkbox",
            label: "Full width",
            property: "props.fullWidth",
            defaultValue: false
          },
        ]
      },
      {
        title: "Custom Color",
        collapsed: true,
        controls: [
          {
            type: "hint",
            description: "Overrides the preset color. Leave all fields empty to use the Color setting above."
          },
          {
            type: "tabs",
            tabs: [
              {
                label: "Base",
                controls: [
                  { type: "colorpicker", label: "Text", property: "props.customColor.base.color" },
                  { type: "colorpicker", label: "Background", property: "props.customColor.base.bgColor" },
                  { type: "colorpicker", label: "Border", property: "props.customColor.base.borderColor" },
                ]
              },
              {
                label: "Hover",
                controls: [
                  { type: "colorpicker", label: "Text", property: "props.customColor.hover.color" },
                  { type: "colorpicker", label: "Background", property: "props.customColor.hover.bgColor" },
                  { type: "colorpicker", label: "Border", property: "props.customColor.hover.borderColor" },
                ]
              },
              {
                label: "Focus",
                controls: [
                  { type: "colorpicker", label: "Text", property: "props.customColor.focus.color" },
                  { type: "colorpicker", label: "Background", property: "props.customColor.focus.bgColor" },
                  { type: "colorpicker", label: "Border", property: "props.customColor.focus.borderColor" },
                ]
              },
            ]
          },
        ]
      }
    ]
  },

  Badge: {
    sections: [
      {
        title: "Content",
        icon: "content",
        controls: [
          {
            type: "textfield",
            label: "Text",
            property: "props.text",
            placeholder: "e.g. New, Sale, Hot"
          }
        ]
      },
      {
        title: "Position",
        icon: "layout",
        collapsed: true,
        controls: [
          {
            type: "hint",
            description: "Positions the badge absolutely over its parent container. Leave Corner set to None to render the badge inline."
          },
          {
            type: "select",
            label: "Corner",
            property: "props.position.corner",
            options: [
              { value: "", text: "None — inline" },
              { value: "top-left", text: "Top Left" },
              { value: "top-right", text: "Top Right" },
              { value: "bottom-left", text: "Bottom Left" },
              { value: "bottom-right", text: "Bottom Right" },
            ]
          },
          {
            type: "textfield",
            label: "Offset",
            property: "props.position.gap",
            placeholder: "e.g. 0.5rem",
            description: "Distance from the corner — leave empty for flush positioning"
          }
        ]
      },
      {
        title: "Appearance",
        icon: "styling",
        collapsed: true,
        controls: [
          {
            type: "select",
            label: "Variant",
            property: "props.variant",
            defaultValue: "filled",
            options: [
              { value: "filled", text: "Filled" },
              { value: "outlined", text: "Outlined" },
            ]
          },
          {
            type: "select",
            label: "Color",
            property: "props.color",
            defaultValue: "default",
            options: [
              { value: "default", text: "Default" },
              { value: "primary", text: "Primary" },
              { value: "secondary", text: "Secondary" },
              { value: "success", text: "Success" },
              { value: "warning", text: "Warning" },
              { value: "danger", text: "Danger" },
              { value: "info", text: "Info" },
              { value: "neutral", text: "Neutral" },
            ]
          },
          {
            type: "select",
            label: "Size",
            property: "props.size",
            defaultValue: "md",
            options: [
              { value: "sm", text: "Small" },
              { value: "md", text: "Medium" },
              { value: "lg", text: "Large" },
            ]
          },
          {
            type: "select",
            label: "Shape",
            property: "props.shape",
            defaultValue: "default",
            options: [
              { value: "default", text: "Default" },
              { value: "pill", text: "Pill" },
              { value: "square", text: "Square" },
            ]
          }
        ]
      }
    ]
  },

  EditorialBlock: {
    sections: [
      {
        title: "Content",
        icon: "content",
        controls: [
          {
            type: "textfield",
            label: "Title",
            property: "props.title",
            placeholder: "e.g. New Arrivals, Shop by Style",
            description: "Optional — leave empty to hide the title"
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
        title: "Appearance",
        icon: "styling",
        collapsed: true,
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

  EditorialCard: {
    sections: [
      {
        title: "Media",
        icon: "image",
        controls: [
          {
            type: "tabs",
            tabs: [
              {
                label: "Mobile",
                controls: [
                  {
                    type: "textfield",
                    label: "Image URL",
                    property: "props.images.mobile",
                    placeholder: "https://example.com/mobile.jpg",
                    description: "Used below 668px"
                  }
                ]
              },
              {
                label: "Tablet",
                controls: [
                  {
                    type: "textfield",
                    label: "Image URL",
                    property: "props.images.tablet",
                    placeholder: "https://example.com/tablet.jpg",
                    description: "Used from 668px"
                  }
                ]
              },
              {
                label: "Desktop",
                controls: [
                  {
                    type: "textfield",
                    label: "Image URL",
                    property: "props.images.desktop",
                    placeholder: "https://example.com/desktop.jpg",
                    description: "Used from 1025px"
                  }
                ]
              }
            ]
          },
          {
            type: "textfield",
            label: "Alt Text",
            property: "props.alt",
            placeholder: "Describe the image for accessibility"
          }
        ]
      },
      {
        title: "Content",
        icon: "content",
        controls: [
          {
            type: "textfield",
            label: "Card URL",
            property: "props.href",
            placeholder: "https://example.com",
            description: "Makes the entire card a clickable link"
          },
          {
            type: "hint",
            description: "Headline, Subhead, and Supporting Text appear below the card image. Leave any field empty to hide it."
          },
          {
            type: "textfield",
            label: "Headline",
            property: "props.headline",
            placeholder: "e.g. New Arrivals",
            description: "Primary text — largest and most prominent"
          },
          {
            type: "textfield",
            label: "Subhead",
            property: "props.subhead",
            placeholder: "e.g. Shop the latest styles",
            description: "Secondary text — displayed beneath the headline"
          },
          {
            type: "textarea",
            label: "Supporting Text",
            property: "props.supportingText",
            placeholder: "e.g. Free shipping on orders over $50",
            description: "Additional detail — smaller and less prominent"
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
        title: "Layout",
        icon: "layout",
        collapsed: true,
        controls: [
          {
            type: "hint",
            description: "Cards are arranged in a 12-column grid from left to right. Column Span controls how wide a card is — Span 6 fills half the row, Span 12 fills the full width. Row Span controls how tall a card is relative to others in the same row. Hidden removes the card from view at that screen size without deleting it."
          },
          {
            type: "tabs",
            tabs: [
              {
                label: "Mobile",
                controls: [
                  {
                    type: "select",
                    label: "Column Span",
                    property: "props.spanColumn.mobile",
                    defaultValue: "span 6",
                    options: [
                      { value: "span 1", text: "Span 1" },
                      { value: "span 2", text: "Span 2" },
                      { value: "span 3", text: "Span 3" },
                      { value: "span 4", text: "Span 4" },
                      { value: "span 5", text: "Span 5" },
                      { value: "span 6", text: "Span 6" },
                      { value: "span 7", text: "Span 7" },
                      { value: "span 8", text: "Span 8" },
                      { value: "span 9", text: "Span 9" },
                      { value: "span 10", text: "Span 10" },
                      { value: "span 11", text: "Span 11" },
                      { value: "span 12", text: "Span 12" },
                    ]
                  },
                  {
                    type: "select",
                    label: "Row Span",
                    property: "props.spanRow.mobile",
                    defaultValue: "span 1",
                    options: [
                      { value: "span 1", text: "Span 1" },
                      { value: "span 2", text: "Span 2" },
                    ]
                  },
                  {
                    type: "checkbox",
                    label: "Hidden",
                    property: "props.hidden.mobile",
                    defaultValue: false
                  },
                  {
                    type: "select",
                    label: "Overlay Placement",
                    property: "props.overlay.placement.mobile",
                    defaultValue: "top-left",
                    options: [
                      { value: "top-left",      text: "Top Left" },
                      { value: "top-center",    text: "Top Center" },
                      { value: "top-right",     text: "Top Right" },
                      { value: "inline-left",   text: "Center Left" },
                      { value: "center",        text: "Center" },
                      { value: "inline-right",  text: "Center Right" },
                      { value: "bottom-left",   text: "Bottom Left" },
                      { value: "bottom-center", text: "Bottom Center" },
                      { value: "bottom-right",  text: "Bottom Right" },
                    ]
                  },
                  {
                    type: "textfield",
                    label: "Overlay Padding",
                    property: "props.overlay.padding.mobile",
                    placeholder: "0.5rem",
                    description: "Space inside the overlay area"
                  }
                ]
              },
              {
                label: "Tablet",
                controls: [
                  {
                    type: "hint",
                    description: "Only set values you want to change from mobile. Everything else inherits automatically."
                  },
                  {
                    type: "select",
                    label: "Column Span",
                    property: "props.spanColumn.tablet",
                    defaultValue: "span 4",
                    options: [
                      { value: "span 1", text: "Span 1" },
                      { value: "span 2", text: "Span 2" },
                      { value: "span 3", text: "Span 3" },
                      { value: "span 4", text: "Span 4" },
                      { value: "span 5", text: "Span 5" },
                      { value: "span 6", text: "Span 6" },
                      { value: "span 7", text: "Span 7" },
                      { value: "span 8", text: "Span 8" },
                      { value: "span 9", text: "Span 9" },
                      { value: "span 10", text: "Span 10" },
                      { value: "span 11", text: "Span 11" },
                      { value: "span 12", text: "Span 12" },
                    ]
                  },
                  {
                    type: "select",
                    label: "Row Span",
                    property: "props.spanRow.tablet",
                    defaultValue: "span 1",
                    options: [
                      { value: "span 1", text: "Span 1" },
                      { value: "span 2", text: "Span 2" },
                    ]
                  },
                  {
                    type: "checkbox",
                    label: "Hidden",
                    property: "props.hidden.tablet",
                    defaultValue: false
                  },
                  {
                    type: "select",
                    label: "Overlay Placement",
                    property: "props.overlay.placement.tablet",
                    defaultValue: "",
                    options: [
                      { value: "",              text: "— Inherit —" },
                      { value: "top-left",      text: "Top Left" },
                      { value: "top-center",    text: "Top Center" },
                      { value: "top-right",     text: "Top Right" },
                      { value: "inline-left",   text: "Center Left" },
                      { value: "center",        text: "Center" },
                      { value: "inline-right",  text: "Center Right" },
                      { value: "bottom-left",   text: "Bottom Left" },
                      { value: "bottom-center", text: "Bottom Center" },
                      { value: "bottom-right",  text: "Bottom Right" },
                    ]
                  },
                  {
                    type: "textfield",
                    label: "Overlay Padding",
                    property: "props.overlay.padding.tablet",
                    placeholder: "Inherit from mobile",
                    description: "Space inside the overlay area"
                  }
                ]
              },
              {
                label: "Desktop",
                controls: [
                  {
                    type: "hint",
                    description: "Only set values you want to change from tablet. Everything else inherits automatically."
                  },
                  {
                    type: "select",
                    label: "Column Span",
                    property: "props.spanColumn.desktop",
                    defaultValue: "span 3",
                    options: [
                      { value: "span 1", text: "Span 1" },
                      { value: "span 2", text: "Span 2" },
                      { value: "span 3", text: "Span 3" },
                      { value: "span 4", text: "Span 4" },
                      { value: "span 5", text: "Span 5" },
                      { value: "span 6", text: "Span 6" },
                      { value: "span 7", text: "Span 7" },
                      { value: "span 8", text: "Span 8" },
                      { value: "span 9", text: "Span 9" },
                      { value: "span 10", text: "Span 10" },
                      { value: "span 11", text: "Span 11" },
                      { value: "span 12", text: "Span 12" },
                    ]
                  },
                  {
                    type: "select",
                    label: "Row Span",
                    property: "props.spanRow.desktop",
                    defaultValue: "span 1",
                    options: [
                      { value: "span 1", text: "Span 1" },
                      { value: "span 2", text: "Span 2" },
                    ]
                  },
                  {
                    type: "checkbox",
                    label: "Hidden",
                    property: "props.hidden.desktop",
                    defaultValue: false
                  },
                  {
                    type: "select",
                    label: "Overlay Placement",
                    property: "props.overlay.placement.desktop",
                    defaultValue: "",
                    options: [
                      { value: "",              text: "— Inherit —" },
                      { value: "top-left",      text: "Top Left" },
                      { value: "top-center",    text: "Top Center" },
                      { value: "top-right",     text: "Top Right" },
                      { value: "inline-left",   text: "Center Left" },
                      { value: "center",        text: "Center" },
                      { value: "inline-right",  text: "Center Right" },
                      { value: "bottom-left",   text: "Bottom Left" },
                      { value: "bottom-center", text: "Bottom Center" },
                      { value: "bottom-right",  text: "Bottom Right" },
                    ]
                  },
                  {
                    type: "textfield",
                    label: "Overlay Padding",
                    property: "props.overlay.padding.desktop",
                    placeholder: "Inherit from tablet",
                    description: "Space inside the overlay area"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        title: "Appearance",
        icon: "styling",
        collapsed: true,
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

  CollectionBlock: {
    sections: [
      {
        title: "Content",
        icon: "content",
        controls: [
          {
            type: "textfield",
            label: "Title",
            property: "props.heading",
            placeholder: "e.g. Best Sellers, New Arrivals",
            description: "Optional — leave empty to hide the title"
          },
          {
            type: "segmentedbutton",
            label: "Title Alignment",
            property: "props.headingAlign",
            options: ["left", "center", "right"],
            defaultValue: "center"
          },
          {
            type: "select",
            label: "Title Size",
            property: "props.headingSize",
            defaultValue: "md",
            options: [
              { value: "sm", text: "Small" },
              { value: "md", text: "Medium" },
              { value: "lg", text: "Large" },
              { value: "xl", text: "Extra Large" }
            ]
          },
          {
            type: "colorpicker",
            label: "Title Color",
            property: "props.headingColor",
            defaultValue: "#212121"
          }
        ]
      },
      {
        title: "Carousel",
        icon: "layout",
        collapsed: true,
        controls: [
          {
            type: "hint",
            description: "Controls how many product cards are visible at once. Partial slides (e.g. 2.5) hint to users that more cards can be scrolled into view."
          },
          {
            type: "tabs",
            tabs: [
              {
                label: "Mobile",
                controls: [
                  {
                    type: "select",
                    label: "Slides Visible",
                    property: `props.breakpoints.${BREAKPOINTS.mobile}.slidesPerView`,
                    defaultValue: "2.5",
                    options: [
                      { value: "1", text: "1" },
                      { value: "1.5", text: "1.5" },
                      { value: "2", text: "2" },
                      { value: "2.5", text: "2.5" },
                      { value: "3", text: "3" },
                    ]
                  }
                ]
              },
              {
                label: "Tablet",
                controls: [
                  {
                    type: "select",
                    label: "Slides Visible",
                    property: `props.breakpoints.${BREAKPOINTS.tablet}.slidesPerView`,
                    defaultValue: "4",
                    options: [
                      { value: "2", text: "2" },
                      { value: "3", text: "3" },
                      { value: "4", text: "4" },
                      { value: "5", text: "5" },
                    ]
                  }
                ]
              },
              {
                label: "Desktop",
                controls: [
                  {
                    type: "select",
                    label: "Slides Visible",
                    property: `props.breakpoints.${BREAKPOINTS.desktop}.slidesPerView`,
                    defaultValue: "5",
                    options: [
                      { value: "3", text: "3" },
                      { value: "4", text: "4" },
                      { value: "5", text: "5" },
                      { value: "6", text: "6" },
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        title: "Appearance",
        icon: "styling",
        collapsed: true,
        controls: [
          {
            type: "colorpicker",
            label: "Background Color",
            property: "props.backgroundColor",
            defaultValue: "#f6f5f1"
          }
        ]
      }
    ]
  },

  CollectionBlockItem: {
    sections: [
      {
        title: "Product",
        icon: "content",
        controls: [
          {
            type: "textfield",
            label: "Product Name",
            property: "props.product.name",
            placeholder: "e.g. Classic White Sneaker"
          },
          {
            type: "textfield",
            label: "Product URL",
            property: "props.product.href",
            placeholder: "/products/example",
            description: "Relative or absolute URL to the product page"
          },
          {
            type: "number",
            label: "Original Price",
            property: "props.product.price.original",
            defaultValue: 0
          },
          {
            type: "number",
            label: "Sale Price",
            property: "props.product.price.sale",
            description: "Leave empty if not on sale"
          }
        ]
      },
      {
        title: "Media",
        icon: "image",
        controls: [
          {
            type: "tabs",
            tabs: [
              {
                label: "Mobile",
                controls: [
                  {
                    type: "textfield",
                    label: "Image URL",
                    property: "props.product.src.mobile",
                    placeholder: "https://example.com/image.jpg",
                    description: "Used below 668px"
                  }
                ]
              },
              {
                label: "Tablet",
                controls: [
                  {
                    type: "textfield",
                    label: "Image URL",
                    property: "props.product.src.tablet",
                    placeholder: "https://example.com/image.jpg",
                    description: "Used from 668px"
                  }
                ]
              },
              {
                label: "Desktop",
                controls: [
                  {
                    type: "textfield",
                    label: "Image URL",
                    property: "props.product.src.desktop",
                    placeholder: "https://example.com/image.jpg",
                    description: "Used from 1025px"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        title: "Promo Badge",
        icon: "styling",
        collapsed: true,
        controls: [
          {
            type: "hint",
            description: "Displays a small label over the product image. Leave Badge Text empty to hide it."
          },
          {
            type: "textfield",
            label: "Badge Text",
            property: "props.product.badge.text",
            placeholder: "e.g. Sale, New, 20% Off"
          },
          {
            type: "select",
            label: "Position",
            property: "props.product.badge.position",
            defaultValue: "top-left",
            options: [
              { value: "top-left", text: "Top Left" },
              { value: "top-right", text: "Top Right" },
              { value: "bottom-left", text: "Bottom Left" },
              { value: "bottom-right", text: "Bottom Right" }
            ]
          },
          {
            type: "select",
            label: "Size",
            property: "props.product.badge.size",
            defaultValue: "sm",
            options: [
              { value: "sm", text: "Small" },
              { value: "md", text: "Medium" },
              { value: "lg", text: "Large" }
            ]
          },
          {
            type: "select",
            label: "Shape",
            property: "props.product.badge.shape",
            options: [
              { value: "rounded", text: "Rounded" },
              { value: "pill", text: "Pill" },
              { value: "square", text: "Square" }
            ]
          },
          {
            type: "select",
            label: "Variant",
            property: "props.product.badge.variant",
            options: [
              { value: "solid", text: "Solid" },
              { value: "outline", text: "Outline" },
              { value: "soft", text: "Soft" }
            ]
          }
        ]
      }
    ]
  },

  FeaturedCategories: {
    sections: [
      {
        title: "Content",
        icon: "content",
        controls: [
          {
            type: "textfield",
            label: "Title",
            property: "props.title",
            placeholder: "e.g. Shop by Category",
            description: "Optional — leave empty to hide the title"
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
            defaultValue: "2",
            description: "Use the correct level for your page structure — H1 should only appear once per page",
            options: [
              { value: "1", text: "H1" },
              { value: "2", text: "H2" },
              { value: "3", text: "H3" },
              { value: "4", text: "H4" },
              { value: "5", text: "H5" },
              { value: "6", text: "H6" },
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
        icon: "content",
        controls: [
          {
            type: "textfield",
            label: "Label",
            property: "props.text",
            placeholder: "e.g. Women, Men, Kids"
          },
          {
            type: "textfield",
            label: "Link URL",
            property: "props.href",
            placeholder: "https://example.com/category",
            description: "Where the category links to"
          }
        ]
      },
      {
        title: "Media",
        icon: "image",
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
            placeholder: "Describe the image for accessibility"
          }
        ]
      }
    ]
  },

  RecommendationBlock: {
    sections: [
      {
        title: "Content",
        icon: "content",
        controls: [
          {
            type: "textfield",
            label: "Title",
            property: "props.title",
            placeholder: "e.g. Recommended For You",
            description: "Optional — leave empty to hide the title"
          },
          {
            type: "segmentedbutton",
            label: "Title Alignment",
            property: "props.titleAlignment",
            options: ["left", "center", "right"],
            defaultValue: "center"
          }
        ]
      },
      {
        title: "Appearance",
        icon: "styling",
        collapsed: true,
        controls: [
          {
            type: "colorpicker",
            label: "Background Color",
            property: "props.backgroundColor"
          }
        ]
      }
    ]
  },
};
