let pendingVerificationEmail: string | null = null;

/** 保存当前 SPA 生命周期中的待验证邮箱；刷新页面后自然清空。 */
export function setPendingVerificationEmail(email: string): void {
  pendingVerificationEmail = email;
}

/** 读取当前 SPA 生命周期中的待验证邮箱。 */
export function getPendingVerificationEmail(): string | null {
  return pendingVerificationEmail;
}

/** 清理已经不再需要的待验证邮箱。 */
export function clearPendingVerificationEmail(): void {
  pendingVerificationEmail = null;
}
