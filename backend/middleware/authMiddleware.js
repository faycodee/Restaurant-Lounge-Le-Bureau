const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY; 

// ميدلوير للتحقق من صلاحيات الأدمن
const verifyAdmin = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; 
  if (!token) return res.status(401).json({ message: "توكن غير موجود" });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    
   
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "أنت لست أدمن" });
    }

    req.user = decoded; 
    next(); 
  } catch (error) {
    res.status(400).json({ message: "التوكن غير صالح" });
  }
};

module.exports = { verifyAdmin };
