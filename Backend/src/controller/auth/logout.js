export default function logout(req, res) {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  return res.status(200).json({
    ok: true,
    message: "Logout successful",
  });
}