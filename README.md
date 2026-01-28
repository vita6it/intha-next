# Intha - NEXT Landing Page

เว็บไซต์ Landing Page พรรคสภานักเรียน "Intha – NEXT" เบอร์ 1

## โครงสร้างโปรเจกต์

```
INTHA-NEXT/
│
├── index.html              # หน้าหลักของเว็บไซต์
│
├── assets/                 # โฟลเดอร์รวม Asset ทั้งหมด
│   ├── css/
│   │   └── style.css      # ไฟล์ CSS หลัก
│   │
│   ├── js/
│   │   └── script.js      # ไฟล์ JavaScript หลัก
│   │
│   ├── images/            # รูปภาพทั้งหมด
│   │   ├── hero_students.png
│   │   ├── activity_meeting.png
│   │   ├── member_leader.png
│   │   ├── member_vp_girl.png
│   │   └── member_vp_boy.png
│   │
│   └── icons/             # ไอคอนต่าง ๆ (ถ้ามี)
│
└── README.md              # ไฟล์นี้
```

## ฟีเจอร์หลัก

### 1. Hero Section
- ชื่อพรรคขนาดใหญ่พร้อมหมายเลข 1
- ข้อความรองและปุ่ม Call-to-Action
- รูปภาพกลุ่มนักเรียน

### 2. Vision Section
- วิสัยทัศน์และเป้าหมายของพรรค
- รูปภาพกิจกรรม

### 3. Policies Section
- นโยบายหลัก 5 ข้อ
- การ์ดแบบ Interactive พร้อม Hover Effect

### 4. Members Section
- **Leader Card**: การ์ดประธานขนาดใหญ่พร้อม Quote และ Instagram
- **Team Cards**: การ์ดสมาชิกทีมที่มีขนาดเหมาะสม ประกอบด้วย:
  - รูปโปรไฟล์
  - ชื่อและตำแหน่ง
  - คำอธิบายสั้น ๆ
  - ปุ่ม Instagram พร้อม Username

### 5. Call to Action
- ส่วนเชิญชวนให้เลือกพรรค

### 6. Footer
- ข้อมูลติดต่อและ Social Media

## การใช้งาน

### เปิดเว็บไซต์
เพียงแค่เปิดไฟล์ `index.html` ด้วย Web Browser

### เพิ่มสมาชิกใหม่ (ผ่าน JavaScript)

ใช้ฟังก์ชัน `AddCard()` ใน Console:

```javascript
AddCard({
    name: "ชื่อ-นามสกุล",
    role: "ตำแหน่ง",
    description: "คำอธิบายสั้น ๆ",
    img: "path/to/image.png",
    instagram: "@username"
});
```

## เทคโนโลยีที่ใช้

- **HTML5**: โครงสร้างหน้าเว็บ
- **CSS3**: การออกแบบและ Animation
- **JavaScript (Vanilla)**: ฟังก์ชันการทำงาน
- **Font Awesome 6**: ไอคอน
- **Google Fonts (Prompt)**: ฟอนต์ภาษาไทย

## โทนสีหลัก

- **Primary Blue**: #2563EB
- **Dark Blue**: #1E3A8A
- **Accent Gold**: #FACC15
- **White**: #FFFFFF
- **Light Background**: #EFF6FF

## Responsive Design

เว็บไซต์รองรับการแสดงผลบน:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

## การปรับแต่ง

### แก้ไขสี
แก้ไขใน `assets/css/style.css` ที่ส่วน `:root`

### แก้ไขข้อมูลสมาชิก
แก้ไขใน `assets/js/script.js` ที่ตัวแปร `initialMembers`

### แก้ไขเนื้อหา
แก้ไขใน `index.html`

---

**พัฒนาโดย**: Intha - NEXT Team  
**เวอร์ชัน**: 1.0  
**ปีที่สร้าง**: 2024
