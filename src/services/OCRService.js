export class OCRService {
  // Simulate advanced OCR processing
  static async processReceiptImage(file) {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
    
    try {
      // Simulate OCR confidence and quality assessment
      const imageQuality = this.assessImageQuality(file);
      
      if (imageQuality.score < 0.3) {
        throw new Error('Image quality too poor for processing');
      }
      
      // Generate realistic OCR results based on file characteristics
      const ocrResults = this.generateRealisticOCRResults(file, imageQuality);
      
      return {
        success: true,
        confidence: imageQuality.score,
        rawText: ocrResults.rawText,
        structuredData: ocrResults.structuredData,
        qualityMetrics: imageQuality,
        processingTime: Math.round(1500 + Math.random() * 1000)
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        confidence: 0,
        suggestions: this.getImprovementSuggestions()
      };
    }
  }

  static assessImageQuality(file) {
    // Simulate image quality assessment based on file characteristics
    const fileSize = file.size;
    const fileName = file.name.toLowerCase();
    
    let score = 0.5; // Base score
    
    // File size indicators
    if (fileSize > 1024 * 1024) score += 0.2; // Larger files usually better quality
    if (fileSize < 100 * 1024) score -= 0.3; // Very small files likely poor quality
    
    // File type indicators
    if (fileName.includes('scan')) score += 0.1;
    if (fileName.includes('photo')) score += 0.05;
    if (fileName.includes('receipt')) score += 0.1;
    
    // Add some randomness to simulate real-world variation
    score += (Math.random() - 0.5) * 0.3;
    
    // Ensure score is between 0 and 1
    score = Math.max(0, Math.min(1, score));
    
    return {
      score: Math.round(score * 100) / 100,
      resolution: score > 0.7 ? 'high' : score > 0.4 ? 'medium' : 'low',
      clarity: score > 0.6 ? 'clear' : score > 0.3 ? 'acceptable' : 'poor',
      lighting: score > 0.5 ? 'good' : 'poor',
      angle: score > 0.6 ? 'straight' : 'skewed'
    };
  }

  static generateRealisticOCRResults(file, imageQuality) {
    // Generate realistic receipt data based on image quality
    const stores = [
      'Walmart Supercenter', 'Target', 'Kroger', 'Safeway', 'Whole Foods Market',
      'CVS Pharmacy', 'Walgreens', 'Best Buy', 'Home Depot', 'Lowe\'s',
      'McDonald\'s', 'Starbucks', 'Subway', 'Shell', 'Exxon Mobil'
    ];
    
    const items = [
      { name: 'Milk 2% Gallon', price: 3.99, category: 'dairy' },
      { name: 'Bread Whole Wheat', price: 2.49, category: 'bakery' },
      { name: 'Bananas Organic', price: 1.99, category: 'produce' },
      { name: 'Chicken Breast', price: 8.99, category: 'meat' },
      { name: 'Greek Yogurt', price: 4.99, category: 'dairy' },
      { name: 'Apples Honeycrisp', price: 5.99, category: 'produce' },
      { name: 'Ground Coffee', price: 7.99, category: 'pantry' },
      { name: 'Pasta Spaghetti', price: 1.29, category: 'pantry' },
      { name: 'Tomatoes Roma', price: 2.99, category: 'produce' },
      { name: 'Eggs Large Grade A', price: 3.49, category: 'dairy' }
    ];
    
    // Select random store and items based on quality
    const selectedStore = stores[Math.floor(Math.random() * stores.length)];
    const numItems = Math.floor(Math.random() * 8) + 2; // 2-10 items
    const selectedItems = [];
    
    for (let i = 0; i < numItems; i++) {
      const item = items[Math.floor(Math.random() * items.length)];
      selectedItems.push({
        ...item,
        price: this.addPriceVariation(item.price, imageQuality.score)
      });
    }
    
    const subtotal = selectedItems.reduce((sum, item) => sum + item.price, 0);
    const taxRate = 0.0825; // 8.25% tax
    const tax = Math.round(subtotal * taxRate * 100) / 100;
    const total = Math.round((subtotal + tax) * 100) / 100;
    
    // Generate receipt date (within last 30 days)
    const receiptDate = new Date();
    receiptDate.setDate(receiptDate.getDate() - Math.floor(Math.random() * 30));
    
    // Generate raw text (simulated OCR output)
    const rawText = this.generateRawReceiptText(selectedStore, selectedItems, subtotal, tax, total, receiptDate);
    
    // Generate structured data
    const structuredData = {
      storeName: selectedStore,
      storeAddress: this.generateStoreAddress(),
      date: receiptDate.toISOString().split('T')[0],
      time: this.generateReceiptTime(),
      items: selectedItems,
      subtotal: Math.round(subtotal * 100) / 100,
      tax: tax,
      total: total,
      paymentMethod: this.getRandomPaymentMethod(),
      cashier: `Cashier ${Math.floor(Math.random() * 99) + 1}`,
      receiptNumber: this.generateReceiptNumber()
    };
    
    return { rawText, structuredData };
  }

  static addPriceVariation(basePrice, qualityScore) {
    // Lower quality images might have OCR errors in prices
    if (qualityScore < 0.5) {
      const variation = (Math.random() - 0.5) * 0.5; // ±$0.25 variation
      return Math.max(0.01, Math.round((basePrice + variation) * 100) / 100);
    }
    return basePrice;
  }

  static generateRawReceiptText(store, items, subtotal, tax, total, date) {
    let text = `${store}\n`;
    text += `${this.generateStoreAddress()}\n`;
    text += `Date: ${date.toLocaleDateString()}\n`;
    text += `Time: ${this.generateReceiptTime()}\n\n`;
    
    items.forEach(item => {
      text += `${item.name.padEnd(20)} $${item.price.toFixed(2)}\n`;
    });
    
    text += `\nSubtotal: $${subtotal.toFixed(2)}\n`;
    text += `Tax: $${tax.toFixed(2)}\n`;
    text += `Total: $${total.toFixed(2)}\n`;
    text += `\nThank you for shopping with us!\n`;
    
    return text;
  }

  static generateStoreAddress() {
    const addresses = [
      '123 Main St, Anytown, ST 12345',
      '456 Oak Ave, Springfield, ST 67890',
      '789 Pine Rd, Riverside, ST 54321',
      '321 Elm St, Madison, ST 98765'
    ];
    return addresses[Math.floor(Math.random() * addresses.length)];
  }

  static generateReceiptTime() {
    const hour = Math.floor(Math.random() * 12) + 8; // 8 AM to 8 PM
    const minute = Math.floor(Math.random() * 60);
    const ampm = hour < 12 ? 'AM' : 'PM';
    const displayHour = hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minute.toString().padStart(2, '0')} ${ampm}`;
  }

  static getRandomPaymentMethod() {
    const methods = ['Credit Card', 'Debit Card', 'Cash', 'Mobile Pay'];
    return methods[Math.floor(Math.random() * methods.length)];
  }

  static generateReceiptNumber() {
    return `RCP${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
  }

  static getImprovementSuggestions() {
    return [
      'Ensure receipt is well-lit and clearly visible',
      'Hold camera steady and avoid blurry images',
      'Capture the entire receipt including all text',
      'Avoid shadows and glare on the receipt',
      'Take photo straight-on, not at an angle'
    ];
  }
}