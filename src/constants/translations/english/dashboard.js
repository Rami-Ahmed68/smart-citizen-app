// src/i18n/locales/en/dashboard.js
const dashboard = {
  pageTitle: "Dashboard",
  subtitle: "Overview of platform data and registered records",
  loadError: "Failed to load dashboard data",
  addCitizen: "Add Citizen",

  sections: {
    quickNav: "Quick Access",
    stats: "General Statistics",
  },

  quickNav: {
    citizens: "Citizens",
    citizensHint: "View and manage citizen records",
    families: "Families",
    familiesHint: "View and manage family records",
    admins: "Administrators",
    adminsHint: "Manage administrator accounts",
    profile: "Profile",
    profileHint: "View your personal data",
  },

  stats: {
    totalCitizens: "Total Citizens",
    totalCitizensHint: "All records registered in the system",
    males: "Males",
    malesHint: "Male citizens",
    females: "Females",
    femalesHint: "Female citizens",
    totalFamilies: "Total Families",
    totalFamiliesHint: "Registered family records",
  },

  governorates: {
    title: "Citizen Distribution by Governorate",
    subtitle: "Citizen count per governorate",
    searchPlaceholder: "Search for a governorate...",
    noResults: "No matching governorates",
  },
};

export default dashboard;
