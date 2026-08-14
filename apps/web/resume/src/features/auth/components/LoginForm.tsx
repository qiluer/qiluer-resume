import { cn } from '@lib/utils/cn';

interface LoginFormProps {
  onSuccess?: () => void;
  className?: string;
}

export function LoginForm({ onSuccess, className }: LoginFormProps) {
  return (
    <form className={cn('mx-auto flex w-full max-w-sm flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm', className)}>
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">登录</h1>
        <p className="text-sm text-gray-500">使用账号密码登录 qiluer-resume</p>
      </header>

      <button
        type="submit"
        className={cn(
          'rounded-md bg-brand px-4 py-2 text-sm font-medium text-white transition',
          'hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-60',
        )}
        onClick={() => onSuccess?.()}
      >
        登录
      </button>
    </form>
  );
}
