// languages.js - Complete without JSON files
const languageData = {
    english: {
        name: "English",
        code: "en",
        responses: {
            greetings: ["Hello! I'm Zyron", "Hi there! How can I help?", "Hey! Ready to assist!", "Greetings! Zyron here!"],
            help: ["How can I help you?", "What can I do for you?", "How may I assist you?", "Tell me what you need!"],
            jokes: [
                "Why do programmers prefer dark mode? Because light attracts bugs!",
                "Why did the developer go broke? Because he used up all his cache!",
                "What's a programmer's favorite hangout place? The Foo Bar!",
                "Why do programmers confuse Halloween and Christmas? Because Oct 31 equals Dec 25!"
            ],
            farewells: ["Goodbye!", "See you later!", "Take care!", "Bye bye!"],
            errors: ["I didn't understand that", "Can you please rephrase?", "Sorry, I'm still learning!"]
        }
    },
    urdu: {
        name: "Urdu",
        code: "ur",
        responses: {
            greetings: ["السلام علیکم! میں زیڈرون ہوں", "ہیلو! میں آپ کی کس طرح مدد کر سکتا ہوں؟", "آداب! تیار ہوں مدد کے لیے!", "خوش آمدید!"],
            help: ["میں آپ کی کس طرح مدد کر سکتا ہوں؟", "آپ کے لیے کیا کر سکتا ہوں؟", "کیا میں آپ کی مدد کر سکتا ہوں؟", "مجھے بتائیں آپ کو کیا چاہیے!"],
            jokes: [
                "پروگرامر ڈارک موڈ کیوں پسند کرتے ہیں؟ کیونکہ روشنی کیڑوں کو کھینچتی ہے!",
                "ڈویلپر کنگال کیوں ہو گیا؟ کیونکہ اس نے اپنی تمام کیش استعمال کر لی!",
                "پروگرامر کی پسندیدہ جگہ کون سی ہے؟ فو بار!",
                "پروگرامر ہالووین اور کرسمس میں کیوں الجھن میں پڑتے ہیں؟ کیونکہ اکتوبر 31 دسمبر 25 کے برابر ہے!"
            ],
            farewells: ["اللہ حافظ!", "پھر ملیں گے!", "خدا حافظ!", "بائے بائے!"],
            errors: ["میں سمجھ نہیں پایا", "براہ کرم دوبارہ کہیں؟", "معاف کیجیے، میں ابھی سیکھ رہا ہوں!"]
        }
    }
};

class LanguageManager {
    constructor() {
        this.currentLang = 'english';
        this.detectedLang = 'english';
    }

    detectLanguage(text) {
        // Simple language detection
        const urduRegex = /[\u0600-\u06FF]/;
        if (urduRegex.test(text)) {
            this.detectedLang = 'urdu';
        } else {
            this.detectedLang = 'english';
        }
        return this.detectedLang;
    }

    getResponse(category) {
        const langData = languageData[this.currentLang];
        const responses = langData.responses[category];
        return responses ? responses[Math.floor(Math.random() * responses.length)] : "I'm still learning!";
    }

    setLanguage(lang) {
        if (languageData[lang]) {
            this.currentLang = lang;
            return true;
        }
        return false;
    }

    getAvailableLanguages() {
        return Object.keys(languageData);
    }

    translateText(text, targetLang) {
        // Simple translation for common phrases
        const translations = {
            'hello': 'السلام علیکم',
            'hi': 'ہیلو',
            'help': 'مدد',
            'project': 'پراجیکٹ',
            'skill': 'ہنر',
            'contact': 'رابطہ'
        };

        if (targetLang === 'urdu' && translations[text.toLowerCase()]) {
            return translations[text.toLowerCase()];
        }
        return text; // Return original if no translation
    }
}

window.languageManager = new LanguageManager();
