// src/i18n/locales/ar/addCitizen.js
const addCitizen = {
  pageTitle: "إضافة مواطن جديد",
  subtitle: "إنشاء سجل مواطن جديد في قاعدة البيانات",

  sections: {
    photo: "صورة المواطن",
    personalInfo: "المعلومات الشخصية",
    contactInfo: "معلومات التواصل",
    background: "الأصل والانتماء",
  },

  photo: {
    required: "صورة المواطن مطلوبة",
    hint: "يجب أن تكون الصورة واضحة وتظهر وجه المواطن بوضوح",
    select: "اختر صورة",
    change: "تغيير الصورة",
    remove: "إزالة",
    formats: "JPG، PNG، WEBP — بحد أقصى 5 ميجابايت",
    invalidType: "نوع الملف غير مدعوم. الرجاء اختيار صورة JPG أو PNG أو WEBP",
    tooLarge: "حجم الملف يتجاوز 5 ميجابايت",
    empty: "الملف المختار فارغ",
    selected: "الصورة المختارة",
  },

  fields: {
    firstName: "الاسم الأول",
    lastName: "اسم العائلة",
    birthDate: "تاريخ الميلاد",
    gender: "الجنس",
    phone: "رقم الهاتف",
    email: "البريد الإلكتروني",
    religion: "الديانة",
    nationality: "الجنسية الأصلية",
    location: "المحافظة",
  },

  placeholders: {
    firstName: "أدخل الاسم الأول",
    lastName: "أدخل اسم العائلة",
    phone: "09XXXXXXXX",
    email: "example@domain.com",
    selectGender: "اختر الجنس",
  },

  gender: {
    male: "ذكر",
    female: "أنثى",
  },

  religion: {
    Muslim: "مسلم",
    Christian: "مسيحي",
  },

  actions: {
    create: "إنشاء المواطن",
    creating: "جارٍ الإنشاء...",
    cancel: "إلغاء",
  },

  success: {
    title: "تم إنشاء المواطن بنجاح",
    message: "تم إضافة المواطن إلى قاعدة البيانات",
  },

  errors: {
    required: "هذا الحقل مطلوب",
    firstNameMin: "الاسم الأول يجب أن يكون حرفين على الأقل",
    firstNameMax: "الاسم الأول يجب ألا يتجاوز 100 حرف",
    lastNameMin: "اسم العائلة يجب أن يكون حرفين على الأقل",
    lastNameMax: "اسم العائلة يجب ألا يتجاوز 100 حرف",
    birthDateInvalid: "تاريخ الميلاد غير صالح",
    birthDateFuture: "تاريخ الميلاد لا يمكن أن يكون في المستقبل",
    genderInvalid: "يجب اختيار الجنس",
    phoneInvalid: "رقم الهاتف يجب أن يكون 10 أرقام ويبدأ بـ 09",
    emailInvalid: "البريد الإلكتروني غير صالح",
    emailTaken: "البريد الإلكتروني مسجل مسبقًا لمواطن آخر",
    religionInvalid: "يجب اختيار ديانة صالحة",
    nationalityInvalid: "يجب اختيار جنسية صالحة",
    locationInvalid: "يجب اختيار محافظة صالحة",
    photoRequired: "يجب رفع صورة المواطن",
    photoGenderMismatch: "الجنس المكتشف في الصورة لا يطابق الجنس المحدد",
    photoNoHuman:
      "الصورة لا تحتوي على وجه إنسان واضح. الرجاء رفع صورة شخصية صحيحة",
    photoAgeMismatch:
      "العمر التقريبي في الصورة يختلف بشكل كبير عن تاريخ الميلاد المدخل",
    submitFailed: "تعذر إنشاء المواطن",
  },
};

export default addCitizen;
