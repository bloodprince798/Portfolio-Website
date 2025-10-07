// API Handler for Zyron AI
class ApiHandler {
    constructor() {
        this.searchCache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    }

    // Internet search simulation
    async searchWeb(query, lang = 'en') {
        try {
            // Check cache first
            const cacheKey = ${query}_${lang};
            const cached = this.searchCache.get(cacheKey);
            
            if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
                return cached.data;
            }

            // Simulate API call with timeout
            const result = await this.simulateSearch(query, lang);
            
            // Cache the result
            this.searchCache.set(cacheKey, {
                data: result,
                timestamp: Date.now()
            });

            return result;
        } catch (error) {
            console.error('Search error:', error);
            return this.getFallbackResponse(query, lang);
        }
    }

    // Simulate web search
    async simulateSearch(query, lang) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

        const searchResponses = {
            en: {
                'web development trends 2024': 'Latest trends in 2024: AI integration, Web3, Progressive Web Apps, Serverless architecture, and enhanced cybersecurity measures.',
                'latest javascript features': 'Recent JavaScript features: ES2023 added Array findLast(), toSorted(), toReversed(). Top-level await, private class fields, and pattern matching are upcoming.',
                'best programming practices': 'Best practices: Write clean code, use version control, test-driven development, code reviews, continuous integration, and proper documentation.',
                'how to learn web development': 'Start with HTML/CSS, then JavaScript, learn responsive design, practice with projects, learn Git, explore frameworks like React, and build a portfolio.',
                'what is react js': 'React is a JavaScript library for building user interfaces, maintained by Facebook. It uses component-based architecture and virtual DOM for efficient updates.'
            },
            urdu: {
                'ویب ڈویلپمنٹ': 'ویب ڈویلپمنٹ میں HTML، CSS اور JavaScript سیکھیں۔ جدید ٹرینڈز میں React، Vue، اور Node.js شامل ہیں۔',
                'جاوا سکرپٹ کیا ہے': 'جاوا سکرپٹ ایک پروگرامنگ زبان ہے جو ویب صفحات کو انٹریکٹو بناتی ہے۔ یہ کلائنٹ سائیڈ اور سرور سائیڈ دونوں پر کام کرتی ہے۔',
                'پروگرامنگ کیسے سیکھیں': 'پروگرامنگ سیکھنے کے لیے: پیایک زبان سے شروع کریں، معمول کی مشق کریں، پروجیکٹس بنائیں، آن لائن وسائل استعمال کریں، اور کمیونٹی میں شامل ہوں۔'
            }
        };

        const lowerQuery = query.toLowerCase().trim();
        
        // Find matching response
        for (const [key, response] of Object.entries(searchResponses[lang] || searchResponses.en)) {
            if (lowerQuery.includes(key)) {
                return response;
            }
        }

        // Default response
        return lang === 'urdu' 
            ? میں نے "${query}" کے بارے میں معلومات تلاش کی ہیں۔ یہ عام موضوع ہے، براہ کرم مزید مخصوص سوال کریں۔
            : I found information about "${query}". This is a common topic, please be more specific with your question.;
    }

    // Fallback response when search fails
    getFallbackResponse(query, lang) {
        const fallbacks = {
            en: "I'm having trouble accessing real-time information right now. Please try again later or ask me about general topics.",
            urdu: "مجھے فی الحال live information تک رسائی میں دشواری ہو رہی ہے۔ براہ کرم کچھ دیر بعد کوشش کریں یا مجھ سے عمومی موضوعات کے بارے میں پوچھیں۔"
        };
        
        return fallbacks[lang] || fallbacks.en;
    }

    // Get weather information (simulated)
    async getWeather(city = 'Mian Channu') {
        try {
            // Simulate weather API call
            await new Promise(resolve => setTimeout(resolve, 800));
            
            const weatherData = {
                temperature: Math.floor(Math.random() * 15) + 20, // 20-35°C
                condition: ['Sunny', 'Partly Cloudy', 'Clear'][Math.floor(Math.random() * 3)],
                humidity: Math.floor(Math.random() * 30) + 50, // 50-80%
                city: city
            };

            return weatherData;
        } catch (error) {
            return {
                temperature: 25,
                condition: 'Sunny',
                humidity: 60,
                city: city
            };
        }
    }

    // Get current time
    getCurrentTime() {
        const now = new Date();
        const options = { 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit',
            hour12: true 
        };
        return now.toLocaleTimeString('en-US', options);
    }

    // Get date information
    getCurrentDate(lang = 'en') {
        const now = new Date();
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };

        if (lang === 'urdu') {
            return now.toLocaleDateString('ur-PK', options);
        }
        
        return now.toLocaleDateString('en-US', options);
    }
}

// Global instance
window.apiHandler = new ApiHandler();
