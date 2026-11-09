// src/i18n/locales/ar/familyDetails.js
const familyDetails = {
  pageTitle: "سجل العائلة",
  subtitle: "عرض وإدارة بيانات العائلة وأفرادها",
  backToList: "العودة إلى العائلات",

  loadError: "تعذر تحميل بيانات العائلة",
  familyNotFound: "العائلة غير موجودة",
  deleteSuccess: "تم حذف العائلة بنجاح",
  deleteError: "تعذر حذف العائلة",
  saveSuccess: "تم حفظ التغييرات بنجاح",
  saveError: "تعذر حفظ التغييرات",

  editFamily: "تعديل",
  deleteFamily: "حذف",
  save: "حفظ التغييرات",
  saving: "جارٍ الحفظ...",
  cancel: "إلغاء",
  readOnly: "للعرض فقط",

  membersTable: "أفراد العائلة",
  addChild: "إضافة ابن",

  columns: {
    role: "الصفة",
    name: "الاسم",
    gender: "الجنس",
    age: "العمر",
    birthDate: "تاريخ الميلاد",
    actions: "الإجراءات",
  },

  roles: {
    father: "الأب",
    mother: "الأم",
    son: "الابن",
    daughter: "الابنة",
  },

  addPlaceholder: "أدخل معرف المواطن (24 حرفًا)",
  add: "إضافة",
  remove: "إزالة",
  noData: "—",

  viewProfile: "عرض الملف",
  ageYears: "سنة",
  genderMale: "ذكر",
  genderFemale: "أنثى",
  noChildren: "لا يوجد أبناء مسجلون",

  sections: {
    audit: "معلومات السجل",
  },

  detailId: "معرّف العائلة",
  detailCreatedAt: "تاريخ الإنشاء",
  detailUpdatedAt: "آخر تحديث",
  detailAddedBy: "أضيفت بواسطة",

  errors: {
    invalidId: "معرف المواطن غير صالح (يجب أن يكون 24 حرفًا hex)",
    alreadyInFamily: "هذا الشخص موجود بالفعل في العائلة",
    cannotRemoveBothParents: "لا يمكن إزالة كلا الوالدين",
    sameForBothParents: "لا يمكن أن يكون الشخص نفسه أبًا وأمًا",
    cannotBeBothParentAndChild:
      "لا يمكن أن يكون الشخص والدًا وابنًا في نفس الوقت",
    citizenNotFound: "لم يتم العثور على المواطن",
  },

  export: {
    button: "تصدير PDF",
    exporting: "جارٍ التصدير...",
    success: "تم تصدير الملف بنجاح",
    error: "تعذر تصدير الملف",
    membersCount: "عدد الأفراد",
    generatedOn: "تاريخ الإصدار",
    registryFooter: "السجل المدني - وثيقة رسمية",
    republicNameAr: "الجمهورية العربية السورية",
    republicNameEn: "SYRIAN ARAB REPUBLIC",
    documentTitle: "سجل العائلة الرسمي",
  },

  delete: {
    title: "حذف العائلة",
    body: "هل أنت متأكد من حذف هذه العائلة؟ سيؤدي هذا إلى إلغاء ربط جميع الأفراد بها. لن يتم حذف الملفات الشخصية للمواطنين.",
    confirm: "نعم، احذف",
    cancel: "إلغاء",
    deleting: "جارٍ الحذف...",
  },
};

export default familyDetails;
