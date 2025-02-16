const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY; // استخدم نفس المفتاح السري

// ميدلوير للتحقق من صلاحيات الأدمن
const verifyAdmin = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; // استخراج التوكن من الهيدر
  if (!token) return res.status(401).json({ message: "توكن غير موجود" });

  try {
    // فك التوكن والتحقق منه
    const decoded = jwt.verify(token, SECRET_KEY);
    
    // التحقق من كون المستخدم أدمن
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "أنت لست أدمن" });
    }

    req.user = decoded; // حفظ بيانات المستخدم في الـ request
    next(); // السماح بالوصول إلى المسار المحمي
  } catch (error) {
    res.status(400).json({ message: "التوكن غير صالح" });
  }
};

module.exports = { verifyAdmin };
