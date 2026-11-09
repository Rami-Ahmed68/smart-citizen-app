// src/i18n/locales/en/families.js
const families = {
  pageTitle: "Families",
  subtitle: "View and manage all registered families",
  createFamily: "Create family",

  loadError: "Failed to load families",
  deleteSuccess: "Family deleted successfully",
  deleteError: "Failed to delete family",

  stats: {
    total: "Total Families",
    withFather: "With Father",
    withMother: "With Mother",
    withChildren: "With Children",
  },

  filters: {
    citizenId: "Citizen ID",
    citizenIdPlaceholder: "Enter citizen ID (24 chars)",
    relation: "Relation",
    relationAny: "Any role",
    relationFather: "As father",
    relationMother: "As mother",
    relationChild: "As child",
    hasFather: "Father status",
    hasMother: "Mother status",
    hasChildren: "Children status",
    sortBy: "Sort by",
    all: "All",
    yes: "Present",
    no: "Missing",
    search: "Search",
    searching: "Searching...",
    reset: "Reset",
    refresh: "Refresh",
    invalidCitizenId: "Invalid citizen ID (must be 24 hex characters)",
  },

  sort: {
    newest: "Newest first",
    oldest: "Oldest first",
    recentlyUpdated: "Recently updated",
    leastRecentlyUpdated: "Least recently updated",
  },

  card: {
    father: "Father",
    mother: "Mother",
    children: "Children",
    noFather: "No father registered",
    noMother: "No mother registered",
    noChildren: "No children",
    view: "View family",
    delete: "Delete",
    viewCitizen: "View citizen profile",
  },

  empty: {
    title: "No families",
    description:
      "No families have been registered yet. Start by creating a new family.",
    action: "Create family",
  },

  noResults: {
    title: "No results",
    description: "No families match your search criteria",
    action: "Clear filters",
  },

  delete: {
    title: "Delete family",
    body: "Are you sure you want to delete this family? This action cannot be undone.",
    confirm: "Yes, delete",
    cancel: "Cancel",
    deleting: "Deleting...",
  },

  pagination: {
    previous: "Previous",
    next: "Next",
    page: "Page",
    of: "of",
  },
};

export default families;
