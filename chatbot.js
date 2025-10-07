// ===== ZYRON AI CHATBOT - COMPLETE BRAIN =====

class ZyronAI {
    constructor() {
        this.conversationHistory = [];
        this.isListening = false;
        this.currentLanguage = 'english';
        this.userName = '';
        this.isFirstInteraction = true;
        
        this.initializeChatbot();
        this.loadConversationHistory();
    }

    // ===== INITIALIZATION =====
    initializeChatbot() {
        this.bindEvents();
        this.showWelcomeMessage();
        console.log('🤖 Zyron AI Initialized - Ready to assist!');
    }

    bindEvents() {
        // Message sending
        document.getElementById('sendMessage')?.addEventListener('click', () => this.handleUserInput());
        document.getElementById('chatbotInput')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleUserInput();
        });

        // Voice recognition
        document.getElementById('voiceButton')?.addEventListener('click', () => this.toggleVoiceRecognition());

        // Chatbot actions
        document.querySelectorAll('[data-action]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.currentTarget.getAttribute('data-action');
                this.handleAction(action);
            });
        });

        // Auto-detect language from user input
        document.getElementById('chatbotInput')?.addEventListener('input', (e) => {
            this.autoDetectLanguage(e.target.value);
        });
    }

    // ===== CORE CHAT FUNCTIONALITY =====
    async handleUserInput() {
        const input = document.getElementById('chatbotInput');
        const message = input.value.trim();

        if (!message) return;

        // Clear input
        input.value = '';

        // Add user message to chat
        this.addMessageToChat(message, 'user');

        // Show typing indicator
        this.showTypingIndicator();

        // Process message and get response
        try {
            const response = await this.processMessage(message);
            
            // Remove typing indicator
            this.removeTypingIndicator();
            
            // Add bot response to chat
            this.addMessageToChat(response, 'bot');
            
            // Speak response if voice is enabled
            if (window.voiceAssistant) {
                window.voiceAssistant.speak(response, this.getLanguageCode());
            }

        } catch (error) {
            this.removeTypingIndicator();
            this.addMessageToChat("I'm having trouble processing your request. Please try again.", 'bot');
            console.error('Chatbot error:', error);
        }

        // Save conversation
        this.saveConversationHistory();
    }

    async processMessage(message) {
        // Store message in history
        this.conversationHistory.push({
            role: 'user',
            content: message,
            timestamp: new Date().toISOString()
        });

        // Extract user name if first interaction
        if (this.isFirstInteraction) {
            this.extractUserName(message);
            this.isFirstInteraction = false;
        }

        // Process different types of messages
        return await this.analyzeAndRespond(message);
    }

    // ===== MESSAGE ANALYSIS & RESPONSE GENERATION =====
    async analyzeAndRespond(message) {
        const lowerMessage = message.toLowerCase();
        
        // Detect intent and generate appropriate response
        if (this.isGreeting(lowerMessage)) {
            return this.generateGreetingResponse();
        }
        else if (this.isFarewell(lowerMessage)) {
            return this.generateFarewellResponse();
        }
        else if (this.isAboutZain(lowerMessage)) {
            return this.generateAboutZainResponse();
        }
        else if (this.isProjectInquiry(lowerMessage)) {
            return this.generateProjectsResponse();
        }
        else if (this.isSkillInquiry(lowerMessage)) {
            return this.generateSkillsResponse();
        }
        else if (this.isContactRequest(lowerMessage)) {
            return this.generateContactResponse();
        }
        else if (this.isJokeRequest(lowerMessage)) {
            return this.generateJokeResponse();
        }
        else if (this.isSearchQuery(lowerMessage)) {
            return await this.generateSearchResponse(message);
        }
        else if (this.isLanguageChange(lowerMessage)) {
            return this.handleLanguageChange(message);
        }
        else if (this.isHelpRequest(lowerMessage)) {
            return this.generateHelpResponse();
        }
        else {
            return await this.generateIntelligentResponse(message);
        }
    }

    // ===== INTENT DETECTION METHODS =====
    isGreeting(message) {
        const greetings = [
            'hello', 'hi', 'hey', 'hola', 'namaste', 'salam', 'assalam',
            'good morning', 'good afternoon', 'good evening',
            'السلام علیکم', 'ہیلو', 'ہائے', 'آداب'
        ];
        return greetings.some(greet => message.includes(greet));
    }

    isFarewell(message) {
        const farewells = [
            'bye', 'goodbye', 'see you', 'farewell', 'take care',
            'خدا حافظ', 'اللہ حافظ', 'بائے', 'چلتا ہوں'
        ];
        return farewells.some(farewell => message.includes(farewell));
    }

    isAboutZain(message) {
        const keywords = [
            'zain', 'about', 'who are you', 'yourself', 'introduce',
            'تعارف', 'ذین', 'اپنے بارے', 'کون ہو'
        ];
        return keywords.some(keyword => message.includes(keyword));
    }

    isProjectInquiry(message) {
        const keywords = [
            'project', 'work', 'portfolio', 'build', 'create', 'developed',
            'پراجیکٹ', 'کام', 'پورٹفولیو', 'بنایا'
        ];
        return keywords.some(keyword => message.includes(keyword));
    }

    isSkillInquiry(message) {
        const keywords = [
            'skill', 'technology', 'know', 'expert', 'learn', 'able to',
            'ہنر', 'مہارت', 'ٹیکنالوجی', 'آتا ہے'
        ];
        return keywords.some(keyword => message.includes(keyword));
    }

    isContactRequest(message) {
        const keywords = [
            'contact', 'email', 'phone', 'number', 'reach', 'get in touch',
            'رابطہ', 'ای میل', 'فون', 'نمبر'
        ];
        return keywords.some(keyword => message.includes(keyword));
    }

    isJokeRequest(message) {
        const keywords = [
            'joke', 'funny', 'laugh', 'humor', 'comedy', 'entertain',
            'مذاق', 'جوك', 'ہنسی', 'تفریح'
        ];
        return keywords.some(keyword => message.includes(keyword));
    }

    isSearchQuery(message) {
        const searchTriggers = [
            'search', 'find', 'look up', 'what is', 'who is', 'how to',
            'تلاش', 'ڈھونڈ', 'کیا ہے', 'کس طرح'
        ];
        return searchTriggers.some(trigger => message.includes(trigger));
    }

    isLanguageChange(message) {
        const languages = [
            'english', 'urdu', 'hindi', 'arabic', 'language', 'زبان', 
            'انگریزی', 'اردو', 'ہندی', 'عربی'
        ];
        return languages.some(lang => message.includes(lang));
    }

    isHelpRequest(message) {
        const helpWords = [
            'help', 'assist', 'support', 'guide', 'what can you do',
            'مدد', 'سہارا', 'رہنمائی', 'کیا کر سکتے'
        ];
        return helpWords.some(word => message.includes(word));
    }

    // ===== RESPONSE GENERATION METHODS =====
    generateGreetingResponse() {
        const greetings = {
            english: [
                Hello${this.userName ? ' ' + this.userName : ''}! I'm Zyron, your AI assistant. How can I help you today?,
                Hi there${this.userName ? ' ' + this.userName : ''}! I'm Zyron. What would you like to know?,
                Hey${this.userName ? ' ' + this.userName : ''}! Great to see you. How can I assist you?
            ],
            urdu: [
                السلام علیکم${this.userName ? ' ' + this.userName : ''}! میں زیڈرون ہوں، آپ کا AI اسسٹنٹ۔ میں آپ کی کس طرح مدد کر سکتا ہوں؟,
                ہیلو${this.userName ? ' ' + this.userName : ''}! میں زیڈرون ہوں۔ آپ کیا جاننا چاہیں گے؟,
                آداب${this.userName ? ' ' + this.userName : ''}! آپ کو دیکھ کر اچھا لگا۔ میں آپ کی کس طرح مدد کر سکتا ہوں؟
            ]
        };

        return this.getRandomResponse(greetings[this.currentLanguage] || greetings.english);
    }

    generateFarewellResponse() {
        const farewells = {
            english: [
                Goodbye${this.userName ? ' ' + this.userName : ''}! It was great talking with you. Feel free to come back anytime!,
                See you later${this.userName ? ' ' + this.userName : ''}! Don't hesitate to ask if you need anything else.,
                Take care${this.userName ? ' ' + this.userName : ''}! I'm always here when you need assistance.
            ],
            urdu: [
                اللہ حافظ${this.userName ? ' ' + this.userName : ''}! آپ سے بات کر کے اچھا لگا۔ کسی بھی وقت واپس آئیے!,
                پھر ملیں گے${this.userName ? ' ' + this.userName : ''}! اگر آپ کو کچھ اور چاہیے تو ضرور پوچھیں۔,
                خدا حافظ${this.userName ? ' ' + this.userName : ''}! جب بھی آپ کو مدد کی ضرورت ہو، میں یہیں ہوں۔
            ]
        };

        return this.getRandomResponse(farewells[this.currentLanguage] || farewells.english);
    }

    generateAboutZainResponse() {
        const aboutZain = {
            english: I'm Zyron, the AI assistant for Zain-ul-Abideen's portfolio. Zain is a 16-year-old web developer from Mian Channu, Pakistan. He scored 1107/1200 in Matric and is currently studying Intermediate Part 1. He's passionate about web development and has skills in HTML, CSS, JavaScript, and MS Office.,
            urdu: میں زیڈرون ہوں، زین ال عابدین کے پورٹفولیو کا AI اسسٹنٹ۔ زین میاں چنو، پاکستان کا ایک 16 سالہ ویب ڈویلپر ہے۔ اس نے میٹرک میں 1107/1200 نمبر حاصل کیے اور فی الحال انٹرمیڈیٹ پارٹ 1 کی تعلیم حاصل کر رہا ہے۔ اسے ویب ڈویلپمنٹ کا شوق ہے اور اسے HTML، CSS، JavaScript اور MS Office میں مہارت حاصل ہے۔
        };

        return aboutZain[this.currentLanguage] || aboutZain.english;
    }

    generateProjectsResponse() {
        const projects = {
            english: Zain has worked on several projects:\n\n• Portfolio Website: A responsive website with dark mode and animations\n• Amazon Clone: A practice project replicating Amazon's UI\n\nYou can view these projects in the Projects section above. Would you like to know more about any specific project?,
            urdu: زین نے کئی پراجیکٹس پر کام کیا ہے:\n\n• پورٹفولیو ویب سائٹ: ڈارک موڈ اور اینیمیشنز والی ریسپانسیو ویب سائٹ\n• ایمیزون کلون: ایمیزون کے UI کی نقل کرتا ہوا ایک پریکٹس پراجیکٹ\n\nآپ ان پراجیکٹس کو اوپر والے پراجیکٹس سیکشن میں دیکھ سکتے ہیں۔ کیا آپ کسی خاص پراجیکٹ کے بارے میں مزید جاننا چاہیں گے؟
        };

        return projects[this.currentLanguage] || projects.english;
    }

    generateSkillsResponse() {
        const skills = {
            english: Zain's technical skills include:\n\n• HTML5 & CSS3: Advanced level\n• JavaScript: Intermediate level\n• Responsive Design: Expert level\n• Git & GitHub: Basic level\n• MS Office: Advanced level\n\nHe's constantly learning and improving his skills!,
            urdu: زین کی تکنیکی مہارتیں شامل ہیں:\n\n• HTML5 & CSS3: ایڈوانسڈ لیول\n• JavaScript: انٹرمیڈیٹ لیول\n• ریسپانسیو ڈیزائن: ایکسپرٹ لیول\n• Git & GitHub: بیسک لیول\n• MS Office: ایڈوانسڈ لیول\n\nوہ مسلسل سیکھ رہا ہے اور اپنی مہارتیں بہتر کر رہا ہے!
        };

        return skills[this.currentLanguage] || skills.english;
    }

    generateContactResponse() {
        const contact = {
            english: You can contact Zain through:\n\n📧 Email: bloodprince798@gmail.com\n📞 Phone: +92 309 0476955\n📍 Location: Mian Channu, Punjab, Pakistan\n\nFeel free to reach out for collaborations or questions!,
            urdu: آپ زین سے اس طرح رابطہ کر سکتے ہیں:\n\n📧 ای میل: bloodprince798@gmail.com\n📞 فون: +92 309 0476955\n📍 مقام: میاں چنو، پنجاب، پاکستان\n\nتعاون یا سوالات کے لیے بلا جھجھک رابطہ کریں!
        };

        return contact[this.currentLanguage] || contact.english;
    }

    generateJokeResponse() {
        const jokes = {
            english: [
                "Why do programmers prefer dark mode? Because light attracts bugs! 🐛",
                "Why did the developer go broke? Because he used up all his cache! 💰",
                "What's a programmer's favorite hangout place? The Foo Bar! 🍻",
                "Why do programmers confuse Halloween and Christmas? Because Oct 31 equals Dec 25! 🎃🎄"
            ],
            urdu: [
                "پروگرامر ڈارک موڈ کیوں پسند کرتے ہیں؟ کیونکہ روشنی کیڑوں کو کھینچتی ہے! 🐛",
                "ڈویلپر کنگال کیوں ہو گیا؟ کیونکہ اس نے اپنی تمام کیش استعمال کر لی! 💰",
                "پروگرامر کی پسندیدہ جگہ کون سی ہے؟ فو بار! 🍻",
                "پروگرامر ہالووین اور کرسمس میں کیوں الجھن میں پڑتے ہیں؟ کیونکہ اکتوبر 31 دسمبر 25 کے برابر ہے! 🎃🎄"
            ]
        };

        return this.getRandomResponse(jokes[this.currentLanguage] || jokes.english);
    }

    async generateSearchResponse(query) {
        try {
            if (window.apiHandler) {
                const result = await window.apiHandler.searchWeb(query, this.currentLanguage);
                return result;
            } else {
                return this.getRandomResponse({
                    english: [
                        "I'd love to search that for you, but the search feature is currently unavailable.",
                        "I'm unable to perform web searches at the moment. Please try again later.",
                        "Search functionality is temporarily disabled. Is there anything else I can help with?"
                    ],
                    urdu: [
                        "میں آپ کے لیے یہ تلاش کرنا چاہوں گا، لیکن فی الحال سرچ فیچر دستیاب نہیں ہے۔",
                        "میں اس وقت ویب سرچز انجام نہیں دے سکتا۔ براہ کرم کچھ دیر بعد کوشش کریں۔",
                        "سرچ فنکشن عارضی طور پر غیر فعال ہے۔ کیا میں آپ کی کسی اور چیز میں مدد کر سکتا ہوں؟"
                    ]
                }[this.currentLanguage]);
            }
        } catch (error) {
            return "I encountered an error while searching. Please try a different query.";
        }
    }

    handleLanguageChange(message) {
        if (message.includes('urdu') || message.includes('اردو')) {
            this.currentLanguage = 'urdu';
            return "زبان اردو میں تبدیل کر دی گئی ہے! اب میں اردو میں بات کروں گا۔";
        } else if (message.includes('english') || message.includes('انگریزی')) {
            this.currentLanguage = 'english';
            return "Language changed to English! I'll now speak in English.";
        } else {
            return this.currentLanguage === 'english' 
                ? "I can speak both English and Urdu. Just say 'speak Urdu' or 'speak English' to switch."
                : "میں انگریزی اور اردو دونوں بول سکتا ہوں۔ زبان تبدیل کرنے کے لیے 'انگریزی بولو' یا 'اردو بولو' کہیں۔";
        }
    }

    generateHelpResponse() {
        const help = {
            english: I can help you with:\n\n• Information about Zain\n• Project details\n• Skills and technologies\n• Contact information\n• Web searches\n• Jokes and fun facts\n• Language switching (English/Urdu)\n\nJust ask me anything!,
            urdu: میں آپ کی ان چیزوں میں مدد کر سکتا ہوں:\n\n• زین کے بارے میں معلومات\n• پراجیکٹ کی تفصیلات\n• مہارتیں اور ٹیکنالوجیز\n• رابطہ کی معلومات\n• ویب سرچز\n• لطیفے اور دلچسپ حقائق\n• زبان کی تبدیلی (انگریزی/اردو)\n\nمجھ سے کچھ بھی پوچھیں!
        };

        return help[this.currentLanguage] || help.english;
    }

    // ===== INTELLIGENT RESPONSE GENERATION =====
    async generateIntelligentResponse(message) {
        // For unknown queries, try to provide helpful responses
        const fallbackResponses = {
            english: [
                "That's an interesting question! I'm still learning, but I'd be happy to help with information about Zain, his projects, or web development in general.",
                "I'm not sure I understand completely. Could you rephrase that? I'm great at answering questions about Zain's portfolio and skills!",
                "I'm constantly learning new things. Right now, I can best assist you with questions about Zain's work, projects, and web development topics."
            ],
            urdu: [
                "یہ ایک دلچسپ سوال ہے! میں ابھی سیکھ رہا ہوں، لیکن میں زین، اس کے پراجیکٹس، یا ویب ڈویلپمنٹ کے بارے میں معلومات دے کر مدد کرنے میں خوش ہوں گا۔",
                "مجھے یقین نہیں کہ میں مکمل طور پر سمجھ پایا۔ کیا آپ اسے دوبارہ کہہ سکتے ہیں؟ میں زین کے پورٹفولیو اور مہارتوں کے بارے میں سوالات کے جواب دینے میں ماہر ہوں!",
                "میں مسلسل نئی چیزیں سیکھ رہا ہوں۔ فی الحال، میں زین کے کام، پراجیکٹس، اور ویب ڈویلپمنٹ کے موضوعات کے بارے میں سوالات میں بہترین مدد کر سکتا ہوں۔"
            ]
        };

        // Try to search for the answer
        try {
            if (window.apiHandler) {
                const searchResult = await window.apiHandler.searchWeb(message, this.currentLanguage);
                if (searchResult && !searchResult.includes('common topic')) {
                    return searchResult;
                }
            }
        } catch (error) {
            console.log('Search failed, using fallback response');
        }

        return this.getRandomResponse(fallbackResponses[this.currentLanguage] || fallbackResponses.english);
    }

    // ===== UTILITY METHODS =====
    getRandomResponse(responses) {
        return responses[Math.floor(Math.random() * responses.length)];
    }

    extractUserName(message) {
        // Simple name extraction from greetings
        const namePatterns = [
            /(?:my name is|i am|call me) (\w+)/i,
            /(?:نام|میرا نام) (\w+)/i
        ];

        for (const pattern of namePatterns) {
            const match = message.match(pattern);
            if (match && match[1]) {
                this.userName = match[1];
                break;
            }
        }
    }

    autoDetectLanguage(text) {
        const urduRegex = /[\u0600-\u06FF]/;
        if (urduRegex.test(text)) {
            this.currentLanguage = 'urdu';
        } else {
            this.currentLanguage = 'english';
        }
    }

    getLanguageCode() {
        return this.currentLanguage === 'urdu' ? 'ur-PK' : 'en-US';
    }

    // ===== CHAT UI METHODS =====
    addMessageToChat(message, sender) {
        const chatMessages = document.getElementById('chatbotMessages');
        if (!chatMessages) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = message ${sender}-message;
        
        const timestamp = new Date().toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
        });

        messageDiv.innerHTML = `
            <div class="message-content">
                <p>${this.formatMessage(message)}</p>
            </div>
            <span class="message-time">${timestamp}</span>
        `;

        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Add to conversation history
        this.conversationHistory.push({
            role: sender,
            content: message,
            timestamp: new Date().toISOString()
        });
    }

    formatMessage(message) {
        // Convert line breaks to HTML
        return message.replace(/\n/g, '<br>');
    }

    showTypingIndicator() {
        const chatMessages = document.getElementById('chatbotMessages');
        if (!chatMessages) return;

        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message typing-indicator';
        typingDiv.id = 'typingIndicator';
        typingDiv.innerHTML = `
            <div class="message-content">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;

        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    removeTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    showWelcomeMessage() {
        const welcomeMessage = this.currentLanguage === 'urdu' 
            ? "السلام علیکم! میں زیڈرون ہوں، آپ کا AI اسسٹنٹ۔ میں آپ کی کس طرح مدد کر سکتا ہوں؟"
            : "Hello! I'm Zyron, your AI assistant. How can I help you today?";

        this.addMessageToChat(welcomeMessage, 'bot');
    }

    // ===== VOICE RECOGNITION =====
    toggleVoiceRecognition() {
        const voiceButton = document.getElementById('voiceButton');
        
        if (!window.voiceAssistant) {
            this.addMessageToChat("Voice recognition is not available in your browser.", 'bot');
            return;
        }

        if (this.isListening) {
            window.voiceAssistant.stopListening();
            this.isListening = false;
            voiceButton.classList.remove('listening');
        } else {
            window.voiceAssistant.startListening();
            this.isListening = true;
            voiceButton.classList.add('listening');
        }
    }

    // ===== ACTION HANDLERS =====
    handleAction(action) {
        switch (action) {
            case 'clear':
                this.clearChat();
                break;
            case 'language':
                this.toggleLanguage();
                break;
            case 'help':
                this.showHelp();
                break;
        }
    }

    clearChat() {
        const chatMessages = document.getElementById('chatbotMessages');
        if (chatMessages) {
            chatMessages.innerHTML = '';
            this.showWelcomeMessage();
        }
    }

    toggleLanguage() {
        this.currentLanguage = this.currentLanguage === 'english' ? 'urdu' : 'english';
        const message = this.currentLanguage === 'urdu' 
            ? "زبان اردو میں تبدیل کر دی گئی ہے!" 
            : "Language changed to English!";
        
        this.addMessageToChat(message, 'bot');
    }

    showHelp() {
        this.addMessageToChat(this.generateHelpResponse(), 'bot');
    }

    // ===== DATA PERSISTENCE =====
    saveConversationHistory() {
        try {
            localStorage.setItem('zyron_conversation', JSON.stringify(this.conversationHistory));
            localStorage.setItem('zyron_language', this.currentLanguage);
            if (this.userName) {
                localStorage.setItem('zyron_username', this.userName);
            }
        } catch (error) {
            console.warn('Could not save conversation history:', error);
        }
    }

    loadConversationHistory() {
        try {
            const savedConversation = localStorage.getItem('zyron_conversation');
            const savedLanguage = localStorage.getItem('zyron_language');
            const savedUsername = localStorage.getItem('zyron_username');

            if (savedConversation) {
                this.conversationHistory = JSON.parse(savedConversation);
            }
            if (savedLanguage) {
                this.currentLanguage = savedLanguage;
            }
            if (savedUsername) {
                this.userName = savedUsername;
                this.isFirstInteraction = false;
            }
        } catch (error) {
            console.warn('Could not load conversation history:', error);
        }
    }
}

// ===== INITIALIZE CHATBOT WHEN DOM LOADS =====
document.addEventListener('DOMContentLoaded', () => {
    // Add typing indicator styles
    const style = document.createElement('style');
    style.textContent = `
        .typing-indicator .message-content {
            background: rgba(99, 102, 241, 0.1) !important;
            border: 1px solid rgba(99, 102, 241, 0.3) !important;
        }
        .typing-dots {
            display: flex;
            gap: 4px;
        }
        .typing-dots span {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: var(--cosmic-primary);
            animation: typingBounce 1.4s ease-in-out infinite both;
        }
        .typing-dots span:nth-child(1) { animation-delay: -0.32s; }
        .typing-dots span:nth-child(2) { animation-delay: -0.16s; }
        @keyframes typingBounce {
            0%, 80%, 100% { transform: scale(0); }
            40% { transform: scale(1); }
        }
    `;
    document.head.appendChild(style);

    // Initialize chatbot
    window.zyronAI = new ZyronAI();
});

// Global function to handle user messages from voice recognition
window.handleUserMessage = function(message) {
    if (window.zyronAI) {
        const input = document.getElementById('chatbotInput');
        if (input) {
            input.value = message;
            window.zyronAI.handleUserInput();
        }
    }
};

console.log('🤖 Zyron AI Chatbot loaded successfully!');

