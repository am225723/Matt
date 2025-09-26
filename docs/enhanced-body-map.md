# Enhanced Body Map Component

## Overview

The Enhanced Body Map is a visually appealing, interactive SVG-based component for selecting body parts in the Anxiety Tracker application. It provides an intuitive way for users to indicate where they experience physical symptoms of anxiety.

## Features

### Visual Enhancements
- **Smooth Gradients**: Professional color schemes with gradient fills
- **Glow Effects**: Selected body parts have a subtle glow effect
- **Hover Animations**: Parts scale slightly on hover for better feedback
- **Tooltips**: Hovering shows the name of each body part
- **Responsive Design**: Adapts to different screen sizes
- **Background Effects**: Subtle gradient background for depth

### Interactive Features
- **Click Selection**: Toggle selection state with a click
- **Visual Feedback**: Clear indication of selected parts
- **Smooth Transitions**: Animated state changes
- **Customizable Intensity**: Three levels of highlight intensity (light, medium, high)
- **Accessibility**: High contrast mode support and keyboard navigation

### Technical Improvements
- **SVG Optimization**: Cleaner paths for better rendering
- **Animation Performance**: Optimized for smooth 60fps animations
- **Framer Motion Integration**: Leverages the animation library for fluid interactions
- **CSS Enhancements**: Dedicated stylesheet for better organization
- **Responsive Scaling**: Maintains proportions across devices

## Usage

### Basic Implementation
```jsx
import EnhancedBodyMapSVG from '@/components/EnhancedBodyMapSVG';

// In your component
const [selectedParts, setSelectedParts] = useState([]);

const handlePartClick = (part) => {
  setSelectedParts(prev => 
    prev.includes(part) 
      ? prev.filter(p => p !== part) 
      : [...prev, part]
  );
};

// In your render method
<EnhancedBodyMapSVG 
  selectedParts={selectedParts} 
  onPartClick={handlePartClick}
  highlightIntensity="medium" // "light", "medium", or "high"
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `selectedParts` | Array | `[]` | Array of selected body part names |
| `onPartClick` | Function | Required | Callback function when a part is clicked |
| `highlightIntensity` | String | `"medium"` | Intensity of the highlight effect ("light", "medium", "high") |

### Body Part Names

The component uses the following body part names:
- Head
- Face
- Neck
- Chest
- Stomach
- Left Arm
- Right Arm
- Left Hand
- Right Hand
- Back
- Left Leg
- Right Leg
- Left Foot
- Right Foot

## Customization

### Color Schemes

The component includes three built-in color schemes for different highlight intensities:

```jsx
// Light scheme (subtle highlights)
<EnhancedBodyMapSVG highlightIntensity="light" />

// Medium scheme (default)
<EnhancedBodyMapSVG highlightIntensity="medium" />

// High scheme (vibrant highlights)
<EnhancedBodyMapSVG highlightIntensity="high" />
```

### Custom Styling

You can further customize the appearance by modifying the CSS in `src/styles/enhanced-body-map.css`.

## Accessibility

The Enhanced Body Map includes several accessibility features:

- **High Contrast Mode**: Automatically adjusts when the user has high contrast mode enabled
- **Keyboard Navigation**: Can be navigated using keyboard (with additional tabIndex implementation)
- **Screen Reader Support**: SVG elements include appropriate ARIA attributes
- **Reduced Motion**: Respects the user's reduced motion preferences

## Demo

A complete demo of the Enhanced Body Map is available in the `BodyMapDemo` component, which showcases all features and customization options.

## Implementation Details

### Technologies Used
- React for component structure
- Framer Motion for animations
- SVG for vector graphics
- CSS for styling and effects

### File Structure
- `EnhancedBodyMapSVG.jsx`: Main component
- `enhanced-body-map.css`: Dedicated styles
- `BodyMapDemo.jsx`: Demo component

## Performance Considerations

The Enhanced Body Map is optimized for performance:

- SVG paths are simplified for faster rendering
- Animations use hardware acceleration where possible
- Hover effects are debounced to prevent jank
- Renders are minimized using React's memoization

## Browser Compatibility

Tested and working in:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome for Android)