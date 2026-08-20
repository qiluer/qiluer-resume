import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { loginUserAuthSchema, type LoginUserAuthType } from '@qiluer-resume/dto/schemas/user-auth';
import { cn } from '@lib/utils/cn';
import { authKeys, loginMutationOptions, sessionOptions } from '../api/auth.options';

interface LoginFormProps {
  onSuccess?: () => void;
  className?: string;
}

export function LoginForm({ onSuccess, className }: LoginFormProps) {
  const queryClient = useQueryClient();
  const loginMutation = useMutation(loginMutationOptions());
  const GetSession = useQuery({
    ...sessionOptions(),
    staleTime: 0,
    enabled: false,
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginUserAuthType>({
    resolver: zodResolver(loginUserAuthSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await loginMutation.mutateAsync(values);
      await queryClient.invalidateQueries({ queryKey: authKeys.session() });
      await GetSession.refetch();
      if (GetSession.data) onSuccess?.();
    } catch {
      // MutationCache 已统一处理并转交错误 Presenter。
    }
  });

  return (
    <form
      className={cn('mx-auto flex w-full max-w-sm flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm', className)}
      onSubmit={onSubmit}
      noValidate
    >
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">登录</h1>
        <p className="text-sm text-gray-500">使用账号密码登录</p>
      </header>

      <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
        邮箱
        <input
          {...register('email')}
          type="email"
          autoComplete="email"
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900"
          aria-invalid={Boolean(errors.email)}
        />
        {errors.email && <span className="text-sm text-red-600">{errors.email.message}</span>}
      </label>

      <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
        密码
        <input
          {...register('password')}
          type="password"
          autoComplete="current-password"
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900"
          aria-invalid={Boolean(errors.password)}
        />
        {errors.password && <span className="text-sm text-red-600">{errors.password.message}</span>}
      </label>

      <button
        type="submit"
        disabled={loginMutation.isPending}
        className={cn(
          'rounded-md bg-brand px-4 py-2 text-sm font-medium text-white transition',
          'hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-60',
        )}
      >
        {loginMutation.isPending ? '登录中…' : '登录'}
      </button>
    </form>
  );
}
