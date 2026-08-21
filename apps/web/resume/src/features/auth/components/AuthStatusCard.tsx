import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { sendVerificationEmailMutationOptions } from '../api/auth.options';
import { maskEmail, type AuthStatusView } from '../model/auth-status';

const RESEND_COOLDOWN_SECONDS = 60;

interface AuthStatusCardProps {
  view: AuthStatusView;
  email: string | null;
}

export function AuthStatusCard({ view, email }: AuthStatusCardProps) {
  const resendMutation = useMutation(sendVerificationEmailMutationOptions());
  const [cooldown, setCooldown] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setTimeout(() => setCooldown((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearTimeout(timer);
  }, [cooldown]);

  const handleResend = async () => {
    if (!email || cooldown > 0) return;
    setFeedback(null);
    try {
      await resendMutation.mutateAsync({ email });
      setCooldown(RESEND_COOLDOWN_SECONDS);
      setFeedback('验证邮件已重新发送，请检查收件箱。');
    } catch {
      setFeedback('邮件发送失败，请稍后重试。');
    }
  };

  const isSent = view.kind === 'sent';
  const isSuccess = view.kind === 'success';

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="items-center text-center">
        <div
          className={cn(
            'mb-3 flex size-14 items-center justify-center rounded-full text-2xl font-semibold',
            isSuccess ? 'bg-green-100 text-green-700' : isSent ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700',
          )}
          aria-hidden="true"
        ></div>
        <CardTitle className="text-xl">{view.title}</CardTitle>
        <CardDescription>{view.description}</CardDescription>
      </CardHeader>

      <CardContent className="text-center">
        {isSent && email && (
          <>
            <p className="font-medium text-foreground">{maskEmail(email)}</p>
            <p className="text-sm text-muted-foreground">如果没有收到邮件，请检查垃圾邮件或在倒计时结束后重新发送。</p>
          </>
        )}

        {isSent && !email && <p className="text-sm text-muted-foreground">当前页面没有待验证邮箱信息，请返回注册页重新提交。</p>}

        {feedback && (
          <p className={cn('text-sm', resendMutation.isError ? 'text-destructive' : 'text-green-700')} aria-live="polite">
            {feedback}
          </p>
        )}
      </CardContent>

      <CardFooter className="flex flex-col gap-2">
        {isSuccess && (
          <Link to="/login" className={cn(buttonVariants(), 'w-full')}>
            前往登录
          </Link>
        )}

        {isSent && email && (
          <Button className="w-full" type="button" variant="outline" disabled={resendMutation.isPending || cooldown > 0} onClick={handleResend}>
            {resendMutation.isPending ? '发送中…' : cooldown > 0 ? `${cooldown} 秒后可重新发送` : '重新发送验证邮件'}
          </Button>
        )}

        {isSent && !email && (
          <Link to="/register" className={cn(buttonVariants(), 'w-full')}>
            返回注册
          </Link>
        )}

        {!isSuccess && !isSent && (
          <>
            <Link to="/login" className={cn(buttonVariants(), 'w-full')}>
              返回登录
            </Link>
            {view.kind === 'error' && (
              <Link to="/register" className={cn(buttonVariants({ variant: 'outline' }), 'w-full')}>
                重新注册
              </Link>
            )}
          </>
        )}

        {isSent && (
          <Link to="/login" className={cn(buttonVariants({ variant: 'link' }), 'w-full')}>
            返回登录
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}
