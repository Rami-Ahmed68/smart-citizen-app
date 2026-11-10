// src/i18n/locales/en/familyDetails.js
const familyDetails = {
  pageTitle: "Family Record",
  subtitle: "View and manage family data and members",

  loadError: "Failed to load family data",
  familyNotFound: "Family not found",
  deleteSuccess: "Family deleted successfully",
  deleteError: "Failed to delete family",
  saveSuccess: "Changes saved successfully",
  saveError: "Failed to save changes",

  editFamily: "Edit",
  deleteFamily: "Delete",
  save: "Save Changes",
  saving: "Saving...",
  cancel: "Cancel",
  readOnly: "Read only",

  membersTable: "Family Members",
  addChild: "Add Child",

  columns: {
    role: "Role",
    name: "Name",
    gender: "Gender",
    age: "Age",
    birthDate: "Birth Date",
    actions: "Actions",
  },

  roles: {
    father: "Father",
    mother: "Mother",
    son: "Son",
    daughter: "Daughter",
  },

  addPlaceholder: "Enter citizen ID (24 characters)",
  add: "Add",
  remove: "Remove",
  noData: "—",

  viewProfile: "View Profile",
  ageYears: "years",
  genderMale: "Male",
  genderFemale: "Female",
  noChildren: "No registered children",

  sections: {
    audit: "Record Information",
  },

  detailId: "Family ID",
  detailCreatedAt: "Created At",
  detailUpdatedAt: "Last Update",
  detailAddedBy: "Added By",

  clickToCopyId: "Click to copy family ID",
  idCopied: "Family ID copied",
  copyError: "Failed to copy ID",

  errors: {
    invalidId: "Invalid citizen ID (must be 24 hex characters)",
    alreadyInFamily: "This person is already in the family",
    cannotRemoveBothParents: "Cannot remove both parents",
    sameForBothParents: "The same person cannot be both father and mother",
    cannotBeBothParentAndChild:
      "The same person cannot be both parent and child",
    citizenNotFound: "Citizen not found",
  },

  export: {
    button: "Export PDF",
    exporting: "Exporting...",
    success: "File exported successfully",
    error: "Failed to export file",
    membersCount: "Members Count",
    generatedOn: "Generated On",
    registryFooter: "Civil Registry - Official Document",
    republicNameAr: "الجمهورية العربية السورية",
    republicNameEn: "SYRIAN ARAB REPUBLIC",
    documentTitle: "Official Family Record",
  },

  delete: {
    title: "Delete Family",
    body: "Are you sure you want to delete this family? All members will be unlinked. Citizen profiles will not be deleted.",
    confirm: "Yes, delete",
    cancel: "Cancel",
    deleting: "Deleting...",
  },
};

export default familyDetails;
