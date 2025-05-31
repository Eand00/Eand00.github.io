# Caffè Duca Website

A modern, responsive website for Caffè Duca, a traditional Italian café located in the heart of Turin since 1972. Built with vanilla HTML, CSS (Tailwind), and JavaScript with GSAP animations and Fancybox gallery.

## 🚀 Live Demo

[Visit Caffè Duca Website](https://eand00.github.io/Caffe-Duca/)

## 📋 Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Development](#development)
- [Browser Support](#browser-support)
- [License](#license)

## ✨ Features

- **Responsive Design**: Mobile-first approach with smooth animations across all devices
- **Interactive Navigation**: Animated hamburger menu with slide-in mobile navigation
- **Dynamic Logo Animation**: GSAP-powered logo that transforms from center to navigation on scroll
- **Image Gallery**: Fancybox-powered lightbox gallery with high-resolution images
- **Performance Optimized**: WebP images with JPG fallbacks, lazy loading
- **Smooth Scrolling**: Custom scroll-triggered animations throughout the site
- **Accessibility**: Screen reader friendly with proper ARIA labels
- **Downloadable Menus**: PDF downloads for main menu and wine list

## 🛠 Technologies Used

### Frontend
- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Tailwind CSS 4.1.2 for modern styling
- **JavaScript (ES6+)**: Vanilla JavaScript for all interactions
- **GSAP 3.12.7**: Professional-grade animations and ScrollTrigger

### Libraries & Plugins
- **Fancybox 5.0**: Modern lightbox for image gallery
- **Font Awesome 6.4.0**: Icons for social media and UI elements
- **Google Fonts**: Inter and Montserrat font families

### Tools
- **ImageMagick**: Image optimization and WebP conversion

## 📁 Project Structure

```
Caffe-Duca/
├── assets/
│   ├── css/
│   │   ├── fancybox.css
│   │   └── main.css
│   ├── js/
│   │   ├── main.js              # Core functionality
│   │   └── fancybox.umd.js
│   ├── favicon/
│   │   ├── Caffe_DUCA_favicon.svg
│   │   ├── Caffe_DUCA_icon.svg
│   │   └── Caffe_DUCA_icon2.svg
│   └── menu_plastificato.pdf
├── images/
│   ├── *.webp                   # Optimized thumbnails
│   └── *.jpg                    # High-resolution originals
├── index.html                   # Main HTML file
└── README.md
```

## 🔧 Development

### Key Development Files

- **`index.html`**: Main HTML structure with all sections
- **`assets/js/main.js`**: Core JavaScript functionality
- **`assets/css/main.css`**: Compiled Tailwind CSS (auto-generated)

### JavaScript Modules

The main JavaScript file includes several key functions:

- `initMobileMenu()`: Mobile hamburger navigation with smooth animations
- `initScrollingLogoAnimation()`: GSAP-powered logo transformation on scroll
- `initializeSlider()`: Generic touch-enabled slider component
- Fancybox initialization for gallery lightbox

### CSS Architecture

- **Tailwind CSS 4.1.2**: Utility-first CSS framework
- **Custom components**: Specialized styles for unique elements
- **Responsive design**: Mobile-first approach with breakpoints
- **CSS custom properties**: For dynamic theming and animations

## 🌐 Browser Support

- **Chrome**: 90+
- **Firefox**: 88+  
- **Safari**: 14+
- **Edge**: 90+
- **Mobile browsers**: iOS Safari 14+, Chrome Mobile 90+

## 🎨 Design Features

### Sections Overview

1. **Hero Section**: Full-screen background with animated moving logo
2. **Welcome**: Introduction with image gallery slider  
3. **Specialties**: Grid showcasing coffee, desserts, and savory items
4. **Menu**: Downloadable PDF menus with elegant cards
5. **Gallery**: Fancybox-powered image lightbox with WebP/JPG optimization
6. **About**: Slider with philosophy and environment information
7. **Location**: Contact information and social media links

### Color Scheme
- **Primary**: Cyan-700/800/900 for backgrounds
- **Accent**: Golden yellow (#bcb42d) for highlights and CTAs
- **Text**: White on dark backgrounds for optimal contrast

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Credits

- **Design & Development**: [Eand Avdiu](https://github.com/eand00)
- **Client**: Caffè Duca, Turin, Italy  
- **Photography**: Courtesy of Caffè Duca
- **Icons**: Font Awesome
- **Animations**: GSAP (GreenSock)
- **Lightbox**: Fancybox

## 📞 Contact & Links

- **GitHub**: [eand00](https://github.com/eand00)
- **LinkedIn**: [Eand Avdiu](https://www.linkedin.com/in/eand-avdiu-8a0047153/)

## 🏪 About Caffè Duca

Caffè Duca has been serving the city of Turin since 1972, with roots deeply embedded in Turinese tradition passed down from family to family through the generations. Today, it continues to renew itself in taste while maintaining its traditional form, distinguished by its hospitality and quality of carefully selected products.

**Caffè Duca: Innovation in service of tradition.**

---

**Made with ☕ for Caffè Duca** - *La Tradizionale a Torino dal 1972*