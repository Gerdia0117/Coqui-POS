# 🐸 Coquito AI Assistant - Setup Guide

## What is Coquito?

Coquito is your intelligent POS training assistant built into Coqui POS. He helps employees and managers learn the system, provides customer service tips, and suggests strategies for success.

---

## ✅ Current Status: READY TO USE!

**Coquito works out of the box with built-in fallback responses!**

Even without OpenAI, Coquito can answer common questions about:
- Payment processing
- Kitchen operations
- Manager features
- Customer service
- Menu categories
- System strategies

---

## 🚀 Quick Start (No OpenAI Required)

### 1. Start Your System
```bash
bash ~/start-coqui-pos.sh
```

### 2. Access Coquito
- Click "🐸 AI Assistant" button in the header
- Ask Coquito anything!

### Example Questions:
```
"How do I process a payment?"
"What are good customer service tips?"
"How do I access the Sales Dashboard?"
"Tell me about the kitchen ticket system"
"How can I upsell to customers?"
```

---

## 🌟 Optional: Upgrade with OpenAI (Full AI Power)

Want Coquito to be even smarter? Enable OpenAI!

### Step 1: Install OpenAI Package
```bash
cd ~/Coqui-POS/backend
source venv/bin/activate
pip install openai
```

### Step 2: Get OpenAI API Key
1. Go to: https://platform.openai.com/api-keys
2. Sign up or login
3. Click "Create new secret key"
4. Copy your API key (sk-...)

### Step 3: Set Environment Variable

**Option A: Temporary (this session only)**
```bash
export OPENAI_API_KEY='your-api-key-here'
cd ~/Coqui-POS/backend
source venv/bin/activate
python app.py
```

**Option B: Permanent (recommended)**
```bash
# Add to your .bashrc
echo 'export OPENAI_API_KEY="your-api-key-here"' >> ~/.bashrc
source ~/.bashrc
```

**Option C: Create .env file**
```bash
# In backend directory
cd ~/Coqui-POS/backend
echo 'OPENAI_API_KEY=your-api-key-here' > .env

# Install python-dotenv
pip install python-dotenv

# Then modify app.py to load .env (optional)
```

### Step 4: Restart Backend
```bash
cd ~/Coqui-POS/backend
source venv/bin/activate
python app.py
```

You should see:
```
✅ OpenAI enabled! Coquito is fully powered.
```

---

## 🎯 What Coquito Knows

### 1. POS Operations
- Taking orders (add/remove items)
- Quantity adjustments
- Payment processing (Cash & Card)
- Tip calculations
- Kitchen ticket system
- Receipt printing

### 2. Manager Features
- Sales Dashboard access (password: admin123)
- Refund processing
- Void operations
- Menu Manager
- Void Log

### 3. Customer Service
- Greeting customers
- Explaining Puerto Rican dishes
- Suggesting pairings
- Upselling techniques
- Handling special requests

### 4. Efficiency Strategies
- Order workflow optimization
- Station organization
- Kitchen communication
- Time management

---

## 💡 Tips for Using Coquito

### Best Questions to Ask:
✅ "How do I...?"
✅ "What's the best way to...?"
✅ "Can you explain...?"
✅ "What are tips for...?"

### Examples:
```
"How do I void an item?"
"What's the best way to suggest desserts?"
"Can you explain the Sales Dashboard?"
"What are tips for busy lunch rushes?"
```

---

## 🐛 Troubleshooting

### Coquito says "having connection issues"
**Cause:** Backend is not running
**Fix:**
```bash
cd ~/Coqui-POS/backend
source venv/bin/activate
python app.py
```

### Using fallback responses instead of AI
**This is normal!** Fallback responses work great.

**Want full AI?** Follow "Upgrade with OpenAI" steps above.

### OpenAI API errors
**Check:**
1. API key is correct
2. API key is set in environment
3. You have OpenAI API credits
4. Restart backend after setting API key

---

## 📊 Coquito Features

### Built-in Fallback Responses
✅ Works without OpenAI
✅ Answers common questions
✅ Fast response times
✅ No API costs

### With OpenAI (Optional)
✅ Natural conversation
✅ Context-aware answers
✅ More detailed explanations
✅ Handles complex questions
✅ Remembers conversation context

---

## 🎬 Demo Coquito to Your Teacher

### Show Fallback Mode (Default):
1. Open AI Assistant
2. Ask: "How do I process a payment?"
3. Show Coquito's helpful response
4. Ask: "What are customer service tips?"
5. Demonstrate multiple questions

### Show With OpenAI (If Setup):
1. Ask complex questions
2. Show natural conversation
3. Demonstrate context awareness
4. Show detailed explanations

---

## 🔒 Security Notes

- Coquito runs through your backend
- OpenAI API key never exposed to frontend
- All requests authenticated
- Safe for production use

---

## 📁 Files Modified

**Backend:**
- `backend/app.py` - Added `/api/chat` endpoint
- `backend/requirements.txt` - Added `openai==1.12.0`

**Frontend:**
- `frontend/src/components/AIAssistant.jsx` - Coquito personality & backend integration
- `frontend/src/styles/main.css` - Avatar & typing indicator styles

---

## 💰 Cost Considerations

### Fallback Mode (Default):
- **Cost:** FREE
- **Limitations:** Pre-programmed responses only
- **Best for:** Demos, training, common questions

### OpenAI Mode:
- **Cost:** ~$0.002 per conversation (very cheap!)
- **Limitations:** Requires API key & credits
- **Best for:** Production, complex questions

**Recommendation for demo:** Use fallback mode (it's FREE and works great!)

---

## 🎓 Training Your Team with Coquito

### For New Employees:
```
"I'm new, how do I start taking orders?"
"How do I handle cash payments?"
"What should I say to customers?"
```

### For Managers:
```
"How do I access sales reports?"
"How do I process a refund?"
"What's the best way to train new staff?"
```

---

## 🚀 Next Steps

1. ✅ Test Coquito (fallback mode)
2. ⭐ Demo to your teacher
3. 💡 (Optional) Upgrade with OpenAI
4. 📚 Train your team to use Coquito

---

**Coquito is ready to help! 🐸✨**

Need help? Ask Coquito himself! 😊
