# YoGuru TV (YoTV)

A modern, feature-rich IPTV streaming application built with React, TypeScript, and cutting-edge web technologies.

![YoGuru TV](https://img.shields.io/badge/YoGuru-TV-blue?style=for-the-badge&logo=tv&logoColor=white)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-3178C6?style=flat&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5.1.4-646CFF?style=flat&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC?style=flat&logo=tailwind-css)

## 🌟 Features

### Core Features
- **IPTV Streaming**: High-quality video streaming with HLS.js support
- **Advanced Search**: Voice recognition, expandable search, and smart suggestions
- **Channel Management**: Favorites, categories, and watch history
- **Multi-language Support**: Support for multiple languages and countries
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### Settings & Customization
- **Theme System**: 13+ built-in themes including system theme detection
- **Custom Themes**: Create and manage your own color schemes
- **Player Controls**:
  - Autoplay, loop, and mute options
  - Volume control and quality settings (Auto, Low, Medium, High, Ultra)
  - Subtitle support with language selection
- **Interface Settings**:
  - Grid size options (Small, Medium, Large)
  - Animation preferences
  - Compact mode
  - Channel logo and numbering display
- **Privacy Controls**:
  - Analytics and crash reporting toggles
  - Data sharing preferences

### User Experience
- **Virtual Scrolling**: Efficient rendering of large channel lists
- **Offline Support**: Persistent settings and favorites
- **Keyboard Navigation**: Full keyboard accessibility
- **Touch Optimized**: Mobile-first responsive design
- **Error Boundaries**: Graceful error handling and recovery

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Shubhamnpk/yotv.git
   cd yotv
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Preview production build**
   ```bash
   npm run preview
   ```

## 🛠️ Tech Stack

### Frontend Framework
- **React 18** - Modern React with concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server

### UI & Styling
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Framer Motion** - Smooth animations and transitions
- **Lucide React** - Beautiful icon library

### State Management
- **Zustand** - Lightweight state management with persistence

### Media & Streaming
- **HLS.js** - HTTP Live Streaming for video playback
- **React Player** - Universal media player component

### Performance
- **React Virtual** - Virtual scrolling for large lists
- **React Window** - Efficient list rendering
- **React Intersection Observer** - Lazy loading

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 📁 Project Structure

```
yotv/
├── src/
│   ├── api.ts                 # API utilities
│   ├── App.tsx               # Main application component
│   ├── main.tsx              # Application entry point
│   ├── types.ts              # TypeScript type definitions
│   ├── components/           # React components
│   │   ├── layout/          # Layout components
│   │   ├── search/          # Search functionality
│   │   ├── player/          # Video player components
│   │   ├── channels/        # Channel management
│   │   └── ...              # Other feature components
│   ├── store/               # State management
│   │   └── useStore.ts      # Zustand store configuration
│   ├── hooks/               # Custom React hooks
│   ├── utils/               # Utility functions
│   └── data/                # Static data files
├── public/                  # Static assets
├── dist/                    # Build output
└── package.json             # Project dependencies
```

## ⚙️ Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Firebase Configuration (optional)
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
```

### Build Configuration

The project uses Vite for building. Configuration can be found in:
- `vite.config.ts` - Vite configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration

## 🤝 Contributing

We welcome contributions! Please read our [Contributing Guidelines](CONTRIBUTING.md) before getting started.

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes and test thoroughly
4. Run linting: `npm run lint`
5. Commit your changes: `git commit -m 'Add your feature'`
5. Push to your branch: `git push origin feature/your-feature`
6. Create a Pull Request

### Code Style
- Follow the existing TypeScript and React patterns
- Use meaningful component and variable names
- Add proper TypeScript types
- Include comments for complex logic
- Run `npm run lint` before committing

## 📄 License

This project is licensed under the **YoGuru Limited Contributor License v3** - see the [LICENSE](LICENSE) file for details.

### Key License Points
- ✅ **Personal Use**: Free for personal and non-commercial use
- ✅ **Contributions**: Welcome under the license terms
- ✅ **Attribution**: Must maintain attribution to original copyright holder
- ❌ **Commercial Use**: Requires explicit written permission
- ❌ **Sublicensing**: Not permitted without permission
- 
### Support
- 🐛 **Bug Reports**: [Create an issue](https://github.com/Shubhamnpk/yotv/issues)
- 💡 **Feature Requests**: [Create an issue](https://github.com/Shubhamnpk/yotv/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/Shubhamnpk/yotv/discussions)

## 🙏 Acknowledgments

- **React Community** - For the amazing ecosystem
- **Open Source Contributors** - For their valuable contributions
- **HLS.js** - For reliable video streaming
- **Tailwind CSS** - For the utility-first approach

## 📊 Project Status

![GitHub last commit](https://img.shields.io/github/last-commit/Shubhamnpk/yotv)
![GitHub issues](https://img.shields.io/github/issues/Shubhamnpk/yotv)
![GitHub pull requests](https://img.shields.io/github/issues-pr/Shubhamnpk/yotv)

---

**Built with ❤️ by Shubham Niraula**

*YoTV - Your Gateway to Global Television*
