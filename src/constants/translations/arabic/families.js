// src/i18n/locales/ar/families.js
const families = {
  pageTitle: "العائلات",
  subtitle: "عرض وإدارة جميع العائلات المسجلة",
  createFamily: "إنشاء عائلة",

  loadError: "تعذر تحميل العائلات",
  deleteSuccess: "تم حذف العائلة بنجاح",
  deleteError: "تعذر حذف العائلة",

  stats: {
    total: "إجمالي العائلات",
    withFather: "بأب مسجل",
    withMother: "بأم مسجلة",
    withChildren: "لديها أبناء",
  },

  filters: {
    familyId: "معرف العائلة",
    familyIdPlaceholder: "أدخل معرف العائلة (24 حرفًا)",
    invalidFamilyId: "معرف العائلة غير صالح (يجب أن يكون 24 حرفًا hex)",
    citizenId: "معرف المواطن",
    citizenIdPlaceholder: "أدخل معرف المواطن (24 حرفًا)",
    relation: "العلاقة",
    relationAny: "أي دور",
    relationFather: "كأب",
    relationMother: "كأم",
    relationChild: "كابن/ابنة",
    hasFather: "حالة الأب",
    hasMother: "حالة الأم",
    hasChildren: "حالة الأبناء",
    sortBy: "الترتيب حسب",
    all: "الكل",
    yes: "موجود",
    no: "غير موجود",
    search: "بحث",
    searching: "جارٍ البحث...",
    reset: "مسح",
    refresh: "تحديث",
    invalidCitizenId: "معرف المواطن غير صالح (يجب أن يكون 24 حرفًا hex)",
  },

  sort: {
    newest: "الأحدث أولاً",
    oldest: "الأقدم أولاً",
    recentlyUpdated: "الأحدث تحديثًا",
    leastRecentlyUpdated: "الأقدم تحديثًا",
  },

  card: {
    father: "الأب",
    mother: "الأم",
    children: "الأبناء",
    noFather: "بلا أب مسجل",
    noMother: "بلا أم مسجلة",
    noChildren: "لا يوجد أبناء",
    view: "عرض العائلة",
    delete: "حذف",
    viewCitizen: "عرض ملف المواطن",
  },

  empty: {
    title: "لا توجد عائلات",
    description: "لم يتم تسجيل أي عائلة بعد. ابدأ بإنشاء عائلة جديدة.",
    action: "إنشاء عائلة",
  },

  noResults: {
    title: "لا توجد نتائج",
    description: "لم يتم العثور على عائلات تطابق معايير البحث",
    action: "مسح الفلاتر",
  },

  createModal: {
    title: "إنشاء سجل عائلي جديد",
    subtitle: "إنشاء علاقة زواج بين مواطنين مسجلين",
    hint: "أدخل معرّفات المواطنين الموجودين مسبقًا في النظام. يجب توفير الأب أو الأم على الأقل.",
    parentsSection: "الوالدان",
    childrenSection: "الأبناء",
    fatherId: "معرّف الأب",
    motherId: "معرّف الأم",
    childN: "الابن",
    idPlaceholder: "24 حرفًا hex",
    optional: "اختياري",
    addChild: "إضافة ابن",
    removeChild: "إزالة",
    create: "إنشاء العائلة",
    creating: "جارٍ الإنشاء...",
    cancel: "إلغاء",
    footerNote: "تُتحقق جميع العلاقات تلقائيًا وفق قيود النظام قبل الحفظ.",
    success: "تم إنشاء العائلة بنجاح",
    error: "تعذر إنشاء العائلة",
    parentsSubtitle: "معرّفات الأب والأم",
    childrenSubtitle: "معرّفات الأبناء",
    noChildren: "لا يوجد أبناء مضافون",
    errors: {
      atLeastOneParent: "يجب توفير معرف الأب أو الأم على الأقل",
      invalidId: "معرف غير صالح (يجب أن يكون 24 حرفًا hex)",
      sameParent: "لا يمكن أن يكون الأب والأم نفس الشخص",
      childIsParent: "لا يمكن أن يكون الابن نفس الأب أو الأم",
    },
  },

  delete: {
    title: "حذف العائلة",
    body: "هل أنت متأكد من حذف هذه العائلة؟ لا يمكن التراجع عن هذا الإجراء.",
    confirm: "نعم، احذف",
    cancel: "إلغاء",
    deleting: "جارٍ الحذف...",
  },

  pagination: {
    previous: "السابق",
    next: "التالي",
    page: "صفحة",
    of: "من",
  },
};

export default families;
