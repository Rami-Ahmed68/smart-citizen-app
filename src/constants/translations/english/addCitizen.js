// src/i18n/locales/en/addCitizen.js
const addCitizen = {
  pageTitle: "Add New Citizen",
  subtitle: "Create a new citizen record in the database",

  sections: {
    photo: "Citizen Photo",
    personalInfo: "Personal Information",
    contactInfo: "Contact Information",
    background: "Origin & Background",
  },

  photo: {
    required: "Citizen photo is required",
    hint: "The photo must be clear and show the citizen's face clearly",
    select: "Select Image",
    change: "Change Image",
    remove: "Remove",
    formats: "JPG, PNG, WEBP — Maximum 5 MB",
    invalidType:
      "Unsupported file type. Please choose a JPG, PNG, or WEBP image",
    tooLarge: "File size exceeds 5 MB",
    empty: "The selected file is empty",
    selected: "Selected image",
  },

  fields: {
    firstName: "First Name",
    lastName: "Last Name",
    birthDate: "Birth Date",
    gender: "Gender",
    phone: "Phone Number",
    email: "Email",
    religion: "Religion",
    nationality: "Original Nationality",
    location: "Governorate",
  },

  placeholders: {
    firstName: "Enter first name",
    lastName: "Enter last name",
    phone: "09XXXXXXXX",
    email: "example@domain.com",
    selectGender: "Select gender",
  },

  gender: {
    male: "Male",
    female: "Female",
  },

  religion: {
    Muslim: "Muslim",
    Christian: "Christian",
  },

  actions: {
    create: "Create Citizen",
    creating: "Creating...",
    cancel: "Cancel",
  },

  success: {
    title: "Citizen Created Successfully",
    message: "The citizen has been added to the database",
  },

  errors: {
    required: "This field is required",
    firstNameMin: "First name must be at least 2 characters",
    firstNameMax: "First name must not exceed 100 characters",
    lastNameMin: "Last name must be at least 2 characters",
    lastNameMax: "Last name must not exceed 100 characters",
    birthDateInvalid: "Invalid birth date",
    birthDateFuture: "Birth date cannot be in the future",
    genderInvalid: "Gender must be selected",
    phoneInvalid: "Phone must be exactly 10 digits starting with 09",
    emailInvalid: "Invalid email address",
    emailTaken: "Email is already registered for another citizen",
    religionInvalid: "Please select a valid religion",
    nationalityInvalid: "Please select a valid nationality",
    locationInvalid: "Please select a valid governorate",
    photoRequired: "Citizen photo must be uploaded",
    photoGenderMismatch:
      "The gender detected in the photo does not match the selected gender",
    photoNoHuman:
      "The photo does not contain a clear human face. Please upload a valid personal photo",
    photoAgeMismatch:
      "The estimated age in the photo significantly differs from the entered birth date",
    submitFailed: "Failed to create citizen",
  },
};

export default addCitizen;
