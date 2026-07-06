import JwtService from "../services/jwt.service.js";
const jwtService = new JwtService();
export default function auth(req, res, next) {
  try {
    //read token from authorization
    const authHeader = req.headers.authorization;

    //check header exist
    if (!authHeader) {
      const error = new Error("Access denied. Token missing");
      error.status = 401;
      return next(error);
    }

    // Expected format:
    // Bearer TOKEN
    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0].toLowerCase() !== "bearer") {
      const error = new Error("Invalid token format");
      error.status = 401;
      return next(error);
    }

    const token = parts[1];

    const decode = jwtService.verifyAccessToken(token);

    req.user = decode;

    next();
  } catch (err) {
    const error = new Error("Invalid or expired token");
    error.status = 401;
    next(error);
  }
}
