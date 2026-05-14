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
                    placeholder: "https://example.com/mobile@2x.jpg"
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
                    placeholder: "https://example.com/tablet@2x.jpg"
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
                    placeholder: "https://example.com/desktop@2x.jpg"
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
            description: "Makes the entire hero image a link"
          }
        ]
      },
      {
        title: "Layout",
        icon: "layout",
        controls: [
          {
            type: "select",
            label: "Layout Type",
            property: "props.layout",
            defaultValue: "overlay",
            options: [
              { value: "overlay", text: "Overlay" },
              { value: "split-start", text: "Split Left" },
              { value: "split-end", text: "Split Right" },
            ]
          }
        ]
      },
      {
        title: "Content Positioning",
        icon: "content-positioning",
        controls: [
          {
            type: "tabs",
            tabs: [
              {
                label: "Mobile",
                controls: [
                  {
                    type: "select",
                    label: "Placement",
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
                    type: "textfield",
                    label: "Padding",
                    property: "props.config.mobile.content.padding",
                    defaultValue: "1rem"
                  },
                  {
                    type: "textfield",
                    label: "Spacing",
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
                    type: "select",
                    label: "Placement",
                    property: "props.config.tablet.content.placement",
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
                    type: "textfield",
                    label: "Padding",
                    property: "props.config.tablet.content.padding",
                    defaultValue: "1rem"
                  },
                  {
                    type: "textfield",
                    label: "Spacing",
                    property: "props.config.tablet.content.gap",
                    defaultValue: "0.5rem",
                    description: "Space between child elements"
                  },
                ]
              },
              {
                label: "Desktop",
                controls: [
                  {
                    type: "select",
                    label: "Placement",
                    property: "props.config.desktop.content.placement",
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
                    type: "textfield",
                    label: "Padding",
                    property: "props.config.desktop.content.padding",
                    defaultValue: "1rem"
                  },
                  {
                    type: "textfield",
                    label: "Spacing",
                    property: "props.config.desktop.content.gap",
                    defaultValue: "0.5rem",
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
            label: "Tag",
            property: "props.tag",
            defaultValue: "h2",
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
        title: "Styling",
        icon: "styling",
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
        title: "Styling",
        icon: "styling",
        controls: [
          {
            type: "hint",
            description: "Mobile values apply to all sizes unless overridden per breakpoint."
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
                    placeholder: "e.g. 1.5"
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
                    property: "props.lineHeight.tablet",
                    defaultValue: "1.2",
                    placeholder: "e.g. 1.5"
                  },
                  {
                    type: "colorpicker",
                    label: "Color",
                    property: "props.color.tablet",
                    defaultValue: "inherit"
                  },
                  {
                    type: "checkbox",
                    label: "Italic",
                    property: "props.italic.tablet",
                    defaultValue: false
                  },
                  {
                    type: "checkbox",
                    label: "Underline",
                    property: "props.underline.tablet",
                    defaultValue: false
                  },
                ]
              },
              {
                label: "Desktop",
                controls: [
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
                    property: "props.lineHeight.desktop",
                    defaultValue: "1.2",
                    placeholder: "e.g. 1.5"
                  },
                  {
                    type: "colorpicker",
                    label: "Color",
                    property: "props.color.desktop",
                    defaultValue: "inherit"
                  },
                  {
                    type: "checkbox",
                    label: "Italic",
                    property: "props.italic.desktop",
                    defaultValue: false
                  },
                  {
                    type: "checkbox",
                    label: "Underline",
                    property: "props.underline.desktop",
                    defaultValue: false
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
            type: "textfield",
            label: "Value",
            property: "props.value",
            placeholder: "e.g. 40%, $15.99, Free",
            description: "Supports: 40%, 40% off, $15, $15.99, Free, or any text"
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
            description: "Accessible label — describe the full offer for screen readers"
          }
        ]
      },
      {
        title: "Styling",
        icon: "styling",
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
                    defaultValue: "0.5rem"
                  },
                  {
                    type: "textfield",
                    label: "Padding",
                    property: "props.config.mobile.padding",
                    defaultValue: "0"
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
                    defaultValue: "0.5rem"
                  },
                  {
                    type: "textfield",
                    label: "Padding",
                    property: "props.config.tablet.padding",
                    defaultValue: "0"
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
                    defaultValue: "0.5rem"
                  },
                  {
                    type: "textfield",
                    label: "Padding",
                    property: "props.config.desktop.padding",
                    defaultValue: "0"
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
            placeholder: "e.g. Shop Now"
          },
        ]
      },
      {
        title: "Styling",
        icon: "styling",
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
        controls: [
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
            placeholder: "e.g. Shop Now"
          },
          {
            type: "textfield",
            label: "URL",
            property: "props.href",
            placeholder: "https://example.com"
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
        title: "Styling",
        icon: "styling",
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
        controls: [
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
        controls: [
          {
            type: "select",
            label: "Corner",
            property: "props.position.corner",
            options: [
              { value: "", text: "None" },
              { value: "top-left", text: "Top Left" },
              { value: "top-right", text: "Top Right" },
              { value: "bottom-left", text: "Bottom Left" },
              { value: "bottom-right", text: "Bottom Right" },
            ]
          },
          {
            type: "textfield",
            label: "Gap",
            property: "props.position.gap",
            placeholder: "e.g. 0.5rem or 8",
            description: "Leave empty for flush positioning"
          }
        ]
      },
      {
        title: "Styling",
        icon: "styling",
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
        controls: [
          {
            type: "textfield",
            label: "Title",
            property: "props.title",
            placeholder: "Editorial title"
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

  EditorialCard: {
    sections: [
      {
        title: "Link",
        controls: [
          {
            type: "textfield",
            label: "Card URL",
            property: "props.href",
            placeholder: "https://example.com"
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
                    property: "props.images.mobile",
                    placeholder: "https://example.com/mobile.jpg"
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
                    placeholder: "https://example.com/tablet.jpg"
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
                    placeholder: "https://example.com/desktop.jpg"
                  }
                ]
              }
            ]
          },
          {
            type: "textfield",
            label: "Alt Text",
            property: "props.alt",
            placeholder: "Describe the image"
          }
        ]
      },
      {
        title: "Layout & Sizing",
        icon: "layout",
        controls: [
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
                    label: "Hidden on Mobile",
                    property: "props.hidden.mobile",
                    defaultValue: false
                  }
                ]
              },
              {
                label: "Tablet",
                controls: [
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
                    label: "Hidden on Tablet",
                    property: "props.hidden.tablet",
                    defaultValue: false
                  },
                ]
              },
              {
                label: "Desktop",
                controls: [
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
                    label: "Hidden on Desktop",
                    property: "props.hidden.desktop",
                    defaultValue: false
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
            label: "Supporting Text",
            property: "props.supportingText",
            placeholder: "Enter supporting text"
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
        title: "Overlay",
        icon: "content-positioning",
        controls: [
          {
            type: "hint",
            description: "The overlay positions child content over the card image."
          },
          {
            type: "tabs",
            tabs: [
              {
                label: "Mobile",
                controls: [
                  {
                    type: "select",
                    label: "Placement",
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
                  }
                ]
              },
              {
                label: "Tablet",
                controls: [
                  {
                    type: "select",
                    label: "Placement",
                    property: "props.overlay.placement.tablet",
                    defaultValue: "top-left",
                    options: [
                      { value: "top-left", text: "Top Left" },
                      { value: "top-right", text: "Top Right" },
                      { value: "center", text: "Center" },
                      { value: "bottom-left", text: "Bottom Left" },
                      { value: "bottom-right", text: "Bottom Right" },
                    ]
                  }
                ]
              },
              {
                label: "Desktop",
                controls: [
                  {
                    type: "select",
                    label: "Placement",
                    property: "props.overlay.placement.desktop",
                    defaultValue: "top-left",
                    options: [
                      { value: "top-left", text: "Top Left" },
                      { value: "top-right", text: "Top Right" },
                      { value: "center", text: "Center" },
                      { value: "bottom-left", text: "Bottom Left" },
                      { value: "bottom-right", text: "Bottom Right" },
                    ]
                  }
                ]
              }
            ]
          },
          {
            type: "textfield",
            label: "Padding",
            property: "props.overlay.padding",
            placeholder: "0.5rem",
            description: "Padding inside the overlay container"
          }
        ]
      },
      {
        title: "Styling",
        icon: "styling",
        controls: [
          {
            type: "segmentedbutton",
            label: "Text Alignment",
            property: "props.textAlignment",
            options: ["left", "center", "right"],
            defaultValue: "center"
          },
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
        title: "Heading",
        icon: "text",
        controls: [
          {
            type: "textfield",
            label: "Heading",
            property: "props.heading",
            placeholder: "Enter heading"
          },
          {
            type: "segmentedbutton",
            label: "Alignment",
            property: "props.headingAlign",
            options: ["left", "center", "right"],
            defaultValue: "center"
          },
          {
            type: "select",
            label: "Size",
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
            label: "Heading Color",
            property: "props.headingColor",
            defaultValue: "#212121"
          }
        ]
      },
      {
        title: "Styling",
        icon: "styling",
        controls: [
          {
            type: "colorpicker",
            label: "Background Color",
            property: "props.backgroundColor",
            defaultValue: "#f6f5f1"
          },
        ]
      },
      {
        title: "Carousel",
        icon: "layout",
        controls: [
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
      }
    ]
  },

  CollectionBlockItem: {
    sections: [
      {
        title: "Product Info",
        controls: [
          {
            type: "textfield",
            label: "Product Name",
            property: "props.product.name",
            placeholder: "Product name"
          },
          {
            type: "textfield",
            label: "Product URL",
            property: "props.product.href",
            placeholder: "/product/example"
          }
        ]
      },
      {
        title: "Pricing",
        controls: [
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
                    placeholder: "https://example.com/image.jpg"
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
                    placeholder: "https://example.com/image.jpg"
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
                    placeholder: "https://example.com/image.jpg"
                  }
                ]
              },

            ]
          }
        ]
      },
      {
        title: "Promo Badge",
        controls: [
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
            description: "Choose appropriate heading level for document structure",
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
  },

  RecommendationBlock: {
    sections: [
      {
        title: "Content",
        icon: "text",
        controls: [
          {
            type: "textfield",
            label: "Title",
            property: "props.title",
            placeholder: "e.g. Recommended For You"
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
        title: "Styling",
        icon: "styling",
        controls: [
          {
            type: "colorpicker",
            label: "Background Color",
            property: "props.backgroundColor"
          }
        ]
      }
    ]
  }
};
