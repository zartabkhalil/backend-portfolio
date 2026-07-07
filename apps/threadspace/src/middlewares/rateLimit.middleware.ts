import rateLimit from "express-rate-limit";

//General API limiter

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, //15min
  limit: 100,
  standardHeaders: true,
  legacyHeaders: true,
  message: {
    success: false,
    message: "Too many requests, please try again later",
  },
});

// Auth limiter (strict)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min

  limit: 10,

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    success: false,
    message: "Too many login attempts, try again later",
  },
});

export const refreshTokenLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min

  limit: 50,

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    success: false,
    message: "Too many  Refresh attempts, try again later",
  },
});
