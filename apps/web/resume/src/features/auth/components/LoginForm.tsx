import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { loginUserAuthSchema, type LoginUserAuthType } from '@qiluer-resume/dto/schemas/user-auth';
import heroImage from '@assets/hero.png';
import { Button } from '@components/ui/button';
import { Card, CardContent } from '@components/ui/card';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldSeparator } from '@components/ui/field';
import { Input } from '@components/ui/input';
import { cn } from '@lib/utils';
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
    await loginMutation.mutateAsync(values);
    await queryClient.invalidateQueries({ queryKey: authKeys.session() });
    await GetSession.refetch();
    if (GetSession.data) onSuccess?.();
  });

  return (
    <div className={cn('flex w-full max-w-sm flex-col gap-6 md:max-w-4xl', className)}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={onSubmit} noValidate>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">欢迎回来</h1>
                <p className="text-sm text-balance text-muted-foreground">登录你的【柒陆贰简历】账号</p>
              </div>

              <Field data-invalid={Boolean(errors.email)}>
                <FieldLabel htmlFor="login-email">Email</FieldLabel>
                <Input
                  {...register('email')}
                  id="login-email"
                  type="email"
                  placeholder="name@example.com"
                  autoComplete="email"
                  aria-invalid={Boolean(errors.email)}
                />
                <FieldError id="login-email-error" errors={[errors.email]} />
              </Field>

              <Field data-invalid={Boolean(errors.password)}>
                <div className="flex items-center">
                  <FieldLabel htmlFor="login-password">密码</FieldLabel>
                  <span className="ml-auto cursor-default text-sm text-muted-foreground underline-offset-2" aria-disabled="true">
                    忘记密码？
                  </span>
                </div>
                <Input
                  {...register('password')}
                  id="login-password"
                  type="password"
                  autoComplete="current-password"
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={errors.password ? 'login-password-error' : undefined}
                />
                <FieldError id="login-password-error" errors={[errors.password]} />
              </Field>

              <Field>
                <Button type="submit" disabled={loginMutation.isPending}>
                  {loginMutation.isPending ? '登录中…' : '登录'}
                </Button>
              </Field>

              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">或使用其他方式登录</FieldSeparator>

              <Field className="grid grid-cols-2 gap-4">
                <Button variant="outline" type="button">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                      fill="currentColor"
                    />
                  </svg>
                  <span className="sr-only">使用 Apple 登录</span>
                </Button>
                <Button variant="outline" type="button">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  <span className="sr-only">使用 Google 登录</span>
                </Button>
              </Field>

              <FieldDescription className="text-center">
                还没有账号？ <Link to="/register">注册账号</Link>
              </FieldDescription>
            </FieldGroup>
          </form>

          <div className="relative hidden bg-muted md:block">
            <img
              src={heroImage}
              alt="简历编辑工作场景"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>

      <FieldDescription className="px-6 text-center">
        点击继续即表示你同意我们的 <span className="underline underline-offset-4">服务条款</span> 和
        <span className="underline underline-offset-4">隐私政策</span>。
      </FieldDescription>
    </div>
  );
}
