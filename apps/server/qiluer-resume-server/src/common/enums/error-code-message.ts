import { ErrorCodeEnum } from '@qiluer-resume/dto';

/**
 * 业务错误码 → 默认消息映射
 * 调用方未传 message 时使用；message 由调用方传入时优先
 *
 * 本项目约定所有响应（含错误）HTTP 状态恒 200，鉴权 / 权限 / 资源不存在等通过 code 字段表达
 */
export const ERROR_CODE_MESSAGE_MAP: Record<ErrorCodeEnum, string> = {
  [ErrorCodeEnum.其他错误]: '服务异常，请稍后重试',
  [ErrorCodeEnum.参数校验失败]: '请求参数不合法',
  [ErrorCodeEnum.请求方法不被允许]: '请求方法不被允许',
  [ErrorCodeEnum.资源不存在]: '请求的资源不存在',
  [ErrorCodeEnum.请求过于频繁]: '请求过于频繁，请稍后重试',
  [ErrorCodeEnum.未登录]: '用户未登录',
  [ErrorCodeEnum.Token已过期]: '登录已过期，请重新登录',
  [ErrorCodeEnum.Token无效]: '登录凭证无效',
  [ErrorCodeEnum.无权限访问]: '无权限访问该资源',
  [ErrorCodeEnum.用户名或密码错误]: '用户名或密码错误',
  [ErrorCodeEnum.用户已存在]: '用户已存在',
  [ErrorCodeEnum.邮箱已被注册]: '邮箱已被注册',
  [ErrorCodeEnum.用户名已存在]: '用户名已被占用',
  [ErrorCodeEnum.用户不存在]: '用户不存在',
  [ErrorCodeEnum.邮箱未验证]: '邮箱尚未验证',
  [ErrorCodeEnum.邮箱或密码错误]: '邮箱或密码错误',
  [ErrorCodeEnum.服务内部错误]: '服务内部错误',
  [ErrorCodeEnum.数据库异常]: '数据库异常',
  [ErrorCodeEnum.第三方服务异常]: '第三方服务异常',
};
