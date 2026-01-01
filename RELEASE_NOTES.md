# Cassini - Release Notes

## v1.7.4.2 (2025-12-30)

### Bugfixing Colors & Glassmorphism

- **Fixed**: Resolved an issue where the background color was not updating correctly when switching between Light and Liquid Glass modes.
- **Fixed**: Resolved an issue where in the new UI from v1.7.1, the custom stroke color button was not shown in the toolbar.
- **Changed**: Made the Settings Toolbar, Zoom Controls, System Clock, and Creative Intelligence pill have more glassmorphism.

---

## v1.7.4.1 (2025-12-30)

### 🔧 Polish & Precision

This update focuses on refining the tablet experience and addressing UI inconsistencies before the major 1.8.x cycle.

#### New Features

- **Tablet Pan Controls**: Added a mini "D-pad" (Left/Right/Up/Down arrows) to the Zoom toolbar for precise viewport panning on touch devices.
- **Theme-Aware Branding**: The "Creative Intelligence v1" indicator now dynamically adapts to Light Mode (White pill/Black text) and Liquid Glass Mode (Dark pill/White text).
- **Branded Logo**: Integrated the official CI-v1 logo into the Settings Sidebar and Active Indicator.

#### Bug Fixes

- **Full Screen Toggle**: Fixed the maximize button in the Zoom bar to correctly trigger the browser's native Full Screen mode instead of resetting zoom.
- **Zoom Visibility**: Fixed an issue where zoom controls were invisible (white-on-white) in Light Mode.
- **Tool Logic**: Fixed a ReferenceError that caused the app to crash when using the Multi-Select tool on tablets.

---

## v1.7.4 (2025-12-30)

### Phase 4: Creative Intelligence

- **Laser Pointer Tool**: Ephemeral strokes with a 2-second glow effect, perfect for presentations.
- **Handwriting OCR (v1)**: Integrated **Tesseract.js** engine to convert handwritten strokes into editable text elements (English).
- **Tablet Multi-Select**: New toggleable mode in the toolbar to simulate "Shift+Click" behavior for touch users, allowing easy selection of multiple elements.
- **Creative Intelligence Panel**: New toggleable settings section to control all CI features independently.
- **Branded CI Experience**: Integrated "Creative Intelligence v1" branding across the settings and command palette.

## [1.7.3] - 2025-12-29

### Phase 3: The Power Media & Organization

- **Sticky Notes**: Vibrant, color-coded sticky notes for rapid ideation and moodboarding.
- **Frames (Artboards)**: Defined named regions to structure and containerize project sections.
- **Precision Zoom**: New bottom-right controls with high-fidelity centered zoom behavior.
- **System Clock**: Renamed and pivoted the session timer to a persistent system clock for better context.
- **Enhanced Command Palette**: Integrated all new Phase 2 & 3 features (Zoom, Frames, Stickies, Snapping, Clock) into the Cmd+K interface.
- **Image Manipulation Fix**: Resolved critical issues where images would "stick" and couldn't be resized/rotated. Implemented a synchronous image cache for butter-smooth interaction.
- **Geometric Performance**: Refactored hit detection to be rotation-aware across all shapes and images.
- **UI Refinements**: Adjusted selection toolbar positioning for a clutter-free bottom-right experience.

## [1.7.2] - 2025-12-29

### Phase 2: The Power Utilities

- **Vector Export (SVG)**: High-fidelity SVG export that preserves path data and shapes, perfect for professional design workflows.
- **Document Export (PDF)**: integrated `jsPDF` for instant canvas-to-PDF generation, allowing for easy documentation of whiteboard sessions.
- **Session Timer**: Added dynamic floating timer to track session duration. Toggleable via settings sidebar.
- **Grid Snapping**: Implemented precision coordinate snapping. Elements now snap to the grid and ruler edges for perfect alignment.
- **Text-Rich Toolbar**: Refined the file management category to use clear text labels instead of icons, improving usability for export and save actions.
- **Refined Versioning**: Formally bumped version to v1.7.2.

## [1.7.1] - 2025-12-29

### Phase 1: Full UI Revamp

- **Bottom-Anchored Toolbar**: Completely redesigned the core navigation to be bottom-centered, maximizing workspace and following modern "liquid glass" aesthetics.
- **Stacked Secondary Bars**: Category switching (Draw, Shapes, Canvas, File) now reveals a contextual secondary bar *above* the main navigation.
- **Searchable Settings Sidebar**: Added a search-first settings experience with real-time filtering and category tags.
- **State Synchronization**: Unified `activeCategory` state across the context, toolbar, and command palette for a seamless switching experience.
- **Bug Fixes**:
  - Resolved `isLight` and `toolbarOrientation` reference errors in the new toolbar architecture.
  - Fixed `Grid` icon prop mismatch in settings sidebar.
  - Corrected settings button behavior in both the toolbar and branding footer.

---

## [1.6.0-b] - 2025-12-29

### Light Mode Refinements (v1.6.0-b)

- **Automatic Background Sync**: Canvas background now automatically switches to white when Light Mode is selected, and back to dark when Liquid Glass is selected.
- **Improved Settings Sidebar**: Sidebar UI now fully adapts to Light Mode with high-contrast text, borders, and a translucent white background.
- **Bug Fix**: Resolved a crash when opening settings due to missing style references.

---

## [1.6.0] - 2025-12-26

### The Solo Experience Update

This major update focuses on refining the individual creative workflow, removing distractions, and ensuring your work is always safe.

### Added in 1.6.0

- **Auto-Save**: Your work is automatically saved to local storage every 60 seconds. A "Recover Last Session" option appears on the Welcome Screen if a session was closed unexpectedly.
- **Focus Mode**: Press `F` or click the Eye icon in the toolbar to hide all UI elements for a pure drawing experience. Floating button allows easy exit.
- **Stroke Smoothing**: New setting in the sidebar to toggle Bezier curve smoothing for cleaner, more natural freehand lines.
- **Logo in Settings**: Added branding to the settings footer.

### Removed in 1.6.0

- **Layers System**: Removed the layers panel to simplify the interface and focus on speed and direct manipulation.

---

## [1.5.3] - 2025-12-22

### Added in 1.5.3

- **User Onboarding**: Personalized experience with a name input field on the Welcome Screen.
- **Settings Sidebar**: Centralized control for user profile, grid customization, and themes.
- **Command Palette (Cmd+K)**: Power-user search bar for tools, actions, and navigation.
- **High-Contrast Light Mode**: New icon theme for improved visibility on lighter backgrounds.
- **Shortcuts Reference**: Built-in keyboard shortcut guide in the Settings Sidebar.
- **Metadata Support**: Exported files now include author name and timestamp.
- **Smart Export Naming**: Files are now saved with descriptive names (username + date).

### Improved in 1.5.3

- **Author Persistence**: Importing a file now restores the original author's name to the settings.
- **UI Consistency**: Every icon in the toolbar and branding now respects the selected icon theme.
- **Welcome Screen Flow**: Pre-populates your name when returning from a session.

---

## [1.5.2] - 2025-12-21

### Added in 1.5.2

- **Smart Connectors (Beta)**: Lines and Arrows now snap to anchor points on Rectangles and Circles.
- **Sticky Connections**: Moving a shape automatically updates any lines connected to its anchor points.
- **Visual Anchors**: Anchor points now appear when using connector tools for precision placement.

### Removed in 1.5.2

- **Gemini AI Assistant**: Removed the built-in AI chat sidebar and associated services to streamline the creative experience.
- AI-related documentation and branding ("Assistant").

---

## Version 1.5.0.1 - UI Alignment Refinement

**Release Date:** December 21, 2024

### Improvements in 1.5.0.1

- **Horizontal Color Picker** - Corrected the color palette layout to ensure it always expands horizontally, matching the "floating bar" aesthetic.

---

## Version 1.5.0 - Documentation Refactoring

**Release Date:** December 21, 2024

### Improvements in 1.5.0

- **README Refactor** - Transformed `README.md` into a professional introductory landing page.
- **Workflow Optimization** - Removed version history from README to consolidate it in `RELEASE_NOTES.md`, streamlining future updates.
- **Version Bump** - Official transition to v1.5.x series.

---

## Version 1.4.8 - Welcome Screen & Manual Save

**Release Date:** December 21, 2024

### 🚀 New Features

- **Welcome Screen** - Beautiful glassmorphism landing page with Orama branding
- **Local File System** - Save/Load whiteboards as JSON files
- **Recent Files** - Track your recent work history
- **Keyboard Shortcuts** - `Ctrl+S` to Save, `Ctrl+O` to Open

### 📦 Files Created

- **[NEW]** `src/components/WelcomeScreen.jsx` - Main landing page component
- **[NEW]** `src/utils/fileUtils.js` - Helpers for file I/O

---

## Version 1.4.7.1 - UI Improvements

**Release Date:** December 16, 2024

### Improvements in 1.4.7.1

- **Larger Layers Button** - Increased touch target size for layers panel toggle

---

## Version 1.4.7 - Layers System

**Release Date:** December 16, 2024

### 🚀 New Features

#### Layers Panel

- ✅ **Collapsible Panel** - Click layers icon on right side to open
- ✅ **Show/Hide Layers** - Eye icon toggles element visibility
- ✅ **Drag Reorder** - Drag layers to change z-order
- ✅ **Opacity Control** - Slider per layer for transparency
- ✅ **Layer Naming** - Double-click to rename layers
- ✅ **Quick Delete** - Delete layers from panel

### 📦 Files Created

- **[NEW]** `LayersPanel.jsx` - Complete layers management panel

### 📦 Files Modified

- **[UPDATE]** `Whiteboard.jsx` - Integrated LayersPanel, filter hidden elements

---

## Version 1.4.6 - UI Revamp & Orama Branding

**Release Date:** December 16, 2024

### 🚀 New Features

#### Collapsible Toolbar

- ✅ **Collapsible Sections** - Draw, Shapes, Color, Settings panels that expand/collapse
- ✅ **Cleaner Organization** - Tools grouped logically, reducing visual clutter
- ✅ **Responsive Sizing** - UI scales based on window size (0.75x - 1x)

#### Responsive Design

- ✅ **Adaptive Layout** - Toolbar adjusts for mobile/tablet/desktop
- ✅ **Dynamic Icon Sizes** - Scale with viewport width
- ✅ **Touch Stability** - Fixed touch input handling

### 🔧 Branding Updates

- Updated license and documentation to **Orama** branding
- "Cassini by Orama" replaces previous TLT/The Lab Tutoring references

### 📦 Files Modified

- **[REWRITE]** `Toolbar.jsx` - Complete redesign with collapsible sections
- **[UPDATE]** `LICENSE.md` - Orama copyright
- **[UPDATE]** `DEPLOYMENT.md` - Orama branding
- **[UPDATE]** `GITHUB_DEPLOY.md` - Orama branding

---

## Version 1.4.5 - Selection & Alignment Tools

**Release Date:** December 5, 2024

### 🚀 New Features

#### Selection Toolbar (Fixed Position)

- ✅ **Repositioned Delete Button** - Moved to fixed bottom-right toolbar
  - No longer blocks view of selected elements
  - Shows element count ("3 elements selected")
- ✅ **Alignment Tools** - Align multiple elements with one click
  - Horizontal: Left, Center, Right
  - Vertical: Top, Middle, Bottom
  - Only appears when 2+ elements selected
- ✅ **Distribute Evenly** - Space elements with equal gaps
  - Distribute Horizontally
  - Distribute Vertically
  - Only appears when 3+ elements selected
- ✅ **Z-Order Controls** - Layer ordering
  - Bring to Front
  - Send to Back

### 🔧 Technical Improvements

- Created `SelectionToolbar.jsx` component with batch state updates
- All alignment operations use single `setElements` call for performance
- Replaced floating `SelectionActionMenu` with fixed-position toolbar

### 📦 Component Changes

- **[NEW]** `SelectionToolbar.jsx` - Fixed-position selection controls
- **[DEPRECATED]** `SelectionActionMenu.jsx` - Replaced by SelectionToolbar

---

## Version 1.4.4 - Text Formatting

**Release Date:** December 5, 2024

### 🚀 New Features

#### Text Styling

- ✅ **Bold/Italic/Underline** - Toggle buttons in TextModal
- ✅ **Text Alignment** - Left, Center, Right options
- ✅ **Multi-line Text** - Support for line breaks (\n)
- ✅ **Text Background** - Optional colored background
  - 8 preset colors + custom color picker

### 🔧 Technical Improvements

- Enhanced `drawText()` function with formatting support
- Font construction: `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`
- Canvas underline drawing for underlined text
- Background rectangle rendering with padding

---

## Version 1.4.3b - Image Manipulation & Transforms

**Release Date:** December 5, 2024

### 🚀 New Features

#### Image & Shape Manipulation

- ✅ **8-Point Resize Handles** - Corner and edge handles for precise resizing
  - NW, N, NE, E, SE, S, SW, W handles on selected images/shapes
  - Minimum size constraint (20px) prevents collapse
- ✅ **Rotation Handle** - Free rotation of images and shapes
  - Orange circle handle above selected element
  - Dashed line connecting to element for visual reference
  - Rotation calculated from element center
- ✅ **Aspect Ratio Lock** - Maintains proportions during resize
  - Enabled by default for intuitive resizing
  - Proportional scaling from any corner or edge

### 🔧 Bug Fixes

- ✅ **Zoom Safety** - Fixed zoom out causing elements to disappear
  - Added validation for scale ratio calculations
  - Position clamping to prevent extreme values
  - NaN/Infinity guard for viewport coordinates
- ✅ **Real-time Selection Updates** - Selection box now syncs with element during resize/rotate

### 🔧 Technical Improvements

- Added state variables: `resizeHandle`, `isResizing`, `resizeStart`, `lockAspectRatio`
- Rotation support in `drawImage` with canvas transform
- Handle hit detection with `getHandleAtPoint` helper
- Selection box syncing with `setSelectedElements` during transforms

---

## Version 1.4.3 - AI Chat Markdown & Formatting

**Release Date:** December 4, 2024

### 🚀 New Features

#### AI Chat Enhancements

- ✅ **Markdown Rendering** - AI responses now display with proper markdown formatting
  - Headings (H1, H2, H3) with proper sizing and spacing
  - Bold, italic, and code formatting
  - Bullet and numbered lists
  - Blockquotes with left border
  - Hyperlinks with target="_blank"
- ✅ **Code Syntax Highlighting** - Code blocks render with atomDark theme
  - Inline code with background highlighting
  - Multi-line code blocks with language-specific syntax highlighting
  - Proper monospace font rendering
- ✅ **Custom System Instructions** - Configurable AI personality
  - Added systemInstruction to Gemini API calls
  - Default: Helpful assistant for Cassini whiteboard
  - Instructs AI to format responses in markdown
- ✅ **Improved Typography** - Better readability in chat messages
  - Optimized line height (1.6) for markdown content
  - Consistent spacing between elements
  - Proper color contrast for readability

### 🔧 Technical Improvements

- **Dependencies Added:**
  - `react-markdown` - Core markdown parsing and rendering
  - `remark-gfm` - GitHub Flavored Markdown support
  - `react-syntax-highlighter` - Code syntax highlighting
- **Component Architecture:** New MarkdownRenderer component with custom styled elements
- **API Enhancement:** System instruction field added to geminiService.js

### 📦 Components Created

- **MarkdownRenderer.jsx** - Markdown parser with syntax highlighting and custom styles

### 🎨 Design Updates

- Maintained Liquid Glass aesthetic in chat interface
- Code blocks styled to match application theme
- Smooth integration with existing chat bubble design

---

## Version 1.4.2 - Grid, Background & Layout Flexibility

**Release Date:** December 4, 2024

### 🚀 New Features

#### Grid & Background System

- ✅ **Grid Patterns** - Three grid types: Dots, Lines, and Squares
- ✅ **Adjustable Grid Size** - Slider control from 10px to 100px spacing
- ✅ **Canvas Background Colors** - 5 preset colors (#ffffff, #f0f0f0, #e0e0e0, #1a1a1a, #2d2d2d) + custom color picker
- ✅ **Grid Toggle** - Easily show/hide grid patterns
- ✅ **Background Settings Modal** - Dedicated UI for all customization options
- ✅ **Default Dark Background** - Changed from white to #1a1a1a for better glass UI visibility

#### UI Enhancements

- ✅ **Selection Count Indicator** - Shows "{number} selected" in bottom-left corner
- ✅ **Vertical Toolbar Option** - Toggle between horizontal (top-center) and vertical (left-center) layouts
- ✅ **Compact Vertical Mode** - Optimized button sizes (28px) and spacing (2px gaps) for vertical orientation
- ✅ **Logo Branding** - Replaced text branding with customizable logo image

### 🔧 Technical Improvements

- **Grid Rendering:** Pre-viewport transformation rendering for fixed canvas-space grid
- **Background State Management:** Centralized in WhiteboardContext (gridType, gridSize, gridColor, backgroundColor)
- **Toolbar Flexibility:** Dynamic positioning and sizing based on orientation state
- **Component Architecture:** Two new components (BackgroundModal, SelectionIndicator)

### 🐛 Bug Fixes

- Fixed `Grid3x3` icon import (changed to `Grid`)
- Fixed `SwitchHorizontal` icon import (changed to `ArrowLeftRight`)
- Added `background` to redrawCanvas dependency array for proper re-rendering
- Changed default background from white to dark gray to prevent invisible UI elements

### 📦 Components Created

- **BackgroundModal.jsx** - Grid and background customization modal
- **SelectionIndicator.jsx** - Selection count display component

### 🎨 Design Updates

- Maintained Liquid Glass aesthetic with new background customization
- Grid patterns designed for minimal visual interference
- Compact vertical toolbar preserves screen space

---

## Version 1.4.1 - Fill Colors & Clipboard Operations

**Release Date:** December 3, 2024  
*Minor update with essential editing features*

### 🚀 New Features

- ✅ **Shape Fill Colors** - Customizable fill color and opacity for rectangles and circles
- ✅ **Clipboard Operations**:
  - Copy elements (Ctrl+C)
  - Paste elements (Ctrl+V)
  - Duplicate elements (Ctrl+D)
  - Select all (Ctrl+A)
  - Deselect (Esc)

---

## Version 1.4.0 - Performance & Stability

**Release Date:** December 3, 2024  
*Minor update focusing on optimization*

### 🔧 Improvements

- Performance optimizations across rendering pipeline
- Code cleanup and refactoring
- Bug fixes and stability improvements

---

## Version 1.3.2 - Export, Import & Keyboard Shortcuts

**Release Date:** December 3, 2025

### 🚀 New Features

#### Export Canvas

- ✅ **Export as PNG** - Download your whiteboard with a white background
- ✅ **One-Click Download** - Export button in toolbar (or Ctrl+E)
- ✅ **Auto-Naming** - Files named `cassini-export-{timestamp}.png`
- ✅ **Full Canvas Export** - Exports entire visible canvas including all elements

#### Import Images

- ✅ **Image Import** - Upload button in toolbar (or Ctrl+I)
- ✅ **Drag & Position** - Imported images are selectable and movable
- ✅ **Supports All Formats** - PNG, JPG, GIF, WebP, and more
- ✅ **Original Size Preservation** - Images import at their natural dimensions

#### Keyboard Shortcuts

- ✅ **Tool Selection**:
  - `P` - Pen
  - `E` - Eraser
  - `S` / `V` - Select
  - `R` - Rectangle
  - `C` - Circle
  - `L` - Line
  - `A` - Arrow
- ✅ **Undo/Redo**:
  - `Ctrl+Z` / `Cmd+Z` - Undo
  - `Ctrl+Y` / `Ctrl+Shift+Z` - Redo
- ✅ **Smart Detection** - Shortcuts disabled when typing in input fields

### 🔧 Technical Improvements

- **Canvas Export:** Creates temporary canvas with white background for clean exports
- **File Handling:** FileReader API for secure image uploads
- **Event Management:** Global keyboard listener with context-aware disabling
- **Element Support:** Full selection and movement support for imported images

---

## Version 1.3.0 - Shape Tools & Input Enhancement

**Release Date:** December 2, 2025

### 🚀 New Features

#### Shape Tools

- ✅ **Rectangle Tool** - Draw rectangles by dragging from corner to corner
- ✅ **Circle Tool** - Draw circles/ellipses with dynamic sizing
- ✅ **Line Tool** - Draw straight lines between two points
- ✅ **Arrow Tool** - Draw arrows with automatic arrowhead rendering
- ✅ **Real-time Preview** - See shapes as you draw them before releasing
- ✅ **Full Integration** - Shapes are selectable, movable, and deletable like other elements

#### Stylus-Only Mode

- ✅ **Touch-to-Pan** - Touch inputs exclusively pan and navigate the canvas
- ✅ **Pen-to-Draw** - Only stylus and mouse inputs can draw and interact with tools
- ✅ **Improved Workflow** - Prevents accidental drawing when using touch to navigate
- ✅ **Cross-Platform** - Works on tablets, touch laptops, and stylus devices

### 🔧 Technical Improvements

- **Shape Rendering:** Dedicated `drawShape()` function with support for all geometric primitives
- **Input Discrimination:** Pointer Events API detects touch vs pen/mouse for intelligent input handling
- **Live Preview:** Shape preview system shows shapes in real-time during drawing
- **Hit Detection:** Enhanced selection logic for shape bounding boxes

### 🎨 UI Updates

- **Toolbar:** Added 4 new shape tool buttons (Rectangle, Circle, Line, Arrow)
- **Icons:** Using Lucide React icons for consistent visual language
- **Ordering:** Shape tools positioned logically after selection tools

---

## Version 1.2.0 - Infinite Canvas & AI

**Release Date:** November 20, 2025

### 🚀 New Features

#### Infinite Canvas

- ✅ **Unlimited Canvas** - Draw beyond the viewport with infinite workspace
- ✅ **Pan & Zoom** - Navigate the canvas using Select tool drag (pan) and Ctrl+Scroll (zoom)
- ✅ **Viewport System** - Robust coordinate mapping between screen and world space
- ✅ **Smooth Transformations** - All drawings maintain precision at any zoom level

#### AI Integration

- ✅ **Gemini Chat Sidebar** - Built-in AI assistant powered by Google Gemini
- ✅ **Collapsible Interface** - Chat sidebar can be minimized to maximize drawing space
- ✅ **Context-Aware** - Real-time responses with loading states and error handling
- ✅ **Model Support** - Compatible with gemini-2.0-flash-lite and other Gemini models

#### UI Enhancements

- ✅ **Collapsible Toolbar** - Toggle button to hide/show toolbar for more workspace
- ✅ **Smooth Animations** - Enhanced transitions for UI state changes

### 🔧 Technical Improvements

- **Coordinate System:** Screen-to-world coordinate transformation for accurate drawing at any zoom
- **Performance:** Optimized rendering with viewport-aware canvas updates
- **API Integration:** Hardcoded API key support with model auto-detection

### 📝 Configuration

- Gemini API key is configured in `src/services/geminiService.js`
- Model: `gemini-2.0-flash-lite` (verified compatible with v1beta API)

---

## Version 1.1.0 - Stylus Support & Performance

**Release Date:** November 19, 2025

### 🚀 New Features

#### Stylus & Input Enhancements

- ✅ **Full Stylus Support** - Native support for pressure-sensitive styluses (e.g., Surface Pen, Apple Pencil)
- ✅ **Pressure Sensitivity** - Stroke thickness dynamically adjusts based on applied pressure
- ✅ **Palm Rejection** - Improved handling to prevent accidental touches while drawing
- ✅ **Zero-Latency Drawing** - New direct-to-canvas rendering engine for instant feedback
- ✅ **Pointer Events API** - Modernized input handling for seamless mouse, touch, and pen interaction

### 🔧 Improvements

- **Performance:** Optimized rendering pipeline for smoother drawing at high refresh rates
- **Compatibility:** Unified input handling across all device types
- **UX:** Enhanced responsiveness for rapid strokes

---

## Version 1.0.0 - Initial Release

**Release Date:** November 19, 2025

### 🎉 Features

#### Drawing Tools

- ✅ Pen tool with customizable color, thickness (1-20px), and opacity (10-100%)
- ✅ Eraser tool with drag-to-erase functionality
- ✅ Custom color picker (8 presets + custom colors)

#### Selection & Manipulation

- ✅ Select tool with click or drag-box selection
- ✅ **Drag-to-move** - Selected elements can be dragged immediately
- ✅ Multi-select with Shift+click
- ✅ Delete selected elements via action menu
- ✅ Works for all element types (strokes, text, equations)

#### Measurement Tools

- ✅ Ruler with measurement marks and pen snapping
- ✅ Protractor showing angles from 0° to 180°

#### Text Tool

- ✅ Insert text with customizable font family
- ✅ Adjustable font size (12-72px)
- ✅ Live preview before insertion
- ✅ Movable and selectable after placement

#### UI/UX

- ✅ Apple Liquid Glass design system
- ✅ Glassmorphism effects throughout
- ✅ Smooth animations and micro-interactions
- ✅ Undo/Redo functionality
- ✅ Clear all canvas
- ✅ Responsive toolbar

### 📦 Build Information

**Production Build:**

- Bundle size: 164.58 KB (52.44 KB gzipped)
- CSS size: 4.14 KB (1.28 KB gzipped)
- Build time: ~2 seconds
- Output directory: `dist/`

### 🚀 Deployment

The production build is ready in the `dist` folder. You can deploy it to:

- Static hosting (Netlify, Vercel, GitHub Pages)
- Web server (Apache, Nginx)
- Cloud platforms (AWS S3, Azure, Google Cloud)

**To preview the production build locally:**

```bash
npm run preview
```

### 📋 Installation & Usage

**Development:**

```bash
npm install
npm run dev
```

**Production Build:**

```bash
npm run build
```

### 🛠️ Technical Stack

- React 18.2.0
- Vite 4.4.5
- HTML5 Canvas
- KaTeX 0.16.9
- Lucide React 0.263.1

### ✨ Highlights

- **Zero Dependencies** for core functionality (only UI libraries)
- **High Performance** canvas rendering
- **Premium Design** with Apple Liquid Glass aesthetic
- **Intuitive UX** - drag-to-move without toggle buttons
- **Clean Codebase** - well-organized and maintainable

---

**Built with ❤️ by Orama Technologies**
**Webhook on Discord by Github**
