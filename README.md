# Website Schema Extractor Microservice

🚀 **Website Schema Extractor Microservice** is a lightweight **Fastify-based API** that extracts **JSON-LD structured data** (`schema.org`) from websites using **Puppeteer**.

## ✨ Features

- **Extracts JSON-LD structured data** from any public website.
- **Optimised for performance** with persistent Puppeteer instances.
- **Fastify-based API** with robust error handling.
- **Supports Docker** for easy deployment.

---

## 📦 Installation

### **1️⃣ Clone the Repository**

```sh
git clone https://github.com/cobrasphere/website-schema-extractor-microservice.git
cd website-schema-extractor-microservice
```

### **2️⃣ Install Dependencies (PNPM)**

```sh
pnpm install
```

---

## 🚀 Running the Microservice

### **1️⃣ Start with Fastify CLI**

```sh
pnpm start
```

### **2️⃣ Run with Docker**

```sh
docker compose up --build --wait
```

### **3️⃣ API Usage**

Make a GET request to extract schema.org data:

```sh
curl "http://localhost:3003/site-schema?url=https://cobrasphere.com"
```

📌 **Response Example**

```json
{
  "success": true,
  "url": "https://cobrasphere.com",
  "extracted": 1,
  "data": [
    {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebSite",
          "@id": "https://cobrasphere.com/en-gb/#website",
          "url": "https://cobrasphere.com/en-gb/",
          "name": "CobraSphere",
          "description": "Enterprise Cloud and Intelligent Edge",
          "publisher": {
            "@id": "https://cobrasphere.com/en-gb/#organization"
          },
          "potentialAction": [
            {
              "@type": "SearchAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://cobrasphere.com/en-gb/?s={search_term_string}"
              },
              "query-input": {
                "@type": "PropertyValueSpecification",
                "valueRequired": true,
                "valueName": "search_term_string"
              }
            }
          ],
          "inLanguage": "en-GB"
        },
        {
          "@type": "Organization",
          "@id": "https://cobrasphere.com/en-gb/#organization",
          "name": "CobraSphere",
          "url": "https://cobrasphere.com/en-gb/",
          "sameAs": [
            "https://x.com/cobrasphere",
            "https://www.linkedin.com/company/cobrasphere"
          ]
        }
      ]
    }
  ]
}
```

---

## 🛠 Deployment Options

### **1️⃣ Run in Docker**

```sh
docker build -t website-schema-extractor .
docker run -p 3003:3003 website-schema-extractor
```

### **2️⃣ Deploy to Cloud Run**

```sh
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/website-schema-extractor
gcloud run deploy website-schema-extractor --image gcr.io/YOUR_PROJECT_ID/website-schema-extractor --platform managed --allow-unauthenticated
```

---

## 🤝 Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a new branch (`git checkout -b feature-branch`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to your branch (`git push origin feature-branch`)
5. Open a Pull Request 🚀
