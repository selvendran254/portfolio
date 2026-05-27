const BLOG_POSTS = [
  {
    id: 'iot-home',
    title: 'Smart Home Automation with ESP8266',
    date: '2025-08-12',
    tag: 'IoT',
    excerpt: 'How I built a phone-controlled smart home system using ESP8266, relays and a web dashboard.',
    body: 'This project connects ESP8266 modules to home appliances through relay modules. Users can control lights and fans from a mobile-friendly web interface. Key learnings: WiFi provisioning, MQTT-style messaging, and safe AC switching with optocouplers.'
  },
  {
    id: 'rfid-lib',
    title: 'Library Automation Using RFID',
    date: '2025-06-03',
    tag: 'Embedded',
    excerpt: 'RFID-based book checkout system with Arduino and database logging.',
    body: 'Each book tag is mapped to an ID in software. When a card is scanned, the system logs borrow/return events and shows status on an LCD. This reduced manual entry work in a college library demo setup.'
  },
  {
    id: 'devops-path',
    title: 'From Embedded to DevOps Security',
    date: '2026-03-01',
    tag: 'Career',
    excerpt: 'Notes from my DevOps Security Trainee internship at One27 Educational Services.',
    body: 'Learning Linux administration, basic CI/CD pipelines, and security fundamentals alongside embedded projects. The goal is to combine hardware knowledge with secure deployment practices for IoT products.'
  }
];
