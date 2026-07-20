# testRigor Playground Mobile

<p align="center">
  <img src="./assets/images/tr-playground.png" alt="testRigor Playground" width="300"/>
</p>

<p align="center">
  <strong>A React Native mobile application featuring interactive demos for testing mobile UI elements and interactions.</strong>
</p>

<p align="center">
  <a href="https://github.com/thiagonunes11/tr-playground-native/releases">
    <img src="https://img.shields.io/github/v/release/thiagonunes11/tr-playground-native?style=flat-square" alt="Latest Release"/>
  </a>
  <a href="https://github.com/thiagonunes11/tr-playground-native/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/thiagonunes11/tr-playground-native?style=flat-square" alt="License"/>
  </a>
  <img src="https://img.shields.io/badge/platform-iOS%20%7C%20Android-blue?style=flat-square" alt="Platform"/>
  <img src="https://img.shields.io/badge/expo-54.0-000020?style=flat-square&logo=expo" alt="Expo"/>
</p>

---

## 📱 About

testRigor Playground is a mobile application designed to provide interactive demos for testing various mobile UI elements and user interactions. It serves as a sandbox environment for QA engineers, developers, and testers to validate mobile testing scenarios.

## ✨ Features

### Available Demos (19 total)

| Demo                        | Description                                              |
| --------------------------- | -------------------------------------------------------- |
| 🌐 **WebView**              | Embedded browser inside the app                          |
| 📍 **Geo Location**         | Request location and validate coordinates                |
| 🔗 **External Browser**     | Open device browser for native vs browser context tests  |
| 🔗 **Deep Links**           | Open system apps (Settings, Phone, SMS) & custom URLs    |
| 🖱️ **Button Tap**           | Validate button click functionality                      |
| 📷 **Camera Validation**    | Test camera functionality and photo capture              |
| ☑️ **Checkbox Interaction** | Validate checkbox selection and interaction              |
| 🔊 **Audio Validation**     | Test audio playback functionality                        |
| 🗑️ **Delete Elements**      | Add and delete elements from a list                      |
| 📅 **Date Picker**          | Choose dates and validate picker functionality           |
| 🔑 **Dynamic Login**        | Login form with random button text                       |
| ↔️ **Swipe Horizontal**     | Test horizontal swipe gestures                           |
| ↕️ **Swipe Vertical**       | Test vertical swipe gestures                             |
| 🔢 **Counter**              | Simple counter with increment/decrement                  |
| 🌐 **API Validation**       | Test HTTP methods with real API endpoints                |
| 🛒 **Shopping Cart**        | Full e-commerce flow with cart management                |
| 📥 **File Download**        | Download files and validate functionality                  |
| 📤 **File Upload**          | Select and upload files                                  |
| 👁️ **OCR Check**            | Image-based OCR validation                               |

## 🛠️ Tech Stack

- **Framework:** [React Native](https://reactnative.dev/) 0.81.5
- **Platform:** [Expo](https://expo.dev/) SDK 54
- **Navigation:** [Expo Router](https://docs.expo.dev/router/introduction/) (file-based routing)
- **Styling:** [NativeWind](https://www.nativewind.dev/) (Tailwind CSS for React Native)
- **Language:** TypeScript
- **Icons:** [@expo/vector-icons](https://icons.expo.fyi/) (Ionicons)

## 📦 Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- For iOS: macOS with Xcode installed
- For Android: Android Studio with an emulator or physical device

### Setup

1. **Clone the repository**

```bash
git clone https://github.com/thiagonunes11/tr-playground-native.git
cd tr-playground-native
```

2. **Install dependencies**

```bash
npm install
```

3. **Install iOS Pods** (macOS only)

```bash
cd ios && pod install && cd ..
```

4. **Start the development server**

```bash
npm start
```

## 🚀 Running the App

### Development Mode

```bash
# Start Expo development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run on Web
npm run web
```

### Building for Production

This project uses [EAS Build](https://docs.expo.dev/build/introduction/) for creating production builds:

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Build for Android (AAB)
eas build --platform android

# Build for iOS
eas build --platform ios
```

## 📁 Project Structure

```
tr-playground-native/
├── app/                    # App screens (file-based routing)
│   ├── _layout.tsx         # Root layout with navigation
│   ├── index.tsx           # Home screen
│   └── demos/              # Demo screens
│       ├── button-tap.tsx
│       ├── camera-validation.tsx
│       ├── shopping-cart.tsx
│       └── ...
├── assets/                 # Static assets
│   ├── audio/              # Audio files
│   ├── documents/          # Sample documents
│   └── images/             # Images and icons
├── components/             # Reusable components
│   ├── demo-card.tsx
│   ├── themed-text.tsx
│   ├── themed-view.tsx
│   └── ui/
├── constants/              # App constants
│   ├── demos.ts            # Demo configurations
│   └── theme.ts            # Theme colors
├── hooks/                  # Custom React hooks
├── types/                  # TypeScript type definitions
├── android/                # Native Android project
├── ios/                    # Native iOS project
└── package.json
```

## 🧑‍💻 Adding New Demos

See the [Developer Guide](./DEVELOPER_GUIDE.md) for detailed instructions on adding new demo pages.

Quick steps:

1. Create a new file in `app/demos/your-demo.tsx`
2. Add the demo configuration to `constants/demos.ts`
3. Register the route in `app/_layout.tsx`

## 📲 Download

Download the latest release for your platform:

- [**Android (AAB)**](https://github.com/thiagonunes11/tr-playground-native/releases/latest)
- [**iOS (APP)**](https://github.com/thiagonunes11/tr-playground-native/releases/latest)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'feat: add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 👥 Contributors

<a href="https://github.com/thiagonunes11/tr-playground-native/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=thiagonunes11/tr-playground-native" />
</a>

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [Releases](https://github.com/thiagonunes11/tr-playground-native/releases)
- [Issues](https://github.com/thiagonunes11/tr-playground-native/issues)
- [testRigor](https://testrigor.com/)

---

<p align="center">
  Made with ❤️ for the QA community
</p>
