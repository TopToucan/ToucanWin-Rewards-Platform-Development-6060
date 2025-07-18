import { extendTheme } from '@chakra-ui/react';

// ToucanWin custom color palette with high contrast
const colors = {
  teal: {
    50: '#E6FFFA',
    100: '#B2F5EA',
    200: '#81E6D9',
    300: '#4FD1C5',
    400: '#38B2AC',
    500: '#06d79c', // Primary brand color
    600: '#05c08c', // Darker shade for hover states
    700: '#04a97c',
    800: '#03916c',
    900: '#02785c',
  },
  gray: {
    50: '#f9f9f9',
    100: '#f2f2f2', // Light background
    200: '#e6e6e6',
    300: '#d1d1d1',
    400: '#b4b4b4',
    500: '#969696',
    600: '#717171', // Text color - meets WCAG AA standards
    700: '#5a5a5a',
    800: '#3d3d3d', // High contrast text
    900: '#1f1f1f',
  }
};

// Typography with improved readability
const fonts = {
  heading: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
  body: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
};

// Component style overrides with accessibility improvements
const components = {
  Button: {
    baseStyle: {
      fontWeight: 'semibold',
      borderRadius: 'lg',
      _focus: {
        boxShadow: '0 0 0 3px rgba(6, 215, 156, 0.6)',
        outline: 'none',
      },
      _focusVisible: {
        boxShadow: '0 0 0 3px rgba(6, 215, 156, 0.6)',
        outline: 'none',
      }
    },
    variants: {
      solid: {
        bg: 'teal.500',
        color: 'white',
        _hover: {
          bg: 'teal.600',
          _disabled: {
            bg: 'teal.500',
          },
        },
        _active: {
          bg: 'teal.700',
        },
      },
      outline: {
        borderColor: 'teal.500',
        color: 'teal.600',
        _hover: {
          bg: 'teal.50',
          borderColor: 'teal.600',
        },
        _active: {
          bg: 'teal.100',
        },
      },
    },
  },
  Heading: {
    baseStyle: {
      color: 'gray.800',
      fontWeight: 'bold',
      lineHeight: 'shorter',
    },
  },
  Badge: {
    baseStyle: {
      borderRadius: 'full',
      textTransform: 'normal',
      fontWeight: 'medium',
    },
  },
  Input: {
    baseStyle: {
      field: {
        _focus: {
          borderColor: 'teal.500',
          boxShadow: '0 0 0 1px #06d79c',
        },
        _focusVisible: {
          borderColor: 'teal.500',
          boxShadow: '0 0 0 1px #06d79c',
        }
      }
    },
  },
  Card: {
    baseStyle: {
      container: {
        borderRadius: 'xl',
        overflow: 'hidden',
        boxShadow: 'md',
      },
    },
  },
  Progress: {
    baseStyle: {
      track: {
        bg: 'gray.200',
      },
    },
  },
  // Mobile-optimized components
  Drawer: {
    baseStyle: {
      dialog: {
        borderTopLeftRadius: 'xl',
        borderTopRightRadius: 'xl',
      }
    }
  },
  // Make form elements more touch-friendly
  FormLabel: {
    baseStyle: {
      marginBottom: '2',
      fontSize: 'sm',
      fontWeight: 'medium',
    }
  },
  // Improved touch targets
  IconButton: {
    baseStyle: {
      minW: '44px',
      minH: '44px'
    }
  },
  Link: {
    baseStyle: {
      fontWeight: 'medium',
      _hover: {
        textDecoration: 'none',
      },
      _focus: {
        boxShadow: '0 0 0 3px rgba(6, 215, 156, 0.6)',
        outline: 'none',
      },
    }
  }
};

// Global styles with accessibility improvements
const styles = {
  global: {
    body: {
      bg: 'gray.100',
      color: 'gray.700', // Higher contrast than gray.600
      lineHeight: '1.6', // Improved readability
    },
    a: {
      color: 'teal.600',
      _hover: {
        textDecoration: 'underline',
        color: 'teal.700',
      },
      _focus: {
        outline: '2px solid',
        outlineColor: 'teal.500',
        outlineOffset: '2px',
      }
    },
    // Skip link for screen readers
    '.skip-link': {
      position: 'absolute',
      top: '-40px',
      left: '0',
      background: 'teal.500',
      color: 'white',
      padding: '8px',
      zIndex: '9999',
      transition: 'top 0.2s',
      _focus: {
        top: '0',
      }
    },
    // High contrast focus indicators
    '*:focus-visible': {
      outline: '2px solid',
      outlineColor: 'teal.500',
      outlineOffset: '2px',
    },
    // Ensure proper heading hierarchy
    'h1, h2, h3, h4, h5, h6': {
      color: 'gray.800',
      fontWeight: 'bold',
    },
    // Mobile touch improvements
    'button, a, [role="button"]': {
      cursor: 'pointer',
      minHeight: { base: '44px', md: '32px' },
      touchAction: 'manipulation',
    },
    // Prevent iOS zoom on input focus
    'input, select, textarea': {
      fontSize: '16px',
    },
  },
};

const theme = extendTheme({
  colors,
  fonts,
  components,
  styles,
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  // Mobile-first breakpoints
  breakpoints: {
    sm: '30em', // 480px
    md: '48em', // 768px
    lg: '62em', // 992px
    xl: '80em', // 1280px
    '2xl': '96em', // 1536px
  }
});

export default theme;