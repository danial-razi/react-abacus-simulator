import React, { createContext, useContext } from 'react';
import type { Language } from './types';

const messages = {
    en: {
        appTitle: 'React Abacus Simulator', appSubtitle: 'Learn and master the art of the abacus.',
        builtWith: 'Built with React, TypeScript, and Tailwind CSS.', mode: 'Mode', abacusType: 'Abacus type',
        compute: 'Compute', tutorial: 'Tutorial', practice: 'Practice', convert: 'Convert', japanese: 'Japanese (Soroban)',
        chinese: 'Chinese (Suanpan)', soundOn: 'Sound on', soundOff: 'Sound off', language: 'فارسی', rods: 'Rods',
        decimals: 'Decimal places', currentValue: 'Current value', undo: 'Undo', redo: 'Redo', clear: 'Clear abacus',
        operand: 'Operand', apply: 'Apply operation', arithmetic: 'Arithmetic', divideByZero: 'Division by zero is not allowed.',
        negativeResult: 'This abacus displays non-negative values only.', resultClamped: 'The result was limited to the abacus capacity.',
        enterNumber: 'Enter a number to convert', previous: 'Previous', next: 'Next', correct: 'Great — that is correct!',
        tryAgain: 'Move the highlighted beads until the target value is reached.', target: 'Target', check: 'Check answer',
        newChallenge: 'New challenge', score: 'Score', streak: 'Streak', best: 'Best', difficulty: 'Difficulty',
        easy: 'Easy', medium: 'Medium', hard: 'Hard', practiceCorrect: 'Correct! Ready for another?',
        practiceWrong: 'Not yet — compare the current value with the target.', interactiveAbacus: 'Interactive abacus',
        abacusHelp: 'Use Tab or arrow keys to navigate and Space or Enter to move beads.', upperBead: 'Upper bead',
        lowerBead: 'Lower bead', rod: 'rod', value: 'value',
    },
    fa: {
        appTitle: 'شبیه‌ساز چرتکه', appSubtitle: 'هنر محاسبه با چرتکه را یاد بگیر و تمرین کن.',
        builtWith: 'ساخته‌شده با React، TypeScript و Tailwind CSS.', mode: 'حالت', abacusType: 'نوع چرتکه',
        compute: 'محاسبه', tutorial: 'آموزش', practice: 'تمرین', convert: 'تبدیل', japanese: 'ژاپنی (سوروبان)',
        chinese: 'چینی (سوان‌پن)', soundOn: 'صدا روشن', soundOff: 'صدا خاموش', language: 'English', rods: 'تعداد میله',
        decimals: 'رقم اعشار', currentValue: 'مقدار فعلی', undo: 'بازگردانی', redo: 'انجام دوباره', clear: 'پاک‌کردن چرتکه',
        operand: 'عدد دوم', apply: 'اجرای عملیات', arithmetic: 'عملیات حسابی', divideByZero: 'تقسیم بر صفر مجاز نیست.',
        negativeResult: 'این چرتکه فقط مقادیر نامنفی را نمایش می‌دهد.', resultClamped: 'نتیجه به ظرفیت چرتکه محدود شد.',
        enterNumber: 'عدد موردنظر برای تبدیل را وارد کنید', previous: 'قبلی', next: 'بعدی', correct: 'عالی بود؛ پاسخ درست است!',
        tryAgain: 'مهره‌های مشخص‌شده را حرکت دهید تا به عدد هدف برسید.', target: 'عدد هدف', check: 'بررسی پاسخ',
        newChallenge: 'تمرین جدید', score: 'امتیاز', streak: 'پاسخ پیاپی', best: 'بهترین', difficulty: 'سطح',
        easy: 'آسان', medium: 'متوسط', hard: 'سخت', practiceCorrect: 'درست بود! برای تمرین بعدی آماده‌ای؟',
        practiceWrong: 'هنوز نه؛ مقدار فعلی را با عدد هدف مقایسه کن.', interactiveAbacus: 'چرتکهٔ تعاملی',
        abacusHelp: 'با Tab یا کلیدهای جهت حرکت کنید و با Space یا Enter مهره را جابه‌جا کنید.', upperBead: 'مهرهٔ بالا',
        lowerBead: 'مهرهٔ پایین', rod: 'میله', value: 'ارزش',
    },
} as const;

type TranslationKey = keyof typeof messages.en;

const I18nContext = createContext<{ language: Language; t: (key: TranslationKey) => string }>({
    language: 'en',
    t: (key) => messages.en[key],
});

export const I18nProvider: React.FC<React.PropsWithChildren<{ language: Language }>> = ({ language, children }) => (
    <I18nContext.Provider value={{ language, t: (key) => messages[language][key] }}>
        {children}
    </I18nContext.Provider>
);

export const useI18n = () => useContext(I18nContext);
