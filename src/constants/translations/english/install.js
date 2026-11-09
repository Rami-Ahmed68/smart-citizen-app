// src/i18n/locales/en/install.js
const install = {
  hero: {
    title: "Install the App",
    subtitle: "Install the portal on your device for quick access to services",
    installButton: "Install App",
    installed: "App Installed",
    installUnavailable: "View installation steps",
    installPromptTitle: "Install the Portal on Your Device",
    installPromptHint:
      "Faster access to services without the browser, with offline support.",
    installedBadge: "The app is already installed on this device",
    installedHint:
      "You can open the portal from the app icon on your home screen or desktop.",
  },
  features: {
    title: "App Features",
    offline: {
      title: "Works Offline",
      desc: "Browse your data even without internet, and it will sync automatically when you're back.",
    },
    fast: {
      title: "Faster & Lighter",
      desc: "The installed app runs faster and uses less memory than the browser.",
    },
    secure: {
      title: "Safe & Secure",
      desc: "Fully encrypted connection, and your data is protected with top security standards.",
    },
    notifications: {
      title: "Instant Notifications",
      desc: "Receive real-time alerts about important updates the moment they happen.",
    },
  },
  platforms: {
    title: "How to Install on Your Device",
    ios: {
      name: "iPhone / iPad",
      step1: "Open the portal in Safari browser.",
      step2: "Tap the Share button (square with arrow up).",
      step3: 'Scroll down and tap "Add to Home Screen".',
      step4: 'Tap "Add" to confirm installation.',
    },
    android: {
      name: "Android",
      step1: "Open the portal in Chrome browser.",
      step2: "Tap the three-dot menu (⋮) at the top.",
      step3: 'Choose "Install app" or "Add to Home Screen".',
      step4: 'Tap "Install" to confirm.',
    },
    desktop: {
      name: "Desktop",
      step1: "Open the portal in Chrome or Edge.",
      step2: "Click the install icon in the address bar.",
      step3: 'Or open the menu and choose "Install app".',
      step4: "Confirm installation from the popup.",
    },
  },
  note: "After installation, the app will appear as an icon on your home screen or desktop, and you can open it with a single tap without needing a browser.",
};

export default install;
