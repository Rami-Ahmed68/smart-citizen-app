// src/i18n/locales/en/familyDetails.js
const familyDetails = {
  pageTitle: "Family Record",
  subtitle: "View and manage family data and its members",
  backToList: "Back to families",

  loadError: "Failed to load family data",
  familyNotFound: "Family not found",
  deleteSuccess: "Family deleted successfully",
  deleteError: "Failed to delete family",
  saveSuccess: "Changes saved successfully",
  saveError: "Failed to save changes",

  editFamily: "Edit",
  deleteFamily: "Delete",
  save: "Save changes",
  saving: "Saving...",
  cancel: "Cancel",
  readOnly: "Read only",

  membersTable: "Family Members",
  addChild: "Add child",

  columns: {
    role: "Role",
    name: "Name",
    gender: "Gender",
    age: "Age",
    birthDate: "Birth date",
    actions: "Actions",
  },

  roles: {
    father: "Father",
    mother: "Mother",
    son: "Son",
    daughter: "Daughter",
  },

  addPlaceholder: "Enter citizen ID (24 chars)",
  add: "Add",
  remove: "Remove",
  noData: "—",

  viewProfile: "View profile",
  ageYears: "years",
  genderMale: "Male",
  genderFemale: "Female",
  noChildren: "No children registered",

  sections: {
    audit: "Record Information",
  },

  detailId: "Family ID",
  detailCreatedAt: "Created at",
  detailUpdatedAt: "Last update",
  detailAddedBy: "Added by",

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
    membersCount: "Members count",
    generatedOn: "Generated on",
    registryFooter: "Civil Registry - Official Document",
    republicNameAr: "الجمهورية العربية السورية",
    republicNameEn: "SYRIAN ARAB REPUBLIC",
    documentTitle: "Official Family Record",
  },

  delete: {
    title: "Delete family",
    body: "Are you sure you want to delete this family? This will unlink all members from it. The citizens' personal profiles will NOT be deleted.",
    confirm: "Yes, delete",
    cancel: "Cancel",
    deleting: "Deleting...",
  },
};

export default familyDetails;
