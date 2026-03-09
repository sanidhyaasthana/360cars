import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const db = new Database("cleancars360.db");
db.pragma('foreign_keys = OFF');

// Ensure images column exists
try {
  db.prepare("ALTER TABLE businesses ADD COLUMN images TEXT").run();
} catch (e) {}

// Initialize Database Schema
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    phone TEXT NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('SUPER_ADMIN', 'BUSINESS_OWNER', 'ADMIN', 'CUSTOMER')),
    car_type TEXT,
    car_category TEXT,
    car_model TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Seed Super Admin
  INSERT OR IGNORE INTO users (name, email, phone, password, role)
  VALUES ('Moad Kleap', 'moad.kleap@gmail.com', 'admin', '1989', 'SUPER_ADMIN');

  UPDATE users SET password = '1989', role = 'SUPER_ADMIN' WHERE email = 'moad.kleap@gmail.com';
  UPDATE users SET password = '1989', role = 'SUPER_ADMIN' WHERE phone = 'admin';
  UPDATE users SET email = 'moad.kleap@gmail.com' WHERE phone = 'admin';
  UPDATE users SET phone = 'admin' WHERE email = 'moad.kleap@gmail.com';

  CREATE TABLE IF NOT EXISTS businesses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    owner_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    center_name TEXT,
    tax_number TEXT,
    tax_certificate TEXT,
    commercial_registration TEXT,
    commercial_certificate TEXT,
    address TEXT,
    map_link TEXT,
    latitude REAL,
    longitude REAL,
    images TEXT,
    commission_rate REAL DEFAULT 0.1,
    opening_time TEXT DEFAULT '08:00',
    closing_time TEXT DEFAULT '23:00',
    status TEXT DEFAULT 'PENDING' CHECK(status IN ('PENDING', 'APPROVED', 'REJECTED')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    business_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    FOREIGN KEY (business_id) REFERENCES businesses(id)
  );

  CREATE TABLE IF NOT EXISTS pricing (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    service_id INTEGER NOT NULL,
    car_size TEXT NOT NULL CHECK(car_size IN ('SMALL', 'MEDIUM', 'SUV')),
    price REAL NOT NULL,
    FOREIGN KEY (service_id) REFERENCES services(id)
  );

  CREATE TABLE IF NOT EXISTS subscriptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    business_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    wash_count INTEGER, -- NULL for unlimited
    duration_days INTEGER NOT NULL,
    FOREIGN KEY (business_id) REFERENCES businesses(id)
  );

  CREATE TABLE IF NOT EXISTS user_subscriptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    subscription_id INTEGER NOT NULL,
    remaining_washes INTEGER,
    expires_at DATETIME NOT NULL,
    status TEXT DEFAULT 'ACTIVE',
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (subscription_id) REFERENCES subscriptions(id)
  );

  CREATE TABLE IF NOT EXISTS washes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    business_id INTEGER NOT NULL,
    customer_id INTEGER, -- Optional if customer is not registered
    customer_name TEXT,
    customer_phone TEXT,
    car_details TEXT,
    notes TEXT,
    code TEXT,
    service_id INTEGER,
    car_size TEXT,
    price REAL NOT NULL,
    discount_amount REAL DEFAULT 0,
    total_price REAL NOT NULL,
    payment_method TEXT, -- Can be NULL for pending requests
    status TEXT DEFAULT 'COMPLETED' CHECK(status IN ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')),
    commission_amount REAL DEFAULT 0,
    wash_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (business_id) REFERENCES businesses(id),
    FOREIGN KEY (customer_id) REFERENCES users(id),
    FOREIGN KEY (service_id) REFERENCES services(id)
  );

  CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    business_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    amount REAL NOT NULL,
    expense_type TEXT,
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (business_id) REFERENCES businesses(id)
  );

  CREATE TABLE IF NOT EXISTS invoices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    business_id INTEGER NOT NULL,
    customer_id INTEGER,
    total_amount REAL NOT NULL,
    status TEXT DEFAULT 'paid',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (business_id) REFERENCES businesses(id),
    FOREIGN KEY (customer_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS business_admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    business_id INTEGER NOT NULL,
    permissions TEXT, -- JSON array
    branch_ids TEXT, -- JSON array
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (business_id) REFERENCES businesses(id)
  );

  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    business_id INTEGER NOT NULL,
    customer_id INTEGER NOT NULL,
    service_id INTEGER NOT NULL,
    booking_date TEXT NOT NULL, -- YYYY-MM-DD
    time_slot TEXT NOT NULL,
    notes TEXT,
    booking_fee REAL DEFAULT 0,
    reminder_sent INTEGER DEFAULT 0,
    status TEXT DEFAULT 'PENDING' CHECK(status IN ('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (business_id) REFERENCES businesses(id),
    FOREIGN KEY (customer_id) REFERENCES users(id),
    FOREIGN KEY (service_id) REFERENCES services(id)
  );

  CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT,
    is_read INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    token TEXT UNIQUE NOT NULL,
    expires_at DATETIME NOT NULL,
    used INTEGER DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    center_id INTEGER NOT NULL,
    rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (center_id) REFERENCES businesses(id)
  );

  CREATE TABLE IF NOT EXISTS cars (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    year TEXT,
    plate_number TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS service_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER NOT NULL,
    center_id INTEGER NOT NULL,
    car_id INTEGER,
    service_ids TEXT,
    notes TEXT,
    status TEXT DEFAULT 'PENDING' CHECK(status IN ('PENDING', 'APPROVED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')),
    total_price REAL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES users(id),
    FOREIGN KEY (center_id) REFERENCES businesses(id),
    FOREIGN KEY (car_id) REFERENCES cars(id)
  );
`);

// Migration: Add columns if they don't exist
try { db.exec("ALTER TABLE users ADD COLUMN car_type TEXT;"); } catch (e) {}
try { db.exec("ALTER TABLE users ADD COLUMN car_category TEXT;"); } catch (e) {}
try { db.exec("ALTER TABLE users ADD COLUMN car_model TEXT;"); } catch (e) {}
try { db.exec("ALTER TABLE businesses ADD COLUMN tax_certificate TEXT;"); } catch (e) {}
try { db.exec("ALTER TABLE businesses ADD COLUMN commercial_certificate TEXT;"); } catch (e) {}
try { db.exec("ALTER TABLE businesses ADD COLUMN map_link TEXT;"); } catch (e) {}
try { db.exec("ALTER TABLE businesses ADD COLUMN images TEXT;"); } catch (e) {}
try { db.exec("ALTER TABLE businesses ADD COLUMN logo TEXT;"); } catch (e) {}
try { db.exec("ALTER TABLE businesses ADD COLUMN booking_fee REAL DEFAULT 0;"); } catch (e) {}
try { db.exec("ALTER TABLE businesses ADD COLUMN auto_confirm_bookings INTEGER DEFAULT 0;"); } catch (e) {}
try { db.exec("ALTER TABLE washes ADD COLUMN customer_name TEXT;"); } catch (e) {}
try { db.exec("ALTER TABLE washes ADD COLUMN customer_phone TEXT;"); } catch (e) {}
try { db.exec("ALTER TABLE washes ADD COLUMN car_details TEXT;"); } catch (e) {}
try { db.exec("ALTER TABLE washes ADD COLUMN wash_date DATETIME;"); } catch (e) {}

// Create business_images table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS business_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    business_id INTEGER NOT NULL,
    url TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (business_id) REFERENCES businesses(id)
  );
`);

// Migration to remove UNIQUE constraint from users.phone if it exists
try {
  const indexInfo = db.prepare("PRAGMA index_list(users)").all();
  let hasUniquePhone = false;
  
  for (const idx of indexInfo) {
    if (idx.unique === 1) {
      const cols = db.prepare(`PRAGMA index_info('${idx.name}')`).all();
      if (cols.some((c: any) => c.name === 'phone')) {
        hasUniquePhone = true;
        break;
      }
    }
  }
  
  if (hasUniquePhone) {
    console.log("Detected unique constraint on phone. Running migration...");
    db.exec(`
      ALTER TABLE users RENAME TO users_old;
      CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE,
        phone TEXT NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL CHECK(role IN ('SUPER_ADMIN', 'BUSINESS_OWNER', 'ADMIN', 'CUSTOMER')),
        car_type TEXT,
        car_category TEXT,
        car_model TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      INSERT INTO users (id, name, email, phone, password, role, car_type, car_category, car_model, created_at)
      SELECT id, name, email, phone, password, role, car_type, car_category, car_model, created_at FROM users_old;
      DROP TABLE users_old;
    `);
    console.log("Migration completed successfully.");
  }
} catch (e) {
  console.error("Migration error:", e);
}
try { db.exec("ALTER TABLE washes ADD COLUMN commission_amount REAL DEFAULT 0;"); } catch (e) {}
try { db.exec("ALTER TABLE washes ADD COLUMN status TEXT DEFAULT 'COMPLETED';"); } catch (e) {}
try { db.exec("ALTER TABLE washes ADD COLUMN discount_amount REAL DEFAULT 0;"); } catch (e) {}
try { db.exec("ALTER TABLE washes ADD COLUMN total_price REAL;"); } catch (e) {}
try { db.exec("ALTER TABLE bookings ADD COLUMN time_slot TEXT;"); } catch (e) {}
try { db.exec("ALTER TABLE bookings ADD COLUMN notes TEXT;"); } catch (e) {}
try { db.exec("ALTER TABLE bookings ADD COLUMN booking_fee REAL DEFAULT 0;"); } catch (e) {}
try { db.exec("ALTER TABLE bookings ADD COLUMN reminder_sent INTEGER DEFAULT 0;"); } catch (e) {}
try { db.exec("ALTER TABLE businesses ADD COLUMN latitude REAL;"); } catch (e) {}
try { db.exec("ALTER TABLE businesses ADD COLUMN longitude REAL;"); } catch (e) {}
try { db.exec("ALTER TABLE businesses ADD COLUMN opening_time TEXT DEFAULT '08:00';"); } catch (e) {}
try { db.exec("ALTER TABLE businesses ADD COLUMN closing_time TEXT DEFAULT '23:00';"); } catch (e) {}

function normalizePhone(phone: string | undefined): string {
  let p = (phone || '').trim();
  // Remove all spaces, dashes, parentheses
  p = p.replace(/[\s\-()]/g, '');
  // Convert +966 prefix to 0 prefix (Saudi format normalization)
  if (p.startsWith('+966')) {
    p = '0' + p.slice(4);
  } else if (p.startsWith('966') && p.length > 9) {
    p = '0' + p.slice(3);
  } else if (p.startsWith('00966')) {
    p = '0' + p.slice(5);
  }
  return p;
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  // Business Uploads
  app.post("/api/business/upload-logo", (req, res) => {
    const { businessId, logoUrl } = req.body;
    try {
      db.prepare("UPDATE businesses SET logo = ? WHERE id = ?").run(logoUrl, businessId);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Failed to update logo" });
    }
  });

  app.post("/api/business/upload-images", (req, res) => {
    const { businessId, imageUrls } = req.body; // imageUrls is an array
    try {
      // First clear existing images if needed, or just add new ones
      // The requirement says "up to 4 images"
      db.prepare("DELETE FROM business_images WHERE business_id = ?").run(businessId);
      const insert = db.prepare("INSERT INTO business_images (business_id, url) VALUES (?, ?)");
      for (const url of imageUrls.slice(0, 4)) {
        insert.run(businessId, url);
      }
      
      // Also update the businesses.images JSON field for convenience
      db.prepare("UPDATE businesses SET images = ? WHERE id = ?").run(JSON.stringify(imageUrls.slice(0, 4)), businessId);
      
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Failed to update images" });
    }
  });

  // Admin Search
  app.get("/api/admin/search", (req, res) => {
    const { query } = req.query;
    const q = `%${query}%`;
    
    try {
      const requests = db.prepare("SELECT * FROM businesses WHERE name LIKE ? OR center_name LIKE ?").all(q, q);
      const bookings = db.prepare(`
        SELECT b.*, u.name as customer_name, s.name as service_name 
        FROM bookings b
        JOIN users u ON b.customer_id = u.id
        JOIN services s ON b.service_id = s.id
        WHERE u.name LIKE ? OR s.name LIKE ? OR b.notes LIKE ?
      `).all(q, q, q);
      const customers = db.prepare("SELECT * FROM users WHERE role = 'CUSTOMER' AND (name LIKE ? OR phone LIKE ?)").all(q, q);
      const invoices = db.prepare("SELECT * FROM washes WHERE customer_name LIKE ? OR customer_phone LIKE ?").all(q, q);
      
      res.json({ requests, bookings, customers, invoices });
    } catch (err) {
      res.status(500).json({ error: "Search failed" });
    }
  });

  // Auth Routes (Simplified for demo)
  // --- CLEANUP LOGIC (One-time for fresh start) ---
  try {
    // Ensure settings table exists for tracking
    db.prepare("CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, val TEXT)").run();
    const cleanupDone = db.prepare("SELECT val FROM settings WHERE key = 'cleanup_fresh_start_v1'").get();
    
    if (!cleanupDone) {
      console.log("Performing requested data cleanup for a fresh start...");
      db.prepare("DELETE FROM users WHERE role != 'SUPER_ADMIN'").run();
      db.prepare("DELETE FROM businesses").run();
      db.prepare("DELETE FROM washes").run();
      db.prepare("DELETE FROM services").run();
      db.prepare("DELETE FROM business_admins").run();
      db.prepare("DELETE FROM bookings").run();
      db.prepare("DELETE FROM password_reset_tokens").run();
      
      db.prepare("INSERT OR REPLACE INTO settings (key, val) VALUES ('cleanup_fresh_start_v1', 'true')").run();
      console.log("Cleanup completed successfully.");
    }
  } catch (e) {
    console.error("Cleanup error:", e);
  }
  // -----------------------------------------------

  app.post("/api/auth/login", (req, res) => {
    const { phone, password, role, lang } = req.body;
    const isEn = lang === 'en';
    const trimmedPhone = normalizePhone(phone);
    const trimmedPassword = password?.trim();

    console.log("Login attempt for:", trimmedPhone, "Role:", role);

    // Support login by phone or email for super admin
    let user;
    if (role === 'SUPER_ADMIN' || trimmedPhone === 'admin') {
      user = db.prepare("SELECT * FROM users WHERE TRIM(phone) = ? OR email = ?").get(trimmedPhone, trimmedPhone);
    } else {
      // First check if the phone exists at all in the database
      const anyUser = db.prepare("SELECT * FROM users WHERE TRIM(phone) = ?").get(trimmedPhone);

      if (!anyUser) {
        console.log("User not found for:", trimmedPhone);
        return res.status(401).json({ error: isEn ? "Phone number not registered" : "الرقم غير مسجل" });
      }

      // If found but role doesn't match
      if (anyUser.role !== role) {
        console.log(`Role mismatch: User is ${anyUser.role}, trying to login as ${role}`);
        if (anyUser.role === 'BUSINESS_OWNER') {
          return res.status(401).json({ error: isEn ? "This number is registered as a business account, please login via the Business tab" : "هذا الرقم مسجل كحساب منشأة، يرجى تسجيل الدخول من خلال تبويب الأعمال" });
        } else if (anyUser.role === 'CUSTOMER') {
          return res.status(401).json({ error: isEn ? "This number is registered as a personal account, please login via the Personal tab" : "هذا الرقم مسجل كحساب أفراد، يرجى تسجيل الدخول من خلال تبويب الأفراد" });
        } else {
          return res.status(401).json({ error: isEn ? `This number is registered as a ${anyUser.role} account` : `هذا الرقم مسجل كحساب ${anyUser.role}` });
        }
      }

      user = anyUser;
    }

    if (user) {
      console.log(`User found: ${user.email || user.phone} (ID: ${user.id}), Role: ${user.role}`);
      if (user.password === trimmedPassword) {
        console.log("Password match for user:", user.email || user.phone);
        let business = null;
        if (user.role === 'BUSINESS_OWNER') {
          business = db.prepare("SELECT * FROM businesses WHERE owner_id = ?").get(user.id);
        }
        res.json({ user: { ...user, business } });
      } else {
        console.log(`Password mismatch for user: ${user.email || user.phone}`);
        res.status(401).json({ error: isEn ? "Incorrect password" : "كلمة المرور غير صحيحة" });
      }
    }
  });

  app.post("/api/auth/register", (req, res) => {
    console.log("Registration request received:", req.body);
      const {
        name, phone, password, role, lang,
        centerName, taxNumber, taxCertificate,
        commercialRegistration, commercialCertificate,
        carType, carModel, address
      } = req.body;
    const isEn = lang === 'en';
    const trimmedPhone = normalizePhone(phone);

    try {
      // Check if user with same phone exists in ANY role
      const existingUser = db.prepare("SELECT * FROM users WHERE TRIM(phone) = ?").get(trimmedPhone);
      if (existingUser) {
        if (existingUser.role === 'BUSINESS_OWNER') {
          return res.status(400).json({ error: isEn ? "This number is already registered as a business account, please login instead." : "هذا الرقم مسجل مسبقاً كحساب منشأة، يرجى تسجيل الدخول بدلاً من التسجيل." });
        } else if (existingUser.role === 'CUSTOMER') {
          return res.status(400).json({ error: isEn ? "This number is already registered as a personal account, please login instead." : "هذا الرقم مسجل مسبقاً كحساب أفراد، يرجى تسجيل الدخول بدلاً من التسجيل." });
        } else {
          return res.status(400).json({ error: isEn ? `This number is already registered as a ${existingUser.role} account.` : `هذا الرقم مسجل مسبقاً كحساب ${existingUser.role}.` });
        }
      }

      const insertUser = db.prepare("INSERT INTO users (name, phone, password, role, car_type, car_model) VALUES (?, ?, ?, ?, ?, ?)");
      const result = insertUser.run(
        name || '', 
        trimmedPhone || '', 
        password || '', 
        role || 'CUSTOMER', 
        carType || null, 
        carModel || null
      );
      const userId = result.lastInsertRowid;

      if (role === 'BUSINESS_OWNER') {
        console.log("Registering business for user:", userId);
        db.prepare("INSERT INTO businesses (owner_id, name, center_name, tax_number, tax_certificate, commercial_registration, commercial_certificate, address, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'PENDING')").run(
          userId,
          name || '',
          centerName || '',
          taxNumber || '',
          taxCertificate || '',
          commercialRegistration || '',
          commercialCertificate || '',
          address || ''
        );

        // Notify admin about new business registration
        const admins = db.prepare("SELECT id FROM users WHERE role = 'SUPER_ADMIN'").all();
        for (const admin of admins) {
          db.prepare("INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)").run(
            admin.id,
            'New Business Registration',
            `"${centerName || name}" has registered and is pending approval.`,
            'BUSINESS_PENDING'
          );
        }
      }

      const user = db.prepare("SELECT id, name, phone, role FROM users WHERE id = ?").get(userId);
      let business = null;
      if (role === 'BUSINESS_OWNER') {
        business = db.prepare("SELECT * FROM businesses WHERE owner_id = ?").get(userId);
      }
      console.log("Registration successful:", user);
      res.json({ user: { ...user, business } });
    } catch (e: any) {
      console.error("Registration error:", e.message);
      res.status(400).json({ error: e.message });
    }
  });

  app.post("/api/auth/forgot-password", (req, res) => {
    const { phone, lang } = req.body;
    const isEn = lang === 'en';
    const trimmedPhone = normalizePhone(phone);

    try {
      // Search by normalized phone OR by email, using the same users table as registration
      const user = db.prepare("SELECT * FROM users WHERE TRIM(phone) = ? OR email = ?").get(trimmedPhone, trimmedPhone);
      if (user) {
        const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString(); // 30 minutes

        db.prepare("INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES (?, ?, ?)").run(user.id, token, expiresAt);

        // In a real app, we would send an email here.
        // For this demo, we'll return the token so the UI can "simulate" the email.
        console.log(`[EMAIL SIMULATION] To: ${user.phone}, Subject: Reset Your Password, Link: /reset-password?token=${token}`);

        res.json({
          success: true,
          message: isEn ? "Reset link sent successfully" : "تم إرسال رابط إعادة التعيين بنجاح",
          debug_link: `/reset-password?token=${token}` // Only for demo purposes
        });
      } else {
        res.status(404).json({ error: isEn ? "User not found" : "المستخدم غير موجود" });
      }
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.post("/api/auth/reset-password", (req, res) => {
    const { token, newPassword } = req.body;

    try {
      const resetToken = db.prepare("SELECT * FROM password_reset_tokens WHERE token = ? AND used = 0").get(token) as any;

      if (!resetToken) {
        return res.status(400).json({ error: "Invalid or used token" });
      }

      if (new Date(resetToken.expires_at) < new Date()) {
        return res.status(400).json({ error: "Token expired" });
      }

      db.prepare("UPDATE users SET password = ? WHERE id = ?").run(newPassword, resetToken.user_id);
      db.prepare("UPDATE password_reset_tokens SET used = 1 WHERE id = ?").run(resetToken.id);

      res.json({ success: true, message: "Password updated successfully" });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  // Business Routes
  app.get("/api/businesses", (req, res) => {
    const businesses = db.prepare("SELECT * FROM businesses").all();
    res.json(businesses);
  });

  app.get("/api/my-business", (req, res) => {
    const ownerId = req.query.ownerId;
    const business = db.prepare("SELECT * FROM businesses WHERE owner_id = ?").get(ownerId);
    res.json(business);
  });

  app.get("/api/washes", (req, res) => {
    const { businessId } = req.query;
    if (businessId) {
      const washes = db.prepare(`
        SELECT w.*, s.name as service_name 
        FROM washes w
        LEFT JOIN services s ON w.service_id = s.id
        WHERE w.business_id = (SELECT id FROM businesses WHERE owner_id = ?)
        ORDER BY w.wash_date DESC
      `).all(businessId);
      res.json(washes);
    } else {
      res.json([]);
    }
  });

  app.post("/api/washes/add", (req, res) => {
    const { businessId, customerName, customerPhone, carDetails, serviceId, price, paymentMethod, washDate, notes, code } = req.body;
    try {
      const biz = db.prepare("SELECT id FROM businesses WHERE owner_id = ?").get(businessId);
      if (!biz) throw new Error("Business not found");

      // Find or create customer
      let customerId = null;
      if (customerPhone) {
        const existingUser = db.prepare("SELECT id FROM users WHERE TRIM(phone) = ?").get(customerPhone);
        if (existingUser) {
          customerId = existingUser.id;
        } else if (customerName) {
          // Create a guest user
          const result = db.prepare("INSERT INTO users (name, phone, password, role) VALUES (?, ?, ?, ?)").run(customerName, customerPhone, 'guest', 'CUSTOMER');
          customerId = result.lastInsertRowid;
        }
      }

      db.prepare(`
        INSERT INTO washes (business_id, customer_id, customer_name, customer_phone, car_details, service_id, price, payment_method, wash_date, notes, code)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(biz.id, customerId, customerName, customerPhone, carDetails, serviceId || null, price, paymentMethod, washDate, notes || null, code || null);
      
      // Create invoice
      db.prepare(`
        INSERT INTO invoices (business_id, customer_id, total_amount, status)
        VALUES (?, ?, ?, ?)
      `).run(biz.id, customerId, price, 'paid');

      res.json({ success: true });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.post("/api/expenses/add", (req, res) => {
    const { businessId, content, amount, expenseType, date } = req.body;
    try {
      const biz = db.prepare("SELECT id FROM businesses WHERE owner_id = ?").get(businessId);
      if (!biz) throw new Error("Business not found");

      db.prepare(`
        INSERT INTO expenses (business_id, content, amount, expense_type, date)
        VALUES (?, ?, ?, ?, ?)
      `).run(biz.id, content, amount, expenseType, date || new Date().toISOString());
      
      res.json({ success: true });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.get("/api/business/dashboard-stats", (req, res) => {
    const { ownerId } = req.query;
    try {
      const biz = db.prepare("SELECT id FROM businesses WHERE owner_id = ?").get(ownerId);
      if (!biz) throw new Error("Business not found");

      // Weekly Sales & Purchases
      const weeklyData = db.prepare(`
        SELECT 
          DATE(created_at) as date,
          SUM(total_amount) as sales
        FROM invoices
        WHERE business_id = ? AND created_at >= date('now', '-7 days')
        GROUP BY DATE(created_at)
      `).all(biz.id);

      const weeklyExpenses = db.prepare(`
        SELECT 
          DATE(date) as date,
          SUM(amount) as purchases
        FROM expenses
        WHERE business_id = ? AND date >= date('now', '-7 days')
        GROUP BY DATE(date)
      `).all(biz.id);

      // Top Customers
      const topCustomers = db.prepare(`
        SELECT 
          u.name,
          u.phone,
          COUNT(i.id) as washes,
          SUM(i.total_amount) as total
        FROM invoices i
        JOIN users u ON i.customer_id = u.id
        WHERE i.business_id = ?
        GROUP BY u.id
        ORDER BY total DESC
        LIMIT 5
      `).all(biz.id);

      // Daily Summaries
      const todaySales = db.prepare(`
        SELECT SUM(total_amount) as total, COUNT(*) as count 
        FROM invoices 
        WHERE business_id = ? AND DATE(created_at) = DATE('now')
      `).get(biz.id);

      const todayPurchases = db.prepare(`
        SELECT SUM(amount) as total, COUNT(*) as count 
        FROM expenses 
        WHERE business_id = ? AND DATE(date) = DATE('now')
      `).get(biz.id);

      res.json({
        weeklyData,
        weeklyExpenses,
        topCustomers,
        todaySales: todaySales || { total: 0, count: 0 },
        todayPurchases: todayPurchases || { total: 0, count: 0 }
      });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.post("/api/business/sync-branches", (req, res) => {
    const { ownerId, mainBranchId } = req.body;
    try {
      // Logic:
      // 1. Get all services from main branch
      // 2. For each other branch, delete its services and copy main branch's services
      console.log(`Syncing settings from branch ${mainBranchId} for owner ${ownerId}`);
      
      res.json({ success: true });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.get("/api/business/admins", (req, res) => {
    const { ownerId } = req.query;
    try {
      const biz = db.prepare("SELECT id FROM businesses WHERE owner_id = ?").get(ownerId);
      if (!biz) return res.json([]);

      const admins = db.prepare(`
        SELECT u.id, u.name, u.phone, u.phone as username, ba.permissions, ba.branch_ids
        FROM users u
        JOIN business_admins ba ON u.id = ba.user_id
        WHERE ba.business_id = ?
      `).all(biz.id);

      res.json(admins.map((a: any) => ({
        ...a,
        permissions: JSON.parse(a.permissions || '[]'),
        branchIds: JSON.parse(a.branch_ids || '[]'),
        role: 'ADMIN'
      })));
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.post("/api/business/admins/add", (req, res) => {
    const { ownerId, name, phone, password, permissions, branchIds } = req.body;
    try {
      const biz = db.prepare("SELECT id FROM businesses WHERE owner_id = ?").get(ownerId);
      if (!biz) throw new Error("Business not found");

      // Create or update user
      let userId;
      const existingUser = db.prepare("SELECT id FROM users WHERE TRIM(phone) = ?").get(phone);
      if (existingUser) {
        userId = existingUser.id;
        db.prepare("UPDATE users SET name = ?, password = ?, role = 'ADMIN' WHERE id = ?").run(name, password, userId);
      } else {
        const result = db.prepare("INSERT INTO users (name, phone, password, role) VALUES (?, ?, ?, ?)").run(name, phone, password, 'ADMIN');
        userId = result.lastInsertRowid;
      }

      // Create or update business_admin record
      const existingAdmin = db.prepare("SELECT id FROM business_admins WHERE user_id = ? AND business_id = ?").get(userId, biz.id);
      if (existingAdmin) {
        db.prepare("UPDATE business_admins SET permissions = ?, branch_ids = ? WHERE id = ?").run(JSON.stringify(permissions), JSON.stringify(branchIds), existingAdmin.id);
      } else {
        db.prepare("INSERT INTO business_admins (user_id, business_id, permissions, branch_ids) VALUES (?, ?, ?, ?)").run(userId, biz.id, JSON.stringify(permissions), JSON.stringify(branchIds));
      }

      res.json({ success: true });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.post("/api/business/admins/delete", (req, res) => {
    const { ownerId, userId } = req.body;
    try {
      const biz = db.prepare("SELECT id FROM businesses WHERE owner_id = ?").get(ownerId);
      if (!biz) throw new Error("Business not found");

      db.prepare("DELETE FROM business_admins WHERE user_id = ? AND business_id = ?").run(userId, biz.id);
      res.json({ success: true });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.post("/api/business/update", (req, res) => {
    const {
      ownerId, centerName, taxNumber, commercialRegistration, address, mapLink, name, username, phone, images,
      bookingFee, autoConfirmBookings, openingTime, closingTime, latitude, longitude
    } = req.body;

    try {
      const trimmedPhone = phone?.trim();
      // Update user info
      db.prepare("UPDATE users SET name = ?, phone = ? WHERE id = ?").run(name, trimmedPhone, ownerId);

      // Update business info
      db.prepare(`
        UPDATE businesses
        SET center_name = ?, tax_number = ?, commercial_registration = ?, address = ?, map_link = ?, images = ?,
            booking_fee = ?, auto_confirm_bookings = ?, opening_time = ?, closing_time = ?,
            latitude = ?, longitude = ?
        WHERE owner_id = ?
      `).run(
        centerName, taxNumber, commercialRegistration, address, mapLink,
        JSON.stringify(images || []),
        bookingFee || 0,
        autoConfirmBookings ? 1 : 0,
        openingTime || '08:00',
        closingTime || '23:00',
        latitude || null,
        longitude || null,
        ownerId
      );
      
      const updatedUser = db.prepare("SELECT * FROM users WHERE id = ?").get(ownerId);
      const updatedBusiness = db.prepare("SELECT * FROM businesses WHERE owner_id = ?").get(ownerId);
      
      res.json({ user: { ...updatedUser, business: updatedBusiness } });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  // Service Requests (On-site)
  app.post("/api/washes/request", (req, res) => {
    const { businessId, customerId, serviceId, carSize, price, notes, carDetails } = req.body;
    try {
      const result = db.prepare(`
        INSERT INTO washes (business_id, customer_id, service_id, car_size, price, total_price, notes, car_details, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'PENDING')
      `).run(businessId, customerId, serviceId, carSize, price, price, notes, carDetails);

      // Notify business owner
      const biz = db.prepare("SELECT owner_id, center_name FROM businesses WHERE id = ?").get(businessId);
      if (biz) {
        db.prepare(`
          INSERT INTO notifications (user_id, title, message, type)
          VALUES (?, ?, ?, ?)
        `).run(
          biz.owner_id, 
          "New Service Request", 
          `New request from customer for ${carDetails}`, 
          "REQUEST_NEW"
        );
      }

      res.json({ success: true, id: result.lastInsertRowid });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.get("/api/washes/active", (req, res) => {
    const { businessId } = req.query;
    try {
      const activeWashes = db.prepare(`
        SELECT w.*, s.name as service_name, u.name as customer_name_reg, u.phone as customer_phone_reg
        FROM washes w
        LEFT JOIN services s ON w.service_id = s.id
        LEFT JOIN users u ON w.customer_id = u.id
        WHERE w.business_id = ? AND w.status IN ('PENDING', 'IN_PROGRESS')
        ORDER BY w.created_at DESC
      `).all(businessId);
      res.json(activeWashes);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.post("/api/washes/update-status", (req, res) => {
    const { washId, status } = req.body;
    try {
      db.prepare("UPDATE washes SET status = ? WHERE id = ?").run(status, washId);
      
      // Notify customer
      const wash = db.prepare("SELECT customer_id, business_id FROM washes WHERE id = ?").get(washId);
      if (wash && wash.customer_id) {
        const biz = db.prepare("SELECT center_name FROM businesses WHERE id = ?").get(wash.business_id);
        db.prepare(`
          INSERT INTO notifications (user_id, title, message, type)
          VALUES (?, ?, ?, ?)
        `).run(
          wash.customer_id, 
          "Service Update", 
          `Your service at ${biz.center_name} is now ${status.replace('_', ' ').toLowerCase()}`, 
          "REQUEST_UPDATE"
        );
      }

      res.json({ success: true });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.post("/api/washes/complete-payment", (req, res) => {
    const { washId, discountAmount, paymentMethod, totalPrice } = req.body;
    try {
      db.prepare(`
        UPDATE washes 
        SET discount_amount = ?, payment_method = ?, total_price = ?, status = 'COMPLETED', wash_date = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(discountAmount, paymentMethod, totalPrice, washId);

      // Also create an invoice record for reports
      const wash = db.prepare("SELECT * FROM washes WHERE id = ?").get(washId);
      db.prepare(`
        INSERT INTO invoices (business_id, customer_id, total_amount, status)
        VALUES (?, ?, ?, 'paid')
      `).run(wash.business_id, wash.customer_id, totalPrice);

      res.json({ success: true });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  // Bookings (Scheduled)
  app.post("/api/bookings/create", (req, res) => {
    const { businessId, customerId, serviceId, bookingDate, timeSlot, notes } = req.body;
    try {
      const biz = db.prepare("SELECT booking_fee, auto_confirm_bookings, owner_id FROM businesses WHERE id = ?").get(businessId);
      const status = biz.auto_confirm_bookings ? 'CONFIRMED' : 'PENDING';
      
      const result = db.prepare(`
        INSERT INTO bookings (business_id, customer_id, service_id, booking_date, time_slot, notes, booking_fee, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(businessId, customerId, serviceId, bookingDate, timeSlot, notes, biz.booking_fee, status);

      // Notify business owner
      db.prepare(`
        INSERT INTO notifications (user_id, title, message, type)
        VALUES (?, ?, ?, ?)
      `).run(
        biz.owner_id, 
        "New Booking", 
        `New booking for ${bookingDate} at ${timeSlot}`, 
        "BOOKING_NEW"
      );

      res.json({ success: true, id: result.lastInsertRowid, status });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.get("/api/bookings/business", (req, res) => {
    const { businessId } = req.query;
    try {
      const bookings = db.prepare(`
        SELECT b.*, s.name as service_name, u.name as customer_name, u.phone as customer_phone
        FROM bookings b
        JOIN services s ON b.service_id = s.id
        JOIN users u ON b.customer_id = u.id
        WHERE b.business_id = ?
        ORDER BY b.booking_date ASC, b.time_slot ASC
      `).all(businessId);
      res.json(bookings);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.post("/api/bookings/update-status", (req, res) => {
    const { bookingId, status } = req.body;
    try {
      db.prepare("UPDATE bookings SET status = ? WHERE id = ?").run(status, bookingId);
      
      // Notify customer
      const booking = db.prepare("SELECT customer_id, business_id, booking_date, time_slot FROM bookings WHERE id = ?").get(bookingId);
      const biz = db.prepare("SELECT center_name FROM businesses WHERE id = ?").get(booking.business_id);
      
      db.prepare(`
        INSERT INTO notifications (user_id, title, message, type)
        VALUES (?, ?, ?, ?)
      `).run(
        booking.customer_id, 
        "Booking Update", 
        `Your booking at ${biz.center_name} for ${booking.booking_date} is now ${status.toLowerCase()}`, 
        "BOOKING_UPDATE"
      );

      res.json({ success: true });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  // Notifications
  app.get("/api/notifications", (req, res) => {
    const { userId } = req.query;
    try {
      const notifications = db.prepare(`
        SELECT * FROM notifications 
        WHERE user_id = ? 
        ORDER BY created_at DESC 
        LIMIT 50
      `).all(userId);
      res.json(notifications);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.post("/api/notifications/mark-read", (req, res) => {
    const { userId, notificationId } = req.body;
    try {
      if (notificationId) {
        db.prepare("UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?").run(notificationId, userId);
      } else {
        db.prepare("UPDATE notifications SET is_read = 1 WHERE user_id = ?").run(userId);
      }
      res.json({ success: true });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  // Super Admin Routes
  app.get("/api/business/details", (req, res) => {
    const { id } = req.query;
    try {
      const business = db.prepare("SELECT * FROM businesses WHERE id = ?").get(id);
      if (!business) throw new Error("Business not found");
      res.json({ business });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.get("/api/admin/stats", (req, res) => {
    const totalRevenue = db.prepare("SELECT SUM(price) as total FROM washes").get().total || 0;
    const totalWashes = db.prepare("SELECT COUNT(*) as count FROM washes").get().count || 0;
    const businessCount = db.prepare("SELECT COUNT(*) as count FROM businesses").get().count || 0;
    const customerCount = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'CUSTOMER'").get().count || 0;
    
    // Simulate active users for demo
    const activeUsers = Math.floor(Math.random() * 50) + 100;
    
    res.json({ 
      totalRevenue, 
      totalWashes, 
      businessCount, 
      customerCount,
      activeUsers,
      totalReceivables: totalRevenue * 1.2 // Mocking receivables
    });
  });

  app.get("/api/admin/businesses", (req, res) => {
    const businesses = db.prepare(`
      SELECT b.*, u.name as owner_name, u.phone as owner_phone, u.email as owner_email
      FROM businesses b
      JOIN users u ON b.owner_id = u.id
      ORDER BY b.created_at DESC
    `).all();
    res.json(businesses);
  });

  app.post("/api/admin/businesses/:id/status", (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // 'APPROVED' (Active) or 'REJECTED' (Inactive)
    try {
      db.prepare("UPDATE businesses SET status = ? WHERE id = ?").run(status, id);

      // Notify business owner
      const biz = db.prepare("SELECT owner_id, center_name FROM businesses WHERE id = ?").get(id);
      if (biz) {
        const title = status === 'APPROVED' ? 'Account Approved' : 'Account Rejected';
        const message = status === 'APPROVED'
          ? `Your business "${biz.center_name}" has been approved and is now active!`
          : `Your business "${biz.center_name}" has been rejected. Please contact support.`;
        db.prepare("INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)").run(biz.owner_id, title, message, 'BUSINESS_STATUS');
      }

      res.json({ success: true });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.get("/api/admin/financials", (req, res) => {
    const financials = db.prepare(`
      SELECT 
        b.id, b.center_name, b.name as business_name,
        SUM(w.price) as total_revenue,
        SUM(w.commission_amount) as total_commission,
        COUNT(w.id) as wash_count
      FROM businesses b
      LEFT JOIN washes w ON b.id = w.business_id
      GROUP BY b.id
    `).all();
    res.json(financials);
  });

  app.get("/api/admin/reports/:businessId", (req, res) => {
    const { businessId } = req.params;
    const reports = db.prepare(`
      SELECT w.*, s.name as service_name
      FROM washes w
      LEFT JOIN services s ON w.service_id = s.id
      WHERE w.business_id = ?
      ORDER BY w.wash_date DESC
    `).all(businessId);
    res.json(reports);
  });

  // === Reviews / Ratings ===
  app.get("/api/reviews/:centerId", (req, res) => {
    const { centerId } = req.params;
    try {
      const reviews = db.prepare(`
        SELECT r.*, u.name as user_name
        FROM reviews r
        JOIN users u ON r.user_id = u.id
        WHERE r.center_id = ?
        ORDER BY r.created_at DESC
      `).all(centerId);
      const avg = db.prepare("SELECT AVG(rating) as avg_rating, COUNT(*) as count FROM reviews WHERE center_id = ?").get(centerId);
      res.json({ reviews, avgRating: avg?.avg_rating || 0, count: avg?.count || 0 });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.post("/api/reviews", (req, res) => {
    const { userId, centerId, rating, comment } = req.body;
    try {
      db.prepare("INSERT INTO reviews (user_id, center_id, rating, comment) VALUES (?, ?, ?, ?)").run(userId, centerId, rating, comment || '');
      res.json({ success: true });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  // === Cars ===
  app.get("/api/cars", (req, res) => {
    const { userId } = req.query;
    try {
      const cars = db.prepare("SELECT * FROM cars WHERE user_id = ? ORDER BY created_at DESC").all(userId);
      res.json(cars);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.post("/api/cars", (req, res) => {
    const { userId, brand, model, year, plateNumber } = req.body;
    try {
      const result = db.prepare("INSERT INTO cars (user_id, brand, model, year, plate_number) VALUES (?, ?, ?, ?, ?)").run(userId, brand, model, year, plateNumber || '');
      res.json({ success: true, id: result.lastInsertRowid });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.delete("/api/cars/:id", (req, res) => {
    const { id } = req.params;
    try {
      db.prepare("DELETE FROM cars WHERE id = ?").run(id);
      res.json({ success: true });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  // === Service Requests ===
  app.post("/api/service-requests", (req, res) => {
    const { customerId, centerId, carId, serviceIds, notes } = req.body;
    try {
      const result = db.prepare(`
        INSERT INTO service_requests (customer_id, center_id, car_id, service_ids, notes, status)
        VALUES (?, ?, ?, ?, ?, 'PENDING')
      `).run(customerId, centerId, carId, JSON.stringify(serviceIds || []), notes || '');

      // Notify center owner
      const biz = db.prepare("SELECT owner_id, center_name FROM businesses WHERE id = ?").get(centerId);
      if (biz) {
        const customer = db.prepare("SELECT name FROM users WHERE id = ?").get(customerId);
        db.prepare(`
          INSERT INTO notifications (user_id, title, message, type)
          VALUES (?, ?, ?, ?)
        `).run(biz.owner_id, "New Service Request", `New request from ${customer?.name || 'Customer'}`, "SERVICE_REQUEST");
      }

      res.json({ success: true, id: result.lastInsertRowid });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.get("/api/service-requests", (req, res) => {
    const { centerId, customerId } = req.query;
    try {
      let requests;
      if (centerId) {
        requests = db.prepare(`
          SELECT sr.*, u.name as customer_name, u.phone as customer_phone, c.brand as car_brand, c.model as car_model
          FROM service_requests sr
          LEFT JOIN users u ON sr.customer_id = u.id
          LEFT JOIN cars c ON sr.car_id = c.id
          WHERE sr.center_id = ?
          ORDER BY sr.created_at DESC
        `).all(centerId);
      } else if (customerId) {
        requests = db.prepare(`
          SELECT sr.*, b.center_name, b.name as business_name
          FROM service_requests sr
          LEFT JOIN businesses b ON sr.center_id = b.id
          WHERE sr.customer_id = ?
          ORDER BY sr.created_at DESC
        `).all(customerId);
      } else {
        requests = [];
      }
      res.json(requests);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.post("/api/service-requests/:id/status", (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
      db.prepare("UPDATE service_requests SET status = ? WHERE id = ?").run(status, id);

      // Notify customer
      const sr = db.prepare("SELECT customer_id, center_id FROM service_requests WHERE id = ?").get(id);
      if (sr) {
        const biz = db.prepare("SELECT center_name FROM businesses WHERE id = ?").get(sr.center_id);
        db.prepare(`
          INSERT INTO notifications (user_id, title, message, type)
          VALUES (?, ?, ?, ?)
        `).run(sr.customer_id, "Service Update", `Your request at ${biz?.center_name} is now ${status.replace('_', ' ').toLowerCase()}`, "SERVICE_UPDATE");
      }

      // If completed, create invoice
      if (status === 'COMPLETED') {
        const sr2 = db.prepare("SELECT * FROM service_requests WHERE id = ?").get(id);
        if (sr2 && sr2.total_price > 0) {
          db.prepare("INSERT INTO invoices (business_id, customer_id, total_amount, status) VALUES (?, ?, ?, 'paid')").run(sr2.center_id, sr2.customer_id, sr2.total_price);
        }
      }

      res.json({ success: true });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  // === Business Approval Notifications ===
  app.get("/api/businesses/approved", (req, res) => {
    try {
      const businesses = db.prepare("SELECT * FROM businesses WHERE status = 'APPROVED'").all();
      res.json(businesses);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  // === Business Center Details with Rating ===
  app.get("/api/centers/:id", (req, res) => {
    const { id } = req.params;
    try {
      const center = db.prepare(`
        SELECT b.*, u.name as owner_name, u.phone as owner_phone
        FROM businesses b
        JOIN users u ON b.owner_id = u.id
        WHERE b.id = ?
      `).get(id);
      if (!center) return res.status(404).json({ error: "Center not found" });

      const rating = db.prepare("SELECT AVG(rating) as avg_rating, COUNT(*) as review_count FROM reviews WHERE center_id = ?").get(id);
      const services = db.prepare("SELECT s.*, p.car_size, p.price FROM services s LEFT JOIN pricing p ON s.id = p.service_id WHERE s.business_id = ?").all(id);

      res.json({
        ...center,
        avg_rating: rating?.avg_rating || 0,
        review_count: rating?.review_count || 0,
        services
      });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  // Booking Reminders Task (Runs every minute)
  setInterval(() => {
    try {
      const now = new Date();
      const bookings = db.prepare(`
        SELECT b.*, u.id as user_id, biz.center_name 
        FROM bookings b
        JOIN users u ON b.customer_id = u.id
        JOIN businesses biz ON b.business_id = biz.id
        WHERE b.status = 'CONFIRMED' AND b.reminder_sent < 2
      `).all();

      bookings.forEach((b: any) => {
        const bookingTime = new Date(`${b.booking_date}T${b.time_slot}`);
        const diffMs = bookingTime.getTime() - now.getTime();
        const diffHours = diffMs / (1000 * 60 * 60);

        let reminderType = 0;
        let title = "";
        let message = "";

        if (diffHours <= 2 && b.reminder_sent < 2) {
          reminderType = 2;
          title = "Booking Reminder (2h)";
          message = `Your booking at ${b.center_name} is in 2 hours (${b.time_slot}).`;
        } else if (diffHours <= 24 && b.reminder_sent < 1) {
          reminderType = 1;
          title = "Booking Reminder (24h)";
          message = `Your booking at ${b.center_name} is tomorrow at ${b.time_slot}.`;
        }

        if (reminderType > 0) {
          db.prepare("INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)").run(b.user_id, title, message, 'BOOKING_REMINDER');
          db.prepare("UPDATE bookings SET reminder_sent = ? WHERE id = ?").run(reminderType, b.id);
        }
      });
    } catch (e) {
      console.error("Reminder task error:", e);
    }
  }, 60000);

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
