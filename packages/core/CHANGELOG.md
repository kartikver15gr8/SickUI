# Changelog

All notable changes to `@sickui/core` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Additional components coming soon
- Comprehensive test suite
- Storybook documentation

### Changed

- Performance optimizations
- Accessibility improvements

### Fixed

- Bug fixes and stability improvements

## [0.0.2] - 2024-12-05

### Fixed

- **CSS Compatibility**: Fixed `border-border` utility class error in Vite projects
- **Tailwind Integration**: Replaced `@apply` directives with direct CSS properties for better compatibility
- **Documentation**: Updated README with complete Tailwind CSS configuration including custom colors

### Changed

- Updated CSS to use `hsl(var(--border))` instead of `@apply border-border`
- Enhanced Tailwind configuration documentation with all required color variables

## [0.0.1] - 2024-12-05

### Added

- Initial experimental release of SickUI Core
- ⚠️ **Early Stage**: This is an alpha release with limited components
- **Button Component** with multiple variants:
  - `default` - Primary button style
  - `destructive` - For dangerous actions
  - `outline` - Outlined button style
  - `secondary` - Secondary button style
  - `ghost` - Minimal button style
  - `link` - Link-styled button
- **Button Sizes**:
  - `sm` - Small button
  - `default` - Default size
  - `lg` - Large button
  - `icon` - Square icon button
- **Utilities**:
  - `cn()` - Class name utility for merging Tailwind classes
- **TypeScript Support**:
  - Full type definitions
  - Exported component prop types
- **Styling System**:
  - CSS variables for theming
  - Dark mode support
  - Tailwind CSS integration
- **Build System**:
  - ESM and CJS module support
  - TypeScript declarations
  - Source maps
  - CSS extraction
- **Framework Support**:
  - Next.js App Router compatibility
  - "use client" directive for client components
  - React 16.8+ support
- **Accessibility**:
  - Built on Radix UI primitives
  - ARIA attributes
  - Keyboard navigation support
  - Focus management

### Technical Details

- Built with TypeScript 5.3+
- Uses Tailwind CSS for styling
- Radix UI Slot for composition
- Class Variance Authority for variant management
- TSUP for building and bundling
- Supports React 16.8+ and React DOM 16.8+

---

## Release Notes

### What's Next?

- 🚀 More components (Card, Input, Dialog, etc.)
- 🧪 Comprehensive testing suite
- 📚 Enhanced documentation
- 🎨 Theme customization tools
- 📱 Mobile-optimized components

### Contributing

We welcome contributions! Please see our [Contributing Guide](https://github.com/kartikver15gr8/SickUI/blob/main/CONTRIBUTING.md) for details.

### Support

- 📖 [Documentation](https://github.com/kartikver15gr8/SickUI)
- 🐛 [Report Issues](https://github.com/kartikver15gr8/SickUI/issues)
- 💬 [Discussions](https://github.com/kartikver15gr8/SickUI/discussions)
